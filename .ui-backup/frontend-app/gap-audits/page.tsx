import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default function GapAuditsPage() {
  return (
    <AppShell title="Gap Audits" subtitle="Compare documents against required protections by jurisdiction, category, and document type.">
      <Card>
        <h2 className="text-h3 text-balance">Required Protections</h2>
        <p className="mt-2 text-body-sm text-mid-grey">No gap findings are loaded for the current workspace.</p>
      </Card>
    </AppShell>
  );
}
