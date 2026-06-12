import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => (
    <label className="filter-checkbox">
      <input ref={ref} type="checkbox" className={cn("", className)} {...props} />
      {label ? <span>{label}</span> : null}
    </label>
  ),
);

Checkbox.displayName = "Checkbox";
