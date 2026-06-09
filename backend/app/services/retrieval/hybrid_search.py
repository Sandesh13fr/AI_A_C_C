from __future__ import annotations

from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.sample_data import SAMPLE_DOCUMENT
from app.schemas.search import ScoreBreakdown, SearchRequest, SearchResponse, SearchResult, SearchResultMetadata


def normalize_scores(scores: dict[str, float]) -> dict[str, float]:
    if not scores:
        return {}
    min_score = min(scores.values())
    max_score = max(scores.values())
    span = max_score - min_score
    if span == 0:
        return {key: 1.0 for key in scores}
    return {key: (score - min_score) / span for key, score in scores.items()}


def _has_filters(params: SearchRequest) -> bool:
    return any(
        [
            params.doc_type,
            params.jurisdiction,
            params.species,
            params.welfare_category,
            params.industry,
            params.facility_type,
            params.date_from,
            params.date_to,
            params.source,
            params.rule_id,
            params.organization_id,
        ]
    )


def _build_filter_sql(params: SearchRequest) -> tuple[list[str], dict[str, Any]]:
    conditions = ["d.deleted_at IS NULL"]
    bind: dict[str, Any] = {}
    if params.organization_id:
        conditions.append("(d.organization_id = CAST(:organization_id AS uuid) OR d.organization_id IS NULL)")
        bind["organization_id"] = params.organization_id
    if params.doc_type:
        conditions.append("d.doc_type = :doc_type")
        bind["doc_type"] = params.doc_type
    if params.source:
        conditions.append("d.source_label ILIKE :source")
        bind["source"] = f"%{params.source}%"
    if params.jurisdiction:
        conditions.append("m.jurisdiction_code = :jurisdiction")
        bind["jurisdiction"] = params.jurisdiction
    if params.species:
        conditions.append("m.species && CAST(:species AS text[])")
        bind["species"] = params.species
    if params.welfare_category:
        conditions.append("m.welfare_categories && CAST(:welfare_category AS text[])")
        bind["welfare_category"] = params.welfare_category
    if params.industry:
        conditions.append("m.industries && CAST(:industry AS text[])")
        bind["industry"] = params.industry
    if params.facility_type:
        conditions.append("m.facility_types && CAST(:facility_type AS text[])")
        bind["facility_type"] = params.facility_type
    if params.date_from:
        conditions.append("COALESCE(m.document_date, m.inspection_date) >= :date_from")
        bind["date_from"] = params.date_from
    if params.date_to:
        conditions.append("COALESCE(m.document_date, m.inspection_date) <= :date_to")
        bind["date_to"] = params.date_to
    return conditions, bind


def _sample_response(params: SearchRequest) -> SearchResponse:
    metadata = SAMPLE_DOCUMENT["metadata"]
    return SearchResponse(
        query=params.query or "",
        total_results=1,
        results=[
            SearchResult(
                id=SAMPLE_DOCUMENT["id"],
                title=SAMPLE_DOCUMENT["title"],
                filename=SAMPLE_DOCUMENT["filename"],
                doc_type=SAMPLE_DOCUMENT["doc_type"],
                source_label=SAMPLE_DOCUMENT["source_label"],
                retrieval_summary=SAMPLE_DOCUMENT["retrieval_summary"],
                metadata=SearchResultMetadata(
                    jurisdiction_code=metadata["jurisdiction_code"],
                    facility_name=metadata["facility_name"],
                    species=metadata["species"],
                    welfare_categories=metadata["welfare_categories"],
                    facility_types=metadata["facility_types"],
                    industries=metadata["industries"],
                    extra=metadata["extra"],
                ),
                scores=ScoreBreakdown(vector_score=0.72, bm25_score=0.64, metadata_boost=1.0, final_score=0.72),
                match_reason="Sample match showing the expected vector, full-text, and metadata score breakdown.",
                citation_label="Development sample",
            )
        ],
    )


