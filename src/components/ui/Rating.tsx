import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = 16,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} aria-label={`Avaliação ${value.toFixed(1)} de 5`}>
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-line-strong" style={{ width: size, height: size }} strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star
                  className="text-brass-500 fill-brass-400"
                  style={{ width: size, height: size }}
                  strokeWidth={1.5}
                />
              </span>
            </span>
          );
        })}
      </span>
      <span className="text-[0.85rem] font-semibold text-ink tabular-nums">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-[0.8rem] text-muted">({count})</span>}
    </span>
  );
}

/** Interactive 1–5 star input. */
export function RatingInput({
  value,
  onChange,
  label,
  size = 28,
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div>
      {label && <span className="block text-[0.82rem] font-medium text-ink-soft mb-1.5">{label}</span>}
      <div className="inline-flex items-center gap-1" role="radiogroup" aria-label={label ?? "Nota"}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-bordo-500"
          >
            <Star
              style={{ width: size, height: size }}
              strokeWidth={1.5}
              className={cn(
                "transition-colors",
                n <= shown ? "text-brass-500 fill-brass-400" : "text-line-strong",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
