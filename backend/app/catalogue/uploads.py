"""Turn an uploaded file into a stored, re-encoded, sensibly sized product image."""

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


def _reencode(data: bytes) -> tuple[bytes, str]:
    """Decode the image, cap its size and encode it afresh; returns bytes and format."""
    settings = get_settings()

    try:
        image = Image.open(io.BytesIO(data), formats=list(FORMAT_EXTENSIONS))
        if image.width * image.height > MAX_SOURCE_PIXELS:
            raise ValidationError(TOO_MANY_PIXELS)
        image.load()
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as exc:
        raise ValidationError(NOT_AN_IMAGE) from exc

    image_format = image.format
    longest = max(image.size)
    if longest > settings.image_max_dimension:
        ratio = settings.image_max_dimension / longest
        image = image.resize(
            (max(int(image.width * ratio), 1), max(int(image.height * ratio), 1)),
            Image.LANCZOS,
        )

    if image_format == "JPEG" and image.mode not in ("RGB", "L"):
        image = image.convert("RGB")
    elif image_format == "WEBP" and image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA")

    buffer = io.BytesIO()
    image.save(buffer, format=image_format)
    return buffer.getvalue(), image_format


async def store_image(tenant_id: UUID, content_type: str, data: bytes) -> str:
    """Validate, re-encode and store one upload. Returns the URL to serve it from."""
    settings = get_settings()

    if content_type not in ALLOWED_CONTENT_TYPES:
        raise ValidationError(UNSUPPORTED_TYPE)

    if not data:
        raise ValidationError(EMPTY_UPLOAD)

    if len(data) > settings.max_upload_bytes:
        raise ValidationError(_too_large(settings.max_upload_bytes))

    encoded, image_format = _reencode(data)

    key = upload_key(tenant_id, FORMAT_EXTENSIONS[image_format])
    return await get_storage().save(
        encoded, key=key, content_type=FORMAT_CONTENT_TYPES[image_format]
    )
