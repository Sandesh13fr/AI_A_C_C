import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, hasError, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("form-select", hasError && "form-input--error", className)}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";
