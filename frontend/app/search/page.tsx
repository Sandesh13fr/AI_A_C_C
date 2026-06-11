"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { SearchResultCard } from "@/components/domain/search-result-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select } from "@/components/ui/select";
import { apiClient, type SearchResult, type SearchGroupedResponse, type RuleListItem } from "@/lib/api-client";
import { getSession } from "@/lib/auth";

function VerificationBadge({ status }: { status: string }) {
  const variant = status === "verified" ? "success" : status === "needs_review" ? "warning" : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}

export default function SearchPage() {
  const [query, setQuery] = useState("housing conditions");
  const [jurisdiction, setJurisdiction] = useState("US-FED");
  const [docType, setDocType] = useState("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [groupedResults, setGroupedResults] = useState<SearchGroupedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"hybrid" | "global">("hybrid");

  async function runSearch() {
    setLoading(true);
    setError(null);
    try {
      const session = getSession();

      if (mode === "global") {
        const response = await apiClient.globalSearch(query, 10, session?.accessToken);
        setGroupedResponse(response);
        setResults([]);
      } else {
        const response = await apiClient.search(
          {
            query,
            jurisdiction,
            doc_type: docType === "all" ? undefined : docType,
            top_k: 10,
          },
          session?.accessToken,
        );
        setResults(response.results);
        setGroupedResults(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function setGroupedResponse(response: SearchGroupedResponse) {
    const transformed: SearchGroupedResponse = {
      ...response,
      rules: response.rules as RuleListItem[],
    };
    setGroupedResults(transformed);
  }

  return (
    <AppShell title="Search" subtitle="Hybrid retrieval across documents, chunks, rules, and citation-ready source context.">
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block">
              <span className="app-label">Query</span>
              <Input className="mt-2" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <label className="block">
              <span className="app-label">Search mode</span>
              <Select className="mt-2" value={mode} onChange={(event) => setMode(event.target.value as "hybrid" | "global")}>
                <option value="hybrid">Document hybrid</option>
                <option value="global">Global (docs + rules)</option>
              </Select>
            </label>
            {mode === "hybrid" && (
              <>
                <label className="block">
                  <span className="app-label">Jurisdiction</span>
                  <Select className="mt-2" value={jurisdiction} onChange={(event) => setJurisdiction(event.target.value)}>
                    <option value="US-FED">US-FED</option>
                    <option value="CA">CA</option>
                    <option value="UK">UK</option>
                  </Select>
                </label>
                <label className="block">
                  <span className="app-label">Document type</span>
                  <Select className="mt-2" value={docType} onChange={(event) => setDocType(event.target.value)}>
                    <option value="all">All</option>
                    <option value="inspection_report">Inspection report</option>
                    <option value="regulation">Regulation</option>
                    <option value="contract">Contract</option>
                    <option value="policy">Policy</option>
                  </Select>
                </label>
              </>
            )}
            <Button className="w-full" loading={loading} onClick={runSearch}>
              {loading ? "Searching" : "Run search"}
            </Button>
            {error ? <Notice title="Search error">{error}</Notice> : null}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Notice title="Guardrail" tone="warning">
            Search results surface potentially relevant evidence and citations. They do not represent a legal determination or a confirmed compliance outcome.
          </Notice>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="space-y-3">
                    <div className="h-4 w-32 rounded-button bg-app-subtle" />
                    <div className="h-6 w-3/4 rounded-button bg-app-subtle" />
                    <div className="h-16 rounded-card bg-app-subtle" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : groupedResults ? (
            <div className="space-y-6">
              {groupedResults.documents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Documents ({groupedResults.total_documents})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {groupedResults.documents.map((doc: Record<string, unknown>, i: number) => (
                      <div key={String(doc.id ?? i)} className="rounded-card border border-app-line bg-app-subtle p-3">
                        <Link href={`/documents/${doc.id}`} className="text-app-teal-deep text-body-sm hover:underline">
                          {String(doc.title ?? "Untitled")}
                        </Link>
                        <p className="mt-1 text-micro text-ink-soft">{String(doc.doc_type ?? "")}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {groupedResults.chunks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Chunks ({groupedResults.total_chunks})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {groupedResults.chunks.map((chunk: Record<string, unknown>, i: number) => (
                      <div key={String(chunk.id ?? i)} className="rounded-card border border-app-line bg-app-bg p-3">
                        <p className="text-body-sm text-ink">{String(chunk.raw_text ?? "").slice(0, 300)}</p>
                        <p className="mt-1 text-micro text-ink-soft">
                          Document: {String(chunk.document_title ?? chunk.document_id ?? "")} · Chunk {String(chunk.chunk_index ?? "")}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {groupedResults.rules.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rules ({groupedResults.total_rules})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {groupedResults.rules.map((rule: RuleListItem) => (
                      <div key={rule.id} className="rounded-card border border-app-line bg-app-subtle p-3">
                        <Link href={`/knowledge-base/${rule.id}`} className="text-app-teal-deep text-body-sm hover:underline">
                          {rule.title}
                        </Link>
                        <p className="mt-1 text-micro text-ink-soft">
                          {rule.citation_label} · {rule.jurisdiction_code}
                        </p>
                        <div className="mt-1">
                          <VerificationBadge status={rule.verification_status} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {groupedResults.documents.length === 0 && groupedResults.chunks.length === 0 && groupedResults.rules.length === 0 && (
                <EmptyState
                  title="No results"
                  description="Try a different query."
                />
              )}
            </div>
          ) : results.length ? (
            results.map((result) => <SearchResultCard key={result.id} result={result} />)
          ) : (
            <EmptyState
              title="No search results yet"
              description="Run a query to load document, rule, and citation candidates with score breakdowns and match reasons."
              action={<Button onClick={runSearch}>Run sample search</Button>}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
