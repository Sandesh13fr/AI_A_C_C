"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState, type ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";
import { getSession, type AuthSession } from "@/lib/auth";

interface SubNavItem {
  label: string;
  href: string;
  icon: IconName;
}

const SUB_NAV: SubNavItem[] = [
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Organisations", href: "/admin/organizations", icon: "Building2" },
  { label: "Data sources", href: "/admin/data-sources", icon: "Database" },
  { label: "Audit logs", href: "/admin/audit-logs", icon: "FileSearch" },
  { label: "Evaluations", href: "/admin/evaluations", icon: "BarChart2" },
  { label: "Security", href: "/admin/security", icon: "Shield" },
  { label: "Model settings", href: "/admin/model-settings", icon: "Cpu" },
];

interface AdminShellProps {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
}

export function AdminShell({ children, title, eyebrow, description, actions }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null | undefined>(undefined);

  useEffect(() => {
    const current = getSession();
    setSession(current);
    if (current && current.role !== "org_admin") {
      router.replace("/dashboard");
    }
  }, [router]);

  if (session === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-white p-8 text-center">
          <p className="text-label uppercase text-ink-500">OpenPaws</p>
          <h1 className="mt-3 font-display text-display-lg text-ink-900">Loading admin</h1>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AppShell
      pageEyebrow={eyebrow ?? "Organisation administration"}
      pageTitle={title}
      pageDescription={description}
      actions={actions}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[220px_1fr]">
        <aside className="surface h-fit">
          <header className="border-b border-border px-4 py-3">
            <p className="text-label uppercase text-ink-500">Admin</p>
          </header>
          <ul className="p-2">
            {SUB_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn("nav-item", active && "nav-item--active")}
                  >
                    <Icon name={item.icon} size={14} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
        <div className="space-y-6">{children}</div>
      </div>
    </AppShell>
  );
}
