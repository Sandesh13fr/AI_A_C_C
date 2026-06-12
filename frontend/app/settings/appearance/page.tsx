"use client";

import { useEffect, useState } from "react";
import { SettingsShell } from "@/components/domain/settings-shell";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/domain/stat-card";
import { dashboardStatDefs } from "@/lib/ui-config";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

export default function SettingsAppearancePage() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefers);
    }
  }, [theme]);

  return (
    <SettingsShell
      title="Appearance"
      eyebrow="Settings"
      description="Theme, density, and display preferences. The Design System reference also lives here."
    >
      <div className="surface p-5">
        <h2 className="section-heading">Theme</h2>
        <p className="mt-1 text-body-sm text-ink-500">
          Light and dark mode. The system option follows your OS preference.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(["light", "dark", "system"] as Theme[]).map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => setTheme(option)}
              className={cn(
                "rounded-md border px-4 py-3 text-left transition-colors",
                theme === option ? "border-brand bg-brand-light" : "border-border hover:bg-ink-50",
              )}
            >
              <p className="text-body-md font-medium capitalize text-ink-900">{option}</p>
              <p className="mt-1 text-body-sm text-ink-500">
                {option === "light" && "Restrained, paper-like background."}
                {option === "dark" && "High-contrast for dashboards and search."}
                {option === "system" && "Follows the OS setting."}
              </p>
            </button>
          ))}
        </div>
      </div>
      <div className="surface p-5">
        <h2 className="section-heading">Reference</h2>
        <p className="mt-1 text-body-sm text-ink-500">
          The design system reference (formerly at /design) is integrated here. Use the controls below
          to verify component behaviour. Live values are not available without data.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStatDefs.map((stat) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              value="—"
              description={stat.description}
              live={false}
            />
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>
    </SettingsShell>
  );
}
