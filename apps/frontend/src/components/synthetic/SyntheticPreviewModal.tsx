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

  // Normalize previewData: safely parse stringified JSON and unwrap nested response structures
  const normalizedData = useMemo(() => {
    if (!previewData) return null;
    let data = previewData;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        return { rawString: data };
      }
    }
    if (data && typeof data === "object") {
      if (data.previewItem && typeof data.previewItem === "object") {
        data = data.previewItem;
      } else if (data.structuredData && typeof data.structuredData === "object") {
        data = data.structuredData;
      } else if (
        data.content &&
        typeof data.content === "object" &&
        !data.personal_info &&
        !data.question &&
        !data.project_title
      ) {
        data = data.content;
      } else if (
        data.data &&
        typeof data.data === "object" &&
        !data.personal_info &&
        !data.question &&
        !data.project_title
      ) {
        data = data.data;
      }
    }
    return data;
  }, [previewData]);

  const jsonString = useMemo(() => {
    if (!normalizedData) return "";
    return JSON.stringify(normalizedData, null, 2);
  }, [normalizedData]);

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

  // Helper for candidate initials (supports Thai & English)
  const getInitials = (name: any) => {
    const s = safeStr(name);
    if (!s || s === "Candidate Name" || s === "SYN") return "CV";
    // Check Thai characters first
    const thaiMatches = s.match(/[\u0E01-\u0E2E]/g);
    if (thaiMatches && thaiMatches.length >= 2) {
      return thaiMatches[0] + thaiMatches[1];
    }
    const parts = s.split(/[\s()]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return s.slice(0, 2).toUpperCase();
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
          ) : !normalizedData ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-medium">ไม่พบข้อมูลตัวอย่าง</p>
            </div>
          ) : normalizedData.error ? (
            <div className="py-12 px-6 text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
                <AlertTriangle className="w-7 h-7 text-rose-500" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-slate-900">ไม่สามารถสังเคราะห์ข้อมูลตัวอย่างได้</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {safeStr(normalizedData.message) || "เกิดข้อผิดพลาดในการติดต่อ AI Service หรือโครงสร้างข้อมูลไม่สมบูรณ์"}
                </p>
              </div>
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>ลองสุ่มสร้างใหม่อีกครั้ง</span>
                </button>
              )}
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
              {(datasetType === "profile" || datasetType === "resume" || datasetType === "academic_cv") && (() => {
                const candidateName =
                  safeStr(
                    normalizedData.personal_info?.candidate_name ||
                    normalizedData.personal_info?.full_name ||
                    normalizedData.personal_info?.name ||
                    normalizedData.candidate_name ||
                    normalizedData.full_name ||
                    normalizedData.name
                  ) || `${displayProfession} Candidate`;

                const headline =
                  safeStr(
                    normalizedData.headline ||
                    normalizedData.academic_title ||
                    normalizedData.personal_info?.position ||
                    normalizedData.personal_info?.headline ||
                    normalizedData.position
                  ) || `${displayProfession} (${safeStr(normalizedData.metadata?.seniority_level || normalizedData.seniority_level) || "Professional"})`;

                const email = safeStr(
                  normalizedData.personal_info?.email ||
                  normalizedData.contact_info?.email ||
                  normalizedData.email
                );

                const phone = safeStr(
                  normalizedData.personal_info?.phone ||
                  normalizedData.contact_info?.phone ||
                  normalizedData.phone
                );

                const location = safeStr(
                  normalizedData.personal_info?.city ||
                  normalizedData.personal_info?.location ||
                  normalizedData.contact_info?.location ||
                  normalizedData.location ||
                  normalizedData.city
                );

                const nationalityOrOrigin = safeStr(
                  normalizedData.personal_info?.cultural_background ||
                  normalizedData.nationality ||
                  normalizedData.personal_info?.nationality ||
                  normalizedData.cultural_background
                );

                const ageRange = safeStr(
                  normalizedData.age_range ||
                  normalizedData.personal_info?.age_range
                );

                const experienceYears = safeStr(
                  normalizedData.experience_years ||
                  normalizedData.personal_info?.experience_years
                );

                const summary = safeStr(
                  normalizedData.profile_summary ||
                  normalizedData.professional_summary ||
                  normalizedData.academic_profile ||
                  normalizedData.summary ||
                  normalizedData.bio
                );

                const workExperience = Array.isArray(normalizedData.work_history)
                  ? normalizedData.work_history
                  : Array.isArray(normalizedData.work_experience)
                  ? normalizedData.work_experience
                  : Array.isArray(normalizedData.research_experience)
                  ? normalizedData.research_experience
                  : [];

                const educationList = Array.isArray(normalizedData.education_history)
                  ? normalizedData.education_history
                  : Array.isArray(normalizedData.education)
                  ? normalizedData.education
                  : [];

                const projectsList = Array.isArray(normalizedData.projects_or_initiatives)
                  ? normalizedData.projects_or_initiatives
                  : Array.isArray(normalizedData.projects)
                  ? normalizedData.projects
                  : [];

                const certsList = Array.isArray(normalizedData.certifications_and_licenses)
                  ? normalizedData.certifications_and_licenses
                  : Array.isArray(normalizedData.certifications)
                  ? normalizedData.certifications
                  : [];

                const pubList = Array.isArray(normalizedData.peer_reviewed_publications)
                  ? normalizedData.peer_reviewed_publications
                  : Array.isArray(normalizedData.publications_and_patents)
                  ? normalizedData.publications_and_patents
                  : Array.isArray(normalizedData.publications_or_research)
                  ? normalizedData.publications_or_research
                  : [];

                const awardsList = Array.isArray(normalizedData.honors_awards)
                  ? normalizedData.honors_awards
                  : Array.isArray(normalizedData.awards)
                  ? normalizedData.awards
                  : Array.isArray(normalizedData.academic_honors_and_awards)
                  ? normalizedData.academic_honors_and_awards
                  : [];

                const skillsBreakdown = normalizedData.skills_breakdown;
                const flatSkills = Array.isArray(normalizedData.skills)
                  ? normalizedData.skills
                  : Array.isArray(normalizedData.technical_and_research_skills)
                  ? normalizedData.technical_and_research_skills
                  : [];

                return (
                  <div className="space-y-4">
                    {/* Candidate Identity Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0">
                            {getInitials(candidateName)}
                          </div>
                          <div>
                            <h2 className="text-lg font-black text-slate-900">
                              {candidateName}
                            </h2>
                            <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                              {headline}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                              {nationalityOrOrigin && (
                                <span>สัญชาติ/ภูมิหลัง: <strong>{nationalityOrOrigin}</strong></span>
                              )}
                              {ageRange && (
                                <span>ช่วงอายุ: <strong>{ageRange}</strong></span>
                              )}
                              {experienceYears && (
                                <span>ประสบการณ์: <strong className="text-slate-800">{experienceYears} ปี</strong></span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-1 text-[11px] text-slate-500 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                          {email && (
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{email}</span>
                            </div>
                          )}
                          {phone && (
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{phone}</span>
                            </div>
                          )}
                          {location && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Summary */}
                      {summary && (
                        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                            <Quote className="w-3.5 h-3.5 text-indigo-600" /> บทคัดย่อประวัติการทำงาน / สรุปประวัติ (Professional Summary)
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-normal">
                            {summary}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Research Interests (for Academic CV) */}
                    {Array.isArray(normalizedData.research_interests) && normalizedData.research_interests.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-indigo-600" />
                          หัวข้อและความสนใจการวิจัย (Research Interests)
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {normalizedData.research_interests.map((ri: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200"
                            >
                              {safeStr(ri)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Categorized Skills Breakdown (for Resume / CV) */}
                    {skillsBreakdown && typeof skillsBreakdown === "object" && !Array.isArray(skillsBreakdown) && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-600" />
                          การจำแนกทักษะและความเชี่ยวชาญ (Skills Breakdown by Category)
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(skillsBreakdown).map(([category, sList]: [string, any], cIdx) => (
                            <div key={cIdx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                                {category}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(sList) && sList.map((skill: any, sIdx: number) => (
                                  <span
                                    key={sIdx}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs flex items-center gap-1"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    <span>{safeStr(skill)}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Flat Skills Cloud (for Profile / Academic CV) */}
                    {(!skillsBreakdown || typeof skillsBreakdown !== "object" || Array.isArray(skillsBreakdown)) && flatSkills.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-600" />
                          ทักษะและความเชี่ยวชาญเฉพาะทาง ({flatSkills.length} ทักษะ)
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {flatSkills.map((skill: any, idx: number) => {
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

                    {/* Work Experience / History */}
                    {workExperience.length > 0 ? (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                          ประวัติการทำงานและผลงานเชิงประจักษ์ (Work Experience / History) ({workExperience.length} แห่ง)
                        </div>

                        <div className="space-y-3.5 divide-y divide-slate-100">
                          {workExperience.map((exp: any, idx: number) => {
                            const role = safeStr(exp.position || exp.role_title || exp.title || exp.role || "Professional");
                            const org = safeStr(exp.organization || exp.company_or_organization || exp.company || exp.institution);
                            const period = safeStr(exp.period || (exp.start_date ? `${exp.start_date} - ${exp.end_date || "Present"}` : ""));
                            const loc = safeStr(exp.location);
                            const bullets = Array.isArray(exp.bullet_points)
                              ? exp.bullet_points
                              : Array.isArray(exp.responsibilities)
                              ? exp.responsibilities
                              : exp.focus
                              ? [exp.focus]
                              : [];
                            const grants = safeStr(exp.grants_administered);

                            return (
                              <div key={idx} className={idx > 0 ? "pt-3.5 space-y-2" : "space-y-2"}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                  <div>
                                    <span className="font-bold text-xs text-slate-900">{role}</span>
                                    {org && (
                                      <>
                                        <span className="text-slate-400 mx-1.5">•</span>
                                        <span className="font-semibold text-xs text-indigo-700">{org}</span>
                                      </>
                                    )}
                                    {loc && (
                                      <span className="text-[11px] text-slate-400 ml-2">({loc})</span>
                                    )}
                                  </div>
                                  {period && (
                                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-slate-400" />
                                      <span>{period}</span>
                                    </div>
                                  )}
                                </div>

                                {grants && (
                                  <div className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 inline-block">
                                    งบประมาณวิจัย/ทุน: {grants}
                                  </div>
                                )}

                                {bullets.length > 0 && (
                                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed pl-1">
                                    {bullets.map((b: any, bIdx: number) => (
                                      <li key={bIdx}>{safeStr(b)}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>ผู้สมัครระดับเริ่มต้น / นิสิตนักศึกษาจบใหม่ (Entry-Level / Fresh Graduate) — ไม่มีประวัติงานเดิม เน้นผลงานโปรเจกต์เชิงประจักษ์และการศึกษา</span>
                      </div>
                    )}

                    {/* Projects & Initiatives */}
                    {projectsList.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-indigo-600" />
                          โครงการและผลงานริเริ่มสำคัญ (Projects & Initiatives) ({projectsList.length} โครงการ)
                        </div>

                        <div className="space-y-3">
                          {projectsList.map((proj: any, idx: number) => {
                            const pTitle = safeStr(proj.title || proj.project_title || `Project #${idx + 1}`);
                            const pRole = safeStr(proj.role || proj.candidate_role);
                            const pDesc = safeStr(proj.description || proj.overview || proj.problem_statement || proj.objective);
                            const pImpact = safeStr(proj.impact_metric || proj.impact || proj.results_and_impact);
                            const pTech = proj.technologies_or_tools || proj.technologies_used || proj.tools_and_technologies || [];

                            return (
                              <div key={idx} className="p-4 bg-gradient-to-r from-purple-50/30 via-indigo-50/20 to-white rounded-xl border border-indigo-100 space-y-2.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                                    <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span>{pTitle}</span>
                                  </h4>
                                  {pRole && (
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 self-start sm:self-auto">
                                      {pRole}
                                    </span>
                                  )}
                                </div>

                                {pDesc && (
                                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                    {pDesc}
                                  </p>
                                )}

                                {Array.isArray(pTech) && pTech.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">เครื่องมือ / Tech:</span>
                                    {pTech.map((t: any, tIdx: number) => (
                                      <span key={tIdx} className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white text-slate-700 border border-slate-200">
                                        {safeStr(t)}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {pImpact && (
                                  <div className="p-2.5 bg-emerald-50/80 rounded-lg border border-emerald-200 text-xs text-emerald-950 font-medium flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="text-emerald-900 font-bold">ผลกระทบเชิงประจักษ์ (Impact): </strong>
                                      <span>{pImpact}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Education History */}
                    {educationList.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                          ประวัติการศึกษา (Education History) ({educationList.length} รายการ)
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {educationList.map((edu: any, idx: number) => {
                            const degree = safeStr(edu.degree);
                            const inst = safeStr(edu.institution);
                            const period = safeStr(edu.period || (edu.graduation_year ? `ปีที่จบ: ${edu.graduation_year}` : ""));
                            const honors = safeStr(edu.honors);
                            const gpa = safeStr(edu.gpa);
                            const coursework = Array.isArray(edu.relevant_coursework) ? edu.relevant_coursework : [];
                            const dissertation = safeStr(edu.dissertation_title || edu.thesis_title);
                            const advisor = safeStr(edu.advisor);

                            return (
                              <div key={idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5">
                                <div className="font-bold text-xs text-slate-900">{degree}</div>
                                <div className="text-xs text-slate-600 font-medium">{inst}</div>
                                <div className="flex items-center gap-2 pt-0.5 text-[11px] flex-wrap">
                                  {gpa && (
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold font-mono">
                                      GPA {gpa}
                                    </span>
                                  )}
                                  {period && (
                                    <span className="text-slate-500">{period}</span>
                                  )}
                                  {honors && (
                                    <span className="text-purple-700 font-semibold">{honors}</span>
                                  )}
                                </div>
                                {dissertation && (
                                  <div className="text-[11px] text-slate-600 pt-1 italic border-t border-slate-200/60">
                                    <span className="font-semibold text-slate-700 not-italic">วิทยานิพนธ์: </span>
                                    &quot;{dissertation}&quot;
                                  </div>
                                )}
                                {advisor && (
                                  <div className="text-[11px] text-slate-500">
                                    อาจารย์ที่ปรึกษา: {advisor}
                                  </div>
                                )}
                                {coursework.length > 0 && (
                                  <div className="pt-1.5 flex flex-wrap gap-1">
                                    {coursework.map((cw: any, cwIdx: number) => (
                                      <span key={cwIdx} className="px-2 py-0.5 rounded-md text-[10px] bg-white text-slate-600 border border-slate-200">
                                        {safeStr(cw)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Certifications & Licenses */}
                    {certsList.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ใบประกอบวิชาชีพและประกาศนียบัตร (Certifications & Licenses) ({certsList.length} ใบ)
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {certsList.map((cert: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{safeStr(cert)}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Publications & Research */}
                    {pubList.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-purple-600" />
                          ผลงานตีพิมพ์ทางวิชาการและสิทธิบัตร (Publications & Patents) ({pubList.length} เรื่อง)
                        </div>
                        <div className="space-y-1.5">
                          {pubList.map((pub: any, pIdx: number) => {
                            if (typeof pub === "object" && pub !== null) {
                              return (
                                <div key={pIdx} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-purple-950 font-medium space-y-1">
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-purple-600">[{pIdx + 1}]</span>
                                    <span className="font-bold text-slate-900">{safeStr(pub.title)}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-[11px] text-purple-800 pl-5 flex-wrap">
                                    {pub.journal && <span>วารสาร: {safeStr(pub.journal)}</span>}
                                    {pub.year && <span>({safeStr(pub.year)})</span>}
                                    {pub.doi && <span className="font-mono text-slate-500">DOI: {safeStr(pub.doi)}</span>}
                                    {pub.citation_count !== undefined && (
                                      <span className="font-bold text-emerald-700">อ้างอิง: {safeStr(pub.citation_count)} ครั้ง</span>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div key={pIdx} className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-purple-950 font-medium flex items-start gap-2">
                                <span className="font-bold text-purple-600">[{pIdx + 1}]</span>
                                <span>{safeStr(pub)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Honors & Awards */}
                    {awardsList.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          รางวัลและเกียรติยศ (Honors & Awards) ({awardsList.length} รายการ)
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {awardsList.map((award: any, aIdx: number) => (
                            <span
                              key={aIdx}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>{safeStr(award)}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

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
                        {normalizedData.difficulty && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            ระดับ: {safeStr(normalizedData.difficulty)}
                          </span>
                        )}
                        {normalizedData.category && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                            {safeStr(normalizedData.category)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      &quot;{safeStr(normalizedData.question)}&quot;
                    </div>

                    {normalizedData.question_th && (
                      <div className="text-xs sm:text-sm text-slate-600 italic pt-1 border-t border-purple-100">
                        {safeStr(normalizedData.question_th)}
                      </div>
                    )}
                  </div>

                  {/* Intent & Competencies */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {normalizedData.intent_and_objective && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-indigo-600" /> วัตถุประสงค์การวัดผล (Intent & Objective)
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {safeStr(normalizedData.intent_and_objective)}
                        </p>
                      </div>
                    )}

                    {Array.isArray(normalizedData.competencies_evaluated) && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-600" /> สมรรถนะที่ประเมิน (Competencies)
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {normalizedData.competencies_evaluated.map((comp: any, i: number) => (
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
                    {Array.isArray(normalizedData.key_points_to_look_for) && (
                      <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5 shadow-2xs space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> จุดเด่นที่ควรมองหา (Key Points to Look For)
                        </div>
                        <ul className="list-disc list-inside space-y-1.5 text-xs text-emerald-950 leading-relaxed pl-1">
                          {normalizedData.key_points_to_look_for.map((pt: any, i: number) => (
                            <li key={i}>{safeStr(pt)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(normalizedData.red_flags) && (
                      <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-5 shadow-2xs space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-600" /> สัญญาณเตือนที่ต้องระวัง (Red Flags)
                        </div>
                        <ul className="list-disc list-inside space-y-1.5 text-xs text-rose-950 leading-relaxed pl-1">
                          {normalizedData.red_flags.map((rf: any, i: number) => (
                            <li key={i}>{safeStr(rf)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Sample Follow Ups */}
                  {Array.isArray(normalizedData.sample_follow_ups) && normalizedData.sample_follow_ups.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> คำถามเจาะลึกเพิ่มเติม (Sample Follow-ups)
                      </div>
                      <div className="space-y-1.5">
                        {normalizedData.sample_follow_ups.map((fu: any, i: number) => (
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
                          <span>{safeStr(normalizedData.answer_quality) || "Excellent"}</span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {safeStr(normalizedData.candidate_level) || "Professional"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {normalizedData.structure_framework_used && (
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-500 block">โครงสร้างการตอบ:</span>
                        <span className="text-xs font-bold text-purple-700 font-mono">
                          {safeStr(normalizedData.structure_framework_used)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Question Reference */}
                  {normalizedData.question && (
                    <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-500 uppercase text-[10px] block">คำถามที่ตอบ (Question):</span>
                      <p className="font-semibold text-slate-900">&quot;{safeStr(normalizedData.question)}&quot;</p>
                    </div>
                  )}

                  {/* Answer Text Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-indigo-600" /> คำตอบของผู้สมัคร (Candidate Answer)
                    </div>
                    <div className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap p-4 bg-slate-50/60 rounded-xl border border-slate-200/80">
                      {safeStr(normalizedData.answer_text)}
                    </div>

                    {normalizedData.answer_text_th && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 italic">
                        {safeStr(normalizedData.answer_text_th)}
                      </div>
                    )}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.isArray(normalizedData.key_strengths) && (
                      <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5 shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> จุดเด่นของคำตอบ (Key Strengths)
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-emerald-950">
                          {normalizedData.key_strengths.map((str: any, i: number) => (
                            <li key={i}>{safeStr(str)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Array.isArray(normalizedData.weaknesses_or_gaps) && (
                      <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-5 shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" /> จุดที่ต้องพัฒนา (Gaps / Weaknesses)
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-amber-950">
                          {normalizedData.weaknesses_or_gaps.map((w: any, i: number) => (
                            <li key={i}>{safeStr(w)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Portfolio Case Study Render */}
              {datasetType === "portfolio" && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-white rounded-2xl border border-purple-200 p-6 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-purple-600" /> แฟ้มสะสมผลงานกรณีศึกษา (Portfolio Case Study)
                      </span>
                      {normalizedData.project_category && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {safeStr(normalizedData.project_category)}
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                      {safeStr(normalizedData.project_title || "Project Case Study")}
                    </h2>

                    {normalizedData.overview && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
                        {safeStr(normalizedData.overview)}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-purple-100 flex-wrap font-medium">
                      {normalizedData.candidate_role && (
                        <span>บทบาท: <strong className="text-slate-800">{safeStr(normalizedData.candidate_role)}</strong></span>
                      )}
                      {normalizedData.team_composition && (
                        <span>ขนาดทีม: <strong className="text-slate-800">{safeStr(normalizedData.team_composition)}</strong></span>
                      )}
                      {normalizedData.project_duration && (
                        <span>ระยะเวลา: <strong className="text-slate-800">{safeStr(normalizedData.project_duration)}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Problem & Objectives */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {normalizedData.problem_statement && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> โจทย์ปัญหาและความท้าทาย (Problem Statement)
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {safeStr(normalizedData.problem_statement)}
                        </p>
                      </div>
                    )}

                    {Array.isArray(normalizedData.objectives) && normalizedData.objectives.length > 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-indigo-600" /> วัตถุประสงค์และเป้าหมาย (Key Objectives)
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed pl-1">
                          {normalizedData.objectives.map((obj: any, oIdx: number) => (
                            <li key={oIdx}>{safeStr(obj)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Tools & Tech */}
                  {Array.isArray(normalizedData.tools_and_technologies) && normalizedData.tools_and_technologies.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-600" /> เครื่องมือและเทคโนโลยีที่ใช้ (Tools & Tech)
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {normalizedData.tools_and_technologies.map((t: any, idx: number) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-800 border border-slate-200">
                            {safeStr(t)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Results & Impact */}
                  {Array.isArray(normalizedData.results_and_impact) && normalizedData.results_and_impact.length > 0 && (
                    <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5 shadow-2xs space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ผลลัพธ์และผลกระทบเชิงประจักษ์ (Results & Impact)
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-xs text-emerald-950 leading-relaxed pl-1">
                        {normalizedData.results_and_impact.map((res: any, rIdx: number) => (
                          <li key={rIdx}>{safeStr(res)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Supporting Document Render */}
              {datasetType === "supporting_doc" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                            {safeStr(normalizedData.document_type || "Certificate")}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> {safeStr(normalizedData.verification_status || "VERIFIED")}
                          </span>
                        </div>
                        <h2 className="text-lg font-black text-slate-900 mt-2">
                          {safeStr(normalizedData.document_title || "Official Supporting Document")}
                        </h2>
                        <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                          ผู้ออกเอกสาร: {safeStr(normalizedData.issuer_organization || "Accredited Body")}
                        </p>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1 font-mono sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                        <div>เลขทะเบียน: <strong className="text-slate-800">{safeStr(normalizedData.credential_id_or_number || "-")}</strong></div>
                        <div>วันที่ออก: <strong className="text-slate-800">{safeStr(normalizedData.issue_date || "-")}</strong></div>
                        {normalizedData.candidate_name && (
                          <div className="font-sans text-slate-700">ผู้ถือครอง: <strong>{safeStr(normalizedData.candidate_name)}</strong></div>
                        )}
                      </div>
                    </div>

                    {normalizedData.narrative_body && (
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">เนื้อหาเอกสารรับรอง (Narrative Body):</span>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                          {safeStr(normalizedData.narrative_body)}
                        </p>
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
                datasetType !== "interview_answer" &&
                datasetType !== "portfolio" &&
                datasetType !== "supporting_doc" && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      โครงสร้างข้อมูลสังเคราะห์แบบกำหนดรูปแบบ ({datasetType})
                    </div>

                    <div className="space-y-3">
                      {Object.entries(normalizedData).map(([key, value]) => {
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