"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Sparkles,
  FileText,
  Sliders,
  ShieldCheck,
  Database,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Check,
} from "lucide-react";

interface FloatingNavigationMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export const SYSTEM_MODULES = [
  {
    id: "home",
    title: "หน้าแรก (Home Dashboard)",
    subtitle: "ภาพรวมระบบ จัดการสถิติ และการนำทางด่วน",
    href: "/",
    icon: Flame,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "synthetic",
    title: "สตูดิโอสังเคราะห์ข้อมูล (Synthetic Studio)",
    subtitle: "สุ่มสร้างเรซูเม่จำลองตาม 15 อุตสาหกรรม ไร้ PII",
    href: "/synthetic",
    icon: Sparkles,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    id: "resumes",
    title: "คลังเรซูเม่ & CV (Document Intelligence)",
    subtitle: "อัปโหลด สกัดข้อมูลโครงสร้าง และสตูดิโอตรวจทาน",
    href: "/resumes",
    icon: FileText,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    id: "taxonomy",
    title: "ผังอุตสาหกรรม & ทักษะ (Taxonomy)",
    subtitle: "มาตรฐาน 15 กลุ่มอุตสาหกรรม และ 80+ สายอาชีพ",
    href: "/taxonomy",
    icon: Sliders,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "consent",
    title: "ความยินยอม & PII Vault (Privacy & PDPA)",
    subtitle: "เข้ารหัส AES-256 บันทึกความยินยอม และสิทธิลืมข้อมูล",
    href: "/consent",
    icon: ShieldCheck,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "datasets",
    title: "ชุดข้อมูลเทรน AI (LLM Datasets)",
    subtitle: "แบ่งสัดส่วน Train 80% / Val 10% / Test 10% ปลอด PII",
    href: "/datasets",
    icon: Database,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    id: "analytics",
    title: "ธรรมาภิบาล & สถิติ (Audit Analytics)",
    subtitle: "มาตรวัดความแม่นยำ AI และบันทึก Audit Logs",
    href: "/analytics",
    icon: BarChart3,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
];

export function FloatingNavigationMenu({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: FloatingNavigationMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const isRouteActive = (href: string) => {
    const cleanHref = href.split("?")[0].split("#")[0];
    if (cleanHref === "/") return pathname === "/";
    return pathname === cleanHref || (cleanHref !== "/" && pathname?.startsWith(cleanHref));
  };

  return (
    <div
      role="menu"
      aria-label="All Modules Navigation"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full mt-3.5 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-[#0a0a0a]/98 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/80 rounded-[28px] p-4 text-white animate-in fade-in zoom-in-95 duration-150 font-sans ring-1 ring-white/5"
    >
      {/* Decorative arrow pointing up to the trigger */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#0a0a0a] border-t border-l border-white/10" />

      {/* Top Header: Clean and tranquil */}
      <div className="flex items-center justify-between px-2.5 pb-3 border-b border-white/10 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            ผังระบบและโมดูลทั้งหมด (All Modules)
          </span>
        </div>
        <span className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
          7 โมดูลระบบ
        </span>
      </div>

      {/* Clean, vertically stacked modules list */}
      <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-0.5 py-1">
        {SYSTEM_MODULES.map((mod) => {
          const Icon = mod.icon;
          const active = isRouteActive(mod.href);

          return (
            <Link
              key={mod.id}
              href={mod.href}
              onClick={onClose}
              className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all duration-150 ${
                active
                  ? "bg-white/15 text-white font-semibold ring-1 ring-white/20 shadow-sm"
                  : "hover:bg-white/10 text-slate-200 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-150 ${
                    active
                      ? "bg-white text-black border-white shadow-md"
                      : `${mod.color} group-hover:scale-105`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold truncate group-hover:text-blue-300 transition-colors">
                      {mod.title}
                    </span>
                    {active && (
                      <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>ปัจจุบัน</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5 group-hover:text-slate-300">
                    {mod.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform duration-150 ml-2 ${
                  active
                    ? "text-blue-400 translate-x-0.5"
                    : "text-slate-500 group-hover:text-white group-hover:translate-x-1"
                }`}
              />
            </Link>
          );
        })}
      </div>

      {/* Footer: Swagger REST API link */}
      <div className="pt-2.5 mt-2 border-t border-white/10 px-2 flex items-center justify-between text-[11px] text-slate-400">
        <span className="text-slate-400">ระบบเชื่อมต่อ API ภายนอก:</span>
        <a
          href="http://localhost:4000/docs"
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1.5 transition bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20"
        >
          <span>Swagger REST API (Port 4000)</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
