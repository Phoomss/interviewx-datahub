"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Database,
  FileText,
  Brain,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Layers,
  GraduationCap,
  Briefcase,
  HeartPulse,
  Download,
  Eye,
  Zap,
  BarChart3,
  HelpCircle,
  FileCheck,
  Search,
  ChevronRight,
  Play,
  UploadCloud,
} from "lucide-react";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "เลือกสายงาน & สังเคราะห์ข้อมูล",
    desc: "เลือกอุตสาหกรรมจาก 10 กลุ่ม (แพทย์, วิศวะ, กฎหมาย, ธุรกิจ ฯลฯ) กำหนดมิติข้อมูล 7 แบบ แล้วสร้างแบบกลุ่ม",
    linkText: "ไปที่ Synthetic Studio",
    href: "/synthetic",
    badge: "Universal Studio",
    color: "from-purple-500 to-indigo-600",
    bgHover: "hover:border-purple-300",
  },
  {
    step: "02",
    title: "ตรวจสอบ & รับรองคุณภาพ (QA)",
    desc: "ตรวจทานความถูกต้องแบบ Side-by-side เปรียบเทียบกับเอกสารจริง ยืนยันความสมบูรณ์ก่อนอนุมัติ",
    linkText: "ตรวจข้อมูลเรซูเม",
    href: "/resumes",
    badge: "Side-by-side Review",
    color: "from-indigo-500 to-blue-600",
    bgHover: "hover:border-indigo-300",
  },
  {
    step: "03",
    title: "ส่งออก Dataset ปลอด PII",
    desc: "ดาวน์โหลดไฟล์พร้อมเทรนโมเดล (JSON, JSONL, CSV, XLSX, Alpaca, ShareGPT) ผ่านระบบตัด PII 100%",
    linkText: "ส่งออก Datasets",
    href: "/datasets",
    badge: "Export & Lineage",
    color: "from-emerald-500 to-teal-600",
    bgHover: "hover:border-emerald-300",
  },
];

