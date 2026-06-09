from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal
from app.sample_data import SAMPLE_RULE


router = APIRouter(prefix="/rules", tags=["rules"])


@router.get("")
async def list_rules(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"items": [SAMPLE_RULE], "total": 1, "status": "placeholder"}


@router.get("/{rule_id}")
async def get_rule(rule_id: str, _: Annotated[object, Depends(get_current_principal)]) -> dict:
    rule = {**SAMPLE_RULE, "id": rule_id}
    return {"item": rule, "versions": [], "status": "placeholder"}
