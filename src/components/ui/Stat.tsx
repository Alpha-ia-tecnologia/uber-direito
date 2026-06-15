import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Stat({
  label,
  value,
  hint,
  icon,
  trend,
  goal,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  trend?: { dir: "up" | "down"; value: string };
  goal?: { met: boolean; text: string };
  className?: string;
}) {
  return (
    <div className={cn("bg-surface border border-line rounded-xl p-4 shadow-xs", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.8rem] font-medium text-muted">{label}</span>
        {icon && <span className="text-navy-400">{icon}</span>}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="font-serif text-[1.85rem] leading-none text-navy-900 tabular-nums">{value}</span>
        {trend && (
          <span
            className={cn(
              "mb-0.5 text-[0.78rem] font-semibold",
              trend.dir === "up" ? "text-success-ink" : "text-danger-ink",
            )}
          >
            {trend.dir === "up" ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-[0.78rem] text-faint">{hint}</p>}
      {goal && (
        <p
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-[0.74rem] font-medium",
            goal.met ? "text-success-ink" : "text-warning-ink",
          )}
        >
          <span className={cn("size-1.5 rounded-full", goal.met ? "bg-success" : "bg-warning")} />
          {goal.text}
        </p>
      )}
    </div>
  );
}
