import uuid
from decimal import Decimal

from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    ForeignKeyConstraint,
    Index,
    Integer,
    Numeric,
    Sequence,
    String,
    UniqueConstraint,
    and_,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.addresses.models import (
    MAX_CITY_LENGTH,
    MAX_LINE_LENGTH,
    MAX_NAME_LENGTH,
    MAX_POSTAL_CODE_LENGTH,
)
from app.catalogue.constants import (
    MAX_NAME_LENGTH as MAX_PRODUCT_NAME_LENGTH,
)
from app.catalogue.constants import (
    MAX_SKU_LENGTH,
    PRICE_PRECISION,
    PRICE_SCALE,
)
from app.models.base import Base, TimestampMixin
from app.orders.constants import (
    CUSTOMER_CANCELLABLE_STATUSES,
    MAX_IDEMPOTENCY_KEY_LENGTH,
    MAX_ORDER_NUMBER_LENGTH,
    ORDER_NUMBER_START,
    PAYMENT_METHOD_LENGTH,
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
)
from app.payments.models import Payment

_ORDER_STATUS_VALUES = ", ".join(f"'{status.value}'" for status in OrderStatus)
_PAYMENT_STATUS_VALUES = ", ".join(f"'{status.value}'" for status in PaymentStatus)
_PAYMENT_METHOD_VALUES = ", ".join(f"'{method.value}'" for method in PaymentMethod)

ORDER_NUMBER_SEQUENCE = Sequence(
    "order_number_seq", start=ORDER_NUMBER_START, metadata=Base.metadata
)


class Order(Base, TimestampMixin):
    """One placed order, with prices and the delivery address copied in at checkout."""

    __tablename__ = "orders"

    __table_args__ = (
        UniqueConstraint("tenant_id", "id", name="uq_orders_tenant_id_id"),
        UniqueConstraint("order_number", name="uq_orders_order_number"),
        # NULLs stay distinct in Postgres, so orders placed without a key
        # never collide with each other.
        UniqueConstraint(
            "tenant_id",
            "customer_id",
            "idempotency_key",
            name="uq_orders_tenant_customer_idempotency",
        ),
        ForeignKeyConstraint(
            ["tenant_id", "customer_id"],
            ["users.tenant_id", "users.id"],
            name="fk_orders_tenant_customer_users",
            ondelete="CASCADE",
        ),
        CheckConstraint(f"status IN ({_ORDER_STATUS_VALUES})", name="status_valid"),
        CheckConstraint(
            f"payment_status IN ({_PAYMENT_STATUS_VALUES})", name="payment_status_valid"
        ),
        CheckConstraint(
            f"payment_method IN ({_PAYMENT_METHOD_VALUES})", name="payment_method_valid"
        ),
        CheckConstraint("subtotal >= 0", name="subtotal_not_negative"),
        CheckConstraint("shipping_amount >= 0", name="shipping_not_negative"),
        CheckConstraint("tax_amount >= 0", name="tax_not_negative"),
        CheckConstraint("discount_amount >= 0", name="discount_not_negative"),
        CheckConstraint("discount_amount <= subtotal", name="discount_not_more_than_subtotal"),
        CheckConstraint(
            "total_amount = subtotal - discount_amount + shipping_amount + tax_amount",
            name="total_matches_components",
        ),
        Index("ix_orders_tenant_id_customer_id", "tenant_id", "customer_id"),
        Index("ix_orders_tenant_id_status", "tenant_id", "status"),
        Index("ix_orders_tenant_id_payment_status", "tenant_id", "payment_status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
    )

    customer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)

    order_number: Mapped[str] = mapped_column(
        String(MAX_ORDER_NUMBER_LENGTH), nullable=False
    )

    # What the client sent as Idempotency-Key, so a retry returns this order
    # instead of placing a second one.
    idempotency_key: Mapped[str | None] = mapped_column(
        String(MAX_IDEMPOTENCY_KEY_LENGTH), nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default=OrderStatus.PENDING.value
    )

    payment_status: Mapped[str] = mapped_column(
        String(20), nullable=False, default=PaymentStatus.PENDING.value
    )

    payment_method: Mapped[str] = mapped_column(
        String(PAYMENT_METHOD_LENGTH),
        nullable=False,
        default=PaymentMethod.CASH_ON_DELIVERY.value,
        server_default=PaymentMethod.CASH_ON_DELIVERY.value,
    )

    subtotal: Mapped[Decimal] = mapped_column(
        Numeric(PRICE_PRECISION, PRICE_SCALE), nullable=False
    )

    # Snapshot of the coupon actually redeemed for this order, if any -- not
    # a live reference to reconstruct from. coupon_id is single-column (not
    # the usual composite tenant FK) since it only needs to survive the
    # coupon itself being soft-deleted later, the same reasoning used
    # elsewhere in this codebase for historical references; coupon_code is
    # copied in case the coupon's own code is ever changed.
    coupon_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("coupons.id", ondelete="SET NULL"),
        nullable=True,
    )

    coupon_code: Mapped[str | None] = mapped_column(String(50), nullable=True)

    discount_amount: Mapped[Decimal] = mapped_column(
        Numeric(PRICE_PRECISION, PRICE_SCALE), nullable=False, default=0, server_default="0"
    )

    shipping_amount: Mapped[Decimal] = mapped_column(
        Numeric(PRICE_PRECISION, PRICE_SCALE), nullable=False
    )

    tax_amount: Mapped[Decimal] = mapped_column(
        Numeric(PRICE_PRECISION, PRICE_SCALE), nullable=False
    )

    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(PRICE_PRECISION, PRICE_SCALE), nullable=False
    )

    delivery_name: Mapped[str] = mapped_column(String(MAX_NAME_LENGTH), nullable=False)

    delivery_phone: Mapped[str] = mapped_column(String(16), nullable=False)

    delivery_address_line_1: Mapped[str] = mapped_column(
        String(MAX_LINE_LENGTH), nullable=False
    )

    delivery_address_line_2: Mapped[str | None] = mapped_column(
        String(MAX_LINE_LENGTH), nullable=True
    )

    delivery_city: Mapped[str] = mapped_column(String(MAX_CITY_LENGTH), nullable=False)

    delivery_state: Mapped[str] = mapped_column(String(MAX_CITY_LENGTH), nullable=False)

    delivery_postal_code: Mapped[str] = mapped_column(
        String(MAX_POSTAL_CODE_LENGTH), nullable=False
    )

    delivery_country: Mapped[str] = mapped_column(
        String(MAX_CITY_LENGTH), nullable=False
    )

    payment: Mapped["Payment | None"] = relationship(
        "Payment",
        primaryjoin=lambda: and_(
            Order.id == Payment.order_id,
            Order.tenant_id == Payment.tenant_id,
        ),
        foreign_keys=lambda: [Payment.order_id, Payment.tenant_id],
        uselist=False,
        lazy="selectin",
        viewonly=True,
    )

    items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem",
        primaryjoin=lambda: and_(
            Order.id == OrderItem.order_id,
            Order.tenant_id == OrderItem.tenant_id,
        ),
        foreign_keys=lambda: [OrderItem.order_id, OrderItem.tenant_id],
        order_by=lambda: OrderItem.created_at,
        lazy="selectin",
        viewonly=True,
    )

    @property
    def customer_can_cancel(self) -> bool:
        """Whether the customer may cancel online: before PROCESSING and not yet paid."""
        return (
            OrderStatus(self.status) in CUSTOMER_CANCELLABLE_STATUSES
            and self.payment_status != PaymentStatus.PAID.value
        )


