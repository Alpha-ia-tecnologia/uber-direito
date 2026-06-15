import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  ShieldAlert,
  CheckCircle2,
  Pencil,
  FileText,
  ArrowRight,
  RotateCcw,
  Scale,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AINotice } from "@/components/ui/AINotice";
import { Avatar } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Field";
import { cn } from "@/lib/utils";
import type { LegalArea, SupportType, Urgency } from "@/data/types";

type Msg = { id: number; from: "ai" | "user"; text: string };

const areas: LegalArea[] = [
  "Direito do Trabalho",
  "Direito de Família",
  "Direito do Consumidor",
  "Direito Previdenciário",
  "Direito Civil",
  "Direito Penal",
];

interface Answers {
  area?: LegalArea;
  description?: string;
  support?: SupportType;
  urgency?: Urgency;
}

const TypingDots = () => (
  <span className="inline-flex items-center gap-1 px-1" aria-label="digitando">
    {[0, 1, 2].map((i) => (
      <span key={i} className="size-1.5 rounded-full bg-navy-400" style={{ animation: "typing-dot 1.2s infinite", animationDelay: `${i * 0.18}s` }} />
    ))}
  </span>
);

export function Diagnostico() {
  const { user, toast } = useApp();
  const nav = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [draft, setDraft] = useState("");
  const [phase, setPhase] = useState<"chat" | "generating" | "report">("chat");
  const [confirmed, setConfirmed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const nextId = () => ++idRef.current;

  function aiSay(text: string, delay = 700) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: nextId(), from: "ai", text }]);
    }, delay);
  }

  // kick off
  useEffect(() => {
    const t: number[] = [];
    setTyping(true);
    t.push(
      window.setTimeout(() => {
        setTyping(false);
        setMessages([{ id: nextId(), from: "ai", text: "Olá! Sou o assistente de diagnóstico da plataforma. Vou organizar a necessidade do seu caso em um relatório claro para um advogado especialista. Importante: não presto orientação jurídica — apenas ajudo a estruturar a demanda." }]);
      }, 700),
    );
    t.push(window.setTimeout(() => setTyping(true), 1500));
    t.push(
      window.setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: nextId(), from: "ai", text: "Para começar: qual é a área do direito do caso?" }]);
        setStep(1);
      }, 2400),
    );
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, phase]);

  function userSay(text: string) {
    setMessages((m) => [...m, { id: nextId(), from: "user", text }]);
  }

  function pickArea(a: LegalArea) {
    userSay(a);
    setAnswers((s) => ({ ...s, area: a }));
    setStep(0);
    aiSay("Entendi. Agora, descreva o caso com suas palavras: o que aconteceu, há quanto tempo e o que a pessoa deseja.", 600);
    setTimeout(() => setStep(2), 800);
  }

  function submitDescription() {
    if (draft.trim().length < 10) return;
    userSay(draft.trim());
    setAnswers((s) => ({ ...s, description: draft.trim() }));
    setDraft("");
    setStep(0);
    aiSay("Obrigado pelo contexto. Que tipo de apoio você procura para este caso?", 600);
    setTimeout(() => setStep(3), 800);
  }

  function pickSupport(s: SupportType) {
    userSay(s === "humanizado" ? "Apoio humanizado (mentoria)" : "Parceria 50/50");
    setAnswers((a) => ({ ...a, support: s }));
    setStep(0);
    aiSay("Certo. E qual é a urgência?", 600);
    setTimeout(() => setStep(4), 800);
  }

  function pickUrgency(u: Urgency) {
    userSay(u === "alta" ? "Alta" : u === "media" ? "Média" : "Baixa");
    setAnswers((a) => ({ ...a, urgency: u }));
    setStep(0);
    aiSay("Perfeito. Tenho o suficiente para gerar o relatório de necessidades. Um instante…", 600);
    setTimeout(() => setPhase("generating"), 1500);
    setTimeout(() => setPhase("report"), 4200);
  }

  function restart() {
    setMessages([]);
    setStep(0);
    setAnswers({});
    setPhase("chat");
    setConfirmed(false);
    idRef.current = 0;
    aiSay("Vamos recomeçar. Qual é a área do direito do caso?", 500);
    setTimeout(() => setStep(1), 700);
  }

  return (
    <>
      <PageHeader
        title="Diagnóstico com IA"
        description="Um agente conversacional organiza a necessidade do seu caso em um briefing estruturado para o especialista."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Diagnóstico com IA" }]}
        meta={<Badge tone="navy" icon={<Sparkles className="size-3.5" />}>Agente de IA · supervisão humana</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Conversation / report column */}
        <div>
          {phase !== "report" ? (
            <Card className="flex h-[34rem] flex-col">
              {/* chat header */}
              <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
                <span className="grid size-9 place-items-center rounded-full bg-navy-700 text-white"><Sparkles className="size-4.5" /></span>
                <div>
                  <p className="text-[0.92rem] font-semibold text-navy-900">Assistente de diagnóstico</p>
                  <p className="text-[0.74rem] text-success-ink inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-success" /> Online</p>
                </div>
              </div>

              {/* messages */}
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className={cn("flex gap-2.5", m.from === "user" && "flex-row-reverse")}
                  >
                    {m.from === "ai" ? (
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy-700 text-white"><Sparkles className="size-4" /></span>
                    ) : (
                      <Avatar name={user.name} size="xs" />
                    )}
                    <div className={cn("max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[0.88rem] leading-relaxed", m.from === "ai" ? "bg-navy-50 text-ink rounded-tl-sm" : "bg-navy-700 text-white rounded-tr-sm")}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <div className="flex gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy-700 text-white"><Sparkles className="size-4" /></span>
                    <div className="rounded-2xl rounded-tl-sm bg-navy-50 px-3 py-3"><TypingDots /></div>
                  </div>
                )}
                {phase === "generating" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-navy-200 bg-navy-50/70 p-4">
                    <div className="flex items-center gap-2 text-navy-700"><Sparkles className="size-4 animate-pulse" /><span className="text-[0.85rem] font-semibold">Gerando relatório de necessidades…</span></div>
                    <div className="mt-3 space-y-2">
                      {["Identificando os fatos relevantes", "Sugerindo documentos a reunir", "Sinalizando pontos de atenção", "Estruturando o briefing"].map((t, i) => (
                        <motion.div key={t} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.7 }} className="flex items-center gap-2 text-[0.82rem] text-ink-soft">
                          <CheckCircle2 className="size-4 text-success" /> {t}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={endRef} />
              </div>

              {/* input / quick replies */}
              <div className="border-t border-line px-5 py-4">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="area" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-2">
                      {areas.map((a) => (
                        <button key={a} onClick={() => pickArea(a)} className="rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-[0.84rem] text-ink-soft transition-colors hover:border-navy-500 hover:bg-navy-50">{a}</button>
                      ))}
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-end gap-2">
                      <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Descreva o caso…" className="min-h-12" rows={2} onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitDescription(); }} />
                      <Button onClick={submitDescription} disabled={draft.trim().length < 10} iconRight={<Send className="size-4" />} className="shrink-0">Enviar</Button>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="sup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-2">
                      <button onClick={() => pickSupport("humanizado")} className="flex-1 rounded-lg border border-line-strong bg-surface px-4 py-3 text-left transition-colors hover:border-navy-500 hover:bg-navy-50"><span className="block text-[0.88rem] font-semibold text-navy-900">Apoio humanizado</span><span className="block text-[0.78rem] text-muted">Mentoria de um especialista</span></button>
                      <button onClick={() => pickSupport("parceria")} className="flex-1 rounded-lg border border-line-strong bg-surface px-4 py-3 text-left transition-colors hover:border-bordo-500 hover:bg-bordo-50"><span className="block text-[0.88rem] font-semibold text-navy-900">Parceria 50/50</span><span className="block text-[0.78rem] text-muted">Atuação conjunta com divisão</span></button>
                    </motion.div>
                  )}
                  {step === 4 && (
                    <motion.div key="urg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                      {(["baixa", "media", "alta"] as Urgency[]).map((u) => (
                        <button key={u} onClick={() => pickUrgency(u)} className="flex-1 rounded-full border border-line-strong bg-surface px-3 py-2 text-[0.84rem] capitalize text-ink-soft transition-colors hover:border-navy-500 hover:bg-navy-50">{u === "media" ? "Média" : u}</button>
                      ))}
                    </motion.div>
                  )}
                  {step === 0 && phase === "chat" && (
                    <p className="text-center text-[0.78rem] text-faint">O assistente está conduzindo a conversa…</p>
                  )}
                  {phase === "generating" && <p className="text-center text-[0.78rem] text-faint">Aguarde o relatório…</p>}
                </AnimatePresence>
              </div>
            </Card>
          ) : (
            <GeneratedReport answers={answers} confirmed={confirmed} onConfirm={() => { setConfirmed(true); toast("Relatório confirmado. Pronto para publicar a demanda."); }} onPublish={() => nav("/app/demandas/nova")} onRestart={restart} />
          )}
        </div>

        {/* Side rail */}
        <div className="space-y-4">
          <Card>
            <CardBody>
              <h3 className="flex items-center gap-2 text-[0.95rem] text-navy-900"><ShieldAlert className="size-4.5 text-navy-600" /> Como a IA é usada aqui</h3>
              <ul className="mt-3 space-y-2.5 text-[0.84rem] text-ink-soft">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> Organiza e entende a necessidade — não dá orientação jurídica.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> Encaminha sempre ao advogado humano.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> Você revisa, edita e confirma antes de compartilhar.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> O relatório fica acessível apenas às partes pareadas (LGPD).</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-[0.95rem] text-navy-900">Resumo coletado</h3>
              <dl className="mt-3 space-y-2.5 text-[0.85rem]">
                <Row label="Área" value={answers.area} />
                <Row label="Apoio" value={answers.support ? (answers.support === "humanizado" ? "Humanizado" : "Parceria 50/50") : undefined} />
                <Row label="Urgência" value={answers.urgency ? (answers.urgency === "media" ? "Média" : answers.urgency.charAt(0).toUpperCase() + answers.urgency.slice(1)) : undefined} />
              </dl>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={cn("font-medium", value ? "text-navy-900" : "text-faint")}>{value ?? "—"}</dd>
    </div>
  );
}

