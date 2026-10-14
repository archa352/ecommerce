"""The store's own list of return reasons, chosen when an order is marked returned."""

from __future__ import annotations

import uuid

from sqlalchemy import Boolean, ForeignKey, Index, Integer, String, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin

MAX_REASON_LENGTH = 100
MAX_RETURN_NOTE_LENGTH = 500


class ReturnReason(Base, TimestampMixin):
    __tablename__ = "return_reasons"
    __table_args__ = (
        UniqueConstraint("tenant_id", "id", name="uq_return_reasons_tenant_id_id"),
        Index(
            "uq_return_reasons_tenant_label",
            "tenant_id",
            text("lower(label)"),
            unique=True,
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False
    )
    label: Mapped[str] = mapped_column(String(MAX_REASON_LENGTH), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
