"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sliders,
  Plus,
  Search,
  Layers,
  Sparkles,
  CheckCircle2,
  Briefcase,
  HelpCircle,
  GraduationCap,
  BookOpen,
  Filter,
  RefreshCw,
  FolderPlus,
} from "lucide-react";

export default function TaxonomyManagerPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  const [activeTab, setActiveTab] = useState<"industries" | "categories" | "formats" | "seniority" | "skills">("industries");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [industries, setIndustries] = useState<any[]>([]);
  const [interviewCategories, setInterviewCategories] = useState<any[]>([]);
  const [interviewFormats, setInterviewFormats] = useState<any[]>([]);
  const [seniorityLevels, setSeniorityLevels] = useState<any[]>([]);
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dialog State
  const [showAddIndustryModal, setShowAddIndustryModal] = useState(false);
  const [newIndKey, setNewIndKey] = useState("");
  const [newIndName, setNewIndName] = useState("");
  const [newIndNameTh, setNewIndNameTh] = useState("");
  const [newIndDesc, setNewIndDesc] = useState("");
  const [savingIndustry, setSavingIndustry] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchTaxonomy = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/taxonomy`);
      if (!res.ok) throw new Error("Failed to load taxonomy");
      const data = await res.json();
      setIndustries(data.industries || []);
      setInterviewCategories(data.interviewCategories || []);
      setInterviewFormats(data.interviewFormats || []);
      setSeniorityLevels(data.seniorityLevels || []);
      setSkillCategories(data.skillCategories || []);
    } catch (err: any) {
      console.error(err);
      showToast("เกิดข้อผิดพลาดในการโหลดข้อมูล Taxonomy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  const handleCreateIndustry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndKey || !newIndName) return;
    setSavingIndustry(true);

    try {
      const res = await fetch(`${apiUrl}/taxonomy/industries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: newIndKey,
          name: newIndName,
          nameTh: newIndNameTh,
          description: newIndDesc,
        }),
      });

      if (!res.ok) throw new Error("ไม่สามารถเพิ่มอุตสาหกรรมใหม่ได้");
      showToast(`เพิ่มกลุ่มอุตสาหกรรม '${newIndName}' สำเร็จ!`);
      setShowAddIndustryModal(false);
      setNewIndKey("");
      setNewIndName("");
      setNewIndNameTh("");
      setNewIndDesc("");
      await fetchTaxonomy();
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setSavingIndustry(false);
    }
  };

  // Filtered lists
  const filteredIndustries = industries.filter((ind) => {
    const q = searchTerm.toLowerCase();
    const indMatch = ind.name.toLowerCase().includes(q) || (ind.nameTh && ind.nameTh.toLowerCase().includes(q));
    const profMatch = ind.professions?.some(
      (p: any) => p.name.toLowerCase().includes(q) || (p.nameTh && p.nameTh.toLowerCase().includes(q))
    );
    return indMatch || profMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าแดชบอร์ดหลัก
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
                <Sliders className="w-4 h-4" /> InterviewX Taxonomy & Ontology Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ศูนย์จัดการ Taxonomy ข้ามอุตสาหกรรม (Multi-Industry Taxonomy)
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-3xl">
                โครงสร้างมาตรฐานสำหรับอุตสาหกรรม ตำแหน่งงาน รูปแบบการสัมภาษณ์ และทักษะสากล
                สามารถเพิ่มหรือขยายหมวดหมู่ใหม่ได้แบบ Dynamic โดยไม่ต้องแก้ไขโค้ด
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddIndustryModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition"
              >
                <Plus className="w-4 h-4" /> เพิ่มอุตสาหกรรมใหม่
              </button>
              <Link
                href="/synthetic"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
              >
                <Sparkles className="w-4 h-4 text-purple-300" /> ไปยัง Synthetic Studio
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Controls & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("industries")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === "industries"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> อุตสาหกรรมและตำแหน่งงาน ({industries.length} กลุ่ม)
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === "categories"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> บริบทการสัมภาษณ์ ({interviewCategories.length} หมวด)
            </button>
            <button
              onClick={() => setActiveTab("formats")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === "formats"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> รูปแบบการสัมภาษณ์ ({interviewFormats.length} รูปแบบ)
            </button>
            <button
              onClick={() => setActiveTab("seniority")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === "seniority"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> ระดับอาวุโส ({seniorityLevels.length} ระดับ)
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === "skills"
                  ? "bg-purple-600 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> ทักษะสากล ({skillCategories.length} หมวดหมู่)
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาตำแหน่งงาน / ทักษะ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Tab 1: Industries & Professions */}
        {activeTab === "industries" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIndustries.map((ind) => (
              <div
                key={ind.id || ind.key}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                      <h3 className="text-base font-bold text-slate-900">{ind.name}</h3>
                      {ind.isCustom && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          Custom
                        </span>
                      )}
                    </div>
                    {ind.nameTh && <p className="text-xs text-purple-700 font-medium mt-0.5">{ind.nameTh}</p>}
                    <p className="text-xs text-slate-500 mt-1">{ind.description}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {(() => {
                      const direct = ind.professions || [];
                      const m2m = (ind.industryProfessions || []).map((ip: any) => ip.profession).filter(Boolean);
                      const set = new Set([...direct.map((d: any) => d.key), ...m2m.map((m: any) => m.key)]);
                      return set.size;
                    })()} ตำแหน่งงาน
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700 mb-2">ตำแหน่งงานในสังกัด (Direct & Many-to-Many):</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(() => {
                      const direct = ind.professions || [];
                      const m2m = (ind.industryProfessions || []).map((ip: any) => ip.profession).filter(Boolean);
                      const combined = [...direct];
                      for (const p of m2m) {
                        if (!combined.some((item) => item.key === p.key)) {
                          combined.push(p);
                        }
                      }
                      return combined.map((prof: any) => (
                        <span
                          key={prof.id || prof.key}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200"
                        >
                          {prof.name} {prof.nameTh ? `(${prof.nameTh})` : ""}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Interview Categories */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviewCategories.map((cat) => (
              <div
                key={cat.id || cat.key}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                  </div>
                  {cat.nameTh && <p className="text-xs text-indigo-700 font-medium mt-0.5">{cat.nameTh}</p>}
                  <p className="text-xs text-slate-500 mt-1">{cat.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700 mb-2">หมวดหมู่ย่อย (Subcategories):</div>
                  <div className="space-y-1.5">
                    {(cat.subcategories || []).map((sub: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <span className="font-medium text-slate-800">{sub.name || sub}</span>
                        {sub.nameTh && <span className="text-slate-500 text-[11px]">{sub.nameTh}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Interview Formats (15 Formats) */}
        {activeTab === "formats" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewFormats.map((fmt) => (
              <div
                key={fmt.id || fmt.key}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3 hover:border-purple-300 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <h3 className="text-base font-bold text-slate-900">{fmt.name}</h3>
                  </div>
                  {fmt.nameTh && <p className="text-xs text-purple-700 font-medium mt-0.5">{fmt.nameTh}</p>}
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{fmt.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">key: {fmt.key}</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Seniority Levels */}
        {activeTab === "seniority" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              ระดับประสบการณ์จำแนกตามสายงาน (Context-Aware Seniority)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                    <th className="py-3 px-4">กลุ่มบริบท</th>
                    <th className="py-3 px-4">ระดับอาวุโส (English)</th>
                    <th className="py-3 px-4">ชื่อภาษาไทย</th>
                    <th className="py-3 px-4">ช่วงประสบการณ์ (ปี)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {seniorityLevels.map((sen) => (
                    <tr key={sen.id || sen.key} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-purple-700 uppercase tracking-wider text-[11px]">
                        {sen.category}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{sen.name}</td>
                      <td className="py-3 px-4 text-slate-700">{sen.nameTh || "-"}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {sen.minYearsExp === 0 && sen.maxYearsExp === 0
                          ? "0 ปี (ไม่มีประสบการณ์/นักเรียน)"
                          : `${sen.minYearsExp ?? 0} - ${sen.maxYearsExp ?? "+"} ปี`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Skills Taxonomy */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((sc) => (
              <div
                key={sc.id || sc.key}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-3"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    {sc.name}
                  </h3>
                  {sc.nameTh && <p className="text-xs text-emerald-700 font-medium">{sc.nameTh}</p>}
                </div>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {(sc.skills || []).map((sk: any) => (
                    <span
                      key={sk.id || sk.name}
                      className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      {sk.name} {sk.nameTh ? `(${sk.nameTh})` : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Industry Modal */}
      {showAddIndustryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-purple-600" />
                เพิ่มกลุ่มอุตสาหกรรมใหม่ (Custom Industry)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddIndustryModal(false)}
                className="text-slate-400 hover:text-slate-600 font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIndustry} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  รหัสเอกลักษณ์ (Unique Key) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น renewable_energy, aerospace"
                  value={newIndKey}
                  onChange={(e) => setNewIndKey(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่อกลุ่มอุตสาหกรรมภาษาอังกฤษ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Renewable Energy & Cleantech"
                  value={newIndName}
                  onChange={(e) => setNewIndName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่อกลุ่มอุตสาหกรรมภาษาไทย
                </label>
                <input
                  type="text"
                  placeholder="เช่น พลังงานหมุนเวียนและเทคโนโลยีสิ่งแวดล้อม"
                  value={newIndNameTh}
                  onChange={(e) => setNewIndNameTh(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  คำอธิบายอุตสาหกรรม
                </label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดของสายงานในอุตสาหกรรมนี้..."
                  value={newIndDesc}
                  onChange={(e) => setNewIndDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddIndustryModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={savingIndustry}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 disabled:opacity-50"
                >
                  {savingIndustry ? "กำลังบันทึก..." : "บันทึกอุตสาหกรรม"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
