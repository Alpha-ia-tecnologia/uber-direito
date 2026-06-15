import { Link } from "react-router-dom";
import { MessagesSquare, ArrowRight, CalendarClock, Video } from "lucide-react";
import { useApp } from "@/store/app-context";
import { services, demands } from "@/data/mock";
import { lawyerById } from "@/data/lawyers";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/Misc";
import { Progress } from "@/components/ui/Progress";
import { formatDateTime } from "@/lib/utils";

export function Atendimentos() {
  const { user } = useApp();
  const mine = services.filter((s) => s.initiateId === user.id || s.specialistId === user.id);

  return (
    <>
      <PageHeader
        title="Atendimentos"
        description="Converse, agende sessões e acompanhe o andamento de cada caso."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Atendimentos" }]}
      />

      {mine.length === 0 ? (
        <Card><EmptyState icon={<MessagesSquare className="size-7" />} title="Nenhum atendimento em andamento" description="Quando um especialista aceitar sua demanda, o atendimento aparece aqui." action={<Link to="/app/demandas"><Button>Ver demandas</Button></Link>} /></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {mine.map((s) => {
            const demand = demands.find((d) => d.id === s.demandId);
            const other = lawyerById(s.initiateId === user.id ? s.specialistId : s.initiateId);
            const lastMsg = s.messages.filter((m) => !m.system).at(-1);
            const next = s.sessions.find((x) => x.status === "agendada");
            const done = s.milestones.filter((m) => m.done).length;
            return (
              <Card key={s.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardBody>
                  <div className="flex items-center justify-between">
                    <Badge tone={s.status === "concluido" ? "success" : "accent"}>{s.status === "em_andamento" ? "Em andamento" : s.status === "agendado" ? "Agendado" : "Concluído"}</Badge>
                    <span className="font-mono text-[0.74rem] text-muted">{demand?.code}</span>
                  </div>
                  <h3 className="mt-2.5 text-[1.05rem] text-navy-900">{demand?.title}</h3>

                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-line bg-surface-2/40 p-3">
                    <Avatar name={other?.name ?? "?"} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.86rem] font-semibold text-navy-900">{other?.name}</p>
                      {lastMsg && <p className="truncate text-[0.8rem] text-muted">{lastMsg.body}</p>}
                    </div>
                  </div>

                  <div className="mt-3"><Progress value={(done / s.milestones.length) * 100} tone="accent" showLabel /></div>

                  {next && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-navy-50/70 px-3 py-2 text-[0.8rem] text-navy-800">
                      <CalendarClock className="size-4 text-navy-600" /> Próxima sessão: {formatDateTime(next.scheduledAt)}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Link to={`/app/atendimento/${s.id}`} className="flex-1"><Button full size="sm" iconRight={<ArrowRight className="size-3.5" />}>Abrir conversa</Button></Link>
                    {next && <Link to={`/app/video/${next.id}`}><Button size="sm" variant="outline" iconLeft={<Video className="size-3.5" />}>Sala</Button></Link>}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
