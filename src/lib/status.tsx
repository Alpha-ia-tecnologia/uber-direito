import {
  CircleCheck,
  Clock,
  TriangleAlert,
  CircleSlash,
  Search,
  Handshake,
  FileSignature,
  PlayCircle,
  CheckCircle2,
  CircleDashed,
  CircleHelp,
} from "lucide-react";
import type { Tone } from "@/components/ui/Badge";
import type {
  AccountStatus,
  DemandStatus,
  HistoryStatus,
  PartnershipStatus,
  Urgency,
  CandidateStatus,
} from "@/data/types";
import type { ReactNode } from "react";

export interface StatusMeta {
  label: string;
  tone: Tone;
  icon: ReactNode;
}

const ic = "size-3.5";

export const accountStatusMeta: Record<AccountStatus, StatusMeta> = {
  pendente: { label: "Pendente", tone: "warning", icon: <Clock className={ic} /> },
  validado: { label: "Validado", tone: "success", icon: <CircleCheck className={ic} /> },
  rejeitado: { label: "Rejeitado", tone: "danger", icon: <CircleSlash className={ic} /> },
};

export const historyStatusMeta: Record<HistoryStatus, StatusMeta> = {
  validada: { label: "Validada", tone: "success", icon: <CircleCheck className={ic} /> },
  divergente: { label: "Divergente", tone: "warning", icon: <TriangleAlert className={ic} /> },
  nao_localizada: { label: "Não localizada", tone: "neutral", icon: <Search className={ic} /> },
};

export const demandStatusMeta: Record<DemandStatus, StatusMeta> = {
  publicada: { label: "Publicada", tone: "info", icon: <CircleDashed className={ic} /> },
  em_matching: { label: "Em matching", tone: "navy", icon: <Search className={ic} /> },
  em_atendimento: { label: "Em atendimento", tone: "accent", icon: <PlayCircle className={ic} /> },
  concluida: { label: "Concluída", tone: "success", icon: <CheckCircle2 className={ic} /> },
  cancelada: { label: "Cancelada", tone: "neutral", icon: <CircleSlash className={ic} /> },
};

export const partnershipStatusMeta: Record<PartnershipStatus, StatusMeta> = {
  proposta: { label: "Proposta", tone: "warning", icon: <FileSignature className={ic} /> },
  formalizada: { label: "Formalizada", tone: "info", icon: <Handshake className={ic} /> },
  em_execucao: { label: "Em execução", tone: "accent", icon: <PlayCircle className={ic} /> },
  encerrada: { label: "Encerrada", tone: "success", icon: <CheckCircle2 className={ic} /> },
};

export const candidateStatusMeta: Record<CandidateStatus, StatusMeta> = {
  sugerido: { label: "Sugerido", tone: "neutral", icon: <CircleHelp className={ic} /> },
  notificado: { label: "Notificado", tone: "info", icon: <Clock className={ic} /> },
  aceito: { label: "Aceitou", tone: "success", icon: <CircleCheck className={ic} /> },
  recusado: { label: "Recusou", tone: "neutral", icon: <CircleSlash className={ic} /> },
};

export const urgencyMeta: Record<Urgency, StatusMeta> = {
  baixa: { label: "Urgência baixa", tone: "neutral", icon: <CircleDashed className={ic} /> },
  media: { label: "Urgência média", tone: "warning", icon: <Clock className={ic} /> },
  alta: { label: "Urgência alta", tone: "danger", icon: <TriangleAlert className={ic} /> },
};

export const supportTypeLabel: Record<"humanizado" | "parceria", string> = {
  humanizado: "Apoio humanizado",
  parceria: "Parceria 50/50",
};
