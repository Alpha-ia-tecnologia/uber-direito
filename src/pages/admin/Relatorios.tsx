import {
  Download,
  FileText,
  ShieldCheck,
  Receipt,
  BarChart3,
  GraduationCap,
  Users,
  CheckCircle2,
  Star,
  Handshake,
  Stethoscope,
  ClipboardList,
  CalendarClock,
  ClipboardCheck,
  Hourglass,
  Info,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { SectionTitle } from "@/components/ui/Misc";

type ReportFormat = "PDF" | "CSV" | "XLSX";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  format: ReportFormat;
  anonymized?: boolean;
}

const reportTypes: ReportType[] = [
  {
    id: "tecnico",
    title: "Relatório técnico",
    description: "Visão consolidada de atendimentos, validações e desempenho operacional da plataforma no período.",
    icon: FileText,
    format: "PDF",
  },
  {
    id: "anonimizado",
    title: "Dados anonimizados (pesquisa)",
    description: "Base de microdados sem identificação pessoal, em conformidade com a LGPD, para uso acadêmico e científico.",
    icon: ShieldCheck,
    format: "CSV",
    anonymized: true,
  },
  {
    id: "contas",
    title: "Prestação de contas",
    description: "Demonstrativo institucional de metas, indicadores e uso de recursos para órgãos de fomento e parceiros.",
    icon: Receipt,
    format: "PDF",
  },
  {
    id: "indicadores",
    title: "Indicadores do projeto",
    description: "Planilha com séries históricas mensais de cadastros, atendimentos e parcerias para análise própria.",
    icon: BarChart3,
    format: "XLSX",
  },
  {
    id: "artigos",
    title: "Base para artigos científicos",
    description: "Conjunto de dados agregados e anonimizados (LGPD) estruturado para publicações e estudos de impacto social.",
    icon: GraduationCap,
    format: "CSV",
    anonymized: true,
  },
];

const formatTone: Record<ReportFormat, Tone> = { PDF: "danger", CSV: "info", XLSX: "success" };

type InstrumentStatus = "aplicada" | "agendada" | "pendente";

interface Instrument {
  id: string;
  title: string;
  description: string;
  status: InstrumentStatus;
  when: string;
}

const instrumentStatusMeta: Record<InstrumentStatus, { label: string; tone: Tone; icon: LucideIcon }> = {
  aplicada: { label: "Aplicada", tone: "success", icon: ClipboardCheck },
  agendada: { label: "Agendada", tone: "info", icon: CalendarClock },
  pendente: { label: "Pendente", tone: "warning", icon: Hourglass },
};

const instruments: Instrument[] = [
  {
    id: "inicial",
    title: "Avaliação inicial",
    description: "Linha de base aplicada no onboarding de advogados e beneficiários do projeto.",
    status: "aplicada",
    when: "Concluída em mar/2026",
  },
  {
    id: "mensal",
    title: "Avaliação mensal",
    description: "Pulso recorrente de satisfação e qualidade dos atendimentos prestados.",
    status: "aplicada",
    when: "Última coleta em mai/2026",
  },
  {
    id: "final",
    title: "Avaliação final",
    description: "Medição de impacto ao encerramento do ciclo, comparada com a linha de base.",
    status: "agendada",
    when: "Prevista para jul/2027",
  },
  {
    id: "grupo-focal",
    title: "Coleta para grupo focal",
    description: "Roteiro qualitativo para sessões de grupo focal com participantes selecionados.",
    status: "pendente",
    when: "Aguardando agendamento",
  },
];

