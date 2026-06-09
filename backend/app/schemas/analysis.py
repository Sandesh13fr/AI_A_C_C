from __future__ import annotations

from typing import Any

from pydantic import Field

from app.schemas.common import ApiModel
from app.core.governance import EXPORT_DISCLAIMER


class AnalysisRunCreate(ApiModel):
    organization_id: str | None = None
    document_id: str
    analysis_type: str = Field("general_compliance", pattern="^(general_compliance|contract|gap|policy_comparison)$")
    jurisdiction_code: str
    rule_scope: dict[str, Any] = {}
    prompt_version: str = "initial-safe-rag-v1"


class AnalysisRunResponse(ApiModel):
    id: str
    document_id: str
    analysis_type: str
    jurisdiction_code: str
    status: str
    summary: dict[str, Any]
    disclaimer: str = EXPORT_DISCLAIMER


class ExportCreate(ApiModel):
    organization_id: str | None = None
    analysis_run_id: str | None = None
    document_id: str | None = None
    export_type: str = "pdf_report"
    export_scope: str = "internal_draft"
    signoff_id: str | None = None
