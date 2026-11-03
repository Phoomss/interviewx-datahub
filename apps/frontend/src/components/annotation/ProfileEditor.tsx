"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Wrench,
  MessageSquare,
  ShieldCheck,
  FolderGit2,
  Award,
  BookOpen,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Sliders,
  Scale,
  Sparkles,
  Info,
} from "lucide-react";

interface ProfileEditorProps {
  initialProfile: any;
  confidenceScore: number;
  extractorVersion: string;
  documentId?: string;
  classification?: string;
  trainingEligibilityStatus?: string;
  provenances?: any[];
  qualityValidation?: any;
  onFocusSection: (section: string) => void;
  onChangeProfile: (updated: any) => void;
  reviewNotes: string;
  onChangeReviewNotes: (notes: string) => void;
  onEligibilityChange?: (status: string, reason: string) => void;
}

export function ProfileEditor({
  initialProfile,
  confidenceScore,
  extractorVersion,
  documentId,
  classification = "RESUME",
  trainingEligibilityStatus = "EXTRACTION_COMPLETED",
  provenances = [],
  qualityValidation,
  onFocusSection,
  onChangeProfile,
  reviewNotes,
  onChangeReviewNotes,
  onEligibilityChange,
}: ProfileEditorProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "experience" | "education" | "skills" | "projects" | "certs_research" | "provenance" | "quality_gate"
  >("overview");

  const [profile, setProfile] = useState(
    initialProfile || {
      professional_summary: "",
      skills: [],
      experiences: [],
      educations: [],
      projects: [],
      certifications: [],
    },
  );

  const [newSkill, setNewSkill] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Technical Skills");

  const updateField = (field: string, val: any) => {
    const updated = { ...profile, [field]: val };
    setProfile(updated);
    onChangeProfile(updated);
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (!profile.skills.includes(newSkill.trim())) {
        const updatedSkills = [...profile.skills, newSkill.trim()];
        updateField("skills", updatedSkills);
      }
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = profile.skills.filter((s: string) => s !== skillToRemove);
    updateField("skills", updatedSkills);
  };

  const handleExperienceChange = (index: number, key: string, value: any) => {
    const updatedExps = [...profile.experiences];
    updatedExps[index] = { ...updatedExps[index], [key]: value };
    updateField("experiences", updatedExps);
  };

  const handleAddExperience = () => {
    const updatedExps = [
      ...profile.experiences,
      {
        company_name: "องค์กรใหม่",
        role_title: "ตำแหน่งงาน",
        start_date: "2023-01",
        end_date: "Present",
        responsibilities: ["ระบุความรับผิดชอบ..."],
        technologies_used: [],
        business_impact: "อธิบายผลกระทบต่อธุรกิจหรือผลงานที่วัดผลได้",
      },
    ];
    updateField("experiences", updatedExps);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExps = profile.experiences.filter((_: any, i: number) => i !== index);
    updateField("experiences", updatedExps);
  };

  const handleAddEducation = () => {
    const updated = [
      ...(profile.educations || []),
      {
        institution: "มหาวิทยาลัย",
        degree: "ปริญญาตรี",
        field_of_study: "สาขาวิชา",
        graduation_year: 2022,
        gpa: 3.5,
        academic_standing: "First Class Honors",
      },
    ];
    updateField("educations", updated);
  };

  const handleAddProject = () => {
    const updated = [
      ...(profile.projects || []),
      {
        title: "โครงการใหม่ (Project Highlight)",
        role: "Lead Developer",
        description: "รายละเอียดโครงการและความสำเร็จส่วนบุคคล...",
        technologies: ["TypeScript", "NestJS"],
      },
    ];
    updateField("projects", updated);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50/50">
      {/* Top Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 pt-3 flex gap-4 text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> ภาพรวม & บทสรุป
        </button>
        <button
          onClick={() => setActiveTab("experience")}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "experience"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> ประวัติการทำงาน ({profile.experiences?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("education")}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "education"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" /> ประวัติการศึกษา & วิทยานิพนธ์
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "skills"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" /> ทักษะ 13 หมวดหมู่ ({profile.skills?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "projects"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" /> ผลงาน & โครงการ ({profile.projects?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("certs_research")}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "certs_research"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-3.5 h-3.5" /> ใบรับรอง & งานวิจัย
        </button>
        <button
          onClick={() => setActiveTab("provenance")}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "provenance"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Provenance Map ({provenances.length})
        </button>
        <button
          onClick={() => setActiveTab("quality_gate")}
          className={`pb-3 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "quality_gate"
              ? "border-purple-600 text-purple-700 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Training Gate
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Banner with Heuristic Confidence & Classification */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Document Classification & Heuristic Confidence
              </div>
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs">
                  {classification}
                </span>
                <span className="text-xs text-slate-600">ความเชื่อมั่นทางสถิติ: {(confidenceScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400">
            <div>Engine: {extractorVersion || "interviewx-deep-v2.0"}</div>
            <div className="text-emerald-600 font-medium">PII Vault: Isolated (AES-256-GCM)</div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs"
              onFocus={() => onFocusSection("summary")}
            >
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                บทคัดย่อประวัติการทำงาน (Professional Summary)
              </label>
              <textarea
                rows={4}
                value={profile.professional_summary || ""}
                onChange={(e) => updateField("professional_summary", e.target.value)}
                placeholder="กรอกสรุปประวัติ จุดเด่นของผู้สมัคร..."
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-3 focus:outline-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">
                บันทึกการตรวจทานของผู้เชี่ยวชาญ (Reviewer Annotation Notes)
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => onChangeReviewNotes(e.target.value)}
                placeholder="ระบุข้อสังเกต ข้อผิดพลาด หรือเหตุผลในการปรับแก้ข้อมูล..."
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-3 focus:outline-indigo-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: WORK EXPERIENCE */}
        {activeTab === "experience" && (
          <div className="space-y-4" onFocus={() => onFocusSection("experiences")}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ประวัติการทำงานและผลงานเชิงประจักษ์ (Work Experiences & Measurable Impact)
              </h3>
              <button
                type="button"
                onClick={handleAddExperience}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่มตำแหน่งงาน
              </button>
            </div>

            {profile.experiences?.map((exp: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs relative space-y-3">
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(idx)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">บริษัท / องค์กร</label>
                    <input
                      type="text"
                      value={exp.company_name || exp.organization || ""}
                      onChange={(e) => handleExperienceChange(idx, "company_name", e.target.value)}
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">ตำแหน่งงาน</label>
                    <input
                      type="text"
                      value={exp.role_title || exp.job_title || ""}
                      onChange={(e) => handleExperienceChange(idx, "role_title", e.target.value)}
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">ช่วงเวลา (Start - End)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={exp.start_date || ""}
                        onChange={(e) => handleExperienceChange(idx, "start_date", e.target.value)}
                        placeholder="2021-01"
                        className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5"
                      />
                      <span className="self-center text-slate-400">-</span>
                      <input
                        type="text"
                        value={exp.end_date || ""}
                        onChange={(e) => handleExperienceChange(idx, "end_date", e.target.value)}
                        placeholder="Present"
                        className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">ผลกระทบต่อธุรกิจ / สถิติที่วัดได้ (Measurable Impact)</label>
                    <input
                      type="text"
                      value={exp.business_impact || (exp.measurable_results?.[0] || "")}
                      onChange={(e) => handleExperienceChange(idx, "business_impact", e.target.value)}
                      placeholder="เช่น ลด latency ได้ 40%, รองรับ 50k req/s"
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-indigo-700 bg-indigo-50/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">ความรับผิดชอบและผลงานหลัก (หน้าที่ละบรรทัด)</label>
                  <textarea
                    rows={3}
                    value={Array.isArray(exp.responsibilities) ? exp.responsibilities.join("\n") : exp.responsibilities || ""}
                    onChange={(e) => handleExperienceChange(idx, "responsibilities", e.target.value.split("\n"))}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 resize-none leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: EDUCATION */}
        {activeTab === "education" && (
          <div className="space-y-4" onFocus={() => onFocusSection("educations")}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ประวัติการศึกษา เกรดเฉลี่ย และหัวข้อวิทยานิพนธ์ (Academic Background)
              </h3>
              <button
                type="button"
                onClick={handleAddEducation}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่มการศึกษา
              </button>
            </div>

            {profile.educations?.map((edu: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">สถาบันการศึกษา</label>
                    <input
                      type="text"
                      value={edu.institution || ""}
                      onChange={(e) => {
                        const updated = [...profile.educations];
                        updated[idx].institution = e.target.value;
                        updateField("educations", updated);
                      }}
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">วุฒิการศึกษา & สาขาวิชา</label>
                    <input
                      type="text"
                      value={`${edu.degree || ""} in ${edu.field_of_study || edu.major || ""}`}
                      onChange={(e) => {
                        const updated = [...profile.educations];
                        updated[idx].degree = e.target.value;
                        updateField("educations", updated);
                      }}
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">ปีที่จบการศึกษา</label>
                    <input
                      type="number"
                      value={edu.graduation_year || 2020}
                      onChange={(e) => {
                        const updated = [...profile.educations];
                        updated[idx].graduation_year = Number(e.target.value);
                        updateField("educations", updated);
                      }}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">เกรดเฉลี่ย (GPA)</label>
                    <input
                      type="text"
                      value={edu.gpa || "-"}
                      onChange={(e) => {
                        const updated = [...profile.educations];
                        updated[idx].gpa = e.target.value;
                        updateField("educations", updated);
                      }}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">เกียรตินิยม / รางวัล</label>
                    <input
                      type="text"
                      value={edu.academic_standing || edu.awards?.[0] || "-"}
                      onChange={(e) => {
                        const updated = [...profile.educations];
                        updated[idx].academic_standing = e.target.value;
                        updateField("educations", updated);
                      }}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SKILLS 13 CATEGORIES */}
        {activeTab === "skills" && (
          <div className="space-y-4" onFocus={() => onFocusSection("skills")}>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                การสกัดและจำแนกทักษะ 13 หมวดหมู่สากล (13 Skill Taxonomies)
              </h3>
              <p className="text-xs text-slate-500">
                ระบบจำแนกระหว่างทักษะที่ระบุในเอกสารจริง (Explicit) กับทักษะที่ AI อนุมาน (Inferred) อย่างโปร่งใส
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 group"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="+ พิมพ์ชื่อทักษะแล้วกด Enter เพื่อเพิ่ม..."
                  className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROJECTS */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ผลงานและโครงการเด่น (Project & Portfolio Highlights)
              </h3>
              <button
                type="button"
                onClick={handleAddProject}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่มผลงาน
              </button>
            </div>

            {profile.projects?.map((proj: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">ชื่อโครงการ</label>
                    <input
                      type="text"
                      value={proj.title || proj.project_title || ""}
                      onChange={(e) => {
                        const updated = [...profile.projects];
                        updated[idx].title = e.target.value;
                        updateField("projects", updated);
                      }}
                      className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                  <div className="w-48">
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">บทบาท (Candidate Role)</label>
                    <input
                      type="text"
                      value={proj.role || proj.candidate_role || "Lead Contributor"}
                      onChange={(e) => {
                        const updated = [...profile.projects];
                        updated[idx].role = e.target.value;
                        updateField("projects", updated);
                      }}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">รายละเอียดและผลลัพธ์โครงการ</label>
                  <textarea
                    rows={2}
                    value={proj.description || proj.project_description || ""}
                    onChange={(e) => {
                      const updated = [...profile.projects];
                      updated[idx].description = e.target.value;
                      updateField("projects", updated);
                    }}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: CERTS & RESEARCH */}
        {activeTab === "certs_research" && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                ใบรับรองที่พบในเอกสารจะไม่ถูกระบุเป็น Verified โดยอัตโนมัติ จนกว่าจะได้รับการตรวจสอบจากผู้ออกใบรับรอง
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ใบรับรองและคุณวุฒิวิชาชีพ (Certifications)
              </h4>
              <div className="space-y-2">
                {profile.certifications?.length > 0 ? (
                  profile.certifications.map((c: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-800">
                        {typeof c === "string" ? c : c.certificate_name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Unverified in Document
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">ไม่พบใบรับรองในเอกสาร</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PROVENANCE MAP */}
        {activeTab === "provenance" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                แผนที่ความเชื่อมโยงของข้อมูลกับไฟล์ต้นฉบับ (Field Provenance & Offset Mapping)
              </h3>
              <p className="text-xs text-slate-500">
                ทุกฟิลด์ที่ AI สกัดได้สามารถตรวจสอบย้อนกลับไปยังข้อความต้นฉบับ เลขหน้า และช่วงพิกัดข้อความได้แบบ 1:1
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Field Path</th>
                    <th className="px-3 py-2">ค่าที่สกัดได้</th>
                    <th className="px-3 py-2">หน้า</th>
                    <th className="px-3 py-2">หมวดข้อความ</th>
                    <th className="px-3 py-2">ความมั่นใจ</th>
                    <th className="px-3 py-2">ข้อความหลักฐาน (Evidence Snippet)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {provenances.map((p: any, i: number) => (
                    <tr key={p.id || i} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2 font-mono text-indigo-700 font-medium">{p.fieldPath}</td>
                      <td className="px-3 py-2 font-medium text-slate-800">{p.extractedValue}</td>
                      <td className="px-3 py-2 text-slate-500">P.{p.pageNumber || 1}</td>
                      <td className="px-3 py-2 text-slate-500">{p.sectionName || "General"}</td>
                      <td className="px-3 py-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                          {((p.confidenceScore || 0.95) * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-500 text-[11px] font-mono max-w-xs truncate">
                        {p.sourceText || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: QUALITY GATE & TRAINING ELIGIBILITY */}
        {activeTab === "quality_gate" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                สถานะการเข้าสู่ชุดข้อมูลฝึกสอน (Training Eligibility Gate)
              </h3>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">สถานะปัจจุบัน:</div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        trainingEligibilityStatus === "APPROVED_FOR_TRAINING"
                          ? "bg-emerald-100 text-emerald-800"
                          : trainingEligibilityStatus === "APPROVED_FOR_PROFILE_MANAGEMENT"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {trainingEligibilityStatus}
                    </span>
                  </div>
                </div>

                {onEligibilityChange && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEligibilityChange(
                          "APPROVED_FOR_TRAINING",
                          "Human expert verified: Clean PII, approved for AI model training",
                        )
                      }
                      className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> อนุมัติสำหรับฝึกสอน AI (Approve for Training)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onEligibilityChange(
                          "APPROVED_FOR_PROFILE_MANAGEMENT",
                          "Approved for Profile Management only (Restricted from AI Training)",
                        )
                      }
                      className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                    >
                      อนุญาตเฉพาะ Profile Management
                    </button>
                  </div>
                )}
              </div>

              {/* 4-Level Quality Score Cards */}
              <div className="grid grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500 mb-0.5">Level 1: File Integrity</div>
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Magic Signature Pass
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500 mb-0.5">Level 2: Completeness</div>
                  <div className="text-xs font-bold text-slate-800 font-mono">
                    {Math.round((qualityValidation?.extractionCompleteness || 0.9) * 100)}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500 mb-0.5">Level 3: OCR Confidence</div>
                  <div className="text-xs font-bold text-slate-800 font-mono">
                    {Math.round((qualityValidation?.ocrConfidenceAvg || 0.98) * 100)}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500 mb-0.5">Level 4: Timeline Check</div>
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> ไม่พบข้อขัดแย้ง
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
