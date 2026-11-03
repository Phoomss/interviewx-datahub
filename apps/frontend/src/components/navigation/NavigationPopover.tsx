"use client";

import React from "react";
import { NavigationCategory } from "@/config/navigation";
import { NavigationMenuGroup } from "./NavigationMenuGroup";

interface NavigationPopoverProps {
  category: NavigationCategory;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export function NavigationPopover({
  category,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: NavigationPopoverProps) {
  if (!isOpen) return null;

  const Icon = category.icon;

  return (
    <div
      role="menu"
      aria-label={category.flyoutTitle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50 w-80 sm:w-96 bg-slate-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40 rounded-3xl p-4 text-white animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Decorative arrow pointing to the icon above */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-slate-950 border-t border-l border-white/10" />

      {/* Flyout Header */}
      <div className="flex items-start gap-3 p-2 border-b border-white/10 mb-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-black text-white tracking-tight">
            {category.flyoutTitle}
          </h4>
          <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
            {category.flyoutDescription}
          </p>
        </div>
      </div>

      {/* Menu Groups */}
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {category.groups.map((group) => (
          <NavigationMenuGroup key={group.id} group={group} onSelect={onClose} />
        ))}
      </div>
    </div>
  );
}
