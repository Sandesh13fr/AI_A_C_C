import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "sign-off";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-teal text-white hover:opacity-90 border border-transparent focus:ring-2 focus:ring-teal/50",
  secondary:
    "border border-teal text-teal hover:bg-teal hover:text-white focus:ring-2 focus:ring-teal/50",
  ghost:
    "text-mid-grey hover:text-white border border-transparent focus:ring-2 focus:ring-white/20",
  destructive:
    "bg-[#D92D20] text-white hover:opacity-90 border border-transparent focus:ring-2 focus:ring-[#D92D20]/50",
  "sign-off":
    "bg-teal text-white hover:opacity-90 border border-transparent font-semibold focus:ring-2 focus:ring-teal/50",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-body-sm",
  md: "px-5 py-2.5 text-body-sm",
  lg: "px-6 py-3 text-body",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={`inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-150 focus:outline-none disabled:pointer-events-none disabled:opacity-40 ${variantStyles[variant]} ${sizeStyles[size]} ${className ?? ""}`}
        {...props}
      >
        {loading && (
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
