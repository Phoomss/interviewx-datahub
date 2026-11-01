"use client";

import React, { useState } from "react";
import { ZoomIn, ZoomOut, Copy, Check, FileSearch, Sparkles, FileText, ExternalLink } from "lucide-react";

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
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"text" | "pdf">("text");

  const effectivePdfUrl = previewUrl
    ? (previewUrl.startsWith("http") ? previewUrl : `http://localhost:4000${previewUrl}`)
    : (documentId ? `http://localhost:4000/api/v1/documents/${documentId}/raw` : null);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSectionHighlightClass = (sectionName: string) => {
    if (activeSection === sectionName) {
      return "bg-amber-100 ring-2 ring-amber-400 rounded px-1 transition duration-200";
    }
    return "";
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-100 border-r border-slate-200">
      {/* Viewer Controls Toolbar */}
      <div className="h-11 px-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-3 font-medium">
          <div className="flex items-center gap-1.5">
            <FileSearch className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-slate-800 truncate max-w-[200px]">{fileName}</span>
            <span className="text-slate-400">({fileType})</span>
          </div>

          {/* Toggle between Text View and Original Document */}
          <div className="flex items-center bg-slate-200 p-0.5 rounded-lg text-[11px]">
            <button
              onClick={() => setViewMode("text")}
              className={`px-2.5 py-0.5 rounded-md transition ${
                viewMode === "text"
                  ? "bg-white font-semibold text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ข้อความสกัด (Text)
            </button>
            <button
              onClick={() => setViewMode("pdf")}
              className={`px-2.5 py-0.5 rounded-md transition flex items-center gap-1 ${
                viewMode === "pdf"
                  ? "bg-white font-semibold text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>ไฟล์เอกสารต้นฉบับ</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeSection && viewMode === "text" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
              <Sparkles className="w-3 h-3" /> Focus: {activeSection.toUpperCase()}
            </span>
          )}

          {viewMode === "text" && (
            <>
              <div className="h-4 w-px bg-slate-300 mx-1" />

              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1 hover:bg-slate-200 rounded transition"
                title="ย่อขนาด"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center font-mono text-[11px]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                className="p-1 hover:bg-slate-200 rounded transition"
                title="ขยายขนาด"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2 py-1 hover:bg-slate-200 rounded transition ml-1"
                title="คัดลอกข้อความดิบ"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "คัดลอกแล้ว" : "คัดลอก"}</span>
              </button>
            </>
          )}

          {viewMode === "pdf" && effectivePdfUrl && (
            <a
              href={effectivePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded hover:bg-slate-50 transition text-slate-700"
            >
              <span>เปิดในแท็บใหม่</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}
        </div>
      </div>

      {/* Main Viewer Body */}
      {viewMode === "pdf" ? (
        <div className="flex-1 w-full h-full bg-slate-200 p-2 overflow-hidden flex flex-col">
          {effectivePdfUrl ? (
            <iframe
              src={effectivePdfUrl}
              title={fileName}
              className="w-full h-full rounded-lg border border-slate-300 bg-white shadow-inner"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              ไม่มี URL สำหรับแสดงผลไฟล์ต้นฉบับ
            </div>
          )}
        </div>
      ) : (
        /* Formatted Extracted Text Sheet */
        <div className="flex-1 overflow-auto p-6 flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            className="w-full max-w-2xl min-h-[840px] bg-white rounded-lg shadow-md border border-slate-200 p-8 text-slate-800 font-mono text-xs leading-relaxed whitespace-pre-wrap transition-transform"
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

                  return (
                    <div
                      key={idx}
                      className={`mb-4 p-1.5 transition-colors ${getSectionHighlightClass(section)}`}
                    >
                      {block}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic font-sans">
                ไม่มีข้อความดิบที่สกัดได้
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
