"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Crown,
  UserCheck,
  Bot,
  Eye,
  Flame,
  ShieldCheck,
  Sparkles,
  FileText,
  Sliders,
  Download,
  BarChart3,
} from "lucide-react";
import { useRole, UserRole } from "@/context/RoleContext";

interface NavItem {
  id: string;
  name: string;
  nameTh: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// 6 Core Clean Navigation Items (Text-only in desktop navbar for maximum calm & breathing room)
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
    name: "Vault",
    nameTh: "PII & PDPA",
    href: "/consent",
    icon: ShieldCheck,
  },
  {
    id: "datasets",
    name: "Datasets",
    nameTh: "ชุดข้อมูล AI",
    href: "/datasets",
    icon: Download,
  },
  {
    id: "analytics",
    name: "Analytics",
    nameTh: "ธรรมาภิบาล",
    href: "/analytics",
    icon: BarChart3,
  },
];

const ROLES: {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  piiBadge: string;
}[] = [
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
    <header className="sticky top-4 z-50 px-4 sm:px-6 w-full max-w-4xl mx-auto font-sans pointer-events-none transition-all duration-200">
      {/* Floating Dark Capsule Navbar */}
      <nav className="pointer-events-auto bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/25 rounded-full px-3 py-2 flex items-center justify-between gap-3">
        {/* Left: Flame Circular Logo (Home) */}
        <Link
          href="/"
          className="group shrink-0 flex items-center"
          title="InterviewX DataHub - หน้าแรก"
        >
          <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-blue-50 transition-all duration-200">
            <Flame className="w-5 h-5 text-blue-600 fill-blue-600 group-hover:text-indigo-600 group-hover:fill-indigo-600 transition-colors" />
          </div>
        </Link>

        {/* Center: Calm, Minimal Text-Only Navigation (Spacious, No icon clutter) */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white text-slate-950 font-bold shadow-xs scale-102"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                title={item.nameTh}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Single Clean Action Pill (Role Switcher & System Menu) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 transition-all duration-150 active:scale-95 cursor-pointer"
              title="สลับบทบาทสิทธิ์ (Role Switcher)"
            >
              {getRoleIcon(role)}
              <span>{roleInfo.label.split(" ")[0]}</span>
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
                    จำลองสิทธิ์การเข้าถึง PII Vault ตามหน้าที่
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
                        className={`w-full text-left p-2.5 rounded-2xl transition flex items-start gap-2.5 cursor-pointer ${
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

                {/* Quick Utilities in Dropdown Footer */}
                <div className="pt-2 mt-2 border-t border-white/10 px-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>API Docs:</span>
                  <a
                    href="http://localhost:4000/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
                  >
                    <span>Swagger UI</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger / Close Button (< md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
            title="เปิดเมนูการนำทาง"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Matching user's reference image bottom-right: clean, centered, calm) */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden bg-slate-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 mt-2 space-y-3 animate-in zoom-in-95 duration-200">
          <div className="space-y-1 text-center">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block w-full py-2.5 px-4 rounded-2xl text-sm font-semibold transition ${
                pathname === "/"
                  ? "bg-white text-slate-950 font-bold shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Home
            </Link>

            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full py-2.5 px-4 rounded-2xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-slate-950 font-bold shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="text-[11px]">InterviewX DataHub</span>
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
