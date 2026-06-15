import { useState } from "react";
import {
  Lock,
  Download,
  Pencil,
  Trash2,
  ShieldCheck,
  FileText,
  Eye,
  Database,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { consents } from "@/data/mock";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime } from "@/lib/utils";

const rights = [
  { icon: Eye, title: "Consultar meus dados", desc: "Veja todos os dados pessoais que a plataforma mantém.", action: "Consultar" },
  { icon: Pencil, title: "Corrigir meus dados", desc: "Solicite a correção de qualquer informação incorreta.", action: "Corrigir" },
  { icon: Download, title: "Exportar meus dados", desc: "Baixe uma cópia em formato aberto (portabilidade).", action: "Exportar" },
  { icon: Trash2, title: "Excluir minha conta", desc: "Revogue o consentimento e solicite a exclusão (LGPD).", action: "Excluir", danger: true },
];

export function Privacidade() {
  const { toast } = useApp();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Privacidade e dados (LGPD)"
        description="Você controla seus dados. Coletamos apenas o necessário e respeitamos o segredo de justiça."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Privacidade" }]}
        meta={<Badge tone="success" icon={<ShieldCheck className="size-3.5" />}>Conforme a Lei 13.709/2018</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rights */}
        <Card>
          <CardHeader icon={<Lock className="size-5" />} title="Seus direitos como titular" subtitle="Aja a qualquer momento" />
          <CardBody className="pt-0">
            <ul className="space-y-2.5">
              {rights.map((r) => (
                <li key={r.title} className="flex items-center gap-3.5 rounded-xl border border-line bg-surface-2/40 p-3.5">
                  <span className={r.danger ? "grid size-10 shrink-0 place-items-center rounded-lg bg-danger-soft text-danger-ink" : "grid size-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700"}>
                    <r.icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9rem] font-semibold text-navy-900">{r.title}</p>
                    <p className="text-[0.8rem] text-muted text-pretty">{r.desc}</p>
                  </div>
                  <Button size="sm" variant={r.danger ? "ghost" : "outline"} className={r.danger ? "text-danger-ink hover:bg-danger-soft" : ""} onClick={() => (r.danger ? setDeleteOpen(true) : toast(`Solicitação de “${r.title.toLowerCase()}” registrada.`))}>{r.action}</Button>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <div className="space-y-6">
          {/* Consents */}
          <Card>
            <CardHeader icon={<FileText className="size-5" />} title="Consentimentos registrados" subtitle="Base legal de cada coleta (TCLE)" />
            <CardBody className="pt-0">
              <ul className="divide-y divide-line">
                {consents.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 py-3">
                    <CheckCircle2 className="size-4.5 shrink-0 text-success" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.88rem] font-medium text-navy-900">{c.type}</p>
                      <p className="text-[0.76rem] text-muted">Versão {c.version} · aceito em {formatDateTime(c.acceptedAt)}</p>
                    </div>
                    <Button size="sm" variant="ghost">Revogar</Button>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Data handling */}
          <Card>
            <CardHeader icon={<Database className="size-5" />} title="Como tratamos seus dados" />
            <CardBody className="pt-0">
              <ul className="space-y-2.5 text-[0.85rem] text-ink-soft">
                <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" /> Criptografia em trânsito e em repouso.</li>
                <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" /> Minimização: coletamos só o necessário.</li>
                <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" /> Relatórios usam dados anonimizados (sem identificação).</li>
                <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" /> Guarda em servidor seguro da instituição (5 anos), com descarte controlado.</li>
                <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" /> Processos sob segredo de justiça nunca são expostos.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Excluir conta e revogar consentimento"
        description="Esta ação é irreversível e remove seus dados conforme a política de descarte."
        size="sm"
        footer={<><Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancelar</Button><Button variant="danger" onClick={() => { setDeleteOpen(false); toast("Solicitação de exclusão registrada. Você receberá a confirmação por e-mail."); }} iconLeft={<Trash2 className="size-4" />}>Confirmar exclusão</Button></>}
      >
        <p className="text-[0.9rem] text-ink-soft">Ao confirmar, registramos sua solicitação de exclusão. Demandas em andamento precisam ser encerradas antes da remoção definitiva, conforme a política de dados.</p>
      </Modal>
    </>
  );
}
