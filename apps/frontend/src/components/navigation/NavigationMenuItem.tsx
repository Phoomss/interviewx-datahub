"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Check } from "lucide-react";
import { NavigationSubItem } from "@/config/navigation";

interface NavigationMenuItemProps {
  item: NavigationSubItem;
  onSelect: () => void;
}

export function NavigationMenuItem({ item, onSelect }: NavigationMenuItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  // Determine if this exact sub-item route is active
  const isItemActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href.split("?")[0].split("#")[0] ||
        (item.href !== "/" && pathname?.startsWith(item.href.split("?")[0].split("#")[0]));

  const content = (
    <div
      role="menuitem"
      tabIndex={0}
      className={`group w-full p-2.5 rounded-2xl transition-all duration-150 flex items-start gap-3 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer ${
        isItemActive
          ? "bg-white/10 text-white border border-white/15 shadow-xs"
          : "hover:bg-white/8 text-slate-300 hover:text-white"
      }`}
    >
      {/* Icon Badge */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
          isItemActive
            ? "bg-blue-600 text-white shadow-xs"
            : "bg-white/5 border border-white/10 text-slate-300 group-hover:bg-white/10 group-hover:text-white"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>

      {/* Item Text & Description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`text-xs font-bold truncate ${
                isItemActive ? "text-white" : "text-slate-100 group-hover:text-white"
              }`}
            >
              {item.label}
            </span>
            {item.labelEn && (
              <span className="text-[10px] text-slate-400 font-normal truncate hidden sm:inline">
                ({item.labelEn})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {item.badge && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {item.badge}
              </span>
            )}
            {item.isExternal ? (
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-400" />
            ) : isItemActive ? (
              <Check className="w-3.5 h-3.5 text-blue-400" />
            ) : null}
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-snug mt-0.5 font-normal line-clamp-2 group-hover:text-slate-300">
          {item.description}
        </p>
      </div>
    </div>
  );

  if (item.isExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        onClick={onSelect}
        className="block"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={onSelect} className="block">
      {content}
    </Link>
  );
}
