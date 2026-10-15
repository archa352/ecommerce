from enum import Enum


class OrderStatus(str, Enum):
    """Where the order is in fulfilment. Separate from how it was paid."""

    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class PaymentStatus(str, Enum):
    """Where the money is. Cash on delivery, so it lands on delivery."""

    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class PaymentMethod(str, Enum):
    """What the shopper chose at checkout; everything but cash is paid through Razorpay."""

    UPI = "UPI"
    CREDIT_CARD = "CREDIT_CARD"
    DEBIT_CARD = "DEBIT_CARD"
    NET_BANKING = "NET_BANKING"
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY"


ONLINE_PAYMENT_METHODS = frozenset(
    {
        PaymentMethod.UPI,
        PaymentMethod.CREDIT_CARD,
        PaymentMethod.DEBIT_CARD,
        PaymentMethod.NET_BANKING,
    }
)

PAYMENT_METHOD_LENGTH = 20

ALLOWED_TRANSITIONS: dict[OrderStatus, frozenset[OrderStatus]] = {
    OrderStatus.PENDING: frozenset(
        {OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.CANCELLED}
    ),
    OrderStatus.CONFIRMED: frozenset({OrderStatus.PROCESSING, OrderStatus.CANCELLED}),
    OrderStatus.PROCESSING: frozenset({OrderStatus.SHIPPED, OrderStatus.CANCELLED}),
    OrderStatus.SHIPPED: frozenset({OrderStatus.DELIVERED}),
    OrderStatus.DELIVERED: frozenset(),
    OrderStatus.CANCELLED: frozenset(),
}

CUSTOMER_CANCELLABLE_STATUSES = frozenset({OrderStatus.PENDING, OrderStatus.CONFIRMED})

MAX_ORDER_NUMBER_LENGTH = 32
MAX_IDEMPOTENCY_KEY_LENGTH = 80
ORDER_NUMBER_PREFIX = "ORD-"

ORDER_NUMBER_START = 100001
