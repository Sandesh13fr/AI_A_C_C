import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { GovernanceNote } from "@/components/domain/governance-note";
import { FindingCard } from "@/components/domain/finding-card";
import { getSession } from "@/lib/auth";
import { apiClient, type FindingItem, type ReviewQueueResponse } from "@/lib/api-client";
import { formatRelativeTime } from "@/lib/utils";

interface PageProps {
  params: Promise<{ flagId: string }>;
}

const EMPTY_QUEUE: ReviewQueueResponse = { items: [], total: 0 };
const EMPTY_FINDINGS: { items: FindingItem[]; total: number } = { items: [], total: 0 };

export default async function ReviewFlagPage({ params }: PageProps) {
  const { flagId } = await params;
  const session = getSession();
  let queueResponse: ReviewQueueResponse | null = null;
  let findings: FindingItem[] = [];
  try {
    const token = session?.accessToken ?? null;
    queueResponse = token
      ? await apiClient.reviewQueue(token)
      : EMPTY_QUEUE;
  } catch {
    queueResponse = EMPTY_QUEUE;
  }
  try {
    const token = session?.accessToken ?? null;
    const findingsResponse = token
      ? await apiClient.listFindings(token)
      : EMPTY_FINDINGS;
    findings = findingsResponse.items;
  } catch {
    findings = [];
  }

  const item =
    queueResponse.items.find((entry) => entry.flag_id === flagId || entry.id === flagId) ??
    queueResponse.items[0] ??
    null;

  if (!item) {
    notFound();
  }
  const finding =
    findings.find((entry) => entry.flag_id === flagId || entry.id === flagId) ?? findings[0] ?? null;

  return (
    <AppShell
      breadcrumbs={[
        { label: "Review Queue", href: "/review" },
        { label: item.flag_id ?? item.id },
      ]}
      pageEyebrow="Review flag"
      pageTitle={item.title ?? "Review flag"}
      pageDescription={
        item.reason ? `${item.reason} · Assigned to ${item.assigned_to ?? "Unassigned"}` : "Reviewer detail for this finding."
      }
      actions={
        <>
          {item.document_id ? (
            <a
              href={`/documents/${item.document_id}`}
              className="text-label uppercase text-brand hover:underline"
            >
              View source document
            </a>
          ) : null}
          {item.id ? (
            <a href={`/reports/${item.id}`} className="ml-3 text-label uppercase text-brand hover:underline">
              View report
            </a>
          ) : null}
        </>
      }
    >
      <div className="mt-6 space-y-6">
        <GovernanceNote>
          This finding is an AI-assisted draft. Sign-off is required before it can appear in any
          exported report.
        </GovernanceNote>
        {finding ? (
          <div className="surface p-5">
            <h2 className="section-heading">Candidate concern</h2>
            <div className="mt-4">
              <FindingCard finding={finding} showActions={false} />
            </div>
          </div>
        ) : (
          <div className="surface p-5">
            <p className="text-body-sm text-ink-500">No finding detail is available yet.</p>
          </div>
        )}
        <div className="surface p-5">
          <h2 className="section-heading">Evidence chain</h2>
          <ol className="mt-3 space-y-2 text-body-sm text-ink-700">
            <li>
              <span className="font-mono text-ink-500">Document</span> ·{" "}
              {item.document_id ? (
                <a href={`/documents/${item.document_id}`} className="text-brand hover:underline">
                  {item.document_title ?? item.document_id}
                </a>
              ) : (
                <span className="text-ink-500">—</span>
              )}
            </li>
            <li>
              <span className="font-mono text-ink-500">Analysis run</span> ·{" "}
              {item.analysis_run_id ? (
                <a href={`/analysis/${item.analysis_run_id}`} className="text-brand hover:underline">
                  {item.analysis_run_id}
                </a>
              ) : (
                <span className="text-ink-500">—</span>
              )}
            </li>
            <li>
              <span className="font-mono text-ink-500">Flag</span> ·{" "}
              <span className="font-mono text-ink-700">{item.flag_id ?? item.id}</span>
            </li>
          </ol>
        </div>
        <div className="surface p-5">
          <h2 className="section-heading">Action history</h2>
          <p className="mt-3 text-body-sm text-ink-500">
            {item.submitted_at
              ? `Flag created by analysis run · ${formatRelativeTime(item.submitted_at)}`
              : "No action history available yet."}
          </p>
        </div>
        {!finding ? (
          <EmptyState
            title="No finding detail"
            description="The backend did not return a finding for this flag yet."
          />
        ) : null}
      </div>
    </AppShell>
  );
}
