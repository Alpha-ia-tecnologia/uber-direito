import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  UserRound,
  Award,
  Handshake,
  FileText,
  Scale,
} from "lucide-react";
import { AuthShell } from "./AuthShell";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { Stepper } from "@/components/ui/Stepper";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Seus dados" },
  { label: "Validação OAB" },
  { label: "Seus papéis" },
  { label: "Termos" },
];

const roleOptions = [
  { id: "iniciante", icon: UserRound, title: "Iniciante", desc: "Busco apoio ou parceria para meus casos.", eligible: true },
  { id: "especialista", icon: Award, title: "Especialista", desc: "Ofereço mentoria humanizada em minhas áreas.", eligible: true },
  { id: "parceiro", icon: Handshake, title: "Parceiro", desc: "Atuo em parcerias com divisão 50/50.", eligible: true },
];

export function Cadastro() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [roles, setRoles] = useState<string[]>(["iniciante"]);
  const [tcle, setTcle] = useState(false);
  const [terms, setTerms] = useState(false);
  const [form, setForm] = useState({ nome: "", oab: "", seccional: "SP", email: "", telefone: "" });

  function startValidation() {
    setStep(1);
    setValidating(true);
    setValidated(false);
    setTimeout(() => {
      setValidating(false);
      setValidated(true);
    }, 2400);
  }

  function toggleRole(id: string) {
    setRoles((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  }

  return (
    <AuthShell>
      <div className="mb-7">
        <h1 className="font-serif text-[1.85rem] text-navy-900">Criar sua conta</h1>
        <p className="mt-1.5 text-[0.9rem] text-muted">
          Já tem conta?{" "}
          <Link to="/entrar" className="font-semibold text-bordo-700 hover:underline">Entrar</Link>
        </p>
      </div>

      <Stepper steps={STEPS} current={step} className="mb-8" />

      <AnimatePresence mode="wait">
        {/* STEP 0 — dados */}
        {step === 0 && (
          <motion.form
            key="s0"
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}
            onSubmit={(e) => { e.preventDefault(); startValidation(); }}
            className="space-y-4"
          >
            <Field label="Nome completo" htmlFor="nome" required>
              <Input id="nome" placeholder="Ex.: Marina Alves Tavares" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </Field>
            <div className="grid grid-cols-[1fr_7rem] gap-3">
              <Field label="Inscrição na OAB" htmlFor="oab" required>
                <Input id="oab" placeholder="000.000" value={form.oab} onChange={(e) => setForm({ ...form, oab: e.target.value })} required />
              </Field>
              <Field label="Seccional" htmlFor="sec" required>
                <Select id="sec" value={form.seccional} onChange={(e) => setForm({ ...form, seccional: e.target.value })}>
                  {["SP", "RJ", "MG", "RS", "PR", "BA", "DF"].map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="E-mail profissional" htmlFor="email" required>
              <Input id="email" type="email" placeholder="voce@adv.br" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Field>
            <Field label="Telefone" htmlFor="tel" hint="Usado apenas para notificações essenciais (LGPD: minimização de dados)." required>
              <Input id="tel" placeholder="(11) 90000-0000" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required />
            </Field>
            <Button type="submit" full size="lg" iconRight={<ArrowRight className="size-4" />}>Validar inscrição na OAB</Button>
          </motion.form>
        )}

        {/* STEP 1 — validação */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            {validating && (
              <div className="rounded-xl border border-line bg-surface p-6 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-navy-50">
                  <Loader2 className="size-7 animate-spin text-navy-600" />
                </span>
                <h2 className="mt-4 font-serif text-[1.2rem] text-navy-900">Consultando a base da OAB…</h2>
                <p className="mt-1.5 text-[0.88rem] text-muted">Conferindo inscrição {form.oab || "000.000"}/{form.seccional} e a data de registro.</p>
                <div className="mt-5 space-y-2 text-left">
                  {["Inscrição localizada na seccional", "Situação regular confirmada", "Calculando tempo de inscrição"].map((t, i) => (
                    <motion.div key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.5 }} className="flex items-center gap-2 text-[0.84rem] text-ink-soft">
                      <CheckCircle2 className="size-4 text-success" /> {t}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {validated && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="rounded-xl border border-success/30 bg-success-soft/60 p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-full bg-success/15 text-success">
                      <ShieldCheck className="size-7" />
                    </span>
                    <div>
                      <h2 className="font-serif text-[1.2rem] text-navy-900">Inscrição validada</h2>
                      <p className="text-[0.85rem] text-success-ink font-medium">OAB {form.oab || "458.221"}/{form.seccional} · situação regular</p>
                    </div>
                  </div>
                  <dl className="mt-5 grid grid-cols-2 gap-4 rounded-lg border border-line bg-surface p-4">
                    <div>
                      <dt className="text-[0.72rem] uppercase tracking-wide text-faint">Registro na OAB</dt>
                      <dd className="font-mono text-[0.9rem] text-ink">12/03/2023</dd>
                    </div>
                    <div>
                      <dt className="text-[0.72rem] uppercase tracking-wide text-faint">Tempo de inscrição</dt>
                      <dd className="text-[0.9rem] text-ink">3 anos</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-navy-50 px-4 py-3 text-[0.84rem] text-navy-800">
                    <Award className="mt-0.5 size-4.5 shrink-0 text-navy-600" />
                    <span>Com até 5 anos de inscrição, você é <strong>elegível ao perfil Iniciante</strong> (classificação automática).</span>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <Button variant="outline" onClick={() => setStep(0)} iconLeft={<ArrowLeft className="size-4" />}>Voltar</Button>
                  <Button full onClick={() => setStep(2)} iconRight={<ArrowRight className="size-4" />}>Escolher papéis</Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 2 — papéis */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <p className="mb-4 text-[0.9rem] text-muted">
              Você pode acumular papéis — atuar como Especialista em uma demanda e como Iniciante em outra. Selecione um ou mais:
            </p>
            <div className="space-y-3">
              {roleOptions.map((r) => {
                const on = roles.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleRole(r.id)}
                    aria-pressed={on}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
                      on ? "border-navy-600 bg-navy-50/70 ring-1 ring-navy-600" : "border-line bg-surface hover:border-navy-300",
                    )}
                  >
                    <span className={cn("grid size-11 shrink-0 place-items-center rounded-lg", on ? "bg-navy-700 text-white" : "bg-navy-50 text-navy-600")}>
                      <r.icon className="size-5.5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-navy-900">{r.title}</span>
                      <span className="block text-[0.84rem] text-muted">{r.desc}</span>
                    </span>
                    <span className={cn("grid size-5 place-items-center rounded-md border-2", on ? "border-navy-700 bg-navy-700" : "border-line-strong")}>
                      {on && <CheckCircle2 className="size-3.5 text-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} iconLeft={<ArrowLeft className="size-4" />}>Voltar</Button>
              <Button full onClick={() => setStep(3)} disabled={roles.length === 0} iconRight={<ArrowRight className="size-4" />}>Continuar</Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — termos */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <div className="rounded-xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2 text-navy-700">
                <FileText className="size-4.5" />
                <span className="font-serif text-[1.05rem] text-navy-900">Consentimento e termos</span>
              </div>
              <div className="mt-3 max-h-32 overflow-y-auto rounded-lg border border-line bg-surface-2/60 p-3 text-[0.8rem] leading-relaxed text-muted">
                <p className="mb-2"><strong className="text-ink-soft">TCLE — Termo de Consentimento Livre e Esclarecido (v3.0).</strong> Ao aceitar, você autoriza o tratamento dos dados estritamente necessários ao funcionamento da plataforma, conforme a LGPD (Lei 13.709/2018), com finalidade de pareamento, atendimento e produção de relatórios anonimizados de pesquisa.</p>
                <p>Você poderá, a qualquer momento, consultar, corrigir e solicitar a exclusão dos seus dados, bem como revogar este consentimento.</p>
              </div>
              <label className="mt-4 flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={tcle} onChange={(e) => setTcle(e.target.checked)} className="mt-0.5 size-4.5 rounded border-line-strong text-navy-700 focus:ring-bordo-500" />
                <span className="text-[0.86rem] text-ink-soft">Li e aceito o <strong className="text-navy-800">TCLE digital</strong> e a Política de Privacidade.</span>
              </label>
              <label className="mt-3 flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 size-4.5 rounded border-line-strong text-navy-700 focus:ring-bordo-500" />
                <span className="text-[0.86rem] text-ink-soft">Li e aceito os <strong className="text-navy-800">Termos de Uso</strong> da plataforma.</span>
              </label>
              <p className="mt-3 text-[0.74rem] text-faint">Registramos data, hora e versão aceita para fins de conformidade.</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} iconLeft={<ArrowLeft className="size-4" />}>Voltar</Button>
              <Button full disabled={!tcle || !terms} onClick={() => nav("/app")} iconRight={<Scale className="size-4" />}>Concluir cadastro</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
