import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { gapChecklist } from "@/lib/mock-data";

export default function GapAuditsPage() {
  return (
    <AppShell title="Gap Audits" subtitle="Compare policies and contracts against expected protections, then route possible gaps into review.">
      {gapChecklist.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Required protection checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gapChecklist.map((item) => (
              <div key={item.label} className="rounded-card border border-app-line bg-app-bg px-4 py-3">
                <p className="text-body-sm font-medium text-ink">{item.label}</p>
                <p className="mt-1 text-body-sm text-ink-soft">{item.state}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <EmptyState title="No gap audits yet" description="Select a policy or contract to start comparing required protections." />
      )}
    </AppShell>
  );
}
