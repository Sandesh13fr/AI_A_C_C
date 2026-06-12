"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentRow, type DocumentRowData } from "@/components/domain/document-row";
import { SearchInput } from "@/components/domain/search-input";
import { Tabs } from "@/components/domain/tabs";
import { Icon } from "@/components/icon";
import { apiClient, type DocumentItem } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { titleCase } from "@/lib/utils";

type StatusFilter = "indexed" | "needs_review" | "flagged" | "approved" | "synced" | "draft";
type SourceFilter = "inspection_report" | "contract" | "regulation" | "policy" | "guidance";
type JurisdictionFilter = "US-FED" | "US-CA" | "EU" | "MULTI" | "OTHER";
type SpeciesFilter = "broiler_chicken" | "layer_chicken" | "multi_species" | "cattle" | "swine";

const STATUS_OPTIONS: StatusFilter[] = ["indexed", "needs_review", "flagged", "approved", "synced", "draft"];
const SOURCE_OPTIONS: SourceFilter[] = ["inspection_report", "contract", "regulation", "policy", "guidance"];
const JURISDICTION_OPTIONS: JurisdictionFilter[] = ["US-FED", "US-CA", "EU", "MULTI", "OTHER"];
const SPECIES_OPTIONS: SpeciesFilter[] = ["broiler_chicken", "layer_chicken", "multi_species", "cattle", "swine"];

const STATUS_LABELS: Record<StatusFilter, string> = {
  indexed: "Indexed",
  needs_review: "Needs Review",
  flagged: "Flagged",
  approved: "Approved",
  synced: "Synced",
  draft: "Draft",
};

const SOURCE_LABELS: Record<SourceFilter, string> = {
  inspection_report: "Inspection report",
  contract: "Contract",
  regulation: "Regulation",
  policy: "Policy",
  guidance: "Guidance",
};

const JURISDICTION_LABELS: Record<JurisdictionFilter, string> = {
  "US-FED": "Federal",
  "US-CA": "California",
  EU: "EU",
  MULTI: "Multi-jurisdiction",
  OTHER: "Other",
};

const SPECIES_LABELS: Record<SpeciesFilter, string> = {
  broiler_chicken: "Broiler chicken",
  layer_chicken: "Layer chicken",
  multi_species: "Multi-species",
  cattle: "Cattle",
  swine: "Swine",
};

interface AppliedFilters {
  status: Set<StatusFilter>;
  source: Set<SourceFilter>;
  jurisdiction: Set<JurisdictionFilter>;
  species: Set<SpeciesFilter>;
}

const EMPTY_FILTERS: AppliedFilters = {
  status: new Set(),
  source: new Set(),
  jurisdiction: new Set(),
  species: new Set(),
};

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-body-sm text-ink-500">Loading documents…</div>}>
      <DocumentsList />
    </Suspense>
  );
}

