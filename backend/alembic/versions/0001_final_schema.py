from __future__ import annotations

from pathlib import Path

from alembic import op


revision = "0001_final_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    schema_path = Path(__file__).resolve().parents[3] / "final_postgres_schema.sql"
    sql = schema_path.read_text(encoding="utf-8")
    op.get_bind().exec_driver_sql(sql)


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