function GeneratedReport({ answers, confirmed, onConfirm, onPublish, onRestart }: { answers: Answers; confirmed: boolean; onConfirm: () => void; onPublish: () => void; onRestart: () => void }) {
  const area = answers.area ?? "Direito do Trabalho";
  const oneLine = `Caso de ${area.toLowerCase()} com pedido de ${answers.support === "parceria" ? "atuação em parceria" : "apoio especializado"}, de urgência ${answers.urgency === "media" ? "média" : answers.urgency ?? "média"}.`;

  const facts = [
    answers.description ?? "Relato do caso registrado pela advogada solicitante.",
    "Vínculo/relação descrita pela parte interessada.",
    "Linha do tempo dos fatos relevantes a confirmar com documentos.",
  ];
  const docs = ["Documentos de identificação das partes", "Contratos ou comprovantes relacionados", "Mensagens, e-mails ou provas do alegado", "Comprovantes de datas e valores"];
  const risks = ["Confirmar prazos e eventual prescrição.", "Reunir provas antes de qualquer medida.", "Avaliar tentativa de acordo conforme o caso."];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      <Card elevated>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-navy-700 text-white"><FileText className="size-5" /></span>
            <div>
              <h2 className="font-serif text-[1.2rem] text-navy-900">Relatório de necessidades</h2>
              <p className="text-[0.78rem] text-muted">Gerado por IA · revise antes de publicar</p>
            </div>
          </div>
          {confirmed ? <Badge tone="success" icon={<CheckCircle2 className="size-3.5" />}>Confirmado</Badge> : <Badge tone="warning" icon={<Pencil className="size-3.5" />}>Rascunho</Badge>}
        </div>
        <CardBody className="space-y-5 pt-5">
          <AINotice sources={["Coleta conversacional", "Modelo de diagnóstico supervisionado"]}>
            Este briefing organiza o que você relatou. Ele não substitui a análise jurídica do especialista.
          </AINotice>

          <Section title="Síntese do caso"><p className="text-[0.92rem] text-ink leading-relaxed">{oneLine}</p></Section>

          <div className="grid gap-5 sm:grid-cols-2">
            <Section title="Área do direito"><Badge tone="navy">{area}</Badge></Section>
            <Section title="Tipo de apoio"><Badge tone="accent">{answers.support === "parceria" ? "Parceria 50/50" : "Apoio humanizado"}</Badge></Section>
          </div>

          <Section title="Fatos identificados">
            <ul className="space-y-1.5">{facts.map((f, i) => <li key={i} className="flex gap-2 text-[0.88rem] text-ink-soft"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-navy-400" />{f}</li>)}</ul>
          </Section>

          <div className="grid gap-5 sm:grid-cols-2">
            <Section title="Documentos sugeridos">
              <ul className="space-y-1.5">{docs.map((d) => <li key={d} className="flex gap-2 text-[0.86rem] text-ink-soft"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-navy-400" />{d}</li>)}</ul>
            </Section>
            <Section title="Pontos de atenção">
              <ul className="space-y-1.5">{risks.map((r) => <li key={r} className="flex gap-2 text-[0.86rem] text-ink-soft"><ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />{r}</li>)}</ul>
            </Section>
          </div>
        </CardBody>
        <div className="flex flex-wrap items-center gap-3 border-t border-line bg-surface-2/50 px-6 py-4">
          <Button variant="ghost" iconLeft={<RotateCcw className="size-4" />} onClick={onRestart}>Refazer</Button>
          <Button variant="outline" iconLeft={<Pencil className="size-4" />}>Editar relatório</Button>
          <div className="flex-1" />
          {!confirmed ? (
            <Button iconRight={<CheckCircle2 className="size-4" />} onClick={onConfirm}>Revisar e confirmar</Button>
          ) : (
            <Button variant="accent" iconRight={<ArrowRight className="size-4" />} onClick={onPublish}>Publicar demanda</Button>
          )}
        </div>
      </Card>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.78rem] text-faint"><Scale className="size-3.5" /> O caso será conduzido por um advogado humano.</p>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">{title}</h4>
      {children}
    </div>
  );
}
