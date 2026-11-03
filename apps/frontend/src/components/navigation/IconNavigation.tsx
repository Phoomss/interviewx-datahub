"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  Flame,
} from "lucide-react";
import {
  NAVIGATION_CATEGORIES,
  ROLE_CONFIGS,
  NavigationCategory,
} from "@/config/navigation";
import { NavigationTrigger } from "./NavigationTrigger";
import { NavigationPopover } from "./NavigationPopover";
import { useRole, UserRole } from "@/context/RoleContext";

export function IconNavigation() {
  const pathname = usePathname();
  const { role, setRole, roleInfo } = useRole();

  // Active hover/popover state
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Timers to prevent flickering & accidental triggers
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setOpenCategoryId(null);
    setShowRoleDropdown(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle global click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setShowRoleDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle global Escape key to close open menus
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenCategoryId(null);
        setShowRoleDropdown(false);
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hide on full-height review studio
  if (pathname && pathname.includes("/review")) {
    return null;
  }

  // Determine active category based on current pathname
  const isCategoryActive = (category: NavigationCategory): boolean => {
    if (category.id === "home") {
      return pathname === "/";
    }
    return category.activeMatchPrefixes.some(
      (prefix) => prefix !== "/" && pathname?.startsWith(prefix)
    );
  };

  // Hover Handlers with debounce buffer (Zero-flicker)
  const handleTriggerMouseEnter = (categoryId: string) => {
    // Clear any pending close timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    // Small delay to prevent accidental activation when swinging pointer
    openTimerRef.current = setTimeout(() => {
      setOpenCategoryId(categoryId);
      setShowRoleDropdown(false);
    }, 70);
  };

  const handleTriggerMouseLeave = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    // Buffer window: wait 140ms before closing so user can move pointer into popover
    closeTimerRef.current = setTimeout(() => {
      setOpenCategoryId(null);
    }, 140);
  };

  const handlePopoverMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenCategoryId(null);
    }, 140);
  };

  const handleTriggerClick = (category: NavigationCategory) => {
    if (openCategoryId === category.id) {
      setOpenCategoryId(null);
    } else {
      setOpenCategoryId(category.id);
      setShowRoleDropdown(false);
    }
  };

  const getRoleIcon = (r: UserRole) => {
    const config = ROLE_CONFIGS.find((rc) => rc.id === r);
    if (!config) return null;
    const Icon = config.icon;
    return <Icon className="w-3.5 h-3.5" />;
  };

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6 w-full max-w-4xl mx-auto font-sans pointer-events-none transition-all duration-200">
      {/* Floating Dark Capsule Navbar */}
      <nav className="pointer-events-auto bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/30 rounded-full px-2.5 sm:px-3 py-1.5 flex items-center justify-between gap-3">
        {/* Left: Flame Website Logo (Direct link to Home) */}
        <Link
          href="/"
          className="group shrink-0 flex items-center pl-1"
          title="InterviewX DataHub - หน้าแรก"
          aria-label="InterviewX DataHub Home"
        >
          <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-blue-50 transition-all duration-200">
            <Flame className="w-5 h-5 text-blue-600 fill-blue-600 group-hover:text-indigo-600 group-hover:fill-indigo-600 transition-colors" />
          </div>
        </Link>

        {/* Center: Modern Icon-Based Navigation with Hover Flyout Popovers (Desktop >= md) */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {NAVIGATION_CATEGORIES.map((category) => {
            const isActive = isCategoryActive(category);
            const isOpen = openCategoryId === category.id;

            return (
              <div key={category.id} className="relative">
                <NavigationTrigger
                  category={category}
                  isActive={isActive}
                  isOpen={isOpen}
                  onMouseEnter={() => handleTriggerMouseEnter(category.id)}
                  onMouseLeave={handleTriggerMouseLeave}
                  onClick={() => handleTriggerClick(category)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleTriggerClick(category);
                    }
                  }}
                />

                {/* Floating Navigation Popover Menu */}
                <NavigationPopover
                  category={category}
                  isOpen={isOpen}
                  onMouseEnter={handlePopoverMouseEnter}
                  onMouseLeave={handlePopoverMouseLeave}
                  onClose={() => setOpenCategoryId(null)}
                />
              </div>
            );
          })}
        </div>

        {/* Right: Role Switcher & System Profile Pill */}
        <div className="flex items-center gap-2 shrink-0 pr-1">
          <div className="relative" ref={roleDropdownRef}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={showRoleDropdown}
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setOpenCategoryId(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 transition-all duration-150 active:scale-95 cursor-pointer"
              title="สลับบทบาทสิทธิ์ (Role Switcher & Clearance)"
            >
              {getRoleIcon(role)}
              <span className="truncate max-w-[85px] sm:max-w-none">
                {roleInfo.label.split(" ")[0]}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${
                  showRoleDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Role & Permissions Popover Panel */}
            {showRoleDropdown && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-72 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 shadow-2xl z-50 text-white animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-white/10 mb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    สลับบทบาทสิทธิ์ (Role Switcher)
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
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

                {/* API Docs & Status Footer */}
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

          {/* Mobile Menu Toggle Button (< md) */}
          <button
            type="button"
            aria-label="Toggle Navigation Drawer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Responsive Touch Menu) */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden bg-slate-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-5 mt-2 space-y-4 animate-in zoom-in-95 duration-200 text-white max-h-[80vh] overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center pb-2 border-b border-white/10">
            เมนูการนำทาง (Navigation Categories)
          </div>

          <div className="space-y-3">
            {NAVIGATION_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = isCategoryActive(category);

              return (
                <div
                  key={category.id}
                  className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{category.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({category.labelEn})
                    </span>
                  </div>

                  <div className="space-y-1 pl-2">
                    {category.groups.flatMap((g) => g.items).map((item) => {
                      const SubIcon = item.icon;
                      const isSubActive = pathname === item.href;

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs transition ${
                            isSubActive
                              ? "bg-white text-slate-950 font-bold"
                              : "text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <SubIcon className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
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
