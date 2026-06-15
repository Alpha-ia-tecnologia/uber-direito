import type {
  Demand,
  DiagnosisReport,
  Match,
  Service,
  Rating,
  Partnership,
  Notification,
  ConsentRecord,
  ValidationQueueItem,
  AIReviewItem,
  Conflict,
  AuditEntry,
  InstitutionalContent,
  ProjectIndicators,
} from "./types";

/* The headline diagnosis for Marina's case (RF-15..RF-21) */
export const marinaDiagnosis: DiagnosisReport = {
  id: "diag-001",
  area: "Direito do Trabalho",
  oneLine:
    "Possível rescisão indireta por atraso reiterado de salários e desvio de função, com pedido de verbas rescisórias.",
  context:
    "Cliente da advogada trabalha há 2 anos e 4 meses como auxiliar administrativo. Nos últimos 5 meses os salários foram pagos com atraso de 10 a 20 dias e houve acúmulo de funções sem alteração de cargo. A empregada deseja sair mantendo os direitos como se fosse demissão sem justa causa.",
  objective:
    "Orientar a propositura (ou negociação) de rescisão indireta, organizando provas e estimando verbas devidas.",
  desiredSupport: "humanizado",
  urgency: "alta",
  facts: [
    "Vínculo de 2 anos e 4 meses, carteira assinada como auxiliar administrativo.",
    "Atrasos salariais recorrentes nos últimos 5 meses (10–20 dias).",
    "Acúmulo de funções de recepção e financeiro sem aditivo contratual.",
    "Cliente ainda está empregada e tem receio de represálias.",
  ],
  documentsSuggested: [
    "Cópia da CTPS e contrato de trabalho",
    "Holerites dos últimos 6 meses",
    "Comprovantes/prints das datas de pagamento",
    "Mensagens que demonstrem o acúmulo de funções",
  ],
  risks: [
    "Necessidade de manter a prova do atraso reiterado para caracterizar falta grave do empregador.",
    "Avaliar continuidade do vínculo até decisão para não configurar abandono.",
  ],
  generatedByAI: true,
  confirmedByUser: true,
  generatedAt: "2026-06-09T15:20:00",
};

export const demands: Demand[] = [
  {
    id: "dem-001",
    code: "DEM-2026-014",
    authorId: "l-marina",
    title: "Rescisão indireta por atraso de salários",
    area: "Direito do Trabalho",
    description:
      "Cliente com atrasos salariais reiterados e desvio de função. Busca apoio para conduzir rescisão indireta com segurança.",
    urgency: "alta",
    supportType: "humanizado",
    status: "em_atendimento",
    createdAt: "2026-06-09T15:25:00",
    documents: [
      { id: "d1", name: "CTPS-cliente.pdf", size: "1,2 MB", restricted: true },
      { id: "d2", name: "Holerites-jan-mai.pdf", size: "840 KB", restricted: true },
    ],
    diagnosis: marinaDiagnosis,
  },
  {
    id: "dem-002",
    code: "DEM-2026-009",
    authorId: "l-marina",
    title: "Revisão de cláusula contratual de locação",
    area: "Direito Civil",
    description:
      "Dúvida sobre cláusula de reajuste e multa em contrato de locação residencial.",
    urgency: "media",
    supportType: "parceria",
    status: "concluida",
    createdAt: "2026-04-21T10:10:00",
    documents: [{ id: "d3", name: "contrato-locacao.pdf", size: "620 KB", restricted: true }],
  },
  {
    id: "dem-003",
    code: "DEM-2026-021",
    authorId: "l-pedro",
    title: "Cobrança indevida de tarifas bancárias",
    area: "Direito do Consumidor",
    description:
      "Cliente cobrado por tarifas não contratadas durante 18 meses. Avaliar repetição de indébito.",
    urgency: "media",
    supportType: "parceria",
    status: "em_matching",
    createdAt: "2026-06-11T09:00:00",
    documents: [],
  },
  {
    id: "dem-004",
    code: "DEM-2026-022",
    authorId: "l-amanda",
    title: "Pedido de guarda compartilhada",
    area: "Direito de Família",
    description: "Mãe busca regularizar guarda compartilhada e regime de convivência.",
    urgency: "alta",
    supportType: "humanizado",
    status: "publicada",
    createdAt: "2026-06-12T18:30:00",
    documents: [],
    priorityPCD: false,
  },
];

