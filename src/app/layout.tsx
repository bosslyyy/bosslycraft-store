import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
export const metadata: Metadata = { title: "BosslyCraft · Rangos", description: "Apoya BosslyCraft y recibe cosméticos exclusivos." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className={`${geist.variable} ${mono.variable}`}><body>
    <nav className="fixed inset-x-0 top-0 z-50 border-b-4 border-[#142640] bg-[#07101d]/90 backdrop-blur-xl"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
      <Link href="/" aria-label="Ir al inicio de BosslyCraft" className="flex items-center"><Image src="/bosslycraft_logo.png" alt="BosslyCraft" width={1254} height={904} priority sizes="128px" className="h-16 w-28 object-contain sm:w-32"/></Link>
      <Link href="/#rangos" className="pixel-button px-5 py-3 text-xs font-black uppercase tracking-wider text-white">Ver rangos</Link>
    </div></nav>{children}
    <footer className="border-t-4 border-[#142640] bg-[#040912]"><div className="mx-auto max-w-6xl px-6 py-10"><p className="mb-6 max-w-2xl text-xs font-semibold uppercase tracking-wider text-amber-300">NO ES UN SERVIDOR OFICIAL DE MINECRAFT. NO ESTÁ APROBADO NI ASOCIADO CON MOJANG O MICROSOFT.</p><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500"><Link href="/terminos">Términos</Link><Link href="/privacidad">Privacidad</Link><Link href="/reembolsos">Reembolsos</Link><Link href="/contacto">Contacto</Link><span>© 2026 BosslyCraft</span></div></div></footer>
  </body></html>;
}
