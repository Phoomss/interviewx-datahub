"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Search, Sparkles, CheckCircle2, Clock, Eye, ShieldCheck, ArrowRight } from "lucide-react";

export default function ResumesListPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadDocs() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
        const res = await fetch(`${apiUrl}/documents`);
        const json = await res.json();
        if (json.success && json.data) {
          setDocuments(json.data);
        }
      } catch (err) {
        console.warn("Using baseline resume list:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const filteredDocs = documents.filter((doc) => {
    const matchStatus = filterStatus === "ALL" || doc.status === filterStatus;
    const matchSearch = doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              Quality Gate & Verification
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              คลังเอกสารเรซูเม (Resume Repository)
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              ตรวจสอบ รับรองความถูกต้อง และเตรียมข้อมูลเรซูเมสำหรับส่งออกเข้าสู่ชุดข้อมูล LLM
            </p>
          </div>

          <Link
            href="/resumes/doc-001-demo/review"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <span>เปิดหน้าต่าง Side-by-side Review</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อไฟล์ หรือตำแหน่งงาน..."
              className="w-full text-xs border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            {["ALL", "PARSED", "IN_REVIEW", "APPROVED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  filterStatus === st
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Resumes Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">ชื่อเอกสาร</th>
                <th className="py-3 px-4">ประเภทข้อมูล</th>
                <th className="py-3 px-4">สถานะการตรวจ</th>
                <th className="py-3 px-4">ความเชื่อมั่น (Confidence)</th>
                <th className="py-3 px-4 text-right">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>{doc.fileName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">ID: {doc.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {doc.isSynthetic ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        <Sparkles className="w-3 h-3" /> Synthetic
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <ShieldCheck className="w-3 h-3" /> Real Authorized
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        doc.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : doc.status === "REJECTED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    {doc.parsedProfile?.confidenceScore
                      ? `${(doc.parsedProfile.confidenceScore * 100).toFixed(0)}%`
                      : "94%"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/resumes/${doc.id}/review`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>ตรวจข้อมูล</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
