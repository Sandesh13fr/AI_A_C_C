import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <p className="font-mono text-micro uppercase text-ink-soft">Decision-support workspace</p>
        <h1 className="font-display text-[2.6rem] leading-none text-ink">{title}</h1>
        {description ? <p className="max-w-3xl text-body-sm text-ink-soft">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
