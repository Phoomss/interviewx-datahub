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
  const [filterClassification, setFilterClassification] = useState("ALL");
  const [filterEligibility, setFilterEligibility] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Upload modal states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      if (newFiles.length === 1 && selectedFiles.length === 0) {
        setUploadFileName(newFiles[0].name);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      if (newFiles.length === 1 && selectedFiles.length === 0) {
        setUploadFileName(newFiles[0].name);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      showToast("กรุณาเลือกไฟล์เอกสารก่อนเริ่มนำเข้า");
      return;
    }

    setIsUploading(true);
    try {
      if (selectedFiles.length === 1) {
        const file = selectedFiles[0];
        const formData = new FormData();
        formData.append("file", file);
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

        showToast(`นำเข้าเอกสาร ${uploadFileName || file.name} สำเร็จ! AI ถอดโครงสร้างเรียบร้อย`);
      } else {
        // Multi-file bulk upload
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("sourceType", uploadType);
        if (uploadType === "REAL_AUTHORIZED" && uploadConsentId) {
          formData.append("consentId", uploadConsentId);
        }

        const res = await fetch(`${apiUrl}/documents/upload-multiple`, {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Batch upload failed");
        }

        if (Array.isArray(json.data) && json.data.length > 0) {
          setDocuments((prev) => {
            const newDocIds = new Set(json.data.map((d: any) => d.id));
            const updated = [...json.data, ...prev.filter((doc) => !newDocIds.has(doc.id))];
            localStorage.setItem("interviewx_resumes_cache", JSON.stringify(updated));
            return updated;
          });
        }

        showToast(`✓ นำเข้าเอกสารสำเร็จ ${json.uploadedCount}/${json.totalCount} ไฟล์! AI ถอดโครงสร้างเรียบร้อย`);
      }

      setShowUploadModal(false);
      setSelectedFiles([]);
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

  const handleClearSynthetic = async () => {
    if (!confirm("คุณต้องการล้างข้อมูลเรซูเมสังเคราะห์ทั้งหมดออกจากระบบเพื่อเตรียมสร้างใหม่ใช่หรือไม่?")) {
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/documents/synthetic/clear`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok) {
        showToast(json.message || "ล้างข้อมูลเรซูเมสังเคราะห์เรียบร้อย");
        localStorage.removeItem("interviewx_resumes_cache");
        await loadDocs();
      } else {
        throw new Error(json.message || "Failed to clear");
      }
    } catch (e: any) {
      showToast(e.message || "เกิดข้อผิดพลาดในการล้างข้อมูล");
    }
  };

  // Filter & Search Logic
  const filteredDocs = documents.filter((doc) => {
    const matchStatus = filterStatus === "ALL" || doc.status === filterStatus;
    const matchSource =
      filterSource === "ALL" ||
      (filterSource === "SYNTHETIC" && doc.isSynthetic) ||
      (filterSource === "REAL" && !doc.isSynthetic);
    const matchClassification =
      filterClassification === "ALL" ||
      doc.classification === filterClassification ||
      (doc.classification && doc.classification.toUpperCase() === filterClassification.toUpperCase());
    const matchEligibility =
      filterEligibility === "ALL" ||
      doc.trainingEligibilityStatus === filterEligibility;

    const q = searchTerm.toLowerCase();
    const matchSearch =
      doc.fileName?.toLowerCase().includes(q) ||
      doc.id?.toLowerCase().includes(q) ||
      doc.classification?.toLowerCase().includes(q) ||
      doc.parsedProfile?.structuredData?.professional_summary?.toLowerCase().includes(q) ||
      (Array.isArray(doc.parsedProfile?.structuredData?.skills) &&
        doc.parsedProfile.structuredData.skills.some((s: string) => s.toLowerCase().includes(q)));

    return matchStatus && matchSource && matchClassification && matchEligibility && matchSearch;
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
              onClick={handleClearSynthetic}
              title="ล้างข้อมูลเรซูเมสังเคราะห์เพื่อเตรียมสร้างใหม่"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างเรซูเมสังเคราะห์</span>
            </button>
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
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อผู้สมัคร, ไฟล์, ตำแหน่ง, ทักษะ หรือ ID..."
                className="w-full text-xs border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-slate-50/50 hover:bg-white focus:bg-white transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Status Segmented Controls */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto">
              {[
                { id: "ALL", label: "ทั้งหมด", count: totalCount },
                { id: "PARSED", label: "รอตรวจทาน", count: pendingCount },
                { id: "APPROVED", label: "อนุมัติแล้ว", count: approvedCount },
                { id: "REJECTED", label: "ปฏิเสธ", count: rejectedCount },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setFilterStatus(st.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap transition flex items-center gap-1.5 ${
                    filterStatus === st.id
                      ? "bg-white text-indigo-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>{st.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filterStatus === st.id ? "bg-indigo-100 text-indigo-800" : "bg-slate-200/70 text-slate-500"
                  }`}>
                    {st.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Dropdown Filters Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Source Type Filter */}
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              >
                <option value="ALL">ทุกแหล่งข้อมูล (All Sources)</option>
                <option value="SYNTHETIC">ข้อมูลสังเคราะห์ (Synthetic)</option>
                <option value="REAL">ข้อมูลจริงมี Consent (Real Authorized)</option>
              </select>

              {/* Classification Filter (13 Types) */}
              <select
                value={filterClassification}
                onChange={(e) => setFilterClassification(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              >
                <option value="ALL">ทุกประเภทเอกสาร (13 Classifications)</option>
                <option value="RESUME">Resume</option>
                <option value="CV">CV</option>
                <option value="ACADEMIC_CV">Academic CV</option>
                <option value="PORTFOLIO">Portfolio</option>
                <option value="TRANSCRIPT">Transcript</option>
                <option value="CERTIFICATE">Certificate</option>
                <option value="RECOMMENDATION_LETTER">Recommendation Letter</option>
                <option value="RESEARCH_PAPER">Research Paper</option>
                <option value="PROJECT_REPORT">Project Report</option>
                <option value="EMPLOYMENT_DOCUMENT">Employment Document</option>
                <option value="SCHOLARSHIP_DOCUMENT">Scholarship Document</option>
                <option value="TRAINING_RECORD">Training Record</option>
                <option value="OTHER">Other Documents</option>
              </select>

              {/* Training Eligibility Filter */}
              <select
                value={filterEligibility}
                onChange={(e) => setFilterEligibility(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              >
                <option value="ALL">ทุกสถานะ Training Gate</option>
                <option value="APPROVED_FOR_TRAINING">Approved for Training</option>
                <option value="APPROVED_FOR_PROFILE_MANAGEMENT">Profile Management Only</option>
                <option value="EXTRACTION_COMPLETED">Extraction Completed</option>
                <option value="PENDING_HUMAN_REVIEW">Pending Human Review</option>
                <option value="RESTRICTED">Restricted</option>
                <option value="REVOKED_CONSENT_RESTRICTED">Consent Revoked</option>
              </select>

              {/* Reset Filters Button */}
              {(searchTerm || filterStatus !== "ALL" || filterSource !== "ALL" || filterClassification !== "ALL" || filterEligibility !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("ALL");
                    setFilterSource("ALL");
                    setFilterClassification("ALL");
                    setFilterEligibility("ALL");
                  }}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> ล้างตัวกรอง
                </button>
              )}
            </div>

            {/* Results Counter & View Mode Switcher */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-slate-500">
                พบ <strong className="text-slate-900">{filteredDocs.length}</strong> จาก {totalCount} รายการ
              </span>

              <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-100">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  title="มุมมองตาราง (Table View)"
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "table" ? "bg-white text-indigo-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="มุมมองการ์ด (Grid View)"
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "grid" ? "bg-white text-indigo-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Document Results Content */}
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">ไม่พบเอกสารตามเงื่อนไขที่เลือก</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                ลองปรับเปลี่ยนคำค้นหาหรือนำเข้าเอกสารใหม่เข้าระบบเพื่อเริ่มกระบวนการสกัดและตรวจทาน
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("ALL");
                  setFilterSource("ALL");
                  setFilterClassification("ALL");
                  setFilterEligibility("ALL");
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                ล้างตัวกรองทั้งหมด
              </button>
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition"
              >
                <Upload className="w-3.5 h-3.5" /> นำเข้าเอกสารใหม่
              </button>
            </div>
          </div>
        ) : viewMode === "table" ? (
          /* User-Friendly Enhanced Table View */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">เอกสาร & ข้อมูลผู้สมัคร</th>
                    <th className="py-3.5 px-4">หมวดหมู่เอกสาร</th>
                    <th className="py-3.5 px-4">แหล่งข้อมูล & Consent</th>
                    <th className="py-3.5 px-4">สถานะการตรวจ</th>
                    <th className="py-3.5 px-4">Training Gate</th>
                    <th className="py-3.5 px-4">ทักษะสำคัญ</th>
                    <th className="py-3.5 px-4">AI Score</th>
                    <th className="py-3.5 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => {
                    const profile = doc.parsedProfile?.structuredData;
                    const skills = Array.isArray(profile?.skills) ? profile.skills : [];
                    const confidence = doc.parsedProfile?.confidenceScore ?? 0.98;

                    // Derive candidate name or initials
                    const rawFirstLine = (doc.parsedProfile?.rawText || "").split("\n")[0]?.trim();
                    const detectedName =
                      profile?.full_name ||
                      profile?.name ||
                      (rawFirstLine && rawFirstLine.length < 50 && !rawFirstLine.toLowerCase().includes("resume")
                        ? rawFirstLine
                        : doc.fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));

                    const initials = detectedName
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((w: string) => w[0]?.toUpperCase())
                      .join("") || "CV";

                    return (
                      <tr
                        key={doc.id}
                        className="hover:bg-indigo-50/35 transition-colors group"
                      >
                        {/* 1. Candidate & Document Meta */}
                        <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/resumes/${doc.id}/review`}
                                className="font-bold text-slate-900 hover:text-indigo-600 transition flex items-center gap-1.5 truncate group/link"
                              >
                                <span className="truncate">{detectedName}</span>
                                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono uppercase font-bold shrink-0">
                                  {doc.fileType || "PDF"}
                                </span>
                              </Link>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                                {doc.fileName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                ID: {doc.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Classification */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                            {doc.classification || "RESUME"}
                          </span>
                        </td>

                        {/* 3. Source & Consent */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {doc.isSynthetic ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                <Sparkles className="w-2.5 h-2.5" /> Synthetic
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <ShieldCheck className="w-2.5 h-2.5 text-blue-600" /> Real Authorized
                              </span>
                            )}
                            {doc.consentId && !doc.isSynthetic && (
                              <div className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]">
                                {doc.consentId}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 4. Review Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              doc.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : doc.status === "REJECTED"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : doc.status === "NEEDS_CORRECTION"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              doc.status === "APPROVED"
                                ? "bg-emerald-600"
                                : doc.status === "REJECTED"
                                ? "bg-rose-600"
                                : "bg-blue-600 animate-pulse"
                            }`} />
                            {doc.status === "PARSED" ? "รอตรวจทาน" : doc.status}
                          </span>
                        </td>

                        {/* 5. Training Eligibility Gate */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                              (doc.trainingEligibilityStatus === "APPROVED_FOR_TRAINING" || doc.isSynthetic)
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : doc.trainingEligibilityStatus === "APPROVED_FOR_PROFILE_MANAGEMENT"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : doc.trainingEligibilityStatus === "REVOKED_CONSENT_RESTRICTED"
                                ? "bg-slate-100 text-slate-600 line-through"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {(doc.trainingEligibilityStatus === "APPROVED_FOR_TRAINING" || doc.isSynthetic) && (
                              <Check className="w-3 h-3 text-emerald-600" />
                            )}
                            {doc.trainingEligibilityStatus === "APPROVED_FOR_TRAINING" || doc.isSynthetic
                              ? "พร้อมเทรน AI"
                              : doc.trainingEligibilityStatus === "APPROVED_FOR_PROFILE_MANAGEMENT"
                              ? "Profile Only"
                              : "รอพิจารณา"}
                          </span>
                        </td>

                        {/* 6. Skills Cloud Snippet */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {skills.slice(0, 3).map((sk: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200/60"
                              >
                                {sk}
                              </span>
                            ))}
                            {skills.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-bold self-center px-1">
                                +{skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 7. AI Confidence Score */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  confidence >= 0.9 ? "bg-emerald-500" : confidence >= 0.75 ? "bg-amber-500" : "bg-rose-500"
                                }`}
                                style={{ width: `${Math.round(confidence * 100)}%` }}
                              />
                            </div>
                            <span className="font-mono text-slate-700 font-bold text-[11px]">
                              {Math.round(confidence * 100)}%
                            </span>
                          </div>
                        </td>

                        {/* 8. Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Inspect JSON Drawer */}
                            <button
                              type="button"
                              onClick={() => setInspectDoc(doc)}
                              title="ดูผลการสกัด JSON ด่วน"
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            >
                              <Code2 className="w-4 h-4" />
                            </button>

                            {/* View Raw Stream */}
                            <a
                              href={`${apiUrl}/documents/${doc.id}/raw`}
                              target="_blank"
                              rel="noreferrer"
                              title="เปิดดูไฟล์ต้นฉบับ (PDF/DOCX Stream)"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            {/* Primary Review Button */}
                            <Link
                              href={`/resumes/${doc.id}/review`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs transition group-hover:shadow-md"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>ตรวจทาน</span>
                            </Link>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                              title="ลบเอกสารออกจากระบบ"
                              className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition ml-0.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                แสดงทั้งหมด <strong className="text-slate-800">{filteredDocs.length}</strong> รายการ จากคลังเอกสาร
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">คลิกที่ชื่อผู้สมัครหรือกด &quot;ตรวจทาน&quot; เพื่อเปิดหน้าจอ Side-by-side</span>
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced Card Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc) => {
              const profile = doc.parsedProfile?.structuredData;
              const skills = Array.isArray(profile?.skills) ? profile.skills : [];
              const confidence = doc.parsedProfile?.confidenceScore ?? 0.98;

              const rawFirstLine = (doc.parsedProfile?.rawText || "").split("\n")[0]?.trim();
              const detectedName =
                profile?.full_name ||
                profile?.name ||
                (rawFirstLine && rawFirstLine.length < 50 && !rawFirstLine.toLowerCase().includes("resume")
                  ? rawFirstLine
                  : doc.fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));

              const initials = detectedName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((w: string) => w[0]?.toUpperCase())
                .join("") || "CV";

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/resumes/${doc.id}/review`}
                            className="font-bold text-xs sm:text-sm text-slate-900 hover:text-indigo-600 transition truncate block"
                          >
                            {detectedName}
                          </Link>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]">
                            {doc.fileName}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          doc.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : doc.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {doc.status === "PARSED" ? "รอตรวจทาน" : doc.status}
                      </span>
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {doc.classification || "RESUME"}
                      </span>
                      {doc.isSynthetic ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Synthetic
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 text-blue-600" /> Real Authorized
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {doc.trainingEligibilityStatus === "APPROVED_FOR_TRAINING" || doc.isSynthetic ? "พร้อมเทรน" : "รอตรวจ"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {profile?.professional_summary || profile?.headline || "ไม่มีข้อความสรุปโปรไฟล์"}
                    </p>

                    <div>
                      <div className="text-[11px] font-bold text-slate-500 mb-1.5">ทักษะสำคัญ:</div>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 4).map((sk: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200/60"
                          >
                            {sk}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span className="text-[10px] text-slate-400 font-bold self-center px-1">
                            +{skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                      <span>AI Score:</span>
                      <span className="font-bold text-slate-800">{Math.round(confidence * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setInspectDoc(doc)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                        title="ดูผลสกัด JSON"
                      >
                        <Code2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/resumes/${doc.id}/review`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs transition"
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
                  setSelectedFiles([]);
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

              {/* Native Hidden File Input with multiple attribute */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept=".pdf,.docx,.xlsx,.pptx,.png,.jpg,.jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/png,image/jpeg"
                className="hidden"
              />

              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition cursor-pointer ${
                  isDragging
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
                }`}
              >
                <Upload className="w-7 h-7 text-indigo-600 mx-auto mb-1.5" />
                <div className="text-xs font-bold text-slate-800">
                  คลิกเพื่อเลือกไฟล์ (รองรับหลายไฟล์พร้อมกัน) หรือลากไฟล์มาวางที่นี่
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  รองรับเอกสาร <span className="font-semibold text-slate-700">PDF, DOCX, XLSX, PPTX, PNG, JPG</span> (ขนาดไม่เกิน 25MB ต่อไฟล์)
                </div>
              </div>

              {/* Multi-File Selection List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      ไฟล์ที่เลือก ({selectedFiles.length} ไฟล์ • {(selectedFiles.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> เพิ่มไฟล์อีก
                    </button>
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {file.name.endsWith(".docx") ? "DOC" : file.name.endsWith(".xlsx") ? "XLS" : file.name.endsWith(".png") || file.name.endsWith(".jpg") ? "IMG" : "PDF"}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 truncate max-w-[280px]">
                              {file.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {(file.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="ลบไฟล์นี้ออก"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display File Name (when 1 file) */}
              {selectedFiles.length === 1 && (
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
              )}

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isUploading || selectedFiles.length === 0}
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
                      <span>{selectedFiles.length > 1 ? `เริ่มนำเข้าทั้ง ${selectedFiles.length} ไฟล์` : "เริ่มนำเข้าเอกสาร"}</span>
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
