from __future__ import annotations


async def list_precedents(_: object | None = None, limit: int = 20) -> list[dict]:
    return [{"relationship_type": "inspection_pattern", "notes": "Precedent retrieval placeholder."}][:limit]
