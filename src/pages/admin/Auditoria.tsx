import { useState } from "react";
import { Download, BadgeCheck, Trash2, Gavel, Sparkles, ShieldCheck, UserCog } from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime, cn } from "@/lib/utils";
import type { AuditEntry } from "@/data/types";

const catMeta: Record<AuditEntry["category"], { icon: React.ReactNode; tone: string }> = {
  "validação": { icon: <BadgeCheck className="size-4" />, tone: "bg-success-soft text-success-ink" },
  "exclusão": { icon: <Trash2 className="size-4" />, tone: "bg-danger-soft text-danger-ink" },
  "mediação": { icon: <Gavel className="size-4" />, tone: "bg-warning-soft text-warning-ink" },
  "revisão-IA": { icon: <Sparkles className="size-4" />, tone: "bg-navy-50 text-navy-700" },
  "papéis": { icon: <UserCog className="size-4" />, tone: "bg-info-soft text-info-ink" },
};

const categories = ["todas", "validação", "exclusão", "mediação", "revisão-IA", "papéis"] as const;

export function Auditoria() {
  const { toast } = useApp();
  const { auditLog } = useAdmin();
  const [filter, setFilter] = useState<(typeof categories)[number]>("todas");
  const shown = auditLog.filter((a) => filter === "todas" || a.category === filter);

  return (
    <>
      <PageHeader
        title="Trilha de auditoria"
        description="Registro imutável das ações administrativas sensíveis: validação, exclusão, mediação e revisão de IA (RF-68)."
        breadcrumbs={[{ label: "Comitê Gestor", to: "/admin" }, { label: "Auditoria" }]}
        meta={<Badge tone="success" icon={<ShieldCheck className="size-3.5" />}>{auditLog.length} eventos registrados</Badge>}
        actions={<Button variant="outline" iconLeft={<Download className="size-4" />} onClick={() => toast("Trilha de auditoria exportada.")}>Exportar</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={cn("rounded-full px-3.5 py-1.5 text-[0.82rem] font-medium capitalize transition-colors", filter === c ? "bg-navy-700 text-white" : "bg-surface border border-line text-ink-soft hover:border-navy-300")}>
            {c === "todas" ? "Todas" : c}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <ol className="relative">
          {shown.map((a, i) => {
            const meta = catMeta[a.category];
            return (
              <li key={a.id} className={cn("flex gap-4 px-5 py-4", i < shown.length - 1 && "border-b border-line")}>
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", meta.tone)}>{meta.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.9rem] text-navy-900">
                    <strong className="font-semibold">{a.actor}</strong> · {a.action}
                  </p>
                  <p className="text-[0.84rem] text-muted">{a.target}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone="neutral" className="capitalize">{a.category}</Badge>
                    <span className="text-[0.76rem] text-faint">{formatDateTime(a.at)}</span>
                  </div>
                </div>
                <span className="hidden font-mono text-[0.7rem] text-faint sm:block">#{a.id}</span>
              </li>
            );
          })}
        </ol>
      </Card>
    </>
  );
}
