import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  MessagesSquare,
  Handshake,
  Star,
  ShieldCheck,
  Bell,
  Lock,
  FileCheck2,
  Search,
  UserRound,
  BadgeCheck,
  Users,
  FileText,
  ScrollText,
  Settings,
  Megaphone,
  BarChart3,
  Target,
  KeyRound,
  SlidersHorizontal,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/data/types";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export function navForRole(role: Role): NavGroup[] {
  if (role === "admin") {
    return [
      {
        title: "Visão geral",
        items: [{ to: "/admin", label: "Painel de gestão", icon: LayoutDashboard, end: true }],
      },
      {
        title: "Gestão",
        items: [
          { to: "/admin/usuarios", label: "Usuários", icon: Users },
          { to: "/admin/demandas", label: "Demandas", icon: Briefcase },
          { to: "/admin/atendimentos", label: "Atendimentos", icon: MessagesSquare },
          { to: "/admin/parcerias", label: "Parcerias", icon: Handshake },
          { to: "/admin/avaliacoes", label: "Avaliações", icon: Star },
        ],
      },
      {
        title: "Governança",
        items: [
          { to: "/admin/validacoes", label: "Validações", icon: BadgeCheck },
          { to: "/admin/revisao-ia", label: "Revisão de IA", icon: Sparkles },
          { to: "/admin/conflitos", label: "Conflitos e ética", icon: ShieldCheck },
          { to: "/admin/auditoria", label: "Trilha de auditoria", icon: ScrollText },
        ],
      },
      {
        title: "Conteúdo & comunicação",
        items: [
          { to: "/admin/conteudos", label: "Conteúdos", icon: FileText },
          { to: "/admin/comunicados", label: "Comunicados", icon: Megaphone },
        ],
      },
      {
        title: "Plataforma",
        items: [
          { to: "/admin/financeiro", label: "Financeiro", icon: Wallet },
          { to: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
          { to: "/admin/metas", label: "Metas & indicadores", icon: Target },
          { to: "/admin/permissoes", label: "Papéis & permissões", icon: KeyRound },
          { to: "/admin/configuracoes", label: "Configurações", icon: SlidersHorizontal },
        ],
      },
    ];
  }

  if (role === "especialista" || role === "parceiro") {
    return [
      {
        title: "Atuação",
        items: [
          { to: "/app", label: "Início", icon: LayoutDashboard, end: true },
          { to: "/app/oportunidades", label: "Oportunidades", icon: Search },
          { to: "/app/atendimentos", label: "Atendimentos", icon: MessagesSquare },
          { to: "/app/parcerias", label: "Parcerias", icon: Handshake },
          { to: "/app/financeiro", label: "Financeiro", icon: Wallet },
        ],
      },
      {
        title: "Meu perfil",
        items: [
          { to: "/app/historico", label: "Histórico (DataJud)", icon: FileCheck2 },
          { to: "/app/perfil", label: "Perfil e selos", icon: UserRound },
          { to: "/app/avaliacoes", label: "Avaliações", icon: Star },
        ],
      },
      {
        title: "Conta",
        items: [
          { to: "/app/privacidade", label: "Privacidade (LGPD)", icon: Lock },
          { to: "/app/notificacoes", label: "Notificações", icon: Bell },
        ],
      },
    ];
  }

  // iniciante
  return [
    {
      title: "Minha jornada",
      items: [
        { to: "/app", label: "Início", icon: LayoutDashboard, end: true },
        { to: "/app/diagnostico", label: "Diagnóstico com IA", icon: Sparkles },
        { to: "/app/demandas", label: "Minhas demandas", icon: Briefcase },
        { to: "/app/atendimentos", label: "Atendimentos", icon: MessagesSquare },
        { to: "/app/parcerias", label: "Parcerias", icon: Handshake },
        { to: "/app/financeiro", label: "Financeiro", icon: Wallet },
        { to: "/app/avaliacoes", label: "Avaliações", icon: Star },
      ],
    },
    {
      title: "Conta",
      items: [
        { to: "/app/privacidade", label: "Privacidade (LGPD)", icon: Lock },
        { to: "/app/notificacoes", label: "Notificações", icon: Bell },
        { to: "/app/configuracoes", label: "Configurações", icon: Settings },
      ],
    },
  ];
}
