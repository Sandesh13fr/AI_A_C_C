from __future__ import annotations

from fastapi import APIRouter


router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/source-sync")
async def source_sync_webhook() -> dict:
    return {"status": "accepted", "detail": "Webhook endpoint placeholder."}
