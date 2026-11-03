"use client";

import React from "react";
import { RoleProvider } from "@/context/RoleContext";
import { GlobalNavbar } from "@/components/navigation/GlobalNavbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <GlobalNavbar />
      <main>{children}</main>
    </RoleProvider>
  );
}
