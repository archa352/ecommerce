"""Validate uploaded raster images and store their original bytes unchanged."""

from __future__ import annotations

import io
from uuid import UUID

from PIL import Image, UnidentifiedImageError

from app.core.config import get_settings
from app.core.exceptions import ValidationError
from app.core.storage import get_storage, upload_key

ALLOWED_CONTENT_TYPES = frozenset({"image/jpeg", "image/png", "image/webp"})

FORMAT_EXTENSIONS = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}
FORMAT_CONTENT_TYPES = {"JPEG": "image/jpeg", "PNG": "image/png", "WEBP": "image/webp"}

MAX_SOURCE_PIXELS = 50_000_000

UNSUPPORTED_TYPE = (
    "Upload a JPEG, PNG or WebP image. "
    f"Accepted types: {', '.join(sorted(ALLOWED_CONTENT_TYPES))}"
)
NOT_AN_IMAGE = "That file is not a readable image"
TOO_MANY_PIXELS = "That image has too many pixels"
EMPTY_UPLOAD = "The uploaded file is empty"


def _too_large(limit: int) -> str:
    return f"Images must be {limit // (1024 * 1024)}MB or smaller"


def _validate_image(data: bytes) -> str:
    """Validate the image and return its detected format without altering its bytes."""
    try:
        image = Image.open(io.BytesIO(data), formats=list(FORMAT_EXTENSIONS))
        if image.width * image.height > MAX_SOURCE_PIXELS:
            raise ValidationError(TOO_MANY_PIXELS)
        image.load()
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as exc:
        raise ValidationError(NOT_AN_IMAGE) from exc

    if image.format not in FORMAT_EXTENSIONS:
        raise ValidationError(UNSUPPORTED_TYPE)
    return image.format


async def store_image(tenant_id: UUID, content_type: str, data: bytes) -> str:
    """Validate and store one upload unchanged. Returns its serving URL."""
    settings = get_settings()

    if content_type not in ALLOWED_CONTENT_TYPES:
        raise ValidationError(UNSUPPORTED_TYPE)

    if not data:
        raise ValidationError(EMPTY_UPLOAD)

    if len(data) > settings.max_upload_bytes:
        raise ValidationError(_too_large(settings.max_upload_bytes))

    image_format = _validate_image(data)

    key = upload_key(tenant_id, FORMAT_EXTENSIONS[image_format])
    return await get_storage().save(
        data, key=key, content_type=FORMAT_CONTENT_TYPES[image_format]
    )
