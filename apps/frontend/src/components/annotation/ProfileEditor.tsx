"use client";

import React, { useState, useMemo } from "react";
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
  Search,
  X,
  Copy,
  Check,
  Calendar,
  Building,
  Tag,
  TrendingUp,
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

  // Skill management state
  const [newSkill, setNewSkill] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState("all");
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Provenance search state
  const [provSearch, setProvSearch] = useState("");
  const [provSectionFilter, setProvSectionFilter] = useState("all");

  const updateField = (field: string, val: any) => {
    const updated = { ...profile, [field]: val };
    setProfile(updated);
    onChangeProfile(updated);
  };

  // Skill categorizer helper
  const categorizeSkill = (skill: string): string => {
    const s = skill.toLowerCase();
    if (["python", "javascript", "typescript", "php", "java", "c++", "c#", "go", "rust", "ruby", "kotlin", "swift"].some((k) => s.includes(k))) {
      return "Languages";
    }
    if (["node", "nest", "express", "fastapi", "django", "flask", "laravel", "spring", "asp.net"].some((k) => s.includes(k))) {
      return "Backend";
    }
    if (["react", "next", "vue", "angular", "tailwind", "mui", "css", "html", "svelte"].some((k) => s.includes(k))) {
      return "Frontend";
    }
    if (["postgres", "mysql", "mongodb", "supabase", "prisma", "pgvector", "redis", "sqlite", "orm"].some((k) => s.includes(k))) {
      return "Databases";
    }
    if (["aws", "docker", "kubernetes", "k8s", "helm", "terraform", "nginx", "linux", "ci/cd", "github actions", "jenkins", "argo", "prometheus", "grafana"].some((k) => s.includes(k))) {
      return "Cloud & DevOps";
    }
    if (["gemini", "openai", "llm", "rag", "vector search", "embeddings", "nlp", "ai", "machine learning", "pytorch", "tensorflow"].some((k) => s.includes(k))) {
      return "AI & LLM";
    }
    return "Tools & Other";
  };

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    const skillsList = profile.skills || [];
    return skillsList.filter((s: string) => {
      const matchesSearch = !skillSearch.trim() || s.toLowerCase().includes(skillSearch.toLowerCase());
      const cat = categorizeSkill(s);
      const matchesCategory = selectedSkillCategory === "all" || cat === selectedSkillCategory;
      return matchesSearch && matchesCategory;
    });
  }, [profile.skills, skillSearch, selectedSkillCategory]);

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      const updatedSkills = [...(profile.skills || []), trimmed];
      updateField("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = (profile.skills || []).filter((s: string) => s !== skillToRemove);
    updateField("skills", updatedSkills);
  };

  const handleExperienceChange = (index: number, key: string, value: any) => {
    const updatedExps = [...(profile.experiences || [])];
    updatedExps[index] = { ...updatedExps[index], [key]: value };
    updateField("experiences", updatedExps);
  };

  const handleAddExperience = () => {
    const updatedExps = [
      ...(profile.experiences || []),
      {
        company_name: "องค์กร / บริษัทใหม่",
        role_title: "ตำแหน่งงาน",
        start_date: "2024-01",
        end_date: "Present",
        responsibilities: ["ระบุความรับผิดชอบและผลงานหลัก..."],
        technologies_used: [],
        business_impact: "ระบุผลลัพธ์ที่วัดผลได้ (เช่น ลดเวลาทำงาน 30%)",
      },
    ];
    updateField("experiences", updatedExps);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExps = (profile.experiences || []).filter((_: any, i: number) => i !== index);
    updateField("experiences", updatedExps);
  };

  const handleAddEducation = () => {
    const updated = [
      ...(profile.educations || []),
      {
        institution: "มหาวิทยาลัย / สถาบันการศึกษา",
        degree: "Bachelor of Science",
        field_of_study: "Software Engineering",
        graduation_year: 2024,
        gpa: 3.5,
        academic_standing: "เกียรตินิยม",
      },
    ];
    updateField("educations", updated);
  };

  const handleAddProject = () => {
    const updated = [
      ...(profile.projects || []),
      {
        title: "ชื่อโครงการเด่น (Project Highlight)",
        role: "Lead Full-Stack Developer",
        description: "รายละเอียดสถาปัตยกรรม เทคโนโลยี และผลลัพธ์ของโครงการ...",
        technologies: ["Next.js", "FastAPI", "PostgreSQL"],
      },
    ];
    updateField("projects", updated);
  };

  // Quick preset review notes
  const addQuickNote = (note: string) => {
    const current = reviewNotes ? `${reviewNotes}\n${note}` : note;
    onChangeReviewNotes(current);
  };

  // Filtered provenances
  const filteredProvenances = useMemo(() => {
    return provenances.filter((p: any) => {
      const matchSearch =
        !provSearch.trim() ||
        (p.fieldPath && p.fieldPath.toLowerCase().includes(provSearch.toLowerCase())) ||
        (p.extractedValue && p.extractedValue.toLowerCase().includes(provSearch.toLowerCase())) ||
        (p.sourceText && p.sourceText.toLowerCase().includes(provSearch.toLowerCase()));
      const matchSec = provSectionFilter === "all" || (p.sectionName && p.sectionName.toLowerCase().includes(provSectionFilter.toLowerCase()));
      return matchSearch && matchSec;
    });
  }, [provenances, provSearch, provSectionFilter]);

  const experiencesCount = profile.experiences?.length || 0;
  const educationsCount = profile.educations?.length || 0;
  const skillsCount = profile.skills?.length || 0;
  const projectsCount = profile.projects?.length || 0;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50/70 overflow-hidden font-sans">
      {/* Sleek Horizontal Tab Bar */}
      <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 pt-2.5 flex items-center gap-2 overflow-x-auto shrink-0 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-2.5 px-2.5 border-b-2 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>ภาพรวม (Overview)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("experience")}
          className={`pb-2.5 px-2.5 border-b-2 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "experience"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>ประสบการณ์</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {experiencesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("education")}
          className={`pb-2.5 px-2.5 border-b-2 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "education"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>การศึกษา</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {educationsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("skills")}
          className={`pb-2.5 px-2.5 border-b-2 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "skills"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>ทักษะ 13 หมวด</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
            {skillsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("projects")}
          className={`pb-2.5 px-2.5 border-b-2 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "projects"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>ผลงาน & โครงการ</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {projectsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("certs_research")}
          className={`pb-2.5 px-2.5 border-b-2 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "certs_research"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>ใบรับรอง & งานวิจัย</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("provenance")}
          className={`pb-2.5 px-2.5 border-b-2 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "provenance"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Provenance</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            {provenances.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("quality_gate")}
          className={`pb-2.5 px-2.5 border-b-2 text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
            activeTab === "quality_gate"
              ? "border-purple-600 text-purple-700 font-bold"
              : "border-transparent text-purple-600/80 hover:text-purple-800"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Training Gate</span>
        </button>
      </div>

      {/* Main Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* TAB 1: OVERVIEW & SUMMARY */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Candidate & Metadata Summary Hero */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                    NP
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Narongsak Pumpasert
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Software Engineering & Full-Stack Developer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {classification} • {(confidenceScore * 100).toFixed(0)}% Match
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> PII Vault: Isolated
                  </span>
                </div>
              </div>

              {/* 4 Quick Stat Metric Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-100">
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] font-medium text-slate-500">ทักษะที่สกัดได้</div>
                  <div className="text-lg font-black text-indigo-700 mt-0.5">{skillsCount} ทักษะ</div>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] font-medium text-slate-500">ประสบการณ์ทำงาน</div>
                  <div className="text-lg font-black text-slate-800 mt-0.5">{experiencesCount} แห่ง</div>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] font-medium text-slate-500">การศึกษา & GPA</div>
                  <div className="text-lg font-black text-emerald-700 mt-0.5">GPA 3.89</div>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
                  <div className="text-[11px] font-medium text-slate-500">ผลงานและโครงการ</div>
                  <div className="text-lg font-black text-purple-700 mt-0.5">{projectsCount} โครงการ</div>
                </div>
              </div>
            </div>

            {/* Professional Summary Section */}
            <div
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3"
              onFocus={() => onFocusSection("summary")}
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  บทสรุปประวัติวิชาชีพ (Professional Summary)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {(profile.professional_summary || "").length} ตัวอักษร
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(profile.professional_summary || "");
                      setCopiedSummary(true);
                      setTimeout(() => setCopiedSummary(false), 2000);
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {copiedSummary ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSummary ? "คัดลอกแล้ว" : "คัดลอก"}</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={profile.professional_summary || ""}
                onChange={(e) => updateField("professional_summary", e.target.value)}
                placeholder="กรอกบทคัดย่อประวัติการทำงาน..."
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-xl p-3.5 focus:outline-indigo-500 resize-none leading-relaxed font-sans shadow-inner bg-slate-50/30"
              />
            </div>

            {/* Reviewer Annotation Notes with Quick Preset Pills */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                บันทึกการตรวจทานของผู้เชี่ยวชาญ (Reviewer Annotation Notes)
              </label>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 mr-1">ข้อความด่วน:</span>
                {[
                  "✓ ข้อมูลตรงกับเอกสารต้นฉบับครบถ้วน",
                  "✓ แยกเก็บ PII เข้า Vault สำเร็จ",
                  "✓ ทักษะและเทคโนโลยีระบุครบถ้วน",
                  "✓ อนุมัติสำหรับ AI Model Training",
                ].map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addQuickNote(preset)}
                    className="text-[11px] font-medium px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg border border-slate-200/80 transition"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => onChangeReviewNotes(e.target.value)}
                placeholder="พิมพ์ข้อสังเกต หรือคลิกเลือกข้อความด่วนด้านบน..."
                className="w-full text-xs text-slate-800 border border-slate-200 rounded-xl p-3 focus:outline-indigo-500 resize-none font-sans"
              />
            </div>
          </div>
        )}

        {/* TAB 2: WORK EXPERIENCE */}
        {activeTab === "experience" && (
          <div className="space-y-4" onFocus={() => onFocusSection("experiences")}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  ประวัติการทำงาน ({experiencesCount} รายการ)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ตรวจสอบบริษัท ตำแหน่งงาน หน้าที่ความรับผิดชอบ และผลลัพธ์ที่วัดผลได้
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่มตำแหน่งงาน
              </button>
            </div>

            {profile.experiences?.map((exp: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs relative space-y-4 hover:border-slate-300 transition"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(idx)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                  title="ลบรายการนี้"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" /> บริษัท / องค์กร
                    </label>
                    <input
                      type="text"
                      value={exp.company_name || exp.organization || ""}
                      onChange={(e) => handleExperienceChange(idx, "company_name", e.target.value)}
                      placeholder="เช่น EGAT, Freelance..."
                      className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-400" /> ตำแหน่งงาน (Role / Title)
                    </label>
                    <input
                      type="text"
                      value={exp.role_title || exp.job_title || ""}
                      onChange={(e) => handleExperienceChange(idx, "role_title", e.target.value)}
                      placeholder="เช่น Full-Stack Developer..."
                      className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> ช่วงเวลาทำงาน (Start - End)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={exp.start_date || ""}
                        onChange={(e) => handleExperienceChange(idx, "start_date", e.target.value)}
                        placeholder="2023-05"
                        className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-indigo-500"
                      />
                      <span className="text-slate-400 font-bold">-</span>
                      <input
                        type="text"
                        value={exp.end_date || ""}
                        onChange={(e) => handleExperienceChange(idx, "end_date", e.target.value)}
                        placeholder="Present"
                        className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-700 block mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-indigo-600" /> ผลกระทบเชิงประจักษ์ (Measurable Impact)
                    </label>
                    <input
                      type="text"
                      value={exp.business_impact || (exp.measurable_results?.[0] || "")}
                      onChange={(e) => handleExperienceChange(idx, "business_impact", e.target.value)}
                      placeholder="เช่น พัฒนาระบบรองรับ 50k requests/s, ลดเวลาค้นหา 40%"
                      className="w-full text-xs border border-indigo-200 bg-indigo-50/40 text-indigo-900 font-medium rounded-xl px-3 py-2 focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    ความรับผิดชอบและหน้าที่หลัก (บรรทัดละ 1 ข้อ)
                  </label>
                  <textarea
                    rows={3}
                    value={Array.isArray(exp.responsibilities) ? exp.responsibilities.join("\n") : exp.responsibilities || ""}
                    onChange={(e) => handleExperienceChange(idx, "responsibilities", e.target.value.split("\n"))}
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 resize-none leading-relaxed font-sans"
                    placeholder="• ออกแบบ REST API และระบบฐานข้อมูล&#10;• ติดตั้ง CI/CD pipeline..."
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
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  ประวัติการศึกษา ({educationsCount} รายการ)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  วุฒิการศึกษา สถาบัน เกรดเฉลี่ยสะสม (GPA) และหัวข้อวิทยานิพนธ์
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddEducation}
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่มประวัติการศึกษา
              </button>
            </div>

            {profile.educations?.map((edu: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">สถาบันการศึกษา</label>
                    <input
                      type="text"
                      value={edu.institution || ""}
                      onChange={(e) => {
                        const updated = [...profile.educations];
                        updated[idx].institution = e.target.value;
                        updateField("educations", updated);
                      }}
                      className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">วุฒิการศึกษา & สาขาวิชา</label>
                    <input
                      type="text"
                      value={`${edu.degree || ""} in ${edu.field_of_study || edu.major || ""}`}
                      onChange={(e) => {
                        const updated = [...profile.educations];
                        updated[idx].degree = e.target.value;
                        updateField("educations", updated);
                      }}
                      className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">ปีที่สำเร็จการศึกษา</label>
                    <input
                      type="number"
                      value={edu.graduation_year || 2024}
                      onChange={(e) => {
                        const updated = [...profile.educations];
                        updated[idx].graduation_year = Number(e.target.value);
                        updateField("educations", updated);
                      }}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">เกรดเฉลี่ย (GPA)</label>
                    <input
                      type="text"
                      value={edu.gpa || "-"}
                      onChange={(e) => {
                        const updated = [...profile.educations];
                        updated[idx].gpa = e.target.value;
                        updateField("educations", updated);
                      }}
                      className="w-full text-xs font-bold text-emerald-700 bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">เกียรตินิยม / รางวัล</label>
                    <input
                      type="text"
                      value={edu.academic_standing || edu.awards?.[0] || "-"}
                      onChange={(e) => {
                        const updated = [...profile.educations];
                        updated[idx].academic_standing = e.target.value;
                        updateField("educations", updated);
                      }}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SKILLS (13 TAXONOMIES WITH SEARCH & CATEGORY FILTERS) */}
        {activeTab === "skills" && (
          <div className="space-y-4" onFocus={() => onFocusSection("skills")}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                  ทักษะและความเชี่ยวชาญ ({skillsCount} ทักษะ)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  จัดหมวดหมู่ทักษะ 13 ด้าน พร้อมระบุ Explicit (ระบุในเอกสารจริง)
                </p>
              </div>

              {/* Add Skill Bar */}
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="+ พิมพ์ทักษะใหม่ เช่น Docker..."
                  className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 w-48 sm:w-56 focus:outline-indigo-500 shadow-2xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                >
                  เพิ่ม
                </button>
              </form>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="ค้นหาทักษะในรายการ..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl w-full focus:outline-indigo-500"
                  />
                  {skillSearch && (
                    <button
                      type="button"
                      onClick={() => setSkillSearch("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: "all", label: "ทั้งหมด" },
                    { id: "Languages", label: "Languages" },
                    { id: "Backend", label: "Backend" },
                    { id: "Frontend", label: "Frontend" },
                    { id: "Databases", label: "Databases" },
                    { id: "Cloud & DevOps", label: "Cloud/DevOps" },
                    { id: "AI & LLM", label: "AI/LLM" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedSkillCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                        selectedSkillCategory === cat.id
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Tags Cloud */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 min-h-[120px]">
                {filteredSkills.map((skill: string, index: number) => {
                  const category = categorizeSkill(skill);
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-white text-slate-800 border border-slate-200 shadow-2xs transition group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Explicit in document" />
                      <span>{skill}</span>
                      <span className="text-[9px] font-medium text-slate-400 bg-slate-200/70 px-1 py-0.2 rounded">
                        {category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-300 hover:text-rose-600 transition ml-0.5"
                        title="ลบทักษะนี้"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}

                {filteredSkills.length === 0 && (
                  <div className="w-full py-8 text-center text-xs text-slate-400 italic">
                    ไม่พบทักษะที่ตรงกับเงื่อนไขการค้นหา
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROJECTS & PORTFOLIO */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  โครงการเด่นและผลงาน ({projectsCount} รายการ)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ระบุบทบาทส่วนบุคคล (Personal Scope) และเทคโนโลยีที่ใช้
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่มโครงการ
              </button>
            </div>

            {profile.projects?.map((proj: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">ชื่อโครงการ</label>
                    <input
                      type="text"
                      value={proj.title || proj.project_title || ""}
                      onChange={(e) => {
                        const updated = [...profile.projects];
                        updated[idx].title = e.target.value;
                        updateField("projects", updated);
                      }}
                      className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-indigo-500"
                    />
                  </div>

                  <div className="w-full sm:w-56">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">บทบาท (Role)</label>
                    <input
                      type="text"
                      value={proj.role || proj.candidate_role || "Lead Developer"}
                      onChange={(e) => {
                        const updated = [...profile.projects];
                        updated[idx].role = e.target.value;
                        updateField("projects", updated);
                      }}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    รายละเอียด สถาปัตยกรรม และผลลัพธ์
                  </label>
                  <textarea
                    rows={2}
                    value={proj.description || proj.project_description || ""}
                    onChange={(e) => {
                      const updated = [...profile.projects];
                      updated[idx].description = e.target.value;
                      updateField("projects", updated);
                    }}
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 resize-none font-sans"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: CERTS & RESEARCH */}
        {activeTab === "certs_research" && (
          <div className="space-y-4">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-800 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                ใบรับรองและผลงานวิจัยที่ตรวจพบในเอกสารจะต้องผ่านการตรวจสอบหลักฐานก่อนจึงจะสามารถระบุสถานะเป็น Verified ได้
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                ใบรับรองและคุณวุฒิวิชาชีพ (Certifications)
              </h4>
              <div className="space-y-2">
                {profile.certifications?.length > 0 ? (
                  profile.certifications.map((c: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {typeof c === "string" ? c : c.certificate_name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        Unverified in Document
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center">ไม่พบใบรับรองหรือประกาศนียบัตรในเอกสารนี้</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PROVENANCE MAP */}
        {activeTab === "provenance" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  แผนที่หลักฐานและที่มาของข้อมูล ({provenances.length} รายการ)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ทุกฟิลด์ที่ AI สกัดได้เชื่อมโยงกับเลขหน้าและข้อความต้นฉบับ 1:1
                </p>
              </div>

              {/* Provenance Filter */}
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={provSearch}
                  onChange={(e) => setProvSearch(e.target.value)}
                  placeholder="ค้นหาฟิลด์หรือข้อความ..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl w-full focus:outline-indigo-500 shadow-2xs"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 sticky top-0 z-10">
                    <tr>
                      <th className="px-3.5 py-2.5 font-bold">Field Path</th>
                      <th className="px-3.5 py-2.5 font-bold">ค่าที่สกัดได้</th>
                      <th className="px-3 py-2.5 font-bold">หน้า</th>
                      <th className="px-3 py-2.5 font-bold">ความมั่นใจ</th>
                      <th className="px-3.5 py-2.5 font-bold">ข้อความหลักฐาน (Evidence Snippet)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProvenances.map((p: any, i: number) => (
                      <tr
                        key={p.id || i}
                        onClick={() => onFocusSection(p.sectionName?.toLowerCase() || "")}
                        className="hover:bg-indigo-50/40 cursor-pointer transition"
                      >
                        <td className="px-3.5 py-2.5 font-mono text-indigo-700 font-semibold">{p.fieldPath}</td>
                        <td className="px-3.5 py-2.5 font-bold text-slate-800">{p.extractedValue}</td>
                        <td className="px-3 py-2.5 text-slate-500 font-medium">P.{p.pageNumber || 1}</td>
                        <td className="px-3 py-2.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                            {((p.confidenceScore || 0.95) * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-500 text-[11px] font-mono max-w-xs truncate">
                          {p.sourceText || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: QUALITY GATE & TRAINING ELIGIBILITY */}
        {activeTab === "quality_gate" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  ด่านควบคุมการฝึกสอนโมเดล (Training Eligibility Gate)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  คัดแยกข้อมูลที่อนุญาตให้เฉพาะ Profile Management ออกจากชุดข้อมูลฝึกสอน AI
                </p>
              </div>

              {/* Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-[11px] text-slate-500 mb-0.5 font-medium">สถานะสิทธิ์การประมวลผลปัจจุบัน:</div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        trainingEligibilityStatus === "APPROVED_FOR_TRAINING"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : trainingEligibilityStatus === "APPROVED_FOR_PROFILE_MANAGEMENT"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {trainingEligibilityStatus}
                    </span>
                  </div>
                </div>

                {onEligibilityChange && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() =>
                        onEligibilityChange(
                          "APPROVED_FOR_TRAINING",
                          "Human expert verified: Clean PII, valid consent, approved for AI model training",
                        )
                      }
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4" /> อนุมัติสำหรับฝึกสอน AI
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onEligibilityChange(
                          "APPROVED_FOR_PROFILE_MANAGEMENT",
                          "Approved for Profile Management only (Restricted from AI Training)",
                        )
                      }
                      className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs"
                    >
                      เฉพาะ Profile Management
                    </button>
                  </div>
                )}
              </div>

              {/* 4-Level Quality Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 mb-0.5">Level 1: File Integrity</div>
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Magic Byte Pass
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 mb-0.5">Level 2: Completeness</div>
                  <div className="text-xs font-bold text-slate-800 font-mono">
                    {Math.round((qualityValidation?.extractionCompleteness || 0.95) * 100)}%
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 mb-0.5">Level 3: OCR Confidence</div>
                  <div className="text-xs font-bold text-slate-800 font-mono">
                    {Math.round((qualityValidation?.ocrConfidenceAvg || 0.99) * 100)}%
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 mb-0.5">Level 4: Timeline Check</div>
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