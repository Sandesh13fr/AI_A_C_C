"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { Notice } from "@/components/ui/notice";
import { EmptyState } from "@/components/ui/empty-state";

export default function GapAuditsPage() {
  return (
    <AppShell
      pageEyebrow="Policy gap analysis"
      pageTitle="Gap Audits"
      pageDescription="Structured gap-audit runs. Compare policies or contracts against expected protections, then route possible gaps into review."
      actions={
        <Link href="/gap-audits/new">
          <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
            New gap audit
          </Button>
        </Link>
      }
    >
      <div className="mt-6 space-y-6">
        <Notice title="Gap audit scope" tone="info">
          Gap audits run as a structured analysis type. The flow mirrors Analysis with the
          &quot;gap audit&quot; flag set on the run metadata.
        </Notice>
        <div className="surface">
          <header className="border-b border-border px-4 py-3">
            <h2 className="font-display text-display-lg text-ink-900">Required protection checklist</h2>
            <p className="mt-1 text-body-sm text-ink-500">
              Once a gap-audit run completes, the protected-areas checklist will appear here.
            </p>
          </header>
          <div className="px-4 py-10">
            <EmptyState
              title="No gap audits yet"
              description="Start a gap audit to compare policies or contracts against expected protections."
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
