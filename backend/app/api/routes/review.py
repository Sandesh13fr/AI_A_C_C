from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal


router = APIRouter(prefix="/review", tags=["review"])


@router.get("/queue")
async def review_queue(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"items": [], "total": 0, "status": "ready", "message": "No pending review assignments in the local placeholder queue."}
