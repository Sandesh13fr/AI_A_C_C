from __future__ import annotations

from pathlib import Path


def test_final_schema_contains_core_tables() -> None:
    schema = Path(__file__).resolve().parents[3] / "final_postgres_schema.sql"
    text = schema.read_text(encoding="utf-8")
    for table in [
        "organizations",
        "documents",
        "chunks",
        "embeddings",
        "regulatory_rules",
        "analysis_runs",
        "potential_risk_flags",
        "model_invocations",
        "chat_sessions",
    ]:
        assert f"CREATE TABLE {table}" in text


def test_alembic_migration_applies_final_schema_file() -> None:
    migration = Path(__file__).resolve().parents[2] / "alembic" / "versions" / "0001_final_schema.py"
    text = migration.read_text(encoding="utf-8")
    assert "final_postgres_schema.sql" in text
    assert "exec_driver_sql" in text


def test_celery_app_imports() -> None:
    from app.workers.celery_app import celery_app
    from app.workers.jobs_ingest import process_document_text

    assert celery_app is not None
    result = process_document_text("doc-1", "inspection text")
    assert result["status"] == "ready"