async def hybrid_search(db: AsyncSession | None, params: SearchRequest) -> SearchResponse:
    if db is None:
        return _sample_response(params)

    conditions, bind = _build_filter_sql(params)
    has_query = bool(params.query and params.query.strip())
    has_filters = _has_filters(params)
    where_clause = " AND ".join(conditions)

    if has_query:
        sql = text(
            f"""
            WITH query AS (SELECT websearch_to_tsquery('english', :query) AS q),
            bm25 AS (
              SELECT c.document_id, max(ts_rank_cd(c.fts_vector, query.q, 32)) AS score
              FROM chunks c, query
              JOIN documents d ON d.id = c.document_id
              LEFT JOIN document_metadata m ON m.document_id = d.id
              WHERE {where_clause} AND c.fts_vector @@ query.q
              GROUP BY c.document_id
            )
            SELECT
              d.id::text,
              d.title,
              d.filename,
              d.doc_type,
              d.source_label,
              d.retrieval_summary,
              m.jurisdiction_code,
              m.facility_name,
              COALESCE(m.species, '{{}}') AS species,
              COALESCE(m.welfare_categories, '{{}}') AS welfare_categories,
              COALESCE(m.facility_types, '{{}}') AS facility_types,
              COALESCE(m.industries, '{{}}') AS industries,
              COALESCE(bm25.score, 0) AS bm25_score
            FROM documents d
            LEFT JOIN document_metadata m ON m.document_id = d.id
            LEFT JOIN bm25 ON bm25.document_id = d.id
            WHERE {where_clause}
              AND (:query = '' OR bm25.document_id IS NOT NULL OR d.retrieval_summary ILIKE :query_like OR d.title ILIKE :query_like)
            ORDER BY bm25_score DESC NULLS LAST, d.updated_at DESC
            LIMIT :limit
            """
        )
        bind = {**bind, "query": params.query or "", "query_like": f"%{params.query or ''}%", "limit": params.top_k}
    else:
        sql = text(
            f"""
            SELECT
              d.id::text,
              d.title,
              d.filename,
              d.doc_type,
              d.source_label,
              d.retrieval_summary,
              m.jurisdiction_code,
              m.facility_name,
              COALESCE(m.species, '{{}}') AS species,
              COALESCE(m.welfare_categories, '{{}}') AS welfare_categories,
              COALESCE(m.facility_types, '{{}}') AS facility_types,
              COALESCE(m.industries, '{{}}') AS industries,
              0 AS bm25_score
            FROM documents d
            LEFT JOIN document_metadata m ON m.document_id = d.id
            WHERE {where_clause}
            ORDER BY d.updated_at DESC
            LIMIT :limit
            """
        )
        bind = {**bind, "limit": params.top_k}

    rows = (await db.execute(sql, bind)).mappings().all()
    raw_bm25 = {row["id"]: float(row["bm25_score"] or 0) for row in rows}
    bm25_norm = normalize_scores(raw_bm25)

    results: list[SearchResult] = []
    for row in rows:
        metadata_boost = 1.0 if has_filters else 0.0
        vector_score = 0.0
        bm25_score = bm25_norm.get(row["id"], 0.0)
        final_score = params.vector_weight * vector_score + params.bm25_weight * bm25_score + params.metadata_weight * metadata_boost
        results.append(
            SearchResult(
                id=row["id"],
                title=row["title"],
                filename=row["filename"],
                doc_type=row["doc_type"],
                source_label=row["source_label"],
                retrieval_summary=row["retrieval_summary"],
                metadata=SearchResultMetadata(
                    jurisdiction_code=row["jurisdiction_code"],
                    facility_name=row["facility_name"],
                    species=list(row["species"] or []),
                    welfare_categories=list(row["welfare_categories"] or []),
                    facility_types=list(row["facility_types"] or []),
                    industries=list(row["industries"] or []),
                ),
                scores=ScoreBreakdown(
                    vector_score=round(vector_score, 4),
                    bm25_score=round(bm25_score, 4),
                    metadata_boost=round(metadata_boost, 4),
                    final_score=round(final_score, 4),
                ),
                match_reason="Matched through full-text search and metadata filters." if has_query else "Matched metadata filters.",
            )
        )

    return SearchResponse(query=params.query or "", total_results=len(results), results=results)
