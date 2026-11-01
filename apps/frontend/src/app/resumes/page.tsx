"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FileText, Search, Sparkles, CheckCircle2, Upload, Eye, ShieldCheck, ArrowRight, X, Plus, Check } from "lucide-react";

export default function ResumesListPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Upload modal states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState("candidate_profile.pdf");
  const [uploadType, setUploadType] = useState<"SYNTHETIC" | "REAL_AUTHORIZED">("SYNTHETIC");
  const [uploadConsentId, setUploadConsentId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadDocs = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/documents`);
      const json = await res.json();

      let serverDocs = [];
      if (json.success && Array.isArray(json.data)) {
        serverDocs = json.data;
      }

      // A successful API response is authoritative. Keeping locally invented
      // records here led to links using IDs that did not exist on the backend.
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
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

      showToast(`นำเข้าเอกสาร ${uploadFileName} เข้าระบบสำเร็จ (สถานะ PARSED พร้อมตรวจ)`);
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (err: any) {
      console.error("Document upload failed:", err);
      showToast(err.message || "ไม่สามารถนำเข้าเอกสารได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchStatus = filterStatus === "ALL" || doc.status === filterStatus;
    const matchSearch = doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                อัปโหลดเอกสารเรซูเมเข้าระบบ (Upload Document)
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-4">
              {/* Category Choice */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ประเภทข้อมูลที่นำเข้า (Data Source Category)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadType("SYNTHETIC")}
                    className={`p-3 rounded-lg border text-left text-xs transition ${
                      uploadType === "SYNTHETIC"
                        ? "border-purple-600 bg-purple-50 text-purple-900 font-semibold"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> ข้อมูลสังเคราะห์ (Synthetic)
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">ไม่ต้องใช้ Consent พร้อมเทรน</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadType("REAL_AUTHORIZED")}
                    className={`p-3 rounded-lg border text-left text-xs transition ${
                      uploadType === "REAL_AUTHORIZED"
                        ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> ข้อมูลจริง (Real Authorized)
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">ต้องมี Consent Record แยก PII</div>
                  </button>
                </div>
              </div>

              {/* Consent ID if real */}
              {uploadType === "REAL_AUTHORIZED" && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    รหัสหนังสือแสดงความยินยอม (Consent ID) *จำเป็นสำหรับข้อมูลจริง*
                  </label>
                  <input
                    type="text"
                    value={uploadConsentId}
                    onChange={(e) => setUploadConsentId(e.target.value)}
                    required
                    placeholder="เช่น consent-demo-9841"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    สามารถสร้าง Consent Record ได้ที่เมนู <Link href="/consent" className="text-indigo-600 underline">จัดการ Consent</Link>
                  </p>
                </div>
              )}

              {/* Hidden Native File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
              />

              {/* File Dropzone */}
              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
                  }`}
                >
                  <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-800">
                    คลิกที่นี่เพื่อเปิดเลือกไฟล์ หรือลากไฟล์มาวางในกล่องนี้
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    รองรับไฟล์เอกสารนามสกุล <span className="font-semibold text-slate-700">.PDF</span> และ <span className="font-semibold text-slate-700">.DOCX</span> (ขนาดไม่เกิน 25MB)
                  </div>
                </div>
              ) : (
                /* Selected File Card */
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{selectedFile.name}</span>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ขนาด: {(selectedFile.size / 1024).toFixed(1)} KB • พร้อมนำเข้า
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition"
                  >
                    เปลี่ยนไฟล์
                  </button>
                </div>
              )}

              {/* File Name input for custom renaming */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่อที่จะบันทึกในระบบ (Display File Name)
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  required
                  placeholder="เช่น candidate_resume.pdf"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <span>กำลังอัปโหลดและประมวลผล...</span>
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

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              Quality Gate & Verification
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              คลังเอกสารเรซูเม (Resume Repository)
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              ตรวจสอบ รับรองความถูกต้อง และเตรียมข้อมูลเรซูเมสำหรับส่งออกเข้าสู่ชุดข้อมูล LLM
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Upload className="w-4 h-4" />
              <span>อัปโหลดเอกสาร (Upload File)</span>
            </button>
            <Link
              href="/resumes/doc-001-demo/review"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition"
            >
              <span>เปิดหน้าต่าง Side-by-side Review</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อไฟล์ หรือตำแหน่งงาน..."
              className="w-full text-xs border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            {["ALL", "PARSED", "IN_REVIEW", "APPROVED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  filterStatus === st
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Resumes Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">ชื่อเอกสาร</th>
                <th className="py-3 px-4">ประเภทข้อมูล</th>
                <th className="py-3 px-4">สถานะการตรวจ</th>
                <th className="py-3 px-4">ความเชื่อมั่น (Confidence)</th>
                <th className="py-3 px-4 text-right">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{doc.fileName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">ID: {doc.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {doc.isSynthetic ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        <Sparkles className="w-3 h-3" /> Synthetic
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <ShieldCheck className="w-3 h-3" /> Real Authorized
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        doc.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : doc.status === "REJECTED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    {doc.parsedProfile?.confidenceScore
                      ? `${(doc.parsedProfile.confidenceScore * 100).toFixed(0)}%`
                      : "95%"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/resumes/${doc.id}/review`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>ตรวจข้อมูล</span>
                    </Link>
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
