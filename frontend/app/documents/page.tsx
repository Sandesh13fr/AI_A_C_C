"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { apiClient, type DocumentItem } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { titleCase } from "@/lib/utils";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentItem[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    apiClient
      .listDocuments(session?.accessToken)
      .then((response) => {
        setDocuments(response.items);
        setFilteredDocuments(response.items);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load documents"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const lowered = query.toLowerCase();
    setFilteredDocuments(
      documents.filter((document) =>
        [document.title, document.filename, document.doc_type, document.metadata?.jurisdiction_code]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(lowered)),
      ),
    );
  }, [documents, query]);

  return (
    <AppShell title="Documents" subtitle="Browse ingested documents, metadata, ingestion state, and review-ready source records.">
      <Card>
        <CardHeader>
          <CardTitle>Document library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Filter by title, filename, type, or jurisdiction"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 rounded-card bg-app-subtle" />
              ))}
            </div>
          ) : error ? (
            <EmptyState title="Unable to load documents" description={error} />
          ) : filteredDocuments.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <tr>
                    <TableHeaderCell>Document</TableHeaderCell>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Jurisdiction</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Source</TableHeaderCell>
                  </tr>
                </TableHead>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <Link href={`/documents/${document.id}`} className="font-medium text-ink hover:text-app-teal">
                          {document.title ?? document.filename}
                        </Link>
                        <p className="mt-1 text-body-sm text-ink-soft">{document.retrieval_summary ?? "No summary available."}</p>
                      </TableCell>
                      <TableCell>{titleCase(document.doc_type)}</TableCell>
                      <TableCell>{document.metadata?.jurisdiction_code ?? "Pending"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{titleCase(document.status)}</Badge>
                      </TableCell>
                      <TableCell>{document.source_label ?? "Workspace upload"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              title="No documents match this filter"
              description="Adjust the search text or upload a new document batch to populate the library."
            />
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
