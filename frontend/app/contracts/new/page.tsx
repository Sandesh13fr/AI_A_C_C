import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

export default function NewContractPage() {
  return (
    <AppShell
      breadcrumbs={[{ label: "Contracts", href: "/contracts" }, { label: "New review" }]}
      pageEyebrow="Contract review"
      pageTitle="New contract review"
      pageDescription="Start a new contract decision-support review. The pipeline mirrors Analysis with a contract context tag."
    >
      <div className="mt-6 surface p-5">
        <p className="text-body-sm text-ink-500">
          Contract reviews follow the same wizard as standard analyses, with the contract flag set on the
          run metadata.
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="primary" leadingIcon={<Icon name="Upload" size={14} />}>
            Upload contract
          </Button>
          <Button variant="secondary" leadingIcon={<Icon name="ChevronRight" size={14} />}>
            Use the analysis wizard
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
