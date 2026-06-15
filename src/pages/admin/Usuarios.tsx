import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  UserPlus,
  Check,
  Ban,
  Eye,
  Accessibility,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Rating } from "@/components/ui/Rating";
import { Seal } from "@/components/ui/Seal";
import { Stat } from "@/components/ui/Stat";
import { Drawer } from "@/components/ui/Drawer";
import { Modal } from "@/components/ui/Modal";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Field, Input, Select, Toggle } from "@/components/ui/Field";
import { KeyValue } from "@/components/ui/Misc";
import { StatusBadge } from "@/components/StatusBadge";
import { accountStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Lawyer, Role, LegalArea, AccountStatus } from "@/data/types";

const roleLabel: Record<Role, string> = { iniciante: "Iniciante", especialista: "Especialista", parceiro: "Parceiro", admin: "Comitê" };
const roleTone: Record<Role, "navy" | "accent" | "info" | "brass"> = { iniciante: "info", especialista: "accent", parceiro: "navy", admin: "brass" };
const allAreas: LegalArea[] = ["Direito do Trabalho", "Direito de Família", "Direito do Consumidor", "Direito Previdenciário", "Direito Penal", "Direito Civil", "Direito Empresarial", "Direito Tributário", "Direitos Humanos", "Direito Imobiliário"];

