import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

export default function RulebookEditPage() {
  return (
    <AppShell
      breadcrumbs={[
        { label: "Rulebooks", href: "/rulebooks" },
        { label: "Federal AWA baseline" },
        { label: "Edit" },
      ]}
      pageEyebrow="Edit rulebook"
      pageTitle="Edit rulebook"
      pageDescription="Edit rules, version metadata, and applicability. Changes stay in draft until published."
    >
      <div className="mt-6 surface p-5">
        <p className="text-body-sm text-ink-500">
          The rule editor and version diff live in the rulebook detail view. Use the
          &quot;Edit&quot; action to open the editor for the active version.
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="secondary">Discard changes</Button>
          <Button variant="primary" leadingIcon={<Icon name="Check" size={14} />}>
            Save draft
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
