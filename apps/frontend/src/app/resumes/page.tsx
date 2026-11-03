"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Sparkles,
  CheckCircle2,
  Upload,
  Eye,
  ShieldCheck,
  ArrowRight,
  X,
  Plus,
  Check,
  Trash2,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowLeft,
  LayoutGrid,
  List,
  Clock,
  AlertCircle,
  FileCheck2,
  Code2,
  Download,
  Copy,
  ChevronRight,
  Sliders,
} from "lucide-react";

export default function ResumesListPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSource, setFilterSource] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Upload modal states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadType, setUploadType] = useState<"SYNTHETIC" | "REAL_AUTHORIZED">("SYNTHETIC");
  const [uploadConsentId, setUploadConsentId] = useState("consent-demo-9841");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Quick inspect drawer / modal state
  const [inspectDoc, setInspectDoc] = useState<any | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load documents from backend
  const loadDocs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/documents`);
      const json = await res.json();

      let serverDocs: any[] = [];
      if (json.success && Array.isArray(json.data)) {
        serverDocs = json.data;
      }
      setDocuments(serverDocs);
      localStorage.setItem("interviewx_resumes_cache", JSON.stringify(serverDocs));
    } catch (err) {
      console.warn("API offline, reading from localStorage:", err);
      const localSaved = localStorage.getItem("interviewx_resumes_cache");
      if (localSaved) {
        try {
          setDocuments(JSON.parse(localSaved));
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadFileName(file.name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadFileName(file.name);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("กรุณาเลือกไฟล์ PDF หรือ DOCX ก่อนเริ่มนำเข้า");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("sourceType", uploadType);
      if (uploadType === "REAL_AUTHORIZED" && uploadConsentId) {
        formData.append("consentId", uploadConsentId);
      }
      if (uploadFileName) {
        formData.append("fileName", uploadFileName);
      }

      const res = await fetch(`${apiUrl}/documents/upload`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.message || "Document upload failed");
      }

      setDocuments((prev) => {
        const updated = [json.data, ...prev.filter((doc) => doc.id !== json.data.id)];
        localStorage.setItem("interviewx_resumes_cache", JSON.stringify(updated));
        return updated;
      });

      showToast(`นำเข้าเอกสาร ${uploadFileName || selectedFile.name} สำเร็จ! AI ถอดโครงสร้างเรียบร้อย`);
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadFileName("");
    } catch (err: any) {
      console.error("Document upload failed:", err);
      showToast(err.message || "ไม่สามารถนำเข้าเอกสารได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบเอกสาร "${name}" ออกจากระบบใช่หรือไม่?`)) return;

    try {
      const res = await fetch(`${apiUrl}/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        showToast(`ลบเอกสาร ${name} สำเร็จ`);
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      // Local fallback
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      showToast(`ลบเอกสาร ${name} สำเร็จ (Local)`);
    }
  };

  // Filter & Search Logic
  const filteredDocs = documents.filter((doc) => {
    const matchStatus = filterStatus === "ALL" || doc.status === filterStatus;
    const matchSource =
      filterSource === "ALL" ||
      (filterSource === "SYNTHETIC" && doc.isSynthetic) ||
      (filterSource === "REAL" && !doc.isSynthetic);

    const q = searchTerm.toLowerCase();
    const matchSearch =
      doc.fileName?.toLowerCase().includes(q) ||
      doc.id?.toLowerCase().includes(q) ||
      doc.parsedProfile?.structuredData?.professional_summary?.toLowerCase().includes(q) ||
      (Array.isArray(doc.parsedProfile?.structuredData?.skills) &&
        doc.parsedProfile.structuredData.skills.some((s: string) => s.toLowerCase().includes(q)));

    return matchStatus && matchSource && matchSearch;
  });

  // KPI Calculations
  const totalCount = documents.length;
  const approvedCount = documents.filter((d) => d.status === "APPROVED").length;
  const pendingCount = documents.filter((d) => d.status === "PARSED" || d.status === "IN_REVIEW").length;
  const rejectedCount = documents.filter((d) => d.status === "REJECTED").length;
  const syntheticCount = documents.filter((d) => d.isSynthetic).length;
  const realCount = totalCount - syntheticCount;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าแดชบอร์ดหลัก
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/synthetic"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> สตูดิโอสังเคราะห์ข้อมูล
            </Link>
            <Link
              href="/taxonomy"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition hidden sm:inline-flex"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" /> ผังโครงสร้าง Taxonomy
            </Link>
            <Link
              href="/datasets"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" /> ส่งออกชุดข้อมูล
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header with Title & Primary Upload Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              <FileCheck2 className="w-4 h-4" /> Quality Gate & Verification Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              คลังเอกสาร & ศูนย์ตรวจสอบเรซูเม (Resume Repository)
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              นำเข้าเอกสารจริงและข้อมูลสังเคราะห์ สกัดข้อมูลด้วย AI และตรวจสอบแบบ Side-by-side ก่อนอนุมัติเข้าคลัง LLM
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDocs}
              title="รีเฟรชรายการ"
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <Upload className="w-4 h-4" />
              <span>นำเข้าเอกสารใหม่ (Upload File)</span>
            </button>
          </div>
        </div>

        {/* Visual Workflow Steps Banner (User-friendly 안내) */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 rounded-2xl border border-indigo-100 p-4 sm:p-5">
          <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" /> ขั้นตอนการทำงานที่แนะนำ (Recommended Workflow):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-indigo-100 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                1
              </div>
              <div>
                <div className="font-bold text-slate-800">นำเข้าเอกสาร (Upload)</div>
                <div className="text-[11px] text-slate-500">รองรับ PDF และ Word</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-indigo-100 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                2
              </div>
              <div>
                <div className="font-bold text-slate-800">AI สกัดโครงสร้าง (Parse)</div>
                <div className="text-[11px] text-slate-500">ถอดทักษะ ประวัติ และ PII</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-indigo-100 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                3
              </div>
              <div>
                <div className="font-bold text-slate-800">ตรวจทาน (Side-by-side)</div>
                <div className="text-[11px] text-slate-500">เทียบต้นฉบับกับข้อมูล AI</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-indigo-100 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                4
              </div>
              <div>
                <div className="font-bold text-slate-800">อนุมัติเข้า Dataset</div>
                <div className="text-[11px] text-slate-500">พร้อมส่งออกฝึกสอน LLM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time KPI Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium">เอกสารทั้งหมด</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">ในคลังจัดเก็บ</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-amber-700 font-medium">รอการตรวจทาน</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Parsed / In Review</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-emerald-700 font-medium">อนุมัติแล้ว (Approved)</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{approvedCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">พร้อมส่งออก LLM</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-rose-700 font-medium">ปฏิเสธ (Rejected)</div>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">{rejectedCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">ข้อมูลไม่สมบูรณ์</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-purple-700 font-medium">ข้อมูลสังเคราะห์</div>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">{syntheticCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Synthetic Engine</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-blue-700 font-medium">ข้อมูลจริงมี Consent</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{realCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Real Authorized</div>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อไฟล์, บทบาทงาน, ทักษะ หรือ ID..."
              className="w-full text-xs border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills & View Mode */}
          <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {[
                { id: "ALL", label: "ทั้งหมด" },
                { id: "PARSED", label: "รอตรวจ" },
                { id: "APPROVED", label: "อนุมัติแล้ว" },
                { id: "REJECTED", label: "ปฏิเสธ" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setFilterStatus(st.id)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    filterStatus === st.id
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Source Type Filter */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="ALL">ทุกแหล่งข้อมูล</option>
              <option value="SYNTHETIC">ข้อมูลสังเคราะห์ (Synthetic)</option>
              <option value="REAL">ข้อมูลจริง (Real Authorized)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-white">
              <button
                onClick={() => setViewMode("table")}
                title="มุมมองตาราง"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "table" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                title="มุมมองการ์ด"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Document Results Content */}
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">ไม่พบเอกสารตามเงื่อนไขที่เลือก</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              ลองเปลี่ยนคำค้นหาหรือนำเข้าเอกสารใหม่เข้าระบบเพื่อเริ่มกระบวนการสกัดและตรวจทาน
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition"
            >
              <Upload className="w-3.5 h-3.5" /> นำเข้าเอกสารใหม่
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">ชื่อเอกสาร & สรุปโปรไฟล์</th>
                    <th className="py-3 px-4">แหล่งข้อมูล</th>
                    <th className="py-3 px-4">สถานะการตรวจ</th>
                    <th className="py-3 px-4">AI Confidence</th>
                    <th className="py-3 px-4">ทักษะสำคัญ (Skills)</th>
                    <th className="py-3 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => {
                    const profile = doc.parsedProfile?.structuredData;
                    const skills = Array.isArray(profile?.skills) ? profile.skills : [];
                    const confidence = doc.parsedProfile?.confidenceScore ?? 0.98;

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span className="truncate">{doc.fileName}</span>
                                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-sm font-mono uppercase">
                                  {doc.fileType || "PDF"}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {profile?.professional_summary || profile?.headline || "ไม่มีข้อความสรุป"}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                ID: {doc.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {doc.isSynthetic ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              <Sparkles className="w-3 h-3" /> Synthetic
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <ShieldCheck className="w-3 h-3" /> Real Authorized
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              doc.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : doc.status === "REJECTED"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {doc.status === "APPROVED" && <Check className="w-3 h-3" />}
                            {doc.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  confidence >= 0.9 ? "bg-emerald-500" : confidence >= 0.75 ? "bg-amber-500" : "bg-rose-500"
                                }`}
                                style={{ width: `${Math.round(confidence * 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-mono text-slate-700 font-bold">
                              {Math.round(confidence * 100)}%
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {skills.slice(0, 3).map((sk: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                              >
                                {sk}
                              </span>
                            ))}
                            {skills.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-semibold self-center">
                                +{skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInspectDoc(doc)}
                              title="ดูข้อมูลสกัดด่วน"
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={`${apiUrl}/documents/${doc.id}/raw`}
                              target="_blank"
                              rel="noreferrer"
                              title="ดูไฟล์ต้นฉบับ (PDF/DOCX Stream)"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <Link
                              href={`/resumes/${doc.id}/review`}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>ตรวจข้อมูล</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                              title="ลบเอกสาร"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Card Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc) => {
              const profile = doc.parsedProfile?.structuredData;
              const skills = Array.isArray(profile?.skills) ? profile.skills : [];
              const confidence = doc.parsedProfile?.confidenceScore ?? 0.98;

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 line-clamp-1">{doc.fileName}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                            {doc.id}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : doc.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {profile?.professional_summary || profile?.headline || "ไม่มีข้อความสรุปโปรไฟล์"}
                    </p>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 mb-1">ทักษะสำคัญ:</div>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 4).map((sk: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                      <span>AI:</span>
                      <span className="font-bold text-slate-800">{Math.round(confidence * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setInspectDoc(doc)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
                      >
                        ดูผลสกัด
                      </button>
                      <Link
                        href={`/resumes/${doc.id}/review`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ตรวจทาน</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Upload Modal (Clean & Guided) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                นำเข้าเอกสารเรซูเมใหม่ (Upload Document)
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="text-slate-400 hover:text-slate-700 font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-4">
              {/* Category Choice */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  เลือกประเภทแหล่งที่มาของข้อมูล (Data Source Type)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadType("SYNTHETIC")}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      uploadType === "SYNTHETIC"
                        ? "border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-600/20"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" /> ข้อมูลสังเคราะห์ (Synthetic)
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal mt-1">ไม่ต้องใช้ Consent พร้อมสกัดและเทรน</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadType("REAL_AUTHORIZED")}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      uploadType === "REAL_AUTHORIZED"
                        ? "border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-600/20"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" /> ข้อมูลจริง (Real Authorized)
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal mt-1">ต้องผูก Consent ID แยก PII Vault</div>
                  </button>
                </div>
              </div>

              {/* Consent Record Selector if Real */}
              {uploadType === "REAL_AUTHORIZED" && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                  <label className="text-xs font-bold text-blue-900 block">
                    รหัสหนังสือแสดงความยินยอม (Consent ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={uploadConsentId}
                    onChange={(e) => setUploadConsentId(e.target.value)}
                    required
                    placeholder="เช่น consent-demo-9841"
                    className="w-full text-xs border border-blue-300 rounded-lg px-3 py-2 text-slate-800 bg-white font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-[11px] text-blue-700">
                    ตามกฎหมาย PDPA ข้อมูลจริงต้องผ่านการยินยอมและแยกเก็บ PII เข้าสู่ Vault อัตโนมัติ
                  </p>
                </div>
              )}

              {/* Native Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
              />

              {/* Dropzone */}
              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer ${
                    isDragging
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
                  }`}
                >
                  <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-800">
                    คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    รองรับเอกสารนามสกุล <span className="font-semibold text-slate-700">.PDF</span> และ <span className="font-semibold text-slate-700">.DOCX</span> (ขนาดไม่เกิน 25MB)
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>{selectedFile.name}</span>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ขนาด: {(selectedFile.size / 1024).toFixed(1)} KB • พร้อมเริ่มสกัดข้อมูล
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    เปลี่ยนไฟล์
                  </button>
                </div>
              )}

              {/* Display File Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่อที่จะบันทึกแสดงผล (Display Name)
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="เช่น candidate_senior_engineer.pdf"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>กำลังสกัดข้อความด้วย AI...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>เริ่มนำเข้าเอกสาร</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Inspection Drawer / Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                  ผลการสกัดโครงสร้าง AI (Parsed Profile Data)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {inspectDoc.id} • {inspectDoc.fileName}
                </p>
              </div>
              <button
                onClick={() => setInspectDoc(null)}
                className="text-slate-400 hover:text-slate-600 font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-slate-100">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(inspectDoc.parsedProfile?.structuredData || inspectDoc, null, 2)}
              </pre>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
              <span className="text-xs text-slate-500">
                AI Confidence: {Math.round((inspectDoc.parsedProfile?.confidenceScore ?? 0.98) * 100)}%
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(inspectDoc.parsedProfile?.structuredData || inspectDoc, null, 2)
                    );
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? "คัดลอกแล้ว" : "คัดลอก JSON"}</span>
                </button>
                <Link
                  href={`/resumes/${inspectDoc.id}/review`}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>เปิดตรวจเต็มจอ (Side-by-side)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
