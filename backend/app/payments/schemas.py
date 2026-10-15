from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field

from app.core.pagination import PageParams
from app.core.schemas import StrictModel
from app.payments.constants import PaymentProvider, PaymentStatus


class PaymentRead(BaseModel):
    """A payment as the API reports it."""

    id: UUID
    order_id: UUID
    amount: Decimal
    currency: str
    status: PaymentStatus
    provider: PaymentProvider
    gateway_order_id: str | None = None
    gateway_payment_id: str | None = None
    created_at: datetime


class RazorpayVerification(StrictModel):
    """What Razorpay Checkout hands the browser after a payment; checked server-side."""

    razorpay_order_id: str = Field(min_length=1, max_length=64)
    razorpay_payment_id: str = Field(min_length=1, max_length=64)
    razorpay_signature: str = Field(min_length=1, max_length=256)


class PaymentQuery(PageParams):
    """Filters the admin payment listing accepts."""

    order_id: UUID | None = None
    status: PaymentStatus | None = None
