import { Link } from "react-router-dom";
import { Handshake, ArrowRight, Plus } from "lucide-react";
import { useApp } from "@/store/app-context";
import { partnerships, demands } from "@/data/mock";
import { lawyerById } from "@/data/lawyers";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/StatusBadge";
import { partnershipStatusMeta } from "@/lib/status";
import { brl, formatDate } from "@/lib/utils";

export function Parcerias() {
  const { user } = useApp();
  const mine = partnerships.filter((p) => p.initiateId === user.id || p.partnerId === user.id);

  return (
    <>
      <PageHeader
        title="Parcerias 50/50"
        description="Acompanhe os termos digitais de parceria — proposta, formalização e execução."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Parcerias" }]}
        actions={<Link to="/app/demandas"><Button variant="outline" iconLeft={<Plus className="size-4" />}>Nova a partir de demanda</Button></Link>}
      />

      {mine.length === 0 ? (
        <Card><EmptyState icon={<Handshake className="size-7" />} title="Nenhuma parceria ainda" description="As parcerias nascem de demandas com apoio do tipo “parceria 50/50”." /></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {mine.map((p) => {
            const demand = demands.find((d) => d.id === p.demandId);
            const other = lawyerById(p.initiateId === user.id ? p.partnerId : p.initiateId);
            const share = (p.serviceValue * (1 - p.feePct)) / 2;
            return (
              <Card key={p.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <span className="font-mono text-[0.78rem] text-muted">{p.code}</span>
                  <StatusBadge meta={partnershipStatusMeta[p.status]} />
                </div>
                <CardBody>
                  <h3 className="text-[1.05rem] text-navy-900">{demand?.title}</h3>
                  <div className="mt-3 flex items-center gap-3">
                    <Avatar name={other?.name ?? "?"} size="sm" />
                    <div><p className="text-[0.86rem] font-semibold text-navy-900">{other?.name}</p><p className="text-[0.78rem] text-muted">Parceiro(a) · {other?.city}</p></div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-line bg-surface-2/40 p-3 text-center">
                    <div><p className="text-[0.7rem] uppercase tracking-wide text-faint">Valor</p><p className="font-serif text-[1.05rem] text-navy-900">{brl(p.serviceValue)}</p></div>
                    <div><p className="text-[0.7rem] uppercase tracking-wide text-faint">Sua parte</p><p className="font-serif text-[1.05rem] text-navy-900">{brl(share)}</p></div>
                    <div><p className="text-[0.7rem] uppercase tracking-wide text-faint">Criada</p><p className="text-[0.82rem] text-ink-soft pt-1.5">{formatDate(p.createdAt)}</p></div>
                  </div>
                  <Link to={`/app/parcerias/${p.id}`} className="mt-4 block"><Button full size="sm" variant="outline" iconRight={<ArrowRight className="size-3.5" />}>Abrir termo</Button></Link>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
