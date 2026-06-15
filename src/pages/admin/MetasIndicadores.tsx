import { useMemo, useState } from "react";
import { Target, CheckCircle2, Clock, Pencil, CalendarClock, TrendingUp } from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Field";
import { formatDate } from "@/lib/utils";
import type { Goal } from "@/data/admin";

/** Formats a goal value according to its unit. */
function formatGoalValue(value: number, unit: Goal["unit"]): string {
  if (unit === "%") return `${value}%`;
  if (unit === "media") return value.toFixed(1);
  return value.toLocaleString("pt-BR");
}

/** A goal is met when current reaches/exceeds target (assuming higherIsBetter). */
function isGoalMet(goal: Goal): boolean {
  return goal.higherIsBetter ? goal.current >= goal.target : goal.current <= goal.target;
}

/** Progress percentage capped at 100. */
function goalProgress(goal: Goal): number {
  if (goal.target === 0) return goal.current === 0 ? 100 : 0;
  return Math.min(100, Math.round((goal.current / goal.target) * 100));
}

export function MetasIndicadores() {
  const { toast } = useApp();
  const { goals, updateGoal } = useAdmin();
  const [editId, setEditId] = useState<string | null>(null);

  const editing = goals.find((g) => g.id === editId) ?? null;

  const metCount = useMemo(() => goals.filter(isGoalMet).length, [goals]);
  const total = goals.length;
  const summaryPct = total > 0 ? Math.round((metCount / total) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Metas & indicadores"
        description="Acompanhe e ajuste as metas estratégicas da plataforma e a evolução de cada indicador."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Metas & indicadores" }]}
      />

      {/* Header summary */}
      <Card className="mb-6">
        <CardBody className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
              <Target className="size-5" />
            </span>
            <div>
              <p className="text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Desempenho geral</p>
              <p className="font-serif text-[1.35rem] leading-tight text-navy-900">
                {metCount} de {total} metas atingidas
              </p>
              <p className="mt-0.5 text-[0.85rem] text-muted">
                {metCount === total
                  ? "Todas as metas do período foram alcançadas."
                  : `Faltam ${total - metCount} meta(s) para concluir o ciclo.`}
              </p>
            </div>
          </div>
          <div className="w-full max-w-xs">
            <Progress value={summaryPct} tone={metCount === total ? "success" : "navy"} showLabel />
          </div>
        </CardBody>
      </Card>

      {/* Goal cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {goals.map((goal) => {
          const met = isGoalMet(goal);
          const pct = goalProgress(goal);
          return (
            <Card key={goal.id}>
              <CardBody className="space-y-4 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[1rem] font-semibold leading-snug text-navy-900">{goal.label}</h3>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-[0.8rem] text-muted">
                      <CalendarClock className="size-3.5 text-faint" />
                      Prazo: {formatDate(goal.deadline)}
                    </p>
                  </div>
                  {met ? (
                    <Badge tone="success" icon={<CheckCircle2 className="size-3" />}>
                      Meta atingida
                    </Badge>
                  ) : (
                    <Badge tone="warning" icon={<Clock className="size-3" />}>
                      Em progresso
                    </Badge>
                  )}
                </div>

                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[0.74rem] font-medium uppercase tracking-wide text-faint">Atual</p>
                    <p className="font-serif text-[1.6rem] leading-none text-navy-900 tabular-nums">
                      {formatGoalValue(goal.current, goal.unit)}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[0.85rem] text-ink-soft">
                    <TrendingUp className="size-3.5 text-faint" />
                    Meta:{" "}
                    <span className="font-semibold text-navy-800 tabular-nums">
                      {formatGoalValue(goal.target, goal.unit)}
                    </span>
                  </div>
                </div>

                <Progress value={pct} tone={met ? "success" : "warning"} showLabel />

                <div className="flex justify-end border-t border-line pt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    iconLeft={<Pencil className="size-3.5" />}
                    onClick={() => setEditId(goal.id)}
                  >
                    Editar meta
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <EditGoalModal
        goal={editing}
        onClose={() => setEditId(null)}
        onSave={(patch) => {
          if (!editing) return;
          updateGoal(editing.id, patch);
          setEditId(null);
          toast(`Meta "${editing.label}" atualizada.`);
        }}
      />
    </>
  );
}

function EditGoalModal({
  goal,
  onClose,
  onSave,
}: {
  goal: Goal | null;
  onClose: () => void;
  onSave: (patch: Partial<Goal>) => void;
}) {
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [touched, setTouched] = useState(false);

  // Sync local inputs when a new goal is opened.
  if (goal && !touched) {
    setTarget(String(goal.target));
    setCurrent(String(goal.current));
    setTouched(true);
  }

  const close = () => {
    setTouched(false);
    onClose();
  };

  const step = goal?.unit === "media" ? "0.1" : "1";
  const targetNum = Number(target);
  const currentNum = Number(current);
  const valid =
    goal !== null &&
    target.trim() !== "" &&
    !Number.isNaN(targetNum) &&
    targetNum > 0 &&
    !Number.isNaN(currentNum) &&
    currentNum >= 0;

  return (
    <Modal
      open={goal !== null}
      onClose={close}
      title="Editar meta"
      description={goal?.label}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancelar
          </Button>
          <Button
            disabled={!valid}
            iconLeft={<CheckCircle2 className="size-4" />}
            onClick={() => {
              setTouched(false);
              onSave({ target: targetNum, current: currentNum });
            }}
          >
            Salvar meta
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field
          label="Valor-alvo"
          hint={
            goal?.unit === "%"
              ? "Em porcentagem (%)."
              : goal?.unit === "media"
                ? "Nota média (ex.: 4,5)."
                : "Número absoluto."
          }
          required
        >
          <Input
            type="number"
            min={0}
            step={step}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Valor-alvo"
          />
        </Field>
        <Field label="Valor atual" hint="Acompanhamento realizado no período.">
          <Input
            type="number"
            min={0}
            step={step}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Valor atual"
          />
        </Field>
      </div>
    </Modal>
  );
}
