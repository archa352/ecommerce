"""Record and read the admin activity log."""

from __future__ import annotations

from datetime import date, datetime, time, timedelta, timezone
from typing import Any
from uuid import UUID

from fastapi import Request
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.models import AuditLog
from app.core.repository import TenantScopedRepository
from app.core.request_context import client_ip
from app.users.models import User

_SECRET_HINTS = ("password", "token", "secret", "otp")


def _scrub(value: Any) -> Any:
    """Drop anything that looks like a credential before it is stored."""
    if isinstance(value, dict):
        return {
            key: "***" if any(hint in str(key).lower() for hint in _SECRET_HINTS) else _scrub(item)
            for key, item in value.items()
        }
    if isinstance(value, list):
        return [_scrub(item) for item in value]
    return value


class AuditLogRepository(TenantScopedRepository[AuditLog]):
    model = AuditLog


async def record_activity(
    session: AsyncSession,
    actor: User,
    action: str,
    entity_type: str,
    entity_id: object | None = None,
    *,
    summary: str | None = None,
    changes: Any = None,
    request: Request | None = None,
    commit: bool = True,
) -> AuditLog:
    """Append one entry for `actor` in the actor's own tenant."""
    entry = AuditLog(
        tenant_id=actor.tenant_id,
        actor_id=actor.id,
        actor_name=actor.name or actor.email or actor.phone,
        actor_role=actor.role,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id is not None else None,
        summary=(summary or "")[:255] or None,
        changes=_scrub(jsonable_encoder(changes)) if changes is not None else None,
        ip_address=client_ip(request) if request is not None else None,
    )
    session.add(entry)
    if request is not None:
        # Tells the automatic trail this request is already on record.
        request.state.audit_recorded = True
    if commit:
        await session.commit()
    else:
        await session.flush()
    return entry


async def record_login(
    session: AsyncSession,
    tenant_id: UUID,
    *,
    user: User | None,
    portal: str,
    success: bool,
    request: Request | None = None,
) -> None:
    """A sign-in attempt on the admin or staff login. Never stores what was typed:
    an unknown account is logged without the identifier (it may be a mistyped password).
    The caller commits."""
    if success:
        action, summary = "auth.login", f"Signed in ({portal})"
    else:
        action = "auth.login_failed"
        summary = f"Failed {portal} sign-in" + ("" if user else " (unknown account)")
    session.add(
        AuditLog(
            tenant_id=tenant_id,
            actor_id=user.id if user else None,
            actor_name=(user.name or user.email or user.phone) if user else None,
            actor_role=user.role if user else None,
            action=action,
            entity_type="session",
            entity_id=str(user.id) if user else None,
            summary=summary,
            ip_address=client_ip(request) if request is not None else None,
        )
    )


class AuditService:
    def __init__(self, session: AsyncSession, tenant_id: UUID) -> None:
        self.session = session
        self.logs = AuditLogRepository(session, tenant_id)

    async def list(
        self,
        params,
        *,
        actor_id: UUID | None = None,
        entity_type: str | None = None,
        entity_id: str | None = None,
        action: str | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
    ):
        stmt = self.logs.base_select()
        if actor_id is not None:
            stmt = stmt.where(AuditLog.actor_id == actor_id)
        if entity_type:
            stmt = stmt.where(AuditLog.entity_type == entity_type)
        if entity_id:
            stmt = stmt.where(AuditLog.entity_id == entity_id)
        if action:
            stmt = stmt.where(AuditLog.action.startswith(action))
        if start_date:
            stmt = stmt.where(
                AuditLog.created_at >= datetime.combine(start_date, time.min, tzinfo=timezone.utc)
            )
        if end_date:
            stmt = stmt.where(
                AuditLog.created_at
                < datetime.combine(end_date + timedelta(days=1), time.min, tzinfo=timezone.utc)
            )
        rows, total = await self.logs.paginate(
            stmt.order_by(AuditLog.created_at.desc(), AuditLog.id), params
        )
        return list(rows), total
