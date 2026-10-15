from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import require_customer, require_staff
from app.core.database import get_db
from app.core.responses import ApiResponse, ok, paginated
from app.payments.schemas import PaymentQuery, PaymentRead, RazorpayVerification
from app.payments.serializers import payment_read
from app.payments.service import PaymentService, handle_razorpay_webhook
from app.tenants.resolver import CurrentTenant
from app.users.models import User

router = APIRouter(prefix="/payments", tags=["Payments"])

admin_router = APIRouter(prefix="/admin/payments", tags=["Admin-Payments"])


@router.post(
    "/razorpay/verify",
    response_model=ApiResponse[PaymentRead],
    summary="Confirm a Razorpay Checkout payment by its signature and capture",
)
async def verify_razorpay_payment(
    data: RazorpayVerification,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_customer),
) -> ApiResponse[PaymentRead]:
    payment = await PaymentService(session, user.tenant_id).verify_razorpay(
        user.id, data, tenant.currency
    )
    return ok(payment_read(payment, tenant.currency), message="Payment verified")


@router.post(
    "/razorpay/webhook",
    response_model=ApiResponse[dict[str, str]],
    summary="Receive a signed Razorpay account webhook, for any tenant",
)
async def razorpay_webhook(
    request: Request,
    signature: str | None = Header(default=None, alias="X-Razorpay-Signature"),
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[dict[str, str]]:
    result = await handle_razorpay_webhook(session, await request.body(), signature)
    return ok({"result": result}, message="Webhook received")


@router.get(
    "/{payment_id}",
    response_model=ApiResponse[PaymentRead],
    summary="Retrieve one of your payments",
)
async def get_my_payment(
    payment_id: UUID,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_customer),
) -> ApiResponse[PaymentRead]:
    payment = await PaymentService(session, user.tenant_id).get_for_customer(
        user.id, payment_id
    )
    return ok(payment_read(payment, tenant.currency), message="Payment retrieved")


@admin_router.get(
    "",
    response_model=ApiResponse[list[PaymentRead]],
    summary="List payments",
)
async def list_payments(
    tenant: CurrentTenant,
    params: Annotated[PaymentQuery, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[list[PaymentRead]]:
    payments, total = await PaymentService(session, user.tenant_id).list(
        params, order_id=params.order_id, status=params.status
    )
    return paginated(
        [payment_read(payment, tenant.currency) for payment in payments],
        total_items=total,
        params=params,
        message="Payments retrieved",
    )


@admin_router.get(
    "/{payment_id}",
    response_model=ApiResponse[PaymentRead],
    summary="Retrieve a payment",
)
async def get_payment(
    payment_id: UUID,
    tenant: CurrentTenant,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_staff),
) -> ApiResponse[PaymentRead]:
    payment = await PaymentService(session, user.tenant_id).get(payment_id)
    return ok(payment_read(payment, tenant.currency), message="Payment retrieved")
