/* ==========================================================================
   Financeiro — ledger único de "trabalhos" (parcerias 50/50) do qual derivam
   tanto o dashboard do advogado quanto o da plataforma. Tudo mockado.

   Modelo: cada serviço tem um valor; a plataforma retém uma taxa de
   intermediação (custeio do projeto); o líquido é dividido 50/50 entre os
   dois advogados. A "parte" de cada advogado = (valor - taxa) / 2.
   ========================================================================== */

import type { LegalArea } from "./types";

export type SettlementStatus = "recebido" | "a_receber" | "pendente";

export interface FinancialWork {
  id: string;
  code: string;
  title: string;
  area: LegalArea;
  initiateId: string;
  partnerId: string;
  serviceValue: number;
  feePct: number;
  status: SettlementStatus;
  date: string; // competência ISO
  method?: "Pix" | "Transferência";
}

export const works: FinancialWork[] = [
  { id: "w1", code: "PAR-2026-007", title: "Rescisão indireta — verbas rescisórias", area: "Direito do Trabalho", initiateId: "l-marina", partnerId: "l-rogerio", serviceValue: 7200, feePct: 0.05, status: "recebido", date: "2026-02-10", method: "Pix" },
  { id: "w2", code: "PAR-2026-011", title: "Reconhecimento de vínculo empregatício", area: "Direito do Trabalho", initiateId: "l-pedro", partnerId: "l-rogerio", serviceValue: 6400, feePct: 0.05, status: "recebido", date: "2026-03-05", method: "Transferência" },
  { id: "w3", code: "PAR-2026-018", title: "Acidente de trabalho — indenização", area: "Direito Previdenciário", initiateId: "l-amanda", partnerId: "l-rogerio", serviceValue: 8800, feePct: 0.05, status: "a_receber", date: "2026-05-20" },
  { id: "w4", code: "PAR-2026-022", title: "Assédio moral no ambiente de trabalho", area: "Direito do Trabalho", initiateId: "l-marina", partnerId: "l-carla", serviceValue: 5600, feePct: 0.05, status: "recebido", date: "2026-03-18", method: "Pix" },
  { id: "w5", code: "PAR-2026-026", title: "Guarda compartilhada e convivência", area: "Direito de Família", initiateId: "l-amanda", partnerId: "l-juliana", serviceValue: 4200, feePct: 0.05, status: "recebido", date: "2026-04-02", method: "Pix" },
  { id: "w6", code: "PAR-2026-031", title: "Revisão de cláusula de locação", area: "Direito Civil", initiateId: "l-marina", partnerId: "l-juliana", serviceValue: 6000, feePct: 0.05, status: "recebido", date: "2026-04-22", method: "Transferência" },
  { id: "w7", code: "PAR-2026-033", title: "Superendividamento — repactuação", area: "Direito do Consumidor", initiateId: "l-pedro", partnerId: "l-bruno", serviceValue: 3800, feePct: 0.05, status: "a_receber", date: "2026-05-09" },
  { id: "w8", code: "PAR-2026-038", title: "Benefício por incapacidade", area: "Direito Previdenciário", initiateId: "l-pedro", partnerId: "l-rogerio", serviceValue: 5200, feePct: 0.05, status: "a_receber", date: "2026-06-01" },
  { id: "w9", code: "PAR-2026-040", title: "Dano existencial — jornada exaustiva", area: "Direito do Trabalho", initiateId: "l-marina", partnerId: "l-carla", serviceValue: 4800, feePct: 0.05, status: "a_receber", date: "2026-06-04" },
  { id: "w10", code: "PAR-2026-044", title: "Cobrança indevida de tarifas bancárias", area: "Direito do Consumidor", initiateId: "l-pedro", partnerId: "l-bruno", serviceValue: 4500, feePct: 0.05, status: "pendente", date: "2026-06-12" },
  { id: "w11", code: "PAR-2026-046", title: "Medida protetiva — violência doméstica", area: "Direitos Humanos", initiateId: "l-amanda", partnerId: "l-juliana", serviceValue: 3600, feePct: 0.05, status: "recebido", date: "2026-02-25", method: "Pix" },
  { id: "w12", code: "PAR-2026-049", title: "Terceirização — contencioso trabalhista", area: "Direito Empresarial", initiateId: "l-pedro", partnerId: "l-tiago", serviceValue: 7600, feePct: 0.05, status: "recebido", date: "2026-03-28", method: "Transferência" },
  { id: "w13", code: "PAR-2026-052", title: "Compliance trabalhista — consultoria", area: "Direito do Trabalho", initiateId: "l-marina", partnerId: "l-tiago", serviceValue: 6800, feePct: 0.05, status: "a_receber", date: "2026-05-30" },
  { id: "w14", code: "PAR-2026-055", title: "Reconhecimento de vínculo — motorista de app", area: "Direito do Trabalho", initiateId: "l-pedro", partnerId: "l-rogerio", serviceValue: 5900, feePct: 0.05, status: "pendente", date: "2026-06-12" },
];

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export const workFee = (w: FinancialWork) => Math.round(w.serviceValue * w.feePct);
export const workNet = (w: FinancialWork) => w.serviceValue - workFee(w);
/** A parte de cada advogado (divisão 50/50 do líquido). */
export const workShare = (w: FinancialWork) => Math.round(workNet(w) / 2);

export const settlementLabel: Record<SettlementStatus, string> = {
  recebido: "Recebido",
  a_receber: "A receber",
  pendente: "Pendente",
};

function monthIndex(iso: string) {
  return new Date(iso).getMonth();
}
function monthsInOrder(items: { date: string }[]) {
  const present = [...new Set(items.map((i) => monthIndex(i.date)))].sort((a, b) => a - b);
  return present.map((m) => ({ idx: m, label: MONTHS[m] }));
}

