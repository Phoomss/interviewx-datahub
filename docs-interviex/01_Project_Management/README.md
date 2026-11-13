# หมวดที่ 01: การบริหารจัดการโครงการ (01_Project_Management)
> **InterviewX — AI Job Interview Simulation System**
> **สถานะเอกสาร:** ควบคุมและพร้อมใช้งานสำหรับการวางแผนงาน (Sprint Planning Active)
> **ปรับปรุงล่าสุด:** 13 พฤศจิกายน 2026

---

## 📌 ภาพรวมหมวดการบริหารจัดการโครงการ (Category Overview)

หมวดนี้จัดเก็บเอกสารภาพรวมโครงการ (Project Overview), การวางแผนงานและการจัดสรรรอบการพัฒนา (Sprint Planning), วาระการประชุมและการจัดทีม (Team Structure & Alignment), ข้อตกลงเกณฑ์ความพร้อมในการรับมอบงาน (Definition of Done: DoD), และแผนการดำเนินงาน (Roadmap)

---

## 🚀 เอกสารหลักประจำหมวด (Deliverables)

| เอกสารผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **เอกสารสรุปการประชุมจัดสรรงาน Sprint 2** | [InterviewX_Sprint2_Team_Alignment_Brief.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Sprint2_Team_Alignment_Brief.md) | 28.5 KB | สรุปกฎเหล็กทางสถาปัตยกรรม, มติ D-M01 ถึง D-M11, การจัดแพ็กเกจงานสำหรับทีม Backend, Frontend, Mobile, AI, QA และเกณฑ์ DoD |

---

## 🎯 สาระสำคัญสำหรับการประสานงานข้ามสายงาน (Cross-functional Alignment)

1. **สถาปัตยกรรมที่แยกส่วน (Decoupled Frontends):**
   - Responsive Web (Next.js) รองรับทุกบทบาท (Guest, User, Researcher, Payment Admin, System Admin)
   - Native Mobile (React Native / iOS & Android) มุ่งเน้นเฉพาะผู้สมัครงาน (Candidate / User)
2. **สัญญาทางเทคนิค (Technical Invariants):**
   - การตรวจสอบสิทธิ์แบบรวมศูนย์ (Unified Bearer JWT)
   - การป้องกันคำขอซ้ำซ้อนด้วย `Idempotency-Key`
   - การสื่อสารแบบอะซิงโครนัสผ่าน Outbox Pattern และ BullMQ Queue
3. **การตรวจสอบสิทธิ์ความปลอดภัย:**
   - บังคับใช้ Server-side Ownership Guard ทุก Endpoint ป้องกันช่องโหว่ IDOR
