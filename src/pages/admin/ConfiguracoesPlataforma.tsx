import {
  ShieldCheck,
  Lock,
  Video,
  Plug,
  Search,
  Settings,
  Info,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { useAdmin } from "@/store/admin-store";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Field, Input, Select, Toggle } from "@/components/ui/Field";
import type { PlatformSetting, SettingGroup } from "@/data/admin";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Lock,
  Video,
  Plug,
  Search,
};

export function ConfiguracoesPlataforma() {
  const { toast } = useApp();
  const { settings, updateSetting } = useAdmin();

  const toggleCount = settings.reduce(
    (acc, g) => acc + g.settings.filter((s) => s.type === "toggle" && s.value === true).length,
    0,
  );

  function handleUpdate(group: SettingGroup, setting: PlatformSetting, value: boolean | string) {
    updateSetting(group.id, setting.id, value);
    toast(`${setting.label} atualizado em ${group.title}.`);
  }

  return (
    <>
      <PageHeader
        title="Configurações da plataforma"
        description="Governança, segurança e requisitos não funcionais (LGPD, criptografia, matching e integrações)."
        breadcrumbs={[{ label: "Gestão", to: "/admin" }, { label: "Configurações" }]}
        meta={
          <Badge tone="navy" icon={<SlidersHorizontal className="size-3" />}>
            {toggleCount} controle(s) ativo(s)
          </Badge>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {settings.map((group) => {
          const GroupIcon = iconMap[group.icon] ?? Settings;
          return (
            <Card key={group.id} as="section">
              <CardHeader title={group.title} icon={<GroupIcon className="size-4.5" />} />
              <CardBody className="space-y-4">
                {group.settings.map((setting) => (
                  <SettingRow
                    key={setting.id}
                    setting={setting}
                    onUpdate={(value) => handleUpdate(group, setting, value)}
                  />
                ))}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function SettingRow({
  setting,
  onUpdate,
}: {
  setting: PlatformSetting;
  onUpdate: (value: boolean | string) => void;
}) {
  if (setting.type === "toggle") {
    return (
      <div className="rounded-lg border border-line bg-surface-2/40 px-3.5 py-3">
        <Toggle
          checked={setting.value as boolean}
          onChange={(v) => onUpdate(v)}
          label={setting.label}
          description={setting.description}
        />
      </div>
    );
  }

  if (setting.type === "select") {
    return (
      <div className="rounded-lg border border-line bg-surface-2/40 px-3.5 py-3">
        <Field label={setting.label} hint={setting.description}>
          <Select
            value={setting.value as string}
            onChange={(e) => onUpdate(e.target.value)}
            className="h-10 text-[0.86rem]"
          >
            {(setting.options ?? []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    );
  }

  if (setting.type === "text") {
    return (
      <div className="rounded-lg border border-line bg-surface-2/40 px-3.5 py-3">
        <Field label={setting.label} hint={setting.description}>
          <Input
            value={setting.value as string}
            onChange={(e) => onUpdate(e.target.value)}
            className="h-10 text-[0.86rem]"
          />
        </Field>
      </div>
    );
  }

  // info — read-only row, no control
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-line bg-surface-2/40 px-3.5 py-3">
      <div className="min-w-0">
        <p className="text-[0.88rem] font-medium text-ink">{setting.label}</p>
        <p className="mt-0.5 text-[0.8rem] text-muted">{setting.description}</p>
      </div>
      <Badge tone="neutral" icon={<Info className="size-3" />} className="mt-0.5 shrink-0">
        {setting.value as string}
      </Badge>
    </div>
  );
}
