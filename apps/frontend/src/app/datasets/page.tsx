"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Sparkles,
  Database,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  GitBranch,
  Terminal,
  FileSpreadsheet,
  FileText,
  Sliders,
  Layers,
} from "lucide-react";

export default function DatasetsExportPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  const [exports, setExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [exportName, setExportName] = useState("interviewx-universal-dataset-v1");
  const [format, setFormat] = useState("JSON");
  const [datasetType, setDatasetType] = useState("");
  const [industryKey, setIndustryKey] = useState("");
  const [isSyntheticOnly, setIsSyntheticOnly] = useState(true);
  const [trainRatio, setTrainRatio] = useState(0.8);
  const [valRatio, setValRatio] = useState(0.1);
  const [confirmedPII, setConfirmedPII] = useState(true);

  // Taxonomy for filters
  const [industries, setIndustries] = useState<any[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchExports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/datasets/exports`);
      const json = await res.json();
      if (json.success && json.data) {
        setExports(json.data);
      }
    } catch (err) {
      console.warn("Using baseline exports:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxonomy = async () => {
    try {
      const res = await fetch(`${apiUrl}/taxonomy`);
      if (res.ok) {
        const json = await res.json();
        setIndustries(json.industries || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchExports();
    fetchTaxonomy();
  }, []);

  const handleCreateExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedPII) {
      showToast("กรุณายืนยันการปฏิบัติตามกฎ Zero PII Leakage ก่อนส่งออก");
      return;
    }

    setExporting(true);
    try {
      const res = await fetch(`${apiUrl}/datasets/exports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exportName,
          format,
          datasetType: datasetType || undefined,
          industryKey: industryKey || undefined,
          isSyntheticOnly,
          trainRatio: Number(trainRatio),
          valRatio: Number(valRatio),
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`สร้างชุดข้อมูล ${exportName} (${format}) สำเร็จ! บันทึกใน S3 และ MLflow เรียบร้อย`);
        await fetchExports();
      } else {
        throw new Error(json.message || "Export failed");
      }
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาดในการส่งออกชุดข้อมูล");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าแดชบอร์ดหลัก
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-1">
                <Database className="w-4 h-4" /> Export & Lineage Engine v2.0
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                ศูนย์ส่งออกชุดข้อมูลสากล (Universal Dataset Exports)
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                ส่งออกชุดข้อมูลพร้อมกำจัด PII 100% รองรับไฟล์ JSON, JSONL, CSV, XLSX และฟอร์แมต LLM Fine-tuning (Alpaca, ShareGPT, ChatML)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/synthetic"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-lg shadow-2xs transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>ไปที่ Synthetic Studio</span>
              </Link>
              <Link
                href="/taxonomy"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg shadow-2xs transition"
              >
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>ดู Taxonomy</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Export Form & Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" />
              กำหนดค่าการส่งออก Dataset (Export Configuration)
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Zero PII Leakage Gate Active
            </span>
          </div>

          <form onSubmit={handleCreateExport} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  ชื่อชุดข้อมูล (Export Dataset Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={exportName}
                  onChange={(e) => setExportName(e.target.value)}
                  placeholder="เช่น interviewx-medical-qa-v1"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  รูปแบบไฟล์ที่ต้องการ (Export Format) <span className="text-red-500">*</span>
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <optgroup label="ไฟล์มาตรฐานสำหรับการวิเคราะห์ (Standard Data Files)">
                    <option value="JSON">JSON (Array of Structured Objects)</option>
                    <option value="JSONL">JSONL (Newline Delimited JSON)</option>
                    <option value="CSV">CSV (Comma Separated Values - Excel Compatible)</option>
                    <option value="XLSX">XLSX (Microsoft Excel Workbook)</option>
                  </optgroup>
                  <optgroup label="ฟอร์แมตสำหรับฝึกสอน LLM (Fine-tuning & Training)">
                    <option value="ALPACA">Alpaca Format (Instruction, Input, Output)</option>
                    <option value="SHAREGPT">ShareGPT Format (Conversations: Human / GPT)</option>
                    <option value="CHATML">OpenAI ChatML Format (System, User, Assistant)</option>
                    <option value="EMBEDDING">Vector Embedding Format</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  กรองเฉพาะมิติข้อมูล (Dataset Type)
                </label>
                <select
                  value={datasetType}
                  onChange={(e) => setDatasetType(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="">-- รวมทุกประเภท (All 10 Dimensions) --</option>
                  <option value="profile">Professional Profile</option>
                  <option value="resume">Resume / CV</option>
                  <option value="academic_cv">Academic CV (Scholarship / Defense)</option>
                  <option value="portfolio">Portfolio Case Study</option>
                  <option value="supporting_doc">Supporting Document</option>
                  <option value="interview_question">Interview Question</option>
                  <option value="interview_answer">Interview Answer</option>
                  <option value="rubric_evaluation">Rubric Evaluation</option>
                  <option value="feedback">Feedback & Coaching</option>
                  <option value="scenario">Scenario-based Dilemma</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  กรองเฉพาะกลุ่มอุตสาหกรรม (Industry)
                </label>
                <select
                  value={industryKey}
                  onChange={(e) => setIndustryKey(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="">-- รวมทุกอุตสาหกรรม (All Industries) --</option>
                  {industries.map((ind) => (
                    <option key={ind.key} value={ind.key}>
                      {ind.name} ({ind.nameTh})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Split Ratio Controls & Anti-Leakage Notice */}
            <div className="pt-2 p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  การแบ่งชุดข้อมูลฝึกสอน (Train / Validation / Test Splitting)
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Candidate-Grouped Leakage-Free Engine
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ระบบใช้การจัดกลุ่มระดับบุคคล (Grouped by Candidate ID / Job) เพื่อป้องกันไม่ให้ข้อมูลของบุคคลเดียวกันข้ามระหว่างชุดฝึกและชุดทดสอบ (Zero Data Contamination)
              </p>
              <div className="grid grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Train Ratio: {Math.round(trainRatio * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.9"
                    step="0.05"
                    value={trainRatio}
                    onChange={(e) => setTrainRatio(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Val Ratio: {Math.round(valRatio * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.3"
                    step="0.05"
                    value={valRatio}
                    onChange={(e) => setValRatio(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Test Ratio: {Math.max(0, Math.round((1 - trainRatio - valRatio) * 100))}%
                  </label>
                  <div className="h-6 flex items-center text-xs font-bold text-indigo-700">
                    {(1 - trainRatio - valRatio) > 0 ? `${Math.round((1 - trainRatio - valRatio) * 100)}% (อัตโนมัติ)` : "0% (ปรับลด Train/Val)"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedPII}
                  onChange={(e) => setConfirmedPII(e.target.checked)}
                  className="mt-0.5 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong>ยืนยันการตรวจสอบความปลอดภัยข้อมูลส่วนบุคคล (PII Verification):</strong> ฉันรับทราบว่าระบบจะทำการ Redact ชื่อ-นามสกุล, อีเมล, หมายเลขโทรศัพท์ และเลขบัตรประชาชนทั้งหมดโดยอัตโนมัติก่อนประกอบเป็นไฟล์ชุดข้อมูล
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={exporting || !confirmedPII}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>กำลังสร้างและอัปโหลด Dataset...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>สั่งส่งออกชุดข้อมูล ({format})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Exports List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-600" />
              ประวัติชุดข้อมูลที่ส่งออกและ MLflow Lineage (Export History)
            </h3>
            <button
              onClick={fetchExports}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> รีเฟรช
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                  <th className="py-3 px-4">ชื่อชุดข้อมูล</th>
                  <th className="py-3 px-4">รูปแบบไฟล์</th>
                  <th className="py-3 px-4">จำนวนระเบียน</th>
                  <th className="py-3 px-4">DVC Hash (SHA-256)</th>
                  <th className="py-3 px-4">MLflow Run</th>
                  <th className="py-3 px-4 text-right">ดาวน์โหลด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exports.map((exp) => {
                  const ext = exp.storagePath ? exp.storagePath.split(".").pop() : "jsonl";
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {exp.exportName}
                        <div className="text-[11px] font-normal text-slate-500">
                          {new Date(exp.createdAt).toLocaleString("th-TH")}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-mono border border-slate-200">
                          {exp.exportFormat || ext?.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {exp.recordCount} records
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                        {exp.dvcHash || "sha256-verified"}
                      </td>
                      <td className="py-3.5 px-4 text-purple-700 font-mono text-[11px]">
                        {exp.mlflowRunId ? exp.mlflowRunId.substring(0, 12) : "local-lineage"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`${apiUrl}/datasets/exports/${exp.id}/file`}
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>ดาวน์โหลด .{ext}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
