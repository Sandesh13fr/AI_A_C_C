import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardStats, quickActions, recentActivity, systemStatus } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Operational overview for ingestion, analysis, review, and governance-safe export readiness."
      actions={
        <div className="flex gap-3">
          <Link href="/uploads">
            <Button variant="secondary">Upload document</Button>
          </Link>
          <Link href="/analysis">
            <Button>Start analysis</Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <MetricCard key={stat.label} label={stat.label} value={stat.value} detail={stat.detail} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Recent documents and runs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.title} className="rounded-card border border-app-line bg-app-bg px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-body-sm font-medium text-ink">{item.title}</p>
                      <p className="mt-1 text-body-sm text-ink-soft">{item.meta}</p>
                    </div>
                    <span className="font-mono text-micro uppercase text-ink-soft">{item.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="block rounded-button border border-app-line px-4 py-3 hover:border-app-teal hover:bg-app-mint/50"
                  >
                    <p className="text-body-sm font-medium text-ink">{action.label}</p>
                    <p className="mt-1 text-body-sm text-ink-soft">{action.note}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemStatus.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 border-b border-app-line pb-3 last:border-b-0 last:pb-0">
                    <p className="text-body-sm text-ink-soft">{row.label}</p>
                    <p className="text-body-sm font-medium text-ink">{row.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
