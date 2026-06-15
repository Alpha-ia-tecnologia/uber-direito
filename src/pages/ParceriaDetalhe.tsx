import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Handshake,
  Download,
  CheckCircle2,
  PenLine,
  Scale,
  ArrowLeft,
  Percent,
  Clock,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { partnerships, demands } from "@/data/mock";
import { lawyerById } from "@/data/lawyers";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/StatusBadge";
import { partnershipStatusMeta } from "@/lib/status";
import { brl, formatDateTime, cn } from "@/lib/utils";

export function ParceriaDetalhe() {
  const { id } = useParams();
  const { user, toast } = useApp();
  const partnership = partnerships.find((p) => p.id === id);
  const [signed, setSigned] = useState(false);

  if (!partnership) {
    return <Card><EmptyState title="Parceria não encontrada" action={<Link to="/app/parcerias"><Button>Voltar</Button></Link>} /></Card>;
  }

  const demand = demands.find((d) => d.id === partnership.demandId);
  const initiate = lawyerById(partnership.initiateId);
  const partner = lawyerById(partnership.partnerId);
  const fee = partnership.serviceValue * partnership.feePct;
  const net = partnership.serviceValue - fee;
  const share = net / 2;

  const meIsInitiate = user.id === partnership.initiateId;
  const myAccepted = meIsInitiate ? partnership.acceptedByInitiate : partnership.acceptedByPartner;
  const iSignedNow = signed || !!myAccepted;

  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <Link to="/app/parcerias" className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-muted hover:text-navy-700" aria-label="Voltar"><ArrowLeft className="size-4.5" /></Link>
        <div className="min-w-0">
          <h1 className="font-serif text-[1.4rem] text-navy-900 truncate">Termo de parceria 50/50</h1>
          <p className="text-[0.8rem] text-muted font-mono">{partnership.code}</p>
        </div>
        <div className="ml-auto"><StatusBadge meta={partnershipStatusMeta[partnership.status]} /></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* The term document */}
        <Card elevated className="overflow-hidden">
          <div className="bg-navy-chrome px-7 py-6 text-white">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-white/10"><Scale className="size-6" /></span>
              <div>
                <p className="font-serif text-[1.2rem]">Termo de Parceria Profissional</p>
                <p className="text-[0.8rem] text-navy-200">Divisão de honorários 50/50 · {partnership.code}</p>
              </div>
            </div>
          </div>
          <CardBody className="space-y-6 px-7 py-6">
            <section>
              <h3 className="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Objeto</h3>
              <p className="text-[0.92rem] leading-relaxed text-ink">
                Atuação conjunta na demanda <strong>{demand?.title}</strong> ({demand?.area}), com divisão igualitária
                dos honorários líquidos do serviço, conforme valores abaixo.
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <PartyCard role="Advogado(a) Iniciante" lawyer={initiate} accepted={partnership.acceptedByInitiate ?? (meIsInitiate && signed ? new Date().toISOString() : undefined)} />
              <PartyCard role="Advogado(a) Parceiro(a)" lawyer={partner} accepted={partnership.acceptedByPartner ?? (!meIsInitiate && signed ? new Date().toISOString() : undefined)} />
            </section>

            <section>
              <h3 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Divisão de valores</h3>
              <div className="overflow-hidden rounded-xl border border-line">
                <Row label="Valor do serviço" value={brl(partnership.serviceValue)} />
                <Row label={`Taxa de intermediação (${(partnership.feePct * 100).toFixed(0)}%)`} value={`− ${brl(fee)}`} sub icon={<Percent className="size-3.5" />} />
                <Row label="Honorários líquidos" value={brl(net)} sub />
                <Row label="Parte de cada advogado (50%)" value={brl(share)} highlight />
              </div>
              <p className="mt-2 text-[0.78rem] text-faint">A taxa de intermediação custeia a operação do projeto de extensão. Valores meramente demonstrativos.</p>
            </section>

            <section>
              <h3 className="mb-1.5 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Cláusulas</h3>
              <ol className="list-decimal space-y-1.5 pl-5 text-[0.86rem] text-ink-soft">
                <li>As partes atuarão de forma colaborativa e ética, observando o Estatuto da Advocacia.</li>
                <li>A divisão dos honorários líquidos será igualitária (50% para cada).</li>
                <li>O sigilo profissional e o segredo de justiça serão integralmente respeitados.</li>
                <li>O aceite eletrônico de ambas as partes formaliza este termo (data, hora e identificação registradas).</li>
              </ol>
            </section>
          </CardBody>
        </Card>

        {/* Action rail */}
        <div className="space-y-4">
          <Card className="lg:sticky lg:top-24">
            <CardBody>
              <h3 className="flex items-center gap-2 text-[0.95rem] text-navy-900"><Handshake className="size-4.5 text-navy-600" /> Aceite eletrônico</h3>

              <div className="mt-4 space-y-2.5">
                <SignRow name={initiate?.name ?? ""} ts={partnership.acceptedByInitiate ?? (meIsInitiate && signed ? new Date().toISOString() : undefined)} />
                <SignRow name={partner?.name ?? ""} ts={partnership.acceptedByPartner ?? (!meIsInitiate && signed ? new Date().toISOString() : undefined)} />
              </div>

              <div className="my-4 border-t border-line" />

              {iSignedNow ? (
                <div className="rounded-lg border border-success/30 bg-success-soft/60 p-3 text-center text-[0.84rem] text-success-ink">
                  <CheckCircle2 className="mx-auto mb-1 size-5 text-success" /> Você já assinou este termo.
                </div>
              ) : (
                <Button full iconRight={<PenLine className="size-4" />} onClick={() => { setSigned(true); toast("Aceite registrado com data, hora e identificação."); }}>Assinar eletronicamente</Button>
              )}

              <Button full variant="outline" className="mt-2" iconLeft={<Download className="size-4" />} onClick={() => toast("Termo exportado em PDF (demonstração).")}>Exportar PDF</Button>

              <p className="mt-3 text-[0.76rem] text-faint text-center">Repositório de termos · meta de 300 na vigência.</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function PartyCard({ role, lawyer, accepted }: { role: string; lawyer?: ReturnType<typeof lawyerById>; accepted?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2/40 p-4">
      <p className="text-[0.72rem] uppercase tracking-wide text-faint">{role}</p>
      <div className="mt-2 flex items-center gap-2.5">
        <Avatar name={lawyer?.name ?? "?"} size="sm" />
        <div className="min-w-0"><p className="text-[0.88rem] font-semibold text-navy-900 truncate">{lawyer?.name}</p><p className="text-[0.76rem] text-muted">{lawyer?.oab}</p></div>
      </div>
      {accepted ? <Badge tone="success" className="mt-2.5" icon={<CheckCircle2 className="size-3" />}>Aceitou</Badge> : <Badge tone="warning" className="mt-2.5" icon={<Clock className="size-3" />}>Aguardando</Badge>}
    </div>
  );
}

function Row({ label, value, sub, highlight, icon }: { label: string; value: string; sub?: boolean; highlight?: boolean; icon?: React.ReactNode }) {
  return (
    <div className={cn("flex items-center justify-between px-4 py-2.5 border-b border-line last:border-0", highlight && "bg-bordo-50/60", sub && "bg-surface-2/40")}>
      <span className={cn("inline-flex items-center gap-1.5 text-[0.86rem]", highlight ? "font-semibold text-navy-900" : "text-ink-soft")}>{icon}{label}</span>
      <span className={cn("font-mono tabular-nums", highlight ? "text-[1rem] font-bold text-bordo-700" : "text-[0.9rem] text-navy-900")}>{value}</span>
    </div>
  );
}

function SignRow({ name, ts }: { name: string; ts?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", ts ? "bg-success/15 text-success" : "bg-warning-soft text-warning-ink")}>
        {ts ? <CheckCircle2 className="size-4" /> : <Clock className="size-4" />}
      </span>
      <div className="min-w-0">
        <p className="text-[0.84rem] font-medium text-navy-900 truncate">{name}</p>
        <p className="text-[0.74rem] text-faint">{ts ? formatDateTime(ts) : "Aguardando assinatura"}</p>
      </div>
    </div>
  );
}
