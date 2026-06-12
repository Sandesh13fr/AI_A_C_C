import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-card border border-dashed border-app-line-strong bg-app-panel px-5 py-8 text-center", className)}>
      <p className="font-mono text-micro uppercase text-ink-soft">No items loaded</p>
      <h3 className="mt-3 text-h3 text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-body-sm text-ink-soft">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
