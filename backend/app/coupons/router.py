
from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import require_admin, require_customer, require_staff
from app.core import rate_limit
from app.core.config import get_settings
from app.core.database import get_db
from app.core.responses import ApiResponse, ok, paginated
from app.coupons.schemas import (
    CouponApplyRequest,
    CouponApplyResponse,
    CouponCreate,
    CouponQuery,
    CouponRead,
    CouponUpdate,
)
from app.coupons.serializers import coupon_read
from app.coupons.service import CouponService
from app.orders.service import CheckoutService
from app.tenants.resolver import CurrentTenant
from app.users.models import User

router = APIRouter(prefix="/coupons", tags=["Coupons"])

admin_router = APIRouter(prefix="/admin/coupons", tags=["Admin-Coupons"])

@admin_router.get(
    "",
    response_model=ApiResponse[list[CouponRead]],
    summary="List all coupons",
)
async def list_coupons(
    tenant: CurrentTenant,
    params: Annotated[CouponQuery, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[list[CouponRead]]:
    coupons, total = await CouponService(session, user.tenant_id).list(
        params, active_only=params.active_only
    )
    return paginated(
        [coupon_read(coupon, tenant.currency) for coupon in coupons],
        total_items=total,
        params=params,
        message="Coupons retrieved",
    )


@admin_router.post(
    "",
    response_model=ApiResponse[CouponRead],
    summary="Create a coupon",
)
async def create_coupon(
    data: CouponCreate,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[CouponRead]:
    coupon = await CouponService(session, user.tenant_id).create(data)
    return ok(coupon_read(coupon, tenant.currency), message="Coupon created")


@admin_router.get(
    "/{coupon_id}",
    response_model=ApiResponse[CouponRead],
    summary="Retrieve a coupon",
)
async def get_coupon(
    coupon_id: UUID,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[CouponRead]:
    coupon = await CouponService(session, user.tenant_id).get(coupon_id)
    return ok(coupon_read(coupon, tenant.currency), message="Coupon retrieved")


@admin_router.put(
    "/{coupon_id}",
    response_model=ApiResponse[CouponRead],
    summary="Update a coupon",
)
async def update_coupon(
    coupon_id: UUID,
    data: CouponUpdate,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[CouponRead]:
    coupon = await CouponService(session, user.tenant_id).update(coupon_id, data)
    return ok(coupon_read(coupon, tenant.currency), message="Coupon updated")


@admin_router.delete(
    "/{coupon_id}",
    response_model=ApiResponse[None],
    summary="Delete a coupon",
)
async def delete_coupon(
    coupon_id: UUID,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[None]:
    await CouponService(session, user.tenant_id).delete(coupon_id)
    return ok(None, message="Coupon deleted")


@router.post(
    "/apply",
    response_model=ApiResponse[CouponApplyResponse],
    summary="Validate a coupon code against your cart and calculate its discount",
)
async def apply_coupon(
    data: CouponApplyRequest,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_customer),
) -> ApiResponse[CouponApplyResponse]:
    settings = get_settings()
    await rate_limit.enforce(
        "coupon-apply",
        str(user.tenant_id),
        str(user.id),
        limit=settings.coupon_apply_rate_limit_attempts,
        window_seconds=settings.commerce_rate_limit_window_seconds,
    )

    preview = await CheckoutService(session, user.tenant_id, user.id).preview(
        coupon_code=data.code
    )

    return ok(
        CouponApplyResponse(
            code=preview.coupon_code,
            discount_amount=preview.discount_amount,
            currency=tenant.currency,
        ),
        message="Coupon applied successfully",
    )

