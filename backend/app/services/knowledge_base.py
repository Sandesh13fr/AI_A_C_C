from __future__ import annotations

from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.sample_data import SAMPLE_DOCUMENT, SAMPLE_RULE
from app.schemas.rules import (
    LinkedSourceChunk,
    RelatedSourceDocument,
    RuleApplicabilityDetail,
    RuleChunkDetail,
    RuleDetailResponse,
    RuleListItem,
    RuleListResponse,
    RulePrecedentLinkDetail,
    RuleSearchItem,
    RuleSearchResponse,
    RuleVersionDetail,
    SearchGroupedResponse,
)


def _sample_rule_item() -> RuleListItem:
    return RuleListItem(
        id=SAMPLE_RULE["id"],
        rule_code=SAMPLE_RULE["rule_code"],
        canonical_id=SAMPLE_RULE["canonical_id"],
        citation=SAMPLE_RULE["citation"],
        citation_label=SAMPLE_RULE["citation_label"],
        title=SAMPLE_RULE["title"],
        jurisdiction_code=SAMPLE_RULE["jurisdiction_code"],
        agency_name=SAMPLE_RULE["agency_name"],
        source_code=SAMPLE_RULE["source_code"],
        source_type=SAMPLE_RULE["source_type"],
        welfare_category=SAMPLE_RULE["welfare_category"],
        verification_status=SAMPLE_RULE["verification_status"],
        summary=SAMPLE_RULE["summary"],
        version_label="v1",
        latest_version_preview="Seeded reviewer-aid rule text for local smoke validation.",
        chunk_count=2,
        precedent_link_count=1,
    )


def _placeholder_rules(page: int, page_size: int) -> RuleListResponse:
    return RuleListResponse(items=[_sample_rule_item()], total=1, page=page, page_size=page_size)


def _placeholder_rule_detail(rule_id: str) -> RuleDetailResponse:
    return RuleDetailResponse(
        id=rule_id,
        rule_code=SAMPLE_RULE["rule_code"],
        canonical_id=SAMPLE_RULE["canonical_id"],
        citation=SAMPLE_RULE["citation"],
        citation_label=SAMPLE_RULE["citation_label"],
        title=SAMPLE_RULE["title"],
        jurisdiction_code=SAMPLE_RULE["jurisdiction_code"],
        agency_name=SAMPLE_RULE["agency_name"],
        source_code=SAMPLE_RULE["source_code"],
        source_type=SAMPLE_RULE["source_type"],
        welfare_category=SAMPLE_RULE["welfare_category"],
        verification_status=SAMPLE_RULE["verification_status"],
        summary=SAMPLE_RULE["summary"],
        latest_version=RuleVersionDetail(
            id="00000000-0000-4000-8000-000000000006",
            version_label="v1",
            effective_start="2024-01-01",
            rule_text=(
                "Each facility should ensure adequate veterinary care, daily observation, "
                "and documented follow-up actions. This seeded text is a reviewer aid and needs verification."
            ),
            standard_text=(
                "Each facility should ensure adequate veterinary care, daily observation, "
                "and documented follow-up actions. This seeded text is a reviewer aid and needs verification."
            ),
            plain_language_summary=SAMPLE_RULE["summary"],
            source_url="https://www.ecfr.gov/current/title-9",
            verification_status="needs_review",
            metadata={"seeded": True},
        ),
        applicability=[
            RuleApplicabilityDetail(
                id="00000000-0000-4000-8000-000000000007",
                species=["dog", "cat"],
                facility_types=["research_facility", "breeder"],
                jurisdiction_code="US-FED",
                applicability_notes="Seeded applicability row for smoke testing.",
            )
        ],
        chunks=[
            RuleChunkDetail(
                id="00000000-0000-4000-8000-000000000008",
                chunk_index=0,
                chunk_text="Adequate veterinary care must be available to all covered animals.",
                text="Adequate veterinary care must be available to all covered animals.",
            ),
            RuleChunkDetail(
                id="00000000-0000-4000-8000-000000000009",
                chunk_index=1,
                chunk_text="Animals should be observed daily for illness, injury, or distress.",
                text="Animals should be observed daily for illness, injury, or distress.",
            ),
        ],
        precedent_links=[
            RulePrecedentLinkDetail(
                id="00000000-0000-4000-8000-000000000010",
                document_id=SAMPLE_DOCUMENT["id"],
                document_chunk_id="00000000-0000-4000-8000-000000000011",
                chunk_id="00000000-0000-4000-8000-000000000011",
                relationship_type="related_source",
                note="Keyword-linked sample document chunk.",
                notes="Keyword-linked sample document chunk.",
                confidence=0.75,
                linked_document_title=SAMPLE_DOCUMENT["title"],
                linked_document_type=SAMPLE_DOCUMENT["doc_type"],
                linked_chunk=LinkedSourceChunk(
                    id="00000000-0000-4000-8000-000000000011",
                    document_id=SAMPLE_DOCUMENT["id"],
                    document_title=SAMPLE_DOCUMENT["title"],
                    chunk_text="Veterinary follow-up documentation was requested by the inspector.",
                    chunk_index=0,
                ),
            )
        ],
        source_document=RelatedSourceDocument(
            id=SAMPLE_DOCUMENT["id"],
            title=SAMPLE_DOCUMENT["title"],
            source_url="https://www.ecfr.gov/current/title-9",
            document_type=SAMPLE_DOCUMENT["doc_type"],
        ),
    )


