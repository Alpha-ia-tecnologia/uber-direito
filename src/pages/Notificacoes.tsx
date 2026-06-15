import { Link } from "react-router-dom";
import { Bell, Check, FileText, MessageSquare, Sparkles, Search, Handshake, Star, UserCheck, PlayCircle } from "lucide-react";
import { useApp } from "@/store/app-context";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Misc";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationType } from "@/data/types";

const iconFor: Record<NotificationType, React.ReactNode> = {
  cadastro: <UserCheck className="size-5" />,
  diagnostico: <Sparkles className="size-5" />,
  historico: <FileText className="size-5" />,
  matching: <Search className="size-5" />,
  mensagem: <MessageSquare className="size-5" />,
  atendimento: <PlayCircle className="size-5" />,
  parceria: <Handshake className="size-5" />,
  avaliacao: <Star className="size-5" />,
};

export function Notificacoes() {
  const { notifications, unreadCount, markRead, markAllRead } = useApp();

  return (
    <>
      <PageHeader
        title="Notificações"
        description="Eventos relevantes: validações, diagnósticos, matching, mensagens, atendimentos e parcerias."
        breadcrumbs={[{ label: "Início", to: "/app" }, { label: "Notificações" }]}
        actions={unreadCount > 0 ? <Button variant="outline" iconLeft={<Check className="size-4" />} onClick={markAllRead}>Marcar todas como lidas</Button> : undefined}
      />

      {notifications.length === 0 ? (
        <Card><EmptyState icon={<Bell className="size-7" />} title="Tudo em dia" description="Você não tem notificações no momento." /></Card>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {notifications.map((n) => (
              <li key={n.id}>
                <Link to={n.link ?? "#"} onClick={() => markRead(n.id)} className={cn("flex gap-4 px-5 py-4 transition-colors hover:bg-navy-50/40", !n.read && "bg-bordo-50/30")}>
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", n.read ? "bg-surface-2 text-muted" : "bg-navy-100 text-navy-700")}>{iconFor[n.type]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-navy-900">{n.title}</p>
                      {!n.read && <span className="size-2 rounded-full bg-bordo-500" />}
                    </div>
                    <p className="mt-0.5 text-[0.88rem] text-muted text-pretty">{n.body}</p>
                    <span className="mt-1 block text-[0.76rem] text-faint">{timeAgo(n.createdAt)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
