import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Captions,
  Circle,
  MonitorUp,
  MessageSquare,
  Users,
  ShieldCheck,
  Hand,
} from "lucide-react";
import { useApp } from "@/store/app-context";
import { services, demands } from "@/data/mock";
import { lawyerById } from "@/data/lawyers";
import { initials, avatarTint, cn } from "@/lib/utils";

function Participant({ name, speaking, muted, label }: { name: string; speaking?: boolean; muted?: boolean; label: string }) {
  const tint = avatarTint(name);
  return (
    <div className={cn("relative flex items-center justify-center rounded-2xl bg-navy-950 overflow-hidden border-2 transition-colors", speaking ? "border-success" : "border-transparent")}>
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "26px 26px" }} />
      <span className="grid size-24 place-items-center rounded-full font-serif text-[2rem] font-semibold" style={{ backgroundColor: tint.bg, color: tint.fg }}>{initials(name)}</span>
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/45 px-2.5 py-1 text-[0.8rem] text-white backdrop-blur-sm">
        {muted ? <MicOff className="size-3.5 text-bordo-300" /> : <Mic className="size-3.5 text-success" />}
        {label}
      </div>
    </div>
  );
}

export function VideoRoom() {
  const { id } = useParams();
  const { user } = useApp();
  const nav = useNavigate();
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [captions, setCaptions] = useState(true);
  const recording = true;
  const [elapsed, setElapsed] = useState(0);

  const session = services.flatMap((s) => s.sessions).find((s) => s.id === id);
  const svc = services.find((s) => s.sessions.some((x) => x.id === id));
  const demand = svc ? demands.find((d) => d.id === svc.demandId) : undefined;
  const other = svc ? lawyerById(svc.initiateId === user.id ? svc.specialistId : svc.initiateId) : undefined;

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="fixed inset-0 flex flex-col bg-navy-950 text-white" style={{ zIndex: "var(--z-modal)" }}>
      {/* top bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid size-9 place-items-center rounded-lg bg-white/10"><VideoIcon className="size-5" /></span>
          <div className="min-w-0">
            <p className="text-[0.9rem] font-semibold truncate">{session?.title ?? "Sessão de devolutiva"}</p>
            <p className="text-[0.74rem] text-navy-200 truncate">{demand?.code} · sala segura auto-hospedada</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {recording && (
            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="inline-flex items-center gap-1.5 rounded-full bg-bordo-600/90 px-2.5 py-1 text-[0.74rem] font-semibold">
              <Circle className="size-2.5 fill-current" /> REC
            </motion.span>
          )}
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.78rem] font-mono tabular-nums">{mm}:{ss}</span>
        </div>
      </header>

      {/* stage */}
      <div className="flex-1 grid gap-3 p-4 sm:grid-cols-2 place-content-center">
        <Participant name={other?.name ?? "Convidado"} label={other?.name?.split(" ").slice(0, 2).join(" ") ?? "Convidado"} speaking muted={false} />
        <Participant name={user.name} label={`${user.name.split(" ")[0]} (você)`} muted={!mic} />
      </div>

      {/* captions */}
      {captions && (
        <div className="px-4 pb-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl rounded-xl bg-black/55 px-4 py-2.5 text-center text-[0.92rem] backdrop-blur-sm">
            <span className="text-navy-200">{other?.name?.split(" ")[0]}:</span> “Então vamos manter o vínculo e ajuizar com pedido de tutela. Reúna os comprovantes dos atrasos…”
            <span className="ml-2 inline-flex items-center gap-1 text-[0.7rem] text-navy-300"><Captions className="size-3" /> legendas automáticas</span>
          </motion.div>
        </div>
      )}

      {/* controls */}
      <footer className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10">
        <div className="hidden sm:flex items-center gap-2 text-[0.78rem] text-navy-200">
          <ShieldCheck className="size-4 text-success" /> Dados da sessão na infraestrutura da instituição
        </div>
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <CtrlBtn on={mic} onClick={() => setMic((v) => !v)} OnIcon={Mic} OffIcon={MicOff} label="Microfone" />
          <CtrlBtn on={cam} onClick={() => setCam((v) => !v)} OnIcon={VideoIcon} OffIcon={VideoOff} label="Câmera" />
          <CtrlBtn on={captions} onClick={() => setCaptions((v) => !v)} OnIcon={Captions} OffIcon={Captions} label="Legendas" />
          <button className="grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/15 transition-colors" aria-label="Compartilhar tela"><MonitorUp className="size-5" /></button>
          <button className="hidden sm:grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/15 transition-colors" aria-label="Levantar a mão"><Hand className="size-5" /></button>
          <button
            onClick={() => nav(svc ? `/app/atendimento/${svc.id}` : "/app")}
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-bordo-600 px-5 h-12 font-medium hover:bg-bordo-700 transition-colors"
          >
            <PhoneOff className="size-5" /> Sair
          </button>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button className="grid size-10 place-items-center rounded-lg text-navy-200 hover:bg-white/10" aria-label="Participantes"><Users className="size-5" /></button>
          {svc && <Link to={`/app/atendimento/${svc.id}`} className="grid size-10 place-items-center rounded-lg text-navy-200 hover:bg-white/10" aria-label="Chat"><MessageSquare className="size-5" /></Link>}
        </div>
      </footer>
    </div>
  );
}

function CtrlBtn({ on, onClick, OnIcon, OffIcon, label }: { on: boolean; onClick: () => void; OnIcon: typeof Mic; OffIcon: typeof Mic; label: string }) {
  return (
    <button onClick={onClick} aria-pressed={on} aria-label={label} className={cn("grid size-12 place-items-center rounded-full transition-colors", on ? "bg-white/10 hover:bg-white/15" : "bg-bordo-600/90 hover:bg-bordo-700")}>
      {on ? <OnIcon className="size-5" /> : <OffIcon className="size-5" />}
    </button>
  );
}
