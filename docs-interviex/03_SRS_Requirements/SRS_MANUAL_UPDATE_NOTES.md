# บันทึกข้อเสนอแนะการปรับปรุงเอกสาร SRS ด้วยตนเอง
## InterviewX — SRS Manual Update Notes

> **สถานะเอกสาร:** ข้อเสนอแนะการปรับปรุงเอกสารสำหรับผู้จัดทำ (SRS Author Guidance Note)  
> **วันที่มีผลบังคับใช้:** 21 พฤศจิกายน 2026 | **เวอร์ชัน:** 1.0  
> **เป้าหมาย:** สำหรับผู้ถือครองและผู้จัดทำเอกสาร SRS (โดยเฉพาะไฟล์ `InterviewX_SRS_v1.1_FINAL_TH_PROCESS.docx` และ `InterviewX_SRS_Report_Revised_TH.md`)  
> **คำเตือนความปลอดภัย:** เอกสารต้นฉบับ `InterviewX_SRS_v1.1_FINAL_TH_PROCESS.docx` ถูกกำหนดให้เป็น **EXCLUDED FILE — DO NOT MODIFY** ในกระบวนการอัตโนมัติ ห้ามเขียนทับหรือแก้ไขไฟล์เดิมโดยตรง ให้ผู้จัดทำดำเนินการคัดลอกข้อความในบันทึกนี้ไปปรับปรุงด้วยตนเอง

---

## 1. บทนำและเหตุผลในการจัดทำบันทึก (Executive Summary)

ตามที่ทีมพัฒนาโครงการ InterviewX ได้กำหนดและอนุมัติโครงสร้างทีมพัฒนา (Development Team Roles & Responsibilities) และการแบ่งผู้รับผิดชอบระบบย่อย (Module Ownership) อย่างเป็นทางการ เพื่อให้เกิดความสอดคล้อง (Consistency) ข้ามทุกเอกสารในโครงการ จึงจำเป็นต้องมีการปรับปรุงข้อมูลในเอกสารข้อกำหนดระบบซอฟต์แวร์ (SRS)

บันทึกข้อเสนอนี้จัดทำขึ้นเพื่ออำนวยความสะดวกให้ผู้จัดทำเอกสาร SRS สามารถนำข้อความฉบับสมบูรณ์ไปคัดลอกและวาง (Copy-Paste Ready) ในตำแหน่งที่ถูกต้อง โดยคงสถานะการอนุมัติ (Active Primary Baseline v1.1 FINAL) และไม่กระทบต่อข้อกำหนดเชิงหน้าที่ (FR), ข้อกำหนดเชิงคุณภาพ (NFR), หรือแผนภาพสถาปัตยกรรมเดิม

---

## 2. รายการจุดที่ต้องปรับปรุงในเอกสาร SRS (SRS Update Items)

---

### จุดปรับปรุงที่ 1: การแก้ไขชื่อสะกดผิด และการระบุบทบาทของสมาชิกทีมในหน้าปกและส่วนข้อมูลกำกับ

#### 1.1 ตำแหน่งที่พบในเอกสาร
- **ไฟล์เป้าหมาย:** `InterviewX_SRS_v1.1_FINAL_TH_PROCESS.docx` (ย่อหน้าที่ 8 ถึง 13)
- **ไฟล์เป้าหมาย:** `InterviewX_SRS_Report_Revised_TH.md` (ตารางข้อมูลกำกับโครงงานและคณะผู้จัดทำ บรรทัดที่ 13)
- **ไฟล์เป้าหมาย:** `InterviewX_SRS_v1.1_FINAL_TH.docx` และ `InterviewX_SRS_Report_v1.1_TH.docx`

