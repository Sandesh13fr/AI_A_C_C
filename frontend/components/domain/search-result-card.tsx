import Link from "next/link";
import { CitationChip } from "@/components/domain/citation-chip";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import type { SearchResult } from "@/lib/api-client";

export function SearchResultCard({ result }: { result: SearchResult }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <CitationChip label={result.doc_type} />
            <CitationChip label={result.metadata?.jurisdiction_code ?? "Scope pending"} type="source" />
            {result.source_label ? <StatusPill status={result.source_label} /> : null}
          </div>
          <div>
            <Link href={`/documents/${result.id}`} className="text-h3 text-ink hover:text-app-teal">
              {result.title ?? result.filename}
            </Link>
            <p className="mt-2 text-body-sm text-ink-soft">
              {result.retrieval_summary ?? "No retrieval summary was returned for this result."}
            </p>
          </div>
          {result.match_reason ? (
            <div className="rounded-card border border-app-line bg-app-bg px-4 py-3">
              <p className="app-label">Match reason</p>
              <p className="mt-2 text-body-sm text-ink">{result.match_reason}</p>
            </div>
          ) : null}
        </div>
        <div className="rounded-card border border-app-line bg-app-subtle px-4 py-3 font-mono text-body-sm tabular-nums text-ink">
          <p className="app-label">Score breakdown</p>
          <dl className="mt-3 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink-soft">Final</dt>
              <dd>{result.scores.final_score.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink-soft">Vector</dt>
              <dd>{result.scores.vector_score.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink-soft">BM25</dt>
              <dd>{result.scores.bm25_score.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-ink-soft">Metadata</dt>
              <dd>{result.scores.metadata_boost.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
