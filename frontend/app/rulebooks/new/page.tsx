import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

export default function NewRulebookPage() {
  return (
    <AppShell
      breadcrumbs={[{ label: "Rulebooks", href: "/rulebooks" }, { label: "New rulebook" }]}
      pageEyebrow="Rulebook"
      pageTitle="New rulebook"
      pageDescription="Start with the metadata, then add rules. Drafts stay private to your organisation until published."
    >
      <div className="mt-6 surface p-5">
        <p className="text-body-sm text-ink-500">
          The rulebook editor and version diff view live in the detail pages. Use the &quot;New rulebook&quot; CTA to
          open the wizard.
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="secondary" leadingIcon={<Icon name="Settings" size={14} />}>
            Create from template
          </Button>
          <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
            Start from scratch
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
