"""Turn an uploaded file into a stored, sensibly sized product image."""

from __future__ import annotations

import io
from uuid import UUID

from PIL import Image, UnidentifiedImageError

from app.core.config import get_settings
from app.core.exceptions import ValidationError
from app.core.storage import get_storage, upload_key

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

UNSUPPORTED_TYPE = (
    "Upload a JPEG, PNG or WebP image. "
    f"Accepted types: {', '.join(sorted(ALLOWED_CONTENT_TYPES))}"
)
NOT_AN_IMAGE = "That file is not a readable image"
EMPTY_UPLOAD = "The uploaded file is empty"


def _too_large(limit: int) -> str:
    return f"Images must be {limit // (1024 * 1024)}MB or smaller"


def _shrink(data: bytes, content_type: str) -> tuple[bytes, str]:
    """Cap the longest edge so one huge upload cannot fill the disk."""
    settings = get_settings()

    try:
        image = Image.open(io.BytesIO(data))
        image.load()
    except (UnidentifiedImageError, OSError) as exc:
        raise ValidationError(NOT_AN_IMAGE) from exc

    longest = max(image.size)
    if longest <= settings.image_max_dimension:
        return data, content_type

    ratio = settings.image_max_dimension / longest
    resized = image.resize(
        (max(int(image.width * ratio), 1), max(int(image.height * ratio), 1)),
        Image.LANCZOS,
    )

    if resized.mode in {"P", "RGBA"} and content_type == "image/jpeg":
        resized = resized.convert("RGB")

    buffer = io.BytesIO()
    resized.save(buffer, format=image.format or "PNG")
    return buffer.getvalue(), content_type


async def store_image(tenant_id: UUID, filename: str, content_type: str, data: bytes) -> str:
    """Validate, shrink and store one upload. Returns the URL to serve it from."""
    settings = get_settings()

    if content_type not in ALLOWED_CONTENT_TYPES:
        raise ValidationError(UNSUPPORTED_TYPE)

    if not data:
        raise ValidationError(EMPTY_UPLOAD)

    if len(data) > settings.max_upload_bytes:
        raise ValidationError(_too_large(settings.max_upload_bytes))

    data, content_type = _shrink(data, content_type)

    name = filename or f"upload{ALLOWED_CONTENT_TYPES[content_type]}"
    key = upload_key(tenant_id, name)
    return await get_storage().save(data, key=key, content_type=content_type)
