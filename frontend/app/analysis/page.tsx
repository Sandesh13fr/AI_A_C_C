"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { FindingCard } from "@/components/domain/finding-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { apiClient, type AnalysisRunResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { sampleFindings } from "@/lib/mock-data";
import { titleCase } from "@/lib/utils";

export default function AnalysisPage() {
  const [run, setRun] = useState<AnalysisRunResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createRun() {
    setLoading(true);
    setError(null);
    try {
      const session = getSession();
      const response = await apiClient.createAnalysisRun(
        {
          document_id: "00000000-0000-4000-8000-000000000003",
          analysis_type: "general_compliance",
          jurisdiction_code: "US-FED",
        },
        session?.accessToken,
      );
      setRun(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create analysis run");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Analysis" subtitle="Queue and review decision-support runs that surface potential risks, possible gaps, and other reviewer aids.">
      <div className="space-y-6">
        <Notice title="Guardrail" tone="warning">
          Analysis output must remain framed as decision-support output. This screen avoids legal-determination language and keeps reviewer sign-off front and center.
        </Notice>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Create run</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-body-sm text-ink-soft">
                The existing backend run-creation endpoint is preserved. This screen wraps it with the new shell and review-safe language.
              </p>
              <Button loading={loading} onClick={createRun}>
                {loading ? "Queueing run" : "Queue sample run"}
              </Button>
              {run ? (
                <Link href={`/analysis/${run.id}`} className="block rounded-card border border-app-line bg-app-bg px-4 py-3">
                  <p className="app-label">Run created</p>
                  <p className="mt-2 text-body-sm text-ink">{titleCase(run.analysis_type)} · {run.jurisdiction_code}</p>
                  <p className="mt-1 text-body-sm text-ink-soft">{titleCase(run.status)}</p>
                </Link>
              ) : null}
              {error ? <Notice title="Analysis error">{error}</Notice> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expected review surface</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sampleFindings.map((finding) => (
                <FindingCard key={finding.id} finding={finding} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
