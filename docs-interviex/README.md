# InterviewX — AI Job Interview Simulation System
> **สารบัญเอกสารและดัชนีนำทางโครงการหลัก (Master Project Documentation Catalog & Directory Map)**  
> **สถานะการกำกับดูแลเอกสาร:** ฉบับอนุมัติอย่างเป็นทางการ (Official Approved Baseline v1.1 FINAL)  
> **เอกสารหลักฐานเวอร์ชันหลักของโครงการ (Active Primary Baseline):** 1.1 FINAL (ฉบับภาษาไทยมาตรฐานที่ผ่านการอนุมัติแล้ว)  
> **วันที่ปรับปรุงล่าสุด:** 23 พฤศจิกายน 2026 (ปรับปรุงแผนภาพ D01–D27, บลูพรินต์ Draw.io, โครงสร้างทีม และ Module Ownership)

---

## 🗺️ สารบัญนำทางหมวดเอกสารทั้ง 12 หมวด (Category Quick Navigation)

| หมวด | ชื่อหมวดหมู่เอกสาร | คำอธิบายสาระสำคัญ | ลิงก์เข้าสู่หมวด |
|:---:|---|---|:---:|
| **01** | **การบริหารจัดการโครงการ (Project Management)** | โครงสร้างทีมพัฒนา 5 คน, Module Ownership 20 โมดูล, วาระ Sprint 2, รายงานความสอดคล้อง | [เปิดโฟลเดอร์ 01](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/) |
| **02** | **งานวิจัยและการวิเคราะห์ (Research Analysis)** | เล่มข้อเสนอโครงการวิจัย v1.3 FINAL (Word/PDF), ผลสำรวจความต้องการผู้ใช้จริง (n=102) | [เปิดโฟลเดอร์ 02](file:///D:/workspaces/interviewx-datahub/docs-interviex/02_Research_Analysis/) |
| **03** | **ข้อกำหนดความต้องการระบบ (SRS Requirements)** | รายงาน SRS ฉบับวิชาการ (มรภ.นครปฐม), เอกสาร SRS v1.1 FINAL (Word/MD/PDF), เวิร์กบุ๊ก RTM | [เปิดโฟลเดอร์ 03](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/) |
| **04** | **สถาปัตยกรรมระบบ (System Architecture)** | รวมครบ 27 แผนภาพ (D01–D27 ภาษาไทยและอังกฤษ), ซอร์สโค้ด Mermaid, ไฟล์ Draw.io, ภาพ SVG/PNG | [เปิดโฟลเดอร์ 04](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/) |
| **05** | **ฐานข้อมูลและธรรมาภิบาล (Database & Governance)** | สคริปต์สกีมา PostgreSQL (001_core.sql, 002_r3_services.sql), พจนานุกรมข้อมูลกายภาพ | [เปิดโฟลเดอร์ 05](file:///D:/workspaces/interviewx-datahub/docs-interviex/05_Database_Data_Governance/) |
| **06** | **การออกแบบ UI/UX (UI/UX Design)** | ม็อกอัปหน้าจอ Dashboard, UI Guidelines, Responsive Viewport (Web & Mobile) | [เปิดโฟลเดอร์ 06](file:///D:/workspaces/interviewx-datahub/docs-interviex/06_UI_UX_Design/) |
| **07** | **เอกสารประกอบการพัฒนา (Development Docs)** | Master Knowledge Pack v1.1, ผังโครงสร้าง Monorepo, กฎการพึ่งพาโมดูล และมาตรฐานโค้ด | [เปิดโฟลเดอร์ 07](file:///D:/workspaces/interviewx-datahub/docs-interviex/07_Development_Documentation/) |
| **08** | **วิศวกรรมปัญญาประดิษฐ์ (AI/ML Engineering)** | สัญญา OpenAPI 3.1 สำหรับ AI Service, ไปป์ไลน์ประเมินผล AI (D26), ระบบ Fallback & Circuit Breaker (D27) | [เปิดโฟลเดอร์ 08](file:///D:/workspaces/interviewx-datahub/docs-interviex/08_AI_ML_Engineering/) |
| **09** | **การประกันคุณภาพและการทดสอบ (Testing & QA)** | กลยุทธ์การทดสอบ Testing Pyramid, DoD (Definition of Done), เกณฑ์ตรวจรับงาน | [เปิดโฟลเดอร์ 09](file:///D:/workspaces/interviewx-datahub/docs-interviex/09_Testing_QA/) |
| **10** | **การติดตั้งและปฏิบัติการระบบ (Deployment & DevOps)** | สถาปัตยกรรม Kubernetes Showcase, Docker Compose, CI/CD Pipeline, การตรวจวัดระบบ | [เปิดโฟลเดอร์ 10](file:///D:/workspaces/interviewx-datahub/docs-interviex/10_Deployment_DevOps/) |
| **11** | **ธุรกิจและการเงิน (Business & Finance)** | แผนแพ็กเกจการสมัครสมาชิก (Basic, Pro, Enterprise), ระบบชำระเงิน และการตรวจสอบสิทธิ์ | [เปิดโฟลเดอร์ 11](file:///D:/workspaces/interviewx-datahub/docs-interviex/11_Business_Finance/) |
| **12** | **คลังเอกสารประวัติ (Historical Archives)** | ศูนย์กลางควบคุมสารบัญเอกสารประวัติ v1.0 Baseline, v1.1 Drafts และร่างเบื้องต้นทั้งหมด | [เปิดโฟลเดอร์ 12](file:///D:/workspaces/interviewx-datahub/docs-interviex/12_Archive/) |

---

## 🌟 เอกสารหลักฐานเวอร์ชันหลักของโครงการที่ผ่านการอนุมัติ (Active Primary Baseline — v1.1 FINAL)

เอกสารชุดนี้เป็น **เอกสารหลักฐานทางการ (Official Active Baseline)** ที่ผ่านการตรวจรับและอนุมัติจากผู้มีส่วนได้ส่วนเสียและทีมพัฒนาโครงการ InterviewX:

| หมวด | เอกสารผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|:---:|---|---|:---:|---|
| 01 | **โครงสร้างทีมพัฒนาและ Module Ownership** | [InterviewX_Development_Team_Roles_and_Module_Ownership.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Development_Team_Roles_and_Module_Ownership.md) | ~14 KB | **⭐ [Master]** บทบาท 5 คน, Module Ownership 20 ระบบ, Sprint RACI Matrix และเกณฑ์ตรวจรับงาน |
| 01 | **เอกสารจัดสรรงาน Sprint 2 (ฉบับปรับปรุง)** | [InterviewX_Sprint2_Team_Alignment_Brief.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Sprint2_Team_Alignment_Brief.md) | ~18 KB | สรุปกฎเหล็กสถาปัตยกรรม, มติ D-M01 ถึง D-M11, การจัดแพ็กเกจงานระบุผู้รับผิดชอบรายบุคคล |
| 01 | **รายงานการตรวจสอบความสอดคล้อง** | [CONSISTENCY_REVIEW_REPORT.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/CONSISTENCY_REVIEW_REPORT.md) | ~10 KB | รายงานการสอบทาน 6 มิติ คะแนนความสมบูรณ์ 100% |
| 02 | **เล่มข้อเสนอโครงการวิจัย (Word)** | [InterviewX_Research_Proposal_v1.3_FINAL.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/02_Research_Analysis/proposal/InterviewX_Research_Proposal_v1.3_FINAL.docx) | ~2.1 MB | **⭐ [v1.3 FINAL]** เล่มข้อเสนอโครงการฉบับสมบูรณ์ บรรจุโครงสร้างทีมและ Module Ownership |
| 02 | **เล่มข้อเสนอโครงการวิจัย (PDF)** | [InterviewX_Research_Proposal_v1.3_FINAL.pdf](file:///D:/workspaces/interviewx-datahub/docs-interviex/02_Research_Analysis/proposal/InterviewX_Research_Proposal_v1.3_FINAL.pdf) | ~3.8 MB | เล่มข้อเสนอโครงการฉบับ PDF พร้อมส่งมอบ |
| 03 | **รายงาน SRS ฉบับวิชาการ (มรภ.นครปฐม)** | [InterviewX_SRS_Report_Revised_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_Report_Revised_TH.md) | ~3.7 MB | รายงาน SRS ฉบับสมบูรณ์ตามแบบแผนวิชาการ 4 บทใหญ่ NFR ครบ 24 ข้อ และแผนภาพ D01–D27 |
| 03 | **รายงาน SRS ฉบับวิชาการ (Word docx)** | [InterviewX_SRS_Report_v1.1_TH.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_Report_v1.1_TH.docx) | ~3.6 MB | ไฟล์ Word เอกสารรายงาน SRS ฉบับสมบูรณ์พร้อมส่ง |
| 03 | **เอกสารข้อกำหนดระบบ (SRS Word)** | [InterviewX_SRS_v1.1_FINAL_TH.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.docx) | 80.7 KB | เอกสารทางการ 14 หมวด พร้อมใบปะหน้า สารบัญ ฟอนต์ TH Sarabun New พร้อมสถานะอนุมัติ |
| 03 | **เอกสารข้อกำหนดระบบ (SRS Markdown)** | [InterviewX_SRS_v1.1_FINAL_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.md) | 129 KB | เอกสารข้อกำหนดระบบฉบับเต็ม 14 หมวดในรูปแบบมาร์กดาวน์ภาษาไทยเชิงวิชาการ |
| 03 | **เวิร์กบุ๊กข้อกำหนดและสิทธิ์ (Excel)** | [InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx) | 82.1 KB | รวม 9 แผ่นงานภาษาไทย: FR, NFR, RBAC, Platform Access, Subscription, Mobile, Data Sync, Decisions, Change Log |
| 03 | **เมทริกซ์การตรวจสอบย้อนกลับ** | [InterviewX_Phase1_Requirement_Traceability_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Requirement_Traceability_TH.xlsx) | 26.0 KB | ตารางเชื่อมโยงข้อกำหนด 64 รายการ (FR 40, NFR 24) เข้ากับ Survey, RBAC, แผนภาพ และวิธีทดสอบ |
| 03 | **ทะเบียนการตัดสินใจสถาปัตยกรรม** | [InterviewX_Phase1_Decision_Register_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Decision_Register_TH.xlsx) | 11.0 KB | ทะเบียนการตัดสินใจ D-M01 ถึง D-M11 ในภาษาไทยอย่างครบถ้วน |
| 04 | **แผนภาพสถาปัตยกรรมระบบทั้งหมด (ไทย)** | [ALL_DIAGRAMS_v1.1_FINAL_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/ALL_DIAGRAMS_v1.1_FINAL_TH.md) | ~105 KB | รวมครบทั้ง 27 แผนภาพ (D01–D27) พร้อมคำอธิบายและป้ายกำกับภาษาไทยมาตรฐาน |
| 04 | **แผนภาพสถาปัตยกรรมระบบทั้งหมด (อังกฤษ)** | [ALL_DIAGRAMS_v1.1_FINAL.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/ALL_DIAGRAMS_v1.1_FINAL.md) | ~58 KB | รวมครบทั้ง 27 แผนภาพฉบับภาษาอังกฤษสำหรับทีมพัฒนาสากล |
| 04 | **บลูพรินต์สถาปัตยกรรมสำหรับ Draw.io** | [drawio/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/drawio/) | โฟลเดอร์ | ไฟล์ .drawio พร้อมเส้นเชื่อมต่อ Workflow ครบถ้วน นำไปเปิดแก้ไขบน app.diagrams.net ได้ทันที (D26, D27) |
| 04 | **ภาพเวกเตอร์และภาพเรนเดอร์ (SVG/PNG)** | [images/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/images/) | โฟลเดอร์ | ภาพ Blueprint คุณภาพสูงแบบ SVG และ PNG ความละเอียดสูง สำหรับนำไปใช้ในเอกสาร |
| 07 | **ชุดความรู้รวมระบบ Master Knowledge Pack** | [INTERVIEWX_MASTER_KNOWLEDGE_PACK.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/07_Development_Documentation/INTERVIEWX_MASTER_KNOWLEDGE_PACK.md) | ~28 KB | **⭐ [Master]** Single Source of Truth สำหรับนักพัฒนาและ AI Assistant |
| 07 | **โครงสร้างโปรเจกต์ Monorepo** | [REPOSITORY_STRUCTURE.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/07_Development_Documentation/REPOSITORY_STRUCTURE.md) | ~11 KB | **⭐ [Master]** โครงสร้างโมดูลและการระบุผู้รับผิดชอบหลักตาม Bounded Context |
| 08 | **สัญญา API เชื่อมต่อบริการ AI** | [internal-evaluation.openapi.yaml](file:///D:/workspaces/interviewx-datahub/docs-interviex/08_AI_ML_Engineering/contracts/internal-evaluation.openapi.yaml) | ~8 KB | สัญญา OpenAPI 3.1 สำหรับ BullMQ Worker ↔ FastAPI AI Service |

---

## 👥 โครงสร้างทีมพัฒนาและ Module Ownership (Approved Team Structure)

| ลำดับ | รายชื่อสมาชิก | บทบาทและตำแหน่งที่ได้รับอนุมัติ | ขอบเขตโมดูลหลักที่รับผิดชอบ (Primary Ownership) |
|:---:|---|---|---|
| 1 | **นายนรงศักดิ์ ภูมิประเสริฐ** | Tech Lead, Architecture, AI Layer, DevOps, Integration | AI Service (FastAPI), Prompt & Rubric Engine, STT Voice, Circuit Breaker, MLflow/DVC, CI/CD & K8s |
| 2 | **นายสมหมาย สุภาวงค์** | UX/UI Lead, Design System, Frontend & Mobile Developer | Responsive Web (Next.js), Native Mobile (React Native/Expo), Tailwind/shadcn UI, State Management |
| 3 | **นายกิติกร เทศธรรม** | Fullstack Developer, NestJS Core Backend, API Developer | Identity & RBAC, Question Bank, Rubric Management, Scoring Engine, PostgreSQL Core Schema |
| 4 | **นายจิรเมธ วงษ์กัณหา** | Fullstack Developer, NestJS Core Backend, Integration | Outbox Pattern, BullMQ Integration, Idempotency, Billing & Payment Gateway, Audit Logging |
| 5 | **นายณัฐพล กลิ่นจุ่น** | Business Analyst (BA), QA, Tester, Documentation | Requirement Traceability (RTM), DoD Verification, Test Scenarios & Automation, System Documentation |

---

## 📊 สารบัญแผนภาพสถาปัตยกรรมระบบ (Diagram Catalog: D01–D27)

`	ext
D01: บริบทระบบโดยรวม (System Context)
D02: สถาปัตยกรรมคอนเทนเนอร์ C4 Model (C4 Containers Architecture)
D03: ขอบเขตบริบทของระบบ (Bounded Contexts)
D04: แผนภาพข้อมูลหลัก (Core Entity Relationship Diagram: ERD)
D05: แผนภาพข้อมูลเชิงพาณิชย์และวิจัย (R3 Commercial & Research ERD)
D06: ขอบเขตความไว้วางใจระดับ API (API Trust Boundaries)
D07: ลำดับขั้นตอนการสัมภาษณ์แบบข้อความ (Text-based Interview Sequence)
D08: วงจรสถานะการประเมินผล AI (AI Evaluation States & Transitions)
D09: การตรวจสอบตัวตนและการอนุญาตสิทธิ์ (Identity & Authorization Flow)
D10: วงจรชีวิตข้อมูลและความเป็นส่วนตัว (Privacy Lifecycle & Consent Management)
D11: ลำดับขั้นตอนการสัมภาษณ์ด้วยเสียง (Voice Interview Sequence R2)
D12: ลำดับขั้นตอนการชำระเงินและสิทธิ์ (Payment & Entitlement Sequence R3)
D13: กระบวนการส่งมอบข้อมูลเพื่องานวิจัย (Research Data Release Pipeline R3)
D14: สถาปัตยกรรมระบบจริง (Managed Production Architecture)
D15: สภาพแวดล้อมจำลองบน Kubernetes (Kubernetes Showcase Sandbox)
D16: ไปป์ไลน์การรวมโค้ดและส่งมอบระบบ (CI/CD Pipeline)
D17: การสังเกตการณ์และการกู้คืนระบบ (Observability & Disaster Recovery)
D18: ขอบเขตโครงสร้างโปรเจกต์ Monorepo (Repository Boundaries & Monorepo Structure)
D19: แผนงานและขั้นตอนการส่งมอบระบบ (Release Roadmap & Delivery Milestones)
D20: แผนภาพกรณีการใช้งานระบบโดยรวม (System Use Case Diagram)
D21: ระบบย่อย: การฝึกสัมภาษณ์และการประเมินผล AI (Practice & AI Evaluation Engine)
D22: ระบบย่อย: ยืนยันตัวตนและคุ้มครองข้อมูลส่วนบุคคล (Identity & PDPA Governance)
D23: ระบบย่อย: บริหารระบบ การเงิน และชุดข้อมูลวิจัย (Administration, Billing & Research)
D24: การจัดแนวทางสถาปัตยกรรม Web และ Mobile (Web & Mobile Architecture Alignment)
D25: ลำดับการทำงานและการสลับอุปกรณ์ Web และ Mobile (Web vs Mobile Interaction Sequence)
D26: ผังการไหลของข้อมูลสำหรับระบบ AI (AI Data Pipeline Flow)
D27: กลไกสำรองกรณีการประเมินของ AI ล้มเหลว (AI Fallback & Circuit Breaker)
`

---

## 🔒 กฎเกณฑ์การกำกับดูแลเอกสาร (Documentation Governance Rules)

1. **ห้ามเขียนทับข้อมูลประวัติ (No Overwriting Historical Records):** เอกสารในโฟลเดอร์ rchive/ ของแต่ละหมวดเป็นหลักฐานทางประวัติการวิเคราะห์ ห้ามแก้ไขหรือลบทิ้ง
2. **การอ้างอิงไฟล์ด้วย URL มาตรฐาน (Strict Link Formatting):** ทุกเอกสารต้องมี Clickable Link ภายใต้รูปแบบมาตรฐาน ile:/// เพื่อความสะดวกในการเปิดอ่าน
3. **การรักษาความสอดคล้องข้ามเอกสาร (Cross-Document Consistency):** หากมีการปรับปรุงข้อกำหนดหรือสถาปัตยกรรม ต้องสอบทานความสอดคล้องกันทั้ง 3 ส่วนหลัก: เอกสาร SRS, แผนภาพสถาปัตยกรรม (D01–D27), และเวิร์กบุ๊ก RTM เสมอ
