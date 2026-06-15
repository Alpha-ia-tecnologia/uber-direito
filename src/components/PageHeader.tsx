import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  to?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  meta,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-7", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Caminho" className="mb-3 flex items-center gap-1 text-[0.8rem] text-muted">
          {breadcrumbs.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              {c.to ? (
                <Link to={c.to} className="hover:text-navy-700 transition-colors">{c.label}</Link>
              ) : (
                <span className="text-ink-soft font-medium">{c.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <ChevronRight className="size-3.5 text-faint" />}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[1.7rem] sm:text-[2rem] leading-tight text-navy-900 text-balance">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-[0.95rem] text-muted text-pretty">{description}</p>}
          {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
