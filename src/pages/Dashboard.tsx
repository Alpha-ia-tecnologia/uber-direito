import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Briefcase,
  MessagesSquare,
  Handshake,
  ArrowRight,
  CalendarClock,
  Star,
  ShieldCheck,
  Search,
  FileCheck2,
  TrendingUp,
  Video,
  Wallet,
  CircleDollarSign,
  Clock,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { demands, services, matches, ratings } from "@/data/mock";
import { lawyerById } from "@/data/lawyers";
import { lawyerFinance } from "@/data/finance";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { Avatar } from "@/components/ui/Avatar";
import { Rating } from "@/components/ui/Rating";
import { Seal } from "@/components/ui/Seal";
import { Progress } from "@/components/ui/Progress";
import { StatusBadge } from "@/components/StatusBadge";
import { demandStatusMeta, urgencyMeta } from "@/lib/status";
import { formatDateTime, timeAgo, brl } from "@/lib/utils";

function FinanceTeaser({ lawyerId }: { lawyerId: string }) {
  const fin = lawyerFinance(lawyerId);
  if (fin.count === 0) return null;
  return (
    <Link to="/app/financeiro" className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="flex items-stretch">
          <div className="flex items-center gap-3 bg-navy-chrome px-5 py-4 text-white">
            <span className="grid size-10 place-items-center rounded-xl bg-white/10"><Wallet className="size-5" /></span>
            <div>
              <p className="text-[0.74rem] font-semibold uppercase tracking-wide text-navy-200">Meus ganhos</p>
              <p className="font-serif text-[1.05rem] leading-tight text-white">Financeiro</p>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 sm:grid-cols-3">
            <div className="flex flex-col justify-center px-4 py-3 border-r border-line">
              <p className="inline-flex items-center gap-1 text-[0.72rem] text-muted"><CircleDollarSign className="size-3" /> Recebido</p>
              <p className="font-serif text-[1.15rem] text-navy-900 tabular-nums">{brl(fin.recebido)}</p>
            </div>
            <div className="flex flex-col justify-center px-4 py-3 sm:border-r sm:border-line">
              <p className="inline-flex items-center gap-1 text-[0.72rem] text-muted"><Clock className="size-3" /> A receber</p>
              <p className="font-serif text-[1.15rem] text-navy-900 tabular-nums">{brl(fin.aReceber)}</p>
            </div>
            <div className="hidden sm:flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-[0.72rem] text-muted">Trabalhos</p>
                <p className="font-serif text-[1.15rem] text-navy-900 tabular-nums">{fin.count}</p>
              </div>
              <ArrowRight className="size-4.5 text-faint transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Product register: a quick, low-amplitude settle on arrival — not orchestrated choreography.
const stagger = { show: { transition: { staggerChildren: 0.045 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } } };

function QuickAction({ to, icon: Icon, title, desc, tone }: { to: string; icon: typeof Sparkles; title: string; desc: string; tone: "navy" | "accent" }) {
  return (
    <Link to={to} className="group">
      <Card className="h-full p-5 transition-all hover:border-navy-300 hover:shadow-md">
        <span className={tone === "accent" ? "grid size-11 place-items-center rounded-xl bg-bordo-50 text-bordo-600" : "grid size-11 place-items-center rounded-xl bg-navy-50 text-navy-700"}>
          <Icon className="size-5.5" strokeWidth={1.75} />
        </span>
        <h3 className="mt-4 flex items-center gap-1.5 text-[1rem] text-navy-900">
          {title}
          <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </h3>
        <p className="mt-1 text-[0.85rem] text-muted text-pretty">{desc}</p>
      </Card>
    </Link>
  );
}

function IniciateDashboard() {
  const { user } = useApp();
  const myDemands = demands.filter((d) => d.authorId === user.id);
  const active = myDemands.find((d) => d.status === "em_atendimento");
  const svc = active ? services.find((s) => s.demandId === active.id) : undefined;
  const specialist = svc ? lawyerById(svc.specialistId) : undefined;
  const nextSession = svc?.sessions.find((s) => s.status === "agendada");
  const doneMs = svc ? svc.milestones.filter((m) => m.done).length : 0;
  const totalMs = svc ? svc.milestones.length : 1;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-7">
      {active && svc && specialist && (
        <motion.div variants={item}>
          <Card elevated className="overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <StatusBadge meta={demandStatusMeta[active.status]} />
                  <StatusBadge meta={urgencyMeta[active.urgency]} />
                </div>
                <h2 className="mt-3 font-serif text-[1.35rem] text-navy-900">{active.title}</h2>
                <p className="mt-1.5 text-[0.88rem] text-muted">{active.code} · {active.area}</p>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-surface-2/50 p-3.5">
                  <Avatar name={specialist.name} size="md" ring />
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.9rem] font-semibold text-navy-900">{specialist.name}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <Rating value={specialist.rating} size={13} />
                      <Seal seal={specialist.seal} compact />
                    </div>
                  </div>
                  <Link to={`/app/atendimento/${svc.id}`}>
                    <Button size="sm" variant="outline" iconRight={<ArrowRight className="size-3.5" />}>Abrir</Button>
                  </Link>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-[0.82rem]">
                    <span className="font-medium text-ink-soft">Progresso do atendimento</span>
                    <span className="text-muted">{doneMs} de {totalMs} marcos</span>
                  </div>
                  <Progress value={(doneMs / totalMs) * 100} tone="accent" />
                </div>
              </div>

              <div className="bg-navy-chrome p-6 text-white flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-wide text-navy-200">
                    <CalendarClock className="size-4" /> Próxima sessão
                  </span>
                  {nextSession ? (
                    <>
                      <p className="mt-3 font-serif text-[1.1rem] text-white text-balance">{nextSession.title}</p>
                      <p className="mt-1.5 text-[0.86rem] text-navy-100">{formatDateTime(nextSession.scheduledAt)}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <Badge tone="info" className="bg-white/10 text-white border-white/15">Online · {nextSession.durationMin} min</Badge>
                        {nextSession.captions && <Badge tone="info" className="bg-white/10 text-white border-white/15">Legendas</Badge>}
                      </div>
                    </>
                  ) : (
                    <p className="mt-3 text-[0.88rem] text-navy-100">Nenhuma sessão agendada.</p>
                  )}
                </div>
                {nextSession && (
                  <Link to={`/app/video/${nextSession.id}`} className="mt-5">
                    <Button variant="accent" full iconLeft={<Video className="size-4" />}>Entrar na sala</Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div variants={item}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction to="/app/diagnostico" icon={Sparkles} title="Diagnóstico com IA" desc="Organize um novo caso em um briefing claro." tone="accent" />
          <QuickAction to="/app/demandas/nova" icon={Briefcase} title="Nova demanda" desc="Publique uma necessidade e receba sugestões." tone="navy" />
          <QuickAction to="/app/atendimentos" icon={MessagesSquare} title="Atendimentos" desc="Converse com seu especialista." tone="navy" />
          <QuickAction to="/app/parcerias" icon={Handshake} title="Parcerias" desc="Acompanhe seus termos 50/50." tone="navy" />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <FinanceTeaser lawyerId={user.id} />
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        <Stat label="Demandas ativas" value={myDemands.filter((d) => d.status !== "concluida" && d.status !== "cancelada").length} icon={<Briefcase className="size-4.5" />} hint="Em matching ou atendimento" />
        <Stat label="Atendimentos" value={services.filter((s) => s.initiateId === user.id).length} icon={<MessagesSquare className="size-4.5" />} hint="Total na plataforma" />
        <Stat label="Sua avaliação" value={user.rating.toFixed(1)} icon={<Star className="size-4.5" />} hint={`${user.ratingCount} avaliações recebidas`} />
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader title="Minhas demandas" subtitle="Histórico completo dos seus casos" action={<Link to="/app/demandas"><Button size="sm" variant="ghost" iconRight={<ArrowRight className="size-3.5" />}>Ver todas</Button></Link>} />
          <CardBody className="pt-0">
            <ul className="divide-y divide-line">
              {myDemands.map((d) => (
                <li key={d.id}>
                  <Link to={`/app/demandas/${d.id}`} className="flex items-center gap-4 py-3.5 transition-colors hover:bg-navy-50/40 -mx-2 px-2 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-navy-900 truncate">{d.title}</p>
                      <p className="text-[0.8rem] text-muted">{d.code} · {d.area} · {timeAgo(d.createdAt)}</p>
                    </div>
                    <StatusBadge meta={demandStatusMeta[d.status]} />
                  </Link>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function SpecialistDashboard() {
  const { user } = useApp();
  const myOpportunities = matches
    .flatMap((m) => m.candidates.filter((c) => c.lawyerId === user.id).map((c) => ({ ...c, demandId: m.demandId })))
    .map((c) => ({ ...c, demand: demands.find((d) => d.id === c.demandId)! }))
    .filter((c) => c.demand);
  const topOpp = myOpportunities.find((o) => o.status === "notificado") ?? myOpportunities[0];
  const myRatings = ratings.filter((r) => r.toId === user.id);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-7">
      <motion.div variants={item} className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {topOpp && (
          <Card elevated className="overflow-hidden">
            <div className="bg-navy-chrome px-6 py-4 text-white flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-wide text-navy-100"><Search className="size-4" /> Oportunidade em destaque</span>
              <span className="rounded-full bg-bordo-500 px-2.5 py-0.5 text-[0.74rem] font-bold">{topOpp.score}% compatível</span>
            </div>
            <CardBody className="pt-5">
              <div className="flex items-center gap-2">
                <StatusBadge meta={urgencyMeta[topOpp.demand.urgency]} />
                <Badge tone="navy">{topOpp.demand.area}</Badge>
              </div>
              <h2 className="mt-3 font-serif text-[1.3rem] text-navy-900">{topOpp.demand.title}</h2>
              <p className="mt-1.5 text-[0.88rem] text-muted text-pretty">{topOpp.demand.description}</p>
              <ul className="mt-4 space-y-1.5">
                {topOpp.reasons.slice(0, 3).map((r) => (
                  <li key={r} className="flex items-start gap-2 text-[0.85rem] text-ink-soft"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" /> {r}</li>
                ))}
              </ul>
              <div className="mt-5 flex gap-3">
                <Link to="/app/oportunidades" className="flex-1"><Button full iconRight={<ArrowRight className="size-4" />}>Ver oportunidade</Button></Link>
              </div>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardBody className="text-center pt-6">
            <Avatar name={user.name} size="xl" className="mx-auto" ring />
            <h3 className="mt-3 font-serif text-[1.15rem] text-navy-900">{user.name}</h3>
            <p className="text-[0.82rem] text-muted">{user.oab} · {user.city}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Rating value={user.rating} count={user.ratingCount} />
            </div>
            <div className="mt-3 flex justify-center"><Seal seal={user.seal} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-left">
              <div>
                <p className="text-[0.72rem] uppercase tracking-wide text-faint">Taxa de conclusão</p>
                <p className="font-serif text-[1.2rem] text-navy-900">{Math.round(user.completionRate * 100)}%</p>
              </div>
              <div>
                <p className="text-[0.72rem] uppercase tracking-wide text-faint">Áreas validadas</p>
                <p className="font-serif text-[1.2rem] text-navy-900">{user.indicators.length}</p>
              </div>
            </div>
            <Link to="/app/perfil" className="mt-4 block"><Button variant="outline" full size="sm">Ver meu perfil</Button></Link>
          </CardBody>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <FinanceTeaser lawyerId={user.id} />
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Oportunidades" value={myOpportunities.length} icon={<Search className="size-4.5" />} hint="Compatíveis com você" />
        <Stat label="Atendimentos ativos" value={services.filter((s) => s.specialistId === user.id && s.status !== "concluido").length} icon={<MessagesSquare className="size-4.5" />} />
        <Stat label="Avaliação média" value={user.rating.toFixed(1)} icon={<Star className="size-4.5" />} goal={{ met: user.rating >= 4, text: "Acima da meta (≥4,0)" }} />
        <Stat label="Taxa de conclusão" value={`${Math.round(user.completionRate * 100)}%`} icon={<TrendingUp className="size-4.5" />} goal={{ met: user.completionRate > 0.8, text: "Acima da meta (>80%)" }} />
      </motion.div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader icon={<FileCheck2 className="size-5" />} title="Histórico validado" subtitle="Indicadores por área (DataJud/CNJ)" action={<Link to="/app/historico"><Button size="sm" variant="ghost" iconRight={<ArrowRight className="size-3.5" />}>Detalhes</Button></Link>} />
          <CardBody className="pt-0 space-y-3">
            {user.indicators.map((ind) => (
              <div key={ind.area}>
                <div className="mb-1 flex items-center justify-between text-[0.84rem]">
                  <span className="font-medium text-ink-soft">{ind.area}</span>
                  <span className="text-muted">{ind.successfulActions}/{ind.totalProcesses} exitosas</span>
                </div>
                <Progress value={(ind.successfulActions / ind.totalProcesses) * 100} tone="success" />
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={<Star className="size-5" />} title="Avaliações recentes" subtitle="O que os colegas dizem" action={<Link to="/app/avaliacoes"><Button size="sm" variant="ghost" iconRight={<ArrowRight className="size-3.5" />}>Ver todas</Button></Link>} />
          <CardBody className="pt-0">
            {myRatings.length === 0 ? (
              <p className="py-4 text-center text-[0.86rem] text-muted">Ainda sem avaliações.</p>
            ) : (
              <ul className="space-y-3">
                {myRatings.map((r) => {
                  const from = lawyerById(r.fromId);
                  return (
                    <li key={r.id} className="rounded-lg border border-line bg-surface-2/40 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.85rem] font-medium text-navy-900">{from?.name ?? "Colega"}</span>
                        <Rating value={r.score} size={13} />
                      </div>
                      <p className="mt-1 text-[0.84rem] text-muted">“{r.comment}”</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function Dashboard() {
  const { user, activeRole } = useApp();

  if (activeRole === "admin") return <Navigate to="/admin" replace />;

  const isSpecialist = activeRole === "especialista" || activeRole === "parceiro";
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={`Olá, ${firstName}`}
        description={
          isSpecialist
            ? "Veja as oportunidades compatíveis com sua atuação e acompanhe seus atendimentos."
            : "Acompanhe seus casos, fale com especialistas e dê o próximo passo com segurança."
        }
      />
      {isSpecialist ? <SpecialistDashboard /> : <IniciateDashboard />}
    </>
  );
}