class OrderItem(Base, TimestampMixin):
    """One order line, with the product details frozen at purchase time."""

    __tablename__ = "order_items"

    __table_args__ = (
        UniqueConstraint("order_id", "variant_id", name="uq_order_items_order_variant"),
        ForeignKeyConstraint(
            ["tenant_id", "order_id"],
            ["orders.tenant_id", "orders.id"],
            name="fk_order_items_tenant_order_orders",
            ondelete="CASCADE",
        ),
        ForeignKeyConstraint(
            ["tenant_id", "variant_id"],
            ["product_variants.tenant_id", "product_variants.id"],
            name="fk_order_items_tenant_variant_product_variants",
            ondelete="CASCADE",
        ),
        ForeignKeyConstraint(
            ["tenant_id", "product_id"],
            ["products.tenant_id", "products.id"],
            name="fk_order_items_tenant_product_products",
            ondelete="CASCADE",
        ),
        CheckConstraint("quantity > 0", name="quantity_positive"),
        CheckConstraint("unit_price >= 0", name="unit_price_not_negative"),
        CheckConstraint(
            "subtotal = unit_price * quantity", name="subtotal_is_price_times_quantity"
        ),
        Index("ix_order_items_tenant_id_order_id", "tenant_id", "order_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
    )

    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)

    variant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)

    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)

    product_name: Mapped[str] = mapped_column(
        String(MAX_PRODUCT_NAME_LENGTH), nullable=False
    )

    variant_name: Mapped[str] = mapped_column(
        String(MAX_PRODUCT_NAME_LENGTH), nullable=False
    )

    sku: Mapped[str] = mapped_column(String(MAX_SKU_LENGTH), nullable=False)

    unit_price: Mapped[Decimal] = mapped_column(
        Numeric(PRICE_PRECISION, PRICE_SCALE), nullable=False
    )

    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    subtotal: Mapped[Decimal] = mapped_column(
        Numeric(PRICE_PRECISION, PRICE_SCALE), nullable=False
    )