from __future__ import annotations

from app.services.ingestion.clean_text import clean_text
from app.services.ingestion.classify import classify_document
from app.workers.celery_app import celery_app


@celery_app.task(name="ingest.process_document")
def process_document_text(document_id: str, raw_text: str) -> dict:
    cleaned = clean_text(raw_text)
    classification = classify_document(cleaned)
    return {"document_id": document_id, "status": "ready", "classification": classification, "text_length": len(cleaned)}
