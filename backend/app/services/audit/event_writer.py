from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4


def build_audit_event(action: str, entity_type: str, entity_id: str | None = None, metadata: dict[str, Any] | None = None) -> dict:
    return {
        "id": str(uuid4()),
        "action": action,
        "entity_type": entity_type,
        "entity_id": entity_id,
        "metadata": metadata or {},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
