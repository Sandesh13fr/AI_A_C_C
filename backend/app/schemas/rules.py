from __future__ import annotations

from datetime import date, datetime
from typing import Any

from app.schemas.common import ApiModel


class RuleListItem(ApiModel):
    id: str
    rule_code: str
    title: str
    citation: str | None = None
    jurisdiction_code: str
    agency_name: str | None = None
    source_code: str | None = None
    welfare_category: str | None = None
    verification_status: str
    summary: str | None = None
    version_label: str | None = None
    latest_version_preview: str | None = None
    chunk_count: int = 0
    precedent_link_count: int = 0
    canonical_id: str | None = None
    citation_label: str | None = None
    source_type: str | None = None


class RuleListResponse(ApiModel):
    items: list[RuleListItem]
    total: int
    page: int
    page_size: int


class RuleVersionDetail(ApiModel):
    id: str
    version_label: str | None = None
    effective_start: date | None = None
    effective_end: date | None = None
    rule_text: str
    interpretation_notes: str | None = None
    source_url: str | None = None
    verification_status: str
    metadata: dict[str, Any] = {}
    created_at: datetime | None = None
    standard_text: str | None = None
    plain_language_summary: str | None = None


class RuleApplicabilityDetail(ApiModel):
    id: str
    species: list[str] = []
    facility_types: list[str] = []
    industries: list[str] = []
    document_types: list[str] = []
    conditions: dict[str, Any] = {}
    jurisdiction_code: str | None = None
    activity_type: str | None = None
    applicability_notes: str | None = None
    created_at: datetime | None = None


class RuleChunkDetail(ApiModel):
    id: str
    chunk_index: int
    chunk_text: str
    token_estimate: int | None = None
    metadata: dict[str, Any] = {}
    created_at: datetime | None = None
    text: str | None = None


class LinkedSourceChunk(ApiModel):
    id: str | None = None
    document_id: str | None = None
    document_title: str | None = None
    chunk_text: str | None = None
    chunk_index: int | None = None


class RulePrecedentLinkDetail(ApiModel):
    id: str
    document_id: str | None = None
    document_chunk_id: str | None = None
    relationship_type: str
    note: str | None = None
    confidence: float | None = None
    created_at: datetime | None = None
    linked_document_title: str | None = None
    linked_document_type: str | None = None
    linked_chunk: LinkedSourceChunk | None = None
    chunk_id: str | None = None
    notes: str | None = None


class RelatedSourceDocument(ApiModel):
    id: str
    title: str | None = None
    source_url: str | None = None
    document_type: str | None = None


class RuleSearchItem(ApiModel):
    id: str
    rule_code: str
    title: str
    citation: str | None = None
    verification_status: str
    snippet: str | None = None
    rank: float


class RuleSearchResponse(ApiModel):
    query: str
    items: list[RuleSearchItem]
    total: int


class RuleDetailResponse(ApiModel):
    id: str
    rule_code: str
    title: str
    citation: str | None = None
    jurisdiction_code: str
    agency_name: str | None = None
    source_code: str | None = None
    welfare_category: str | None = None
    verification_status: str
    summary: str | None = None
    is_active: bool = True
    canonical_id: str | None = None
    citation_label: str | None = None
    source_type: str | None = None
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
