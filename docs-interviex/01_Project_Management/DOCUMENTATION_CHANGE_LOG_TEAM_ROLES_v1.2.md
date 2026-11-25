# บันทึกการเปลี่ยนแปลงเอกสารโครงการ (Team Structure, Roles & Technical Ownership Revision)
## InterviewX — Documentation Change Log (v1.2 Team-Revised)

> **สถานะเอกสาร:** บันทึกประวัติการเปลี่ยนแปลงอย่างเป็นทางการ (Official Change Log)  
> **วันที่มีผลบังคับใช้:** 25 พฤศจิกายน 2026 | **เวอร์ชัน:** 1.2  
> **ระบบ:** InterviewX — AI Job Interview Simulation System  
> **ผู้จัดทำ:** Senior Software Architect & Technical Documentation Specialist  
> **นโยบายการรักษาเอกสารเดิม:** เก็บไฟล์ต้นฉบับเดิมไว้ครบทุกไฟล์ ห้ามเขียนทับหรือลบไฟล์เดิม โดยสร้างไฟล์ฉบับปรับปรุงใหม่แบบคู่ขนาน (`_v1.2_TeamRevised`)

---

## 1. สรุปหลักการปรับปรุงรอบ v1.2 (Revision Principles)

1. **Tech Lead (นายนรงศักดิ์ ภูมิประเสริฐ — 674259009):** เป็นผู้ควบคุม System Architecture, Backend Technical Governance, ตรวจสอบ Backend Code/API/DB/Security อย่างต่อเนื่อง (ไม่ใช่เพียงผู้ให้คำปรึกษา) และเป็น **Primary Owner ของ FastAPI AI Service & Rubric Engine**
2. **UX/UI Lead & Frontend Lead (นายสมหมาย สุภาวงค์ — 674259024):** เป็น **Frontend Primary Owner** ทั้งด้านการออกแบบ UX/UI, Design System และการพัฒนา Frontend หลักด้วย Next.js (รวมถึงแนวทาง Native Mobile ตาม Roadmap)
3. **Fullstack Developers (นายกิติกร เทศธรรม — 674259003 และ นายจิรเมธ วงษ์กัณหา — 674259004):** เป็น **Backend Primary Developers** ตามโมดูลที่รับผิดชอบ และเป็น **Frontend Supporting Developers** ภายใต้แนวทางของ Frontend Lead (ไม่ใช่ Frontend Primary Owner และไม่รับผิดชอบการพัฒนา AI Evaluation Engine)
4. **BA / QA / Tester / Documentation (นายณัฐพล กลิ่นจุ่น — 674259006):** รับผิดชอบ Requirement Analysis, RTM, Test Scenarios/Test Cases, Testing ทุกระดับ, Defect Tracking, Test Reports, Technical Documentation และ Acceptance Criteria Review
5. **การคงสภาพระบบ:** ไม่เปลี่ยนแปลง Technology Stack, Architecture Invariants (Single Ownership ของ Core DB โดย NestJS Core; ห้าม AI Service ต่อ Core PostgreSQL โดยตรง; Transactional Outbox, Idempotency, Session Resilience) หรือข้อกำหนด FR/NFR/RBAC

---

## 2. ผลการตรวจสอบไฟล์ทั้ง 5 ฉบับที่ระบุในขอบเขตงาน

| ลำดับ | เอกสารต้นฉบับที่ตรวจสอบ | สถานะการแก้ไข | ไฟล์ส่งมอบใหม่ (Parallel Deliverable) |
|:---:|---|:---:|---|
| 1 | [INTERVIEWX_MASTER_KNOWLEDGE_PACK.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/07_Development_Documentation/INTERVIEWX_MASTER_KNOWLEDGE_PACK.md) | ✏️ **แก้ไขเฉพาะส่วนที่เกี่ยวข้อง** | [INTERVIEWX_MASTER_KNOWLEDGE_PACK_v1.2_TeamRevised.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/07_Development_Documentation/INTERVIEWX_MASTER_KNOWLEDGE_PACK_v1.2_TeamRevised.md) |
| 2 | [InterviewX_SRS_Report_Revised_TH.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_Report_Revised_TH.md) | ✏️ **แก้ไขเฉพาะส่วนที่เกี่ยวข้อง** | [InterviewX_SRS_Report_v1.2_TeamRevised_TH.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_Report_v1.2_TeamRevised_TH.md) |
| 3 | [ALL_DIAGRAMS_v1.1_FINAL_TH.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/ALL_DIAGRAMS_v1.1_FINAL_TH.md) | ➕ **คง D01–D27 เดิม 100% + เพิ่มแผนภาพทีมใหม่** | [Team_Structure_Ownership_Governance_Diagram_v1.2_TH.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/Team_Structure_Ownership_Governance_Diagram_v1.2_TH.md) |
| 4 | [InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx) | ✏️ **แก้ไขเฉพาะ Owner ใน Decision Register & Change Log** | [InterviewX_FR_NFR_RBAC_v1.2_TeamRevised_TH.xlsx](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_FR_NFR_RBAC_v1.2_TeamRevised_TH.xlsx) |
| 5 | [INTERVIEWX_SURVEY_DETAILED_ANALYSIS.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/02_Research_Analysis/survey/INTERVIEWX_SURVEY_DETAILED_ANALYSIS.md) | ⏭️ **ไม่แก้ไข (ไม่มีข้อมูลทีม/บทบาท)** | คงไฟล์เดิมไว้โดยไม่มีการเปลี่ยนแปลง |

