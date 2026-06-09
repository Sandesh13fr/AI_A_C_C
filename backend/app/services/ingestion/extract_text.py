from __future__ import annotations

from pathlib import Path


def extract_text(path: str) -> dict:
    file_path = Path(path)
    if file_path.suffix.lower() in {".txt", ".md"}:
        return {"text": file_path.read_text(encoding="utf-8", errors="ignore"), "pages": [], "method": "plain_text"}
    return {"text": "", "pages": [], "method": "placeholder", "needs_ocr": file_path.suffix.lower() == ".pdf"}
