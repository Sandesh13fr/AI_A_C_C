"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { clearSession, syncSessionState, type AuthSession } from "@/lib/auth";
import { cn, titleCase } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
};

const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/search", label: "Search" },
  { href: "/documents", label: "Documents" },
  { href: "/uploads", label: "Uploads" },
  { href: "/analysis", label: "Analysis" },
  { href: "/review", label: "Review Queue" },
  { href: "/knowledge-base", label: "Knowledge Base" },
  { href: "/rulebooks", label: "Rulebooks" },
  { href: "/reports", label: "Reports" },
];

const utilityLinks: NavItem[] = [
  { href: "/contracts", label: "Contracts" },
  { href: "/gap-audits", label: "Gap Audits" },
  { href: "/chat", label: "Chat" },
  { href: "/admin", label: "Admin" },
  { href: "/settings", label: "Settings" },
];

function Sidebar({
  pathname,
  session,
  onNavigate,
}: {
  pathname: string;
  session: AuthSession;
  onNavigate?: () => void;
}) {
  return (
    <aside className="flex h-full w-full flex-col bg-app-panel">
      <div className="border-b border-app-line px-5 py-5">
        <Link href="/dashboard" className="block" onClick={onNavigate}>
          <p className="font-mono text-micro uppercase text-ink-soft">AI Animal Welfare</p>
          <p className="mt-2 font-display text-[2rem] leading-none text-ink">OpenPaws</p>
          <p className="mt-3 max-w-xs text-body-sm text-ink-soft">
            Decision-support compliance platform for evidence review, regulatory search, and governed reporting.
          </p>
        </Link>

        <div className="mt-5 rounded-card border border-app-line bg-app-bg px-4 py-3">
          <p className="font-mono text-micro uppercase text-ink-soft">Signed in</p>
          <p className="mt-2 text-body-sm font-medium text-ink">{session.user.name ?? session.user.email}</p>
          <p className="mt-1 text-body-sm text-ink-soft">
            {session.organisation.name} · {titleCase(session.role)}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-2 pb-2 font-mono text-micro uppercase text-ink-soft">Main navigation</p>
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center justify-between rounded-button px-3 py-3 text-body-sm transition-colors",
                  active ? "bg-app-teal text-white shadow-panel" : "text-ink hover:bg-app-subtle",
                )}
              >
                <span>{item.label}</span>
                <span className={cn("font-mono text-micro uppercase", active ? "text-white/70" : "text-ink-soft")}>
                  Open
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-app-line px-4 py-4">
        <div className="rounded-card border border-app-line bg-app-subtle px-4 py-3">
          <p className="font-mono text-micro uppercase text-ink-soft">Guardrail</p>
          <p className="mt-2 text-body-sm text-ink-soft">
            Findings remain candidate concerns or possible gaps until a human reviewer confirms next steps.
          </p>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null | undefined>(undefined);

  useEffect(() => {
    const currentSession = syncSessionState();
    setSession(currentSession);
    if (!currentSession) {
      const search = typeof window === "undefined" ? "" : window.location.search;
      const nextPath = `${pathname}${search}`;
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [pathname, router]);

  function handleSignOut() {
    clearSession();
    router.replace("/login");
  }

  if (session === undefined || session === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-app-bg px-4">
        <div className="w-full max-w-xl rounded-card border border-app-line bg-app-panel p-8 text-center shadow-panel">
          <p className="font-mono text-micro uppercase text-ink-soft">OpenPaws</p>
          <h1 className="mt-3 font-display text-[2.6rem] leading-none text-ink">Preparing workspace</h1>
          <p className="mt-3 text-body-sm text-ink-soft">
            Checking your session and routing you into the correct workspace surface.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-app-bg text-ink">
      <div className="mx-auto flex min-h-dvh max-w-[1680px]">
        <div className="sticky top-0 hidden h-dvh w-[312px] shrink-0 border-r border-app-line lg:block">
          <Sidebar pathname={pathname} session={session} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-app-line bg-app-bg/90 backdrop-blur-sm">
            <div className="grid gap-4 px-4 py-4 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
              <div className="space-y-2">
                <p className="font-mono text-micro uppercase text-ink-soft">Authenticated workspace</p>
                <div className="flex flex-wrap gap-2">
                  {utilityLinks.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "rounded-badge border px-3 py-1.5 font-mono text-micro uppercase transition-colors",
                          active
                            ? "border-app-teal bg-app-mint text-app-teal-deep"
                            : "border-app-line bg-app-panel text-ink-soft hover:border-app-line-strong hover:text-ink",
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <div className="rounded-badge border border-app-line bg-app-panel px-3 py-1.5 font-mono text-micro uppercase text-ink-soft">
                  {session.organisation.slug}
                </div>
                <div className="hidden rounded-badge border border-app-line bg-app-panel px-3 py-1.5 font-mono text-micro uppercase text-ink-soft sm:inline-flex">
                  Human review required
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="lg:hidden"
                  aria-label="Open navigation menu"
                  onClick={() => setMobileNavOpen((value) => !value)}
                >
                  Menu
                </Button>
                <Button type="button" variant="ghost" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            </div>

            {mobileNavOpen ? (
              <div className="border-t border-app-line bg-app-panel lg:hidden">
                <Sidebar pathname={pathname} session={session} onNavigate={() => setMobileNavOpen(false)} />
              </div>
            ) : null}
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <div className="space-y-6">
              <PageHeader title={title} description={subtitle} action={actions} />
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
