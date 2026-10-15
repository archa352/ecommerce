"""Razorpay API calls and signature checks; the key secret never leaves the server."""

from __future__ import annotations

import hashlib
import hmac
from decimal import Decimal
from typing import Any

import httpx

from app.core.config import get_settings
from app.core.exceptions import ServiceUnavailableError
from app.core.logging import get_logger
from app.core.money import money

logger = get_logger("payments.razorpay")

UNAVAILABLE = "Online payment is unavailable right now, please try again or pay on delivery"
PAISE_PER_RUPEE = 100
RECEIPT_MAX_LENGTH = 40


def is_configured() -> bool:
    """Whether both halves of the API key are set."""
    settings = get_settings()
    return bool(settings.razorpay_key_id and settings.razorpay_key_secret)


def to_subunits(amount: Decimal) -> int:
    """Express an amount in the currency's smallest unit, as Razorpay expects."""
    return int(money(amount) * PAISE_PER_RUPEE)


def _hmac_hex(secret: str, message: bytes) -> str:
    return hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()


def payment_signature_valid(order_id: str, payment_id: str, signature: str) -> bool:
    """Check Checkout's signature: HMAC-SHA256 of "order_id|payment_id" with the key secret."""
    secret = get_settings().razorpay_key_secret
    if not secret:
        return False
    expected = _hmac_hex(secret, f"{order_id}|{payment_id}".encode())
    return hmac.compare_digest(expected, signature)


def webhook_signature_valid(raw_body: bytes, signature: str) -> bool:
    """Check X-Razorpay-Signature: HMAC-SHA256 of the raw body with the webhook secret."""
    secret = get_settings().razorpay_webhook_secret
    if not secret:
        return False
    return hmac.compare_digest(_hmac_hex(secret, raw_body), signature)


async def _call(method: str, path: str, body: dict[str, Any] | None = None) -> dict[str, Any]:
    """Send one authenticated request; any failure becomes ServiceUnavailableError."""
    settings = get_settings()
    if not is_configured():
        logger.error("razorpay.not_configured")
        raise ServiceUnavailableError(UNAVAILABLE)

    try:
        async with httpx.AsyncClient(timeout=settings.razorpay_timeout_seconds) as client:
            response = await client.request(
                method,
                f"{settings.razorpay_api_url.rstrip('/')}{path}",
                auth=(settings.razorpay_key_id, settings.razorpay_key_secret),
                json=body,
            )
    except httpx.HTTPError as exc:
        logger.error("razorpay.transport_error path=%s error=%s", path, type(exc).__name__)
        raise ServiceUnavailableError(UNAVAILABLE) from exc

    if response.status_code != httpx.codes.OK:
        logger.error("razorpay.rejected path=%s status=%s", path, response.status_code)
        raise ServiceUnavailableError(UNAVAILABLE)

    try:
        payload = response.json()
    except ValueError as exc:
        logger.error("razorpay.unreadable path=%s", path)
        raise ServiceUnavailableError(UNAVAILABLE) from exc

    if not isinstance(payload, dict):
        logger.error("razorpay.unexpected_body path=%s", path)
        raise ServiceUnavailableError(UNAVAILABLE)
    return payload


def _id_of(entity: dict[str, Any], path: str) -> str:
    """The id Razorpay assigned to what it just created."""
    if not isinstance(entity.get("id"), str):
        logger.error("razorpay.missing_id path=%s", path)
        raise ServiceUnavailableError(UNAVAILABLE)
    return entity["id"]


async def create_order(
    *, amount: Decimal, currency: str, receipt: str, notes: dict[str, str]
) -> str:
    """Create a Razorpay order for this amount and return its id."""
    order = await _call(
        "POST",
        "/orders",
        {
            "amount": to_subunits(amount),
            "currency": currency,
            "receipt": receipt[:RECEIPT_MAX_LENGTH],
            "notes": notes,
        },
    )
    return _id_of(order, "/orders")


async def fetch_payment(payment_id: str) -> dict[str, Any]:
    """One payment as Razorpay holds it: status, amount, currency and order_id."""
    return await _call("GET", f"/payments/{payment_id}")


async def fetch_order_payment_statuses(order_id: str) -> list[str]:
    """The status of every payment attempted against a Razorpay order."""
    collection = await _call("GET", f"/orders/{order_id}/payments")
    items = collection.get("items")
    if not isinstance(items, list):
        logger.error("razorpay.unexpected_body path=/orders/payments")
        raise ServiceUnavailableError(UNAVAILABLE)
    return [str(item.get("status", "")) for item in items if isinstance(item, dict)]


async def create_refund(*, payment_id: str, amount: Decimal, receipt: str) -> tuple[str, str]:
    """Ask Razorpay to refund a captured payment; returns the refund id and its status."""
    path = f"/payments/{payment_id}/refund"
    refund = await _call(
        "POST",
        path,
        {"amount": to_subunits(amount), "receipt": receipt[:RECEIPT_MAX_LENGTH]},
    )
    return _id_of(refund, path), str(refund.get("status", ""))