function DocumentsList() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") === "saved" ? "saved" : "all";
  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<AppliedFilters>(EMPTY_FILTERS);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    apiClient
      .listDocuments(
        {
          page_size: 100,
        },
        session?.accessToken,
      )
      .then((response) => setDocuments(response.items))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to load documents";
        setError(message);
        setDocuments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return documents.filter((doc) => {
      if (q) {
        const haystack = [doc.title, doc.filename, doc.doc_type, doc.metadata?.jurisdiction_code]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.status.size > 0 && !filters.status.has(doc.status as StatusFilter)) return false;
      if (filters.source.size > 0 && !filters.source.has(doc.doc_type as SourceFilter)) return false;
      if (filters.jurisdiction.size > 0) {
        const code = (doc.metadata?.jurisdiction_code ?? "").toLowerCase();
        const match =
          (filters.jurisdiction.has("US-FED") && code.includes("federal")) ||
          (filters.jurisdiction.has("US-CA") && code.includes("california")) ||
          (filters.jurisdiction.has("EU") && code.includes("eu")) ||
          (filters.jurisdiction.has("MULTI") && code.includes("multi"));
        if (!match) return false;
      }
      return true;
    });
  }, [documents, query, filters]);

  const activeChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];
    filters.status.forEach((value) =>
      chips.push({
        key: `status-${value}`,
        label: STATUS_LABELS[value],
        onRemove: () => setFilters((prev) => toggleSet(prev, "status", value)),
      }),
    );
    filters.source.forEach((value) =>
      chips.push({
        key: `source-${value}`,
        label: SOURCE_LABELS[value],
        onRemove: () => setFilters((prev) => toggleSet(prev, "source", value)),
      }),
    );
    filters.jurisdiction.forEach((value) =>
      chips.push({
        key: `jurisdiction-${value}`,
        label: JURISDICTION_LABELS[value],
        onRemove: () => setFilters((prev) => toggleSet(prev, "jurisdiction", value)),
      }),
    );
    filters.species.forEach((value) =>
      chips.push({
        key: `species-${value}`,
        label: SPECIES_LABELS[value],
        onRemove: () => setFilters((prev) => toggleSet(prev, "species", value)),
      }),
    );
    return chips;
  }, [filters]);

  return (
    <AppShell
      pageEyebrow="Document library"
      pageTitle="Documents"
      pageDescription="Browse the document corpus, search across rules and precedents, and act on review-ready evidence."
      actions={
        <a href="/uploads">
          <Button variant="primary" leadingIcon={<Icon name="Upload" size={14} />}>
            Upload document
          </Button>
        </a>
      }
    >
      <div className="mt-6">
        <Tabs
          items={[
            { label: "All documents", value: "all", icon: "FileText", count: documents.length },
            { label: "Saved searches", value: "saved", icon: "Star" },
          ]}
          paramName="tab"
        />
      </div>

      {tab === "saved" ? (
        <div className="mt-6">
          <EmptyState
            title="No saved searches yet"
            description="Save your frequent queries from the search bar to surface them here for the whole team."
            action={<Button variant="secondary">Save current search</Button>}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[240px_1fr]">
          <FilterPanel filters={filters} setFilters={setFilters} />
          <div className="space-y-4">
            <SearchInput
              placeholder="Filter by title, ID, tag…"
              value={query}
              onChange={setQuery}
            />
            {activeChips.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    type="button"
                    key={chip.key}
                    onClick={chip.onRemove}
                    className="chip chip--brand"
                    aria-label={`Remove ${chip.label} filter`}
                  >
                    {chip.label}
                    <Icon name="X" size={10} />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="text-label uppercase text-ink-500 hover:text-ink-900"
                >
                  Clear all
                </button>
              </div>
            ) : null}
            <div className="surface">
              {loading ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-body-sm text-ink-500">{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState
                  title={documents.length === 0 ? "No documents indexed yet" : "No documents match your filters."}
                  description={
                    documents.length === 0
                      ? "Upload your first document to begin."
                      : "Adjust the filters or upload new documents."
                  }
                />
              ) : (
                <div className="divide-y divide-border-subtle">
                  {filtered.map((doc) => (
                    <DocumentRow
                      key={doc.id}
                      document={toRowData(doc)}
                      href={`/documents/${doc.id}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-body-sm text-ink-500">
              <span>
                Showing <span className="font-mono text-ink-700">{filtered.length}</span> of{" "}
                <span className="font-mono text-ink-700">{documents.length}</span> documents
              </span>
            </div>
          </div>
        </div>
      )}
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

interface FilterPanelProps {
  filters: AppliedFilters;
  setFilters: React.Dispatch<React.SetStateAction<AppliedFilters>>;
}

function FilterPanel({ filters, setFilters }: FilterPanelProps) {
  return (
    <aside className="surface h-fit">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-label uppercase text-ink-500">Filters</h2>
      </header>
      <div className="space-y-5 px-4 py-4 text-body-sm">
        <FilterGroup title="Status">
          {STATUS_OPTIONS.map((value) => (
            <Checkbox
              key={value}
              label={STATUS_LABELS[value]}
              checked={filters.status.has(value)}
              onChange={() => setFilters((prev) => toggleSet(prev, "status", value))}
            />
          ))}
        </FilterGroup>
        <FilterGroup title="Source type">
          {SOURCE_OPTIONS.map((value) => (
            <Checkbox
              key={value}
              label={SOURCE_LABELS[value]}
              checked={filters.source.has(value)}
              onChange={() => setFilters((prev) => toggleSet(prev, "source", value))}
            />
          ))}
        </FilterGroup>
        <FilterGroup title="Jurisdiction">
          {JURISDICTION_OPTIONS.map((value) => (
            <Checkbox
              key={value}
              label={JURISDICTION_LABELS[value]}
              checked={filters.jurisdiction.has(value)}
              onChange={() => setFilters((prev) => toggleSet(prev, "jurisdiction", value))}
            />
          ))}
        </FilterGroup>
        <FilterGroup title="Species">
          {SPECIES_OPTIONS.map((value) => (
            <Checkbox
              key={value}
              label={SPECIES_LABELS[value]}
              checked={filters.species.has(value)}
              onChange={() => setFilters((prev) => toggleSet(prev, "species", value))}
            />
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-label uppercase text-ink-500">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function toggleSet<K extends keyof AppliedFilters>(
  prev: AppliedFilters,
  key: K,
  value: AppliedFilters[K] extends Set<infer V> ? V : never,
): AppliedFilters {
  const next = new Set(prev[key] as Set<unknown>);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return { ...prev, [key]: next } as AppliedFilters;
}
