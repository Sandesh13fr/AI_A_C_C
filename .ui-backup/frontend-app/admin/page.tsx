import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <AppShell title="Admin" subtitle="Organization settings, source registry, permissions, audit events, and model invocation logs.">
      <div className="grid gap-4 lg:grid-cols-3">
        {["Organizations", "Sources", "Audit"].map((item) => (
          <Card key={item}>
            <h2 className="text-h3 text-balance">{item}</h2>
            <p className="mt-2 text-body-sm text-mid-grey">Administrative data surface.</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
