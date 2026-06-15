/* ==========================================================================
   Admin / back-office domain — goals, broadcasts, settings, permissions,
   system health, activity feed. All mocked.
   ========================================================================== */

import type { Role } from "./types";

export interface Goal {
  id: string;
  label: string;
  metric: string;
  current: number;
  target: number;
  unit: "%" | "nº" | "media";
  higherIsBetter: boolean;
  deadline: string;
}

export type BroadcastAudience = "todos" | "iniciantes" | "especialistas" | "parceiros";
export type BroadcastChannel = "in-app" | "email" | "ambos";
export type BroadcastStatus = "enviado" | "agendado" | "rascunho";

export interface Broadcast {
  id: string;
  title: string;
  body: string;
  audience: BroadcastAudience;
  channel: BroadcastChannel;
  status: BroadcastStatus;
  recipients: number;
  createdAt: string;
  scheduledFor?: string;
  simpleLanguage: boolean;
}

export type SettingType = "toggle" | "select" | "text" | "info";

export interface PlatformSetting {
  id: string;
  label: string;
  description: string;
  type: SettingType;
  value: boolean | string;
  options?: string[];
}

export interface SettingGroup {
  id: string;
  title: string;
  icon: string; // lucide icon name, mapped in the page
  settings: PlatformSetting[];
}

export interface Capability {
  id: string;
  label: string;
  description: string;
}

export type AdminRole = "iniciante" | "especialista" | "parceiro" | "comite" | "executora";

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  at: string;
  kind: "cadastro" | "atendimento" | "parceria" | "validacao" | "ia" | "conflito" | "sistema";
}

export interface SystemMetric {
  id: string;
  label: string;
  value: string;
  status: "ok" | "atencao" | "critico";
  detail: string;
}

/* ---- Seeds ---------------------------------------------------------------- */

export const goalsSeed: Goal[] = [
  { id: "g-conclusao", label: "Taxa de conclusão dos atendimentos", metric: "completionRate", current: 84, target: 80, unit: "%", higherIsBetter: true, deadline: "2027-07-31" },
  { id: "g-avaliacao", label: "Média de avaliação", metric: "avgRating", current: 4.6, target: 4.0, unit: "media", higherIsBetter: true, deadline: "2027-07-31" },
  { id: "g-parcerias", label: "Termos de parceria formalizados", metric: "partnerships", current: 112, target: 300, unit: "nº", higherIsBetter: true, deadline: "2027-07-31" },
  { id: "g-advogados", label: "Advogados cadastrados (ano 1)", metric: "totalLawyers", current: 1041, target: 5000, unit: "nº", higherIsBetter: true, deadline: "2027-07-31" },
  { id: "g-diagnosticos", label: "Diagnósticos com IA realizados", metric: "diagnoses", current: 498, target: 1000, unit: "nº", higherIsBetter: true, deadline: "2027-07-31" },
  { id: "g-disponibilidade", label: "Funcionalidades básicas testadas", metric: "uptime", current: 100, target: 100, unit: "%", higherIsBetter: true, deadline: "2026-09-30" },
];

export const broadcastsSeed: Broadcast[] = [
  { id: "bc-1", title: "Bem-vindo(a) à plataforma!", body: "Olá! Sua conta está ativa. Comece pelo diagnóstico com IA para organizar seu primeiro caso.", audience: "iniciantes", channel: "ambos", status: "enviado", recipients: 612, createdAt: "2026-06-01T09:00:00", simpleLanguage: true },
  { id: "bc-2", title: "Manutenção da videoconferência (28/06)", body: "Na madrugada de 28/06 a sala de vídeo ficará indisponível das 2h às 4h para manutenção.", audience: "todos", channel: "in-app", status: "agendado", recipients: 1041, createdAt: "2026-06-12T09:00:00", scheduledFor: "2026-06-27T18:00:00", simpleLanguage: false },
  { id: "bc-3", title: "Boletim mensal — junho", body: "Veja os destaques do mês: novos especialistas, parcerias formalizadas e dicas de atendimento humanizado.", audience: "todos", channel: "email", status: "rascunho", recipients: 1041, createdAt: "2026-06-13T08:00:00", simpleLanguage: true },
];

