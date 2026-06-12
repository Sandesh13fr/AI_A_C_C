import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { reportRows } from "@/lib/mock-data";

export default function ReportsPage() {
  return (
    <AppShell title="Reports" subtitle="Reviewed exports, sign-off state, and blocked external publication controls.">
      <div className="space-y-6">
        <Notice title="Export gate" tone="warning">
          External or partner-share exports remain blocked until a reviewer records the required sign-off scope.
        </Notice>
        <div className="grid gap-4">
          {reportRows.map((report) => (
            <Card key={report.name}>
              <CardContent className="flex flex-col gap-3 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-body-sm font-medium text-ink">{report.name}</p>
                  <p className="mt-1 text-body-sm text-ink-soft">{report.type} · {report.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-micro uppercase text-ink-soft">{report.status}</p>
                  <p className="mt-1 text-body-sm text-ink">{report.signoff}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
