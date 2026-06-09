from __future__ import annotations

from typing import Any


def validate_citations(citations: list[dict[str, Any]], allowed_source_ids: set[str] | None = None) -> list[dict[str, Any]]:
    valid: list[dict[str, Any]] = []
    for citation in citations:
        label = citation.get("citation_label")
        source_id = citation.get("source_id")
        if not label:
            continue
        if allowed_source_ids is not None and source_id not in allowed_source_ids:
            continue
        valid.append(citation)
    return valid
