from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal
from app.sample_data import DEV_USER


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
async def current_user(principal: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {
        "id": principal.user_id,
        "email": principal.email,
        "global_role": principal.global_role,
        "organization_id": principal.organization_id,
        "org_role": principal.org_role,
    }


@router.get("")
async def list_users(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"items": [DEV_USER], "total": 1}
