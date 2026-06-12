"use client";

import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/domain/stat-card";
import { adminStatDefs } from "@/lib/ui-config";

export default function AdminIndexPage() {
  return (
    <AppShell
      pageEyebrow="Organisation administration"
      pageTitle="Admin overview"
      pageDescription="Organisation administration, governance, and platform-wide configuration. Restricted to Admin and Org Admin roles."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminStatDefs.map((row) => (
          <StatCard
            key={row.label}
            label={row.label}
            value="—"
            description={row.description}
          />
        ))}
      </div>
    </AppShell>
  );
}
