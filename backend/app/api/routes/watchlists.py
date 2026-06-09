from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal


router = APIRouter(prefix="/watchlists", tags=["watchlists"])


@router.get("")
async def list_watchlists(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"items": [], "total": 0, "status": "placeholder"}
