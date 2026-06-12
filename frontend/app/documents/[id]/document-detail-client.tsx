"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/domain/tabs";
import { DocumentMetadataPanel } from "@/components/domain/document-metadata-panel";
import { GovernanceNote } from "@/components/domain/governance-note";
import { StatusBadge } from "@/components/domain/status-badge";
import { Icon } from "@/components/icon";
import { apiClient, type DocumentItem, type RelatedRuleItem } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { titleCase } from "@/lib/utils";

export function DocumentDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? undefined;
  const [document, setDocument] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    apiClient
      .getDocument(id, session?.accessToken)
      .then(setDocument)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unable to load the document");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const documentTitle = document?.title ?? document?.filename ?? "Document";

  return (
    <AppShell
      breadcrumbs={[
        { label: "Documents", href: "/documents" },
        { label: documentTitle },
      ]}
      pageEyebrow="Document detail"
      pageTitle={documentTitle}
      pageDescription="Document-scoped evidence, source passages, and chat handoff for grounded reviewer work."
      actions={
        <>
          <Button
            variant="secondary"
            leadingIcon={<Icon name="Download" size={14} />}
            onClick={() => window.print()}
          >
            Download
          </Button>
          <Link href="/reports">
            <Button variant="secondary" leadingIcon={<Icon name="BookOpen" size={14} />}>
              View reports
            </Button>
          </Link>
          <Button
            variant="primary"
            leadingIcon={<Icon name="BarChart2" size={14} />}
            onClick={() => router.push(`/analysis/new?documentId=${id}`)}
          >
            Start analysis
          </Button>
        </>
      }
    >
      <div className="mt-6">
        <Tabs
          paramName="tab"
          items={[
            { label: "Overview", value: "overview" },
            { label: "Analysis runs", value: "runs" },
            { label: "Findings", value: "findings", count: document?.chunks?.length ?? 0 },
            { label: "Chat", value: "chat", href: `/documents/${id}/chat` },
          ]}
        />
      </div>

      {loading ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="surface p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-3 h-40 w-full" />
          </div>
          <div className="surface p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-32 w-full" />
          </div>
        </div>
      ) : error || !document ? (
        <div className="mt-6">
          <EmptyState
            title="Document detail is unavailable"
            description={error ?? "No document record was returned for this route."}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="surface">
              <div className="border-b border-border px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={document.status} />
                  <span className="chip">{titleCase((document.doc_type ?? "").replace(/_/g, " "))}</span>
                  {document.metadata?.jurisdiction_code ? (
                    <span className="chip">{document.metadata.jurisdiction_code}</span>
                  ) : null}
                </div>
                <p className="mt-3 font-display text-display-lg text-ink-900">
                  {document.title ?? document.filename}
                </p>
                <p className="mt-1 text-body-sm text-ink-500">
                  Filename:{" "}
                  <span className="font-mono text-ink-700">{document.filename}</span>
                </p>
              </div>
              <div className="space-y-4 px-5 py-4">
                <GovernanceNote>
                  This document feeds decision-support analysis. Findings produced from it remain candidate
                  concerns until a human reviewer signs off.
                </GovernanceNote>
                {document.raw_text ? (
                  <div>
                    <p className="text-label uppercase text-ink-500">Source text preview</p>
                    <div className="trigger-passage mt-2 whitespace-pre-wrap">
                      {document.raw_text.slice(0, 1400)}
                      {document.raw_text.length > 1400 ? "…" : ""}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-label uppercase text-ink-500">Source text preview</p>
                    <div className="trigger-passage mt-2 text-ink-500">
                      Raw text is not currently available for this document. Once extraction output is
                      present, this panel can render grounded passages and chunk navigation.
                    </div>
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="surface-alt p-3">
                    <p className="text-label uppercase text-ink-500">Analysis status</p>
                    <p className="mt-1 text-body-sm text-ink-900">{titleCase(document.status)}</p>
                  </div>
                  <div className="surface-alt p-3">
                    <p className="text-label uppercase text-ink-500">Last update</p>
                    <p className="mt-1 text-body-sm text-ink-900">
                      {document.updated_at ? new Date(document.updated_at).toLocaleString() : "Not recorded"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <DocumentMetadataPanel document={document} />
            <RelatedRulesPanel documentId={id} query={query} />
            <div className="surface p-4">
              <p className="text-label uppercase text-ink-500">Next actions</p>
              <div className="mt-3 space-y-2">
                <Link
                  href={`/analysis/new?documentId=${id}`}
                  className="quick-action"
                >
                  <span className="flex size-9 items-center justify-center rounded-sm bg-brand-light text-brand">
                    <Icon name="BarChart2" size={16} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-body-md font-medium text-ink-900">Start analysis</span>
                    <span className="block text-body-sm text-ink-500">
                      Queue a decision-support run on this document.
                    </span>
                  </span>
                  <Icon name="ChevronRight" size={14} className="text-ink-400" />
                </Link>
                <Link
                  href={`/documents/${id}/chat`}
                  className="quick-action"
                >
                  <span className="flex size-9 items-center justify-center rounded-sm bg-brand-light text-brand">
                    <Icon name="MessageSquare" size={16} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-body-md font-medium text-ink-900">Open chat</span>
                    <span className="block text-body-sm text-ink-500">
                      Ask grounded questions about this document.
                    </span>
                  </span>
                  <Icon name="ChevronRight" size={14} className="text-ink-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function RelatedRulesPanel({ documentId, query }: { documentId: string; query?: string }) {
  const [rules, setRules] = useState<RelatedRuleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    apiClient
      .getDocumentRelatedRules(documentId, { q: query }, session?.accessToken)
      .then((res) => setRules(res.items))
      .catch(() => setRules([]))
      .finally(() => setLoading(false));
  }, [documentId, query]);

  if (loading) {
    return (
      <div className="surface p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-12 w-full" />
      </div>
    );
  }
  if (rules.length === 0) {
    return (
      <div className="surface p-4">
        <p className="text-label uppercase text-ink-500">Related rules</p>
        <p className="mt-2 text-body-sm text-ink-500">No rule links yet for this document.</p>
      </div>
    );
  }
  return (
    <div className="surface p-4">
      <p className="text-label uppercase text-ink-500">Related rules ({rules.length})</p>
      <ul className="mt-3 space-y-3">
        {rules.map((item, i) => (
          <li key={item.rule_id + String(i)} className="rounded-sm border border-border-subtle p-3">
            <Link
              href={item.href || `/knowledge-base/${item.rule_id}`}
              className="text-body-sm font-medium text-ink-900 hover:text-brand"
            >
              {item.title}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-mono-sm text-ink-500">
              {item.citation_label ? <span>{item.citation_label}</span> : null}
              <span className="capitalize">{item.relationship_type.replace(/_/g, " ")}</span>
              {item.welfare_category ? <span className="chip">{item.welfare_category}</span> : null}
              <span className="chip">{Math.round(item.score * 100)}% score</span>
              <span className={"chip " + (item.applicability_status === "applies" ? "text-green-700 bg-green-50" : "text-amber-700 bg-amber-50")}>{item.applicability_status.replace(/_/g, " ")}</span>
            </div>
            {item.reason ? (
              <p className="mt-1 text-body-xs text-ink-500 italic">{item.reason}</p>
            ) : null}
            {item.matched_document_excerpt ? (
              <p className="mt-1 text-body-xs text-ink-500">
                <span className="font-medium text-ink-700">Document:</span> {item.matched_document_excerpt}
              </p>
            ) : null}
            {item.matched_rule_excerpt ? (
              <p className="mt-1 text-body-xs text-ink-500">
                <span className="font-medium text-ink-700">Rule:</span> {item.matched_rule_excerpt}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
