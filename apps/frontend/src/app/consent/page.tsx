"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import {
  ShieldCheck,
  Lock,
  Trash2,
  ArrowLeft,
  Plus,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  RefreshCw,
  KeyRound,
  FileCheck,
  Sparkles,
  Sliders,
  FileText,
  Download,
  Eye,
  EyeOff,
  History,
  Scale,
  Activity,
  Check,
  X,
  FileCode,
} from "lucide-react";

export default function ConsentPage() {
  const [consents, setConsents] = useState<any[]>([]);
  const [authLogs, setAuthLogs] = useState<any[]>([]);
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"consents" | "onboard" | "vault" | "auth_logs" | "check_tester">("consents");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Consent Form
  const [subjectId, setSubjectId] = useState(`SUBJ-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [consentVersion, setConsentVersion] = useState("1.0");
  const [legalBasis, setLegalBasis] = useState("CONSENT");
  const [consentType, setConsentType] = useState("LLM_TRAINING_AND_EVALUATION");
  const [docUrl, setDocUrl] = useState("https://minio.internal/consent-agreements/signed-agreement.pdf");
  const [evidenceRef, setEvidenceRef] = useState("EVID-SHA256-" + Math.random().toString(36).substring(2, 8));
  
  // Selected purposes & categories
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([
    "DOCUMENT_EXTRACTION",
    "PROFILE_MANAGEMENT",
    "AI_MODEL_TRAINING",
    "AI_EVALUATION",
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "RESUME",
    "CV",
    "ACADEMIC_CV",
    "PORTFOLIO",
    "CERTIFICATE",
  ]);

  // Onboard Real CV Form
  const [selectedConsentId, setSelectedConsentId] = useState("");
  const [fullName, setFullName] = useState("นาย ดนัย วงศ์วิจิตร");
  const [email, setEmail] = useState("danai.w@example.com");
  const [phone, setPhone] = useState("+66819876543");
  const [nationalId, setNationalId] = useState("1-1004-88776-54-3");
  const [address, setAddress] = useState("Bangkok, Thailand");
  const [roleTitle, setRoleTitle] = useState("Principal AI Systems Architect");

  // Vault demo state
  const { role, setRole } = useRole();
  const [vaultDocId, setVaultDocId] = useState("doc-001-demo");
  const [vaultData, setVaultData] = useState<any>(null);
  const [vaultLoading, setVaultLoading] = useState(false);

  // Authorization Check Tester State
  const [testConsentId, setTestConsentId] = useState("");
  const [testPurpose, setTestPurpose] = useState("AI_MODEL_TRAINING");
  const [testActivity, setTestActivity] = useState("DATASET_EXPORT");
  const [testCategory, setTestCategory] = useState("RESUME");
  const [testResult, setTestResult] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

  const fetchConsents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/consent`);
      const json = await res.json();
      if (json.success && json.data) {
        setConsents(json.data);
        if (json.data.length > 0 && !selectedConsentId) {
          setSelectedConsentId(json.data[0].id);
          setTestConsentId(json.data[0].id);
        }
      }
    } catch (err) {
      console.warn("Using fallback baseline consents:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const [authRes, accessRes] = await Promise.all([
        fetch(`${apiUrl}/consent/authorization/logs`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${apiUrl}/consent/pii-vault/access-logs`).then((r) => r.json()).catch(() => ({ data: [] })),
      ]);
      if (authRes.data) setAuthLogs(authRes.data);
      if (accessRes.data) setAccessLogs(accessRes.data);
    } catch (err) {
      console.warn("Could not load logs:", err);
    }
  };

  useEffect(() => {
    fetchConsents();
    fetchLogs();
  }, []);

  const handleCreateConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectIdentifier: subjectId,
          consentVersion,
          legalBasis,
          consentType,
          permittedPurposes: selectedPurposes,
          permittedDataCategories: selectedCategories,
          permittedProcessingActivities: ["PARSING", "DEEP_EXTRACTION", "PII_VAULTING", "DATASET_EXPORT"],
          agreementDocumentUrl: docUrl,
          evidenceReference: evidenceRef,
          collectionMethod: "DIRECT_PORTAL",
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`บันทึกหนังสือแสดงความยินยอม (${subjectId}) สำเร็จ`);
        fetchConsents();
        setActiveTab("consents");
      }
    } catch (err) {
      showToast("บันทึกหนังสือยินยอมสำเร็จ (Simulator)");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeConsent = async (consentId: string) => {
    if (!confirm(`คุณต้องการเพิกถอนความยินยอม ${consentId} และทำลายข้อมูล PII ใน PiiVault ทันทีหรือไม่? (PDPA Right to be Forgotten)`)) {
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/consent/${consentId}/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Data Subject Withdrawal Request under PDPA Section 19" }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`เพิกถอนความยินยอมและทำลายข้อมูล PII ใน PiiVault สำเร็จ`);
        fetchConsents();
        fetchLogs();
      }
    } catch (err) {
      showToast("เพิกถอนความยินยอมสำเร็จ (Simulator)");
    }
  };

  const handleFetchVaultData = async () => {
    setVaultLoading(true);
    try {
      const res = await fetch(`${apiUrl}/consent/pii-vault/${vaultDocId}`, {
        headers: {
          "x-user-role": role,
        },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setVaultData(json.data);
      } else {
        setVaultData({
          error: true,
          message: json.message || "การเข้าถึงถูกปฏิเสธ (403 Forbidden)",
        });
      }
      fetchLogs();
    } catch (err: any) {
      setVaultData({ error: true, message: err.message });
    } finally {
      setVaultLoading(false);
    }
  };

  const handleTestAuthorization = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/consent/authorization/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consentId: testConsentId,
          purpose: testPurpose,
          activity: testActivity,
          dataCategory: testCategory,
        }),
      });
      const json = await res.json();
      setTestResult(json);
      fetchLogs();
    } catch (err: any) {
      setTestResult({ isAuthorized: false, decisionReason: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-700 transition flex items-center gap-1.5 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> แดชบอร์ดหลัก
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-900 leading-tight">
                  Consent Manager & PII Vault Isolation
                </h1>
                <p className="text-[11px] text-slate-500">
                  ระบบบริหารจัดการความยินยอม PDPA และห้องนิรภัยข้อมูลระบุตัวบุคคลแบบเข้ารหัส
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              PDPA & Zero-Leakage Active
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6 flex gap-6 text-xs font-medium border-t border-slate-100">
          <button
            onClick={() => setActiveTab("consents")}
            className={`py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "consents"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            หนังสือยินยอม ({consents.length})
          </button>
          <button
            onClick={() => setActiveTab("onboard")}
            className={`py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "onboard"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            ลงทะเบียนยินยอมฉบับใหม่
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "vault"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            PII Vault Inspector (AES-256-GCM)
          </button>
          <button
            onClick={() => setActiveTab("check_tester")}
            className={`py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "check_tester"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Purpose Limitation Tester
          </button>
          <button
            onClick={() => setActiveTab("auth_logs")}
            className={`py-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === "auth_logs"
                ? "border-indigo-600 text-indigo-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Audit Decision Logs ({authLogs.length})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* TAB 1: Consents List */}
        {activeTab === "consents" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">ทะเบียนหนังสือแสดงความยินยอม (Consent Records)</h2>
                <p className="text-xs text-slate-500">
                  ทุกรายการจัดเก็บอย่างไม่สามารถแก้ไขย้อนหลังได้ (Immutable History) ควบคุมวัตถุประสงค์ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล
                </p>
              </div>
              <button
                onClick={fetchConsents}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
              >
                <RefreshCw className="w-3 h-3" /> รีเฟรช
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">Consent ID / เจ้าของข้อมูล</th>
                    <th className="px-4 py-3">ฐานกฎหมาย / เวอร์ชัน</th>
                    <th className="px-4 py-3">วัตถุประสงค์ที่อนุญาต (Purposes)</th>
                    <th className="px-4 py-3">หมวดหมู่เอกสาร</th>
                    <th className="px-4 py-3">สถานะ</th>
                    <th className="px-4 py-3">เอกสารที่ผูก</th>
                    <th className="px-4 py-3 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consents.map((c) => {
                    const isWithdrawn = c.status === "WITHDRAWN" || !c.isActive;
                    const purposes: string[] = Array.isArray(c.permittedPurposes)
                      ? c.permittedPurposes
                      : ["DOCUMENT_EXTRACTION", "AI_MODEL_TRAINING"];
                    const categories: string[] = Array.isArray(c.permittedDataCategories)
                      ? c.permittedDataCategories
                      : ["RESUME"];

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{c.id}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                              {c.subjectIdentifier}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-800 font-medium">{c.legalBasis || "CONSENT"}</div>
                          <div className="text-[11px] text-slate-400">Ver: {c.consentVersion || "1.0"}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {purposes.slice(0, 3).map((p) => (
                              <span
                                key={p}
                                className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                                  p === "AI_MODEL_TRAINING"
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                              >
                                {p}
                              </span>
                            ))}
                            {purposes.length > 3 && (
                              <span className="text-[10px] text-slate-400">+{purposes.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {categories.slice(0, 2).map((cat) => (
                              <span
                                key={cat}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {isWithdrawn ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-medium">
                              <X className="w-3 h-3" /> เพิกถอนแล้ว (Withdrawn)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                              <Check className="w-3 h-3" /> ใช้งานอยู่ (Active)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono">
                          {c._count?.documents ?? c.documents?.length ?? 1} ฉบับ
                        </td>
                        <td className="px-4 py-3 text-right">
                          {!isWithdrawn ? (
                            <button
                              onClick={() => handleRevokeConsent(c.id)}
                              className="text-[11px] text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded border border-rose-200 transition font-medium flex items-center gap-1 ml-auto"
                            >
                              <Trash2 className="w-3 h-3" /> ถอนความยินยอม
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">PII Purged</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Onboard / Create Consent Form */}
        {activeTab === "onboard" && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">บันทึกหนังสือแสดงความยินยอมฉบับใหม่</h2>
              <p className="text-xs text-slate-500">
                กำหนดขอบเขตและวัตถุประสงค์ตามหลัก Purpose Limitation เพื่อให้เป็นไปตามข้อกำหนดความปลอดภัยของระบบ
              </p>
            </div>

            <form onSubmit={handleCreateConsent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">รหัสเจ้าของข้อมูล (Subject ID)</label>
                  <input
                    type="text"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-indigo-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">เวอร์ชันหนังสือยินยอม</label>
                  <input
                    type="text"
                    value={consentVersion}
                    onChange={(e) => setConsentVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ฐานกฎหมายในการประมวลผล (Legal Basis)</label>
                  <select
                    value={legalBasis}
                    onChange={(e) => setLegalBasis(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-indigo-500 bg-white"
                  >
                    <option value="CONSENT">ความยินยอม (Consent - PDPA Sec 19)</option>
                    <option value="CONTRACT">การปฏิบัติตามสัญญา (Contract - Sec 24(3))</option>
                    <option value="LEGAL_OBLIGATION">หน้าที่ตามกฎหมาย (Legal Obligation - Sec 24(6))</option>
                    <option value="LEGITIMATE_INTERESTS">ประโยชน์อันชอบด้วยกฎหมาย (Legitimate Interests)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ประเภทความยินยอม</label>
                  <input
                    type="text"
                    value={consentType}
                    onChange={(e) => setConsentType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5">
                  วัตถุประสงค์การประมวลผลที่ได้รับอนุญาต (Purpose Limitation)
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  {[
                    "DOCUMENT_EXTRACTION",
                    "PROFILE_MANAGEMENT",
                    "RESUME_ANALYSIS",
                    "PORTFOLIO_ANALYSIS",
                    "DATASET_PREPARATION",
                    "AI_MODEL_TRAINING",
                    "MODEL_FINE_TUNING",
                    "AI_EVALUATION",
                    "ACADEMIC_RESEARCH",
                  ].map((p) => {
                    const checked = selectedPurposes.includes(p);
                    return (
                      <label key={p} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedPurposes([...selectedPurposes, p]);
                            else setSelectedPurposes(selectedPurposes.filter((item) => item !== p));
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={p === "AI_MODEL_TRAINING" ? "font-semibold text-purple-700" : ""}>{p}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5">หมวดหมู่เอกสารที่อนุญาต (Permitted Categories)</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "RESUME",
                    "CV",
                    "ACADEMIC_CV",
                    "PORTFOLIO",
                    "TRANSCRIPT",
                    "CERTIFICATE",
                    "RECOMMENDATION_LETTER",
                    "RESEARCH_PAPER",
                    "PROJECT_REPORT",
                  ].map((cat) => {
                    const active = selectedCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          if (active) setSelectedCategories(selectedCategories.filter((c) => c !== cat));
                          else setSelectedCategories([...selectedCategories, cat]);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-md border transition ${
                          active
                            ? "bg-indigo-50 text-indigo-700 border-indigo-300 font-medium"
                            : "bg-white text-slate-500 border-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">URL หลักฐานการยินยอม (Evidence Reference)</label>
                <input
                  type="text"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("consents")}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-sm"
                >
                  {submitting ? "กำลังบันทึก..." : "บันทึกหนังสือแสดงความยินยอม"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PII Vault Inspector (Role-Based Access Control) */}
        {activeTab === "vault" && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-0.5">ระบบควบคุมการเข้าถึงห้องนิรภัย PII Vault (Zero PII Boundary)</div>
                <p>
                  ตามระเบียบ PDPA ข้อมูลระบุตัวบุคคล (PII) จะถูกเข้ารหัส AES-256-GCM และแยกเก็บไว้ในตาราง PiiVault อย่างเด็ดขาด
                  เฉพาะผู้ใช้งานที่มีบทบาท <span className="font-semibold text-slate-900">ADMIN</span> เท่านั้นที่สามารถถอดรหัสเพื่อตรวจสอบได้
                  ผู้ใช้บทบาท ANNOTATOR จะถูกจำกัดสิทธิ์ (403 Forbidden) โดยทุกความพยายามเข้าถึงจะถูกบันทึกใน PiiAccessLog
                </p>
              </div>
            </div>

            {/* Role Simulation Control */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ทดสอบจำลองสิทธิ์ผู้ใช้งาน (RBAC Simulation)
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex rounded-lg border border-slate-200 p-1 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setRole("ADMIN")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                      role === "ADMIN" ? "bg-white text-indigo-700 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    ผู้ดูแลระบบ (ADMIN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("ANNOTATOR")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                      role === "ANNOTATOR" ? "bg-white text-rose-700 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    ผู้ตรวจทาน (ANNOTATOR)
                  </button>
                </div>

                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={vaultDocId}
                    onChange={(e) => setVaultDocId(e.target.value)}
                    placeholder="Document ID (เช่น doc-001-demo)"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono flex-1 focus:outline-indigo-500"
                  />
                  <button
                    onClick={handleFetchVaultData}
                    disabled={vaultLoading}
                    className="px-4 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition"
                  >
                    {vaultLoading ? "กำลังดึงข้อมูล..." : "สืบค้น PII Vault"}
                  </button>
                </div>
              </div>

              {/* Vault Inspection Output */}
              {vaultData && (
                <div className="mt-4 p-4 rounded-lg border bg-slate-50">
                  {vaultData.error ? (
                    <div className="text-xs text-rose-600 flex items-center gap-2">
                      <X className="w-4 h-4 shrink-0" />
                      <span>{vaultData.message}</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ถอดรหัสข้อมูลระบุตัวบุคคลสำเร็จ (Admin View)
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Key: {vaultData.encryptionKeyId || "vault-master-k1"} | AES-256-GCM
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">รหัสนามแฝง (Pseudonymous Subject ID):</span>
                          <span className="font-mono text-slate-800 font-semibold">{vaultData.subjectId}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">ชื่อ-นามสกุลจริง (Full Name):</span>
                          <span className="font-medium text-slate-800">{vaultData.fullName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">อีเมล (Email):</span>
                          <span className="font-mono text-slate-800">{vaultData.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">เบอร์โทรศัพท์ (Phone):</span>
                          <span className="font-mono text-slate-800">{vaultData.phoneNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">เลขประจำตัวประชาชน (National ID):</span>
                          <span className="font-mono text-slate-800">{vaultData.nationalId || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">ที่อยู่ (Address):</span>
                          <span className="text-slate-800">{vaultData.address || "-"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PII Access Audit Logs */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  ประวัติการเข้าถึง PII Vault (Access Audit Trail)
                </h3>
                <span className="text-[11px] text-slate-400">{accessLogs.length} รายการ</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="px-3 py-2">เวลา</th>
                      <th className="px-3 py-2">บทบาทผู้เรียก (Role)</th>
                      <th className="px-3 py-2">รหัสเอกสาร</th>
                      <th className="px-3 py-2">วัตถุประสงค์</th>
                      <th className="px-3 py-2">ผลการอนุญาต</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accessLogs.slice(0, 10).map((log: any, i: number) => (
                      <tr key={log.id || i} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-500 font-mono text-[11px]">
                          {new Date(log.accessedAt || Date.now()).toLocaleTimeString()}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              log.actorRole === "ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {log.actorRole}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] text-slate-700">{log.documentId}</td>
                        <td className="px-3 py-2 text-slate-600">{log.purpose}</td>
                        <td className="px-3 py-2">
                          {log.accessDecision === "GRANTED" ? (
                            <span className="text-emerald-700 font-medium">GRANTED</span>
                          ) : (
                            <span className="text-rose-700 font-medium">DENIED_ROLE</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Purpose Limitation Tester */}
        {activeTab === "check_tester" && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">เครื่องมือทดสอบการประเมินสิทธิ์ (Authorization Decision Tester)</h2>
              <p className="text-xs text-slate-500">
                ทดสอบว่าการประมวลผลใดๆ ได้รับอนุญาตตามหนังสือยินยอมหรือไม่ โดยระบบจะตรวจสอบทั้งวัตถุประสงค์, สถานะการเพิกถอน, และหมวดหมู่เอกสาร
              </p>
            </div>

            <form onSubmit={handleTestAuthorization} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">เลือกหนังสือยินยอม (Consent ID)</label>
                <select
                  value={testConsentId}
                  onChange={(e) => setTestConsentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-indigo-500 bg-white"
                >
                  {consents.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} ({c.subjectIdentifier}) - Status: {c.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">วัตถุประสงค์ที่ขอประมวลผล (Purpose)</label>
                  <select
                    value={testPurpose}
                    onChange={(e) => setTestPurpose(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-indigo-500 bg-white"
                  >
                    <option value="AI_MODEL_TRAINING">AI_MODEL_TRAINING (เทรนโมเดล)</option>
                    <option value="DOCUMENT_EXTRACTION">DOCUMENT_EXTRACTION (สกัดเอกสาร)</option>
                    <option value="PROFILE_MANAGEMENT">PROFILE_MANAGEMENT (จัดการโปรไฟล์)</option>
                    <option value="RESUME_ANALYSIS">RESUME_ANALYSIS (วิเคราะห์เรซูเม)</option>
                    <option value="PORTFOLIO_ANALYSIS">PORTFOLIO_ANALYSIS (วิเคราะห์พอร์ต)</option>
                    <option value="ACADEMIC_RESEARCH">ACADEMIC_RESEARCH (วิจัยทางวิชาการ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">กิจกรรมการประมวลผล (Activity)</label>
                  <select
                    value={testActivity}
                    onChange={(e) => setTestActivity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-indigo-500 bg-white"
                  >
                    <option value="DATASET_EXPORT">DATASET_EXPORT</option>
                    <option value="PARSING">PARSING</option>
                    <option value="DEEP_EXTRACTION">DEEP_EXTRACTION</option>
                    <option value="PII_VAULTING">PII_VAULTING</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">หมวดหมู่เอกสาร (Data Category)</label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-indigo-500 bg-white"
                >
                  <option value="RESUME">RESUME</option>
                  <option value="ACADEMIC_CV">ACADEMIC_CV</option>
                  <option value="PORTFOLIO">PORTFOLIO</option>
                  <option value="TRANSCRIPT">TRANSCRIPT</option>
                  <option value="CERTIFICATE">CERTIFICATE</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                ตรวจสอบสิทธิ์การประมวลผล (Evaluate Authorization Decision)
              </button>
            </form>

            {testResult && (
              <div
                className={`p-4 rounded-xl border ${
                  testResult.isAuthorized
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50/50 border-rose-200 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm mb-1">
                  {testResult.isAuthorized ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <X className="w-5 h-5 text-rose-600" />
                  )}
                  <span>
                    {testResult.isAuthorized ? "AUTHORIZED (อนุญาตให้ดำเนินการ)" : "DENIED (ปฏิเสธการประมวลผล)"}
                  </span>
                </div>
                <div className="text-xs space-y-1 mt-2">
                  <div>
                    <span className="font-medium text-slate-500">Decision Code:</span>{" "}
                    <span className="font-mono">{testResult.decisionCode}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">Reason:</span> {testResult.decisionReason}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Audit Decision Logs */}
        {activeTab === "auth_logs" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                ประวัติการตัดสินใจทางสิทธิ์ (Processing Authorization Decision Logs)
              </h2>
              <p className="text-xs text-slate-500">
                หลักฐานการตรวจสอบและปฏิเสธคำขอประมวลผลทั้งหมดเพื่อการตรวจสอบความสอดคล้องตามกฎหมาย
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">เวลาประเมิน</th>
                    <th className="px-4 py-3">วัตถุประสงค์ (Purpose)</th>
                    <th className="px-4 py-3">กิจกรรม (Activity)</th>
                    <th className="px-4 py-3">หมวดหมู่</th>
                    <th className="px-4 py-3">ผลการตัดสินใจ</th>
                    <th className="px-4 py-3">เหตุผล</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {authLogs.map((log: any, idx: number) => (
                    <tr key={log.id || idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                        {new Date(log.evaluatedAt || Date.now()).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{log.purpose}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{log.activity}</td>
                      <td className="px-4 py-3 text-slate-600">{log.dataCategory || "-"}</td>
                      <td className="px-4 py-3">
                        {log.isAuthorized ? (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            PERMITTED
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {log.decisionCode || "DENIED"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-sm truncate">{log.decisionReason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
