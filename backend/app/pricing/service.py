from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, timezone
from decimal import Decimal
from uuid import UUID

from sqlalchemy import and_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.core.money import ZERO, money
from app.pricing.constants import (
    DEFAULT_MAX_DELIVERY_DAYS,
    DEFAULT_MIN_DELIVERY_DAYS,
    PERCENT,
)
from app.pricing.gst import STATE_CODES, state_code_for
from app.pricing.models import GstSettings, PincodeRule, ShippingSettings, TaxSettings
from app.pricing.repository import (
    GstSettingsRepository,
    PincodeRuleRepository,
    ShippingSettingsRepository,
    TaxSettingsRepository,
)
from app.pricing.schemas import (
    GstSettingsUpdate,
    PincodeRuleWrite,
    ShippingSettingsUpdate,
    TaxSettingsUpdate,
)

SAVE_FAILED = "Unable to save the settings, please try again"


class ShippingService:
    """One flat delivery charge per tenant, optionally free above a threshold."""

    def __init__(self, session: AsyncSession, tenant_id: UUID) -> None:
        self.session = session
        self.tenant_id = tenant_id
        self.settings = ShippingSettingsRepository(session, tenant_id)

    async def get_settings(self) -> ShippingSettings | None:
        return await self.settings.get_for_tenant()

    async def update_settings(self, data: ShippingSettingsUpdate) -> ShippingSettings:
        """Write the tenant's one row, creating it the first time."""
        settings = await self.get_settings()

        try:
            if settings is None:
                settings = ShippingSettings(
                    shipping_amount=data.shipping_amount,
                    free_shipping_minimum=data.free_shipping_minimum,
                    is_active=data.is_active,
                    min_delivery_days=data.min_delivery_days,
                    max_delivery_days=data.max_delivery_days,
                    restrict_to_listed_pincodes=data.restrict_to_listed_pincodes,
                )
                await self.settings.add(settings)
            else:
                settings.shipping_amount = data.shipping_amount
                settings.free_shipping_minimum = data.free_shipping_minimum
                settings.is_active = data.is_active
                settings.min_delivery_days = data.min_delivery_days
                settings.max_delivery_days = data.max_delivery_days
                settings.restrict_to_listed_pincodes = data.restrict_to_listed_pincodes

            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError(SAVE_FAILED) from exc

        return settings

    async def calculate(self, subtotal: Decimal, rule: PincodeRule | None = None) -> Decimal:
        """What this basket costs to deliver; a pincode rule may replace the flat charge."""
        settings = await self.get_settings()

        if settings is None or not settings.is_active:
            return ZERO

        minimum = settings.free_shipping_minimum
        if minimum is not None and subtotal >= minimum:
            return ZERO

        if rule is not None and rule.shipping_amount is not None:
            return money(rule.shipping_amount)
        return money(settings.shipping_amount)


class TaxService:
    """One tax percentage per tenant, charged on the goods and the delivery."""

    def __init__(self, session: AsyncSession, tenant_id: UUID) -> None:
        self.session = session
        self.tenant_id = tenant_id
        self.settings = TaxSettingsRepository(session, tenant_id)

    async def get_settings(self) -> TaxSettings | None:
        return await self.settings.get_for_tenant()

    async def update_settings(self, data: TaxSettingsUpdate) -> TaxSettings:
        """Write the tenant's one row, creating it the first time."""
        settings = await self.get_settings()

        try:
            if settings is None:
                settings = TaxSettings(
                    tax_percentage=data.tax_percentage, is_active=data.is_active
                )
                await self.settings.add(settings)
            else:
                settings.tax_percentage = data.tax_percentage
                settings.is_active = data.is_active

            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError(SAVE_FAILED) from exc

        return settings

    async def calculate(self, subtotal: Decimal, shipping: Decimal) -> Decimal:
        """Tax on the goods and the delivery together."""
        settings = await self.get_settings()

        if settings is None or not settings.is_active:
            return ZERO

        taxable = subtotal + shipping
        return money(taxable * settings.tax_percentage / PERCENT)


@dataclass
class DeliveryQuote:
    """Whether, how fast and for how much a pincode is delivered to."""

    pincode: str
    serviceable: bool
    rule: PincodeRule | None
    min_days: int | None = None
    max_days: int | None = None
    earliest: date | None = None
    latest: date | None = None
    shipping_amount: Decimal | None = None
    free_shipping_minimum: Decimal | None = None

    @property
    def cod_allowed_here(self) -> bool:
        return self.serviceable and (self.rule is None or self.rule.cod_available)