export const matches: Match[] = [
  {
    demandId: "dem-001",
    candidates: [
      {
        lawyerId: "l-rogerio",
        score: 96,
        reasons: [
          "Especialista em rescisão indireta (área exata da demanda)",
          "64 ações exitosas validadas em Direito do Trabalho",
          "Avaliação média 4,9 · selo ouro",
          "Disponível para atendimento humanizado",
        ],
        status: "aceito",
      },
      {
        lawyerId: "l-carla",
        score: 91,
        reasons: [
          "Especialista em Direito do Trabalho (assédio e verbas)",
          "41 ações exitosas validadas",
          "Avaliação média 4,7 · selo ouro",
          "Atendimento prioritário a PCD habilitado",
        ],
        status: "notificado",
      },
      {
        lawyerId: "l-tiago",
        score: 78,
        reasons: [
          "Atua em vínculo e contencioso trabalhista",
          "22 ações exitosas validadas",
          "Disponibilidade limitada neste mês",
        ],
        status: "sugerido",
      },
    ],
  },
  {
    demandId: "dem-003",
    candidates: [
      {
        lawyerId: "l-bruno",
        score: 88,
        reasons: [
          "Especialista em direito bancário e do consumidor",
          "15 ações exitosas validadas",
          "Aberto a parceria 50/50",
        ],
        status: "notificado",
      },
      {
        lawyerId: "l-carla",
        score: 72,
        reasons: ["Atua em Direito do Consumidor", "Selo ouro"],
        status: "sugerido",
        conflict: true,
      },
    ],
  },
];

export const services: Service[] = [
  {
    id: "svc-001",
    demandId: "dem-001",
    initiateId: "l-marina",
    specialistId: "l-rogerio",
    status: "em_andamento",
    startedAt: "2026-06-10T14:00:00",
    messages: [
      { id: "m0", fromId: "sys", body: "Atendimento iniciado. O relatório de diagnóstico foi compartilhado com Dr. Rogério.", at: "2026-06-10T14:00:00", system: true },
      { id: "m1", fromId: "l-rogerio", body: "Olá, Marina. Li o briefing — caso bem organizado. Antes de qualquer coisa: a cliente ainda está trabalhando?", at: "2026-06-10T14:03:00" },
      { id: "m2", fromId: "l-marina", body: "Olá, doutor! Sim, ainda está. Tem receio de represália se sair antes.", at: "2026-06-10T14:05:00" },
      { id: "m3", fromId: "l-rogerio", body: "Perfeito. Então o caminho é ajuizar a rescisão indireta com pedido de tutela, mantendo o vínculo. Vamos consolidar as provas dos atrasos. Você tem os holerites e os comprovantes de data de pagamento?", at: "2026-06-10T14:08:00" },
      { id: "m4", fromId: "l-marina", body: "Tenho os holerites. Os comprovantes de data estou reunindo com a cliente.", at: "2026-06-10T14:10:00" },
      { id: "m5", fromId: "l-rogerio", body: "Ótimo. Marquei uma devolutiva por vídeo para revisarmos a petição juntos. Confirma quinta às 16h?", at: "2026-06-10T14:12:00" },
      { id: "m6", fromId: "l-marina", body: "Confirmo! Muito obrigada pela atenção.", at: "2026-06-10T14:13:00" },
    ],
    milestones: [
      { id: "ms1", label: "Atendimento iniciado", at: "2026-06-10T14:00:00", done: true },
      { id: "ms2", label: "Diagnóstico revisado em conjunto", at: "2026-06-10T14:08:00", done: true },
      { id: "ms3", label: "Devolutiva por videoconferência", at: "2026-06-18T16:00:00", done: false },
      { id: "ms4", label: "Revisão da petição inicial", at: "", done: false },
      { id: "ms5", label: "Conclusão do atendimento", at: "", done: false },
    ],
    sessions: [
      {
        id: "vs-001",
        demandId: "dem-001",
        title: "Devolutiva — estratégia da rescisão indireta",
        mode: "online",
        scheduledAt: "2026-06-18T16:00:00",
        durationMin: 45,
        status: "agendada",
        recordingConsent: true,
        captions: true,
      },
    ],
  },
];

