from __future__ import annotations


def required_protections_for(jurisdiction_code: str, document_type: str) -> list[str]:
    if jurisdiction_code == "US-FED" and document_type == "contract":
        return ["welfare_commitment", "audit_right", "reporting_obligation"]
    return []
