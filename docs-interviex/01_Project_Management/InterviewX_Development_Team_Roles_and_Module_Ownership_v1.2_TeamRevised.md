# เอกสารโครงสร้างทีมพัฒนา บทบาทหน้าที่ ความรับผิดชอบ และ Technical Ownership (v1.2 Team-Revised)
## InterviewX — Development Team Structure, Roles & Ownership Matrix

> **สถานะเอกสาร:** ควบคุมและเป็นเกณฑ์หลักในการบริหารโครงการ (Project Management & Governance Baseline)  
> **วันที่มีผลบังคับใช้:** 25 พฤศจิกายน 2026 | **เวอร์ชัน:** 1.2 (Team Structure, Roles & Technical Ownership Revised)  
> **เอกสารต้นฉบับที่คงสภาพเดิม:** [InterviewX_Development_Team_Roles_and_Module_Ownership.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Development_Team_Roles_and_Module_Ownership.md)  
> **ระบบ:** InterviewX — AI Job Interview Simulation System  
> **เอกสารอ้างอิงหลัก:** [InterviewX_SRS_Report_v1.2_TeamRevised_TH.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_Report_v1.2_TeamRevised_TH.md) | [INTERVIEWX_MASTER_KNOWLEDGE_PACK_v1.2_TeamRevised.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/07_Development_Documentation/INTERVIEWX_MASTER_KNOWLEDGE_PACK_v1.2_TeamRevised.md) | [Team_Structure_Ownership_Governance_Diagram_v1.2_TH.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/Team_Structure_Ownership_Governance_Diagram_v1.2_TH.md)

---

## 1. วัตถุประสงค์ของการปรับปรุง (Revision Objectives)

ปรับปรุง Team Structure, Job Descriptions, Responsibilities และ Module Ownership Matrix ให้ตรงตามการแบ่งหน้าที่ที่ได้รับอนุมัติจากผู้จัดทำโครงการ โดยยึดหลักการดังนี้:
1. **Tech Lead** รับผิดชอบ System Architecture, Backend Technical Governance, Backend Review อย่างต่อเนื่อง และ AI Service Development (เป็น Primary Owner ของ AI Service ไม่ใช่เพียงผู้ให้คำปรึกษา)
2. **UX/UI Lead & Frontend Lead** รับผิดชอบ UX/UI และเป็น Frontend Primary Owner ทั้งด้านการออกแบบและการพัฒนา Frontend หลัก
3. **Fullstack Developers ทั้งสองคน** รับผิดชอบ Backend เป็นหลัก (Backend Primary Developers) และสนับสนุน Frontend ตามความจำเป็น (Frontend Supporting Developers) โดยไม่ใช่ Frontend Primary Owner และไม่รับผิดชอบการพัฒนา AI Evaluation Engine
4. **BA / QA / Tester / Documentation** รับผิดชอบการวิเคราะห์ความต้องการ การทดสอบทุกระดับ และการจัดทำเอกสาร

---

## 2. สมาชิกและตำแหน่ง (Approved Team Members & Positions)

| สมาชิก | รหัสนักศึกษา | ตำแหน่ง | บทบาทหลัก |
|---|:---:|---|---|
| **นายนรงศักดิ์ ภูมิประเสริฐ** | 674259009 | **Tech Lead** | System Architecture, Backend Technical Governance & AI Service Owner |
| **นายสมหมาย สุภาวงค์** | 674259024 | **UX/UI Lead & Frontend Lead** | UX/UI Design, Design System & Frontend Primary Owner |
| **นายกิติกร เทศธรรม** | 674259003 | **Fullstack Developer** | Backend Primary Developer & Frontend Supporting Developer |
| **นายจิรเมธ วงษ์กัณหา** | 674259004 | **Fullstack Developer** | Backend Primary Developer & Frontend Supporting Developer |
| **นายณัฐพล กลิ่นจุ่น** | 674259006 | **BA / QA / Tester / Documentation** | Requirement Analysis, Testing & Technical Documentation |

---

## 3. รายละเอียดหน้าที่แต่ละตำแหน่ง (Job Descriptions & Responsibilities)

### 3.1 Tech Lead — นายนรงศักดิ์ ภูมิประเสริฐ (674259009)
**บทบาท:** System Architecture, Backend Technical Governance & AI Service Owner

1. ออกแบบและควบคุม System Architecture ของ InterviewX
2. กำหนดมาตรฐานการพัฒนา Backend ด้วย NestJS
3. กำกับดูแลโครงสร้าง Modular Monolith
4. ตรวจสอบ Backend Code และ Architecture อย่างต่อเนื่อง
5. ตรวจสอบ API Contract, Database Integration และ Security
6. ตรวจสอบ Code Quality และ Technical Implementation ของ Fullstack Developers
7. อนุมัติหรือทบทวนการเปลี่ยนแปลง Backend Architecture ตามกระบวนการทีม
8. พัฒนา AI Service ด้วย FastAPI / Python
9. พัฒนา LLM Integration
10. พัฒนา AI Evaluation Engine และ Rubric Engine
11. ดูแล Structured Output, Guardrails และ AI Evaluation Logic
12. ดูแล Docker, CI/CD, Deployment และ DevOps
13. ควบคุม System Integration ระหว่าง NestJS, Worker และ AI Service

