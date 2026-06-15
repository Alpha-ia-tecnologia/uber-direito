import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Video,
  Lock,
  Scale,
  Handshake,
  Accessibility,
  UserCheck,
  FileSearch,
  ClipboardList,
  Users,
  MessagesSquare,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const } }),
};

const flow = [
  { icon: UserCheck, title: "Cadastro e validação", text: "Inscrição na OAB conferida antes de ativar a conta." },
  { icon: FileSearch, title: "Histórico validado", text: "Atuação confrontada com o DataJud do CNJ por um agente de IA." },
  { icon: Sparkles, title: "Diagnóstico com IA", text: "Um agente organiza a necessidade do caso em um briefing claro." },
  { icon: ClipboardList, title: "Publicação da demanda", text: "A demanda nasce do diagnóstico, com área, urgência e tipo de apoio." },
  { icon: Users, title: "Matching automatizado", text: "Advogados compatíveis são sugeridos e ordenados por aderência." },
  { icon: MessagesSquare, title: "Atendimento humanizado", text: "Chat e videoconferência própria para as devolutivas." },
  { icon: Star, title: "Avaliação mútua", text: "Nota de 1 a 5 dos dois lados, alimentando o matching." },
  { icon: Handshake, title: "Parceria 50/50", text: "Termo digital com divisão de valores acordada e assinada." },
];

const differentials = [
  { icon: ShieldCheck, title: "Credibilidade comprovada", text: "Selos de atuação baseados exclusivamente em dados validados no DataJud/CNJ — nunca em autodeclaração." },
  { icon: Sparkles, title: "IA que organiza, não decide", text: "O agente estrutura a necessidade e gera o briefing, mas encaminha sempre ao advogado humano. Auditável e supervisionado." },
  { icon: Video, title: "Videoconferência própria", text: "Plataforma auto-hospedada (modelo Jitsi) para sessões e devolutivas, sem depender de terceiros para os dados." },
  { icon: Lock, title: "Sigilo e LGPD por padrão", text: "Minimização de dados, consentimento por TCLE e respeito ao segredo de justiça em cada etapa." },
];

function PublicNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-5 sm:px-8">
        <Logo onDark />
        <nav className="hidden md:flex items-center gap-7 text-[0.88rem] text-navy-100">
          <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a>
          <a href="#para-quem" className="hover:text-white transition-colors">Para quem é</a>
        </nav>
        <div className="flex items-center gap-2.5">
          <Link to="/entrar"><Button variant="ghost" size="sm" className="text-navy-100 hover:bg-white/10 hover:text-white">Entrar</Button></Link>
          <Link to="/cadastro"><Button variant="accent" size="sm">Criar conta</Button></Link>
        </div>
      </div>
    </header>
  );
}

