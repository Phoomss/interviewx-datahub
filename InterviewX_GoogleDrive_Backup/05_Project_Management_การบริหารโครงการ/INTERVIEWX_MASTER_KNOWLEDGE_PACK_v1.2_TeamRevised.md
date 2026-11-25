# InterviewX — Master Knowledge Pack for ChatGPT / AI Assistant (v1.2 Team-Revised)

> **เอกสารรวมชุดข้อมูลโครงการฉบับสมบูรณ์ (Single Source of Truth Knowledge Base)**  
> **วันที่มีผลบังคับใช้:** 25 พฤศจิกายน 2026 | **เวอร์ชัน:** 1.2 (Team Structure, Roles & Technical Ownership Revised)  
> **เอกสารต้นฉบับที่คงสภาพเดิม:** [INTERVIEWX_MASTER_KNOWLEDGE_PACK.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/07_Development_Documentation/INTERVIEWX_MASTER_KNOWLEDGE_PACK.md)  
> **วัตถุประสงค์:** ใช้เป็น Context / Knowledge Base สำหรับ AI Assistant (ChatGPT / Claude / Antigravity) ในการตอบคำถาม ออกแบบสถาปัตยกรรม เขียนโค้ด กำหนดข้อกำหนด และแจกแจงงานตามบทบาทของทีมพัฒนาที่ได้รับอนุมัติล่าสุด

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
- **Frontend Web:** Next.js (TypeScript) Responsive Web Application
- **Native Mobile (ตาม Roadmap R2):** React Native / Expo สำหรับ iOS และ Android
- **Core Backend Modular Monolith:** NestJS จัดการ Business Logic, Auth, RBAC, Validation
- **Job Queue & Outbox:** Redis + BullMQ ร่วมกับ Transactional Outbox Pattern เพื่อความปลอดภัยของข้อมูล
- **Evaluation Worker:** NestJS Evaluation Worker ดึงงานจาก Queue ไปเรียก AI Service
- **AI Service:** FastAPI (Python) ทำหน้าที่เรียก LLM Provider (OpenAI/Anthropic/Gemini) พร้อม Guardrails & Structured Output
- **Core Database:** PostgreSQL (Prisma ORM)
- **Storage:** S3-compatible Object Storage / MinIO (เข้ารหัสแบบ Private Buckets)
- **R3 Services:** `billing-service` และ `research-service` แยกฐานข้อมูลและ credentials ออกจาก Core ชัดเจน

### 7.2 กฎเหล็กทางสถาปัตยกรรม (Architecture Invariants)
1. **Single Ownership ของ Core Database:** มีเพียง NestJS Core เท่านั้นที่เข้าถึงและจัดการ Core Database ห้าม FastAPI AI Service เชื่อมต่อ Core PostgreSQL โดยตรงเด็ดขาด (AI Service รับเฉพาะ Task Payload ผ่าน HTTP)
2. **Transactional Outbox, Idempotency และ Session Resilience:** เมื่อผู้ใช้ส่งคำตอบ (Submit Answer) ระบบต้องบันทึกคำตอบ, สร้าง Job, บันทึก Idempotency Key และสร้าง Outbox Event ภายใน Database Transaction เดียวกันเสมอ และรักษา Session Resilience ตาม SRS เดิม
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

