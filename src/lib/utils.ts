import { clsx, type ClassValue } from "clsx";

/** Class-name combiner. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** BRL currency formatter. */
export function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Short date — 13 jun 2026 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Date + time — 13 jun 2026, 14:30 */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Relative time in plain Portuguese — "há 3 dias", "agora". */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  if (d < 30) return `há ${d} ${d === 1 ? "dia" : "dias"}`;
  const mo = Math.round(d / 30);
  return `há ${mo} ${mo === 1 ? "mês" : "meses"}`;
}

/** Initials for avatar fallbacks. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Deterministic pick from a palette of avatar tints (stable per name). */
export function avatarTint(name: string): { bg: string; fg: string } {
  const tints = [
    { bg: "oklch(0.93 0.04 256)", fg: "oklch(0.32 0.07 262)" },
    { bg: "oklch(0.93 0.04 22)", fg: "oklch(0.40 0.14 25)" },
    { bg: "oklch(0.93 0.04 158)", fg: "oklch(0.38 0.09 158)" },
    { bg: "oklch(0.94 0.04 74)", fg: "oklch(0.48 0.10 64)" },
    { bg: "oklch(0.93 0.03 290)", fg: "oklch(0.40 0.10 290)" },
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return tints[h % tints.length];
}

export function pluralize(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
