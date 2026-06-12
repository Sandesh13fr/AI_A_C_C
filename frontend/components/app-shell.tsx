"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Breadcrumbs, type Crumb } from "@/components/domain/breadcrumbs";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/domain/search-input";
import { clearSession, syncSessionState, type AuthSession } from "@/lib/auth";
import { cn, titleCase } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: IconName;
  badge?: string | null;
  match?: (pathname: string) => boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
};

type NavConfig = {
  core: NavGroup;
  knowledge: NavGroup;
  operations: NavGroup;
};

const navConfig: NavConfig = {
  core: {
    label: "Core workflow",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Documents", href: "/documents", icon: "FileText", match: (p) => p === "/documents" || p.startsWith("/documents/") },
      { label: "Review Queue", href: "/review", icon: "CheckSquare", match: (p) => p === "/review" || p.startsWith("/review/") },
      { label: "Analysis", href: "/analysis/new", icon: "BarChart2", match: (p) => p.startsWith("/analysis") || p.startsWith("/uploads") },
      { label: "Reports", href: "/reports", icon: "BookOpen", match: (p) => p === "/reports" || p.startsWith("/reports/") },
    ],
  },
  knowledge: {
    label: "Knowledge",
    items: [
      { label: "Rulebooks", href: "/rulebooks", icon: "Scale", match: (p) => p === "/rulebooks" || p.startsWith("/rulebooks/") },
      { label: "Knowledge Base", href: "/knowledge-base", icon: "Database", match: (p) => p === "/knowledge-base" || p.startsWith("/knowledge-base/") },
    ],
  },
  operations: {
    label: "Operations",
    collapsible: true,
    defaultCollapsed: true,
    items: [
      { label: "Contracts", href: "/contracts", icon: "Handshake" },
      { label: "Gap Audits", href: "/gap-audits", icon: "ClipboardCheck" },
      { label: "Watchlists", href: "/watchlists", icon: "Star", match: (p) => p === "/watchlists" || p.startsWith("/watchlists/") },
    ],
  },
};

const footerNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: "Settings", match: (p) => p === "/settings" || p.startsWith("/settings/") || p === "/design" },
  { label: "Admin", href: "/admin", icon: "Shield", match: (p) => p === "/admin" || p.startsWith("/admin/") },
];

function isItemActive(item: NavItem, pathname: string) {
  if (item.match) return item.match(pathname);
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

interface AppShellProps {
  title?: string;
  pageTitle?: string;
  pageEyebrow?: string;
  pageDescription?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  /** Render only the main slot. Sidebar/topbar are managed by the shell. */
  children: ReactNode;
  hideChrome?: boolean;
}

export function AppShell({
  pageTitle,
  pageEyebrow,
  pageDescription,
  breadcrumbs,
  actions,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null | undefined>(undefined);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => ({
    [navConfig.operations.label]: navConfig.operations.defaultCollapsed ?? false,
  }));

  useEffect(() => {
    const current = syncSessionState();
    setSession(current);
    if (!current) {
      const search = typeof window === "undefined" ? "" : window.location.search;
      const nextPath = `${pathname}${search}`;
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [pathname, router]);

  const closeMobile = useCallback(() => setMobileNavOpen(false), []);

  if (session === undefined || session === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-white p-8 text-center">
          <p className="text-label uppercase text-ink-500">OpenPaws</p>
          <h1 className="mt-3 font-display text-display-lg text-ink-900">Preparing workspace</h1>
          <p className="mt-2 text-body-sm text-ink-500">
            Checking your session and routing you into the correct workspace surface.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh" style={{ gridTemplateColumns: "220px 1fr", gridTemplateRows: "52px 1fr" }}>
        <Sidebar
          pathname={pathname}
          session={session}
          collapsedGroups={collapsedGroups}
          onToggleGroup={(label) =>
            setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }))
          }
          onNavigate={closeMobile}
          className="row-span-2 hidden lg:flex"
        />

        <Topbar
          session={session}
          breadcrumbs={breadcrumbs}
          pageTitle={pageTitle}
          onSignOut={() => {
            clearSession();
            router.replace("/login");
          }}
          onOpenMobileNav={() => setMobileNavOpen((value) => !value)}
          mobileNavOpen={mobileNavOpen}
        />

        <main className="min-w-0 bg-ink-50">
          <div className="mx-auto w-full max-w-content px-6 py-8 lg:px-8">
            {pageTitle || pageEyebrow || pageDescription || actions ? (
              <header className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  {pageEyebrow ? (
                    <p className="text-label uppercase text-ink-500">{pageEyebrow}</p>
                  ) : null}
                  {pageTitle ? <h1 className="page-title">{pageTitle}</h1> : null}
                  {pageDescription ? (
                    <p className="max-w-2xl text-body-md text-ink-500">{pageDescription}</p>
                  ) : null}
                </div>
                {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
              </header>
            ) : null}
            <div className={cn(pageTitle || pageDescription ? "mt-6" : "")}>{children}</div>
          </div>
        </main>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={closeMobile} aria-hidden="true" />
            <div className="relative h-full w-[280px] bg-white shadow-xl">
              <Sidebar
                pathname={pathname}
                session={session}
                collapsedGroups={collapsedGroups}
                onToggleGroup={(label) =>
                  setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }))
                }
                onNavigate={closeMobile}
                className="flex h-full"
              />
            </div>
          </div>
        ) : null}
      </div>
  );
}