def _placeholder_grouped_search(query: str) -> SearchGroupedResponse:
    return SearchGroupedResponse(
        query=query,
        documents=[
            {
                "id": SAMPLE_DOCUMENT["id"],
                "title": SAMPLE_DOCUMENT["title"],
                "doc_type": SAMPLE_DOCUMENT["doc_type"],
                "source_label": SAMPLE_DOCUMENT["source_label"],
            }
        ],
        chunks=[
            {
                "id": "00000000-0000-4000-8000-000000000012",
                "document_id": SAMPLE_DOCUMENT["id"],
                "document_title": SAMPLE_DOCUMENT["title"],
                "chunk_index": 0,
                "raw_text": "Veterinary care follow-up was requested in the inspection summary.",
            }
        ],
        rules=[_sample_rule_item()],
        total_documents=1,
        total_chunks=1,
        total_rules=1,
    )


def _rule_list_item_from_row(row: Any) -> RuleListItem:
    return RuleListItem(
        id=row["id"],
        rule_code=row["rule_code"],
        canonical_id=row.get("canonical_id"),
        citation=row.get("citation"),
        citation_label=row.get("citation_label"),
        title=row["title"],
        jurisdiction_code=row["jurisdiction_code"],
        agency_name=row.get("agency_name"),
        source_code=row.get("source_code"),
        source_type=row.get("source_type"),
        welfare_category=row.get("welfare_category"),
        verification_status=row["verification_status"] or "draft",
        summary=row.get("summary"),
        version_label=row.get("version_label"),
        latest_version_preview=row.get("latest_version_preview"),
        chunk_count=row.get("chunk_count", 0) or 0,
        precedent_link_count=row.get("precedent_link_count", 0) or 0,
    )


