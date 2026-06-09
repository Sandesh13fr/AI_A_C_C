from __future__ import annotations


def extract_metadata(text: str) -> dict:
    return {
        "jurisdiction_code": "US-FED" if "usda" in text.lower() or "aphis" in text.lower() else None,
        "species": [],
        "welfare_categories": [],
        "confidence": {"method": "placeholder"},
    }
