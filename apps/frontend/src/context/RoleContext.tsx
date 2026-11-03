"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "ADMIN" | "ANNOTATOR" | "ML_ENGINEER" | "VIEWER";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  roleInfo: {
    label: string;
    labelTh: string;
    description: string;
    canAccessPii: boolean;
    color: string;
    bgBadge: string;
  };
}

const ROLE_DEFINITIONS: Record<
  UserRole,
  { label: string; labelTh: string; description: string; canAccessPii: boolean; color: string; bgBadge: string }
> = {
  ADMIN: {
    label: "Admin / DPO",
    labelTh: "ผู้ดูแลระบบ / DPO",
    description: "มีสิทธิ์เต็มในการตรวจสอบและถอดรหัส PII Vault (บันทึก Audit Log ทุกครั้ง)",
    canAccessPii: true,
    color: "text-purple-700 border-purple-300",
    bgBadge: "bg-purple-100 text-purple-800 border-purple-200",
  },
  ANNOTATOR: {
    label: "Annotator",
    labelTh: "ผู้ตรวจสอบเอกสาร",
    description: "มีสิทธิ์ตรวจสอบข้อมูลสกัดและอนุมัติเรซูเม แต่ถูกจำกัดการเข้าถึง PII Vault (403)",
    canAccessPii: false,
    color: "text-indigo-700 border-indigo-300",
    bgBadge: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  ML_ENGINEER: {
    label: "ML Engineer",
    labelTh: "วิศวกร AI & Data",
    description: "มีสิทธิ์สร้างชุดข้อมูลและส่งออก Dataset สำหรับเทรน LLM (เข้าถึงเฉพาะข้อมูลปลอด PII)",
    canAccessPii: false,
    color: "text-emerald-700 border-emerald-300",
    bgBadge: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  VIEWER: {
    label: "Viewer / Auditor",
    labelTh: "ผู้ตรวจสอบภายนอก",
    description: "สิทธิ์ดูแดชบอร์ด รายงานสถิติ และผัง Taxonomy เท่านั้น",
    canAccessPii: false,
    color: "text-slate-700 border-slate-300",
    bgBadge: "bg-slate-100 text-slate-800 border-slate-200",
  },
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("ADMIN");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("interviewx_active_role") as UserRole;
      if (saved && ROLE_DEFINITIONS[saved]) {
        setRoleState(saved);
      }
    } catch {
      // fallback
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("interviewx_active_role", newRole);
    } catch {
      // ignore
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        roleInfo: ROLE_DEFINITIONS[role],
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
