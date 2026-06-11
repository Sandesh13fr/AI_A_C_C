from __future__ import annotations

from datetime import date, datetime
from typing import Any

from app.schemas.common import ApiModel


class DocumentMetadataResponse(ApiModel):
    issuer: str | None = None
    jurisdiction_code: str | None = None
    facility_name: str | None = None
    facility_id: str | None = None
    species: list[str] = []
    inspection_date: date | None = None
    document_date: date | None = None
    inspector_name: str | None = None
    reference_number: str | None = None
    welfare_categories: list[str] = []
    facility_types: list[str] = []
    industries: list[str] = []
    extra: dict[str, Any] = {}


class DocumentResponse(ApiModel):
    id: str
    organization_id: str | None = None
    title: str | None = None
    filename: str
    original_name: str | None = None
    file_path: str | None = None
    redacted_file_path: str | None = None
    file_size: int | None = None
    mime_type: str | None = None
    doc_type: str
    source_label: str | None = None
    status: str
    ingestion_stage: str = "created"
    retrieval_summary: str | None = None
    raw_text: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    metadata: DocumentMetadataResponse | None = None
    chunks: list[dict[str, Any]] = []
    topics: list[str] = []
    related_rules: list[dict[str, Any]] = []


class DocumentListResponse(ApiModel):
    items: list[DocumentResponse]
    total: int
    page: int
    page_size: int


class IngestBatchCreate(ApiModel):
    organization_id: str | None = None
    batch_type: str = "user_upload"
    total_files: int = 0
    metadata: dict[str, Any] = {}


class IngestBatchResponse(ApiModel):
    id: str
    status: str
    batch_type: str
    total_files: int
    next_step: str
