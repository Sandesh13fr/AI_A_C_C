import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { apiClient, type AnalysisRunResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";

interface PageProps {
  params: Promise<{ analysisRunId: string }>;
}

export default async function GapAuditRunPage({ params }: PageProps) {
  const { analysisRunId } = await params;
  if (!analysisRunId) notFound();
  const session = getSession();
  let run: AnalysisRunResponse | null = null;
  try {
    const token = session?.accessToken ?? null;
    if (token) {
      run = await apiClient.getAnalysisRun(analysisRunId, token);
    }
  } catch {
    run = null;
  }

  return (
    <AppShell
      breadcrumbs={[{ label: "Gap Audits", href: "/gap-audits" }, { label: analysisRunId }]}
      pageEyebrow="Gap audit"
      pageTitle={`Gap audit · ${analysisRunId}`}
      pageDescription="Structured gap-audit run. The wizard mirrors Analysis with a structured gap-audit flag."
      actions={
        <Link href={`/analysis/${analysisRunId}`}>
          <Button variant="primary" leadingIcon={<Icon name="BarChart2" size={14} />}>
            Open analysis
          </Button>
        </Link>
      }
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="surface">
          <header className="border-b border-border px-4 py-3">
            <h2 className="font-display text-display-lg text-ink-900">Required protection checklist</h2>
            <p className="mt-1 text-body-sm text-ink-500">Compare against expected protections.</p>
          </header>
          <div className="px-4 py-6 text-body-sm text-ink-500">
            {run
              ? `Run status: ${run.status}. The checklist will populate once the run completes.`
              : "Run metadata is not available yet."}
          </div>
        </div>
        <div className="space-y-6">
          <div className="surface p-4">
            <p className="text-label uppercase text-ink-500">Next actions</p>
            <div className="mt-3 space-y-2">
              <Link href="/analysis/new">
                <Button variant="primary" leadingIcon={<Icon name="BarChart2" size={14} />} className="w-full">
                  Open analysis wizard
                </Button>
              </Link>
              <Link href="/review">
                <Button variant="secondary" className="w-full">
                  Open review queue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
