import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessagesSquare,
  PlayCircle,
  CalendarClock,
  CheckCircle2,
  Circle,
  Target,
  Search,
  Eye,
  Download,
  Video,
  MapPin,
  Blend,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { lawyerById } from "@/data/lawyers";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Stat } from "@/components/ui/Stat";
import { Progress } from "@/components/ui/Progress";
import { Drawer } from "@/components/ui/Drawer";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Input, Select } from "@/components/ui/Field";
import { KeyValue } from "@/components/ui/Misc";
import { cn, formatDateTime, timeAgo } from "@/lib/utils";
import type { Service, ServiceStatus, SessionMode } from "@/data/types";

const statusMeta: Record<ServiceStatus, { label: string; tone: Tone }> = {
  agendado: { label: "Agendado", tone: "info" },
  em_andamento: { label: "Em andamento", tone: "accent" },
  concluido: { label: "Concluído", tone: "success" },
};

const sessionModeMeta: Record<SessionMode, { label: string; icon: typeof Video }> = {
  online: { label: "Online", icon: Video },
  presencial: { label: "Presencial", icon: MapPin },
  hibrido: { label: "Híbrido", icon: Blend },
};

const sessionStatusTone: Record<"agendada" | "realizada" | "cancelada", Tone> = {
  agendada: "info",
  realizada: "success",
  cancelada: "neutral",
};
const sessionStatusLabel: Record<"agendada" | "realizada" | "cancelada", string> = {
  agendada: "Agendada",
  realizada: "Realizada",
  cancelada: "Cancelada",
};

function partyName(id: string): string {
  return lawyerById(id)?.name ?? "Advogado(a)";
}
function milestoneProgress(s: Service): number {
  if (s.milestones.length === 0) return 0;
  return (s.milestones.filter((m) => m.done).length / s.milestones.length) * 100;
}

export function GestaoAtendimentos() {
  const { toast } = useApp();
  const { services, demands, indicators } = useAdmin();
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "todos">("todos");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const demandTitle = useMemo(() => {
    const map = new Map(demands.map((d) => [d.id, d.title]));
    return (demandId: string) => map.get(demandId) ?? "Demanda";
  }, [demands]);

  const selected = services.find((s) => s.id === openId) ?? null;

  const counts = useMemo(
    () => ({
      total: services.length,
      andamento: services.filter((s) => s.status === "em_andamento").length,
      agendadosConcluidos: services.filter((s) => s.status === "agendado" || s.status === "concluido").length,
    }),
    [services],
  );

  const completionPct = Math.round(indicators.completionRate * 100);

  const filtered = useMemo(
    () =>
      services.filter(
        (s) =>
          (statusFilter === "todos" || s.status === statusFilter) &&
          (q === "" ||
            demandTitle(s.demandId).toLowerCase().includes(q.toLowerCase()) ||
            partyName(s.initiateId).toLowerCase().includes(q.toLowerCase()) ||
            partyName(s.specialistId).toLowerCase().includes(q.toLowerCase())),
      ),
    [services, statusFilter, q, demandTitle],
  );

  const columns: Column<Service>[] = [
    {
      key: "demanda",
      header: "Demanda",
      sortValue: (s) => demandTitle(s.demandId),
      render: (s) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-navy-900">{demandTitle(s.demandId)}</p>
          <p className="text-[0.76rem] text-muted">Iniciado {timeAgo(s.startedAt ?? s.sessions[0]?.scheduledAt ?? new Date().toISOString())}</p>
        </div>
      ),
    },
    {
      key: "iniciante",
      header: "Iniciante",
      sortValue: (s) => partyName(s.initiateId),
      hideSmall: true,
      render: (s) => (
        <div className="flex items-center gap-2">
          <Avatar name={partyName(s.initiateId)} size="xs" />
          <span className="text-[0.82rem] text-ink-soft">{partyName(s.initiateId)}</span>
        </div>
      ),
    },
    {
      key: "especialista",
      header: "Especialista",
      sortValue: (s) => partyName(s.specialistId),
      hideSmall: true,
      render: (s) => (
        <div className="flex items-center gap-2">
          <Avatar name={partyName(s.specialistId)} size="xs" />
          <span className="text-[0.82rem] text-ink-soft">{partyName(s.specialistId)}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Situação",
      sortValue: (s) => s.status,
      render: (s) => <Badge tone={statusMeta[s.status].tone}>{statusMeta[s.status].label}</Badge>,
    },
    {
      key: "sessoes",
      header: "Sessões",
      align: "right",
      sortValue: (s) => s.sessions.length,
      hideSmall: true,
      render: (s) => <span className="tabular-nums text-ink-soft">{s.sessions.length}</span>,
    },
    {
      key: "progresso",
      header: "Progresso",
      sortValue: (s) => milestoneProgress(s),
      render: (s) => (
        <div className="w-32">
          <Progress value={milestoneProgress(s)} tone={s.status === "concluido" ? "success" : "navy"} showLabel />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Gestão de atendimentos"
        description="Acompanhe o andamento de todos os atendimentos da plataforma (RF-46, RF-50)."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Atendimentos" }]}
        actions={
          <Button variant="outline" iconLeft={<Download className="size-4" />} onClick={() => toast("Relatório de atendimentos exportado.")}>
            Exportar
          </Button>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total de atendimentos" value={counts.total} icon={<MessagesSquare className="size-4.5" />} />
        <Stat label="Em andamento" value={counts.andamento} icon={<PlayCircle className="size-4.5" />} />
        <Stat label="Agendados / concluídos" value={counts.agendadosConcluidos} icon={<CalendarClock className="size-4.5" />} />
        <Stat
          label="Taxa de conclusão"
          value={`${completionPct}%`}
          icon={<Target className="size-4.5" />}
          goal={{ met: indicators.completionRate > 0.8, text: "Meta > 80%" }}
        />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        getRowId={(s) => s.id}
        onRowClick={(s) => setOpenId(s.id)}
        initialSort={{ key: "status", dir: "asc" }}
        emptyTitle="Nenhum atendimento encontrado"
        emptyDescription="Ajuste os filtros ou a busca."
        emptyIcon={<MessagesSquare className="size-6" />}
        rowActions={(s) => (
          <Button size="sm" variant="ghost" iconLeft={<Eye className="size-3.5" />} onClick={() => setOpenId(s.id)}>
            Abrir
          </Button>
        )}
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {(["todos", "em_andamento", "agendado", "concluido"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[0.8rem] font-medium transition-colors",
                    statusFilter === st ? "bg-navy-700 text-white" : "bg-surface-2 border border-line text-ink-soft hover:border-navy-300",
                  )}
                >
                  {st === "todos" ? "Todos" : statusMeta[st].label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ServiceStatus | "todos")}
                className="h-9 w-44 text-[0.84rem] lg:hidden"
              >
                <option value="todos">Toda situação</option>
                <option value="em_andamento">Em andamento</option>
                <option value="agendado">Agendados</option>
                <option value="concluido">Concluídos</option>
              </Select>
              <div className="relative w-full lg:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar demanda ou advogado…" className="h-9 pl-9 text-[0.84rem]" />
              </div>
            </div>
          </div>
        }
      />

      <Drawer
        open={!!selected}
        onClose={() => setOpenId(null)}
        title={selected ? demandTitle(selected.demandId) : ""}
        subtitle={selected ? `Atendimento ${selected.id}` : ""}
        icon={selected ? <MessagesSquare className="size-5" /> : undefined}
        width="md"
        footer={
          selected && (
            <>
              <Link
                to={`/app/atendimento/${selected.id}`}
                className="mr-auto inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-bordo-700 hover:underline"
              >
                <ExternalLink className="size-3.5" /> Acompanhar atendimento
              </Link>
              <Button variant="ghost" onClick={() => setOpenId(null)}>
                Fechar
              </Button>
            </>
          )
        }
      >
        {selected && <ServiceDetail service={selected} />}
      </Drawer>
    </>
  );
}

function ServiceDetail({ service }: { service: Service }) {
  const meta = statusMeta[service.status];
  const doneCount = service.milestones.filter((m) => m.done).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={meta.tone}>{meta.label}</Badge>
        <Badge tone="neutral">{service.messages.length} mensagens</Badge>
        {service.startedAt && <span className="text-[0.8rem] text-muted">Iniciado {timeAgo(service.startedAt)}</span>}
      </div>

      <section>
        <h4 className="mb-2.5 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Partes envolvidas</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { role: "Iniciante", id: service.initiateId },
            { role: "Especialista", id: service.specialistId },
          ].map((p) => (
            <div key={p.role} className="flex items-center gap-3 rounded-lg border border-line bg-surface-2/40 px-3.5 py-3">
              <Avatar name={partyName(p.id)} size="sm" />
              <div className="min-w-0">
                <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-faint">{p.role}</p>
                <p className="truncate text-[0.86rem] font-medium text-navy-900">{partyName(p.id)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <h4 className="text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Marcos</h4>
          <span className="text-[0.78rem] tabular-nums text-muted">{doneCount}/{service.milestones.length}</span>
        </div>
        <ul className="space-y-1.5">
          {service.milestones.map((m) => (
            <li key={m.id} className="flex items-start gap-2.5">
              {m.done ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              ) : (
                <Circle className="mt-0.5 size-4 shrink-0 text-faint" />
              )}
              <div className="min-w-0">
                <p className={cn("text-[0.85rem]", m.done ? "font-medium text-navy-900" : "text-ink-soft")}>{m.label}</p>
                {m.at && <p className="text-[0.74rem] text-faint">{formatDateTime(m.at)}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="mb-2.5 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Sessões de vídeo</h4>
        {service.sessions.length === 0 ? (
          <p className="text-[0.84rem] text-muted">Nenhuma sessão agendada.</p>
        ) : (
          <div className="space-y-2.5">
            {service.sessions.map((vs) => {
              const mode = sessionModeMeta[vs.mode];
              const ModeIcon = mode.icon;
              return (
                <div key={vs.id} className="rounded-lg border border-line bg-surface-2/40 p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[0.86rem] font-medium text-navy-900">{vs.title}</p>
                    <Badge tone={sessionStatusTone[vs.status]}>{sessionStatusLabel[vs.status]}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.78rem] text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock className="size-3.5 text-faint" />
                      {formatDateTime(vs.scheduledAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ModeIcon className="size-3.5 text-faint" />
                      {mode.label}
                    </span>
                    <span className="text-faint">{vs.durationMin} min</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3 text-[0.85rem]">
        <KeyValue label="Mensagens trocadas">{service.messages.length}</KeyValue>
        <KeyValue label="Sessões">{service.sessions.length}</KeyValue>
      </section>

      <Link
        to={`/app/atendimento/${service.id}`}
        className="inline-flex items-center gap-1.5 text-[0.84rem] font-medium text-bordo-700 hover:underline"
      >
        <Eye className="size-4" /> Acompanhar atendimento completo
      </Link>
    </div>
  );
}
