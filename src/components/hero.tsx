"use client";
import { useEffect, useState } from "react";
import { Check, Copy, Server } from "lucide-react";
import Image from "next/image";
const IP = process.env.NEXT_PUBLIC_SERVER_IP ?? "bosslycraft.net";
export function Hero(){
 const [copied,setCopied]=useState(false); const [funding,setFunding]=useState({raisedCents:0,goalCents:2000});
 useEffect(()=>{fetch("/api/funding").then(r=>r.json()).then(setFunding).catch(()=>{})},[]);
 const pct=Math.min(100,Math.round(funding.raisedCents/funding.goalCents*100));
 return <section className="grid-bg relative overflow-hidden pt-20"><div className="absolute left-1/2 top-32 h-96 w-96 -translate-x-1/2 bg-blue-500/20 blur-[120px]"/><div className="relative mx-auto grid max-w-6xl items-center gap-4 px-6 pb-28 pt-14 md:grid-cols-[.9fr_1.1fr] md:pb-36 md:pt-20">
   <div><div className="mb-6 inline-flex items-center gap-2 border-2 border-emerald-500/50 bg-[#07170c] px-3 py-1.5 text-xs font-black text-emerald-300"><span className="h-2 w-2 bg-emerald-400"/>SERVIDOR EN LÍNEA</div>
   <h1 className="max-w-3xl text-5xl font-black uppercase leading-[.92] tracking-[-.04em] md:text-7xl">Construye tu <span className="text-[#27b8ff] [text-shadow:3px_3px_0_#07365e]">leyenda.</span></h1>
   <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">BosslyCraft es una comunidad survival donde cada logro se gana bloque a bloque. Apóyanos y equipa cosméticos exclusivos, nunca ventajas de juego.</p>
   <div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={()=>{navigator.clipboard.writeText(IP);setCopied(true);setTimeout(()=>setCopied(false),1800)}} className="pixel-panel flex items-center justify-between gap-8 bg-[#0d1c30] px-5 py-3 text-left"><span><small className="block text-[10px] uppercase tracking-widest text-slate-500">IP del servidor · clic para copiar</small><b className="font-mono text-sm text-[#72d6ff]">{IP}</b></span>{copied?<Check className="h-5 w-5 text-emerald-400"/>:<Copy className="h-5 w-5 text-slate-500"/>}</button><a href="#rangos" className="pixel-button grid place-items-center px-7 py-3 font-black uppercase text-white">Apoyar</a></div></div>
   <Image src="/bosslycraft.png" alt="Logo de BosslyCraft" width={500} height={500} priority className="logo-float mx-auto w-full max-w-[480px] drop-shadow-[0_20px_45px_rgba(0,110,255,.45)]"/>
   <div className="pixel-panel max-w-xl bg-[#091525]/90 p-5 md:col-span-2 md:mt-6"><div className="mb-3 flex items-end justify-between"><div><p className="text-xs uppercase tracking-widest text-slate-500">Hosting · este mes</p><p className="mt-1 text-lg font-black uppercase">Mantengamos el mundo vivo</p></div><span className="font-mono text-sm text-[#72d6ff]">${(funding.raisedCents/100).toFixed(2)} / ${(funding.goalCents/100).toFixed(2)}</span></div><div className="h-4 border-2 border-[#264867] bg-[#030810] p-0.5"><div className="h-full bg-gradient-to-r from-[#1678bd] to-[#49d4ff] transition-all duration-700" style={{width:`${pct}%`}}/></div><p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Server className="h-3.5 w-3.5"/>{pct}% de la meta mensual</p></div>
 </div></section>
}
