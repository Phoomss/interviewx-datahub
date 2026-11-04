"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
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
    icon: LayoutDashboard,
    color: "text-blue-600 bg-blue-50 border-blue-200/80",
    activeColor: "bg-blue-600 text-white border-blue-600",
  },
  {
    id: "synthetic",
    title: "สตูดิโอสังเคราะห์ข้อมูล (Synthetic Studio)",
    subtitle: "สุ่มสร้างเรซูเม่จำลองตาม 15 อุตสาหกรรม ไร้ PII",
    href: "/synthetic",
    icon: Sparkles,
    color: "text-purple-600 bg-purple-50 border-purple-200/80",
    activeColor: "bg-purple-600 text-white border-purple-600",
  },
  {
    id: "resumes",
    title: "คลังเรซูเม่ & CV (Document Intelligence)",
    subtitle: "อัปโหลด สกัดข้อมูลโครงสร้าง และสตูดิโอตรวจทาน",
    href: "/resumes",
    icon: FileText,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200/80",
    activeColor: "bg-indigo-600 text-white border-indigo-600",
  },
  {
    id: "taxonomy",
    title: "ผังอุตสาหกรรม & ทักษะ (Taxonomy)",
    subtitle: "มาตรฐาน 15 กลุ่มอุตสาหกรรม และ 80+ สายอาชีพ",
    href: "/taxonomy",
    icon: Sliders,
    color: "text-amber-600 bg-amber-50 border-amber-200/80",
    activeColor: "bg-amber-600 text-white border-amber-600",
  },
  {
    id: "consent",
    title: "ความยินยอม & PII Vault (Privacy & PDPA)",
    subtitle: "เข้ารหัส AES-256 บันทึกความยินยอม และสิทธิลืมข้อมูล",
    href: "/consent",
    icon: ShieldCheck,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200/80",
    activeColor: "bg-emerald-600 text-white border-emerald-600",
  },
  {
    id: "datasets",
    title: "ชุดข้อมูลเทรน AI (LLM Datasets)",
    subtitle: "แบ่งสัดส่วน Train 80% / Val 10% / Test 10% ปลอด PII",
    href: "/datasets",
    icon: Database,
    color: "text-cyan-600 bg-cyan-50 border-cyan-200/80",
    activeColor: "bg-cyan-600 text-white border-cyan-600",
  },
  {
    id: "analytics",
    title: "ธรรมาภิบาล & สถิติ (Audit Analytics)",
    subtitle: "มาตรวัดความแม่นยำ AI และบันทึก Audit Logs",
    href: "/analytics",
    icon: BarChart3,
    color: "text-rose-600 bg-rose-50 border-rose-200/80",
    activeColor: "bg-rose-600 text-white border-rose-600",
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
      className="absolute top-full mt-3.5 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-white border border-slate-200 shadow-2xl shadow-slate-900/15 rounded-[28px] p-4 text-slate-900 animate-in fade-in zoom-in-95 duration-150 font-sans ring-1 ring-slate-200/80"
    >
      {/* Decorative arrow pointing up to the trigger */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-t border-l border-slate-200/80" />

      {/* Top Header: Clean light theme */}
      <div className="flex items-center justify-between px-2.5 pb-3 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
            ผังระบบและโมดูลทั้งหมด (All Modules)
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
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
                  ? "bg-blue-50/80 text-blue-950 font-semibold ring-1 ring-blue-200/80 shadow-xs"
                  : "hover:bg-slate-50 text-slate-700 hover:text-slate-950"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-150 ${
                    active
                      ? `${mod.activeColor} shadow-xs`
                      : `${mod.color} group-hover:scale-105`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold truncate group-hover:text-blue-600 transition-colors">
                      {mod.title}
                    </span>
                    {active && (
                      <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-600 text-white flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>ปัจจุบัน</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 group-hover:text-slate-700">
                    {mod.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform duration-150 ml-2 ${
                  active
                    ? "text-blue-600 translate-x-0.5"
                    : "text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1"
                }`}
              />
            </Link>
          );
        })}
      </div>

      {/* Footer: Swagger REST API link */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 px-2 flex items-center justify-between text-[11px] text-slate-500">
        <span className="text-slate-500">ระบบเชื่อมต่อ API ภายนอก:</span>
        <a
          href="http://localhost:4000/docs"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1.5 transition bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/80"
        >
          <span>Swagger REST API (Port 4000)</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
