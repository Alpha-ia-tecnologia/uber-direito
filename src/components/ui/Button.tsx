import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "subtle" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  full?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-navy-800 text-white hover:bg-navy-900 active:bg-navy-950 shadow-[inset_0_1px_0_oklch(1_0_0_/0.10),var(--shadow-xs)] active:translate-y-px",
  accent:
    "bg-bordo-600 text-white hover:bg-bordo-700 active:bg-bordo-800 shadow-[inset_0_1px_0_oklch(1_0_0_/0.12),var(--shadow-xs)] active:translate-y-px",
  outline:
    "bg-surface text-navy-800 border border-line-strong hover:border-navy-400 hover:bg-navy-50/60 active:bg-navy-100/60",
  ghost: "bg-transparent text-navy-700 hover:bg-navy-50 active:bg-navy-100",
  subtle: "bg-navy-50 text-navy-800 hover:bg-navy-100 border border-navy-100 active:bg-navy-200/70",
  danger:
    "bg-danger text-white hover:brightness-95 active:brightness-90 shadow-[inset_0_1px_0_oklch(1_0_0_/0.10),var(--shadow-xs)] active:translate-y-px",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.82rem] gap-1.5 rounded-md",
  md: "h-11 px-5 text-[0.9rem] gap-2 rounded-lg",
  lg: "h-12 px-6 text-[0.95rem] gap-2.5 rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, iconLeft, iconRight, full, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-[background-color,box-shadow,border-color,transform,filter] duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordo-500",
        "disabled:opacity-55 disabled:pointer-events-none disabled:shadow-none select-none whitespace-nowrap",
        variants[variant],
        sizes[size],
        full && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        iconLeft
      )}
      {children}
      {!loading && iconRight}
    </button>
  );
});