---

## 3. ตารางบันทึกการเปลี่ยนแปลงรายรายการ (Detailed Change Log)

| ลำดับ | เอกสาร | ส่วนที่ปรับปรุง | ข้อมูลเดิม | ข้อมูลที่ปรับปรุงใหม่ (v1.2) | เหตุผลในการปรับปรุง |
|:---:|---|---|---|---|---|
| 1 | `INTERVIEWX_MASTER_KNOWLEDGE_PACK_v1.2_TeamRevised.md` | ส่วนหัว, หมวด 10 (Grounding Prompt) และหมวด 11 (11.1–11.4) | ระบุบทบาทแบบเดิม (เช่น Tech Lead ไม่มีรายการ Backend Code Review/Governance ชัดเจน; AI Service มี จิรเมธ เป็น Supporting; User Profile มี สมหมาย เป็น Supporting; ระบุตำแหน่งของ สมหมาย เป็น `UX/UI Lead, Design System, Frontend/Mobile`) | ปรับตำแหน่งและ Job Descriptions ครบทั้ง 5 คน, ปรับ Ownership Matrix 18 รายการตามที่อนุมัติ (AI Service/Rubric Supporting=`—`, Backend Governance=`Tech Lead`, Frontend Primary=`สมหมาย`, Backend Primary & FE Supporting=`กิติกร/จิรเมธ`), เพิ่มหลักการทำงานร่วมกัน 8 ข้อ | ให้ AI Assistant และทีมยึดถือ Technical Ownership และขอบเขตหน้าที่ที่ถูกต้องตรงตามมติใหม่ |
| 2 | `InterviewX_SRS_Report_v1.2_TeamRevised_TH.md` | ตารางผู้จัดทำ (บรรทัด 13), สารบัญ, เพิ่มหมวด 1.8 และหมวด 9.1 (D-M01–D-M11) | (ก) สะกดชื่อ `นายนรงศ์ศักดิ์` ผิด (มีทัณฑฆาต) และไม่ระบุตำแหน่ง<br>(ข) ไม่มีหัวข้อ 1.8 ทำให้ลิงก์ใน 9.1 ขาด<br>(ค) คอลัมน์ผู้รับผิดชอบ D-M01–D-M11 ใช้คำเดิม (`Mobile Lead`, `Backend Lead`, `AI Lead`, `Backend Core Team`) | (ก) แก้เป็น `นายนรงศักดิ์ ภูมิประเสริฐ` พร้อมตำแหน่งทั้ง 5 คน<br>(ข) เพิ่ม **หมวด 1.8** บรรจุสมาชิก 5 คน, หน้าที่ 3.1–3.5, Ownership Matrix, หลักการทำงานร่วมกัน และข้อกำหนดสถาปัตยกรรม<br>(ค) ปรับคอลัมน์ผู้รับผิดชอบ D-M01–D-M11 ให้สอดคล้องกับตำแหน่งใหม่ | แก้ไขอักขรวิธี, ซ่อมลิงก์อ้างอิงภายใน SRS, และทำให้บทบาทใน SRS ตรงกับโครงสร้างทีมใหม่ โดยคง FR/NFR/RBAC/Use Cases/ERD/Architecture เดิม 100% |
| 3 | `Team_Structure_Ownership_Governance_Diagram_v1.2_TH.md` | แผนภาพเพิ่มเติม **D28** และ **D29** (คง `ALL_DIAGRAMS_v1.1_FINAL_TH.md` D01–D27 เดิม) | แผนภาพ D01–D27 ไม่มีภาพแสดง Team Structure, Ownership และ Review Workflow | คง D01–D27 เดิมทั้งหมดไม่แก้ไข และสร้าง D28 (Team Structure & Technical Ownership Map) และ D29 (Team Workflow & Technical Governance) เป็นภาคผนวกใหม่ | เพื่อแสดงแผนภาพโครงสร้างทีมและสายการตรวจสอบโค้ดโดยไม่แก้ไขแผนภาพสถาปัตยกรรมหลักที่ไม่มีข้อขัดแย้ง |
| 4 | `InterviewX_FR_NFR_RBAC_v1.2_TeamRevised_TH.xlsx` | แผ่นงาน `ทะเบียนการตัดสินใจ` (แถว 2, คอลัมน์ G แถว 4–14) และ `บันทึกการเปลี่ยนแปลง` (แถว 17) | คอลัมน์ผู้รับผิดชอบใช้ชื่อบทบาทเดิม (`Mobile Lead`, `Backend Lead`, `AI Lead`, `Backend Core Team`) | ปรับชื่อบทบาทในคอลัมน์ผู้รับผิดชอบ (D-M01–D-M11) และหมายเหตุแถว 2 ให้ตรงกับ SRS v1.2 หมวด 1.8 และบันทึกประวัติลงแผ่นงาน `บันทึกการเปลี่ยนแปลง`; คงแผ่นงาน FR, NFR, RBAC และอื่นๆ ไว้เหมือนเดิม 100% | รักษาความสอดคล้องของ Owner ใน Decision Register โดยไม่แตะต้องข้อกำหนด FR/NFR/RBAC |
| 5 | `INTERVIEWX_SURVEY_DETAILED_ANALYSIS.md` | ตรวจสอบทั้งไฟล์ (224 บรรทัด) | รายงานสถิติผลสำรวจ n=102 และการเชื่อมโยง FR/NFR | ไม่มีการแก้ไข (No changes required) | ไม่มีข้อมูลเกี่ยวกับ Team Structure, Roles, Responsibilities, Ownership หรือ Team Workflow |
| 6 | เอกสารบริหารโครงการสนับสนุน (`01_Project_Management` & `07_Development_Documentation`) | `InterviewX_Development_Team_Roles_and_Module_Ownership_v1.2_TeamRevised.md`, `InterviewX_Sprint2_Team_Alignment_Brief_v1.2_TeamRevised.md`, `REPOSITORY_STRUCTURE_v1.2_TeamRevised.md` | เอกสาร v1.0/v1.1 เดิมระบุ Tech Lead เป็น "ที่ปรึกษา" ในบางส่วน และให้ จิรเมธ สนับสนุน AI Service | สร้างไฟล์ฉบับ `_v1.2_TeamRevised.md` คู่ขนานเพื่อปรับ RACI, Work Packages (แผนภาพ Sprint 2), และ PR Code Review Gate ให้ตรงกับโครงสร้างใหม่ทั้งหมด | ขจัดข้อความขัดแย้งในเอกสารการบริหารทีมและ Monorepo Governance |

