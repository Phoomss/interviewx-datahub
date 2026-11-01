"use client";

import React, { useState } from "react";
import { Plus, Trash2, CheckCircle, AlertCircle, Briefcase, GraduationCap, Wrench, MessageSquare, ShieldCheck } from "lucide-react";

interface ProfileEditorProps {
  initialProfile: any;
  confidenceScore: number;
  extractorVersion: string;
  onFocusSection: (section: string) => void;
  onChangeProfile: (updated: any) => void;
  reviewNotes: string;
  onChangeReviewNotes: (notes: string) => void;
}

export function ProfileEditor({
  initialProfile,
  confidenceScore,
  extractorVersion,
  onFocusSection,
  onChangeProfile,
  reviewNotes,
  onChangeReviewNotes,
}: ProfileEditorProps) {
  const [profile, setProfile] = useState(initialProfile || {
    professional_summary: "",
    skills: [],
    experiences: [],
    educations: [],
  });
  const [newSkill, setNewSkill] = useState("");

  const updateField = (field: string, val: any) => {
    const updated = { ...profile, [field]: val };
    setProfile(updated);
    onChangeProfile(updated);
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (!profile.skills.includes(newSkill.trim())) {
        const updatedSkills = [...profile.skills, newSkill.trim()];
        updateField("skills", updatedSkills);
      }
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = profile.skills.filter((s: string) => s !== skillToRemove);
    updateField("skills", updatedSkills);
  };

  const handleExperienceChange = (index: number, key: string, value: any) => {
    const updatedExps = [...profile.experiences];
    updatedExps[index] = { ...updatedExps[index], [key]: value };
    updateField("experiences", updatedExps);
  };

  const handleAddExperience = () => {
    const updatedExps = [
      ...profile.experiences,
      {
        company_name: "New Company",
        role_title: "Role Title",
        start_date: "2023-01",
        end_date: "Present",
        responsibilities: ["Enter key achievements..."],
        technologies_used: [],
      },
    ];
    updateField("experiences", updatedExps);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExps = profile.experiences.filter((_: any, i: number) => i !== index);
    updateField("experiences", updatedExps);
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50/50 p-6 space-y-6">
      {/* Quality Gate & Confidence Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quality Gate Verification</div>
            <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <span>ความน่าเชื่อถือของการสกัด: {(confidenceScore * 100).toFixed(0)}%</span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-3 h-3" /> ผ่านเกณฑ์ Sanity Check
              </span>
            </div>
          </div>
        </div>
        <div className="text-right text-xs text-slate-400">
          <div>Model: {extractorVersion || "gemini-flash"}</div>
          <div>PII Status: Filtered & Isolated</div>
        </div>
      </div>

      {/* 1. Professional Summary Section */}
      <div
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition"
        onFocus={() => onFocusSection("summary")}
      >
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            บทคัดย่อประวัติการทำงาน (Professional Summary)
          </label>
        </div>
        <textarea
          rows={3}
          value={profile.professional_summary || ""}
          onChange={(e) => updateField("professional_summary", e.target.value)}
          placeholder="กรอกสรุปประวัติ จุดเด่นของผู้สมัคร..."
          className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed resize-none"
        />
      </div>

      {/* 2. Skills Tag Management Section */}
      <div
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition"
        onFocus={() => onFocusSection("skills")}
      >
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-indigo-600" />
            ทักษะความเชี่ยวชาญ (Technical Skills)
          </label>
          <span className="text-xs text-slate-400 font-mono">{profile.skills?.length || 0} skills</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {profile.skills?.map((skill: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 group"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-400 hover:text-rose-600 transition"
                title="ลบสกิลนี้"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder="+ พิมพ์ชื่อสกิลแล้วกด Enter เพื่อเพิ่ม..."
          className="w-full text-xs border border-dashed border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* 3. Work Experiences Section */}
      <div
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition"
        onFocus={() => onFocusSection("experiences")}
      >
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            ประวัติการทำงาน (Work Experiences)
          </label>
          <button
            type="button"
            onClick={handleAddExperience}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            <Plus className="w-3.5 h-3.5" /> เพิ่มประสบการณ์
          </button>
        </div>

        <div className="space-y-4">
          {profile.experiences?.map((exp: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg relative group">
              <button
                type="button"
                onClick={() => handleRemoveExperience(idx)}
                className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition"
                title="ลบรายการนี้"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-3 mb-3 pr-8">
                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-1">บริษัท / องค์กร</div>
                  <input
                    type="text"
                    value={exp.company_name || ""}
                    onChange={(e) => handleExperienceChange(idx, "company_name", e.target.value)}
                    className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-1">ตำแหน่งงาน</div>
                  <input
                    type="text"
                    value={exp.role_title || ""}
                    onChange={(e) => handleExperienceChange(idx, "role_title", e.target.value)}
                    className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-1">เริ่ม (YYYY-MM)</div>
                  <input
                    type="text"
                    value={exp.start_date || ""}
                    onChange={(e) => handleExperienceChange(idx, "start_date", e.target.value)}
                    className="w-full text-xs text-slate-700 border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-500 mb-1">สิ้นสุด (YYYY-MM / Present)</div>
                  <input
                    type="text"
                    value={exp.end_date || ""}
                    onChange={(e) => handleExperienceChange(idx, "end_date", e.target.value)}
                    className="w-full text-xs text-slate-700 border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">รายละเอียดและผลงาน (แยกด้วยเครื่องหมายขึ้นบรรทัดใหม่)</div>
                <textarea
                  rows={2}
                  value={Array.isArray(exp.responsibilities) ? exp.responsibilities.join("\n") : exp.responsibilities || ""}
                  onChange={(e) => handleExperienceChange(idx, "responsibilities", e.target.value.split("\n"))}
                  className="w-full text-xs text-slate-700 border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Educations Section */}
      <div
        className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition"
        onFocus={() => onFocusSection("educations")}
      >
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            ประวัติการศึกษา (Education)
          </label>
        </div>

        <div className="space-y-3">
          {profile.educations?.map((edu: any, idx: number) => (
            <div key={idx} className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg grid grid-cols-3 gap-3">
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">สถาบัน</div>
                <input
                  type="text"
                  value={edu.institution || ""}
                  onChange={(e) => {
                    const updated = [...profile.educations];
                    updated[idx] = { ...updated[idx], institution: e.target.value };
                    updateField("educations", updated);
                  }}
                  className="w-full text-xs font-semibold text-slate-900 border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">วุฒิ / สาขา</div>
                <input
                  type="text"
                  value={edu.degree || ""}
                  onChange={(e) => {
                    const updated = [...profile.educations];
                    updated[idx] = { ...updated[idx], degree: e.target.value };
                    updateField("educations", updated);
                  }}
                  className="w-full text-xs text-slate-700 border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">ปีที่สำเร็จการศึกษา</div>
                <input
                  type="number"
                  value={edu.graduation_year || 2020}
                  onChange={(e) => {
                    const updated = [...profile.educations];
                    updated[idx] = { ...updated[idx], graduation_year: parseInt(e.target.value) };
                    updateField("educations", updated);
                  }}
                  className="w-full text-xs text-slate-700 border border-slate-200 rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Reviewer Notes for Audit Trail */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <label className="text-sm font-semibold text-slate-900 mb-2 block">
          บันทึกการตรวจสอบสำหรับ Audit Trail (Review Notes)
        </label>
        <textarea
          rows={2}
          value={reviewNotes}
          onChange={(e) => onChangeReviewNotes(e.target.value)}
          placeholder="ระบุเหตุผลการอนุมัติ การปฏิเสธ หรือสิ่งที่ได้ทำการแก้ไข เพื่อเก็บบันทึกประวัติ..."
          className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition leading-relaxed resize-none"
        />
      </div>
    </div>
  );
}
