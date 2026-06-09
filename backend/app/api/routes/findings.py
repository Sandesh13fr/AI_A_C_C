from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal


router = APIRouter(prefix="/findings", tags=["findings"])


@router.get("")
async def list_findings(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"items": [], "total": 0, "allowed_finding_types": ["potential_risk", "possible_gap", "weak_commitment", "ambiguous_language", "needs_human_review"]}
