import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-32 w-full rounded-button border border-app-line bg-white px-3 py-2.5 text-body-sm text-ink placeholder:text-ink-soft",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
