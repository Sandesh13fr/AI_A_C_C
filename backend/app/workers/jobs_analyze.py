from __future__ import annotations

from app.workers.celery_app import celery_app


@celery_app.task(name="analysis.run")
def run_analysis(analysis_run_id: str) -> dict:
    return {"analysis_run_id": analysis_run_id, "status": "queued_for_implementation"}
