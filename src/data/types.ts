/* ==========================================================================
   Domain types — Uber dos Advogados (MVP, dados mockados)
   ========================================================================== */

export type Role = "iniciante" | "especialista" | "parceiro" | "admin";

export type AccountStatus = "pendente" | "validado" | "rejeitado";

export type HistoryStatus = "validada" | "divergente" | "nao_localizada";

export type LegalArea =
  | "Direito do Trabalho"
  | "Direito de Família"
  | "Direito do Consumidor"
  | "Direito Previdenciário"
  | "Direito Penal"
  | "Direito Civil"
  | "Direito Empresarial"
  | "Direito Tributário"
  | "Direitos Humanos"
  | "Direito Imobiliário";

export type Urgency = "baixa" | "media" | "alta";

export type SupportType = "humanizado" | "parceria";

export interface ActionRecord {
  id: string;
  processNumber: string; // padrão CNJ
  area: LegalArea;
  outcome: "exitoso" | "em_andamento" | "improcedente";
  status: HistoryStatus;
  source: "DataJud/CNJ" | "Upload" | "Tribunal Estadual";
  sealed?: boolean; // segredo de justiça
  year: number;
}

export interface ValidatedIndicator {
  area: LegalArea;
  successfulActions: number;
  totalProcesses: number;
}

export interface Lawyer {
  id: string;
  name: string;
  oab: string;
  seccional: string;
  email: string;
  phone: string;
  roles: Role[];
  accountStatus: AccountStatus;
  oabRegisteredAt: string; // ISO
  yearsRegistered: number;
  initiateEligible: boolean;
  isPCD: boolean; // advogado com deficiência
  areas: LegalArea[];
  specialties: string[];
  availability: "disponivel" | "limitada" | "indisponivel";
  rating: number; // média 1–5
  ratingCount: number;
  completionRate: number; // 0–1
  seal: "ouro" | "prata" | "bronze" | "nenhum";
  bio: string;
  city: string;
  history: ActionRecord[];
  indicators: ValidatedIndicator[];
}

export type DemandStatus =
  | "publicada"
  | "em_matching"
  | "em_atendimento"
  | "concluida"
  | "cancelada";

export interface DemandDoc {
  id: string;
  name: string;
  size: string;
  restricted: boolean;
}

export interface DiagnosisReport {
  id: string;
  area: LegalArea;
  oneLine: string;
  context: string;
  objective: string;
  desiredSupport: SupportType;
  urgency: Urgency;
  facts: string[];
  documentsSuggested: string[];
  risks: string[];
  generatedByAI: true;
  confirmedByUser: boolean;
  generatedAt: string;
}

export interface Demand {
  id: string;
  code: string; // DEM-2026-001
  authorId: string;
  title: string;
  area: LegalArea;
  description: string;
  urgency: Urgency;
  supportType: SupportType;
  status: DemandStatus;
  createdAt: string;
  documents: DemandDoc[];
  diagnosis?: DiagnosisReport;
  priorityPCD?: boolean;
}

export type CandidateStatus = "sugerido" | "notificado" | "aceito" | "recusado";

export interface MatchCandidate {
  lawyerId: string;
  score: number; // 0–100
  reasons: string[];
  status: CandidateStatus;
  conflict?: boolean;
}

export interface Match {
  demandId: string;
  candidates: MatchCandidate[];
}

export type ServiceStatus = "agendado" | "em_andamento" | "concluido";

export interface ChatMessage {
  id: string;
  fromId: string;
  body: string;
  at: string;
  system?: boolean;
}

export interface Milestone {
  id: string;
  label: string;
  at: string;
  done: boolean;
}

export type SessionMode = "online" | "presencial" | "hibrido";

export interface VideoSession {
  id: string;
  demandId: string;
  title: string;
  mode: SessionMode;
  scheduledAt: string;
  durationMin: number;
  status: "agendada" | "realizada" | "cancelada";
  recordingConsent: boolean;
  captions: boolean;
}

export interface Service {
  id: string;
  demandId: string;
  initiateId: string;
  specialistId: string;
  status: ServiceStatus;
  startedAt?: string;
  endedAt?: string;
  messages: ChatMessage[];
  milestones: Milestone[];
  sessions: VideoSession[];
}

export interface Rating {
  id: string;
  serviceId: string;
  fromId: string;
  toId: string;
  score: number; // 1–5
  criteria: { clareza: number; pontualidade: number; tecnica: number; empatia: number };
  comment: string;
  createdAt: string;
}

export type PartnershipStatus = "proposta" | "formalizada" | "em_execucao" | "encerrada";

export interface Partnership {
  id: string;
  code: string; // PAR-2026-001
  demandId: string;
  initiateId: string;
  partnerId: string;
  serviceValue: number;
  feePct: number; // taxa de intermediação
  status: PartnershipStatus;
  acceptedByInitiate?: string; // ISO timestamp
  acceptedByPartner?: string;
  createdAt: string;
}

export type NotificationType =
  | "cadastro"
  | "diagnostico"
  | "historico"
  | "matching"
  | "mensagem"
  | "atendimento"
  | "parceria"
  | "avaliacao";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ConsentRecord {
  id: string;
  type: "TCLE" | "Termos de Uso" | "Imagem/Voz" | "Gravação de devolutiva";
  version: string;
  acceptedAt: string;
}

/* ---- Admin / governance --------------------------------------------------- */

export interface ValidationQueueItem {
  lawyerId: string;
  submittedAt: string;
  oab: string;
  seccional: string;
  type: "cadastro" | "historico";
}

export interface AIReviewItem {
  id: string;
  lawyerId: string;
  processNumber: string;
  area: LegalArea;
  issue: string;
  aiConfidence: number; // 0–1
  status: "pendente" | "aprovado" | "rejeitado";
  sources: string[];
}

export type ConflictStatus = "aberto" | "em_mediacao" | "resolvido";

export interface Conflict {
  id: string;
  serviceId: string;
  reporterId: string;
  againstId: string;
  reason: string;
  status: ConflictStatus;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  category: "validação" | "exclusão" | "mediação" | "revisão-IA" | "papéis";
  at: string;
}

export interface InstitutionalContent {
  id: string;
  title: string;
  type: "manual" | "material" | "aviso";
  updatedAt: string;
  accessible: boolean;
  status: "publicado" | "rascunho";
}

/* ---- Indicators ----------------------------------------------------------- */

export interface ProjectIndicators {
  lawyersByRole: { iniciante: number; especialista: number; parceiro: number };
  totalLawyers: number;
  totalServices: number;
  completionRate: number; // meta > 0.8
  avgRating: number; // meta ≥ 4.0
  partnerships: number; // meta 300
  diagnoses: number;
  validationsPending: number;
  monthly: { month: string; atendimentos: number; cadastros: number; parcerias: number }[];
  areaDistribution: { area: string; value: number }[];
  satisfaction: { label: string; value: number }[];
}
