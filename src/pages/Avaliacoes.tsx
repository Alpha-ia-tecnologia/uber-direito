import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Flag, CheckCircle2, ShieldAlert } from "lucide-react";
import { useApp } from "@/store/app-context";
import { ratings, services } from "@/data/mock";
import { lawyerById } from "@/data/lawyers";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Rating, RatingInput } from "@/components/ui/Rating";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Misc";
import { Field, Textarea, Select } from "@/components/ui/Field";
import { formatDate } from "@/lib/utils";

const criteriaLabels: Record<string, string> = { clareza: "Clareza", pontualidade: "Pontualidade", tecnica: "Domínio técnico", empatia: "Empatia" };

export function Avaliacoes() {
  const { user, toast } = useApp();
  const [criteria, setCriteria] = useState({ clareza: 5, pontualidade: 5, tecnica: 5, empatia: 5 });
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const received = ratings.filter((r) => r.toId === user.id);
  const given = ratings.filter((r) => r.fromId === user.id);

  // pending: the active service for the user that could be evaluated
  const pendingSvc = services.find((s) => s.initiateId === user.id || s.specialistId === user.id);
  const counterpart = pendingSvc ? lawyerById(pendingSvc.initiateId === user.id ? pendingSvc.specialistId : pendingSvc.initiateId) : undefined;
  const avg = (Object.values(criteria).reduce((a, b) => a + b, 0) / 4).toFixed(1);

  function submit() {
    setSubmitted(true);
    toast("Avaliação registrada. Obrigado pelo retorno!");
  }

  const pendingTab = (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader title="Avalie seu atendimento" subtitle="Avaliação mútua — escala de 1 a 5 (meta de média ≥ 4,0)" />
        <CardBody className="pt-0">
          {!counterpart ? (
            <EmptyState icon={<Star className="size-7" />} title="Nada para avaliar agora" description="As avaliações abrem ao concluir um atendimento." />
          ) : submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-success/30 bg-success-soft/60 p-6 text-center">
              <CheckCircle2 className="mx-auto size-12 text-success" />
              <h3 className="mt-3 font-serif text-[1.15rem] text-navy-900">Avaliação enviada</h3>
              <p className="mt-1 text-[0.88rem] text-success-ink">Sua nota média foi {avg}. Ela alimenta o matching e a reputação na plataforma.</p>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/40 p-3.5">
                <Avatar name={counterpart.name} size="md" ring />
                <div>
                  <p className="text-[0.92rem] font-semibold text-navy-900">{counterpart.name}</p>
                  <p className="text-[0.8rem] text-muted">{counterpart.roles.includes("especialista") ? "Especialista" : "Iniciante"} · {counterpart.city}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[0.72rem] text-faint uppercase tracking-wide">Sua nota</p>
                  <p className="font-serif text-[1.6rem] text-navy-900">{avg}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {Object.entries(criteria).map(([k, v]) => (
                  <RatingInput key={k} label={criteriaLabels[k]} value={v} size={26} onChange={(val) => setCriteria((c) => ({ ...c, [k]: val }))} />
                ))}
              </div>

              <Field label="Comentário (opcional)" className="mt-5">
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="O que funcionou bem? O que poderia melhorar?" rows={3} />
              </Field>

              <div className="mt-5 flex gap-3">
                <Button onClick={submit} iconRight={<Star className="size-4" />}>Enviar avaliação</Button>
                <Button variant="ghost" className="text-danger-ink hover:bg-danger-soft" iconLeft={<Flag className="size-4" />} onClick={() => setReportOpen(true)}>Registrar denúncia</Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="flex items-center gap-2 text-[0.95rem] text-navy-900"><ShieldAlert className="size-4.5 text-navy-600" /> Como a avaliação é usada</h3>
          <ul className="mt-3 space-y-2.5 text-[0.84rem] text-ink-soft">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> Avaliação mútua: os dois lados se avaliam.</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> A média consolidada alimenta o matching.</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> Denúncias éticas vão à mediação do Comitê Gestor.</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );

  const receivedTab = (
    <div className="space-y-3">
      {received.length === 0 ? (
        <Card><EmptyState icon={<Star className="size-7" />} title="Você ainda não recebeu avaliações" /></Card>
      ) : received.map((r) => {
        const from = lawyerById(r.fromId);
        return (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={from?.name ?? "?"} size="sm" />
                <div><p className="text-[0.9rem] font-semibold text-navy-900">{from?.name}</p><p className="text-[0.78rem] text-muted">{formatDate(r.createdAt)}</p></div>
              </div>
              <Rating value={r.score} />
            </div>
            <p className="mt-3 text-[0.9rem] text-ink-soft text-pretty">“{r.comment}”</p>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
              {Object.entries(r.criteria).map(([k, v]) => (
                <Badge key={k} tone="neutral">{criteriaLabels[k]}: {v}</Badge>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );

  const givenTab = given.length === 0 ? (
    <Card><EmptyState icon={<Star className="size-7" />} title="Você ainda não avaliou ninguém" /></Card>
  ) : (
    <div className="space-y-3">
      {given.map((r) => {
        const to = lawyerById(r.toId);
        return (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[0.9rem] text-navy-900">Para <strong>{to?.name}</strong></span>
              <Rating value={r.score} />
            </div>
            <p className="mt-2 text-[0.88rem] text-muted">“{r.comment}”</p>
          </Card>
        );
      })}
    </div>
  );

  return (
    <>
      <PageHeader
        title="Avaliações"
        description="Avaliação mútua ao final de cada atendimento — base da confiança na plataforma."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Avaliações" }]}
        meta={<Badge tone="brass" icon={<Star className="size-3.5" />}>Sua média: {user.rating.toFixed(1)} ({user.ratingCount})</Badge>}
      />
      <Tabs
        items={[
          { id: "pending", label: "Avaliar agora", content: pendingTab },
          { id: "received", label: "Recebidas", badge: <Badge tone="navy">{received.length}</Badge>, content: receivedTab },
          { id: "given", label: "Enviadas", badge: <Badge tone="neutral">{given.length}</Badge>, content: givenTab },
        ]}
      />

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Registrar denúncia ou conflito ético"
        description="Encaminhada à mediação do Administrador/Comitê Gestor (RF-42)."
        footer={<><Button variant="ghost" onClick={() => setReportOpen(false)}>Cancelar</Button><Button variant="danger" onClick={() => { setReportOpen(false); toast("Denúncia registrada e encaminhada ao Comitê Gestor."); }} iconRight={<Flag className="size-4" />}>Enviar denúncia</Button></>}
      >
        <div className="space-y-4">
          <Field label="Motivo">
            <Select><option>Conduta inadequada</option><option>Demora excessiva no atendimento</option><option>Quebra de combinado</option><option>Conflito de interesse não declarado</option><option>Outro</option></Select>
          </Field>
          <Field label="Descreva o ocorrido"><Textarea rows={4} placeholder="Relate os fatos com o máximo de detalhe possível…" /></Field>
        </div>
      </Modal>
    </>
  );
}
