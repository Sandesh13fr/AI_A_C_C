from __future__ import annotations

import time
from collections import defaultdict, deque
from dataclasses import dataclass, field

from fastapi import HTTPException, Request, status


@dataclass
class InMemoryRateLimiter:
    hits: dict[str, deque[float]] = field(default_factory=lambda: defaultdict(deque))

    def check(self, key: str, limit: int, window_seconds: int = 60) -> None:
        now = time.monotonic()
        bucket = self.hits[key]
        while bucket and now - bucket[0] > window_seconds:
            bucket.popleft()
        if len(bucket) >= limit:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")
        bucket.append(now)


_limiter = InMemoryRateLimiter()


async def enforce_rate_limit(request: Request, bucket: str, limit_per_minute: int) -> None:
    client = request.client.host if request.client else "unknown"
    _limiter.check(f"{bucket}:{client}", limit_per_minute, 60)
