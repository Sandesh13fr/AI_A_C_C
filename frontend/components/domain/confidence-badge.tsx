import { formatPercentage } from "@/lib/utils";

interface ConfidenceBadgeProps {
  value: number;
  label?: string;
}

export function ConfidenceBadge({ value, label = "confidence" }: ConfidenceBadgeProps) {
  return (
    <span className="confidence-badge" aria-label={`${formatPercentage(value)} ${label}`}>
      <span className="confidence-badge__value">{formatPercentage(value)}</span>
      <span className="confidence-badge__label">{label}</span>
    </span>
  );
}
