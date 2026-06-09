from __future__ import annotations


def next_analysis_status(has_findings: bool) -> str:
    return "needs_review" if has_findings else "reviewed"
