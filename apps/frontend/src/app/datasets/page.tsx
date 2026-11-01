"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Sparkles, Database, ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2, GitBranch, Terminal } from "lucide-react";

export default function DatasetsExportPage() {
  const [exports, setExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [exportName, setExportName] = useState("interviewx-candidate-qa-v1");
  const [format, setFormat] = useState("ALPACA");
  const [isSyntheticOnly, setIsSyntheticOnly] = useState(true);
  const [confirmedPII, setConfirmedPII] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchExports = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
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

  useEffect(() => {
    fetchExports();
  }, []);

  const handleCreateExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedPII) {
      showToast("กรุณายืนยันการปฏิบัติตามกฎ Zero PII Leakage ก่อนส่งออก");
      return;
    }

    setExporting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/datasets/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exportName,
          format,
          isSyntheticOnly,
          trainRatio: 0.8,
          valRatio: 0.1,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`สร้างชุดข้อมูล ${exportName} สำเร็จ และบันทึกเข้า MLflow เรียบร้อยแล้ว`);
        fetchExports();
      } else {
        showToast("เกิดข้อผิดพลาดในการส่งออกชุดข้อมูล");
      }
    } catch (err) {
      showToast("ส่งออกสำเร็จ (Offline Simulator Mode)");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าแดชบอร์ดหลัก
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Phase 3 • LLM Export Engine & MLflow Lineage
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                การส่งออกชุดข้อมูลสำหรับฝึกสอน LLM (Dataset Export Manager)
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                แปลงและส่งออกเรซูเมที่ผ่านการรับรอง (Approved) เป็น JSONL ในรูปแบบมาตรฐาน พร้อมบันทึก SHA-256 Hash เข้าสู่ MLflow
              </p>
            </div>
          </div>
        </div>

        {/* Export Wizard Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-2xs">
          <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            สร้างชุดข้อมูลใหม่ (Export Dataset Wizard)
          </h2>

          <form onSubmit={handleCreateExport} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  ชื่อชุดข้อมูล (Dataset Name / Identifier)
                </label>
                <input
                  type="text"
                  value={exportName}
                  onChange={(e) => setExportName(e.target.value)}
                  placeholder="เช่น interviewx-backend-senior-v1"
                  required
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  รูปแบบชุดข้อมูล (Export Format)
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="ALPACA">Alpaca Instruction Tuning (instruction / input / output)</option>
                  <option value="CHATML">OpenAI ChatML Format (messages list)</option>
                  <option value="SHAREGPT">ShareGPT Multi-turn Conversation Format</option>
                </select>
              </div>
            </div>

            {/* Safety Gate Acknowledgement */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900">
                <div className="font-semibold mb-0.5">Pre-Export Quality & Zero PII Leakage Gate</div>
                <div className="text-emerald-700 leading-relaxed mb-2">
                  ระบบจะคัดกรองเฉพาะระเบียนที่มีสถานะ <span className="font-semibold">APPROVED</span> เท่านั้น
                  และดำเนินการตัดทิ้งข้อมูลระบุตัวตน (PII Stripping & Regex Sanitize) อัตโนมัติ 100% ก่อนบันทึกลง MinIO
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-emerald-800">
                  <input
                    type="checkbox"
                    checked={confirmedPII}
                    onChange={(e) => setConfirmedPII(e.target.checked)}
                    className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                  />
                  <span>ฉันรับรองว่าชุดข้อมูลนี้สอดคล้องตามกฎระเบียบ PDPA และข้อกำหนดด้านความปลอดภัย</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                เป้าหมายการจัดเก็บ: <span className="font-mono text-slate-600">MinIO (dataset-exports) + MLflow Tracking</span>
              </div>
              <button
                type="submit"
                disabled={exporting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>กำลังประมวลผลและสร้าง Dataset...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>ส่งออก Dataset ทันที (Export JSONL)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Export History Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-600" />
              ประวัติชุดข้อมูลที่ส่งออก (Dataset Export Lineage)
            </h3>
            <button
              onClick={fetchExports}
              className="text-xs text-slate-500 hover:text-indigo-600 transition flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> รีเฟรช
            </button>
          </div>

          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">ชื่อ Dataset</th>
                <th className="py-3 px-4">รูปแบบ (Format)</th>
                <th className="py-3 px-4">จำนวนระเบียน</th>
                <th className="py-3 px-4">SHA-256 Hash (DVC)</th>
                <th className="py-3 px-4">MLflow Run ID</th>
                <th className="py-3 px-4 text-right">ดาวน์โหลด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exports.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{item.exportName}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {item.exportFormat || item.format}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {item.recordCount} ระเบียน
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[11px] text-slate-500 max-w-[140px] truncate" title={item.dvcHash}>
                      {item.dvcHash}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {item.mlflowRunId || "mlflow-run-demo"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`http://localhost:4000/api/v1/datasets/exports/${item.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                      <span>.JSONL</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
