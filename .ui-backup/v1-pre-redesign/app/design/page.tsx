import { AppShell } from "@/components/app-shell";
import { FindingCard } from "@/components/domain/finding-card";
import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dashboardStats, sampleFindings } from "@/lib/mock-data";

export default function DesignPage() {
  return (
    <AppShell title="Design System" subtitle="Reference-aligned tokens, layout rules, components, and reviewer-facing language patterns.">
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <MetricCard key={stat.label} label={stat.label} value={stat.value} detail={stat.detail} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <Card>
            <CardHeader>
              <CardTitle>Palette and controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["App background", "bg-app-bg"],
                  ["App panel", "bg-app-panel"],
                  ["Accent teal", "bg-app-teal"],
                  ["Mint", "bg-app-mint"],
                  ["Gold soft", "bg-app-gold-soft"],
                  ["Coral soft", "bg-app-coral-soft"],
                ].map(([label, color]) => (
                  <div key={label} className="space-y-2">
                    <div className={`h-14 rounded-card border border-app-line ${color}`} />
                    <p className="text-body-sm text-ink">{label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="accent">Accent</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Blocked</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inputs and notices</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input defaultValue="Search query or document name" />
              <Select defaultValue="US-FED">
                <option value="US-FED">US-FED</option>
              </Select>
              <div className="md:col-span-2">
                <Textarea defaultValue="Reviewer note or structured explanation." />
              </div>
              <div className="md:col-span-2">
                <Notice title="Approved language" tone="warning">
                  Use terms such as potential risk, possible gap, candidate concern, or needs human review. Avoid definitive legal-determination language.
                </Notice>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <FindingCard finding={sampleFindings[0]} />
        </section>
      </div>
    </AppShell>
  );
}
