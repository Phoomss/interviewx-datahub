# InterviewX — Master Knowledge Pack for ChatGPT / AI Assistant (v1.1 Updated)

> **เอกสารรวมชุดข้อมูลโครงการฉบับสมบูรณ์ (Single Source of Truth Knowledge Base)**  
> **วันที่มีผลบังคับใช้:** 21 พฤศจิกายน 2026 | **เวอร์ชัน:** 1.1 (Updated with Development Team Roles & Ownership)  
> **วัตถุประสงค์:** ใช้เป็น Context / Knowledge Base สำหรับ AI Assistant (ChatGPT / Claude / Antigravity) ในการตอบคำถาม ออกแบบสถาปัตยกรรม เขียนโค้ด กำหนดข้อกำหนด และแจกแจงงานตามบทบาทของทีมพัฒนา

---

## 1. ข้อมูลภาพรวมโครงการ (Project Overview & Vision)

- **ชื่อโครงการ:** InterviewX (ระบบจำลองการสัมภาษณ์งานด้วย AI)
- **ปัญหาที่พบ (Problem Statement):** ผู้หางานและนักศึกษาขาดความพร้อมในการสัมภาษณ์งาน ประหม่า ขาดทักษะการเรียบเรียงความคิด และไม่มีโค้ชหรือผู้เชี่ยวชาญช่วยจำลองสถานการณ์จริง
- **กลุ่มเป้าหมายหลัก (Target Audience):** นักศึกษา/คนรุ่นใหม่ (66.7%), บัณฑิตจบใหม่ (18.6%), ผู้ที่กำลังเปลี่ยนงาน (3.9%) และผู้สมัครทุน/ศึกษาต่อ
- **จุดเด่นระบบ (Core Value Proposition):**
  - จำลองคำถามเสมือนจริงตามหมวดหมู่ (งาน, ศึกษาต่อ, ทุน, ภาษาอังกฤษ, วิชาชีพเฉพาะทาง)
  - มีโหมดจับเวลาเสมือนจริง (Pressure Practice Mode)
  - ประเมินผลเชิงลึกตาม Rubric Matrix พร้อมข้อเสนอแนะที่นำไปปรับปรุงได้จริง (Actionable Feedback & Sample STAR Answers)
  - รักษาความเป็นส่วนตัวสูงสุด (Privacy-First / PDPA Compliance) มี Consent ชัดเจน และสิทธิ์ลบข้อมูล

---

## 2. แผนการปล่อยระบบ (Release Scope & Phasing)

| Release | ชื่อเฟส | ขอบเขตการทำงาน (Scope) | สถานะทางสถาปัตยกรรม |
|---|---|---|---|
| **R1 (MVP)** | Core Text MVP | - ระบบบัญชีผู้ใช้, ยืนยันตัวตน (Email/Password, Social Auth)<br>- จำลองการสัมภาษณ์แบบพิมพ์ข้อความ (Text Interview)<br>- ระบบประเมินผล AI อิงเกณฑ์ Rubric (Accuracy, Structure, Logic)<br>- แนะนำตัวอย่างคำตอบแบบ STAR Method<br>- ระบบความเป็นส่วนตัว (PDPA / Consent / Data Export-Deletion)<br>- ระบบ Admin จัดการคลังคำถามและ Rubric | **Core Services Only**<br>(NestJS API + Worker + FastAPI AI Service + Postgres Core) |
| **R2** | Enhanced AI & Voice | - ระบบสัมภาษณ์ด้วยเสียง (STT / Voice-to-Text)<br>- วิเคราะห์ตัวบ่งชี้การพูด (Speech indicators: ความเร็ว, คำฟุ่มเฟือย, Tone)<br>- ตัวเลือกระยะเวลาจัดเก็บไฟล์เสียง (Voice retention choice: 0 วัน, 30 วัน, ลบทันที)<br>- Dashboard ติดตามพัฒนาการของผู้ใช้ (Progress Tracking)<br>- Native Mobile Application (iOS & Android via React Native/Expo) | ปลดล็อกเมื่อผ่านการอนุมัติความปลอดภัยและงบประมาณ |
| **R3** | Commercial & Research | - ระบบชำระเงินและจัดการสิทธิ์ (Billing Service + Payment Gateway)<br>- จัดการโควตาและแพ็กเกจ (Basic, Pro, Enterprise)<br>- ระบบส่งออกข้อมูลวิจัย (Research Service) ที่มีการทำ Anonymization / K-Anonymity / Data Suppression | แยก Service และแยกฐานข้อมูลเด็ดขาด (Independent DBs & Credentials) |

