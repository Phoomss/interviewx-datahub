# 01. ข้อกำหนดของระบบ (System Requirements)

เอกสารนี้ระบุข้อกำหนดเชิงหน้าที่ (Functional Requirements), ข้อกำหนดที่ไม่ใช่เชิงหน้าที่ (Non-Functional Requirements), และบทบาทของผู้ใช้งาน (User Personas) สำหรับระบบ **InterviewX DataHub** โดยอ้างอิงบริบทโครงการจาก [`00-PROJECT-CONTEXT.md`](file:///Users/mac/Desktop/interviewx-datahub/context/00-PROJECT-CONTEXT.md)

---

## 1. กลุ่มผู้ใช้งานหลัก (User Personas)

1. **AI / ML Engineer**:
   - ต้องการสร้างและคัดเลือกชุดข้อมูลเรซูเมที่มีคุณภาพสำหรับเทรน LLM
   - กำหนดพารามิเตอร์การสร้าง Synthetic Data และสกัดฟีเจอร์สำหรับ Fine-tuning
   - ต้องการส่งออก Dataset ตามฟอร์แมตมาตรฐาน (Alpaca, ShareGPT, JSONL) พร้อมเลขเวอร์ชันที่อ้างอิงได้
2. **Data Annotator / QA Specialist**:
   - ตรวจสอบความถูกต้องของข้อมูลที่สกัดได้จากเอกสารเทียบกับไฟล์จริง (Side-by-side View)
   - ปรับปรุง แก้ไข และกดอนุมัติ (Approve/Reject) ข้อมูลก่อนนำเข้า Training Pool
3. **Data Engineer**:
   - ดูแลเสถียรภาพของ Ingestion Pipeline และ Background Queue
   - มอนิเตอร์อัตราความสำเร็จของการ Parse เอกสารและการทำงานร่วมกันระหว่าง Services
4. **Platform Administrator**:
   - จัดการสิทธิ์ผู้ใช้งาน (RBAC), ตรวจสอบ Audit Log, และควบคุมการเข้าถึงข้อมูลที่ละเอียดอ่อน

---

## 2. ข้อกำหนดเชิงหน้าที่ (Functional Requirements: FR)

### FR-01: การยืนยันตัวตนและการจัดการสิทธิ์ (Authentication & RBAC)
- รองรับระบบ Login ด้วยอีเมล/รหัสผ่าน และกำหนดบทบาทผู้ใช้ (`ADMIN`, `ML_ENGINEER`, `ANNOTATOR`, `VIEWER`)
- ควบคุมสิทธิ์การเข้าถึงข้อมูล (Data Access Boundary) โดย Annotator จะไม่สามารถดูหรือดาวน์โหลด PII ของเรซูเมจริงได้หากไม่ได้รับอนุญาต

### FR-02: การนำเข้าเอกสารและการจัดเก็บ (Document Ingestion & Storage)
- รองรับการอัปโหลดไฟล์เรซูเมนามสกุล `.pdf` และ `.docx` (ทั้งแบบเดี่ยวและ Batch Upload)
- บันทึกไฟล์ต้นฉบับลง Object Storage (MinIO) โดยมีการตั้งชื่อแบบ UUID ป้องกันการเขียนทับ
- รองรับการระบุแหล่งที่มา (`source_type`: `SYNTHETIC_GENERATED`, `AUTHORIZED_PARTNER`, `DIRECT_SUBMISSION`)

### FR-03: การสกัดและประมวลผลข้อมูลอัตโนมัติ (Automated Parsing & Extraction)
- สกัดข้อความดิบ (Raw Text) และโครงสร้างพื้นฐานจาก PDF และ DOCX ผ่าน AI Service (FastAPI)
- แปลงข้อความดิบเป็นข้อมูลโครงสร้างมาตรฐาน (Structured Profile JSON) เช่น:
  - Personal Info (ชั่วคราว/แยกส่วน)
  - Work Experiences (บริษัท, ตำแหน่ง, ระยะเวลา, ความรับผิดชอบ)
  - Educations (สถาบัน, วุฒิ, สาขา, เกรด)
  - Skills (Hard Skills, Soft Skills, Tools)
  - Projects & Certifications
- บันทึก Provenance (ความเชื่อมโยงระหว่างข้อมูลที่สกัดได้กับตำแหน่งข้อความในไฟล์ต้นฉบับ)

### FR-04: ระบบสร้างข้อมูลเรซูเมสังเคราะห์ (Synthetic Resume Generator)
- รองรับการสร้างเรซูเมจำลองโดยกำหนด Persona, Job Role, Seniority Level, Industry, และ Tech Stack
- มีระบบตรวจสอบความสมเหตุสมผล (Sanity Check) และโครงสร้าง JSON ผ่าน Pydantic Schema
- กำหนดแท็ก `is_synthetic = true` ให้ข้อมูลสังเคราะห์ทุกรายการโดยอัตโนมัติ และไม่สามารถแก้ไขเป็น false ได้

### FR-05: พื้นที่ทำงานสำหรับตรวจสอบและกำกับข้อมูล (Annotation & QA Workspace)
- หน้าจอแสดงผลเปรียบเทียบไฟล์จริง (PDF/DOCX Viewer) ด้านซ้าย และข้อมูล JSON ที่ถูกสกัดด้านขวา (Side-by-side)
- Annotator สามารถแก้ไขข้อความที่ระบบสกัดผิดพลาดได้
- ระบบสถานะเอกสาร: `PENDING_PARSE`, `PARSED`, `IN_REVIEW`, `APPROVED`, `REJECTED`
- บันทึกประวัติการแก้ไขและชื่อผู้ตรวจสอบไว้ใน Audit Trail

### FR-06: การค้นหา กรอง และจัดการชุดข้อมูล (Dataset Management & Curation)
- ค้นหาและกรองเรซูเมตามทักษะ (Skills), ตำแหน่งงาน (Role), ระดับประสบการณ์ (Seniority), สถานะการตรวจ, และประเภทข้อมูล (Synthetic / Real)
- จัดกลุ่มข้อมูลเป็น Collection หรือ Dataset Slice เพื่อเตรียมนำไปเทรนโมเดล

### FR-07: การส่งออกชุดข้อมูลสำหรับฝึกสอน LLM (Training Dataset Export)
- ส่งออกข้อมูลในรูปแบบมาตรฐานสำหรับงาน LLM:
  - Instruction Tuning Format (Alpaca / ShareGPT / OpenAI ChatML JSONL)
  - RAG / Embedding Format
- มีระบบคัดกรองอัตโนมัติ (Gatekeeper Filter) เพื่อตัด PII ทั้งหมดออกจากข้อมูลที่จะส่งออก
- ทำงานร่วมกับ DVC หรือ MLflow เพื่อบันทึก Dataset Snapshot Version และ Data Hash

### FR-08: การจัดการสิทธิ์และการถอนความยินยอม (Consent & Withdrawal Lifecycle)
- ระบบบันทึกเอกสารความยินยอม (Consent Record) ผูกกับเรซูเมจริง
- รองรับคำขอถอนความยินยอม (Consent Revocation): เมื่อผู้ใช้ขอถอนความยินยอม ระบบต้องลบไฟล์จริงออกจาก MinIO และลบข้อมูลออกจากฐานข้อมูล หรือ Mark เป็น Hard Deleted รวมถึงนำออกจากคลัง Dataset ที่รอเทรน

### FR-09: ระบบการนำทางสากลและการออกแบบส่วนติดต่อผู้ใช้ (Universal Navigation & Modern SaaS UI)
- แถบนำทางแคปซูลลอยตัว (Floating Capsule Navbar) ธีมสว่าง (Clean Light Theme)
- สัญลักษณ์แบรนด์เฉพาะ `InterviewXLogo` (Dynamic "X", DataHub Node, AI Spark ✦)
- รวมศูนย์เมนูในปุ่มหลักปุ่มเดียว (`❖ เมนูระบบทั้งหมด ▾`) พร้อมกลไกหน่วงเวลาเปิด 70ms และหน่วงเวลาปิด 150ms (Zero-flicker Debounce)
- การ์ดเมนูรวมโมดูล (`FloatingNavigationMenu`) แสดง 7 ระบบหลัก พร้อมป้ายกำกับสถานะหน้าปัจจุบันและทางลัด Swagger API
- ปุ่มสลับบทบาทจำลอง (Role Switcher) แสดงระดับสิทธิ์ PII และปุ่มคัดลอก Endpoint API พร้อมแอนิเมชัน `Copied ✅`
- ซ่อนแถบนำทางโดยอัตโนมัติในหน้า Review Workspace (`/resumes/:id/review`) เพื่อคืนพื้นที่หน้าจออย่างสมบูรณ์

### FR-10: การสังเคราะห์เอกสารดิบเสมือนจริง (Synthetic Raw Document Synthesis)
- สร้างไฟล์ PDF แบบ Dynamic On-the-fly จากข้อมูลสังเคราะห์ JSON เพื่อรองรับการเปิดดูแบบ Raw Stream (`/api/v1/documents/:id/raw`) ในหน้า Review Studio
- ป้องกันข้อผิดพลาด HTTP 404 Not Found และมีระบบ Fallback เป็น Plain Text เมื่อแสดงผลบนเบราว์เซอร์หรืออุปกรณ์พกพา

---

## 3. ข้อกำหนดที่ไม่ใช่เชิงหน้าที่ (Non-Functional Requirements: NFR)

### NFR-01: ประสิทธิภาพและเวลาตอบสนอง (Performance & Latency)
- งานประมวลผลหนัก (Parsing, LLM Extraction, Batch Generation) ต้องทำงานแบบ Asynchronous ผ่าน Background Queue (Redis) เพื่อไม่ให้บล็อก REST API
- API ทั่วไปของ NestJS ต้องตอบสนอง (P95 Latency) ภายใน 200ms
- การอัปโหลดไฟล์ขนาดไม่เกิน 20MB ต้องเสร็จสิ้นภายใน 3 วินาที (ขึ้นอยู่กับเครือข่าย)

### NFR-02: ความมั่นคงปลอดภัยและการปกป้องข้อมูลส่วนบุคคล (Security & Privacy)
- ปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) อย่างเคร่งครัด
- ต้องแยกส่วนการจัดเก็บ PII ออกจากข้อมูลทักษะและประวัติการทำงาน (PII Segregation Pattern)
- เข้ารหัสข้อมูลที่เป็นความลับในระดับฐานข้อมูลและจัดเก็บบนเครือข่ายภายในที่ปลอดภัย

