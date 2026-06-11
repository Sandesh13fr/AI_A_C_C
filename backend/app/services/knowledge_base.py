from __future__ import annotations

from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.sample_data import SAMPLE_DOCUMENT, SAMPLE_RULE
from app.schemas.rules import (
    RelatedSourceDocument,
    RuleApplicabilityDetail,
    RuleChunkDetail,
    RuleDetailResponse,
    RuleListItem,
    RuleListResponse,
    RulePrecedentLinkDetail,
    RuleVersionDetail,
    SearchGroupedResponse,
)


def _placeholder_rules(page: int, page_size: int) -> RuleListResponse:
    items = [
        RuleListItem(
            id=SAMPLE_RULE["id"],
            canonical_id=SAMPLE_RULE["canonical_id"],
            citation_label=SAMPLE_RULE["citation_label"],
            title=SAMPLE_RULE["title"],
            jurisdiction_code=SAMPLE_RULE["jurisdiction_code"],
            source_type="federal_cfr",
            welfare_category=SAMPLE_RULE["welfare_category"],
            verification_status="placeholder",
        )
    ]
    return RuleListResponse(items=items, total=1, page=page, page_size=page_size)


def _placeholder_rule_detail(rule_id: str) -> RuleDetailResponse:
    return RuleDetailResponse(
        id=rule_id,
        canonical_id=SAMPLE_RULE["canonical_id"],
        citation_label=SAMPLE_RULE["citation_label"],
        title=SAMPLE_RULE["title"],
        jurisdiction_code=SAMPLE_RULE["jurisdiction_code"],
        source_type="federal_cfr",
        welfare_category=SAMPLE_RULE["welfare_category"],
        latest_version=RuleVersionDetail(
            id="00000000-0000-4000-8000-000000000006",
            version_label="v1",
            effective_start="2024-01-01",
            standard_text="Sample rule text for development.",
            verification_status="placeholder",
        ),
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
        conditions.append("(r.title ILIKE :q OR r.citation_label ILIKE :q)")
        bind["q"] = f"%{q}%"
    if jurisdiction:
        conditions.append("r.jurisdiction_code = :jurisdiction")
        bind["jurisdiction"] = jurisdiction
    if category:
        conditions.append("r.welfare_category = :category")
        bind["category"] = category
    if verification_status:
        conditions.append("v.verification_status = :verification_status")
        bind["verification_status"] = verification_status

    where = " AND ".join(conditions)

    sql = text(f"""
        SELECT
            r.id::text,
            r.canonical_id,
            r.citation_label,
            r.title,
            r.jurisdiction_code,
            r.source_type,
            r.welfare_category,
            v.verification_status,
            v.version_label,
            v.plain_language_summary AS summary,
            COALESCE(cc.chunk_count, 0) AS chunk_count,
            COALESCE(pc.precedent_count, 0) AS precedent_link_count
        FROM regulatory_rules r
        LEFT JOIN LATERAL (
            SELECT verification_status, version_label, plain_language_summary
            FROM regulatory_rule_versions
            WHERE rule_id = r.id
            ORDER BY effective_start DESC NULLS LAST, created_at DESC
            LIMIT 1
        ) v ON true
        LEFT JOIN LATERAL (
            SELECT COUNT(*) AS chunk_count
            FROM rule_chunks rc
            JOIN regulatory_rule_versions rv ON rv.id = rc.rule_version_id
            WHERE rv.rule_id = r.id
        ) cc ON true
        LEFT JOIN LATERAL (
            SELECT COUNT(*) AS precedent_count
            FROM rule_precedent_links pl
            JOIN regulatory_rule_versions rv ON rv.id = pl.rule_version_id
            WHERE rv.rule_id = r.id
        ) pc ON true
        WHERE {where}
        ORDER BY r.created_at DESC
        LIMIT :limit OFFSET :offset
    """)

    rows = (await db.execute(sql, bind)).mappings().all()

    items = [
        RuleListItem(
            id=row["id"],
            canonical_id=row["canonical_id"],
            citation_label=row["citation_label"],
            title=row["title"],
            jurisdiction_code=row["jurisdiction_code"],
            source_type=row["source_type"],
            welfare_category=row["welfare_category"],
            verification_status=row["verification_status"] or "draft",
            version_label=row["version_label"],
            summary=row["summary"],
            chunk_count=row["chunk_count"],
            precedent_link_count=row["precedent_link_count"],
        )
        for row in rows
    ]

    return RuleListResponse(items=items, total=len(items), page=page, page_size=page_size)


async def get_rule_detail(db: AsyncSession | None, rule_id: str) -> RuleDetailResponse | None:
    if db is None:
        return _placeholder_rule_detail(rule_id)

    row = (
        await db.execute(
            text("""
                SELECT r.id::text, r.canonical_id, r.citation_label, r.title,
                       r.jurisdiction_code, r.source_type, r.welfare_category,
                       r.parent_rule_id::text, r.created_at, r.updated_at
                FROM regulatory_rules r
                WHERE r.id = CAST(:rule_id AS uuid)
                LIMIT 1
            """),
            {"rule_id": rule_id},
        )
    ).mappings().one_or_none()

    if row is None:
        return None

    latest_version = None
    version_rows = (
        await db.execute(
            text("""
                SELECT id::text, version_label, effective_start, effective_end,
                       standard_text, plain_language_summary, source_url,
                       verification_status, created_at
                FROM regulatory_rule_versions
                WHERE rule_id = CAST(:rule_id AS uuid)
                ORDER BY effective_start DESC NULLS LAST, created_at DESC
                LIMIT 1
            """),
            {"rule_id": rule_id},
        )
    ).mappings().all()

    if version_rows:
        vr = version_rows[0]
        latest_version = RuleVersionDetail(
            id=vr["id"],
            version_label=vr["version_label"],
            effective_start=vr["effective_start"],
            effective_end=vr["effective_end"],
            standard_text=vr["standard_text"],
            plain_language_summary=vr["plain_language_summary"],
            source_url=vr["source_url"],
            verification_status=vr["verification_status"],
            created_at=vr["created_at"],
        )

    applicability_rows = (
        await db.execute(
            text("""
                SELECT a.id::text, a.species, a.facility_types, a.industries,
                       a.document_types, a.conditions, a.created_at
                FROM rule_applicability a
                JOIN regulatory_rule_versions rv ON rv.id = a.rule_version_id
                WHERE rv.rule_id = CAST(:rule_id AS uuid)
                ORDER BY a.created_at DESC
            """),
            {"rule_id": rule_id},
        )
    ).mappings().all()

    applicability = [
        RuleApplicabilityDetail(
            id=ar["id"],
            species=list(ar["species"] or []),
            facility_types=list(ar["facility_types"] or []),
            industries=list(ar["industries"] or []),
            document_types=list(ar["document_types"] or []),
            conditions=ar["conditions"] or {},
            created_at=ar["created_at"],
        )
        for ar in applicability_rows
    ]

    chunk_rows = (
        await db.execute(
            text("""
                SELECT rc.id::text, rc.chunk_index, rc.text, rc.metadata, rc.created_at
                FROM rule_chunks rc
                JOIN regulatory_rule_versions rv ON rv.id = rc.rule_version_id
                WHERE rv.rule_id = CAST(:rule_id AS uuid)
                ORDER BY rc.chunk_index
            """),
            {"rule_id": rule_id},
        )
    ).mappings().all()

    chunks = [
        RuleChunkDetail(
            id=cr["id"],
            chunk_index=cr["chunk_index"],
            text=cr["text"],
            metadata=cr["metadata"] or {},
            created_at=cr["created_at"],
        )
        for cr in chunk_rows
    ]

    precedent_rows = (
        await db.execute(
            text("""
                SELECT pl.id::text, pl.document_id::text, pl.chunk_id::text,
                       pl.relationship_type, pl.notes, pl.confidence, pl.created_at
                FROM rule_precedent_links pl
                JOIN regulatory_rule_versions rv ON rv.id = pl.rule_version_id
                WHERE rv.rule_id = CAST(:rule_id AS uuid)
                ORDER BY pl.created_at DESC
            """),
            {"rule_id": rule_id},
        )
    ).mappings().all()

    precedent_links = [
        RulePrecedentLinkDetail(
            id=pr["id"],
            document_id=pr["document_id"],
            chunk_id=pr["chunk_id"],
            relationship_type=pr["relationship_type"],
            notes=pr["notes"],
            confidence=float(pr["confidence"]) if pr["confidence"] is not None else None,
            created_at=pr["created_at"],
        )
        for pr in precedent_rows
    ]

    source_document = None
    if latest_version and latest_version.source_url:
        sd_row = (
            await db.execute(
                text("""
                    SELECT sd.id::text, sd.title, sd.source_url, sd.document_type
                    FROM source_documents sd
                    WHERE sd.source_url = :source_url
                    LIMIT 1
                """),
                {"source_url": latest_version.source_url},
            )
        ).mappings().one_or_none()

        if sd_row:
            source_document = RelatedSourceDocument(
                id=sd_row["id"],
                title=sd_row["title"],
                source_url=sd_row["source_url"],
                document_type=sd_row["document_type"],
            )

    return RuleDetailResponse(
        id=row["id"],
        canonical_id=row["canonical_id"],
        citation_label=row["citation_label"],
        title=row["title"],
        jurisdiction_code=row["jurisdiction_code"],
        source_type=row["source_type"],
        welfare_category=row["welfare_category"],
        parent_rule_id=row["parent_rule_id"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
        latest_version=latest_version,
        applicability=applicability,
        chunks=chunks,
        precedent_links=precedent_links,
        source_document=source_document,
    )


async def search_grouped(
    db: AsyncSession | None,
    query: str,
    limit: int = 20,
) -> SearchGroupedResponse:
    if db is None or not query.strip():
        return SearchGroupedResponse(query=query)

    bind = {"q": query, "q_like": f"%{query}%", "limit": limit}

    doc_sql = text("""
        SELECT d.id::text, d.title, d.filename, d.doc_type, d.source_label,
               d.retrieval_summary, d.created_at
        FROM documents d
        WHERE d.deleted_at IS NULL
          AND (d.title ILIKE :q_like OR d.retrieval_summary ILIKE :q_like)
        ORDER BY d.updated_at DESC
        LIMIT :limit
    """)
    doc_rows = (await db.execute(doc_sql, bind)).mappings().all()
    documents = [dict(row) for row in doc_rows]

    chunk_sql = text("""
        SELECT c.id::text, c.document_id::text, c.chunk_index, c.raw_text,
               c.retrieval_summary, c.created_at,
               d.title AS document_title
        FROM chunks c
        JOIN documents d ON d.id = c.document_id AND d.deleted_at IS NULL
        WHERE c.raw_text ILIKE :q_like
        ORDER BY c.created_at DESC
        LIMIT :limit
    """)
    chunk_rows = (await db.execute(chunk_sql, bind)).mappings().all()
    chunks = [dict(row) for row in chunk_rows]

    rule_sql = text(f"""
        SELECT r.id::text, r.canonical_id, r.citation_label, r.title,
               r.jurisdiction_code, r.source_type, r.welfare_category,
               v.verification_status, v.version_label,
               v.plain_language_summary AS summary,
               COALESCE(cc.chunk_count, 0) AS chunk_count,
               COALESCE(pc.precedent_count, 0) AS precedent_link_count
        FROM regulatory_rules r
        LEFT JOIN LATERAL (
            SELECT verification_status, version_label, plain_language_summary
            FROM regulatory_rule_versions
            WHERE rule_id = r.id
            ORDER BY effective_start DESC NULLS LAST, created_at DESC
            LIMIT 1
        ) v ON true
        LEFT JOIN LATERAL (
            SELECT COUNT(*) AS chunk_count
            FROM rule_chunks rc
            JOIN regulatory_rule_versions rv ON rv.id = rc.rule_version_id
            WHERE rv.rule_id = r.id
        ) cc ON true
        LEFT JOIN LATERAL (
            SELECT COUNT(*) AS precedent_count
            FROM rule_precedent_links pl
            JOIN regulatory_rule_versions rv ON rv.id = pl.rule_version_id
            WHERE rv.rule_id = r.id
        ) pc ON true
        WHERE r.title ILIKE :q_like
           OR r.citation_label ILIKE :q_like
           OR v.plain_language_summary ILIKE :q_like
           OR EXISTS (
               SELECT 1 FROM regulatory_rule_versions rv2
               WHERE rv2.rule_id = r.id AND rv2.standard_text ILIKE :q_like
           )
           OR EXISTS (
               SELECT 1 FROM rule_chunks rc2
               JOIN regulatory_rule_versions rv3 ON rv3.id = rc2.rule_version_id
               WHERE rv3.rule_id = r.id AND rc2.text ILIKE :q_like
           )
        ORDER BY r.created_at DESC
        LIMIT :limit
    """)
    rule_rows = (await db.execute(rule_sql, bind)).mappings().all()

    rules = [
        RuleListItem(
            id=row["id"],
            canonical_id=row["canonical_id"],
            citation_label=row["citation_label"],
            title=row["title"],
            jurisdiction_code=row["jurisdiction_code"],
            source_type=row["source_type"],
            welfare_category=row["welfare_category"],
            verification_status=row["verification_status"] or "draft",
            version_label=row["version_label"],
            summary=row["summary"],
            chunk_count=row["chunk_count"],
            precedent_link_count=row["precedent_link_count"],
        )
        for row in rule_rows
    ]

    return SearchGroupedResponse(
        query=query,
        documents=documents,
        chunks=chunks,
        rules=[r.model_dump() for r in rules],
        total_documents=len(documents),
        total_chunks=len(chunks),
        total_rules=len(rules),
    )


def get_rules_for_document_sql() -> text:
    """Return SQL text to fetch rule_precedent_links for a given document."""
    return text("""
        SELECT pl.id::text AS link_id, pl.relationship_type, pl.notes, pl.confidence,
               pl.rule_version_id::text,
               r.id::text AS rule_id, r.canonical_id, r.citation_label, r.title,
               r.jurisdiction_code, r.welfare_category,
               v.verification_status
        FROM rule_precedent_links pl
        JOIN regulatory_rule_versions rv ON rv.id = pl.rule_version_id
        JOIN regulatory_rules r ON r.id = rv.rule_id
        LEFT JOIN LATERAL (
            SELECT verification_status
            FROM regulatory_rule_versions
            WHERE rule_id = r.id
            ORDER BY effective_start DESC NULLS LAST, created_at DESC
            LIMIT 1
        ) v ON true
        WHERE pl.document_id = CAST(:document_id AS uuid)
        ORDER BY pl.created_at DESC
    """)

