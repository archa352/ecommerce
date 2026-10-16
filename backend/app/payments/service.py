from __future__ import annotations

import json
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import (
    AuthenticationError,
    ConflictError,
    NotFoundError,
    ServiceUnavailableError,
    ValidationError,
)
from app.core.logging import get_logger
from app.core.pagination import PageParams
from app.orders.constants import OrderStatus
from app.orders.constants import PaymentStatus as OrderPaymentStatus
from app.orders.models import Order
from app.orders.repository import OrderRepository
from app.payments import razorpay
from app.payments.constants import PaymentStatus
from app.payments.models import Payment
from app.payments.repository import PaymentRepository
from app.tenants.models import Tenant

logger = get_logger("payments")

PAYMENT_NOT_FOUND = "Payment not found"
ORDER_NOT_FOUND = "Order not found"
WEBHOOK_UNAVAILABLE = "Payment webhooks are not configured"

PAID_EVENTS = frozenset({"payment.captured", "order.paid"})
PAYMENT_FAILED_EVENT = "payment.failed"
REFUND_PROCESSED_EVENT = "refund.processed"
REFUND_FAILED_EVENT = "refund.failed"
REFUND_PROCESSED = "processed"
GATEWAY_CAPTURED = "captured"


class PaymentService:
    """Payments scoped to one tenant: reads, Razorpay confirmations, webhooks and refunds."""

    def __init__(self, session: AsyncSession, tenant_id: UUID) -> None:
        self.session = session
        self.tenant_id = tenant_id
        self.payments = PaymentRepository(session, tenant_id)
        self.orders = OrderRepository(session, tenant_id)

    async def get(self, payment_id: UUID) -> Payment:
        """Admin lookup: any payment in this tenant."""
        payment = await self.payments.get(payment_id)
        if payment is None:
            raise NotFoundError(PAYMENT_NOT_FOUND)
        return payment

    async def get_for_customer(self, customer_id: UUID, payment_id: UUID) -> Payment:
        """Fetch a payment on one of the customer's own orders."""
        payment = await self.get(payment_id)

        order = await self.orders.get_for_customer(customer_id, payment.order_id)
        if order is None:
            raise NotFoundError(PAYMENT_NOT_FOUND)

        return payment

    async def list(
        self,
        params: PageParams,
        *,
        order_id: UUID | None = None,
        status: PaymentStatus | None = None,
    ) -> tuple[list[Payment], int]:
        stmt = self.payments.list_select(order_id=order_id, status=status)
        rows, total = await self.payments.paginate(stmt, params)
        return list(rows), total

    async def start_online_payment(
        self, order_id: UUID, customer_id: UUID, currency: str
    ) -> Payment:
        """Create or reuse the Razorpay order for a pending checkout."""
        try:
            order = await self.orders.get_for_customer_for_update(customer_id, order_id)
            if order is None:
                raise NotFoundError("Order not found")
            payment = await self.payments.get_razorpay_payment_for_update(order.id)
            if payment is None:
                raise ConflictError("Online payment record not found")
            if order.status not in {OrderStatus.PENDING.value, OrderStatus.CONFIRMED.value}:
                raise ConflictError("This order can no longer accept payment")
            if (
                payment.status != PaymentStatus.PENDING.value
                or order.payment_status != OrderPaymentStatus.PENDING.value
            ):
                raise ConflictError("This payment is no longer pending")
            if payment.razorpay_order_id is not None:
                await self.session.commit()
                return payment
            if payment.razorpay_order_creation_started:
                raise ConflictError(
                    "Razorpay order creation may have succeeded, but its response was not "
                    "saved. Automatic retry is blocked; reconcile this payment with the store."
                )

            # Razorpay's configured Orders API call has no supported
            # idempotency/reconciliation mechanism in this adapter. Persist a
            # one-way marker before the network call so an ambiguous timeout
            # cannot cause a second gateway order on the next request.
            payment.razorpay_order_creation_started = True
            await self.session.commit()

            gateway_order_id = await razorpay.create_order(
                payment.amount, currency, order.order_number
            )
            payment.razorpay_order_id = gateway_order_id
            await self.session.commit()
            return payment
        except Exception:
            await self.session.rollback()
            raise

    async def verify_razorpay_payment(
        self,
        customer_id: UUID,
        *,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
        currency: str,
    ) -> Payment:
        """Verify signed callback and authoritative gateway payment details."""
        if not razorpay.signature_is_valid(
            razorpay_order_id, razorpay_payment_id, razorpay_signature
        ):
            raise ValidationError("Invalid Razorpay payment signature")

        payment = await self.payments.get_by_razorpay_order_id(razorpay_order_id)
        if payment is None:
            raise NotFoundError(PAYMENT_NOT_FOUND)

        try:
            order = await self.orders.get_for_customer_for_update(
                customer_id, payment.order_id
            )
            if order is None:
                raise NotFoundError(PAYMENT_NOT_FOUND)
            payment = await self.payments.get_razorpay_payment_for_update(
                order.id, razorpay_order_id
            )
            if payment is None:
                raise NotFoundError(PAYMENT_NOT_FOUND)

            if payment.status == PaymentStatus.PAID.value:
                if payment.razorpay_payment_id == razorpay_payment_id:
                    await self.session.commit()
                    return payment
                raise ConflictError(
                    "A different payment has already completed this order"
                )
            if not _can_record_capture(order, payment):
                raise ConflictError("This order is not awaiting payment")

            details = await razorpay.fetch_payment(razorpay_payment_id)
            expected_amount = razorpay.to_subunits(payment.amount)
            if details.get("id") != razorpay_payment_id:
                raise ValidationError("Razorpay payment ID does not match")
            if details.get("order_id") != razorpay_order_id:
                raise ValidationError("Razorpay order ID does not match")
            gateway_amount = details.get("amount")
            if (
                isinstance(gateway_amount, bool)
                or not isinstance(gateway_amount, int)
                or gateway_amount != expected_amount
            ):
                raise ValidationError("Razorpay payment amount does not match")
            if details.get("currency") != currency:
                raise ValidationError("Razorpay payment currency does not match")
            if (
                details.get("status") != "captured"
                or details.get("captured") is not True
            ):
                raise ValidationError("Razorpay payment has not been captured")
            if await self.payments.razorpay_payment_id_exists(razorpay_payment_id):
                raise ConflictError("Razorpay payment ID has already been used")

            self._mark_paid(payment, order, razorpay_payment_id, source="verify")
            await self.session.commit()
            return payment
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError("Razorpay payment has already been recorded") from exc
        except Exception:
            await self.session.rollback()
            raise

    async def refund(self, order_id: UUID) -> Order:
        """Refund a cancelled order's captured Razorpay payment in full, once."""
        try:
            order = await self.orders.lock(order_id)
            if order is None:
                raise NotFoundError(ORDER_NOT_FOUND)
            if order.status != OrderStatus.CANCELLED.value:
                raise ConflictError(
                    "Only a cancelled order can be refunded", error_code="REFUND_NOT_ALLOWED"
                )

            payment = await self.payments.get_razorpay_payment_for_update(order.id)
            if payment is None or payment.status != PaymentStatus.PAID.value:
                raise ConflictError(
                    "This order has no captured online payment to refund",
                    error_code="REFUND_NOT_ALLOWED",
                )
            if payment.razorpay_refund_id is not None:
                raise ConflictError(
                    "A refund has already been requested for this order",
                    error_code="REFUND_ALREADY_REQUESTED",
                )

            refund_id, refund_status = await razorpay.create_refund(
                payment_id=payment.razorpay_payment_id,
                amount=payment.amount,
                receipt=order.order_number,
            )
            payment.razorpay_refund_id = refund_id
            if refund_status == REFUND_PROCESSED:
                _mark_refunded(payment, order)
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise

        logger.info(
            "payments.refund_requested order_number=%s tenant_id=%s refund_status=%s",
            order.order_number,
            self.tenant_id,
            refund_status,
        )
        return await self._order(order.id)

    async def apply_paid_event(self, name: str, entity: dict[str, Any], currency: str) -> str:
        """Record a payment Razorpay reports captured, if it matches what is owed."""
        gateway_order_id = entity.get("order_id")
        gateway_payment_id = entity.get("id")
        if not isinstance(gateway_order_id, str) or not isinstance(gateway_payment_id, str):
            logger.warning("payments.webhook_incomplete event=%s", name)
            return "ignored"

        found = await self.payments.get_by_razorpay_order_id(gateway_order_id)
        if found is None:
            return "ignored"

        try:
            order = await self.orders.lock(found.order_id)
            payment = await self.payments.get_razorpay_payment_for_update(
                found.order_id, gateway_order_id
            )
            if order is None or payment is None:
                await self.session.rollback()
                return "ignored"

            if payment.status in (PaymentStatus.PAID.value, PaymentStatus.REFUNDED.value):
                if payment.razorpay_payment_id != gateway_payment_id:
                    logger.warning(
                        "payments.second_capture payment_id=%s gateway_payment_id=%s",
                        payment.id,
                        gateway_payment_id,
                    )
                await self.session.rollback()
                return "processed"

            amount = entity.get("amount")
            if (
                entity.get("status") != GATEWAY_CAPTURED
                or isinstance(amount, bool)
                or amount != razorpay.to_subunits(payment.amount)
                or entity.get("currency") != currency
                or not _can_record_capture(order, payment)
                or await self.payments.razorpay_payment_id_exists(gateway_payment_id)
            ):
                logger.error(
                    "payments.webhook_not_applied payment_id=%s event=%s amount=%s %s",
                    payment.id,
                    name,
                    amount,
                    entity.get("currency"),
                )
                await self.session.rollback()
                return "ignored"

            self._mark_paid(payment, order, gateway_payment_id, source=name)
            await self.session.commit()
            return "processed"
        except IntegrityError:
            await self.session.rollback()
            return "ignored"
        except Exception:
            await self.session.rollback()
            raise

    async def apply_refund_event(self, name: str, entity: dict[str, Any], currency: str) -> str:
        """Settle or reopen a refund; matched by payment so dashboard refunds count too."""
        refund_id = entity.get("id")
        gateway_payment_id = entity.get("payment_id")
        if not isinstance(refund_id, str) or not isinstance(gateway_payment_id, str):
            logger.warning("payments.webhook_incomplete event=%s", name)
            return "ignored"

        found = await self.payments.find_one(Payment.razorpay_payment_id == gateway_payment_id)
        if found is None:
            return "ignored"

        try:
            order = await self.orders.lock(found.order_id)
            payment = await self.payments.get_razorpay_payment_for_update(found.order_id)
            if order is None or payment is None or payment.id != found.id:
                await self.session.rollback()
                return "ignored"

            if name == REFUND_PROCESSED_EVENT:
                amount = entity.get("amount")
                if (
                    isinstance(amount, bool)
                    or amount != razorpay.to_subunits(payment.amount)
                    or entity.get("currency") != currency
                ):
                    logger.error(
                        "payments.partial_refund_not_recorded "
                        "order_number=%s refund_id=%s amount=%s",
                        order.order_number,
                        refund_id,
                        amount,
                    )
                    await self.session.rollback()
                    return "ignored"
                payment.razorpay_refund_id = refund_id
                _mark_refunded(payment, order)
            elif (
                payment.razorpay_refund_id == refund_id
                and payment.status != PaymentStatus.REFUNDED.value
            ):
                payment.razorpay_refund_id = None
                logger.error(
                    "payments.refund_failed order_number=%s tenant_id=%s refund_id=%s",
                    order.order_number,
                    self.tenant_id,
                    refund_id,
                )
            await self.session.commit()
            return "processed"
        except Exception:
            await self.session.rollback()
            raise

    def _mark_paid(
        self, payment: Payment, order: Order, gateway_payment_id: str, *, source: str
    ) -> None:
        """Record captured money; on a cancelled order it is flagged for a refund."""
        payment.razorpay_payment_id = gateway_payment_id
        payment.status = PaymentStatus.PAID.value
        order.payment_status = OrderPaymentStatus.PAID.value
        if order.status == OrderStatus.CANCELLED.value:
            logger.warning(
                "payments.paid_after_cancel order_number=%s tenant_id=%s refund_required=true",
                order.order_number,
                self.tenant_id,
            )
        logger.info(
            "payments.paid order_number=%s tenant_id=%s source=%s",
            order.order_number,
            self.tenant_id,
            source,
        )

    async def _order(self, order_id: UUID) -> Order:
        from app.orders.service import OrderService

        return await OrderService(self.session, self.tenant_id).get(order_id)


