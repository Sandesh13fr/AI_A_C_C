import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default function RulebooksPage() {
  return (
    <AppShell title="Rulebooks" subtitle="Versioned legal minimums, agency guidance, and custom advocacy rulebooks.">
      <div className="grid gap-4 lg:grid-cols-2">
        {["Federal AWA baseline", "Custom advocacy standards"].map((name) => (
          <Card key={name}>
            <h2 className="text-h3 text-balance">{name}</h2>
            <p className="mt-2 text-body-sm text-mid-grey">Draft rulebook workspace.</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
