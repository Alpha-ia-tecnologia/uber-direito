import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldAlert } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

export function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("marina.tavares@adv.br");
  const [pwd, setPwd] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => nav("/app"), 800);
  }

  return (
    <AuthShell>
      <h1 className="font-serif text-[1.9rem] text-navy-900">Entrar na plataforma</h1>
      <p className="mt-2 text-[0.92rem] text-muted">
        Acesse com seu e-mail profissional. Novo por aqui?{" "}
        <Link to="/cadastro" className="font-semibold text-bordo-700 hover:underline">Crie sua conta</Link>.
      </p>

      <form onSubmit={submit} className="mt-7 space-y-4">
        <Field label="E-mail" htmlFor="email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-faint" />
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-11" required />
          </div>
        </Field>

        <Field label="Senha" htmlFor="pwd">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-faint" />
            <Input id="pwd" type={show ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)} className="pl-11 pr-11" required />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-navy-600">
              {show ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between text-[0.84rem]">
          <label className="inline-flex items-center gap-2 text-ink-soft cursor-pointer">
            <input type="checkbox" className="size-4 rounded border-line-strong text-navy-700 focus:ring-bordo-500" defaultChecked /> Lembrar de mim
          </label>
          <button type="button" className="font-medium text-navy-600 hover:text-navy-800">Esqueci a senha</button>
        </div>

        <Button type="submit" full size="lg" loading={loading} iconRight={!loading ? <ArrowRight className="size-4" /> : undefined}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-navy-100 bg-navy-50/60 px-4 py-3 text-[0.8rem] text-ink-soft">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-navy-500" />
        <span>Ambiente de demonstração com dados fictícios. Qualquer e-mail e senha entram — você poderá trocar de perfil (Iniciante, Especialista, Comitê) dentro da plataforma.</span>
      </div>
    </AuthShell>
  );
}
