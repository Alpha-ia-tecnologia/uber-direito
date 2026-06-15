import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  as?: "div" | "section" | "article";
}

export function Card({ elevated, className, as: Tag = "div", ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        "bg-surface border border-line rounded-xl",
        elevated ? "shadow-md" : "shadow-xs",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 pt-5 pb-4", className)}>
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-[1.02rem] leading-tight text-navy-900">{title}</h3>
          {subtitle && <p className="mt-1 text-[0.85rem] text-muted">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-3 px-5 py-4 border-t border-line bg-surface-2/60 rounded-b-xl", className)}
      {...rest}
    />
  );
}
