from __future__ import annotations

from dataclasses import dataclass


ORG_ROLES = {
    "org_admin",
    "compliance_analyst",
    "legal_reviewer",
    "investigator",
    "policy_researcher",
    "standards_author",
    "viewer",
}


@dataclass(frozen=True)
class Principal:
    user_id: str
    email: str
    global_role: str = "user"
    organization_id: str | None = None
    org_role: str | None = None

    @property
    def is_superadmin(self) -> bool:
        return self.global_role == "superadmin"


def can_access_organization(principal: Principal, organization_id: str | None) -> bool:
    if principal.is_superadmin:
        return True
    if organization_id is None:
        return True
    return principal.organization_id == organization_id
