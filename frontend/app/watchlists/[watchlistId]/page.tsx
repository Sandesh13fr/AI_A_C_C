import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { DocumentRow, type DocumentRowData } from "@/components/domain/document-row";
import { apiClient, type DocumentItem, type DocumentListResponse, type WatchlistItem, type WatchlistListResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { formatDateLabel, titleCase } from "@/lib/utils";

interface PageProps {
  params: Promise<{ watchlistId: string }>;
}

const EMPTY_WATCHLISTS: WatchlistListResponse = { items: [], total: 0 };
const EMPTY_DOCUMENTS: DocumentListResponse = { items: [], total: 0, page: 1, page_size: 0 };

export default async function WatchlistDetailPage({ params }: PageProps) {
  const { watchlistId } = await params;
  const session = getSession();
  let watchlist: WatchlistItem | null = null;
  let items: DocumentItem[] = [];
  try {
    const token = session?.accessToken ?? null;
    const response: WatchlistListResponse = token
      ? await apiClient.listWatchlists(token)
      : EMPTY_WATCHLISTS;
    watchlist = response.items.find((item) => item.id === watchlistId) ?? response.items[0] ?? null;
  } catch {
    watchlist = null;
  }
  if (!watchlist) {
    notFound();
  }
  try {
    const token = session?.accessToken ?? null;
    const documentsResponse: DocumentListResponse = token
      ? await apiClient.listDocuments({ page_size: 20 }, token)
      : EMPTY_DOCUMENTS;
    items = documentsResponse.items.slice(0, watchlist.item_count ?? 0);
  } catch {
    items = [];
  }

  return (
    <AppShell
      breadcrumbs={[{ label: "Watchlists", href: "/watchlists" }, { label: watchlist.name }]}
      pageEyebrow="Watchlist"
      pageTitle={watchlist.name}
      pageDescription={watchlist.description ?? "Saved monitoring list."}
      actions={
        <>
          <Button variant="secondary" leadingIcon={<Icon name="Settings" size={14} />}>
            Set alerts
          </Button>
          <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
            Add item
          </Button>
        </>
      }
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="surface">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-display text-display-lg text-ink-900">Items</h2>
            <span className="font-mono text-mono-sm text-ink-500">
              {items.length} of {watchlist.item_count ?? 0}
            </span>
          </header>
          {items.length > 0 ? (
            <div className="divide-y divide-border-subtle">
              {items.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  document={toRowData(doc)}
                  href={`/documents/${doc.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="px-4 py-10 text-center text-body-sm text-ink-500">
              No items yet. Add documents or rules to start monitoring.
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="surface p-4">
            <p className="text-label uppercase text-ink-500">Status</p>
            <div className="mt-3 space-y-2 text-body-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Last update</span>
                <span className="font-mono text-ink-700">{formatDateLabel(watchlist.last_updated)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Alerts</span>
                <span className="text-ink-900">{titleCase("Active")}</span>
              </div>
            </div>
          </div>
          <div className="surface p-4">
            <p className="text-label uppercase text-ink-500">Actions</p>
            <ul className="mt-3 space-y-2 text-body-sm">
              <li>
                <Link
                  href={`/watchlists/${watchlist.id}`}
                  className="text-ink-700 hover:text-brand"
                >
                  Add or remove items
                </Link>
              </li>
              <li>
                <Link href="/settings/notifications" className="text-ink-700 hover:text-brand">
                  Configure alerts
                </Link>
              </li>
              <li>
                <button type="button" className="text-[#D92D20] hover:underline">
                  Delete watchlist
                </button>
              </li>
            </ul>
          </div>
        </div>
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
