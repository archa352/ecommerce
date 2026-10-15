from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.core.pagination import PageParams
from app.core.schemas import StrictModel
from app.orders.constants import OrderStatus, PaymentMethod, PaymentStatus
from app.payments.schemas import PaymentRead


class CheckoutItem(BaseModel):
    """One validated line, priced from the database."""

    product_id: UUID
    variant_id: UUID
    product_name: str
    variant_name: str
    sku: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal


class CheckoutPreview(BaseModel):
    items: list[CheckoutItem]
    subtotal: Decimal
    coupon_code: str | None = None
    discount_amount: Decimal = Decimal("0.00")
    shipping_amount: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    payment_method: PaymentMethod | None = None


class CheckoutCreate(StrictModel):
    """Which address to deliver to, and an optional coupon code -- the only
    things checkout accepts from the client. Everything priced (subtotal,
    discount, shipping, tax, total) is always computed server-side from the
    cart and coupon rules, never trusted from the request."""

    address_id: UUID
    coupon_code: str | None = Field(default=None, min_length=1, max_length=50)
    payment_method: PaymentMethod = PaymentMethod.CASH_ON_DELIVERY


class CheckoutPreviewCreate(StrictModel):
    """An optional address to price the cart against, validated when it is sent."""

    address_id: UUID | None = None
    payment_method: PaymentMethod | None = None


class DeliveryAddressRead(BaseModel):
    full_name: str
    phone: str
    address_line_1: str
    address_line_2: str | None
    city: str
    state: str
    postal_code: str
    country: str


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID
    variant_id: UUID
    product_name: str
    variant_name: str
    sku: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal


class OrderRead(BaseModel):
    id: UUID
    order_number: str
    status: OrderStatus
    payment_status: PaymentStatus
    items: list[OrderItemRead]
    subtotal: Decimal
    coupon_code: str | None = None
    discount_amount: Decimal = Decimal("0.00")
    shipping_amount: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    currency: str
    payment_method: PaymentMethod
    can_cancel: bool
    payment: PaymentRead | None
    delivery_address: DeliveryAddressRead
    created_at: datetime


class OrderSummaryRead(BaseModel):
    """A row in a list of orders -- no items, so listing stays cheap to read."""

    id: UUID
    order_number: str
    status: OrderStatus
    payment_status: PaymentStatus
    total_amount: Decimal
    currency: str
    created_at: datetime


class OrderStatusUpdate(StrictModel):
    status: OrderStatus


class OrderQuery(PageParams):
    """Filters the admin order listing accepts."""

    order_number: str | None = Field(default=None, max_length=32)
    status: OrderStatus | None = None
    payment_status: PaymentStatus | None = None