#### 1.2 ข้อมูลเดิมที่พบ (Previous Information)
```text
จัดทำโดย / คณะผู้จัดทำโครงงาน:
1. นายกิติกร เทศธรรม (รหัสนักศึกษา 674259003)
2. นายจิรเมธ วงษ์กัณหา (รหัสนักศึกษา 674259004)
3. นายณัฐพล กลิ่นจุ่น (รหัสนักศึกษา 674259006)
4. นายนรงศ์ศักดิ์ ภูมิประเสริฐ (รหัสนักศึกษา 674259009)
5. นายสมหมาย สุภาวงค์ (รหัสนักศึกษา 674259024)
```

#### 1.3 ปัญหาที่พบและเหตุผลในการปรับปรุง (Reason for Change)
1. **การสะกดชื่อผิด:** ชื่อของ Tech Lead ในเอกสารเดิมสะกดว่า *"นายนรงศ์ศักดิ์ ภูมิประเสริฐ"* (มีทัณฑฆาตบน ง) ซึ่งไม่ถูกต้องตามชื่อจริงที่ได้รับการอนุมัติ คือ **"นายนรงศักดิ์ ภูมิประเสริฐ"** (ไม่มีทัณฑฆาต)
2. **ขาดการระบุตำแหน่งทางวิศวกรรม:** รายชื่อเดิมมีเพียงชื่อและรหัสนักศึกษา โดยไม่มีการระบุตำแหน่ง บทบาท และขอบเขตความรับผิดชอบ ทำให้ไม่สามารถตรวจสอบความรับผิดชอบรายบุคคลได้

#### 1.4 ข้อมูลใหม่ที่ควรใช้ (Updated Information — Ready-to-Copy)

**ข้อความสำหรับวางในหน้าปกเอกสาร Word (`InterviewX_SRS_v1.1_FINAL_TH_PROCESS.docx`):**
```text
จัดทำโดย คณะผู้จัดทำและทีมพัฒนาโครงงาน:
1. นายนรงศักดิ์ ภูมิประเสริฐ (รหัสนักศึกษา 674259009)
   Tech Lead, Architecture, AI Layer, DevOps, Integration
2. นายสมหมาย สุภาวงค์ (รหัสนักศึกษา 674259024)
   UX/UI Lead, Design System, Frontend/Mobile
3. นายกิติกร เทศธรรม (รหัสนักศึกษา 674259003)
   Fullstack Developer, NestJS Core Backend, API
4. นายจิรเมธ วงษ์กัณหา (รหัสนักศึกษา 674259004)
   Fullstack Developer, NestJS Core Backend, Integration
5. นายณัฐพล กลิ่นจุ่น (รหัสนักศึกษา 674259006)
   Business Analyst (BA), QA, Tester, Documentation
```

**ข้อความสำหรับวางในตารางข้อมูลกำกับ Markdown (`InterviewX_SRS_Report_Revised_TH.md`):**
```markdown
| **คณะผู้จัดทำและบทบาททางวิศวกรรม** | 1. **นายนรงศักดิ์ ภูมิประเสริฐ** (674259009) — Tech Lead, Architecture, AI Layer, DevOps, Integration<br>2. **นายสมหมาย สุภาวงค์** (674259024) — UX/UI Lead, Design System, Frontend/Mobile<br>3. **นายกิติกร เทศธรรม** (674259003) — Fullstack, NestJS Core Backend, API<br>4. **นายจิรเมธ วงษ์กัณหา** (674259004) — Fullstack, NestJS Core Backend, Integration<br>5. **นายณัฐพล กลิ่นจุ่น** (674259006) — BA, QA, Tester, Documentation |
```

---

### จุดปรับปรุงที่ 2: การเพิ่มหัวข้อย่อย "โครงสร้างทีมพัฒนาและการกำหนดผู้รับผิดชอบระบบย่อย" ในหมวดที่ 1

