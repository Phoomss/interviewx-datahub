"use client";

import React, { useState } from "react";
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
  Lock,
  Unlock,
  UserCheck,
  Crown,
  Eye,
  Bot,
} from "lucide-react";
import { useRole, UserRole } from "@/context/RoleContext";

const NAV_ITEMS = [
  {
    name: "สตูดิโอสังเคราะห์",
    nameEn: "Synthetic Studio",
    href: "/synthetic",
    icon: Sparkles,
    accent: "text-purple-600",
  },
  {
    name: "คลังเอกสารอัจฉริยะ",
    nameEn: "Document Intelligence",
    href: "/resumes",
    icon: FileText,
    accent: "text-blue-600",
  },
  {
    name: "ผัง Taxonomy",
    nameEn: "Taxonomy Manager",
    href: "/taxonomy",
    icon: Sliders,
    accent: "text-indigo-600",
  },
  {
    name: "Consent & PII Vault",
    nameEn: "Privacy & Vault",
    href: "/consent",
    icon: ShieldCheck,
    accent: "text-amber-600",
  },
  {
    name: "ส่งออก Datasets",
    nameEn: "Dataset Exports",
    href: "/datasets",
    icon: Download,
    accent: "text-emerald-600",
  },
  {
    name: "Governance Analytics",
    nameEn: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    accent: "text-rose-600",
  },
];

const ROLES: { id: UserRole; title: string; subtitle: string; icon: any; piiBadge: string }[] = [
  {
    id: "ADMIN",
    title: "Admin / DPO",
    subtitle: "เข้าถึงและถอดรหัส PII Vault ได้ (บันทึก Audit Log)",
    icon: Crown,
    piiBadge: "PII Unlocked",
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

  // If on Annotation Studio review page, don't show the global header to keep the full-height workspace
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
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-2xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Version */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-purple-200" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  InterviewX
                </span>
                <span className="font-bold text-base text-purple-600 ml-1">
                  DataHub
                </span>
              </div>
            </Link>
            <span className="hidden xl:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              v2.0 Universal
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-bold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? item.accent : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Controls: Role Switcher & API Docs & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {/* API Docs Button */}
            <a
              href="http://localhost:4000/docs"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition shadow-2xs"
              title="เปิด Swagger API Documentation"
            >
              <span>Swagger</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Interactive Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition shadow-2xs ${roleInfo.bgBadge}`}
                title="คลิกเพื่อสลับบทบาทสิทธิ์ (Role Switcher)"
              >
                {getRoleIcon(role)}
                <span className="hidden sm:inline">{roleInfo.label}</span>
                <span className="sm:hidden">{role}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showRoleDropdown ? "rotate-180" : ""}`} />
              </button>

              {/* Role Dropdown Panel */}
              {showRoleDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRoleDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        สลับบทบาทผู้ใช้งาน (Role Switcher)
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        จำลองสิทธิ์ความปลอดภัยและระดับการเข้าถึง PII Vault
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
                            className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 ${
                              isSelected
                                ? "bg-slate-100 text-slate-900 border border-slate-200"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                              <Icon className="w-4 h-4 text-slate-700" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-slate-900">
                                  {r.title}
                                </span>
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                                    r.id === "ADMIN"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {r.piiBadge}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                {r.subtitle}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              title="เปิดเมนูการนำทาง"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (< lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            โมดูลการทำงานหลัก (Modules)
          </div>
          <div className="grid grid-cols-1 gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? item.accent : "text-slate-400"}`} />
                  <div>
                    <div className="text-xs">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.nameEn}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2">
            <span className="font-medium">InterviewX DataHub v2.0 Universal</span>
            <a
              href="http://localhost:4000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              API Swagger <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
