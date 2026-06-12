from __future__ import annotations

import asyncio
import logging
import uuid
from typing import Any

import asyncpg

from app.core.config import get_settings
from app.services.ingestion.section_mapper import split_into_chunks
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)

SOURCE_LABELS: dict[str, str] = {
    "federal_register": "Federal Register",
    "regulations_gov": "Regulations.gov",
    "ecfr": "eCFR",
    "openstates": "Open States",
}

JURISDICTION_MAP: dict[str, str] = {
    "federal_register": "US-FED",
    "regulations_gov": "US-FED",
    "ecfr": "US-FED",
    "openstates": "US-MULTI",
}

WELFARE_KEYWORDS: dict[str, list[str]] = {
    "veterinary_care": ["veterinary", "veterinarian", "animal care", "health"],
    "housing": ["housing", "enclosure", "cage", "confinement", "space"],
    "transportation": ["transport", "shipment", "conveyance", "carrier"],
    "food_and_water": ["feed", "food", "water", "nutrition", "diet"],
    "biosecurity": ["biosecurity", "disease", "quarantine", "sanitary"],
    "euthanasia": ["euthanasia", "humane killing", "slaughter"],
    "recordkeeping": ["record", "documentation", "reporting"],
    "personnel": ["training", "personnel", "staff", "attending veterinarian"],
}


def _detect_welfare_categories(title: str, raw_text: str | None) -> list[str]:
    combined = (title + " " + (raw_text or "")).lower()
    categories: list[str] = []
    for category, keywords in WELFARE_KEYWORDS.items():
        if any(kw in combined for kw in keywords):
            categories.append(category)
    return categories if categories else ["general_compliance"]


def _build_doc_type(record_type: str) -> str:
    if record_type.endswith("_document"):
        return "regulation"
    if record_type.endswith("_agency"):
        return "policy"
    return "unknown"


async def _fetch_pending(
    conn: asyncpg.Connection, max_records: int = 50
) -> list[dict[str, Any]]:
    fetch_sql = """
        SELECT rs.id, rs.source_code, rs.external_id, rs.record_type,
               rs.title, rs.raw_text, rs.source_url, rs.raw_json, rs.fetched_at,
               rd.id as regulatory_document_id
        FROM raw_source_records rs
        JOIN regulatory_documents rd ON rd.external_id = rs.external_id AND rd.source_code = rs.source_code
        WHERE rs.record_type LIKE '%_document'
          AND rs.raw_text IS NOT NULL
          AND NOT EXISTS (
              SELECT 1 FROM source_documents sd
              WHERE sd.external_id = rs.external_id
                AND sd.data_source_id = (
                    SELECT ds.id FROM data_sources ds WHERE ds.source_key = rs.source_code
                )
          )
        ORDER BY rs.fetched_at ASC
        LIMIT $1
    """
    rows = await conn.fetch(fetch_sql, max_records)
    return [dict(r) for r in rows]


async def _ensure_data_source(conn: asyncpg.Connection, source_code: str) -> str:
    row = await conn.fetchrow(
        "SELECT id FROM data_sources WHERE source_key = $1", source_code
    )
    if row:
        return str(row["id"])

    new_id = str(uuid.uuid4())
    if source_code in ('ecfr', 'govinfo', 'federal_register', 'regulations_gov', 'usda_aphis', 'foia'):
        source_type = source_code
    elif source_code == 'openstates':
        source_type = 'state_regulation'
    elif source_code in ('data_gov', 'foia_gov'):
        source_type = 'foia'
    else:
        source_type = 'other'
    await conn.execute(
        """
        INSERT INTO data_sources (id, source_key, name, source_type, base_url, refresh_strategy, rights_default)
        VALUES ($1, $2, $3, $4, '', 'manual', 'unknown')
        """,
        new_id,
        source_code,
        SOURCE_LABELS.get(source_code, source_code),
        source_type,
    )
    return new_id


