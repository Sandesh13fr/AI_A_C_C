import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-button border border-app-line bg-white px-3 py-2.5 text-body-sm text-ink placeholder:text-ink-soft",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
