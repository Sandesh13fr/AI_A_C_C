import type { ReactNode } from "react";

type BadgeVariant =
  | "needs-review"
  | "ai-draft"
  | "cited"
  | "signed-off"
  | "jurisdiction"
  | "confidence"
  | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  "needs-review": "border-gold text-gold",
  "ai-draft": "border-teal text-teal",
  cited: "border-teal/60 text-teal",
  "signed-off": "border-white/40 text-white/80",
  jurisdiction: "border-mid-grey/50 text-mid-grey",
  confidence: "border-mid-grey/30 text-mid-grey",
  default: "border-mid-grey/40 text-mid-grey",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-badge border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
