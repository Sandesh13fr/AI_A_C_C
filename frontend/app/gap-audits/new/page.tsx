import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

export default function NewGapAuditPage() {
  return (
    <AppShell
      breadcrumbs={[{ label: "Gap Audits", href: "/gap-audits" }, { label: "New audit" }]}
      pageEyebrow="Gap audit"
      pageTitle="New gap audit"
      pageDescription="Select a rulebook, configure scope, and queue a structured gap-audit run."
    >
      <div className="mt-6 surface p-5">
        <p className="text-body-sm text-ink-500">
          Gap audits reuse the analysis wizard with a structured checklist overlay. Open the analysis
          wizard to start.
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="primary" leadingIcon={<Icon name="BarChart2" size={14} />}>
            Open analysis wizard
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
