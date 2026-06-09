from __future__ import annotations

from app.core.governance import EXPORT_DISCLAIMER
from app.workers.celery_app import celery_app


@celery_app.task(name="exports.build")
def build_export(export_id: str) -> dict:
    return {"export_id": export_id, "status": "queued_for_implementation", "disclaimer_text": EXPORT_DISCLAIMER}
