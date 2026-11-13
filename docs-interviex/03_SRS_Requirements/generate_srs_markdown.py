# Script to generate InterviewX_SRS_v1.1_DRAFT.md
import os

out_path = r"D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_v1.1_DRAFT.md"

md_content = """# InterviewX — Software Requirements Specification (SRS)

> **SYSTEM REQUIREMENTS SPECIFICATION**  
> `REVISED BASELINE — VERSION 1.1 DRAFT (PHASE 1 REQUIREMENT ALIGNMENT)`

> [!WARNING]
> **สถานะการควบคุมเอกสาร (Document Governance Notice)**  
> วันที่จัดทำ: 13 พฤศจิกายน 2026 | เอกสารฉบับร่างสำหรับกระบวนการทบทวนและขออนุมัติอย่างเป็นทางการ (Phase 1 Requirement Alignment)  
> สถานะการควบคุม: Revised content baseline; formal stakeholder signatures pending. เอกสารฉบับนี้จัดทำขึ้นเพื่อกำหนดขอบเขตและจัดแนวความสอดคล้องระหว่าง **Web Application** และ **Native Mobile Application** (iOS / Android) ร่วมกับ Shared Backend Architecture คำว่า Baseline ไม่หมายความว่ามีการลงนามรับรองแล้ว

### Document Metadata

| Specification | Details |
|---|---|
| **Document ID** | IX-SRS-001 |
| **Classification** | Controlled Document • Pending Stakeholder Sign-off |
| **Document Version** | 1.1 DRAFT (Phase 1: Requirement Alignment) |
| **Scope Model** | R1 Core MVP | R2 Enhanced AI & Mobile | R3 Commercial & Research |
| **Tech Stack** | Next.js Responsive Web + Native Mobile (iOS/Android) + NestJS Modular API + Hosted AI Adapter |

---

## Document control

| รายการ | รายละเอียด |
|---|---|
| **Document ID** | IX-SRS-001 |
| **Version** | 1.1 DRAFT |
| **Status** | Draft for Review — Phase 1 Requirement Alignment (Pending Stakeholder Sign-off) |
| **Sources** | InterviewX_SRS_Final_For_Approval_v1.0.docx; InterviewX_FR_NFR_RBAC.xlsx; Requirement Survey CSV (n=102); ALL_DIAGRAMS.md; Phase 1 Platform Separation Guidelines |
| **Change policy** | การเปลี่ยนข้อกำหนดหลัง baseline v1.0 ต้องบันทึก Change Request พร้อมผลกระทบ ขอบเขตแพลตฟอร์ม และผู้อนุมัติ |
| **Scope model** | R1 Core MVP (Web Baseline & Mobile-Ready API); R2 Enhanced AI & Native Mobile; R3 Commercial & Research |

### Approval record

| ตำแหน่ง | ชื่อ/ลายเซ็น | วันที่ | สถานะ |
| --- | --- | --- | --- |
| **Product owner / Sponsor** | ________________ | ________ | Pending Review |
| **Technical lead / Architect** | ________________ | ________ | Pending Review |
| **Mobile Lead / Architect** | ________________ | ________ | Pending Review |
| **Privacy / Legal reviewer** | ________________ | ________ | Pending Review |
| **QA / Acceptance owner** | ________________ | ________ | Pending Review |

---

## สารบัญเนื้อหา

| หมวด | ชื่อหมวด |
|---|---|
| **หมวด 01** | [1. Introduction & Governance](#1-introduction--governance) |
| **หมวด 02** | [2. Evidence and Stakeholders](#2-evidence-and-stakeholders) |
| **หมวด 03** | [3. Scope, Assumptions and Release Plan](#3-scope-assumptions-and-release-plan) |
| **หมวด 04** | [4. System Context and Use Cases](#4-system-context-and-use-cases) |
| **หมวด 05** | [5. Functional Requirements (FR01–FR36)](#5-functional-requirements) |
| **หมวด 06** | [6. Non-Functional Requirements (NFR01–NFR24)](#6-non-functional-requirements) |
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

InterviewX คือแพลตฟอร์มฝึกสัมภาษณ์ด้วย AI เพื่อจำลองคำถาม ประเมินคำตอบด้วย rubric ที่อธิบายได้ และช่วยให้ผู้ใช้ปรับปรุงการตอบแบบต่อเนื่อง รองรับภาษาไทย/อังกฤษ ระบบถูกออกแบบโดยแยกส่วนการแสดงผลออกเป็น 2 Client Frontends หลัก:
1. **Responsive Web Application:** รองรับการใช้งานผ่านเว็บบราวเซอร์บน Desktop, Tablet และ Mobile Browser เพื่อให้บริการทั้งผู้ใช้ทั่วไป (Guest, Registered User) และผู้ปฏิบัติงานภายใน (Researcher, Finance Admin, System Admin)
2. **Native Mobile Application:** แอปพลิเคชันแบบติดตั้งแยกต่างหากบนระบบปฏิบัติการ iOS และ Android ซึ่งออกแบบมาเฉพาะสำหรับกลุ่ม End Users (Guest, Registered User) โดยรองรับสิทธิ์การใช้งานตามแพ็กเกจ (Free, Basic, Pro)

ทั้งสองแพลตฟอร์มทำงานเชื่อมโยงกับ **Shared Backend Architecture** เดียวกันผ่าน Authorized REST APIs เพื่อให้มั่นใจในความสอดคล้องของข้อมูล ความปลอดภัย และการบริหารจัดการแบบศูนย์กลาง

> [!IMPORTANT]
> **ลำดับการบังคับใช้ข้อกำหนด (Precedence & Authority)**  
> เอกสารฉบับนี้เป็นข้อกำหนดเชิงบังคับสำหรับฟังก์ชันใน release ที่อนุมัติเท่านั้น; ข้อกำหนดใน R2/R3 และการเปิดตัว Native Mobile App ยังไม่เป็น commitment บังคับของ R1 ลำดับบังคับใช้: ข้อกำหนดฉบับนี้ (v1.1 DRAFT เมื่อผ่านการอนุมัติ) > Baseline v1.0 > test cases ที่อ้างอิง > เอกสารร่างเดิม ห้ามถือข้อความในเอกสารเดิมที่ขัดแย้งกันเป็นข้อกำหนดพร้อมกัน

### คำศัพท์และตัวย่อสำคัญ (Definitions & Acronyms):

- **FR:** Functional Requirement (ข้อกำหนดเชิงฟังก์ชัน)
- **NFR:** Non-Functional Requirement (ข้อกำหนดเชิงคุณภาพ/ไม่ใช่ฟังก์ชัน)
- **RBAC:** Role-Based Access Control (การควบคุมการเข้าถึงตามบทบาท)
- **Entitlement:** สิทธิ์และโควตาการใช้งานตามแพ็กเกจสมาชิก (Free, Basic, Pro) ซึ่งไม่ใช่ Security Role
- **Platform Scope:** ขอบเขตของระบบที่เปิดให้เข้าถึงผ่าน Web Application หรือ Native Mobile Application
- **RLS:** Row-Level Security (ความปลอดภัยระดับแถวข้อมูลในฐานข้อมูล)
- **STT:** Speech-to-Text (การแปลงเสียงเป็นข้อความ)
- **HIG:** Apple Human Interface Guidelines (แนวทางการออกแบบแอปพลิเคชันบน iOS)
- **IAP:** In-App Purchase (การชำระเงินผ่านระบบของ Apple App Store หรือ Google Play)
- **APNs / FCM:** Apple Push Notification service / Firebase Cloud Messaging (ระบบแจ้งเตือนทางมือถือ)
- **Keystore / Keychain:** กลไกจัดเก็บข้อมูลลับและกุญแจเข้ารหัสระดับฮาร์ดแวร์บนระบบปฏิบัติการ Android และ iOS
- **P95:** 95th percentile (เกณฑ์วัดประสิทธิภาพที่ 95% ของคำขอต้องเร็วกว่าค่าที่ระบุ)
- **UAT:** User Acceptance Test (การทดสอบเพื่อการยอมรับของผู้ใช้)
- **R1/R2/R3:** Release 1 (Core MVP), Release 2 (Enhanced AI & Mobile), Release 3 (Commercial & Research)

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

**ผลสำรวจด้านแพลตฟอร์ม (Cross-Platform Evidence):**
- ผู้ตอบแบบสำรวจ **84/102 คน (82.4%)** ระบุความต้องการใช้งานทั้งบนคอมพิวเตอร์ (Web) และบนโทรศัพท์มือถือ (Mobile)
- ผลวิเคราะห์สถาปัตยกรรม: ใน R1 ระบบเปิดตัวด้วย Responsive Web เพื่อให้ครอบคลุมการใช้งานบน Desktop, Tablet และ Mobile Browser อย่างรวดเร็ว พร้อมทั้งออกแบบ Shared Backend REST APIs ให้พร้อมรองรับ Native Mobile Application (iOS / Android) ซึ่งวางแผนเปิดตัวในระยะถัดไป (R2 ตามข้อเสนอ หรือตามการตัดสินใจ D-M01)
- ผู้ตอบ 64/102 ไม่เคยได้รับ feedback หลังการสัมภาษณ์; ความกังวลเกี่ยวกับความแม่นยำ feedback 67/102, ความเป็นส่วนตัว 57/102, ภาษา 57/102

**ผู้มีส่วนได้ส่วนเสีย (Stakeholders):**
1. **ผู้ฝึกสัมภาษณ์ (Candidates / End Users):** ใช้งานผ่าน Responsive Web และ Native Mobile App (Guest, Registered User)
2. **ผู้วิจัย (Researchers):** ใช้งานผ่าน Web Application เท่านั้นเพื่อเข้าถึงข้อมูลวิจัยที่อนุมัติ (R3)
3. **ผู้ดูแลระบบการเงิน (Finance Admin):** ใช้งานผ่าน Web Application เท่านั้นเพื่อดูแลรายการชำระเงินและคืนเงิน (R3)
4. **ผู้ดูแลระบบ (System Admin):** ใช้งานผ่าน Web Application เท่านั้นในการจัดการ Question Bank, Rubric, Prompt และ Audit Log
5. **Product Owner, AI Lead, Backend/Frontend/Mobile Lead, QA และ Data Privacy Officer**

---

## 3. Scope, Assumptions and Release Plan

| Release | ขอบเขตที่ตกลง (Scope Baseline) | ขอบเขตแพลตฟอร์ม (Platform Boundaries) | สิ่งที่ไม่รวมใน Release (Out-of-Scope) |
| --- | --- | --- | --- |
| **R1 / Core MVP** | Email/Password login, onboarding, 1+ interview category, text practice, AI rubric scoring & actionable feedback, history, responsive UI, privacy controls, basic admin configuration. Backend REST APIs mobile-ready. | **Web Application:** รองรับ Desktop, Tablet, Mobile Browser ครอบคลุม End User และ Admin | Payment, voice analytics, native mobile apps, researcher export, B2B multi-tenancy |
| **R2 / Enhanced AI & Mobile** | Voice/STT practice with granular consent, communication measurements (pace, pauses, fillers), English grammar analysis, adaptive difficulty, progress dashboard, sample responses. **Native Mobile App (iOS / Android)** for End Users (Pending D-M01). | **Web Application:** ฟังก์ชันทั้งหมด<br>**Native Mobile App:** ฟังก์ชันเฉพาะ End Users (Text & Voice Practice, History, Dashboard) | Commercial payment gateway (เว้นแต่ R3 ได้รับอนุมัติ), Admin บน Mobile, Researcher บน Mobile |
| **R3 / Commercial & Research** | Subscription tiers (Free, Basic, Pro), atomic entitlement ledger, payment gateway / Mobile IAP (D-M04), invoices/receipts, renewal & refund workflows, Finance tools, governed research data releases. | **Web Application:** ทุกบทบาท<br>**Native Mobile App:** End Users (แสดงข้อมูลแพ็กเกจ, โควตา, ประวัติธุรกรรม) | B2B organization enterprise management, การเข้าถึงเครื่องมือ Admin/Researcher ผ่าน Mobile |

> [!NOTE]
> **สมมติฐานหลักของระบบ (System Assumptions)**  
> 1. ทั้ง Web Application และ Native Mobile Application ใช้ Shared Backend Architecture เดียวกันผ่าน HTTPS REST APIs โดยไม่มีการแยก Database หรือทำ Business Logic ซ้ำซ้อน  
> 2. Native Mobile Application จำกัดเฉพาะ End Users (Guest, Registered User) เท่านั้น; ฟังก์ชัน Admin และ Researcher ทั้งหมดเปิดให้ใช้งานผ่าน Web Application เท่านั้น  
> 3. โมบายแอปพลิเคชันจัดเก็บ Authentication Token ใน Secure Hardware Storage (iOS Keychain / Android Keystore) เท่านั้น  
> 4. การฝึกสัมภาษณ์ด้วย AI ต้องการการเชื่อมต่ออินเทอร์เน็ต (Online-required); โมบายแอปจะรองรับการเก็บ Transient Cache สำหรับร่างคำตอบเพื่อป้องกันข้อมูลสูญหายเมื่อเครือข่ายขัดข้อง แต่ไม่มี On-device AI Processing ใน R1/R2 (Pending D-M08)  
> 5. สามารถใช้ LLM แบบ hosted ผ่าน backend adapter โดยไม่ต้องฝึกโมเดลใหม่เองใน R1; ไม่บันทึก raw audio ใน R1; การใช้ข้อมูล survey ต้องเคารพ consent

---

## 4. System Context and Use Cases

| UC | Actor | Trigger / Result | Platform Scope | Release |
| --- | --- | --- | --- | --- |
| **UC01** | Guest | สมัครสมาชิก / ยืนยันอีเมล / Login สำเร็จหรือแจ้งข้อผิดพลาด | Web & Native Mobile | R1 |
| **UC02** | User | กำหนดบริบท ประเภท และระดับความยากของการฝึกสัมภาษณ์ | Web & Native Mobile | R1 |
| **UC03** | User | เริ่มฝึก / ส่งคำตอบข้อความ / จบหรือยกเลิกเซสชัน | Web & Native Mobile | R1 |
| **UC04** | User | รับคะแนน Feedback คำแนะนำ และเหตุผลที่อ้างอิงคำตอบตนเอง | Web & Native Mobile | R1 |
| **UC05** | User | ดูประวัติ / ส่งออกข้อมูลตนเอง / ขอลบข้อมูล (DSR) | Web & Native Mobile | R1 |
| **UC06** | Admin | จัดการ Question Bank, Rubric, Prompt Version และดู Audit Log | **Web Only** | R1 |
| **UC07** | User | ฝึกสัมภาษณ์ด้วยเสียง (Voice/STT) และดูตัวชี้วัดการพูด | Web & Native Mobile | R2 |
| **UC08** | User | ดู Dashboard แสดงพัฒนาการคะแนนและประวัติการฝึก | Web & Native Mobile | R2 |
| **UC09** | User/Gateway | ซื้อแพ็กเกจ / ต่ออายุ / ขอยกเลิกหรือขอคืนเงิน | Web & Native Mobile (D-M04) | R3 |
| **UC10** | Researcher | ขอเข้าถึงและส่งออกชุดข้อมูลวิจัยสรุปภาพรวมที่ได้รับอนุมัติ | **Web Only** | R3 |

---

## 5. Functional Requirements

*ข้อกำหนดเชิงฟังก์ชัน (FR01–FR36) ครอบคลุมความสามารถหลักของระบบ InterviewX ทั้งบน Web Application และ Native Mobile Application โดยคงรหัสข้อกำหนด (FR ID) เดิมอย่างสมบูรณ์ พร้อมระบุความสอดคล้องด้านแพลตฟอร์มอย่างชัดเจน*

### FR01 — Registration, login and session security
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Original SRS FR01 / engineering correction`
- **ข้อกำหนด (Requirement):** สมัครสมาชิกด้วยอีเมล ยืนยันอีเมล เข้าสู่ระบบ ออกจากระบบ รีเซ็ตรหัสผ่าน และจัดการ Session อย่างปลอดภัย รองรับการใช้งานทั้งบน Responsive Web และ Native Mobile Application โดยใช้ระบบบัญชีและ Identity Provider เดียวกัน
- **เกณฑ์การยอมรับ (Acceptance Criteria):** อีเมลซ้ำไม่สร้างบัญชี; รหัสผ่านถูกเข้ารหัสด้วย Argon2id/bcrypt; Expired/revoked token ถูกปฏิเสธทันที; Web จัดเก็บใน Secure HTTP-only cookies; Mobile จัดเก็บ refresh token ใน iOS Keychain / Android Keystore; ป้องกัน Brute-force ด้วย Rate Limiting

### FR02 — User status and profile
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Survey + FR02`
- **ข้อกำหนด (Requirement):** ผู้ใช้สามารถระบุหรือแก้ไขสถานะปัจจุบัน (นักศึกษา/ผู้หางาน) และเป้าหมายการฝึกสัมภาษณ์ผ่าน Onboarding หรือหน้า Profile ได้ทั้งบน Web และ Mobile โดยสามารถข้ามขั้นตอน Onboarding ได้
- **เกณฑ์การยอมรับ (Acceptance Criteria):** มีตัวเลือก Other/Skip; ข้อมูล Profile ซิงค์ตรงกันข้ามแพลตฟอร์ม; การแก้ไข Profile ไม่ส่งผลย้อนหลังต่อข้อมูลเซสชันเก่าที่เสร็จสิ้นไปแล้ว

### FR03 — Skill configuration
`[ R2 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR03`
- **ข้อกำหนด (Requirement):** ผู้ใช้เลือกระดับความชำนาญ Beginner, Intermediate หรือ Advanced หรือให้ระบบเสนอระดับตามประวัติการฝึก โดยไม่บังคับ
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ระดับทักษะถูกบันทึกกำกับไว้ใน Session Data; ซิงค์ข้อมูลข้ามแพลตฟอร์ม; การเปลี่ยนระดับไม่เขียนทับผลการประเมินในอดีต

### FR04 — Interview category/question delivery
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Survey 94/102; FR04`
- **ข้อกำหนด (Requirement):** ผู้ใช้เลือกหมวดการสัมภาษณ์ และระบบดึงคำถามจาก Question Bank ตามหมวดที่เลือกมาแสดงผลทั้งบน Web และ Mobile
- **เกณฑ์การยอมรับ (Acceptance Criteria):** R1 รองรับคำถามสัมภาษณ์งานอย่างน้อย 1 หมวด; ทดสอบความตรงหมวด ≥95% บนชุดตัวอย่างที่ติดป้ายโดยมนุษย์; คำถามที่แสดงบน Web และ Mobile มีโครงสร้างเดียวกัน

### FR05 — Text answer submission
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR05 split`
- **ข้อกำหนด (Requirement):** รับและบันทึกคำตอบในรูปแบบข้อความอย่างปลอดภัยจากทั้ง Web และ Mobile ก่อนส่งเข้าคิวประเมินผลของ AI
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ป้องกันการส่งคำตอบว่าง; ส่งพร้อม Idempotency-Key header เพื่อป้องกันการบันทึกซ้ำกรณีสัญญาณมือถือขัดข้อง; ตรวจจับการหลุดของเครือข่ายและเก็บบันทึกคำตอบชั่วคราวใน Local State

### FR05-V — Voice answer and STT
`[ R2 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Survey 38/102; FR05`
- **ข้อกำหนด (Requirement):** รับคำตอบด้วยเสียงผ่านไมโครโฟน (Web Audio API บนบราวเซอร์ หรือ Native Microphone API บน iOS/Android) โดยต้องขอ Permission อย่างชัดเจน แปลงเสียงเป็นข้อความ (STT) และให้ผู้ใช้ตรวจสอบ/แก้ไข Transcript ก่อนส่งประเมิน
- **เกณฑ์การยอมรับ (Acceptance Criteria):** กรณีผู้ใช้ไม่อนุญาตไมโครโฟน ระบบต้องมี Fallback ให้พิมพ์ข้อความได้ทันที; ข้อผิดพลาด STT ต้องอนุญาตให้แก้ไขข้อความก่อนยืนยัน; จัดเก็บไฟล์เสียงชั่วคราวบน Object Storage ตามนโยบาย Retention

### FR05.1 — Voice-retention choice
`[ R2 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Original FR05.1`
- **ข้อกำหนด (Requirement):** ขอความยินยอม (Opt-in) แยกต่างหากสำหรับการเก็บรักษาไฟล์เสียงหลังประมวลผลเสร็จสิ้น พร้อมแสดงระยะเวลาจัดเก็บบนทั้ง Web และ Mobile
- **เกณฑ์การยอมรับ (Acceptance Criteria):** การปฏิเสธไม่กระทบต่อการฝึกสัมภาษณ์; มีหลักฐาน Consent Version และ Timestamp บันทึกในฐานข้อมูล; ลบไฟล์เสียงอัตโนมัติเมื่อครบกำหนด

### FR06 — Pressure practice mode
`[ R2 ]  [ Priority: Could ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR06`
- **ข้อกำหนด (Requirement):** โหมดจำลองการสัมภาษณ์ภายใต้ความกดดัน (จับเวลาถอยหลัง, คำถามต่อเนื่อง) แบบสมัครใจ และสามารถกดออกจากโหมดได้ทันที
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ผู้ใช้เปิด/ปิดโหมดได้อิสระ; ไม่มีการใช้ถ้อยคำดูถูกหรือกดดันทางจิตวิทยา; หน้าจอจับเวลาทำงานแม่นยำทั้งบน Web และ Mobile

### FR07 — Question diversity
`[ R2 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR07`
- **ข้อกำหนด (Requirement):** ลดการส่งคำถามซ้ำแก่ผู้ใช้เดิมโดยตรวจสอบประวัติ Session History และ Question Bank IDs
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ภายในเซสชันเดียวกันไม่มีคำถามซ้ำ; ผู้ใช้ฝึกข้ามแพลตฟอร์ม (Web และ Mobile) ยังคงได้รับการคัดเลือกคำถามโดยอ้างอิงประวัติรวมของบัญชี

### FR08 — Rubric-based AI scoring
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Survey; FR08`
- **ข้อกำหนด (Requirement):** ประเมินคำตอบด้วยเกณฑ์ Rubric (ความตรงประเด็น, เนื้อหา, โครงสร้าง) และแสดงผลคะแนนรวม (0–100) พร้อมคะแนนย่อยและเหตุผลประกอบ
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ประมวลผลบนเซิร์ฟเวอร์แบบศูนย์กลาง; คำตอบที่ไม่เพียงพอได้สถานะ needs-review ไม่สร้างคะแนนปลอม; ผลการประเมินแสดงผลถูกต้องตรงกันทั้งบน Web และ Mobile

### FR09 — English language feedback
`[ R2 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Survey 57/102; FR09`
- **ข้อกำหนด (Requirement):** วิเคราะห์ไวยากรณ์ คำศัพท์ และโครงสร้างประโยคของคำตอบภาษาอังกฤษ โดยแยกคะแนนภาษาออกจากคะแนนเนื้อหา
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ยกตัวอย่างข้อผิดพลาดที่มีอยู่จริงในคำตอบ; ไม่แก้ไขประโยคที่ถูกต้องอยู่แล้ว; แสดงผลคำแนะนำบนการ์ด UI ทั้งบน Web และ Mobile

### FR10 — Observable speech indicators
`[ R2 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Survey 67/102; FR10`
- **ข้อกำหนด (Requirement):** วิเคราะห์และแสดงผลตัวชี้วัดการพูดเชิงพฤติกรรม เช่น ความเร็ว (WPM), การหยุดพูด (Pauses), และคำฟุ่มเฟือย (Filler words) โดยไม่มีการวินิจฉัยบุคลิกภาพหรือสภาวะจิตใจ
- **เกณฑ์การยอมรับ (Acceptance Criteria):** แสดงหน่วยวัดชัดเจนพร้อมข้อความปฏิเสธความรับผิดชอบ (Disclaimer); ผลการวิเคราะห์แสดงผลสอดคล้องกันบน Web และ Mobile

### FR11 — Actionable feedback
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Survey; FR11`
- **ข้อกำหนด (Requirement):** สรุปจุดเด่น จุดที่ควรปรับปรุง และคำแนะนำสำหรับการฝึกครั้งถัดไป โดยอ้างอิงหลักฐานข้อความจากคำตอบของผู้ใช้
- **เกณฑ์การยอมรับ (Acceptance Criteria):** Feedback อย่างน้อย 1 ข้อต้องมี Evidence อ้างอิงจากคำตอบจริง; หลีกเลี่ยงข้อความทั่วไปที่ไม่เจาะจง; แสดงผลอย่างชัดเจนบนหน้าจออุปกรณ์ทุกขนาด

### FR12 — Example responses
`[ R2 ]  [ Priority: Could ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR12`
- **ข้อกำหนด (Requirement):** แสดงตัวอย่างแนวทางการตอบที่ดีที่สัมพันธ์กับคำถาม เพื่อเป็นแนวทางในการเรียนรู้
- **เกณฑ์การยอมรับ (Acceptance Criteria):** มีป้ายระบุชัดเจนว่าเป็น 'ตัวอย่างคำตอบแนวทาง'; ไม่มีข้อมูลส่วนบุคคลของผู้อื่น; แสดงผลได้ทั้งบน Web และ Mobile

### FR13 — Progress dashboard
`[ R2 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Survey 30/102; FR13`
- **ข้อกำหนด (Requirement):** แสดงกราฟแนวโน้มพัฒนาการของคะแนนเปรียบเทียบตามช่วงเวลา หมวดคำถาม และระดับความยาก
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ดึงข้อมูลสถิติจากชุดข้อมูลเดียวกันบนเซิร์ฟเวอร์; แสดงคำเตือนกรณีคะแนนมาจาก Rubric Version ที่แตกต่างกันจนเปรียบเทียบไม่ได้โดยตรง

### FR14 — Interview history
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR14`
- **ข้อกำหนด (Requirement):** ผู้ใช้สามารถเรียกดู ค้นหา ส่งออก (Export) และลบ (Soft Delete) ประวัติการสัมภาษณ์ คำถาม คำตอบ และ Feedback ของตนเองได้
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ตรวจสอบ Ownership ทุกครั้ง ป้องกันการเข้าถึงข้ามบัญชี (403/404); การลบประวัติบนแพลตฟอร์มใดจะส่งผลให้อีกแพลตฟอร์มหนึ่งอัปเดตทันที; มี Audit Log บันทึกการลบ

### FR15 — Multi-Platform Access & Consistency (Responsive Web & Native Mobile)
`[ R1 (Web) / R2 (Mobile) ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Survey 84 both; Phase 1 Platform Alignment`

- **ข้อกำหนด (Requirement):**  
  ระบบต้องให้บริการผ่าน 2 ส่วนหน้าหลักที่ทำงานร่วมกับระบบแบ็กเอนด์ศูนย์กลาง (Shared Backend):
  1. **Responsive Web Application:** รองรับการทำงานบน Desktop, Tablet และ Mobile Browser โดยสนับสนุนทุกกลุ่มผู้ใช้ตามบทบาท (Guest, Registered User, Researcher, Finance Admin, System Admin)
  2. **Native Mobile Application:** แอปพลิเคชันติดตั้งแยกต่างหากบนระบบปฏิบัติการ iOS และ Android ออกแบบเฉพาะสำหรับ End Users (Guest, Registered User) โดยรองรับสิทธิ์การใช้งานตามระดับแพ็กเกจ (Free, Basic, Pro)  
  ทั้งสองแพลตฟอร์มต้องใช้ระบบยืนยันตัวตน (Authentication) เดียวกัน ข้อมูลบัญชี ประวัติการฝึกสัมภาษณ์ และสิทธิ์การใช้งาน (Entitlements) ต้องซิงค์ตรงกันอย่างสมบูรณ์ และมีระบบควบคุมการเข้าถึงที่จำกัดสิทธิ์หน้าจอผู้ดูแลระบบ (Admin) และระบบวิจัย (Researcher) ให้เข้าถึงได้เฉพาะบน Web Application เท่านั้น

- **เกณฑ์การยอมรับ (Proposed Acceptance Criteria — Pending Approval):**
  1. Responsive Web Application แสดงผลถูกต้องและใช้งานได้สมบูรณ์บน Viewport ตั้งแต่ 360px (Mobile) จนถึง 4K Desktop บนบราวเซอร์หลัก (Chrome, Safari, Edge, Firefox) โดยมุ่งสู่มาตรฐาน WCAG 2.2 AA
  2. Native Mobile Application สามารถติดตั้งและทำงานได้สมบูรณ์บนระบบปฏิบัติการ iOS (เวอร์ชัน 16.0 ขึ้นไป) และ Android (เวอร์ชัน 13.0 ขึ้นไป) ตามข้อเสนอการตัดสินใจ D-M03
  3. ระบบจำกัดสิทธิ์แพลตฟอร์มอย่างเข้มงวด: Guest และ Registered User เข้าใช้งานได้ทั้ง Web และ Mobile; ในขณะที่ Researcher, Finance Admin และ System Admin สามารถเข้าถึงระบบงานบริหารจัดการและวิจัยได้เฉพาะบน Web Application เท่านั้น หากบัญชี Admin เข้าสู่ระบบบน Mobile จะเข้าถึงได้เฉพาะฟังก์ชันผู้ใช้ทั่วไปและไม่มีสิทธิ์เข้าถึงหน้า Admin Console
  4. ผู้ใช้สามารถใช้บัญชีเดียว (Single Identity) ล็อกอินเข้าใช้งานสลับระหว่าง Web และ Mobile ได้อย่างไร้รอยต่อ โดย Session Token ถูกจัดเก็บอย่างปลอดภัยตามมาตรฐานของแต่ละแพลตฟอร์ม
  5. สิทธิ์การใช้งานแพ็กเกจ (Free, Basic, Pro) และโควตาคงเหลือได้รับการตรวจสอบและบังคับใช้ที่ฝั่งเซิร์ฟเวอร์ (Server-side atomic check) เหมือนกันไม่ว่าจะมาจาก Web หรือ Mobile
  6. ข้อมูลประวัติการสัมภาษณ์ คำตอบ และผลการประเมินที่ทำบนแพลตฟอร์มหนึ่ง จะต้องปรากฏบนอีกแพลตฟอร์มหนึ่งทันทีเมื่อดึงข้อมูลใหม่ (ความล่าช้าในการซิงค์ P95 ≤ 2 วินาทีภายใต้สภาวะเครือข่ายปกติ)
  7. โมบายแอปพลิเคชันต้องรองรับการรับมือเหตุการณ์เครือข่ายขัดข้อง (Network Resilience) โดยสามารถเก็บข้อมูลชั่วคราวและแจ้งเตือนผู้ใช้ให้ส่งซ้ำได้โดยไม่มีข้อมูลสูญหาย

### FR16 — Practice mode selection
`[ R2 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR16 merged intent`
- **ข้อกำหนด (Requirement):** ผู้ใช้สามารถเลือกรูปแบบการฝึกได้ระหว่าง Text Mode, Voice Mode หรือ Mixed Mode ผ่านหน้าจอ Interview Setup
- **เกณฑ์การยอมรับ (Acceptance Criteria):** รูปแบบการฝึกถูกบันทึกใน Session; กรณีไมโครโฟนขัดข้องระบบมีกลไกปรับเป็น Text Mode อัตโนมัติ

### FR17 — Privacy notice and lawful basis
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR17 corrected`
- **ข้อกำหนด (Requirement):** แสดงประกาศความเป็นส่วนตัว (Privacy Notice) วัตถุประสงค์ และฐานทางกฎหมายในการประมวลผลข้อมูลอย่างโปร่งใสทั้งในการลงทะเบียนบน Web และในการเปิดใช้งาน Mobile ครั้งแรก
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ห้ามทำ Bundled Consent รวมความยินยอมที่ไม่จำเป็นเข้าด้วยกัน; ผู้ใช้สามารถตรวจสอบและถอนความยินยอมได้; มี Audit Log บันทึกประวัติ Consent Version

### FR18 — Contact opt-in
`[ R3 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Survey Q20-21; FR18`
- **ข้อกำหนด (Requirement):** ผู้ใช้สามารถให้ความยินยอมแยกต่างหากในการให้ทีมงานติดต่อกลับเพื่อการสัมภาษณ์เชิงลึกหรือการวิจัย
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ปิดเป็นค่าเริ่มต้น (Default Opt-out); จัดการเปิด/ปิดได้ทั้งบน Web และ Mobile; การถอนความยินยอมมีผลบล็อกการติดต่อทันที

### FR18.1 — Research access authorization
`[ R3 ]  [ Priority: Must ]  [ Platform: Web Only (Admin/Researcher) ]  • ที่มา: FR18.1 correction`
- **ข้อกำหนด (Requirement):** ควบคุมการเปิดเผยและส่งออกข้อมูลเพื่อการวิจัยตามวัตถุประสงค์ที่ได้รับอนุมัติ ฐานทางกฎหมาย และนโยบายความปลอดภัยข้อมูล โดยบังคับใช้ RLS เป็น Defense in Depth
- **เกณฑ์การยอมรับ (Acceptance Criteria):** **จำกัดเฉพาะ Web Application เท่านั้น (ไม่อนุญาตบน Mobile)**; ห้าม Researcher ทำ Direct SQL SELECT บนตารางข้อมูลส่วนบุคคลดิบ; ข้อมูลที่ส่งออกต้องเป็นข้อมูลรวม (Aggregated Data) ที่ผ่านเกณฑ์ Cell Suppression

### FR19 — Package catalog
`[ R3 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR19`
- **ข้อกำหนด (Requirement):** แสดงรายการแพ็กเกจสมาชิกที่เปิดใช้งาน ราคา และรายละเอียดสิทธิ์ ให้ผู้ใช้ตรวจสอบได้ทั้งบน Web และ Mobile
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ข้อมูลราคาและรายละเอียดดึงจากแหล่งข้อมูลเดียวกันบนเซิร์ฟเวอร์; การซื้อบน Mobile เป็นไปตามข้อตกลง D-M04 (In-App Purchase vs. Web Redirect)

### FR20 — Quota and entitlement enforcement
`[ R3 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR20`
- **ข้อกำหนด (Requirement):** ตรวจสอบและตัดโควตาการใช้งานตามแพ็กเกจ (เช่น จำนวนเซสชันต่อเดือน) ด้วยกลไก Atomic Server-Side Enforcement
- **เกณฑ์การยอมรับ (Acceptance Criteria):** คำขอพร้อมกัน (Parallel Requests) ไม่สามารถทำให้การใช้งานเกินโควตา; ประวัติการตัดโควตาบันทึกใน USAGE_LEDGER ตรวจสอบย้อนหลังได้

### FR21 — Package comparison
`[ R3 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR21`
- **ข้อกำหนด (Requirement):** แสดงตารางเปรียบเทียบฟีเจอร์และสิทธิ์ระหว่าง Free, Basic และ Pro เพื่อประกอบการตัดสินใจ
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ข้อมูลในตารางตรงกับ Package Catalog ที่ Active อยู่เสมอ; จัดรูปแบบตารางให้เปิดดูได้อย่างเหมาะสมทั้งบน Web และ Mobile

### FR22 — Payment methods
`[ R3 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile (Subject to D-M04) ]  • ที่มา: FR22 adjusted`
- **ข้อกำหนด (Requirement):** เชื่อมต่อช่องทางชำระเงินตามที่ Payment Gateway รองรับ (เช่น บัตรเครดิต/เดบิต, PromptPay) โดยช่องทางบน Mobile ขึ้นอยู่กับการตัดสินใจ D-M04
- **เกณฑ์การยอมรับ (Acceptance Criteria):** หน้าจอแสดงสถานะแยกชัดเจนระหว่าง รอชำระ, สำเร็จ และ ล้มเหลว; ปฏิบัติตามกฎของ Apple App Store และ Google Play Store

### FR23 — Payment gateway validation
`[ R3 ]  [ Priority: Must ]  [ Platform: Shared Backend Service ]  • ที่มา: FR23`
- **ข้อกำหนด (Requirement):** รับและตรวจสอบความถูกต้องของ Webhook จาก Payment Gateway ด้วย HMAC Signature Verification และมีกลไก Idempotency
- **เกณฑ์การยอมรับ (Acceptance Criteria):** Webhook ที่ไม่ผ่านการตรวจสอบลายเซ็นถูกปฏิเสธ; เหตุการณ์ซ้ำ (Duplicate Event) ไม่ก่อให้เกิดการปลดสิทธิ์หรือคิดเงินซ้ำ

### FR24 — Receipt issuance
`[ R3 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR24`
- **ข้อกำหนด (Requirement):** สร้างและออกหลักฐานการรับชำระเงินเมื่อการชำระเงินสำเร็จ โดยผู้ใช้สามารถดาวน์โหลดใบเสร็จได้ทั้งบน Web และ Mobile
- **เกณฑ์การยอมรับ (Acceptance Criteria):** เลขที่ใบเสร็จไม่ซ้ำซ้อน; ซ่อนข้อมูลบัตรที่ละเอียดอ่อน; ดาวน์โหลดในรูปแบบ PDF ได้

### FR25 — Provisioning
`[ R3 ]  [ Priority: Must ]  [ Platform: Shared Backend Service ]  • ที่มา: FR25`
- **ข้อกำหนด (Requirement):** ปลดล็อกสิทธิ์การใช้งานแพ็กเกจในบัญชีผู้ใช้ทันทีที่ได้รับสัญญาณยืนยันการชำระเงิน
- **เกณฑ์การยอมรับ (Acceptance Criteria):** สิทธิ์ได้รับการอัปเดตแบบเรียลไทม์ และผู้ใช้บนทุกอุปกรณ์ (Web และ Mobile) มองเห็นสิทธิ์ใหม่พร้อมกัน

### FR26 — Renewal
`[ R3 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR26`
- **ข้อกำหนด (Requirement):** รองรับการต่ออายุแพ็กเกจสมาชิกทั้งแบบทำรายการเอง (Manual) หรือแบบอัตโนมัติ (Auto-renew) ตามที่ผู้ใช้เลือก
- **เกณฑ์การยอมรับ (Acceptance Criteria):** การยกเลิกการต่ออายุอัตโนมัติมีผลทันทีในรอบบิลถัดไป; แสดงสถานะรอบบิลอย่างชัดเจนบนหน้าจอการจัดการบัญชี

### FR27 — Cancellation/refund requests
`[ R3 ]  [ Priority: Must ]  [ Platform: Shared (User) / Web Only (Admin) ]  • ที่มา: FR27 corrected`
- **ข้อกำหนด (Requirement):** ผู้ใช้สามารถยื่นคำขอยกเลิกหรือขอคืนเงินได้ผ่าน Web หรือ Mobile โดยมีขั้นตอนการพิจารณาอนุมัติและดำเนินการคืนเงินผ่านระบบ Admin Console บน Web
- **เกณฑ์การยอมรับ (Acceptance Criteria):** แยกสถานะคำขออย่างชัดเจน (Requested, Approved, Rejected, Refunded); ระบบ Admin สำหรับพิจารณาและอนุมัติจำกัดเฉพาะบน Web Application เท่านั้น

### FR28 — Renewal notifications
`[ R3 ]  [ Priority: Should ]  [ Platform: Shared Web & Mobile (Subject to D-M05) ]  • ที่มา: FR28`
- **ข้อกำหนด (Requirement):** ส่งการแจ้งเตือนล่วงหน้าก่อนถึงกำหนดตัดรอบบิลหรือต่ออายุสมาชิก ผ่านทางอีเมล และผ่านระบบ Push Notification บน Mobile (หากอนุมัติ D-M05)
- **เกณฑ์การยอมรับ (Acceptance Criteria):** บันทึกประวัติการส่งแจ้งเตือน; ปฏิบัติตามกฎหมายคุ้มครองผู้บริโภค

### FR29 — Transaction history
`[ R3 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: FR29`
- **ข้อกำหนด (Requirement):** จัดเก็บและแสดงประวัติการทำธุรกรรม การชำระเงิน และการขอคืนเงิน ให้ผู้ใช้ตรวจสอบได้เฉพาะข้อมูลของตนเอง
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ป้องกันการเข้าถึงข้ามบัญชี; แสดงประวัติย้อนหลังพร้อมเลขอ้างอิงและสถานะที่ครบถ้วนทั้งบน Web และ Mobile

### FR30 — Admin package versioning
`[ R3 ]  [ Priority: Must ]  [ Platform: Web Only (Admin Only) ]  • ที่มา: FR30`
- **ข้อกำหนด (Requirement):** เครื่องมือสำหรับ Finance Admin ในการจัดการร่าง อนุมัติ และเผยแพร่เวอร์ชันของแพ็กเกจ ราคา และโควตาสิทธิ์
- **เกณฑ์การยอมรับ (Acceptance Criteria):** **จำกัดเฉพาะ Web Application เท่านั้น**; การเปลี่ยนราคาไม่มีผลย้อนหลังต่อสมาชิกปัจจุบันที่อยู่ในรอบบิลเดิม; บันทึก Audit Log ทุกการเปลี่ยนแปลง

### FR31 — Business metrics
`[ R3 ]  [ Priority: Could ]  [ Platform: Web Only (Admin Only) ]  • ที่มา: FR31`
- **ข้อกำหนด (Requirement):** รายงานสรุปตัวชี้วัดทางธุรกิจ เช่น รายได้รวม, อัตราการต่ออายุ, Churn Rate และยอดคืนเงิน
- **เกณฑ์การยอมรับ (Acceptance Criteria):** **จำกัดเฉพาะ Web Application เท่านั้น**; ตัวเลขกระทบยอดตรงกับ Transaction Ledger; จำกัดการเข้าถึงเฉพาะ Finance Admin และ System Admin

### FR32 — Immutable admin audit
`[ R1 ]  [ Priority: Must ]  [ Platform: Web Only (Admin Only) ]  • ที่มา: FR32 expanded`
- **ข้อกำหนด (Requirement):** บันทึกประวัติการกระทำของผู้ดูแลระบบทั้งหมดแบบเปลี่ยนแปลงไม่ได้ (Append-only) เช่น การจัดการผู้ใช้, การแก้ไข Rubric, การปรับแต่งโมเดล
- **เกณฑ์การยอมรับ (Acceptance Criteria):** **หน้าจอเรียกดูบันทึกจำกัดเฉพาะ Web Application เท่านั้น**; บันทึก Actor ID, Timestamp, Action, Entity Type, Client Platform และ Redacted Diff; ห้ามแก้ไขหรือลบบันทึก

### FR32.1 — Research access audit
`[ R3 ]  [ Priority: Must ]  [ Platform: Web Only (Admin/Researcher) ]  • ที่มา: FR32.1`
- **ข้อกำหนด (Requirement):** บันทึกทุกคำขอเข้าถึง การสืบค้น และการส่งออกข้อมูลของนักวิจัย รวมถึงกรณีที่ถูกปฏิเสธสิทธิ์
- **เกณฑ์การยอมรับ (Acceptance Criteria):** **จำกัดเฉพาะ Web Application เท่านั้น**; บันทึก Query Hash, Dataset Version, จำนวน Record ที่ส่งออก และวัตถุประสงค์การวิจัย

### FR33 — Session resilience
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared Web & Mobile ]  • ที่มา: Added engineering gap`
- **ข้อกำหนด (Requirement):** ระบบต้องบันทึกสถานะคำตอบก่อนส่ง และสามารถกู้คืนหรือดำเนินการต่อได้เมื่อเกิดเหตุขัดข้องทางเครือข่าย โดยเฉพาะบนสัญญาณมือถือ
- **เกณฑ์การยอมรับ (Acceptance Criteria):** กรณีสัญญาณขาดหาย โมบายแอปพลิเคชันต้องเก็บข้อความคำตอบไว้ในเครื่องชั่วคราวและเปิดให้ผู้ใช้กด Retry ได้ทันทีเมื่อสัญญาณกลับมา โดยไม่เกิดคำตอบซ้ำซ้อน

### FR34 — AI configuration and human review
`[ R1 ]  [ Priority: Must ]  [ Platform: Web Only (Admin Console) ]  • ที่มา: Added engineering gap`
- **ข้อกำหนด (Requirement):** ระบบบริหารจัดการ Question Bank, Rubric Version, Prompt Template และพารามิเตอร์ของ AI พร้อมรองรับ Rollout, Rollback และการตรวจสอบโดยมนุษย์
- **เกณฑ์การยอมรับ (Acceptance Criteria):** **เครื่องมือจัดการเวอร์ชันจำกัดเฉพาะ Web Application เท่านั้น**; ผลการประเมินทุกรายการต้องระบุเวอร์ชันของ Rubric, Prompt และ Model ไว้อย่างชัดเจน

### FR35 — Data rights request
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared (User) / Web Only (Admin) ]  • ที่มา: Added privacy gap`
- **ข้อกำหนด (Requirement):** ผู้ใช้สามารถยื่นคำขอใช้สิทธิตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (ขอดูข้อมูล, ส่งออกข้อมูล, ขอลบข้อมูล) ได้ทั้งบน Web และ Mobile โดยมีกระบวนการพิจารณาและจัดการผ่าน Web Admin
- **เกณฑ์การยอมรับ (Acceptance Criteria):** ยืนยันตัวตนผู้ขอก่อนดำเนินการ; มีขั้นตอนดำเนินการลบข้อมูลจริงออกจาก Active Database และตัดสิทธิ์การเข้าถึงตาม SLA ที่กำหนด; ปฏิบัติตามข้อกำหนดของ Apple App Store เรื่อง In-app Account Deletion

### FR36 — AI failure and appeal
`[ R1 ]  [ Priority: Must ]  [ Platform: Shared (User) / Web Only (Admin) ]  • ที่มา: Added engineering gap`
- **ข้อกำหนด (Requirement):** กรณีระบบ AI ขัดข้อง ต้องแจ้งผู้ใช้ให้ทราบอย่างโปร่งใสและไม่สร้างคะแนนปลอม พร้อมทั้งเปิดโอกาสให้ผู้ใช้ยื่นอุทธรณ์ผลประเมินที่ผิดปกติได้ทั้งบน Web และ Mobile
- **เกณฑ์การยอมรับ (Acceptance Criteria):** แสดงสถานะข้อผิดพลาดชัดเจน; ผู้ใช้สามารถกดส่งคำร้องอุทธรณ์พร้อมระบุเหตุผลได้; คำร้องถูกส่งเข้าคิวทบทวนในระบบ Web Admin

---

## 6. Non-Functional Requirements

| ID | หัวข้อและข้อกำหนด | เกณฑ์เป้าหมายการยอมรับ (Acceptance Targets) | การจัดแนวแพลตฟอร์ม (Platform Alignment) | วิธีการทดสอบและตรวจสอบ |
| --- | --- | --- | --- | --- |
| **NFR01** | Security & Data Protection | TLS 1.2+ (แนะนำ TLS 1.3), เข้ารหัสข้อมูลนิ่ง AES-256, จัดการความลับด้วย Secret Manager, แฮชรหัสผ่านด้วยอัลกอริทึมที่ปลอดภัย | **Web:** จัดเก็บ Token ใน HTTP-only Secure SameSite Cookies<br>**Mobile:** จัดเก็บใน iOS Keychain / Android Keystore พร้อมป้องกันการ Root/Jailbreak | Config Audit, Penetration Test, Mobile Binary Analysis |
| **NFR02** | AI Evaluation Quality | Correlation ≥0.70 และ MAE ≤15/100 เมื่อเทียบกับคะแนนเฉลี่ยของผู้เชี่ยวชาญมนุษย์อย่างน้อย 2 คน; ทดสอบแยกภาษาไทย/อังกฤษ | **Shared AI:** รันการประเมินบนเซิร์ฟเวอร์แบบศูนย์กลาง ผลลัพธ์และเกณฑ์คุณภาพเดียวกันไม่ว่าจะส่งจาก Web หรือ Mobile | Versioned Evaluation Set + Blinded Scoring Benchmark |
| **NFR03** | Usability & Task Completion | System Usability Scale (SUS) ≥70 และผู้ใช้ ≥90% สามารถทำภารกิจหลัก (ฝึกสัมภาษณ์จนจบเซสชัน) สำเร็จในการทดสอบแบบ Moderated | **Web:** รองรับทั้งเมาส์ คีย์บอร์ด และจอสัมผัส<br>**Mobile:** ออกแบบตามหลัก Human Interface Guidelines (iOS) และ Material Design (Android) | Moderated Usability Testing, Task Success Metrics |
| **NFR04** | Performance & Latency | Non-AI API P95 ≤ 2.0 วินาทีบน Web; P95 ≤ 2.5 วินาทีบนเครือข่ายมือถือ 4G/5G; End-to-end Text AI Feedback P95 ≤ 15 วินาที | **Web:** เวลาโหลดหน้าเว็บเริ่มต้น ≤ 1.8 วินาที<br>**Mobile:** เวลาเปิดแอปแบบ Cold Start ≤ 2.0 วินาที | Load Testing by Endpoint, Network Throttling Test |
| **NFR05** | Availability | ความพร้อมใช้งานของ Production API Gateway ไม่น้อยกว่า 99.5% ตลอดรอบเดือนปฏิทิน | **Shared Backend:** รองรับทราฟฟิกทั้งจาก Web Application และ Native Mobile Application ภายใต้ SLA เดียวกัน | Synthetic Health Checks, Cloud Monitoring |
| **NFR06** | Unit Economics | ควบคุมและติดตามต้นทุน API Token ต่อเซสชันการฝึกให้ชัดเจน พร้อมระบบแจ้งเตือนเมื่องบประมาณเกินเกณฑ์ | **Shared System:** นับรวมการใช้งานจากทุกแพลตฟอร์มเข้าสู่ Dashboard วิเคราะห์ต้นทุนเดียวกัน | Cost Observability Dashboard |
| **NFR07** | Localization | รองรับส่วนติดต่อผู้ใช้และเนื้อหาทั้งภาษาไทยและภาษาอังกฤษอย่างสมบูรณ์ | **Shared:** ใช้ชุดคำแปล (i18n dictionary) และการจัดรูปแบบวันที่/เวลาที่สอดคล้องกันทั้ง Web และ Mobile | Bilingual Locale Test Suite |
| **NFR08** | Cross-Platform Accessibility & Consistency | **Web:** WCAG 2.2 AA สำหรับขั้นตอนการทำงานหลัก<br>**Mobile:** รองรับ Screen Readers (Apple VoiceOver, Android TalkBack), Dynamic Type และ High Contrast<br>**Consistency:** ความสอดคล้องของข้อมูลบัญชี ประวัติ และสิทธิ์ 100% | **Cross-Platform Requirement:** ข้อกำหนดและเป้าหมายตัวเลขเป็นข้อเสนอที่รอการอนุมัติ (Proposed Targets — Pending Approval) ห้ามทดแทนค่าเดิมโดยไม่แจ้ง | axe-core, iOS Accessibility Inspector, Android Accessibility Scanner, Data Sync Test |
| **NFR09** | Retention & Local Storage | เสียงดิบที่ไม่ได้ Opt-in ต้องถูกลบออกจากเซิร์ฟเวอร์ภายใน 24 ชั่วโมง (Hard Cap); Opt-in เก็บไม่เกิน 90 วัน; ดำเนินการลบบัญชีภายใน 30 วัน | **Mobile:** แคชไฟล์เสียงชั่วคราวบนเครื่องมือถือต้องถูกลบทันทีที่การอัปโหลดเสร็จสิ้น | Storage Expiry Audit, Mobile Local Sandbox Scan |
| **NFR10** | Payment Scope & PCI-DSS | ใช้ระบบ Hosted/Tokenized Gateway หรือ In-App Purchase; ห้ามจัดเก็บหรือส่งผ่านข้อมูลบัตรเครดิต (PAN/CVV) ในระบบของ InterviewX | **Web:** Hosted Redirect Gateway<br>**Mobile:** Hosted Redirect หรือ Native StoreKit/Google Play (D-M04) | Payment Data Flow Review, PCI Scope Verification |
| **NFR11** | Transaction Security | ตรวจสอบ HMAC Webhook Signatures และมีกลไกป้องกัน Replay Attack อย่างรัดกุม | **Shared Backend:** ตรวจสอบความถูกต้องของธุรกรรมที่ฝั่งเซิร์ฟเวอร์เท่านั้น ไม่เชื่อถือสถานะจากไคลเอนต์ | Replay Attack & Signature Tampering Test |
| **NFR12** | Idempotency | เหตุการณ์การชำระเงินหรือการส่งคำตอบซ้ำต้องก่อให้เกิดผลลัพธ์ทางธุรกิจเพียงครั้งเดียว (Exactly-once fulfillment) | **Shared:** ใช้ Idempotency-Key header ที่สร้างจากฝั่งไคลเอนต์ (UUIDv4) ในการตัดคำขอที่ซ้ำซ้อน | Duplicate Request Load Test |
| **NFR13** | Payment Visibility | เวลาในการเปลี่ยนเส้นทาง (Redirect) P95 ≤ 5 วินาที; แสดงสถานะรอตรวจสอบ (Pending) อย่างชัดเจน | **Shared:** มีหน้าจอแสดงสถานะรอการยืนยันทั้งบน Web และ Mobile | Async State Monitoring |
| **NFR14** | Payment Availability | เฝ้าระวังสถานะของ Payment Provider และจัดเตรียมสถานะที่กู้คืนได้เมื่อระบบภายนอกขัดข้อง | **Shared Backend:** มีระบบบันทึกคำขอและตรวจสอบยอดกระทบยอดอัตโนมัติ | Provider Failover Tabletop Drill |
| **NFR15** | Auditability | บันทึกประวัติการเปลี่ยนสถานะทางธุรกิจที่สำคัญ 100% พร้อมระบบกระทบยอดธุรกรรมรายวัน | **Web Only:** หน้าจอตรวจสอบและรายงานผลกระทบยอดจำกัดให้เข้าถึงได้เฉพาะบน Web Application | Daily Reconciliation Report Audit |
| **NFR16** | Tax Compliance | ออกเอกสารหลักฐานการรับชำระเงินที่ถูกต้องตามกฎหมายของนิติบุคคลผู้ให้บริการ | **Shared Backend:** ระบบออกใบเสร็จทำงานบนเซิร์ฟเวอร์กลาง; โมบายแอปปฏิบัติตามกฎภาษีของ App Store | Legal & Tax Document Audit |
| **NFR17** | Research Privacy | ชุดข้อมูลวิจัยต้องมีขนาดกลุ่มตัวอย่างไม่น้อยกว่า 10 ผู้ใช้ที่แตกต่างกัน (Cell Size ≥ 10) พร้อมตรวจจับ Differencing Attacks | **Web Only:** เครื่องมือสืบค้นและส่งออกชุดข้อมูลวิจัยจำกัดเฉพาะบน Web Application เท่านั้น | Re-identification Risk Assessment |
| **NFR18** | Voice Isolation | Role ผู้วิจัยต้องมีสิทธิ์เข้าถึงไฟล์เสียงดิบเป็น 0%; การเข้าถึงของผู้ดูแลระบบต้องได้รับการอนุมัติเป็นรายกรณีและมี Audit Log | **Shared Backend:** ควบคุมที่ระดับ API Gateway และ Object Storage ACL | Automated Negative Permission Suite |
| **NFR19** | Authorization & IDOR | บล็อกความพยายามเข้าถึงทรัพยากรข้ามบัญชี (IDOR) 100% บนทุก Protected Endpoint; ใช้หลักการ Default Deny | **Shared Backend:** ตรวจสอบสิทธิ์ที่ฝั่งเซิร์ฟเวอร์ทุกครั้ง ไคลเอนต์โมบายไม่เก็บตรรกะสิทธิ์ไว้ตัดสินใจเอง | Automated Negative IDOR Test Suite |
| **NFR20** | LLM Safety | มีชุดทดสอบป้องกัน Prompt Injection และการสร้างเนื้อหาที่ไม่ปลอดภัย; ข้อมูลส่งออกจากโมเดลถือเป็น Untrusted Input | **Shared AI:** คัดกรองและตรวจสอบโครงสร้าง JSON ก่อนส่งผลลัพธ์กลับไปยัง Web และ Mobile | Red-Team Injection Test Prompts |
| **NFR21** | Model Governance | บันทึกเวอร์ชันของ Model, Prompt และ Rubric กำกับไว้ในทุกผลการประเมิน พร้อมรัน Benchmark ซ้ำทุกรอบ Release | **Shared AI:** มี Version Registry ศูนย์กลางเพื่อตรวจสอบย้อนหลังได้ 100% | CI Model Evaluation Benchmark |
| **NFR22** | Scalability | รองรับผู้ใช้งานพร้อมกันอย่างน้อย 100 Concurrent Active Users ในระยะ R1 โดยมีอัตราความล้มเหลวของ Non-AI API ≤ 1% | **Shared Infra:** รองรับภาระงานรวมที่มาจากทั้ง Web และ Native Mobile Applications | Concurrency Load Testing |
| **NFR23** | Disaster Recovery | กำหนดเป้าหมาย RPO ≤ 24 ชั่วโมง และ RTO ≤ 8 ชั่วโมง พร้อมจัดซ้อมกู้คืนระบบรายไตรมาส | **Shared Database:** สำรองข้อมูลฐานข้อมูลหลักอย่างสม่ำเสมอ ครอบคลุมข้อมูลของผู้ใช้ทุกแพลตฟอร์ม | Quarterly Backup Restore Drill |
| **NFR24** | Monitoring & Observability | มี Correlation ID ติดตามคำขอตั้งแต่ไคลเอนต์จนถึงแบ็กเอนด์, มี Dashboard แจ้งเตือนข้อผิดพลาดและต้นทุน AI | **Shared:** รวบรวม Logs, Metrics และ Traces จากทั้ง Web, Mobile Crash Reports และเซิร์ฟเวอร์ | Observability Walkthrough Drill |

---

## 7. Role, Authorization and Entitlements

การควบคุมสิทธิ์ใน InterviewX แบ่งแยกออกเป็น 3 แกนหลักอย่างชัดเจน:
1. **Security Role:** กำหนดว่าผู้ใช้มีบทบาทใดและได้รับสิทธิ์เข้าถึงฟังก์ชันระดับระบบใด (Guest, Registered User, Researcher, Finance Admin, System Admin)
2. **Subscription Entitlement:** กำหนดโควตาการใช้งานและฟีเจอร์ที่ Registered User ได้รับตามระดับแพ็กเกจ (Free, Basic, Pro) ซึ่ง**ไม่ใช่ Security Role**
3. **Platform Scope:** กำหนดว่าผู้ใช้สามารถเข้าใช้งานผ่านหน้าจอแสดงผลใดได้บ้าง (Web Application vs. Native Mobile Application)

### 7.1 Platform Access Matrix (การเข้าถึงตามบทบาทและแพลตฟอร์ม)

| Security Role | Web Application (Desktop / Tablet / Mobile Browser) | Native Mobile Application (iOS / Android) | ขอบเขตการทำงานและข้อจำกัดของแพลตฟอร์ม | สถานะการอนุมัติ |
| --- | --- | --- | --- | --- |
| **Guest (Unauthenticated)** | **Yes** | **Yes** | เข้าถึงหน้าแรก แนะนำฟีเจอร์ สมัครสมาชิก เข้าสู่ระบบ และทดลองฝึกเซสชันสั้น (หากเปิดใช้งาน) ไม่สามารถดูประวัติส่วนตัวได้ | Approved Baseline |
| **Registered User (User)** | **Yes** | **Yes** | เข้าถึงการฝึกสัมภาษณ์เต็มรูปแบบ (Text/Voice), ประวัติการฝึก, Dashboard, จัดการ Profile, Consent และดูข้อมูลแพ็กเกจ | Approved Baseline |
| **Researcher** | **Yes** | **No** | เข้าถึงระบบงานวิจัย การสืบค้นชุดข้อมูลภาพรวม และการส่งออกข้อมูลวิจัยที่อนุมัติ **ไม่อนุญาตให้เข้าถึงผ่าน Native Mobile App** | Approved Baseline |
| **Payment / Finance Admin** | **Yes** | **No** | เข้าถึงรายงานการเงิน รายการธุรกรรม การพิจารณาคืนเงิน และการกำหนดเวอร์ชันราคา **ไม่อนุญาตให้เข้าถึงผ่าน Native Mobile App** | Approved Baseline |
| **System Admin** | **Yes** | **No** | เข้าถึงระบบจัดการ Question Bank, Rubric, Prompt, ผู้ใช้งาน และ Audit Log ทั้งหมด **ไม่อนุญาตให้เข้าถึงผ่าน Native Mobile App** | Approved Baseline |

### 7.2 Subscription Entitlement Matrix (สิทธิ์ตามแพ็กเกจสมาชิก)

| Subscription Tier | Web Application | Native Mobile Application | ฟีเจอร์และโควตาการใช้งานที่เสนอ (Pending D05) | กลไกการบังคับใช้สิทธิ์ |
| --- | --- | --- | --- | --- |
| **Free Tier** | ตามสิทธิ์ | ตามสิทธิ์ | ข้อเสนอ: 5 เซสชันข้อความ/เดือน, 1 หมวดสัมภาษณ์หลัก, 0 เซสชันเสียง, ประวัติมาตรฐาน | Atomic Server-side Quota Ledger |
| **Basic Tier** | ตามสิทธิ์ | ตามสิทธิ์ | ข้อเสนอ: 30 เซสชันข้อความ/เดือน, 10 เซสชันเสียง/เดือน, ทุกหมวดสัมภาษณ์, วิเคราะห์ Grammar | Atomic Server-side Quota Ledger |
| **Pro Tier** | ตามสิทธิ์ | ตามสิทธิ์ | ข้อเสนอ: เซสชันข้อความและเสียงไม่จำกัด (ภายใต้ Fair Use Policy), วิเคราะห์การพูดขั้นสูง, สิทธิ์คิว AI ลำดับแรก | Atomic Server-side Quota Ledger + FUP |

### 7.3 Core Authorization Rules (กฎเหล็กด้านการควบคุมสิทธิ์ 7 ประการ)

1. **Platform does not replace Role:** ชนิดของแพลตฟอร์ม (Web หรือ Mobile) เป็นเพียงหน้าจอแสดงผล ไม่ใช่ตัวกำหนดสิทธิ์ สิทธิ์ที่แท้จริงถูกควบคุมโดย Token และ Role ในระบบแบ็กเอนด์
2. **Subscription does not replace Role:** แพ็กเกจ Free, Basic, Pro เป็นเพียงระดับ Entitlement ของ Registered User ไม่ใช่ Role ผู้ใช้ทั้งสามระดับถือ Security Role เดียวกันคือ `user`
3. **Guest Boundary:** ผู้ใช้ที่เป็น Guest ไม่สามารถเข้าถึงข้อมูลเฉพาะของบัญชี ประวัติการฝึก หรือข้อมูลส่วนบุคคลได้จนกว่าจะผ่านการยืนยันตัวตน
4. **Resource Ownership:** Registered User เข้าถึงได้เฉพาะข้อมูลที่ตนเองเป็นเจ้าของเท่านั้น ระบบต้องป้องกัน IDOR บนทุก API Endpoint
5. **Server-Side Entitlement Validation:** การตรวจสอบโควตาและสิทธิ์ของแพ็กเกจต้องทำที่เซิร์ฟเวอร์แบบ Atomic ทุกครั้งก่อนเริ่มเซสชัน ห้ามเชื่อถือข้อมูลสิทธิ์ที่ไคลเอนต์ส่งมา
6. **Unified API Authorization:** ทุก API Endpoint ต้องบังคับใช้การตรวจสอบตัวตน (Authentication), บทบาท (Role), สิทธิ์ในข้อมูล (Ownership) และความยินยอม (Consent) อย่างครบถ้วน
7. **Defense in Depth (No UI-only security):** การซ่อนปุ่มหรือเมนูบนหน้าจอ Web หรือ Mobile ไม่ถือเป็นการรักษาความปลอดภัย แบ็กเอนด์ต้องปฏิเสธคำขอที่ไม่ได้รับอนุญาตเสมอ

---

## 8. AI Layer and Evaluation

- **Server-Side Evaluation Pipeline:** Intake คำตอบจาก Web หรือ Mobile → ตรวจสอบความถูกต้องและดึงคำถามอ้างอิง → ส่งเข้าคิว Redis/BullMQ → Worker ส่งต่อไปยัง FastAPI AI Service → เรียก Hosted LLM Provider ผ่าน Adapter → ตรวจสอบโครงสร้างผลลัพธ์ JSON Schema และ Evidence Verification → บันทึกคะแนนและเวอร์ชันลง PostgreSQL → ส่งผลลัพธ์กลับไปยังไคลเอนต์
- **No On-Device LLM:** ในระยะ R1 และ R2 การประมวลผลโมเดล AI ทั้งหมดทำงานบนระบบคลาวด์/เซิร์ฟเวอร์ส่วนกลาง ไม่มีการรันโมเดลประเมินผลบนเครื่องมือถือ (Pending D-M08) เพื่อรักษาความแม่นยำและการควบคุมเวอร์ชัน
- **Rubric & Version Pinning:** เกณฑ์การให้คะแนน (Relevance, Completeness, Structure) 0–100 จุด ทุกผลลัพธ์จะผูกติดกับ Rubric Version และ Model Version อย่างถาวร
- **Failure & Appeal:** หากเกิดข้อผิดพลาดในการประมวลผล ระบบจะแจ้งสถานะ Retry และไม่มีการสร้างคะแนนปลอม ผู้ใช้สามารถกดปุ่มยื่นอุทธรณ์ผลประเมินผ่านแอปได้

---

## 9. Privacy, Consent and Research Data

- **Unified Consent Architecture:** ข้อมูลการให้และถอนความยินยอมถูกบันทึกเป็น Event ในตาราง `CONSENT_EVENTS` ที่ฝั่งเซิร์ฟเวอร์ การเปลี่ยนแปลงความยินยอมบน Web หรือ Mobile จะมีผลบังคับใช้พร้อมกันทันที
- **Mobile Local Storage Privacy:** ข้อมูลแคชไฟล์เสียงหรือร่างคำตอบบนโทรศัพท์มือถือ ต้องถูกเก็บใน Private Application Sandbox และถูกลบทันทีหลังการอัปโหลดหรือเมื่อผู้ใช้ออกจากระบบ
- **App Store Privacy Compliance:** โมบายแอปพลิเคชันต้องปฏิบัติตามนโยบายความคุ้มครองข้อมูลของ Apple และ Google รวมถึงการมีปุ่มขอลบบัญชีภายในแอป (In-app Account Deletion ตาม FR35)

---

## 10. Package, Payment and Refund Governance

- **Commercial Release Gate:** ฟังก์ชันการจำหน่ายแพ็กเกจสมาชิกจะเปิดใช้งานในระยะ R3 ภายหลังการอนุมัติด้านนโยบายราคา ภาษี และข้อตกลงทางการค้า
- **Mobile Payment Architecture (Decision D-M04):** การจำหน่ายแพ็กเกจบน Native Mobile App อยู่ระหว่างรอการตัดสินใจเลือกระหว่าง:
  - *Option A (Hybrid Web Checkout):* แสดงข้อมูลแพ็กเกจในแอป และเปลี่ยนเส้นทางผู้ใช้ไปยัง Web Checkout (ต้องตรวจสอบกฎ Reader / Multiplatform ของ Apple)
  - *Option B (Native In-App Purchase):* เชื่อมต่อ StoreKit 2 (iOS) และ Google Play Billing (Android) โดยตรง (มีค่าธรรมเนียมแพลตฟอร์ม 15–30%)
- **Atomic Quota Accounting:** ทุกการชำระเงินที่ยืนยันแล้วจะส่งผลให้แบ็กเอนด์อัปเดตสิทธิ์ใน `USAGE_LEDGER` ทันที ผู้ใช้สามารถใช้งานสิทธิ์ใหม่ได้จากทั้ง Web และ Mobile

---

## 11. Data Model and Data Dictionary

ตารางหลัก 29 ตารางในฐานข้อมูล Core PostgreSQL และ Billing/Research Schemas ยังคงโครงสร้างเดิมอย่างสมบูรณ์ โดยมีการเพิ่มเติมฟิลด์สำหรับการรองรับหลายแพลตฟอร์ม:
- **`REFRESH_SESSIONS`:** เพิ่มฟิลด์ `client_platform` (VARCHAR: 'web', 'ios', 'android') และ `user_agent` เพื่อควบคุม Session แยกตามอุปกรณ์ และรองรับการ Revoke เฉพาะอุปกรณ์
- **`INTERVIEW_SESSIONS`:** เพิ่มฟิลด์ `client_platform` เพื่อการตรวจสอบย้อนหลังและสถิติ
- **`TRANSACTIONS` (R3):** เพิ่มฟิลด์ `channel` ('web_checkout', 'ios_iap', 'android_play') เพื่อการกระทบยอดทางบัญชี
- **`USER_DEVICES` (Proposed Schema for R2/D-M05):** ตารางสำหรับเก็บ Push Notification Device Tokens (APNs/FCM) ผูกกับ `user_id`

---

## 12. Architecture, Interfaces, Operations

### 12.1 Platform Scope & Separation Architecture

```
+-----------------------------------------------------------------------------------+
|                            CLIENT APPLICATION LAYER                               |
|                                                                                   |
|   +---------------------------------------+   +-------------------------------+   |
|   |       Responsive Web Application      |   |   Native Mobile Application   |   |
|   |         (Next.js / TypeScript)        |   |   (iOS & Android - End User)  |   |
|   |  Desktop | Tablet | Mobile Browser   |   |   React Native / Expo (D-M02) |   |
|   |  Actors: User, Guest, Admin, Research |   |   Actors: Registered User,    |   |
|   |                                       |   |           Guest Only          |   |
|   +---------------------------------------+   +-------------------------------+   |
+-------------------------------------------+---------------------------------------+
                                            | (HTTPS REST JSON / TLS 1.3)
                                            v
+-----------------------------------------------------------------------------------+
|                        API GATEWAY & REVERSE PROXY LAYER                          |
|   - Cloudflare / AWS WAF / Rate Limiter / Ingress Controller                     |
|   - Platform & RBAC Gate: Administrative & Research routes blocked for Mobile     |
+-----------------------------------------------------------------------------------+
                                            |
                                            v
+-----------------------------------------------------------------------------------+
|                         SHARED BACKEND ARCHITECTURE                               |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                    NestJS Modular Monolith (Core API)                     |   |
|   |   - Identity & RBAC Context      - Interview Session Context              |   |
|   |   - User Profile Context         - Evaluation Read Model                  |   |
|   |   - Content & Rubric Context     - Privacy & Governance Context           |   |
|   |   - Platform / Idempotency       - Entitlement & Quota Verification       |   |
|   +---------------------------------------------------------------------------+   |
|          |                            |                           |               |
|          v                            v                           v               |
|   +--------------+            +----------------+          +-------------------+   |
|   | PostgreSQL   |            | Redis / BullMQ |          | MinIO / S3 Object |   |
|   | Core Schema  |            | Job Queue      |          | Private Storage   |   |
|   +--------------+            +----------------+          +-------------------+   |
|                                       |                                           |
|                                       v                                           |
|                               +----------------+                                  |
|                               | FastAPI Service| ---> External LLM Provider       |
|                               | AI Inference   |                                  |
|                               +----------------+                                  |
+-----------------------------------------------------------------------------------+
```

### 12.2 Cross-Platform Data Synchronization Matrix

| หมวดหมู่ข้อมูล (Data Category) | เจ้าของข้อมูล (Context Owner) | แหล่งความจริง (Source of Truth) | API Endpoint รับผิดชอบ | สิทธิ์การเข้าถึง | พฤติกรรมการซิงค์ (Sync Behavior) | กลยุทธ์จัดการความขัดแย้ง (Conflict Handling) | การควบคุมความปลอดภัย |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Account Information** | Identity Context | PostgreSQL (`USERS`, `AUTH_IDENTITIES`) | `/api/v1/auth/me`<br>`/api/v1/auth/session` | Read (User), Write via Auth | ซิงค์ทันทีเมื่อเปิดแอป; ตรวจสอบ Refresh Token เป็นระยะ (15 นาที) | เซิร์ฟเวอร์ถือเป็นที่สิ้นสุด; ปฏิเสธการแก้ไขซ้อนด้วย 409 Conflict | เก็บ Token ใน iOS Keychain / Android Keystore; ป้องกัน Brute-force |
| **User Profile** | User Context | PostgreSQL (`USERS.current_status`, `skill_level`) | `/api/v1/users/profile` | Read / Write โดยเจ้าของบัญชี | ซิงค์เมื่อเปิดแอปและเมื่อบันทึกข้อมูล; แสดงผลแบบ Optimistic UI | Last-write-wins อ้างอิงตาม `updated_at` ของเซิร์ฟเวอร์ | ตรวจสอบความเป็นเจ้าของบัญชี; ตรวจสอบ Schema อย่างเข้มงวด |
| **Subscription Entitlement** | Billing Context | PostgreSQL (`SUBSCRIPTIONS`, `USAGE_LEDGER`) | `/api/v1/subscriptions/current`<br>`/api/v1/entitlements/check` | Read อย่างเดียวสำหรับไคลเอนต์ | ดึงข้อมูลก่อนเริ่มการฝึก; ตัดโควตาแบบ Atomic ที่เซิร์ฟเวอร์ | สถานะเซิร์ฟเวอร์มีความสำคัญสูงสุดเสมอ; ห้ามแคชสิทธิ์ฝั่งไคลเอนต์เพื่อตัดสินใจ | ป้องกันการปลอมแปลงสิทธิ์; โควตาถูกตัดที่ระบบแบ็กเอนด์ศูนย์กลาง |
| **Interview Session** | Interview Context | PostgreSQL (`INTERVIEW_SESSIONS`, `SESSION_QUESTIONS`) | `/api/v1/interviews`<br>`/api/v1/interviews/{id}/answers` | Read / Write โดยเจ้าของเซสชัน | สื่อสารแบบ Request/Response รายข้อ; แคชคำตอบชั่วคราวบนเครื่องเมื่อสัญญาณหลุด | ใช้ `Idempotency-Key` (UUIDv4) ป้องกันการบันทึกคำตอบซ้ำ | ผูกเซสชันกับ User ID; CSRF บน Web, Bearer Token บน Mobile |
| **Interview History** | Interview Context | PostgreSQL (`INTERVIEW_SESSIONS`, `ANSWERS`, `FEEDBACK`) | `/api/v1/interviews/history`<br>`/api/v1/interviews/{id}` | Read อย่างเดียว; Delete โดยเจ้าของ | ดึงข้อมูลแบบแบ่งหน้า (Pagination); อัปเดตแคชเมื่อเซสชันใหม่เสร็จสิ้น | บันทึกประวัติแบบ Append-only; ข้อมูลที่ลบจะถูกซ่อนทันที | กรองตาม User ID; ข้อมูลที่ Soft Delete ถูกคัดออกจากคำค้นหา |
| **AI Evaluation Results** | Evaluation Context | PostgreSQL (`FEEDBACK`, `EVALUATION_JOBS`) | `/api/v1/evaluations/{jobId}`<br>`/api/v1/interviews/{id}/feedback` | Read อย่างเดียวโดยเจ้าของ | รอรับผลแบบ Asynchronous Polling (P95 ≤ 15s) หรือ Push Notification | บันทึกผลลัพธ์แบบ Immutable ผูกกับ Rubric/Model Version ห้ามแก้ไข | แสดงผลเฉพาะเจ้าของบัญชี; คำร้องอุทธรณ์ส่งเข้าคิว Admin บน Web |
| **User Preferences** | User Context / Client | PostgreSQL (`USER_PREFERENCES`) + Local Storage | `/api/v1/users/preferences` | Read / Write โดยเจ้าของบัญชี | ค่าสากล (เช่น ภาษา) ซิงค์ข้ามเครื่อง; ค่าเฉพาะอุปกรณ์ (เช่น Biometric) เก็บในเครื่อง | ค่าจากเซิร์ฟเวอร์มีความสำคัญสำหรับสากล; ค่าอุปกรณ์คงอยู่ที่เครื่อง | ตรวจสอบ Schema ของ Preferences; ไม่เก็บข้อมูลส่วนบุคคลอ่อนไหว |
| **Consent Records** | Privacy Context | PostgreSQL (`CONSENT_EVENTS`, `PROCESSING_NOTICES`) | `/api/v1/privacy/consents`<br>`/api/v1/privacy/notices/current` | Read ข้อมูลที่ Active; Write แบบ Append-only | ซิงค์เมื่อเปิดแอป; หากมี Notice เวอร์ชันใหม่จะบังคับแสดงหน้าจอยอมรับ | บันทึกแบบ Event Stream; รายการล่าสุดต่อ Purpose Key มีผลบังคับใช้ | มี Audit Trail ถาวร; การถอนความยินยอมส่งผลระงับการประมวลผลทันที |

---

## 13. Traceability and Verification

| ข้อกำหนดหลัก / ข้อกังวล | FR ที่เกี่ยวข้อง | NFR / การตรวจสอบ | วิธีการทดสอบบน Web และ Mobile |
| --- | --- | --- | --- |
| จำลองคำถามเฉพาะประเภท (94/102) | FR02, FR04, FR07 | NFR02, NFR21 | ทดสอบความตรงหมวดหมู่และคลังคำถามข้ามอุปกรณ์ |
| คะแนนและการให้ Feedback (58/102) | FR08, FR11, FR36 | NFR02, NFR04 | ทดสอบการเรนเดอร์ Feedback และ Rubric Explanation บนทั้ง Web และ Mobile |
| การวิเคราะห์ภาษาอังกฤษ (57/102) | FR09 | NFR07, NFR21 | ทดสอบชุดข้อมูลไวยากรณ์สองภาษา |
| การฝึกด้วยเสียง (38/102) | FR05-V, FR05.1, FR10 | NFR09, NFR18 | ทดสอบ Web Audio API บนบราวเซอร์ และ Native Mic Bridge บน iOS/Android |
| ความกังวลด้านความเป็นส่วนตัว (57/102) | FR17, FR18, FR18.1, FR35 | NFR01, NFR17, NFR19 | ทดสอบความปลอดภัย Token, การลบแคชเสียงในมือถือ, และการบล็อกสิทธิ์ Admin/Researcher บนแอป |
| ความต้องการใช้งานทั้งเว็บและมือถือ (84/102) | **FR15** | **NFR08** | **E2E Multi-Device Testing:** ทดสอบความสอดคล้องของข้อมูลบัญชี ประวัติ และสิทธิ์ 100% |
| ระบบชำระเงินและสิทธิ์การใช้งาน (R3) | FR19–FR31 | NFR10–NFR16 | ทดสอบ Sandbox Checkout และการกระทบยอดสิทธิ์บน Web และ Mobile |

---

## 14. Risks, Decisions and Approval Conditions

### 14.1 Mobile & Cross-Platform Decision Register

| ID | หัวข้อการตัดสินใจ | คำอธิบายและทางเลือกเชิงเทคนิค | ตัวเลือกที่เสนอแนะ (Recommendation) | ผู้รับผิดชอบ | สถานะ |
| --- | --- | --- | --- | --- | --- |
| **D-M01** | Mobile Release Timeline | กำหนดช่วงเวลาการเปิดตัว Native Mobile App (iOS/Android): ปล่อยพร้อม R1, ปล่อยใน R2 พร้อมระบบเสียง หรือปล่อยใน R3 | **Option A (แนะนำ):** มุ่งเป้าปล่อยใน R2 ควบคู่กับ Voice & Progress เพื่อให้ R1 มุ่งเน้นความมั่นคงของ Core API บน Web | Product Owner / Tech Lead | **Pending Confirmation** |
| **D-M02** | Mobile Framework | เลือกเฟรมเวิร์กพัฒนาโมบายแอป: React Native / Expo, Flutter, หรือ Native Swift/Kotlin | **Option A (แนะนำ):** React Native / Expo เพื่อใช้ประโยชน์จากทักษะ TypeScript และแชร์ Validation Schemas กับ Web | Tech Lead / Mobile Architect | **Pending Confirmation** |
| **D-M03** | Minimum Supported OS | กำหนดเวอร์ชันระบบปฏิบัติการขั้นต่ำสำหรับ iOS และ Android | **Option A (แนะนำ):** iOS 16.0+ และ Android 13.0+ (API 33) เพื่อความปลอดภัยและการรองรับ Audio APIs สมัยใหม่ | QA Lead / Mobile Architect | **Pending Confirmation** |
| **D-M04** | Mobile Payment Strategy | สถาปัตยกรรมการชำระเงินบนมือถือ: In-App Purchase (IAP) หรือ Web Checkout Redirect | **Option A (แนะนำ):** เริ่มต้นด้วย Web Checkout Redirect ภายใต้การทบทวนกฎของ Store; จัดเตรียม IAP หากจำเป็น | Finance Admin / Legal | **Pending Confirmation** |
| **D-M05** | Push Notification Scope | ขอบเขตการใช้งาน Push Notifications (APNs / FCM) สำหรับแจ้งเตือนการฝึกและผลประเมิน | **Option A (แนะนำ):** กำหนดเป็นฟังก์ชันเสริมในระยะ R2 โดยมีระบบจัดการ Token และ Opt-in ชัดเจน | Product Owner / Backend Lead | **Pending Confirmation** |
| **D-M06** | Biometric Authentication | การรองรับการปลดล็อกแอปด้วย Face ID / Touch ID / Fingerprint | **Option A (แนะนำ):** พัฒนาเป็นฟีเจอร์เสริมในเครื่อง (Client-side enhancement) เพื่อปลดล็อก Token ที่เก็บใน Keychain | Security Lead / Mobile Lead | **Pending Confirmation** |
| **D-M07** | Deep Linking & Universal Links | การรองรับ Universal Links สำหรับเปิดลิงก์ยืนยันอีเมลและการแชร์เซสชันเข้าสู่แอปโดยตรง | **Option A (แนะนำ):** กำหนดค่า apple-app-site-association และ assetlinks.json เพื่อประสบการณ์ผู้ใช้ที่ราบรื่น | Frontend Lead / Mobile Lead | **Pending Confirmation** |
| **D-M08** | Offline Mode Scope | ขอบเขตการทำงานแบบออฟไลน์: บังคับออนไลน์สำหรับ AI หรืออนุญาตให้ฝึกออฟไลน์ | **Option A (แนะนำ):** บังคับเชื่อมต่ออินเทอร์เน็ตสำหรับการประเมิน AI; แอปทำหน้าที่แคชคำตอบระหว่างเน็ตหลุดเท่านั้น | Software Architect / AI Lead | **Pending Confirmation** |
| **D-M09** | Feature Parity Strategy | กลยุทธ์ความเท่าเทียมของฟีเจอร์ระหว่าง Web และ Mobile สำหรับ End Users | **Option A (แนะนำ):** ให้มีความเท่าเทียมกัน 100% สำหรับฟีเจอร์ของ End User ทั้งหมด; ส่วนงาน Admin/Research จำกัดบน Web | Product Owner / QA Lead | **Pending Confirmation** |
| **D-M10** | App Store Compliance | ความพร้อมต่อกฎระเบียบของ Apple App Store และ Google Play (In-app Deletion, Mic Permission) | **Option A (แนะนำ):** ปฏิบัติตาม Guideline 100% รวมถึงระบบขอลบบัญชีภายในแอป (FR35) และคำชี้แจงสิทธิ์ไมโครโฟน | Privacy Officer / Legal | **Pending Confirmation** |
| **D-M11** | Mobile Audio Protocol | โปรโตคอลส่งสัญญาณเสียงบนมือถือในระยะ R2: Chunked HTTPS Upload vs. WebSocket Streaming | **Option A (แนะนำ):** เริ่มต้นด้วย Chunked HTTPS Upload ไปยัง Signed URLs เพื่อความทนทานบนสัญญาณมือถือ | Tech Lead / AI Lead | **Pending Confirmation** |

### 14.2 System Risks & Open Decisions

| ID | ความเสี่ยง / การตัดสินใจที่เปิดอยู่ | ผู้รับผิดชอบ | เงื่อนไขการปลดล็อก (Gate) |
| --- | --- | --- | --- |
| **D01** | อนุมัติขอบเขต R1/R2/R3 และกรอบเวลา Native Mobile App | Product Owner | ก่อนเริ่ม Sprint Planning ของระยะถัดไป |
| **D02** | อนุมัติเกณฑ์ Rubric, เป้าหมายตัวเลข AI และชุดตัวอย่างทดสอบ | AI Lead + QA | ก่อนเริ่มกระบวนการ UAT |
| **D03** | อนุมัติระยะเวลา Retention และการจัดทำฐานทางกฎหมาย PDPA | Privacy / Legal | ก่อนประมวลผลข้อมูลส่วนบุคคลบน Production |
| **D04** | เลือกผู้ให้บริการ LLM และกำหนดเพดานงบประมาณค่า Token | Tech Lead | ก่อนเริ่มใช้งาน Production API |
| **D05** | อนุมัติราคาแพ็กเกจ โควตา และเงื่อนไขการคืนเงิน | Business / Finance | ก่อนเปิดให้บริการระบบชำระเงินใน R3 |
| **D06** | กำหนดขอบเขตข้อมูลวิจัยและกลไกขอความยินยอม | Research Lead / Privacy | ก่อนเปิดระบบสืบค้นข้อมูลวิจัยใน R3 |
| **D07** | ลงนามอนุมัติเอกสารข้อกำหนดระบบ (SRS) อย่างเป็นทางการ | Executive Sponsor | ก่อนปิด Phase 1 Requirement Alignment |

---

## Change log

| Version | Date | Summary of Changes | Author / Reviewer |
| --- | --- | --- | --- |
| **0.x** | — | Initial 11-chapter draft from requirements gathering | Business Analysis Team |
| **0.9** | 08 Oct 2026 | Review addendum and survey validation adjustments | System Architecture Team |
| **1.0** | 08 Oct 2026 | Consolidated baseline; direct correction of FR/NFR/RBAC/consent/data model; release separation; traceability; sign-off pending | Technical Documentation Lead |
| **1.1 DRAFT** | 13 Nov 2026 | **Phase 1 Requirement Alignment:**<br>- แยกขอบเขตแพลตฟอร์มชัดเจนระหว่าง Responsive Web และ Native Mobile Application (iOS/Android)<br>- ปรับปรุงข้อกำหนด FR15 Multi-Platform Access และเกณฑ์การยอมรับ 7 ข้อ (Proposed)<br>- ปรับปรุงข้อกำหนด NFR08 Cross-Platform Accessibility & Consistency (Web WCAG 2.2 AA, Mobile VoiceOver/TalkBack, 100% Data Sync)<br>- กำหนด Platform Access Matrix (Role × Platform) และ Subscription Matrix (Tier × Platform)<br>- บรรจุ Core Authorization Rules 7 ประการ และตาราง Cross-Platform Data Synchronization 8 หมวด<br>- บันทึก Mobile Decision Register (D-M01 ถึง D-M11) ครอบคลุมประเด็นเทคนิคและธุรกิจ | Senior BA, SA, Architect & Tech Spec Team |

---

> **— END OF CONTROLLED DOCUMENT (สิ้นสุดเอกสารควบคุม) —**  
> Document ID: IX-SRS-001 | Version: 1.1 DRAFT Baseline | Date: 13 November 2026
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(md_content)

print(f"Generated Markdown SRS: {out_path}")
