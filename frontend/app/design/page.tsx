import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default function DesignPage() {
  return (
    <AppShell title="Design" subtitle="Interface primitives for dense compliance review workflows.">
      <div className="grid gap-4 lg:grid-cols-3">
        {["Cards", "Badges", "Review States"].map((item) => (
          <Card key={item}>
            <h2 className="text-h3 text-balance">{item}</h2>
            <p className="mt-2 text-body-sm text-mid-grey">Component baseline.</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
