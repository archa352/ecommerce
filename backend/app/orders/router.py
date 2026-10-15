from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import require_admin, require_customer, require_staff
from app.core import rate_limit
from app.core.config import get_settings
from app.core.database import get_db
from app.core.pagination import PageParams
from app.core.responses import ApiResponse, ok, paginated
from app.orders.constants import MAX_IDEMPOTENCY_KEY_LENGTH
from app.orders.schemas import (
    CheckoutCreate,
    CheckoutPreview,
    CheckoutPreviewCreate,
    OrderQuery,
    OrderRead,
    OrderStatusUpdate,
    OrderSummaryRead,
)
from app.orders.serializers import order_read, order_summary_read
from app.orders.service import CheckoutService, OrderService
from app.payments.service import PaymentService
from app.tenants.resolver import CurrentTenant
from app.users.models import User

checkout_router = APIRouter(prefix="/checkout", tags=["Checkout"])

router = APIRouter(prefix="/orders", tags=["Orders"])

admin_router = APIRouter(prefix="/admin/orders", tags=["Admin-Order_management"])


@checkout_router.post(
    "/preview",
    response_model=ApiResponse[CheckoutPreview],
    summary="Price the cart before ordering",
)

async def preview_checkout(
    coupon_code: str | None = Query(
        default=None,
        min_length=1,
        max_length=50,
        description="Optional coupon code to preview",
    ),
    data: CheckoutPreviewCreate | None = None,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_customer),
) -> ApiResponse[CheckoutPreview]:
    preview = await CheckoutService(
        session, user.tenant_id, user.id
    ).preview(
        address_id=data.address_id if data else None,
        coupon_code=coupon_code,
        payment_method=data.payment_method if data else None,
    )
    return ok(preview, message="Checkout preview")


@checkout_router.post(
    "",
    response_model=ApiResponse[OrderRead],
    status_code=status.HTTP_201_CREATED,
    summary="Place the order",
)
async def place_order(
    data: CheckoutCreate,
    tenant: CurrentTenant,
    idempotency_key: str | None = Header(
        default=None,
        alias="Idempotency-Key",
        max_length=MAX_IDEMPOTENCY_KEY_LENGTH,
        description="Send the same key to retry safely; the original order comes back",
    ),
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_customer),
) -> ApiResponse[OrderRead]:
    settings = get_settings()
    await rate_limit.enforce(
        "checkout",
        str(user.tenant_id),
        str(user.id),
        limit=settings.checkout_rate_limit_attempts,
        window_seconds=settings.commerce_rate_limit_window_seconds,
    )

    order = await CheckoutService(session, user.tenant_id, user.id).place_order(
        data.address_id,
        data.coupon_code,
        idempotency_key=idempotency_key,
        payment_method=data.payment_method,
        currency=tenant.currency,
    )
    return ok(order_read(order, tenant.currency), message="Order placed")


@router.get(
    "",
    response_model=ApiResponse[list[OrderSummaryRead]],
    summary="List your orders",
)
async def list_my_orders(
    tenant: CurrentTenant,
    params: Annotated[PageParams, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_customer),
) -> ApiResponse[list[OrderSummaryRead]]:
    orders, total = await OrderService(session, user.tenant_id).list(
        params, customer_id=user.id
    )
    return paginated(
        [order_summary_read(order, tenant.currency) for order in orders],
        total_items=total,
        params=params,
        message="Orders retrieved",
    )


@router.post(
    "/{order_id}/cancel",
    response_model=ApiResponse[OrderRead],
    summary="Cancel one of your orders",
)
async def cancel_my_order(
    order_id: UUID,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_customer),
) -> ApiResponse[OrderRead]:
    order = await OrderService(session, user.tenant_id).cancel_for_customer(
        user.id, order_id
    )
    return ok(order_read(order, tenant.currency), message="Order cancelled")


@router.get(
    "/{order_id}",
    response_model=ApiResponse[OrderRead],
    summary="Retrieve one of your orders",
)
async def get_my_order(
    order_id: UUID,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_customer),
) -> ApiResponse[OrderRead]:
    order = await OrderService(session, user.tenant_id).get_for_customer(
        user.id, order_id
    )
    return ok(order_read(order, tenant.currency), message="Order retrieved")


@admin_router.get(
    "",
    response_model=ApiResponse[list[OrderSummaryRead]],
    summary="List orders",
)
async def list_orders(
    tenant: CurrentTenant,
    params: Annotated[OrderQuery, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[list[OrderSummaryRead]]:
    orders, total = await OrderService(session, user.tenant_id).list(
        params,
        order_number=params.order_number,
        status=params.status,
        payment_status=params.payment_status,
    )
    return paginated(
        [order_summary_read(order, tenant.currency) for order in orders],
        total_items=total,
        params=params,
        message="Orders retrieved",
    )


@admin_router.get(
    "/{order_id}",
    response_model=ApiResponse[OrderRead],
    summary="Retrieve an order",
)
async def get_order(
    order_id: UUID,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[OrderRead]:
    order = await OrderService(session, user.tenant_id).get(order_id)
    return ok(order_read(order, tenant.currency), message="Order retrieved")


@admin_router.patch(
    "/{order_id}/status",
    response_model=ApiResponse[OrderRead],
    summary="Move an order to its next status",
)
async def update_order_status(
    order_id: UUID,
    data: OrderStatusUpdate,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[OrderRead]:
    order = await OrderService(session, user.tenant_id).update_status(
        order_id, data.status
    )
    return ok(order_read(order, tenant.currency), message="Order status updated")


@admin_router.post(
    "/{order_id}/refund",
    response_model=ApiResponse[OrderRead],
    summary="Refund a cancelled order's online payment in full",
)
async def refund_order(
    order_id: UUID,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_admin),
) -> ApiResponse[OrderRead]:
    order = await PaymentService(session, user.tenant_id).refund(order_id)
    return ok(order_read(order, tenant.currency), message="Refund requested")
