import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, FileText, MessageSquare, Sparkles, Search, Handshake, Star, UserCheck, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/store/app-context";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationType } from "@/data/types";

const iconFor: Record<NotificationType, React.ReactNode> = {
  cadastro: <UserCheck className="size-4" />,
  diagnostico: <Sparkles className="size-4" />,
  historico: <FileText className="size-4" />,
  matching: <Search className="size-4" />,
  mensagem: <MessageSquare className="size-4" />,
  atendimento: <PlayCircle className="size-4" />,
  parceria: <Handshake className="size-4" />,
  avaliacao: <Star className="size-4" />,
};

export function NotificationCenter() {
  const { notifications, unreadCount, markRead, markAllRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notificações${unreadCount ? `, ${unreadCount} não lidas` : ""}`}
        className="relative grid size-10 place-items-center rounded-lg text-navy-100 hover:bg-white/10 transition-colors"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-bordo-500 px-1 text-[0.6rem] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-12 w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl border border-line bg-surface shadow-lg overflow-hidden"
            style={{ zIndex: "var(--z-dropdown)" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <span className="font-serif text-[1rem] text-navy-900">Notificações</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="inline-flex items-center gap-1 text-[0.78rem] font-medium text-navy-600 hover:text-navy-800">
                  <Check className="size-3.5" /> Marcar todas
                </button>
              )}
            </div>
            <div className="max-h-[24rem] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-[0.86rem] text-muted">Nenhuma notificação.</p>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.link ?? "#"}
                    onClick={() => {
                      markRead(n.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex gap-3 px-4 py-3 border-b border-line/70 transition-colors hover:bg-navy-50/60",
                      !n.read && "bg-bordo-50/40",
                    )}
                  >
                    <span className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg", n.read ? "bg-surface-2 text-muted" : "bg-navy-100 text-navy-700")}>
                      {iconFor[n.type]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.86rem] font-semibold text-navy-900 leading-snug">{n.title}</p>
                      <p className="mt-0.5 text-[0.8rem] text-muted line-clamp-2">{n.body}</p>
                      <span className="mt-1 block text-[0.72rem] text-faint">{timeAgo(n.createdAt)}</span>
                    </div>
                    {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-bordo-500" />}
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
