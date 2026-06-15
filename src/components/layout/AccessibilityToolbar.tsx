import { useState } from "react";
import { Accessibility, Contrast, Type, Hand, X, MousePointer2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/store/app-context";
import { Toggle } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

/** Floating accessibility panel — RF-48 a RF-52, eMAG / WCAG 2.1 AA. */
export function AccessibilityToolbar() {
  const { a11y, setA11y } = useApp();
  const [open, setOpen] = useState(false);

  const fontSteps = [
    { v: 1, label: "A" },
    { v: 1.1, label: "A+" },
    { v: 1.25, label: "A++" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Recursos de acessibilidade"
        className={cn(
          "fixed bottom-5 right-5 grid size-13 place-items-center rounded-full bg-navy-800 text-white shadow-lg",
          "hover:bg-navy-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordo-400",
          "size-14",
        )}
        style={{ zIndex: "var(--z-overlay)" }}
      >
        <Accessibility className="size-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-5 w-[20rem] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-line bg-surface shadow-lg overflow-hidden"
            style={{ zIndex: "var(--z-overlay)" }}
            role="dialog"
            aria-label="Acessibilidade"
          >
            <div className="flex items-center justify-between bg-navy-chrome px-5 py-3.5 text-white">
              <span className="inline-flex items-center gap-2 font-serif text-[1rem]">
                <Accessibility className="size-4.5" /> Acessibilidade
              </span>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="text-navy-200 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-5 px-5 py-5">
              <div>
                <span className="mb-2 flex items-center gap-2 text-[0.82rem] font-semibold text-ink-soft">
                  <Type className="size-4 text-navy-500" /> Tamanho do texto
                </span>
                <div className="flex gap-2">
                  {fontSteps.map((s) => (
                    <button
                      key={s.v}
                      onClick={() => setA11y({ fontScale: s.v })}
                      className={cn(
                        "flex-1 rounded-lg border py-2 font-semibold transition-colors",
                        a11y.fontScale === s.v
                          ? "border-navy-700 bg-navy-700 text-white"
                          : "border-line-strong text-ink-soft hover:border-navy-400",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 flex items-center gap-2 text-[0.82rem] font-semibold text-ink-soft">
                  <Contrast className="size-4 text-navy-500" /> Contraste
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setA11y({ contrast: "standard" })}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-[0.84rem] font-semibold transition-colors",
                      a11y.contrast === "standard" ? "border-navy-700 bg-navy-700 text-white" : "border-line-strong text-ink-soft hover:border-navy-400",
                    )}
                  >
                    Padrão
                  </button>
                  <button
                    onClick={() => setA11y({ contrast: "high" })}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-[0.84rem] font-semibold transition-colors",
                      a11y.contrast === "high" ? "border-navy-900 bg-navy-950 text-white" : "border-line-strong text-ink-soft hover:border-navy-400",
                    )}
                  >
                    Alto contraste
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3.5 border-t border-line pt-4">
                <Toggle
                  checked={a11y.reduceMotion}
                  onChange={(v) => setA11y({ reduceMotion: v })}
                  label="Reduzir animações"
                  description="Menos movimento na interface"
                />
                <Toggle
                  checked={a11y.simpleLanguage}
                  onChange={(v) => setA11y({ simpleLanguage: v })}
                  label="Linguagem simples"
                  description="Explicações mais diretas"
                />
                <Toggle
                  checked={a11y.libras}
                  onChange={(v) => setA11y({ libras: v })}
                  label="Janela de Libras (VLibras)"
                  description="Tradução em Língua de Sinais"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VLibras-style affordance (RF-50) */}
      <AnimatePresence>
        {a11y.libras && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            aria-label="Tradução em Libras (demonstração)"
            className="fixed bottom-5 right-24 grid size-14 place-items-center rounded-full bg-bordo-600 text-white shadow-lg hover:bg-bordo-700 transition-colors"
            style={{ zIndex: "var(--z-overlay)" }}
            title="VLibras — recurso demonstrativo no MVP"
          >
            <Hand className="size-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Simple-language banner (RF-49) */}
      <AnimatePresence>
        {a11y.simpleLanguage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed left-1/2 top-3 -translate-x-1/2 flex items-center gap-2 rounded-full border border-navy-200 bg-surface px-4 py-1.5 text-[0.78rem] text-ink-soft shadow-sm"
            style={{ zIndex: "var(--z-sticky)" }}
          >
            <BookOpen className="size-3.5 text-navy-600" />
            Modo linguagem simples ativado
            <MousePointer2 className="size-3 text-faint" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