#### 2.1 ตำแหน่งที่ควรเพิ่มในเอกสาร
- เพิ่มใน **หมวดที่ 1: บทนำและข้อมูลเชิงประจักษ์** เป็น **หัวข้อย่อยที่ 1.8 โครงสร้างทีมพัฒนา บทบาทหน้าที่ และการกำหนดผู้รับผิดชอบระบบย่อย** (ก่อนหรือหลังหัวข้อ 1.7 นิยามและคำย่อ) หรือจัดไว้ใน **ภาคผนวก (Appendix)** ของเอกสาร SRS

#### 2.2 ข้อมูลเดิมที่พบ (Previous Information)
ในเอกสาร SRS v1.1 ปัจจุบัน ยังไม่มีหมวดหรือตารางที่แจกแจงโครงสร้างทีมพัฒนาและผู้รับผิดชอบระบบย่อย (Module Ownership Matrix) มีเพียงการอ้างอิงบทบาทอย่างกว้างๆ เช่น "Tech Lead" ในตารางการตัดสินใจ D-M01

#### 2.3 เหตุผลในการปรับปรุง (Reason for Change)
เพื่อให้เอกสาร SRS มีความสมบูรณ์ในระดับวิศวกรรมซอฟต์แวร์มาตรฐาน รองรับการตรวจประเมิน CMMI/ISO โดยระบุชัดเจนว่าโมดูลใดมีผู้ใดเป็นเจ้าของหลัก (Primary Owner) และใครเป็นผู้สนับสนุน (Supporting Members)

#### 2.4 ข้อความฉบับสมบูรณ์ที่สามารถคัดลอกไปวางได้ (Ready-to-Copy Content)

