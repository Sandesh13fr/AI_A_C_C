"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/domain/stat-card";
import { QuickActionItem } from "@/components/domain/quick-action-item";
import { DocumentRow, type DocumentRowData } from "@/components/domain/document-row";
import { GovernanceNote } from "@/components/domain/governance-note";
import { SystemStatusList } from "@/components/domain/status-dot";
import { Icon } from "@/components/icon";
import { apiClient, type DocumentItem, type ReviewQueueResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { dashboardStatDefs, quickActions, systemStatusDefs } from "@/lib/ui-config";
import { titleCase } from "@/lib/utils";

const QUICK_ACTION_ICON_MAP = {
  Upload: "Upload",
  Search: "Search",
  BarChart2: "BarChart2",
  CheckSquare: "CheckSquare",
  Scale: "Scale",
  BookOpen: "BookOpen",
} as const;

type QuickActionIconName = keyof typeof QUICK_ACTION_ICON_MAP;

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [documentsTotal, setDocumentsTotal] = useState<number | null>(null);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    Promise.all([
      apiClient
        .listDocuments({ page_size: 6 }, session?.accessToken)
        .then((response) => {
          setDocuments(response.items);
          setDocumentsTotal(response.total);
        })
        .catch(() => {
          setDocuments([]);
          setDocumentsTotal(0);
        }),
      apiClient
        .reviewQueue(session?.accessToken)
        .then(setReviewQueue)
        .catch(() => setReviewQueue({ items: [], total: 0 })),
    ]).finally(() => setLoading(false));
  }, []);

  const statValues: Record<string, string> = {
    indexed_documents: documentsTotal !== null ? formatNumber(documentsTotal) : "—",
    pending_review: reviewQueue ? formatNumber(reviewQueue.total) : "—",
    active_analyses: "—",
    knowledge_coverage: "—",
  };

  return (
    <AppShell
      pageEyebrow="Decision-support workspace"
      pageTitle="Dashboard"
      pageDescription="Operational overview for ingestion, analysis, review, and governance-safe export readiness."
      actions={
        <>
          <Link href="/uploads">
            <Button variant="secondary" leadingIcon={<Icon name="Upload" size={14} />}>
              Upload document
            </Button>
          </Link>
          <Link href="/analysis/new">
            <Button variant="primary" leadingIcon={<Icon name="BarChart2" size={14} />}>
              Start analysis
            </Button>
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <section
          aria-label="Key metrics"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {dashboardStatDefs.map((stat) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              value={statValues[stat.key]}
              description={stat.description}
              live={stat.live}
              emphasis={stat.emphasis}
            />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <RecentDocumentsCard loading={loading} documents={documents} />
          </div>
          <div className="space-y-6">
            <QuickActionsCard />
            <SystemStatusCard />
          </div>
        </section>

        <GovernanceNote>
          Findings remain candidate concerns or possible gaps until a human reviewer confirms next steps.
        </GovernanceNote>
      </div>
    </AppShell>
  );
}

function RecentDocumentsCard({ loading, documents }: { loading: boolean; documents: DocumentItem[] }) {
  return (
    <div className="surface">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="font-display text-display-lg text-ink-900">Recent documents</h2>
          <p className="mt-1 text-body-sm text-ink-500">Latest ingest, sync, and review activity across the corpus.</p>
        </div>
        <Link
          href="/documents"
          className="text-label uppercase text-brand hover:underline"
        >
          View all
        </Link>
      </header>
      {loading ? (
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="px-5 py-4">
              <div className="h-4 w-48 rounded bg-ink-100" />
              <div className="mt-2 h-3 w-32 rounded bg-ink-100" />
            </div>
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className="divide-y divide-border-subtle">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} document={toRowData(doc)} href={`/documents/${doc.id}`} />
          ))}
        </div>
      ) : (
        <div className="px-5 py-10 text-center">
          <p className="text-body-sm text-ink-500">No documents indexed yet. Upload your first document to begin.</p>
          <div className="mt-3">
            <Link href="/uploads">
              <Button variant="primary" leadingIcon={<Icon name="Upload" size={14} />}>
                Upload document
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickActionsCard() {
  return (
    <div className="surface">
      <header className="border-b border-border px-5 py-4">
        <h2 className="font-display text-display-lg text-ink-900">Quick actions</h2>
        <p className="mt-1 text-body-sm text-ink-500">Jump straight to the most common tasks.</p>
      </header>
      <div className="space-y-2 p-3">
        {quickActions.map((action) => {
          const icon = QUICK_ACTION_ICON_MAP[action.icon as QuickActionIconName] ?? "BarChart2";
          return (
            <QuickActionItem
              key={action.label}
              label={action.label}
              description={action.description}
              href={action.href}
              icon={icon}
            />
          );
        })}
      </div>
    </div>
  );
}

function SystemStatusCard() {
  return (
    <div className="surface">
      <header className="border-b border-border px-5 py-4">
        <h2 className="font-display text-display-lg text-ink-900">System status</h2>
        <p className="mt-1 text-body-sm text-ink-500">Live operational signals.</p>
      </header>
      <div className="px-5 py-4">
        <SystemStatusList items={systemStatusDefs.map((row) => ({ ...row, value: row.description }))} />
      </div>
    </div>
  );
}

function toRowData(doc: DocumentItem): DocumentRowData {
  return {
    id: doc.id,
    title: doc.title ?? doc.filename,
    filename: doc.filename,
    sourceType: titleCase((doc.doc_type ?? "").replace(/_/g, " ")),
    jurisdiction: doc.metadata?.jurisdiction_code ?? "Unknown",
    species: doc.metadata?.species?.join(", ") ?? "Multi-species",
    status: doc.status ?? "draft",
    updatedAt: doc.updated_at ?? doc.created_at ?? new Date().toISOString(),
  };
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