---

## 3. สรุปผลสำรวจความต้องการของผู้ใช้ (Survey Key Findings - n=102)

1. **สถิติผู้ตอบ:** นักเรียน/นักศึกษา 66.67%, บัณฑิตจบใหม่ 18.63%, พนักงานประจำ 7.84%
2. **ประเภทการสัมภาษณ์ที่ต้องการสูงสุด:**
   - สัมภาษณ์งาน: 64.71%
   - สัมภาษณ์เข้าศึกษาต่อ: 37.25%
   - สัมภาษณ์ภาษาอังกฤษ / ทุนการศึกษา: 34.31%
3. **ปัญหาใหญ่สุดในการสัมภาษณ์:** ความประหม่า/ตื่นเต้น (67.6%), การเรียบเรียงความคิดไม่ทัน (58.8%), ไม่รู้ว่าคำตอบดีพอหรือไม่ (52.9%)
4. **ฟีเจอร์ที่ผู้ใช้ต้องการมากที่สุด:**
   - AI Feedback วิเคราะห์จุดแข็งจุดอ่อนพร้อมวิธีปรับปรุง: 82.4%
   - ตัวอย่างแนวทางการตอบที่ดี (Sample Answers): 74.5%
   - โหมดจำลองเวลาเสมือนจริง: 62.7%
   - การสัมภาษณ์ด้วยเสียง: 58.8%

---

## 4. ผู้ใช้งานและตารางสิทธิ์ (Roles & RBAC Matrix)

### 4.1 รายชื่อบทบาท (Roles)
- **Guest:** ผู้เยี่ยมชมที่ยังไม่ได้ล็อกอิน ทดลองทำแบบฝึกหัดพื้นฐานได้จำกัด ไม่บันทึกประวัติ
- **Free User:** สมาชิกฟรี มีโควตาจำกัด (เช่น วันละ 3 คำถาม), ดูประวัติของตนเองได้
- **Paid User:** สมาชิกแพ็กเกจ ได้รับการวิเคราะห์เชิงลึกแบบไม่จำกัด และได้รายงานเปรียบเทียบ
- **Admin:** ผู้ดูแลระบบ จัดการคลังคำถาม, Rubric, ตรวจสอบ Audit Log, จัดการข้อร้องเรียน (Appeals)
- **Researcher:** นักวิจัย เข้าถึงเฉพาะข้อมูลรวมที่ผ่านการปิดบังตัวตน (Aggregated/Anonymized) และผู้ใช้ให้ Consent เท่านั้น
- **Auditor:** ผู้ตรวจสอบสิทธิ์ ดู Audit Log และรายงาน Data Rights/PDPA ได้อย่างเดียว (Read-only)

### 4.2 ตารางสิทธิ์ (RBAC Matrix)

| Feature / Action | Guest | Free User | Paid User | Admin | Researcher | Auditor |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| ทดลองสัมภาษณ์พื้นฐาน | ✅ (จำกัด) | ✅ | ✅ | ✅ | ❌ | ❌ |
| บันทึก & ดูประวัติของตนเอง | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| ดูผลวิเคราะห์ AI เชิงลึก | ❌ | จำกัด | ✅ | ✅ | ❌ | ❌ |
| ยื่นขออุทธรณ์ผลคะแนน (Appeals) | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| จัดการคลังคำถามและ Rubric | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| ตรวจสอบ Audit Log / กิจกรรม | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| ดาวน์โหลดชุดข้อมูลสถิติเพื่อการวิจัย | ❌ | ❌ | ❌ | ❌ | ✅ (ต้องมี Consent) | ❌ |
| ขอส่งออก / ขอลบข้อมูลส่วนตัว (PDPA) | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 5. ข้อกำหนดฟังก์ชันงาน (Functional Requirements - FR)

