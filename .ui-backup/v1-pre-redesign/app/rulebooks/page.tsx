import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { rulebookRows } from "@/lib/mock-data";

export default function RulebooksPage() {
  return (
    <AppShell
      title="Rulebooks"
      subtitle="Versioned advocacy and legal rulebooks that can be tested against documents without changing review guardrails."
      actions={<Button>Create placeholder rulebook</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {rulebookRows.map((rulebook) => (
          <Card key={rulebook.name}>
            <CardHeader>
              <CardTitle>{rulebook.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-body-sm text-ink-soft">
              <p>{rulebook.version} · {rulebook.visibility} · {rulebook.status}</p>
              <p>{rulebook.rules} rules mapped into this rulebook.</p>
              <div className="flex gap-3">
                <Button variant="secondary">Edit</Button>
                <Button variant="ghost">Test against sample docs</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
