from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.constants import UserRole
from app.core.config import get_settings
from app.core.database import get_db
from app.core.error_codes import CommonErrorCode, TenantErrorCode
from app.core.exceptions import NotFoundError, PermissionDeniedError
from app.core.responses import ApiResponse, ok
from app.tenants.models import Tenant
from app.tenants.repository import TenantRepository
from app.tenants.resolver import CurrentTenantOptional
from app.users.schemas import UserCreate, UserRead
from app.users.service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


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


async def _provision(
    *,
    role: UserRole,
    data: UserCreate,
    tenant: Tenant | None,
    tenant_id: UUID | None,
    session: AsyncSession,
    response: Response,
) -> ApiResponse[UserRead]:
    target = await _resolve_target_tenant(tenant, tenant_id, session)

    user, created = await UserService(session).create(
        role=role,
        tenant_id=target.id,
        email=data.email,
        phone=data.phone,
        name=data.name,
        password=data.password,
    )

    response.status_code = (
        status.HTTP_201_CREATED if created else status.HTTP_200_OK
    )

    return ok(
        UserRead.model_validate(user),
        message=f"{role.value.title()} {'created' if created else 'already exists'}",
    )


@router.post(
    "/admin",
    response_model=ApiResponse[UserRead],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_dev_environment)],
    summary="Create an admin user (development only)",
)
async def create_admin(
    data: UserCreate,
    response: Response,
    tenant: CurrentTenantOptional = None,
    tenant_id: UUID | None = Query(None, description="Target tenant id"),
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[UserRead]:
    return await _provision(
        role=UserRole.ADMIN,
        data=data,
        tenant=tenant,
        tenant_id=tenant_id,
        session=session,
        response=response,
    )


@router.post(
    "/staff",
    response_model=ApiResponse[UserRead],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_dev_environment)],
    summary="Create a staff user (development only)",
)
async def create_staff(
    data: UserCreate,
    response: Response,
    tenant: CurrentTenantOptional = None,
    tenant_id: UUID | None = Query(None, description="Target tenant id"),
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[UserRead]:
    return await _provision(
        role=UserRole.STAFF,
        data=data,
        tenant=tenant,
        tenant_id=tenant_id,
        session=session,
        response=response,
    )


@router.post(
    "/customer",
    response_model=ApiResponse[UserRead],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_dev_environment)],
    summary="Create a customer user (development only)",
)
async def create_customer(
    data: UserCreate,
    response: Response,
    tenant: CurrentTenantOptional = None,
    tenant_id: UUID | None = Query(None, description="Target tenant id"),
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[UserRead]:
    return await _provision(
        role=UserRole.CUSTOMER,
        data=data,
        tenant=tenant,
        tenant_id=tenant_id,
        session=session,
        response=response,
    )
