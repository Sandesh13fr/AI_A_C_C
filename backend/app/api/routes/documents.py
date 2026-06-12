from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_principal
from app.core.permissions import Principal, can_access_organization
from app.db.session import get_db
from app.sample_data import SAMPLE_DOCUMENT
from app.schemas.documents import DocumentListResponse, DocumentMetadataResponse, DocumentResponse
from app.schemas.rules import RelatedRulesResponse
from app.services.knowledge_base import (
    get_related_rules_for_document,
    get_rules_for_document_sql,
)


router = APIRouter(prefix="/documents", tags=["documents"])


def _sample_document() -> DocumentResponse:
    return DocumentResponse(**SAMPLE_DOCUMENT)


def _build_related_rule_items(rows: list[dict]) -> list[dict]:
    return [
        {
            "link_id": row["link_id"],
            "rule_id": row["rule_id"],
            "rule_code": row.get("rule_code") or row.get("canonical_id"),
            "canonical_id": row.get("canonical_id"),
            "citation": row.get("citation") or row.get("citation_label"),
            "citation_label": row.get("citation_label"),
            "title": row["title"],
            "jurisdiction_code": row["jurisdiction_code"],
            "welfare_category": row["welfare_category"],
            "relationship_type": row["relationship_type"],
            "note": row.get("note"),
            "notes": row.get("note"),
            "confidence": float(row["confidence"]) if row["confidence"] is not None else None,
            "verification_status": row["verification_status"] or "draft",
        }
        for row in rows
    ]


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    principal: Annotated[Principal, Depends(get_current_principal)],
    db: Annotated[AsyncSession | None, Depends(get_db)],
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    limit: int | None = Query(None, ge=1, le=100),
    offset: int | None = Query(None, ge=0),
    q: str | None = None,
    source_code: str | None = None,
    document_type: str | None = None,
    topic: str | None = None,
    status_filter: str | None = Query(None, alias="status"),
    doc_type: str | None = None,
    organization_id: str | None = None,
) -> DocumentListResponse:
    if not can_access_organization(principal, organization_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Organization access denied")

    resolved_page_size = limit or page_size
    resolved_page = page if offset is None else (offset // resolved_page_size) + 1
    resolved_doc_type = document_type or doc_type

    if db is None:
        doc = _sample_document()
        return DocumentListResponse(items=[doc], total=1, page=resolved_page, page_size=resolved_page_size)

    conditions = ["d.deleted_at IS NULL"]
    bind: dict = {"limit": resolved_page_size, "offset": (resolved_page - 1) * resolved_page_size}
    if organization_id:
        conditions.append("(d.organization_id = CAST(:organization_id AS uuid) OR d.organization_id IS NULL)")
        bind["organization_id"] = organization_id
    if status_filter:
        conditions.append("d.status = :status")
        bind["status"] = status_filter
    if resolved_doc_type:
        conditions.append("d.doc_type = :doc_type")
        bind["doc_type"] = resolved_doc_type
    if q:
        conditions.append("(d.title ILIKE :q OR d.retrieval_summary ILIKE :q OR d.raw_text ILIKE :q)")
        bind["q"] = f"%{q}%"
    if source_code:
        conditions.append("d.source_label ILIKE :source_code")
        bind["source_code"] = f"%{source_code}%"
    if topic:
        conditions.append("array_to_string(COALESCE(m.welfare_categories, '{}'::text[]), ' ') ILIKE :topic")
        bind["topic"] = f"%{topic}%"
    where_clause = " AND ".join(conditions)

    rows = (
        await db.execute(
            text(
                f"""
                SELECT d.id::text, d.organization_id::text, d.title, d.filename, d.original_name,
                       d.file_path, d.redacted_file_path, d.file_size, d.mime_type, d.doc_type,
                       d.source_label, d.status, d.ingestion_stage, d.retrieval_summary,
                       d.created_at, d.updated_at,
                       m.issuer, m.jurisdiction_code, m.facility_name, m.facility_id,
                       COALESCE(m.species, '{{}}') AS species,
                       m.inspection_date, m.document_date, m.inspector_name, m.reference_number,
                       COALESCE(m.welfare_categories, '{{}}') AS welfare_categories,
                       COALESCE(m.facility_types, '{{}}') AS facility_types,
                       COALESCE(m.industries, '{{}}') AS industries,
                       COALESCE(m.extra, '{{}}'::jsonb) AS extra
                FROM documents d
                LEFT JOIN document_metadata m ON m.document_id = d.id
                WHERE {where_clause}
                ORDER BY d.created_at DESC
                LIMIT :limit OFFSET :offset
                """
            ),
            bind,
        )
    ).mappings().all()

    items = [
        DocumentResponse(
            id=row["id"],
            organization_id=row["organization_id"],
            title=row["title"],
            filename=row["filename"],
            original_name=row["original_name"],
            file_path=row["file_path"],
            redacted_file_path=row["redacted_file_path"],
            file_size=row["file_size"],
            mime_type=row["mime_type"],
            doc_type=row["doc_type"],
            source_label=row["source_label"],
            status=row["status"],
            ingestion_stage=row["ingestion_stage"],
            retrieval_summary=row["retrieval_summary"],
            created_at=row["created_at"],
            updated_at=row["updated_at"],
            metadata=DocumentMetadataResponse(
                issuer=row["issuer"],
                jurisdiction_code=row["jurisdiction_code"],
                facility_name=row["facility_name"],
                facility_id=row["facility_id"],
                species=list(row["species"] or []),
                inspection_date=row["inspection_date"],
                document_date=row["document_date"],
                inspector_name=row["inspector_name"],
                reference_number=row["reference_number"],
                welfare_categories=list(row["welfare_categories"] or []),
                facility_types=list(row["facility_types"] or []),
                industries=list(row["industries"] or []),
                extra=row["extra"] or {},
            ),
        )
        for row in rows
    ]

    return DocumentListResponse(items=items, total=len(items), page=resolved_page, page_size=resolved_page_size)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    _: Annotated[Principal, Depends(get_current_principal)],
    db: Annotated[AsyncSession | None, Depends(get_db)],
) -> DocumentResponse:
    if db is None:
        if document_id != SAMPLE_DOCUMENT["id"]:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        document = _sample_document()
        document.topics = list(document.metadata.welfare_categories if document.metadata else [])
        document.chunks = [
            {
                "id": "00000000-0000-4000-8000-000000000013",
                "chunk_index": 0,
                "raw_text": "Veterinary follow-up documentation was requested by the inspector.",
            }
        ]
        document.related_rules = [
            {
                "link_id": "00000000-0000-4000-8000-000000000014",
                "rule_id": "00000000-0000-4000-8000-000000000005",
                "rule_code": "VC-SEED-001",
                "citation": "9 CFR placeholder - needs verification",
                "citation_label": "9 CFR placeholder - needs verification",
                "title": "Adequate veterinary care",
                "jurisdiction_code": "US-FED",
                "welfare_category": "veterinary_care",
                "relationship_type": "related_source",
                "note": "Seeded relationship for offline smoke testing.",
                "notes": "Seeded relationship for offline smoke testing.",
                "confidence": 0.75,
                "verification_status": "needs_review",
            }
        ]
        return document

    rows = (
        await db.execute(
            text(
                """
                SELECT d.id::text, d.organization_id::text, d.title, d.filename, d.original_name,
                       d.file_path, d.redacted_file_path, d.file_size, d.mime_type, d.doc_type,
                       d.source_label, d.status, d.ingestion_stage, d.retrieval_summary, d.raw_text,
                       d.created_at, d.updated_at,
                       m.issuer, m.jurisdiction_code, m.facility_name, m.facility_id,
                       COALESCE(m.species, '{}') AS species,
                       m.inspection_date, m.document_date, m.inspector_name, m.reference_number,
                       COALESCE(m.welfare_categories, '{}') AS welfare_categories,
                       COALESCE(m.facility_types, '{}') AS facility_types,
                       COALESCE(m.industries, '{}') AS industries,
                       COALESCE(m.extra, '{}'::jsonb) AS extra
                FROM documents d
                LEFT JOIN document_metadata m ON m.document_id = d.id
                WHERE d.id = CAST(:document_id AS uuid) AND d.deleted_at IS NULL
                LIMIT 1
                """
            ),
            {"document_id": document_id},
        )
    ).mappings().all()
    if not rows:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    row = rows[0]
    chunk_rows = (
        await db.execute(
            text(
                """
                SELECT id::text, chunk_index, raw_text, retrieval_summary
                FROM chunks
                WHERE document_id = CAST(:document_id AS uuid)
                ORDER BY chunk_index
                """
            ),
            {"document_id": document_id},
        )
    ).mappings().all()
    related_rule_rows = (await db.execute(get_rules_for_document_sql(), {"document_id": document_id})).mappings().all()

    return DocumentResponse(
        id=row["id"],
        organization_id=row["organization_id"],
        title=row["title"],
        filename=row["filename"],
        original_name=row["original_name"],
        file_path=row["file_path"],
        redacted_file_path=row["redacted_file_path"],
        file_size=row["file_size"],
        mime_type=row["mime_type"],
        doc_type=row["doc_type"],
        source_label=row["source_label"],
        status=row["status"],
        ingestion_stage=row["ingestion_stage"],
        retrieval_summary=row["retrieval_summary"],
        raw_text=row["raw_text"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
        metadata=DocumentMetadataResponse(
            issuer=row["issuer"],
            jurisdiction_code=row["jurisdiction_code"],
            facility_name=row["facility_name"],
            facility_id=row["facility_id"],
            species=list(row["species"] or []),
            inspection_date=row["inspection_date"],
            document_date=row["document_date"],
            inspector_name=row["inspector_name"],
            reference_number=row["reference_number"],
            welfare_categories=list(row["welfare_categories"] or []),
            facility_types=list(row["facility_types"] or []),
            industries=list(row["industries"] or []),
            extra=row["extra"] or {},
        ),
        chunks=[dict(chunk_row) for chunk_row in chunk_rows],
        topics=list(row["welfare_categories"] or []),
        related_rules=_build_related_rule_items(related_rule_rows),
    )


@router.get("/{document_id}/related-rules", response_model=RelatedRulesResponse)
async def get_document_related_rules(
    document_id: str,
    _: Annotated[Principal, Depends(get_current_principal)],
    db: Annotated[AsyncSession | None, Depends(get_db)],
    q: str | None = Query(None, min_length=1, max_length=500, description="Optional search query to bias the related rules."),
    limit: int = Query(5, ge=1, le=20, description="Maximum number of related rules to return."),
) -> RelatedRulesResponse:
    """Return citation-backed, deterministic related rules for a document.

    Every returned item maps to an existing ``regulatory_rules`` row.
    Scoring order:
        1. Direct precedent links (``rule_precedent_links``).
        2. Text overlap between document content and rule text / rule chunks.
        3. Category / jurisdiction / species applicability match.
    """
    return await get_related_rules_for_document(
        db=db,
        document_id=document_id,
        query=q,
        limit=limit,
    )
