import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "openpaws_session_present";

const protectedPrefixes = [
  "/dashboard",
  "/search",
  "/documents",
  "/uploads",
  "/analysis",
  "/review",
  "/knowledge-base",
  "/rulebooks",
  "/reports",
  "/contracts",
  "/gap-audits",
  "/chat",
  "/admin",
  "/settings",
  "/design",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/rules") {
    return NextResponse.redirect(new URL("/knowledge-base", request.url));
  }

  if (pathname === "/review-queue") {
    return NextResponse.redirect(new URL("/review", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasSession ? "/dashboard" : "/login", request.url));
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!isProtected || hasSession) {
    return NextResponse.next();
  }

  const nextUrl = `${pathname}${search}`;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", nextUrl);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon.svg|apple-icon.png).*)"],
};
