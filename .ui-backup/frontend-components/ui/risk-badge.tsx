import type { Severity } from "@/lib/schemas";
import { Badge } from "./badge";

interface RiskBadgeProps {
  severity: Severity;
  className?: string;
}

const severityConfig: Record<Severity, { label: string; dotClass: string }> = {
  critical: { label: "CRITICAL POTENTIAL RISK", dotClass: "bg-[#B42318]" },
  high: { label: "HIGH POTENTIAL RISK", dotClass: "bg-[#D92D20]" },
  medium: { label: "MEDIUM POTENTIAL RISK", dotClass: "bg-gold" },
  low: { label: "LOW POTENTIAL RISK", dotClass: "bg-teal" },
};

export function RiskBadge({ severity, className = "" }: RiskBadgeProps) {
  const cfg = severityConfig[severity];
  return (
    <Badge variant="needs-review" className={className}>
      <span className={`inline-block h-2 w-2 rounded-full ${cfg.dotClass}`} />
      {cfg.label}
    </Badge>
  );
}
