import { cn } from "@/lib/utils";

/** Scales-of-justice brand mark. `onDark` switches strokes to paper. */
export function LogoMark({ className, onDark }: { className?: string; onDark?: boolean }) {
  const stroke = onDark ? "oklch(0.95 0.01 90)" : "oklch(0.32 0.07 262)";
  const pan = onDark ? "oklch(0.46 0.158 26)" : "oklch(0.46 0.158 26)";
  const dot = "oklch(0.60 0.10 78)";
  return (
    <svg viewBox="0 0 64 64" className={cn("size-8", className)} fill="none" aria-hidden>
      <g stroke={stroke} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 14v36" />
        <path d="M20 50h24" />
        <path d="M16 22h32" />
      </g>
      <path d="M16 22l-6 12h12z" fill={pan} />
      <path d="M48 22l-6 12h12z" fill={pan} />
      <g stroke={stroke} strokeWidth={2.6} strokeLinejoin="round">
        <path d="M16 22l-6 12h12z" />
        <path d="M48 22l-6 12h12z" />
      </g>
      <circle cx="32" cy="13.5" r="3.2" fill={dot} />
    </svg>
  );
}

export function Logo({ onDark, compact }: { onDark?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <LogoMark onDark={onDark} className="size-8" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-serif text-[1.05rem] font-semibold tracking-tight", onDark ? "text-white" : "text-navy-900")}>
            Uber dos Advogados
          </span>
          <span className={cn("text-[0.66rem] font-medium tracking-wide", onDark ? "text-navy-200" : "text-muted")}>
            Advocacia que se conecta
          </span>
        </span>
      )}
    </span>
  );
}
