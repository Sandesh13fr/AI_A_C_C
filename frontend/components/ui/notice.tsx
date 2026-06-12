import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "warning" | "danger" | "success" | "info";

interface NoticeProps {
  title?: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  neutral: "border-border bg-ink-50",
  warning: "border-[#FDE68A] bg-[#FFFBEB]",
  danger: "border-[#FECACA] bg-[#FEF2F2]",
  success: "border-[#A7F3D0] bg-[#ECFDF5]",
  info: "border-[#E2E8F0] bg-[#F8FAFC]",
};

export function Notice({ title, children, tone = "neutral", className }: NoticeProps) {
  return (
    <div
      className={cn(
        "rounded-md border px-4 py-3",
        toneStyles[tone],
        className,
      )}
      role={tone === "danger" ? "alert" : "status"}
    >
      {title ? (
        <p className="text-label uppercase text-ink-500">{title}</p>
      ) : null}
      <div className={cn("text-body-sm text-ink-700", title && "mt-2")}>{children}</div>
    </div>
  );
}
