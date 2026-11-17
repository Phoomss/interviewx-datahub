# หมวดที่ 12: คลังเอกสารประวัติและเวอร์ชันเดิม (12_Archive)
> **InterviewX — AI Job Interview Simulation System**  
> **สถานะเอกสาร:** คลังเอกสารประวัติและสารบัญควบคุมเวอร์ชันเดิม (Historical Master Archive)  
> **ปรับปรุงล่าสุด:** 17 พฤศจิกายน 2026  

---

## 📌 ภาพรวมหมวดคลังเอกสารประวัติ (Category Overview)

หมวดนี้ทำหน้าที่เป็น **ศูนย์กลางการควบคุมสารบัญเอกสารประวัติ (Master Archive Catalog)** สำหรับเอกสารเวอร์ชันเดิมทั้งหมดของโครงการ InterviewX เพื่อให้สามารถตรวจสอบย้อนกลับ (Traceability) และรักษาหลักฐานทางประวัติศาสตร์การออกแบบระบบได้อย่างครบถ้วน โดยเอกสารเดิมทั้งหมดได้รับการเก็บรักษาไว้อย่างปลอดภัย ไม่มีการลบหรือเขียนทับ

---

## 🗺️ แผนผังและลิงก์เชื่อมโยงคลังประวัติของโครงการ (Master Archive Map)

```text
คลังประวัติโครงการ InterviewX
│
├── 📂 02_Research_Analysis/proposal/archive/      # ประวัติเอกสารข้อเสนอโครงการ
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
└── 📂 04_System_Architecture/archive/             # ประวัติแผนภาพและแบบจำลองสถาปัตยกรรม
    ├── 📑 ARCHIVE_INDEX.md                        # ดัชนีแผนภาพประวัติ
    ├── 📂 v1.0_baseline/                          # แผนภาพ v1.0 ชุดเดิม
    │   ├── 📑 ALL_DIAGRAMS_v1.0.md
    │   └── 📑 InterviewX_Architecture_Diagrams_v1.0.md
    └── 📂 v1.1_drafts/                            # แผนภาพร่าง v1.1 DRAFT ก่อนอนุมัติ
        ├── 📑 ALL_DIAGRAMS_v1.1_DRAFT_TH.md
        └── 📑 ALL_DIAGRAMS_v1.1_DRAFT.md
```

---

## 📜 ลำดับวิวัฒนาการเอกสาร (Version Lineage Summary)

1. **ระยะเริ่มต้น (Pre-v1.0):**
   - ร่างข้อกำหนดเบื้องต้นจากแนวคิดโครงการ รวบรวมฟังก์ชันหลักที่จำเป็นสำหรับการจำลองสัมภาษณ์
2. **เวอร์ชันตั้งต้น (v1.0 Baseline — 8 ตุลาคม 2026):**
   - จัดทำขึ้นโดยอ้างอิงผลสำรวจผู้ใช้ 102 ราย ครอบคลุม 40 FR และ 24 NFR
   - โครงสร้างเป็น Monolithic Responsive Web ทั่วไป ยังไม่ได้แยก Native Mobile
3. **เวอร์ชันปรับปรุง Phase 1 ฉบับร่างภาษาอังกฤษ (v1.1 EN Draft — 13 พฤศจิกายน 2026):**
   - แยกสถาปัตยกรรมและขอบเขตฟังก์ชันระหว่าง Responsive Web และ Native Mobile
   - เพิ่ม Platform Access Matrix, Subscription Matrix, และ Decision Register (D-M01 ถึง D-M11)
4. **เวอร์ชันร่างภาษาไทย (v1.1 TH Draft — 13 พฤศจิกายน 2026):**
   - จัดทำฉบับภาษาไทยเชิงวิชาการมาตรฐานสมบูรณ์ 14 หมวดเพื่อการทบทวนของทีม
5. **เวอร์ชันหลักฐานทางการฉบับอนุมัติ (v1.1 FINAL Approved Baseline — 17 พฤศจิกายน 2026):**
   - ผ่านการตรวจรับและอนุมัติอย่างเป็นทางการจากผู้มีส่วนได้ส่วนเสียทุกฝ่าย
   - จัดกลุ่มเอกสารอย่างเป็นระบบไว้ที่:
     - ข้อกำหนดระบบ: [03_SRS_Requirements/v1.1_approved/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/)
     - แผนภาพสถาปัตยกรรม: [04_System_Architecture/v1.1_diagrams/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/)
