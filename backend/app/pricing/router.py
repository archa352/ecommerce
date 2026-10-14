from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.trail import AUDITED
from app.auth.dependencies import require_permission
from app.auth.permissions import Permission
from app.cod.service import CodService
from app.core.database import get_db
from app.core.responses import ApiResponse, ok, paginated
from app.pricing.constants import PINCODE_PATTERN
from app.pricing.schemas import (
    DeliveryCheckQuery,
    DeliveryCheckRead,
    GstReportQuery,
    GstReportRead,
    GstSettingsRead,
    GstSettingsUpdate,
    PincodeQuery,
    PincodeRuleBulk,
    PincodeRuleRead,
    PincodeRuleWrite,
    ShippingSettingsRead,
    ShippingSettingsUpdate,
    TaxSettingsRead,
    TaxSettingsUpdate,
)
from app.pricing.serializers import gst_read, pincode_read, shipping_read, tax_read
from app.pricing.service import (
    DeliveryService,
    GstService,
    PincodeService,
    ShippingService,
    TaxService,
)
from app.tenants.resolver import CurrentTenant
from app.users.models import User

shipping_router = APIRouter(prefix="/admin/shipping", tags=["Admin-Shipping"], dependencies=AUDITED)

tax_router = APIRouter(prefix="/admin/tax", tags=["Admin-Tax"], dependencies=AUDITED)


@shipping_router.get(
    "",
    response_model=ApiResponse[ShippingSettingsRead],
    summary="View the delivery charge",
)
async def get_shipping_settings(
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_VIEW, legacy_staff=True)),
) -> ApiResponse[ShippingSettingsRead]:
    settings = await ShippingService(session, user.tenant_id).get_settings()
    return ok(shipping_read(settings), message="Shipping settings retrieved")


@shipping_router.put(
    "",
    response_model=ApiResponse[ShippingSettingsRead],
    summary="Set the delivery charge",
)
async def update_shipping_settings(
    data: ShippingSettingsUpdate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_MANAGE)),
) -> ApiResponse[ShippingSettingsRead]:
    settings = await ShippingService(session, user.tenant_id).update_settings(data)
    return ok(shipping_read(settings), message="Shipping settings updated")


@tax_router.get(
    "",
    response_model=ApiResponse[TaxSettingsRead],
    summary="View the tax rate",
)
async def get_tax_settings(
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_VIEW, legacy_staff=True)),
) -> ApiResponse[TaxSettingsRead]:
    settings = await TaxService(session, user.tenant_id).get_settings()
    return ok(tax_read(settings), message="Tax settings retrieved")


@tax_router.put(
    "",
    response_model=ApiResponse[TaxSettingsRead],
    summary="Set the tax rate",
)
async def update_tax_settings(
    data: TaxSettingsUpdate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_MANAGE)),
) -> ApiResponse[TaxSettingsRead]:
    settings = await TaxService(session, user.tenant_id).update_settings(data)
    return ok(tax_read(settings), message="Tax settings updated")


pincode_router = APIRouter(prefix="/admin/pincodes", tags=["Admin-Delivery"], dependencies=AUDITED)

gst_router = APIRouter(prefix="/admin/gst", tags=["Admin-GST"], dependencies=AUDITED)

delivery_router = APIRouter(prefix="/storefront/delivery", tags=["Delivery"])


@delivery_router.get(
    "/check",
    response_model=ApiResponse[DeliveryCheckRead],
    summary="Is this pincode served, by when, and for how much?",
)
async def check_delivery(
    tenant: CurrentTenant,
    params: Annotated[DeliveryCheckQuery, Query()],
    session: AsyncSession = Depends(get_db),
) -> ApiResponse[DeliveryCheckRead]:
    quote = await DeliveryService(session, tenant.id).quote(params.pincode, params.subtotal)
    cod_ok = False
    if quote.cod_allowed_here:
        cod = await CodService(session, tenant.id).get_settings()
        cod_ok = cod is None or cod.is_enabled
    return ok(
        DeliveryCheckRead(
            pincode=quote.pincode,
            serviceable=quote.serviceable,
            message=(
                f"Delivery in {quote.min_days}-{quote.max_days} days"
                if quote.serviceable
                else "Sorry, we do not deliver to this pincode yet"
            ),
            min_delivery_days=quote.min_days,
            max_delivery_days=quote.max_days,
            earliest_delivery_date=quote.earliest,
            estimated_delivery_date=quote.latest,
            shipping_amount=quote.shipping_amount,
            free_shipping_minimum=quote.free_shipping_minimum,
            cod_available=cod_ok,
            currency=tenant.currency,
        ),
        message="Delivery checked",
    )


