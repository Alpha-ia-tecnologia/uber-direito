import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  content: ReactNode;
}

export function Tabs({ items, initial, className }: { items: TabItem[]; initial?: string; className?: string }) {
  const [active, setActive] = useState(initial ?? items[0]?.id);
  const current = items.find((i) => i.id === active) ?? items[0];

  return (
    <div className={className}>
      <div className="flex items-center gap-1 overflow-x-auto border-b border-line" role="tablist">
        {items.map((item) => {
          const on = item.id === active;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(item.id)}
              className={cn(
                "relative inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-[0.88rem] font-medium transition-colors",
                on ? "text-navy-900" : "text-muted hover:text-navy-700",
              )}
            >
              {item.icon}
              {item.label}
              {item.badge}
              {on && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-bordo-600" />}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="pt-5 animate-fade-in">
        {current?.content}
      </div>
    </div>
  );
}
