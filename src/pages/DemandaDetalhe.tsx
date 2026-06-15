import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Lock,
  Users,
  CircleAlert,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { demands, matches, services } from "@/data/mock";
import { lawyerById } from "@/data/lawyers";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Rating } from "@/components/ui/Rating";
import { Seal } from "@/components/ui/Seal";
import { Tabs } from "@/components/ui/Tabs";
import { AINotice } from "@/components/ui/AINotice";
import { EmptyState, KeyValue } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/StatusBadge";
import { demandStatusMeta, urgencyMeta, supportTypeLabel, candidateStatusMeta } from "@/lib/status";
import { formatDate, cn } from "@/lib/utils";
import type { MatchCandidate } from "@/data/types";

export function DemandaDetalhe() {
  const { id } = useParams();
  const { toast } = useApp();
  const nav = useNavigate();
  const demand = demands.find((d) => d.id === id);
  const [chosen, setChosen] = useState<string | null>(null);

  if (!demand) {
    return (
      <Card><EmptyState icon={<FileText className="size-7" />} title="Demanda não encontrada" action={<Link to="/app/demandas"><Button>Voltar às demandas</Button></Link>} /></Card>
    );
  }

  const match = matches.find((m) => m.demandId === demand.id);
  const svc = services.find((s) => s.demandId === demand.id);
  const accepted = match?.candidates.find((c) => c.status === "aceito");

  function choose(c: MatchCandidate) {
    const l = lawyerById(c.lawyerId);
    setChosen(c.lawyerId);
    toast(`${l?.name} foi notificado(a). Você será avisado(a) ao aceite.`);
  }

  const overview = (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <Card>
        <CardHeader title="Descrição do caso" />
        <CardBody className="pt-0">
          <p className="text-[0.92rem] leading-relaxed text-ink text-pretty">{demand.description}</p>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-4">
            <KeyValue label="Área">{demand.area}</KeyValue>
            <KeyValue label="Apoio">{supportTypeLabel[demand.supportType]}</KeyValue>
            <KeyValue label="Urgência">{urgencyMeta[demand.urgency].label.replace("Urgência ", "")}</KeyValue>
            <KeyValue label="Criada em">{formatDate(demand.createdAt)}</KeyValue>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Linha do tempo" />
        <CardBody className="pt-0">
          <ol className="relative ml-1 space-y-4 border-l border-line pl-5">
            {[
              { label: "Demanda publicada", done: true },
              { label: "Matching automatizado", done: demand.status !== "publicada" },
              { label: "Especialista aceitou", done: !!accepted },
              { label: "Em atendimento", done: demand.status === "em_atendimento" || demand.status === "concluida" },
              { label: "Concluída", done: demand.status === "concluida" },
            ].map((s) => (
              <li key={s.label} className="relative">
                <span className={cn("absolute -left-[1.62rem] top-0.5 grid size-4 place-items-center rounded-full border-2 bg-surface", s.done ? "border-navy-700" : "border-line-strong")}>
                  {s.done && <span className="size-2 rounded-full bg-navy-700" />}
                </span>
                <p className={cn("text-[0.86rem]", s.done ? "font-medium text-navy-900" : "text-muted")}>{s.label}</p>
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>
    </div>
  );

  const diagnostico = demand.diagnosis ? (
    <Card>
      <CardHeader icon={<Sparkles className="size-5" />} title="Relatório de necessidades" subtitle="Gerado por IA · confirmado pela autora" action={<Badge tone="success" icon={<CheckCircle2 className="size-3.5" />}>Confirmado</Badge>} />
      <CardBody className="space-y-5 pt-0">
        <AINotice sources={["Coleta conversacional", "Modelo de diagnóstico supervisionado"]}>Briefing acessível apenas às partes pareadas (LGPD).</AINotice>
        <div>
          <h4 className="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Síntese</h4>
          <p className="text-[0.92rem] text-ink leading-relaxed">{demand.diagnosis.oneLine}</p>
        </div>
        <div>
          <h4 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Fatos identificados</h4>
          <ul className="space-y-1.5">{demand.diagnosis.facts.map((f, i) => <li key={i} className="flex gap-2 text-[0.88rem] text-ink-soft"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-navy-400" />{f}</li>)}</ul>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Documentos sugeridos</h4>
            <ul className="space-y-1.5">{demand.diagnosis.documentsSuggested.map((d) => <li key={d} className="flex gap-2 text-[0.86rem] text-ink-soft"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-navy-400" />{d}</li>)}</ul>
          </div>
          <div>
            <h4 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Pontos de atenção</h4>
            <ul className="space-y-1.5">{demand.diagnosis.risks.map((r) => <li key={r} className="flex gap-2 text-[0.86rem] text-ink-soft"><CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" />{r}</li>)}</ul>
          </div>
        </div>
      </CardBody>
    </Card>
  ) : (
    <Card><EmptyState icon={<Sparkles className="size-7" />} title="Sem diagnóstico vinculado" description="Esta demanda não nasceu de um diagnóstico com IA." action={<Link to="/app/diagnostico"><Button variant="accent">Fazer diagnóstico</Button></Link>} /></Card>
  );

  const matching = (
    <div className="space-y-4">
      <AINotice title="Matching automatizado" sources={["Área e especialidade", "Histórico validado (RF-13)", "Avaliação média"]}>
        Advogados ordenados por compatibilidade com a demanda. Você escolhe quem prefere — eles aceitam ou recusam.
      </AINotice>
      {!match ? (
        <Card><EmptyState icon={<Users className="size-7" />} title="Matching em processamento" description="Assim que houver sugestões, elas aparecem aqui." /></Card>
      ) : (
        match.candidates.map((c, i) => {
          const l = lawyerById(c.lawyerId);
          if (!l) return null;
          const isAccepted = c.status === "aceito";
          const isChosen = chosen === c.lawyerId;
          return (
            <motion.div key={c.lawyerId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className={cn("overflow-hidden", isAccepted && "ring-1 ring-success/40", c.conflict && "opacity-75")}>
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  {/* score badge */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-1">
                    <div className={cn("grid size-16 place-items-center rounded-2xl text-white shadow-sm", i === 0 ? "bg-bordo-600" : "bg-navy-700")}>
                      <span className="font-serif text-[1.4rem] font-semibold leading-none">{c.score}</span>
                    </div>
                    <span className="text-[0.68rem] font-semibold uppercase tracking-wide text-muted">compatível</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Avatar name={l.name} size="sm" />
                      <Link to={`/app/perfil/${l.id}`} className="font-semibold text-navy-900 hover:underline">{l.name}</Link>
                      <Seal seal={l.seal} compact />
                      <StatusBadge meta={candidateStatusMeta[c.status]} />
                      {c.conflict && <Badge tone="danger" icon={<CircleAlert className="size-3" />}>Conflito de interesse</Badge>}
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-[0.82rem] text-muted">
                      <Rating value={l.rating} count={l.ratingCount} size={13} />
                      <span>·</span>
                      <span>{l.city}</span>
                    </div>
                    <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                      {c.reasons.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-[0.83rem] text-ink-soft"><ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:w-40">
                    {isAccepted ? (
                      <Link to={svc ? `/app/atendimento/${svc.id}` : "#"}><Button full size="sm" iconRight={<ArrowRight className="size-3.5" />}>Ir ao atendimento</Button></Link>
                    ) : c.conflict ? (
                      <Button full size="sm" variant="outline" disabled iconLeft={<Ban className="size-3.5" />}>Indisponível</Button>
                    ) : isChosen ? (
                      <Button full size="sm" variant="subtle" disabled iconLeft={<CheckCircle2 className="size-3.5" />}>Notificado</Button>
                    ) : (
                      <Button full size="sm" onClick={() => choose(c)}>Escolher</Button>
                    )}
                    <Link to={`/app/perfil/${l.id}`}><Button full size="sm" variant="ghost" iconLeft={<MessageSquare className="size-3.5" />}>Ver perfil</Button></Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })
      )}
    </div>
  );

  const documentos = (
    <Card>
      <CardHeader icon={<Lock className="size-5" />} title="Documentos da demanda" subtitle="Acesso restrito às partes envolvidas" />
      <CardBody className="pt-0">
        {demand.documents.length === 0 ? (
          <EmptyState icon={<FileText className="size-7" />} title="Nenhum documento anexado" />
        ) : (
          <ul className="space-y-2">
            {demand.documents.map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 rounded-lg border border-line bg-surface-2/40 px-3.5 py-3">
                <span className="grid size-9 place-items-center rounded-lg bg-navy-50 text-navy-600"><FileText className="size-4.5" /></span>
                <div className="flex-1"><p className="text-[0.88rem] font-medium text-navy-900">{doc.name}</p><p className="text-[0.76rem] text-muted">{doc.size}</p></div>
                {doc.restricted && <Badge tone="navy" icon={<Lock className="size-3" />}>Restrito</Badge>}
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );

  return (
    <>
      <PageHeader
        title={demand.title}
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Demandas", to: "/app/demandas" }, { label: demand.code }]}
        meta={
          <>
            <span className="font-mono text-[0.78rem] text-muted">{demand.code}</span>
            <StatusBadge meta={demandStatusMeta[demand.status]} />
            <StatusBadge meta={urgencyMeta[demand.urgency]} />
            <Badge tone="navy">{demand.area}</Badge>
          </>
        }
        actions={
          demand.status === "publicada" || demand.status === "em_matching" ? (
            <Button variant="outline" onClick={() => nav("/app/demandas")}>Editar demanda</Button>
          ) : svc ? (
            <Link to={`/app/atendimento/${svc.id}`}><Button iconRight={<ArrowRight className="size-4" />}>Ir ao atendimento</Button></Link>
          ) : undefined
        }
      />

      <Tabs
        items={[
          { id: "matching", label: "Matching", icon: <Users className="size-4" />, badge: match ? <Badge tone="accent">{match.candidates.length}</Badge> : undefined, content: matching },
          { id: "overview", label: "Visão geral", icon: <FileText className="size-4" />, content: overview },
          { id: "diag", label: "Diagnóstico", icon: <Sparkles className="size-4" />, content: diagnostico },
          { id: "docs", label: "Documentos", icon: <Lock className="size-4" />, content: documentos },
        ]}
        initial="matching"
      />
    </>
  );
}
