# InterviewX — AI Job Interview Simulation System
> **สารบัญเอกสารและดัชนีนำทางโครงการ (Project Documentation Catalog & Directory Map)**  
> **วันที่มีผลบังคับใช้:** 8 ตุลาคม 2026 | **เวอร์ชันปัจจุบัน:** 1.0 (Baseline for Approval)

---

## 📌 แผนผังโครงสร้างโฟลเดอร์ (Directory Structure)

```text
interviewX/
│
├── 📁 01_Proposal/                                # เอกสารข้อเสนอโครงงาน / เล่มวิจัย (Research Proposal)
│   ├── 📄 InterviewX_Research_Proposal_v1.1.docx  # [ล่าสุด] เล่มข้อเสนอโครงการ v1.1 (Microsoft Word)
│   ├── 📄 InterviewX_Research_Proposal_v1.1.pdf   # [ล่าสุด] เล่มข้อเสนอโครงการ v1.1 (PDF)
│   └── 📁 archive/                                # ประวัติเอกสารเวอร์ชันก่อนหน้า
│       ├── 📄 InterviewX_Research_Proposal_v1.0.docx
│       └── 📄 InterviewX_Research_Proposal_v1.0.pdf
│
├── 📁 02_Survey_Data/                             # ข้อมูลการสำรวจความต้องการและผลวิเคราะห์สถิติ
│   ├── 📊 Interview X Requirement Survey Form (การตอบกลับ) - การตอบแบบฟอร์ม 1.csv # ข้อมูลดิบจากผู้ตอบ (n=102)
│   └── 📊 InterviewX_Survey_Validated_Aggregates.xlsx                            # ผลการวิเคราะห์สถิติที่ผ่านการตรวจสอบ
│
├── 📁 03_SRS_Requirements/                       # ข้อกำหนดความต้องการระบบซอฟต์แวร์ (SRS & Specifications)
│   ├── 📄 InterviewX_SRS_Final_For_Approval_v1.0.docx   # [เอกสารหลัก] SRS ฉบับสมบูรณ์เสนออนุมัติ (Final)
│   ├── 📊 InterviewX_FR_NFR_RBAC.xlsx                   # ตารางสรุป Functional/Non-Functional & RBAC Matrix
│   ├── 🐍 generate_final_srs.py                         # สคริปต์ Python สำหรับฟอร์แมตและสร้างเล่ม SRS Docx
│   ├── 📄 InterviewX_SRS_Final_For_Approval_v1.0.backup.docx # ไฟล์แม่แบบต้นทางสำหรับสคริปต์
│   ├── 📁 template_srs/                                 # ลิงก์และข้อมูลแม่แบบ SRS ต้นฉบับ
│   │   └── 📄 template_srs.text
│   └── 📁 archive/                                      # ประวัติแบบร่าง SRS เวอร์ชันก่อนหน้า
│       ├── 📄 InterviewX_SRS_Revised.docx
│       └── 📄 InterviewX_SRS_Complete.docx
│
├── 📁 04_System_Architecture/                     # สถาปัตยกรรมระบบและการออกแบบเชิงเทคนิค (Architecture & Design)
│   ├── 📄 InterviewX_Architecture_Diagrams_v1.0.md      # เอกสารสรุปแผนภาพสถาปัตยกรรมระบบ
│   ├── 📁 InterviewX_Final_System_Diagrams_v1.0/        # ชุดแผนภาพระบบฉบับสมบูรณ์ 19 ไดอะแกรม (Mermaid D01-D19)
│   │   ├── 📄 ALL_DIAGRAMS.md                           # รวมแผนภาพ Mermaid ทั้งหมดพร้อมคำอธิบาย
│   │   ├── 📄 README.md                                 # คำอธิบายและ Traceability Matrix ของไดอะแกรม
│   │   └── 📁 diagrams/ (D01_*.mmd ถึง D19_*.mmd)
│   └── 📁 interviewx-design/                            # รายละเอียดการออกแบบ Database, API และ Monorepo
│       ├── 📄 README.md
│       ├── 📁 contracts/ (OpenAPI specs: public-v1, internal-evaluation)
│       ├── 📁 database/ (001_core.sql, 002_r3_services.sql)
│       ├── 📁 docs/ (physical-erd.md)
│       └── 📁 repo/ (REPOSITORY_STRUCTURE.md)
│
├── 📁 05_Knowledge_Base/                          # คลังข้อมูลสรุปภาพรวมและบริบทระบบ (Single Source of Truth)
│   └── 📄 INTERVIEWX_MASTER_KNOWLEDGE_PACK.md    # Master Knowledge Pack สำหรับอ้างอิงและใช้เป็น AI Context
│
└── 📄 README.md                                   # คู่มือภาพรวมและสารบัญโครงสร้างเอกสารโครงการ (ไฟล์นี้)
```

---

## 📚 รายละเอียดเอกสารแต่ละหมวดหมู่ (Document Catalog)

### 1. `01_Proposal` — เอกสารข้อเสนอโครงงาน (Research Proposal)
- **วัตถุประสงค์:** เล่มข้อเสนอโครงงานวิจัยเพื่อการอนุมัติและประเมินผลการดำเนินงาน
- **เอกสารสำคัญ:**
  - `InterviewX_Research_Proposal_v1.1.docx` & `.pdf`: เอกสารฉบับปรับปรุงล่าสุด v1.1
  - `archive/`: เก็บประวัติข้อเสนอโครงการเวอร์ชัน 1.0 (v1.0) ทั้ง docx และ pdf

