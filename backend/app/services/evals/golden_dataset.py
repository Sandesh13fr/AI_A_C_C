from __future__ import annotations


def build_eval_case(document_id: str, expected_findings: list[dict]) -> dict:
    return {"document_id": document_id, "expected_findings": expected_findings}