```markdown
### 1.8 โครงสร้างทีมพัฒนา บทบาทหน้าที่ และการกำหนดผู้รับผิดชอบระบบย่อย (Development Team Roles & Module Ownership)

เพื่อให้การวิเคราะห์ ออกแบบ พัฒนา และตรวจรับระบบ InterviewX เป็นไปตามมาตรฐานวิศวกรรมซอฟต์แวร์ โครงการได้กำหนดบทบาทหน้าที่ของสมาชิกทีมพัฒนา 5 คน และกำหนดความเป็นเจ้าของระบบย่อย (Module Ownership) ดังนี้:

#### 1.8.1 ตำแหน่งและขอบเขตความรับผิดชอบหลัก
1. **นายนรงศักดิ์ ภูมิประเสริฐ — Tech Lead, Architecture, AI Layer, DevOps, Integration:** รับผิดชอบสถาปัตยกรรมระบบโดยรวม, บริการ AI (FastAPI), เกณฑ์รูบริก, สถาปัตยกรรมคิวและการอนุมาน LLM, โครงสร้างพื้นฐาน DevOps, Docker, CI/CD, สัญญา OpenAPI และการผสานรวมระบบ
2. **นายสมหมาย สุภาวงค์ — UX/UI Lead, Design System, Frontend/Mobile:** รับผิดชอบการวิจัย UX, InterviewX Design System, ส่วนติดต่อผู้ใช้ Responsive Web (Next.js), Native Mobile Application (React Native/Expo ในรอบ R2), และความเข้ากันได้ตามมาตรฐานการเข้าถึง WCAG 2.2 AA
3. **นายกิติกร เทศธรรม — Fullstack Developer (NestJS Core Backend, API):** รับผิดชอบบริการหลังบ้านหลัก NestJS (Identity, Auth, User Profile Management), ระบบความปลอดภัย Backend Guards, REST API Endpoints, DTO Validation, และการออกแบบฐานข้อมูล PostgreSQL ผ่าน Prisma ORM
4. **นายจิรเมธ วงษ์กัณหา — Fullstack Developer (NestJS Core Backend, Integration):** รับผิดชอบระบบจำลองการสัมภาษณ์ (Interview Session Flow), คลังคำถาม, การส่งคำตอบพร้อม Idempotency Key, การผสาน BullMQ Queue และ Transactional Outbox, และการทดสอบเชื่อมต่อระบบหลังบ้าน
5. **นายณัฐพล กลิ่นจุ่น — Business Analyst (BA), QA, Tester, Documentation:** รับผิดชอบการวิเคราะห์ความต้องการ (FR 40 ข้อ, NFR 24 ข้อ), จัดทำเมทริกซ์ตรวจสอบย้อนกลับ (RTM), แผนการทดสอบ (Master Test Plan), กรณีทดสอบ (Test Cases), การติดตามข้อผิดพลาด (Defect Tracking), และการจัดทำเอกสารทางเทคนิค

#### 1.8.2 ตารางการกำหนดผู้รับผิดชอบระบบย่อย (Module Ownership Matrix)

| ระบบย่อย / โมดูล | ผู้รับผิดชอบหลัก (Primary Owner) | ผู้ร่วมสนับสนุน (Supporting Members) | ขอบเขตการปล่อย (Release Scope) | ความรับผิดชอบในการตรวจรับ |
|---|---|---|:---:|---|
| System Architecture & Technical Standards | นายนรงศักดิ์ ภูมิประเสริฐ | นายกิติกร, นายจิรเมธ | R1–R3 | ตรวจสอบความสอดคล้องตาม Architectural Invariants |
| AI Architecture & AI Service (FastAPI) | นายนรงศักดิ์ ภูมิประเสริฐ | นายจิรเมธ วงษ์กัณหา | R1–R3 | OpenAPI Contract และ Pydantic Schema Validation |
| DevOps, CI/CD & Infrastructure | นายนรงศักดิ์ ภูมิประเสริฐ | นายกิติกร, นายจิรเมธ | R1–R3 | Docker Build, CI Pipeline และ Deployment Scripts |
| Authentication & Identity Management | นายกิติกร เทศธรรม | นายนรงศักดิ์ ภูมิประเสริฐ | R1 | การออก Token, Refresh Flow, Password Hashing |
| User Profile & Account Management | นายกิติกร เทศธรรม | นายสมหมาย สุภาวงค์ | R1 | CRUD Profile, Avatar Upload, User Preferences |
| NestJS Core Backend Modular Monolith | นายกิติกร เทศธรรม, นายจิรเมธ วงษ์กัณหา | นายนรงศักดิ์ ภูมิประเสริฐ | R1–R3 | DDD Modular Monolith, Code Review, Module Isolation |
| REST API Development & Public Contracts | นายกิติกร เทศธรรม | นายจิรเมธ วงษ์กัณหา | R1–R3 | OpenAPI 3.0 Compliance และ Response Formats |
| Interview Session & Question Bank Module | นายจิรเมธ วงษ์กัณหา | นายกิติกร เทศธรรม | R1 | Session Lifecycle, Question Delivery, Timer |
| Evaluation Job Integration (BullMQ/Outbox) | นายจิรเมธ วงษ์กัณหา | นายนรงศักดิ์ ภูมิประเสริฐ | R1 | Transactional Outbox และการดึงงานของ Worker |
| AI Evaluation & Rubric Engine | นายนรงศักดิ์ ภูมิประเสริฐ | นายจิรเมธ วงษ์กัณหา | R1–R2 | ความแม่นยำของคะแนนเกณฑ์รูบริกและ STAR Feedback |
| UX/UI Design & InterviewX Design System | นายสมหมาย สุภาวงค์ | นายณัฐพล กลิ่นจุ่น | R1–R3 | Figma Prototypes, Design Tokens, Style Guide |
| Responsive Web Application (Next.js) | นายสมหมาย สุภาวงค์ | นายกิติกร, นายจิรเมธ | R1–R3 | Responsive Layout (360px–4K), WCAG 2.2 AA |
| Native Mobile Application (React Native/Expo) | นายสมหมาย สุภาวงค์ | นายกิติกร, นายจิรเมธ | R2 | iOS Keychain / Android Keystore, Native Navigation |
| Database Design & Prisma Integration | นายกิติกร เทศธรรม, นายจิรเมธ วงษ์กัณหา | นายนรงศักดิ์ ภูมิประเสริฐ | R1–R3 | ERD, PostgreSQL Schemas, Prisma Migrations |
| Privacy, Consent & PDPA Lifecycle | นายกิติกร เทศธรรม | นายนรงศักดิ์, นายณัฐพล | R1–R2 | Consent Logging, Data Export, Right to Delete |
| Requirement Analysis & RTM Management | นายณัฐพล กลิ่นจุ่น | สมาชิกทุกคน | R1–R3 | ความครบถ้วนของ FR (40 ข้อ) และ NFR (24 ข้อ) ใน RTM |
| QA, Functional Testing & Bug Tracking | นายณัฐพล กลิ่นจุ่น | สมาชิกทุกคน | R1–R3 | ผ่านเกณฑ์ Test Coverage ≥ 80% และ Defect Tracking |
| System Integration Testing (SIT) | นายนรงศักดิ์ ภูมิประเสริฐ | ณัฐพล, กิติกร, จิรเมธ | R1–R3 | End-to-End Flow จาก Web -> API -> Queue -> AI |
| Technical Documentation & Project Reports | นายณัฐพล กลิ่นจุ่น | สมาชิกทุกคน | R1–R3 | ความสมบูรณ์ของเอกสารโครงการและรายงานวิจัย |
| Release Review & Final Acceptance | นายณัฐพล กลิ่นจุ่น | นายนรงศักดิ์ และทุกคน | R1–R3 | ความพร้อมตามเกณฑ์ Definition of Done (DoD) |
```

