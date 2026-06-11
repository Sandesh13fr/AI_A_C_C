import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <AppShell title="Reports" subtitle="Internal drafts, final internal packets, partner shares, and external-publication export gates.">
      <Card>
        <h2 className="text-h3 text-balance">Exports</h2>
        <p className="mt-2 text-body-sm text-mid-grey">External and partner-share exports require sign-off before generation.</p>
      </Card>
    </AppShell>
  );
}
