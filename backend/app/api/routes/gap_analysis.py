from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal


router = APIRouter(prefix="/gap-analysis", tags=["gap-analysis"])


@router.get("")
async def list_gap_analyses(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"items": [], "total": 0, "status": "placeholder"}