async def list_rules(
    db: AsyncSession | None,
    page: int,
    page_size: int,
    q: str | None = None,
    jurisdiction: str | None = None,
    category: str | None = None,
    verification_status: str | None = None,
) -> RuleListResponse:
    if db is None:
        return _placeholder_rules(page, page_size)

    conditions = ["1=1"]
    bind: dict[str, Any] = {"limit": page_size, "offset": (page - 1) * page_size}

    if q:
        conditions.append(
            "("
            "r.title ILIKE :q OR "
            "COALESCE(r.citation, r.citation_label) ILIKE :q OR "
            "COALESCE(r.summary, latest.plain_language_summary) ILIKE :q"
            ")"
        )
        bind["q"] = f"%{q}%"
    if jurisdiction:
        conditions.append("r.jurisdiction_code = :jurisdiction")
        bind["jurisdiction"] = jurisdiction
    if category:
        conditions.append("r.welfare_category = :category")
        bind["category"] = category
    if verification_status:
        conditions.append("COALESCE(r.verification_status, latest.verification_status, 'draft') = :verification_status")
        bind["verification_status"] = verification_status

    where_clause = " AND ".join(conditions)

    count_sql = text(
        f"""
        SELECT COUNT(*)
        FROM regulatory_rules r
        LEFT JOIN LATERAL (
            SELECT verification_status, plain_language_summary
            FROM regulatory_rule_versions
            WHERE rule_id = r.id
            ORDER BY COALESCE(effective_start_date, effective_start) DESC NULLS LAST, created_at DESC
            LIMIT 1
        ) latest ON true
        WHERE {where_clause}
        """
    )
    total = int((await db.execute(count_sql, bind)).scalar_one())

    sql = text(
        f"""
        SELECT
            r.id::text,
            COALESCE(r.rule_code, r.canonical_id) AS rule_code,
            r.canonical_id,
            COALESCE(r.citation, r.citation_label) AS citation,
            r.citation_label,
            r.title,
            r.jurisdiction_code,
            r.agency_name,
            COALESCE(r.source_code, r.source_type) AS source_code,
            r.source_type,
            r.welfare_category,
            COALESCE(r.verification_status, latest.verification_status, 'draft') AS verification_status,
            COALESCE(r.summary, latest.plain_language_summary) AS summary,
            latest.version_label,
            LEFT(COALESCE(latest.rule_text, latest.standard_text, ''), 240) AS latest_version_preview,
            COALESCE(chunk_counts.chunk_count, 0) AS chunk_count,
            COALESCE(precedent_counts.precedent_count, 0) AS precedent_link_count
        FROM regulatory_rules r
        LEFT JOIN LATERAL (
            SELECT
                version_label,
                verification_status,
                COALESCE(rule_text, standard_text) AS rule_text,
                standard_text,
                COALESCE(interpretation_notes, plain_language_summary) AS plain_language_summary
            FROM regulatory_rule_versions
            WHERE rule_id = r.id
            ORDER BY COALESCE(effective_start_date, effective_start) DESC NULLS LAST, created_at DESC
            LIMIT 1
        ) latest ON true
        LEFT JOIN LATERAL (
            SELECT COUNT(*) AS chunk_count
            FROM rule_chunks rc
            WHERE rc.rule_id = r.id
        ) chunk_counts ON true
        LEFT JOIN LATERAL (
            SELECT COUNT(*) AS precedent_count
            FROM rule_precedent_links pl
            WHERE pl.rule_id = r.id
        ) precedent_counts ON true
        WHERE {where_clause}
        ORDER BY r.updated_at DESC NULLS LAST, r.created_at DESC
        LIMIT :limit OFFSET :offset
        """
    )

    rows = (await db.execute(sql, bind)).mappings().all()
    items = [_rule_list_item_from_row(row) for row in rows]
    return RuleListResponse(items=items, total=total, page=page, page_size=page_size)


