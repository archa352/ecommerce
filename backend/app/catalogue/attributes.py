"""Managed value lists for fabric, occasion, sleeve and neckline.

The product editor offers the active values; products keep storing plain text,
so older free-text values stay valid. A value can only be renamed while no
product uses it (renaming would silently change those products' filters).
"""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.trail import AUDITED
from app.auth.dependencies import require_permission
from app.auth.permissions import Permission
from app.catalogue.constants import MAX_PRODUCT_ATTRIBUTE_LENGTH, ProductAttribute
from app.catalogue.models import Product, ProductAttributeValue
from app.core.database import get_db
from app.core.exceptions import ConflictError, NotFoundError
from app.core.responses import ApiResponse, ok
from app.core.schemas import PartialUpdate, StrictModel
from app.users.models import User

VALUE_NOT_FOUND = "Attribute value not found"
DUPLICATE = "This value is already in the list"


def _strip(value: str | None) -> str | None:
    if value is None:
        return value
    value = value.strip()
    if not value:
        raise ValueError("must not be blank")
    return value


class AttributeValueCreate(StrictModel):
    attribute: ProductAttribute
    value: str = Field(min_length=1, max_length=MAX_PRODUCT_ATTRIBUTE_LENGTH)
    is_active: bool = True

    _clean = field_validator("value")(_strip)


class AttributeValueUpdate(PartialUpdate):
    value: str | None = Field(default=None, min_length=1, max_length=MAX_PRODUCT_ATTRIBUTE_LENGTH)
    is_active: bool | None = None
    position: int | None = Field(default=None, ge=0)

    _clean = field_validator("value")(_strip)


class AttributeValueRead(BaseModel):
    id: UUID
    attribute: ProductAttribute
    value: str
    is_active: bool
    position: int
    product_count: int = Field(description="Products using this value (any status)")


class AttributeService:
    def __init__(self, session: AsyncSession, tenant_id: UUID) -> None:
        self.session = session
        self.tenant_id = tenant_id

    def _column(self, attribute: str):
        return getattr(Product, ProductAttribute(attribute).value)

    async def _usage(self, attribute: str, value: str) -> int:
        column = self._column(attribute)
        return int(
            await self.session.scalar(
                select(func.count(Product.id)).where(
                    Product.tenant_id == self.tenant_id, func.lower(column) == value.lower()
                )
            )
            or 0
        )

    async def read(self, item: ProductAttributeValue) -> AttributeValueRead:
        return AttributeValueRead(
            id=item.id,
            attribute=item.attribute,
            value=item.value,
            is_active=item.is_active,
            position=item.position,
            product_count=await self._usage(item.attribute, item.value),
        )

    async def list(
        self, attribute: ProductAttribute | None, active_only: bool
    ) -> list[ProductAttributeValue]:
        stmt = select(ProductAttributeValue).where(
            ProductAttributeValue.tenant_id == self.tenant_id
        )
        if attribute is not None:
            stmt = stmt.where(ProductAttributeValue.attribute == attribute.value)
        if active_only:
            stmt = stmt.where(ProductAttributeValue.is_active.is_(True))
        rows = await self.session.scalars(
            stmt.order_by(
                ProductAttributeValue.attribute,
                ProductAttributeValue.position,
                func.lower(ProductAttributeValue.value),
            )
        )
        return list(rows.all())

    async def get(self, value_id: UUID) -> ProductAttributeValue:
        item = await self.session.scalar(
            select(ProductAttributeValue).where(
                ProductAttributeValue.tenant_id == self.tenant_id,
                ProductAttributeValue.id == value_id,
            )
        )
        if item is None:
            raise NotFoundError(VALUE_NOT_FOUND)
        return item

    async def create(self, data: AttributeValueCreate) -> ProductAttributeValue:
        top = await self.session.scalar(
            select(func.max(ProductAttributeValue.position)).where(
                ProductAttributeValue.tenant_id == self.tenant_id,
                ProductAttributeValue.attribute == data.attribute.value,
            )
        )
        item = ProductAttributeValue(
            tenant_id=self.tenant_id,
            attribute=data.attribute.value,
            value=data.value,
            is_active=data.is_active,
            position=0 if top is None else top + 1,
        )
        self.session.add(item)
        await self._commit()
        await self.session.refresh(item)
        return item

    async def update(self, value_id: UUID, changes: dict) -> ProductAttributeValue:
        item = await self.get(value_id)
        new_value = changes.get("value")
        if new_value is not None and new_value != item.value:
            in_use = await self._usage(item.attribute, item.value)
            if in_use and new_value.lower() != item.value.lower():
                raise ConflictError(
                    f"{in_use} product(s) use '{item.value}'. Add a new value and "
                    "switch this one off instead of renaming it.",
                    error_code="VALUE_IN_USE",
                )
        for field, value in changes.items():
            setattr(item, field, value)
        await self._commit()
        await self.session.refresh(item)
        return item

    async def _commit(self) -> None:
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError(DUPLICATE) from exc


router = APIRouter(
    prefix="/catalogue/attributes", tags=["Admin-Catalogue_management"], dependencies=AUDITED
)

DB = Annotated[AsyncSession, Depends(get_db)]


@router.get(
    "",
    response_model=ApiResponse[list[AttributeValueRead]],
    summary="Managed values for fabric, occasion, sleeve and neckline",
)
async def list_attribute_values(
    session: DB,
    attribute: ProductAttribute | None = Query(default=None),
    active_only: bool = Query(default=False),
    user: User = Depends(require_permission(Permission.CATALOGUE_VIEW, legacy_staff=True)),
):
    service = AttributeService(session, user.tenant_id)
    rows = await service.list(attribute, active_only)
    return ok([await service.read(r) for r in rows], message="Attribute values")


@router.post(
    "",
    response_model=ApiResponse[AttributeValueRead],
    status_code=status.HTTP_201_CREATED,
    summary="Add a value to a list",
)
async def create_attribute_value(
    data: AttributeValueCreate,
    session: DB,
    user: User = Depends(require_permission(Permission.CATALOGUE_MANAGE)),
):
    service = AttributeService(session, user.tenant_id)
    return ok(await service.read(await service.create(data)), message="Value added")


@router.patch(
    "/{value_id}",
    response_model=ApiResponse[AttributeValueRead],
    summary="Rename (while unused), reorder or switch a value on/off",
)
async def update_attribute_value(
    value_id: UUID,
    data: AttributeValueUpdate,
    session: DB,
    user: User = Depends(require_permission(Permission.CATALOGUE_MANAGE)),
):
    service = AttributeService(session, user.tenant_id)
    item = await service.update(value_id, data.model_dump(exclude_unset=True))
    return ok(await service.read(item), message="Value updated")