interface SidebarProps {
  pathname: string;
  session: AuthSession;
  collapsedGroups: Record<string, boolean>;
  onToggleGroup: (label: string) => void;
  onNavigate?: () => void;
  className?: string;
}

function Sidebar({ pathname, session, collapsedGroups, onToggleGroup, onNavigate, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-[220px] flex-col border-r border-border bg-white",
        className,
      )}
    >
      <div className="flex h-topbar items-center gap-2 border-b border-border px-4">
        <span
          className="flex size-7 items-center justify-center rounded-sm bg-brand text-white"
          aria-hidden="true"
        >
          <PawsMark size={16} />
        </span>
        <span className="font-display text-[18px] leading-none text-ink-900">OpenPaws</span>
      </div>

      <div className="border-b border-border-subtle px-4 py-3">
        <p className="text-body-sm font-medium text-ink-900">
          {session.user.name ?? session.user.email}
        </p>
        <p className="mt-0.5 text-label uppercase text-ink-500">
          {session.organisation.name} · {titleCase(session.role)}
        </p>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 py-4" aria-label="Primary">
        <NavSection
          group={navConfig.core}
          pathname={pathname}
          collapsed={false}
          onToggleGroup={onToggleGroup}
          onNavigate={onNavigate}
        />

        <div className="h-6" aria-hidden="true" />

        <NavSection
          group={navConfig.knowledge}
          pathname={pathname}
          collapsed={false}
          onToggleGroup={onToggleGroup}
          onNavigate={onNavigate}
        />

        <div className="h-6" aria-hidden="true" />

        <NavSection
          group={navConfig.operations}
          pathname={pathname}
          collapsed={Boolean(collapsedGroups[navConfig.operations.label])}
          onToggleGroup={onToggleGroup}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="border-t border-border-subtle px-2 py-3">
        {footerNav.map((item) => {
          const active = isItemActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn("nav-item", active && "nav-item--active")}
              aria-current={active ? "page" : undefined}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

interface NavSectionProps {
  group: NavGroup;
  pathname: string;
  collapsed: boolean;
  onToggleGroup: (label: string) => void;
  onNavigate?: () => void;
}

function NavSection({ group, pathname, collapsed, onToggleGroup, onNavigate }: NavSectionProps) {
  return (
    <div>
      {group.label ? (
        <button
          type="button"
          onClick={group.collapsible ? () => onToggleGroup(group.label) : undefined}
          className={cn(
            "flex w-full items-center justify-between px-3 pb-1.5 text-left text-label uppercase text-ink-500",
            group.collapsible && "cursor-pointer hover:text-ink-700",
          )}
          aria-expanded={group.collapsible ? !collapsed : undefined}
        >
          <span>{group.label}</span>
          {group.collapsible ? (
            <Icon name="ChevronDown" size={12} className={cn("transition-transform", collapsed && "-rotate-90")} />
          ) : null}
        </button>
      ) : null}
      {!collapsed ? (
        <ul className="space-y-0.5">
          {group.items.map((item) => {
            const active = isItemActive(item, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn("nav-item", active && "nav-item--active")}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon name={item.icon} size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="font-mono text-mono-sm text-ink-500">{item.badge}</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

interface TopbarProps {
  session: AuthSession;
  breadcrumbs?: Crumb[];
  pageTitle?: string;
  onSignOut: () => void;
  onOpenMobileNav: () => void;
  mobileNavOpen: boolean;
}

function Topbar({ session, breadcrumbs, onSignOut, onOpenMobileNav, mobileNavOpen }: TopbarProps) {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-topbar items-center gap-4 border-b border-border bg-white px-4 lg:px-6">
      <button
        type="button"
        className="lg:hidden text-ink-500 hover:text-ink-900"
        aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileNavOpen}
        onClick={onOpenMobileNav}
      >
        <Icon name={mobileNavOpen ? "X" : "PanelLeft"} size={20} />
      </button>
      <div className="min-w-0 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumbs items={breadcrumbs} />
        ) : (
          <span className="sr-only">OpenPaws</span>
        )}
      </div>
      <div className="hidden md:block md:w-[280px] lg:w-[420px]">
        <SearchInput
          placeholder="Search documents, rules, reports…"
          shortcut="⌘K"
          onSubmit={(value) => {
            if (value.trim()) router.push(`/documents?q=${encodeURIComponent(value.trim())}`);
          }}
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span
          className="hidden items-center gap-2 rounded-sm border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-1 text-label uppercase text-accent-gold lg:inline-flex"
          aria-label="Human review required"
        >
          <Icon name="AlertTriangle" size={12} />
          Human review required
        </span>
        <span className="hidden font-mono text-mono-sm text-ink-500 lg:inline">
          {session.organisation.slug}
        </span>
        <div className="relative">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full bg-brand-light text-brand hover:bg-brand hover:text-white"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            onClick={() => setUserMenuOpen((value) => !value)}
          >
            <span className="font-mono text-label">
              {(session.user.name ?? session.user.email).slice(0, 2).toUpperCase()}
            </span>
          </button>
          {userMenuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-10 w-56 rounded-md border border-border bg-white p-1 shadow-lg"
            >
              <Link
                role="menuitem"
                href="/settings/profile"
                onClick={() => setUserMenuOpen(false)}
                className="block rounded-sm px-3 py-2 text-body-sm text-ink-700 hover:bg-ink-50"
              >
                Profile
              </Link>
              <Link
                role="menuitem"
                href="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="block rounded-sm px-3 py-2 text-body-sm text-ink-700 hover:bg-ink-50"
              >
                Settings
              </Link>
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  onSignOut();
                }}
                className="block w-full rounded-sm px-3 py-2 text-left text-body-sm text-ink-700 hover:bg-ink-50"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function PawsMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="6" cy="10" r="2.4" />
      <circle cx="10" cy="6" r="2.4" />
      <circle cx="14" cy="6" r="2.4" />
      <circle cx="18" cy="10" r="2.4" />
      <path d="M12 11c-3 0-6 2.5-6 5.5 0 2 1.6 3.5 3.5 3.5 1 0 1.7-.3 2.5-.7.7-.4 1-.4 1.7 0 .8.4 1.5.7 2.5.7 1.9 0 3.5-1.5 3.5-3.5C18 13.5 15 11 12 11z" />
    </svg>
  );
}

export { Button };
