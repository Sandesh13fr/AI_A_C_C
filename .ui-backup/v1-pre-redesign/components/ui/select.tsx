import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("w-full rounded-button border border-app-line bg-white px-3 py-2.5 text-body-sm text-ink", className)}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";