export const settingsSeed: SettingGroup[] = [
  {
    id: "seguranca",
    title: "Segurança",
    icon: "ShieldCheck",
    settings: [
      { id: "s-2fa", label: "Exigir verificação em duas etapas", description: "Para administradores e equipe executora.", type: "toggle", value: true },
      { id: "s-lockout", label: "Bloqueio após tentativas inválidas", description: "Bloqueia o login após 5 tentativas sucessivas.", type: "toggle", value: true },
      { id: "s-cripto", label: "Criptografia em trânsito e em repouso", description: "Dados sensíveis criptografados (RNF-01).", type: "info", value: "Ativada" },
      { id: "s-audit", label: "Auditoria periódica de segurança", description: "Frequência das auditorias.", type: "select", value: "Trimestral", options: ["Mensal", "Trimestral", "Semestral"] },
    ],
  },
  {
    id: "lgpd",
    title: "Privacidade e dados (LGPD)",
    icon: "Lock",
    settings: [
      { id: "s-retencao", label: "Prazo de guarda dos dados", description: "Período antes do descarte controlado.", type: "select", value: "5 anos", options: ["2 anos", "5 anos", "10 anos"] },
      { id: "s-anon", label: "Anonimização para relatórios", description: "Relatórios de pesquisa usam dados anonimizados.", type: "toggle", value: true },
      { id: "s-minim", label: "Minimização de dados", description: "Coleta apenas o estritamente necessário.", type: "toggle", value: true },
      { id: "s-segredo", label: "Proteção ao segredo de justiça", description: "Processos sob sigilo nunca são expostos.", type: "info", value: "Sempre ativo" },
    ],
  },
  {
    id: "video",
    title: "Videoconferência",
    icon: "Video",
    settings: [
      { id: "s-host", label: "Servidor auto-hospedado", description: "Infraestrutura própria (modelo Jitsi Meet).", type: "info", value: "jitsi.instituicao.edu.br" },
      { id: "s-rec", label: "Gravação de devolutivas", description: "Permitir gravação mediante consentimento (TCLE).", type: "toggle", value: true },
      { id: "s-captions", label: "Legendas automáticas", description: "Ativadas por padrão nas sessões.", type: "toggle", value: true },
    ],
  },
  {
    id: "integracoes",
    title: "Integrações",
    icon: "Plug",
    settings: [
      { id: "s-datajud", label: "API DataJud (CNJ)", description: "Validação de histórico de atuação.", type: "info", value: "Conectada · cota 78%" },
      { id: "s-oab", label: "Validação da OAB", description: "Modo de validação de inscrição.", type: "select", value: "Manual (Comitê)", options: ["Automática (base OAB)", "Manual (Comitê)", "Híbrida"] },
    ],
  },
  {
    id: "matching",
    title: "Matching e atendimento",
    icon: "Search",
    settings: [
      { id: "s-pcd", label: "Priorizar advogados com deficiência", description: "Atendimento prioritário quando solicitado.", type: "toggle", value: true },
      { id: "s-conflito", label: "Bloquear conflito de interesse", description: "Impede pareamento com conflito declarado.", type: "toggle", value: true },
      { id: "s-peso", label: "Peso da avaliação no matching", description: "Influência da nota média na ordenação.", type: "select", value: "Médio", options: ["Baixo", "Médio", "Alto"] },
    ],
  },
];

export const capabilities: Capability[] = [
  { id: "c-demanda", label: "Publicar demandas", description: "Criar e gerir demandas próprias" },
  { id: "c-atender", label: "Atender demandas", description: "Aceitar e conduzir atendimentos" },
  { id: "c-parceria", label: "Formalizar parcerias", description: "Assinar termos 50/50" },
  { id: "c-validar", label: "Validar cadastros e histórico", description: "Aprovar inscrições OAB e DataJud" },
  { id: "c-ia", label: "Revisar sinalizações de IA", description: "Aprovar/rejeitar divergências" },
  { id: "c-conflito", label: "Mediar conflitos", description: "Tratar denúncias éticas" },
  { id: "c-usuarios", label: "Gerir usuários e papéis", description: "Editar contas e permissões" },
  { id: "c-relatorios", label: "Exportar relatórios", description: "Prestação de contas e pesquisa" },
  { id: "c-conteudo", label: "Gerir conteúdos", description: "Manual, materiais e avisos" },
  { id: "c-config", label: "Configurar a plataforma", description: "Ajustes de governança e segurança" },
];

