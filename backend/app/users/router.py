from __future__ import annotations

from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.constants import UserRole
from app.auth.dependencies import require_admin
from app.auth.permissions import PERMISSION_DESCRIPTIONS
from app.core.config import get_settings
from app.core.database import get_db
from app.core.error_codes import CommonErrorCode, TenantErrorCode
from app.core.exceptions import NotFoundError, PermissionDeniedError
from app.core.responses import ApiResponse, ok, paginated
from app.tenants.models import Tenant
from app.tenants.repository import TenantRepository
from app.tenants.resolver import CurrentTenantOptional
from app.users.models import User
from app.users.schemas import (
    PermissionRead,
    StaffCreate,
    StaffPasswordReset,
    StaffQuery,
    StaffRead,
    StaffUpdate,
    UserCreate,
    UserRead,
)
from app.users.service import StaffService, UserService

router = APIRouter(prefix="/users", tags=["Users"])

admin_router = APIRouter(prefix="/admin/staff", tags=["Admin-Staff"])


# ------------------------------------------------- provisioning (development only)


def require_dev_environment() -> None:
    """Refuse to serve these routes outside development."""
    settings = get_settings()
    if settings.is_production:
        raise PermissionDeniedError(
            "User provisioning endpoints are disabled outside development",
            error_code=CommonErrorCode.DEV_ONLY_ENDPOINT,
        )


async def _resolve_target_tenant(
    tenant: Tenant | None,
    tenant_id: UUID | None,
    session: AsyncSession,
) -> Tenant:
    """Pick the tenant to provision into: domain, explicit id, then the sole tenant."""
    if tenant is not None:
        return tenant

    if tenant_id is not None:
        found = await TenantRepository(session).get_active_by_id(tenant_id)
        if found is None:
            raise NotFoundError("Tenant not found", error_code=TenantErrorCode.UNKNOWN_TENANT)
        return found

    candidates = (
        await session.scalars(
            select(Tenant).where(Tenant.is_active.is_(True)).order_by(Tenant.name).limit(2)
        )
    ).all()

    if not candidates:
        raise NotFoundError("No active tenant exists", error_code=TenantErrorCode.UNKNOWN_TENANT)
    if len(candidates) > 1:
        raise NotFoundError(
            "Several active tenants exist -- pass ?tenant_id= to choose one",
            error_code=TenantErrorCode.AMBIGUOUS_TENANT,
        )

    return candidates[0]


@router.post(
    "/{role}",
    response_model=ApiResponse[UserRead],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_dev_environment)],
    summary="Create an admin, staff or customer user (development only)",
)
async def provision_user(
    role: Literal["admin", "staff", "customer"],
    data: UserCreate,
    response: Response,
    tenant: CurrentTenantOptional = None,
    tenant_id: UUID | None = Query(None, description="Target tenant id"),
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[UserRead]:
    user_role = UserRole(role.upper())
    target = await _resolve_target_tenant(tenant, tenant_id, session)

    user, created = await UserService(session).create(
        role=user_role,
        tenant_id=target.id,
        email=data.email,
        phone=data.phone,
        name=data.name,
        password=data.password,
    )

    response.status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
    return ok(
        UserRead.model_validate(user),
        message=f"{user_role.value.title()} {'created' if created else 'already exists'}",
    )


# ------------------------------------------------------------- staff accounts


@admin_router.get(
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


@admin_router.get("", response_model=ApiResponse[list[StaffRead]], summary="List staff accounts")
async def list_staff(
    params: Annotated[StaffQuery, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[list[StaffRead]]:
    members, total = await StaffService(session, user).list(params)
    return paginated(
        [StaffRead.of(member) for member in members],
        total_items=total,
        params=params,
        message="Staff retrieved",
    )


@admin_router.post(
    "",
    response_model=ApiResponse[StaffRead],
    status_code=status.HTTP_201_CREATED,
    summary="Create an individual staff or admin login",
)
async def create_staff_account(
    data: StaffCreate,
    request: Request,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[StaffRead]:
    member = await StaffService(session, user).create(data, request)
    return ok(StaffRead.of(member), message="Staff account created")


@admin_router.get(
    "/{staff_id}", response_model=ApiResponse[StaffRead], summary="One staff account"
)
async def get_staff(
    staff_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[StaffRead]:
    return ok(StaffRead.of(await StaffService(session, user).get(staff_id)), message="Staff")


@admin_router.patch(
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
    member = await StaffService(session, user).update(staff_id, data, request)
    return ok(StaffRead.of(member), message="Staff account updated")


@admin_router.post(
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
    member = await StaffService(session, user).reset_password(staff_id, data, request)
    return ok(StaffRead.of(member), message="Password updated")
