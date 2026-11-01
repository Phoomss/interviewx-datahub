import React from "react";
import Link from "next/link";
import { Database, FileText, Brain, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" /> InterviewX DataHub • Phase 2 Annotation Workspace
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Dataset Management & Annotation Platform
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          แพลตฟอร์มบริหารจัดการและเตรียมข้อมูลเรซูเมสำหรับการฝึกสอน LLM ของ InterviewX
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/resumes/doc-001-demo/review"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            <span>ทดลองใช้งาน Side-by-side Review</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/resumes"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg shadow-2xs transition"
          >
            <span>ดูคลังเอกสาร (Repository)</span>
          </Link>
          <Link
            href="/datasets"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
          >
            <span>ส่งออกชุดข้อมูล LLM (Phase 3)</span>
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Synthetic Data Studio</h3>
          <p className="mt-2 text-sm text-slate-600">
            สร้างข้อมูลเรซูเมจำลองคุณภาพสูงตามตำแหน่งงานและระดับประสบการณ์ พร้อม Pydantic validation
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Side-by-side QA Review</h3>
          <p className="mt-2 text-sm text-slate-600">
            ตรวจสอบความถูกต้องของข้อมูลสกัดเปรียบเทียบกับเอกสารจริงแบบสองฝั่งพร้อมระบบ Provenance
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Zero PII Leakage Gate</h3>
          <p className="mt-2 text-sm text-slate-600">
            ระบบความปลอดภัยแยกเก็บ PII Vault และระบบคัดกรองข้อมูลส่วนบุคคล 100% ก่อน Export ชุดข้อมูล
          </p>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" /> สถานะโครงสร้างพื้นฐาน (Infrastructure Ready)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-semibold">Backend Core</div>
            <div className="text-base font-medium text-slate-900 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> NestJS 10
            </div>
            <div className="text-xs text-slate-500 mt-1">Port 4000 (REST & Swagger)</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-semibold">AI Service</div>
            <div className="text-base font-medium text-slate-900 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> FastAPI
            </div>
            <div className="text-xs text-slate-500 mt-1">Port 8000 (PyMuPDF & AI)</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-semibold">Database</div>
            <div className="text-base font-medium text-slate-900 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PostgreSQL 16
            </div>
            <div className="text-xs text-slate-500 mt-1">Prisma ORM & PII Vault</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-xs text-slate-500 uppercase font-semibold">Object Storage</div>
            <div className="text-base font-medium text-slate-900 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> MinIO S3
            </div>
            <div className="text-xs text-slate-500 mt-1">Console Port 9001</div>
          </div>
        </div>
      </section>
    </main>
  );
}
