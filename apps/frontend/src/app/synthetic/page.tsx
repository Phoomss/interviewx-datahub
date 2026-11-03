"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Play,
  Layers,
  Eye,
  Plus,
  ArrowRight,
  Sliders,
  FileText,
  HelpCircle,
  MessageSquare,
  Award,
  Compass,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Scale,
  Palette,
  FolderPlus,
  Download,
  Copy,
  Check,
  FileCheck,
  Trash2,
} from "lucide-react";
import { SyntheticPreviewModal } from "@/components/synthetic/SyntheticPreviewModal";

const DATASET_TYPES = [
  { id: "profile", label: "Professional Profile", labelTh: "โปรไฟล์ประวัติการทำงาน", desc: "ข้อมูลประวัติ ทักษะ การศึกษา และผลงาน", icon: Briefcase },
  { id: "resume", label: "Resume / CV", labelTh: "เรซูเม / ซีวีฉบับเต็ม", desc: "เรซูเมจัดหมวดหมู่ทักษะและผลงาน (ไม่บังคับมีประสบการณ์งาน)", icon: FileText },
  { id: "academic_cv", label: "Academic CV", labelTh: "ซีวีวิชาการ ทุน และงานวิจัย", desc: "ประวัติวิชาการ ผลงานตีพิมพ์ ทุนวิจัย และการสอน", icon: GraduationCap },
  { id: "portfolio", label: "Portfolio Case Study", labelTh: "แฟ้มผลงานกรณีศึกษาเชิงลึก", desc: "กรณีศึกษาโครงการจริง ปัญหา ข้อจำกัด ผลลัพธ์เชิงตัวเลข", icon: Sparkles },
  { id: "supporting_doc", label: "Supporting Document", labelTh: "เอกสารประกอบการสัมภาษณ์", desc: "ใบรับรองการอบรม ใบประกาศ ผลการเรียนจำลองลายน้ำสังเคราะห์", icon: FileCheck },
  { id: "interview_question", label: "Interview Question", labelTh: "คำถามสัมภาษณ์เฉพาะด้าน", desc: "คำถามพร้อมวัตถุประสงค์ เกณฑ์ตรวจ และ Red Flags", icon: HelpCircle },
  { id: "interview_answer", label: "Interview Answer", labelTh: "คำตอบสัมภาษณ์ตามเกรด", desc: "คำตอบจำลอง 6 ระดับ (Excellent ถึง Irrelevant)", icon: MessageSquare },
  { id: "rubric_evaluation", label: "Rubric Evaluation", labelTh: "เกณฑ์การให้คะแนน Rubric", desc: "มิติประเมิน คะแนนพร้อมเหตุผล และคำแนะนำตัดสินใจ", icon: Award },
  { id: "feedback", label: "Feedback & Coaching", labelTh: "รายงานฟีดแบ็ก & โค้ชชิ่ง", desc: "จุดเด่น จุดที่ต้องพัฒนา และคำแนะนำเสริมทักษะ", icon: Compass },
  { id: "scenario", label: "Scenario-based Dilemma", labelTh: "สถานการณ์จำลอง & จริยธรรม", desc: "โจทย์ปัญหาขัดแย้ง ข้อจำกัด และแนวทางปฏิบัติ", icon: Layers },
];

const ANSWER_QUALITIES = [
  { id: "Excellent", label: "Excellent (ดีเยี่ยม - STAR)", desc: "โครงสร้างชัดเจน ตัวชี้วัดครบถ้วน", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "Good", label: "Good (ดี - มีเหตุผล)", desc: "ตรงประเด็น ครบเกณฑ์พื้นฐาน", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "Average", label: "Average (ปานกลาง - ทั่วไป)", desc: "ตอบกว้าง ขาดตัวเลขผลงาน", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "Poor", label: "Poor (อ่อน - โทษปัจจัยอื่น)", desc: "ไม่มีความรับผิดชอบ ขาดทัศนคติ", color: "bg-red-100 text-red-800 border-red-300" },
  { id: "Incomplete", label: "Incomplete (ไม่สมบูรณ์)", desc: "ตอบค้าง ไม่จบกระบวนการ STAR", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "Irrelevant", label: "Irrelevant (ไม่ตรงคำถาม)", desc: "ตอบหลงประเด็น สื่อสารคลาดเคลื่อน", color: "bg-slate-200 text-slate-800 border-slate-300" },
];

export default function UniversalSyntheticStudioPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  // Taxonomy from API
  const [taxonomyLoading, setTaxonomyLoading] = useState(true);
  const [industries, setIndustries] = useState<any[]>([]);
  const [interviewCategories, setInterviewCategories] = useState<any[]>([]);
  const [interviewFormats, setInterviewFormats] = useState<any[]>([]);
  const [seniorityLevels, setSeniorityLevels] = useState<any[]>([]);

  // Form State
  const [jobName, setJobName] = useState("Universal Multi-Industry Generation");
  const [datasetType, setDatasetType] = useState("profile");
  const [selectedIndustryKey, setSelectedIndustryKey] = useState("healthcare");
  const [selectedProfessionKeys, setSelectedProfessionKeys] = useState<string[]>(["medical_doctor"]);
  const [selectedInterviewCategory, setSelectedInterviewCategory] = useState("job");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("behavioral");
  const [seniority, setSeniority] = useState("Licensed Professional");
  const [customSkillsInput, setCustomSkillsInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [difficulty, setDifficulty] = useState("Mid");
  const [answerQuality, setAnswerQuality] = useState("Excellent");
  const [batchSizePerProf, setBatchSizePerProf] = useState(1);

  // Modal & Preview State
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [previewDatasetType, setPreviewDatasetType] = useState("profile");
  const [previewIndustry, setPreviewIndustry] = useState("");
  const [previewProfession, setPreviewProfession] = useState("");

  // Custom Profession Dialog State
  const [showAddProfModal, setShowAddProfModal] = useState(false);
  const [newProfName, setNewProfName] = useState("");
  const [newProfNameTh, setNewProfNameTh] = useState("");
  const [newProfSkills, setNewProfSkills] = useState("");
  const [addingProf, setAddingProf] = useState(false);

  // Batch Generation State
  const [generating, setGenerating] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch Taxonomy on Mount
  const fetchTaxonomy = async () => {
    try {
      setTaxonomyLoading(true);
      const res = await fetch(`${apiUrl}/taxonomy`);
      if (!res.ok) throw new Error("Failed to load taxonomy");
      const data = await res.json();
      setIndustries(data.industries || []);
      setInterviewCategories(data.interviewCategories || []);
      setInterviewFormats(data.interviewFormats || []);
      setSeniorityLevels(data.seniorityLevels || []);

      if (data.industries && data.industries.length > 0) {
        const firstInd = data.industries[0];
        setSelectedIndustryKey(firstInd.key);
        if (firstInd.professions && firstInd.professions.length > 0) {
          setSelectedProfessionKeys([firstInd.professions[0].key]);
        }
      }
      if (data.interviewCategories && data.interviewCategories.length > 0) {
        setSelectedInterviewCategory(data.interviewCategories[0].key);
      }
    } catch (err: any) {
      console.error("Taxonomy error:", err);
      showToast("ใช้ข้อมูลสำรองเนื่องจากเซิร์ฟเวอร์ยังไม่พร้อม");
    } finally {
      setTaxonomyLoading(false);
    }
  };

  // 2. Fetch Existing Dataset Records
  const fetchDatasetRecords = async () => {
    try {
      setLoadingRecords(true);
      const res = await fetch(`${apiUrl}/synthetic/records?limit=15`);
      if (res.ok) {
        const json = await res.json();
        setRecords(json.items || []);
      }
    } catch (err) {
      console.warn("Records error:", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleClearRecords = async () => {
    if (!confirm("คุณต้องการล้างประวัติชุดข้อมูลสังเคราะห์ทั้งหมดออกจากระบบเพื่อเตรียมสร้างใหม่ใช่หรือไม่?")) {
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/synthetic/records/clear`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok) {
        showToast(json.message || "ล้างชุดข้อมูลสังเคราะห์เรียบร้อย");
        await fetchDatasetRecords();
      } else {
        throw new Error(json.message || "Failed to clear");
      }
    } catch (e: any) {
      showToast(e.message || "เกิดข้อผิดพลาดในการล้างข้อมูล");
    }
  };

  useEffect(() => {
    fetchTaxonomy();
    fetchDatasetRecords();
  }, []);

  // Update selected professions when industry changes (including Many-to-Many associations)
  const currentIndustry = industries.find((ind) => ind.key === selectedIndustryKey) || industries[0];
  const availableProfessions = React.useMemo(() => {
    if (!currentIndustry) return [];
    const direct = currentIndustry.professions || [];
    const m2m = (currentIndustry.industryProfessions || []).map((ip: any) => ip.profession).filter(Boolean);
    const combined = [...direct];
    for (const p of m2m) {
      if (!combined.some((item) => item.key === p.key)) {
        combined.push(p);
      }
    }
    return combined;
  }, [currentIndustry]);

  const toggleProfessionSelection = (key: string) => {
    if (selectedProfessionKeys.includes(key)) {
      if (selectedProfessionKeys.length > 1) {
        setSelectedProfessionKeys(selectedProfessionKeys.filter((k) => k !== key));
      }
    } else {
      setSelectedProfessionKeys([...selectedProfessionKeys, key]);
    }
  };

  // Filter seniority according to context
  const filteredSeniorities = seniorityLevels.filter((s) => {
    if (selectedInterviewCategory === "academic" || selectedInterviewCategory === "research") {
      return s.category === "academic" || s.category === "career";
    }
    if (selectedIndustryKey === "healthcare") {
      return s.category === "healthcare_licensed" || s.category === "career";
    }
    return s.category === "career";
  });

  // Current category subcategories
  const currentCategoryObj = interviewCategories.find((c) => c.key === selectedInterviewCategory);
  const subcategories = Array.isArray(currentCategoryObj?.subcategories) ? currentCategoryObj.subcategories : [];

  // Handle Add Custom Profession
  const handleAddCustomProfession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfName.trim()) return;
    setAddingProf(true);

    try {
      const skillsArr = newProfSkills.split(",").map((s) => s.trim()).filter(Boolean);
      const key = newProfName.toLowerCase().replace(/[^a-z0-9]/g, "_");

      const res = await fetch(`${apiUrl}/taxonomy/professions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industryId: selectedIndustryKey,
          key,
          name: newProfName,
          nameTh: newProfNameTh || newProfName,
          suggestedSkills: skillsArr,
        }),
      });

      if (!res.ok) throw new Error("ไม่สามารถเพิ่มอาชีพใหม่ได้");
      const created = await res.json();

      showToast(`เพิ่มตำแหน่งงาน '${created.name}' สำเร็จ!`);
      setShowAddProfModal(false);
      setNewProfName("");
      setNewProfNameTh("");
      setNewProfSkills("");
      await fetchTaxonomy();
      setSelectedProfessionKeys([created.key]);
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาดในการเพิ่มอาชีพ");
    } finally {
      setAddingProf(false);
    }
  };

  // Handle Live Preview
  const handleLivePreview = async () => {
    setPreviewLoading(true);
    setShowPreviewModal(true);

    try {
      const activeProfKey = selectedProfessionKeys[0] || "software_engineer";
      const profObj = availableProfessions.find((p: any) => p.key === activeProfKey);
      const skillsArray = customSkillsInput
        ? customSkillsInput.split(",").map((s) => s.trim()).filter(Boolean)
        : (profObj?.suggestedSkills as string[]) || [];

      setPreviewDatasetType(datasetType);
      setPreviewIndustry(currentIndustry?.nameTh || currentIndustry?.name || selectedIndustryKey);
      setPreviewProfession(profObj?.nameTh || profObj?.name || activeProfKey);

      const res = await fetch(`${apiUrl}/synthetic/universal/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetType,
          industryKey: selectedIndustryKey,
          professionKey: activeProfKey,
          professionName: profObj?.name || activeProfKey,
          interviewCategory: selectedInterviewCategory,
          interviewSubcategory: selectedSubcategory || undefined,
          seniority,
          skills: skillsArray,
          language,
          difficulty,
          customParameters: {
            ...(datasetType === "interview_answer" ? { answer_quality: answerQuality } : {}),
            ...(datasetType === "supporting_doc" ? { document_type: "professional_certification" } : {}),
            interview_format: selectedFormat,
          },
        }),
      });

      if (!res.ok) throw new Error("Preview generation failed");
      const json = await res.json();
      setPreviewData(json.previewItem);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "เกิดข้อผิดพลาดในการโหลดตัวอย่าง");
    } finally {
      setPreviewLoading(false);
    }
  };

  // Handle Universal Batch Generation
  const handleGenerateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const skillsArray = customSkillsInput
        ? customSkillsInput.split(",").map((s) => s.trim()).filter(Boolean)
        : undefined;

      const res = await fetch(`${apiUrl}/synthetic/universal/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobName: `${jobName} - ${datasetType.toUpperCase()}`,
          datasetType,
          industryKey: selectedIndustryKey,
          professionKeys: selectedProfessionKeys,
          interviewCategory: selectedInterviewCategory,
          interviewSubcategory: selectedSubcategory || undefined,
          seniority,
          skills: skillsArray,
          language,
          difficulty,
          batchSizePerProfession: Number(batchSizePerProf),
          customParameters: {
            ...(datasetType === "interview_answer" ? { answer_quality: answerQuality } : {}),
            ...(datasetType === "supporting_doc" ? { document_type: "professional_certification" } : {}),
            interview_format: selectedFormat,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Universal generation failed");
      }

      showToast(`สร้างชุดข้อมูลสังเคราะห์ ${json.generatedCount} รายการข้าม ${selectedProfessionKeys.length} ตำแหน่งงานสำเร็จ!`);
      await fetchDatasetRecords();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "เกิดข้อผิดพลาดในการสังเคราะห์ข้อมูล");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าแดชบอร์ดหลัก
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/taxonomy"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-2xs transition"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-600" /> ผังโครงสร้าง Taxonomy
              </Link>
              <Link
                href="/resumes"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-2xs transition hidden sm:inline-flex"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" /> คลังเอกสารเรซูเม
              </Link>
              <Link
                href="/datasets"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-2xs transition"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" /> ส่งออกชุดข้อมูล
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" /> Multi-Industry & Universal Interview Engine v2.0
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Universal Synthetic Dataset Studio
            </h1>
            <p className="mt-2 text-sm text-purple-100/90 max-w-3xl leading-relaxed">
              เครื่องมือสร้างชุดข้อมูลสังเคราะห์หลากหลายอุตสาหกรรม (การแพทย์, วิศวกรรม, กฎหมาย, ธุรกิจ, การศึกษา, ไอที ฯลฯ)
              ครอบคลุม 7 มิติข้อมูลสัมภาษณ์ เพื่อเตรียมฝึกสอน LLM ของ InterviewX โดยปราศจากข้อจำกัดเฉพาะสายงาน IT
            </p>
          </div>
        </div>

        {/* Studio Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Section 1: Dataset Dimension (10 Types) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 inline-flex items-center justify-center text-xs font-bold">1</span>
                เลือกประเภทชุดข้อมูลสังเคราะห์ (10 มิติข้อมูล - Universal Multi-Context)
              </label>
              <span className="text-xs text-slate-500">เลือกมิติข้อมูลสำหรับฝึกสอนและประเมิน LLM</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {DATASET_TYPES.map((t) => {
                const IconComponent = t.icon;
                const isSelected = datasetType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDatasetType(t.id)}
                    className={`text-left p-3.5 rounded-xl border transition flex flex-col justify-between ${
                      isSelected
                        ? "bg-purple-50 border-purple-600 ring-2 ring-purple-600/20 shadow-2xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <IconComponent className={`w-5 h-5 ${isSelected ? "text-purple-600" : "text-slate-500"}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{t.label}</div>
                      <div className="text-xs text-purple-700 font-medium">{t.labelTh}</div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2 line-clamp-2">{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Control: If Interview Answer is selected, choose Answer Quality */}
          {datasetType === "interview_answer" && (
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-3">
              <label className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-600" /> ระดับคุณภาพของคำตอบ (Answer Quality Spectrum)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {ANSWER_QUALITIES.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setAnswerQuality(q.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border text-center transition ${
                      answerQuality === q.id
                        ? `${q.color} ring-2 ring-purple-600 shadow-2xs`
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>{q.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{q.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Industry & Multi-Profession Selector */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 inline-flex items-center justify-center text-xs font-bold">2</span>
                เลือกกลุ่มอุตสาหกรรมและตำแหน่งงาน (Multi-Industry & Professions)
              </label>
              <button
                type="button"
                onClick={() => setShowAddProfModal(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่มตำแหน่งงานใหม่
              </button>
            </div>

            {/* Industry Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {industries.map((ind) => (
                <button
                  key={ind.key}
                  type="button"
                  onClick={() => {
                    setSelectedIndustryKey(ind.key);
                    if (ind.professions && ind.professions.length > 0) {
                      setSelectedProfessionKeys([ind.professions[0].key]);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition border ${
                    selectedIndustryKey === ind.key
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {ind.name}
                </button>
              ))}
            </div>

            {/* Professions Multi-Select Pills */}
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-700">
                  ตำแหน่งงานในกลุ่ม {currentIndustry?.name} (เลือกได้หลายตำแหน่งสำหรับการสร้าง Batch):
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedProfessionKeys(availableProfessions.map((p: any) => p.key))}
                    className="text-purple-600 hover:underline font-medium"
                  >
                    เลือกทั้งหมด ({availableProfessions.length})
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProfessionKeys([availableProfessions[0]?.key || ""])}
                    className="text-slate-500 hover:underline font-medium"
                  >
                    ล้างตัวเลือก
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {availableProfessions.map((p: any) => {
                  const isChecked = selectedProfessionKeys.includes(p.key);
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => toggleProfessionSelection(p.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition inline-flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{p.name}</span>
                      {p.nameTh && <span className="opacity-75 text-[11px]">({p.nameTh})</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Interview Category, Subcategory & Format */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 inline-flex items-center justify-center text-xs font-bold">3</span>
                หมวดหมู่การสัมภาษณ์ (Interview Context)
              </label>
              <select
                value={selectedInterviewCategory}
                onChange={(e) => {
                  setSelectedInterviewCategory(e.target.value);
                  setSelectedSubcategory("");
                }}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-600 text-slate-800"
              >
                {interviewCategories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.name} ({cat.nameTh})
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                {currentCategoryObj?.description || "บริบทของการสัมภาษณ์ (ทุน, เข้าศึกษา, วิทยานิพนธ์, เลื่อนตำแหน่ง ฯลฯ)"}
              </p>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-900 mb-2 block">
                หมวดหมู่ย่อย (Subcategory)
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-600 text-slate-800"
              >
                <option value="">-- ทั้งหมดในหมวดหมู่นี้ (Default) --</option>
                {subcategories.map((sub: any) => (
                  <option key={sub.key || sub} value={sub.key || sub}>
                    {sub.name || sub} {sub.nameTh ? `(${sub.nameTh})` : ""}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                จำแนกความเฉพาะเจาะจง เช่น General, Technical, Behavioral, Case Interview
              </p>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-900 mb-2 block">
                รูปแบบการสัมภาษณ์ (Interview Format)
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-600 text-slate-800"
              >
                {interviewFormats.length > 0 ? (
                  interviewFormats.map((fmt: any) => (
                    <option key={fmt.key} value={fmt.key}>
                      {fmt.name} ({fmt.nameTh})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="behavioral">Behavioral Interview</option>
                    <option value="technical">Technical Interview</option>
                    <option value="case">Case Interview</option>
                    <option value="situational">Situational Interview</option>
                    <option value="structured">Structured Interview</option>
                    <option value="presentation">Presentation-Based Interview</option>
                    <option value="oral_defense">Oral Defense / Examination</option>
                  </>
                )}
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                เลือกรูปแบบสัมภาษณ์ 15 ชนิด (Structured, Panel, Dilemma, Defense)
              </p>
            </div>
          </div>

          {/* Section 4: Seniority & Custom Skills */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 inline-flex items-center justify-center text-xs font-bold">4</span>
                ระดับประสบการณ์ / อาวุโส (Seniority)
              </label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-600 text-slate-800"
              >
                {filteredSeniorities.map((s) => (
                  <option key={s.key} value={s.name}>
                    {s.name} ({s.nameTh})
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                ปรับตามบริบทของสายงาน (เช่น Student/No Experience, Senior, Fellow, PhD Candidate)
              </p>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-900 mb-2 block">
                ทักษะที่เกี่ยวข้องเฉพาะ (Optional Skills)
              </label>
              <input
                type="text"
                value={customSkillsInput}
                onChange={(e) => setCustomSkillsInput(e.target.value)}
                placeholder="ระบุคั่นด้วยจุลภาค เช่น Clinical Triage, Emergency Protocol, Bedside Care"
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-600 text-slate-800"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                หากเว้นว่าง ระบบจะนำทักษะแนะนำจากฐานข้อมูลของอาชีพมาใช้โดยอัตโนมัติ
              </p>
            </div>
          </div>

          {/* Section 5: Language, Difficulty & Batch Size */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                ภาษา (Language)
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="en">English (สากล)</option>
                <option value="th">ไทย (Thai)</option>
                <option value="mixed">Bilingual / Mixed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                ระดับความยาก (Difficulty)
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Entry">Entry / Foundational</option>
                <option value="Mid">Mid-level (มาตรฐาน)</option>
                <option value="Senior">Senior / Rigorous</option>
                <option value="Executive">Executive / High-Stakes</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                จำนวนสร้างต่ออาชีพ (Batch Size)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={batchSizePerProf}
                  onChange={(e) => setBatchSizePerProf(Number(e.target.value))}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  รวม {selectedProfessionKeys.length * batchSizePerProf} รายการ
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>ทุกข้อมูลจะถูกประทับ Synthetic Metadata v2.0 และผ่าน Zero PII Leakage Gate</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleLivePreview}
                disabled={previewLoading || generating}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 hover:border-purple-300 hover:from-purple-100 hover:to-indigo-100 text-purple-900 text-xs font-bold rounded-xl shadow-2xs transition group disabled:opacity-50"
                title="ทดสอบสร้างตัวอย่าง 1 รายการก่อนสั่งผลิตชุดใหญ่"
              >
                {previewLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                ) : (
                  <Sparkles className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                )}
                <span>ดูตัวอย่างสด (Live Preview)</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateBatch}
                disabled={generating || selectedProfessionKeys.length === 0}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>กำลังสร้างข้อมูลสังเคราะห์...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>สั่งสร้างชุดข้อมูล ({selectedProfessionKeys.length * batchSizePerProf} รายการ)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Section 6: Results Explorer */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                คลังข้อมูลสังเคราะห์ล่าสุด (Universal Dataset Records)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                บันทึกและจัดหมวดหมู่ข้อมูลสังเคราะห์ข้ามอุตสาหกรรมในฐานข้อมูล พร้อมให้ตรวจสอบคุณภาพ
              </p>
            </div>
            <div className="flex items-center gap-2">
              {records.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearRecords}
                  title="ล้างชุดข้อมูลสังเคราะห์ทั้งหมดเพื่อเริ่มต้นสร้างใหม่"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" /> ล้างข้อมูลทั้งหมด
                </button>
              )}
              <button
                type="button"
                onClick={fetchDatasetRecords}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRecords ? "animate-spin" : ""}`} /> รีเฟรชรายการ
              </button>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              ยังไม่มีข้อมูลสังเคราะห์ในระบบ สั่งสร้างข้อมูลด้านบนเพื่อเริ่มเตรียม Dataset
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">มิติข้อมูล (Dataset Type)</th>
                    <th className="py-3 px-4">อุตสาหกรรม & ตำแหน่งงาน</th>
                    <th className="py-3 px-4">หมวดหมู่สัมภาษณ์</th>
                    <th className="py-3 px-4">ระดับอาวุโส</th>
                    <th className="py-3 px-4">สถานะคุณภาพ</th>
                    <th className="py-3 px-4">วันที่สร้าง</th>
                    <th className="py-3 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-medium border border-purple-200">
                          {rec.datasetType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-semibold text-slate-900">{rec.profession?.name || rec.professionId || "Custom Profession"}</div>
                        <div className="text-[11px] text-slate-500">{rec.industry?.name || rec.industryId}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="capitalize">{rec.interviewCategory?.replace(/_/g, " ")}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{rec.seniorityLevel}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {rec.qualityStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(rec.createdAt).toLocaleDateString("th-TH")}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewData(rec.content);
                            setPreviewDatasetType(rec.datasetType || datasetType);
                            setPreviewIndustry(rec.industry || currentIndustry?.nameTh || selectedIndustryKey);
                            setPreviewProfession(rec.profession || selectedProfessionKeys[0]);
                            setShowPreviewModal(true);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> ตรวจสอบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User-Friendly Enhanced Live Preview Modal */}
      <SyntheticPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        datasetType={previewDatasetType}
        previewData={previewData}
        loading={previewLoading}
        onRegenerate={handleLivePreview}
        industryName={previewIndustry}
        professionName={previewProfession}
      />

      {/* Add Custom Profession Modal */}
      {showAddProfModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-purple-600" />
                เพิ่มตำแหน่งงานใหม่ (Custom Profession)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProfModal(false)}
                className="text-slate-400 hover:text-slate-600 font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomProfession} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  กลุ่มอุตสาหกรรม
                </label>
                <input
                  type="text"
                  disabled
                  value={currentIndustry?.name}
                  className="w-full text-xs px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่อตำแหน่งงานภาษาอังกฤษ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Robotic Surgery Specialist, ESG Auditor"
                  value={newProfName}
                  onChange={(e) => setNewProfName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่อตำแหน่งงานภาษาไทย
                </label>
                <input
                  type="text"
                  placeholder="เช่น ผู้เชี่ยวชาญศัลยกรรมหุ่นยนต์"
                  value={newProfNameTh}
                  onChange={(e) => setNewProfNameTh(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ทักษะแนะนำ (คั่นด้วยจุลภาค)
                </label>
                <input
                  type="text"
                  placeholder="Robotic Navigation, Precision Surgery, Patient Safety"
                  value={newProfSkills}
                  onChange={(e) => setNewProfSkills(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProfModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={addingProf}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 disabled:opacity-50"
                >
                  {addingProf ? "กำลังบันทึก..." : "บันทึกตำแหน่งงาน"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
