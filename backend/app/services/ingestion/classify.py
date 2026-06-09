from __future__ import annotations


def classify_document(text: str, filename: str | None = None) -> dict:
    haystack = f"{filename or ''}\n{text[:4000]}".lower()
    if "contract" in haystack or "agreement" in haystack:
        doc_type = "contract"
    elif "9 cfr" in haystack or "regulation" in haystack:
        doc_type = "regulation"
    elif "inspection" in haystack:
        doc_type = "inspection_report"
    elif "consent decision" in haystack or "enforcement" in haystack:
        doc_type = "enforcement_action"
    else:
        doc_type = "unknown"
    return {"doc_type": doc_type, "confidence": 0.45, "method": "keyword_placeholder"}
