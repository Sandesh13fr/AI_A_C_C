import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

export default function NewWatchlistPage() {
  return (
    <AppShell
      breadcrumbs={[{ label: "Watchlists", href: "/watchlists" }, { label: "New watchlist" }]}
      pageEyebrow="Watchlist"
      pageTitle="New watchlist"
      pageDescription="Create a saved monitoring list for recurring document or rule sets."
    >
      <div className="mt-6 surface p-5">
        <p className="text-body-sm text-ink-500">
          Watchlists are saved filters with optional alerts. Add documents or rules from the corpus.
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
            Create watchlist
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
