import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Check, X, ArrowRight, CircleAlert } from "lucide-react";
import { useApp } from "@/store/app-context";
import { matches, demands, services } from "@/data/mock";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Misc";
import { AINotice } from "@/components/ui/AINotice";
import { StatusBadge } from "@/components/StatusBadge";
import { urgencyMeta, supportTypeLabel } from "@/lib/status";
import { timeAgo, cn } from "@/lib/utils";
import type { Demand } from "@/data/types";

interface Opp {
  demand: Demand;
  score: number;
  reasons: string[];
  status: "aceito" | "notificado";
}

export function Oportunidades() {
  const { user, toast } = useApp();

  const base: Opp[] = matches
    .flatMap((m) => m.candidates.filter((c) => c.lawyerId === user.id).map((c) => ({ ...c, demandId: m.demandId })))
    .map((c) => ({ demand: demands.find((d) => d.id === c.demandId)!, score: c.score, reasons: c.reasons, status: c.status === "aceito" ? "aceito" : "notificado" }))
    .filter((o) => o.demand) as Opp[];

  // a synthetic incoming opportunity (Trabalho) to demonstrate accept/decline for the specialist
  const incoming: Opp[] =
    user.id === "l-rogerio"
      ? [
          {
            demand: {
              id: "dem-099",
              code: "DEM-2026-027",
              authorId: "l-pedro",
              title: "Reconhecimento de vínculo de motorista de aplicativo",
              area: "Direito do Trabalho",
              description: "Iniciante busca apoio para tese de vínculo empregatício em plataforma digital, com pedido de verbas.",
              urgency: "media",
              supportType: "parceria",
              status: "publicada",
              createdAt: "2026-06-12T20:00:00",
              documents: [],
            },
            score: 89,
            reasons: ["Especialista em reconhecimento de vínculo", "Histórico validado na área", "Aberto a parceria 50/50"],
            status: "notificado",
          },
        ]
      : [];

  const all = [...incoming, ...base];
  const [decided, setDecided] = useState<Record<string, "aceito" | "recusado">>({});

  function decide(id: string, v: "aceito" | "recusado") {
    setDecided((d) => ({ ...d, [id]: v }));
    toast(v === "aceito" ? "Demanda aceita! O atendimento foi iniciado." : "Demanda recusada. Obrigado pelo retorno.");
  }

  return (
    <>
      <PageHeader
        title="Oportunidades"
        description="Demandas compatíveis com sua atuação. Aceite ou recuse — você está no controle."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Oportunidades" }]}
        meta={<Badge tone="navy" icon={<Search className="size-3.5" />}>{all.length} compatíveis</Badge>}
      />

      <AINotice className="mb-5" title="Matching automatizado" sources={["Área e especialidade", "Histórico validado", "Avaliação média"]}>
        Ordenadas por compatibilidade com seu perfil. Conflitos de interesse declarados são bloqueados automaticamente.
      </AINotice>

      {all.length === 0 ? (
        <Card><EmptyState icon={<Search className="size-7" />} title="Nenhuma oportunidade agora" description="Assim que surgir uma demanda compatível, ela aparece aqui." /></Card>
      ) : (
        <div className="space-y-4">
          {all.sort((a, b) => b.score - a.score).map((o, i) => {
            const state = decided[o.demand.id] ?? (o.status === "aceito" ? "aceito" : undefined);
            const svc = services.find((s) => s.demandId === o.demand.id);
            return (
              <motion.div key={o.demand.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Card className={cn("overflow-hidden", state === "aceito" && "ring-1 ring-success/40", state === "recusado" && "opacity-60")}>
                  <div className="flex flex-col gap-4 p-5 sm:flex-row">
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-center">
                      <div className={cn("grid size-16 place-items-center rounded-2xl text-white shadow-sm", o.score >= 90 ? "bg-bordo-600" : "bg-navy-700")}>
                        <span className="font-serif text-[1.4rem] font-semibold leading-none">{o.score}</span>
                      </div>
                      <span className="text-[0.66rem] font-semibold uppercase tracking-wide text-muted">compatível</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[0.74rem] text-muted">{o.demand.code}</span>
                        <StatusBadge meta={urgencyMeta[o.demand.urgency]} />
                        <Badge tone="navy">{o.demand.area}</Badge>
                        <Badge tone="neutral">{supportTypeLabel[o.demand.supportType]}</Badge>
                      </div>
                      <h3 className="mt-2 text-[1.1rem] text-navy-900">{o.demand.title}</h3>
                      <p className="mt-1 text-[0.88rem] text-muted text-pretty">{o.demand.description}</p>
                      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                        {o.reasons.map((r) => <li key={r} className="flex items-start gap-2 text-[0.83rem] text-ink-soft"><ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />{r}</li>)}
                      </ul>
                      <p className="mt-2 text-[0.76rem] text-faint">Recebida {timeAgo(o.demand.createdAt)}</p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:w-44 sm:justify-center">
                      {state === "aceito" ? (
                        <>
                          <Badge tone="success" icon={<Check className="size-3.5" />} className="justify-center py-1.5">Você aceitou</Badge>
                          <Link to={svc ? `/app/atendimento/${svc.id}` : "/app/atendimentos"}><Button full size="sm" iconRight={<ArrowRight className="size-3.5" />}>Ir ao atendimento</Button></Link>
                        </>
                      ) : state === "recusado" ? (
                        <Badge tone="neutral" icon={<X className="size-3.5" />} className="justify-center py-1.5">Recusada</Badge>
                      ) : (
                        <>
                          <Button full size="sm" iconLeft={<Check className="size-4" />} onClick={() => decide(o.demand.id, "aceito")}>Aceitar</Button>
                          <Button full size="sm" variant="outline" iconLeft={<X className="size-4" />} onClick={() => decide(o.demand.id, "recusado")}>Recusar</Button>
                          <Link to={`/app/demandas/${o.demand.id}`} className="text-center text-[0.78rem] font-medium text-navy-600 hover:text-navy-800">Ver detalhes</Link>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.78rem] text-faint">
        <CircleAlert className="size-3.5" /> Demandas com conflito de interesse declarado não aparecem para você.
      </p>
    </>
  );
}
