from __future__ import annotations

from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends

from app.api.deps import get_current_principal
from app.schemas.documents import IngestBatchCreate, IngestBatchResponse


router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("", response_model=IngestBatchResponse, status_code=201)
async def create_upload_batch(_: Annotated[object, Depends(get_current_principal)], body: IngestBatchCreate) -> IngestBatchResponse:
    return IngestBatchResponse(
        id=str(uuid4()),
        status="queued",
        batch_type=body.batch_type,
        total_files=body.total_files,
        next_step="Persist files to object storage, then enqueue jobs_ingest.process_ingest_batch.",
    )
