import uuid
from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.auth.constants import UserRole, UserStatus
from app.models.base import Base, IdMixin, TimestampMixin

_ROLE_VALUES = ", ".join(f"'{role.value}'" for role in UserRole)
_STATUS_VALUES = ", ".join(f"'{status.value}'" for status in UserStatus)

_E164_SQL = r"phone ~ '^\+[1-9][0-9]{7,14}$'"


class User(IdMixin, TimestampMixin, Base):
    __tablename__ = "users"

    __table_args__ = (
        UniqueConstraint("tenant_id", "id", name="uq_users_tenant_id_id"),
        UniqueConstraint("tenant_id", "phone", name="uq_users_tenant_phone"),
        UniqueConstraint("tenant_id", "email", name="uq_users_tenant_email"),
        CheckConstraint(f"role IN ({_ROLE_VALUES})", name="role_valid"),
        CheckConstraint(f"status IN ({_STATUS_VALUES})", name="status_valid"),
        CheckConstraint("email IS NULL OR email = lower(email)", name="email_is_lowercase"),
        CheckConstraint(_E164_SQL, name="phone_is_e164"),
        CheckConstraint(
            "(role = 'CUSTOMER') = (password_hash IS NULL)",
            name="password_matches_role",
        ),
    )

    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    phone: Mapped[str] = mapped_column(String(16), nullable=False)

    email: Mapped[str | None] = mapped_column(String(255), nullable=True)

    name: Mapped[str | None] = mapped_column(String(150), nullable=True)

    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default=UserRole.CUSTOMER.value,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default=UserStatus.ACTIVE.value,
    )

    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # STAFF only: granted admin permissions. NULL = legacy staff access
    # (see app/auth/permissions.py); ADMIN ignores it.
    permissions: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)

    # CUSTOMER only: labels the store gives a customer (VIP, frequent returner...).
    tags: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)

    # CUSTOMER only: set when the store blocks this customer from placing new
    # orders (as account or guest). Past orders and history are untouched.
    order_blocked_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    order_block_reason: Mapped[str | None] = mapped_column(String(200), nullable=True)

    @property
    def is_active(self) -> bool:
        return self.status == UserStatus.ACTIVE.value
