"""Where uploaded files live. Local disk today, object storage behind the same seam."""

from __future__ import annotations

import shutil
import uuid
from pathlib import Path
from typing import Protocol

from app.core.config import get_settings


class Storage(Protocol):
    """Somewhere to put bytes and get back a URL that serves them."""

    async def save(self, data: bytes, *, key: str, content_type: str) -> str: ...

    async def delete(self, key: str) -> None: ...


class LocalStorage:
    """Writes under a directory the app also serves as static files."""

    def __init__(self, root: Path, public_base_url: str) -> None:
        self.root = root
        self.public_base_url = public_base_url.rstrip("/")

    async def save(self, data: bytes, *, key: str, content_type: str) -> str:
        target = self.root / key
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        return f"{self.public_base_url}/{key}"

    async def delete(self, key: str) -> None:
        target = self.root / key
        if target.is_file():
            target.unlink()

    def clear(self) -> None:
        """Drop everything. Tests use this; nothing in the app should."""
        if self.root.exists():
            shutil.rmtree(self.root)


def upload_key(tenant_id: uuid.UUID, extension: str) -> str:
    """A server-chosen name, tenant-partitioned; nothing in it comes from the client."""
    return f"{tenant_id}/{uuid.uuid4().hex}{extension}"


def get_storage() -> Storage:
    settings = get_settings()
    return LocalStorage(
        Path(settings.storage_local_path), settings.storage_public_base_url
    )
