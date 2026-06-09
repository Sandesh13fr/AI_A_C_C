from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal


router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/events")
async def list_audit_events(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"items": [], "total": 0}
