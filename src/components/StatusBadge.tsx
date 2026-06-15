import { Badge } from "@/components/ui/Badge";
import type { StatusMeta } from "@/lib/status";

export function StatusBadge({ meta }: { meta: StatusMeta }) {
  return (
    <Badge tone={meta.tone} icon={meta.icon}>
      {meta.label}
    </Badge>
  );
}
