"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Code2,
  Layers,
  Briefcase,
  GraduationCap,
  Award,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Star,
  Download,
  Search,
  Building,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  FileText,
  Compass,
  X,
  Tag,
  Quote,
  Target,
  FileCheck,
} from "lucide-react";

interface SyntheticPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetType: string;
  previewData: any;
  loading: boolean;
  onRegenerate?: () => void;
  industryName?: any;
  professionName?: any;
}

export function SyntheticPreviewModal({
  isOpen,
  onClose,
  datasetType,
  previewData,
  loading,
  onRegenerate,
  industryName,
  professionName,
}: SyntheticPreviewModalProps) {
  const [viewMode, setViewMode] = useState<"card" | "json">("card");
  const [copied, setCopied] = useState(false);
  const [jsonSearch, setJsonSearch] = useState("");

  const formatDisplayName = (val: any): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      return val.nameTh || val.name || val.key || val.id || "";
    }
    return String(val);
  };

  const safeStr = (val: any): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (typeof val === "object") {
      return val.nameTh || val.name || val.title || val.label || val.value || JSON.stringify(val);
    }
    return String(val);
  };

  const displayIndustry = formatDisplayName(industryName) || "Industry";
  const displayProfession = formatDisplayName(professionName) || "Profession";

  const jsonString = useMemo(() => {
    if (!previewData) return "";
    return JSON.stringify(previewData, null, 2);
  }, [previewData]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!jsonString) return;
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!jsonString) return;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `synthetic_${datasetType}_preview.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDatasetTypeLabel = (type: string) => {
    switch (type) {
      case "profile":
        return "Professional Profile (โปรไฟล์วิชาชีพ)";
      case "resume":
        return "Resume / CV (เรซูเมฉบับเต็ม)";
      case "academic_cv":
        return "Academic CV (ซีวีวิชาการ & วิจัย)";
      case "interview_question":
        return "Interview Question (คำถามสัมภาษณ์)";
      case "interview_answer":
        return "Interview Answer (คำตอบสัมภาษณ์ตามเกรด)";
      case "rubric_evaluation":
        return "Rubric Evaluation (เกณฑ์ประเมิน)";
      case "portfolio":
        return "Portfolio Case Study (แฟ้มผลงานกรณีศึกษา)";
      case "supporting_doc":
        return "Supporting Document (เอกสารประกอบ)";
      case "feedback":
        return "Feedback & Coaching (รายงานฟีดแบ็ก)";
      case "scenario":
        return "Scenario Dilemma (สถานการณ์จำลอง)";
      default:
        return type.toUpperCase();
    }
  };

  // Helper for initials
  const getInitials = (name: any) => {
    const s = safeStr(name);
    if (!s) return "SYN";
    return s
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden font-sans animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-purple-200" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  Live Preview: {getDatasetTypeLabel(datasetType)}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
                  v2.0 Synthetic
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Zero PII
                </span>
              </div>

              <div className="text-xs text-slate-500 truncate mt-0.5 font-medium flex items-center gap-1.5">
                <span>{displayIndustry}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">{displayProfession}</span>
              </div>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("card")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "card"
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="มุมมองจำลองการ์ดที่อ่านง่าย (Visual Card)"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>จำลองการ์ด</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("json")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "json"
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="มุมมองโค้ด JSON สากล (Raw JSON)"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>โค้ด JSON</span>
              </button>
            </div>

            {/* Regenerate Button */}
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                disabled={loading}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition disabled:opacity-50"
                title="สุ่มสร้างตัวอย่างใหม่ทันที"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>สุ่มใหม่</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60">
          {loading ? (
            <div className="py-24 text-center text-slate-400 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto animate-pulse">
                <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">กำลังเรียก AI Service สังเคราะห์ข้อมูล...</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ประกอบโครงสร้างตาม Pydantic Schema และ Taxonomy 15 อุตสาหกรรม
                </p>
              </div>
            </div>
          ) : !previewData ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-medium">ไม่พบข้อมูลตัวอย่าง</p>
            </div>
          ) : viewMode === "json" ? (
            /* RAW JSON VIEW */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={jsonSearch}
                    onChange={(e) => setJsonSearch(e.target.value)}
                    placeholder="ค้นหาคีย์เวิร์ดใน JSON..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-indigo-500 shadow-2xs"
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {jsonString.split("\n").length} บรรทัด • {(jsonString.length / 1024).toFixed(1)} KB
                </span>
              </div>

              <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 leading-relaxed max-h-[500px]">
                <pre className="whitespace-pre-wrap">{jsonString}</pre>
              </div>
            </div>
          ) : (
            /* VISUAL CARD VIEW (TAILORED FOR DATASET TYPE) */
            <div className="space-y-5">
              {/* Profile / Resume / Academic CV Render */}
              {(datasetType === "profile" || datasetType === "resume" || datasetType === "academic_cv") && (
                <div className="space-y-4">
                  {/* Candidate Identity Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0">
                          {getInitials(previewData.full_name || previewData.name)}
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-slate-900">
                            {safeStr(previewData.full_name || previewData.name) || "Candidate Name"}
                          </h2>
                          <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                            {safeStr(previewData.headline) || `${displayProfession} (${safeStr(previewData.seniority_level) || "Professional"})`}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                            {previewData.nationality && (
                              <span>สัญชาติ: <strong>{safeStr(previewData.nationality)}</strong></span>
                            )}
                            {previewData.age_range && (
                              <span>ช่วงอายุ: <strong>{safeStr(previewData.age_range)}</strong></span>
                            )}
                            {previewData.experience_years && (
                              <span>ประสบการณ์: <strong className="text-slate-800">{safeStr(previewData.experience_years)} ปี</strong></span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1 text-[11px] text-slate-500 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                        {previewData.contact_info?.email && (
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{safeStr(previewData.contact_info.email)}</span>
                          </div>
                        )}
                        {previewData.contact_info?.phone && (
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{safeStr(previewData.contact_info.phone)}</span>
                          </div>
                        )}
                        {previewData.contact_info?.location && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{safeStr(previewData.contact_info.location)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {previewData.professional_summary && (
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                          <Quote className="w-3.5 h-3.5 text-indigo-600" /> บทคัดย่อประวัติการทำงาน (Professional Summary)
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          {safeStr(previewData.professional_summary)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Skills Cloud */}
                  {Array.isArray(previewData.skills) && previewData.skills.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                        ทักษะและความเชี่ยวชาญเฉพาะทาง ({previewData.skills.length} ทักษะ)
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {previewData.skills.map((skill: any, idx: number) => {
                          const skillName = typeof skill === "string" ? skill : (skill?.name || skill?.skill_name || skill?.title || safeStr(skill));
                          return (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50/70 text-indigo-800 border border-indigo-200/80 flex items-center gap-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span>{safeStr(skillName)}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Work Experience */}
                  {Array.isArray(previewData.work_experience) && previewData.work_experience.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                        ประวัติการทำงานและผลงานเชิงประจักษ์ ({previewData.work_experience.length} แห่ง)
                      </div>

                      <div className="space-y-3 divide-y divide-slate-100">
                        {previewData.work_experience.map((exp: any, idx: number) => (
                          <div key={idx} className={idx > 0 ? "pt-3 space-y-2" : "space-y-2"}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <div>
                                <span className="font-bold text-xs text-slate-900">
                                  {safeStr(exp.role_title || exp.title)}
                                </span>
                                <span className="text-slate-400 mx-1.5">•</span>
                                <span className="font-semibold text-xs text-indigo-700">
                                  {safeStr(exp.company_or_organization || exp.company)}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{safeStr(exp.start_date)} - {safeStr(exp.end_date) || "Present"}</span>
                              </div>
                            </div>

                            {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed pl-1">
                                {exp.responsibilities.map((r: any, rIdx: number) => (
                                  <li key={rIdx}>{safeStr(r)}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {Array.isArray(previewData.education) && previewData.education.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        ประวัติการศึกษา ({previewData.education.length} รายการ)
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {previewData.education.map((edu: any, idx: number) => (
                          <div key={idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                            <div className="font-bold text-xs text-slate-900">{safeStr(edu.degree)}</div>
                            <div className="text-xs text-slate-600 font-medium">{safeStr(edu.institution)}</div>
                            <div className="flex items-center gap-2 pt-1 text-[11px]">
                              {edu.gpa && (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold font-mono">
                                  GPA {safeStr(edu.gpa)}
                                </span>
                              )}
                              {edu.graduation_year && (
                                <span className="text-slate-500">ปีที่จบ: {safeStr(edu.graduation_year)}</span>
                              )}
                              {edu.honors && (
                                <span className="text-purple-700 font-semibold">{safeStr(edu.honors)}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Publications or Research (for academic CV) */}
                  {Array.isArray(previewData.publications_or_research) && previewData.publications_or_research.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                        ผลงานวิจัยและบทความตีพิมพ์ทางวิชาการ ({previewData.publications_or_research.length} เรื่อง)
                      </div>
                      <div className="space-y-1.5">
                        {previewData.publications_or_research.map((pub: any, pIdx: number) => (
                          <div key={pIdx} className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-purple-950 font-medium flex items-start gap-2">
                            <span className="font-bold text-purple-600">[{pIdx + 1}]</span>
                            <span>{safeStr(pub)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Interview Question Render */}
              {datasetType === "interview_question" && (
                <div className="space-y-4">
                  {/* Main Question Hero */}
                  <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-white rounded-2xl border border-purple-200 p-6 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-purple-600" /> คำถามสัมภาษณ์ (Question Text)
                      </span>
                      <div className="flex items-center gap-2">
                        {previewData.difficulty && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            ระดับ: {safeStr(previewData.difficulty)}
                          </span>
                        )}
                        {previewData.category && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                            {safeStr(previewData.category)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      &quot;{safeStr(previewData.question)}&quot;
                    </div>

                    {previewData.question_th && (
                      <div className="text-xs sm:text-sm text-slate-600 italic pt-1 border-t border-purple-100">
                        {safeStr(previewData.question_th)}
                      </div>
                    )}
                  </div>

                  {/* Intent & Competencies */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {previewData.intent_and_objective && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-indigo-600" /> วัตถุประสงค์การวัดผล (Intent & Objective)
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {safeStr(previewData.intent_and_objective)}
                        </p>
                      </div>
                    )}

                    {Array.isArray(previewData.competencies_evaluated) && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-600" /> สมรรถนะที่ประเมิน (Competencies)
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {previewData.competencies_evaluated.map((comp: any, i: number) => (
                            <span key={i} className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {safeStr(comp)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Side-by-Side: What to Look For vs Red Flags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.isArray(previewData.key_points_to_look_for) && (
                      <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5 shadow-2xs space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> จุดเด่นที่ควรมองหา (Key Points to Look For)
                        </div>
                        <ul className="list-disc list-inside space-y-1.5 text-xs text-emerald-950 leading-relaxed pl-1">
                          {previewData.key_points_to_look_for.map((pt: any, i: number) => (
                            <li key={i}>{safeStr(pt)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(previewData.red_flags) && (
                      <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-5 shadow-2xs space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-600" /> สัญญาณเตือนที่ต้องระวัง (Red Flags)
                        </div>
                        <ul className="list-disc list-inside space-y-1.5 text-xs text-rose-950 leading-relaxed pl-1">
                          {previewData.red_flags.map((rf: any, i: number) => (
                            <li key={i}>{safeStr(rf)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Sample Follow Ups */}
                  {Array.isArray(previewData.sample_follow_ups) && previewData.sample_follow_ups.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> คำถามเจาะลึกเพิ่มเติม (Sample Follow-ups)
                      </div>
                      <div className="space-y-1.5">
                        {previewData.sample_follow_ups.map((fu: any, i: number) => (
                          <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium flex items-start gap-2">
                            <span className="font-bold text-indigo-600">Q{i + 1}:</span>
                            <span>{safeStr(fu)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Interview Answer Render */}
              {datasetType === "interview_answer" && (
                <div className="space-y-4">
                  {/* Quality & Framework Banner */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ระดับคุณภาพคำตอบ</div>
                        <div className="text-base font-black text-slate-900 flex items-center gap-2">
                          <span>{safeStr(previewData.answer_quality) || "Excellent"}</span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {safeStr(previewData.candidate_level) || "Professional"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {previewData.structure_framework_used && (
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-500 block">โครงสร้างการตอบ:</span>
                        <span className="text-xs font-bold text-purple-700 font-mono">
                          {safeStr(previewData.structure_framework_used)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Question Reference */}
                  {previewData.question && (
                    <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">คำถามที่ตอบ (Question):</span>
                      <p className="font-semibold text-slate-900">&quot;{safeStr(previewData.question)}&quot;</p>
                    </div>
                  )}

                  {/* Answer Text Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-indigo-600" /> คำตอบของผู้สมัคร (Candidate Answer)
                    </div>
                    <div className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap p-4 bg-slate-50/60 rounded-xl border border-slate-200/80">
                      {safeStr(previewData.answer_text)}
                    </div>

                    {previewData.answer_text_th && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 italic">
                        {safeStr(previewData.answer_text_th)}
                      </div>
                    )}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.isArray(previewData.key_strengths) && (
                      <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5 shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> จุดเด่นของคำตอบ (Key Strengths)
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-emerald-950">
                          {previewData.key_strengths.map((str: any, i: number) => (
                            <li key={i}>{safeStr(str)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(previewData.weaknesses_or_gaps) && (
                      <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-5 shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" /> จุดที่ต้องพัฒนา (Gaps / Weaknesses)
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-amber-950">
                          {previewData.weaknesses_or_gaps.map((w: any, i: number) => (
                            <li key={i}>{safeStr(w)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rubric / Scenario / Feedback / Fallback Visualizer */}
              {datasetType !== "profile" &&
                datasetType !== "resume" &&
                datasetType !== "academic_cv" &&
                datasetType !== "interview_question" &&
                datasetType !== "interview_answer" && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      โครงสร้างข้อมูลสังเคราะห์แบบกำหนดรูปแบบ ({datasetType})
                    </div>

                    <div className="space-y-3">
                      {Object.entries(previewData).map(([key, value]) => {
                        if (key === "metadata") return null;
                        return (
                          <div key={key} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider font-mono">
                              {key.replace(/_/g, " ")}
                            </span>
                            <div className="text-xs text-slate-800 font-sans">
                              {typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? (
                                String(value)
                              ) : Array.isArray(value) ? (
                                <ul className="list-disc list-inside space-y-0.5 pt-1">
                                  {value.map((item, idx) => (
                                    <li key={idx}>
                                      {typeof item === "string" ? item : JSON.stringify(item)}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <pre className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-200 overflow-x-auto">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 rounded-b-3xl">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Pydantic Schema Compliant • Provenance Tracked • 100% Synthetic</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "คัดลอกแล้ว" : "คัดลอก JSON"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>ดาวน์โหลด</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}