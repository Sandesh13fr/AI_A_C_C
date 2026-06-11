import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { contractClauses } from "@/lib/mock-data";

export default function ContractsPage() {
  return (
    <AppShell title="Contracts" subtitle="Contract-focused analysis for commitments, audit rights, reporting duties, and other review-worthy terms.">
      <div className="space-y-6">
        <Notice title="Contract analysis disclaimer" tone="warning">
          Contract outputs identify weak commitments, missing terms, and candidate concerns for review. They are not legal advice and not definitive contractual conclusions.
        </Notice>
        <div className="grid gap-4 lg:grid-cols-2">
          {contractClauses.map((clause) => (
            <Card key={clause.clause}>
              <CardHeader>
                <CardTitle>{clause.clause}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-mono text-micro uppercase text-ink-soft">{clause.score}</p>
                <p className="text-body-sm text-ink-soft">{clause.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