/* ---- Advogado ------------------------------------------------------------- */

export interface LawyerFinance {
  works: (FinancialWork & { share: number; role: "iniciante" | "parceiro" })[];
  recebido: number;
  aReceber: number;
  pendente: number;
  total: number; // recebido + aReceber + pendente (ganhos acumulados)
  volume: number; // soma dos valores de serviço dos trabalhos
  count: number;
  ticketMedio: number;
  monthly: { month: string; recebido: number; aReceber: number }[];
  byArea: { area: string; value: number }[];
  nextPayout?: { value: number; title: string; date: string };
}

export function lawyerFinance(lawyerId: string): LawyerFinance {
  const mine = works
    .filter((w) => w.initiateId === lawyerId || w.partnerId === lawyerId)
    .map((w) => ({ ...w, share: workShare(w), role: (w.initiateId === lawyerId ? "iniciante" : "parceiro") as "iniciante" | "parceiro" }))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const sumBy = (s: SettlementStatus) => mine.filter((w) => w.status === s).reduce((acc, w) => acc + w.share, 0);
  const recebido = sumBy("recebido");
  const aReceber = sumBy("a_receber");
  const pendente = sumBy("pendente");
  const volume = mine.reduce((acc, w) => acc + w.serviceValue, 0);

  const monthly = monthsInOrder(mine).map(({ idx, label }) => ({
    month: label,
    recebido: mine.filter((w) => monthIndex(w.date) === idx && w.status === "recebido").reduce((a, w) => a + w.share, 0),
    aReceber: mine.filter((w) => monthIndex(w.date) === idx && w.status !== "recebido").reduce((a, w) => a + w.share, 0),
  }));

  const areaMap = new Map<string, number>();
  for (const w of mine) areaMap.set(w.area, (areaMap.get(w.area) ?? 0) + w.share);
  const byArea = [...areaMap.entries()].map(([area, value]) => ({ area: area.replace("Direito ", "").replace("do ", "").replace("de ", "").replace("da ", ""), value })).sort((a, b) => b.value - a.value);

  const upcoming = mine.filter((w) => w.status === "a_receber").sort((a, b) => +new Date(a.date) - +new Date(b.date))[0];

  return {
    works: mine,
    recebido,
    aReceber,
    pendente,
    total: recebido + aReceber + pendente,
    volume,
    count: mine.length,
    ticketMedio: mine.length ? Math.round(mine.reduce((a, w) => a + w.share, 0) / mine.length) : 0,
    monthly,
    byArea,
    nextPayout: upcoming ? { value: upcoming.share, title: upcoming.title, date: upcoming.date } : undefined,
  };
}

/* ---- Plataforma ----------------------------------------------------------- */

export interface PlatformFinance {
  volume: number;
  receita: number; // intermediação (custeio)
  repasse: number; // total repassado aos advogados
  recebido: number;
  aReceber: number;
  pendente: number;
  count: number;
  ticketMedio: number;
  liquidadas: number;
  monthly: { month: string; volume: number; receita: number; repasse: number }[];
  byArea: { area: string; volume: number }[];
  byStatus: { label: string; value: number; status: SettlementStatus }[];
  topEarners: { lawyerId: string; total: number; works: number }[];
}

export function platformFinance(): PlatformFinance {
  const volume = works.reduce((a, w) => a + w.serviceValue, 0);
  const receita = works.reduce((a, w) => a + workFee(w), 0);
  const repasse = works.reduce((a, w) => a + workNet(w), 0);
  const sumVolBy = (s: SettlementStatus) => works.filter((w) => w.status === s).reduce((a, w) => a + w.serviceValue, 0);

  const monthly = monthsInOrder(works).map(({ idx, label }) => {
    const m = works.filter((w) => monthIndex(w.date) === idx);
    return {
      month: label,
      volume: m.reduce((a, w) => a + w.serviceValue, 0),
      receita: m.reduce((a, w) => a + workFee(w), 0),
      repasse: m.reduce((a, w) => a + workNet(w), 0),
    };
  });

  const areaMap = new Map<string, number>();
  for (const w of works) areaMap.set(w.area, (areaMap.get(w.area) ?? 0) + w.serviceValue);
  const byArea = [...areaMap.entries()].map(([area, volume]) => ({ area: area.replace("Direito ", "").replace("do ", "").replace("de ", "").replace("da ", ""), volume })).sort((a, b) => b.volume - a.volume);

  const earnerMap = new Map<string, { total: number; works: number }>();
  for (const w of works) {
    for (const id of [w.initiateId, w.partnerId]) {
      const cur = earnerMap.get(id) ?? { total: 0, works: 0 };
      earnerMap.set(id, { total: cur.total + workShare(w), works: cur.works + 1 });
    }
  }
  const topEarners = [...earnerMap.entries()]
    .map(([lawyerId, v]) => ({ lawyerId, ...v }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return {
    volume,
    receita,
    repasse,
    recebido: sumVolBy("recebido"),
    aReceber: sumVolBy("a_receber"),
    pendente: sumVolBy("pendente"),
    count: works.length,
    ticketMedio: Math.round(volume / works.length),
    liquidadas: works.filter((w) => w.status === "recebido").length,
    monthly,
    byArea,
    byStatus: [
      { label: "Recebido", value: sumVolBy("recebido"), status: "recebido" },
      { label: "A receber", value: sumVolBy("a_receber"), status: "a_receber" },
      { label: "Pendente", value: sumVolBy("pendente"), status: "pendente" },
    ],
    topEarners,
  };
}
