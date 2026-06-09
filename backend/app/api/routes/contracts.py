from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal


router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.get("")
async def list_contracts(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"items": [], "total": 0, "next_steps": ["Upload a contract document", "Run contract analysis", "Review weak commitments and gaps"]}
