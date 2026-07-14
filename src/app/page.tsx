import { Hero } from "@/components/hero";
import { RankStore } from "@/components/rank-store";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";
import { getPublicRanks } from "@/server/catalog";

export default function Home() {
  const ranks = getPublicRanks();

  return <main><Hero />
    <section className="border-y border-[#21436a] bg-[#040b16]/85 backdrop-blur-md"><div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 text-sm text-slate-400 md:grid-cols-3">
      <p className="flex gap-3"><Sparkles className="h-5 w-5 text-cyan-400"/>Cosméticos que respetan el juego</p>
      <p className="flex gap-3"><ShieldCheck className="h-5 w-5 text-cyan-400"/>Pagos protegidos en modo de prueba</p>
      <p className="flex gap-3"><Zap className="h-5 w-5 text-cyan-400"/>Activación preparada para el servidor</p>
    </div></section>
    <RankStore ranks={ranks} />
  </main>;
}
