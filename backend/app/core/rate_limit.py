from __future__ import annotations

import hashlib

from app.core.cache import get_redis
from app.core.exceptions import RateLimitedError
from app.core.logging import get_logger

logger = get_logger("rate_limit")

KEY_PREFIX = "ratelimit"


def key_for(scope: str, *parts: str) -> str:
    digest = hashlib.sha256("|".join(parts).encode("utf-8")).hexdigest()[:32]
    return f"{KEY_PREFIX}:{scope}:{digest}"


async def hit(key: str, *, limit: int, window_seconds: int) -> None:
    if limit <= 0:
        return

    try:
        client = get_redis()
        pipeline = client.pipeline()
        pipeline.incr(key)
        pipeline.ttl(key)
        count, ttl = await pipeline.execute()

        if ttl < 0:
            await client.expire(key, window_seconds)
            ttl = window_seconds
    except RateLimitedError:
        raise
    except Exception as exc:
        logger.warning("rate_limit.unavailable key=%s error=%s", key, type(exc).__name__)
        return

    if count > limit:
        raise RateLimitedError(retry_after_seconds=max(int(ttl), 1))


async def enforce(scope: str, *parts: str, limit: int, window_seconds: int) -> None:
    """Throttle one scope for whoever the caller identifies as the subject."""
    await hit(key_for(scope, *parts), limit=limit, window_seconds=window_seconds)


async def reset(key: str) -> None:
    try:
        await get_redis().delete(key)
    except Exception as exc:
        logger.warning("rate_limit.reset_failed key=%s error=%s", key, type(exc).__name__)