---

### จุดปรับปรุงที่ 3: ตารางการตัดสินใจ D-M01 ในหมวดทะเบียนการตัดสินใจ (Decision Register)

#### 3.1 ตำแหน่งที่พบ
- บรรทัดที่ 641 ใน `InterviewX_SRS_v1.1_FINAL_TH.md` หรือตารางการตัดสินใจสถาปัตยกรรม

#### 3.2 ข้อมูลเดิมที่พบ
```text
ผู้มีอำนาจตัดสินใจ: Product Owner / Tech Lead
```

#### 3.3 ข้อมูลใหม่ที่ควรใช้
```text
ผู้มีอำนาจตัดสินใจ: Product Owner / นายนรงศักดิ์ ภูมิประเสริฐ (Tech Lead) ร่วมกับ นายสมหมาย สุภาวงค์ (UX/UI Lead)
```

#### 3.4 เหตุผลในการปรับปรุง
ระบุชื่อผู้รับผิดชอบในตำแหน่ง Tech Lead และ UX/UI Lead ให้ชัดเจนเพื่อความรับผิดชอบในการตรวจรับมอบงาน

---

## 3. สรุปแนวทางปฏิบัติสำหรับผู้จัดทำเอกสาร SRS

1. **ห้ามแก้ไขข้อกำหนดเชิงหน้าที่ (FR 40 ข้อ) และข้อกำหนดเชิงคุณภาพ (NFR 24 ข้อ)** เพราะเป็น Approved Active Baseline
2. **รักษา Document ID และ Version:** คงชื่อและรหัสเอกสาร `v1.1 FINAL` เดิมไว้
3. **การคัดลอกข้อความ:** ผู้จัดทำสามารถนำเนื้อหาในข้อ 2.4 ไปแทรกในไฟล์ `InterviewX_SRS_v1.1_FINAL_TH_PROCESS.docx` โดยใช้โปรแกรม Microsoft Word และจัดรูปแบบฟอนต์ให้ตรงกับเอกสารเดิม (`TH Sarabun New` ขนาด 16 pt)
4. เมื่อดำเนินการปรับปรุงใน Word เสร็จสิ้น ให้บันทึกการปรับปรุงลงใน Change Log ท้ายเอกสาร SRS ตามรอบการตรวจทาน

---
*จัดทำโดย: Senior Business Analyst, Software Architect และ Project Manager โครงการ InterviewX*
