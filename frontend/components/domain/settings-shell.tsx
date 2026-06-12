"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

interface SubNavItem {
  label: string;
  href: string;
  icon: IconName;
}

const SUB_NAV: SubNavItem[] = [
  { label: "Profile", href: "/settings/profile", icon: "Users" },
  { label: "Notifications", href: "/settings/notifications", icon: "Bell" },
  { label: "Appearance", href: "/settings/appearance", icon: "LayoutDashboard" },
  { label: "Integrations", href: "/settings/integrations", icon: "Database" },
  { label: "API keys", href: "/settings/api-keys", icon: "Shield" },
];

interface SettingsShellProps {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
}

export function SettingsShell({ children, title, eyebrow, description, actions }: SettingsShellProps) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  return (
    <AppShell
      pageEyebrow={eyebrow ?? "Workspace preferences"}
      pageTitle={title}
      pageDescription={description}
      actions={actions}
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[220px_1fr]">
        <aside className="surface h-fit">
          <header className="border-b border-border px-4 py-3">
            <p className="text-label uppercase text-ink-500">Settings</p>
          </header>
          <ul className="p-2">
            {SUB_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} className={cn("nav-item", active && "nav-item--active")}>
                    <Icon name={item.icon} size={14} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
        <div className="space-y-6">{children}</div>
        <input
          type="hidden"
          value={darkMode ? "dark" : "light"}
          onChange={() => undefined}
          aria-hidden="true"
        />
      </div>
    </AppShell>
  );
}
