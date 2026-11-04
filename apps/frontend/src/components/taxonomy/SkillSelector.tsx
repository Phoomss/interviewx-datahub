"use client";

import React, { useState, useMemo } from "react";
import {
  Tag,
  Plus,
  X,
  Search,
  Check,
  Sparkles,
  Layers,
  Info,
  BookOpen,
} from "lucide-react";

export interface SkillTag {
  id?: string;
  name: string;
  category?: string;
  isCustom?: boolean;
  isRecommended?: boolean;
}

interface SkillSelectorProps {
  selectedSkills: string[];
  onChange: (skills: string[], detailedTags?: SkillTag[]) => void;
  recommendedSkills?: string[];
  professionName?: string;
  allTaxonomyCategories?: Array<{
    id: string;
    name: string;
    nameTh?: string;
    skills: Array<{ id: string; name: string; nameTh?: string }>;
  }>;
}

// Category color configurations
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Technical Skills": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Domain Knowledge": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Analytical Skills": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Leadership": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  "Communication": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Soft Skills": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "Languages": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  "Research Skills": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  "Custom": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  "Default": { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
};

function normalizeSkillName(name: string): string {
  return name.trim();
}

export function SkillSelector({
  selectedSkills,
  onChange,
  recommendedSkills = [],
  professionName = "ตำแหน่งงานที่เลือก",
  allTaxonomyCategories = [],
}: SkillSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Flatten available taxonomy skills
  const flattenedTaxonomySkills = useMemo(() => {
    const list: Array<{ id: string; name: string; category: string }> = [];
    allTaxonomyCategories.forEach((cat) => {
      cat.skills?.forEach((s) => {
        list.push({ id: s.id, name: s.name, category: cat.name });
      });
    });
    return list;
  }, [allTaxonomyCategories]);

  // Filter skills based on search term
  const filteredSkills = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return flattenedTaxonomySkills
      .filter((s) => s.name.toLowerCase().includes(term))
      .slice(0, 12);
  }, [searchTerm, flattenedTaxonomySkills]);

  const isExactMatch = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (
      flattenedTaxonomySkills.some((s) => s.name.toLowerCase() === term) ||
      selectedSkills.some((s) => s.toLowerCase() === term)
    );
  }, [searchTerm, flattenedTaxonomySkills, selectedSkills]);

  // Handle adding skill
  const handleAddSkill = (skillName: string, category?: string, id?: string) => {
    const normalized = normalizeSkillName(skillName);
    if (!normalized) return;

    if (selectedSkills.some((s) => s.toLowerCase() === normalized.toLowerCase())) {
      setSearchTerm("");
      setIsDropdownOpen(false);
      return;
    }

    const updated = [...selectedSkills, normalized];
    onChange(updated);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Handle removing skill
  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = selectedSkills.filter(
      (s) => s.toLowerCase() !== skillToRemove.toLowerCase()
    );
    onChange(updated);
  };

  // Add all recommended skills
  const handleAddAllRecommended = () => {
    const updated = Array.from(
      new Set([...selectedSkills, ...recommendedSkills.map(normalizeSkillName)])
    );
    onChange(updated);
  };

  // Clear all skills
  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3.5">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Tag className="w-4 h-4 text-purple-600" />
          <span>ทักษะที่เกี่ยวข้องเฉพาะ (Skill Labels & Taxonomy Tags)</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            {selectedSkills.length} ทักษะ
          </span>
        </label>
        <div className="flex items-center gap-2">
          {recommendedSkills.length > 0 && (
            <button
              type="button"
              onClick={handleAddAllRecommended}
              className="text-xs text-purple-700 hover:text-purple-800 font-semibold px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              + เลือกทักษะแนะนำทั้งหมด ({recommendedSkills.length})
            </button>
          )}
          {selectedSkills.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              ล้างทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Recommended Skills Quick-Chips */}
      {recommendedSkills.length > 0 && (
        <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-800 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              ทักษะแนะนำตามมาตรฐานของ {professionName}:
            </span>
            <span className="text-slate-500 text-[11px]">
              คลิกเพื่อเพิ่มหรือนำออกจากการสุ่ม
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recommendedSkills.map((rec) => {
              const isSelected = selectedSkills.some(
                (s) => s.toLowerCase() === rec.toLowerCase()
              );
              return (
                <button
                  key={rec}
                  type="button"
                  onClick={() =>
                    isSelected ? handleRemoveSkill(rec) : handleAddSkill(rec, "Profession Recommended")
                  }
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-xs border border-purple-700"
                      : "bg-white text-purple-900 border border-purple-200 hover:border-purple-400 hover:bg-purple-50/80"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{rec}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Skills Badges Area */}
      {selectedSkills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2.5 rounded-xl border border-slate-200 bg-white">
          {selectedSkills.map((skill) => {
            const isRec = recommendedSkills.some(
              (r) => r.toLowerCase() === skill.toLowerCase()
            );
            const taxObj = flattenedTaxonomySkills.find(
              (t) => t.name.toLowerCase() === skill.toLowerCase()
            );
            const categoryName = isRec
              ? "Domain Knowledge"
              : taxObj?.category || "Custom";
            const color =
              CATEGORY_COLORS[categoryName] || CATEGORY_COLORS["Default"];

            return (
              <span
                key={skill}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${color.bg} ${color.text} ${color.border} transition-colors`}
              >
                <span>{skill}</span>
                {categoryName !== "Custom" ? (
                  <span className="text-[10px] opacity-75 font-normal px-1 rounded-sm bg-black/5">
                    {categoryName}
                  </span>
                ) : (
                  <span className="text-[10px] text-cyan-800 font-normal px-1 rounded-sm bg-cyan-100">
                    Custom
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:opacity-75 focus:outline-hidden"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      ) : (
        <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">ไม่ได้ระบุทักษะเฉพาะ:</strong>{" "}
            ระบบจะดึงทักษะแนะนำมาตรฐานตามฐานข้อมูลของ{" "}
            <span className="font-semibold text-purple-700">
              {professionName}
            </span>{" "}
            ไปใช้สร้างชุดข้อมูลโดยอัตโนมัติ
          </p>
        </div>
      )}

      {/* Search and Custom Skill Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (filteredSkills.length > 0) {
                  handleAddSkill(filteredSkills[0].name, filteredSkills[0].category, filteredSkills[0].id);
                } else if (searchTerm.trim()) {
                  handleAddSkill(searchTerm.trim(), "Custom");
                }
              }
            }}
            placeholder="ค้นหาทักษะใน Taxonomy หรือพิมพ์ทักษะ Custom แล้วกด Enter..."
            className="w-full text-xs font-medium pl-9 pr-24 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-600 text-slate-800"
          />
          {searchTerm.trim() && (
            <button
              type="button"
              onClick={() => handleAddSkill(searchTerm.trim(), "Custom")}
              className="absolute right-1.5 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>เพิ่ม</span>
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isDropdownOpen && searchTerm.trim() && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute z-20 top-full left-0 right-0 mt-1.5 max-h-56 overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-200 py-1 divide-y divide-slate-100">
              {filteredSkills.map((skill) => (
                <button
                  key={`${skill.id}-${skill.name}`}
                  type="button"
                  onClick={() => handleAddSkill(skill.name, skill.category, skill.id)}
                  className="w-full text-left px-3.5 py-2 hover:bg-purple-50 text-xs flex items-center justify-between group transition-colors"
                >
                  <span className="font-medium text-slate-800 group-hover:text-purple-900">
                    {skill.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                    {skill.category}
                  </span>
                </button>
              ))}

              {!isExactMatch && (
                <button
                  type="button"
                  onClick={() => handleAddSkill(searchTerm.trim(), "Custom")}
                  className="w-full text-left px-3.5 py-2 hover:bg-cyan-50 text-xs flex items-center justify-between text-cyan-800 font-semibold transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-cyan-600" />
                    เพิ่มทักษะแบบกำหนดเอง: &quot;{searchTerm.trim()}&quot;
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800">
                    Custom Tag
                  </span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
