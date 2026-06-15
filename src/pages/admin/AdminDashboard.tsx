import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  Users,
  Briefcase,
  MessagesSquare,
  Star,
  Handshake,
  Sparkles,
  BadgeCheck,
  Download,
  ArrowRight,
  ArrowUpRight,
  Target,
  Activity,
  Check,
  Clock,
  Megaphone,
  ScrollText,
  FileText,
  BarChart3,
  KeyRound,
  SlidersHorizontal,
  ShieldCheck,
  UserPlus,
  ServerCog,
  Wallet,
  Landmark,
  HandCoins,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Stat } from "@/components/ui/Stat";
import { Progress } from "@/components/ui/Progress";
import { cn, timeAgo, brl } from "@/lib/utils";
import { platformFinance } from "@/data/finance";
import type { Goal, ActivityItem, SystemMetric } from "@/data/admin";

const NAVY = "oklch(0.396 0.078 261)";
const BORDO = "oklch(0.532 0.158 26)";
const SUCCESS = "oklch(0.524 0.108 158)";
const pieColors = [
  "oklch(0.396 0.078 261)",
  "oklch(0.532 0.158 26)",
  "oklch(0.524 0.108 158)",
  "oklch(0.706 0.132 74)",
  "oklch(0.546 0.108 248)",
];

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-md">
      {label && <p className="mb-1 text-[0.78rem] font-semibold text-navy-900">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-1.5 text-[0.78rem] text-ink-soft">
          <span className="size-2 rounded-full" style={{ background: p.color }} /> {p.name}: <strong className="text-navy-900">{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

/* ---- Goal formatting ----------------------------------------------------- */

function formatGoalValue(value: number, unit: Goal["unit"]): string {
  if (unit === "%") return `${value}%`;
  if (unit === "media") return value.toFixed(1);
  return value.toLocaleString("pt-BR");
}

function goalMet(g: Goal): boolean {
  return g.higherIsBetter ? g.current >= g.target : g.current <= g.target;
}

/* ---- Activity feed metadata ---------------------------------------------- */

const activityMeta: Record<ActivityItem["kind"], { icon: LucideIcon; cls: string }> = {
  cadastro: { icon: UserPlus, cls: "bg-info-soft text-info-ink" },
  atendimento: { icon: MessagesSquare, cls: "bg-navy-50 text-navy-700" },
  parceria: { icon: Handshake, cls: "bg-success-soft text-success-ink" },
  validacao: { icon: BadgeCheck, cls: "bg-success-soft text-success-ink" },
  ia: { icon: Sparkles, cls: "bg-bordo-50 text-bordo-700" },
  conflito: { icon: ShieldCheck, cls: "bg-warning-soft text-warning-ink" },
  sistema: { icon: ServerCog, cls: "bg-surface-2 text-ink-soft" },
};

/* ---- System-health status meta ------------------------------------------- */

const healthMeta: Record<SystemMetric["status"], { dot: string; text: string }> = {
  ok: { dot: "bg-success", text: "text-success-ink" },
  atencao: { dot: "bg-warning", text: "text-warning-ink" },
  critico: { dot: "bg-danger", text: "text-danger-ink" },
};

/* ---- Management quick-links ---------------------------------------------- */

const sections: { to: string; label: string; hint: string; icon: LucideIcon }[] = [
  { to: "/admin/usuarios", label: "Usuários", hint: "Contas, papéis e permissões", icon: Users },
  { to: "/admin/demandas", label: "Demandas", hint: "Casos publicados e matching", icon: Briefcase },
  { to: "/admin/atendimentos", label: "Atendimentos", hint: "Acompanhamento dos casos", icon: MessagesSquare },
  { to: "/admin/parcerias", label: "Parcerias", hint: "Termos 50/50 formalizados", icon: Handshake },
  { to: "/admin/avaliacoes", label: "Avaliações", hint: "Notas e moderação", icon: Star },
  { to: "/admin/financeiro", label: "Financeiro", hint: "Ganhos e repasses", icon: Wallet },
  { to: "/admin/validacoes", label: "Validações", hint: "Inscrições OAB e histórico", icon: BadgeCheck },
  { to: "/admin/revisao-ia", label: "Revisão de IA", hint: "Sinalizações para revisar", icon: Sparkles },
  { to: "/admin/conflitos", label: "Conflitos e ética", hint: "Denúncias e mediação", icon: ShieldCheck },
  { to: "/admin/comunicados", label: "Comunicados", hint: "Avisos e boletins", icon: Megaphone },
  { to: "/admin/relatorios", label: "Relatórios", hint: "Prestação de contas", icon: BarChart3 },
  { to: "/admin/metas", label: "Metas e indicadores", hint: "Acompanhar o projeto", icon: Target },
  { to: "/admin/permissoes", label: "Papéis e permissões", hint: "Matriz de capacidades", icon: KeyRound },
  { to: "/admin/configuracoes", label: "Configurações", hint: "Governança e segurança", icon: SlidersHorizontal },
  { to: "/admin/conteudos", label: "Conteúdos", hint: "Manual e materiais", icon: FileText },
  { to: "/admin/auditoria", label: "Auditoria", hint: "Trilha de ações", icon: ScrollText },
];

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ background: color }} /> {label}
    </span>
  );
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid size-7 place-items-center rounded-lg bg-navy-50 text-navy-700">{icon}</span>
      <h2 className="font-serif text-[1.15rem] text-navy-900">{title}</h2>
      {children}
    </div>
  );
}

