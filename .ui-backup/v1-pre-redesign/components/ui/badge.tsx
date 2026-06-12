import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "warning" | "danger" | "success" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
}

const styles: Record<BadgeVariant, string> = {
  default: "bg-app-subtle text-ink-soft border border-app-line",
  accent: "bg-app-mint text-app-teal-deep border border-app-line",
  warning: "bg-app-gold-soft text-app-gold border border-[#ead3a7]",
  danger: "bg-app-coral-soft text-app-coral border border-[#e6c3ba]",
  success: "bg-[#e2efe7] text-app-success border border-[#c9e0d2]",
  outline: "bg-white text-ink-soft border border-app-line-strong",
};

export function Badge({ className, children, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-badge px-2.5 py-1 font-mono text-micro uppercase",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
