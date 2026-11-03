"use client";

import React, { useState } from "react";
import { NavigationCategory } from "@/config/navigation";

interface NavigationTriggerProps {
  category: NavigationCategory;
  isActive: boolean;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function NavigationTrigger({
  category,
  isActive,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onKeyDown,
}: NavigationTriggerProps) {
  const Icon = category.icon;
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    onMouseEnter();
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    onMouseLeave();
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        type="button"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`${category.label} (${category.labelEn})`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer ${
          isOpen
            ? "bg-white text-slate-950 scale-105 shadow-md shadow-white/20"
            : isActive
            ? "bg-white/20 text-white border border-white/30 shadow-xs"
            : "text-slate-300 hover:text-white hover:bg-white/10"
        }`}
      >
        {/* Category Icon */}
        <Icon
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "scale-110" : ""
          }`}
        />

        {/* Active Route Indicator Dot */}
        {isActive && !isOpen && (
          <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        )}
      </button>

      {/* Category Tooltip (appears on hover when popover is closed) */}
      {showTooltip && !isOpen && (
        <div
          role="tooltip"
          className="absolute top-full mt-2 z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 text-slate-100 text-[11px] font-semibold shadow-lg border border-slate-700/80 animate-in fade-in zoom-in-95 duration-100"
        >
          <span>{category.label}</span>
          <span className="text-slate-400 ml-1 font-normal">({category.labelEn})</span>
          {/* Tooltip Arrow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-900 border-t border-l border-slate-700/80" />
        </div>
      )}
    </div>
  );
}
