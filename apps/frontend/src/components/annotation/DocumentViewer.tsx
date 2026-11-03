"use client";

import React, { useState, useMemo } from "react";
import {
  ZoomIn,
  ZoomOut,
  Copy,
  Check,
  FileSearch,
  Sparkles,
  FileText,
  ExternalLink,
  Download,
  Search,
  Bookmark,
  RotateCw,
} from "lucide-react";

interface DocumentViewerProps {
  rawText: string;
  activeSection: string | null;
  fileType: string;
  fileName: string;
  documentId?: string;
  previewUrl?: string;
}

export function DocumentViewer({
  rawText,
  activeSection,
  fileType,
  fileName,
  documentId,
  previewUrl,
}: DocumentViewerProps) {
  // If file is PDF, default to PDF viewer for immediate visual fidelity
  const isPdfFile = fileType.toUpperCase().includes("PDF") || fileName.toLowerCase().endsWith(".pdf");
  const [viewMode, setViewMode] = useState<"pdf" | "text">(isPdfFile ? "pdf" : "text");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [iframeKey, setIframeKey] = useState(0);

  const effectivePdfUrl = previewUrl
    ? (previewUrl.startsWith("http") ? previewUrl : `http://localhost:4000${previewUrl}`)
    : (documentId ? `http://localhost:4000/api/v1/documents/${documentId}/raw` : null);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSectionHighlightClass = (sectionName: string) => {
    if (activeSection && activeSection.toLowerCase() === sectionName.toLowerCase()) {
      return "bg-amber-100 ring-2 ring-amber-400 rounded-lg p-2 transition duration-200 shadow-2xs";
    }
    return "";
  };

  // Text search matches counter
  const matchCount = useMemo(() => {
    if (!searchQuery.trim() || !rawText) return 0;
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    return (rawText.match(regex) || []).length;
  }, [searchQuery, rawText]);

  // Highlight matches in text
  const renderHighlightedText = (content: string) => {
    if (!searchQuery.trim()) return content;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = content.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-300 text-slate-950 font-bold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="h-full min-h-0 flex flex-col bg-slate-100 border-r border-slate-200 overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-12 px-3 sm:px-4 border-b border-slate-200 bg-white flex items-center justify-between text-xs text-slate-600 gap-2 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3 font-medium min-w-0">
          {/* View Mode Toggle Segmented Control */}
          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/80 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("pdf")}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                viewMode === "pdf"
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">ไฟล์ต้นฉบับ (PDF)</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("text")}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                viewMode === "text"
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileSearch className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">ข้อความที่สกัด (Text)</span>
              <span className="sm:hidden">Text</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-500 font-mono truncate max-w-[160px]">
            <span>{fileName}</span>
          </div>
        </div>

        {/* Toolbar Controls Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {viewMode === "text" && (
            <>
              {/* Search Bar in Extracted Text */}
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหา..."
                  className="pl-7 pr-10 py-1 text-[11px] bg-slate-100 border border-slate-200 rounded-lg w-24 xs:w-32 sm:w-44 focus:w-40 sm:focus:w-56 focus:bg-white focus:outline-indigo-500 transition-all"
                />
                {searchQuery && (
                  <span className="absolute right-1.5 text-[9px] font-mono text-slate-500 bg-slate-200 px-1 rounded">
                    {matchCount}
                  </span>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                  className="p-1 hover:bg-white rounded transition text-slate-600"
                  title="ย่อขนาด"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-medium text-[10px]">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                  className="p-1 hover:bg-white rounded transition text-slate-600"
                  title="ขยายขนาด"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Copy Raw Text Button */}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition shadow-2xs"
                title="คัดลอกข้อความทั้งหมด"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? "คัดลอกแล้ว" : "คัดลอก"}</span>
              </button>
            </>
          )}

          {viewMode === "pdf" && effectivePdfUrl && (
            <>
              <button
                type="button"
                onClick={() => setIframeKey((k) => k + 1)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                title="โหลดใหม่ (Reload)"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <a
                href={effectivePdfUrl}
                download={fileName}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition shadow-2xs"
                title="ดาวน์โหลดไฟล์ต้นฉบับ"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>ดาวน์โหลด</span>
              </a>

              <a
                href={effectivePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-lg transition shadow-2xs"
              >
                <span className="hidden sm:inline">เปิดแท็บใหม่</span>
                <span className="sm:hidden">เปิด</span>
                <ExternalLink className="w-3 h-3 text-indigo-500" />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "pdf" ? (
        <div className="flex-1 w-full h-full bg-slate-900/5 p-3 overflow-hidden flex flex-col">
          {effectivePdfUrl ? (
            <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-300 bg-white shadow-sm relative">
              <iframe
                key={iframeKey}
                src={`${effectivePdfUrl}#toolbar=1&navpanes=0`}
                title={fileName}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <FileText className="w-10 h-10 text-slate-300" />
              <div className="text-xs font-semibold">ไม่มี URL สำหรับแสดงผลไฟล์ PDF</div>
              <button
                type="button"
                onClick={() => setViewMode("text")}
                className="text-xs text-indigo-600 hover:underline"
              >
                สลับไปดูข้อความสกัดแทน
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Formatted Extracted Text Sheet */
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center bg-slate-100/70">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            className="w-full max-w-2xl min-h-[900px] bg-white rounded-2xl shadow-sm border border-slate-200/90 p-8 sm:p-10 text-slate-800 font-mono text-xs leading-relaxed whitespace-pre-wrap transition-transform space-y-4"
          >
            {rawText ? (
              <div>
                {rawText.split("\n\n").map((block, idx) => {
                  const lower = block.toLowerCase();
                  let section = "";
                  if (lower.includes("summary") || lower.includes("objective")) section = "summary";
                  else if (lower.includes("skill") || lower.includes("technolog")) section = "skills";
                  else if (lower.includes("experience") || lower.includes("employment")) section = "experiences";
                  else if (lower.includes("education") || lower.includes("degree")) section = "educations";
                  else if (lower.includes("project")) section = "projects";

                  return (
                    <div
                      key={idx}
                      className={`mb-4 p-2 transition-colors rounded-lg ${getSectionHighlightClass(section)}`}
                    >
                      {renderHighlightedText(block)}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 py-20 italic font-sans">
                <FileSearch className="w-8 h-8 text-slate-300" />
                <span>ไม่มีข้อความดิบที่สกัดได้</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
