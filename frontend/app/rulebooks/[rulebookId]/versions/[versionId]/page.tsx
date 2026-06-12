import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

export default function RulebookVersionPage() {
  return (
    <AppShell
      breadcrumbs={[
        { label: "Rulebooks", href: "/rulebooks" },
        { label: "Federal AWA baseline" },
        { label: "v11" },
      ]}
      pageEyebrow="Version"
      pageTitle="Version v11"
      pageDescription="Compare this version to the current one. Restoring creates a new draft version."
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="surface p-5">
          <h2 className="section-heading">v11 (previous)</h2>
          <ul className="mt-3 space-y-2 text-body-sm text-ink-700">
            <li>Housing facilities shall be maintained in good repair.</li>
            <li>Veterinary care shall be available on a 24-hour basis.</li>
          </ul>
        </div>
        <div className="surface p-5">
          <h2 className="section-heading">v12 (current)</h2>
          <ul className="mt-3 space-y-2 text-body-sm text-ink-700">
            <li>
              <span className="text-emerald-600">+ </span>Housing facilities shall be structurally sound
              and maintained in good repair.
            </li>
            <li>
              <span className="text-amber-600">~ </span>Veterinary care shall be available on a 24-hour
              basis with documented escalation procedures.
            </li>
          </ul>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="secondary" leadingIcon={<Icon name="X" size={14} />}>
              Discard
            </Button>
            <Button variant="primary" leadingIcon={<Icon name="Check" size={14} />}>
              Restore as draft
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
