# หมวดที่ 01: การบริหารจัดการโครงการ (01_Project_Management)
> **InterviewX — AI Job Interview Simulation System**  
> **สถานะเอกสาร:** ควบคุมและพร้อมใช้งานสำหรับการบริหารรอบการพัฒนา (Sprint & Governance Active)  
> **ปรับปรุงล่าสุด:** 21 พฤศจิกายน 2026 (ปรับปรุงโครงสร้างทีมพัฒนาและ Module Ownership)

---

## 📌 ภาพรวมหมวดการบริหารจัดการโครงการ (Category Overview)

หมวดนี้จัดเก็บเอกสารภาพรวมโครงการ (Project Overview), โครงสร้างทีมพัฒนาและบทบาทหน้าที่ (Development Team Structure & Approved Roles), การกำหนดผู้รับผิดชอบระบบย่อย (Module Ownership Matrix), การวางแผนงานและการจัดสรรรอบการพัฒนา (Sprint Planning & Alignment Briefs), บันทึกการเปลี่ยนแปลง (Change Log), รายงานการตรวจสอบความสอดคล้อง (Consistency Review Report), ข้อตกลงเกณฑ์ความพร้อมในการรับมอบงาน (Definition of Done: DoD), และแผนการดำเนินงาน (Roadmap)

---

## 🚀 เอกสารหลักประจำหมวด (Deliverables & Governance Baseline)

| เอกสารผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **เอกสารโครงสร้างทีมพัฒนาและ Module Ownership** | [InterviewX_Development_Team_Roles_and_Module_Ownership.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Development_Team_Roles_and_Module_Ownership.md) | ~14 KB | **⭐ [Master Baseline]** กำหนดบทบาทที่ได้รับอนุมัติ 5 คน, ขอบเขตงาน, Deliverables, Module Ownership 20 ระบบ, Sprint RACI Matrix และเกณฑ์ตรวจรับงาน |
| **เอกสารสรุปการประชุมจัดสรรงาน Sprint 2** | [InterviewX_Sprint2_Team_Alignment_Brief.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Sprint2_Team_Alignment_Brief.md) | ~18 KB | สรุปกฎเหล็กสถาปัตยกรรม, มติ D-M01 ถึง D-M11, การจัดแพ็กเกจงานระบุผู้รับผิดชอบรายบุคคล (WP-BE, WP-AI, WP-FE, WP-MB, WP-QA), คำถามรายบุคคล และ DoD |
| **บันทึกการเปลี่ยนแปลงเอกสาร (Change Log)** | [DOCUMENTATION_CHANGE_LOG_TEAM_ROLES.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/DOCUMENTATION_CHANGE_LOG_TEAM_ROLES.md) | ~6 KB | ตารางบันทึกการเปลี่ยนแปลงรายเอกสาร เหตุผลในการปรับปรุง และการรักษาความสมบูรณ์ของเอกสารเดิม |
| **รายงานการตรวจสอบความสอดคล้อง** | [CONSISTENCY_REVIEW_REPORT.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/CONSISTENCY_REVIEW_REPORT.md) | ~10 KB | รายงานการสอบทาน 6 มิติ: ชื่อสมาชิก, ตำแหน่ง, หน้าที่, Module Ownership, Release Roadmap และรายการข้อขัดแย้ง |
| **คลังเอกสารประวัติประจำหมวด** | [archive/](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/archive/) | โฟลเดอร์ | จัดเก็บ InterviewX_Sprint2_Team_Alignment_Brief_v1.0.md ฉบับดั้งเดิมก่อนระบุรายชื่อ |

---

## 🎯 สาระสำคัญสำหรับการประสานงานข้ามสายงาน (Cross-functional Alignment)

1. **โครงสร้างทีมพัฒนาที่ได้รับอนุมัติ (Approved Team Roles):**
   - **นายนรงศักดิ์ ภูมิประเสริฐ:** Tech Lead, Architecture, AI Layer, DevOps, Integration
   - **นายสมหมาย สุภาวงค์:** UX/UI Lead, Design System, Frontend/Mobile
   - **นายกิติกร เทศธรรม:** Fullstack Developer, NestJS Core Backend, API
   - **นายจิรเมธ วงษ์กัณหา:** Fullstack Developer, NestJS Core Backend, Integration
   - **นายณัฐพล กลิ่นจุ่น:** Business Analyst (BA), QA, Tester, Documentation
2. **สถาปัตยกรรมที่แยกส่วน (Decoupled Frontends):**
   - Responsive Web (Next.js) รองรับทุกบทบาท (Guest, User, Researcher, Payment Admin, System Admin) ดูแลโดย นายสมหมาย
   - Native Mobile (React Native / iOS & Android) มุ่งเน้นเฉพาะผู้สมัครงาน (Candidate / User) ในรอบ R2 ดูแลโดย นายสมหมาย
3. **สัญญาทางเทคนิค (Technical Invariants):**
   - การตรวจสอบสิทธิ์แบบรวมศูนย์ (Unified Bearer JWT) ดูแลโดย นายกิติกร
   - การป้องกันคำขอซ้ำซ้อนด้วย Idempotency-Key และระบบคิว BullMQ / Outbox ดูแลโดย นายจิรเมธ
   - ระบบบริการ AI ไร้สถานะ (Stateless FastAPI Rubric Engine) ดูแลโดย นายนรงศักดิ์
   - แผนการประกันคุณภาพและการตรวจสอบย้อนกลับ (RTM & DoD) ดูแลโดย นายณัฐพล
