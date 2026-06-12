"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, type WatchlistItem, type WatchlistListResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { formatDateLabel } from "@/lib/utils";

export default function WatchlistsPage() {
  const [watchlists, setWatchlists] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    apiClient
      .listWatchlists(session?.accessToken)
      .then((response: WatchlistListResponse) => setWatchlists(response.items))
      .catch(() => setWatchlists([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell
      pageEyebrow="Saved monitoring lists"
      pageTitle="Watchlists"
      pageDescription="Recurring document or rule sets with alerting. Useful for tracking supplier or topic clusters."
      actions={
        <Link href="/watchlists/new">
          <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
            New watchlist
          </Button>
        </Link>
      }
    >
      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="surface p-5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-24" />
              </div>
            ))}
          </div>
        ) : watchlists.length === 0 ? (
          <EmptyState
            title="No watchlists yet"
            description="Create a saved monitoring list to track recurring document or rule sets."
            action={
              <Link href="/watchlists/new">
                <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
                  New watchlist
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {watchlists.map((watchlist) => (
              <div key={watchlist.id} className="surface flex flex-col gap-3 p-5">
                <h3 className="font-body text-heading-md text-ink-900">{watchlist.name}</h3>
                {watchlist.description ? (
                  <p className="text-body-sm text-ink-500">{watchlist.description}</p>
                ) : null}
                <div className="flex items-center justify-between text-body-sm">
                  <span className="font-mono text-ink-700">
                    {watchlist.item_count ?? 0} items
                  </span>
                  <span className="font-mono text-mono-sm text-ink-500">
                    Updated {formatDateLabel(watchlist.last_updated)}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Link href={`/watchlists/${watchlist.id}`}>
                    <Button variant="primary" size="sm" leadingIcon={<Icon name="ChevronRight" size={14} />}>
                      Open
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
