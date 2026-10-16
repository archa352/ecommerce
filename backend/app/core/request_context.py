from __future__ import annotations

import re
import uuid

from fastapi import Request

_REQUEST_ID_PATTERN = re.compile(r"^[A-Za-z0-9._-]{1,64}$")


def sanitize_request_id(value: str | None) -> str:
    if value and _REQUEST_ID_PATTERN.match(value):
        return value
    return uuid.uuid4().hex


def client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"