| รหัส | หมวดหมู่ | ชื่อฟังก์ชัน | รายละเอียด & กฎเกณฑ์สำคัญ | Release |
|---|---|---|---|:---:|
| **FR01** | บัญชีผู้ใช้ | การสมัครและเข้าสู่ระบบ | รองรับ Email/Password (Argon2id/Bcrypt), Social OAuth, Refresh Token Rotation | R1 |
| **FR02** | บัญชีผู้ใช้ | สถานะผู้ใช้งาน | ระบุสถานะ (นักศึกษา, บัณฑิต, พนักงาน) เพื่อปรับ Persona ของคำถาม | R1 |
| **FR03** | บัญชีผู้ใช้ | ตั้งค่าระดับความสามารถ | ปรับระดับความยาก (Beginner, Intermediate, Advanced) | R1 |
| **FR04** | จำลองสัมภาษณ์ | สุ่มและจัดส่งคำถาม | เลือกประเภทคำถามตามหมวดหมู่ (Job, Study, Scholarship, English) สุ่มไม่ซ้ำ | R1 |
| **FR05** | จำลองสัมภาษณ์ | ส่งคำตอบแบบข้อความ | บันทึกคำตอบ Atomic พร้อม Outbox Event ส่งต่อให้ Worker ทันที | R1 |
| **FR05-V** | จำลองสัมภาษณ์ | ส่งคำตอบด้วยเสียง | บันทึกเสียง อัปโหลดลง Private S3/Storage ชั่วคราว และแปลงเสียงเป็นข้อความ (STT) | R2 |
| **FR05.1**| ความเป็นส่วนตัว | จัดการอายุไฟล์เสียง | ให้ผู้ใช้เลือกว่าจะลบเสียงทันทีหลังวิเคราะห์ หรือเก็บไว้ 30 วันเพื่อฟังย้อนหลัง | R2 |
| **FR06** | จำลองสัมภาษณ์ | โหมดกดดัน (Pressure Mode) | ระบบจับเวลาถอยหลัง หากหมดเวลาให้บันทึกคำตอบเท่าที่ตอบได้ทันที | R1 |
| **FR07** | จำลองสัมภาษณ์ | ความหลากหลายของคำถาม | ป้องกันการสุ่มเจอคำถามเดิมซ้ำภายใน 5 ครั้งล่าสุด | R1 |
| **FR08** | การประเมินผล AI | ให้คะแนนตาม Rubric | ให้คะแนน 0–100 หรือ 1–5 ในด้าน: ความตรงประเด็น, โครงสร้าง, ตรรกะ, ความสมบูรณ์ | R1 |
| **FR09** | การประเมินผล AI | ตรวจสอบภาษาอังกฤษ | ตรวจ Grammar, Vocabulary, Clarity ในหมวดภาษาอังกฤษ | R1 |
| **FR10** | การประเมินผล AI | ตัวบ่งชี้การพูด (Speech) | นับ Filler Words (เอ่อ/อ่า), วัด Words Per Minute (WPM), ความสม่ำเสมอ | R2 |
| **FR11** | การประเมินผล AI | ข้อเสนอแนะเชิงพัฒนา | สรุปจุดแข็ง จุดที่ต้องพัฒนา และคำแนะนำที่นำไปฝึกฝนต่อได้ทันที | R1 |
| **FR12** | การประเมินผล AI | ตัวอย่างคำตอบแบบ STAR | แสดงตัวอย่างคำตอบแนวทาง Situation, Task, Action, Result | R1 |
| **FR13** | รายงาน & ติดตาม | Dashboard พัฒนาการ | กราฟสถิติคลิกดูความก้าวหน้า จุดอ่อนในแต่ละหมวดหมู่ | R2 |
| **FR14** | ประวัติการใช้งาน | เรียกดู & ลบประวัติ | เรียกดูประวัติสัมภาษณ์ย้อนหลัง และมีปุ่มขอลบประวัติรายครั้ง | R1 |
| **FR15** | การส่งออกข้อมูล | สรุปรายงานผลการฝึก | ส่งออกผลการประเมินเป็นไฟล์ PDF สวยงาม | R2 |
| **FR16** | การปรับแต่ง | คำถามเจาะจงสายงาน | ผู้ใช้สามารถกรอกรายละเอียดตำแหน่งงาน/บริษัท เพื่อให้ AI ปรับแต่งคำถาม | R2 |
| **FR17** | ความเป็นส่วนตัว | จัดการความยินยอม (Consent) | แยก Consent ชัดเจน: บันทึกเสียง, นำข้อมูลไปใช้ปรับปรุงโมเดล, ติดต่อวิจัย | R1 |
| **FR18** | วิจัย | ส่งออกข้อมูลสถิติวิจัย | กรองเฉพาะผู้ใช้ที่ยินยอม ทำ Anonymize ตัด PII และทำ Data Suppression | R3 |
| **FR19–27**| ชำระเงิน | Billing & Subscriptions | จัดการแพ็กเกจ, Checkout, Webhook รับเงิน, Quota Entitlements, ประวัติใบเสร็จ | R3 |
| **FR32–35**| จัดการระบบ | Admin Management | จัดการคลังคำถาม, ปรับปรุง Rubric, Audit Log ผู้ดูแลระบบ | R1 |
| **FR36** | การประเมินผล AI | ระบบอุทธรณ์คะแนน | ผู้ใช้สามารถกด Flag หรือแจ้งร้องเรียนหากคิดว่า AI ให้คะแนนผิดพลาด | R1 |

