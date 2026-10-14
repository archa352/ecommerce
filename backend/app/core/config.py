from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Annotated

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

from app.tenants.constants import DEFAULT_CURRENCY

BACKEND_DIR = Path(__file__).resolve().parents[2]
REPO_ROOT = BACKEND_DIR.parent

DEV_PLACEHOLDER_SECRETS = frozenset(
    {
        "dev-secret-change-later",
        "dev-refresh-secret-change-later",
        "replace-me-with-a-long-random-access-secret",
        "replace-me-with-a-different-long-random-refresh-secret",
        "change-me",
    }
)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(str(REPO_ROOT / ".env"), str(BACKEND_DIR / ".env")),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "TWS E-Commerce API"
    environment: str = "development"
    log_level: str = "INFO"
    api_v1_prefix: str = "/api/v1"

    database_url: str
    test_database_url: str | None = None
    redis_url: str

    db_pool_size: int = 5
    db_max_overflow: int = 10
    db_pool_recycle_seconds: int = 1800
    db_echo: bool = False
    db_pool_timeout_seconds: int = 10
    db_statement_timeout_seconds: int = 15

    jwt_secret: str
    jwt_refresh_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 14

    phone_default_country_code: str = "91"
    phone_national_number_length: int = 10

    # MSG91 owns the OTP itself -- generation, delivery, expiry, retries and
    # attempt limits all sit with the widget. The account auth key is only
    # used to confirm, server-side, that a widget token really is verified;
    # it is never sent to the browser. See app/auth/widget.py.
    msg91_auth_key: str | None = None
    msg91_widget_verify_url: str = "https://control.msg91.com/api/v5/widget/verifyAccessToken"
    msg91_timeout_seconds: float = 10.0

    cors_origins: Annotated[list[str], NoDecode] = Field(default_factory=list)

    docs_enabled: bool | None = None

    trust_forwarded_host: bool = False

    login_rate_limit_attempts: int = 10
    login_ip_rate_limit_attempts: int = 30
    login_rate_limit_window_seconds: int = 60

    otp_request_rate_limit_attempts: int = 5
    otp_verify_rate_limit_attempts: int = 10
    otp_ip_rate_limit_attempts: int = 30
    refresh_rate_limit_attempts: int = 30
    otp_rate_limit_window_seconds: int = 300

    checkout_rate_limit_attempts: int = 20
    coupon_apply_rate_limit_attempts: int = 15
    review_rate_limit_attempts: int = 10
    search_rate_limit_attempts: int = 120
    guest_cart_rate_limit_attempts: int = 30
    guest_checkout_rate_limit_attempts: int = 10
    order_tracking_rate_limit_attempts: int = 20
    commerce_rate_limit_window_seconds: int = 60

    review_request_delay_days: int = 2
    cart_retention_days: int = 30
    store_utc_offset_minutes: int = 330

    # These credentials are only exposed as integration status; no external
    # shipping, email or alternate payment API is called by this integration.
    ccavenue_merchant_id: str | None = None
    ccavenue_access_code: str | None = None
    ccavenue_working_key: str | None = None
    shiprocket_email: str | None = None
    shiprocket_password: str | None = None
    msg91_admin_otp_template_id: str | None = None
    email_provider_api_key: str | None = None
    whatsapp_provider_api_key: str | None = None

    storage_local_path: str = "var/uploads"
    storage_public_base_url: str = "/media"
    max_upload_bytes: int = 5 * 1024 * 1024
    image_max_dimension: int = 2000

    seed_tenant_name: str = "Zeen"
    seed_tenant_slug: str = "zeen"
    seed_tenant_currency: str = DEFAULT_CURRENCY
    seed_tenant_domain: str = "localhost"
    seed_admin_phone: str | None = None
    seed_admin_email: str | None = None
    seed_admin_password: str | None = None

    razorpay_key_id: str | None = None
    razorpay_key_secret: str | None = None
    razorpay_webhook_secret: str | None = None
    razorpay_api_url: str = "https://api.razorpay.com/v1"
    razorpay_timeout_seconds: float = 10.0

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            stripped = value.strip()
            if stripped.startswith("["):
                return value
            return [origin.strip() for origin in stripped.split(",") if origin.strip()]
        return value

    @property
    def is_production(self) -> bool:
        return self.environment.lower() in {"production", "prod"}

    @property
    def is_testing(self) -> bool:
        return self.environment.lower() in {"test", "testing"}

    @property
    def api_docs_enabled(self) -> bool:
        if self.docs_enabled is None:
            return not self.is_production
        return self.docs_enabled

    @model_validator(mode="after")
    def _validate_production_safety(self) -> Settings:
        if self.is_production:
            placeholders = [
                name
                for name, value in (
                    ("JWT_SECRET", self.jwt_secret),
                    ("JWT_REFRESH_SECRET", self.jwt_refresh_secret),
                )
                if value in DEV_PLACEHOLDER_SECRETS or len(value) < 32
            ]
            if placeholders:
                raise ValueError(
                    "Refusing to start in production with weak/placeholder secrets: "
                    + ", ".join(placeholders)
                )
            if "*" in self.cors_origins:
                raise ValueError("Refusing to start in production with CORS_ORIGINS='*'")
        if self.jwt_secret == self.jwt_refresh_secret:
            raise ValueError("JWT_SECRET and JWT_REFRESH_SECRET must differ")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
