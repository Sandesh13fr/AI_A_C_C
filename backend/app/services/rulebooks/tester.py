from __future__ import annotations


def build_rulebook_test_plan(rulebook_id: str, sample_document_ids: list[str]) -> dict:
    return {"rulebook_id": rulebook_id, "sample_document_ids": sample_document_ids, "status": "queued"}
