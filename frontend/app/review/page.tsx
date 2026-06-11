import { AppShell } from "@/components/app-shell";
import { FindingCard } from "@/components/domain/finding-card";
import { ReviewActionBar } from "@/components/domain/review-action-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { reviewQueue, sampleFindings } from "@/lib/mock-data";

export default function ReviewPage() {
  return (
    <AppShell title="Review Queue" subtitle="Human review workflow for candidate concerns, comments, dismissals, and sign-off decisions.">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviewQueue.map((item) => (
                <div key={item.id} className="rounded-card border border-app-line bg-app-bg px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-body-sm font-medium text-ink">{item.title}</p>
                      <p className="mt-1 text-body-sm text-ink-soft">{item.reason} · Owner: {item.owner}</p>
                    </div>
                    <span className="font-mono text-micro uppercase text-ink-soft">{item.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {sampleFindings.length ? sampleFindings.map((finding) => <FindingCard key={finding.id} finding={finding} />) : <EmptyState title="No review items" description="When analyses create candidate concerns, they will appear here for human action." />}
        </div>

        <div className="space-y-6">
          <ReviewActionBar />
          <Card>
            <CardHeader>
              <CardTitle>Review history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-body-sm text-ink-soft">
              <p>Accepted findings remain decision-support output until explicit sign-off is recorded.</p>
              <p>Dismissals, comments, edits, and sign-off events will be listed here once audit wiring is connected.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