### NFR-03: ความน่าเชื่อถือและความทนทานต่อข้อผิดพลาด (Reliability & Fault Tolerance)
- ระบบคิวงานต้องรองรับ Retry Strategy เมื่อเกิดข้อผิดพลาดจาก External AI API (เช่น Rate Limit หรือ Network Timeout)
- มีระบบ Dead Letter Queue (DLQ) สำหรับบันทึกงานที่ล้มเหลวเพื่อนำกลับมาตรวจสอบและ Re-run ได้
- งานทั้งหมดในคิวต้องมีลักษณะ Idempotent (รันซ้ำแล้วไม่สร้างข้อมูลซ้ำซ้อน)

### NFR-04: ความสามารถในการขยายระบบ (Scalability)
- ฝั่ง FastAPI AI Processing Worker ต้องสามารถ Scale-out เพิ่มจำนวน Container ได้อิสระตามปริมาณงานคิว
- MinIO และ PostgreSQL ต้องรองรับการจัดการไฟล์และระเบียนข้อมูลจำนวนหลักแสนรายการขึ้นไป

### NFR-05: ความสอดคล้องและการตรวจสอบย้อนกลับ (Auditability & Data Lineage)
- ทุกการแก้ไขข้อมูล (Manual Edit) และการ Export ชุดข้อมูล ต้องบันทึกผู้กระทำ เวลา และค่าเดิม/ค่าใหม่
- ทุกแถวของ Dataset ที่ส่งออกต้องสามารถตรวจสอบย้อนกลับได้ว่ามาจากเรซูเมรหัสใด และถูกสกัดด้วยไปป์ไลน์เวอร์ชันใด

