import { CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/store/app-context";

export function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-[min(28rem,calc(100vw-2rem))]" style={{ zIndex: "var(--z-toast)" }} aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 rounded-xl border border-navy-700 bg-navy-900 px-4 py-3 text-white shadow-lg"
          >
            <CheckCircle2 className="size-5 shrink-0 text-[oklch(0.72_0.13_158)]" />
            <p className="flex-1 text-[0.88rem]">{t.msg}</p>
            <button onClick={() => dismissToast(t.id)} aria-label="Fechar" className="text-navy-300 hover:text-white">
              <X className="size-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