export function Relatorios() {
  const { toast } = useApp();
  const { indicators, stats } = useAdmin();

  const pct = (n: number) => `${Math.round(n * 100)}%`;

  return (
    <>
      <PageHeader
        title="Relatórios e exportações"
        description="Gere relatórios técnicos, de prestação de contas e bases anonimizadas para pesquisa (RF-63, RF-64)."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Relatórios" }]}
        meta={
          <Badge tone="navy" icon={<ShieldCheck className="size-3" />}>
            Exportações conformes à LGPD
          </Badge>
        }
      />

      {/* Section 1 — Export reports */}
      <section className="mb-9">
        <SectionTitle description="Selecione o tipo de relatório. Bases de pesquisa são entregues anonimizadas, sem dados pessoais identificáveis.">
          Exportar relatórios
        </SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reportTypes.map((r) => {
            const Icon = r.icon;
            return (
              <Card key={r.id} className="flex flex-col">
                <CardHeader
                  icon={<Icon className="size-5" />}
                  title={r.title}
                  action={<Badge tone={formatTone[r.format]}>{r.format}</Badge>}
                />
                <CardBody className="flex-1 pt-0">
                  <p className="text-[0.86rem] leading-relaxed text-muted text-pretty">{r.description}</p>
                  {r.anonymized && (
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[0.74rem] font-medium text-success-ink">
                      <ShieldCheck className="size-3.5" /> Anonimizado (LGPD)
                    </span>
                  )}
                </CardBody>
                <CardFooter>
                  <Button
                    size="sm"
                    variant="outline"
                    full
                    iconLeft={<Download className="size-4" />}
                    onClick={() =>
                      toast(
                        `Exportação de "${r.title}" (${r.format}) iniciada${r.anonymized ? " — base anonimizada (LGPD)" : ""}.`,
                      )
                    }
                  >
                    Exportar
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section 2 — Summary indicators */}
      <section className="mb-9">
        <SectionTitle description="Síntese dos principais resultados do projeto, base para a prestação de contas.">
          Indicadores resumidos
        </SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Stat
            label="Atendimentos"
            value={indicators.totalServices}
            icon={<ClipboardList className="size-4.5" />}
            hint={`${stats.activeServices} em andamento`}
          />
          <Stat
            label="Taxa de conclusão"
            value={pct(indicators.completionRate)}
            icon={<CheckCircle2 className="size-4.5" />}
            goal={{ met: indicators.completionRate >= 0.8, text: "Meta: 80%" }}
          />
          <Stat
            label="Média de avaliação"
            value={indicators.avgRating.toFixed(1)}
            icon={<Star className="size-4.5" />}
            hint="de 5 estrelas"
          />
          <Stat
            label="Parcerias"
            value={indicators.partnerships}
            icon={<Handshake className="size-4.5" />}
            hint="termos formalizados"
          />
          <Stat
            label="Diagnósticos com IA"
            value={indicators.diagnoses}
            icon={<Stethoscope className="size-4.5" />}
            hint={`${indicators.totalLawyers} advogados cadastrados`}
          />
        </div>
      </section>

      {/* Section 3 — Evaluation instruments (RF-64) */}
      <section>
        <SectionTitle description="Instrumentos periódicos do plano de avaliação e monitoramento do projeto.">
          Instrumentos de avaliação (RF-64)
        </SectionTitle>

        <Card>
          <CardHeader
            icon={<ClipboardList className="size-5" />}
            title="Plano de avaliação"
            subtitle="Gere ou exporte os instrumentos aplicados ao longo do ciclo."
          />
          <CardBody className="pt-0">
            <ul className="divide-y divide-line">
              {instruments.map((inst) => {
                const meta = instrumentStatusMeta[inst.status];
                const StatusIcon = meta.icon;
                const isPending = inst.status === "pendente";
                return (
                  <li key={inst.id} className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                        <Users className="size-4.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[0.92rem] font-semibold text-navy-900">{inst.title}</p>
                          <Badge tone={meta.tone} icon={<StatusIcon className="size-3" />}>
                            {meta.label}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-[0.82rem] text-muted text-pretty">{inst.description}</p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-[0.74rem] text-faint">
                          <CalendarClock className="size-3.5" /> {inst.when}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 pl-12 sm:pl-0">
                      <Button
                        size="sm"
                        variant={isPending ? "outline" : "ghost"}
                        iconLeft={isPending ? <ClipboardList className="size-4" /> : <Download className="size-4" />}
                        onClick={() =>
                          toast(
                            isPending
                              ? `Instrumento "${inst.title}" gerado para aplicação.`
                              : `Resultados de "${inst.title}" exportados.`,
                          )
                        }
                      >
                        {isPending ? "Gerar" : "Exportar"}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
          <CardFooter>
            <p className="inline-flex items-center gap-2 text-[0.8rem] text-muted">
              <Info className="size-4 shrink-0 text-navy-400" />
              Os instrumentos seguem o plano de monitoramento e avaliação de impacto do projeto.
            </p>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