@pincode_router.get(
    "",
    response_model=ApiResponse[list[PincodeRuleRead]],
    summary="List pincode delivery rules",
)
async def list_pincodes(
    params: Annotated[PincodeQuery, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_VIEW, legacy_staff=True)),
) -> ApiResponse[list[PincodeRuleRead]]:
    rules, total = await PincodeService(session, user.tenant_id).list(
        params, search=params.search, is_serviceable=params.is_serviceable
    )
    return paginated(
        [pincode_read(rule) for rule in rules],
        total_items=total,
        params=params,
        message="Pincode rules retrieved",
    )


@pincode_router.post(
    "/bulk",
    response_model=ApiResponse[dict],
    summary="Create or replace many pincode rules at once",
)
async def bulk_upsert_pincodes(
    data: PincodeRuleBulk,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_MANAGE)),
) -> ApiResponse[dict]:
    count = await PincodeService(session, user.tenant_id).bulk_upsert(data.rules)
    return ok({"saved": count}, message="Pincode rules saved")


@pincode_router.get(
    "/{pincode}",
    response_model=ApiResponse[PincodeRuleRead],
    summary="View one pincode's delivery rule",
)
async def get_pincode(
    pincode: Annotated[str, Path(pattern=PINCODE_PATTERN)],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_VIEW, legacy_staff=True)),
) -> ApiResponse[PincodeRuleRead]:
    rule = await PincodeService(session, user.tenant_id).get(pincode)
    return ok(pincode_read(rule), message="Pincode rule retrieved")


@pincode_router.put(
    "/{pincode}",
    response_model=ApiResponse[PincodeRuleRead],
    summary="Create or replace one pincode's delivery rule",
)
async def upsert_pincode(
    pincode: Annotated[str, Path(pattern=PINCODE_PATTERN)],
    data: PincodeRuleWrite,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_MANAGE)),
) -> ApiResponse[PincodeRuleRead]:
    rule = await PincodeService(session, user.tenant_id).upsert(pincode, data)
    return ok(pincode_read(rule), message="Pincode rule saved")


@pincode_router.delete(
    "/{pincode}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove a pincode rule (back to the default)",
)
async def delete_pincode(
    pincode: Annotated[str, Path(pattern=PINCODE_PATTERN)],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_MANAGE)),
) -> Response:
    await PincodeService(session, user.tenant_id).delete(pincode)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@gst_router.get(
    "",
    response_model=ApiResponse[GstSettingsRead],
    summary="View the seller's GST details",
)
async def get_gst_settings(
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_VIEW, legacy_staff=True)),
) -> ApiResponse[GstSettingsRead]:
    settings = await GstService(session, user.tenant_id).get_settings()
    return ok(gst_read(settings), message="GST settings retrieved")


@gst_router.put(
    "",
    response_model=ApiResponse[GstSettingsRead],
    summary="Set the seller's GSTIN, legal name, address and state",
)
async def update_gst_settings(
    data: GstSettingsUpdate,
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.SETTINGS_MANAGE)),
) -> ApiResponse[GstSettingsRead]:
    settings = await GstService(session, user.tenant_id).update_settings(data)
    return ok(gst_read(settings), message="GST settings updated")


@gst_router.get(
    "/report",
    response_model=ApiResponse[GstReportRead],
    summary="Taxable value and CGST/SGST/IGST for a date range",
)
async def gst_report(
    tenant: CurrentTenant,
    params: Annotated[GstReportQuery, Query()],
    session: AsyncSession = Depends(get_db),
    user: User = Depends(require_permission(Permission.REPORTS_VIEW)),
) -> ApiResponse[GstReportRead]:
    report = await GstService(session, user.tenant_id).report(params.start_date, params.end_date)
    return ok(GstReportRead(**report, currency=tenant.currency), message="GST report")
