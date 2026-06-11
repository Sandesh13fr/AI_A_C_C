import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default function ContractsPage() {
  return (
    <AppShell title="Contracts" subtitle="Clause extraction, weak commitments, audit rights, reporting obligations, and missing expected protections.">
      <div className="grid gap-4 lg:grid-cols-3">
        {["Clauses", "Commitments", "Missing Terms"].map((item) => (
          <Card key={item}>
            <h2 className="text-h3 text-balance">{item}</h2>
            <p className="mt-2 text-body-sm text-mid-grey">Ready for contract-analysis outputs.</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
