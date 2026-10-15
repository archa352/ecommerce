from __future__ import annotations

from typing import Annotated
from uuid import UUID

from pydantic import AfterValidator, BaseModel, ConfigDict, EmailStr, Field

from app.auth.phone import normalize_phone
from app.core.schemas import StrictModel

MAX_PASSWORD_LENGTH = 256
MIN_PASSWORD_LENGTH = 8

NormalizedPhone = Annotated[
    str,
    Field(min_length=4, max_length=32),
    AfterValidator(normalize_phone),
]


class WidgetLoginPayload(StrictModel):
    """The access token MSG91's widget hands back once it has verified a number.

    No phone field: the number is read from MSG91's confirmation of this
    token, so there is nothing here for a caller to assert an identity with.
    """

    access_token: str = Field(min_length=1, max_length=4096)


class PasswordLoginPayload(StrictModel):
    identifier: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=MAX_PASSWORD_LENGTH)


class RefreshPayload(StrictModel):
    refresh_token: str = Field(min_length=1)


class LogoutPayload(StrictModel):
    refresh_token: str = Field(min_length=1)


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Access token lifetime in seconds")


class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    phone: str
    email: EmailStr | None
    name: str | None
    role: str
    status: str
    is_verified: bool


class TenantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    is_active: bool
