import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/schemas";
import { riskSeverityLabels } from "@/lib/ui-config";

interface RiskBadgeProps {
  severity: Severity | string;
  className?: string;
}

const styleBySeverity: Record<string, string> = {
  critical: "risk-badge risk-badge--critical",
  high: "risk-badge risk-badge--high",
  medium: "risk-badge risk-badge--medium",
  low: "risk-badge risk-badge--low",
  info: "risk-badge risk-badge--info",
};

export function RiskBadge({ severity, className }: RiskBadgeProps) {
  const key = typeof severity === "string" ? severity : severity;
  const label = riskSeverityLabels[key] ?? "INFORMATIONAL NOTE";
  return (
    <span className={cn(styleBySeverity[key] ?? "risk-badge risk-badge--info", className)}>
      {label}
    </span>
  );
}
