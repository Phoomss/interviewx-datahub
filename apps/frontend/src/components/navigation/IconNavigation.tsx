"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  LayoutGrid,
  Check,
  Copy,
  ChevronRight,
} from "lucide-react";
import { ROLE_CONFIGS } from "@/config/navigation";
import { FloatingNavigationMenu, SYSTEM_MODULES } from "./FloatingNavigationMenu";
import { InterviewXLogo } from "@/components/brand/InterviewXLogo";
import { useRole, UserRole } from "@/context/RoleContext";

export function IconNavigation() {
  const pathname = usePathname();
  const { role, setRole, roleInfo } = useRole();

  // Navigation and popover states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Timers to guarantee zero-flickering on mouse transitions
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowRoleDropdown(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Global click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setShowRoleDropdown(false);
      }
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Escape key listener
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setShowRoleDropdown(false);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Clean up copy timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Hide on full-height review studio
  if (pathname && pathname.includes("/review")) {
    return null;
  }

  // Determine current active page label
  const getActivePageLabel = () => {
    if (!pathname || pathname === "/") return "หน้าหลัก";
    if (pathname.startsWith("/synthetic")) return "สังเคราะห์ข้อมูล";
    if (pathname.startsWith("/resumes")) return "คลังเรซูเม่ & CV";
    if (pathname.startsWith("/taxonomy")) return "ผังอุตสาหกรรม";
    if (pathname.startsWith("/consent")) return "PII Vault";
    if (pathname.startsWith("/datasets")) return "ส่งออกชุดข้อมูล";
    if (pathname.startsWith("/analytics")) return "ธรรมาภิบาล";
    return "โมดูลระบบ";
  };

  // Hover Handlers with debounce buffer (Zero-flicker)
  const handleMenuMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    openTimerRef.current = setTimeout(() => {
      setIsMenuOpen(true);
      setShowRoleDropdown(false);
    }, 70);
  };

  const handleMenuMouseLeave = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setShowRoleDropdown(false);
  };

  // Copy API endpoint or contact simulation (inspired by reference design's "Copied ✅")
  const handleCopyEndpoint = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText("http://localhost:4000/api/v1");
    }
    setCopiedFeedback(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => {
      setCopiedFeedback(false);
    }, 2000);
  };

  const getRoleIcon = (r: UserRole) => {
    const config = ROLE_CONFIGS.find((rc) => rc.id === r);
    if (!config) return null;
    const Icon = config.icon;
    return <Icon className="w-3.5 h-3.5" />;
  };

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 w-full max-w-4xl mx-auto font-sans pointer-events-none transition-all duration-200">
      {/* Floating Light Capsule Navbar */}
      <nav className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-full px-3 py-2 flex items-center justify-between gap-3 text-slate-900">
        {/* Left: Brand InterviewX Logo & Name */}
        <Link
          href="/"
          className="group shrink-0 flex items-center pl-1"
          title="InterviewX DataHub - หน้าแรก"
          aria-label="InterviewX DataHub Home"
        >
          <InterviewXLogo size="md" showText={true} />
        </Link>

        {/* Center: SINGLE MAIN MENU TRIGGER (Hover to reveal all modules together) */}
        <div
          ref={menuContainerRef}
          className="relative"
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            onClick={handleMenuToggle}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isMenuOpen
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-102 border border-slate-900"
                : "bg-slate-100/90 text-slate-800 hover:bg-slate-200/80 border border-slate-200/70"
            }`}
          >
            <LayoutGrid
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isMenuOpen ? "rotate-90 text-blue-400" : "text-blue-600"
              }`}
            />
            <span>เมนูระบบทั้งหมด (All Modules)</span>
            <span
              className={`hidden md:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                isMenuOpen
                  ? "bg-slate-800 text-slate-200"
                  : "bg-white text-slate-700 border border-slate-200/50 shadow-xs"
              }`}
            >
              {getActivePageLabel()}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isMenuOpen ? "rotate-180 text-slate-300" : "text-slate-500"
              }`}
            />
          </button>

          {/* Unified Floating Menu Panel Showing ALL Modules */}
          <FloatingNavigationMenu
            isOpen={isMenuOpen}
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>

        {/* Right: Signature Pill Button (Role & Action Feedback) */}
        <div className="flex items-center gap-2 shrink-0 pr-1">
          <div className="relative" ref={roleDropdownRef}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={showRoleDropdown}
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setIsMenuOpen(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer shadow-md ${
                copiedFeedback
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs"
                  : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/15"
              }`}
              title="สลับบทบาทสิทธิ์ (Role Switcher & Clearance)"
            >
              {copiedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700 font-bold">Copied ✅</span>
                </>
              ) : (
                <>
                  {getRoleIcon(role)}
                  <span className="truncate max-w-[85px] sm:max-w-none">
                    {roleInfo.label.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                      showRoleDropdown ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {/* Role & Permissions Popover Panel */}
            {showRoleDropdown && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-72 bg-white/98 backdrop-blur-2xl border border-slate-200 shadow-2xl shadow-slate-900/15 rounded-[28px] p-3.5 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-slate-100"
              >
                <div className="px-2.5 py-2 border-b border-slate-100 mb-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    สลับบทบาทสิทธิ์ (Role Switcher)
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    จำลองสิทธิ์การเข้าถึง PII Vault ตามหน้าที่
                  </div>
                </div>

                <div className="space-y-1">
                  {ROLE_CONFIGS.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;

                    return (
                      <button
                        key={r.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setRole(r.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-2xl transition flex items-start gap-2.5 cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 text-white font-bold shadow-xs"
                            : "hover:bg-slate-50 text-slate-700 hover:text-slate-950"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-slate-800 text-white"
                              : "bg-slate-100 border border-slate-200/80 text-slate-700"
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
                                  ? "bg-slate-800 text-slate-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200/60"
                              }`}
                            >
                              {r.piiBadge}
                            </span>
                          </div>
                          <p
                            className={`text-[10px] leading-snug mt-0.5 ${
                              isSelected ? "text-slate-300 font-normal" : "text-slate-500"
                            }`}
                          >
                            {r.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* API Endpoint Copy & Swagger Link */}
                <div className="pt-2.5 mt-2 border-t border-slate-100 px-2 flex items-center justify-between text-[11px] text-slate-500">
                  <button
                    type="button"
                    onClick={handleCopyEndpoint}
                    className="text-slate-600 hover:text-slate-950 inline-flex items-center gap-1 transition cursor-pointer font-medium"
                    title="คัดลอก Endpoint API"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedFeedback ? "Copied ✅" : "คัดลอก API URL"}</span>
                  </button>

                  <a
                    href="http://localhost:4000/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition"
                  >
                    <span>Swagger UI</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button (< md) */}
          <button
            type="button"
            aria-label="Toggle Navigation Drawer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer border border-slate-200/60"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Responsive Touch Menu Showing ALL Modules in Light Theme) */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden bg-white/98 backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-[28px] p-4 mt-2 space-y-2 animate-in zoom-in-95 duration-200 text-slate-900 max-h-[80vh] overflow-y-auto ring-1 ring-slate-100">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              ผังระบบและโมดูลทั้งหมด (All Modules)
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {SYSTEM_MODULES.map((mod) => {
              const Icon = mod.icon;
              const isCurrent = pathname === mod.href;

              return (
                <Link
                  key={mod.id}
                  href={mod.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-semibold transition ${
                    isCurrent
                      ? "bg-blue-50 text-blue-950 font-bold ring-1 ring-blue-200"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${mod.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{mod.title}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{mod.subtitle}</div>
                    </div>
                  </div>
                  {isCurrent ? (
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick API link */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] px-2 text-slate-500">
            <span>API Docs:</span>
            <a
              href="http://localhost:4000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <span>Swagger UI (Port 4000)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
