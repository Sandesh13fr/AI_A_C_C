import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: "btn btn--primary",
  secondary: "btn btn--secondary",
  ghost: "btn btn--ghost",
  danger: "btn btn--danger",
};

const sizeStyles: Record<Size, string> = {
  sm: "btn--sm",
  md: "",
  lg: "btn--lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, variant = "primary", size = "md", disabled, loading, leadingIcon, trailingIcon, type = "button", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled ?? loading}
      className={cn(variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {loading ? (
        <span
          className="inline-block size-3 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      ) : leadingIcon ? (
        <span className="inline-flex shrink-0 items-center" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      {children}
      {trailingIcon ? (
        <span className="inline-flex shrink-0 items-center" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  ),
);

Button.displayName = "Button";
