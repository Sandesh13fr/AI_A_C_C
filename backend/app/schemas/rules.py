from __future__ import annotations

from datetime import date, datetime
from typing import Any

from app.schemas.common import ApiModel


class RuleListItem(ApiModel):
    id: str
    canonical_id: str
    citation_label: str
    title: str
    jurisdiction_code: str
    source_type: str
    welfare_category: str
    verification_status: str
    version_label: str | None = None
    summary: str | None = None
    chunk_count: int = 0
    precedent_link_count: int = 0


class RuleListResponse(ApiModel):
    items: list[RuleListItem]
    total: int
    page: int
    page_size: int


class RuleVersionDetail(ApiModel):
    id: str
    version_label: str
    effective_start: date
    effective_end: date | None = None
    standard_text: str
    plain_language_summary: str | None = None
    source_url: str | None = None
    verification_status: str
    created_at: datetime | None = None


class RuleApplicabilityDetail(ApiModel):
    id: str
    species: list[str] = []
    facility_types: list[str] = []
    industries: list[str] = []
    document_types: list[str] = []
    conditions: dict[str, Any] = {}
    created_at: datetime | None = None


class RuleChunkDetail(ApiModel):
    id: str
    chunk_index: int
    text: str
    metadata: dict[str, Any] = {}
    created_at: datetime | None = None


class RulePrecedentLinkDetail(ApiModel):
    id: str
    document_id: str
    chunk_id: str | None = None
    relationship_type: str
    notes: str | None = None
    confidence: float | None = None
    created_at: datetime | None = None


class RelatedSourceDocument(ApiModel):
    id: str
    title: str | None = None
    source_url: str | None = None
    document_type: str | None = None


class RuleDetailResponse(ApiModel):
    id: str
    canonical_id: str
    citation_label: str
    title: str
    jurisdiction_code: str
    source_type: str
    welfare_category: str
    parent_rule_id: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    latest_version: RuleVersionDetail | None = None
    applicability: list[RuleApplicabilityDetail] = []
    chunks: list[RuleChunkDetail] = []
    precedent_links: list[RulePrecedentLinkDetail] = []
    source_document: RelatedSourceDocument | None = None


class SearchGroupedResponse(ApiModel):
    query: str
    documents: list[dict[str, Any]] = []
    chunks: list[dict[str, Any]] = []
    rules: list[RuleListItem] = []
    total_documents: int = 0
    total_chunks: int = 0
    total_rules: int = 0
