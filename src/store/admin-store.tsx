import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from "react";
import { lawyers as lawyersSeed } from "@/data/lawyers";
import {
  demands as demandsSeed,
  services as servicesSeed,
  partnerships as partnershipsSeed,
  ratings as ratingsSeed,
  institutionalContent as contentSeed,
  conflicts as conflictsSeed,
  validationQueue,
  aiReviewQueue,
  auditLog as auditSeed,
  indicators as indicatorsSeed,
} from "@/data/mock";
import {
  goalsSeed,
  broadcastsSeed,
  settingsSeed,
  permissionMatrixSeed,
  activityFeed,
  systemHealth,
  type Goal,
  type Broadcast,
  type SettingGroup,
  type AdminRole,
} from "@/data/admin";
import type {
  Lawyer,
  Demand,
  Partnership,
  Rating,
  InstitutionalContent,
  Conflict,
  AccountStatus,
  Role,
  DemandStatus,
  PartnershipStatus,
  AuditEntry,
} from "@/data/types";

interface AdminStore {
  lawyers: Lawyer[];
  demands: Demand[];
  services: typeof servicesSeed;
  partnerships: Partnership[];
  ratings: Rating[];
  content: InstitutionalContent[];
  conflicts: Conflict[];
  validationQueue: typeof validationQueue;
  aiReviewQueue: typeof aiReviewQueue;
  auditLog: AuditEntry[];
  broadcasts: Broadcast[];
  goals: Goal[];
  settings: SettingGroup[];
  permissions: Record<string, Record<AdminRole, boolean>>;
  hiddenRatings: string[];
  indicators: typeof indicatorsSeed;
  activityFeed: typeof activityFeed;
  systemHealth: typeof systemHealth;

  // lawyer management
  updateLawyer: (id: string, patch: Partial<Lawyer>) => void;
  setLawyerStatus: (id: string, status: AccountStatus) => void;
  toggleLawyerRole: (id: string, role: Role) => void;
  addLawyer: (data: Pick<Lawyer, "name" | "oab" | "seccional" | "email" | "phone" | "city" | "areas" | "roles">) => void;

  // demand management
  setDemandStatus: (id: string, status: DemandStatus) => void;

  // partnership management
  setPartnershipStatus: (id: string, status: PartnershipStatus) => void;

  // rating moderation
  toggleRatingHidden: (id: string) => void;

  // content
  addContent: (c: Omit<InstitutionalContent, "id" | "updatedAt">) => void;
  updateContent: (id: string, patch: Partial<InstitutionalContent>) => void;
  removeContent: (id: string) => void;

  // broadcasts
  sendBroadcast: (b: Omit<Broadcast, "id" | "createdAt">) => void;

  // goals
  updateGoal: (id: string, patch: Partial<Goal>) => void;

  // settings
  updateSetting: (groupId: string, settingId: string, value: boolean | string) => void;

  // permissions
  togglePermission: (capId: string, role: AdminRole) => void;

  // audit
  logAudit: (entry: Omit<AuditEntry, "id" | "at">) => void;

  stats: {
    totalLawyers: number;
    validated: number;
    pending: number;
    suspended: number;
    activeDemands: number;
    activeServices: number;
    partnerships: number;
    avgRating: number;
    completionRate: number;
  };
}

const AdminCtx = createContext<AdminStore | null>(null);

