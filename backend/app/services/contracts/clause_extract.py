from __future__ import annotations


def extract_clauses(text: str) -> list[dict]:
    markers = ["welfare", "audit", "inspection", "termination", "remediation"]
    return [{"clause_type": "other", "clause_text": line.strip()} for line in text.splitlines() if any(marker in line.lower() for marker in markers)]
