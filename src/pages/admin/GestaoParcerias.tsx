import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Handshake,
  Search,
  FileSignature,
  Coins,
  Percent,
  Eye,
  ExternalLink,
  Download,
  CheckCircle2,
  Clock,
  Scale,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Stat } from "@/components/ui/Stat";
import { Drawer } from "@/components/ui/Drawer";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Field, Input, Select } from "@/components/ui/Field";
import { KeyValue } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/StatusBadge";
import { partnershipStatusMeta } from "@/lib/status";
import { lawyerById } from "@/data/lawyers";
import { brl, formatDate, formatDateTime, cn } from "@/lib/utils";
import type { Partnership, PartnershipStatus } from "@/data/types";

const META_PARCERIAS = 300;

const statusOptions: { value: PartnershipStatus; label: string }[] = [
  { value: "proposta", label: "Proposta" },
  { value: "formalizada", label: "Formalizada" },
  { value: "em_execucao", label: "Em execução" },
  { value: "encerrada", label: "Encerrada" },
];

export function GestaoParcerias() {
  const { toast } = useApp();
  const { partnerships, setPartnershipStatus, demands } = useAdmin();
  const [statusFilter, setStatusFilter] = useState<PartnershipStatus | "todos">("todos");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const demandTitle = (id: string) => demands.find((d) => d.id === id)?.title ?? "Demanda não localizada";

  const selected = partnerships.find((p) => p.id === openId) ?? null;

  const totals = useMemo(() => {
    const active = partnerships.filter((p) => p.status === "formalizada" || p.status === "em_execucao").length;
    const value = partnerships.reduce((sum, p) => sum + p.serviceValue, 0);
    const fee = partnerships.reduce((sum, p) => sum + p.serviceValue * p.feePct, 0);
    return { active, value, fee };
  }, [partnerships]);

  const filtered = useMemo(
    () =>
      partnerships.filter((p) => {
        if (statusFilter !== "todos" && p.status !== statusFilter) return false;
        if (q === "") return true;
        const term = q.toLowerCase();
        return (
          p.code.toLowerCase().includes(term) ||
          demandTitle(p.demandId).toLowerCase().includes(term) ||
          (lawyerById(p.initiateId)?.name ?? "").toLowerCase().includes(term) ||
          (lawyerById(p.partnerId)?.name ?? "").toLowerCase().includes(term)
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [partnerships, statusFilter, q, demands],
  );

  const columns: Column<Partnership>[] = [
    {
      key: "code",
      header: "Termo",
      sortValue: (p) => p.code,
      render: (p) => <span className="font-mono text-[0.82rem] font-semibold text-navy-900">{p.code}</span>,
    },
    {
      key: "demanda",
      header: "Demanda",
      hideSmall: true,
      render: (p) => <span className="text-ink-soft">{demandTitle(p.demandId)}</span>,
    },
    {
      key: "parceiros",
      header: "Parceiros",
      render: (p) => {
        const ini = lawyerById(p.initiateId);
        const par = lawyerById(p.partnerId);
        return (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <Avatar name={ini?.name ?? "?"} size="xs" ring />
              <Avatar name={par?.name ?? "?"} size="xs" ring />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[0.8rem] font-medium text-navy-900">{ini?.name ?? "—"}</p>
              <p className="truncate text-[0.74rem] text-muted">{par?.name ?? "—"}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "valor",
      header: "Valor",
      align: "right",
      sortValue: (p) => p.serviceValue,
      render: (p) => <span className="font-mono tabular-nums text-navy-900">{brl(p.serviceValue)}</span>,
    },
    {
      key: "status",
      header: "Situação",
      sortValue: (p) => p.status,
      render: (p) => <StatusBadge meta={partnershipStatusMeta[p.status]} />,
    },
    {
      key: "criada",
      header: "Criada",
      align: "right",
      sortValue: (p) => p.createdAt,
      hideSmall: true,
      render: (p) => <span className="text-muted tabular-nums">{formatDate(p.createdAt)}</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="Gestão de parcerias"
        description="Acompanhe todos os termos de parceria 50/50 — divisão de honorários, aceites e situação (RF-40 a RF-43)."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Parcerias" }]}
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total de termos"
          value={partnerships.length}
          icon={<Handshake className="size-4.5" />}
          goal={{ met: partnerships.length >= META_PARCERIAS, text: `Meta de ${META_PARCERIAS} na vigência` }}
        />
        <Stat label="Formalizadas + em execução" value={totals.active} icon={<FileSignature className="size-4.5" />} />
        <Stat label="Valor total dos serviços" value={brl(totals.value)} icon={<Coins className="size-4.5" />} />
        <Stat label="Receita de intermediação" value={brl(totals.fee)} icon={<Percent className="size-4.5" />} hint="Soma das taxas sobre os serviços" />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        getRowId={(p) => p.id}
        onRowClick={(p) => setOpenId(p.id)}
        initialSort={{ key: "criada", dir: "desc" }}
        emptyIcon={<Handshake className="size-6" />}
        emptyTitle="Nenhuma parceria encontrada"
        emptyDescription="Ajuste o filtro de situação ou a busca."
        rowActions={(p) => (
          <Button size="sm" variant="ghost" iconLeft={<Eye className="size-3.5" />} onClick={() => setOpenId(p.id)}>
            Abrir
          </Button>
        )}
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {(["todos", "proposta", "formalizada", "em_execucao", "encerrada"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[0.8rem] font-medium transition-colors",
                    statusFilter === s ? "bg-navy-700 text-white" : "bg-surface-2 border border-line text-ink-soft hover:border-navy-300",
                  )}
                >
                  {s === "todos" ? "Todas" : partnershipStatusMeta[s].label}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar termo, demanda, advogado…"
                className="h-9 pl-9 text-[0.84rem]"
              />
            </div>
          </div>
        }
      />

      <Drawer
        open={!!selected}
        onClose={() => setOpenId(null)}
        title={selected ? "Termo de parceria 50/50" : ""}
        subtitle={selected?.code}
        icon={<Scale className="size-5" />}
        width="md"
        footer={
          selected && (
            <>
              <Link
                to={`/app/parcerias/${selected.id}`}
                className="mr-auto inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-navy-600 hover:text-navy-800"
              >
                <ExternalLink className="size-3.5" /> Abrir termo completo
              </Link>
              <Button
                variant="outline"
                iconLeft={<Download className="size-4" />}
                onClick={() => toast(`Termo ${selected.code} exportado em PDF (demonstração).`)}
              >
                Exportar PDF
              </Button>
            </>
          )
        }
      >
        {selected && (
          <PartnershipDetail
            partnership={selected}
            demandTitle={demandTitle(selected.demandId)}
            onStatus={(s) => {
              setPartnershipStatus(selected.id, s);
              toast(`Situação de ${selected.code} atualizada para "${partnershipStatusMeta[s].label}".`);
            }}
          />
        )}
      </Drawer>
    </>
  );
}

function PartnershipDetail({
  partnership,
  demandTitle,
  onStatus,
}: {
  partnership: Partnership;
  demandTitle: string;
  onStatus: (s: PartnershipStatus) => void;
}) {
  const initiate = lawyerById(partnership.initiateId);
  const partner = lawyerById(partnership.partnerId);
  const fee = partnership.serviceValue * partnership.feePct;
  const net = partnership.serviceValue - fee;
  const share = net / 2;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge meta={partnershipStatusMeta[partnership.status]} />
        <span className="text-[0.8rem] text-muted">Criada em {formatDate(partnership.createdAt)}</span>
      </div>

      <section>
        <h4 className="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Demanda</h4>
        <p className="text-[0.92rem] leading-relaxed text-ink">{demandTitle}</p>
      </section>

      <section>
        <h4 className="mb-2.5 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Partes</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <PartyCard role="Advogado(a) iniciante" name={initiate?.name} oab={initiate?.oab} />
          <PartyCard role="Advogado(a) parceiro(a)" name={partner?.name} oab={partner?.oab} />
        </div>
      </section>

      <section>
        <h4 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Divisão de valores</h4>
        <div className="overflow-hidden rounded-xl border border-line">
          <ValueRow label="Valor do serviço" value={brl(partnership.serviceValue)} />
          <ValueRow
            label={`Taxa de intermediação (${(partnership.feePct * 100).toFixed(0)}%)`}
            value={`− ${brl(fee)}`}
            sub
            icon={<Percent className="size-3.5" />}
          />
          <ValueRow label="Honorários líquidos" value={brl(net)} sub />
          <ValueRow label="Parte de cada advogado (50%)" value={brl(share)} highlight />
        </div>
        <p className="mt-2 text-[0.78rem] text-faint">A taxa custeia a operação do projeto de extensão. Valores demonstrativos.</p>
      </section>

      <section>
        <h4 className="mb-2.5 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Aceites eletrônicos</h4>
        <div className="grid grid-cols-2 gap-3 text-[0.85rem]">
          <KeyValue label="Iniciante">
            <AcceptCell ts={partnership.acceptedByInitiate} />
          </KeyValue>
          <KeyValue label="Parceiro(a)">
            <AcceptCell ts={partnership.acceptedByPartner} />
          </KeyValue>
        </div>
      </section>

      <section>
        <Field label="Situação do termo" hint="Atualiza a situação registrada na governança.">
          <Select value={partnership.status} onChange={(e) => onStatus(e.target.value as PartnershipStatus)}>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </section>
    </div>
  );
}

function PartyCard({ role, name, oab }: { role: string; name?: string; oab?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2/40 p-4">
      <p className="text-[0.72rem] uppercase tracking-wide text-faint">{role}</p>
      <div className="mt-2 flex items-center gap-2.5">
        <Avatar name={name ?? "?"} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-[0.88rem] font-semibold text-navy-900">{name ?? "—"}</p>
          <p className="text-[0.76rem] text-muted">{oab ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}

function AcceptCell({ ts }: { ts?: string }) {
  if (ts) {
    return (
      <span className="inline-flex items-center gap-1.5 text-success-ink">
        <CheckCircle2 className="size-3.5 text-success" />
        {formatDateTime(ts)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-warning-ink">
      <Clock className="size-3.5 text-warning" />
      Aguardando
    </span>
  );
}

function ValueRow({
  label,
  value,
  sub,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  sub?: boolean;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-line px-4 py-2.5 last:border-0",
        highlight && "bg-bordo-50/60",
        sub && "bg-surface-2/40",
      )}
    >
      <span className={cn("inline-flex items-center gap-1.5 text-[0.86rem]", highlight ? "font-semibold text-navy-900" : "text-ink-soft")}>
        {icon}
        {label}
      </span>
      <span className={cn("font-mono tabular-nums", highlight ? "text-[1rem] font-bold text-bordo-700" : "text-[0.9rem] text-navy-900")}>{value}</span>
    </div>
  );
}
