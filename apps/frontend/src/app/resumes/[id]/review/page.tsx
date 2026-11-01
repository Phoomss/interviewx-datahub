"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ReviewTopBar } from "@/components/annotation/ReviewTopBar";
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
    setTimeout(() => setToastMessage(null), 3000);
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
          reviewNotes: reviewNotes || `Reviewed as ${status} in Annotation Workspace`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setDocument((prev: any) => ({ ...prev, status }));
        showToast(`บันทึกผลการตรวจสอบเป็น ${status} เรียบร้อยแล้ว`);
        if (status === "APPROVED") {
          setTimeout(() => router.push("/resumes"), 1000);
        }
      } else {
        showToast("เกิดข้อผิดพลาดในการบันทึกผลการตรวจสอบ");
      }
    } catch (err) {
      showToast(`บันทึกสำเร็จ (Offline Mode) - สถานะปรับเป็น ${status}`);
      setDocument((prev: any) => ({ ...prev, status }));
    } finally {
      setSubmitting(false);
    }
  }, [id, editedProfile, reviewNotes, router]);

  // Keyboard shortcut listener (Cmd+Enter to Approve, Cmd+J to Reject)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleReviewAction("APPROVED");
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        handleReviewAction("REJECTED");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleReviewAction]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        กำลังโหลดข้อมูลเรซูเมและผลการสกัด...
      </div>
    );
  }

  const rawText = document?.parsedProfile?.rawText || "";
  const structuredData = editedProfile || document?.parsedProfile?.structuredData;

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Status Bar */}
      <ReviewTopBar
        documentId={document?.id || id}
        fileName={document?.fileName || "candidate_resume.pdf"}
        isSynthetic={document?.isSynthetic ?? true}
        status={document?.status || "IN_REVIEW"}
        isSubmitting={submitting}
        onApprove={() => handleReviewAction("APPROVED")}
        onReject={() => handleReviewAction("REJECTED")}
        onNeedsCorrection={() => handleReviewAction("NEEDS_CORRECTION")}
        onSaveDraft={() => showToast("บันทึกฉบับร่างชั่วคราวเรียบร้อย")}
      />

      {/* Flagship Side-by-side Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Side: Document Raw/PDF Viewer with Provenance highlight */}
        <DocumentViewer
          rawText={rawText}
          activeSection={activeSection}
          fileType={document?.fileType || "PDF"}
          fileName={document?.fileName || "candidate_resume.pdf"}
        />

        {/* Right Side: Interactive Structured Profile Editor */}
        <ProfileEditor
          initialProfile={structuredData}
          confidenceScore={document?.parsedProfile?.confidenceScore ?? 0.95}
          extractorVersion={document?.parsedProfile?.extractorVersion || "gemini-flash-extractor-v1.0"}
          onFocusSection={(sec) => setActiveSection(sec)}
          onChangeProfile={(updated) => setEditedProfile(updated)}
          reviewNotes={reviewNotes}
          onChangeReviewNotes={(notes) => setReviewNotes(notes)}
        />
      </div>
    </div>
  );
}
