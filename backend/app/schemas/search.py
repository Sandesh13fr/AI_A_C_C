from __future__ import annotations

from datetime import date
from typing import Any

from pydantic import Field

from app.schemas.common import ApiModel


class SearchRequest(ApiModel):
    query: str | None = Field(None, max_length=500)
    top_k: int = Field(20, ge=1, le=100)
    doc_type: str | None = None
    jurisdiction: str | None = None
    species: list[str] | None = None
    welfare_category: list[str] | None = None
    industry: list[str] | None = None
    facility_type: list[str] | None = None
    date_from: date | None = None
    date_to: date | None = None
    source: str | None = None
    rule_id: str | None = None
    organization_id: str | None = None
    vector_weight: float = Field(0.6, ge=0.0, le=1.0)
    bm25_weight: float = Field(0.3, ge=0.0, le=1.0)
    metadata_weight: float = Field(0.1, ge=0.0, le=1.0)


class ScoreBreakdown(ApiModel):
    vector_score: float
    bm25_score: float
    metadata_boost: float
    final_score: float


class SearchResultMetadata(ApiModel):
    jurisdiction_code: str | None = None
    facility_name: str | None = None
    species: list[str] = []
    welfare_categories: list[str] = []
    facility_types: list[str] = []
    industries: list[str] = []
    document_date: date | None = None
    extra: dict[str, Any] = {}


class SearchResult(ApiModel):
    id: str
    title: str | None = None
    filename: str
    doc_type: str
    source_label: str | None = None
    retrieval_summary: str | None = None
    metadata: SearchResultMetadata | None = None
    scores: ScoreBreakdown
    match_reason: str | None = None
    citation_label: str | None = None


class SearchResponse(ApiModel):
    query: str
    total_results: int
    results: list[SearchResult]
