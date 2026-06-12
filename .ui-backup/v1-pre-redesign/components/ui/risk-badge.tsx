import type { Severity } from "@/lib/schemas";
import { severityTone } from "@/lib/mock-data";
import { cn, titleCase } from "@/lib/utils";

interface RiskBadgeProps {
  severity: Severity;
  className?: string;
}

export function RiskBadge({ severity, className }: RiskBadgeProps) {
  const tone = severityTone[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-badge border border-app-line px-2.5 py-1 font-mono text-micro uppercase",
        tone.surface,
        tone.text,
        className,
      )}
    >
      <span className="size-2 rounded-full bg-current" aria-hidden="true" />
      {titleCase(severity)} potential risk
    </span>
  );
}
