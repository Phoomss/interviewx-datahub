import React from "react";
import {
  Sparkles,
  FileText,
  Sliders,
  ShieldCheck,
  Download,
  BarChart3,
  ExternalLink,
  Crown,
  UserCheck,
  Bot,
  Eye,
  LayoutDashboard,
  Layers,
  Database,
  Lock,
  Compass,
  Activity,
  FileCheck2,
  Workflow,
  CheckCircle2,
} from "lucide-react";
import { UserRole } from "@/context/RoleContext";

export interface NavigationSubItem {
  id: string;
  label: string;
  labelEn?: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isExternal?: boolean;
}

export interface NavigationGroup {
  id: string;
  title?: string;
  items: NavigationSubItem[];
}

export interface NavigationCategory {
  id: string;
  label: string;
  labelEn: string;
  tooltip: string;
  defaultHref: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  activeMatchPrefixes: string[];
  flyoutTitle: string;
  flyoutDescription: string;
  groups: NavigationGroup[];
}

export const NAVIGATION_CATEGORIES: NavigationCategory[] = [
  {
    id: "home",
    label: "หน้าแรก",
    labelEn: "Home",
    tooltip: "แดชบอร์ดภาพรวมระบบ (Overview Dashboard)",
    defaultHref: "/",
    icon: LayoutDashboard,
    accentColor: "from-blue-600 to-indigo-600",
    activeMatchPrefixes: ["/"],
    flyoutTitle: "InterviewX DataHub Overview",
    flyoutDescription: "ศูนย์รวมข้อมูลและสถิติภาพรวมของทั้งแพลตฟอร์ม",
    groups: [
      {
        id: "home-core",
        title: "ภาพรวมระบบ (Platform Overview)",
        items: [
          {
            id: "home-dashboard",
            label: "แดชบอร์ดหลัก",
            labelEn: "Home Dashboard",
            description: "สถิติเอกสาร ชุดข้อมูลที่พร้อมใช้งาน และสถานะบริการ",
            href: "/",
            icon: LayoutDashboard,
          },
        ],
      },
      {
        id: "home-quick",
        title: "บริการหลัก (Quick Portals)",
        items: [
          {
            id: "home-synthetic",
            label: "สร้างข้อมูลสังเคราะห์",
            labelEn: "Synthetic Studio",
            description: "ผลิตเรซูเมและบทสัมภาษณ์ 15 อุตสาหกรรม",
            href: "/synthetic",
            icon: Sparkles,
          },
          {
            id: "home-resumes",
            label: "คลังเอกสารจริง",
            labelEn: "Document Intelligence",
            description: "อัปโหลดและสกัดข้อมูล CV ด้วย AI",
            href: "/resumes",
            icon: FileText,
          },
        ],
      },
    ],
  },
  {
    id: "studio",
    label: "Data Studio",
    labelEn: "AI Data Studio",
    tooltip: "สตูดิโอสร้างและสกัดข้อมูล (AI Data Studio)",
    defaultHref: "/synthetic",
    icon: Sparkles,
    accentColor: "from-purple-600 to-indigo-600",
    activeMatchPrefixes: ["/synthetic", "/resumes"],
    flyoutTitle: "AI Data Studio",
    flyoutDescription: "ผลิตข้อมูลจำลองสากล และสกัดโครงสร้างเรซูเมจริงอย่างแม่นยำ",
    groups: [
      {
        id: "studio-synthetic",
        title: "สังเคราะห์ข้อมูล (Synthetic Generation)",
        items: [
          {
            id: "synthetic-studio",
            label: "สตูดิโอสังเคราะห์ข้อมูล",
            labelEn: "Synthetic Data Studio",
            description: "ผลิตเรซูเม, คำถาม-คำตอบ, Rubric, และ Portfolio ปลอด PII 100%",
            href: "/synthetic",
            icon: Sparkles,
            badge: "v2.0 Universal",
          },
        ],
      },
      {
        id: "studio-documents",
        title: "คลังเอกสาร & สกัด CV (Document Intelligence)",
        items: [
          {
            id: "document-intelligence",
            label: "คลังเอกสารอัจฉริยะ",
            labelEn: "Document Intelligence Vault",
            description: "จัดการเอกสาร PDF, DOCX รองรับ OCR และสกัดข้อมูล Candidate Profile",
            href: "/resumes",
            icon: FileText,
          },
          {
            id: "document-upload",
            label: "อัปโหลดเอกสารจำนวนมาก",
            labelEn: "Bulk Ingestion",
            description: "นำเข้าเรซูเมพร้อมกันสูงสุด 20 ไฟล์พร้อมผูก Consent ID",
            href: "/resumes?action=upload",
            icon: FileCheck2,
          },
        ],
      },
    ],
  },
  {
    id: "taxonomy",
    label: "Taxonomy",
    labelEn: "Taxonomy & Ontology",
    tooltip: "ผังความสัมพันธ์อุตสาหกรรม อาชีพ และทักษะ",
    defaultHref: "/taxonomy",
    icon: Sliders,
    accentColor: "from-indigo-600 to-blue-600",
    activeMatchPrefixes: ["/taxonomy"],
    flyoutTitle: "Universal Taxonomy & Ontology",
    flyoutDescription: "โครงสร้างความสัมพันธ์แบบ Many-to-Many ครอบคลุม 15 อุตสาหกรรม 80+ วิชาชีพ",
    groups: [
      {
        id: "taxonomy-structure",
        title: "โครงสร้างผังมาตรฐาน (Ontology Hierarchy)",
        items: [
          {
            id: "taxonomy-manager",
            label: "ผังอุตสาหกรรมและวิชาชีพ",
            labelEn: "Taxonomy Manager",
            description: "สำรวจ 15 อุตสาหกรรม พร้อม Many-to-Many Cross Mappings",
            href: "/taxonomy",
            icon: Sliders,
          },
          {
            id: "taxonomy-custom",
            label: "เพิ่มตำแหน่งงานใหม่",
            labelEn: "Custom Profession Catalog",
            description: "ขยายวิชาชีพเฉพาะทางและกำหนดทักษะแนะนำเพิ่มเติม",
            href: "/taxonomy#add-profession",
            icon: Workflow,
          },
        ],
      },
    ],
  },
  {
    id: "privacy",
    label: "PII Vault",
    labelEn: "Privacy & Consent Vault",
    tooltip: "ความปลอดภัย ข้อมูลส่วนบุคคล และ PDPA (PII Vault)",
    defaultHref: "/consent",
    icon: ShieldCheck,
    accentColor: "from-amber-600 to-rose-600",
    activeMatchPrefixes: ["/consent"],
    flyoutTitle: "Consent & PII Vault",
    flyoutDescription: "ระบบแยกเก็บข้อมูลระบุตัวบุคคล (AES-256) และบันทึกความยินยอมทางกฎหมาย",
    groups: [
      {
        id: "privacy-vault",
        title: "การคุ้มครองข้อมูลส่วนบุคคล (PDPA Protection)",
        items: [
          {
            id: "consent-records",
            label: "บันทึกความยินยอม PDPA",
            labelEn: "PDPA Consent Records",
            description: "ตรวจสอบขอบเขตวัตถุประสงค์ วันหมดอายุ และการเพิกถอนความยินยอม",
            href: "/consent",
            icon: ShieldCheck,
          },
          {
            id: "pii-vault-lookup",
            label: "สืบค้น PII Vault (เฉพาะ Admin)",
            labelEn: "Encrypted PII Vault",
            description: "ดูข้อมูลส่วนบุคคลที่ถอดรหัส พร้อมบันทึก Immutable Audit Trail",
            href: "/consent#vault",
            icon: Lock,
            badge: "RBAC Enforced",
          },
        ],
      },
    ],
  },
  {
    id: "datasets",
    label: "Datasets",
    labelEn: "Dataset Hub & Exports",
    tooltip: "ชุดข้อมูลเทรนโมเดลและการส่งออก (Dataset Hub)",
    defaultHref: "/datasets",
    icon: Database,
    accentColor: "from-emerald-600 to-teal-600",
    activeMatchPrefixes: ["/datasets"],
    flyoutTitle: "Dataset Hub & LLM Exports",
    flyoutDescription: "จัดชุดข้อมูลฝึกสอน LLM ปลอด PII 100% พร้อมแบ่ง Train/Val/Test",
    groups: [
      {
        id: "datasets-export",
        title: "ส่งออกชุดข้อมูลฝึกสอน (Training Exports)",
        items: [
          {
            id: "dataset-hub",
            label: "ส่งออกชุดข้อมูล LLM",
            labelEn: "Export Datasets",
            description: "ส่งออกฟอร์แมต Alpaca, ShareGPT, ChatML, JSONL, CSV และ Excel",
            href: "/datasets",
            icon: Database,
            badge: "Zero-PII Gate",
          },
          {
            id: "datasets-partitions",
            label: "การแบ่งชุดข้อมูล (Partitions)",
            labelEn: "Train / Val / Test Splits",
            description: "แบ่งสัดส่วน 80/10/10 ป้องกัน Data Leakage ระดับผู้สมัคร",
            href: "/datasets#splits",
            icon: Layers,
          },
        ],
      },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    labelEn: "Governance & Analytics",
    tooltip: "ธรรมาภิบาล สถิติ และ Audit Logs",
    defaultHref: "/analytics",
    icon: BarChart3,
    accentColor: "from-rose-600 to-purple-600",
    activeMatchPrefixes: ["/analytics"],
    flyoutTitle: "Governance & Audit Analytics",
    flyoutDescription: "ติดตามสุขภาพของข้อมูล ตรวจสอบการปฏิบัติตามกฎหมาย และ API Contracts",
    groups: [
      {
        id: "governance-analytics",
        title: "การตรวจสอบและธรรมาภิบาล (Governance)",
        items: [
          {
            id: "analytics-dashboard",
            label: "สถิติและธรรมาภิบาลข้อมูล",
            labelEn: "Governance Analytics",
            description: "การกระจายตัวของข้อมูล คุณภาพ และอัตราการอนุมัติเรซูเม",
            href: "/analytics",
            icon: BarChart3,
          },
          {
            id: "swagger-api",
            label: "เอกสาร Swagger REST API",
            labelEn: "Swagger Documentation",
            description: "ทดสอบและตรวจสอบ API Contract ทั้งหมดบน NestJS Backend",
            href: "http://localhost:4000/docs",
            icon: ExternalLink,
            isExternal: true,
          },
        ],
      },
    ],
  },
];

export interface RoleConfig {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  piiBadge: string;
  piiColor: string;
}

export const ROLE_CONFIGS: RoleConfig[] = [
  {
    id: "ADMIN",
    title: "Admin / DPO",
    subtitle: "เข้าถึงและถอดรหัส PII Vault ได้ (บันทึก Audit Log)",
    icon: Crown,
    piiBadge: "PII Unlocked",
    piiColor: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "ANNOTATOR",
    title: "Annotator",
    subtitle: "ตรวจสอบเรซูเม / สกัดข้อมูล (จำกัดสิทธิ์ PII 403)",
    icon: UserCheck,
    piiBadge: "PII Restricted",
    piiColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: "ML_ENGINEER",
    title: "ML Engineer",
    subtitle: "ฝึกสอนและส่งออกชุดข้อมูลปลอด PII",
    icon: Bot,
    piiBadge: "PII Isolated",
    piiColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: "VIEWER",
    title: "Auditor / Viewer",
    subtitle: "ดูสถิติและผัง Taxonomy เท่านั้น",
    icon: Eye,
    piiBadge: "Read Only",
    piiColor: "bg-slate-100 text-slate-700 border-slate-200",
  },
];
