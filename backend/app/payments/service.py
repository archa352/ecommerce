from __future__ import annotations

import json
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.elements import ColumnElement

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
from app.payments.constants import PaymentProvider, PaymentStatus
from app.payments.models import Payment
from app.payments.repository import PaymentRepository
from app.payments.schemas import RazorpayVerification
from app.tenants.models import Tenant

logger = get_logger("payments")

PAYMENT_NOT_FOUND = "Payment not found"
ORDER_NOT_FOUND = "Order not found"
VERIFICATION_FAILED = "The payment could not be verified"
WEBHOOK_UNAVAILABLE = "Payment webhooks are not configured"

PAID_EVENTS = frozenset({"payment.captured", "order.paid"})
PAYMENT_FAILED_EVENT = "payment.failed"
REFUND_PROCESSED_EVENT = "refund.processed"
REFUND_FAILED_EVENT = "refund.failed"
REFUND_PROCESSED = "processed"
GATEWAY_CAPTURED = "captured"


class PaymentService:
    """Payments scoped to one tenant: reads, confirmations and refunds through Razorpay."""

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

    async def verify_razorpay(
        self, customer_id: UUID, data: RazorpayVerification, currency: str
    ) -> Payment:
        """Mark a customer's payment paid once Razorpay confirms it captured the money."""
        if not razorpay.payment_signature_valid(
            data.razorpay_order_id, data.razorpay_payment_id, data.razorpay_signature
        ):
            logger.warning(
                "payments.signature_rejected tenant_id=%s gateway_order_id=%s",
                self.tenant_id,
                data.razorpay_order_id,
            )
            raise ValidationError(VERIFICATION_FAILED, error_code="PAYMENT_VERIFICATION_FAILED")

        gateway_payment = await razorpay.fetch_payment(data.razorpay_payment_id)

        locked = await self._lock(
            Payment.razorpay_order_id == data.razorpay_order_id, customer_id=customer_id
        )
        if locked is None:
            raise NotFoundError(PAYMENT_NOT_FOUND)
        order, payment = locked

        if (
            gateway_payment.get("order_id") != data.razorpay_order_id
            or gateway_payment.get("amount") != razorpay.to_subunits(payment.amount)
            or gateway_payment.get("currency") != currency
        ):
            logger.error(
                "payments.gateway_mismatch payment_id=%s gateway_payment_id=%s",
                payment.id,
                data.razorpay_payment_id,
            )
            raise ValidationError(VERIFICATION_FAILED, error_code="PAYMENT_VERIFICATION_FAILED")

        if gateway_payment.get("status") == GATEWAY_CAPTURED:
            self._mark_paid(payment, order, data.razorpay_payment_id, source="verify")
        else:
            logger.info(
                "payments.awaiting_capture payment_id=%s gateway_status=%s",
                payment.id,
                gateway_payment.get("status"),
            )
        await self.session.commit()
        return payment

    async def refund(self, order_id: UUID) -> Order:
        """Refund a cancelled order's captured online payment in full, once."""
        order = await self.orders.get_for_update(order_id)
        if order is None:
            raise NotFoundError(ORDER_NOT_FOUND)

        if order.status != OrderStatus.CANCELLED.value:
            raise ConflictError(
                "Only a cancelled order can be refunded", error_code="REFUND_NOT_ALLOWED"
            )

        payment = await self.payments.get_by_status(order.id, PaymentStatus.PAID)
        if payment is None or payment.provider != PaymentProvider.RAZORPAY.value:
            raise ConflictError(
                "This order has no captured online payment to refund",
                error_code="REFUND_NOT_ALLOWED",
            )

        payment = await self.payments.get_for_update(payment.id)
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
            self._mark_refunded(payment, order)
        await self.session.commit()

        logger.info(
            "payments.refund_requested order_number=%s tenant_id=%s refund_status=%s",
            order.order_number,
            self.tenant_id,
            refund_status,
        )
        return order

    async def apply_paid_event(
        self, name: str, entity: dict[str, Any], currency: str
    ) -> str:
        """Record a payment Razorpay reports captured, if it matches what is owed."""
        gateway_order_id = entity.get("order_id")
        gateway_payment_id = entity.get("id")
        if not isinstance(gateway_order_id, str) or not isinstance(gateway_payment_id, str):
            logger.warning("payments.webhook_incomplete event=%s", name)
            return "ignored"

        locked = await self._lock(Payment.razorpay_order_id == gateway_order_id)
        if locked is None:
            return "ignored"
        order, payment = locked

        if (
            entity.get("amount") != razorpay.to_subunits(payment.amount)
            or entity.get("currency") != currency
        ):
            logger.error(
                "payments.webhook_amount_mismatch payment_id=%s expected=%s %s got=%s %s",
                payment.id,
                razorpay.to_subunits(payment.amount),
                currency,
                entity.get("amount"),
                entity.get("currency"),
            )
            return "ignored"

        self._mark_paid(payment, order, gateway_payment_id, source=name)
        await self.session.commit()
        return "processed"

    async def apply_refund_event(
        self, name: str, entity: dict[str, Any], currency: str
    ) -> str:
        """Settle or reopen a refund; matched by payment so early or dashboard refunds count."""
        refund_id = entity.get("id")
        gateway_payment_id = entity.get("payment_id")
        if not isinstance(refund_id, str) or not isinstance(gateway_payment_id, str):
            logger.warning("payments.webhook_incomplete event=%s", name)
            return "ignored"

        locked = await self._lock(Payment.razorpay_payment_id == gateway_payment_id)
        if locked is None:
            return "ignored"
        order, payment = locked

        if name == REFUND_PROCESSED_EVENT:
            if (
                entity.get("amount") != razorpay.to_subunits(payment.amount)
                or entity.get("currency") != currency
            ):
                logger.error(
                    "payments.partial_refund_not_recorded order_number=%s refund_id=%s amount=%s",
                    order.order_number,
                    refund_id,
                    entity.get("amount"),
                )
                return "ignored"
            payment.razorpay_refund_id = refund_id
            self._mark_refunded(payment, order)
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

    async def _lock(
        self, condition: ColumnElement[bool], *, customer_id: UUID | None = None
    ) -> tuple[Order, Payment] | None:
        """Find a payment, then lock its order and the payment in that order."""
        found = await self.payments.find_one(condition)
        if found is None:
            return None

        order = await self.orders.get_for_update(found.order_id, customer_id=customer_id)
        if order is None:
            return None

        payment = await self.payments.get_for_update(found.id)
        return order, payment

    def _mark_paid(
        self, payment: Payment, order: Order, gateway_payment_id: str, *, source: str
    ) -> None:
        """Record a confirmed payment once; a repeat confirmation changes nothing."""
        if payment.status in (PaymentStatus.PAID.value, PaymentStatus.REFUNDED.value):
            if payment.razorpay_payment_id != gateway_payment_id:
                logger.warning(
                    "payments.second_capture payment_id=%s gateway_payment_id=%s",
                    payment.id,
                    gateway_payment_id,
                )
            return

        payment.status = PaymentStatus.PAID.value
        payment.razorpay_payment_id = gateway_payment_id
        order.payment_status = OrderPaymentStatus.PAID.value

        if order.status == OrderStatus.PENDING.value:
            order.status = OrderStatus.CONFIRMED.value
        elif order.status == OrderStatus.CANCELLED.value:
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

    def _mark_refunded(self, payment: Payment, order: Order) -> None:
        """Record that Razorpay has returned the money."""
        payment.status = PaymentStatus.REFUNDED.value
        order.payment_status = OrderPaymentStatus.REFUNDED.value
        logger.info(
            "payments.refunded order_number=%s tenant_id=%s",
            order.order_number,
            self.tenant_id,
        )


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
