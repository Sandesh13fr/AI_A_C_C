from __future__ import annotations

from app.sample_data import SAMPLE_RULE


async def list_relevant_rules(_: object | None = None, limit: int = 20) -> list[dict]:
    return [SAMPLE_RULE][:limit]