> **ข้อกำหนด:** Tech Lead เป็นผู้ควบคุมมาตรฐานและตรวจสอบ Backend ทั้งระบบ ไม่ใช่เพียงผู้ให้คำปรึกษา และเป็น Primary Owner ของ AI Service

### 3.2 UX/UI Lead & Frontend Lead — นายสมหมาย สุภาวงค์ (674259024)
**บทบาท:** UX/UI Design, Design System & Frontend Primary Owner

1. วิเคราะห์ User Experience และ User Journey
2. ออกแบบ User Flow และ Information Architecture
3. จัดทำ Wireframe และ Prototype
4. ออกแบบ UX/UI ของระบบ
5. พัฒนาและดูแล Design System
6. กำหนด Reusable UI Components
7. กำหนด Design Tokens และ UI Standards
8. ออกแบบ Responsive Layout
9. พัฒนา Frontend Web ด้วย Next.js (และดูแล Native Mobile ด้วย React Native / Expo ตาม Roadmap R2)
10. จัดการ Frontend Architecture และ Component Structure
11. พัฒนา UI ตาม Functional Requirements
12. เชื่อมต่อ Frontend กับ REST API
13. ตรวจสอบ UI Consistency และ Accessibility
14. เป็น Frontend Primary Owner และประสานงานกับ Fullstack Developers

> **ข้อกำหนด:** สมหมายเป็นผู้รับผิดชอบ Frontend หลัก ทั้งด้านการออกแบบและการพัฒนา ไม่ใช่เพียงผู้ออกแบบ UX/UI

### 3.3 Fullstack Developer — นายกิติกร เทศธรรม (674259003)
**บทบาท:** Backend Primary Developer & Frontend Supporting Developer

**ความรับผิดชอบด้าน Backend (Primary):**
1. Authentication & Authorization
2. Registration / Login / Logout
3. User Profile & Account Management
4. Role-Based Access Control (RBAC)
5. REST API Development
6. DTOs & Validation
7. PostgreSQL & Prisma ORM
8. Database Integration
9. Backend Security
10. API Documentation & OpenAPI

**ความรับผิดชอบด้าน Frontend (Supporting):**
1. สนับสนุนการพัฒนา Frontend ร่วมกับ Frontend Lead
2. ช่วยพัฒนา UI Components และหน้าเว็บตามที่ได้รับมอบหมาย
3. เชื่อมต่อ UI กับ Authentication และ User APIs
4. ช่วยจัดการ Frontend Form Validation
5. ช่วยแก้ไขปัญหาการเชื่อมต่อระหว่าง Frontend และ Backend
6. สนับสนุนการทดสอบ Frontend ใน Feature ที่ตนรับผิดชอบ

> **ข้อกำหนด:** Backend เป็นความรับผิดชอบหลัก ส่วน Frontend เป็นงานสนับสนุน ไม่ใช่ Frontend Primary Owner

### 3.4 Fullstack Developer — นายจิรเมธ วงษ์กัณหา (674259004)
**บทบาท:** Backend Primary Developer & Frontend Supporting Developer

**ความรับผิดชอบด้าน Backend (Primary):**
1. Interview Session Management
2. Interview Question Management
3. Answer Submission API
4. Session State Management
5. BullMQ & Redis Queue
6. Evaluation Job Integration
7. Transactional Outbox Pattern
8. Idempotency Mechanism
9. Session Resilience
10. NestJS Worker Integration กับ AI Service
11. Backend Error Handling และ Integration

**ความรับผิดชอบด้าน Frontend (Supporting):**
1. สนับสนุนการพัฒนา Interview Room UI
2. ช่วยพัฒนา Interview Question และ Answer Components
3. ช่วยเชื่อมต่อ Interview APIs กับ Frontend
4. ช่วยพัฒนาการแสดงสถานะ Evaluation Processing
5. ช่วยพัฒนาการแสดงข้อมูล Interview History และ Results
6. สนับสนุนการทดสอบ Frontend ใน Feature ที่ตนรับผิดชอบ

> **ข้อกำหนด:** Backend เป็นความรับผิดชอบหลัก ส่วน Frontend เป็นงานสนับสนุนภายใต้แนวทางและมาตรฐานของ Frontend Lead

### 3.5 BA / QA / Tester / Documentation — นายณัฐพล กลิ่นจุ่น (674259006)
1. Requirement Analysis
2. Functional / Non-Functional Requirements Review
3. Requirement Traceability Matrix (RTM)
4. Test Scenarios & Test Cases
5. Functional Testing
6. Frontend Testing
7. Backend API Testing
8. Integration Testing
9. System Testing
10. Defect Tracking
11. Test Reports
12. Technical Documentation
13. Acceptance Criteria Review

---

## 4. Ownership Matrix

