"""Staff accounts: individual logins, roles and permissions (admin-only)."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, status
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.service import record_activity
from app.auth.constants import STAFF_ROLES, UserRole, UserStatus
from app.auth.dependencies import require_admin
from app.auth.permissions import (
    ALL_PERMISSIONS,
    PERMISSION_DESCRIPTIONS,
    effective_permissions,
)
from app.auth.repository import RefreshTokenRepository
from app.auth.schemas import MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, NormalizedPhone
from app.auth.security import hash_password
from app.core.database import get_db
from app.core.error_codes import UserErrorCode
from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.core.pagination import PageParams
from app.core.responses import ApiResponse, ok, paginated
from app.core.schemas import PartialUpdate, StrictModel
from app.users.models import User
from app.users.repository import UserRepository

router = APIRouter(prefix="/admin/staff", tags=["Admin-Staff"])

StaffRole = Literal["ADMIN", "STAFF"]
Password = Field(min_length=MIN_PASSWORD_LENGTH, max_length=MAX_PASSWORD_LENGTH)


def _check_permissions(value: list[str] | None) -> list[str] | None:
    if value is None:
        return None
    unknown = sorted(set(value) - ALL_PERMISSIONS)
    if unknown:
        raise ValueError(f"unknown permissions: {', '.join(unknown)}")
    return sorted(set(value))


class StaffCreate(StrictModel):
    name: str = Field(min_length=1, max_length=150)
    email: EmailStr
    phone: NormalizedPhone
    password: str = Password
    role: StaffRole = "STAFF"
    permissions: list[str] = Field(default_factory=list)

    _valid_permissions = field_validator("permissions")(_check_permissions)


class StaffUpdate(PartialUpdate):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    role: StaffRole | None = None
    permissions: list[str] | None = None
    status: Literal["ACTIVE", "INACTIVE"] | None = None

    _valid_permissions = field_validator("permissions")(_check_permissions)


class StaffPasswordReset(StrictModel):
    password: str = Password


class StaffRead(BaseModel):
    id: UUID
    name: str | None
    email: str | None
    phone: str
    role: str
    status: str
    permissions: list[str] | None = Field(
        description="Granted permissions; null = legacy staff access (STAFF) / everything (ADMIN)"
    )
    effective_permissions: list[str]
    created_at: datetime


class PermissionRead(BaseModel):
    key: str
    description: str


class StaffQuery(PageParams):
    search: str | None = Field(default=None, max_length=100)
    status: Literal["ACTIVE", "INACTIVE"] | None = None


def staff_read(user: User) -> StaffRead:
    return StaffRead(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        status=user.status,
        permissions=None if user.role == UserRole.ADMIN.value else user.permissions,
        effective_permissions=sorted(effective_permissions(user.role, user.permissions)),
        created_at=user.created_at,
    )


async def _get_staff(session: AsyncSession, tenant_id: UUID, user_id: UUID) -> User:
    user = await UserRepository(session).get_by_id(tenant_id=tenant_id, user_id=user_id)
    if user is None or user.role not in STAFF_ROLES:
        raise NotFoundError("Staff member not found", error_code=UserErrorCode.NOT_FOUND)
    return user


@router.get(
    "/permissions",
    response_model=ApiResponse[list[PermissionRead]],
    summary="Every permission that can be granted",
)
async def list_permissions(
    user: User = Depends(require_admin),
) -> ApiResponse[list[PermissionRead]]:
    return ok(
        [PermissionRead(key=p.value, description=d) for p, d in PERMISSION_DESCRIPTIONS.items()],
        message="Permissions retrieved",
    )


@router.get("", response_model=ApiResponse[list[StaffRead]], summary="List staff accounts")
async def list_staff(
    params: Annotated[StaffQuery, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[list[StaffRead]]:
    stmt = select(User).where(User.tenant_id == user.tenant_id, User.role.in_(STAFF_ROLES))
    if params.status:
        stmt = stmt.where(User.status == params.status)
    if params.search:
        term = f"%{params.search.strip()}%"
        stmt = stmt.where(User.name.ilike(term) | User.email.ilike(term) | User.phone.ilike(term))
    total = await session.scalar(select(func.count()).select_from(stmt.subquery()))
    rows = await session.scalars(
        stmt.order_by(User.created_at).offset(params.offset).limit(params.limit)
    )
    return paginated(
        [staff_read(u) for u in rows.all()],
        total_items=int(total or 0),
        params=params,
        message="Staff retrieved",
    )


@router.post(
    "",
    response_model=ApiResponse[StaffRead],
    status_code=status.HTTP_201_CREATED,
    summary="Create an individual staff or admin login",
)
async def create_staff(
    data: StaffCreate,
    request: Request,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[StaffRead]:
    users = UserRepository(session)
    email = str(data.email).lower()
    if await users.get_by_email(tenant_id=user.tenant_id, email=email):
        raise ConflictError("That email is already in use", error_code=UserErrorCode.EMAIL_TAKEN)
    if await users.get_by_phone(tenant_id=user.tenant_id, phone=data.phone):
        raise ConflictError(
            "That phone number is already in use", error_code=UserErrorCode.PHONE_TAKEN
        )

    try:
        member = await users.create(
            tenant_id=user.tenant_id,
            phone=data.phone,
            email=email,
            name=data.name.strip(),
            role=data.role,
            password_hash=await hash_password(data.password),
            is_verified=True,
        )
        member.permissions = data.permissions if data.role == "STAFF" else None
        await record_activity(
            session,
            user,
            "staff.created",
            "staff",
            member.id,
            summary=f"Created {data.role.lower()} {email}",
            changes=data.model_dump(exclude={"password"}),
            request=request,
            commit=False,
        )
        await session.commit()
    except IntegrityError as exc:
        await session.rollback()
        raise ConflictError("That email or phone number is already in use") from exc
    return ok(staff_read(member), message="Staff account created")


@router.get("/{staff_id}", response_model=ApiResponse[StaffRead], summary="One staff account")
async def get_staff(
    staff_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[StaffRead]:
    return ok(staff_read(await _get_staff(session, user.tenant_id, staff_id)), message="Staff")


@router.patch(
    "/{staff_id}",
    response_model=ApiResponse[StaffRead],
    summary="Change a staff member's name, role, permissions or status",
)
async def update_staff(
    staff_id: UUID,
    data: StaffUpdate,
    request: Request,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[StaffRead]:
    member = await _get_staff(session, user.tenant_id, staff_id)
    changes = data.model_dump(exclude_unset=True)

    if member.id == user.id and (
        changes.get("status") == UserStatus.INACTIVE.value
        or changes.get("role") == UserRole.STAFF.value
    ):
        raise ValidationError(
            "You cannot deactivate or demote your own account",
            error_code=UserErrorCode.CANNOT_CHANGE_SELF,
        )

    before = staff_read(member).model_dump(include={"name", "role", "permissions", "status"})
    for field, value in changes.items():
        setattr(member, field, value.strip() if field == "name" and value else value)
    if member.role == UserRole.ADMIN.value:
        member.permissions = None

    if changes.get("status") == UserStatus.INACTIVE.value:
        await RefreshTokenRepository(session).revoke_all_for_user(member.id)

    await record_activity(
        session,
        user,
        "staff.updated",
        "staff",
        member.id,
        summary=f"Updated {member.email or member.phone}",
        changes={"before": before, "after": changes},
        request=request,
        commit=False,
    )
    await session.commit()
    return ok(staff_read(member), message="Staff account updated")


@router.post(
    "/{staff_id}/password",
    response_model=ApiResponse[StaffRead],
    summary="Set a new password and sign the account out everywhere",
)
async def reset_staff_password(
    staff_id: UUID,
    data: StaffPasswordReset,
    request: Request,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[StaffRead]:
    member = await _get_staff(session, user.tenant_id, staff_id)
    member.password_hash = await hash_password(data.password)
    await RefreshTokenRepository(session).revoke_all_for_user(member.id)
    await record_activity(
        session,
        user,
        "staff.password_reset",
        "staff",
        member.id,
        summary=f"Reset password for {member.email or member.phone}",
        request=request,
        commit=False,
    )
    await session.commit()
    return ok(staff_read(member), message="Password updated")
