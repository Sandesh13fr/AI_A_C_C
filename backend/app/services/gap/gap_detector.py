from __future__ import annotations


def detect_possible_gaps(required: list[str], observed: list[str]) -> list[dict]:
    observed_set = set(observed)
    return [{"finding_type": "possible_gap", "protection_name": item} for item in required if item not in observed_set]
