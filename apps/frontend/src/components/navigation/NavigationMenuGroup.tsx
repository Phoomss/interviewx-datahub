"use client";

import React from "react";
import { NavigationGroup } from "@/config/navigation";
import { NavigationMenuItem } from "./NavigationMenuItem";

interface NavigationMenuGroupProps {
  group: NavigationGroup;
  onSelect: () => void;
}

export function NavigationMenuGroup({ group, onSelect }: NavigationMenuGroupProps) {
  return (
    <div role="group" className="space-y-1">
      {group.title && (
        <div className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {group.title}
        </div>
      )}
      <div className="space-y-1">
        {group.items.map((item) => (
          <NavigationMenuItem key={item.id} item={item} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