---

## 4. ข้อสมมติฐานหลัก (Explicit Assumptions)

1. **การควบคุมการใช้งานภายใน (Internal Platform)**: ระบบนี้ใช้งานภายในองค์กรโดยทีมงาน InterviewX ไม่ได้เปิดเป็น Public SaaS ให้บุคคลทั่วไปสมัครสมาชิก
2. **ขนาดไฟล์เรซูเม**: ขนาดไฟล์เฉลี่ยไม่เกิน 10MB ต่อไฟล์ (PDF/DOCX) และจำกัดขนาดสูงสุดไม่เกิน 25MB
3. **ภาษาของเรซูเม**: ระบบระยะแรกเน้นภาษาอังกฤษ (English) และภาษาไทย (Thai) เป็นหลัก

---

## 5. ประเด็นที่ยังค้างการตัดสินใจ (Unresolved Decisions)

1. **สิทธิ์การดู PII ระหว่าง Annotation**: จะใช้วิธี Masking อัตโนมัติก่อนส่งให้ Annotator ตรวจ หรืออนุญาตให้ Annotator เฉพาะกลุ่มที่ผ่านการยืนยันสิทธิ์ดูข้อมูลต้นฉบับได้เพื่อตรวจสอบความถูกต้องของชื่อ-สกุล
2. **เกณฑ์ขั้นต่ำของการ Approve อัตโนมัติ (Auto-Approval Threshold)**: ควรกำหนดระดับความมั่นใจ (Confidence Score) ของ LLM เพื่อข้ามขั้นตอน Human Review สำหรับ Synthetic Data หรือไม่ (ในระยะแรกควรกำหนดให้ตรวจโดยมนุษย์หรือสุ่มตรวจก่อน)
