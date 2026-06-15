import type { ReactNode } from "react";
import { Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/** Wraps AI-generated content with a clear, auditable label (Princípio 3 / RNF-10). */
export function AINotice({
  children,
  title = "Gerado por agente de IA",
  sources,
  className,
}: {
  children?: ReactNode;
  title?: string;
  sources?: string[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-navy-200 bg-navy-50/70 px-4 py-3", className)}>
      <div className="flex items-center gap-2 text-navy-700">
        <Sparkles className="size-4" strokeWidth={2} />
        <span className="text-[0.8rem] font-semibold tracking-tight">{title}</span>
      </div>
      {children && <div className="mt-1.5 text-[0.84rem] text-ink-soft">{children}</div>}
      {sources && sources.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[0.74rem] text-muted">
          <Info className="size-3" />
          <span className="font-medium">Fontes:</span>
          {sources.map((s) => (
            <span key={s} className="rounded bg-surface px-1.5 py-0.5 border border-line font-mono text-[0.7rem]">
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function AIBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-navy-700 px-2 py-0.5 text-[0.68rem] font-semibold text-white">
      <Sparkles className="size-2.5" strokeWidth={2.5} /> IA
    </span>
  );
}
