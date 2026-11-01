"use client";

import React, { useState } from "react";
import { ZoomIn, ZoomOut, Copy, Check, FileSearch, Sparkles } from "lucide-react";

interface DocumentViewerProps {
  rawText: string;
  activeSection: string | null;
  fileType: string;
  fileName: string;
}

export function DocumentViewer({
  rawText,
  activeSection,
  fileType,
  fileName,
}: DocumentViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);

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
        <div className="flex items-center gap-2 font-medium">
          <FileSearch className="w-4 h-4 text-indigo-500" />
          <span>{fileName} ({fileType})</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">หน้า 1 จาก 1</span>
        </div>

        <div className="flex items-center gap-2">
          {activeSection && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
              <Sparkles className="w-3 h-3" /> Focus: {activeSection.toUpperCase()}
            </span>
          )}

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
        </div>
      </div>

      {/* Simulated Document Sheet / Canvas */}
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
    </div>
  );
}
