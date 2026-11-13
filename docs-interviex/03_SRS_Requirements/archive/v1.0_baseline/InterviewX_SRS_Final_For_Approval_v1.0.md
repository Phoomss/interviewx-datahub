# InterviewX — Software Requirements Specification (SRS)

> **SYSTEM REQUIREMENTS SPECIFICATION**  
> `FINAL BASELINE — VERSION 1.0`

> [!WARNING]
> **สถานะการควบคุมเอกสาร (Document Governance Notice)**  
> วันที่จัดทำ: 8 ตุลาคม 2026 | เอกสารสำหรับอนุมัติอย่างเป็นทางการ
> สถานะการควบคุม: Final content baseline; formal stakeholder signatures pending. คำว่า Final ไม่หมายความว่ามีการลงนามรับรองแล้ว

### Document Metadata

| Specification | Details |
|---|---|
| **Document ID** | IX-SRS-001 |
| **Classification** | Controlled Document • Pending Stakeholder Sign-off |
| **Scope Model** | R1 Core MVP \| R2 Enhanced AI \| R3 Commercial & Research |
| **Tech Stack** | Next.js Responsive Web + NestJS API + Hosted AI Adapter |

---

## Document control

| รายการ | รายละเอียด |
|---|---|
| **Document ID** | IX-SRS-001 |
| **Version** | 1.0 |
| **Status** | Final for Approval — Pending Sign-off |
| **Sources** | InterviewX_SRS_Complete.docx; InterviewX_SRS_Revised.docx; Requirement Survey CSV (n=102); FR/NFR/RBAC workbook |
| **Change policy** | การเปลี่ยนข้อกำหนดหลัง baseline ต้องบันทึก Change Request พร้อมผลกระทบและผู้อนุมัติ |
| **Scope model** | R1 Core MVP; R2 Enhanced AI; R3 Commercial & Research |

### Approval record

| ตำแหน่ง | ชื่อ/ลายเซ็น | วันที่ | สถานะ |
| --- | --- | --- | --- |
| **Product owner / Sponsor** | ________________ | ________ | Pending |
| **Technical lead** | ________________ | ________ | Pending |
| **Privacy / Legal reviewer** | ________________ | ________ | Pending |
| **QA / Acceptance owner** | ________________ | ________ | Pending |

---

## สารบัญเนื้อหา

