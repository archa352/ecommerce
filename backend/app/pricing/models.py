"""Per-tenant shipping, delivery-area, tax and GST-invoice settings."""

from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.catalogue.constants import PRICE_PRECISION, PRICE_SCALE
from app.models.base import Base, IdMixin, TenantMixin, TimestampMixin
from app.pricing.constants import (
    DEFAULT_INVOICE_PREFIX,
    DEFAULT_MAX_DELIVERY_DAYS,
    DEFAULT_MIN_DELIVERY_DAYS,
    MAX_TAX_PERCENTAGE,
)

TAX_PRECISION = 5
TAX_SCALE = 2


class ShippingSettings(IdMixin, TenantMixin, TimestampMixin, Base):
    """One tenant's delivery charge, free above `free_shipping_minimum`."""

    __tablename__ = "shipping_settings"

    __table_args__ = (
        UniqueConstraint("tenant_id", name="uq_shipping_settings_tenant_id"),
        CheckConstraint("shipping_amount >= 0", name="shipping_amount_not_negative"),
        CheckConstraint(
            "free_shipping_minimum IS NULL OR free_shipping_minimum >= 0",
            name="free_shipping_minimum_not_negative",
        ),
        CheckConstraint(
            "min_delivery_days >= 0 AND max_delivery_days >= min_delivery_days",
            name="delivery_days_ordered",
        ),
    )

    shipping_amount: Mapped[Decimal] = mapped_column(
        Numeric(PRICE_PRECISION, PRICE_SCALE), nullable=False
    )

    free_shipping_minimum: Mapped[Decimal | None] = mapped_column(
        Numeric(PRICE_PRECISION, PRICE_SCALE), nullable=True
    )

    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    # The default delivery promise, in days from the order; a pincode may override it.
    min_delivery_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=DEFAULT_MIN_DELIVERY_DAYS,
        server_default=str(DEFAULT_MIN_DELIVERY_DAYS),
    )
    max_delivery_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=DEFAULT_MAX_DELIVERY_DAYS,
        server_default=str(DEFAULT_MAX_DELIVERY_DAYS),
    )

    # True: only pincodes listed as serviceable are delivered to.
    # False (default): everywhere is served unless a pincode is blocked.
    restrict_to_listed_pincodes: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )


class PincodeRule(IdMixin, TenantMixin, TimestampMixin, Base):
    """Delivery rules for one pincode: served or not, how fast, at what cost, COD or not."""

    __tablename__ = "pincode_rules"

    __table_args__ = (
        UniqueConstraint("tenant_id", "pincode", name="uq_pincode_rules_tenant_pincode"),
        CheckConstraint("pincode ~ '^[1-9][0-9]{5}$'", name="pincode_is_indian"),
        CheckConstraint(
            "shipping_amount IS NULL OR shipping_amount >= 0",
            name="shipping_amount_not_negative",
        ),
        CheckConstraint(
            "(min_delivery_days IS NULL) = (max_delivery_days IS NULL)"
            " AND (min_delivery_days IS NULL"
            " OR (min_delivery_days >= 0 AND max_delivery_days >= min_delivery_days))",
            name="delivery_days_ordered",
        ),
    )

    pincode: Mapped[str] = mapped_column(String(6), nullable=False)

    is_serviceable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    cod_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    min_delivery_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    max_delivery_days: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Replaces the flat delivery charge here (free-shipping threshold still applies).
    shipping_amount: Mapped[Decimal | None] = mapped_column(
        Numeric(PRICE_PRECISION, PRICE_SCALE), nullable=True
    )

    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    state: Mapped[str | None] = mapped_column(String(100), nullable=True)


class GstSettings(IdMixin, TenantMixin, TimestampMixin, Base):
    """The seller's GST identity, printed on invoices and used to split CGST/SGST/IGST."""

    __tablename__ = "gst_settings"

    __table_args__ = (UniqueConstraint("tenant_id", name="uq_gst_settings_tenant_id"),)

    gstin: Mapped[str | None] = mapped_column(String(15), nullable=True)
    legal_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    address: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # The seller's state decides intra- (CGST+SGST) vs inter-state (IGST) supply.
    state: Mapped[str | None] = mapped_column(String(100), nullable=True)
    state_code: Mapped[str | None] = mapped_column(String(2), nullable=True)

    invoice_prefix: Mapped[str] = mapped_column(
        String(20), nullable=False, default=DEFAULT_INVOICE_PREFIX
    )

    shipping_sac_code: Mapped[str | None] = mapped_column(String(8), nullable=True)


class TaxSettings(IdMixin, TenantMixin, TimestampMixin, Base):
    """One tenant's tax rate, as a percentage: 18.00 means 18%."""

    __tablename__ = "tax_settings"

    __table_args__ = (
        UniqueConstraint("tenant_id", name="uq_tax_settings_tenant_id"),
        CheckConstraint(
            f"tax_percentage >= 0 AND tax_percentage <= {MAX_TAX_PERCENTAGE}",
            name="tax_percentage_in_range",
        ),
    )

    tax_percentage: Mapped[Decimal] = mapped_column(
        Numeric(TAX_PRECISION, TAX_SCALE), nullable=False
    )

    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