def today() -> date:
    return datetime.now(timezone.utc).date()


class DeliveryService:
    """Pincode serviceability, delivery estimates and delivery cost."""

    def __init__(self, session: AsyncSession, tenant_id: UUID) -> None:
        self.session = session
        self.tenant_id = tenant_id
        self.rules = PincodeRuleRepository(session, tenant_id)
        self.shipping = ShippingService(session, tenant_id)

    async def quote(self, pincode: str, subtotal: Decimal) -> DeliveryQuote:
        code = pincode.strip()
        settings = await self.shipping.get_settings()
        rule = await self.rules.get_by_pincode(code)

        if rule is not None:
            serviceable = rule.is_serviceable
        else:
            serviceable = not (settings is not None and settings.restrict_to_listed_pincodes)

        if not serviceable:
            return DeliveryQuote(pincode=code, serviceable=False, rule=rule)

        if rule is not None and rule.min_delivery_days is not None:
            min_days, max_days = rule.min_delivery_days, rule.max_delivery_days
        elif settings is not None:
            min_days, max_days = settings.min_delivery_days, settings.max_delivery_days
        else:
            min_days, max_days = DEFAULT_MIN_DELIVERY_DAYS, DEFAULT_MAX_DELIVERY_DAYS

        start = today()
        return DeliveryQuote(
            pincode=code,
            serviceable=True,
            rule=rule,
            min_days=min_days,
            max_days=max_days,
            earliest=start + timedelta(days=min_days),
            latest=start + timedelta(days=max_days),
            shipping_amount=await self.shipping.calculate(subtotal, rule),
            free_shipping_minimum=(
                settings.free_shipping_minimum if settings and settings.is_active else None
            ),
        )


class PincodeService:
    """Admin management of per-pincode delivery rules."""

    def __init__(self, session: AsyncSession, tenant_id: UUID) -> None:
        self.session = session
        self.tenant_id = tenant_id
        self.rules = PincodeRuleRepository(session, tenant_id)

    async def list(self, params, *, search=None, is_serviceable=None):
        stmt = self.rules.list_select(search=search, is_serviceable=is_serviceable)
        rows, total = await self.rules.paginate(stmt, params)
        return list(rows), total

    async def get(self, pincode: str) -> PincodeRule:
        rule = await self.rules.get_by_pincode(pincode)
        if rule is None:
            raise NotFoundError("No delivery rule for this pincode")
        return rule

    async def _write(self, pincode: str, data: PincodeRuleWrite) -> PincodeRule:
        rule = await self.rules.get_by_pincode(pincode)
        values = data.model_dump()
        if rule is None:
            rule = await self.rules.add(PincodeRule(pincode=pincode, **values))
        else:
            for field, value in values.items():
                setattr(rule, field, value)
        return rule

    async def upsert(self, pincode: str, data: PincodeRuleWrite) -> PincodeRule:
        try:
            rule = await self._write(pincode, data)
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError(SAVE_FAILED) from exc
        return rule

    async def bulk_upsert(self, items) -> int:
        try:
            for item in items:
                rule = PincodeRuleWrite(**item.model_dump(exclude={"pincode"}))
                await self._write(item.pincode, rule)
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError(SAVE_FAILED) from exc
        return len(items)

    async def delete(self, pincode: str) -> None:
        rule = await self.get(pincode)
        await self.rules.delete(rule)
        await self.session.commit()


