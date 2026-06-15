import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  FileCheck2,
  Lock,
  Accessibility,
  Pencil,
  CalendarCheck,
  MessageSquare,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { lawyerById } from "@/data/lawyers";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Rating } from "@/components/ui/Rating";
import { Seal } from "@/components/ui/Seal";
import { Progress } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/StatusBadge";
import { historyStatusMeta } from "@/lib/status";

const availabilityMeta = {
  disponivel: { label: "Disponível", tone: "success" as const },
  limitada: { label: "Disponibilidade limitada", tone: "warning" as const },
  indisponivel: { label: "Indisponível", tone: "neutral" as const },
};

export function PerfilAdvogado() {
  const { id } = useParams();
  const { user } = useApp();
  const lawyer = id ? lawyerById(id) : user;
  const isOwn = !id || id === user.id;

  if (!lawyer) {
    return <Card><EmptyState title="Perfil não encontrado" action={<Link to="/app"><Button>Início</Button></Link>} /></Card>;
  }

  return (
    <>
      <PageHeader
        title={isOwn ? "Meu perfil" : "Perfil do advogado"}
        breadcrumbs={isOwn ? [{ label: "Início", to: "/app" }, { label: "Perfil" }] : [{ label: "Início", to: "/app" }, { label: "Perfil" }]}
        actions={isOwn ? <Button variant="outline" iconLeft={<Pencil className="size-4" />}>Editar perfil</Button> : <Button iconLeft={<MessageSquare className="size-4" />}>Enviar mensagem</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.55fr]">
        {/* Identity card */}
        <div className="space-y-4">
          <Card>
            <div className="h-20 bg-navy-chrome" />
            <CardBody className="-mt-10 text-center">
              <Avatar name={lawyer.name} size="xl" className="mx-auto" ring />
              <h2 className="mt-3 font-serif text-[1.25rem] text-navy-900">{lawyer.name}</h2>
              <p className="text-[0.82rem] text-muted">{lawyer.oab} · {lawyer.seccional}</p>
              <div className="mt-3 flex items-center justify-center"><Rating value={lawyer.rating} count={lawyer.ratingCount} /></div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <Seal seal={lawyer.seal} />
                <Badge tone={availabilityMeta[lawyer.availability].tone} dot>{availabilityMeta[lawyer.availability].label}</Badge>
                {lawyer.isPCD && <Badge tone="info" icon={<Accessibility className="size-3" />}>Advogada(o) com deficiência</Badge>}
              </div>

              <div className="mt-5 space-y-2.5 border-t border-line pt-4 text-left text-[0.85rem] text-ink-soft">
                <p className="flex items-center gap-2.5"><MapPin className="size-4 text-faint" /> {lawyer.city}</p>
                <p className="flex items-center gap-2.5"><Mail className="size-4 text-faint" /> {lawyer.email}</p>
                <p className="flex items-center gap-2.5"><Phone className="size-4 text-faint" /> {lawyer.phone}</p>
                <p className="flex items-center gap-2.5"><CalendarCheck className="size-4 text-faint" /> Inscrito desde {new Date(lawyer.oabRegisteredAt).getFullYear()} · {lawyer.yearsRegistered} anos</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-[0.95rem] text-navy-900">Áreas e especialidades</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {lawyer.areas.map((a) => <Badge key={a} tone="navy">{a}</Badge>)}
              </div>
              {lawyer.specialties.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                  {lawyer.specialties.map((s) => <Badge key={s} tone="neutral">{s}</Badge>)}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Sobre" />
            <CardBody className="pt-0"><p className="text-[0.92rem] leading-relaxed text-ink-soft text-pretty">{lawyer.bio}</p></CardBody>
          </Card>

          {/* Validated indicators (RF-12, RF-13) */}
          <Card>
            <CardHeader
              icon={<ShieldCheck className="size-5" />}
              title="Indicadores de atuação validados"
              subtitle="Baseados exclusivamente em dados confirmados no DataJud/CNJ"
            />
            <CardBody className="pt-0">
              {lawyer.indicators.length === 0 ? (
                <p className="py-3 text-[0.86rem] text-muted">Sem indicadores validados publicados.</p>
              ) : (
                <div className="space-y-4">
                  {lawyer.indicators.map((ind) => (
                    <div key={ind.area}>
                      <div className="mb-1.5 flex items-center justify-between text-[0.86rem]">
                        <span className="font-medium text-navy-900">{ind.area}</span>
                        <span className="text-muted">{ind.successfulActions} de {ind.totalProcesses} ações exitosas</span>
                      </div>
                      <Progress value={(ind.successfulActions / ind.totalProcesses) * 100} tone="success" showLabel />
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* History (RF-09..RF-13) */}
          <Card>
            <CardHeader icon={<FileCheck2 className="size-5" />} title="Histórico de atuação" subtitle="Processos validados · sigilo preservado" />
            <CardBody className="pt-0">
              {lawyer.history.length === 0 ? (
                <p className="py-3 text-[0.86rem] text-muted">Sem histórico importado.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {lawyer.history.map((h) => (
                    <li key={h.id} className="flex flex-wrap items-center gap-3 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[0.82rem] text-navy-900 inline-flex items-center gap-2">
                          {h.sealed ? <span className="inline-flex items-center gap-1 text-muted"><Lock className="size-3.5" /> Processo sob segredo de justiça</span> : h.processNumber}
                        </p>
                        <p className="text-[0.78rem] text-muted">{h.area} · {h.source} · {h.year}</p>
                      </div>
                      {h.outcome === "exitoso" && !h.sealed && <Badge tone="success">Exitoso</Badge>}
                      <StatusBadge meta={historyStatusMeta[h.status]} />
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
