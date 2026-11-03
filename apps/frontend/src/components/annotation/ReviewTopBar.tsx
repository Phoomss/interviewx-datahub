"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Save,
  Sparkles,
  FileText,
  ShieldCheck,
  Columns,
  Maximize2,
  Minimize2,
  ChevronRight,
  Eye,
  Check,
} from "lucide-react";

export type LayoutMode = "split" | "wide-editor" | "wide-doc" | "editor-only";

interface ReviewTopBarProps {
  documentId: string;
  fileName: string;
  candidateName?: string;
  isSynthetic: boolean;
  status: string;
  classification?: string;
  trainingEligibilityStatus?: string;
  layoutMode: LayoutMode;
  onChangeLayoutMode: (mode: LayoutMode) => void;
  isSubmitting: boolean;
  onApprove: () => void;
  onReject: () => void;
  onNeedsCorrection: () => void;
  onSaveDraft: () => void;
}

export function ReviewTopBar({
  documentId,
  fileName,
  candidateName,
  isSynthetic,
  status,
  classification = "RESUME",
  trainingEligibilityStatus,
  layoutMode,
  onChangeLayoutMode,
  isSubmitting,
  onApprove,
  onReject,
  onNeedsCorrection,
  onSaveDraft,
}: ReviewTopBarProps) {
  const getStatusBadge = (st: string) => {
    switch (st) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> อนุมัติแล้ว (Approved)
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> ปฏิเสธ (Rejected)
          </span>
        );
      case "NEEDS_CORRECTION":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> ต้องแก้ไข (Correction)
          </span>
        );
      case "PARSED":
      case "IN_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <Eye className="w-3 h-3 text-blue-600" /> รอตรวจสอบ (In Review)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            {st}
          </span>
        );
    }
  };

  const displayName = candidateName || fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "CV";

  return (
    <header className="h-14 sm:h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Back & Candidate Meta */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link
          href="/resumes"
          className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition shrink-0 group"
          title="กลับหน้ารายการเอกสาร"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
        </Link>

        {/* Candidate Avatar */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
          {initials}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <h1 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base truncate max-w-[130px] xs:max-w-[170px] sm:max-w-[240px] md:max-w-[320px]">
              {displayName}
            </h1>

            {/* Document Type Badge */}
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
              {classification}
            </span>

            {/* Synthetic vs Real Badge */}
            {isSynthetic ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                <Sparkles className="w-2.5 h-2.5" /> Synthetic
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                <ShieldCheck className="w-2.5 h-2.5 text-blue-600" /> Real Authorized
              </span>
            )}

            {getStatusBadge(status)}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
            <span className="truncate max-w-[120px] sm:max-w-[180px] text-slate-500 font-medium">{fileName}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline font-mono text-[10px] text-slate-400">{documentId}</span>
          </div>
        </div>
      </div>

      {/* Right: Layout Switcher & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Layout Mode Selector */}
        <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs">
          <button
            type="button"
            onClick={() => onChangeLayoutMode("split")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
              layoutMode === "split"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="แบ่งหน้าจอ 50/50"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>50:50</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeLayoutMode("wide-editor")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
              layoutMode === "wide-editor"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="ขยายพื้นที่แก้ไขข้อมูล (Editor 65%)"
          >
            <span>เน้นแก้ไข</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeLayoutMode("wide-doc")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
              layoutMode === "wide-doc"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="ขยายพื้นที่ดูเอกสาร (Document 65%)"
          >
            <span>เน้นเอกสาร</span>
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 hidden md:block" />

        {/* Save Draft Button (Desktop / Tablet) */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs disabled:opacity-50"
          title="บันทึกข้อมูลร่างไว้ก่อน (Save Draft)"
        >
          <Save className="w-3.5 h-3.5 text-slate-500" />
          <span>บันทึกร่าง</span>
        </button>

        {/* Needs Correction Button (Desktop / Tablet) */}
        <button
          type="button"
          onClick={onNeedsCorrection}
          disabled={isSubmitting}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition shadow-2xs disabled:opacity-50"
          title="ระบุว่าข้อมูลต้องแก้ไขเพิ่มเติม"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>ต้องแก้ไข</span>
        </button>

        {/* Reject Button (Desktop / Tablet) */}
        <button
          type="button"
          onClick={onReject}
          disabled={isSubmitting}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition shadow-2xs disabled:opacity-50 group"
          title="คีย์ลัด: ⌘ + J"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
          <span>ปฏิเสธ</span>
          <kbd className="hidden lg:inline text-[9px] font-mono px-1 py-0.2 bg-rose-100/80 text-rose-600 rounded">⌘J</kbd>
        </button>

        {/* Approve & Next Button (Desktop / Tablet) */}
        <button
          type="button"
          onClick={onApprove}
          disabled={isSubmitting}
          className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-sm hover:shadow-md transition disabled:opacity-50 group"
          title="คีย์ลัด: ⌘ + Enter"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
          <span>อนุมัติข้อมูล</span>
          <kbd className="hidden lg:inline text-[9px] font-mono px-1.5 py-0.5 bg-emerald-800/60 text-emerald-200 rounded-md">⌘↵</kbd>
        </button>
      </div>
    </header>
  );
}
