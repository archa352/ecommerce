from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.schemas import PartialUpdate, StrictModel
from app.returns.models import MAX_REASON_LENGTH


def _strip(value: str | None) -> str | None:
    if value is None:
        return value
    value = value.strip()
    if not value:
        raise ValueError("must not be blank")
    return value


class ReturnReasonCreate(StrictModel):
    label: str = Field(min_length=1, max_length=MAX_REASON_LENGTH)
    is_active: bool = True

    _clean = field_validator("label")(_strip)


class ReturnReasonUpdate(PartialUpdate):
    label: str | None = Field(default=None, min_length=1, max_length=MAX_REASON_LENGTH)
    is_active: bool | None = None
    position: int | None = Field(default=None, ge=0)

    _clean = field_validator("label")(_strip)


class ReturnReasonRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    label: str
    is_active: bool
    position: int
