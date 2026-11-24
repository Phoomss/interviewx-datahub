# 00. บริบทโครงการ (Project Context)

เอกสารนี้สรุปภาพรวม บริบททางธุรกิจ วัตถุประสงค์หลัก และสารบัญเอกสารบริบททั้งหมดของโครงการ **InterviewX DataHub** เพื่อเป็นฐานความเข้าใจร่วมกันสำหรับทีมพัฒนาและตัวแทนปัญญาประดิษฐ์ (AI Agents)

---

## 1. ภาพรวมโครงการ (Project Overview)

**InterviewX DataHub** คือแพลตฟอร์มบริหารจัดการข้อมูลภายใน (Internal Data Management Platform) ที่ออกแบบมาเพื่อรวบรวม (Collect), ประมวลผล (Process), ตรวจสอบความถูกต้อง (Validate), ทำคำอธิบายประกอบ (Annotate), และจัดเตรียมชุดข้อมูลเรซูเม / ประวัติการทำงาน (Resume / CV / Candidate Profile) สำหรับใช้ในการฝึกสอนและปรับแต่งโมเดลภาษาขนาดใหญ่ (Large Language Model - LLM) ของระบบ **InterviewX**

### 1.1 ปัญหาทางธุรกิจและเป้าหมาย (Problem Statement & Goals)
1. **การขาดแคลนข้อมูลเรซูเมคุณภาพสูงที่มีโครงสร้างชัดเจน**: ข้อมูลเรซูเมในโลกจริงส่วนใหญ่อยู่ในรูปแบบเอกสารไร้โครงสร้าง (Unstructured PDF/DOCX) มีรูปแบบที่หลากหลาย ข้อมูลกระจัดกระจาย และยากต่อการนำมาใช้เทรนโมเดลสัมภาษณ์งาน
2. **ความเสี่ยงด้านข้อมูลส่วนบุคคล (PII & Data Privacy)**: การนำข้อมูลจริงมาใช้ต้องผ่านความยินยอม (Consent) และปฏิบัติตามกฎหมาย PDPA/GDPR อย่างเคร่งครัด
3. **ความหลากหลายและความสมดุลของข้อมูล (Data Diversity & Bias)**: ต้องครอบคลุมตำแหน่งงาน ทักษะ อุตสาหกรรม และระดับประสบการณ์ที่หลากหลาย

### 1.2 วัตถุประสงค์หลัก (Primary Objectives)
- สร้างแพลตฟอร์ม Dataset Management ที่เชื่อถือได้และตรวจสอบย้อนกลับได้ (Traceable & Auditable)
- เริ่มต้นด้วยการสร้างและใช้ **Synthetic Data (ข้อมูลสังเคราะห์)** คุณภาพสูง เพื่อเร่งสปีดการเทรนโมเดลโดยไม่มีข้อจำกัดเรื่อง PII
- รองรับการนำเข้า **Real-world Data (ข้อมูลจริง)** ที่ได้รับความยินยอมอย่างถูกต้องตามกฎหมายในระยะถัดไป พร้อมระบบแยก PII และจัดการ Consent Withdrawal
- มี Pipeline การสกัดข้อมูล (Data Extraction), ตรวจสอบคุณภาพ (Human-in-the-loop QA), และ Export ชุดข้อมูลสำหรับ LLM Fine-tuning / RAG อย่างเป็นมาตรฐาน

---

## 2. สถานะปัจจุบันของคลังโค้ด (Current Repository State)

