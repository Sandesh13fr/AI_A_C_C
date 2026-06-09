"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  ["/search", "Search"],
  ["/documents", "Documents"],
  ["/uploads", "Uploads"],
  ["/analysis", "Analysis"],
  ["/review", "Review"],
  ["/contracts", "Contracts"],
  ["/gap-audits", "Gap Audits"],
  ["/rulebooks", "Rulebooks"],
  ["/reports", "Reports"],
  ["/chat", "Chat"],
  ["/admin", "Admin"],
  ["/design", "Design"],
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-dark-surface text-white">
      <div className="border-b border-dark-border bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/search" className="font-display text-h3 text-pretty">
            OpenPaws
          </Link>
          <nav className="flex gap-2 overflow-x-auto pb-1 text-body-sm">
            {navItems.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 rounded-button border border-dark-border px-3 py-1.5 text-mid-grey hover:border-teal hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-5 py-6">
        <div className="mb-6">
          <h1 className="text-h1 text-balance">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-3xl text-body-sm text-mid-grey text-pretty">{subtitle}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
