"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { apiClient, type AnalysisRunResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";

export default function AnalysisPage() {
  const [run, setRun] = useState<AnalysisRunResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createRun() {
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
    }
  }

  return (
    <AppShell title="Analysis" subtitle="Analyzer runs produce only potential risks, possible gaps, weak commitments, ambiguous language, and human-review items.">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card>
          <h2 className="text-h3 text-balance">Create Run</h2>
          <button className="mt-4 rounded-button bg-teal px-4 py-2 text-body-sm font-semibold text-white" onClick={createRun}>
            Queue sample run
          </button>
          {error ? <p className="mt-3 text-body-sm text-coral">{error}</p> : null}
          {run ? (
            <a className="mt-4 block rounded-card border border-dark-border bg-dark-surface p-4" href={`/analysis/${run.id}`}>
              <span className="font-mono text-micro text-mid-grey">{run.status}</span>
              <span className="mt-1 block text-body-sm">{run.analysis_type} / {run.jurisdiction_code}</span>
            </a>
          ) : null}
        </Card>
        <Card>
          <h2 className="text-h3 text-balance">Governance</h2>
          <p className="mt-2 text-body-sm text-mid-grey text-pretty">
            External use requires reviewer sign-off and the export disclaimer.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
