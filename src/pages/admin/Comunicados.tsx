import { useState } from "react";
import { Megaphone, Send, Save, Users, Mail, Smartphone, Inbox, Clock, CalendarClock } from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Field, Input, Textarea, Select, Toggle } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/Misc";
import { timeAgo, formatDateTime } from "@/lib/utils";
import type { Broadcast, BroadcastAudience, BroadcastChannel, BroadcastStatus } from "@/data/admin";

const recipientsByAudience: Record<BroadcastAudience, number> = {
  todos: 1041,
  iniciantes: 612,
  especialistas: 388,
  parceiros: 141,
};

const audienceLabel: Record<BroadcastAudience, string> = {
  todos: "Todos os usuários",
  iniciantes: "Iniciantes",
  especialistas: "Especialistas",
  parceiros: "Parceiros",
};

const channelLabel: Record<BroadcastChannel, string> = {
  "in-app": "No aplicativo",
  email: "E-mail",
  ambos: "App e e-mail",
};

const statusMeta: Record<BroadcastStatus, { label: string; tone: Tone }> = {
  enviado: { label: "Enviado", tone: "success" },
  agendado: { label: "Agendado", tone: "info" },
  rascunho: { label: "Rascunho", tone: "neutral" },
};

const emptyForm = {
  title: "",
  body: "",
  audience: "todos" as BroadcastAudience,
  channel: "ambos" as BroadcastChannel,
  simpleLanguage: true,
};

export function Comunicados() {
  const { toast } = useApp();
  const { broadcasts, sendBroadcast } = useAdmin();
  const [form, setForm] = useState(emptyForm);

  const recipients = recipientsByAudience[form.audience];
  const valid = form.title.trim().length > 0 && form.body.trim().length > 0;

  function submit(status: BroadcastStatus) {
    sendBroadcast({
      title: form.title.trim(),
      body: form.body.trim(),
      audience: form.audience,
      channel: form.channel,
      status,
      recipients,
      simpleLanguage: form.simpleLanguage,
    });
    toast(
      status === "enviado"
        ? `Comunicado enviado para ${recipients.toLocaleString("pt-BR")} destinatário(s).`
        : "Rascunho salvo.",
    );
    setForm(emptyForm);
  }

  return (
    <>
      <PageHeader
        title="Comunicados"
        description="Envie boletins e avisos aos advogados da plataforma (RF-58, RF-59)."
        breadcrumbs={[{ label: "Comitê Gestor", to: "/admin" }, { label: "Comunicados" }]}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        {/* LEFT — composer */}
        <Card as="section" className="self-start">
          <CardHeader
            title="Novo comunicado"
            subtitle="Redija um boletim ou aviso e escolha o público e o canal de envio."
            icon={<Megaphone className="size-5" />}
          />
          <CardBody className="space-y-4">
            <Field label="Título" required htmlFor="bc-title">
              <Input
                id="bc-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex.: Boletim mensal — junho"
                maxLength={90}
              />
            </Field>

            <Field label="Mensagem" required htmlFor="bc-body" hint="Use uma linguagem clara e acolhedora.">
              <Textarea
                id="bc-body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Escreva o conteúdo do comunicado…"
                rows={5}
                maxLength={600}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Público-alvo" htmlFor="bc-audience">
                <Select
                  id="bc-audience"
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value as BroadcastAudience })}
                >
                  {(Object.keys(audienceLabel) as BroadcastAudience[]).map((a) => (
                    <option key={a} value={a}>
                      {audienceLabel[a]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Canal de envio" htmlFor="bc-channel">
                <Select
                  id="bc-channel"
                  value={form.channel}
                  onChange={(e) => setForm({ ...form, channel: e.target.value as BroadcastChannel })}
                >
                  {(Object.keys(channelLabel) as BroadcastChannel[]).map((c) => (
                    <option key={c} value={c}>
                      {channelLabel[c]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="rounded-lg border border-line bg-surface-2/40 px-3.5 py-3">
              <Toggle
                checked={form.simpleLanguage}
                onChange={(v) => setForm({ ...form, simpleLanguage: v })}
                label="Linguagem simples"
                description="Reescreve termos jurídicos em linguagem acessível (RF-59)."
              />
            </div>

            <p className="flex items-center gap-2 text-[0.82rem] text-muted">
              <Users className="size-4 text-faint" />
              Estimativa de alcance:{" "}
              <span className="font-semibold text-navy-800 tabular-nums">
                {recipients.toLocaleString("pt-BR")}
              </span>{" "}
              destinatário(s).
            </p>
          </CardBody>
          <CardFooter className="justify-end">
            <Button
              variant="outline"
              iconLeft={<Save className="size-4" />}
              disabled={!valid}
              onClick={() => submit("rascunho")}
            >
              Salvar rascunho
            </Button>
            <Button
              variant="accent"
              iconLeft={<Send className="size-4" />}
              disabled={!valid}
              onClick={() => submit("enviado")}
            >
              Enviar agora
            </Button>
          </CardFooter>
        </Card>

        {/* RIGHT — history */}
        <section aria-label="Comunicados enviados" className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="font-serif text-[1.05rem] text-navy-900">Histórico de envios</h2>
            <Badge tone="navy">{broadcasts.length}</Badge>
          </div>

          {broadcasts.length === 0 ? (
            <Card>
              <CardBody>
                <EmptyState
                  icon={<Inbox className="size-6" />}
                  title="Nenhum comunicado ainda"
                  description="Os boletins e avisos enviados aparecerão aqui."
                />
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {broadcasts.map((b) => (
                <BroadcastCard key={b.id} broadcast={b} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function BroadcastCard({ broadcast: b }: { broadcast: Broadcast }) {
  const st = statusMeta[b.status];
  const ChannelIcon = b.channel === "email" ? Mail : b.channel === "in-app" ? Smartphone : Send;

  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[0.96rem] font-semibold text-navy-900 text-balance">{b.title}</h3>
          <Badge tone={st.tone} dot>
            {st.label}
          </Badge>
        </div>

        <p className="line-clamp-2 text-[0.85rem] leading-relaxed text-ink-soft">{b.body}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="accent" icon={<Users className="size-3" />}>
            {audienceLabel[b.audience]}
          </Badge>
          <Badge tone="neutral" icon={<ChannelIcon className="size-3" />}>
            {channelLabel[b.channel]}
          </Badge>
          {b.simpleLanguage && <Badge tone="info">Linguagem simples</Badge>}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-3 text-[0.78rem] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Inbox className="size-3.5 text-faint" />
            <span className="font-medium text-ink-soft tabular-nums">
              {b.recipients.toLocaleString("pt-BR")}
            </span>{" "}
            destinatário(s)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-faint" />
            {timeAgo(b.createdAt)}
          </span>
          {b.scheduledFor && (
            <span className="inline-flex items-center gap-1.5 text-info-ink">
              <CalendarClock className="size-3.5" />
              Agendado para {formatDateTime(b.scheduledFor)}
            </span>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
