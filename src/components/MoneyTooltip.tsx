import { brl } from "@/lib/utils";

/** Recharts tooltip that formats numeric values as BRL. */
export function MoneyTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-md">
      {label && <p className="mb-1 text-[0.78rem] font-semibold text-navy-900">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-1.5 text-[0.78rem] text-ink-soft">
          <span className="size-2 rounded-full" style={{ background: p.color }} /> {p.name}: <strong className="text-navy-900">{brl(p.value)}</strong>
        </p>
      ))}
    </div>
  );
}

export const CHART = {
  navy: "oklch(0.396 0.078 261)",
  bordo: "oklch(0.532 0.158 26)",
  success: "oklch(0.524 0.108 158)",
  warning: "oklch(0.706 0.132 74)",
  info: "oklch(0.546 0.108 248)",
  pie: ["oklch(0.396 0.078 261)", "oklch(0.532 0.158 26)", "oklch(0.524 0.108 158)", "oklch(0.706 0.132 74)", "oklch(0.546 0.108 248)", "oklch(0.62 0.10 300)"],
};
