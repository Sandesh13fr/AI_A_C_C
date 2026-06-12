"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { FindingCard } from "@/components/domain/finding-card";
import { ReviewActionBar } from "@/components/domain/review-action-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Notice } from "@/components/ui/notice";
import { apiClient, type AnalysisRunResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { sampleFindings } from "@/lib/mock-data";
import { titleCase } from "@/lib/utils";

export function AnalysisDetailClient({ id }: { id: string }) {
  const [run, setRun] = useState<AnalysisRunResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    apiClient
      .getAnalysisRun(id, session?.accessToken)
      .then(setRun)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load the analysis run"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell title="Analysis Run" subtitle="Potential risks and possible gaps remain review artifacts until a human reviewer signs them off.">
      {loading ? (
        <Card>
          <CardContent className="space-y-3">
            <div className="h-6 w-48 rounded-button bg-app-subtle" />
            <div className="h-44 rounded-card bg-app-subtle" />
          </CardContent>
        </Card>
      ) : error ? (
        <EmptyState title="Analysis detail is unavailable" description={error} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Notice title="No legal determination" tone="warning">
              {run?.disclaimer ?? "This review surface presents possible concerns and gaps for a human reviewer. It is not legal advice or a final compliance decision."}
            </Notice>
            <Card>
              <CardHeader>
                <CardTitle>Run summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-card border border-app-line bg-app-bg p-4">
                  <p className="app-label">Run ID</p>
                  <p className="mt-2 break-all text-body-sm text-ink">{id}</p>
                </div>
                <div className="rounded-card border border-app-line bg-app-bg p-4">
                  <p className="app-label">Status</p>
                  <p className="mt-2 text-body-sm text-ink">{titleCase(run?.status ?? "unknown")}</p>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              {sampleFindings.map((finding) => (
                <FindingCard key={finding.id} finding={finding} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <ReviewActionBar />
            <Card>
              <CardHeader>
                <CardTitle>Document context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-body-sm text-ink-soft">
                <p>Attach source passages, related rule text, and precedent snippets here when the backend returns full finding context.</p>
                <p>Keep all reviewer explanations grounded in citations and clearly labeled as decision-support output.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}