### 2. `02_Survey_Data` — ข้อมูลการสำรวจความต้องการ (Requirements Survey)
- **วัตถุประสงค์:** ข้อมูลสถิติเชิงประจักษ์จากการสำรวจกลุ่มตัวอย่างจำนวน 102 คน (นักศึกษา 66.7%, บัณฑิตจบใหม่ 18.6%)
- **เอกสารสำคัญ:**
  - `Interview X Requirement Survey Form (การตอบกลับ) - การตอบแบบฟอร์ม 1.csv`: Raw data คำตอบจาก Google Forms
  - `InterviewX_Survey_Validated_Aggregates.xlsx`: ตารางวิเคราะห์สรุปผลสถิติที่ผ่านการ Cleaned และ Validation แล้ว

### 3. `03_SRS_Requirements` — ข้อกำหนดความต้องการระบบซอฟต์แวร์ (SRS)
- **วัตถุประสงค์:** ข้อกำหนดระบบที่เป็นทางการตามมาตรฐานวิศวกรรมซอฟต์แวร์ กำหนด Scope R1 (Text MVP), R2 (AI & Voice), R3 (Commercial & Research)
- **เอกสารสำคัญ:**
  - `InterviewX_SRS_Final_For_Approval_v1.0.docx`: **เล่ม SRS ฉบับสมบูรณ์สำหรับเสนออนุมัติ** ฟอร์แมตสวยงามพร้อมลายเซ็น
  - `InterviewX_FR_NFR_RBAC.xlsx`: ตารางสรุป 36 Functional Requirements, 24 Non-Functional Requirements, และ RBAC Matrix
  - `generate_final_srs.py`: สคริปต์อัตโนมัติสำหรับประมวลผลและสร้างเล่ม SRS docx (สามารถรันได้ด้วย `python3 03_SRS_Requirements/generate_final_srs.py`)
  - `archive/`: แบบร่างฉบับก่อนหน้า ได้แก่ `InterviewX_SRS_Revised.docx` และ `InterviewX_SRS_Complete.docx`

### 4. `04_System_Architecture` — สถาปัตยกรรมและการออกแบบระบบเชิงเทคนิค
- **วัตถุประสงค์:** แบบพิมพ์เขียว (Blueprint) ด้านโครงสร้างระบบ ซอฟต์แวร์ ฐานข้อมูล และโครงข่าย
- **เอกสารสำคัญ:**
  - `InterviewX_Architecture_Diagrams_v1.0.md`: สรุปภาพรวมสถาปัตยกรรม C4 Containers, Managed Production, K8s Showcase
  - `InterviewX_Final_System_Diagrams_v1.0/`: ชุดไดอะแกรมมาตรฐาน 19 รูป (D01-D19) ในรูปแบบ Mermaid ครอบคลุมตั้งแต่ Context, Bounded Contexts, ERD, Sequences จนถึง CI/CD และ Roadmap
  - `interviewx-design/`: การออกแบบระดับโครงสร้างโค้ด
    - `contracts/`: OpenAPI 3.0 Specs (`public-v1.openapi.yaml`, `internal-evaluation.openapi.yaml`)
    - `database/`: SQL DDL Scripts (`001_core.sql` สำหรับ R1/R2, `002_r3_services.sql` สำหรับ R3 Billing & Research)
    - `repo/`: สถาปัตยกรรม Monorepo และการแบ่งแพ็กเกจ

### 5. `05_Knowledge_Base` — คลังความรู้โครงการ (Single Source of Truth)
- **วัตถุประสงค์:** ชุดข้อมูลสรุปทั้งหมดของโครงการในไฟล์เดียว เพื่อใช้เป็น Context หลักสำหรับ AI Assistants (ChatGPT, Claude, Gemini) และการปฐมนิเทศทีมงาน
- **เอกสารสำคัญ:**
  - `INTERVIEWX_MASTER_KNOWLEDGE_PACK.md`: สรุป Problem Statement, Phasing Scope (R1/R2/R3), Survey Stats, RBAC, Core Modules, Invariants, และ PDPA Compliance

---

## 🛠️ วิธีการใช้งานและการประมวลผล (Quick Start)

### การสร้างเล่มเอกสาร SRS Docx ใหม่ (Re-generate SRS):
หากมีการปรับปรุงเนื้อหาหรือต้องการรีรันฟอร์แมตเอกสาร สามารถรันสคริปต์จาก Root Directory ได้ทันที:
```bash
python3 03_SRS_Requirements/generate_final_srs.py
```
สคริปต์จะอ่านไฟล์แม่แบบและบันทึกผลลัพธ์ลงที่ `03_SRS_Requirements/InterviewX_SRS_Final_For_Approval_v1.0.docx` โดยอัตโนมัติ

---

## 🔒 กฎเกณฑ์สถาปัตยกรรมและความปลอดภัย (Core Architectural Invariants)
1. **Single Ownership:** ข้อมูล Core อยู่ภายใต้ NestJS Monolith; AI Service (FastAPI) มีหน้าที่ประมวลผลคำตอบเท่านั้น ไม่เชื่อมต่อฐานข้อมูลโดยตรง
2. **Transactional Outbox & Idempotency:** การส่งคำตอบและคิวตรวจงาน (BullMQ) ทำงานแบบ Exactly-Once Business Effect ป้องกันการส่งซ้ำ
3. **Data Isolation (R3):** บริการ Billing และ Research ในเฟส R3 ใช้ Database และ Credentials แยกจาก Core PostgreSQL เด็ดขาด
4. **Privacy-First (PDPA):** มีการแยก Consent ชัดเจน (Service vs Voice Retention vs Research Analysis) พร้อมระบบสิทธิ์ลบและส่งออกข้อมูล
