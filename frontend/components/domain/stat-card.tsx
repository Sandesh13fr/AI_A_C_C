import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  description?: string;
  live?: boolean;
  emphasis?: "neutral" | "warning";
  action?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, description, live, emphasis, className }: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-start justify-between">
        <p className="text-label uppercase text-ink-500">{label}</p>
        {live ? (
          <span className="inline-flex items-center gap-1.5 text-label uppercase text-ink-500">
            <span
              className="size-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            Live
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "mt-3 font-display text-display-xl leading-none",
          emphasis === "warning" ? "text-accent-gold" : "text-ink-900",
        )}
      >
        {value}
      </p>
      {description ? (
        <p className="mt-3 text-body-sm text-ink-500">{description}</p>
      ) : null}
    </div>
  );
}
