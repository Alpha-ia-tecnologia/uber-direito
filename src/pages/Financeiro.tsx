import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Wallet,
  TrendingUp,
  Clock,
  CircleDollarSign,
  Download,
  ArrowUpRight,
  CalendarClock,
  Info,
  Landmark,
  Handshake,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { lawyerFinance, settlementLabel, type SettlementStatus } from "@/data/finance";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/Misc";
import { MoneyTooltip, CHART } from "@/components/MoneyTooltip";
import { brl, formatDate } from "@/lib/utils";

const statusTone: Record<SettlementStatus, Tone> = { recebido: "success", a_receber: "info", pendente: "warning" };

type Row = ReturnType<typeof lawyerFinance>["works"][number];

export function Financeiro() {
  const { user, toast } = useApp();
  const fin = lawyerFinance(user.id);

  if (fin.count === 0) {
    return (
      <>
        <PageHeader title="Meus ganhos" description="Acompanhe seus repasses pelos trabalhos prestados em parceria." breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Financeiro" }]} />
        <Card>
          <EmptyState
            icon={<Wallet className="size-7" />}
            title="Você ainda não tem ganhos registrados"
            description="Seus repasses aparecem aqui quando uma parceria 50/50 é formalizada e o serviço é pago."
          />
        </Card>
      </>
    );
  }

  const columns: Column<Row>[] = [
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
    { key: "role", header: "Papel", hideSmall: true, render: (w) => <Badge tone={w.role === "parceiro" ? "accent" : "info"}>{w.role === "parceiro" ? "Parceiro" : "Iniciante"}</Badge> },
    { key: "serviceValue", header: "Valor do serviço", align: "right", hideSmall: true, sortValue: (w) => w.serviceValue, render: (w) => <span className="tabular-nums text-muted">{brl(w.serviceValue)}</span> },
    { key: "share", header: "Sua parte", align: "right", sortValue: (w) => w.share, render: (w) => <span className="font-semibold tabular-nums text-navy-900">{brl(w.share)}</span> },
    { key: "status", header: "Status", sortValue: (w) => w.status, render: (w) => <Badge tone={statusTone[w.status]} dot>{settlementLabel[w.status]}</Badge> },
    { key: "date", header: "Competência", align: "right", sortValue: (w) => w.date, render: (w) => <span className="text-muted">{formatDate(w.date)}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Meus ganhos"
        description="Acompanhe seus repasses pelos trabalhos prestados — divisão 50/50, já descontada a taxa de intermediação."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Financeiro" }]}
        meta={<Badge tone="success" icon={<TrendingUp className="size-3.5" />}>{brl(fin.recebido)} recebidos</Badge>}
        actions={
          <>
            <Button variant="outline" iconLeft={<Landmark className="size-4" />} onClick={() => toast("Dados bancários (demonstração).")}>Dados bancários</Button>
            <Button iconLeft={<Download className="size-4" />} onClick={() => toast("Extrato exportado.")}>Exportar extrato</Button>
          </>
        }
      />

      {/* KPIs */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Recebido" value={brl(fin.recebido)} icon={<CircleDollarSign className="size-4.5" />} hint="Repasses já liquidados" />
        <Stat label="A receber" value={brl(fin.aReceber)} icon={<Clock className="size-4.5" />} hint="Contratado, aguardando liquidação" />
        <Stat label="Pendente" value={brl(fin.pendente)} icon={<Handshake className="size-4.5" />} hint="Parcerias ainda em proposta" />
        <Stat label="Ganhos acumulados" value={brl(fin.total)} icon={<Wallet className="size-4.5" />} hint={`${fin.count} trabalhos · ticket ${brl(fin.ticketMedio)}`} />
      </motion.div>

      {/* Next payout + charts */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* next payout highlight */}
        <Card className="overflow-hidden">
          <div className="bg-navy-chrome px-5 py-4 text-white">
            <span className="inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-wide text-navy-200"><CalendarClock className="size-4" /> Próximo repasse</span>
          </div>
          <CardBody>
            {fin.nextPayout ? (
              <>
                <p className="font-serif text-[2rem] leading-none text-navy-900 tabular-nums">{brl(fin.nextPayout.value)}</p>
                <p className="mt-2 text-[0.88rem] text-ink-soft text-pretty">{fin.nextPayout.title}</p>
                <p className="mt-1 text-[0.8rem] text-muted">Previsto para {formatDate(fin.nextPayout.date)}</p>
                <div className="mt-4 rounded-lg bg-success-soft/60 px-3 py-2 text-[0.8rem] text-success-ink inline-flex items-center gap-2">
                  <ArrowUpRight className="size-4" /> {brl(fin.aReceber)} a receber no total
                </div>
              </>
            ) : (
              <p className="text-[0.88rem] text-muted">Nenhum repasse a receber no momento.</p>
            )}
          </CardBody>
        </Card>

        {/* monthly earnings */}
        <Card className="lg:col-span-2">
          <CardHeader title="Ganhos por mês" subtitle="Recebido e a receber (sua parte)" />
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fin.monthly} margin={{ left: -10, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.912 0.008 260)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "oklch(0.508 0.020 263)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "oklch(0.508 0.020 263)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip content={<MoneyTooltip />} cursor={{ fill: "oklch(0.972 0.012 255)" }} />
                <Bar dataKey="recebido" name="Recebido" stackId="a" fill={CHART.success} radius={[0, 0, 0, 0]} />
                <Bar dataKey="aReceber" name="A receber" stackId="a" fill={CHART.navy} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-1 flex justify-center gap-5 text-[0.78rem] text-muted">
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: CHART.success }} /> Recebido</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: CHART.navy }} /> A receber</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* By area + transactions */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Ganhos por área" subtitle="Sua parte por especialidade" />
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={fin.byArea} dataKey="value" nameKey="area" innerRadius={48} outerRadius={78} paddingAngle={2} stroke="none">
                  {fin.byArea.map((_, idx) => <Cell key={idx} fill={CHART.pie[idx % CHART.pie.length]} />)}
                </Pie>
                <Tooltip content={<MoneyTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 space-y-1.5">
              {fin.byArea.map((a, idx) => (
                <li key={a.area} className="flex items-center gap-2 text-[0.82rem]">
                  <span className="size-2.5 rounded-sm" style={{ background: CHART.pie[idx % CHART.pie.length] }} />
                  <span className="flex-1 text-ink-soft">{a.area}</span>
                  <span className="font-semibold tabular-nums text-navy-900">{brl(a.value)}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <div className="lg:col-span-2">
          <DataTable
            data={fin.works}
            columns={columns}
            getRowId={(w) => w.id}
            initialSort={{ key: "date", dir: "desc" }}
            pageSize={6}
            emptyTitle="Sem trabalhos"
            toolbar={<div className="flex items-center gap-2 text-[0.86rem] font-semibold text-navy-900"><Wallet className="size-4 text-navy-600" /> Extrato de trabalhos</div>}
          />
        </div>
      </div>

      <p className="mt-5 flex items-start gap-2 text-[0.8rem] text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-faint" />
        Os valores seguem a divisão 50/50 do líquido de cada serviço, já descontada a taxa de intermediação destinada ao custeio do projeto. Valores meramente demonstrativos.
      </p>
    </>
  );
}
