import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center px-6 py-14", className)}>
      {icon && (
        <span className="grid size-14 place-items-center rounded-2xl bg-navy-50 text-navy-400 mb-4">
          {icon}
        </span>
      )}
      <h3 className="text-[1.05rem] text-navy-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-[0.88rem] text-muted text-pretty">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-md", className)} />;
}

export function Divider({ label, className }: { label?: string; className?: string }) {
  if (!label) return <hr className={cn("border-line", className)} />;
  return (
    <div className={cn("flex items-center gap-3 text-faint", className)}>
      <hr className="flex-1 border-line" />
      <span className="text-[0.74rem] font-medium uppercase tracking-wider">{label}</span>
      <hr className="flex-1 border-line" />
    </div>
  );
}

export function KeyValue({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[0.74rem] font-medium uppercase tracking-wide text-faint">{label}</dt>
      <dd className="text-[0.9rem] text-ink">{children}</dd>
    </div>
  );
}

export function SectionTitle({
  children,
  description,
  action,
  className,
}: {
  children: ReactNode;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3 mb-4", className)}>
      <div>
        <h2 className="text-[1.3rem] text-navy-900">{children}</h2>
        {description && <p className="mt-1 text-[0.9rem] text-muted max-w-prose">{description}</p>}
      </div>
      {action}
    </div>
  );
}
