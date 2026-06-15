import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Briefcase, Paperclip, Sparkles, Search } from "lucide-react";
import { useApp } from "@/store/app-context";
import { demands } from "@/data/mock";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Misc";
import { Input } from "@/components/ui/Field";
import { StatusBadge } from "@/components/StatusBadge";
import { demandStatusMeta, urgencyMeta, supportTypeLabel } from "@/lib/status";
import { timeAgo, cn } from "@/lib/utils";
import type { DemandStatus } from "@/data/types";

const filters: { id: DemandStatus | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "publicada", label: "Publicadas" },
  { id: "em_matching", label: "Em matching" },
  { id: "em_atendimento", label: "Em atendimento" },
  { id: "concluida", label: "Concluídas" },
];

export function Demandas() {
  const { user } = useApp();
  const [filter, setFilter] = useState<DemandStatus | "todas">("todas");
  const [q, setQ] = useState("");

  const mine = useMemo(() => demands.filter((d) => d.authorId === user.id), [user.id]);
  const shown = mine.filter(
    (d) => (filter === "todas" || d.status === filter) && (q === "" || d.title.toLowerCase().includes(q.toLowerCase()) || d.code.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <PageHeader
        title="Minhas demandas"
        description="Acompanhe o status de cada caso, do diagnóstico à conclusão."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Minhas demandas" }]}
        actions={<Link to="/app/demandas/nova"><Button iconLeft={<Plus className="size-4" />}>Nova demanda</Button></Link>}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[0.82rem] font-medium transition-colors",
                filter === f.id ? "bg-navy-700 text-white" : "bg-surface border border-line text-ink-soft hover:border-navy-300",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar demanda…" className="h-10 pl-9 text-[0.85rem]" />
        </div>
      </div>

      {shown.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Briefcase className="size-7" />}
            title="Nenhuma demanda por aqui"
            description="Comece pelo diagnóstico com IA para gerar um briefing e publicar sua primeira demanda."
            action={<Link to="/app/diagnostico"><Button variant="accent" iconLeft={<Sparkles className="size-4" />}>Iniciar diagnóstico</Button></Link>}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {shown.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/app/demandas/${d.id}`}>
                <Card className="p-5 transition-all hover:border-navy-300 hover:shadow-md">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[0.76rem] text-muted">{d.code}</span>
                        <StatusBadge meta={demandStatusMeta[d.status]} />
                      </div>
                      <h3 className="mt-2 text-[1.08rem] text-navy-900">{d.title}</h3>
                      <p className="mt-1 text-[0.88rem] text-muted line-clamp-1 text-pretty">{d.description}</p>
                    </div>
                    <StatusBadge meta={urgencyMeta[d.urgency]} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3 text-[0.8rem] text-muted">
                    <Badge tone="navy">{d.area}</Badge>
                    <Badge tone="neutral">{supportTypeLabel[d.supportType]}</Badge>
                    {d.documents.length > 0 && <span className="inline-flex items-center gap-1"><Paperclip className="size-3.5" /> {d.documents.length} anexos</span>}
                    {d.diagnosis && <span className="inline-flex items-center gap-1 text-navy-600"><Sparkles className="size-3.5" /> com diagnóstico</span>}
                    <span className="ml-auto">{timeAgo(d.createdAt)}</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