export function Usuarios() {
  const { toast } = useApp();
  const { lawyers, stats, setLawyerStatus, toggleLawyerRole, updateLawyer, addLawyer } = useAdmin();
  const [roleFilter, setRoleFilter] = useState<Role | "todos">("todos");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "todos">("todos");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const selected = lawyers.find((l) => l.id === openId) ?? null;

  const filtered = useMemo(
    () =>
      lawyers.filter(
        (l) =>
          (roleFilter === "todos" || l.roles.includes(roleFilter)) &&
          (statusFilter === "todos" || l.accountStatus === statusFilter) &&
          (q === "" || l.name.toLowerCase().includes(q.toLowerCase()) || l.oab.toLowerCase().includes(q.toLowerCase()) || l.email.toLowerCase().includes(q.toLowerCase())),
      ),
    [lawyers, roleFilter, statusFilter, q],
  );

  const columns: Column<Lawyer>[] = [
    {
      key: "name",
      header: "Advogado",
      sortValue: (l) => l.name,
      render: (l) => (
        <div className="flex items-center gap-3">
          <Avatar name={l.name} size="sm" />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-semibold text-navy-900">{l.name} {l.isPCD && <Accessibility className="size-3.5 text-info" aria-label="PCD" />}</p>
            <p className="text-[0.76rem] text-muted">{l.oab} · {l.email}</p>
          </div>
        </div>
      ),
    },
    { key: "roles", header: "Papéis", render: (l) => <div className="flex flex-wrap gap-1">{l.roles.map((r) => <Badge key={r} tone={roleTone[r]}>{roleLabel[r]}</Badge>)}</div> },
    { key: "status", header: "Conta", sortValue: (l) => l.accountStatus, render: (l) => <StatusBadge meta={accountStatusMeta[l.accountStatus]} /> },
    { key: "rating", header: "Avaliação", align: "right", sortValue: (l) => l.rating, hideSmall: true, render: (l) => (l.ratingCount > 0 ? <span className="tabular-nums text-ink-soft">{l.rating.toFixed(1)} <span className="text-faint">({l.ratingCount})</span></span> : <span className="text-faint">—</span>) },
    { key: "city", header: "Cidade", sortValue: (l) => l.city, hideSmall: true, render: (l) => <span className="text-muted">{l.city}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Gestão de usuários"
        description="Gerencie contas, papéis e permissões de advogados e equipe (RF-65, RF-66)."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Usuários" }]}
        actions={<Button iconLeft={<UserPlus className="size-4" />} onClick={() => setCreateOpen(true)}>Novo usuário</Button>}
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total de contas" value={stats.totalLawyers} icon={<Users className="size-4.5" />} />
        <Stat label="Validados" value={stats.validated} icon={<ShieldCheck className="size-4.5" />} />
        <Stat label="Pendentes" value={stats.pending} icon={<Eye className="size-4.5" />} goal={stats.pending > 0 ? { met: false, text: "Requer validação" } : undefined} />
        <Stat label="Rejeitados/suspensos" value={stats.suspended} icon={<Ban className="size-4.5" />} />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        getRowId={(l) => l.id}
        onRowClick={(l) => setOpenId(l.id)}
        selectable
        initialSort={{ key: "name", dir: "asc" }}
        emptyTitle="Nenhum usuário encontrado"
        emptyDescription="Ajuste os filtros ou a busca."
        bulkBar={(ids, clear) => (
          <>
            <Button size="sm" iconLeft={<Check className="size-3.5" />} onClick={() => { ids.forEach((id) => setLawyerStatus(id, "validado")); toast(`${ids.length} cadastro(s) validado(s).`); clear(); }}>Validar</Button>
            <Button size="sm" variant="outline" iconLeft={<Ban className="size-3.5" />} onClick={() => { ids.forEach((id) => setLawyerStatus(id, "rejeitado")); toast(`${ids.length} cadastro(s) suspenso(s).`); clear(); }}>Suspender</Button>
          </>
        )}
        rowActions={(l) => (
          <>
            {l.accountStatus !== "validado" && <Button size="sm" variant="ghost" className="text-success-ink hover:bg-success-soft" iconLeft={<Check className="size-3.5" />} onClick={() => { setLawyerStatus(l.id, "validado"); toast(`${l.name.split(" ")[0]} validado(a).`); }}>Validar</Button>}
            <Button size="sm" variant="ghost" iconLeft={<Eye className="size-3.5" />} onClick={() => setOpenId(l.id)}>Abrir</Button>
          </>
        )}
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {(["todos", "iniciante", "especialista", "parceiro", "admin"] as const).map((r) => (
                <button key={r} onClick={() => setRoleFilter(r)} className={cn("rounded-full px-3 py-1 text-[0.8rem] font-medium transition-colors", roleFilter === r ? "bg-navy-700 text-white" : "bg-surface-2 border border-line text-ink-soft hover:border-navy-300")}>
                  {r === "todos" ? "Todos" : roleLabel[r]}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as AccountStatus | "todos")} className="h-9 w-40 text-[0.84rem]">
                <option value="todos">Toda situação</option>
                <option value="validado">Validados</option>
                <option value="pendente">Pendentes</option>
                <option value="rejeitado">Rejeitados</option>
              </Select>
              <div className="relative w-full lg:w-60">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nome, OAB, e-mail…" className="h-9 pl-9 text-[0.84rem]" />
              </div>
            </div>
          </div>
        }
      />

      {/* Detail / edit drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setOpenId(null)}
        title={selected?.name ?? ""}
        subtitle={selected ? `${selected.oab} · ${selected.seccional}` : ""}
        icon={selected ? <Avatar name={selected.name} size="sm" /> : undefined}
        width="md"
        footer={
          selected && (
            <>
              <a href="https://www.oab.org.br" target="_blank" rel="noreferrer" className="mr-auto inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-navy-600 hover:text-navy-800"><ExternalLink className="size-3.5" /> Consultar OAB</a>
              <Button variant="ghost" onClick={() => setOpenId(null)}>Fechar</Button>
              <Button onClick={() => { setOpenId(null); toast("Alterações salvas."); }}>Salvar</Button>
            </>
          )
        }
      >
        {selected && <UserDetail lawyer={selected} onStatus={(s) => { setLawyerStatus(selected.id, s); toast("Situação atualizada."); }} onToggleRole={(r) => toggleLawyerRole(selected.id, r)} onUpdate={(patch) => updateLawyer(selected.id, patch)} />}
      </Drawer>

      <CreateUserModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={(data) => { addLawyer(data); setCreateOpen(false); toast(`Cadastro de ${data.name.split(" ")[0]} criado (pendente de validação).`); }} />
    </>
  );
}

function UserDetail({ lawyer, onStatus, onToggleRole, onUpdate }: { lawyer: Lawyer; onStatus: (s: AccountStatus) => void; onToggleRole: (r: Role) => void; onUpdate: (patch: Partial<Lawyer>) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge meta={accountStatusMeta[lawyer.accountStatus]} />
        <Seal seal={lawyer.seal} />
        {lawyer.isPCD && <Badge tone="info" icon={<Accessibility className="size-3" />}>PCD</Badge>}
        {lawyer.ratingCount > 0 && <Rating value={lawyer.rating} count={lawyer.ratingCount} size={13} />}
      </div>

      <section>
        <h4 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Contato</h4>
        <div className="grid grid-cols-2 gap-3 text-[0.85rem]">
          <KeyValue label="E-mail"><span className="inline-flex items-center gap-1.5"><Mail className="size-3.5 text-faint" />{lawyer.email}</span></KeyValue>
          <KeyValue label="Telefone"><span className="inline-flex items-center gap-1.5"><Phone className="size-3.5 text-faint" />{lawyer.phone}</span></KeyValue>
          <KeyValue label="Cidade"><span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-faint" />{lawyer.city}</span></KeyValue>
          <KeyValue label="Inscrição OAB"><span className="inline-flex items-center gap-1.5"><CalendarCheck className="size-3.5 text-faint" />{new Date(lawyer.oabRegisteredAt).getFullYear()} · {lawyer.yearsRegistered} anos</span></KeyValue>
        </div>
      </section>

      <section>
        <h4 className="mb-2.5 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Papéis ativos</h4>
        <div className="space-y-2">
          {(["iniciante", "especialista", "parceiro", "admin"] as Role[]).map((r) => (
            <div key={r} className="flex items-center justify-between rounded-lg border border-line bg-surface-2/40 px-3.5 py-2.5">
              <div><p className="text-[0.86rem] font-medium text-navy-900">{roleLabel[r]}</p></div>
              <Toggle checked={lawyer.roles.includes(r)} onChange={() => onToggleRole(r)} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Situação da conta">
          <Select value={lawyer.accountStatus} onChange={(e) => onStatus(e.target.value as AccountStatus)}>
            <option value="validado">Validado</option>
            <option value="pendente">Pendente</option>
            <option value="rejeitado">Rejeitado / suspenso</option>
          </Select>
        </Field>
        <Field label="Disponibilidade">
          <Select value={lawyer.availability} onChange={(e) => onUpdate({ availability: e.target.value as Lawyer["availability"] })}>
            <option value="disponivel">Disponível</option>
            <option value="limitada">Limitada</option>
            <option value="indisponivel">Indisponível</option>
          </Select>
        </Field>
      </section>

      <section className="rounded-lg border border-line bg-surface-2/40 p-3.5">
        <Toggle checked={lawyer.isPCD} onChange={(v) => onUpdate({ isPCD: v })} label="Advogado(a) com deficiência" description="Habilita o atendimento prioritário (RF-31/RF-52)." />
      </section>

      {lawyer.areas.length > 0 && (
        <section>
          <h4 className="mb-2 text-[0.74rem] font-semibold uppercase tracking-wide text-faint">Áreas de atuação</h4>
          <div className="flex flex-wrap gap-1.5">{lawyer.areas.map((a) => <Badge key={a} tone="navy">{a}</Badge>)}</div>
        </section>
      )}

      <Link to={`/app/perfil/${lawyer.id}`} className="inline-flex items-center gap-1.5 text-[0.84rem] font-medium text-bordo-700 hover:underline"><Eye className="size-4" /> Ver perfil público</Link>
    </div>
  );
}

function CreateUserModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (d: Pick<Lawyer, "name" | "oab" | "seccional" | "email" | "phone" | "city" | "areas" | "roles">) => void }) {
  const [form, setForm] = useState({ name: "", oab: "", seccional: "SP", email: "", phone: "", city: "", area: allAreas[0], role: "iniciante" as Role });
  const valid = form.name.trim() && form.oab.trim() && form.email.trim();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo usuário"
      description="O cadastro entra como pendente até a validação da inscrição na OAB."
      footer={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button disabled={!valid} onClick={() => onCreate({ name: form.name, oab: `${form.seccional} ${form.oab}`, seccional: form.seccional, email: form.email, phone: form.phone, city: form.city || `${form.seccional}`, areas: [form.area], roles: [form.role] })} iconLeft={<UserPlus className="size-4" />}>Criar cadastro</Button></>}
    >
      <div className="space-y-4">
        <Field label="Nome completo" required><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome do advogado" /></Field>
        <div className="grid grid-cols-[1fr_6rem] gap-3">
          <Field label="Inscrição OAB" required><Input value={form.oab} onChange={(e) => setForm({ ...form, oab: e.target.value })} placeholder="000.000" /></Field>
          <Field label="Seccional"><Select value={form.seccional} onChange={(e) => setForm({ ...form, seccional: e.target.value })}>{["SP", "RJ", "MG", "RS", "PR", "BA", "DF"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="E-mail" required><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@adv.br" /></Field>
          <Field label="Telefone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(11) 90000-0000" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Área principal"><Select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value as LegalArea })}>{allAreas.map((a) => <option key={a}>{a}</option>)}</Select></Field>
          <Field label="Papel inicial"><Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}><option value="iniciante">Iniciante</option><option value="especialista">Especialista</option><option value="parceiro">Parceiro</option></Select></Field>
        </div>
      </div>
    </Modal>
  );
}