function nowIso() {
  return new Date().toISOString();
}
function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [lawyers, setLawyers] = useState<Lawyer[]>(() => lawyersSeed.map((l) => ({ ...l })));
  const [demands, setDemands] = useState<Demand[]>(() => demandsSeed.map((d) => ({ ...d })));
  const [partnerships, setPartnerships] = useState<Partnership[]>(() => partnershipsSeed.map((p) => ({ ...p })));
  const [ratings] = useState<Rating[]>(() => ratingsSeed.map((r) => ({ ...r })));
  const [content, setContent] = useState<InstitutionalContent[]>(() => contentSeed.map((c) => ({ ...c })));
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(() => broadcastsSeed.map((b) => ({ ...b })));
  const [goals, setGoals] = useState<Goal[]>(() => goalsSeed.map((g) => ({ ...g })));
  const [settings, setSettings] = useState<SettingGroup[]>(() => settingsSeed.map((g) => ({ ...g, settings: g.settings.map((s) => ({ ...s })) })));
  const [permissions, setPermissions] = useState<Record<string, Record<AdminRole, boolean>>>(() =>
    Object.fromEntries(Object.entries(permissionMatrixSeed).map(([k, v]) => [k, { ...v }])),
  );
  const [hiddenRatings, setHiddenRatings] = useState<string[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(() => auditSeed.map((a) => ({ ...a })));

  const logAudit = useCallback<AdminStore["logAudit"]>((entry) => {
    setAuditLog((log) => [{ ...entry, id: genId("a"), at: nowIso() }, ...log]);
  }, []);

  const updateLawyer = useCallback<AdminStore["updateLawyer"]>((id, patch) => {
    setLawyers((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const setLawyerStatus = useCallback<AdminStore["setLawyerStatus"]>(
    (id, status) => {
      setLawyers((ls) => ls.map((l) => (l.id === id ? { ...l, accountStatus: status } : l)));
      const l = lawyers.find((x) => x.id === id);
      logAudit({ actor: "Comitê Gestor", action: status === "validado" ? "Validou inscrição na OAB" : status === "rejeitado" ? "Rejeitou cadastro" : "Marcou cadastro como pendente", target: l?.name ?? id, category: "validação" });
    },
    [lawyers, logAudit],
  );

  const toggleLawyerRole = useCallback<AdminStore["toggleLawyerRole"]>(
    (id, role) => {
      setLawyers((ls) =>
        ls.map((l) => {
          if (l.id !== id) return l;
          const has = l.roles.includes(role);
          const roles = has ? l.roles.filter((r) => r !== role) : [...l.roles, role];
          return { ...l, roles: roles.length ? roles : l.roles };
        }),
      );
      const l = lawyers.find((x) => x.id === id);
      logAudit({ actor: "Comitê Gestor", action: `Alterou o papel ${role}`, target: l?.name ?? id, category: "papéis" });
    },
    [lawyers, logAudit],
  );

  const addLawyer = useCallback<AdminStore["addLawyer"]>(
    (data) => {
      const newLawyer: Lawyer = {
        id: genId("l"),
        accountStatus: "pendente",
        oabRegisteredAt: nowIso(),
        yearsRegistered: 0,
        initiateEligible: data.roles.includes("iniciante"),
        isPCD: false,
        specialties: [],
        availability: "disponivel",
        rating: 0,
        ratingCount: 0,
        completionRate: 0,
        seal: "nenhum",
        bio: "Cadastro criado pelo Comitê Gestor, aguardando validação da inscrição na OAB.",
        history: [],
        indicators: [],
        ...data,
      };
      setLawyers((ls) => [newLawyer, ...ls]);
      logAudit({ actor: "Comitê Gestor", action: "Criou um cadastro de usuário", target: data.name, category: "papéis" });
    },
    [logAudit],
  );

  const setDemandStatus = useCallback<AdminStore["setDemandStatus"]>((id, status) => {
    setDemands((ds) => ds.map((d) => (d.id === id ? { ...d, status } : d)));
  }, []);

  const setPartnershipStatus = useCallback<AdminStore["setPartnershipStatus"]>((id, status) => {
    setPartnerships((ps) => ps.map((p) => (p.id === id ? { ...p, status } : p)));
  }, []);

  const toggleRatingHidden = useCallback<AdminStore["toggleRatingHidden"]>(
    (id) => {
      setHiddenRatings((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]));
      logAudit({ actor: "Comitê Gestor", action: "Moderou uma avaliação", target: `Avaliação ${id}`, category: "mediação" });
    },
    [logAudit],
  );

  const addContent = useCallback<AdminStore["addContent"]>((c) => {
    setContent((cs) => [{ ...c, id: genId("ic"), updatedAt: nowIso() }, ...cs]);
  }, []);
  const updateContent = useCallback<AdminStore["updateContent"]>((id, patch) => {
    setContent((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: nowIso() } : c)));
  }, []);
  const removeContent = useCallback<AdminStore["removeContent"]>((id) => {
    setContent((cs) => cs.filter((c) => c.id !== id));
  }, []);

  const sendBroadcast = useCallback<AdminStore["sendBroadcast"]>((b) => {
    setBroadcasts((bs) => [{ ...b, id: genId("bc"), createdAt: nowIso() }, ...bs]);
  }, []);

  const updateGoal = useCallback<AdminStore["updateGoal"]>((id, patch) => {
    setGoals((gs) => gs.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);

  const updateSetting = useCallback<AdminStore["updateSetting"]>((groupId, settingId, value) => {
    setSettings((gs) => gs.map((g) => (g.id === groupId ? { ...g, settings: g.settings.map((s) => (s.id === settingId ? { ...s, value } : s)) } : g)));
  }, []);

  const togglePermission = useCallback<AdminStore["togglePermission"]>((capId, role) => {
    setPermissions((p) => ({ ...p, [capId]: { ...p[capId], [role]: !p[capId][role] } }));
  }, []);

  const stats = useMemo(() => {
    const validated = lawyers.filter((l) => l.accountStatus === "validado").length;
    const pending = lawyers.filter((l) => l.accountStatus === "pendente").length;
    const suspended = lawyers.filter((l) => l.accountStatus === "rejeitado").length;
    const activeDemands = demands.filter((d) => d.status === "publicada" || d.status === "em_matching" || d.status === "em_atendimento").length;
    const activeServices = servicesSeed.filter((s) => s.status !== "concluido").length;
    const rated = lawyers.filter((l) => l.ratingCount > 0);
    const avgRating = rated.length ? rated.reduce((a, l) => a + l.rating, 0) / rated.length : 0;
    return {
      totalLawyers: lawyers.length,
      validated,
      pending,
      suspended,
      activeDemands,
      activeServices,
      partnerships: partnerships.length,
      avgRating,
      completionRate: indicatorsSeed.completionRate,
    };
  }, [lawyers, demands, partnerships]);

  const value: AdminStore = {
    lawyers,
    demands,
    services: servicesSeed,
    partnerships,
    ratings,
    content,
    conflicts: conflictsSeed as Conflict[],
    validationQueue,
    aiReviewQueue,
    auditLog,
    broadcasts,
    goals,
    settings,
    permissions,
    hiddenRatings,
    indicators: indicatorsSeed,
    activityFeed,
    systemHealth,
    updateLawyer,
    setLawyerStatus,
    toggleLawyerRole,
    addLawyer,
    setDemandStatus,
    setPartnershipStatus,
    toggleRatingHidden,
    addContent,
    updateContent,
    removeContent,
    sendBroadcast,
    updateGoal,
    updateSetting,
    togglePermission,
    logAudit,
    stats,
  };

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin(): AdminStore {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error("useAdmin must be used within AdminDataProvider");
  return ctx;
}