class GstService:
    """The seller's GST identity and the GST report."""

    def __init__(self, session: AsyncSession, tenant_id: UUID) -> None:
        self.session = session
        self.tenant_id = tenant_id
        self.settings = GstSettingsRepository(session, tenant_id)

    async def get_settings(self) -> GstSettings | None:
        return await self.settings.get_for_tenant()

    async def update_settings(self, data: GstSettingsUpdate) -> GstSettings:
        state_code = None
        state_name = None
        if data.state:
            state_code = state_code_for(data.state)
            if state_code is None:
                raise ValidationError("Unknown Indian state or GST state code")
            state_name = STATE_CODES[state_code]

        if data.gstin and state_code and data.gstin[:2] != state_code:
            raise ValidationError("The GSTIN does not belong to the selected state")
        if data.gstin and state_code is None:
            state_code = data.gstin[:2]
            state_name = STATE_CODES.get(state_code)

        settings = await self.get_settings()
        values = {
            "gstin": data.gstin,
            "legal_name": data.legal_name,
            "address": data.address,
            "state": state_name,
            "state_code": state_code,
            "invoice_prefix": data.invoice_prefix,
            "shipping_sac_code": data.shipping_sac_code,
        }
        try:
            if settings is None:
                settings = await self.settings.add(GstSettings(**values))
            else:
                for field, value in values.items():
                    setattr(settings, field, value)
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError(SAVE_FAILED) from exc

        return settings

    async def report(self, start: date, end: date) -> dict:
        """Taxable value and CGST/SGST/IGST per GST type and rate, for non-cancelled orders."""
        from app.orders.constants import OrderStatus
        from app.orders.models import Order, OrderItem

        start_dt = datetime.combine(start, time.min, tzinfo=timezone.utc)
        end_dt = datetime.combine(end + timedelta(days=1), time.min, tzinfo=timezone.utc)
        in_range = and_(
            Order.tenant_id == self.tenant_id,
            Order.created_at >= start_dt,
            Order.created_at < end_dt,
            Order.status != OrderStatus.CANCELLED.value,
        )

        # The headline and rows must use the same order snapshots. Item-only sums
        # omit shipping/COD tax and can be zero for orders predating item tax fields.
        orders = (
            await self.session.execute(
                select(
                    Order.id, Order.gst_type, Order.subtotal, Order.discount_amount,
                    Order.shipping_amount, Order.cod_fee, Order.cgst_amount,
                    Order.sgst_amount, Order.igst_amount, Order.tax_amount,
                ).where(in_range)
            )
        ).all()
        by_order: dict[UUID, list[Decimal]] = {row[0]: [ZERO, ZERO, ZERO, ZERO] for row in orders}
        buckets: dict[tuple[str | None, Decimal | None, str], list[Decimal]] = {}

        def add(key: tuple[str | None, Decimal | None, str], amounts: list[Decimal]) -> None:
            bucket = buckets.setdefault(key, [ZERO, ZERO, ZERO, ZERO])
            for index, amount in enumerate(amounts):
                bucket[index] += amount

        items = (
            await self.session.execute(
                select(
                    Order.id, Order.gst_type, OrderItem.gst_rate,
                    OrderItem.subtotal, OrderItem.discount_amount,
                    OrderItem.taxable_amount, OrderItem.tax_amount,
                )
                .join(
                    OrderItem,
                    and_(
                        OrderItem.tenant_id == Order.tenant_id,
                        OrderItem.order_id == Order.id,
                    ),
                )
                .where(in_range)
            )
        ).all()
        for order_id, gst_type, rate, subtotal, discount, saved_taxable, saved_tax in items:
            taxable = saved_taxable if saved_taxable is not None else subtotal - (discount or ZERO)
            tax = saved_tax or ZERO
            if gst_type == "INTRA_STATE":
                cgst = money(tax / 2)
                amounts = [taxable, cgst, tax - cgst, ZERO]
            else:
                amounts = [taxable, ZERO, ZERO, tax]
            add((gst_type, rate, "ITEMS"), amounts)
            for index, amount in enumerate(amounts):
                by_order[order_id][index] += amount

        totals = [ZERO, ZERO, ZERO, ZERO]
        for (
            order_id, gst_type, subtotal, discount, shipping, cod_fee,
            cgst, sgst, igst, _tax,
        ) in orders:
            order_amounts = [subtotal - discount + shipping + cod_fee, cgst, sgst, igst]
            for index, amount in enumerate(order_amounts):
                totals[index] += amount
            remainder = [
                amount - used
                for amount, used in zip(order_amounts, by_order[order_id], strict=True)
            ]
            if any(amount != ZERO for amount in remainder):
                add((gst_type, None, "CHARGES_AND_ADJUSTMENTS"), remainder)

        by_rate = [
            {
                "component": component,
                "gst_type": gst_type,
                "gst_rate": rate,
                "taxable_amount": money(amounts[0]),
                "cgst_amount": money(amounts[1]),
                "sgst_amount": money(amounts[2]),
                "igst_amount": money(amounts[3]),
            }
            for (gst_type, rate, component), amounts in sorted(
                buckets.items(),
                key=lambda entry: (entry[0][0] or "", entry[0][2], entry[0][1] or ZERO),
            )
        ]
        taxable, cgst, sgst, igst = totals
        tax = cgst + sgst + igst
        return {
            "start_date": start,
            "end_date": end,
            "order_count": len(orders),
            "taxable_amount": money(taxable),
            "cgst_amount": money(cgst),
            "sgst_amount": money(sgst),
            "igst_amount": money(igst),
            "tax_amount": money(tax),
            "by_rate": by_rate,
        }
