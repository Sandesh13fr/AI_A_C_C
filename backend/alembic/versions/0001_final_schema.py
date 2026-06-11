from __future__ import annotations

import re
from pathlib import Path

from alembic import op


revision = "0001_final_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()

    # ── Drop empty n8n tables that conflict with our schema ──────────────
    # These were created by the n8n ingestion pipeline but are empty (0 rows).
    # Our schema defines `regulatory_rules` and `regulatory_rule_versions`
    # with a different column set (e.g. citation_label vs canonical_citation).
    # Must drop regulatory_rule_versions first (FK dependency).
    conn.exec_driver_sql("DROP TABLE IF EXISTS regulatory_rule_versions CASCADE;")
    conn.exec_driver_sql("DROP TABLE IF EXISTS regulatory_rules CASCADE;")

    # ── Apply the canonical schema idempotently ──────────────────────────
    schema_path = Path(__file__).resolve().parents[3] / "final_postgres_schema.sql"
    raw = schema_path.read_text(encoding="utf-8")

    # Strip outer BEGIN/COMMIT — Alembic manages its own transaction
    raw = raw.strip()
    if raw.startswith("BEGIN;"):
        raw = raw[6:]
    if raw.endswith("COMMIT;"):
        raw = raw[:-7]

    # Make CREATE TABLE idempotent for already-existing tables
    raw = raw.replace("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")

    # Make CREATE INDEX idempotent (IF NOT EXISTS supported since PG14)
    raw = raw.replace("CREATE INDEX ", "CREATE INDEX IF NOT EXISTS ")

    # Wrap each CREATE TRIGGER in a DO block so existing triggers are skipped
    def _wrap_trigger(m: re.Match) -> str:
        stmt = m.group(0).rstrip(";")
        tname = stmt.split()[2]
        return (
            f"DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_trigger "
            f"WHERE tgname = '{tname}') THEN {stmt}; END IF; END $$;"
        )

    raw = re.sub(
        r"CREATE TRIGGER \w+ .+? EXECUTE FUNCTION set_updated_at\(\);",
        _wrap_trigger,
        raw,
        flags=re.IGNORECASE,
    )

    conn.exec_driver_sql(raw)


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS chat_messages, chat_sessions, audit_events, model_invocations,
        feedback_labels, eval_runs, eval_cases, eval_datasets, exports, analysis_signoffs,
        review_events, review_assignments, gap_findings, required_protections, contract_clauses,
        document_annotations, flag_citations, potential_risk_flags, analysis_runs,
        watchlist_events, watchlists, saved_searches, search_queries, rulebook_test_runs,
        rule_precedent_links, rule_chunks, rule_applicability, regulatory_rule_versions,
        regulatory_rules, rulebooks, pii_findings, embeddings, chunks, document_pages,
        document_metadata, documents, ingest_batches, source_fetch_runs, source_documents,
        data_sources, jurisdictions, welfare_categories, api_keys, organization_memberships,
        users, organizations CASCADE;
        DROP FUNCTION IF EXISTS set_updated_at() CASCADE;
        """
    )
