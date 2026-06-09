from __future__ import annotations


def expected_missing_clauses(clause_types: set[str]) -> list[str]:
    expected = {"welfare_commitment", "audit_right", "reporting_obligation", "remediation"}
    return sorted(expected - clause_types)
