"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { RiskBadge } from "@/components/domain/risk-badge";
import { StatusBadge } from "@/components/domain/status-badge";
import { FindingCard } from "@/components/domain/finding-card";
import { GovernanceNote } from "@/components/domain/governance-note";
import { ReviewActionBar } from "@/components/domain/review-action-bar";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Tabs } from "@/components/domain/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, type FindingItem, type ReviewQueueItem, type ReviewQueueResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { cn, formatRelativeTime, titleCase } from "@/lib/utils";

type QueueFilter = "all" | "pending" | "in_review" | "complete" | "mine";

const SEVERITY_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export default function ReviewQueuePage() {
  const [filter, setFilter] = useState<QueueFilter>("all");
  const [queue, setQueue] = useState<ReviewQueueItem[]>([]);
  const [findings, setFindings] = useState<FindingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [signingOff, setSigningOff] = useState(false);

  useEffect(() => {
    const session = getSession();
    Promise.all([
      apiClient
        .reviewQueue(session?.accessToken)
        .then((response: ReviewQueueResponse) => setQueue(response.items))
        .catch(() => setQueue([])),
      apiClient
        .listFindings(session?.accessToken)
        .then((response) => setFindings(response.items))
        .catch(() => setFindings([])),
    ]).finally(() => setLoading(false));
  }, []);

  const filteredQueue = useMemo(() => {
    const sorted = [...queue].sort((a, b) => {
      const aRank = SEVERITY_RANK[a.severity ?? ""] ?? 99;
      const bRank = SEVERITY_RANK[b.severity ?? ""] ?? 99;
      if (aRank !== bRank) return aRank - bRank;
      const aTime = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
      const bTime = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
      return bTime - aTime;
    });
    if (filter === "all") return sorted;
    if (filter === "mine") return sorted.filter((item) => item.assigned_to && item.assigned_to !== "Unassigned");
    return sorted.filter((item) => item.status === filter);
  }, [queue, filter]);

  useEffect(() => {
    if (!selectedId && filteredQueue.length > 0) {
      setSelectedId(filteredQueue[0]?.id ?? null);
    }
  }, [filteredQueue, selectedId]);

  const selectedItem = useMemo(
    () => queue.find((item) => item.id === selectedId) ?? filteredQueue[0] ?? null,
    [queue, selectedId, filteredQueue],
  );

  const selectedFinding = useMemo<FindingItem | null>(() => {
    if (!selectedItem) return null;
    return (
      findings.find((finding) => finding.id === selectedItem.finding_id) ??
      findings[0] ??
      null
    );
  }, [findings, selectedItem]);

  const pendingCount = queue.filter((item) => item.status === "pending" || item.status === "in_review").length;

  return (
    <AppShell
      pageEyebrow="Human sign-off"
      pageTitle="Review Queue"
      pageDescription="All findings routed here must be reviewed and signed off before they can appear in any export."
      actions={
        <span
          className="inline-flex items-center gap-2 rounded-sm border border-[#FDE68A] bg-[#FFFBEB] px-3 py-1.5 text-label uppercase text-accent-gold"
          aria-label={`${pendingCount} pending reviewer action`}
        >
          <Icon name="AlertTriangle" size={12} />
          {pendingCount} pending reviewer action
        </span>
      }
    >
      <div className="mt-6">
        <Tabs
          paramName="filter"
          items={[
            { label: "All", value: "all", count: queue.length },
            { label: "Pending", value: "pending", count: queue.filter((i) => i.status === "pending").length },
            { label: "In review", value: "in_review", count: queue.filter((i) => i.status === "in_review").length },
            { label: "Complete", value: "complete", count: queue.filter((i) => i.status === "complete").length },
            { label: "My items", value: "mine" },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="surface">
          <header className="border-b border-border px-4 py-3">
            <p className="text-label uppercase text-ink-500">Queue</p>
            <p className="mt-1 text-body-sm text-ink-500">
              {loading ? "Loading…" : `${filteredQueue.length} items · sorted by severity, then submitted time`}
            </p>
          </header>
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredQueue.length === 0 ? (
            <div className="px-4 py-10 text-center text-body-sm text-ink-500">
              {queue.length === 0
                ? "No findings have been routed here yet. Run an analysis to generate candidate concerns."
                : "No items match this filter."}
            </div>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {filteredQueue.map((item) => {
                const isActive = item.id === selectedItem?.id;
                const severity = (item.severity ?? "info") as "low" | "medium" | "high" | "critical" | "info";
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "block w-full px-4 py-3 text-left transition-colors",
                        isActive ? "bg-brand-light" : "hover:bg-ink-50",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-mono-sm text-ink-500">
                          {item.flag_id ?? item.id}
                        </span>
                        <RiskBadge severity={severity} />
                      </div>
                      <p className="mt-1 text-body-md font-medium text-ink-900">
                        {item.title ?? "Untitled finding"}
                      </p>
                      <p className="mt-0.5 truncate text-body-sm text-ink-500">
                        {item.document_title ?? "No document linked"}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-mono-sm text-ink-500">
                        <span>{item.assigned_to ?? "Unassigned"}</span>
                        <span>{item.submitted_at ? formatRelativeTime(item.submitted_at) : "—"}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {selectedItem && selectedFinding ? (
          <div className="space-y-6">
            <div className="surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge severity={selectedItem.severity ?? "info"} />
                <StatusBadge status={selectedItem.status ?? "pending"} />
                <span className="font-mono text-mono-sm text-ink-500">{selectedItem.flag_id ?? selectedItem.id}</span>
              </div>
              <h2 className="mt-3 font-display text-display-lg text-ink-900">
                {selectedItem.title ?? "Untitled finding"}
              </h2>
              {selectedItem.reason ? (
                <p className="mt-1 text-body-sm text-ink-500">{selectedItem.reason}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-body-sm text-ink-500">
                <span>
                  Assigned to:{" "}
                  <span className="font-mono text-ink-700">{selectedItem.assigned_to ?? "Unassigned"}</span>
                </span>
                <span>·</span>
                <span>Submitted: {selectedItem.submitted_at ? formatRelativeTime(selectedItem.submitted_at) : "—"}</span>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <FindingCard finding={selectedFinding} showActions={false} />
                <div className="surface p-5">
                  <h3 className="section-heading">Evidence chain</h3>
                  <ol className="mt-3 space-y-2 text-body-sm text-ink-700">
                    <li>
                      <span className="font-mono text-ink-500">Document</span> ·{" "}
                      {selectedItem.document_id ? (
                        <Link
                          href={`/documents/${selectedItem.document_id}`}
                          className="text-brand hover:underline"
                        >
                          {selectedItem.document_title ?? selectedItem.document_id}
                        </Link>
                      ) : (
                        <span className="text-ink-500">No document linked</span>
                      )}
                    </li>
                    <li>
                      <span className="font-mono text-ink-500">Analysis run</span> ·{" "}
                      {selectedItem.analysis_run_id ? (
                        <Link
                          href={`/analysis/${selectedItem.analysis_run_id}`}
                          className="text-brand hover:underline"
                        >
                          {selectedItem.analysis_run_id}
                        </Link>
                      ) : (
                        <span className="text-ink-500">—</span>
                      )}
                    </li>
                    <li>
                      <span className="font-mono text-ink-500">Flag</span> ·{" "}
                      <span className="font-mono text-ink-700">{selectedItem.flag_id ?? selectedItem.id}</span>
                    </li>
                  </ol>
                </div>
                <div className="surface p-5">
                  <h3 className="section-heading">Action history</h3>
                  <p className="mt-3 text-body-sm text-ink-500">
                    {selectedItem.submitted_at
                      ? `Flag created by analysis run · ${formatRelativeTime(selectedItem.submitted_at)}`
                      : "No action history available yet."}
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <ReviewActionBar
                  onAccept={() => undefined}
                  onDismiss={() => undefined}
                  onFlag={() => undefined}
                  onSignOff={() => setSigningOff(true)}
                />
                <GovernanceNote>
                  This finding is an AI-assisted draft. Your sign-off is required before it can appear in
                  any exported report.
                </GovernanceNote>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="surface p-10 text-center text-body-sm text-ink-500">Loading review queue…</div>
        ) : (
          <div className="surface p-10 text-center">
            <EmptyState
              title="No findings to review"
              description="All current findings have been reviewed. Run a new analysis to generate candidate concerns."
              action={
                <Link href="/analysis/new">
                  <Button variant="primary">Start analysis</Button>
                </Link>
              }
            />
          </div>
        )}
      </div>

      <ConfirmModal
        open={signingOff}
        title="Sign off this finding?"
        description={
          <>
            This action is logged in the audit trail and cannot be undone. Once signed off, the finding
            becomes eligible to appear in any export gated by the report&apos;s governance state.
          </>
        }
        confirmLabel="Sign off finding"
        onCancel={() => setSigningOff(false)}
        onConfirm={() => setSigningOff(false)}
      />
    </AppShell>
  );
}

// Avoid unused-import warning for titleCase when the only call site moves elsewhere.
void titleCase;
