from __future__ import annotations


def score_commitment_specificity(text: str) -> float:
    signals = sum(token in text.lower() for token in ["shall", "must", "within", "audit", "records"])
    return min(1.0, signals / 5)
