import uuid

from sqlalchemy import Boolean, CheckConstraint, ForeignKey, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin, TimestampMixin
from app.tenants.constants import CURRENCY_CODE_LENGTH, DEFAULT_CURRENCY


class Tenant(IdMixin, TimestampMixin, Base):
    __tablename__ = "tenants"

    __table_args__ = (
        CheckConstraint(
            f"currency = upper(currency) AND length(currency) = {CURRENCY_CODE_LENGTH}",
            name="currency_is_iso_4217",
        ),
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    currency: Mapped[str] = mapped_column(
        String(CURRENCY_CODE_LENGTH),
        nullable=False,
        default=DEFAULT_CURRENCY,
        server_default=text(f"'{DEFAULT_CURRENCY}'"),
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )


class TenantDomain(IdMixin, TimestampMixin, Base):
    __tablename__ = "tenant_domains"

    __table_args__ = (
        CheckConstraint("domain = lower(domain)", name="domain_is_lowercase"),
        CheckConstraint("length(trim(domain)) > 0", name="domain_not_blank"),
    )

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    domain: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )
