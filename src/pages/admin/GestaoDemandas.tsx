import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  Search,
  PlayCircle,
  CheckCircle2,
  Eye,
  ExternalLink,
  Ban,
  Paperclip,
  Sparkles,
  FileText,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Stat } from "@/components/ui/Stat";
import { Drawer } from "@/components/ui/Drawer";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Field, Input, Select } from "@/components/ui/Field";
import { KeyValue } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/StatusBadge";
import { demandStatusMeta, urgencyMeta, supportTypeLabel } from "@/lib/status";
import { cn, formatDate } from "@/lib/utils";
import { lawyerById } from "@/data/lawyers";
import type { Demand, DemandStatus, LegalArea } from "@/data/types";

const statusFilters: { id: DemandStatus | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "publicada", label: "Publicadas" },
  { id: "em_matching", label: "Em matching" },
  { id: "em_atendimento", label: "Em atendimento" },
  { id: "concluida", label: "Concluídas" },
  { id: "cancelada", label: "Canceladas" },
];

const statusOptions: DemandStatus[] = ["publicada", "em_matching", "em_atendimento", "concluida", "cancelada"];

export function GestaoDemandas() {
  const { toast } = useApp();
  const { demands, setDemandStatus } = useAdmin();
  const [statusFilter, setStatusFilter] = useState<DemandStatus | "todas">("todas");
  const [areaFilter, setAreaFilter] = useState<LegalArea | "todas">("todas");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const selected = demands.find((d) => d.id === openId) ?? null;

  const areas = useMemo(
    () => Array.from(new Set(demands.map((d) => d.area))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [demands],
  );

  const counts = useMemo(
    () => ({
      total: demands.length,
      matching: demands.filter((d) => d.status === "em_matching").length,
      atendimento: demands.filter((d) => d.status === "em_atendimento").length,
      concluida: demands.filter((d) => d.status === "concluida").length,
    }),
    [demands],
  );

  const filtered = useMemo(
    () =>
      demands.filter(
        (d) =>
          (statusFilter === "todas" || d.status === statusFilter) &&
          (areaFilter === "todas" || d.area === areaFilter) &&
          (q === "" || d.title.toLowerCase().includes(q.toLowerCase()) || d.code.toLowerCase().includes(q.toLowerCase())),
      ),
    [demands, statusFilter, areaFilter, q],
  );

  const columns: Column<Demand>[] = [
    { key: "code", header: "Código", sortValue: (d) => d.code, render: (d) => <span className="font-mono text-[0.8rem] text-navy-700">{d.code}</span> },
    {
      key: "title",
      header: "Título",
      sortValue: (d) => d.title,
      render: (d) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-navy-900">{d.title}</p>
          <p className="text-[0.76rem] text-muted">{d.area}</p>
        </div>
      ),
    },
    {
      key: "author",
      header: "Autor",
      hideSmall: true,
      sortValue: (d) => lawyerById(d.authorId)?.name ?? "",
      render: (d) => {
        const author = lawyerById(d.authorId);
        return (
          <div className="flex items-center gap-2">
            <Avatar name={author?.name ?? "—"} size="xs" />
            <span className="truncate text-ink-soft">{author?.name ?? "Desconhecido"}</span>
          </div>
        );
      },
    },
    { key: "area", header: "Área", hideSmall: true, render: (d) => <Badge tone="navy">{d.area}</Badge> },
    { key: "status", header: "Status", sortValue: (d) => d.status, render: (d) => <StatusBadge meta={demandStatusMeta[d.status]} /> },
    { key: "urgency", header: "Urgência", hideSmall: true, render: (d) => <StatusBadge meta={urgencyMeta[d.urgency]} /> },
    { key: "createdAt", header: "Criada", align: "right", sortValue: (d) => d.createdAt, render: (d) => <span className="tabular-nums text-muted">{formatDate(d.createdAt)}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Gestão de demandas"
        description="Acompanhe e modere todas as demandas publicadas na plataforma (RF-67)."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Demandas" }]}
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total de demandas" value={counts.total} icon={<Inbox className="size-4.5" />} />
        <Stat label="Em matching" value={counts.matching} icon={<Search className="size-4.5" />} />
        <Stat label="Em atendimento" value={counts.atendimento} icon={<PlayCircle className="size-4.5" />} />
        <Stat label="Concluídas" value={counts.concluida} icon={<CheckCircle2 className="size-4.5" />} />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        getRowId={(d) => d.id}
        onRowClick={(d) => setOpenId(d.id)}
        initialSort={{ key: "createdAt", dir: "desc" }}
        emptyIcon={<Inbox className="size-6" />}
        emptyTitle="Nenhuma demanda encontrada"
        emptyDescription="Ajuste os filtros ou a busca."
        rowActions={(d) => (
          <Button size="sm" variant="ghost" iconLeft={<Eye className="size-3.5" />} onClick={() => setOpenId(d.id)}>
            Abrir
          </Button>
        )}
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {statusFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[0.8rem] font-medium transition-colors",
                    statusFilter === f.id ? "bg-navy-700 text-white" : "bg-surface-2 border border-line text-ink-soft hover:border-navy-300",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value as LegalArea | "todas")} className="h-9 w-44 text-[0.84rem]">
                <option value="todas">Todas as áreas</option>
                {areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </Select>
              <div className="relative w-full lg:w-60">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar título ou código…" className="h-9 pl-9 text-[0.84rem]" />
              </div>
            </div>
          </div>
        }
      />

      <Drawer
        open={!!selected}
        onClose={() => setOpenId(null)}
        title={selected?.title ?? ""}
        subtitle={selected ? `${selected.code} · ${selected.area}` : ""}
        icon={<FileText className="size-5" />}
        width="md"
        footer={
          selected && (
            <>
              <Link to={`/app/demandas/${selected.id}`} className="mr-auto inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-navy-600 hover:text-navy-800">
                <ExternalLink className="size-3.5" /> Ver no fluxo
              </Link>
              <Button variant="ghost" onClick={() => setOpenId(null)}>Fechar</Button>
            </>
          )
        }
      >
        {selected && (
          <DemandDetail
            demand={selected}
            onStatus={(s) => { setDemandStatus(selected.id, s); toast("Status da demanda atualizado."); }}
            onCancel={() => { setDemandStatus(selected.id, "cancelada"); toast(`Demanda ${selected.code} cancelada.`); }}
          />
        )}
      </Drawer>
    </>
  );
}

function DemandDetail({ demand, onStatus, onCancel }: { demand: Demand; onStatus: (s: DemandStatus) => void; onCancel: () => void }) {
  const author = lawyerById(demand.authorId);
  const closed = demand.status === "concluida" || demand.status === "cancelada";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge meta={demandStatusMeta[demand.status]} />
        <StatusBadge meta={urgencyMeta[demand.urgency]} />
        {demand.priorityPCD && <Badge tone="info">Prioridade PCD</Badge>}
      </div>

      <Field label="Status da demanda">
        <Select value={demand.status} onChange={(e) => onStatus(e.target.value as DemandStatus)}>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{demandStatusMeta[s].label}</option>
          ))}
        </Select>
      </Field>

      <section>
        <h4 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Descrição</h4>
        <p className="text-[0.88rem] leading-relaxed text-ink-soft">{demand.description}</p>
      </section>

      <section>
        <h4 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Detalhes</h4>
        <div className="grid grid-cols-2 gap-3 text-[0.85rem]">
          <KeyValue label="Tipo de apoio">{supportTypeLabel[demand.supportType]}</KeyValue>
          <KeyValue label="Urgência">{urgencyMeta[demand.urgency].label}</KeyValue>
          <KeyValue label="Autor">
            <span className="inline-flex items-center gap-1.5">
              <Avatar name={author?.name ?? "—"} size="xs" />
              {author?.name ?? "Desconhecido"}
            </span>
          </KeyValue>
          <KeyValue label="Anexos">
            <span className="inline-flex items-center gap-1.5">
              <Paperclip className="size-3.5 text-faint" />
              {demand.documents.length} {demand.documents.length === 1 ? "arquivo" : "arquivos"}
            </span>
          </KeyValue>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-surface-2/40 p-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-bordo-600" />
          {demand.diagnosis ? (
            <Badge tone="accent" icon={<Sparkles className="size-3" />}>Diagnóstico com IA gerado</Badge>
          ) : (
            <Badge tone="neutral">Sem diagnóstico de IA</Badge>
          )}
        </div>
        {demand.diagnosis && <p className="mt-2 text-[0.83rem] leading-relaxed text-muted">{demand.diagnosis.oneLine}</p>}
      </section>

      {!closed && (
        <section>
          <h4 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Ação do Comitê</h4>
          <Button variant="danger" size="sm" full iconLeft={<Ban className="size-4" />} onClick={onCancel}>
            Cancelar demanda
          </Button>
        </section>
      )}
    </div>
  );
}