async def get_rule_detail(db: AsyncSession | None, rule_id: str) -> RuleDetailResponse | None:
    if db is None:
        return _placeholder_rule_detail(rule_id)

    rule_sql = text(
        """
        SELECT
            r.id::text,
            COALESCE(r.rule_code, r.canonical_id) AS rule_code,
            r.canonical_id,
            COALESCE(r.citation, r.citation_label) AS citation,
            r.citation_label,
            r.title,
            r.jurisdiction_code,
            r.agency_name,
            COALESCE(r.source_code, r.source_type) AS source_code,
            r.source_type,
            r.welfare_category,
            COALESCE(r.verification_status, 'draft') AS verification_status,
            r.summary,
            COALESCE(r.is_active, true) AS is_active,
            r.parent_rule_id::text,
            r.created_at,
            r.updated_at
        FROM regulatory_rules r
        WHERE r.id = CAST(:rule_id AS uuid)
        LIMIT 1
        """
    )
    row = (await db.execute(rule_sql, {"rule_id": rule_id})).mappings().one_or_none()
    if row is None:
        return None

    version_sql = text(
        """
        SELECT
            id::text,
            version_label,
            COALESCE(effective_start_date, effective_start) AS effective_start,
            COALESCE(effective_end_date, effective_end) AS effective_end,
            COALESCE(rule_text, standard_text) AS rule_text,
            COALESCE(interpretation_notes, plain_language_summary) AS interpretation_notes,
            source_url,
            COALESCE(metadata, '{}'::jsonb) AS metadata,
            verification_status,
            created_at
        FROM regulatory_rule_versions
        WHERE rule_id = CAST(:rule_id AS uuid)
        ORDER BY COALESCE(effective_start_date, effective_start) DESC NULLS LAST, created_at DESC
        LIMIT 1
        """
    )
    version_row = (await db.execute(version_sql, {"rule_id": rule_id})).mappings().one_or_none()
    latest_version = None
    if version_row is not None:
        latest_version = RuleVersionDetail(
            id=version_row["id"],
            version_label=version_row["version_label"],
            effective_start=version_row["effective_start"],
            effective_end=version_row["effective_end"],
            rule_text=version_row["rule_text"],
            standard_text=version_row["rule_text"],
            interpretation_notes=version_row["interpretation_notes"],
            plain_language_summary=row["summary"],
            source_url=version_row["source_url"],
            verification_status=version_row["verification_status"],
            metadata=version_row["metadata"] or {},
            created_at=version_row["created_at"],
        )

    applicability_sql = text(
        """
        SELECT
            a.id::text,
            COALESCE(a.species, '{}'::text[]) AS species,
            CASE
                WHEN COALESCE(a.facility_types, '{}'::text[]) <> '{}'::text[] THEN a.facility_types
                WHEN a.facility_type IS NOT NULL THEN ARRAY[a.facility_type]
                ELSE '{}'::text[]
            END AS facility_types,
            COALESCE(a.industries, '{}'::text[]) AS industries,
            COALESCE(a.document_types, '{}'::text[]) AS document_types,
            COALESCE(a.conditions, '{}'::jsonb) AS conditions,
            a.jurisdiction_code,
            a.activity_type,
            a.applicability_notes,
            a.created_at
        FROM rule_applicability a
        WHERE a.rule_id = CAST(:rule_id AS uuid)
        ORDER BY a.created_at DESC
        """
    )
    applicability_rows = (await db.execute(applicability_sql, {"rule_id": rule_id})).mappings().all()
    applicability = [
        RuleApplicabilityDetail(
            id=row["id"],
            species=list(row["species"] or []),
            facility_types=list(row["facility_types"] or []),
            industries=list(row["industries"] or []),
            document_types=list(row["document_types"] or []),
            conditions=row["conditions"] or {},
            jurisdiction_code=row["jurisdiction_code"],
            activity_type=row["activity_type"],
            applicability_notes=row["applicability_notes"],
            created_at=row["created_at"],
        )
        for row in applicability_rows
    ]

    chunk_sql = text(
        """
        SELECT
            rc.id::text,
            rc.chunk_index,
            COALESCE(rc.chunk_text, rc.text) AS chunk_text,
            rc.token_estimate,
            COALESCE(rc.metadata, '{}'::jsonb) AS metadata,
            rc.created_at
        FROM rule_chunks rc
        WHERE rc.rule_id = CAST(:rule_id AS uuid)
        ORDER BY rc.chunk_index
        """
    )
    chunk_rows = (await db.execute(chunk_sql, {"rule_id": rule_id})).mappings().all()
    chunks = [
        RuleChunkDetail(
            id=row["id"],
            chunk_index=row["chunk_index"],
            chunk_text=row["chunk_text"],
            text=row["chunk_text"],
            token_estimate=row["token_estimate"],
            metadata=row["metadata"] or {},
            created_at=row["created_at"],
        )
        for row in chunk_rows
    ]

    precedent_sql = text(
        """
        SELECT
            pl.id::text,
            pl.document_id::text,
            COALESCE(pl.document_chunk_id, pl.chunk_id)::text AS document_chunk_id,
            COALESCE(pl.note, pl.notes) AS note,
            pl.relationship_type,
            pl.confidence,
            pl.created_at,
            d.title AS linked_document_title,
            d.doc_type AS linked_document_type,
            c.id::text AS linked_chunk_id,
            c.document_id::text AS linked_chunk_document_id,
            c.chunk_index AS linked_chunk_index,
            c.raw_text AS linked_chunk_text
        FROM rule_precedent_links pl
        LEFT JOIN documents d ON d.id = pl.document_id
        LEFT JOIN chunks c ON c.id = COALESCE(pl.document_chunk_id, pl.chunk_id)
        WHERE pl.rule_id = CAST(:rule_id AS uuid)
        ORDER BY pl.created_at DESC
        """
    )
    precedent_rows = (await db.execute(precedent_sql, {"rule_id": rule_id})).mappings().all()
    precedent_links = [
        RulePrecedentLinkDetail(
            id=row["id"],
            document_id=row["document_id"],
            document_chunk_id=row["document_chunk_id"],
            chunk_id=row["document_chunk_id"],
            relationship_type=row["relationship_type"],
            note=row["note"],
            notes=row["note"],
            confidence=float(row["confidence"]) if row["confidence"] is not None else None,
            created_at=row["created_at"],
            linked_document_title=row["linked_document_title"],
            linked_document_type=row["linked_document_type"],
            linked_chunk=LinkedSourceChunk(
                id=row["linked_chunk_id"],
                document_id=row["linked_chunk_document_id"],
                document_title=row["linked_document_title"],
                chunk_text=row["linked_chunk_text"],
                chunk_index=row["linked_chunk_index"],
            )
            if row["linked_chunk_id"]
            else None,
        )
        for row in precedent_rows
    ]

    source_document = None
    if latest_version and latest_version.source_url:
        source_document = RelatedSourceDocument(
            id=row["id"],
            title=row["title"],
            source_url=latest_version.source_url,
            document_type="regulation",
        )

    return RuleDetailResponse(
        id=row["id"],
        rule_code=row["rule_code"],
        canonical_id=row["canonical_id"],
        citation=row["citation"],
        citation_label=row["citation_label"],
        title=row["title"],
        jurisdiction_code=row["jurisdiction_code"],
        agency_name=row["agency_name"],
        source_code=row["source_code"],
        source_type=row["source_type"],
        welfare_category=row["welfare_category"],
        verification_status=row["verification_status"],
        summary=row["summary"],
        is_active=row["is_active"],
        parent_rule_id=row["parent_rule_id"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
        latest_version=latest_version,
        applicability=applicability,
        chunks=chunks,
        precedent_links=precedent_links,
        source_document=source_document,
    )


async def search_rules(db: AsyncSession | None, query: str, limit: int = 20) -> RuleSearchResponse:
    if db is None:
        return RuleSearchResponse(
            query=query,
            total=1 if query.strip() else 0,
            items=[
                RuleSearchItem(
                    id=SAMPLE_RULE["id"],
                    rule_code=SAMPLE_RULE["rule_code"],
                    title=SAMPLE_RULE["title"],
                    citation=SAMPLE_RULE["citation"],
                    verification_status=SAMPLE_RULE["verification_status"],
                    snippet="Adequate veterinary care and daily observation language from the seeded sample rule.",
                    rank=1.0,
                )
            ]
            if query.strip()
            else [],
        )

    bind = {"q_like": f"%{query}%", "limit": limit}
    sql = text(
        """
        SELECT
            r.id::text,
            COALESCE(r.rule_code, r.canonical_id) AS rule_code,
            r.title,
            COALESCE(r.citation, r.citation_label) AS citation,
            COALESCE(r.verification_status, latest.verification_status, 'draft') AS verification_status,
            LEFT(
                COALESCE(r.summary, latest.rule_text, latest.standard_text, ''),
                320
            ) AS snippet,
            CASE
                WHEN r.title ILIKE :q_like THEN 5.0
                WHEN COALESCE(r.citation, r.citation_label) ILIKE :q_like THEN 4.0
                WHEN COALESCE(r.summary, latest.plain_language_summary) ILIKE :q_like THEN 3.0
                WHEN COALESCE(latest.rule_text, latest.standard_text, '') ILIKE :q_like THEN 2.0
                ELSE 1.0
            END AS rank
        FROM regulatory_rules r
        LEFT JOIN LATERAL (
            SELECT
                verification_status,
                COALESCE(rule_text, standard_text) AS rule_text,
                standard_text,
                COALESCE(interpretation_notes, plain_language_summary) AS plain_language_summary
            FROM regulatory_rule_versions
            WHERE rule_id = r.id
            ORDER BY COALESCE(effective_start_date, effective_start) DESC NULLS LAST, created_at DESC
            LIMIT 1
        ) latest ON true
        WHERE r.title ILIKE :q_like
           OR COALESCE(r.citation, r.citation_label) ILIKE :q_like
           OR COALESCE(r.summary, latest.plain_language_summary) ILIKE :q_like
           OR COALESCE(latest.rule_text, latest.standard_text, '') ILIKE :q_like
        ORDER BY rank DESC, r.updated_at DESC NULLS LAST, r.created_at DESC
        LIMIT :limit
        """
    )
    rows = (await db.execute(sql, bind)).mappings().all()
    items = [
        RuleSearchItem(
            id=row["id"],
            rule_code=row["rule_code"],
            title=row["title"],
            citation=row["citation"],
            verification_status=row["verification_status"],
            snippet=row["snippet"],
            rank=float(row["rank"]),
        )
        for row in rows
    ]
    return RuleSearchResponse(query=query, items=items, total=len(items))


async def search_grouped(
    db: AsyncSession | None,
    query: str,
    limit: int = 20,
) -> SearchGroupedResponse:
    if not query.strip():
        return SearchGroupedResponse(query=query)
    if db is None:
        return _placeholder_grouped_search(query)

    bind = {"q_like": f"%{query}%", "limit": limit}

    document_sql = text(
        """
        SELECT
            d.id::text,
            d.title,
            d.doc_type,
            d.source_label,
            d.retrieval_summary,
            m.jurisdiction_code
        FROM documents d
        LEFT JOIN document_metadata m ON m.document_id = d.id
        WHERE d.deleted_at IS NULL
          AND (
            d.title ILIKE :q_like OR
            d.retrieval_summary ILIKE :q_like OR
            d.raw_text ILIKE :q_like OR
            array_to_string(COALESCE(m.welfare_categories, '{}'::text[]), ' ') ILIKE :q_like
          )
        ORDER BY d.updated_at DESC
        LIMIT :limit
        """
    )
    chunk_sql = text(
        """
        SELECT
            c.id::text,
            c.document_id::text,
            c.chunk_index,
            c.raw_text,
            d.title AS document_title
        FROM chunks c
        JOIN documents d ON d.id = c.document_id
        WHERE d.deleted_at IS NULL
          AND (
            c.raw_text ILIKE :q_like OR
            COALESCE(c.retrieval_summary, '') ILIKE :q_like
          )
        ORDER BY d.updated_at DESC, c.chunk_index
        LIMIT :limit
        """
    )

    document_rows = (await db.execute(document_sql, bind)).mappings().all()
    chunk_rows = (await db.execute(chunk_sql, bind)).mappings().all()
    rule_results = await list_rules(db=db, page=1, page_size=limit, q=query)

    return SearchGroupedResponse(
        query=query,
        documents=[dict(row) for row in document_rows],
        chunks=[dict(row) for row in chunk_rows],
        rules=rule_results.items,
        total_documents=len(document_rows),
        total_chunks=len(chunk_rows),
        total_rules=len(rule_results.items),
    )


def get_rules_for_document_sql() -> text:
    return text(
        """
        SELECT
            pl.id::text AS link_id,
            pl.relationship_type,
            COALESCE(pl.note, pl.notes) AS note,
            pl.confidence,
            COALESCE(pl.rule_id::text, rv.rule_id::text) AS rule_id,
            COALESCE(r.rule_code, r.canonical_id) AS rule_code,
            r.canonical_id,
            COALESCE(r.citation, r.citation_label) AS citation,
            r.citation_label,
            r.title,
            r.jurisdiction_code,
            r.welfare_category,
            COALESCE(r.verification_status, latest.verification_status, 'draft') AS verification_status
        FROM rule_precedent_links pl
        LEFT JOIN regulatory_rule_versions rv ON rv.id = pl.rule_version_id
        JOIN regulatory_rules r ON r.id = COALESCE(pl.rule_id, rv.rule_id)
        LEFT JOIN LATERAL (
            SELECT verification_status
            FROM regulatory_rule_versions
            WHERE rule_id = r.id
            ORDER BY COALESCE(effective_start_date, effective_start) DESC NULLS LAST, created_at DESC
            LIMIT 1
        ) latest ON true
        WHERE pl.document_id = CAST(:document_id AS uuid)
        ORDER BY pl.created_at DESC
        """
    )
