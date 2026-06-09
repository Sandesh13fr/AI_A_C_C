from __future__ import annotations


def normalize_severity(value: str | None) -> str:
    return value if value in {"low", "medium", "high", "critical"} else "low"
