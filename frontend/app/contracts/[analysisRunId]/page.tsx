"use client";

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

export default async function ContractAnalysisPage({ params }: PageProps) {
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
      breadcrumbs={[
        { label: "Contracts", href: "/contracts" },
        { label: analysisRunId },
      ]}
      pageEyebrow="Contract analysis"
      pageTitle={`Contract run · ${analysisRunId}`}
      pageDescription="Contract runs follow the same workflow as standard analyses, with the contract flag set on the run metadata."
      actions={
        <Link href={`/analysis/${analysisRunId}`}>
          <Button variant="primary" leadingIcon={<Icon name="BarChart2" size={14} />}>
            Open analysis
          </Button>
        </Link>
      }
    >
      <div className="mt-6 surface p-5">
        <p className="text-body-sm text-ink-500">
          {run
            ? `Analysis run status: ${run.status} · Document: ${run.document_id}.`
            : "Analysis run metadata is not available yet."}
        </p>
        <p className="mt-2 text-body-sm text-ink-500">
          Clause-level findings appear in the analysis run view once the run completes.
        </p>
      </div>
    </AppShell>
  );
}
