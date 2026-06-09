from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal
from app.sample_data import DEV_ORG_ID


router = APIRouter(prefix="/organizations", tags=["organizations"])


@router.get("")
async def list_organizations(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"items": [{"id": DEV_ORG_ID, "name": "Development Organization", "slug": "dev-org", "tenant_type": "internal"}], "total": 1}