---

## 6. ข้อกำหนดเชิงคุณภาพ (Non-Functional Requirements - NFR)

1. **NFR01 (Security & Encryption):** เข้ารหัสข้อมูล AES-256 (At Rest), TLS 1.3/1.2 (In Transit), แยก Secret ผ่าน Secret Manager
2. **NFR02 (Scoring Accuracy):** ความแม่นยำของคะแนน AI ต้องมี Correlation ไม่ต่ำกว่า 0.70 เมื่อเทียบกับผู้เชี่ยวชาญมนุษย์
3. **NFR03 (Usability):** ระบบต้องได้คะแนน System Usability Scale (SUS) ไม่ต่ำกว่า 70/100
4. **NFR04 (Performance SLA):**
   - API ทั่วไป: Latency < 500 ms
   - การประเมินผลข้อความด้วย AI: สรุปผลพร้อมแสดงผลภายใน < 3–5 วินาที
   - การประเมินผลเสียง (R2): สรุปผลภายใน < 8–10 วินาที
5. **NFR05 (Availability):** 99.9% Uptime สำหรับ Core Services
6. **NFR06 (Privacy & Compliance):** สอดคล้องตามกฎหมาย PDPA (สิทธิ์เข้าถึง, สิทธิ์คัดค้าน, สิทธิ์ขอลบ, สิทธิ์เคลื่อนย้ายข้อมูล)
7. **NFR07 (Idempotency):** การส่งคำตอบ (Submit Answer) ต้องรองรับ Idempotency Key ป้องกันการส่งซ้ำหรือหักโควตาซ้ำซ้อน

---

## 7. สถาปัตยกรรมระบบ (System Architecture & Principles)

### 7.1 ภาพรวมสถาปัตยกรรม (C4 Containers)
- **Web App:** Next.js (TypeScript) PWA สำหรับ Mobile/Desktop Responsive
- **Mobile App (R2):** React Native / Expo สำหรับ iOS และ Android
- **Core API / BFF:** NestJS (Modular Monolith) จัดการ Business Logic, Auth, RBAC, Validation
- **Job Queue & Outbox:** Redis + BullMQ ร่วมกับ Transactional Outbox Pattern เพื่อความปลอดภัยของข้อมูล
- **Worker:** NestJS Evaluation Worker ดึงงานจาก Queue ไปเรียก AI Service
- **AI Service:** FastAPI (Python) ทำหน้าที่เรียก LLM Provider (OpenAI/Anthropic/Gemini) พร้อม Guardrails & Structured Output
- **Database:** PostgreSQL (Prisma ORM)
- **Storage:** S3-compatible Object Storage (เข้ารหัสแบบ Private Buckets)
- **R3 Services:** `billing-service` และ `research-service` แยกฐานข้อมูลและ credentials ออกจาก Core ชัดเจน

### 7.2 กฎเหล็กทางสถาปัตยกรรม (Architecture Invariants)
1. **Single Ownership:** มีเพียง NestJS Core เท่านั้นที่มีสิทธิ์เขียน/อ่าน Core Database ห้าม FastAPI AI Service ต่อตรงเข้า Postgres Core เด็ดขาด (AI Service รับเฉพาะ Task Payload ผ่าน HTTP)
2. **Transactional Outbox:** เมื่อผู้ใช้ส่งคำตอบ (Submit Answer) ระบบต้องบันทึกคำตอบ, สร้าง Job, บันทึก Idempotency Key และสร้าง Outbox Event ภายใน Database Transaction เดียวกันเสมอ
3. **Database Isolation (R3):** ระบบ Billing และ Research มีฐานข้อมูลและ User Credentials แยกต่างหาก ห้ามสร้าง Cross-database Foreign Key มายัง Core DB
4. **Privacy & Consent Separation:** สิทธิ์การประมวลผลข้อมูลหลัก (Service Core) ใช้ Lawful Basis สัญญาการให้บริการ ไม่ผูกมัดกับ Consent การวิจัยหรือการเก็บไฟล์เสียง (ต้อง Opt-in แยก)

