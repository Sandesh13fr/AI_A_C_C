from __future__ import annotations

from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_principal
from app.core.governance import GovernanceError, validate_analysis_request
from app.schemas.analysis import AnalysisRunCreate, AnalysisRunResponse


router = APIRouter(prefix="/analysis-runs", tags=["analysis-runs"])


@router.post("", response_model=AnalysisRunResponse, status_code=201)
async def create_analysis_run(
    _: Annotated[object, Depends(get_current_principal)],
    body: AnalysisRunCreate,
) -> AnalysisRunResponse:
    try:
        validate_analysis_request(body.model_dump())
    except GovernanceError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    return AnalysisRunResponse(
        id=str(uuid4()),
        document_id=body.document_id,
        analysis_type=body.analysis_type,
        jurisdiction_code=body.jurisdiction_code,
        status="queued",
        summary={"requires_human_review": True, "total_potential_risks": 0},
    )


@router.get("/{analysis_run_id}", response_model=AnalysisRunResponse)
async def get_analysis_run(analysis_run_id: str, _: Annotated[object, Depends(get_current_principal)]) -> AnalysisRunResponse:
    return AnalysisRunResponse(
        id=analysis_run_id,
        document_id="00000000-0000-4000-8000-000000000003",
        analysis_type="general_compliance",
        jurisdiction_code="US-FED",
        status="needs_review",
        summary={"requires_human_review": True, "total_potential_risks": 0},
    )