export function Landing() {
  return (
    <div className="bg-bg">
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-chrome text-white">
        <PublicNav />
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-40">
          <div>
            <motion.span
              variants={fadeUp} initial="hidden" animate="show"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.78rem] text-navy-100"
            >
              <Scale className="size-3.5" /> Projeto de extensão · Direitos Humanos e Justiça
            </motion.span>
            <motion.h1
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="mt-5 font-serif text-[2.6rem] font-semibold leading-[1.05] text-white text-balance sm:text-[3.4rem]"
            >
              A advocacia se fortalece quando os advogados se conectam.
            </motion.h1>
            <motion.p
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-navy-100 text-pretty"
            >
              Uma plataforma que aproxima advogados iniciantes de especialistas para
              <strong className="text-white font-semibold"> apoio humanizado</strong> e
              <strong className="text-white font-semibold"> parcerias 50/50</strong>, com diagnóstico por IA,
              histórico validado no DataJud e videoconferência própria.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/cadastro"><Button variant="accent" size="lg" iconRight={<ArrowRight className="size-4" />}>Começar agora</Button></Link>
              <a href="#como-funciona"><Button variant="outline" size="lg" className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:border-white/40">Ver como funciona</Button></a>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.82rem] text-navy-200">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-[oklch(0.72_0.12_158)]" /> Validação via OAB</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-[oklch(0.72_0.12_158)]" /> Conforme a LGPD</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-[oklch(0.72_0.12_158)]" /> Acessível (WCAG 2.1 AA)</span>
            </motion.div>
          </div>

          {/* Hero visual — a stylized matching card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[0.78rem] font-semibold uppercase tracking-wide text-navy-200">Demanda · Direito do Trabalho</span>
                <span className="rounded-full bg-bordo-500/90 px-2 py-0.5 text-[0.68rem] font-bold">96% compatível</span>
              </div>
              <p className="mt-3 font-serif text-[1.15rem] text-white">Rescisão indireta por atraso de salários</p>
              <div className="mt-4 space-y-2.5">
                {[
                  { n: "Rogério Beltrão", s: "4,9", m: "96%", g: "Ouro" },
                  { n: "Carla Menezes", s: "4,7", m: "91%", g: "Ouro" },
                  { n: "Tiago Resende", s: "4,5", m: "78%", g: "Prata" },
                ].map((c, i) => (
                  <div key={c.n} className={cn("flex items-center gap-3 rounded-xl border p-3", i === 0 ? "border-bordo-400/40 bg-bordo-500/10" : "border-white/10 bg-white/[0.03]")}>
                    <span className="grid size-9 place-items-center rounded-full bg-white/10 font-serif text-[0.85rem] font-semibold">{c.n.split(" ").map((w) => w[0]).join("")}</span>
                    <div className="flex-1">
                      <p className="text-[0.86rem] font-semibold text-white">{c.n}</p>
                      <p className="text-[0.74rem] text-navy-200">★ {c.s} · selo {c.g}</p>
                    </div>
                    <span className="font-serif text-[1.1rem] font-semibold text-white">{c.m}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.78rem] text-navy-100">
                <Sparkles className="size-3.5 text-[oklch(0.8_0.09_84)]" /> Ordenado por área, selos validados e avaliação.
              </div>
            </div>
          </motion.div>
        </div>
        <div className="h-10 bg-gradient-to-b from-transparent to-bg" />
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="font-serif text-[2rem] text-navy-900 text-balance">Do cadastro à parceria, em um fluxo só</h2>
          <p className="mt-3 text-[1rem] text-muted text-pretty">
            Oito etapas pensadas para dar segurança ao advogado iniciante e reconhecimento ao especialista —
            com a IA organizando o caminho e o ser humano sempre no centro da decisão.
          </p>
        </div>
        <ol className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {flow.map((step, i) => (
            <motion.li
              key={step.title}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} custom={i % 4}
              className="relative"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy-700 text-white shadow-sm">
                  <step.icon className="size-5" strokeWidth={1.75} />
                </span>
                <span className="font-mono text-[0.78rem] font-medium text-bordo-600">Etapa {String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-3 text-[1.02rem] text-navy-900">{step.title}</h3>
              <p className="mt-1.5 text-[0.88rem] text-muted text-pretty">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" className="bg-surface border-y border-line">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="rule-accent font-serif text-[2rem] text-navy-900 text-balance">Por que confiar na plataforma</h2>
              <p className="mt-3 text-[1rem] text-muted text-pretty">
                Credibilidade não se declara — se comprova. Cada decisão de produto protege a dignidade
                de quem busca ajuda e o nome de quem oferece.
              </p>
              <Link to="/cadastro" className="mt-6 inline-block">
                <Button variant="primary" iconRight={<ArrowRight className="size-4" />}>Fazer parte</Button>
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {differentials.map((d, i) => (
                <motion.div
                  key={d.title}
                  variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                  className="rounded-xl border border-line bg-bg p-5"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-bordo-50 text-bordo-600">
                    <d.icon className="size-5.5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-[1.02rem] text-navy-900">{d.title}</h3>
                  <p className="mt-1.5 text-[0.88rem] text-muted text-pretty">{d.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUEM */}
      <section id="para-quem" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1 text-[0.78rem] font-semibold text-navy-700">
              <UserCheck className="size-3.5" /> Para o advogado iniciante
            </span>
            <h3 className="mt-4 font-serif text-[1.4rem] text-navy-900">Apoio de quem já trilhou o caminho</h3>
            <ul className="mt-4 space-y-2.5 text-[0.92rem] text-ink-soft">
              {["Onboarding guiado e diagnóstico do caso com IA", "Demanda publicada a partir de um briefing claro", "Especialistas sugeridos por compatibilidade real", "Mentoria humanizada ou parceria com divisão justa"].map((t) => (
                <li key={t} className="flex gap-2.5"><CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-success" /> {t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-bordo-50 px-3 py-1 text-[0.78rem] font-semibold text-bordo-700">
              <ShieldCheck className="size-3.5" /> Para o advogado especialista
            </span>
            <h3 className="mt-4 font-serif text-[1.4rem] text-navy-900">Reconhecimento pelo que você já fez</h3>
            <ul className="mt-4 space-y-2.5 text-[0.92rem] text-ink-soft">
              {["Histórico validado no DataJud vira selo de credibilidade", "Oportunidades qualificadas, sem ruído", "Agenda e disponibilidade no seu controle", "Parcerias formalizadas com termo digital e divisão 50/50"].map((t) => (
                <li key={t} className="flex gap-2.5"><CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-success" /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* METAS / ACCESSIBILITY STRIP */}
      <section className="bg-navy-chrome text-white">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: "≥ 80%", l: "Meta de taxa de conclusão dos atendimentos" },
              { v: "≥ 4,0", l: "Meta de média de avaliação (escala 1–5)" },
              { v: "300", l: "Termos de parceria formalizados na vigência" },
              { v: "~5.000", l: "Advogados previstos no primeiro ano" },
            ].map((m) => (
              <div key={m.l}>
                <p className="font-serif text-[2.4rem] font-semibold leading-none text-white">{m.v}</p>
                <p className="mt-2 text-[0.86rem] text-navy-200 text-pretty">{m.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/12 bg-white/[0.04] p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <Accessibility className="size-7 shrink-0 text-white" />
              <div>
                <p className="font-serif text-[1.1rem] text-white">Feita para todas as pessoas</p>
                <p className="mt-1 text-[0.86rem] text-navy-200 text-pretty max-w-xl">
                  Contraste e tamanho de fonte ajustáveis, linguagem simples, recurso em Libras,
                  legendas automáticas e atendimento prioritário a advogados com deficiência.
                </p>
              </div>
            </div>
            <Link to="/cadastro"><Button variant="accent" size="lg" iconRight={<ArrowRight className="size-4" />}>Criar conta gratuita</Button></Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
            <div>
              <Logo />
              <p className="mt-3 max-w-sm text-[0.84rem] text-muted text-pretty">
                MVP demonstrativo com dados fictícios. Nome de trabalho do projeto de extensão —
                a marca pública definitiva será definida pela coordenação.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-4 text-[0.85rem]">
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-navy-900">Plataforma</span>
                <a href="#como-funciona" className="text-muted hover:text-navy-700">Como funciona</a>
                <a href="#diferenciais" className="text-muted hover:text-navy-700">Diferenciais</a>
                <Link to="/entrar" className="text-muted hover:text-navy-700">Entrar</Link>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-navy-900">Conformidade</span>
                <span className="text-muted">LGPD (Lei 13.709/2018)</span>
                <span className="text-muted">Estatuto da Advocacia</span>
                <span className="text-muted">Segredo de justiça</span>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-line pt-6 text-[0.78rem] text-faint">
            © 2026 Uber dos Advogados · Projeto de extensão universitária · Direitos Humanos e Justiça.
          </div>
        </div>
      </footer>
    </div>
  );
}
