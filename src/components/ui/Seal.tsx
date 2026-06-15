import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lawyer } from "@/data/types";

const sealStyle: Record<Exclude<Lawyer["seal"], "nenhum">, { label: string; cls: string }> = {
  ouro: { label: "Credibilidade Ouro", cls: "bg-brass-300/25 text-[oklch(0.46_0.10_70)] border-brass-400/50" },
  prata: { label: "Credibilidade Prata", cls: "bg-navy-100 text-navy-700 border-navy-200" },
  bronze: { label: "Credibilidade Bronze", cls: "bg-bordo-50 text-bordo-700 border-bordo-200" },
};

export function Seal({ seal, compact }: { seal: Lawyer["seal"]; compact?: boolean }) {
  if (seal === "nenhum") return null;
  const s = sealStyle[seal];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-tight",
        compact ? "px-2 py-0.5 text-[0.7rem]" : "px-2.5 py-1 text-[0.76rem]",
        s.cls,
      )}
      title="Selo baseado exclusivamente em histórico validado via DataJud/CNJ"
    >
      <ShieldCheck className={compact ? "size-3" : "size-3.5"} strokeWidth={2} />
      {compact ? seal.charAt(0).toUpperCase() + seal.slice(1) : s.label}
    </span>
  );
}
