from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal


router = APIRouter(prefix="/rulebooks", tags=["rulebooks"])


@router.get("")
async def list_rulebooks(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {
        "items": [
            {
                "id": "00000000-0000-4000-8000-000000000006",
                "name": "Federal AWA baseline",
                "rulebook_type": "legal_minimum",
                "status": "draft",
            }
        ],
        "total": 1,
    }
