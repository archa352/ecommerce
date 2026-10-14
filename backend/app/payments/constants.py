from enum import Enum


class PaymentStatus(str, Enum):
    """Where one payment attempt got to."""

    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class PaymentProvider(str, Enum):
    """How the money arrives. Cash on delivery is the only way for now."""

    COD = "COD"
    RAZORPAY = "RAZORPAY"