---

## 8. โครงสร้างฐานข้อมูลหลัก (Core Database Schema Overview)

### Schemas ใน Core Postgres (`001_core.sql`):
1. **`identity`**: `users`, `auth_identities`, `refresh_sessions`
2. **`interview`**: `sessions`, `session_questions`, `answers`
3. **`evaluation`**: `jobs`, `feedback`, `appeals`
4. **`content`**: `question_bank`, `rubrics`
5. **`privacy`**: `consent_events`, `data_rights_requests`
6. **`platform`**: `idempotency_keys`, `outbox_events`, `audit_logs`

---

## 9. สัญญาเชื่อมต่อ API หลัก (Core REST API Endpoints)

อ้างอิงจาก [public-v1.openapi.yaml](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/interviewx-design/contracts/public-v1.openapi.yaml):
- **Authentication:** `POST /v1/auth/register`, `POST /v1/auth/login`, `POST /v1/auth/refresh`, `POST /v1/auth/logout`
- **Interviews:** `POST /v1/interviews`, `GET /v1/interviews/{id}`, `POST /v1/interviews/{id}/answers`, `POST /v1/interviews/{id}/finish`, `GET /v1/interviews`, `DELETE /v1/interviews/{id}`
- **Evaluation & Feedback:** `GET /v1/evaluations/{jobId}`, `GET /v1/feedback/{id}`, `POST /v1/feedback/{id}/appeals`
- **Privacy & PDPA:** `GET /v1/privacy/consents`, `POST /v1/privacy/consents`, `POST /v1/privacy/data-requests`

---

## 10. คำสั่งกำกับการทำงานของ AI (System Instruction / Grounding Prompt)

> เมื่อนำชุดข้อมูลนี้ไปใส่ใน **ChatGPT Custom GPT** หรือ **ChatGPT Project** หรือ **Claude Project** ให้ใส่ข้อความกำกับดังนี้ในส่วน *Instructions*:
> 
> ```text
> คุณคือ Senior Software Architect & Technical Lead ประจำโครงการ InterviewX
> ให้ปฏิบัติตามกฎเกณฑ์ต่อไปนี้อย่างเคร่งครัด:
> 1. ยึดข้อมูลใน InterviewX Knowledge Pack เป็น Single Source of Truth
> 2. แยกขอบเขตการพัฒนาตาม Release อย่างเคร่งครัด (R1 = Text MVP, R2 = Voice/Dashboard/Mobile, R3 = Billing/Research)
> 3. เคารพโครงสร้างทีมพัฒนา (Development Team Roles) และกระจายคำตอบ/โค้ดให้ตรงกับความรับผิดชอบของสมาชิกทั้ง 5 คน
> 4. ในการเขียนโค้ด ให้เคารพกฎ Single Ownership: ห้ามให้ AI Service เข้าถึงฐานข้อมูล Core Database โดยตรง
> 5. ปฏิบัติตาม REST API Contracts และ DDL Database Schema ที่กำหนดไว้ในเอกสาร ห้ามสร้าง Endpoint หรือฟิลด์ตารางขึ้นมาเองโดยไม่มีในสเปก
> 6. ปฏิบัติตามมาตรฐานความปลอดภัย PDPA, Transactional Outbox และ Idempotency ในทุกจุดที่มีการส่งคำตอบ
> ```

---

## 11. โครงสร้างทีมพัฒนา บทบาทหน้าที่ และผู้รับผิดชอบระบบย่อย (Development Team Roles & Module Ownership)

### 11.1 รายชื่อและตำแหน่งของสมาชิกทีมพัฒนา (Approved Team Roles)

