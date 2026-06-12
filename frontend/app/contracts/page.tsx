"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { DocumentRow, type DocumentRowData } from "@/components/domain/document-row";
import { Notice } from "@/components/ui/notice";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, type DocumentItem, type DocumentListResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { titleCase } from "@/lib/utils";

export default function ContractsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    apiClient
      .listDocuments({ page_size: 50, doc_type: "contract" }, session?.accessToken)
      .then((response: DocumentListResponse) => setDocuments(response.items))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell
      pageEyebrow="Supplier contracts"
      pageTitle="Contracts"
      pageDescription="Contract-focused decision-support reviews. Same upload → analysis → review → report pipeline as documents, scoped to contract sources."
      actions={
        <Link href="/contracts/new">
          <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
            New contract review
          </Button>
        </Link>
      }
    >
      <div className="mt-6 space-y-6">
        <Notice title="Contract decision-support disclaimer" tone="warning">
          Contract outputs identify weak commitments, missing terms, and candidate concerns for human
          review. They are not legal advice and not definitive contractual conclusions.
        </Notice>
        <div className="surface">
          <header className="border-b border-border px-4 py-3">
            <h2 className="font-display text-display-lg text-ink-900">Contract sources</h2>
            <p className="mt-1 text-body-sm text-ink-500">Latest contract documents and their review state.</p>
          </header>
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="px-4 py-10 text-center text-body-sm text-ink-500">
              No contract sources indexed yet. Upload a contract to start a review.
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {documents.map((doc) => (
                <DocumentRow key={doc.id} document={toRowData(doc)} href={`/documents/${doc.id}`} />
              ))}
            </div>
          )}
        </div>
        <EmptyState
          title="No clause scoring yet"
          description="Run an analysis on a contract document to generate clause-level findings."
        />
      </div>
    </AppShell>
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
