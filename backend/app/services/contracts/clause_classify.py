from __future__ import annotations


def classify_clause(text: str) -> str:
    lower = text.lower()
    if "audit" in lower:
        return "audit_right"
    if "termination" in lower:
        return "termination_for_cause"
    if "report" in lower:
        return "reporting_obligation"
    if "welfare" in lower:
        return "welfare_commitment"
    return "other"