ณ ปัจจุบัน คลังโค้ด (`interviewx-datahub`) อยู่ในสถานะ **เริ่มต้นโครงการ (Initial Baseline / Greenfield Stage)**:
- มีไฟล์ตั้งต้นคือ [`AGENTS.md`](file:///Users/mac/Desktop/interviewx-datahub/AGENTS.md) ซึ่งกำหนดเป้าหมาย สแต็กเทคโนโลยี และกฎระเบียบเชิงสถาปัตยกรรม
- ยังไม่มีโค้ดโปรแกรม (Application Source Code), ไม่มีการติดตั้ง Dependency และยังไม่มีโครงสร้างโฟลเดอร์ของแอปพลิเคชัน
- เอกสารในชุด `context/` นี้จัดทำขึ้นเพื่อกำหนดกรอบสถาปัตยกรรม สัญญาทางข้อมูล และแผนการดำเนินงานก่อนเริ่มพัฒนาโค้ดจริง

---

## 3. สารบัญเอกสารบริบท (Context Index)

เอกสารในโฟลเดอร์ `context/` แบ่งหน้าที่ความรับผิดชอบอย่างเป็นเอกเทศ ดังนี้:

| ลำดับ | เอกสาร | หน้าที่และความรับผิดชอบหลัก |
| :--- | :--- | :--- |
| 00 | [`00-PROJECT-CONTEXT.md`](file:///Users/mac/Desktop/interviewx-datahub/context/00-PROJECT-CONTEXT.md) | ภาพรวมโครงการ วัตถุประสงค์ สถานะคลังโค้ด และสารบัญ |
| 01 | [`01-REQUIREMENTS.md`](file:///Users/mac/Desktop/interviewx-datahub/context/01-REQUIREMENTS.md) | ข้อกำหนดเชิงหน้าที่และไม่ใช่เชิงหน้าที่ (Functional & Non-Functional Requirements) และ User Personas |
| 02 | [`02-ARCHITECTURE.md`](file:///Users/mac/Desktop/interviewx-datahub/context/02-ARCHITECTURE.md) | สถาปัตยกรรมระบบโดยรวม บทบาทของแต่ละ Service และรูปแบบการสื่อสาร |
| 03 | [`03-DATABASE.md`](file:///Users/mac/Desktop/interviewx-datahub/context/03-DATABASE.md) | โครงสร้างฐานข้อมูล PostgreSQL, Prisma Schema, ER Diagram และแนวทางการจัดเก็บ |
| 04 | [`04-API-CONTRACT.md`](file:///Users/mac/Desktop/interviewx-datahub/context/04-API-CONTRACT.md) | สัญญาการเชื่อมต่อ API ระหว่าง Next.js, NestJS และ FastAPI รวมถึง DTO และ Error Standard |
| 05 | [`05-DATA-PIPELINE.md`](file:///Users/mac/Desktop/interviewx-datahub/context/05-DATA-PIPELINE.md) | กระบวนการสกัดข้อมูลเอกสาร (Ingestion, Parsing, Validation, Annotation Flow) |
| 06 | [`06-SYNTHETIC-DATA.md`](file:///Users/mac/Desktop/interviewx-datahub/context/06-SYNTHETIC-DATA.md) | ยุทธศาสตร์การสร้างข้อมูลสังเคราะห์ เทมเพลต และเกณฑ์การประเมินคุณภาพ |
| 07 | [`07-LLM-TRAINING.md`](file:///Users/mac/Desktop/interviewx-datahub/context/07-LLM-TRAINING.md) | การจัดเตรียมและ Export ชุดข้อมูลสำหรับ LLM (Alpaca, ShareGPT, DVC/MLflow) |
| 08 | [`08-SECURITY-PRIVACY.md`](file:///Users/mac/Desktop/interviewx-datahub/context/08-SECURITY-PRIVACY.md) | นโยบายความปลอดภัย การแยกเก็บ PII มาตรการ PDPA และ Audit Trail |
| 09 | [`09-UI-UX.md`](file:///Users/mac/Desktop/interviewx-datahub/context/09-UI-UX.md) | ข้อกำหนดหน้าจอการทำงาน (UI/UX), การแสดงผลแบบ Side-by-side, และ Annotation Workspace |
| 10 | [`10-TESTING.md`](file:///Users/mac/Desktop/interviewx-datahub/context/10-TESTING.md) | กลยุทธ์การทดสอบ (Unit, Integration, E2E, Data Pipeline Quality Testing) |
| 11 | [`11-ROADMAP.md`](file:///Users/mac/Desktop/interviewx-datahub/context/11-ROADMAP.md) | แผนการพัฒนาแบบเป็นระยะ (Milestones, Deliverables และความเสี่ยง) |

---

## 4. กฎเกณฑ์และข้อตกลงทางเทคนิค (Core Technical Principles)

อ้างอิงจาก [`AGENTS.md`](file:///Users/mac/Desktop/interviewx-datahub/AGENTS.md):
1. **NestJS** เป็นศูนย์กลางของ Core Business Logic, สิทธิ์ผู้ใช้งาน, REST API สำหรับ Frontend และควบคุม Data Lifecycle
2. **FastAPI** รับผิดชอบงานประมวลผลทาง AI และเอกสาร (Document Parsing, Information Extraction, Synthetic Generation)
3. **Next.js** ติดต่อสื่อสารกับ NestJS เท่านั้น ไม่เรียกตรงไปยัง FastAPI
4. **PostgreSQL** จัดเก็บข้อมูลที่มีโครงสร้างและ Metadata
5. **MinIO** จัดเก็บไฟล์เอกสารต้นฉบับ (PDF/DOCX) และ Artifacts
6. **Redis** จัดการคิวงานเบื้องหลัง (Background Job Queue) และแคช
7. **การแยกความจริงและสิ่งสังเคราะห์**: ข้อมูลสังเคราะห์ (`synthetic`) และข้อมูลจริง (`real-world`) ต้องแยกออกจากกันอย่างเด็ดขาดและระบุแหล่งที่มาได้เสมอ
8. **ไม่มีการใช้ข้อมูลหลอกในระดับ Production**: ห้ามจำลองข้อมูลสำเร็จแบบ Fake เพื่อหลบเลี่ยงความล้มเหลวของระบบจริง

---

## 5. ข้อสมมติฐานหลัก (Explicit Assumptions)

1. **โครงสร้างโค้ดแบบ Monorepo**: สันนิษฐานว่าโครงการจะจัดโครงสร้างแบบ Monorepo โดยใช้ **Bun Workspaces** สำหรับ JavaScript/TypeScript (`frontend`, `backend`) และโฟลเดอร์แยกสำหรับ Python AI Service (`ai-service`)
2. **การรันในเครื่องและ On-premise**: สันนิษฐานว่าการพัฒนาและรันในสภาพแวดล้อม Local / Staging จะใช้ `docker-compose` เป็นหลักในการจำลอง Services ภายนอก (PostgreSQL, MinIO, Redis, MLflow)
3. **การเข้าถึง LLM Provider**: สันนิษฐานว่าการสร้างข้อมูลสังเคราะห์และการสกัดข้อมูลจะอาศัย External LLM API (เช่น Gemini API หรือ OpenAI API) ควบคู่กับ Local Parsing Tools (PyMuPDF, python-docx)

---

## 6. ประเด็นที่ยังค้างการตัดสินใจ (Unresolved Decisions)

1. **Monorepo Build Tooling**: เลือกระหว่างการใช้ `Bun Workspaces` เดี่ยวๆ หรือผสาน `Turborepo` ร่วมกับ Bun สำหรับการแคชและ build task
2. **Python Environment Manager**: เลือกระหว่าง `Poetry`, `uv`, หรือ `pip-tools` สำหรับจัดการ Dependency ในโฟลเดอร์ `ai-service`
3. **Message Queue Library**: สรุปข้อตกลงระหว่างการใช้ BullMQ ใน NestJS เพียงอย่างเดียว แล้วส่งงานไปยัง FastAPI ผ่าน HTTP/Internal Webhook หรือการใช้ Redis Queue ร่วมกันระหว่าง Node.js และ Python
