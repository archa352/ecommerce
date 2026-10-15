"""Turn order rows into API payloads."""

from __future__ import annotations

from app.orders.models import Order
from app.orders.schemas import (
    DeliveryAddressRead,
    OrderItemRead,
    OrderRead,
    OrderSummaryRead,
)
from app.payments.serializers import payment_read


def delivery_address(order: Order) -> DeliveryAddressRead:
    return DeliveryAddressRead(
        full_name=order.delivery_name,
        phone=order.delivery_phone,
        address_line_1=order.delivery_address_line_1,
        address_line_2=order.delivery_address_line_2,
        city=order.delivery_city,
        state=order.delivery_state,
        postal_code=order.delivery_postal_code,
        country=order.delivery_country,
    )


def order_read(order: Order, currency: str) -> OrderRead:
    """`currency` comes from the tenant -- see `payments.serializers`."""
    return OrderRead(
        id=order.id,
        order_number=order.order_number,
        status=order.status,
        payment_status=order.payment_status,
        items=[OrderItemRead.model_validate(item) for item in order.items],
        subtotal=order.subtotal,
        coupon_code=order.coupon_code,
        discount_amount=order.discount_amount,
        shipping_amount=order.shipping_amount,
        tax_amount=order.tax_amount,
        total_amount=order.total_amount,
        currency=currency,
        payment_method=order.payment_method,
        can_cancel=order.customer_can_cancel,
        payment=payment_read(order.payment, currency) if order.payment else None,
        delivery_address=delivery_address(order),
        created_at=order.created_at,
    )


def order_summary_read(order: Order, currency: str) -> OrderSummaryRead:
    return OrderSummaryRead(
        id=order.id,
        order_number=order.order_number,
        status=order.status,
        payment_status=order.payment_status,
        total_amount=order.total_amount,
        currency=currency,
        created_at=order.created_at,
    )
