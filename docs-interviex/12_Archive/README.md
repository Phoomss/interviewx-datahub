# หมวดที่ 12: คลังเอกสารประวัติและเวอร์ชันเดิม (12_Archive)
> **InterviewX — AI Job Interview Simulation System**  
> **สถานะเอกสาร:** คลังเอกสารประวัติและสารบัญควบคุมเวอร์ชันเดิม (Historical Master Archive)  
> **ปรับปรุงล่าสุด:** 23 พฤศจิกายน 2026 (ปรับปรุงดัชนีคลังประวัติครบทุกหมวดหมู่)

---

## 📌 ภาพรวมหมวดคลังเอกสารประวัติ (Category Overview)

หมวดนี้ทำหน้าที่เป็น **ศูนย์กลางการควบคุมสารบัญเอกสารประวัติ (Master Archive Catalog)** สำหรับเอกสารเวอร์ชันเดิมทั้งหมดของโครงการ InterviewX เพื่อให้สามารถตรวจสอบย้อนกลับ (Traceability) และรักษาหลักฐานทางประวัติศาสตร์การออกแบบระบบได้อย่างครบถ้วน โดยเอกสารเดิมทั้งหมดได้รับการเก็บรักษาไว้อย่างปลอดภัย ไม่มีการลบหรือเขียนทับ

---

## 🗺️ แผนผังและลิงก์เชื่อมโยงคลังประวัติของโครงการ (Master Archive Map)

