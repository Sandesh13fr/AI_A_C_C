"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/icon";
import { FindingCard } from "@/components/domain/finding-card";
import { apiClient, type FindingItem } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { EmptyState } from "@/components/ui/empty-state";

const DEFAULT_TEXT =
  "Animals shall be housed in facilities maintained in good repair. Water access shall be available continuously, with interruptions not exceeding two hours during feeding cycles. Transport may exceed 12 hours where required by routing constraints.";

export default function RulebookTestPage() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [findings, setFindings] = useState<FindingItem[]>([]);
  const [loading, setLoading] = useState(false);

  function runPreview() {
    setLoading(true);
    const session = getSession();
    apiClient
      .listFindings(session?.accessToken)
      .then((response) => setFindings(response.items))
      .catch(() => setFindings([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // Lazy-load preview only — do not auto-run on mount.
  }, []);

  return (
    <AppShell
      breadcrumbs={[
        { label: "Rulebooks", href: "/rulebooks" },
        { label: "Rulebook" },
        { label: "Test" },
      ]}
      pageEyebrow="Test rulebook"
      pageTitle="Run a sample analysis"
      pageDescription="Paste or upload a sample document to preview findings against this rulebook only."
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="surface p-5">
          <h2 className="section-heading">Test document</h2>
          <p className="mt-1 text-body-sm text-ink-500">
            Paste a passage below to preview candidate findings. The result is illustrative only and never
            stored against an export.
          </p>
          <div className="mt-4 space-y-4">
            <Textarea
              className="min-h-40"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={() => setText(DEFAULT_TEXT)}>
                Reset to sample text
              </Button>
              <Button
                variant="primary"
                onClick={runPreview}
                loading={loading}
                leadingIcon={<Icon name="BarChart2" size={14} />}
              >
                {loading ? "Running" : "Preview findings"}
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="section-heading">Preview findings</h2>
          {findings.length === 0 ? (
            <EmptyState
              title="No preview findings yet"
              description="Run a preview to surface candidate concerns from the current rulebook."
            />
          ) : (
            findings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} showActions={false} />
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
