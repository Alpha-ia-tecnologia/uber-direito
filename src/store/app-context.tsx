import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { lawyers, lawyerById } from "@/data/lawyers";
import { notifications as seedNotifications } from "@/data/mock";
import type { Lawyer, Notification, Role } from "@/data/types";

export type PersonaId = "l-marina" | "l-rogerio" | "l-helena";

interface AccessibilityState {
  contrast: "standard" | "high";
  fontScale: number; // 1, 1.1, 1.25
  reduceMotion: boolean;
  libras: boolean;
  simpleLanguage: boolean;
}

interface AppState {
  user: Lawyer;
  activeRole: Role;
  setPersona: (id: PersonaId) => void;
  personas: { id: PersonaId; label: string; role: Role }[];

  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;

  a11y: AccessibilityState;
  setA11y: (patch: Partial<AccessibilityState>) => void;

  toast: (msg: string) => void;
  toasts: { id: number; msg: string }[];
  dismissToast: (id: number) => void;
}

const AppCtx = createContext<AppState | null>(null);

const PERSONAS: { id: PersonaId; label: string; role: Role }[] = [
  { id: "l-marina", label: "Marina · Iniciante", role: "iniciante" },
  { id: "l-rogerio", label: "Rogério · Especialista", role: "especialista" },
  { id: "l-helena", label: "Helena · Comitê Gestor", role: "admin" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [personaId, setPersonaId] = useState<PersonaId>("l-marina");
  const [notifs, setNotifs] = useState<Notification[]>(seedNotifications);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const [a11y, setA11yState] = useState<AccessibilityState>(() => {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("uda-a11y") : null;
    return saved
      ? JSON.parse(saved)
      : { contrast: "standard", fontScale: 1, reduceMotion: false, libras: false, simpleLanguage: false };
  });

  const user = lawyerById(personaId) ?? lawyers[0];
  const activeRole: Role = user.roles.includes("admin")
    ? "admin"
    : (user.roles[0] ?? "iniciante");

  // Apply accessibility prefs to the document
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.contrast = a11y.contrast;
    root.style.setProperty("--a11y-scale", String(a11y.fontScale));
    if (a11y.reduceMotion) root.dataset.reduceMotion = "true";
    else delete root.dataset.reduceMotion;
    localStorage.setItem("uda-a11y", JSON.stringify(a11y));
  }, [a11y]);

  const userNotifs = useMemo(
    () => notifs.filter((n) => n.userId === personaId),
    [notifs, personaId],
  );

  const value: AppState = {
    user,
    activeRole,
    personas: PERSONAS,
    setPersona: setPersonaId,
    notifications: userNotifs,
    unreadCount: userNotifs.filter((n) => !n.read).length,
    markRead: (id) => setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n))),
    markAllRead: () =>
      setNotifs((ns) => ns.map((n) => (n.userId === personaId ? { ...n, read: true } : n))),
    a11y,
    setA11y: (patch) => setA11yState((s) => ({ ...s, ...patch })),
    toast: (msg) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((t) => [...t, { id, msg }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
    },
    toasts,
    dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
