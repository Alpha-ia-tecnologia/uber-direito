import { cn, initials, avatarTint } from "@/lib/utils";

const sizeMap = {
  xs: "size-7 text-[0.65rem]",
  sm: "size-9 text-[0.78rem]",
  md: "size-11 text-[0.9rem]",
  lg: "size-14 text-[1.05rem]",
  xl: "size-20 text-[1.4rem]",
};

export function Avatar({
  name,
  size = "md",
  className,
  ring,
}: {
  name: string;
  size?: keyof typeof sizeMap;
  className?: string;
  ring?: boolean;
}) {
  const tint = avatarTint(name);
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid place-items-center rounded-full font-semibold font-serif shrink-0",
        ring && "ring-2 ring-surface shadow-sm",
        sizeMap[size],
        className,
      )}
      style={{ backgroundColor: tint.bg, color: tint.fg }}
    >
      {initials(name)}
    </span>
  );
}
