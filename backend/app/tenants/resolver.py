from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_db
from app.core.error_codes import TenantErrorCode
from app.core.exceptions import NotFoundError
from app.core.logging import get_logger
from app.tenants.models import Tenant
from app.tenants.repository import TenantRepository

logger = get_logger("tenants")

LOOPBACK_HOSTS = frozenset({"localhost", "127.0.0.1", "[::1]", "0.0.0.0"})


def normalize_hostname(value: str | None) -> str | None:
    if not value:
        return None

    host = value.strip().lower()
    if host.startswith("["):
        return host.partition("]")[0] + "]"

    return host.partition(":")[0].rstrip(".") or None


def request_hostname(request: Request) -> str | None:
    if get_settings().trust_forwarded_host:
        forwarded = request.headers.get("x-forwarded-host")
        if forwarded:
            return normalize_hostname(forwarded.split(",")[0])

    return normalize_hostname(request.headers.get("host"))


async def resolve_tenant(
    request: Request,
    session: AsyncSession = Depends(get_db),
) -> Tenant:
    hostname = request_hostname(request)
    repository = TenantRepository(session)

    tenant = await repository.get_active_by_domain(hostname) if hostname else None

    settings = get_settings()
    if tenant is None and not settings.is_production and hostname in LOOPBACK_HOSTS:
        tenant = await repository.get_active_by_slug(settings.seed_tenant_slug)
        if tenant is not None:
            logger.debug(
                "tenants.dev_fallback host=%s tenant_id=%s", hostname, tenant.id
            )

    if tenant is None:
        raise NotFoundError(
            "Unknown storefront domain", error_code=TenantErrorCode.UNKNOWN_STOREFRONT
        )

    return tenant


CurrentTenant = Annotated[Tenant, Depends(resolve_tenant)]


async def resolve_tenant_optional(
    request: Request,
    session: AsyncSession = Depends(get_db),
) -> Tenant | None:
    try:
        return await resolve_tenant(request, session)
    except NotFoundError:
        return None


CurrentTenantOptional = Annotated[Tenant | None, Depends(resolve_tenant_optional)]
