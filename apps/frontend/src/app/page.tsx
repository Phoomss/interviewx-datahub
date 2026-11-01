import React from "react";
import Link from "next/link";
import {
  Database,
  FileText,
  Brain,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Layers,
  GraduationCap,
  Briefcase,
  HeartPulse,
} from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-purple-700 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-purple-600" /> InterviewX DataHub • Multi-Industry & Universal Generator v2.0
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Universal Interview Dataset Generator
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          แพลตฟอร์มบริหารจัดการและสังเคราะห์ชุดข้อมูลการสัมภาษณ์ระดับสากล ครอบคลุม 10+ อุตสาหกรรม, 80+ อาชีพ,
          7 หมวดหมู่สัมภาษณ์ (งาน, ทุน, ปริญญาโท-เอก, แลกเปลี่ยน) และ 7 มิติข้อมูล เพื่อฝึกสอน LLM ของ InterviewX
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/synthetic"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>สร้างข้อมูลสังเคราะห์ (Universal Studio)</span>
          </Link>
          <Link
            href="/taxonomy"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl shadow-2xs transition"
          >
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>จัดการ Taxonomy 10 อุตสาหกรรม</span>
          </Link>
          <Link
            href="/resumes"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl shadow-2xs transition"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>คลังเอกสาร & เรซูเม</span>
          </Link>
          <Link
            href="/datasets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl shadow-sm transition"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>ส่งออก Dataset (JSON/CSV/XLSX)</span>
          </Link>
        </div>
      </header>

      {/* 3 Core Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">7 มิติข้อมูลสังเคราะห์ (7 Dataset Dimensions)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            รองรับ Profile, Resume, Interview Questions, Answers (6 คุณภาพ), Rubric Evaluations, Coaching Feedback, และ Situational Dilemmas
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Multi-Industry & Dynamic Professions</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            ครอบคลุม 10 กลุ่มอุตสาหกรรม (สุขภาพ, การเงิน, กฎหมาย, ศึกษา, วิศวกรรม ฯลฯ) พร้อมระบบเพิ่มอาชีพใหม่ได้ทันทีโดยไม่ต้องแก้โค้ด
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero PII & Multi-Format Exports</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            สแกนคัดกรองข้อมูลส่วนบุคคล 100% ก่อนส่งออก รองรับไฟล์ JSON, JSONL, CSV, XLSX, Alpaca, ShareGPT พร้อม MLflow Lineage
          </p>
        </div>
      </section>

      {/* System Modules Quick Access */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              แผนผังระบบและโมดูลงาน (InterviewX DataHub Ecosystem)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ระบบเชื่อมต่อแบบครบวงจรระหว่าง Next.js 14, NestJS Core, FastAPI Engine, PostgreSQL, MinIO และ Redis
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> All Services Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/synthetic"
            className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-700">Synthetic Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-xs text-slate-600">สร้างชุดข้อมูลสังเคราะห์ 7 มิติแบบรายกลุ่มและดูตัวอย่างสด</p>
          </Link>

          <Link
            href="/taxonomy"
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-700">Taxonomy Manager</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-xs text-slate-600">ค้นหา เพิ่ม และแก้ไขอุตสาหกรรม อาชีพ และโครงสร้างทักษะ</p>
          </Link>

          <Link
            href="/datasets"
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700">Dataset Exports</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-xs text-slate-600">ส่งออกข้อมูล JSON, CSV, XLSX, Alpaca พร้อม DVC SHA-256</p>
          </Link>

          <Link
            href="/analytics"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-700">Data Governance</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
            <p className="text-xs text-slate-600">ตรวจติดตามสัดส่วนความหลากหลายและความเสี่ยงด้าน Data Bias</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
