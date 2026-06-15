import { useState } from "react";
import { ShieldAlert, MessageSquare, CheckCircle2, Gavel } from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { lawyerById } from "@/data/lawyers";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/Misc";
import { Modal } from "@/components/ui/Modal";
import { Field, Textarea } from "@/components/ui/Field";
import { formatDateTime } from "@/lib/utils";
import type { ConflictStatus } from "@/data/types";

const statusMeta: Record<ConflictStatus, { label: string; tone: "warning" | "info" | "success" }> = {
  aberto: { label: "Aberto", tone: "warning" },
  em_mediacao: { label: "Em mediação", tone: "info" },
  resolvido: { label: "Resolvido", tone: "success" },
};

export function Conflitos() {
  const { toast } = useApp();
  const { conflicts, logAudit } = useAdmin();
  const [resolved, setResolved] = useState<Record<string, boolean>>({});
  const [mediateId, setMediateId] = useState<string | null>(null);

  return (
    <>
      <PageHeader
        title="Conflitos e ética"
        description="Denúncias e conflitos éticos encaminhados à mediação do Comitê Gestor (RF-42)."
        breadcrumbs={[{ label: "Comitê Gestor", to: "/admin" }, { label: "Conflitos" }]}
        meta={<Badge tone="warning" icon={<ShieldAlert className="size-3.5" />}>{conflicts.filter((c) => !resolved[c.id]).length} em aberto</Badge>}
      />

      {conflicts.length === 0 ? (
        <Card><EmptyState icon={<ShieldAlert className="size-7" />} title="Nenhum conflito registrado" description="Tudo tranquilo por aqui." /></Card>
      ) : (
        <div className="space-y-4">
          {conflicts.map((c) => {
            const reporter = lawyerById(c.reporterId);
            const against = lawyerById(c.againstId);
            const isResolved = resolved[c.id];
            const meta = statusMeta[isResolved ? "resolvido" : c.status];
            return (
              <Card key={c.id}>
                <CardBody>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[0.78rem] text-muted">Atendimento {c.serviceId}</span>
                    <Badge tone={meta.tone} dot>{meta.label}</Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={reporter?.name ?? "?"} size="sm" />
                      <div><p className="text-[0.72rem] uppercase tracking-wide text-faint">Denunciante</p><p className="text-[0.86rem] font-medium text-navy-900">{reporter?.name}</p></div>
                    </div>
                    <Gavel className="size-5 text-faint" />
                    <div className="flex items-center gap-2.5">
                      <Avatar name={against?.name ?? "?"} size="sm" />
                      <div><p className="text-[0.72rem] uppercase tracking-wide text-faint">Denunciado</p><p className="text-[0.86rem] font-medium text-navy-900">{against?.name}</p></div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-line bg-surface-2/40 p-3.5">
                    <p className="text-[0.88rem] text-ink-soft">“{c.reason}”</p>
                    <p className="mt-1.5 text-[0.74rem] text-faint">Registrado em {formatDateTime(c.createdAt)}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                    {isResolved ? (
                      <Badge tone="success" icon={<CheckCircle2 className="size-3.5" />}>Mediação concluída</Badge>
                    ) : (
                      <>
                        <Button size="sm" iconLeft={<MessageSquare className="size-4" />} onClick={() => setMediateId(c.id)}>Registrar mediação</Button>
                        <Button size="sm" variant="outline" iconLeft={<CheckCircle2 className="size-4" />} onClick={() => { setResolved((r) => ({ ...r, [c.id]: true })); logAudit({ actor: "Comitê Gestor", action: "Resolveu conflito ético", target: `Atendimento ${c.serviceId}`, category: "mediação" }); toast("Conflito marcado como resolvido."); }}>Marcar resolvido</Button>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={!!mediateId}
        onClose={() => setMediateId(null)}
        title="Registrar mediação"
        description="A nota de mediação é registrada na trilha de auditoria."
        footer={<><Button variant="ghost" onClick={() => setMediateId(null)}>Cancelar</Button><Button onClick={() => { const cf = conflicts.find((x) => x.id === mediateId); logAudit({ actor: "Comitê Gestor", action: "Registrou nota de mediação", target: cf ? `Atendimento ${cf.serviceId}` : "conflito", category: "mediação" }); setMediateId(null); toast("Mediação registrada na auditoria."); }}>Salvar mediação</Button></>}
      >
        <Field label="Nota de mediação"><Textarea rows={4} placeholder="Descreva o encaminhamento, contato com as partes e a decisão…" /></Field>
      </Modal>
    </>
  );
}
