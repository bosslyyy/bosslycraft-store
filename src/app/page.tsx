import { Hero } from "@/components/hero";
import { RankStore } from "@/components/rank-store";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";
import { getPublicRanks } from "@/server/catalog";
import Image from "next/image";

export default function Home() {
  const ranks = getPublicRanks();

  return <main><Hero />
    <section className="border-y border-[#21436a] bg-[#040b16]/85 backdrop-blur-md"><div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 text-sm text-slate-400 md:grid-cols-3">
      <p className="flex gap-3"><Sparkles className="h-5 w-5 text-cyan-400"/>Cosméticos que respetan el juego</p>
      <p className="flex gap-3"><ShieldCheck className="h-5 w-5 text-cyan-400"/>Pagos protegidos en modo de prueba</p>
      <p className="flex gap-3"><Zap className="h-5 w-5 text-cyan-400"/>Activación preparada para el servidor</p>
    </div></section>
    <section className="server-banner mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="pixel-panel overflow-hidden bg-[#080b1d] p-1.5 sm:p-2">
        <Image
          src="/bannerpng.png"
          alt="BosslyCraft MC: survival custom, economía y eventos"
          width={2170}
          height={725}
          sizes="(max-width: 1280px) 96vw, 1280px"
          className="h-auto w-full"
        />
      </div>
    </section>
    <RankStore ranks={ranks} />
  </main>;
}
