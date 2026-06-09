from __future__ import annotations

from app.workers.celery_app import celery_app


@celery_app.task(name="watchlists.check")
def check_watchlist(watchlist_id: str) -> dict:
    return {"watchlist_id": watchlist_id, "status": "queued_for_implementation"}
