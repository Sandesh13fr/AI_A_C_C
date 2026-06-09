from __future__ import annotations


def validate_rulebook_payload(payload: dict) -> list[str]:
    errors: list[str] = []
    if not payload.get("name"):
        errors.append("name is required")
    if payload.get("rulebook_type") not in {None, "legal_minimum", "agency_guidance", "advocacy_standard"}:
        errors.append("unsupported rulebook_type")
    return errors
