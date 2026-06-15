import { useMemo } from "react";
import { ShieldCheck, Check, Minus, Crown, KeyRound, Info } from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { capabilities, adminRoles, type AdminRole } from "@/data/admin";
import { cn } from "@/lib/utils";

export function PapeisPermissoes() {
  const { toast } = useApp();
  const { permissions, togglePermission } = useAdmin();

  // Most-privileged role: the one with the greatest number of granted capabilities.
  const grantsByRole = useMemo(() => {
    const counts = Object.fromEntries(adminRoles.map((r) => [r.id, 0])) as Record<AdminRole, number>;
    for (const cap of capabilities) {
      for (const role of adminRoles) {
        if (permissions[cap.id]?.[role.id]) counts[role.id] += 1;
      }
    }
    return counts;
  }, [permissions]);

  const topRole = useMemo(
    () => adminRoles.reduce((best, r) => (grantsByRole[r.id] > grantsByRole[best.id] ? r : best), adminRoles[0]),
    [grantsByRole],
  );

  const handleToggle = (capId: string, role: AdminRole, label: string, roleLabel: string) => {
    const willGrant = !permissions[capId]?.[role];
    togglePermission(capId, role);
    toast(`${willGrant ? "Concedida" : "Removida"} a permissão “${label}” para ${roleLabel}.`);
  };

  return (
    <>
      <PageHeader
        title="Papéis e permissões"
        description="Defina o que cada papel pode fazer na plataforma (RF-66)."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Papéis e permissões" }]}
        actions={<Badge tone="brass" icon={<Crown className="size-3" />}>{topRole.label} · acesso máximo</Badge>}
      />

      <p className="mb-5 max-w-prose text-[0.9rem] leading-relaxed text-muted">
        A matriz abaixo cruza cada <strong className="font-semibold text-ink-soft">capacidade</strong> do sistema com os{" "}
        <strong className="font-semibold text-ink-soft">papéis</strong> de acesso. Clique numa célula para conceder ou revogar a
        permissão correspondente. O <strong className="font-semibold text-ink-soft">Comitê Gestor</strong> concentra as funções de
        governança e mantém o nível de acesso mais amplo.
      </p>

      <Card>
        <CardHeader
          icon={<KeyRound className="size-5" />}
          title="Matriz de permissões"
          subtitle={`${capabilities.length} capacidades · ${adminRoles.length} papéis`}
          action={
            <div className="hidden items-center gap-4 text-[0.76rem] text-muted sm:flex">
              <span className="inline-flex items-center gap-1.5">
                <span className="grid size-4 place-items-center rounded-md bg-navy-700 text-white">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                Permitido
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="grid size-4 place-items-center rounded-md border border-line bg-surface-2 text-faint">
                  <Minus className="size-2.5" strokeWidth={3} />
                </span>
                Negado
              </span>
            </div>
          }
        />
        <CardBody className="pt-0">
          <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[44rem] border-collapse text-left">
              <caption className="sr-only">
                Matriz de permissões: capacidades nas linhas e papéis de acesso nas colunas. Cada célula indica se o papel possui a
                permissão.
              </caption>
              <thead>
                <tr className="border-b border-line">
                  <th
                    scope="col"
                    className="sticky left-0 z-10 bg-surface-2/60 px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-wide text-faint"
                  >
                    Capacidade
                  </th>
                  {adminRoles.map((role) => {
                    const isTop = role.id === topRole.id;
                    return (
                      <th
                        key={role.id}
                        scope="col"
                        className={cn(
                          "bg-surface-2/60 px-3 py-3 text-center align-bottom text-[0.72rem] font-semibold uppercase tracking-wide",
                          isTop ? "text-brass-600" : "text-faint",
                        )}
                      >
                        <span className="inline-flex flex-col items-center gap-1">
                          {isTop ? (
                            <ShieldCheck className="size-3.5" aria-hidden />
                          ) : (
                            <span className="size-3.5" aria-hidden />
                          )}
                          <span className="leading-tight">{role.label}</span>
                          {isTop && (
                            <span className="text-[0.62rem] font-medium normal-case tracking-normal text-muted">
                              Governança
                            </span>
                          )}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {capabilities.map((cap) => (
                  <tr key={cap.id} className="border-b border-line last:border-0 hover:bg-navy-50/30">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-surface px-4 py-3 text-left align-top font-normal"
                    >
                      <span className="block text-[0.88rem] font-semibold text-navy-900">{cap.label}</span>
                      <span className="mt-0.5 block max-w-xs text-[0.76rem] text-muted">{cap.description}</span>
                    </th>
                    {adminRoles.map((role) => {
                      const granted = !!permissions[cap.id]?.[role.id];
                      const isTop = role.id === topRole.id;
                      return (
                        <td
                          key={role.id}
                          className={cn("px-3 py-3 text-center align-middle", isTop && "bg-brass-300/10")}
                        >
                          <button
                            type="button"
                            role="switch"
                            aria-checked={granted}
                            aria-label={`${cap.label} — ${role.label}: ${granted ? "permitido" : "negado"}`}
                            onClick={() => handleToggle(cap.id, role.id, cap.label, role.label)}
                            className={cn(
                              "grid size-7 place-items-center rounded-md border transition-colors",
                              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordo-500",
                              granted
                                ? "border-navy-700 bg-navy-700 text-white hover:bg-navy-800"
                                : "border-line bg-surface-2 text-faint hover:border-navy-300 hover:text-navy-400",
                            )}
                          >
                            {granted ? (
                              <Check className="size-4" strokeWidth={3} aria-hidden />
                            ) : (
                              <Minus className="size-3.5" strokeWidth={3} aria-hidden />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 flex items-start gap-2 text-[0.78rem] text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0 text-faint" aria-hidden />
            As alterações são aplicadas imediatamente e registradas na trilha de auditoria. Permissões de governança (validação,
            mediação e configuração) ficam restritas ao Comitê Gestor e à equipe executora.
          </p>
        </CardBody>
      </Card>
    </>
  );
}
