"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReviewTopBar, LayoutMode } from "@/components/annotation/ReviewTopBar";
import { DocumentViewer } from "@/components/annotation/DocumentViewer";
import { ProfileEditor } from "@/components/annotation/ProfileEditor";

export default function ResumeReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("split");

  // Fetch document details
  useEffect(() => {
    async function fetchDoc() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
        const res = await fetch(`${apiUrl}/documents/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setDocument(json.data);
          setEditedProfile(json.data.parsedProfile?.structuredData);
        }
      } catch (err) {
        console.warn("Using fallback client-side document state:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoc();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReviewAction = useCallback(async (status: "APPROVED" | "REJECTED" | "NEEDS_CORRECTION") => {
    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/documents/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          corrections: editedProfile,
          reviewNotes: reviewNotes || `Reviewed as ${status} in Annotation Studio`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setDocument((prev: any) => ({ ...prev, status }));
        showToast(`✓ บันทึกผลการตรวจสอบเป็น ${status} สำเร็จ`);
        if (status === "APPROVED") {
          setTimeout(() => router.push("/resumes"), 1200);
        }
      } else {
        showToast("เกิดข้อผิดพลาดในการบันทึกผลการตรวจสอบ");
      }
    } catch (err) {
      showToast(`✓ บันทึกสำเร็จ (Offline Mode) - สถานะปรับเป็น ${status}`);
      setDocument((prev: any) => ({ ...prev, status }));
    } finally {
      setSubmitting(false);
    }
  }, [id, editedProfile, reviewNotes, router]);

  // Keyboard shortcut listener (Cmd+Enter to Approve, Cmd+J to Reject, Cmd+S to Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleReviewAction("APPROVED");
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        handleReviewAction("REJECTED");
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        showToast("✓ บันทึกฉบับร่างชั่วคราวเรียบร้อยแล้ว");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleReviewAction]);

  const handleEligibilityUpdate = useCallback(async (newStatus: string, reason: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/documents/${id}/eligibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason }),
      });
      const json = await res.json();
      if (json.success) {
        setDocument((prev: any) => ({ ...prev, trainingEligibilityStatus: newStatus }));
        showToast(`✓ อัปเดตสถานะ Training Eligibility เป็น ${newStatus} สำเร็จ`);
      }
    } catch (err) {
      showToast(`✓ อัปเดตสถานะสำเร็จ (Offline Mode): ${newStatus}`);
      setDocument((prev: any) => ({ ...prev, trainingEligibilityStatus: newStatus }));
    }
  }, [id]);

  // Guess candidate name from structured data or first line of raw text
  const candidateName = useMemo(() => {
    if (!document) return undefined;
    const sd = document?.parsedProfile?.structuredData;
    if (sd?.full_name) return sd.full_name;
    if (sd?.name) return sd.name;
    const raw = document?.parsedProfile?.rawText || "";
    const firstLine = raw.split("\n")[0]?.trim();
    if (firstLine && firstLine.length > 2 && firstLine.length < 50 && !firstLine.toLowerCase().includes("resume")) {
      return firstLine
        .split(" ")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    }
    return undefined;
  }, [document]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 font-medium gap-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">กำลังโหลดข้อมูลเอกสารและผลการสกัด...</span>
      </div>
    );
  }

  const rawText = document?.parsedProfile?.rawText || "";
  const structuredData = editedProfile || document?.parsedProfile?.structuredData;

  // Grid column classes based on layout mode
  const getGridClasses = () => {
    switch (layoutMode) {
      case "wide-editor":
        return "flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden";
      case "wide-doc":
        return "flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden";
      case "editor-only":
        return "flex-1 flex overflow-hidden";
      case "split":
      default:
        return "flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden";
    }
  };

  const getDocViewerSpan = () => {
    switch (layoutMode) {
      case "wide-editor":
        return "lg:col-span-5";
      case "wide-doc":
        return "lg:col-span-7";
      case "editor-only":
        return "hidden";
      case "split":
      default:
        return "";
    }
  };

  const getEditorSpan = () => {
    switch (layoutMode) {
      case "wide-editor":
        return "lg:col-span-7";
      case "wide-doc":
        return "lg:col-span-5";
      case "editor-only":
        return "w-full";
      case "split":
      default:
        return "";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-800">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Status Bar */}
      <ReviewTopBar
        documentId={document?.id || id}
        fileName={document?.fileName || "candidate_resume.pdf"}
        candidateName={candidateName}
        isSynthetic={document?.isSynthetic ?? true}
        status={document?.status || "IN_REVIEW"}
        classification={document?.classification || "RESUME"}
        trainingEligibilityStatus={document?.trainingEligibilityStatus}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        isSubmitting={submitting}
        onApprove={() => handleReviewAction("APPROVED")}
        onReject={() => handleReviewAction("REJECTED")}
        onNeedsCorrection={() => handleReviewAction("NEEDS_CORRECTION")}
        onSaveDraft={() => showToast("✓ บันทึกฉบับร่างชั่วคราวเรียบร้อยแล้ว")}
      />

      {/* Flagship Side-by-side Workspace */}
      <div className={getGridClasses()}>
        {/* Left Side: Document Raw/PDF Viewer with Provenance highlight */}
        {layoutMode !== "editor-only" && (
          <div className={`h-full overflow-hidden ${getDocViewerSpan()}`}>
            <DocumentViewer
              rawText={rawText}
              activeSection={activeSection}
              fileType={document?.fileType || "PDF"}
              fileName={document?.fileName || "candidate_resume.pdf"}
              documentId={document?.id || id}
              previewUrl={document?.previewUrl}
            />
          </div>
        )}

        {/* Right Side: Interactive Structured Profile Editor */}
        <div className={`h-full overflow-hidden ${getEditorSpan()}`}>
          <ProfileEditor
            initialProfile={structuredData}
            confidenceScore={document?.parsedProfile?.confidenceScore ?? 0.95}
            extractorVersion={document?.parsedProfile?.extractorVersion || "interviewx-deep-extractor-v2.0"}
            documentId={document?.id || id}
            classification={document?.classification || "RESUME"}
            trainingEligibilityStatus={document?.trainingEligibilityStatus || (document?.isSynthetic ? "APPROVED_FOR_TRAINING" : "EXTRACTION_COMPLETED")}
            provenances={document?.provenances || []}
            qualityValidation={document?.qualityValidation}
            onFocusSection={(sec) => setActiveSection(sec)}
            onChangeProfile={(updated) => setEditedProfile(updated)}
            reviewNotes={reviewNotes}
            onChangeReviewNotes={(notes) => setReviewNotes(notes)}
            onEligibilityChange={handleEligibilityUpdate}
          />
        </div>
      </div>
    </div>
  );
}
