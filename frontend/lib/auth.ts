export type UserRole =
  | "org_admin"
  | "compliance_analyst"
  | "legal_reviewer"
  | "investigator"
  | "policy_researcher"
  | "standards_author"
  | "viewer";

export type SignOffScope = "internal_use" | "external_publication" | "partner_share";

export type AuthSession = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  organisation: {
    id: string;
    name: string;
    slug: string;
  };
  role: UserRole;
};

const SESSION_KEY = "openpaws_session";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function requireRole(session: AuthSession | null, roles: UserRole[]): boolean {
  if (!session) return false;
  return roles.includes(session.role);
}
