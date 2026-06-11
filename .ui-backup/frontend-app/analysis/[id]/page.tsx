import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell title="Analysis Run" subtitle="Potential-risk findings require human review and sign-off before external use.">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card>
          <p className="font-mono text-micro text-mid-grey">Run ID</p>
          <p className="mt-1 break-all text-body-sm">{id}</p>
          <div className="mt-5 rounded-card border border-dark-border bg-dark-surface p-4">
            <h2 className="text-h3 text-balance">Findings</h2>
            <p className="mt-2 text-body-sm text-mid-grey">No potential-risk flags are loaded for this local placeholder run.</p>
          </div>
        </Card>
        <Card>
          <h2 className="text-h3 text-balance">Sign-off Gate</h2>
          <p className="mt-2 text-body-sm text-mid-grey text-pretty">
            External exports stay blocked until a reviewer records a sign-off scope.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