export const adminRoles: { id: AdminRole; label: string }[] = [
  { id: "iniciante", label: "Iniciante" },
  { id: "especialista", label: "Especialista" },
  { id: "parceiro", label: "Parceiro" },
  { id: "comite", label: "Comitê Gestor" },
  { id: "executora", label: "Equipe executora" },
];

// permission matrix: capabilityId -> roleId -> boolean
export const permissionMatrixSeed: Record<string, Record<AdminRole, boolean>> = {
  "c-demanda": { iniciante: true, especialista: false, parceiro: true, comite: false, executora: false },
  "c-atender": { iniciante: false, especialista: true, parceiro: true, comite: false, executora: false },
  "c-parceria": { iniciante: true, especialista: false, parceiro: true, comite: false, executora: false },
  "c-validar": { iniciante: false, especialista: false, parceiro: false, comite: true, executora: true },
  "c-ia": { iniciante: false, especialista: false, parceiro: false, comite: true, executora: false },
  "c-conflito": { iniciante: false, especialista: false, parceiro: false, comite: true, executora: false },
  "c-usuarios": { iniciante: false, especialista: false, parceiro: false, comite: true, executora: false },
  "c-relatorios": { iniciante: false, especialista: false, parceiro: false, comite: true, executora: true },
  "c-conteudo": { iniciante: false, especialista: false, parceiro: false, comite: true, executora: true },
  "c-config": { iniciante: false, especialista: false, parceiro: false, comite: true, executora: false },
};

export const activityFeed: ActivityItem[] = [
  { id: "act-1", actor: "Marina Alves Tavares", action: "publicou a demanda DEM-2026-014", at: "2026-06-13T09:12:00", kind: "cadastro" },
  { id: "act-2", actor: "Rogério Beltrão Nunes", action: "aceitou um atendimento de Direito do Trabalho", at: "2026-06-13T08:40:00", kind: "atendimento" },
  { id: "act-3", actor: "Sistema (Agente IA)", action: "sinalizou 1 divergência de histórico para revisão", at: "2026-06-12T19:25:00", kind: "ia" },
  { id: "act-4", actor: "Juliana Castro Belém", action: "formalizou a parceria PAR-2026-031", at: "2026-06-12T16:10:00", kind: "parceria" },
  { id: "act-5", actor: "Helena Prado (Comitê)", action: "validou a inscrição de Carla Menezes", at: "2026-06-12T14:02:00", kind: "validacao" },
  { id: "act-6", actor: "Pedro Henrique Lousada", action: "registrou uma denúncia de conduta", at: "2026-06-11T16:30:00", kind: "conflito" },
  { id: "act-7", actor: "Sistema", action: "concluiu backup diário e verificação de integridade", at: "2026-06-13T03:00:00", kind: "sistema" },
];

export const systemHealth: SystemMetric[] = [
  { id: "sm-uptime", label: "Disponibilidade (30d)", value: "99,8%", status: "ok", detail: "Operação estável" },
  { id: "sm-video", label: "Servidor de vídeo", value: "Operacional", status: "ok", detail: "Jitsi auto-hospedado" },
  { id: "sm-datajud", label: "API DataJud (CNJ)", value: "Cota 78%", status: "atencao", detail: "Aproximando do limite mensal" },
  { id: "sm-fila", label: "Fila de validação", value: "2 pendentes", status: "atencao", detail: "Aguardando o Comitê" },
];

export function lawyerRoleToAdminRole(roles: Role[]): AdminRole {
  if (roles.includes("admin")) return "comite";
  if (roles.includes("parceiro")) return "parceiro";
  if (roles.includes("especialista")) return "especialista";
  return "iniciante";
}
