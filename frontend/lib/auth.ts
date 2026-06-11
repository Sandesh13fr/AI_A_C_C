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
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  organisation: {
    id: string;
    name: string;
    slug: string;
  };
  role: UserRole;
};

const SESSION_KEY = "openpaws_session";
const SESSION_COOKIE = "openpaws_session_present";
const COOKIE_MAX_AGE = 60 * 60 * 12;

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function writeSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function setSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  writeSessionCookie();
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  if (typeof document !== "undefined") {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
  }
}

export function requireRole(session: AuthSession | null, roles: UserRole[]): boolean {
  if (!session) return false;
  return roles.includes(session.role);
}

export function hasSessionCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((item) => item.startsWith(`${SESSION_COOKIE}=`));
}

export function syncSessionState(): AuthSession | null {
  const session = getSession();
  if (session) {
    writeSessionCookie();
  }
  return session;
}

export { SESSION_COOKIE };
