"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Brain, ArrowLeft, RefreshCw, CheckCircle2, Play, Layers, Code2, Plus, ArrowRight } from "lucide-react";

export default function SyntheticStudioPage() {
  const [role, setRole] = useState("Senior Backend Engineer");
  const [seniority, setSeniority] = useState("Senior");
  const [techStack, setTechStack] = useState("NestJS, TypeScript, PostgreSQL, Redis, Docker");
  const [batchSize, setBatchSize] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const skillsArray = techStack.split(",").map((s) => s.trim()).filter(Boolean);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

      const res = await fetch(`${apiUrl}/synthetic/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobName: `Synthetic ${seniority} ${role} Batch`,
          role,
          seniority,
          targetCount: Number(batchSize),
          techStack: skillsArray,
          language: "en",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.message || "Synthetic generation failed");
      }

      const generatedProfiles = json.data.profiles || [];
      const newDocs = json.data.documents || [];
      setResults(generatedProfiles);

      // Save to localStorage for client caching
      try {
        const existing = localStorage.getItem("interviewx_resumes_cache");
        let allDocs = newDocs;
        if (existing) {
          const parsed = JSON.parse(existing);
          allDocs = [...newDocs, ...parsed.filter((d: any) => !newDocs.some((nd: any) => nd.id === d.id))];
        }
        localStorage.setItem("interviewx_resumes_cache", JSON.stringify(allDocs));
      } catch (e) {}

      showToast(`สร้างเรซูเมสังเคราะห์ ${generatedProfiles.length} รายการ และบันทึกเข้าสู่คลังเอกสารสำเร็จ!`);
    } catch (err: any) {
      console.error("Synthetic generation error:", err);
      showToast(err.message || "เกิดข้อผิดพลาดในการสร้างข้อมูลสังเคราะห์");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าแดชบอร์ดหลัก
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Synthetic Data Studio
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                สตูดิโอสร้างข้อมูลเรซูเมสังเคราะห์ (Synthetic Resume Generator)
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                สร้างข้อมูลเรซูเมจำลองคุณภาพสูงพร้อม Pydantic Validation เพื่อเตรียมฝึกสอน LLM โดยปราศจากข้อจำกัดด้าน PII
              </p>
            </div>
            <Link
              href="/resumes"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition self-start sm:self-auto"
            >
              <span>ไปดูคลังเอกสาร (Repository)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  ตำแหน่งงานเป้าหมาย (Job Role)
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="เช่น Data Engineer หรือ Fullstack Developer"
                  required
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  ระดับประสบการณ์ (Seniority Level)
                </label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Junior">Junior (0-2 ปี)</option>
                  <option value="Mid-level">Mid-level (2-5 ปี)</option>
                  <option value="Senior">Senior (5-8 ปี)</option>
                  <option value="Lead/Architect">Lead / Architect (8+ ปี)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  จำนวนที่ต้องการสร้าง (Batch Size)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  required
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  กลุ่มทักษะและเทคโนโลยี (Tech Stacks - คั่นด้วยเครื่องหมายจุลภาค)
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="เช่น Python, PyTorch, SQL, FastAPI, Docker"
                  required
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                แท็กอัตโนมัติ: <span className="font-mono text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">is_synthetic: true</span>
              </div>
              <button
                type="submit"
                disabled={generating}
                className="inline-flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>กำลังประมวลผลการสังเคราะห์ด้วย LLM...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>เริ่มสร้างข้อมูลสังเคราะห์ทันที (Generate Batch)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Preview */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                สร้างและบันทึกข้อมูลเข้าคลังเรียบร้อยแล้ว ({results.length} รายการ)
              </h3>
              <Link
                href="/resumes"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
              >
                <span>เปิดดูในคลังเอกสาร & ตรวจสอบข้อมูล</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((profile, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-purple-600" />
                      Persona Profile #{i + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      is_synthetic: true
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded border border-slate-100">
                    "{profile.professional_summary}"
                  </p>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">ทักษะสำคัญ:</div>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills?.map((s: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {profile.experiences?.[0] && (
                    <div className="text-xs text-slate-700 pt-2 border-t border-slate-100">
                      <div className="font-semibold text-slate-900">{profile.experiences[0].role_title}</div>
                      <div className="text-[11px] text-slate-500">
                        {profile.experiences[0].company_name} ({profile.experiences[0].start_date} - {profile.experiences[0].end_date})
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
