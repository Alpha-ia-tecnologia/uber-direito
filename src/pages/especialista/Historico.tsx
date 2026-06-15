import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck2,
  Upload,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Lock,
  Info,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { AINotice } from "@/components/ui/AINotice";
import { EmptyState } from "@/components/ui/Misc";
import { Field, Input } from "@/components/ui/Field";
import { StatusBadge } from "@/components/StatusBadge";
import { Seal } from "@/components/ui/Seal";
import { historyStatusMeta } from "@/lib/status";

export function Historico() {
  const { user, toast } = useApp();
  const [validating, setValidating] = useState(false);
  const [validatedAt, setValidatedAt] = useState<string | null>("há 2 dias");
  const isSpecialist = user.roles.includes("especialista") || user.roles.includes("parceiro");

  function revalidate() {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidatedAt("agora");
      toast("Histórico revalidado junto ao DataJud/CNJ.");
    }, 2600);
  }

  if (!isSpecialist) {
    return (
      <>
        <PageHeader title="Histórico de atuação" breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Histórico" }]} />
        <Card><EmptyState icon={<FileCheck2 className="size-7" />} title="Disponível para o perfil Especialista" description="Ative o papel de Especialista para importar e validar seu histórico de atuação." /></Card>
      </>
    );
  }

  const validatedCount = user.history.filter((h) => h.status === "validada").length;

  return (
    <>
      <PageHeader
        title="Histórico de atuação"
        description="Importe e valide seu histórico no DataJud/CNJ. Os indicadores validados geram seu selo de credibilidade."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Histórico" }]}
        meta={<><Seal seal={user.seal} /><Badge tone="success" icon={<ShieldCheck className="size-3.5" />}>{validatedCount} processos validados</Badge></>}
        actions={<Button variant="outline" loading={validating} iconLeft={!validating ? <RefreshCw className="size-4" /> : undefined} onClick={revalidate}>{validating ? "Validando…" : "Revalidar no DataJud"}</Button>}
      />

      {/* validating banner */}
      <AnimatePresence>
        {validating && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-5 overflow-hidden">
            <Card className="border-navy-200 bg-navy-50/70 p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="size-5 animate-spin text-navy-600" />
                <div className="flex-1">
                  <p className="text-[0.88rem] font-semibold text-navy-900">Consultando a API DataJud do CNJ…</p>
                  <p className="text-[0.8rem] text-muted">Confrontando os processos informados com os registros públicos.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          {/* Import */}
          <Card>
            <CardHeader icon={<Upload className="size-5" />} title="Importar histórico" subtitle="Por número de processo (CNJ) ou upload de documentos (RF-09)" />
            <CardBody className="space-y-3 pt-0">
              <div className="flex items-end gap-2">
                <Field label="Número do processo (CNJ)" className="flex-1"><Input placeholder="0000000-00.0000.0.00.0000" className="font-mono" /></Field>
                <Button className="shrink-0" iconLeft={<Plus className="size-4" />} onClick={() => toast("Processo adicionado à fila de validação.")}>Adicionar</Button>
              </div>
              <button onClick={() => toast("Documentos enviados para análise.")} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong bg-surface-2/40 py-5 text-[0.85rem] text-muted transition-colors hover:border-navy-400 hover:text-navy-700">
                <Upload className="size-4.5" /> Enviar documentos (PDF) do seu histórico
              </button>
            </CardBody>
          </Card>

          {/* Processes list */}
          <Card>
            <CardHeader title="Processos no seu histórico" subtitle={validatedAt ? `Última validação ${validatedAt}` : undefined} />
            <CardBody className="pt-0">
              <ul className="divide-y divide-line">
                {user.history.map((h) => (
                  <li key={h.id} className="flex flex-wrap items-center gap-3 py-3.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-600">{h.sealed ? <Lock className="size-4.5" /> : <FileCheck2 className="size-4.5" />}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[0.82rem] text-navy-900">{h.sealed ? "Processo sob segredo de justiça" : h.processNumber}</p>
                      <p className="text-[0.78rem] text-muted">{h.area} · {h.source} · {h.year}</p>
                    </div>
                    {h.outcome === "exitoso" && !h.sealed && <Badge tone="success">Exitoso</Badge>}
                    <StatusBadge meta={historyStatusMeta[h.status]} />
                  </li>
                ))}
              </ul>
              {user.history.some((h) => h.sealed) && (
                <p className="mt-3 flex items-center gap-1.5 text-[0.78rem] text-muted"><Info className="size-3.5" /> Processos sob segredo de justiça contam para os indicadores, mas não são expostos.</p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Side */}
        <div className="space-y-5">
          <Card>
            <CardHeader icon={<Sparkles className="size-5" />} title="Indicadores consolidados pela IA" subtitle="Ações exitosas por área (RF-11)" />
            <CardBody className="pt-0">
              <AINotice className="mb-4" sources={["DataJud/CNJ", "Tribunais oficiais"]}>
                A IA consolidou seu histórico validado em indicadores por área.
              </AINotice>
              <div className="space-y-4">
                {user.indicators.map((ind) => (
                  <div key={ind.area}>
                    <div className="mb-1.5 flex items-center justify-between text-[0.85rem]">
                      <span className="font-medium text-navy-900">{ind.area}</span>
                      <span className="text-muted">{ind.successfulActions}/{ind.totalProcesses}</span>
                    </div>
                    <Progress value={(ind.successfulActions / ind.totalProcesses) * 100} tone="success" showLabel />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <Seal seal={user.seal} />
                <span className="text-[0.84rem] text-muted">Selo baseado só em dados validados.</span>
              </div>
              <ul className="mt-4 space-y-2 text-[0.84rem] text-ink-soft">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> Visível no seu perfil e no matching.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> Divergências passam por revisão humana do Comitê (RF-14).</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> Nunca expomos dados sob sigilo.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