| หมวด | ชื่อหมวด |
|---|---|
| **หมวด 01** | [1. Introduction & Governance](#1-introduction--governance) |
| **หมวด 02** | [2. Evidence and Stakeholders](#2-evidence-and-stakeholders) |
| **หมวด 03** | [3. Scope, Assumptions and Release Plan](#3-scope-assumptions-and-release-plan) |
| **หมวด 04** | [4. System Context and Use Cases](#4-system-context-and-use-cases) |
| **หมวด 05** | [5. Functional Requirements (FR01–FR36)](#5-functional-requirements) |
| **หมวด 06** | [6. Non-Functional Requirements](#6-non-functional-requirements) |
| **หมวด 07** | [7. Role, Authorization and Entitlements](#7-role-authorization-and-entitlements) |
| **หมวด 08** | [8. AI Layer and Evaluation](#8-ai-layer-and-evaluation) |
| **หมวด 09** | [9. Privacy, Consent and Research Data](#9-privacy-consent-and-research-data) |
| **หมวด 10** | [10. Package, Payment and Refund Governance](#10-package-payment-and-refund-governance) |
| **หมวด 11** | [11. Data Model and Data Dictionary](#11-data-model-and-data-dictionary) |
| **หมวด 12** | [12. Architecture, Interfaces, Operations](#12-architecture-interfaces-operations) |
| **หมวด 13** | [13. Traceability and Verification](#13-traceability-and-verification) |
| **หมวด 14** | [14. Risks, Decisions and Approval Conditions](#14-risks-decisions-and-approval-conditions) |

---

## 1. Introduction & Governance

InterviewX คือแพลตฟอร์มฝึกสัมภาษณ์ด้วย AI เพื่อจำลองคำถาม ประเมินคำตอบด้วย rubric ที่อธิบายได้ และช่วยให้ผู้ใช้ปรับปรุงการตอบแบบต่อเนื่อง รองรับภาษาไทย/อังกฤษและเริ่มที่ Responsive Web โดยเตรียมทางขยายไปยัง Mobile App และ Freemium/Subscription ภายหลัง

> [!IMPORTANT]
> **ลำดับการบังคับใช้ข้อกำหนด (Precedence & Authority)**  
> เอกสารนี้เป็นข้อกำหนดเชิงบังคับสำหรับฟังก์ชันใน release ที่อนุมัติเท่านั้น; ข้อกำหนดใน R2/R3 ยังไม่เป็น commitment ของ R1. ลำดับบังคับใช้: ข้อกำหนดฉบับนี้ > test cases ที่อ้างอิง > เอกสาร Claude ฉบับเก่า. ห้ามถือข้อความในเอกสารเดิมที่ขัดแย้งกันเป็นข้อกำหนดพร้อมกัน

### คำศัพท์และตัวย่อสำคัญ (Definitions & Acronyms):

คำศัพท์: FR = Functional Requirement; NFR = Non-Functional Requirement; RBAC = Role-Based Access Control; Entitlement = สิทธิ์และโควตาตามแพ็กเกจ; RLS = Row-Level Security; STT = Speech-to-Text; P95 = 95th percentile; UAT = User Acceptance Test; R1/R2/R3 = Release 1/2/3

---

## 2. Evidence and Stakeholders

ฐานข้อมูลการสำรวจ: CSV ต้นฉบับมี 102 แถวตอบแบบสอบถามและ 22 คอลัมน์ คำถามหลายตัวเลือกแยกนับ respondent ที่เลือกแต่ละข้อ ตัวเลขเป็น descriptive evidence ไม่ใช่ผลพิสูจน์ความต้องการของประชากรทั้งหมด

| ฟีเจอร์จาก Survey | จำนวน (n=102) | ร้อยละ |
| --- | --- | --- |
| จำลองคำถามเฉพาะประเภท | 94 | 92.2% |
| วิเคราะห์การสื่อสาร/ความมั่นใจ | 67 | 65.7% |
| คะแนนและ Feedback | 58 | 56.9% |
| Grammar/ภาษาอังกฤษ | 57 | 55.9% |
| วิเคราะห์คำตอบ | 55 | 53.9% |
| ฝึกด้วยเสียง | 38 | 37.3% |
| ปรับระดับความยาก | 35 | 34.3% |
| Dashboard | 30 | 29.4% |

สำรวจพบว่า 84/102 ต้องการทั้งเว็บและมือถือ แต่ไม่ได้พิสูจน์ว่าจำเป็นต้องมี native mobile app ใน R1; สามารถเริ่มจาก Responsive Web/PWA ได้. ผู้ตอบ 64/102 ไม่เคยได้รับ feedback หลังการสัมภาษณ์. ความกังวลเกี่ยวกับความแม่นยำ feedback 67/102, ความเป็นส่วนตัว 57/102, ภาษา 57/102

- **Stakeholders: ผู้ฝึกสัมภาษณ์, ผู้วิจัย (เมื่ออนุมัติ scope), Product Owner, AI/Backend/Frontend team, QA, Privacy Officer, Finance Admin (R3), Payment Provider (R3).**

แหล่งที่มาของตัวเลขและนโยบาย: Survey = ความต้องการผู้ใช้; Original SRS = แนวคิดและข้อกำหนด Claude; Proposed Engineering = เป้าหมายทดสอบที่ทีมต้องยืนยันก่อน release; Business Decision Pending = ราคาและเงื่อนไขทางการค้าไม่ยืนยันจาก survey.

---

## 3. Scope, Assumptions and Release Plan

| Release | ขอบเขตที่ตกลงเป็น Baseline | ไม่รวม |
| --- | --- | --- |
| **R1 / Core MVP** | Email login, onboarding, 1+ interview type, text practice, AI rubric scoring and actionable feedback, history, responsive UI, privacy controls, basic admin configuration | Payment, voice analytics, native app, researcher export |
| **R2 / AI Enhancements** | Voice/STT with permission, communication measurements, grammar, adaptive difficulty, progress dashboard, sample answers | Commercial payment unless R3 approved |
| **R3 / Commercial + Research** | Plans, entitlements, gateway, subscriptions, refunds, finance tools and controlled research exports | B2B organization management until separately approved |

> [!NOTE]
> **สมมติฐานหลักของระบบ (System Assumptions)**  
> Assumptions: สามารถใช้ LLM แบบ hosted ผ่าน adapter โดยไม่ฝึกโมเดลใหม่ใน R1; คลังคำถามและ rubric ต้องมีผู้รับผิดชอบคุณภาพ; ไม่บันทึก raw audio ใน R1; การใช้ข้อมูล survey ติดต่อกลับต้องเคารพความยินยอมที่ตอบไว้

---

## 4. System Context and Use Cases

| UC | Actor | Trigger / Result | Release |
| --- | --- | --- | --- |
| **UC01** | Guest | ลงทะเบียน / Login สำเร็จหรือได้รับ error ที่ระบุได้ | R1 |
| **UC02** | User | ตั้งบริบทและประเภทสัมภาษณ์ | R1 |
| **UC03** | User | เริ่มฝึก/ตอบคำถาม/จบหรือยกเลิกเซสชัน | R1 |
| **UC04** | User | รับคะแนน คำแนะนำและเหตุผลที่อ้างคำตอบตนเอง | R1 |
| **UC05** | User | ดู/ส่งออก/ลบข้อมูลของตัวเอง | R1 |
| **UC06** | Admin | จัดการ prompt/rubric/question แบบ versioned | R1 |
| **UC07** | User | ตอบด้วยเสียงและดูตัวชี้วัดการพูด | R2 |
| **UC08** | User | ดู dashboard ความก้าวหน้า | R2 |
| **UC09** | User/Gateway | ซื้อ/ต่ออายุ/ยกเลิก/ขอ refund | R3 |
| **UC10** | Researcher | ขอข้อมูลสรุปที่อนุมัติ แยกจาก contact list | R3 |

---

## 5. Functional Requirements

*ข้อกำหนดเชิงฟังก์ชัน (FR01–FR36) ครอบคลุมฟังก์ชันการทำงานหลักของระบบ InterviewX แบ่งตามระยะการปล่อยระบบ (Release R1, R2, R3) พร้อมเกณฑ์การยอมรับ (Acceptance Criteria) และหลักฐานอ้างอิงอย่างชัดเจน*

### FR01 — Registration, login and session security

`[ R1 ]  [ Priority: Must ]  • ที่มา: Original SRS FR01 / engineering correction`

- **ข้อกำหนด (Requirement):** สมัคร/ยืนยันอีเมล เข้าสู่ระบบ ออกจากระบบ รีเซ็ตรหัสผ่าน และรองรับ OAuth ภายหลัง
- **เกณฑ์การยอมรับ (Acceptance Criteria):** อีเมลซ้ำไม่สร้างบัญชี; password hashed; expired/revoked session ถูกปฏิเสธ; rate-limit authentication

### FR02 — User status and profile

`[ R1 ]  [ Priority: Must ]  • ที่มา: Survey + FR02`

- **ข้อกำหนด (Requirement):** ผู้ใช้ระบุหรือแก้ไขสถานะปัจจุบันและเป้าหมายการฝึกได้ ข้าม onboarding ได้
- **เกณฑ์การยอมรับ (Acceptance Criteria):** มี Other/Skip; การแก้ไขไม่เปลี่ยนผลเซสชันเก่า

### FR03 — Skill configuration

`[ R2 ]  [ Priority: Should ]  • ที่มา: FR03`

- **ข้อกำหนด (Requirement):** ผู้ใช้เลือกระดับ beginner/intermediate/advanced หรือระบบเสนอระดับโดยไม่บังคับ
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ระดับถูกบันทึกพร้อมเซสชัน; เปลี่ยนแล้วไม่เขียนทับข้อมูลเก่า

### FR04 — Interview category/question delivery

`[ R1 ]  [ Priority: Must ]  • ที่มา: Survey 94/102; FR04`

- **ข้อกำหนด (Requirement):** ผู้ใช้เลือกหมวดและระบบส่งคำถามตามหมวดที่รองรับ; เพิ่มหมวดใน R2/R3 โดย configuration
- **เกณฑ์การยอมรับ (Acceptance Criteria):** R1 รองรับสัมภาษณ์งานอย่างน้อยหนึ่งหมวด; ทดสอบตรงหมวด ≥95% บนชุดตัวอย่างติดป้ายโดยมนุษย์

### FR05 — Text answer submission

`[ R1 ]  [ Priority: Must ]  • ที่มา: FR05 split`

- **ข้อกำหนด (Requirement):** รับและบันทึกคำตอบข้อความอย่างปลอดภัยก่อนส่งประเมิน
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ป้องกันคำตอบว่าง; retry ไม่บันทึกซ้ำ; เก็บคำตอบตรงคำถาม

### FR05-V — Voice answer and STT

`[ R2 ]  [ Priority: Should ]  • ที่มา: Survey 38/102; FR05`

- **ข้อกำหนด (Requirement):** รับเสียงด้วย permission เฉพาะและแปลงเป็น transcript โดยผู้ใช้ตรวจแก้ได้
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ไมค์ถูกปฏิเสธมีทางเลือก text; STT error สามารถแก้ก่อนส่ง; raw audio ตาม retention

### FR05.1 — Voice-retention choice

`[ R2 ]  [ Priority: Must ]  • ที่มา: Original FR05.1`

- **ข้อกำหนด (Requirement):** ขอ opt-in แยกเฉพาะการเก็บเสียงหลังประมวลผลพร้อมแจ้งระยะเวลา
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ปฏิเสธไม่กระทบ text; มีหลักฐาน version/time; ลบตาม policy

### FR06 — Pressure practice mode

`[ R2 ]  [ Priority: Could ]  • ที่มา: FR06`

- **ข้อกำหนด (Requirement):** โหมดจำลองการสัมภาษณ์เข้มข้นแบบสมัครใจและออกได้ทันที
- **เกณฑ์การยอมรับ (Acceptance Criteria):** เปิด/ปิดได้; ไม่ใช้การตีตราทางจิตวิทยา; ไม่มีคำถามคุกคาม

### FR07 — Question diversity

`[ R2 ]  [ Priority: Should ]  • ที่มา: FR07`

- **ข้อกำหนด (Requirement):** ลดคำถามซ้ำด้วย session history และ normalized question IDs
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ภายในเซสชันไม่มีคำถามซ้ำโดยไม่ตั้งใจ; กรณีคลังจำกัดแสดง fallback

### FR08 — Rubric-based AI scoring

`[ R1 ]  [ Priority: Must ]  • ที่มา: Survey; FR08`

- **ข้อกำหนด (Requirement):** ประเมินความตรงประเด็น เนื้อหา โครงสร้าง และแสดงคะแนนย่อยพร้อมเหตุผล
- **เกณฑ์การยอมรับ (Acceptance Criteria):** คะแนน 0–100 ตาม rubric version; unsupported answer ได้ status needs-review; ไม่มีการอ้างความถูกต้องแบบไม่มีหลักฐาน

### FR09 — English language feedback

`[ R2 ]  [ Priority: Should ]  • ที่มา: Survey 57/102; FR09`

- **ข้อกำหนด (Requirement):** วิเคราะห์ grammar ในคำตอบภาษาอังกฤษและแยกจาก content score
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ยกตัวอย่าง error ที่มีอยู่จริง; ไม่แก้ประโยคที่ถูกต้องโดยอัตโนมัติ

### FR10 — Observable speech indicators

`[ R2 ]  [ Priority: Should ]  • ที่มา: Survey 67/102; FR10`

- **ข้อกำหนด (Requirement):** วัด speaking pace, pauses, filler words ไม่วินิจฉัยความมั่นใจหรือบุคลิก
- **เกณฑ์การยอมรับ (Acceptance Criteria):** แสดงหน่วย/ตัวอย่างและ disclaimer; ไม่ใช้ confidence_score เป็นภาวะจิตใจ

### FR11 — Actionable feedback

`[ R1 ]  [ Priority: Must ]  • ที่มา: Survey; FR11`

- **ข้อกำหนด (Requirement):** ให้จุดเด่น จุดปรับปรุง และการฝึกครั้งถัดไป พร้อมอ้างหลักฐานจากคำตอบ
- **เกณฑ์การยอมรับ (Acceptance Criteria):** Feedback อย่างน้อย 1 จุดปรับปรุงที่มี evidence เมื่อมีคำตอบเพียงพอ; หลีกเลี่ยงการแต่งคำพูดผู้ใช้

### FR12 — Example responses

`[ R2 ]  [ Priority: Could ]  • ที่มา: FR12`

- **ข้อกำหนด (Requirement):** แสดงตัวอย่างคำตอบที่สัมพันธ์กับคำถามและ label ว่าเป็นตัวอย่าง
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ไม่แสดงว่าเป็นคำตอบเดียว; ไม่มีข้อมูลส่วนบุคคลของผู้อื่น

### FR13 — Progress dashboard

`[ R2 ]  [ Priority: Should ]  • ที่มา: Survey 30/102; FR13`

- **ข้อกำหนด (Requirement):** แสดงการเปลี่ยนแปลงคะแนนเมื่อ rubric และ difficulty เทียบเคียงกัน
- **เกณฑ์การยอมรับ (Acceptance Criteria):** กราฟแสดงช่วงเวลา หมวด rubric version และคำเตือนกรณีเทียบไม่ได้

### FR14 — Interview history

`[ R1 ]  [ Priority: Must ]  • ที่มา: FR14`

- **ข้อกำหนด (Requirement):** ผู้ใช้ดู ลบ และ export คำถาม คำตอบ feedback ของตนเองได้
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ข้อมูลข้ามผู้ใช้ 403/404; การลบมีสถานะและ audit; ประวัติไม่หายหลัง deploy

### FR15 — Responsive access

`[ R1 ]  [ Priority: Must ]  • ที่มา: Survey 84 both; FR15 correction`

- **ข้อกำหนด (Requirement):** เว็บทำงานบนอุปกรณ์ desktop/mobile; native application เป็น extension
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ทดสอบ viewport 360px–desktop, browser matrix; session history ตรงกัน

### FR16 — Practice mode selection

`[ R2 ]  [ Priority: Should ]  • ที่มา: FR16 merged intent`

- **ข้อกำหนด (Requirement):** เลือก text/voice/mixed โดยไม่ซ้ำ logic กับ FR05
- **เกณฑ์การยอมรับ (Acceptance Criteria):** mode ถูกบันทึกใน session; text fallback ทำงาน

### FR17 — Privacy notice and lawful basis

`[ R1 ]  [ Priority: Must ]  • ที่มา: FR17 corrected`

- **ข้อกำหนด (Requirement):** แจ้งวัตถุประสงค์และฐานการประมวลผล; consent สำหรับกรณีที่จำเป็นต้องอาศัย consent
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ไม่มี bundled consent; ถอน consent ที่ถอนคืนได้; audit purpose/version/time

### FR18 — Contact opt-in

`[ R3 ]  [ Priority: Should ]  • ที่มา: Survey Q20-21; FR18`

- **ข้อกำหนด (Requirement):** ยินยอมให้ทีมวิจัยติดต่อกลับแยกจาก research data use
- **เกณฑ์การยอมรับ (Acceptance Criteria):** เฉพาะ opt-in ปรากฏในช่องทาง contact; ถอนแล้วถูกบล็อกทันที

### FR18.1 — Research access authorization

`[ R3 ]  [ Priority: Must ]  • ที่มา: FR18.1 correction`

- **ข้อกำหนด (Requirement):** อนุญาต data release ตาม approved purpose, legal basis, dataset policy และ RLS เป็น defense in depth
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ไม่มี direct researcher SELECT บน raw tables; contact consent ไม่ใช่ research consent

### FR19 — Package catalog

`[ R3 ]  [ Priority: Must ]  • ที่มา: FR19`

- **ข้อกำหนด (Requirement):** แสดงรายการแพ็กเกจ active และราคาชำระจริง
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ราคา checkout ตรง catalog; archive ไม่กระทบผู้ถือเดิม

### FR20 — Quota and entitlement enforcement

`[ R3 ]  [ Priority: Must ]  • ที่มา: FR20`

- **ข้อกำหนด (Requirement):** ตรวจ feature entitlement และโควตาด้วย atomic server-side enforcement
- **เกณฑ์การยอมรับ (Acceptance Criteria):** parallel request ไม่ทะลุ quota; ประวัติ usage ตรวจสอบได้

### FR21 — Package comparison

`[ R3 ]  [ Priority: Should ]  • ที่มา: FR21`

- **ข้อกำหนด (Requirement):** เปรียบเทียบ Free/Basic/Pro โดยอ้างข้อมูลเดียวกับ catalog
- **เกณฑ์การยอมรับ (Acceptance Criteria):** feature/ราคาไม่ขัดกับ package config

### FR22 — Payment methods

`[ R3 ]  [ Priority: Should ]  • ที่มา: FR22 adjusted`

- **ข้อกำหนด (Requirement):** เชื่อมวิธีชำระที่ gateway ที่เลือกสนับสนุนตามการตัดสินใจธุรกิจ
- **เกณฑ์การยอมรับ (Acceptance Criteria):** error/pending/success UI แยก; ไม่ตั้ง 3 วิธีเป็น requirement จนกว่าจะอนุมัติ

### FR23 — Payment gateway validation

`[ R3 ]  [ Priority: Must ]  • ที่มา: FR23`

- **ข้อกำหนด (Requirement):** รับ webhook ที่ตรวจ authenticity พร้อม idempotency/reconciliation
- **เกณฑ์การยอมรับ (Acceptance Criteria):** invalid webhook ไม่เปลี่ยนสิทธิ์; replay ไม่สร้าง charge/subscription ซ้ำ

### FR24 — Receipt issuance

`[ R3 ]  [ Priority: Must ]  • ที่มา: FR24`

- **ข้อกำหนด (Requirement):** สร้างหลักฐานรับชำระหลัง status confirmed; e-tax เฉพาะตามหน้าที่/การอนุมัติ
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ดาวน์โหลดได้; invoice number unique; sensitive data redacted

### FR25 — Provisioning

`[ R3 ]  [ Priority: Must ]  • ที่มา: FR25`

- **ข้อกำหนด (Requirement):** ปลด entitlement ตาม confirmed payment event แบบ async/retry
- **เกณฑ์การยอมรับ (Acceptance Criteria):** duplicate/out-of-order events ไม่ปลดสิทธิ์ผิด; pending มองเห็นได้

### FR26 — Renewal

`[ R3 ]  [ Priority: Should ]  • ที่มา: FR26`

- **ข้อกำหนด (Requirement):** ต่ออายุแบบ manual หรือ auto opt-in ตาม gateway/product policy
- **เกณฑ์การยอมรับ (Acceptance Criteria):** cancellation of renew takes effect; failure notice and retry rules

### FR27 — Cancellation/refund requests

`[ R3 ]  [ Priority: Must ]  • ที่มา: FR27 corrected`

- **ข้อกำหนด (Requirement):** แยก request/approve/execute/refund status; ไม่ใช้ 7 วัน/20% จน legal/business signoff
- **เกณฑ์การยอมรับ (Acceptance Criteria):** no automatic refund without approved rule version; appeals supported

### FR28 — Renewal notifications

`[ R3 ]  [ Priority: Should ]  • ที่มา: FR28`

- **ข้อกำหนด (Requirement):** แจ้งล่วงหน้าก่อน renewal ตามประกาศและ compliance ที่กำหนด
- **เกณฑ์การยอมรับ (Acceptance Criteria):** notification logged; opt-outs comply with mandatory transactional notice

### FR29 — Transaction history

`[ R3 ]  [ Priority: Must ]  • ที่มา: FR29`

- **ข้อกำหนด (Requirement):** เก็บ payment attempts/status/reference/reconciliations และให้ผู้ใช้ดูเฉพาะของตน
- **เกณฑ์การยอมรับ (Acceptance Criteria):** cross-account denied; status append-event traceable

### FR30 — Admin package versioning

`[ R3 ]  [ Priority: Must ]  • ที่มา: FR30`

- **ข้อกำหนด (Requirement):** แยกร่าง-อนุมัติ-เผยแพร่ราคาและ entitlement
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ราคาเดิมของ subscriber ไม่เปลี่ยนโดยไม่แจ้ง; audit old/new

### FR31 — Business metrics

`[ R3 ]  [ Priority: Could ]  • ที่มา: FR31`

- **ข้อกำหนด (Requirement):** รายงานรายได้และ churn พร้อมนิยาม metric และการกระทบ refund
- **เกณฑ์การยอมรับ (Acceptance Criteria):** totals reconcile with transactions; time zone/currency visible

### FR32 — Immutable admin audit

`[ R1 ]  [ Priority: Must ]  • ที่มา: FR32 expanded`

- **ข้อกำหนด (Requirement):** บันทึกการจัดการผู้ใช้ rubric/prompt/config และ package ในระยะที่เปิดใช้
- **เกณฑ์การยอมรับ (Acceptance Criteria):** actor/time/action/target before-after masked; log ไม่แก้โดย role ทั่วไป

### FR32.1 — Research access audit

`[ R3 ]  [ Priority: Must ]  • ที่มา: FR32.1`

- **ข้อกำหนด (Requirement):** บันทึกทุก request/export รวม denied access และจำนวน record
- **เกณฑ์การยอมรับ (Acceptance Criteria):** events link purpose/dataset/version; alert anomalous access

### FR33 — Session resilience

`[ R1 ]  [ Priority: Must ]  • ที่มา: Added engineering gap`

- **ข้อกำหนด (Requirement):** เก็บสถานะคำตอบก่อนส่งและให้เริ่มต่อ/ยกเลิกเมื่อ API ขัดข้อง
- **เกณฑ์การยอมรับ (Acceptance Criteria):** timeout และ retry ไม่เกิด duplicate; แสดง status และทางเลือก

### FR34 — AI configuration and human review

`[ R1 ]  [ Priority: Must ]  • ที่มา: Added engineering gap`

- **ข้อกำหนด (Requirement):** Admin ดูแล question bank/rubric/prompt version พร้อม rollout/rollback
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ทุก feedback ระบุ rubric/prompt/model versions; publish requires designated permission

### FR35 — Data rights request

`[ R1 ]  [ Priority: Must ]  • ที่มา: Added privacy gap`

- **ข้อกำหนด (Requirement):** ผู้ใช้ส่งคำขอดู/export/delete และติดตามสถานะ ตามสิทธิและข้อยกเว้นที่เกี่ยวข้อง
- **เกณฑ์การยอมรับ (Acceptance Criteria):** requests logged; verified identity; applied across active data and scheduled backup lifecycle

### FR36 — AI failure and appeal

`[ R1 ]  [ Priority: Must ]  • ที่มา: Added engineering gap`

- **ข้อกำหนด (Requirement):** AI failure ต้องแจ้ง retry และไม่สร้างคะแนน fabricated; ผู้ใช้แจ้งผลผิดได้
- **เกณฑ์การยอมรับ (Acceptance Criteria):** error status visible; appeal recorded; model errors traceable

---

## 6. Non-Functional Requirements

| ID | Attribute / Requirement | Acceptance Target | Verification |
| --- | --- | --- | --- |
| **NFR01** | Security / encryption | TLS 1.2+ (prefer 1.3), AES-256 or equivalent encryption at rest, managed secrets and strong password hashing | config scan and external test |
| **NFR02** | AI evaluation | Goal correlation ≥0.70 AND MAE ≤15/100 against dual human-reviewed sample; evaluate Thai/English separately (proposed engineering gate) | versioned evaluation set + blinded scoring |
| **NFR03** | Usability | SUS ≥70 and ≥90% complete core practice task in moderated test (proposed) | usability study |
| **NFR04** | Performance | non-AI API P95 ≤2 s; end-to-end text feedback P95 ≤15 s under agreed load; voice P95 set after profiling | load test by endpoint and mode |
| **NFR05** | Availability | ≥99.5% measured calendar month for R1 production endpoint | synthetic monitoring |
| **NFR06** | Unit economics | cost per completed session measured and budget alert enabled; plan price is a business decision | usage/cost dashboard |
| **NFR07** | Localization | Thai/English UI and content acceptance tests by native speakers for enabled languages | test cases per locale |
| **NFR08** | Accessibility | WCAG 2.2 AA targeted for core web workflows; mobile responsive browser support | axe + keyboard/manual tests |
| **NFR09** | Retention | raw voice default purge after processing (≤24 h hard cap), opt-in ≤90 d draft; account erasure workflow ≤30 d where legally appropriate | storage deletion evidence and backup test |
| **NFR10** | Payment scope | hosted/tokenized gateway; never store PAN/CVV; independently scope PCI obligations | data-flow & security review |
| **NFR11** | Transaction security | TLS, verify gateway webhook signatures or provider-authenticated mechanisms and replay protection | malformed/replay tests |
| **NFR12** | Idempotency | duplicate payment event causes exactly one business fulfillment | repeat/out-of-order event tests |
| **NFR13** | Payment processing visibility | redirect P95 ≤5s under app control; webhook confirmation displayed as pending until verified | observability of async payment |
| **NFR14** | Payment availability | monitor provider and offer recoverable pending state; backup gateway optional with business approval | failover tabletop |
| **NFR15** | Auditability | 100% audited critical business state transitions; daily reconciliation when payments live | reconciliation report |
| **NFR16** | Tax compliance | issue legally required documents for operating entity; formal tax validation needed before R3 | legal checklist and document tests |
| **NFR17** | Research disclosure risk | minimum cell size 10 distinct users, suppress complementary small cells and test differencing; NOT equivalent to formal k-anonymity | privacy re-identification review |
| **NFR18** | Voice isolation | research roles have 0 raw audio access; admin access exceptional approval, time-limited, fully logged | permission tests |
| **NFR19** | Authorization | cross-account IDOR attempts denied on every protected endpoint; default deny | automated negative permission suite |
| **NFR20** | LLM safety | injection/unsafe output regression suite; model output treated as untrusted | red-team test prompts |
| **NFR21** | Model governance | store model/prompt/rubric version and rerun benchmark for each release | CI model evaluation report |
| **NFR22** | Scalability | 100 concurrent active users baseline load test; failures ≤1% for non-AI API (proposed) | load test results |
| **NFR23** | Recovery | RPO ≤24h and RTO ≤8h proposed; quarterly restore drill | restore drill |
| **NFR24** | Monitoring | request correlation IDs, error/latency/AI cost dashboards; logs sanitized | observability walkthrough |

> [!NOTE]
> **คำชี้แจงเป้าหมายการทดสอบ NFR (Acceptance Targets Notice)**  
> หมายเหตุ: ค่ากำหนดเชิงตัวเลขในหัวข้อนี้เป็น acceptance targets ที่เสนอสำหรับการทดสอบ ไม่ใช่ค่าที่อนุมานจากแบบสอบถามหรือผลทดสอบที่ผ่านแล้ว; ก่อน production launch ต้องมีผลทดสอบบันทึกประกอบ

---

## 7. Role, Authorization and Entitlements

Security roles: guest (unauthenticated), user, researcher, finance_admin, system_admin; Free/Basic/Pro เป็น subscription tiers ไม่ใช่ roles. ผู้ใช้หนึ่งรายมีได้หลาย role ผ่าน USER_ROLES โดย default เป็น user. ผู้ดูแลไม่สามารถดูคำตอบ/เสียงของผู้ใช้เพียงเพราะเป็น admin

| Resource / Action | Guest | User (own) | Researcher | Finance Admin | System Admin |
| --- | --- | --- | --- | --- | --- |
| **Public page** | Allow | Allow | Allow | Allow | Allow |
| **Create own interview** | Trial only if enabled | Allow + entitlement | Deny | Deny | Deny |
| **Own history/export/delete** | Deny | Allow | Deny | Deny | Deny |
| **Raw voice** | Deny | Own + retention | Deny | Deny | Exceptional JIT audited |
| **Rubric/question publish** | Deny | Deny | Deny | Deny | Permission-based |
| **Aggregate research** | Deny | Deny | Approved scoped | Deny | Approved scoped only |
| **Contact list** | Deny | Own | Explicit purpose-grant | Deny | Deny default |
| **Payments/refunds** | Deny | Own/request | Deny | Approve/execute by permission | No implicit approval |
| **Audit log** | Deny | Own status only | Research own actions | Finance scoped | Security scoped |

**Authorization Rule:** Authorization decision = authenticated identity + role permission + resource ownership + package entitlement + declared purpose/consent where relevant + account status. Backend/API/DB/storage each enforce. Database service credentials cannot bypass user authorization logic. Permissions include: interview:create, interview:read:own, interview:delete:own, feedback:read:own, data:export:own, voice:read:own, question:manage, rubric:publish, ai_config:publish, packages:edit, packages:publish, refund:request, refund:approve, research:aggregate:read, research:contact:read, audit:read.

---

## 8. AI Layer and Evaluation

- **Pipeline (กระบวนการ AI Scorer):** contextual intake → approved question bank / controlled generation → response capture → optional STT → rubric scorer with structured JSON schema → validation/evidence check → feedback renderer → persistence with versions.
- **RAG / Embedding ทางเลือก:** RAG/embedding เป็นเทคโนโลยีทางเลือกเมื่อมี curated source corpus และ benchmark แสดงความคุ้มค่า; ไม่ใช่ requirement บังคับใน R1.
- **Rubric เกณฑ์การให้คะแนน:** relevance, completeness, structure/clarity (normalized 0–100); grammar/speech separate. Human-approved rubric weights and versions required before evaluation.
- **Dataset ชุดข้อมูลทดสอบ:** Thai/English interview questions, representative novice/advanced answers, edge cases, mixed-language responses, refusals, fabricated facts, injection cases. ขออนุญาตใช้ข้อมูลและ de-identify ก่อนสร้าง benchmark.
- **Validation การตรวจสอบความถูกต้อง:** blind scoring by ≥2 human raters on held-out sample; measure inter-rater agreement before comparing AI correlation/MAE; quality review sample from each version.
- **Failure Mode การจัดการกรณีระบบขัดข้อง:** invalid schema, network error or low confidence feedback returns retry/needs-review rather than invented score. Users can report problematic feedback.
- **ข้อจำกัดและข้อควรระวัง (AI Constraints):** No inference of personality, mental-health status or certain confidence from acoustics; present only measurable speech behaviors with disclaimers.

---

## 9. Privacy, Consent and Research Data

Data classification: identity/contact = personal; answers/transcripts/audio = personal and potentially sensitive depending on use; raw voice is not automatically classified as statutory biometric data absent biometric identification processing, but still deserves strict safeguards. Processing purpose and lawful basis must be recorded separately per activity and reviewed under Thai PDPA as applicable.

| Purpose key | Default | Consequence |
| --- | --- | --- |
| **service_core** | notice + applicable lawful basis | Required functionality only; do not force optional research consent |
| **research_analysis** | Opt-in / approved basis as applicable | No research sharing when not valid |
| **research_contact** | Opt-in separately | Only approved contact staff can access |
| **voice_retention** | Off unless opted in | Purge raw audio after processing per lifecycle |
| **marketing** | Off unless separately authorized | No bundled consent |

> [!WARNING]
> **นโยบายความปลอดภัยข้อมูลการวิจัย (Research Data Security & RLS Policy)**  
> RLS policy must not equate research_analysis with research_contact. Researcher has no direct access to users/answers/feedback raw tables. Aggregate export is generated by a privileged service that applies approved purpose, suppression, deduplication and access audit. Contact access is purpose-scoped service API with explicit authorization; avoid direct researcher DB login.

**Audio lifecycle: temporary encrypted processing; no longer than necessary (draft default ceiling 24h) for non-opted-in raw audio; optional retention ≤90d; deletion requests processed promptly (draft SLA ≤30d except legal holds); backups expire via documented lifecycle. These are proposed product policies, not statutory fixed periods.**

---

## 10. Package, Payment and Refund Governance

> [!WARNING]
> **ข้อจำกัดและข้อควรระวังด้านแพ็กเกจ (R3 Scope Warning)**  
> R3 only. Proposed tiers from Claude: Free 5 sessions/month, Basic 30, Pro unlimited; voice 0/10/unlimited. These are configuration examples, not evidence-based approved limits. Unlimited must have documented fair-use controls. No package prices have been approved. Validate unit cost before release.

| Business decision | Previous draft | Final baseline control |
| --- | --- | --- |
| **Package quota** | Free 5 / Basic 30 / Pro unlimited | Configuration proposal, not commercial approval |
| **Cooling-off** | 7 days + ≤20% quota auto-refund | Not enforceable until policy/legal sign-off |
| **Auto-renew** | Manual and automatic | Auto-renew requires explicit opt-in; cancellation policy approval |
| **Tax invoice** | e-Tax automated | Enable when entity legal obligations and provider integration confirmed |
| **Gateway** | Omise/2C2P candidates | Select provider after operational/security/fee assessment |

**Payment state machine: initiated → pending → confirmed/failed; refund_requested → approved/rejected → processing → refunded/failed. Process gateway events idempotently, verify authenticity and reconcile periodically. All entitlement grants from confirmed payments only. Store approval policy_version with refunds.**

---

## 11. Data Model and Data Dictionary

Source Data Dictionary มี 14 ตารางแต่ไม่เพียงพอสำหรับ OAuth, multi-role, consent history, research purpose, AI versioning, quotas/refunds และ reconciliation. Baseline เพิ่มตารางที่จำเป็นและตัด FK ไป ORGANIZATIONS ที่ยังไม่มีจนกว่า B2B ถูกอนุมัติ. ใช้ TIMESTAMPTZ (UTC), UUID key, proper foreign keys/indexes; text status constrained by enum/check. โครงสร้างด้านล่างเป็น logical schema ที่ต้องทำ physical DDL พร้อม migrations ก่อน implement

| Table | Key fields / types | Purpose and controls |
| --- | --- | --- |
| **USERS** | id UUID PK; email CITEXT UNIQUE; display_name TEXT NULL; current_status TEXT NULL; skill_level TEXT NULL; created_at TIMESTAMPTZ; deleted_at TIMESTAMPTZ NULL | Do not require password for OAuth-only; no organization FK in R1 |
| **AUTH_IDENTITIES** | id UUID PK; user_id FK; provider TEXT; provider_subject TEXT; password_hash TEXT NULL; UNIQUE(provider,provider_subject) | email identity password can be NULL for OAuth |
| **ROLES** | id UUID PK; code TEXT UNIQUE | user/researcher/finance_admin/system_admin |
| **USER_ROLES** | user_id FK; role_id FK; assigned_by FK NULL; assigned_at TIMESTAMPTZ; PK(user_id,role_id) | multiple roles |
| **PERMISSIONS** | id UUID PK; code TEXT UNIQUE | authorization catalog |
| **ROLE_PERMISSIONS** | role_id FK; permission_id FK; PK(role_id,permission_id) | least privilege grants |
| **CONSENT_EVENTS** | id UUID PK; user_id FK; purpose_key TEXT; action TEXT; notice_version TEXT; legal_basis TEXT; occurred_at TIMESTAMPTZ | append-only history; service uses latest valid consent |
| **CONTACT_DETAILS** | id UUID PK; user_id FK; channel TEXT; encrypted_value BYTEA; created_at TIMESTAMPTZ | separate encrypted contact info |
| **INTERVIEW_SESSIONS** | id UUID PK; user_id FK; interview_type TEXT; mode TEXT; difficulty TEXT; rubric_version_id FK; status TEXT; started_at TIMESTAMPTZ; completed_at TIMESTAMPTZ NULL | session status and reproducible scoring context |
| **SESSION_QUESTIONS** | id UUID PK; session_id FK; question_bank_id FK NULL; question_text TEXT; sequence_no INT; UNIQUE(session_id,sequence_no) | avoid duplicated questions |
| **ANSWERS** | id UUID PK; question_id FK; answer_type TEXT; answer_text TEXT; answered_at TIMESTAMPTZ | may have multiple attempts with attempt_number |
| **AUDIO_OBJECTS** | id UUID PK; answer_id FK; storage_key TEXT; expires_at TIMESTAMPTZ; deleted_at TIMESTAMPTZ NULL | never expose permanent public audio URL |
| **RUBRIC_VERSIONS** | id UUID PK; rubric_key TEXT; version TEXT; criteria JSONB; published_at TIMESTAMPTZ NULL | immutable published versions |
| **AI_CONFIG_VERSIONS** | id UUID PK; model_identifier TEXT; prompt_hash TEXT; parameter_json JSONB; created_at TIMESTAMPTZ | no API secrets |
| **FEEDBACK** | id UUID PK; answer_id FK; rubric_version_id FK; ai_config_version_id FK; score NUMERIC; dimension_scores JSONB; evidence JSONB; comments TEXT; status TEXT; created_at TIMESTAMPTZ | replace unjustified confidence_score with speech_metrics separate |
| **SPEECH_METRICS** | id UUID PK; answer_id FK UNIQUE; pace_wpm NUMERIC; pauses JSONB; filler_words JSONB | R2 measurable signals only |
| **QUESTIONS_BANK** | id UUID PK; category TEXT; locale TEXT; question_text TEXT; status TEXT; version INT | controlled content |
| **PACKAGES** | id UUID PK; tier TEXT; price NUMERIC; currency TEXT; duration_days INT; version INT; active BOOL | R3 only |
| **PACKAGE_ENTITLEMENTS** | package_id FK; feature_key TEXT; quota_limit INT NULL; unit TEXT; PRIMARY KEY(package_id,feature_key) | R3 only |
| **SUBSCRIPTIONS** | id UUID PK; user_id FK; package_id FK; starts_at TIMESTAMPTZ; ends_at TIMESTAMPTZ; status TEXT; auto_renew BOOL | R3 |
| **USAGE_LEDGER** | id UUID PK; user_id FK; feature_key TEXT; amount INT; period_key TEXT; request_key TEXT UNIQUE; created_at TIMESTAMPTZ | atomic quota accounting |
| **PAYMENT_EVENTS** | id UUID PK; provider TEXT; external_event_id TEXT; status TEXT; payload_hash TEXT; received_at TIMESTAMPTZ; UNIQUE(provider,external_event_id) | idempotent gateway processing |
| **TRANSACTIONS** | id UUID PK; subscription_id FK; gateway_ref TEXT; amount NUMERIC; currency TEXT; status TEXT; paid_at TIMESTAMPTZ NULL | R3 |
| **REFUND_REQUESTS** | id UUID PK; transaction_id FK; user_id FK; status TEXT; policy_version TEXT; requested_at TIMESTAMPTZ; decided_by FK NULL | R3 decisions/audit |
| **RESEARCH_DATASETS** | id UUID PK; purpose_key TEXT; approved_by FK; schema_version TEXT; release_state TEXT | R3 dataset approval |
| **RESEARCH_ACCESS_LOG** | id UUID PK; researcher_id FK; dataset_id FK; query_hash TEXT; records_returned INT; accessed_at TIMESTAMPTZ | R3 audit |
| **AUDIT_LOG** | id UUID PK; actor_id UUID NULL; action TEXT; entity_type TEXT; entity_id UUID; request_id TEXT; redacted_diff JSONB; created_at TIMESTAMPTZ | append-only; no secrets/PII dumps |
| **DATA_RIGHTS_REQUESTS** | id UUID PK; user_id FK; request_type TEXT; status TEXT; requested_at TIMESTAMPTZ; completed_at TIMESTAMPTZ NULL | request workflow |

### 11.1 Corrected research aggregation relationship

ห้ามใช้ FEEDBACK.answer_id = INTERVIEW_SESSIONS.id เพราะ foreign key อยู่ที่ ANSWERS.id. ตัวอย่าง query ต่อไปนี้เป็น conceptual read-only aggregation โดยต้องกรอง approved research-purpose eligibility ก่อน materialize และนับ DISTINCT users เพื่อลดการนับผู้ใช้ซ้ำ:

#### Listing 11.1: ตัวอย่าง Conceptual Read-only Query สำหรับ Research Aggregation

```sql
SELECT s.interview_type, s.difficulty,
       AVG(f.score) AS avg_score,
       COUNT(DISTINCT s.user_id) AS distinct_users
FROM interview_sessions s
JOIN session_questions q ON q.session_id = s.id
JOIN answers a ON a.question_id = q.id
JOIN feedback f ON f.answer_id = a.id
JOIN research_eligible_user_ids e ON e.user_id = s.user_id
WHERE f.status = 'completed'
GROUP BY s.interview_type, s.difficulty
HAVING COUNT(DISTINCT s.user_id) >= 10;
```

> [!CAUTION]
> **ข้อควรระวังด้านความเป็นส่วนตัว (Privacy & Aggregation Notice)**  
> research_eligible_user_ids เป็น restricted interface ที่ต้องมี security review และ authorization ตาม purpose. แม้ distinct_users ≥10 ยังต้องพิจารณา small-cell and differencing attacks; ไม่ใช่หลักฐานรับรอง k-anonymity.

---

## 12. Architecture, Interfaces, Operations

| Layer | R1 Baseline | R2/R3 Options |
| --- | --- | --- |
| **Frontend** | Next.js + TypeScript Responsive Web | React Native mobile only if approved |
| **Backend** | NestJS REST/OpenAPI, auth, validation, Prisma/PostgreSQL | Payment worker and research export service |
| **AI adapter** | Provider-agnostic LLM adapter with schema validation | STT, embeddings/RAG after evaluation |
| **Storage** | PostgreSQL + encrypted object storage as necessary | Redis/BullMQ queues and pgvector if justified |
| **Infra** | Docker, CI, managed service/VM acceptable | Kubernetes/Terraform/ArgoCD optional scaling |
| **Monitoring** | error, latency, token usage, audit security events | payment and research dashboards |

**External interfaces: HTTPS REST JSON; AI provider API via backend only; STT provider via secure temporary object or streaming in R2; payment gateway via provider-authenticated webhooks in R3. Credentials via secret manager, never embedded in frontend. Define API endpoint contract separately with OpenAPI before implementation.**

---

## 13. Traceability and Verification

| Evidence / Risk | FR mapping | NFR / test mapping |
| --- | --- | --- |
| Tailored interview questions (94/102) | FR02–FR04, FR07 | NFR02, NFR21; categorization test |
| Feedback and scoring (58/102) | FR08, FR11, FR36 | NFR02, NFR04; rubric evaluation |
| Language analysis (57/102) | FR09 | NFR07, NFR21; bilingual labeled tests |
| Voice (38/102) | FR05-V, FR05.1, FR10 | NFR09, NFR18; STT/privacy tests |
| Privacy concern (57/102) | FR17, FR18, FR18.1, FR35 | NFR01, NFR17–19; permission/privacy tests |
| Cross-platform preference (84/102) | FR15 | NFR08; responsive browser tests |
| Payment requirements (not survey-validated) | FR19–FR31 | NFR10–16; R3 signoff and sandbox tests |

**Acceptance process: Unit tests → Integration tests → E2E → Authorization negative tests → AI evaluation suite → Security/privacy review → UAT. Each release closes only its included FR/NFR and logged defects. Test cases have unique identifiers and map to FR IDs. No engineering metric is recorded as achieved until measured with timestamp, environment and artifact.**

---

## 14. Risks, Decisions and Approval Conditions

| ID | Open decision / Risk | Owner | Gate |
| --- | --- | --- | --- |
| **D01** | Approve R1/R2/R3 boundaries and native-app timing | Product Owner | Before sprint planning |
| **D02** | Approve AI rubric, target metrics and sample set | AI lead + QA | Before UAT |
| **D03** | Approve retention periods and PDPA lawful-basis mapping | Privacy/Legal | Before production personal-data processing |
| **D04** | Select provider and budget caps | Tech Lead | Before live API spend |
| **D05** | Approve package pricing, quotas and refund terms | Business/Legal | Before R3 billing launch |
| **D06** | Define research scope, data-sharing and consent/legal basis | Research Owner/Privacy | Before R3 research access |
| **D07** | Sign formal SRS approval and acceptance owner | Sponsor | Before marking approved |

---

## Change log

| Version | Date | Summary |
| --- | --- | --- |
| **0.x** | Original Claude SRS | Initial 11-chapter draft |
| **0.9** | 08 Oct 2026 | Review addendum and survey validation |
| **1.0** | 08 Oct 2026 | Consolidated baseline; direct correction of FR/NFR/RBAC/consent/data model; release separation; traceability; sign-off pending |

---

> **— END OF CONTROLLED DOCUMENT (สิ้นสุดเอกสารควบคุม) —**  
> Document ID: IX-SRS-001 | Version: 1.0 Baseline | Date: 08 October 2026
