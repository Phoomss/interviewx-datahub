# รายงานการตรวจสอบและคู่มือปรับปรุงเอกสารข้อเสนอโครงการวิจัย (Proposal Manual Update Report)
## InterviewX — Research Proposal v1.3 FINAL Update Notes (Aligned with v1.2 Team-Revised)

> **สถานะเอกสาร:** รายงานข้อเสนอแนะสำหรับแก้ไขไฟล์ Word (`Copy-Paste Ready`)  
> **วันที่จัดทำ:** 25 พฤศจิกายน 2026 | **เวอร์ชันอ้างอิง:** 1.2 Team-Revised  
> **ไฟล์เป้าหมายที่ต้องแก้ไข:** [InterviewX_Research_Proposal_v1.3_FINAL.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/02_Research_Analysis/proposal/InterviewX_Research_Proposal_v1.3_FINAL.docx)  
> **ไฟล์ PDF ที่ต้องส่งออกใหม่หลังแก้ไข:** [InterviewX_Research_Proposal_v1.3_FINAL.pdf](file:///D:/workspaces/interviewx-datahub/docs-interviex/02_Research_Analysis/proposal/InterviewX_Research_Proposal_v1.3_FINAL.pdf)  
> **เอกสารอ้างอิงหลัก (v1.2 Team-Revised):**  
> - [InterviewX_SRS_Report_v1.2_TeamRevised_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_Report_v1.2_TeamRevised_TH.md)  
> - [InterviewX_Development_Team_Roles_and_Module_Ownership_v1.2_TeamRevised.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Development_Team_Roles_and_Module_Ownership_v1.2_TeamRevised.md)  
> - [CONSISTENCY_REVIEW_REPORT_v1.2.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/CONSISTENCY_REVIEW_REPORT_v1.2.md)

---

## 1. บทสรุปผู้บริหาร (Executive Summary)

จากการตรวจทานเนื้อหาทั้งหมดของ [InterviewX_Research_Proposal_v1.3_FINAL.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/02_Research_Analysis/proposal/InterviewX_Research_Proposal_v1.3_FINAL.docx) เทียบกับเอกสาร SRS และเอกสารบริหารโครงงานชุด **v1.2 Team-Revised** รวมถึงฐานข้อมูลผลสำรวจ [INTERVIEWX_SURVEY_DETAILED_ANALYSIS.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/02_Research_Analysis/survey/INTERVIEWX_SURVEY_DETAILED_ANALYSIS.md) พบผลสรุปดังนี้:

1. **ส่วนที่ไม่ต้องแก้ไข (ถูกต้องและสอดคล้องแล้ว):**
   - บทนำและข้อมูลสถิติจากการสำรวจ (`n=102`: 92.16%, 65.69%, 56.86%, 53.92%, 62.75%, 82.35%, 37.25%) ตรงกับข้อมูลวิเคราะห์จริงทุกตัวเลข
   - วัตถุประสงค์ (`1.2`), คำถามวิจัย (`1.3`), ขอบเขตผู้ใช้งาน 5 บทบาท (`1.5.1`), ขอบเขตการทำงานและเทคโนโลยี (`1.5.2`–`1.5.3`), การประเมินผลและข้อจำกัด (`1.5.4`–`1.5.5`), ประโยชน์ที่คาดว่าจะได้รับ (`1.6`), ระเบียบวิธีวิจัย 7 ขั้นตอน (`1.7`), และแผนการดำเนินงาน 12 เดือน (`1.8`) สอดคล้องกับ SRS แล้ว
2. **ส่วนที่ต้องปรับปรุงแก้ไข (5 รายการหลัก):**
   - **จุดที่ 1 (หน้าปกนอก & ปกใน):** แก้ตัวสะกดชื่อ `นายนรงศ์ศักดิ์` เป็น `นายนรงศักดิ์` และจัดลำดับรายชื่อบนปกนอกให้ตรงกับปกใน
   - **จุดที่ 2 (นิยามศัพท์ `1.4.5`):** เพิ่มมิติที่ 4 (`การใช้เหตุผลเชิงตรรกะ`) ให้ตรงกับข้อ `1.5.2.3`, `1.7.4` และ `1.7.6.2` ในเล่มเดียวกัน
   - **จุดที่ 3 (หมวด `1.9` ทั้งหมวด — สำคัญที่สุด):** ปรับโครงสร้างทีม บทบาท หน้าที่ และตาราง Ownership Matrix (`1.9.1`–`1.9.5`) จากเวอร์ชันเดิม ให้ตรงตามมติ **v1.2 Team-Revised**
   - **จุดที่ 4 (สารบัญและหัวข้อ `1.9`):** แก้ระดับหัวข้อ `1.9` ในสารบัญจาก `TOC2` ให้เป็น `TOC1` เสมอกับ `1.1`–`1.8` และสั่ง Update Field สารบัญใหม่
   - **จุดที่ 5 (จุดพิมพ์ตกหล่น/เว้นวรรค):** แก้ไขคำติดกัน 4 จุด, เคาะวรรคเกิน 2 จุด และปรับเลขเวอร์ชัน OpenAPI ให้สอดคล้องกัน

---

## 2. รายละเอียดจุดที่ต้องแก้ไขพร้อมข้อความสำเร็จรูป (`Copy-Paste Ready`)

---

### จุดปรับปรุงที่ 1: ปกนอก และ ปกใน (ตัวสะกดชื่อ + ลำดับรายชื่อผู้จัดทำ)

#### 1.1 ปัญหาที่พบ
1. **ตัวสะกดชื่อไม่ตรงกันในเล่มเดียวกัน:** ปกนอก, ปกใน, ตารางที่ 1.1, `1.9.2.1` และตารางที่ 1.2 สะกดว่า `นายนรงศ์ศักดิ์` (มี `ศ์`) แต่ใน `1.9.4`, `1.9.5` และเอกสารชุด v1.2 Team-Revised ทุกฉบับสะกดว่า **`นายนรงศักดิ์`**
2. **ลำดับชื่อบนปกนอกสลับกับปกใน:**
   - **ปกนอกเดิม:** กิติกร → **ณัฐพล → จิรเมธ** → นรงศ์ศักดิ์ → สมหมาย *(และช่องไฟเว้นวรรคไม่เท่ากัน)*
   - **ปกในเดิม:** กิติกร (674259003) → **จิรเมธ (674259004) → ณัฐพล (674259006)** → นรงศ์ศักดิ์ (674259009) → สมหมาย (674259024)

#### 1.2 ข้อความใหม่สำหรับนำไปแทนที่

**ปกนอก (หน้า 1):**
```text
ผู้จัดทำ
นายกิติกร เทศธรรม
นายจิรเมธ วงษ์กัณหา
นายณัฐพล กลิ่นจุ่น
นายนรงศักดิ์ ภูมิประเสริฐ
นายสมหมาย สุภาวงค์
```

**ปกใน (หน้า 2):**
```text
ผู้จัดทำ
นายกิติกร เทศธรรม		674259003
นายจิรเมธ วงษ์กัณหา		674259004
นายณัฐพล กลิ่นจุ่น		674259006
นายนรงศักดิ์ ภูมิประเสริฐ	674259009
นายสมหมาย สุภาวงค์		674259024
```

---

### จุดปรับปรุงที่ 2: นิยามศัพท์ข้อ `1.4.5` (จำนวนมิติของเกณฑ์รูบริกไม่ครบ 4 ด้าน)

#### 2.1 ปัญหาที่พบ
ข้อ `1.4.5` ระบุองค์ประกอบของเกณฑ์รูบริกไว้เพียง **3 ด้าน** (*ความตรงประเด็น, ความครบถ้วนของเนื้อหา, และโครงสร้างหรือความชัดเจนของคำตอบ*) ซึ่งขาด **"การใช้เหตุผลเชิงตรรกะ (Logical Reasoning)"** ทำให้ไม่ตรงกับข้อ `1.5.2.3`, `1.7.4` (`1.7.4.1`–`1.7.4.4`) และ `1.7.6.2` ภายในเล่มเดียวกัน

#### 2.2 ข้อความใหม่สำหรับนำไปแทนที่ข้อ `1.4.5`

```text
1.4.5 การประเมินคำตอบตามเกณฑ์ (Rubric-Based Assessment) หมายถึง กระบวนการประเมินคุณภาพคำตอบโดยใช้เกณฑ์และระดับคะแนนที่กำหนดไว้อย่างชัดเจน ซึ่งในโครงงานนี้ประกอบด้วยการประเมิน 4 ด้าน ได้แก่ ความตรงประเด็น (Relevance) โครงสร้างคำตอบ (Answer Structure) การใช้เหตุผลเชิงตรรกะ (Logical Reasoning) และความครบถ้วนของเนื้อหา (Completeness) โดยใช้เกณฑ์การประเมินเดียวกันสำหรับระบบปัญญาประดิษฐ์และผู้ประเมินที่เป็นมนุษย์ เพื่อให้สามารถเปรียบเทียบผลการประเมินได้
```

---

### จุดปรับปรุงที่ 3: หมวด `1.9 โครงสร้างและความรับผิดชอบของทีมพัฒนา` (ปรับตาม v1.2 Team-Revised)

#### 3.1 สรุปประเด็นที่ต้องปรับในหมวด `1.9`
1. **นายนรงศักดิ์ ภูมิประเสริฐ (`Tech Lead`):** เพิ่มความชัดเจนเรื่อง **Backend Technical Governance** (ควบคุมมาตรฐานและตรวจสอบ Backend Code, API, Security, DB Integration อย่างต่อเนื่องก่อน Merge/Release ไม่ใช่เพียงผู้ให้คำปรึกษา) และเป็น **Primary Owner ของ AI Service & Rubric Engine เพียงผู้เดียว**
2. **นายสมหมาย สุภาวงค์ (`UX/UI Lead & Frontend Lead`):** ปรับตำแหน่งให้ชัดเจนว่าเป็น **`UX/UI Lead & Frontend Lead`** และเป็น **`Frontend Primary Owner`** ทั้งด้านการออกแบบ UX/UI, Design System, Frontend Architecture, การพัฒนา Frontend หลัก และการเชื่อมต่อ REST API
3. **นายกิติกร เทศธรรม และ นายจิรเมธ วงษ์กัณหา (`Fullstack Developer`):** ระบุขอบเขตทั้งด้าน **Backend (Primary)** และ **Frontend (Supporting)** อย่างชัดเจน โดย Frontend เป็นงานสนับสนุนภายใต้แนวทางของ Frontend Lead (ไม่ใช่ Frontend Primary Owner) และไม่รับผิดชอบการพัฒนา AI Evaluation Engine
4. **ตารางที่ 1.2 (Ownership Matrix):**
   - นำ `จิรเมธ` ออกจาก Supporting ของ `AI Service & FastAPI` และ `AI Evaluation & Rubric Engine` (เปลี่ยนเป็น `—`)
   - นำ `สมหมาย` ออกจาก Supporting ของ `User Profile & Management` (เปลี่ยนเป็น `Tech Lead` เป็น Supporting)
   - เพิ่มแถว `Backend Code Review & Technical Governance` (`Primary Owner: Tech Lead (นายนรงศักดิ์)`)
   - แยกแถวฝั่ง Frontend ให้ชัดเจน (`UX/UI Design`, `Design System`, `Frontend Architecture`, `Frontend Web Development`, `Frontend API Integration`) โดยมี `สมหมาย` เป็น Primary Owner
   - ลบตัวอักษร `/` ที่เกินใน `กิติกร, / จิรเมธ`

#### 3.2 เนื้อหาใหม่ฉบับสมบูรณ์สำหรับนำไปแทนที่หมวด `1.9` (`1.9.1`–`1.9.5`)

> **1.9 โครงสร้างและความรับผิดชอบของทีมพัฒนา**  
> เพื่อให้การดำเนินงานวิจัยและพัฒนาระบบ InterviewX เป็นไปตามหลักวิศวกรรมซอฟต์แวร์ที่มีประสิทธิภาพ มีการบริหารงานที่โปร่งใส ตรวจสอบได้ และยึดหลัก Technical Ownership อย่างเป็นทางการ คณะผู้จัดทำจึงได้กำหนดโครงสร้างทีมพัฒนา บทบาทหน้าที่ ความรับผิดชอบรายบุคคล ความเป็นเจ้าของระบบย่อย และเกณฑ์การตรวจรับผลงาน โดยมีรายละเอียดดังนี้

##### **1.9.1 โครงสร้างตำแหน่งและบทบาทของสมาชิกทีมพัฒนา**
สมาชิกในคณะผู้จัดทำทั้ง 5 คน ได้รับมอบหมายบทบาทและตำแหน่งที่ผ่านการอนุมัติอย่างเป็นทางการ โดยมีรายละเอียดดังแสดงในตารางที่ 1.1

**ตารางที่ 1.1 โครงสร้างตำแหน่งและบทบาทหน้าที่ของสมาชิกทีมพัฒนา InterviewX**

| ลำดับ | ชื่อ-นามสกุล (รหัสนักศึกษา) | ตำแหน่ง | บทบาทหลัก |
|:---:|---|---|---|
| 1 | นายนรงศักดิ์ ภูมิประเสริฐ (674259009) | Tech Lead | System Architecture, Backend Technical Governance & AI Service Owner |
| 2 | นายสมหมาย สุภาวงค์ (674259024) | UX/UI Lead & Frontend Lead | UX/UI Design, Design System & Frontend Primary Owner |
| 3 | นายกิติกร เทศธรรม (674259003) | Fullstack Developer | Backend Primary Developer & Frontend Supporting Developer |
| 4 | นายจิรเมธ วงษ์กัณหา (674259004) | Fullstack Developer | Backend Primary Developer & Frontend Supporting Developer |
| 5 | นายณัฐพล กลิ่นจุ่น (674259006) | BA / QA / Tester / Documentation | Requirement Analysis, Testing & Technical Documentation |

##### **1.9.2 หน้าที่ ขอบเขตงาน และผลงานที่ต้องส่งมอบรายบุคคล**

```text
1.9.2.1 นายนรงศักดิ์ ภูมิประเสริฐ: Tech Lead (System Architecture, Backend Technical Governance & AI Service Owner)
ขอบเขตงาน: ออกแบบและควบคุม System Architecture ของ InterviewX กำหนดมาตรฐานการพัฒนา Backend ด้วย NestJS และกำกับดูแลโครงสร้าง Modular Monolith ตรวจสอบ Backend Code, Architecture, API Contract (OpenAPI 3.1), Database Integration, Security และ Code Quality ของ Fullstack Developers อย่างต่อเนื่อง รวมถึงอนุมัติหรือทบทวนการเปลี่ยนแปลง Backend Architecture ตามกระบวนการทีม พัฒนา AI Service ด้วย FastAPI / Python, LLM Integration, AI Evaluation Engine และ Rubric Engine พร้อมดูแล Structured Output, Guardrails และ AI Evaluation Logic นอกจากนี้ รับผิดชอบดูแล Docker, CI/CD, Deployment, DevOps และควบคุม System Integration ระหว่าง NestJS, Worker และ AI Service (ทั้งนี้ Tech Lead เป็นผู้ควบคุมมาตรฐานและตรวจสอบ Backend ทั้งระบบ ไม่ใช่เพียงผู้ให้คำปรึกษา และเป็น Primary Owner ของ AI Service)
ผลงานที่ต้องส่งมอบ: System Architecture Documentation, AI Architecture & Pipeline Specification, FastAPI AI Service & Rubric Engine, OpenAPI Specification, DevOps & Docker/CI-CD Configuration, Backend Code Review & System Integration Checklist

1.9.2.2 นายสมหมาย สุภาวงค์: UX/UI Lead & Frontend Lead (UX/UI Design, Design System & Frontend Primary Owner)
ขอบเขตงาน: วิเคราะห์ User Experience และ User Journey ออกแบบ User Flow, Information Architecture, Wireframes, Interactive Prototypes และ UX/UI ของระบบ พัฒนาและดูแล InterviewX Design System (Design Tokens, Reusable UI Components, UI Standards) และออกแบบ Responsive Layout จัดการ Frontend Architecture และ Component Structure พัฒนา Frontend Web Application ด้วย Next.js (และดูแล Native Mobile Application ด้วย React Native / Expo ตาม Roadmap R2) ตาม Functional Requirements เชื่อมต่อ Frontend กับ REST API ตรวจสอบ UI Consistency และความเข้าถึงได้ตามมาตรฐาน WCAG 2.2 AA พร้อมทำหน้าที่เป็น Frontend Primary Owner และประสานงานกับ Fullstack Developers (ทั้งนี้ นายสมหมายเป็นผู้รับผิดชอบ Frontend หลัก ทั้งด้านการออกแบบและการพัฒนา ไม่ใช่เพียงผู้ออกแบบ UX/UI)
ผลงานที่ต้องส่งมอบ: UX/UI Design Documentation, User Flows, Wireframes & Prototypes, Design System & UI Component Library, Frontend Architecture, Responsive Web Code (Next.js), Native Mobile Code (R2), UI Consistency & Accessibility Review Report

1.9.2.3 นายกิติกร เทศธรรม: Fullstack Developer (Backend Primary Developer & Frontend Supporting Developer)
ขอบเขตงาน:
(1) ความรับผิดชอบด้าน Backend (Primary): พัฒนาระบบ Authentication & Authorization, Registration / Login / Logout, User Profile & Account Management, Role-Based Access Control (RBAC), REST API Development, DTOs & Validation (Zod / class-validator), การจัดการ Error ตามมาตรฐาน RFC 7807, PostgreSQL & Prisma ORM, Database Integration, Backend Security (JWT, Refresh Token Rotation, Password Hashing, IDOR Defense) และ API Documentation (OpenAPI)
(2) ความรับผิดชอบด้าน Frontend (Supporting): สนับสนุนการพัฒนา Frontend ร่วมกับ Frontend Lead ช่วยพัฒนา UI Components และหน้าเว็บตามที่ได้รับมอบหมาย เชื่อมต่อ UI กับ Authentication และ User APIs ช่วยจัดการ Frontend Form Validation ช่วยแก้ไขปัญหาการเชื่อมต่อระหว่าง Frontend และ Backend และสนับสนุนการทดสอบ Frontend ใน Feature ที่ตนรับผิดชอบ (ทั้งนี้ Backend เป็นความรับผิดชอบหลัก ส่วน Frontend เป็นงานสนับสนุน ไม่ใช่ Frontend Primary Owner)
ผลงานที่ต้องส่งมอบ: NestJS Core Backend Modules (Identity, Auth, User Profile & PDPA), RBAC & Security Implementation, REST API OpenAPI Specification, Database Migration Scripts, API Validation & Error Envelope, Frontend Supporting Pull Requests, Backend Test Reports

1.9.2.4 นายจิรเมธ วงษ์กัณหา: Fullstack Developer (Backend Primary Developer & Frontend Supporting Developer)
ขอบเขตงาน:
(1) ความรับผิดชอบด้าน Backend (Primary): พัฒนาระบบ Interview Session Management, Interview Question Management, Answer Submission API, Session State Management, ระบบคิว BullMQ & Redis, Evaluation Job Integration, Transactional Outbox Pattern, Idempotency Mechanism, Session Resilience, การเชื่อมต่อ NestJS Worker กับ AI Service รวมถึง Backend Error Handling และ Cross-Module Integration
(2) ความรับผิดชอบด้าน Frontend (Supporting): สนับสนุนการพัฒนา Interview Room UI ช่วยพัฒนา Interview Question และ Answer Components ช่วยเชื่อมต่อ Interview APIs กับ Frontend ช่วยพัฒนาการแสดงสถานะ Evaluation Processing ช่วยพัฒนาการแสดงข้อมูล Interview History และ Results และสนับสนุนการทดสอบ Frontend ใน Feature ที่ตนรับผิดชอบ (ทั้งนี้ Backend เป็นความรับผิดชอบหลัก ส่วน Frontend เป็นงานสนับสนุนภายใต้แนวทางและมาตรฐานของ Frontend Lead และไม่รับผิดชอบการพัฒนา AI Evaluation Engine)
ผลงานที่ต้องส่งมอบ: Interview Session & Question Modules, Answer Submission & Idempotency API, Transactional Outbox & BullMQ Queue Code, NestJS Worker Integration กับ AI Service, Frontend Supporting Pull Requests, Backend Integration Tests

1.9.2.5 นายณัฐพล กลิ่นจุ่น: BA / QA / Tester / Documentation (Business Analysis, Quality Assurance, Software Testing & Documentation)
ขอบเขตงาน: ดำเนินการ Requirement Analysis และทบทวน Functional / Non-Functional Requirements จัดทำและดูแล Requirement Traceability Matrix (RTM) เชื่อมโยง FR 40 ข้อ และ NFR 24 ข้อ จัดทำ Test Scenarios, Test Cases และ Master Test Plan ดำเนินการ Functional Testing, Frontend Testing, Backend API Testing, Integration Testing และ System Testing รวมถึง Defect Tracking, Test Reports, Technical Documentation และ Acceptance Criteria Review
ผลงานที่ต้องส่งมอบ: Business Requirements Documentation, Requirement Review Report, Requirement Traceability Matrix (RTM), Use Case Specifications, Master Test Plan, Test Cases Catalog, Test Execution Report, Defect Tracking Report, Acceptance Test Report, Technical Documentation
```

##### **1.9.3 ตารางการกำหนดผู้รับผิดชอบระบบย่อย**
เพื่อป้องกันความซ้ำซ้อนและกำหนดความรับผิดชอบที่ตรวจสอบได้ การพัฒนาระบบย่อยและงานสำคัญของ InterviewX จึงถูกจัดสรรโดยระบุผู้รับผิดชอบหลัก (Primary Owner) และผู้ร่วมสนับสนุน (Supporting) ดังแสดงในตารางที่ 1.2

**ตารางที่ 1.2 ตารางกำหนดความเป็นเจ้าของระบบย่อยและงาน (Ownership Matrix)**

| ระบบ / งาน | Primary Owner | Supporting | รอบการปล่อย | ความรับผิดชอบในการตรวจรับ |
|---|---|---|:---:|---|
| System Architecture | Tech Lead (นายนรงศักดิ์) | Fullstack Developers | R1–R3 | ความสอดคล้องตาม Architectural Invariants |
| Backend Architecture & Standards | Tech Lead (นายนรงศักดิ์) | Fullstack Developers | R1–R3 | โครงสร้าง Modular Monolith และ OpenAPI 3.1 |
| Backend Code Review & Technical Governance | Tech Lead (นายนรงศักดิ์) | — | R1–R3 | ตรวจ Backend PR, Security และ DB Integration ก่อน Merge |
| Authentication & Identity Backend | กิติกร | Tech Lead | R1 | การออก Token, Refresh Flow, Password Hashing |
| User Profile & Account Backend | กิติกร | Tech Lead | R1 | CRUD Profile, Avatar Upload, User Settings |
| Privacy, Consent & PDPA Backend | กิติกร | Tech Lead, ณัฐพล | R1–R2 | Consent Events, Data Export, Right to Delete |
| Interview Session Backend | จิรเมธ | Tech Lead | R1 | Session Lifecycle, State Management, Timer |
| Interview Question & Answer Backend | จิรเมธ | Tech Lead | R1 | Question Delivery, Answer Submission, Idempotency |
| BullMQ & Evaluation Queue | จิรเมธ | Tech Lead | R1 | Transactional Outbox และการจัดการคิวงาน |
| NestJS Worker Integration | จิรเมธ | Tech Lead | R1 | การส่งต่อและรับผลระหว่าง Worker กับ AI Service |
| AI Service & FastAPI | Tech Lead (นายนรงศักดิ์) | — | R1–R3 | OpenAPI Contract และ Pydantic Validation |
| AI Evaluation & Rubric Engine | Tech Lead (นายนรงศักดิ์) | — | R1–R2 | ความแม่นยำคะแนนรูบริก, Evidence Citation และ STAR |
| DevOps, Docker & CI/CD | Tech Lead (นายนรงศักดิ์) | Fullstack Developers | R1–R3 | Docker Build, CI Pipeline และ Deploy Scripts |
| UX/UI Design | สมหมาย | — | R1–R3 | User Flows, Wireframes และ Figma Prototypes |
| Design System | สมหมาย | — | R1–R3 | Design Tokens, Reusable Components, Style Guide |
| Frontend Architecture | สมหมาย | Tech Lead ให้คำปรึกษา | R1–R3 | โครงสร้าง Frontend และ State/Component Architecture |
| Frontend Web Development (Next.js) | สมหมาย | กิติกร / จิรเมธ | R1–R3 | Responsive Layout (360px–4K), WCAG 2.2 AA |
| Native Mobile Development (React Native/Expo) | สมหมาย | กิติกร / จิรเมธ | R2 | iOS Keychain / Android Keystore, Mobile Navigation |
| Frontend API Integration | สมหมาย | Fullstack Developers | R1–R3 | การเชื่อมต่อ UI กับ REST API และ Error Handling |
| QA & Testing | ณัฐพล | สมาชิกทุกคน | R1–R3 | Test Coverage ≥ 80%, Functional/API/Integration Test |
| Requirements & Documentation | ณัฐพล | สมาชิกทุกคน | R1–R3 | RTM (FR 40 / NFR 24), เอกสารโครงการและรายงานวิจัย |

##### **1.9.4 การแบ่งความรับผิดชอบตามระยะการส่งมอบ**
*(ปรับข้อความในรอบ R2 และ R3 ให้สอดคล้องกับหลักการที่ Tech Lead ดูแล AI Service โดยตรง และ Fullstack Developers ดูแลฝั่ง NestJS Backend + การเชื่อมต่อกับ AI Service)*

```text
• รอบ R1 — ระบบแกนหลัก (Core MVP): เน้นการพัฒนา Responsive Web Application, ระบบยืนยันตัวตน, ระบบจำลองสัมภาษณ์แบบพิมพ์ข้อความ, ระบบประเมินผล AI อิงรูบริก, ตัวอย่างคำตอบและคำแนะนำ, ประวัติการฝึก, และการปฏิบัติตามมาตรฐาน PDPA โดยมี นายนรงศักดิ์ ควบคุมสถาปัตยกรรม Backend Governance และพัฒนา AI Service, นายสมหมาย เป็นผู้นำการออกแบบ UX/UI และพัฒนา Frontend Web หลัก, นายกิติกร พัฒนาระบบ Auth, User Profile และฐานข้อมูล, นายจิรเมธ พัฒนาระบบ Interview Session Flow, BullMQ Queue และ Worker Integration (พร้อมสนับสนุน Frontend ร่วมกับสมหมายตาม Sprint Backlog), และ นายณัฐพล ดูแลข้อกำหนด RTM และการทดสอบระบบ

• รอบ R2 — AI ขั้นสูงและแอปมือถือ (Enhanced AI & Mobile): ขยายการทำงานสู่ Native Mobile Application (iOS/Android) ด้วย React Native / Expo, ระบบสัมภาษณ์ด้วยเสียง (STT), การวิเคราะห์ตัวบ่งชี้การพูด (Speech Indicators), ระบบคำถามเชิงปรับตัว (Adaptive Questions), และการซิงก์ข้อมูลข้ามแพลตฟอร์ม 100% โดยมี นายสมหมาย เป็นผู้นำพัฒนา Frontend/Native Mobile หลัก, นายนรงศักดิ์ ออกแบบและพัฒนา Speech/STT Pipeline บน FastAPI AI Service, นายกิติกร และ นายจิรเมธ พัฒนาระบบจัดเก็บไฟล์เสียง Pre-signed URL และการเชื่อมต่อ Asynchronous Job บน NestJS Backend (รวมถึงสนับสนุนงาน Frontend ตามที่ได้รับมอบหมาย), และ นายณัฐพล ทดสอบ Mobile SLA และความสอดคล้องข้ามแพลตฟอร์ม

• รอบ R3 — เชิงพาณิชย์และงานวิจัย (Commercial & Research): เพิ่มระบบสมัครสมาชิก (Subscription Management), ระบบชำระเงิน Web Checkout (Payment Gateway), การจัดการใบเสร็จ, การกำกับดูแลข้อมูลวิจัย (Research Data Governance), และไปป์ไลน์ส่งออกข้อมูลวิจัยแบบนิรนาม (Anonymized Research Pipeline) โดยมี นายนรงศักดิ์ ควบคุมสถาปัตยกรรมการแยกฐานข้อมูล Billing/Research และไปป์ไลน์ข้อมูลวิจัย, นายกิติกร พัฒนาระบบ Billing, Package & Quota Ledger, นายจิรเมธ พัฒนาระบบจัดการธุรกรรม Webhook, ใบเสร็จ และการตรวจสอบสถานะ, นายสมหมาย ออกแบบและพัฒนา UI เชิงพาณิชย์และหน้าต่างจัดการแพ็กเกจ, และ นายณัฐพล ตรวจสอบความปลอดภัยและความเป็นส่วนตัวของข้อมูลวิจัย (Cell Size >= 10)
```

##### **1.9.5 เกณฑ์การประเมินและการตรวจสอบผลงาน**
```text
เพื่อรักษาคุณภาพของผลงานทุกชิ้น ทีมพัฒนาได้กำหนดกระบวนการตรวจสอบและตรวจรับงานร่วมกัน 4 ระดับ ได้แก่: (1) การตรวจทานโค้ด (Peer Code Review & PR Gate) โดยกำหนดให้การเปลี่ยนแปลงฝั่ง Backend, API, Database และ Integration ต้องผ่านการตรวจสอบจาก Tech Lead (นายนรงศักดิ์) ส่วนการเปลี่ยนแปลงฝั่ง Frontend UI และ Design System ต้องผ่านการตรวจสอบจาก Frontend Lead (นายสมหมาย) ก่อนรวมโค้ด (2) การตรวจสอบความสอดคล้องทางสถาปัตยกรรม (Architecture Compliance Review) โดย นายนรงศักดิ์ เพื่อป้องกันการละเมิดกฎเหล็กของระบบ เช่น Single Ownership ของ Core DB และห้าม AI Service เชื่อมต่อ Core PostgreSQL โดยตรง (3) การตรวจสอบการประกันคุณภาพ (QA & Traceability Review) โดย นายณัฐพล เพื่อยืนยันว่าโค้ดทุกส่วนมี Unit/Integration Test Coverage ≥ 80% และผูกกับข้อกำหนดใน RTM อย่างครบถ้วน และ (4) การตรวจรับมอบงานรอบสปรินต์ (Sprint Acceptance) ซึ่งทุกฟังก์ชันต้องผ่านเกณฑ์ Definition of Done (DoD) โดยไม่มีข้อบกพร่องระดับร้ายแรงหลงเหลืออยู่
```

---

### จุดปรับปรุงที่ 4: สารบัญ (TOC) และระดับหัวข้อ `1.9`

#### 4.1 ปัญหาที่พบ
- ในสารบัญหน้าที่ 1–2 หัวข้อ `1.9 โครงสร้างและความรับผิดชอบของทีมพัฒนา` ถูกแสดงด้วยสไตล์ `TOC2` (เยื้องย่อยเข้าไปอยู่ใต้ `1.8 แผนการดำเนินงาน`) แทนที่จะเป็น `TOC1` เสมอกับ `1.1`–`1.8`
- นอกจากนี้ ในตัวหัวข้อ `1.9` มีการใส่เลข `1.9` แบบพิมพ์เองซ้อนกับคุณสมบัติ List Numbering (`numPr`)

#### 4.2 วิธีแก้ไขใน Microsoft Word
1. คลิกที่หัวข้อ `1.9 โครงสร้างและความรับผิดชอบของทีมพัฒนา` (หน้า 19) → ตรวจสอบให้ใช้ Style เดียวกับ `1.3`–`1.8` (Heading ระดับเดียวกับ `1.x` โดยไม่ใช้เยื้องระดับ `1.x.x`)
2. คลิกขวาที่ตาราง **สารบัญ** → เลือก **Update Field** → **Update entire table** (และตรวจสอบว่า `1.9` จัดแนวตรงกับ `1.1`–`1.8`)
3. คลิกขวาที่ **สารบัญตาราง** → เลือก **Update Field** เพื่อให้ชื่อและเลขหน้าของ `ตารางที่ 1.1` และ `ตารางที่ 1.2` อัปเดตตรงตามเนื้อหาใหม่

---

### จุดปรับปรุงที่ 5: จุดพิมพ์ตกหล่น เว้นวรรค และความสอดคล้องเล็กน้อย

| ลำดับ | ตำแหน่งในเอกสาร | ข้อความเดิมที่พบ | ข้อความที่ควรแก้ไข |
|:---:|---|---|---|
| 1 | หัวข้อ `1.4.2` | `ตามประเภทและบริบทของผู้ใช้งานวิเคราะห์เนื้อหาคำตอบ` | `ตามประเภทและบริบทของผู้ใช้งาน วิเคราะห์เนื้อหาคำตอบ` *(เติมเว้นวรรค)* |
| 2 | หัวข้อ `1.5.2.8` (รายการ R1) | `การจัดการบัญชีผู้ใช้การฝึกสัมภาษณ์แบบข้อเขียน` | `การจัดการบัญชีผู้ใช้ การฝึกสัมภาษณ์แบบข้อเขียน` *(เติมเว้นวรรค)* |
| 3 | หัวข้อ `1.6` | `1.6  ประโยชน์ที่คาดว่าจะได้รับ` | `1.6 ประโยชน์ที่คาดว่าจะได้รับ` *(ลดเว้นวรรค 2 เคาะเป็น 1 เคาะ)* |
| 4 | หัวข้อ `1.7` | `1.7  วิธีการดำเนินการ` | `1.7 วิธีการดำเนินการ` *(ลดเว้นวรรค 2 เคาะเป็น 1 เคาะ)* |
| 5 | หัวข้อ `1.9.2.3` | `การจัดการ Error RFC 7807ออกแบบและผสานฐานข้อมูล` | แก้ไขแล้วในข้อความใหม่ข้อ 3.2 ด้านบน |
| 6 | ตารางที่ 1.2 (`1.9.3`) | `กิติกร, / จิรเมธ` | แก้ไขแล้วในตารางใหม่ข้อ 3.2 ด้านบน |
| 7 | `1.9.2.1` vs ตารางที่ 1.2 | `OpenAPI 3.1` vs `OpenAPI 3.0 Compliance` | ปรับให้ใช้ `OpenAPI 3.1` ตรงกันทั้งสองที่ *(ดำเนินการแล้วในตารางใหม่ข้อ 3.2)* |

---

## 3. รายการตรวจสอบหลังแก้ไขเสร็จ (Post-Update Checklist)

1. ใช้คำสั่ง Find (`Ctrl + F`) ค้นหาคำว่า **`นรงศ์ศักดิ์`** ในไฟล์ Word → ต้องพบ **0 รายการ** (ทุกจุดต้องเป็น **`นรงศักดิ์`**)
2. ตรวจสอบหน้า **ปกนอก** และ **ปกใน** → ลำดับรายชื่อทั้ง 5 คนต้องตรงกันและช่องไฟสม่ำเสมอ
3. ตรวจสอบข้อ **`1.4.5`** → ต้องระบุเกณฑ์รูบริกครบ **4 ด้าน** (ความตรงประเด็น, โครงสร้างคำตอบ, การใช้เหตุผลเชิงตรรกะ, ความครบถ้วน)
4. ตรวจสอบ **หมวด 1.9** → ตรงกับเกณฑ์ **v1.2 Team-Revised** ครบถ้วน (สมหมาย = Frontend Primary Owner, นรงศักดิ์ = Tech Lead + Backend Governance + AI Service Owner, กิติกร/จิรเมธ = Backend Primary & Frontend Supporting, ณัฐพล = BA/QA/Tester/Documentation)
5. สั่ง **Update Field** ทั้ง **สารบัญ**, **สารบัญภาพ** และ **สารบัญตาราง** แล้วตรวจสอบเลขหน้าทั้งหมด
6. บันทึกไฟล์ `.docx` และส่งออกไฟล์ [InterviewX_Research_Proposal_v1.3_FINAL.pdf](file:///D:/workspaces/interviewx-datahub/docs-interviex/02_Research_Analysis/proposal/InterviewX_Research_Proposal_v1.3_FINAL.pdf) ใหม่ (และคัดลอกไฟล์ `.docx`/`.pdf` ไปอัปเดตในโฟลเดอร์ `InterviewX_GoogleDrive_Backup/02_Research_and_Survey_งานวิจัยและผลสำรวจ/` ให้ตรงกัน)