export function AdminDashboard() {
  const { toast } = useApp();
  const { stats, goals, systemHealth, activityFeed, indicators } = useAdmin();
  const i = indicators;
  const fin = platformFinance();

  return (
    <>
      <PageHeader
        title="Painel de gestão"
        description="Visão geral da plataforma — acompanhe metas, saúde do sistema e a atividade recente, e acesse cada área da gestão."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Painel" }]}
        actions={
          <>
            {stats.pending > 0 && (
              <Link to="/admin/validacoes">
                <Button variant="outline" iconLeft={<BadgeCheck className="size-4" />}>
                  {stats.pending} validações
                </Button>
              </Link>
            )}
            <Button iconLeft={<Download className="size-4" />} onClick={() => toast("Relatório exportado (técnico + dados anonimizados).")}>
              Exportar relatório
            </Button>
          </>
        }
      />

      {/* (1) KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Advogados cadastrados" value={stats.totalLawyers.toLocaleString("pt-BR")} icon={<Users className="size-4.5" />} hint={`${i.lawyersByRole.iniciante} iniciantes · ${i.lawyersByRole.especialista} especialistas`} />
        <Stat label="Demandas ativas" value={stats.activeDemands} icon={<Briefcase className="size-4.5" />} hint="Em fila, matching ou andamento" />
        <Stat label="Atendimentos ativos" value={stats.activeServices} icon={<MessagesSquare className="size-4.5" />} trend={{ dir: "up", value: "+27%" }} />
        <Stat label="Parcerias formalizadas" value={stats.partnerships} icon={<Handshake className="size-4.5" />} hint="Termos 50/50 vigentes" />
        <Stat label="Avaliação média" value={stats.avgRating.toFixed(1)} icon={<Star className="size-4.5" />} goal={{ met: stats.avgRating >= 4, text: "Meta ≥ 4,0" }} />
        <Stat label="Taxa de conclusão" value={`${Math.round(stats.completionRate * 100)}%`} icon={<BadgeCheck className="size-4.5" />} goal={{ met: stats.completionRate > 0.8, text: "Meta > 80%" }} />
      </div>

      {/* Financial highlight band */}
      <Link to="/admin/financeiro" className="group mt-4 block">
        <div className="overflow-hidden rounded-xl bg-navy-chrome text-white shadow-sm transition-shadow hover:shadow-md">
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[0.74rem] font-semibold uppercase tracking-wide text-navy-200"><Wallet className="size-3.5" /> Volume transacionado</p>
                <p className="mt-1.5 font-serif text-[1.5rem] leading-none text-white tabular-nums">{brl(fin.volume)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4 sm:border-l sm:border-white/10">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[0.74rem] font-semibold uppercase tracking-wide text-navy-200"><Landmark className="size-3.5" /> Receita (intermediação)</p>
                <p className="mt-1.5 font-serif text-[1.5rem] leading-none text-white tabular-nums">{brl(fin.receita)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4 lg:border-l lg:border-white/10">
              <div>
                <p className="inline-flex items-center gap-1.5 text-[0.74rem] font-semibold uppercase tracking-wide text-navy-200"><HandCoins className="size-3.5" /> Repasse aos advogados</p>
                <p className="mt-1.5 font-serif text-[1.5rem] leading-none text-white tabular-nums">{brl(fin.repasse)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4 sm:border-l sm:border-white/10">
              <div>
                <p className="text-[0.74rem] font-semibold uppercase tracking-wide text-navy-200">A liquidar</p>
                <p className="mt-1.5 font-serif text-[1.5rem] leading-none text-white tabular-nums">{brl(fin.aReceber + fin.pendente)}</p>
              </div>
              <ArrowRight className="size-5 text-navy-200 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>

      {/* Charts */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Evolução mensal" subtitle="Cadastros, atendimentos e parcerias" />
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={i.monthly} margin={{ left: -18, right: 8, top: 4 }}>
                <defs>
                  <linearGradient id="gCad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={NAVY} stopOpacity={0.28} /><stop offset="100%" stopColor={NAVY} stopOpacity={0} /></linearGradient>
                  <linearGradient id="gAt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BORDO} stopOpacity={0.28} /><stop offset="100%" stopColor={BORDO} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.912 0.008 260)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "oklch(0.508 0.020 263)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "oklch(0.508 0.020 263)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="cadastros" name="Cadastros" stroke={NAVY} strokeWidth={2} fill="url(#gCad)" />
                <Area type="monotone" dataKey="atendimentos" name="Atendimentos" stroke={BORDO} strokeWidth={2} fill="url(#gAt)" />
                <Area type="monotone" dataKey="parcerias" name="Parcerias" stroke={SUCCESS} strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-[0.78rem] text-muted">
              <Legend color={NAVY} label="Cadastros" /><Legend color={BORDO} label="Atendimentos" /><Legend color={SUCCESS} label="Parcerias" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Demandas por área" subtitle="Distribuição temática" />
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={i.areaDistribution} dataKey="value" nameKey="area" innerRadius={50} outerRadius={80} paddingAngle={2} stroke="none">
                  {i.areaDistribution.map((_, idx) => <Cell key={idx} fill={pieColors[idx % pieColors.length]} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 space-y-1.5">
              {i.areaDistribution.map((a, idx) => (
                <li key={a.area} className="flex items-center gap-2 text-[0.82rem]">
                  <span className="size-2.5 rounded-sm" style={{ background: pieColors[idx % pieColors.length] }} />
                  <span className="flex-1 text-ink-soft">{a.area}</span>
                  <span className="font-semibold text-navy-900">{a.value}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Satisfação dos atendimentos" subtitle="Distribuição das notas (1–5)" />
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={i.satisfaction} margin={{ left: -18, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.912 0.008 260)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "oklch(0.508 0.020 263)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "oklch(0.508 0.020 263)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "oklch(0.972 0.012 255)" }} />
                <Bar dataKey="value" name="Avaliações" radius={[6, 6, 0, 0]} fill={NAVY} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* (3) System health */}
        <Card>
          <CardHeader icon={<Activity className="size-5" />} title="Saúde do sistema" subtitle="Monitoramento operacional" />
          <CardBody className="space-y-2.5 pt-0">
            {systemHealth.map((m) => {
              const meta = healthMeta[m.status];
              return (
                <div key={m.id} className="flex items-start gap-3 rounded-lg border border-line bg-surface-2/40 px-3.5 py-3">
                  <span className={cn("mt-1 size-2.5 shrink-0 rounded-full", meta.dot)} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[0.86rem] font-medium text-navy-900">{m.label}</p>
                      <span className={cn("shrink-0 text-[0.82rem] font-semibold tabular-nums", meta.text)}>{m.value}</span>
                    </div>
                    <p className="mt-0.5 text-[0.76rem] text-muted">{m.detail}</p>
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>

      {/* (2) Project goals */}
      <div className="mt-7">
        <Section icon={<Target className="size-4" />} title="Metas do projeto">
          <Link to="/admin/metas" className="ml-auto inline-flex items-center gap-1 text-[0.82rem] font-medium text-bordo-700 hover:underline">
            Ver detalhes <ArrowUpRight className="size-3.5" />
          </Link>
        </Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => {
            const met = goalMet(g);
            const pct = Math.min(100, (g.current / g.target) * 100);
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-line bg-surface p-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[0.88rem] font-medium text-navy-900">{g.label}</p>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold",
                      met ? "bg-success-soft text-success-ink" : "bg-warning-soft text-warning-ink",
                    )}
                  >
                    {met ? <Check className="size-3" /> : <Clock className="size-3" />}
                    {met ? "Atingida" : "Em curso"}
                  </span>
                </div>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="font-serif text-[1.5rem] leading-none text-navy-900 tabular-nums">{formatGoalValue(g.current, g.unit)}</span>
                  <span className="mb-0.5 text-[0.8rem] text-muted">/ {formatGoalValue(g.target, g.unit)} meta</span>
                </div>
                <Progress className="mt-3" value={pct} tone={met ? "success" : "navy"} showLabel />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* (4) Activity feed + (5) management quick-links */}
      <div className="mt-7 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader icon={<Activity className="size-5" />} title="Atividade recente" subtitle="Últimas ações na plataforma" />
          <CardBody className="pt-0">
            <ol className="space-y-1">
              {activityFeed.map((a) => {
                const meta = activityMeta[a.kind];
                const Icon = meta.icon;
                return (
                  <li key={a.id} className="flex gap-3 py-2">
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", meta.cls)}>
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.84rem] leading-snug text-ink-soft">
                        <strong className="font-semibold text-navy-900">{a.actor}</strong> {a.action}
                      </p>
                      <p className="mt-0.5 text-[0.74rem] text-faint">{timeAgo(a.at)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardBody>
        </Card>

        <div className="lg:col-span-2">
          <Section icon={<SlidersHorizontal className="size-4" />} title="Áreas de gestão">
            <span className="ml-auto text-[0.8rem] text-muted">{sections.length} seções</span>
          </Section>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-xs transition-colors hover:border-navy-300 hover:bg-navy-50/40"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700 transition-colors group-hover:bg-navy-100">
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-[0.88rem] font-semibold text-navy-900">
                      {s.label}
                      <ArrowRight className="size-3.5 -translate-x-1 text-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </p>
                    <p className="mt-0.5 text-[0.76rem] text-muted">{s.hint}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