export const ratings: Rating[] = [
  {
    id: "r-001",
    serviceId: "svc-000",
    fromId: "l-pedro",
    toId: "l-rogerio",
    score: 5,
    criteria: { clareza: 5, pontualidade: 5, tecnica: 5, empatia: 4 },
    comment: "Explicou o caminho com muita clareza e paciência. Recomendo.",
    createdAt: "2026-05-30T17:00:00",
  },
  {
    id: "r-002",
    serviceId: "svc-000b",
    fromId: "l-marina",
    toId: "l-juliana",
    score: 5,
    criteria: { clareza: 5, pontualidade: 4, tecnica: 5, empatia: 5 },
    comment: "Atendimento humano e técnico ao mesmo tempo. Aprendi muito.",
    createdAt: "2026-05-12T11:00:00",
  },
];

export const partnerships: Partnership[] = [
  {
    id: "par-001",
    code: "PAR-2026-031",
    demandId: "dem-002",
    initiateId: "l-marina",
    partnerId: "l-juliana",
    serviceValue: 6000,
    feePct: 0.05,
    status: "encerrada",
    acceptedByInitiate: "2026-04-22T09:00:00",
    acceptedByPartner: "2026-04-22T10:30:00",
    createdAt: "2026-04-22T08:40:00",
  },
  {
    id: "par-002",
    code: "PAR-2026-044",
    demandId: "dem-003",
    initiateId: "l-pedro",
    partnerId: "l-bruno",
    serviceValue: 4500,
    feePct: 0.05,
    status: "proposta",
    createdAt: "2026-06-12T14:00:00",
  },
];

export const notifications: Notification[] = [
  { id: "n1", userId: "l-marina", type: "matching", title: "Dr. Rogério aceitou sua demanda", body: "O especialista aceitou atender “Rescisão indireta por atraso de salários”.", read: false, createdAt: "2026-06-10T13:58:00", link: "/app/atendimento/svc-001" },
  { id: "n2", userId: "l-marina", type: "mensagem", title: "Nova mensagem de Rogério Beltrão", body: "“Marquei uma devolutiva por vídeo para quinta às 16h.”", read: false, createdAt: "2026-06-10T14:12:00", link: "/app/atendimento/svc-001" },
  { id: "n3", userId: "l-marina", type: "diagnostico", title: "Diagnóstico concluído", body: "Seu relatório de necessidades foi gerado e está pronto para revisão.", read: true, createdAt: "2026-06-09T15:21:00", link: "/app/demandas/dem-001" },
  { id: "n4", userId: "l-marina", type: "atendimento", title: "Sessão agendada", body: "Devolutiva por videoconferência em 18 jun, 16h.", read: true, createdAt: "2026-06-10T14:12:30", link: "/app/atendimento/svc-001" },
  { id: "n5", userId: "l-rogerio", type: "matching", title: "Nova oportunidade compatível", body: "Demanda de Direito do Trabalho com 96% de compatibilidade.", read: false, createdAt: "2026-06-10T13:40:00", link: "/app/oportunidades" },
  { id: "n6", userId: "l-rogerio", type: "avaliacao", title: "Nova avaliação recebida", body: "Você recebeu uma avaliação 5,0 de um colega iniciante.", read: true, createdAt: "2026-05-30T17:01:00", link: "/app/perfil" },
  { id: "n7", userId: "l-helena", type: "cadastro", title: "2 cadastros aguardando validação", body: "Amanda Ribeiro e Marcos Vinícius aguardam validação de OAB.", read: false, createdAt: "2026-06-12T19:00:00", link: "/admin/validacoes" },
];

export const consents: ConsentRecord[] = [
  { id: "c1", type: "TCLE", version: "v3.0", acceptedAt: "2026-03-12T09:14:00" },
  { id: "c2", type: "Termos de Uso", version: "v2.1", acceptedAt: "2026-03-12T09:14:00" },
  { id: "c3", type: "Imagem/Voz", version: "v1.4", acceptedAt: "2026-06-10T14:00:00" },
  { id: "c4", type: "Gravação de devolutiva", version: "v1.0", acceptedAt: "2026-06-10T14:00:00" },
];

/* ---- Admin / governance --------------------------------------------------- */

export const validationQueue: ValidationQueueItem[] = [
  { lawyerId: "l-amanda", submittedAt: "2026-06-12T18:00:00", oab: "SP 489.771", seccional: "SP", type: "cadastro" },
  { lawyerId: "l-marcos", submittedAt: "2026-06-11T11:20:00", oab: "SP 318.404", seccional: "SP", type: "historico" },
];