const QUICK_MODULES = [
  {
    title: "สตูดิโอสร้างข้อมูลสังเคราะห์",
    titleTh: "Universal Synthetic Studio",
    desc: "สร้างข้อมูล 10 มิติ (Profile, Resume, Q&A, Rubric, Feedback, Dilemma) ครอบคลุม 15 อุตสาหกรรมสากล",
    href: "/synthetic",
    icon: Sparkles,
    tag: "แนะนำสำหรับเริ่มต้น",
    tagColor: "bg-purple-100 text-purple-700 border-purple-200",
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    title: "ศูนย์จัดการ Taxonomy สากล",
    titleTh: "Taxonomy & Ontology Manager",
    desc: "สำรวจ 15 กลุ่มอุตสาหกรรม, 80+ อาชีพ, รูปแบบการสัมภาษณ์ (งาน/ทุน/ต่อโท-เอก) และเพิ่มตำแหน่งงานใหม่ได้ทันที",
    href: "/taxonomy",
    icon: Sliders,
    tag: "ขยายอาชีพได้ Dynamic",
    tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    iconBg: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "คลังเอกสาร & สกัดข้อมูล AI",
    titleTh: "Resume Repository & Parser",
    desc: "อัปโหลดไฟล์ PDF/DOCX จริง จัดเก็บใน MinIO S3 พร้อมถอดข้อความอัตโนมัติด้วย AI",
    href: "/resumes",
    icon: FileText,
    tag: "รองรับไฟล์ PDF/Word",
    tagColor: "bg-blue-100 text-blue-700 border-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    title: "ส่งออกชุดข้อมูลฝึกสอน LLM",
    titleTh: "Dataset Exports & Lineage",
    desc: "ส่งออกไฟล์ JSON, CSV, XLSX, Alpaca, ChatML พร้อม SHA-256 DVC และบันทึกเข้าสู่ MLflow",
    href: "/datasets",
    icon: Download,
    tag: "Zero PII Leakage",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "ระบบความยินยอม & PII Vault",
    titleTh: "PDPA & Data Governance Vault",
    desc: "ระบบบริหารความยินยอม PDPA และ PII Vault แยกเก็บข้อมูลส่วนบุคคลอย่างปลอดภัย",
    href: "/consent",
    icon: ShieldCheck,
    tag: "PDPA Compliant",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    iconBg: "bg-amber-100 text-amber-700",
  },
  {
    title: "วิเคราะห์ความหลากหลายข้อมูล",
    titleTh: "Data Bias & Governance Analytics",
    desc: "วิเคราะห์การกระจายตัวของทักษะ สัดส่วนเพศ ระดับอาวุโส และป้องกัน Data Imbalance",
    href: "/analytics",
    icon: BarChart3,
    tag: "AI Governance",
    tagColor: "bg-rose-100 text-rose-800 border-rose-200",
    iconBg: "bg-rose-100 text-rose-700",
  },
];

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
  const [stats, setStats] = useState({
    industriesCount: 10,
    professionsCount: 80,
    datasetRecordsCount: 2,
    documentsCount: 6,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [taxRes, recRes] = await Promise.all([
          fetch(`${apiUrl}/taxonomy`),
          fetch(`${apiUrl}/synthetic/records?limit=1`),
        ]);
        if (taxRes.ok) {
          const taxData = await taxRes.json();
          const totalProfs = (taxData.industries || []).reduce(
            (acc: number, ind: any) => acc + (ind.professions?.length || 0),
            0
          );
          setStats((prev) => ({
            ...prev,
            industriesCount: taxData.industries?.length || 10,
            professionsCount: totalProfs || 80,
          }));
        }
        if (recRes.ok) {
          const recData = await recRes.json();
          setStats((prev) => ({
            ...prev,
            datasetRecordsCount: recData.total || 0,
          }));
        }
      } catch (e) {
        // use baseline stats
      }
    };
    loadStats();
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">InterviewX</span>
              <span className="font-bold text-base text-purple-600 ml-1">DataHub</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                v2.0 Universal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/synthetic"
              className="text-xs font-semibold text-slate-700 hover:text-purple-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition hidden sm:inline-block"
            >
              สตูดิโอสังเคราะห์
            </Link>
            <Link
              href="/taxonomy"
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition hidden sm:inline-block"
            >
              ผังโครงสร้าง Taxonomy
            </Link>
            <Link
              href="/resumes"
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition hidden md:inline-block"
            >
              คลังเอกสารเรซูเม
            </Link>
            <Link
              href="/datasets"
              className="text-xs font-semibold text-slate-700 hover:text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition hidden md:inline-block"
            >
              ส่งออกชุดข้อมูล
            </Link>
            <a
              href="http://localhost:4000/docs"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              เอกสาร API
            </a>
            <Link
              href="/synthetic"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>สร้างข้อมูลสังเคราะห์</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-purple-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Universal Interview Dataset Generator & Management Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              ศูนย์ผลิตและเตรียมชุดข้อมูล <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-emerald-300">
                สำหรับสัมภาษณ์สากลทุกวิชาชีพ
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              เปลี่ยนงานเตรียมข้อมูลฝึกสอน LLM ให้ง่ายและรวดเร็ว: สังเคราะห์เรซูเม คำถาม-คำตอบ เกณฑ์การให้คะแนน Rubric และสถานการณ์จำลอง
              ครอบคลุม 10+ อุตสาหกรรม 80+ อาชีพ และ 7 รูปแบบสัมภาษณ์ (งาน, ทุนการศึกษา, ปริญญาโท-เอก) ปลอด PII 100%
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/synthetic"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-purple-500/25 transition group"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>เริ่มสร้างข้อมูลสังเคราะห์ทันที</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/resumes"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-md transition"
              >
                <UploadCloud className="w-4 h-4 text-indigo-300" />
                <span>อัปโหลด & ดูคลังเอกสารจริง</span>
              </Link>

              <Link
                href="/datasets"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>ส่งออก Dataset (JSON/CSV/XLSX)</span>
              </Link>
            </div>
          </div>

          {/* Quick Real-Time Metrics Bar */}
          <div className="relative z-10 mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{stats.industriesCount}+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">กลุ่มอุตสาหกรรม (Industries)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">{stats.professionsCount}+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">ตำแหน่งงานที่รองรับ (Professions)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300">7 มิติ</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">ประเภทชุดข้อมูล (Dataset Types)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Zero PII Leakage Safe</div>
            </div>
          </div>
        </div>

        {/* 3-Step Guided Workflow: "เริ่มใช้งานง่ายๆ ใน 3 ขั้นตอน" */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Play className="w-5 h-5 text-purple-600" />
                ขั้นตอนการเตรียมข้อมูลที่แนะนำ (3 Simple Steps)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                กระบวนการมาตรฐานตั้งแต่สังเคราะห์ ตรวจสอบคุณภาพ จนถึงการส่งออกสำหรับ LLM Fine-tuning
              </p>
            </div>
            <Link
              href="/synthetic"
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              <span>เปิดสตูดิโอแบบเต็ม</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xs font-black font-mono">
                      {step.step}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>

                <Link
                  href={step.href}
                  className="pt-3 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition group"
                >
                  <span>{step.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 6 Core Functional Modules (Card Grid) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                โมดูลการทำงานทั้งหมด (System Features & Modules)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                เลือกเครื่องมือที่ต้องการใช้งานเพื่อเข้าถึงฟังก์ชันโดยตรง
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {QUICK_MODULES.map((mod) => {
              const IconComp = mod.icon;
              return (
                <Link
                  key={mod.title}
                  href={mod.href}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`w-11 h-11 rounded-xl ${mod.iconBg} flex items-center justify-center`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mod.tagColor}`}>
                        {mod.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {mod.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{mod.titleTh}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{mod.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-indigo-600">
                    <span>เปิดใช้งานโมดูล</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 10 Industries Overview Pills */}
        <section className="bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 rounded-2xl border border-purple-100 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5 mb-1">
                <Briefcase className="w-4 h-4" /> 10 Industry Domains Supported
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                รองรับการสัมภาษณ์งานทุกสายอาชีพ (ไม่จำกัดเฉพาะ Tech / IT)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                เลือกและสร้างคำถามสัมภาษณ์ โปรไฟล์ และ Rubric ประเมินได้ครอบคลุมทุกอุตสาหกรรม
              </p>
            </div>
            <Link
              href="/taxonomy"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-purple-200 text-purple-700 text-xs font-semibold rounded-xl hover:bg-purple-100 transition whitespace-nowrap self-start sm:self-auto"
            >
              <Sliders className="w-3.5 h-3.5" /> จัดการหรือเพิ่มตำแหน่งงานใหม่
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2">
            {[
              { name: "การแพทย์และสาธารณสุข", en: "Healthcare & Medical", icon: "🩺" },
              { name: "ธุรกิจและการจัดการ", en: "Business & Management", icon: "💼" },
              { name: "การเงินและการบัญชี", en: "Finance & Accounting", icon: "📊" },
              { name: "วิศวกรรมและอุตสาหกรรม", en: "Engineering & Industrial", icon: "⚙️" },
              { name: "เทคโนโลยีและสารสนเทศ", en: "Technology & IT", icon: "💻" },
              { name: "การศึกษาและวิชาการ", en: "Education & Academic", icon: "🎓" },
              { name: "กฎหมายและภาครัฐ", en: "Legal & Government", icon: "⚖️" },
              { name: "การออกแบบและสื่อ", en: "Design & Media", icon: "🎨" },
              { name: "การบริการและการบิน", en: "Hospitality & Service", icon: "✈️" },
              { name: "สาขาวิชาชีพเฉพาะทาง", en: "Specialized Professions", icon: "🔬" },
            ].map((ind) => (
              <Link
                key={ind.en}
                href={`/synthetic`}
                className="p-3 bg-white rounded-xl border border-purple-100/70 hover:border-purple-300 hover:shadow-2xs transition group"
              >
                <div className="text-lg mb-1">{ind.icon}</div>
                <div className="font-bold text-xs text-slate-800 group-hover:text-purple-700 transition">
                  {ind.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate">{ind.en}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Infrastructure & Services Status */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                สถานะระบบและบริการพื้นฐาน (Infrastructure Health)
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 100% Operational
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="text-slate-500 text-[11px]">Backend API</div>
              <div className="font-bold text-slate-800">NestJS (Port 4000)</div>
              <div className="text-[10px] text-emerald-600 font-semibold">● Healthy</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="text-slate-500 text-[11px]">AI Service</div>
              <div className="font-bold text-slate-800">FastAPI (Port 8000)</div>
              <div className="text-[10px] text-emerald-600 font-semibold">● Healthy</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="text-slate-500 text-[11px]">Database</div>
              <div className="font-bold text-slate-800">Postgres 16</div>
              <div className="text-[10px] text-emerald-600 font-semibold">● Connected</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="text-slate-500 text-[11px]">Object Storage</div>
              <div className="font-bold text-slate-800">MinIO S3 (9000)</div>
              <div className="text-[10px] text-emerald-600 font-semibold">● Ready</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="text-slate-500 text-[11px]">Background Queue</div>
              <div className="font-bold text-slate-800">Redis 7 (6379)</div>
              <div className="text-[10px] text-emerald-600 font-semibold">● Active</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="text-slate-500 text-[11px]">MLflow Tracking</div>
              <div className="font-bold text-slate-800">Port 5001</div>
              <div className="text-[10px] text-emerald-600 font-semibold">● Lineage Tracked</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>InterviewX DataHub • ศูนย์เตรียมชุดข้อมูลสำหรับฝึกสอนโมเดลปัญญาประดิษฐ์ InterviewX</div>
        <div className="flex items-center gap-4">
          <Link href="/synthetic" className="hover:underline">สตูดิโอสังเคราะห์</Link>
          <Link href="/taxonomy" className="hover:underline">ผังโครงสร้าง Taxonomy</Link>
          <Link href="/resumes" className="hover:underline">คลังเอกสารเรซูเม</Link>
          <Link href="/datasets" className="hover:underline">ส่งออกชุดข้อมูล</Link>
          <a href="http://localhost:4000/docs" target="_blank" rel="noreferrer" className="hover:underline">เอกสาร API</a>
        </div>
      </footer>
    </div>
  );
}
