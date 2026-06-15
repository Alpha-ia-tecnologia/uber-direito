import { useMemo, useState } from "react";
import {
  FileText,
  BookOpen,
  Megaphone,
  Hand,
  Plus,
  Pencil,
  Trash2,
  Accessibility,
  Eye,
  EyeOff,
  Library,
  CheckCircle2,
  PencilLine,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select, Toggle } from "@/components/ui/Field";
import { formatDate } from "@/lib/utils";
import type { InstitutionalContent } from "@/data/types";

type ContentType = InstitutionalContent["type"];
type ContentStatus = InstitutionalContent["status"];

const typeMeta: Record<ContentType, { label: string; icon: React.ReactNode; tone: "navy" | "info" | "warning" }> = {
  manual: { label: "Manual", icon: <BookOpen className="size-5" />, tone: "navy" },
  material: { label: "Material", icon: <FileText className="size-5" />, tone: "info" },
  aviso: { label: "Aviso", icon: <Megaphone className="size-5" />, tone: "warning" },
};

const typeOptions: ContentType[] = ["manual", "material", "aviso"];
const emptyDraft: Omit<InstitutionalContent, "id" | "updatedAt"> = {
  title: "",
  type: "manual",
  accessible: true,
  status: "rascunho",
};

export function Conteudos() {
  const { toast } = useApp();
  const { content, addContent, updateContent, removeContent } = useAdmin();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<InstitutionalContent | null>(null);
  const [removing, setRemoving] = useState<InstitutionalContent | null>(null);

  const stats = useMemo(
    () => ({
      total: content.length,
      publicados: content.filter((c) => c.status === "publicado").length,
      rascunhos: content.filter((c) => c.status === "rascunho").length,
      acessiveis: content.filter((c) => c.accessible).length,
    }),
    [content],
  );

  const togglePublish = (c: InstitutionalContent) => {
    const next: ContentStatus = c.status === "publicado" ? "rascunho" : "publicado";
    updateContent(c.id, { status: next });
    toast(next === "publicado" ? `"${c.title}" publicado.` : `"${c.title}" voltou para rascunho.`);
  };

  return (
    <>
      <PageHeader
        title="Conteúdos institucionais"
        description="Gerencie o manual acessível, materiais de divulgação e avisos (RF-67)."
        breadcrumbs={[{ label: "Comitê Gestor", to: "/admin" }, { label: "Conteúdos" }]}
        actions={
          <Button iconLeft={<Plus className="size-4" />} onClick={() => setCreateOpen(true)}>
            Novo conteúdo
          </Button>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total de conteúdos" value={stats.total} icon={<Library className="size-4.5" />} />
        <Stat label="Publicados" value={stats.publicados} icon={<CheckCircle2 className="size-4.5" />} />
        <Stat label="Rascunhos" value={stats.rascunhos} icon={<PencilLine className="size-4.5" />} />
        <Stat label="Acessíveis" value={stats.acessiveis} icon={<Accessibility className="size-4.5" />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.map((c) => {
          const meta = typeMeta[c.type];
          const published = c.status === "publicado";
          return (
            <Card key={c.id} className="flex flex-col">
              <CardBody className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-navy-50 text-navy-700">{meta.icon}</span>
                  <Badge tone={published ? "success" : "neutral"} dot>
                    {published ? "Publicado" : "Rascunho"}
                  </Badge>
                </div>
                <h3 className="mt-3 text-balance text-[1rem] text-navy-900">{c.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                  {c.accessible && (
                    <Badge tone="info" icon={<Accessibility className="size-3" />}>
                      Acessível
                    </Badge>
                  )}
                  {c.title.toLowerCase().includes("libras") && (
                    <Badge tone="navy" icon={<Hand className="size-3" />}>
                      Libras
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-[0.78rem] text-faint">Atualizado em {formatDate(c.updatedAt)}</p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                  <Button size="sm" variant="outline" iconLeft={<Pencil className="size-3.5" />} onClick={() => setEditing(c)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    iconLeft={published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    onClick={() => togglePublish(c)}
                  >
                    {published ? "Despublicar" : "Publicar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto text-danger-ink hover:bg-danger-soft"
                    iconLeft={<Trash2 className="size-3.5" />}
                    onClick={() => setRemoving(c)}
                    aria-label={`Excluir ${c.title}`}
                  >
                    Excluir
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <ContentFormModal
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => {
          addContent(data);
          setCreateOpen(false);
          toast(`Conteúdo "${data.title}" criado.`);
        }}
      />

      <ContentFormModal
        open={!!editing}
        mode="edit"
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(data) => {
          if (editing) {
            updateContent(editing.id, data);
            toast(`Conteúdo "${data.title}" atualizado.`);
          }
          setEditing(null);
        }}
      />

      <Modal
        open={!!removing}
        onClose={() => setRemoving(null)}
        title="Excluir conteúdo"
        description="Esta ação remove o conteúdo da plataforma e não pode ser desfeita."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRemoving(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              iconLeft={<Trash2 className="size-4" />}
              onClick={() => {
                if (removing) {
                  removeContent(removing.id);
                  toast(`"${removing.title}" excluído.`);
                }
                setRemoving(null);
              }}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-[0.9rem] text-ink-soft">
          Tem certeza de que deseja excluir <span className="font-semibold text-navy-900">{removing?.title}</span>?
        </p>
      </Modal>
    </>
  );
}

function ContentFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: InstitutionalContent | null;
  onClose: () => void;
  onSubmit: (data: Omit<InstitutionalContent, "id" | "updatedAt">) => void;
}) {
  const [form, setForm] = useState<Omit<InstitutionalContent, "id" | "updatedAt">>(emptyDraft);
  const [lastKey, setLastKey] = useState<string | null>(null);

  // Sync the form to the record being edited (or reset on create) each time the modal opens.
  const key = open ? (initial?.id ?? "__novo__") : null;
  if (key !== lastKey) {
    setLastKey(key);
    if (open) {
      setForm(
        initial
          ? { title: initial.title, type: initial.type, accessible: initial.accessible, status: initial.status }
          : emptyDraft,
      );
    }
  }

  const valid = form.title.trim().length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Novo conteúdo" : "Editar conteúdo"}
      description={
        mode === "create"
          ? "Cadastre o manual acessível, um material de divulgação ou um aviso."
          : "Atualize as informações do conteúdo institucional."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!valid}
            iconLeft={mode === "create" ? <Plus className="size-4" /> : <Pencil className="size-4" />}
            onClick={() => onSubmit({ ...form, title: form.title.trim() })}
          >
            {mode === "create" ? "Criar conteúdo" : "Salvar alterações"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Título" required>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex.: Manual da plataforma em Libras"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ContentType })}>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {typeMeta[t].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Situação">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}>
              <option value="rascunho">Rascunho</option>
              <option value="publicado">Publicado</option>
            </Select>
          </Field>
        </div>
        <div className="rounded-lg border border-line bg-surface-2/40 p-3.5">
          <Toggle
            checked={form.accessible}
            onChange={(v) => setForm({ ...form, accessible: v })}
            label="Acessível"
            description="Conteúdo com recursos de acessibilidade (linguagem simples, Libras, leitura assistida)."
          />
        </div>
      </div>
    </Modal>
  );
}
