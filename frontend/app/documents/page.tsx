"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { apiClient, type DocumentItem } from "@/lib/api-client";
import { getSession } from "@/lib/auth";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    apiClient
      .listDocuments(session?.accessToken)
      .then((response) => setDocuments(response.items))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load documents"));
  }, []);

  return (
    <AppShell title="Documents" subtitle="Source files, uploads, OCR status, metadata, chunks, and citation context.">
      {error ? <p className="mb-4 text-body-sm text-coral">{error}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {documents.map((document) => (
          <Card key={document.id}>
            <a href={`/documents/${document.id}`} className="text-h3 text-balance hover:text-teal">
              {document.title ?? document.filename}
            </a>
            <p className="mt-2 text-body-sm text-mid-grey text-pretty">{document.retrieval_summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-micro text-mid-grey">
              <span>{document.doc_type}</span>
              <span>{document.status}</span>
              <span>{document.metadata?.jurisdiction_code ?? "jurisdiction pending"}</span>
            </div>
          </Card>
        ))}
        {!documents.length && !error ? (
          <Card>
            <p className="text-body-sm text-mid-grey">Loading documents.</p>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}
