import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const ref = useRef<HTMLDivElement>(null);

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

  const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 grid place-items-center p-4" style={{ zIndex: "var(--z-modal)" }} role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            className="absolute inset-0 bg-navy-950/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            className={cn("relative w-full bg-surface rounded-2xl shadow-lg border border-line overflow-hidden", widths[size])}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-line">
              <div>
                <h2 className="text-[1.15rem] text-navy-900">{title}</h2>
                {description && <p className="mt-1 text-[0.86rem] text-muted">{description}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="grid size-9 place-items-center rounded-lg text-muted hover:bg-navy-50 hover:text-navy-700 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="px-6 py-5 max-h-[68vh] overflow-y-auto">{children}</div>
            {footer && <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-line bg-surface-2/60">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
