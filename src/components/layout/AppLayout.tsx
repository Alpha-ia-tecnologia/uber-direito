import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { Menu, X, Search, ChevronDown, LogOut, UserCog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp, type PersonaId } from "@/store/app-context";
import { navForRole } from "./nav-config";
import { NotificationCenter } from "./NotificationCenter";
import { Logo, LogoMark } from "@/components/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const roleLabel: Record<string, string> = {
  iniciante: "Advogado Iniciante",
  especialista: "Advogado Especialista",
  parceiro: "Advogado Parceiro",
  admin: "Comitê Gestor",
};

function NavSections({ onNavigate }: { onNavigate?: () => void }) {
  const { activeRole } = useApp();
  const groups = navForRole(activeRole);
  return (
    <nav className="flex flex-col gap-6 px-3 py-4" aria-label="Navegação principal">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-wider text-navy-300">{group.title}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.875rem] font-medium transition-colors duration-150",
                      "before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-bordo-500 before:transition-opacity",
                      isActive
                        ? "bg-white/10 text-white before:opacity-100"
                        : "text-navy-100 hover:bg-white/[0.07] hover:text-white before:opacity-0",
                    )
                  }
                >
                  <item.icon className="size-[1.15rem] shrink-0 opacity-90" strokeWidth={1.75} />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function PersonaSwitcher() {
  const { user, activeRole, personas, setPersona } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-white/10 transition-colors"
        aria-label="Trocar de perfil (demonstração)"
        aria-expanded={open}
      >
        <Avatar name={user.name} size="sm" ring />
        <span className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-[0.82rem] font-semibold text-white max-w-[10rem] truncate">{user.name.split(" ").slice(0, 2).join(" ")}</span>
          <span className="text-[0.68rem] text-navy-200">{roleLabel[activeRole]}</span>
        </span>
        <ChevronDown className="size-4 text-navy-200" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 top-12 w-72 rounded-xl border border-line bg-surface shadow-lg overflow-hidden"
              style={{ zIndex: "var(--z-dropdown)" }}
            >
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line bg-surface-2/60">
                <UserCog className="size-3.5 text-navy-500" />
                <span className="text-[0.74rem] font-semibold uppercase tracking-wide text-muted">Demonstração · trocar papel</span>
              </div>
              <ul className="py-1.5">
                {personas.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        setPersona(p.id as PersonaId);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-navy-50",
                        user.id === p.id && "bg-navy-50/70",
                      )}
                    >
                      <Avatar name={p.label} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.85rem] font-semibold text-navy-900 truncate">{p.label.split(" · ")[0]}</p>
                        <p className="text-[0.74rem] text-muted">{p.label.split(" · ")[1]}</p>
                      </div>
                      {user.id === p.id && <Badge tone="accent">atual</Badge>}
                    </button>
                  </li>
                ))}
              </ul>
              <Link to="/" className="flex items-center gap-2 border-t border-line px-4 py-3 text-[0.82rem] font-medium text-muted hover:bg-navy-50 hover:text-navy-700">
                <LogOut className="size-4" /> Sair da plataforma
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-bg">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[16.5rem] flex-col bg-navy-chrome border-r border-navy-950/50">
        <div className="h-[3px] shrink-0 bg-bordo-600" />
        <div className="flex items-center px-5 h-16 border-b border-white/8">
          <Link to="/app" aria-label="Início" className="rounded-md transition-opacity hover:opacity-90"><Logo onDark /></Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavSections />
        </div>
        <div className="px-5 py-4 border-t border-white/8">
          <p className="text-[0.7rem] text-navy-300 leading-relaxed">
            Projeto de extensão · Direitos Humanos e Justiça
            <br />Vigência 2026–2027 · MVP demonstrativo
          </p>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0" style={{ zIndex: "var(--z-modal)" }}>
            <motion.div className="absolute inset-0 bg-navy-950/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-0 w-[17rem] bg-navy-chrome flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/8">
                <Logo onDark />
                <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu" className="text-navy-200 hover:text-white">
                  <X className="size-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <NavSections onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-[16.5rem]">
        <header className="sticky top-0 bg-navy-chrome border-b border-navy-950/40" style={{ zIndex: "var(--z-sticky)" }}>
          <div className="h-[3px] bg-bordo-600" />
          <div className="flex items-center gap-3 h-16 px-4 sm:px-6">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden grid size-10 place-items-center rounded-lg text-navy-100 hover:bg-white/10 transition-colors" aria-label="Abrir menu">
              <Menu className="size-6" />
            </button>
            <Link to="/app" className="lg:hidden" aria-label="Início"><LogoMark onDark /></Link>

            <div className="group hidden md:flex items-center gap-2 max-w-md flex-1 rounded-lg bg-white/[0.08] px-3.5 h-10 text-navy-100 ring-1 ring-white/10 transition-all focus-within:bg-white/[0.14] focus-within:ring-white/25">
              <Search className="size-4 shrink-0 transition-colors group-focus-within:text-white" />
              <input
                placeholder="Buscar demandas, advogados, parcerias…"
                className="w-full bg-transparent text-[0.86rem] text-white placeholder:text-navy-200 focus:outline-none"
                aria-label="Buscar"
              />
              <kbd className="hidden lg:inline-flex items-center rounded border border-white/15 px-1.5 text-[0.66rem] font-medium text-navy-200">/</kbd>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <NotificationCenter />
              <div className="mx-1 h-8 w-px bg-white/12" />
              <PersonaSwitcher />
            </div>
          </div>
        </header>

        <main id="conteudo" className="px-4 sm:px-6 py-6 sm:py-8 mx-auto max-w-[1200px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
