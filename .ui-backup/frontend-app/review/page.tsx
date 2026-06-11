import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default function ReviewPage() {
  return (
    <AppShell title="Review" subtitle="Human review queue for findings, comments, edits, dismissals, and sign-off events.">
      <Card>
        <h2 className="text-h3 text-balance">Queue</h2>
        <p className="mt-2 text-body-sm text-mid-grey">No pending review assignments are loaded in the local placeholder queue.</p>
      </Card>
    </AppShell>
  );
}
