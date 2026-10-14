from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator

from app.catalogue.constants import HSN_CODE_PATTERN, PRICE_SCALE
from app.core.money import MAX_MONEY
from app.core.pagination import PageParams
from app.core.schemas import StrictModel
from app.orders.constants import GstType
from app.pricing.constants import (
    DEFAULT_INVOICE_PREFIX,
    DEFAULT_MAX_DELIVERY_DAYS,
    DEFAULT_MIN_DELIVERY_DAYS,
    GSTIN_PATTERN,
    MAX_DELIVERY_DAYS,
    MAX_TAX_PERCENTAGE,
    PINCODE_PATTERN,
)

Money = Field(default=None, ge=0, le=MAX_MONEY, decimal_places=PRICE_SCALE)
DeliveryDays = Field(ge=0, le=MAX_DELIVERY_DAYS)


class ShippingSettingsUpdate(StrictModel):
    shipping_amount: Decimal = Field(ge=0, le=MAX_MONEY, decimal_places=PRICE_SCALE)
    free_shipping_minimum: Decimal | None = Field(
        default=None, ge=0, le=MAX_MONEY, decimal_places=PRICE_SCALE
    )
    is_active: bool = True
    min_delivery_days: int = Field(default=DEFAULT_MIN_DELIVERY_DAYS, ge=0, le=MAX_DELIVERY_DAYS)
    max_delivery_days: int = Field(default=DEFAULT_MAX_DELIVERY_DAYS, ge=0, le=MAX_DELIVERY_DAYS)
    restrict_to_listed_pincodes: bool = Field(
        default=False,
        description="Deliver only to pincodes listed as serviceable",
    )

    @model_validator(mode="after")
    def _days_ordered(self) -> ShippingSettingsUpdate:
        if self.max_delivery_days < self.min_delivery_days:
            raise ValueError("max_delivery_days must not be less than min_delivery_days")
        return self


class ShippingSettingsRead(BaseModel):
    shipping_amount: Decimal
    free_shipping_minimum: Decimal | None
    is_active: bool
    min_delivery_days: int = DEFAULT_MIN_DELIVERY_DAYS
    max_delivery_days: int = DEFAULT_MAX_DELIVERY_DAYS
    restrict_to_listed_pincodes: bool = False


class TaxSettingsUpdate(StrictModel):
    tax_percentage: Decimal = Field(ge=0, le=MAX_TAX_PERCENTAGE, decimal_places=2)
    is_active: bool = True


class TaxSettingsRead(BaseModel):
    tax_percentage: Decimal
    is_active: bool


# ---------------------------------------------------------------- pincodes


Pincode = Field(pattern=PINCODE_PATTERN, description="6-digit Indian pincode")


class PincodeRuleWrite(StrictModel):
    """Delivery rules for one pincode (PUT replaces them)."""

    is_serviceable: bool = True
    cod_available: bool = True
    min_delivery_days: int | None = Field(default=None, ge=0, le=MAX_DELIVERY_DAYS)
    max_delivery_days: int | None = Field(default=None, ge=0, le=MAX_DELIVERY_DAYS)
    shipping_amount: Decimal | None = Money
    city: str | None = Field(default=None, max_length=100)
    state: str | None = Field(default=None, max_length=100)

    @model_validator(mode="after")
    def _days_together(self) -> PincodeRuleWrite:
        if (self.min_delivery_days is None) != (self.max_delivery_days is None):
            raise ValueError("set both min_delivery_days and max_delivery_days, or neither")
        if (
            self.min_delivery_days is not None
            and self.max_delivery_days is not None
            and self.max_delivery_days < self.min_delivery_days
        ):
            raise ValueError("max_delivery_days must not be less than min_delivery_days")
        return self


class PincodeRuleBulkItem(PincodeRuleWrite):
    pincode: str = Pincode


class PincodeRuleBulk(StrictModel):
    rules: list[PincodeRuleBulkItem] = Field(min_length=1, max_length=1000)

    @field_validator("rules")
    @classmethod
    def _unique(cls, value: list[PincodeRuleBulkItem]) -> list[PincodeRuleBulkItem]:
        codes = [rule.pincode for rule in value]
        if len(codes) != len(set(codes)):
            raise ValueError("each pincode may only appear once")
        return value


class PincodeRuleRead(BaseModel):
    pincode: str
    is_serviceable: bool
    cod_available: bool
    min_delivery_days: int | None
    max_delivery_days: int | None
    shipping_amount: Decimal | None
    city: str | None
    state: str | None


class PincodeQuery(PageParams):
    search: str | None = Field(default=None, max_length=6, description="Pincode prefix")
    is_serviceable: bool | None = None


class DeliveryCheckQuery(StrictModel):
    pincode: str = Pincode
    subtotal: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        le=MAX_MONEY,
        description="Basket value, so a free-shipping threshold can apply",
    )


class DeliveryCheckRead(BaseModel):
    """Everything the pincode box on the product or cart page shows."""

    pincode: str
    serviceable: bool
    message: str
    min_delivery_days: int | None = None
    max_delivery_days: int | None = None
    earliest_delivery_date: date | None = None
    estimated_delivery_date: date | None = None
    shipping_amount: Decimal | None = None
    free_shipping_minimum: Decimal | None = None
    cod_available: bool = False
    currency: str


# ---------------------------------------------------------------- GST


class GstSettingsUpdate(StrictModel):
    gstin: str | None = Field(default=None, pattern=GSTIN_PATTERN)
    legal_name: str | None = Field(default=None, max_length=200)
    address: str | None = Field(default=None, max_length=500)
    state: str | None = Field(
        default=None, max_length=100, description="Seller state name or 2-digit GST code"
    )
    invoice_prefix: str = Field(default=DEFAULT_INVOICE_PREFIX, min_length=1, max_length=20)
    shipping_sac_code: str | None = Field(default=None, pattern=HSN_CODE_PATTERN)

    @field_validator("gstin")
    @classmethod
    def _upper(cls, value: str | None) -> str | None:
        return value.upper() if value else value


class GstSettingsRead(BaseModel):
    gstin: str | None = None
    legal_name: str | None = None
    address: str | None = None
    state: str | None = None
    state_code: str | None = None
    invoice_prefix: str = DEFAULT_INVOICE_PREFIX
    shipping_sac_code: str | None = None


class GstReportQuery(StrictModel):
    start_date: date
    end_date: date

    @model_validator(mode="after")
    def _ordered(self) -> GstReportQuery:
        if self.end_date < self.start_date:
            raise ValueError("end_date must not be before start_date")
        return self


class GstReportRow(BaseModel):
    component: Literal["ITEMS", "CHARGES_AND_ADJUSTMENTS"] = "ITEMS"
    gst_type: GstType | None
    gst_rate: Decimal | None
    taxable_amount: Decimal
    cgst_amount: Decimal
    sgst_amount: Decimal
    igst_amount: Decimal


class GstReportRead(BaseModel):
    start_date: date
    end_date: date
    order_count: int
    taxable_amount: Decimal
    cgst_amount: Decimal
    sgst_amount: Decimal
    igst_amount: Decimal
    tax_amount: Decimal
    by_rate: list[GstReportRow]
    currency: str
