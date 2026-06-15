import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Scale, ShieldCheck, Sparkles, Handshake } from "lucide-react";
import { Logo } from "@/components/Logo";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[1fr_1.05fr]">
      {/* Brand panel */}
      <aside className="relative hidden bg-navy-chrome text-white lg:flex lg:flex-col lg:justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
        <Link to="/" className="relative"><Logo onDark /></Link>
        <div className="relative max-w-md">
          <Scale className="size-8 text-bordo-300" />
          <p className="mt-5 font-serif text-[1.7rem] leading-snug text-white text-balance">
            “A advocacia se fortalece quando os advogados se conectam.”
          </p>
          <p className="mt-3 text-[0.9rem] text-navy-200">
            Apoio humanizado, histórico validado e parcerias justas — em uma plataforma que respeita o sigilo e a dignidade de cada caso.
          </p>
        </div>
        <ul className="relative space-y-3 text-[0.88rem] text-navy-100">
          <li className="flex items-center gap-3"><ShieldCheck className="size-4.5 text-bordo-300" /> Inscrição na OAB validada antes da ativação</li>
          <li className="flex items-center gap-3"><Sparkles className="size-4.5 text-bordo-300" /> Diagnóstico do caso conduzido por IA</li>
          <li className="flex items-center gap-3"><Handshake className="size-4.5 text-bordo-300" /> Parcerias 50/50 com termo digital</li>
        </ul>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-5 py-10 sm:px-8">
        <div className="lg:hidden mb-8"><Link to="/"><Logo /></Link></div>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
