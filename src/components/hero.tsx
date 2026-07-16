"use client";
import { useEffect, useState } from "react";
import { Check, Copy, Server } from "lucide-react";
import Image from "next/image";
const IP = process.env.NEXT_PUBLIC_SERVER_IP ?? "bosslycraft.net";
export function Hero(){
 const [copied,setCopied]=useState(false); const [funding,setFunding]=useState({raisedCents:0,goalCents:2000});
 useEffect(()=>{fetch("/api/funding").then(r=>r.json()).then(setFunding).catch(()=>{})},[]);
 const pct=Math.min(100,Math.round(funding.raisedCents/funding.goalCents*100));
 return <section className="hero-section grid-bg relative overflow-hidden pt-20"><div className="hero-aura absolute left-1/2 top-32 h-96 w-96 -translate-x-1/2 blur-[120px]"/><div className="relative mx-auto grid max-w-6xl items-center gap-4 px-6 pb-28 pt-14 md:grid-cols-[.9fr_1.1fr] md:pb-36 md:pt-20">
   <div><div className="server-badge mb-6 inline-flex items-center gap-2 border-2 px-3 py-1.5 text-xs font-black"><span className="h-2 w-2 bg-emerald-300 shadow-[0_0_12px_#86efac]"/>SERVIDOR EN LÍNEA</div>
   <h1 className="minecraft-heading hero-title max-w-3xl text-5xl font-black uppercase leading-[.92] tracking-[-.04em] md:text-7xl">Construye tu <span className="hero-accent">leyenda.</span></h1>
   <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">BosslyCraft es una comunidad survival donde cada logro se gana bloque a bloque. Apóyanos y equipa cosméticos exclusivos, nunca ventajas de juego.</p>
   <div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={()=>{navigator.clipboard.writeText(IP);setCopied(true);setTimeout(()=>setCopied(false),1800)}} className="ip-panel pixel-panel flex items-center justify-between gap-8 px-5 py-3 text-left"><span><small className="block text-[10px] uppercase tracking-widest text-slate-400">IP del servidor · clic para copiar</small><b className="font-mono text-sm text-cyan-200">{IP}</b></span>{copied?<Check className="h-5 w-5 text-emerald-300"/>:<Copy className="h-5 w-5 text-violet-300"/>}</button><a href="#rangos" className="pixel-button grid place-items-center px-7 py-3 font-black uppercase text-white">Apoyar</a></div></div>
   <Image src="/bosslycraft_logo.png" alt="Logo de BosslyCraft" width={1254} height={904} priority sizes="(max-width: 768px) 92vw, 560px" className="logo-float mx-auto h-auto w-full max-w-[560px] drop-shadow-[0_20px_45px_rgba(0,110,255,.45)]"/>
   <div className="funding-panel pixel-panel max-w-xl p-5 md:col-span-2 md:mt-6"><div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8"><div className="min-w-0"><p className="text-xs uppercase tracking-widest text-slate-400">Hosting · este mes</p><p className="minecraft-heading mt-1 text-lg font-black uppercase">Mantengamos el mundo vivo</p></div><span className="shrink-0 font-mono text-sm text-cyan-200">${(funding.raisedCents/100).toFixed(2)} / ${(funding.goalCents/100).toFixed(2)}</span></div><div className="funding-track h-5 border-2 p-0.5"><div className="funding-fill h-full transition-all duration-700" style={{width:`${pct}%`}}/></div><p className="mt-3 flex items-center gap-2 text-xs text-slate-400"><Server className="h-3.5 w-3.5 text-violet-300"/>{pct}% de la meta mensual</p></div>
 </div></section>
}
