"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { apiClient, type SearchResult } from "@/lib/api-client";

export default function SearchPage() {
  const [query, setQuery] = useState("housing conditions");
  const [jurisdiction, setJurisdiction] = useState("US-FED");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch() {
    setLoading(true);
    setError(null);
    try {
      const session = getSession();
      const response = await apiClient.search(
        {
          query,
          jurisdiction,
          top_k: 10,
          welfare_category: ["housing_environment"],
        },
        session?.accessToken,
      );
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Search"
      subtitle="Hybrid retrieval across source documents, chunks, rule text, and review-safe citation context."
    >
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card>
          <div className="space-y-4">
            <label className="block text-body-sm">
              Query
              <input
                className="mt-1 w-full rounded-button border border-dark-border bg-dark-surface px-3 py-2"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label className="block text-body-sm">
              Jurisdiction
              <select
                className="mt-1 w-full rounded-button border border-dark-border bg-dark-surface px-3 py-2"
                value={jurisdiction}
                onChange={(event) => setJurisdiction(event.target.value)}
              >
                <option value="US-FED">US-FED</option>
              </select>
            </label>
            <button
              className="w-full rounded-button bg-teal px-4 py-2.5 text-body-sm font-semibold text-white disabled:opacity-50"
              disabled={loading}
              onClick={runSearch}
            >
              {loading ? "Searching" : "Run search"}
            </button>
            {error ? <p className="text-body-sm text-coral">{error}</p> : null}
          </div>
        </Card>

        <div className="space-y-3">
          {(results.length ? results : []).map((result) => (
            <Card key={result.id}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <a className="text-h3 text-balance hover:text-teal" href={`/documents/${result.id}`}>
                    {result.title ?? result.filename}
                  </a>
                  <p className="mt-2 text-body-sm text-mid-grey text-pretty">{result.retrieval_summary}</p>
                  <p className="mt-3 font-mono text-micro text-mid-grey">
                    {result.doc_type} / {result.metadata?.jurisdiction_code ?? "scope pending"}
                  </p>
                </div>
                <div className="min-w-48 rounded-card border border-dark-border bg-dark-surface p-3 font-mono text-micro tabular-nums">
                  <div>final {result.scores.final_score.toFixed(2)}</div>
                  <div>vector {result.scores.vector_score.toFixed(2)}</div>
                  <div>bm25 {result.scores.bm25_score.toFixed(2)}</div>
                  <div>metadata {result.scores.metadata_boost.toFixed(2)}</div>
                </div>
              </div>
              {result.match_reason ? <p className="mt-3 text-body-sm text-mid-grey">{result.match_reason}</p> : null}
            </Card>
          ))}
          {!results.length ? (
            <Card>
              <p className="text-body-sm text-mid-grey text-pretty">
                Run a search to load citation-ready results with score breakdowns.
              </p>
            </Card>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
