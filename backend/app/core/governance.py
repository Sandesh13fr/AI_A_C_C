from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any


ALLOWED_FINDING_TYPES = {
    "potential_risk",
    "possible_gap",
    "weak_commitment",
    "ambiguous_language",
    "needs_human_review",
}

FORBIDDEN_LEGAL_DETERMINATION_PATTERNS = [
    re.compile(r"\b(?:is|are|was|were)\s+(?:a\s+)?violation\b", re.I),
    re.compile(r"\b(?:violates|violated|non[\s-]?compliant|illegal|unlawful)\b", re.I),
    re.compile(r"\b(?:enforcement recommendation|legal advice|legal determination)\b", re.I),
    re.compile(r"\b(?:liable|guilty|compliant|in compliance)\b", re.I),
]

EXPORT_DISCLAIMER = (
    "This report is decision-support material only. It surfaces potential risks, "
    "possible gaps, weak commitments, ambiguous language, or items needing human "
    "review. It is not legal advice, a legal determination, a confirmed violation, "
    "or an enforcement recommendation."
)


class GovernanceError(ValueError):
    pass


@dataclass(frozen=True)
class FindingCitation:
    citation_type: str
    citation_label: str
    source_id: str | None = None


def detect_forbidden_language(text: str | None) -> list[str]:
    if not text:
        return []
    return [match.group(0) for pattern in FORBIDDEN_LEGAL_DETERMINATION_PATTERNS for match in pattern.finditer(text)]


def validate_finding_output(finding: dict[str, Any]) -> None:
    finding_type = finding.get("finding_type")
    if finding_type not in ALLOWED_FINDING_TYPES:
        raise GovernanceError(f"Unsupported finding_type: {finding_type}")

    explanation = str(finding.get("explanation") or "")
    forbidden = detect_forbidden_language(explanation)
    if forbidden:
        raise GovernanceError(f"Finding uses forbidden legal-determination language: {', '.join(forbidden)}")

    confidence = finding.get("calibrated_confidence")
    if confidence is None or not 0 <= float(confidence) <= 1:
        raise GovernanceError("calibrated_confidence must be between 0 and 1")

    claims_rule_grounding = bool(finding.get("rule_version_id") or finding.get("claims_rule_grounding"))
    citations = finding.get("citations") or []
    if claims_rule_grounding and not citations:
        raise GovernanceError("Rule-grounded findings require at least one citation")


def validate_analysis_request(payload: dict[str, Any]) -> None:
    if not payload.get("jurisdiction_code"):
        raise GovernanceError("Analysis runs require a jurisdiction_code")
    if payload.get("analysis_type") not in {"general_compliance", "contract", "gap", "policy_comparison"}:
        raise GovernanceError("Unsupported analysis_type")


def validate_export_request(payload: dict[str, Any]) -> None:
    scope = payload.get("export_scope")
    if scope in {"external_publication", "partner_share"} and not payload.get("signoff_id"):
        raise GovernanceError("External or partner-share exports require human sign-off")


def validate_chat_response(content: str, citations: list[dict[str, Any]] | None = None) -> None:
    forbidden = detect_forbidden_language(content)
    if forbidden:
        raise GovernanceError(f"Chat response uses forbidden legal-conclusion language: {', '.join(forbidden)}")
    if content.strip() and "[CIT-" in content and not citations:
        raise GovernanceError("Chat response citation markers must resolve to citations")
