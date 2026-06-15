import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Check, X, ExternalLink, ShieldCheck, FileCheck2, Clock } from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/Misc";
import { formatDateTime, cn } from "@/lib/utils";

export function Validacoes() {
  const { toast } = useApp();
  const { validationQueue, lawyers, setLawyerStatus } = useAdmin();
  const [decided, setDecided] = useState<Record<string, "validado" | "rejeitado">>({});

  function decide(id: string, v: "validado" | "rejeitado", name: string) {
    setDecided((d) => ({ ...d, [id]: v }));
    setLawyerStatus(id, v);
    toast(v === "validado" ? `Cadastro de ${name} validado e ativado.` : `Cadastro de ${name} rejeitado.`);
  }

  const pending = validationQueue.filter((q) => !decided[q.lawyerId]);

  return (
    <>
      <PageHeader
        title="Validações"
        description="Confira a inscrição na OAB e o histórico antes de ativar contas e publicar indicadores."
        breadcrumbs={[{ label: "Comitê Gestor", to: "/admin" }, { label: "Validações" }]}
        meta={<Badge tone="warning" icon={<Clock className="size-3.5" />}>{pending.length} pendentes</Badge>}
      />

      {pending.length === 0 ? (
        <Card><EmptyState icon={<BadgeCheck className="size-7" />} title="Fila vazia" description="Nenhuma validação pendente no momento." /></Card>
      ) : (
        <div className="space-y-4">
          {validationQueue.map((q, idx) => {
            const l = lawyers.find((x) => x.id === q.lawyerId);
            if (!l) return null;
            const state = decided[q.lawyerId];
            return (
              <motion.div key={q.lawyerId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
                <Card className={cn(state && "opacity-60")}>
                  <CardBody>
                    <div className="flex flex-wrap items-start gap-4">
                      <Avatar name={l.name} size="lg" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[1.05rem] text-navy-900">{l.name}</h3>
                          <Badge tone={q.type === "cadastro" ? "info" : "navy"} icon={q.type === "cadastro" ? <BadgeCheck className="size-3" /> : <FileCheck2 className="size-3" />}>
                            {q.type === "cadastro" ? "Validação de cadastro" : "Validação de histórico"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-[0.84rem] text-muted">OAB {q.oab} · {q.seccional} · enviado em {formatDateTime(q.submittedAt)}</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                          <Mini label="E-mail" value={l.email} />
                          <Mini label="Registro OAB" value={new Date(l.oabRegisteredAt).toLocaleDateString("pt-BR")} />
                          <Mini label="Áreas" value={l.areas.join(", ") || "—"} />
                          <Mini label="Elegível" value={l.initiateEligible ? "Iniciante" : "Especialista"} />
                        </div>
                        {q.type === "historico" && l.history.some((h) => h.status === "divergente") && (
                          <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-warning-soft px-2.5 py-1 text-[0.78rem] text-warning-ink"><ShieldCheck className="size-3.5" /> 1 processo sinalizado como divergente pela IA — requer revisão.</p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                        {state === "validado" ? (
                          <Badge tone="success" icon={<Check className="size-3.5" />} className="justify-center py-1.5">Validado</Badge>
                        ) : state === "rejeitado" ? (
                          <Badge tone="danger" icon={<X className="size-3.5" />} className="justify-center py-1.5">Rejeitado</Badge>
                        ) : (
                          <>
                            <Button full size="sm" iconLeft={<Check className="size-4" />} onClick={() => decide(q.lawyerId, "validado", l.name.split(" ")[0])}>Validar</Button>
                            <Button full size="sm" variant="outline" iconLeft={<X className="size-4" />} onClick={() => decide(q.lawyerId, "rejeitado", l.name.split(" ")[0])}>Rejeitar</Button>
                            <a href="https://www.oab.org.br" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 text-[0.78rem] font-medium text-navy-600 hover:text-navy-800"><ExternalLink className="size-3.5" /> Consultar OAB</a>
                          </>
                        )}
                      </div>
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

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface-2/40 px-3 py-2">
      <p className="text-[0.68rem] uppercase tracking-wide text-faint">{label}</p>
      <p className="truncate text-[0.82rem] text-ink">{value}</p>
    </div>
  );
}
