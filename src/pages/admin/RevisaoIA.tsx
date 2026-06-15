import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, X, TriangleAlert, FileText, Info } from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { lawyerById } from "@/data/lawyers";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import { AINotice } from "@/components/ui/AINotice";
import { EmptyState } from "@/components/ui/Misc";
import { cn } from "@/lib/utils";

export function RevisaoIA() {
  const { toast } = useApp();
  const { aiReviewQueue, logAudit } = useAdmin();
  const [decided, setDecided] = useState<Record<string, "aprovado" | "rejeitado">>({});

  function decide(id: string, v: "aprovado" | "rejeitado") {
    setDecided((d) => ({ ...d, [id]: v }));
    const item = aiReviewQueue.find((q) => q.id === id);
    logAudit({
      actor: "Comitê Gestor",
      action: v === "aprovado" ? "Aprovou indicador após revisão de IA" : "Manteve divergência sinalizada pela IA",
      target: item ? `Processo ${item.processNumber}` : id,
      category: "revisão-IA",
    });
    toast(v === "aprovado" ? "Indicador aprovado e publicado no perfil." : "Sinalização mantida — indicador não publicado.");
  }

  const open = aiReviewQueue.filter((q) => !decided[q.id]);

  return (
    <>
      <PageHeader
        title="Revisão de IA"
        description="Casos sinalizados pelo agente de IA como divergentes antes da publicação no perfil (RF-14)."
        breadcrumbs={[{ label: "Comitê Gestor", to: "/admin" }, { label: "Revisão de IA" }]}
        meta={<Badge tone="warning" icon={<TriangleAlert className="size-3.5" />}>{open.length} sinalizações</Badge>}
      />

      <AINotice className="mb-5" title="IA responsável e auditável" sources={["DataJud/CNJ", "Movimentações processuais"]}>
        A IA apenas sinaliza divergências e registra as fontes. A decisão final é humana — sob supervisão do Comitê (RNF-10).
      </AINotice>

      {open.length === 0 ? (
        <Card><EmptyState icon={<Sparkles className="size-7" />} title="Nenhuma sinalização pendente" /></Card>
      ) : (
        <div className="space-y-4">
          {aiReviewQueue.map((q, i) => {
            const l = lawyerById(q.lawyerId);
            const state = decided[q.id];
            return (
              <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className={cn("overflow-hidden", state && "opacity-60")}>
                  <CardBody>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={l?.name ?? "?"} size="md" />
                        <div>
                          <p className="text-[0.98rem] font-semibold text-navy-900">{l?.name}</p>
                          <p className="font-mono text-[0.78rem] text-muted">{q.processNumber}</p>
                        </div>
                      </div>
                      <Badge tone="navy">{q.area}</Badge>
                    </div>

                    <div className="mt-4 rounded-xl border border-warning/30 bg-warning-soft/50 p-3.5">
                      <p className="flex items-center gap-2 text-[0.84rem] font-semibold text-warning-ink"><TriangleAlert className="size-4" /> Divergência sinalizada</p>
                      <p className="mt-1 text-[0.86rem] text-ink-soft">{q.issue}</p>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1.5 text-[0.72rem] uppercase tracking-wide text-faint">Confiança da IA</p>
                        <Progress value={q.aiConfidence * 100} tone={q.aiConfidence > 0.7 ? "warning" : "navy"} showLabel />
                      </div>
                      <div>
                        <p className="mb-1.5 text-[0.72rem] uppercase tracking-wide text-faint">Fontes consultadas</p>
                        <ul className="space-y-1">
                          {q.sources.map((s) => <li key={s} className="flex items-center gap-1.5 text-[0.8rem] text-ink-soft"><FileText className="size-3.5 text-navy-400" /> {s}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                      {state === "aprovado" ? (
                        <Badge tone="success" icon={<Check className="size-3.5" />}>Aprovado e publicado</Badge>
                      ) : state === "rejeitado" ? (
                        <Badge tone="danger" icon={<X className="size-3.5" />}>Mantido como divergente</Badge>
                      ) : (
                        <>
                          <Button size="sm" iconLeft={<Check className="size-4" />} onClick={() => decide(q.id, "aprovado")}>Aprovar indicador</Button>
                          <Button size="sm" variant="outline" iconLeft={<X className="size-4" />} onClick={() => decide(q.id, "rejeitado")}>Manter divergência</Button>
                          <span className="ml-auto inline-flex items-center gap-1 text-[0.76rem] text-faint"><Info className="size-3.5" /> Ação registrada na auditoria</span>
                        </>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}
