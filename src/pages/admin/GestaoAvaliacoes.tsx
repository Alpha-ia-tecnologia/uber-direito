import { useMemo, useState } from "react";
import { Star, MessageSquareQuote, EyeOff, Eye, ArrowRight, MessagesSquare } from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { lawyerById } from "@/data/lawyers";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Rating } from "@/components/ui/Rating";
import { Stat } from "@/components/ui/Stat";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Misc";
import { cn, formatDate, initials } from "@/lib/utils";
import type { Rating as RatingType } from "@/data/types";

type ViewFilter = "todas" | "visiveis" | "ocultas";

const filterTabs: { id: ViewFilter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "visiveis", label: "Visíveis" },
  { id: "ocultas", label: "Ocultas" },
];

const criteriaLabels: { key: keyof RatingType["criteria"]; label: string }[] = [
  { key: "clareza", label: "Clareza" },
  { key: "pontualidade", label: "Pontualidade" },
  { key: "tecnica", label: "Domínio técnico" },
  { key: "empatia", label: "Empatia" },
];

export function GestaoAvaliacoes() {
  const { toast } = useApp();
  const { ratings, hiddenRatings, toggleRatingHidden } = useAdmin();
  const [filter, setFilter] = useState<ViewFilter>("todas");

  const isHidden = (id: string) => hiddenRatings.includes(id);

  const stats = useMemo(() => {
    const total = ratings.length;
    const avg = total ? ratings.reduce((acc, r) => acc + r.score, 0) / total : 0;
    const fiveStars = ratings.filter((r) => r.score === 5).length;
    return { total, avg, fiveStars };
  }, [ratings]);

  const filtered = useMemo(
    () =>
      ratings
        .filter((r) => {
          if (filter === "visiveis") return !isHidden(r.id);
          if (filter === "ocultas") return isHidden(r.id);
          return true;
        })
        .slice()
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ratings, filter, hiddenRatings],
  );

  return (
    <>
      <PageHeader
        title="Gestão de avaliações"
        description="Modere as avaliações trocadas entre advogados após cada atendimento (RF-67)."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Avaliações" }]}
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total de avaliações" value={stats.total} icon={<MessageSquareQuote className="size-4.5" />} />
        <Stat
          label="Média geral"
          value={stats.avg.toFixed(1)}
          icon={<Star className="size-4.5" />}
          goal={{ met: stats.avg >= 4, text: stats.avg >= 4 ? "Meta ≥ 4,0 atingida" : "Abaixo da meta (4,0)" }}
        />
        <Stat label="Cinco estrelas" value={stats.fiveStars} icon={<Star className="size-4.5" />} hint="Avaliações com nota máxima" />
        <Stat label="Ocultas" value={hiddenRatings.length} icon={<EyeOff className="size-4.5" />} />
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {filterTabs.map((t) => {
          const count = t.id === "todas" ? ratings.length : t.id === "ocultas" ? hiddenRatings.length : ratings.length - hiddenRatings.length;
          return (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors",
                filter === t.id ? "bg-navy-700 text-white" : "bg-surface-2 border border-line text-ink-soft hover:border-navy-300",
              )}
            >
              {t.label}
              <span className={cn("tabular-nums", filter === t.id ? "text-white/70" : "text-faint")}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<MessagesSquare className="size-7" />}
            title="Nenhuma avaliação encontrada"
            description={
              filter === "ocultas"
                ? "Nenhuma avaliação foi ocultada até o momento."
                : "Ajuste o filtro para visualizar as avaliações registradas."
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((r) => (
            <RatingCard key={r.id} rating={r} hidden={isHidden(r.id)} onToggle={() => {
              const hide = !isHidden(r.id);
              toggleRatingHidden(r.id);
              toast(hide ? "Avaliação ocultada da plataforma." : "Avaliação reexibida.");
            }} />
          ))}
        </div>
      )}
    </>
  );
}

function RatingCard({ rating, hidden, onToggle }: { rating: RatingType; hidden: boolean; onToggle: () => void }) {
  const from = lawyerById(rating.fromId);
  const to = lawyerById(rating.toId);
  const fromName = from?.name ?? "Advogado(a)";
  const toName = to?.name ?? "Advogado(a)";

  return (
    <Card className={cn("transition-opacity", hidden && "opacity-55")}>
      <CardBody className="pt-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar name={fromName} size="sm" />
            <div className="flex min-w-0 items-center gap-1.5 text-[0.85rem]">
              <span className="truncate font-semibold text-navy-900" title={fromName}>{fromName.split(" ")[0]}</span>
              <ArrowRight className="size-3.5 shrink-0 text-faint" aria-label="avaliou" />
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy-50 text-[0.62rem] font-semibold text-navy-700" aria-hidden>
                  {initials(toName)}
                </span>
                <span className="truncate font-semibold text-navy-900" title={toName}>{toName.split(" ")[0]}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hidden && <Badge tone="danger" icon={<EyeOff className="size-3" />}>Oculta</Badge>}
            <Rating value={rating.score} size={14} />
          </div>
        </div>

        <blockquote className="mt-3.5 border-l-2 border-bordo-200 pl-3 text-[0.9rem] italic leading-relaxed text-ink-soft">
          “{rating.comment}”
        </blockquote>

        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {criteriaLabels.map((c) => (
            <Badge key={c.key} tone="neutral">
              {c.label}
              <span className="tabular-nums text-navy-700">{rating.criteria[c.key].toFixed(1)}</span>
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
          <span className="text-[0.78rem] text-muted">{formatDate(rating.createdAt)}</span>
          {hidden ? (
            <Button size="sm" variant="outline" iconLeft={<Eye className="size-3.5" />} onClick={onToggle}>
              Reexibir
            </Button>
          ) : (
            <Button size="sm" variant="ghost" className="text-danger-ink hover:bg-danger-soft" iconLeft={<EyeOff className="size-3.5" />} onClick={onToggle}>
              Ocultar
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
