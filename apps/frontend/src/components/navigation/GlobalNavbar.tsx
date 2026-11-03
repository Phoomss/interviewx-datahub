"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  FileText,
  Sliders,
  ShieldCheck,
  Download,
  BarChart3,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Crown,
  UserCheck,
  Bot,
  Eye,
  Flame,
} from "lucide-react";
import { useRole, UserRole } from "@/context/RoleContext";

interface NavItem {
  id: string;
  name: string;
  nameTh: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "synthetic",
    name: "Synthetic",
    nameTh: "สตูดิโอสังเคราะห์",
    href: "/synthetic",
    icon: Sparkles,
  },
  {
    id: "resumes",
    name: "Documents",
    nameTh: "คลังเอกสาร CV",
    href: "/resumes",
    icon: FileText,
  },
  {
    id: "taxonomy",
    name: "Taxonomy",
    nameTh: "ผังอุตสาหกรรม",
    href: "/taxonomy",
    icon: Sliders,
  },
  {
    id: "consent",
    name: "PII Vault",
    nameTh: "ความปลอดภัย & PDPA",
    href: "/consent",
    icon: ShieldCheck,
  },
  {
    id: "datasets",
    name: "Datasets",
    nameTh: "ชุดข้อมูล LLM",
    href: "/datasets",
    icon: Download,
  },
  {
    id: "analytics",
    name: "Analytics",
    nameTh: "ธรรมาภิบาล & สถิติ",
    href: "/analytics",
    icon: BarChart3,
  },
];

const ROLES: { id: UserRole; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }>; piiBadge: string }[] = [
  {
    id: "ADMIN",
    title: "Admin / DPO",
    subtitle: "เข้าถึงและถอดรหัส PII Vault ได้ (บันทึก Audit Log)",
    icon: Crown,
    piiBadge: "PII Full Access",
  },
  {
    id: "ANNOTATOR",
    title: "Annotator",
    subtitle: "ตรวจสอบเรซูเม / สกัดข้อมูล (จำกัดสิทธิ์ PII 403)",
    icon: UserCheck,
    piiBadge: "PII Restricted",
  },
  {
    id: "ML_ENGINEER",
    title: "ML Engineer",
    subtitle: "ฝึกสอนและส่งออกชุดข้อมูลปลอด PII",
    icon: Bot,
    piiBadge: "PII Isolated",
  },
  {
    id: "VIEWER",
    title: "Auditor / Viewer",
    subtitle: "ดูสถิติและผัง Taxonomy เท่านั้น",
    icon: Eye,
    piiBadge: "Read Only",
  },
];

export function GlobalNavbar() {
  const pathname = usePathname();
  const { role, setRole, roleInfo } = useRole();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowRoleDropdown(false);
  }, [pathname]);

  // Keep full-height workspace for review studio
  if (pathname && pathname.includes("/review")) {
    return null;
  }

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case "ADMIN":
        return <Crown className="w-3.5 h-3.5 text-purple-600" />;
      case "ANNOTATOR":
        return <UserCheck className="w-3.5 h-3.5 text-indigo-600" />;
      case "ML_ENGINEER":
        return <Bot className="w-3.5 h-3.5 text-emerald-600" />;
      case "VIEWER":
        return <Eye className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 w-full max-w-5xl mx-auto font-sans pointer-events-none transition-all duration-200">
      {/* Floating Dark Capsule Navbar */}
      <nav className="pointer-events-auto bg-slate-950/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-slate-950/30 rounded-full px-2.5 sm:px-3 py-2 flex items-center justify-between gap-2">
        {/* Left: Flame / Sparkles Circle Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0 pl-1"
          title="InterviewX DataHub - หน้าแรก"
        >
          <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-blue-50 transition-all duration-200">
            <Flame className="w-5 h-5 text-blue-600 fill-blue-600 group-hover:text-indigo-600 group-hover:fill-indigo-600 transition-colors" />
          </div>
          <span className="hidden xl:inline-block font-black text-sm text-white tracking-tight group-hover:text-blue-300 transition-colors">
            InterviewX
          </span>
        </Link>

        {/* Center: Clean, Grouped Nav Links (Desktop >= lg) */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-white text-slate-950 font-bold shadow-xs scale-102"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                title={item.nameTh}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Action Pill & Role Switcher */}
        <div className="flex items-center gap-2 shrink-0 pr-1">
          {/* Swagger API Quick Link */}
          <a
            href="http://localhost:4000/docs"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded-full hover:bg-white/10 transition"
            title="เปิด Swagger API Documentation"
          >
            <span>API</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* White Capsule Role Switcher Pill (Matching user's reference pill) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 transition-all duration-150 active:scale-95"
              title="คลิกเพื่อสลับบทบาทสิทธิ์ (Role Switcher)"
            >
              {getRoleIcon(role)}
              <span className="truncate max-w-[100px] sm:max-w-none">
                {roleInfo.label.split(" ")[0]}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${
                  showRoleDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Role Dropdown Panel */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-3 w-72 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 shadow-2xl z-50 text-white animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-white/10 mb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    สลับบทบาทสิทธิ์ (Role Switcher)
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    จำลองสิทธิ์การเข้าถึง PII Vault ตามบทบาท
                  </div>
                </div>

                <div className="space-y-1">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setRole(r.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-2xl transition flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-white text-slate-950 font-bold shadow-xs"
                            : "hover:bg-white/10 text-slate-300 hover:text-white"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-slate-100 text-slate-950"
                              : "bg-white/5 border border-white/10 text-slate-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold">{r.title}</span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                                isSelected
                                  ? "bg-slate-200 text-slate-900"
                                  : "bg-white/10 text-slate-300"
                              }`}
                            >
                              {r.piiBadge}
                            </span>
                          </div>
                          <p
                            className={`text-[10px] leading-snug mt-0.5 ${
                              isSelected ? "text-slate-600 font-normal" : "text-slate-400"
                            }`}
                          >
                            {r.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger / Close Button (< lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95"
            title="เปิดเมนูการนำทาง"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Matching user's reference image bottom-right) */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden bg-slate-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-5 mt-2 space-y-3 animate-in zoom-in-95 duration-200">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center pb-1 border-b border-white/10">
            โมดูลการทำงานหลัก (Menu)
          </div>

          <div className="space-y-1.5">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full py-2.5 px-4 rounded-2xl text-center text-xs font-bold transition flex items-center justify-center gap-2 ${
                pathname === "/"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Flame className="w-4 h-4 text-blue-500 fill-blue-500" />
              <span>หน้าแรก (Home Dashboard)</span>
            </Link>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full py-2.5 px-4 rounded-2xl text-center text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isActive
                      ? "bg-white text-slate-950 shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                  <span className={`text-[10px] font-normal ${isActive ? "text-slate-600" : "text-slate-400"}`}>
                    ({item.nameTh})
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="text-[11px]">InterviewX v2.0</span>
            <a
              href="http://localhost:4000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 font-semibold hover:underline flex items-center gap-1 text-[11px]"
            >
              Swagger API <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
