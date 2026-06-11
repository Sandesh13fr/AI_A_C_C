import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NoticeProps {
  title: string;
  children: ReactNode;
  tone?: "neutral" | "warning";
}

export function Notice({ title, children, tone = "neutral" }: NoticeProps) {
  return (
    <div
      className={cn(
        "rounded-card border px-4 py-3",
        tone === "warning" ? "border-[#ead3a7] bg-app-gold-soft/70" : "border-app-line bg-app-subtle",
      )}
    >
      <p className="font-mono text-micro uppercase text-ink-soft">{title}</p>
      <div className="mt-2 text-body-sm text-ink">{children}</div>
    </div>
  );
}
