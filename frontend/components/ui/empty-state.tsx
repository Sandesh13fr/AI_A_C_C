import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-[320px] flex-col items-center justify-center px-4 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-3 text-ink-300" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 className="font-body text-heading-md font-semibold text-ink-700">{title}</h3>
      {description ? (
        <p className="mt-2 text-body-sm text-ink-500">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
