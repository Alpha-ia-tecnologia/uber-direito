import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone =
  | "neutral"
  | "navy"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brass";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-soft border-line",
  navy: "bg-navy-50 text-navy-700 border-navy-100",
  accent: "bg-bordo-50 text-bordo-700 border-bordo-100",
  success: "bg-success-soft text-success-ink border-success/20",
  warning: "bg-warning-soft text-warning-ink border-warning/25",
  danger: "bg-danger-soft text-danger-ink border-danger/20",
  info: "bg-info-soft text-info-ink border-info/20",
  brass: "bg-brass-300/25 text-[oklch(0.48_0.09_72)] border-brass-400/40",
};

export function Badge({
  children,
  tone = "neutral",
  icon,
  dot,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.74rem] font-semibold tracking-tight",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current opacity-80" aria-hidden />}
      {icon}
      {children}
    </span>
  );
}
