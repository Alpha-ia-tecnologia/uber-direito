import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/** Right-side slide-over panel for record detail / edit. */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  width = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0" style={{ zIndex: "var(--z-modal)" }} role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : "Detalhe"}>
          <motion.div
            className="absolute inset-0 bg-navy-950/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className={cn("absolute inset-y-0 right-0 flex w-full flex-col bg-surface shadow-lg", widths[width])}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
              <div className="flex items-start gap-3 min-w-0">
                {icon && <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">{icon}</span>}
                <div className="min-w-0">
                  <h2 className="font-serif text-[1.2rem] text-navy-900 leading-tight">{title}</h2>
                  {subtitle && <p className="mt-0.5 text-[0.84rem] text-muted">{subtitle}</p>}
                </div>
              </div>
              <button onClick={onClose} aria-label="Fechar" className="grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-navy-50 hover:text-navy-700 transition-colors">
                <X className="size-5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="flex items-center justify-end gap-3 border-t border-line bg-surface-2/60 px-6 py-4">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
