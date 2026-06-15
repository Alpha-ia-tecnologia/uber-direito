import { useState } from "react";
import { Bell, Mail, Smartphone, Accessibility, Type, Contrast, Sparkles } from "lucide-react";
import { useApp } from "@/store/app-context";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const notifTypes = [
  { id: "validacao", label: "Validação de cadastro e histórico" },
  { id: "diagnostico", label: "Conclusão do diagnóstico" },
  { id: "matching", label: "Novo matching" },
  { id: "mensagem", label: "Mensagens" },
  { id: "atendimento", label: "Conclusão de atendimento" },
  { id: "parceria", label: "Formalização de parceria" },
  { id: "boletim", label: "Boletins e comunicados periódicos" },
];

export function Configuracoes() {
  const { a11y, setA11y } = useApp();
  const [channels, setChannels] = useState({ inapp: true, email: true, push: false });
  const [prefs, setPrefs] = useState<Record<string, boolean>>(Object.fromEntries(notifTypes.map((t) => [t.id, t.id !== "boletim"])));

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Personalize como você recebe notificações e os recursos de acessibilidade."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Configurações" }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notification channels */}
        <Card>
          <CardHeader icon={<Bell className="size-5" />} title="Canais de notificação" subtitle="Onde você quer ser avisado" />
          <CardBody className="space-y-4 pt-0">
            <ChannelRow icon={<Bell className="size-4.5" />} label="No aplicativo" checked={channels.inapp} onChange={(v) => setChannels((c) => ({ ...c, inapp: v }))} />
            <ChannelRow icon={<Mail className="size-4.5" />} label="Por e-mail" checked={channels.email} onChange={(v) => setChannels((c) => ({ ...c, email: v }))} />
            <ChannelRow icon={<Smartphone className="size-4.5" />} label="Push no celular" checked={channels.push} onChange={(v) => setChannels((c) => ({ ...c, push: v }))} />
          </CardBody>
        </Card>

        {/* Notification preferences */}
        <Card>
          <CardHeader icon={<Sparkles className="size-5" />} title="Quais eventos" subtitle="Escolha o que importa para você" />
          <CardBody className="pt-0">
            <ul className="divide-y divide-line">
              {notifTypes.map((t) => (
                <li key={t.id} className="py-3">
                  <Toggle checked={prefs[t.id]} onChange={(v) => setPrefs((p) => ({ ...p, [t.id]: v }))} label={t.label} />
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Accessibility */}
        <Card className="lg:col-span-2">
          <CardHeader icon={<Accessibility className="size-5" />} title="Acessibilidade" subtitle="Disponível também no botão flutuante, em qualquer tela" />
          <CardBody className="grid gap-6 pt-0 sm:grid-cols-2">
            <div>
              <span className="mb-2 flex items-center gap-2 text-[0.84rem] font-semibold text-ink-soft"><Type className="size-4 text-navy-500" /> Tamanho do texto</span>
              <div className="flex gap-2">
                {[{ v: 1, l: "Padrão" }, { v: 1.1, l: "Grande" }, { v: 1.25, l: "Maior" }].map((s) => (
                  <button key={s.v} onClick={() => setA11y({ fontScale: s.v })} className={cn("flex-1 rounded-lg border py-2.5 text-[0.84rem] font-semibold transition-colors", a11y.fontScale === s.v ? "border-navy-700 bg-navy-700 text-white" : "border-line-strong text-ink-soft hover:border-navy-400")}>{s.l}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-2 flex items-center gap-2 text-[0.84rem] font-semibold text-ink-soft"><Contrast className="size-4 text-navy-500" /> Contraste</span>
              <div className="flex gap-2">
                <button onClick={() => setA11y({ contrast: "standard" })} className={cn("flex-1 rounded-lg border py-2.5 text-[0.84rem] font-semibold transition-colors", a11y.contrast === "standard" ? "border-navy-700 bg-navy-700 text-white" : "border-line-strong text-ink-soft hover:border-navy-400")}>Padrão</button>
                <button onClick={() => setA11y({ contrast: "high" })} className={cn("flex-1 rounded-lg border py-2.5 text-[0.84rem] font-semibold transition-colors", a11y.contrast === "high" ? "border-navy-950 bg-navy-950 text-white" : "border-line-strong text-ink-soft hover:border-navy-400")}>Alto contraste</button>
              </div>
            </div>
            <div className="space-y-3.5 sm:col-span-2 border-t border-line pt-4">
              <Toggle checked={a11y.reduceMotion} onChange={(v) => setA11y({ reduceMotion: v })} label="Reduzir animações" description="Menos movimento na interface" />
              <Toggle checked={a11y.simpleLanguage} onChange={(v) => setA11y({ simpleLanguage: v })} label="Linguagem simples" description="Explicações mais diretas em toda a plataforma" />
              <Toggle checked={a11y.libras} onChange={(v) => setA11y({ libras: v })} label="Janela de Libras (VLibras)" description="Tradução para Língua Brasileira de Sinais" />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function ChannelRow({ icon, label, checked, onChange }: { icon: React.ReactNode; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-lg bg-navy-50 text-navy-700">{icon}</span>
      <span className="flex-1 text-[0.9rem] font-medium text-navy-900">{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
