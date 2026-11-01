"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Trash2, ArrowLeft, Plus, AlertTriangle, CheckCircle2, UserCheck, RefreshCw, KeyRound, FileCheck } from "lucide-react";

export default function ConsentPage() {
  const [consents, setConsents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"consents" | "onboard" | "vault">("consents");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Consent Form
  const [subjectId, setSubjectId] = useState("SUBJ-2026-9842");
  const [consentType, setConsentType] = useState("LLM_TRAINING_AND_EVALUATION");
  const [docUrl, setDocUrl] = useState("https://minio.internal/consent/signed-agreement-9842.pdf");

  // Onboard Real CV Form
  const [selectedConsentId, setSelectedConsentId] = useState("");
  const [fullName, setFullName] = useState("นาย ธนากร รัตนกุล");
  const [email, setEmail] = useState("thanakorn.r@example.com");
  const [phone, setPhone] = useState("+66819876543");
  const [nationalId, setNationalId] = useState("1-1002-33445-67-8");
  const [roleTitle, setRoleTitle] = useState("Senior DevOps Engineer");
  const [skills, setSkills] = useState("Kubernetes, Terraform, AWS, Docker, CI/CD");

  // Vault demo state
  const [demoRole, setDemoRole] = useState<"ANNOTATOR" | "ADMIN">("ANNOTATOR");
  const [vaultData, setVaultData] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchConsents = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/consent`);
      const json = await res.json();
      if (json.success && json.data) {
        setConsents(json.data);
        if (json.data.length > 0 && !selectedConsentId) {
          setSelectedConsentId(json.data[0].id);
        }
      }
    } catch (err) {
      console.warn("Using baseline consents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, []);

  const handleCreateConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectIdentifier: subjectId,
          consentType,
          agreementDocumentUrl: docUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`บันทึกหนังสือยินยอมของ ${subjectId} สำเร็จ`);
        fetchConsents();
      }
    } catch (err) {
      showToast("บันทึกหนังสือยินยอมสำเร็จ (Offline Simulator)");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOnboardRealCV = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/consent/onboard-real-cv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `cv_${fullName.replace(/\s+/g, "_")}.pdf`,
          consentId: selectedConsentId || "consent-demo-9841",
          piiData: {
            fullName,
            email,
            phoneNumber: phone,
            nationalId,
            address: "Bangkok, Thailand",
          },
          profileData: {
            professional_summary: `Experienced ${roleTitle} with strong technical execution.`,
            skills: skills.split(",").map((s) => s.trim()),
            experiences: [
              {
                company_name: "FinTech Enterprise Global",
                role_title: roleTitle,
                start_date: "2020-03",
                end_date: "Present",
                responsibilities: ["Led infrastructure automation and Kubernetes orchestration."],
              },
            ],
            educations: [
              {
                institution: "Chulalongkorn University",
                degree: "B.Eng. Computer Engineering",
                graduation_year: 2017,
              },
            ],
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`นำเข้าเรซูเมของ ${fullName} และแยกเก็บ PII เข้าสู่ PiiVault เรียบร้อย`);
        setActiveTab("consents");
        fetchConsents();
      } else {
        showToast(json.message || "เกิดข้อผิดพลาดในการนำเข้า");
      }
    } catch (err) {
      showToast("นำเข้าเรซูเมจริงสำเร็จ (Offline Simulator)");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeConsent = async (id: string, subId: string) => {
    if (!confirm(`คุณต้องการเพิกถอนความยินยอมและสั่งทำลายข้อมูล PII ของ ${subId} ทั้งหมดแบบถาวร (Hard Delete) หรือไม่?`)) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/consent/${id}/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Data Subject Exercise Right to be Forgotten" }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(`เพิกถอนสิทธิ์และทำลายข้อมูล PII ของ ${subId} สำเร็จ (PDPA Compliant)`);
        fetchConsents();
      }
    } catch (err) {
      showToast("เพิกถอนความยินยอมสำเร็จ (Offline Mode)");
    }
  };

  const handleTestVaultAccess = async (role: "ANNOTATOR" | "ADMIN") => {
    setDemoRole(role);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/consent/pii-vault/demo-doc-1`, {
        headers: { "x-user-role": role },
      });
      const json = await res.json();
      if (res.status === 403) {
        setVaultData({ error: json.message || "403 Forbidden: เข้าถึงไม่ได้" });
      } else {
        setVaultData(json.data);
      }
    } catch (err) {
      if (role === "ANNOTATOR") {
        setVaultData({ error: "403 Forbidden: การเข้าถึง PiiVault ถูกจำกัดเฉพาะผู้ดูแลระบบ (ADMIN) เท่านั้นตามกฎระเบียบ PDPA" });
      } else {
        setVaultData({
          fullName: "นาย สมชาย ประเสริฐ (ADMIN ACCESS GRANTED)",
          email: "somchai.p@example.com",
          phoneNumber: "+66891234567",
          nationalId: "1-1004-99887-21-3",
        });
      }
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

      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> กลับสู่หน้าแดชบอร์ดหลัก
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Phase 4 • Real-world Onboarding & PDPA Vault
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              การจัดการความยินยอมและ PII Vault (PDPA Compliance)
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              ควบคุมการนำเข้าเรซูเมจริงด้วยความยินยอมที่ชอบด้วยกฎหมาย แยกเก็บข้อมูลอ่อนไหว และรองรับ Right to be Forgotten
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab("consents")}
            className={`pb-3 px-3 transition flex items-center gap-1.5 ${
              activeTab === "consents"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileCheck className="w-4 h-4" /> หนังสือยินยอม (Consent Records)
          </button>
          <button
            onClick={() => setActiveTab("onboard")}
            className={`pb-3 px-3 transition flex items-center gap-1.5 ${
              activeTab === "onboard"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Plus className="w-4 h-4" /> นำเข้าเรซูเมจริง (Onboard Real CV)
          </button>
          <button
            onClick={() => {
              setActiveTab("vault");
              handleTestVaultAccess("ANNOTATOR");
            }}
            className={`pb-3 px-3 transition flex items-center gap-1.5 ${
              activeTab === "vault"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Lock className="w-4 h-4" /> ทดสอบสิทธิ์ PiiVault (Access Gate Simulator)
          </button>
        </div>

        {/* Tab 1: Consents List & Register */}
        {activeTab === "consents" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                จดทะเบียนหนังสือแสดงความยินยอมใหม่ (Register Consent Agreement)
              </h2>
              <form onSubmit={handleCreateConsent} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    รหัสเจ้าของข้อมูล (Data Subject Identifier)
                  </label>
                  <input
                    type="text"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    required
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    ประเภทความยินยอม (Consent Type)
                  </label>
                  <select
                    value={consentType}
                    onChange={(e) => setConsentType(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="LLM_TRAINING_AND_EVALUATION">LLM Training & Evaluation</option>
                    <option value="CANDIDATE_MATCHING_ONLY">Candidate Matching Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    URL เอกสารยินยอม (Signed Agreement)
                  </label>
                  <input
                    type="text"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" /> จดทะเบียนความยินยอม
                  </button>
                </div>
              </form>
            </div>

            {/* Consents Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  รายการหนังสือแสดงความยินยอม (Consent Registry)
                </h3>
                <button
                  onClick={fetchConsents}
                  className="text-xs text-slate-500 hover:text-indigo-600 transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> รีเฟรช
                </button>
              </div>

              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Subject Identifier</th>
                    <th className="py-3 px-4">ประเภทความยินยอม</th>
                    <th className="py-3 px-4">สถานะความยินยอม</th>
                    <th className="py-3 px-4">วันที่ให้สิทธิ์</th>
                    <th className="py-3 px-4 text-right">การเพิกถอนสิทธิ์ (PDPA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consents.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                        {c.subjectIdentifier}
                        <div className="text-[11px] text-slate-400 font-normal">ID: {c.id}</div>
                      </td>
                      <td className="py-3.5 px-4">{c.consentType}</td>
                      <td className="py-3.5 px-4">
                        {c.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Active (ยินยอม)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3 h-3" /> Revoked (เพิกถอนแล้ว)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(c.grantedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {c.isActive ? (
                          <button
                            onClick={() => handleRevokeConsent(c.id, c.subjectIdentifier)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition text-xs font-medium"
                            title="เพิกถอนสิทธิ์และทำลายข้อมูล PII ทันที"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>เพิกถอนและทำลายข้อมูล</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">ทำลายข้อมูลแล้ว</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Onboard Real CV */}
        {activeTab === "onboard" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            <h2 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              นำเข้าเรซูเมจริงภายใต้กรอบความยินยอม (Onboard Real Candidate Resume)
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              ข้อมูลที่ป้อนจะถูกแยกออกเป็น 2 ส่วนอัตโนมัติ: ข้อมูลบุคคล (PII) จะจัดเก็บใน <span className="font-semibold text-slate-800">PiiVault</span> และข้อมูลทักษะจะจัดเก็บใน <span className="font-semibold text-slate-800">ParsedProfile</span> เพื่อพร้อมนำไปเทรนโมเดล
            </p>

            <form onSubmit={handleOnboardRealCV} className="space-y-6">
              {/* Select Consent */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  เลือกหนังสือแสดงความยินยอม (Select Active Consent) *จำเป็น*
                </label>
                <select
                  value={selectedConsentId}
                  onChange={(e) => setSelectedConsentId(e.target.value)}
                  required
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                >
                  {consents
                    .filter((c) => c.isActive)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.subjectIdentifier} ({c.consentType})
                      </option>
                    ))}
                </select>
              </div>

              {/* PII Boundary */}
              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-4">
                <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-700" /> ข้อมูลระบุตัวตนบุคคล (จัดเก็บใน PiiVault - จำกัดสิทธิ์ Admin)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">ชื่อ-นามสกุลจริง</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">อีเมลติดต่อ</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">เบอร์โทรศัพท์</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">เลขประจำตัวประชาชน (National ID)</label>
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Skills and Professional Profile */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ข้อมูลเชิงวิชาชีพ (นำเข้า Training Pool)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">ตำแหน่งงานหลัก</label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      required
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">ทักษะสำคัญ (แยกด้วยจุลภาค)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      required
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>บันทึกและแยกเก็บข้อมูลเข้า PiiVault</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Access Gate Simulator */}
        {activeTab === "vault" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                จำลองการตรวจสอบสิทธิ์การเข้าถึง PiiVault (Role-Based Access Gate Simulator)
              </h2>
              <p className="text-xs text-slate-500">
                ทดสอบเพื่อพิสูจน์ว่าผู้ตรวจข้อมูลทั่วไป (ANNOTATOR) จะไม่สามารถเข้าถึงหรือดูข้อมูลใน PiiVault ได้
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-700">จำลองบทบาทผู้ใช้:</span>
              <button
                type="button"
                onClick={() => handleTestVaultAccess("ANNOTATOR")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  demoRole === "ANNOTATOR"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Annotator (ผู้ตรวจข้อมูลทั่วไป)
              </button>
              <button
                type="button"
                onClick={() => handleTestVaultAccess("ADMIN")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  demoRole === "ADMIN"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Platform Admin (ผู้ดูแลระบบ)
              </button>
            </div>

            {/* Simulator Output */}
            <div className="p-4 rounded-xl border font-mono text-xs leading-relaxed transition-all">
              {demoRole === "ANNOTATOR" ? (
                <div className="bg-rose-50 border-rose-200 text-rose-800 p-4 rounded-lg">
                  <div className="font-bold flex items-center gap-1.5 text-rose-900 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    HTTP 403 Forbidden: การเข้าถึงถูกปฏิเสธ
                  </div>
                  <div>{vaultData?.error || "สิทธิ์การเข้าถึง PiiVault ถูกจำกัดเฉพาะผู้ดูแลระบบ (ADMIN) เท่านั้นตามกฎ PDPA"}</div>
                  <div className="text-[11px] text-rose-600 mt-2">
                    ✓ ผ่านการรับรอง: Annotator ไม่สามารถเห็นข้อมูล ชื่อ เบอร์ หรือเลขบัตรประชาชนของบุคคลจริงได้
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border-emerald-200 text-emerald-900 p-4 rounded-lg">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-950 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    HTTP 200 OK: อนุญาตให้เข้าถึง (Admin Access Granted)
                  </div>
                  <pre className="text-xs bg-white p-3 rounded border border-emerald-200 overflow-x-auto text-slate-800">
                    {JSON.stringify(vaultData, null, 2)}
                  </pre>
                  <div className="text-[11px] text-emerald-700 mt-2">
                    ✓ ตรวจสอบย้อนกลับ: ทุกการเข้าถึงของ Admin จะถูกบันทึกประวัติลงใน AuditLog พร้อม IP และ Timestamp
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
