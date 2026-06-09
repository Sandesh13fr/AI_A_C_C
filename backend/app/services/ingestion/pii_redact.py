from __future__ import annotations

import hashlib
import re


EMAIL_RE = re.compile(r"[\w.\-+]+@[\w.\-]+\.\w+")


def detect_pii(text: str) -> list[dict]:
    findings: list[dict] = []
    for match in EMAIL_RE.finditer(text):
        findings.append(
            {
                "pii_type": "email",
                "detected_text_hash": hashlib.sha256(match.group(0).encode()).hexdigest(),
                "char_start": match.start(),
                "char_end": match.end(),
                "confidence": 0.95,
            }
        )
    return findings
