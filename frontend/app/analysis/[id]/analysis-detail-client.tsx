"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { StatusBadge } from "@/components/domain/status-badge";
import { FindingCard } from "@/components/domain/finding-card";
import { GovernanceNote } from "@/components/domain/governance-note";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, type AnalysisRunResponse, type FindingItem } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { formatRelativeTime, titleCase } from "@/lib/utils";

export function AnalysisRunClient({ id }: { id: string }) {
  const router = useRouter();
  const [run, setRun] = useState<AnalysisRunResponse | null>(null);
  const [findings, setFindings] = useState<FindingItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    apiClient
      .getAnalysisRun(id, session?.accessToken)
      .then(setRun)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Analysis run not found"))
      .finally(() => setLoading(false));
    apiClient
      .listFindings(session?.accessToken)
      .then((response) => setFindings(response.items))
      .catch(() => setFindings([]));
  }, [id]);

  const summary = (run?.summary ?? {}) as {
    total_potential_risks?: number;
    high_severity?: number;
    possible_gaps?: number;
    requires_human_review?: boolean;
  };
  const totalFindings = findings.length;
  const highCount = findings.filter((f) => f.severity === "high" || f.severity === "critical").length;
  const mediumCount = findings.filter((f) => f.severity === "medium").length;

  const grouped = {
    critical: findings.filter((f) => f.severity === "critical"),
    high: findings.filter((f) => f.severity === "high"),
    medium: findings.filter((f) => f.severity === "medium"),
    low: findings.filter((f) => f.severity === "low" || f.severity === "info"),
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Analysis", href: "/analysis/new" },
        { label: id },
      ]}
      pageEyebrow="Analysis run"
      pageTitle={run ? `Run · ${run.id}` : "Analysis run"}
      pageDescription="Findings from this run remain decision-support output until a human reviewer signs them off."
      actions={
        <>
          <Button variant="secondary" leadingIcon={<Icon name="BookOpen" size={14} />}>
            Open in reports
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push(`/analysis/${id}/review`)}
            leadingIcon={<Icon name="CheckSquare" size={14} />}
          >
            Send findings to review
          </Button>
        </>
      }
    >
      {loading ? (
        <div className="surface p-6 text-body-sm text-ink-500">Loading run…</div>
      ) : error ? (
        <div className="surface p-6 text-body-sm text-ink-500">{error}</div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <SummaryStat label="Findings" value={String(totalFindings)} />
            <SummaryStat label="High severity" value={String(highCount)} />
            <SummaryStat label="Medium" value={String(mediumCount)} />
            <SummaryStat label="Run status" value={titleCase(run?.status ?? "")} badge />
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <GovernanceNote>
                {run?.disclaimer ??
                  "Findings are presented for human review. None of them is a legal determination or a compliance verdict."}
              </GovernanceNote>
              {totalFindings === 0 ? (
                <div className="surface p-6">
                  <h2 className="section-heading">No candidate findings yet</h2>
                  <p className="mt-2 text-body-sm text-ink-500">
                    The decision-support pipeline did not return any findings for this run. Try a
                    different rulebook or rerun the analysis.
                  </p>
                </div>
              ) : (
                (["critical", "high", "medium", "low"] as const).map((group) => {
                  const list = grouped[group];
                  if (list.length === 0) return null;
                  return (
                    <section key={group} className="space-y-3">
                      <header className="flex items-center justify-between">
                        <h2 className="section-heading capitalize">
                          {group} severity <span className="text-ink-400">· {list.length}</span>
                        </h2>
                        <span className="text-label uppercase text-ink-500">
                          Last updated {formatRelativeTime(new Date().toISOString())}
                        </span>
                      </header>
                      <div className="space-y-3">
                        {list.map((finding) => (
                          <FindingCard key={finding.id} finding={finding} />
                        ))}
                      </div>
                    </section>
                  );
                })
              )}
            </div>
            <div className="space-y-6">
              <div className="surface p-4">
                <p className="text-label uppercase text-ink-500">Run metadata</p>
                <dl className="mt-3 space-y-3 text-body-sm">
                  <Row label="Run ID" value={run?.id ?? id} mono />
                  <Row label="Document" value={run?.document_id ?? "—"} mono />
                  <Row label="Jurisdiction" value={run?.jurisdiction_code ?? "—"} />
                  <Row label="Type" value={titleCase(run?.analysis_type ?? "—")} />
                  <Row label="Status" value={titleCase(run?.status ?? "")} />
                  <Row
                    label="Total risks"
                    value={String(summary.total_potential_risks ?? "—")}
                    mono
                  />
                </dl>
              </div>
              <div className="surface p-4">
                <p className="text-label uppercase text-ink-500">Filter findings</p>
                <div className="mt-3 space-y-2 text-body-sm text-ink-500">
                  <p>Filter by severity, status, and rule ID on the AI-assisted review step.</p>
                  <Button
                    className="mt-2 w-full"
                    variant="secondary"
                    onClick={() => router.push(`/analysis/${id}/review`)}
                  >
                    Open AI-assisted review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

function SummaryStat({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="stat-card">
      <p className="text-label uppercase text-ink-500">{label}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-display text-display-xl text-ink-900">{value}</p>
        {badge ? <StatusBadge status={value} /> : null}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-label uppercase text-ink-500">{label}</dt>
      <dd
        className={
          mono
            ? "mt-1 break-all font-mono text-body-sm text-ink-900"
            : "mt-1 text-body-sm text-ink-900"
        }
      >
        {value}
      </dd>
    </div>
  );
}
