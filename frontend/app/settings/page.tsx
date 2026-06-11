import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Workspace preferences, model defaults, and placeholder controls for future environment configuration.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workspace defaults</CardTitle>
          </CardHeader>
          <CardContent className="text-body-sm text-ink-soft">
            Theme, filter presets, and reviewer defaults can be configured here when backend preference storage is available.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feature flags</CardTitle>
          </CardHeader>
          <CardContent className="text-body-sm text-ink-soft">
            This placeholder route keeps the app shell complete and provides a future home for model, retrieval, and export controls.
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
