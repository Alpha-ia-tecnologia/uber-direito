import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AccessibilityToolbar } from "@/components/layout/AccessibilityToolbar";
import { Toasts } from "@/components/layout/Toasts";
import { AdminDataProvider } from "@/store/admin-store";

import { Landing } from "@/pages/public/Landing";
import { Login } from "@/pages/public/Login";
import { Cadastro } from "@/pages/public/Cadastro";

import { Dashboard } from "@/pages/Dashboard";
import { Diagnostico } from "@/pages/iniciante/Diagnostico";
import { Demandas } from "@/pages/iniciante/Demandas";
import { NovaDemanda } from "@/pages/iniciante/NovaDemanda";
import { DemandaDetalhe } from "@/pages/DemandaDetalhe";
import { Atendimentos } from "@/pages/Atendimentos";
import { AtendimentoDetalhe } from "@/pages/AtendimentoDetalhe";
import { VideoRoom } from "@/pages/VideoRoom";
import { Parcerias } from "@/pages/Parcerias";
import { ParceriaDetalhe } from "@/pages/ParceriaDetalhe";
import { Avaliacoes } from "@/pages/Avaliacoes";
import { Financeiro } from "@/pages/Financeiro";
import { Notificacoes } from "@/pages/Notificacoes";
import { Privacidade } from "@/pages/Privacidade";
import { Configuracoes } from "@/pages/Configuracoes";
import { PerfilAdvogado } from "@/pages/PerfilAdvogado";

import { Historico } from "@/pages/especialista/Historico";
import { Oportunidades } from "@/pages/especialista/Oportunidades";

/* Admin back-office is a distinct, heavy section → lazy-loaded into its own chunk. */
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const Validacoes = lazy(() => import("@/pages/admin/Validacoes").then((m) => ({ default: m.Validacoes })));
const RevisaoIA = lazy(() => import("@/pages/admin/RevisaoIA").then((m) => ({ default: m.RevisaoIA })));
const Conflitos = lazy(() => import("@/pages/admin/Conflitos").then((m) => ({ default: m.Conflitos })));
const Usuarios = lazy(() => import("@/pages/admin/Usuarios").then((m) => ({ default: m.Usuarios })));
const Conteudos = lazy(() => import("@/pages/admin/Conteudos").then((m) => ({ default: m.Conteudos })));
const Auditoria = lazy(() => import("@/pages/admin/Auditoria").then((m) => ({ default: m.Auditoria })));
const GestaoDemandas = lazy(() => import("@/pages/admin/GestaoDemandas").then((m) => ({ default: m.GestaoDemandas })));
const GestaoAtendimentos = lazy(() => import("@/pages/admin/GestaoAtendimentos").then((m) => ({ default: m.GestaoAtendimentos })));
const GestaoParcerias = lazy(() => import("@/pages/admin/GestaoParcerias").then((m) => ({ default: m.GestaoParcerias })));
const GestaoAvaliacoes = lazy(() => import("@/pages/admin/GestaoAvaliacoes").then((m) => ({ default: m.GestaoAvaliacoes })));
const Comunicados = lazy(() => import("@/pages/admin/Comunicados").then((m) => ({ default: m.Comunicados })));
const Relatorios = lazy(() => import("@/pages/admin/Relatorios").then((m) => ({ default: m.Relatorios })));
const MetasIndicadores = lazy(() => import("@/pages/admin/MetasIndicadores").then((m) => ({ default: m.MetasIndicadores })));
const PapeisPermissoes = lazy(() => import("@/pages/admin/PapeisPermissoes").then((m) => ({ default: m.PapeisPermissoes })));
const ConfiguracoesPlataforma = lazy(() => import("@/pages/admin/ConfiguracoesPlataforma").then((m) => ({ default: m.ConfiguracoesPlataforma })));
const FinanceiroAdmin = lazy(() => import("@/pages/admin/FinanceiroAdmin").then((m) => ({ default: m.FinanceiroAdmin })));

function AdminFallback() {
  return (
    <div className="flex items-center justify-center py-24 text-muted" role="status" aria-live="polite">
      <Loader2 className="size-6 animate-spin" />
      <span className="ml-3 text-[0.9rem]">Carregando painel de gestão…</span>
    </div>
  );
}

/** Scopes the editable admin store + lazy boundary to the back-office routes. */
function AdminBoundary() {
  return (
    <AdminDataProvider>
      <Suspense fallback={<AdminFallback />}>
        <Outlet />
      </Suspense>
    </AdminDataProvider>
  );
}

export function App() {
  return (
    <>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Landing />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Aplicação */}
        <Route element={<AppLayout />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/diagnostico" element={<Diagnostico />} />
          <Route path="/app/demandas" element={<Demandas />} />
          <Route path="/app/demandas/nova" element={<NovaDemanda />} />
          <Route path="/app/demandas/:id" element={<DemandaDetalhe />} />
          <Route path="/app/atendimentos" element={<Atendimentos />} />
          <Route path="/app/atendimento/:id" element={<AtendimentoDetalhe />} />
          <Route path="/app/video/:id" element={<VideoRoom />} />
          <Route path="/app/parcerias" element={<Parcerias />} />
          <Route path="/app/parcerias/:id" element={<ParceriaDetalhe />} />
          <Route path="/app/avaliacoes" element={<Avaliacoes />} />
          <Route path="/app/financeiro" element={<Financeiro />} />
          <Route path="/app/historico" element={<Historico />} />
          <Route path="/app/oportunidades" element={<Oportunidades />} />
          <Route path="/app/perfil" element={<PerfilAdvogado />} />
          <Route path="/app/perfil/:id" element={<PerfilAdvogado />} />
          <Route path="/app/privacidade" element={<Privacidade />} />
          <Route path="/app/notificacoes" element={<Notificacoes />} />
          <Route path="/app/configuracoes" element={<Configuracoes />} />

          {/* Admin / back-office (editable store, lazy chunk) */}
          <Route element={<AdminBoundary />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/financeiro" element={<FinanceiroAdmin />} />
            <Route path="/admin/usuarios" element={<Usuarios />} />
            <Route path="/admin/demandas" element={<GestaoDemandas />} />
            <Route path="/admin/atendimentos" element={<GestaoAtendimentos />} />
            <Route path="/admin/parcerias" element={<GestaoParcerias />} />
            <Route path="/admin/avaliacoes" element={<GestaoAvaliacoes />} />
            <Route path="/admin/validacoes" element={<Validacoes />} />
            <Route path="/admin/revisao-ia" element={<RevisaoIA />} />
            <Route path="/admin/conflitos" element={<Conflitos />} />
            <Route path="/admin/auditoria" element={<Auditoria />} />
            <Route path="/admin/conteudos" element={<Conteudos />} />
            <Route path="/admin/comunicados" element={<Comunicados />} />
            <Route path="/admin/relatorios" element={<Relatorios />} />
            <Route path="/admin/metas" element={<MetasIndicadores />} />
            <Route path="/admin/permissoes" element={<PapeisPermissoes />} />
            <Route path="/admin/configuracoes" element={<ConfiguracoesPlataforma />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AccessibilityToolbar />
      <Toasts />
    </>
  );
}
