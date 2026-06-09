from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal


router = APIRouter(prefix="/evals", tags=["evals"])


@router.get("")
async def list_evals(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"datasets": [], "runs": [], "status": "placeholder"}
