import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminRows } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <AppShell title="Admin" subtitle="Organizations, users, data sources, audit events, and other governance surfaces.">
      <div className="grid gap-4 lg:grid-cols-3">
        {adminRows.map((row) => (
          <Card key={row.label}>
            <CardHeader>
              <CardTitle>{row.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-body-sm font-medium text-ink">{row.value}</p>
              <p className="text-body-sm text-ink-soft">{row.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
