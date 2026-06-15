import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Send,
  Video,
  CalendarPlus,
  CheckCircle2,
  Circle,
  Flag,
  Paperclip,
  ArrowLeft,
  Star,
  CalendarClock,
  Captions,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { services, demands } from "@/data/mock";
import { lawyerById } from "@/data/lawyers";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Misc";
import { Field, Input, Select } from "@/components/ui/Field";
import { formatDateTime, timeAgo, cn } from "@/lib/utils";
import type { ChatMessage } from "@/data/types";

export function AtendimentoDetalhe() {
  const { id } = useParams();
  const { user, toast } = useApp();
  const nav = useNavigate();
  const base = services.find((s) => s.id === id);

  const [msgs, setMsgs] = useState<ChatMessage[]>(base?.messages ?? []);
  const [draft, setDraft] = useState("");
  const [concluded, setConcluded] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [milestones, setMilestones] = useState(base?.milestones ?? []);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  if (!base) {
    return <Card><EmptyState title="Atendimento não encontrado" action={<Link to="/app/atendimentos"><Button>Voltar</Button></Link>} /></Card>;
  }

  const demand = demands.find((d) => d.id === base.demandId);
  const other = lawyerById(base.initiateId === user.id ? base.specialistId : base.initiateId);
  const session = base.sessions[0];

  function send() {
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { id: `local-${m.length}`, fromId: user.id, body: draft.trim(), at: new Date().toISOString() }]);
    setDraft("");
    // simulate a reply
    setTimeout(() => {
      setMsgs((m) => [...m, { id: `reply-${m.length}`, fromId: other?.id ?? "x", body: "Recebido! Já reviso e te respondo em seguida.", at: new Date().toISOString() }]);
    }, 1600);
  }

  function toggleMilestone(mid: string) {
    setMilestones((ms) => ms.map((m) => (m.id === mid ? { ...m, done: !m.done } : m)));
  }

  function conclude() {
    setConcluded(true);
    setMsgs((m) => [...m, { id: "sys-end", fromId: "sys", body: "Atendimento concluído. Avaliem-se mutuamente para encerrar.", at: new Date().toISOString(), system: true }]);
    toast("Atendimento concluído. Que tal avaliar?");
  }

  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => nav("/app/atendimentos")} className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-muted hover:text-navy-700" aria-label="Voltar"><ArrowLeft className="size-4.5" /></button>
        <div className="min-w-0">
          <h1 className="font-serif text-[1.4rem] text-navy-900 truncate">{demand?.title}</h1>
          <p className="text-[0.8rem] text-muted">{demand?.code} · {demand?.area}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {concluded ? <Badge tone="success" icon={<CheckCircle2 className="size-3.5" />}>Concluído</Badge> : <Badge tone="accent" dot>Em andamento</Badge>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Chat */}
        <Card className="flex h-[36rem] flex-col">
          <div className="flex items-center gap-3 border-b border-line px-5 py-3">
            <Avatar name={other?.name ?? "?"} size="sm" ring />
            <div className="flex-1">
              <p className="text-[0.9rem] font-semibold text-navy-900">{other?.name}</p>
              <p className="text-[0.74rem] text-success-ink inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-success" /> Online</p>
            </div>
            {session && (
              <Link to={`/app/video/${session.id}`}><Button size="sm" variant="outline" iconLeft={<Video className="size-3.5" />}>Entrar na sala</Button></Link>
            )}
          </div>

          <div className="flex-1 space-y-3.5 overflow-y-auto px-5 py-5">
            {msgs.map((m) => {
              if (m.system) return <div key={m.id} className="flex justify-center"><span className="rounded-full bg-navy-50 px-3 py-1 text-[0.76rem] text-muted">{m.body}</span></div>;
              const mine = m.fromId === user.id;
              const author = lawyerById(m.fromId);
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-2.5", mine && "flex-row-reverse")}>
                  <Avatar name={author?.name ?? "?"} size="xs" />
                  <div className={cn("max-w-[78%]")}>
                    <div className={cn("rounded-2xl px-3.5 py-2.5 text-[0.88rem] leading-relaxed", mine ? "bg-navy-700 text-white rounded-tr-sm" : "bg-navy-50 text-ink rounded-tl-sm")}>{m.body}</div>
                    <span className={cn("mt-1 block text-[0.7rem] text-faint", mine && "text-right")}>{timeAgo(m.at)}</span>
                  </div>
                </motion.div>
              );
            })}
            <div ref={endRef} />
          </div>

          <div className="border-t border-line px-4 py-3">
            <div className="flex items-end gap-2">
              <button className="grid size-10 shrink-0 place-items-center rounded-lg text-muted hover:bg-navy-50 hover:text-navy-700" aria-label="Anexar"><Paperclip className="size-5" /></button>
              <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Escreva uma mensagem…" className="h-11" />
              <Button onClick={send} disabled={!draft.trim()} className="shrink-0" iconRight={<Send className="size-4" />}>Enviar</Button>
            </div>
          </div>
        </Card>

        {/* Side rail */}
        <div className="space-y-4">
          {/* Session */}
          {session && (
            <Card>
              <CardHeader icon={<CalendarClock className="size-5" />} title="Videoconferência" subtitle="Plataforma própria (modelo Jitsi)" />
              <CardBody className="pt-0">
                <p className="font-serif text-[1rem] text-navy-900">{session.title}</p>
                <p className="mt-1 text-[0.84rem] text-muted">{formatDateTime(session.scheduledAt)} · {session.durationMin} min</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <Badge tone="navy">Online</Badge>
                  {session.captions && <Badge tone="info" icon={<Captions className="size-3" />}>Legendas automáticas</Badge>}
                  {session.recordingConsent && <Badge tone="success" icon={<ShieldCheck className="size-3" />}>Gravação consentida</Badge>}
                </div>
                <Link to={`/app/video/${session.id}`} className="mt-4 block"><Button full iconLeft={<Video className="size-4" />}>Entrar na sala</Button></Link>
                <Button variant="ghost" full size="sm" className="mt-2" iconLeft={<CalendarPlus className="size-4" />} onClick={() => setScheduleOpen(true)}>Agendar nova sessão</Button>
              </CardBody>
            </Card>
          )}

          {/* Milestones (RF-33, RF-35) */}
          <Card>
            <CardHeader icon={<Flag className="size-5" />} title="Marcos do atendimento" subtitle="Registro do progresso" />
            <CardBody className="pt-0">
              <ul className="space-y-1">
                {milestones.map((m) => (
                  <li key={m.id}>
                    <button onClick={() => toggleMilestone(m.id)} className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-navy-50/50">
                      {m.done ? <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-success" /> : <Circle className="mt-0.5 size-4.5 shrink-0 text-line-strong" />}
                      <span className="flex-1">
                        <span className={cn("block text-[0.85rem]", m.done ? "text-navy-900 font-medium" : "text-ink-soft")}>{m.label}</span>
                        {m.at && <span className="block text-[0.74rem] text-faint">{formatDateTime(m.at)}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Conclude / evaluate */}
          <Card>
            <CardBody>
              {!concluded ? (
                <>
                  <h3 className="text-[0.95rem] text-navy-900">Encerrar atendimento</h3>
                  <p className="mt-1 text-[0.84rem] text-muted text-pretty">Ao concluir, registramos o encerramento (compõe a taxa de conclusão &gt; 80%) e abrimos a avaliação mútua.</p>
                  <Button full className="mt-3" variant="accent" iconRight={<CheckCircle2 className="size-4" />} onClick={conclude}>Concluir atendimento</Button>
                </>
              ) : (
                <>
                  <h3 className="text-[0.95rem] text-navy-900">Atendimento concluído</h3>
                  <p className="mt-1 text-[0.84rem] text-muted">Avalie sua experiência para encerrar o ciclo.</p>
                  <Link to="/app/avaliacoes" className="mt-3 block"><Button full iconRight={<Star className="size-4" />}>Avaliar</Button></Link>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Agendar sessão"
        description="Sessões presenciais, online ou híbridas (modalidade híbrida do projeto)."
        footer={<><Button variant="ghost" onClick={() => setScheduleOpen(false)}>Cancelar</Button><Button onClick={() => { setScheduleOpen(false); toast("Sessão agendada e adicionada ao atendimento."); }} iconRight={<CalendarPlus className="size-4" />}>Agendar</Button></>}
      >
        <div className="space-y-4">
          <Field label="Título da sessão"><Input defaultValue="Devolutiva — revisão da petição" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Data"><Input type="date" defaultValue="2026-06-22" /></Field>
            <Field label="Horário"><Input type="time" defaultValue="16:00" /></Field>
          </div>
          <Field label="Modalidade">
            <Select defaultValue="online"><option value="online">Online</option><option value="presencial">Presencial</option><option value="hibrido">Híbrida</option></Select>
          </Field>
        </div>
      </Modal>
    </>
  );
}