async def _promote_record(conn: asyncpg.Connection, record: dict[str, Any]) -> str | None:
    source_code = record["source_code"]
    external_id = record["external_id"]
    title = record["title"] or "Untitled"
    raw_text = record["raw_text"] or ""
    record_type = record["record_type"]
    source_url = record["source_url"] or ""
    fetched_at = record["fetched_at"]

    # 1. Ensure data_source exists
    data_source_id = await _ensure_data_source(conn, source_code)

    # 2. Check again for duplicate (race condition guard)
    existing = await conn.fetchrow(
        """
        SELECT sd.id FROM source_documents sd
        WHERE sd.external_id = $1 AND sd.data_source_id = $2::uuid
        """,
        external_id,
        data_source_id,
    )
    if existing:
        return None

    # 3. Create source_document
    source_doc_id = str(uuid.uuid4())
    await conn.execute(
        """
        INSERT INTO source_documents (id, data_source_id, external_id, title, source_url,
                                      jurisdiction_code, document_type, rights_status, raw_metadata)
        VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, 'public', '{}'::jsonb)
        """,
        source_doc_id,
        data_source_id,
        external_id,
        title,
        source_url,
        JURISDICTION_MAP.get(source_code, "US-FED"),
        record_type,
    )

    # 4. Create document
    doc_id = str(uuid.uuid4())
    doc_type = _build_doc_type(record_type)
    source_label = SOURCE_LABELS.get(source_code, source_code)
    await conn.execute(
        """
        INSERT INTO documents (id, source_document_id, title, filename, original_name,
                               file_path, mime_type, doc_type, source_label, status,
                               ingestion_stage, raw_text, retrieval_summary, created_at, updated_at)
        VALUES ($1::uuid, $2::uuid, $3, $4, $4, $5, 'text/plain', $6, $7, 'complete',
                'ready', $8, $9, $10, $10)
        """,
        doc_id,
        source_doc_id,
        title,
        f"{source_code}-{external_id}.txt",
        f"{source_code}/{external_id}.txt",
        doc_type,
        source_label,
        raw_text,
        (raw_text[:200] + "..." if len(raw_text) > 200 else raw_text),
        fetched_at,
    )

    # 5. Create document_metadata
    jurisdiction = JURISDICTION_MAP.get(source_code, "US-FED")
    welfare_categories = _detect_welfare_categories(title, raw_text)
    await conn.execute(
        """
        INSERT INTO document_metadata (document_id, jurisdiction_code, reference_number,
                                       welfare_categories, extra)
        VALUES ($1::uuid, $2, $3, $4::text[], '{}'::jsonb)
        """,
        doc_id,
        jurisdiction,
        external_id,
        welfare_categories,
    )

    # 6. Create chunks
    chunks = split_into_chunks(raw_text)
    for chunk in chunks:
        chunk_id = str(uuid.uuid4())
        await conn.execute(
            """
            INSERT INTO chunks (id, document_id, chunk_index, chunk_type,
                                char_start, char_end, raw_text, token_count)
            VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8)
            """,
            chunk_id,
            doc_id,
            chunk["chunk_index"],
            chunk["chunk_type"],
            chunk.get("char_start"),
            chunk.get("char_end"),
            chunk["raw_text"],
            len(chunk["raw_text"].split()),
        )

    # 7. Create document_topics for each welfare category (FK to regulatory_documents)
    reg_doc_id = record["regulatory_document_id"]
    for cat in welfare_categories:
        await conn.execute(
            """
            INSERT INTO document_topics (document_id, topic_code, confidence, matched_terms)
            VALUES ($1::uuid, $2, 0.5, ARRAY[$3]::text[])
            ON CONFLICT DO NOTHING
            """,
            reg_doc_id,
            cat,
            cat,
        )

    return doc_id


async def _run_promotion(max_records: int = 50) -> dict[str, Any]:
    settings = get_settings()
    sync_url = settings.sync_database_url

    conn = await asyncpg.connect(sync_url)
    try:
        pending = await _fetch_pending(conn, max_records)
        promoted = 0
        errors = 0

        for record in pending:
            try:
                doc_id = await _promote_record(conn, record)
                if doc_id:
                    promoted += 1
            except Exception as exc:
                errors += 1
                logger.error("Failed to promote record %s: %s", record["external_id"], exc)

        return {
            "pending": len(pending),
            "promoted": promoted,
            "errors": errors,
            "source_codes": list(set(r["source_code"] for r in pending)),
        }
    finally:
        await conn.close()


@celery_app.task(name="ingest.promote_source_records")
def promote_source_records(max_records: int = 50) -> dict[str, Any]:
    return asyncio.run(_run_promotion(max_records))
