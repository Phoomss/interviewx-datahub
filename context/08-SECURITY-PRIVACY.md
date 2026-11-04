# 08. ความมั่นคงปลอดภัยและการปกป้องข้อมูลส่วนบุคคล (Security & Privacy Governance)

เอกสารนี้ระบุข้อกำหนดด้านความปลอดภัย นโยบายการคุ้มครองข้อมูลส่วนบุคคล (PDPA/GDPR), การแบ่งแยกสิทธิ์ (RBAC), สถาปัตยกรรมแยกเก็บ PII, และระบบบันทึกประวัติการใช้งาน (Audit Trail) สำหรับ **InterviewX DataHub** อ้างอิงกฎจาก [`AGENTS.md`](file:///Users/mac/Desktop/interviewx-datahub/context/08-SECURITY-PRIVACY.md)

---

## 1. กฎการกำกับดูแลข้อมูลส่วนบุคคล (Data Privacy Core Rules)

ตามข้อกำหนดใน [`AGENTS.md`](file:///Users/mac/Desktop/interviewx-datahub/AGENTS.md):
1. **ข้อมูลสังเคราะห์และข้อมูลจริงต้องแยกออกจากกันอย่างเด็ดขาด (Strict Distinguishability)**: ข้อมูลทุกรายการต้องมีป้ายกำกับแหล่งที่มาที่ชัดเจน
2. **ห้ามนำข้อมูลจริงมาใช้โดยปราศจากความยินยอมที่ชอบด้วยกฎหมาย**: ต้องมี `ConsentRecord` ที่ถูกต้องก่อนนำเข้าและประมวลผล
3. **การแยกข้อมูลระบุตัวตน (PII Segregation)**: ข้อมูล PII ต้องถูกแยกออกจากข้อมูลที่ใช้ในการฝึกสอนโมเดล
4. **การสกัดกั้นการรั่วไหลของ PII (Zero PII Leakage Gate)**: ปิดกั้นการส่งออก PII ในขั้นตอนการสร้าง Dataset อย่างสมบูรณ์
5. **รองรับการถอนความยินยอมและการลบข้อมูล (Consent Withdrawal & Right to be Forgotten)**: มีขั้นตอนและระบบอัตโนมัติในการลบข้อมูลจริงเมื่อได้รับคำขอ
6. **การบันทึกประวัติการเข้าถึง (Comprehensive Audit Logs)**: ทุกการกระทำที่เกี่ยวข้องกับข้อมูลต้องถูกบันทึก

---

## 2. สถาปัตยกรรมการแยกเก็บ PII (PII Vault Pattern)

เพื่อป้องกันไม่ให้ข้อมูลส่วนบุคคลปะปนกับประวัติการทำงานและทักษะ ระบบใช้สถาปัตยกรรมแบบแยกตารางและคีย์ (Vault Pattern):

```mermaid
flowchart TD
    RawDoc["เรซูเมต้นฉบับ (PDF/DOCX)"] --> Parser["FastAPI Extraction"]
    
    subgraph PrivacyVault["พื้นที่ควบคุมความปลอดภัยสูง (Protected PII Boundary)"]
        Parser -->|สกัดชื่อ, อีเมล, เบอร์, เลขบัตร| PiiVault[("ตาราง PiiVault\n(Restricted Access)")]
        RawDoc -->|จัดเก็บไฟล์ดิบ| MinIOSecret[("MinIO Bucket: raw-documents\n(Encrypted & Presigned Only)")]
    end

    subgraph TrainingReady["พื้นที่ข้อมูลฝึกสอน (Training Data Pool)"]
        Parser -->|สกัดทักษะ, ประวัติงาน, การศึกษา| ParsedProfile[("ตาราง ParsedProfile\n(Anonymized Structured Data)")]
        ParsedProfile --> CleanExport["LLM Training Export Engine"]
    end

    CleanExport --> ExportFile["Dataset (.jsonl)\n(100% ปราศจาก PII)"]
```

- **PiiVault**: ข้อมูลส่วนบุคคลทุกรายการ (ชื่อ, นามสกุล, อีเมล, เบอร์โทรศัพท์, เลขบัตรประชาชน, เลขที่หนังสือเดินทาง, วันเดือนปีเกิด) ถูกเข้ารหัสด้วย **AES-256-GCM** จัดเก็บลงในคอลัมน์ `encryptedPayload` โดยไม่มีการเก็บเป็น Plaintext ในคอลัมน์เด็ดขาด
- **ParsedProfile**: จัดเก็บเฉพาะเนื้อหาเชิงวิชาชีพ (ทักษะ, ตำแหน่งงาน, ประสบการณ์, การศึกษา) โดยแยกคอลัมน์ `originalExtractedData` และ `humanCorrectedData` อย่างชัดเจน

---

## 3. การพิสูจน์ตัวตนและการควบคุมการเข้าถึง (Authentication & Server-Side RBAC)

- **JWT Authentication**: บังคับใช้การตรวจสอบตัวตนผ่าน JSON Web Token (HMAC-SHA256) และเข้ารหัสรหัสผ่านผู้ใช้งานด้วย **PBKDF2/SHA-512** พร้อม Salt เฉพาะบุคคล
- **Server-Side RolesGuard**: ตรวจสอบสิทธิ์ที่ฝั่งเซิร์ฟเวอร์ ไม่อนุญาตให้ Client ปลอมแปลง Header `x-user-role`
- **ตารางสิทธิ์การใช้งาน (Permissions Matrix)**:

| สิทธิ์การใช้งาน (Permissions) | ADMIN | ML_ENGINEER | ANNOTATOR | VIEWER |
| :--- | :---: | :---: | :---: | :---: |
| ดูรายการและแดชบอร์ด (View Dashboard) | ✅ | ✅ | ✅ | ✅ |
| อัปโหลดเรซูเมจริงพร้อม Consent | ✅ | ❌ | ❌ | ❌ |
| สร้างข้อมูลสังเคราะห์ (Trigger Synthetic Job) | ✅ | ✅ | ❌ | ❌ |
| เข้าถึงหน้าตรวจสอบข้อมูล (Annotation Workspace) | ✅ | ✅ | ✅ | ❌ |
| แก้ไขและรับรองข้อมูล (Approve/Reject Profile) | ✅ | ✅ | ✅ | ❌ |
| ดูข้อมูล PII ต้นฉบับที่ถอดรหัสแล้วจาก PiiVault | ✅ | ❌ | ❌ | ❌ |
| ส่งออก Dataset สำหรับ LLM (Trigger Export) | ✅ | ✅ | ❌ | ❌ |
| จัดการงานฝึกสอนและทะเบียนโมเดล (Training & Registry) | ✅ | ✅ | ❌ | ❌ |
| อนุมัติโมเดลสู่ระดับ PRODUCTION (Integrity Gate) | ✅ | ❌ | ❌ | ❌ |
| จัดการคำขอถอนความยินยอม (Consent Withdrawal) | ✅ | ❌ | ❌ | ❌ |
| ตรวจสอบบันทึกระบบ (View Audit Logs) | ✅ | ❌ | ❌ | ❌ |

---

## 4. วงจรการถอนความยินยอมและการลบข้อมูลแบบลูกโซ่ (Consent Revocation Cascade)

เมื่อเจ้าของข้อมูลส่วนบุคคล (Data Subject) แจ้งขอถอนความยินยอม (Withdrawal Request):
1. **ปรับสถานะ Entity `Subject`**: ปรับสถานะเจ้าของข้อมูลในตาราง `model Subject` เป็น `CONSENT_WITHDRAWN`
2. **สร้างประวัติและ Snapshot**: บันทึกการเพิกถอนใน `ConsentRecord` และคัดลอกประวัติแบบไม่เปลี่ยนแปลงลงใน `ConsentHistory`
3. **Hard Delete ใน PiiVault และ MinIO**:
   - ลบไฟล์เอกสารดิบออกจาก MinIO
   - ล้างข้อมูลที่เข้ารหัสและกุญแจใน `PiiVault`
4. **ตัดออกจาก Training Pipeline และแจ้งเตือนอดีต**:
   - ปรับสถานะเอกสารเป็น `REVOKED_CONSENT_RESTRICTED`
   - ค้นหาชุดข้อมูลที่เคย Export ในอดีตที่มีเอกสารของ Subject รายนี้ และสร้าง Audit Log เตือนให้ Retract หรือ Re-split Dataset ทันที

---

## 5. การบันทึกประวัติการใช้งานระบบ (Audit Trail & Logging)

ตาราง `AuditLog` ถูกออกแบบให้เป็น **Append-Only** (ไม่อนุญาตให้อัปเดตหรือลบระเบียน):
- **ฟิลด์ที่บันทึก**: `user_id`, `action`, `entity_name`, `entity_id`, `ip_address`, `payload_diff`, `created_at`
- **กิจกรรมที่ต้องบันทึก**:
  - การเข้าสู่ระบบและการออกจากระบบ
  - การแก้ไขข้อมูลเรซูเมโดยมนุษย์ (Manual Annotation Edits)
  - การกด Approve หรือ Reject ข้อมูล
  - การสั่งรัน Synthetic Generation Job
  - การส่งออก Dataset (บันทึก filter parameters และ hash)
  - การเพิกถอนความยินยอมและการลบข้อมูล

---

## 6. ข้อสมมติฐานหลัก (Explicit Assumptions)

1. **ระบบเครือข่ายภายใน (Private Virtual Network)**: ฐานข้อมูล PostgreSQL, MinIO, Redis และ FastAPI สื่อสารผ่าน Internal Docker Network เท่านั้น มีเพียง NestJS และ Next.js ที่เชื่อมโยงกับภายนอกตามขอบเขต
2. **การเข้ารหัสในการส่งผ่าน (Encryption in Transit)**: ทราฟฟิกภายนอกทั้งหมดบังคับใช้ TLS/HTTPS

---

## 7. ประเด็นที่ยังค้างการตัดสินใจ (Unresolved Decisions)

1. **การ Masking PII อัตโนมัติบน PDF Preview**: ในหน้าจอ Side-by-side ของ Annotator ควรมีระบบระบายแถบดำ (Blackout Redaction) บนไฟล์ PDF อัตโนมัติก่อนแสดงผลหรือไม่ เพื่อให้ Annotator ไม่เห็นข้อมูล PII โดยสิ้นเชิง
2. **การเก็บรักษาข้อมูลหลังการถอนความยินยอม (Data Retention Policy)**: หาก Dataset ถูกนำไปเทรนโมเดลจนเสร็จสิ้นไปแล้วก่อนมีการถอนความยินยอม นโยบายทางกฎหมายขององค์กรจะปฏิบัติต่อ Checkpoint โมเดลนั้นอย่างไร
