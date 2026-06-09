from __future__ import annotations

import pytest

from app.core.governance import (
    GovernanceError,
    validate_analysis_request,
    validate_chat_response,
    validate_export_request,
    validate_finding_output,
)
from app.core.permissions import Principal, can_access_organization


def test_finding_type_violation_is_rejected() -> None:
    with pytest.raises(GovernanceError):
        validate_finding_output(
            {
                "finding_type": "violation",
                "explanation": "Potential issue.",
                "calibrated_confidence": 0.8,
            }
        )


def test_rule_grounded_finding_without_citation_is_rejected() -> None:
    with pytest.raises(GovernanceError):
        validate_finding_output(
            {
                "finding_type": "potential_risk",
                "explanation": "The passage may need review.",
                "calibrated_confidence": 0.7,
                "claims_rule_grounding": True,
                "citations": [],
            }
        )


def test_analysis_without_jurisdiction_is_rejected() -> None:
    with pytest.raises(GovernanceError):
        validate_analysis_request({"analysis_type": "general_compliance", "document_id": "doc"})


def test_external_export_without_signoff_is_blocked() -> None:
    with pytest.raises(GovernanceError):
        validate_export_request({"export_scope": "external_publication"})


def test_chat_legal_conclusion_is_rejected() -> None:
    with pytest.raises(GovernanceError):
        validate_chat_response("This is a violation [CIT-1].", [{"citation_label": "CIT-1"}])


def test_cross_org_access_is_blocked_for_regular_user() -> None:
    principal = Principal(user_id="u1", email="user@example.com", organization_id="org-a", org_role="viewer")
    assert can_access_organization(principal, "org-a")
    assert not can_access_organization(principal, "org-b")
