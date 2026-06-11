import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-app-teal text-white hover:bg-app-teal-deep",
  secondary: "border border-app-line-strong bg-white text-ink hover:border-app-teal hover:text-app-teal",
  ghost: "bg-app-subtle text-ink hover:bg-app-mint",
  destructive: "bg-app-coral text-white hover:opacity-95",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-2 text-body-sm",
  md: "px-4 py-2.5 text-body-sm",
  lg: "px-5 py-3 text-body-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", size = "md", disabled, loading, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled ?? loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-button font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading ? <span className="size-3 rounded-full border border-current border-r-transparent" aria-hidden="true" /> : null}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