| ระบบ / งาน | Primary Owner | Supporting |
|---|---|---|
| System Architecture | Tech Lead | Fullstack Developers |
| Backend Architecture & Standards | Tech Lead | Fullstack Developers |
| Backend Code Review & Technical Governance | Tech Lead | — |
| Authentication & Identity Backend | กิติกร | Tech Lead |
| User Profile & Account Backend | กิติกร | Tech Lead |
| Interview Session Backend | จิรเมธ | Tech Lead |
| Interview Question & Answer Backend | จิรเมธ | Tech Lead |
| BullMQ & Evaluation Queue | จิรเมธ | Tech Lead |
| NestJS Worker Integration | จิรเมธ | Tech Lead |
| AI Service & FastAPI | Tech Lead | — |
| AI Evaluation & Rubric Engine | Tech Lead | — |
| UX/UI Design | สมหมาย | — |
| Design System | สมหมาย | — |
| Frontend Architecture | สมหมาย | Tech Lead ให้คำปรึกษา |
| Frontend Web Development | สมหมาย | กิติกร / จิรเมธ |
| Frontend API Integration | สมหมาย | Fullstack Developers |
| QA & Testing | ณัฐพล | สมาชิกทุกคน |
| Requirements & Documentation | ณัฐพล | สมาชิกทุกคน |

---

## 5. หลักการทำงานร่วมกัน (Collaboration & Governance Workflow)

1. **สมหมาย** เป็น Frontend Lead และ Frontend Primary Owner
2. **กิติกร** และ **จิรเมธ** เป็น Backend Primary Developers ตามระบบย่อยที่รับผิดชอบ
3. Fullstack Developers ทั้งสองคนสามารถสนับสนุน Frontend ได้ตาม Sprint Backlog และการมอบหมายจาก Frontend Lead
4. **Tech Lead** เป็นผู้ควบคุมและตรวจสอบ Backend Architecture, API, Security และ Code Quality อย่างต่อเนื่อง
5. Backend Code Review ต้องดำเนินการตามกระบวนการก่อน Merge หรือ Release
6. **Tech Lead** เป็นผู้พัฒนาและดูแล AI Service โดยตรง
7. Fullstack Developers รับผิดชอบการเชื่อมต่อ NestJS Backend และ Worker กับ AI Service แต่ไม่รับผิดชอบการพัฒนา AI Evaluation Engine
8. QA รับผิดชอบการทดสอบระบบทุกส่วนร่วมกับผู้พัฒนา

---

## 6. Sprint RACI Matrix (v1.2 Team-Revised)

- **R (Responsible):** ผู้ลงมือปฏิบัติงานหลัก | **A (Accountable):** ผู้รับผิดชอบอนุมัติขั้นสุดท้าย | **C (Consulted):** ผู้ร่วมให้ข้อเสนอแนะ/สนับสนุน | **I (Informed):** ผู้รับทราบผล

| กิจกรรมในวงจรการพัฒนา | นายนรงศักดิ์ (Tech Lead) | นายสมหมาย (UX/UI & FE Lead) | นายกิติกร (Fullstack) | นายจิรเมธ (Fullstack) | นายณัฐพล (BA/QA) |
|---|:---:|:---:|:---:|:---:|:---:|
| Requirement Analysis & RTM | C | C | C | C | **R / A** |
| System & Backend Architecture / Standards | **R / A** | C | C | C | I |
| Backend Code Review & Technical Governance | **R / A** | I | C | C | I |
| Auth, Identity & User Profile Backend | A (Governance) / C | I | **R** | I | I |
| Interview Session, Question, Outbox & BullMQ Backend | A (Governance) / C | I | I | **R** | I |
| AI Service (FastAPI) & Rubric Engine Development | **R / A** | I | I | I | I |
| NestJS Worker <-> AI Service Integration | A (Governance) / C | I | I | **R** | I |
| UX/UI Design & Design System | I | **R / A** | I | I | C |
| Frontend Architecture & Next.js Web Development | C | **R / A** | C (Supporting) | C (Supporting) | I |
| Docker, CI/CD & DevOps | **R / A** | I | C | C | I |
| Testing (Functional / FE / API / Integration / System) | C | C | C | C | **R / A** |
| Technical Documentation & Acceptance Review | C | C | C | C | **R / A** |

---

## 7. ข้อกำหนดด้าน Technical Architecture ที่คงสภาพเดิม 100%

- **Technology Stack:** Next.js (Frontend Web), React Native / Expo (Native Mobile ตาม Roadmap), NestJS (Core Backend Modular Monolith), PostgreSQL + Prisma ORM, Redis / BullMQ, NestJS Evaluation Worker, FastAPI / Python (AI Service)
- **Single Ownership of Core Database:** NestJS Core เท่านั้นที่เข้าถึงและจัดการ Core Database; **AI Service ห้ามเชื่อมต่อ Core PostgreSQL โดยตรง**
- **Resilience Invariants:** คง Transactional Outbox, Idempotency และ Session Resilience ตาม SRS เดิม
