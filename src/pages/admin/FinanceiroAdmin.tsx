import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Banknote,
  Landmark,
  HandCoins,
  Clock,
  Receipt,
  TrendingUp,
  Download,
  Trophy,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { platformFinance, works, workFee, workNet, settlementLabel, type SettlementStatus, type FinancialWork } from "@/data/finance";
import { lawyerById } from "@/data/lawyers";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { MoneyTooltip, CHART } from "@/components/MoneyTooltip";
import { brl } from "@/lib/utils";

const statusTone: Record<SettlementStatus, Tone> = { recebido: "success", a_receber: "info", pendente: "warning" };
const statusColor: Record<SettlementStatus, string> = { recebido: CHART.success, a_receber: CHART.navy, pendente: CHART.warning };

export function FinanceiroAdmin() {
  const { toast } = useApp();
  const fin = platformFinance();
  const maxEarner = fin.topEarners[0]?.total ?? 1;

  const columns: Column<FinancialWork>[] = [
    {
      key: "title",
      header: "Trabalho",
      sortValue: (w) => w.title,
      render: (w) => (
        <div className="min-w-0">
          <p className="font-medium text-navy-900">{w.title}</p>
          <p className="font-mono text-[0.74rem] text-muted">{w.code} · {w.area}</p>
        </div>
      ),
    },
    {
      key: "parties",
      header: "Advogados",
      hideSmall: true,
      render: (w) => (
        <div className="flex items-center -space-x-2">
          <Avatar name={lawyerById(w.initiateId)?.name ?? "?"} size="xs" ring />
          <Avatar name={lawyerById(w.partnerId)?.name ?? "?"} size="xs" ring />
          <span className="pl-3 text-[0.8rem] text-muted">{lawyerById(w.initiateId)?.name.split(" ")[0]} + {lawyerById(w.partnerId)?.name.split(" ")[0]}</span>
        </div>
      ),
    },
    { key: "serviceValue", header: "Valor", align: "right", sortValue: (w) => w.serviceValue, render: (w) => <span className="tabular-nums font-medium text-navy-900">{brl(w.serviceValue)}</span> },
    { key: "fee", header: "Taxa", align: "right", hideSmall: true, sortValue: (w) => workFee(w), render: (w) => <span className="tabular-nums text-bordo-700">{brl(workFee(w))}</span> },
    { key: "repasse", header: "Repasse", align: "right", hideSmall: true, sortValue: (w) => workNet(w), render: (w) => <span className="tabular-nums text-muted">{brl(workNet(w))}</span> },
    { key: "status", header: "Status", sortValue: (w) => w.status, render: (w) => <Badge tone={statusTone[w.status]} dot>{settlementLabel[w.status]}</Badge> },
  ];

  return (
    <>
      <PageHeader
        title="Financeiro da plataforma"
        description="Volume transacionado, receita de intermediação para custeio e repasses aos advogados (RF-45)."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Financeiro" }]}
        meta={<Badge tone="brass" icon={<Banknote className="size-3.5" />}>{fin.count} trabalhos no período</Badge>}
        actions={<Button iconLeft={<Download className="size-4" />} onClick={() => toast("Relatório financeiro exportado (técnico + anonimizado).")}>Exportar financeiro</Button>}
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Volume transacionado" value={brl(fin.volume)} icon={<Banknote className="size-4.5" />} hint="Soma dos valores de serviço" />
        <Stat label="Receita de intermediação" value={brl(fin.receita)} icon={<Landmark className="size-4.5" />} hint="Custeio do projeto" />
        <Stat label="Repasse aos advogados" value={brl(fin.repasse)} icon={<HandCoins className="size-4.5" />} hint="Líquido distribuído 50/50" />
        <Stat label="Liquidado" value={brl(fin.recebido)} icon={<Receipt className="size-4.5" />} hint={`${fin.liquidadas} de ${fin.count} pagos`} />
        <Stat label="A liquidar" value={brl(fin.aReceber + fin.pendente)} icon={<Clock className="size-4.5" />} hint="A receber + pendente" />
        <Stat label="Ticket médio" value={brl(fin.ticketMedio)} icon={<TrendingUp className="size-4.5" />} hint="Por trabalho" />
      </div>

      {/* charts */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Evolução financeira" subtitle="Volume, receita de intermediação e repasse por mês" />
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={fin.monthly} margin={{ left: -6, right: 8, top: 4 }}>
                <defs>
                  <linearGradient id="fVol" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={CHART.navy} stopOpacity={0.28} /><stop offset="100%" stopColor={CHART.navy} stopOpacity={0} /></linearGradient>
                  <linearGradient id="fRep" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={CHART.success} stopOpacity={0.24} /><stop offset="100%" stopColor={CHART.success} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.912 0.008 260)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "oklch(0.508 0.020 263)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "oklch(0.508 0.020 263)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip content={<MoneyTooltip />} />
                <Area type="monotone" dataKey="volume" name="Volume" stroke={CHART.navy} strokeWidth={2} fill="url(#fVol)" />
                <Area type="monotone" dataKey="repasse" name="Repasse" stroke={CHART.success} strokeWidth={2} fill="url(#fRep)" />
                <Area type="monotone" dataKey="receita" name="Intermediação" stroke={CHART.bordo} strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-1 flex flex-wrap justify-center gap-5 text-[0.78rem] text-muted">
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: CHART.navy }} /> Volume</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: CHART.success }} /> Repasse</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: CHART.bordo }} /> Intermediação</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Por situação" subtitle="Volume por status de liquidação" />
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={fin.byStatus} dataKey="value" nameKey="label" innerRadius={48} outerRadius={78} paddingAngle={2} stroke="none">
                  {fin.byStatus.map((s) => <Cell key={s.status} fill={statusColor[s.status]} />)}
                </Pie>
                <Tooltip content={<MoneyTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 space-y-1.5">
              {fin.byStatus.map((s) => (
                <li key={s.status} className="flex items-center gap-2 text-[0.82rem]">
                  <span className="size-2.5 rounded-sm" style={{ background: statusColor[s.status] }} />
                  <span className="flex-1 text-ink-soft">{s.label}</span>
                  <span className="font-semibold tabular-nums text-navy-900">{brl(s.value)}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* top earners + by area */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader icon={<Trophy className="size-5" />} title="Advogados que mais receberam" subtitle="Soma das partes (50%) no período" />
          <CardBody className="pt-0 space-y-3">
            {fin.topEarners.map((e, i) => {
              const l = lawyerById(e.lawyerId);
              return (
                <div key={e.lawyerId} className="flex items-center gap-3">
                  <span className="w-4 text-center font-serif text-[0.9rem] text-faint">{i + 1}</span>
                  <Avatar name={l?.name ?? "?"} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.86rem] font-semibold text-navy-900 truncate">{l?.name}</p>
                    <Progress value={(e.total / maxEarner) * 100} tone={i === 0 ? "accent" : "navy"} />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums text-navy-900">{brl(e.total)}</p>
                    <p className="text-[0.72rem] text-muted">{e.works} trabalhos</p>
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Volume por área" subtitle="Distribuição temática dos valores" />
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fin.byArea} layout="vertical" margin={{ left: 24, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.912 0.008 260)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.508 0.020 263)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis type="category" dataKey="area" width={84} tick={{ fontSize: 11, fill: "oklch(0.372 0.026 263)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<MoneyTooltip />} cursor={{ fill: "oklch(0.972 0.012 255)" }} />
                <Bar dataKey="volume" name="Volume" radius={[0, 5, 5, 0]} fill={CHART.navy} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* transactions */}
      <div className="mt-5">
        <DataTable
          data={works}
          columns={columns}
          getRowId={(w) => w.id}
          initialSort={{ key: "serviceValue", dir: "desc" }}
          pageSize={8}
          emptyTitle="Sem transações"
          toolbar={<div className="flex items-center gap-2 text-[0.86rem] font-semibold text-navy-900"><Receipt className="size-4 text-navy-600" /> Transações da plataforma</div>}
        />
      </div>
    </>
  );
}
