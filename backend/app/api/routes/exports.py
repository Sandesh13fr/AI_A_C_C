from __future__ import annotations

from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_principal
from app.core.governance import EXPORT_DISCLAIMER, GovernanceError, validate_export_request
from app.schemas.analysis import ExportCreate


router = APIRouter(prefix="/exports", tags=["exports"])


@router.get("")
async def list_exports(_: Annotated[object, Depends(get_current_principal)]) -> dict:
    return {"items": [], "total": 0, "disclaimer_text": EXPORT_DISCLAIMER}


@router.post("", status_code=201)
async def create_export(_: Annotated[object, Depends(get_current_principal)], body: ExportCreate) -> dict:
    try:
        validate_export_request(body.model_dump())
    except GovernanceError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    return {"id": str(uuid4()), "status": "queued", "disclaimer_text": EXPORT_DISCLAIMER}