`	ext
คลังประวัติโครงการ InterviewX
│
├── 📂 01_Project_Management/archive/              # ประวัติการบริหารงานและ Sprint Brief
│   └── 📄 InterviewX_Sprint2_Team_Alignment_Brief_v1.0.md # วาระ Sprint 2 ฉบับเดิม (ก่อนระบุรายชื่อผู้รับผิดชอบ)
│
├── 📂 02_Research_Analysis/proposal/archive/      # ประวัติเอกสารข้อเสนอโครงการ
│   ├── 📄 InterviewX_Research_Proposal_v1.3_draft.docx # ร่าง v1.3 ก่อนไฟนอล
│   ├── 📄 InterviewX_Research_Proposal_v1.2.docx # เล่มข้อเสนอโครงการวิจัย v1.2 (Word)
│   ├── 📄 InterviewX_Research_Proposal_v1.2.pdf  # เล่มข้อเสนอโครงการวิจัย v1.2 (PDF)
│   ├── 📄 InterviewX_Research_Proposal_v1.1.docx # เล่มข้อเสนอโครงการวิจัย v1.1 (Word)
│   ├── 📄 InterviewX_Research_Proposal_v1.1.pdf  # เล่มข้อเสนอโครงการวิจัย v1.1 (PDF)
│   ├── 📄 InterviewX_Research_Proposal_v1.0.docx # เล่มข้อเสนอโครงการวิจัย v1.0 (Word)
│   └── 📄 InterviewX_Research_Proposal_v1.0.pdf  # เล่มข้อเสนอโครงการวิจัย v1.0 (PDF)
│
├── 📂 03_SRS_Requirements/archive/                # ประวัติข้อกำหนดระบบและความต้องการ
│   ├── 📑 ARCHIVE_INDEX.md                        # ดัชนีบันทึกเอกสารประวัติและตารางเปรียบเทียบเวอร์ชัน
│   ├── 📄 InterviewX_SRS_Complete.docx            # ร่างเอกสารเบื้องต้น (Pre-v1.0 Initial Draft)
│   ├── 📄 InterviewX_SRS_Revised.docx             # ร่างเอกสารปรับปรุงก่อนเข้าสู่ v1.0
│   │
│   ├── 📂 v1.0_baseline/                          # เอกสารตั้งต้น v1.0 (ก่อนแยกแพลตฟอร์ม Phase 1)
│   │   ├── 📄 InterviewX_SRS_Final_For_Approval_v1.0.docx
│   │   ├── 📄 InterviewX_SRS_Final_For_Approval_v1.0.md
│   │   ├── 📄 InterviewX_SRS_Final_For_Approval_v1.0.backup.docx
│   │   ├── 📊 InterviewX_FR_NFR_RBAC.xlsx
│   │   ├── 📊 INTERVIEWX_FR_NFR_RBAC - FR.csv / NFR.csv / RBAC.csv
│   │   └── 📑 ALL_DIAGRAMS.md (19 แผนภาพ Mermaid ดั้งเดิม)
│   │
│   ├── 📂 v1.1_en_draft/                          # เอกสารร่างภาษาอังกฤษ v1.1 (Phase 1 Initial)
│   │   ├── 📄 InterviewX_SRS_v1.1_DRAFT.docx
│   │   ├── 📄 InterviewX_SRS_v1.1_DRAFT.md
│   │   ├── 📊 InterviewX_FR_NFR_RBAC_v1.1_DRAFT.xlsx
│   │   ├── 📑 ALL_DIAGRAMS_v1.1_DRAFT.md
│   │   ├── 📊 InterviewX_Phase1_Requirement_Traceability.xlsx
│   │   ├── 📊 InterviewX_Phase1_Decision_Register.xlsx
│   │   └── 📝 InterviewX_Phase1_Change_Log.md
│   │
│   └── 📂 v1.1_th_draft/                          # เอกสารร่างภาษาไทย v1.1 DRAFT ก่อนได้รับอนุมัติ
│       ├── 📄 InterviewX_SRS_v1.1_DRAFT_TH.docx
│       └── 📄 InterviewX_SRS_v1.1_DRAFT_TH.md
│
├── 📂 04_System_Architecture/archive/             # ประวัติแผนภาพและแบบจำลองสถาปัตยกรรม
│   ├── 📑 ARCHIVE_INDEX.md                        # ดัชนีแผนภาพประวัติ
│   ├── 📂 v1.0_baseline/                          # แผนภาพ v1.0 ชุดเดิม
│   │   ├── 📑 ALL_DIAGRAMS_v1.0.md
│   │   └── 📑 InterviewX_Architecture_Diagrams_v1.0.md
│   └── 📂 v1.1_drafts/                            # แผนภาพร่าง v1.1 DRAFT ก่อนอนุมัติ
│       ├── 📑 ALL_DIAGRAMS_v1.1_DRAFT_TH.md
│       └── 📑 ALL_DIAGRAMS_v1.1_DRAFT.md
│
└── 📂 07_Development_Documentation/archive/       # ประวัติคู่มือนักพัฒนา
    ├── 📄 INTERVIEWX_MASTER_KNOWLEDGE_PACK_v1.0.md # Master Knowledge Pack ดั้งเดิม
    └── 📄 REPOSITORY_STRUCTURE_v1.0.md            # โครงสร้าง Monorepo ดั้งเดิม
`

---

## 🔒 นโยบายการควบคุมเอกสารประวัติ (Archive Retention Policy)

1. **ห้ามลบหรือเขียนทับ (Strict Read-Only & Immutability):** เอกสารในคลังประวัติทั้งหมดถือเป็นหลักฐานทางประวัติการวิเคราะห์และออกแบบ ห้ามแก้ไขหรือลบโดยเด็ดขาด
2. **การอ้างอิงอย่างชัดเจน (Explicit Traceability):** การสืบค้นย้อนกลับจากเวอร์ชันปัจจุบันไปยังเวอร์ชันอดีต ต้องสามารถทำได้ผ่านรหัสเวอร์ชัน (v1.0, v1.1 Draft, v1.1 Approved)
3. **การเข้าถึงแบบเปิดสำหรับทีมงาน (Open Team Access):** สมาชิกทุกคนในทีมพัฒนามีสิทธิ์เข้าถึงคลังประวัติเพื่อตรวจสอบเหตุผลเบื้องหลังการตัดสินใจทางสถาปัตยกรรม (Architectural Decision Records)
