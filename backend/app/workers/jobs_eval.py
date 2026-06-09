from __future__ import annotations

from app.workers.celery_app import celery_app


@celery_app.task(name="evals.run")
def run_eval(eval_run_id: str) -> dict:
    return {"eval_run_id": eval_run_id, "status": "queued_for_implementation"}