---

## 4. รายการไฟล์ต้นฉบับที่ถูกเก็บรักษาไว้โดยไม่มีการเขียนทับ

- [INTERVIEWX_MASTER_KNOWLEDGE_PACK.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/07_Development_Documentation/INTERVIEWX_MASTER_KNOWLEDGE_PACK.md) (คงเดิม 100%)
- [InterviewX_SRS_Report_Revised_TH.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_Report_Revised_TH.md) (คงเดิม 100%)
- [ALL_DIAGRAMS_v1.1_FINAL_TH.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/ALL_DIAGRAMS_v1.1_FINAL_TH.md) (คงเดิม 100%)
- [InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx) (คงเดิม 100%)
- [INTERVIEWX_SURVEY_DETAILED_ANALYSIS.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/02_Research_Analysis/survey/INTERVIEWX_SURVEY_DETAILED_ANALYSIS.md) (คงเดิม 100%)
- [InterviewX_Development_Team_Roles_and_Module_Ownership.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Development_Team_Roles_and_Module_Ownership.md) (คงเดิม 100%)
- [InterviewX_Sprint2_Team_Alignment_Brief_v1.1_Updated.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Sprint2_Team_Alignment_Brief_v1.1_Updated.md) (คงเดิม 100%)
- [REPOSITORY_STRUCTURE.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/07_Development_Documentation/REPOSITORY_STRUCTURE.md) (คงเดิม 100%)