def _can_record_capture(order: Order, payment: Payment) -> bool:
    """A pending payment, or one abandoned when its order was cancelled, may still be captured."""
    if order.status == OrderStatus.CANCELLED.value:
        return payment.status in (PaymentStatus.PENDING.value, PaymentStatus.FAILED.value)
    return (
        payment.status == PaymentStatus.PENDING.value
        and order.payment_status == OrderPaymentStatus.PENDING.value
    )


def _mark_refunded(payment: Payment, order: Order) -> None:
    """Record that Razorpay has returned the money."""
    payment.status = PaymentStatus.REFUNDED.value
    order.payment_status = OrderPaymentStatus.REFUNDED.value


def _entity(event: Any, kind: str) -> dict[str, Any]:
    """The payment or refund entity a Razorpay event carries, or an empty dict."""
    node: Any = event
    for key in ("payload", kind, "entity"):
        if not isinstance(node, dict):
            return {}
        node = node.get(key)
    return node if isinstance(node, dict) else {}


async def handle_razorpay_webhook(
    session: AsyncSession, raw_body: bytes, signature: str | None
) -> str:
    """Apply one signed Razorpay account webhook to whichever tenant owns its payment."""
    if not get_settings().razorpay_webhook_secret:
        logger.error("payments.webhook_not_configured")
        raise ServiceUnavailableError(WEBHOOK_UNAVAILABLE)

    if not signature or not razorpay.webhook_signature_valid(raw_body, signature):
        logger.warning("payments.webhook_signature_rejected")
        raise AuthenticationError("Invalid webhook signature")

    try:
        event: Any = json.loads(raw_body)
    except ValueError as exc:
        raise ValidationError("Webhook body is not JSON") from exc

    name = event.get("event") if isinstance(event, dict) else None

    if name == PAYMENT_FAILED_EVENT:
        logger.info(
            "payments.gateway_attempt_failed gateway_order_id=%s",
            _entity(event, "payment").get("order_id"),
        )
        return "acknowledged"

    if name in PAID_EVENTS:
        entity = _entity(event, "payment")
        owner = Payment.razorpay_order_id == entity.get("order_id")
    elif name in (REFUND_PROCESSED_EVENT, REFUND_FAILED_EVENT):
        entity = _entity(event, "refund")
        owner = Payment.razorpay_payment_id == entity.get("payment_id")
    else:
        return "ignored"

    tenant = (
        await session.execute(
            select(Tenant.id, Tenant.currency)
            .join(Payment, Payment.tenant_id == Tenant.id)
            .where(owner)
        )
    ).first()
    if tenant is None:
        logger.warning("payments.webhook_unknown_payment event=%s", name)
        return "ignored"

    service = PaymentService(session, tenant.id)
    if name in PAID_EVENTS:
        return await service.apply_paid_event(name, entity, tenant.currency)
    return await service.apply_refund_event(name, entity, tenant.currency)
