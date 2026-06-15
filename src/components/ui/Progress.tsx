import { cn } from "@/lib/utils";

export function Progress({
  value,
  tone = "navy",
  className,
  showLabel,
}: {
  value: number; // 0–100
  tone?: "navy" | "accent" | "success" | "warning";
  className?: string;
  showLabel?: boolean;
}) {
  const toneCls = {
    navy: "bg-navy-700",
    accent: "bg-bordo-600",
    success: "bg-success",
    warning: "bg-warning",
  }[tone];
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-100" role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100}>
        <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out", toneCls)} style={{ width: `${v}%` }} />
      </div>
      {showLabel && <span className="text-[0.78rem] font-semibold text-ink-soft tabular-nums w-10 text-right">{Math.round(v)}%</span>}
    </div>
  );
}