อ้างอิงจาก [public-v1.openapi.yaml](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/04_System_Architecture/interviewx-design/contracts/public-v1.openapi.yaml):
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
> 1. ยึดข้อมูลใน InterviewX Knowledge Pack (v1.2 Team-Revised) เป็น Single Source of Truth
> 2. แยกขอบเขตการพัฒนาตาม Release อย่างเคร่งครัด (R1 = Text MVP, R2 = Voice/Dashboard/Mobile, R3 = Billing/Research)
> 3. เคารพโครงสร้างทีมพัฒนาและ Technical Ownership:
>    - นายนรงศักดิ์ (Tech Lead): ควบคุม System Architecture, ตรวจสอบ Backend Code/Architecture/Security อย่างต่อเนื่อง และเป็น Primary Owner ของ FastAPI AI Service & Rubric Engine
>    - นายสมหมาย (UX/UI Lead & Frontend Lead): เป็น Frontend Primary Owner ทั้ง UX/UI Design, Design System และ Next.js Web Development (และ Mobile ตาม Roadmap)
>    - นายกิติกร และ นายจิรเมธ (Fullstack Developers): เป็น Backend Primary Developers ตามโมดูลที่รับผิดชอบ และเป็น Frontend Supporting Developers ภายใต้แนวทางของ Frontend Lead (ไม่รับผิดชอบ AI Evaluation Engine)
>    - นายณัฐพล (BA / QA / Tester / Documentation): รับผิดชอบ Requirement Analysis, RTM, Testing ทุกระดับ, Defect Tracking และ Documentation
> 4. เคารพกฎ Single Ownership ของ Core Database: มีเพียง NestJS Core เท่านั้นที่เข้าถึงและจัดการ Core PostgreSQL ห้าม FastAPI AI Service เชื่อมต่อ Core PostgreSQL โดยตรง
> 5. ปฏิบัติตาม REST API Contracts และ DDL Database Schema ที่กำหนดไว้ในเอกสาร ห้ามเปลี่ยน Stack หรือสร้าง Endpoint/ฟิลด์นอกสเปก
> 6. คง Transactional Outbox, Idempotency และ Session Resilience ตาม SRS เดิม รวมถึงมาตรฐาน PDPA ในทุกจุด
> ```

---

## 11. โครงสร้างทีมพัฒนา บทบาทหน้าที่ ความรับผิดชอบ และ Technical Ownership (Team Structure, Roles & Ownership)

### 11.1 รายชื่อสมาชิกและตำแหน่งที่ได้รับอนุมัติ

| สมาชิก | รหัสนักศึกษา | ตำแหน่ง | บทบาทหลัก (Role Summary) |
|---|:---:|---|---|
| **นายนรงศักดิ์ ภูมิประเสริฐ** | 674259009 | **Tech Lead** | System Architecture, Backend Technical Governance & AI Service Owner |
| **นายสมหมาย สุภาวงค์** | 674259024 | **UX/UI Lead & Frontend Lead** | UX/UI Design, Design System & Frontend Primary Owner |
| **นายกิติกร เทศธรรม** | 674259003 | **Fullstack Developer** | Backend Primary Developer (Auth/Identity/Users/API) & Frontend Supporting Developer |
| **นายจิรเมธ วงษ์กัณหา** | 674259004 | **Fullstack Developer** | Backend Primary Developer (Interview/Queue/Outbox/Worker Integration) & Frontend Supporting Developer |
| **นายณัฐพล กลิ่นจุ่น** | 674259006 | **BA / QA / Tester / Documentation** | Requirement Analysis, Testing & Technical Documentation |

### 11.2 รายละเอียดความรับผิดชอบแต่ละตำแหน่ง

#### 1) Tech Lead — นายนรงศักดิ์ ภูมิประเสริฐ (674259009)
- **บทบาท:** System Architecture, Backend Technical Governance & AI Service Owner
- **ความรับผิดชอบ:**
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
- **ข้อกำหนด:** Tech Lead เป็นผู้ควบคุมมาตรฐานและตรวจสอบ Backend ทั้งระบบ ไม่ใช่เพียงผู้ให้คำปรึกษา และเป็น Primary Owner ของ AI Service

#### 2) UX/UI Lead & Frontend Lead — นายสมหมาย สุภาวงค์ (674259024)
- **บทบาท:** UX/UI Design, Design System & Frontend Primary Owner
- **ความรับผิดชอบ:**
  1. วิเคราะห์ User Experience และ User Journey
  2. ออกแบบ User Flow และ Information Architecture
  3. จัดทำ Wireframe และ Prototype
  4. ออกแบบ UX/UI ของระบบ
  5. พัฒนาและดูแล Design System
  6. กำหนด Reusable UI Components
  7. กำหนด Design Tokens และ UI Standards
  8. ออกแบบ Responsive Layout
  9. พัฒนา Frontend Web ด้วย Next.js (และดูแลแนวทาง Mobile ด้วย React Native / Expo ตาม Roadmap R2)
  10. จัดการ Frontend Architecture และ Component Structure
  11. พัฒนา UI ตาม Functional Requirements
  12. เชื่อมต่อ Frontend กับ REST API
  13. ตรวจสอบ UI Consistency และ Accessibility
  14. เป็น Frontend Primary Owner และประสานงานกับ Fullstack Developers
- **ข้อกำหนด:** สมหมายเป็นผู้รับผิดชอบ Frontend หลัก ทั้งด้านการออกแบบและการพัฒนา ไม่ใช่เพียงผู้ออกแบบ UX/UI

#### 3) Fullstack Developer — นายกิติกร เทศธรรม (674259003)
- **บทบาท:** Backend Primary Developer & Frontend Supporting Developer
- **ความรับผิดชอบด้าน Backend:**
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
- **ความรับผิดชอบด้าน Frontend (Supporting):**
  1. สนับสนุนการพัฒนา Frontend ร่วมกับ Frontend Lead
  2. ช่วยพัฒนา UI Components และหน้าเว็บตามที่ได้รับมอบหมาย
  3. เชื่อมต่อ UI กับ Authentication และ User APIs
  4. ช่วยจัดการ Frontend Form Validation
  5. ช่วยแก้ไขปัญหาการเชื่อมต่อระหว่าง Frontend และ Backend
  6. สนับสนุนการทดสอบ Frontend ใน Feature ที่ตนรับผิดชอบ
- **ข้อกำหนด:** Backend เป็นความรับผิดชอบหลัก ส่วน Frontend เป็นงานสนับสนุน ไม่ใช่ Frontend Primary Owner

#### 4) Fullstack Developer — นายจิรเมธ วงษ์กัณหา (674259004)
- **บทบาท:** Backend Primary Developer & Frontend Supporting Developer
- **ความรับผิดชอบด้าน Backend:**
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
- **ความรับผิดชอบด้าน Frontend (Supporting):**
  1. สนับสนุนการพัฒนา Interview Room UI
  2. ช่วยพัฒนา Interview Question และ Answer Components
  3. ช่วยเชื่อมต่อ Interview APIs กับ Frontend
  4. ช่วยพัฒนาการแสดงสถานะ Evaluation Processing
  5. ช่วยพัฒนาการแสดงข้อมูล Interview History และ Results
  6. สนับสนุนการทดสอบ Frontend ใน Feature ที่ตนรับผิดชอบ
- **ข้อกำหนด:** Backend เป็นความรับผิดชอบหลัก ส่วน Frontend เป็นงานสนับสนุนภายใต้แนวทางและมาตรฐานของ Frontend Lead

#### 5) BA / QA / Tester / Documentation — นายณัฐพล กลิ่นจุ่น (674259006)
- **ความรับผิดชอบ:**
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

### 11.3 Ownership Matrix (ตารางกำหนดความเป็นเจ้าของระบบและงาน)

| ระบบ / งาน | Primary Owner | Supporting |
|---|---|---|
| System Architecture | Tech Lead (นายนรงศักดิ์) | Fullstack Developers |
| Backend Architecture & Standards | Tech Lead (นายนรงศักดิ์) | Fullstack Developers |
| Backend Code Review & Technical Governance | Tech Lead (นายนรงศักดิ์) | — |
| Authentication & Identity Backend | กิติกร | Tech Lead |
| User Profile & Account Backend | กิติกร | Tech Lead |
| Interview Session Backend | จิรเมธ | Tech Lead |
| Interview Question & Answer Backend | จิรเมธ | Tech Lead |
| BullMQ & Evaluation Queue | จิรเมธ | Tech Lead |
| NestJS Worker Integration | จิรเมธ | Tech Lead |
| AI Service & FastAPI | Tech Lead (นายนรงศักดิ์) | — |
| AI Evaluation & Rubric Engine | Tech Lead (นายนรงศักดิ์) | — |
| UX/UI Design | สมหมาย | — |
| Design System | สมหมาย | — |
| Frontend Architecture | สมหมาย | Tech Lead ให้คำปรึกษา |
| Frontend Web Development | สมหมาย | กิติกร / จิรเมธ |
| Frontend API Integration | สมหมาย | Fullstack Developers |
| QA & Testing | ณัฐพล | สมาชิกทุกคน |
| Requirements & Documentation | ณัฐพล | สมาชิกทุกคน |

### 11.4 หลักการทำงานร่วมกัน (Team Collaboration Principles)

1. **สมหมาย** เป็น Frontend Lead และ Frontend Primary Owner
2. **กิติกร** และ **จิรเมธ** เป็น Backend Primary Developers ตามระบบย่อยที่รับผิดชอบ
3. Fullstack Developers ทั้งสองคนสามารถสนับสนุน Frontend ได้ตาม Sprint Backlog และการมอบหมายจาก Frontend Lead
4. **Tech Lead** เป็นผู้ควบคุมและตรวจสอบ Backend Architecture, API, Security และ Code Quality อย่างต่อเนื่อง
5. Backend Code Review ต้องดำเนินการตามกระบวนการก่อน Merge หรือ Release
6. **Tech Lead** เป็นผู้พัฒนาและดูแล AI Service โดยตรง
7. Fullstack Developers รับผิดชอบการเชื่อมต่อ NestJS Backend และ Worker กับ AI Service แต่ไม่รับผิดชอบการพัฒนา AI Evaluation Engine
8. QA (**ณัฐพล**) รับผิดชอบการทดสอบระบบทุกส่วนร่วมกับผู้พัฒนา
