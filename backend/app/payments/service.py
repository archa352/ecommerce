from __future__ import annotations

from uuid import UUID

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.core.pagination import PageParams
from app.orders.constants import OrderStatus
from app.orders.constants import PaymentStatus as OrderPaymentStatus
from app.orders.repository import OrderRepository
from app.payments import razorpay
from app.payments.constants import PaymentStatus
from app.payments.models import Payment
from app.payments.repository import PaymentRepository

PAYMENT_NOT_FOUND = "Payment not found"


class PaymentService:
    """Payment operations scoped to one tenant."""

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
            if (
                payment.status != PaymentStatus.PENDING.value
                or order.payment_status != OrderPaymentStatus.PENDING.value
                or order.status == OrderStatus.CANCELLED.value
            ):
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

            payment.razorpay_payment_id = razorpay_payment_id
            payment.status = PaymentStatus.PAID.value
            order.payment_status = OrderPaymentStatus.PAID.value
            await self.session.commit()
            return payment
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError("Razorpay payment has already been recorded") from exc
        except Exception:
            await self.session.rollback()
            raise
