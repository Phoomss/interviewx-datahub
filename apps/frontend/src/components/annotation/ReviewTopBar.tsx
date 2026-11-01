"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Save, Sparkles, FileText } from "lucide-react";

interface ReviewTopBarProps {
  documentId: string;
  fileName: string;
  isSynthetic: boolean;
  status: string;
  isSubmitting: boolean;
  onApprove: () => void;
  onReject: () => void;
  onNeedsCorrection: () => void;
  onSaveDraft: () => void;
}

export function ReviewTopBar({
  documentId,
  fileName,
  isSynthetic,
  status,
  isSubmitting,
  onApprove,
  onReject,
  onNeedsCorrection,
  onSaveDraft,
}: ReviewTopBarProps) {
  const getStatusBadge = (st: string) => {
    switch (st) {
      case "APPROVED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">อนุมัติแล้ว (APPROVED)</span>;
      case "REJECTED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">ปฏิเสธ (REJECTED)</span>;
      case "IN_REVIEW":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">กำลังตรวจสอบ (IN_REVIEW)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">{st}</span>;
    }
  };

  return (
    <div className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-4">
        <Link
          href="/resumes"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          title="กลับหน้ารายการเรซูเม"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-slate-900 text-base flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              {fileName}
            </h1>
            {isSynthetic ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                <Sparkles className="w-3 h-3" /> Synthetic
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Real Authorized
              </span>
            )}
            {getStatusBadge(status)}
          </div>
          <div className="text-xs text-slate-400">Document ID: {documentId}</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" /> บันทึกร่าง
        </button>

        <button
          onClick={onNeedsCorrection}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition disabled:opacity-50"
        >
          <AlertTriangle className="w-3.5 h-3.5" /> ต้องแก้ไข
        </button>

        <button
          onClick={onReject}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-300 rounded-lg hover:bg-rose-100 transition disabled:opacity-50"
          title="คีย์ลัด: Cmd + J"
        >
          <XCircle className="w-3.5 h-3.5" /> ปฏิเสธ (Reject)
        </button>

        <button
          onClick={onApprove}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition disabled:opacity-50"
          title="คีย์ลัด: Cmd + Enter"
        >
          <CheckCircle2 className="w-4 h-4" /> อนุมัติข้อมูล (Approve & Next)
        </button>
      </div>
    </div>
  );
}
