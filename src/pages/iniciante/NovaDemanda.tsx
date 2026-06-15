import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Upload, Lock, Send, FileText, X, Accessibility } from "lucide-react";
import { useApp } from "@/store/app-context";
import { marinaDiagnosis } from "@/data/mock";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field, Input, Textarea, Select, Toggle } from "@/components/ui/Field";
import { AINotice } from "@/components/ui/AINotice";
import { cn } from "@/lib/utils";
import type { LegalArea, SupportType, Urgency } from "@/data/types";

const areas: LegalArea[] = ["Direito do Trabalho", "Direito de Família", "Direito do Consumidor", "Direito Previdenciário", "Direito Penal", "Direito Civil", "Direito Empresarial", "Direito Tributário", "Direitos Humanos", "Direito Imobiliário"];

export function NovaDemanda() {
  const { toast } = useApp();
  const nav = useNavigate();
  const [useDiagnosis, setUseDiagnosis] = useState(true);
  const [title, setTitle] = useState("Rescisão indireta por atraso de salários");
  const [area, setArea] = useState<LegalArea>("Direito do Trabalho");
  const [description, setDescription] = useState(marinaDiagnosis.context);
  const [support, setSupport] = useState<SupportType>("humanizado");
  const [urgency, setUrgency] = useState<Urgency>("alta");
  const [priorityPCD, setPriorityPCD] = useState(false);
  const [files, setFiles] = useState<string[]>(["CTPS-cliente.pdf", "Holerites-jan-mai.pdf"]);
  const [submitting, setSubmitting] = useState(false);

  function publish() {
    setSubmitting(true);
    setTimeout(() => {
      toast("Demanda publicada. Iniciando o matching automatizado…");
      nav("/app/demandas/dem-001");
    }, 1100);
  }

  return (
    <>
      <PageHeader
        title="Publicar demanda"
        description="Sua demanda pode nascer do diagnóstico com IA — basta revisar e ajustar antes de publicar."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Demandas", to: "/app/demandas" }, { label: "Nova" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <div className="space-y-5">
          <Card>
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <span className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-navy-900"><Sparkles className="size-4.5 text-navy-600" /> Usar o diagnóstico gerado</span>
              <Toggle checked={useDiagnosis} onChange={setUseDiagnosis} />
            </div>
            {useDiagnosis && (
              <CardBody className="pt-4">
                <AINotice title="Pré-preenchido a partir do diagnóstico" sources={["Relatório diag-001"]}>
                  Os campos abaixo foram preenchidos com o briefing. Você pode editar tudo livremente.
                </AINotice>
              </CardBody>
            )}
          </Card>

          <Card>
            <CardHeader title="Detalhes da demanda" subtitle="Quanto mais claro, melhor o pareamento" />
            <CardBody className="space-y-4 pt-0">
              <Field label="Título do caso" required>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Área do direito" required>
                  <Select value={area} onChange={(e) => setArea(e.target.value as LegalArea)}>
                    {areas.map((a) => <option key={a}>{a}</option>)}
                  </Select>
                </Field>
                <Field label="Urgência" required>
                  <Select value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)}>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </Select>
                </Field>
              </div>
              <Field label="Descrição do caso" hint="Linguagem simples ajuda o especialista a entender rápido." required>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
              </Field>

              <Field label="Tipo de apoio" required>
                <div className="grid gap-3 sm:grid-cols-2">
                  {([["humanizado", "Apoio humanizado", "Mentoria de um especialista"], ["parceria", "Parceria 50/50", "Atuação conjunta com divisão"]] as const).map(([val, t, d]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSupport(val)}
                      className={cn("rounded-lg border p-4 text-left transition-all", support === val ? "border-navy-600 bg-navy-50/70 ring-1 ring-navy-600" : "border-line-strong hover:border-navy-300")}
                    >
                      <span className="block text-[0.9rem] font-semibold text-navy-900">{t}</span>
                      <span className="block text-[0.8rem] text-muted">{d}</span>
                    </button>
                  ))}
                </div>
              </Field>
            </CardBody>
          </Card>

          {/* Documents (RF-23) */}
          <Card>
            <CardHeader icon={<FileText className="size-5" />} title="Documentos" subtitle="Acesso restrito às partes envolvidas" action={<Badge tone="navy" icon={<Lock className="size-3" />}>Sigiloso</Badge>} />
            <CardBody className="pt-0">
              <button onClick={() => setFiles((f) => [...f, `documento-${f.length + 1}.pdf`])} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong bg-surface-2/40 py-6 text-[0.86rem] text-muted transition-colors hover:border-navy-400 hover:text-navy-700">
                <Upload className="size-4.5" /> Arraste arquivos ou clique para anexar
              </button>
              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-lg border border-line bg-surface-2/40 px-3 py-2.5">
                      <FileText className="size-4 text-navy-500" />
                      <span className="flex-1 text-[0.85rem] text-ink">{f}</span>
                      <Badge tone="neutral">restrito</Badge>
                      <button onClick={() => setFiles((fs) => fs.filter((_, idx) => idx !== i))} aria-label="Remover" className="text-faint hover:text-danger"><X className="size-4" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Side rail */}
        <div className="space-y-4">
          <Card className="lg:sticky lg:top-24">
            <CardBody>
              <h3 className="text-[0.95rem] text-navy-900">Pronto para publicar?</h3>
              <p className="mt-1 text-[0.84rem] text-muted text-pretty">Ao publicar, a plataforma inicia o matching automatizado e sugere especialistas compatíveis.</p>

              <div className="my-4 border-t border-line pt-4">
                <Toggle
                  checked={priorityPCD}
                  onChange={setPriorityPCD}
                  label="Priorizar advogado com deficiência"
                  description="Atendimento prioritário quando configurado (RF-31)."
                />
              </div>

              <div className="rounded-lg bg-navy-50/70 p-3 text-[0.8rem] text-navy-800 flex items-start gap-2">
                <Accessibility className="mt-0.5 size-4 shrink-0 text-navy-600" />
                A demanda respeita o sigilo: anexos e diagnóstico só ficam visíveis às partes pareadas.
              </div>

              <Button full size="lg" className="mt-4" loading={submitting} iconRight={!submitting ? <Send className="size-4" /> : undefined} onClick={publish}>
                {submitting ? "Publicando…" : "Publicar demanda"}
              </Button>
              <Button variant="ghost" full className="mt-2" onClick={() => nav(-1)}>Cancelar</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
