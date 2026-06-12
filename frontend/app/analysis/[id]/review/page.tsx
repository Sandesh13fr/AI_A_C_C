"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/icon";
import { FindingCard } from "@/components/domain/finding-card";
import { GovernanceNote } from "@/components/domain/governance-note";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Notice } from "@/components/ui/notice";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, type FindingItem } from "@/lib/api-client";
import { getSession } from "@/lib/auth";

export default function AnalysisReviewPage() {
  const params = useParams();
  const router = useRouter();
  const runId = (params?.id as string | undefined) ?? "";
  const [findings, setFindings] = useState<FindingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const session = getSession();
    apiClient
      .listFindings(session?.accessToken)
      .then((response) => setFindings(response.items))
      .catch(() => setFindings([]))
      .finally(() => setLoading(false));
  }, []);

  function toggleAll() {
    if (selected.size === findings.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(findings.map((finding) => finding.id)));
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: "Analysis", href: "/analysis/new" },
        { label: runId, href: runId ? `/analysis/${runId}` : "/analysis/new" },
        { label: "AI-assisted review" },
      ]}
      pageEyebrow="AI-assisted pre-review"
      pageTitle="Review findings before sending to queue"
      pageDescription="Accept, dismiss, or flag candidate concerns in bulk. Anything you flag is routed to the human Review Queue."
      actions={
        <Button
          variant="primary"
          disabled={selected.size === 0}
          onClick={() => setConfirming(true)}
          leadingIcon={<Icon name="CheckSquare" size={14} />}
        >
          Send {selected.size} to review queue
        </Button>
      }
    >
      <div className="mt-6">
        <GovernanceNote>
          Accept and dismiss actions are recorded in the audit log. Flagged findings are routed to the human
          Review Queue and require explicit reviewer sign-off before any export.
        </GovernanceNote>
      </div>

      <div className="mt-6 surface">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : findings.length === 0 ? (
          <EmptyState
            title="No findings to review"
            description="This run did not produce candidate concerns. The Analysis summary has been updated."
          />
        ) : (
          <>
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  label="Select all"
                  checked={selected.size === findings.length && findings.length > 0}
                  onChange={toggleAll}
                />
                <span className="text-body-sm text-ink-500">
                  {selected.size} of {findings.length} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={toggleAll}>
                  {selected.size === findings.length ? "Clear selection" : "Select all"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelected(new Set())}
                >
                  Dismiss selected
                </Button>
                <Button variant="danger" size="sm">
                  Send all flagged to queue
                </Button>
              </div>
            </header>
            <div className="divide-y divide-border-subtle">
              {findings.map((finding) => (
                <label
                  key={finding.id}
                  className="flex items-start gap-4 px-4 py-3 transition-colors hover:bg-ink-50"
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-[#006C67]"
                    checked={selected.has(finding.id)}
                    onChange={() => toggle(finding.id)}
                    aria-label={`Select finding ${finding.id}`}
                  />
                  <div className="min-w-0 flex-1">
                    <FindingCard finding={finding} showActions={false} />
                  </div>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      {findings.length === 0 && !loading ? (
        <div className="mt-6">
          <Notice title="No findings to review">
            This run did not produce candidate concerns. The Analysis summary has been updated.
          </Notice>
        </div>
      ) : null}

      <ConfirmModal
        open={confirming}
        title="Send findings to the review queue?"
        description={
          <>
            You are about to send <span className="font-mono">{selected.size}</span> findings to the human
            Review Queue. They will appear under <span className="font-mono">/review</span> and require
            explicit reviewer sign-off before they can appear in any exported report.
          </>
        }
        confirmLabel="Send to queue"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          router.push("/review");
        }}
      />
    </AppShell>
  );
}
