from __future__ import annotations

from app.core.governance import validate_finding_output


def validate_analyzer_findings(findings: list[dict]) -> list[dict]:
    for finding in findings:
        validate_finding_output(finding)
    return findings