| ชื่อ-นามสกุล | รหัสนักศึกษา | ตำแหน่งและบทบาทหลัก (Approved Team Roles) | ขอบเขตงานและความรับผิดชอบหลัก |
|---|:---:|---|---|
| **นายนรงศักดิ์ ภูมิประเสริฐ** | 674259009 | **Tech Lead, Architecture, AI Layer, DevOps, Integration** | System Architecture, FastAPI AI Service, Rubric Engine, DevOps (Docker/CI/CD), Integration Standards |
| **นายสมหมาย สุภาวงค์** | 674259024 | **UX/UI Lead, Design System, Frontend/Mobile** | UX Research, Design System, Responsive Web (Next.js), Mobile App (React Native/Expo), Accessibility |
| **นายกิติกร เทศธรรม** | 674259003 | **Fullstack, NestJS Core Backend, API** | NestJS Core, Identity & Auth, REST API, DTOs & Validation, PostgreSQL & Prisma ORM, Backend Security |
| **นายจิรเมธ วงษ์กัณหา** | 674259004 | **Fullstack, NestJS Core Backend, Integration** | Interview Session Flow, BullMQ Queue, Transactional Outbox, Idempotency, Session Resilience |
| **นายณัฐพล กลิ่นจุ่น** | 674259006 | **BA, QA, Tester, Documentation** | Requirement Analysis, RTM, Test Scenarios & Test Cases, QA Testing, Defect Tracking, Technical Documentation |

### 11.2 ตารางกำหนดผู้รับผิดชอบระบบย่อย (Module Ownership Matrix)

| โมดูล / ระบบย่อย | ผู้รับผิดชอบหลัก (Primary Owner) | ผู้ร่วมสนับสนุน (Supporting Members) | Release |
|---|---|---|:---:|
| System Architecture & Standards | นายนรงศักดิ์ ภูมิประเสริฐ | นายกิติกร, นายจิรเมธ | R1–R3 |
| AI Architecture & FastAPI AI Service | นายนรงศักดิ์ ภูมิประเสริฐ | นายจิรเมธ วงษ์กัณหา | R1–R3 |
| DevOps, CI/CD & Deployment | นายนรงศักดิ์ ภูมิประเสริฐ | นายกิติกร, นายจิรเมธ | R1–R3 |
| Authentication & Identity Module | นายกิติกร เทศธรรม | นายนรงศักดิ์ ภูมิประเสริฐ | R1 |
| User Profile & Account Module | นายกิติกร เทศธรรม | นายสมหมาย สุภาวงค์ | R1 |
| NestJS Core Backend Architecture | นายกิติกร เทศธรรม, นายจิรเมธ วงษ์กัณหา | นายนรงศักดิ์ ภูมิประเสริฐ | R1–R3 |
| REST API & OpenAPI Contracts | นายกิติกร เทศธรรม | นายจิรเมธ วงษ์กัณหา | R1–R3 |
| Interview Session & Question Module | นายจิรเมธ วงษ์กัณหา | นายกิติกร เทศธรรม | R1 |
| Evaluation Job & Queue Integration | นายจิรเมธ วงษ์กัณหา | นายนรงศักดิ์ ภูมิประเสริฐ | R1 |
| AI Evaluation & Rubric Engine | นายนรงศักดิ์ ภูมิประเสริฐ | นายจิรเมธ วงษ์กัณหา | R1–R2 |
| UX/UI Design & InterviewX Design System | นายสมหมาย สุภาวงค์ | นายณัฐพล กลิ่นจุ่น | R1–R3 |
| Responsive Web Application (Next.js) | นายสมหมาย สุภาวงค์ | นายกิติกร, นายจิรเมธ | R1–R3 |
| Native Mobile Application (React Native) | นายสมหมาย สุภาวงค์ | นายกิติกร, นายจิรเมธ | R2 |
| Database Design & Prisma Migrations | นายกิติกร เทศธรรม, นายจิรเมธ วงษ์กัณหา | นายนรงศักดิ์ ภูมิประเสริฐ | R1–R3 |
| Requirements Analysis & RTM | นายณัฐพล กลิ่นจุ่น | สมาชิกทุกคน | R1–R3 |
| QA & Software Testing | นายณัฐพล กลิ่นจุ่น | สมาชิกทุกคน | R1–R3 |
| System Integration Testing | นายนรงศักดิ์ ภูมิประเสริฐ | ณัฐพล, กิติกร, จิรเมธ | R1–R3 |
| Technical Documentation & Reports | นายณัฐพล กลิ่นจุ่น | สมาชิกทุกคน | R1–R3 |
| Release Review & Acceptance (DoD) | นายณัฐพล กลิ่นจุ่น | นายนรงศักดิ์ และทุกคน | R1–R3 |
