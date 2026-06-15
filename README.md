# Uber dos Advogados — MVP (frontend, dados mockados)

Marketplace de mentoria jurídica que conecta **advogados iniciantes** a **especialistas/parceiros**, para atendimento humanizado e parcerias 50/50. MVP **somente frontend**, com **dados fictícios** — nenhuma API real é chamada.

> Nome de trabalho do projeto de extensão (*Direitos Humanos e Justiça*). A marca pública definitiva será definida pela coordenação (ver Anexo B dos requisitos).

## Stack

- **Vite + React 19 + TypeScript** (strict)
- **Tailwind CSS v4** (tokens OKLCH em `src/index.css`, sem `tailwind.config`)
- **React Router 7**, **framer-motion**, **recharts**, **lucide-react**

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build de produção
npm run preview  # serve o build
```

## Demonstração — troca de perfil

Não há autenticação real. Entre com qualquer e-mail/senha em **/entrar** e use o
**seletor de perfil** (canto superior direito) para alternar entre os três personas:

| Persona | Papel | Jornada |
|---|---|---|
| **Marina Alves Tavares** | Iniciante | diagnóstico com IA → demanda → matching → atendimento → parceria |
| **Rogério Beltrão Nunes** | Especialista | histórico DataJud → selos → oportunidades → atendimento |
| **Helena Prado Vasconcelos** | Comitê Gestor | indicadores → validações → revisão de IA → moderação → auditoria |

## Cobertura dos 13 módulos funcionais (68 RF)

1. **Cadastro/OAB/Autenticação** — `/cadastro` (validação OAB animada, papéis, TCLE), `/entrar`
2. **Histórico DataJud / IA** — `/app/historico` (importação, validação, indicadores, selo)
3. **Onboarding/Diagnóstico IA** — `/app/diagnostico` (agente conversacional → briefing editável)
4. **Demandas** — `/app/demandas`, `/app/demandas/nova` (anexos restritos, prioridade PCD)
5. **Matching** — aba *Matching* em `/app/demandas/:id` (ordenado, conflito bloqueado)
6. **Atendimento + Vídeo** — `/app/atendimento/:id` (chat, marcos, sessões) e `/app/video/:id` (sala estilo Jitsi, legendas, gravação consentida)
7. **Avaliação mútua** — `/app/avaliacoes` (1–5 por critério, denúncia/conflito)
8. **Parcerias 50/50** — `/app/parcerias`, `/app/parcerias/:id` (termo digital, aceite eletrônico, divisão)
9. **Acessibilidade** — barra flutuante global (contraste, fonte, Libras, linguagem simples) + `/app/configuracoes`
10. **Privacidade/LGPD** — `/app/privacidade` (direitos do titular, consentimentos, exclusão)
11. **Notificações** — sino na topbar + `/app/notificacoes`
12. **Relatórios/Indicadores** — `/admin` (KPIs vs. metas, gráficos) + `/admin/relatorios`
13. **Administração/Governança** — back-office completo (ver abaixo)

## Painel de gestão (back-office do Comitê)

Entre como **Helena · Comitê Gestor** para o painel administrativo completo. Os dados do admin vivem em um **store editável** (`src/store/admin-store.tsx`) — toda ação sensível é registrada na **trilha de auditoria** em tempo real.

- **Visão geral** — `/admin` (KPIs, metas do projeto, saúde do sistema, atividade recente, atalhos, gráficos)
- **Gestão** — `/admin/usuarios` (tabela + filtros + seleção em massa + gaveta de edição: papéis, situação, PCD, disponibilidade + criar usuário), `/admin/demandas`, `/admin/atendimentos`, `/admin/parcerias`, `/admin/avaliacoes` (moderação)
- **Governança** — `/admin/validacoes`, `/admin/revisao-ia`, `/admin/conflitos`, `/admin/auditoria`
- **Conteúdo & comunicação** — `/admin/conteudos` (CRUD), `/admin/comunicados` (boletins/broadcast)
- **Plataforma** — `/admin/financeiro` (volume, receita de intermediação, repasses, top earners, transações), `/admin/relatorios`, `/admin/metas` (editáveis), `/admin/permissoes` (matriz papéis × capacidades), `/admin/configuracoes` (segurança, LGPD, vídeo, integrações, matching)

## Financeiro

O dinheiro flui pelas **parcerias 50/50**: valor do serviço − taxa de intermediação (custeio) → líquido dividido entre os dois advogados. Ledger único em `src/data/finance.ts` alimenta dois dashboards:

- **Advogado** (`/app/financeiro`, "Meus ganhos") — recebido / a receber / pendente, próximo repasse, ganhos por mês e por área, extrato de trabalhos.
- **Plataforma** (`/admin/financeiro`) — volume transacionado, receita de intermediação, repasse aos advogados, por situação/área, ranking de quem mais recebeu e todas as transações.

Há também um teaser financeiro no início de cada advogado e uma faixa financeira no painel do Comitê.

Todo o módulo admin é **lazy-loaded** em chunks próprios (não pesa para advogados comuns). Primitivas reutilizáveis: `DataTable` (ordenar/filtrar/selecionar/paginar) e `Drawer` (gaveta de detalhe/edição).

## Design

Sistema **institucional sóbrio**: chrome em azul-marinho profundo, acento **bordô**, serifa editorial (Spectral) + sans acessível (Public Sans). Tokens OKLCH, contraste verificado em **WCAG 2.1 AA**, `prefers-reduced-motion` respeitado. Ver `PRODUCT.md` e `DESIGN.md`.

## Estrutura

```
src/
  components/ui/      primitivas (Button, Card, Badge, Modal, Rating…)
  components/layout/  app shell, barra de acessibilidade, notificações, toasts
  data/               types + dados mockados (lawyers, demands, matches…)
  pages/              público · iniciante · especialista · admin
  store/              contexto global (persona, acessibilidade, notificações)
  lib/                utils + mapeamento de status
```

Todos os dados em `src/data/` são fictícios e servem apenas à demonstração.
