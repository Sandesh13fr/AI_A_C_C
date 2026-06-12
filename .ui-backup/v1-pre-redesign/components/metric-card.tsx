import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
}

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <p className="app-label">{label}</p>
        <div className="flex items-end justify-between gap-3">
          <p className="font-display text-[2.25rem] leading-none text-ink">{value}</p>
          <span className="rounded-badge border border-app-line bg-app-subtle px-2 py-1 font-mono text-micro uppercase text-ink-soft">
            Live
          </span>
        </div>
        <p className="text-body-sm text-ink-soft">{detail}</p>
      </CardContent>
    </Card>
  );
}