export const aiReviewQueue: AIReviewItem[] = [
  {
    id: "air-1",
    lawyerId: "l-marcos",
    processNumber: "5001111-22.2020.4.03.6183",
    area: "Direito Previdenciário",
    issue: "Resultado informado como “exitoso”, mas o registro público indica recurso pendente.",
    aiConfidence: 0.61,
    status: "pendente",
    sources: ["DataJud/CNJ — TRF3", "Movimentação processual em 14/03/2024"],
  },
  {
    id: "air-2",
    lawyerId: "l-tiago",
    processNumber: "1009988-11.2021.5.02.0067",
    area: "Direito do Trabalho",
    issue: "Polo de atuação divergente entre informe e registro (autor x réu).",
    aiConfidence: 0.74,
    status: "pendente",
    sources: ["DataJud/CNJ — TRT2"],
  },
];

export const conflicts: Conflict[] = [
  {
    id: "cf-1",
    serviceId: "svc-014",
    reporterId: "l-pedro",
    againstId: "l-tiago",
    reason: "Demora superior a 10 dias para retorno após aceite da demanda.",
    status: "em_mediacao",
    createdAt: "2026-06-05T16:00:00",
  },
];

export const auditLog: AuditEntry[] = [
  { id: "a1", actor: "Helena Prado (Comitê)", action: "Validou inscrição na OAB", target: "Rogério Beltrão Nunes", category: "validação", at: "2026-06-08T10:12:00" },
  { id: "a2", actor: "Sistema (Agente IA)", action: "Sinalizou divergência de histórico", target: "Processo 5001111-22.2020.4.03.6183", category: "revisão-IA", at: "2026-06-11T11:25:00" },
  { id: "a3", actor: "Helena Prado (Comitê)", action: "Abriu mediação de conflito", target: "Atendimento svc-014", category: "mediação", at: "2026-06-05T16:30:00" },
  { id: "a4", actor: "Marina Alves Tavares", action: "Solicitou exclusão de documento", target: "anexo da demanda DEM-2026-009", category: "exclusão", at: "2026-05-02T08:40:00" },
  { id: "a5", actor: "Helena Prado (Comitê)", action: "Concedeu papel Especialista", target: "Carla Menezes Figueiró", category: "papéis", at: "2026-04-18T14:00:00" },
];

export const institutionalContent: InstitutionalContent[] = [
  { id: "ic1", title: "Manual acessível da plataforma", type: "manual", updatedAt: "2026-06-01T09:00:00", accessible: true, status: "publicado" },
  { id: "ic2", title: "Cartilha — Como descrever sua demanda", type: "material", updatedAt: "2026-05-20T09:00:00", accessible: true, status: "publicado" },
  { id: "ic3", title: "Aviso — Manutenção da videoconferência (28/06)", type: "aviso", updatedAt: "2026-06-12T09:00:00", accessible: true, status: "rascunho" },
  { id: "ic4", title: "Vídeo institucional em Libras", type: "material", updatedAt: "2026-05-15T09:00:00", accessible: true, status: "publicado" },
];

export const indicators: ProjectIndicators = {
  lawyersByRole: { iniciante: 612, especialista: 388, parceiro: 141 },
  totalLawyers: 1041,
  totalServices: 326,
  completionRate: 0.84,
  avgRating: 4.6,
  partnerships: 112,
  diagnoses: 498,
  validationsPending: 2,
  monthly: [
    { month: "Jan", atendimentos: 12, cadastros: 64, parcerias: 4 },
    { month: "Fev", atendimentos: 24, cadastros: 98, parcerias: 9 },
    { month: "Mar", atendimentos: 41, cadastros: 152, parcerias: 14 },
    { month: "Abr", atendimentos: 58, cadastros: 187, parcerias: 21 },
    { month: "Mai", atendimentos: 84, cadastros: 221, parcerias: 28 },
    { month: "Jun", atendimentos: 107, cadastros: 119, parcerias: 36 },
  ],
  areaDistribution: [
    { area: "Trabalho", value: 132 },
    { area: "Família", value: 78 },
    { area: "Consumidor", value: 61 },
    { area: "Previdenciário", value: 34 },
    { area: "Civil", value: 21 },
  ],
  satisfaction: [
    { label: "5 estrelas", value: 198 },
    { label: "4 estrelas", value: 92 },
    { label: "3 estrelas", value: 24 },
    { label: "2 estrelas", value: 8 },
    { label: "1 estrela", value: 4 },
  ],
};
