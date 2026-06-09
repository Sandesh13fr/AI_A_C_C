import type { UserRole } from "./auth";

type PermissionCheck = {
  resource: string;
  action: "create" | "read" | "update" | "delete" | "sign_off" | "export";
};

const ROLE_PERMISSIONS: Record<UserRole, PermissionCheck["action"][]> = {
  org_admin: ["create", "read", "update", "delete", "sign_off", "export"],
  compliance_analyst: ["create", "read", "update", "export"],
  legal_reviewer: ["read", "update", "sign_off", "export"],
  investigator: ["create", "read", "update"],
  policy_researcher: ["read"],
  standards_author: ["create", "read", "update"],
  viewer: ["read"],
};

export function can(role: UserRole, action: PermissionCheck["action"]): boolean {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
}

export function canAccessResource(
  role: UserRole,
  resourceOwnerOrgId: string,
  userOrgId: string,
): boolean {
  if (role === "org_admin") return true;
  return resourceOwnerOrgId === userOrgId;
}
