# ดัชนีบันทึกเอกสารประวัติและเวอร์ชันเดิม (Archive & Version History Index)
**โครงการ:** InterviewX — AI Job Interview Simulation System  
**วันที่บันทึก:** 17 พฤศจิกายน 2026  
**สถานะ:** เอกสารควบคุมประวัติ (Historical Reference Index)

---

## 1. วัตถุประสงค์ของการจัดเก็บคลังเอกสารประวัติ (Purpose of Archive)

ตามข้อตกลงการบริหารจัดการเอกสารโครงการ เอกสารเวอร์ชันเดิมและฉบับร่างทั้งหมดจะได้รับการจัดเก็บรักษาไว้อย่างปลอดภัย ไม่มีการลบหรือเขียนทับ เพื่อรักษาความสามารถในการตรวจสอบย้อนกลับ (Traceability) และเป็นหลักฐานอ้างอิงทางประวัติศาสตร์ โดยมีเอกสารหลักฐานฉบับปัจจุบันของโครงการคือ:
👉 **เวอร์ชันหลักที่ใช้งาน (Active Primary Baseline):** [v1.1_approved/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/) (ฉบับภาษาไทยมาตรฐานที่ผ่านการอนุมัติแล้ว)

---

## 2. โครงสร้างโฟลเดอร์คลังเอกสารประวัติ (Archive Directory Structure)

```text
03_SRS_Requirements/archive/
│
├── 📂 v1.0_baseline/                   # เอกสารหลักฐานตั้งต้น v1.0 ก่อนการแยกแพลตฟอร์ม Phase 1
│   ├── 📄 InterviewX_SRS_Final_For_Approval_v1.0.docx
│   ├── 📄 InterviewX_SRS_Final_For_Approval_v1.0.md
│   ├── 📄 InterviewX_SRS_Final_For_Approval_v1.0.backup.docx
│   ├── 📊 InterviewX_FR_NFR_RBAC.xlsx (3 แผ่นงาน: FR, NFR, RBAC)
│   ├── 📊 INTERVIEWX_FR_NFR_RBAC - FR.csv
│   ├── 📊 INTERVIEWX_FR_NFR_RBAC - NFR.csv
│   ├── 📊 INTERVIEWX_FR_NFR_RBAC - RBAC.csv
│   └── 📑 ALL_DIAGRAMS.md (19 แผนภาพ Mermaid ดั้งเดิม)
│
├── 📂 v1.1_en_draft/                   # เอกสารร่างภาษาอังกฤษ v1.1 ที่จัดทำขึ้นใน Phase 1
│   ├── 📄 InterviewX_SRS_v1.1_DRAFT.docx
│   ├── 📄 InterviewX_SRS_v1.1_DRAFT.md
│   ├── 📊 InterviewX_FR_NFR_RBAC_v1.1_DRAFT.xlsx (9 แผ่นงานภาษาอังกฤษ)
│   ├── 📑 ALL_DIAGRAMS_v1.1_DRAFT.md
│   ├── 📊 InterviewX_Phase1_Requirement_Traceability.xlsx
│   ├── 📊 InterviewX_Phase1_Decision_Register.xlsx
│   └── 📝 InterviewX_Phase1_Change_Log.md
│
├── 📂 v1.1_th_draft/                   # เอกสารร่างภาษาไทย v1.1 DRAFT ก่อนได้รับอนุมัติ
│   ├── 📄 InterviewX_SRS_v1.1_DRAFT_TH.docx
│   └── 📄 InterviewX_SRS_v1.1_DRAFT_TH.md
│
├── 📄 InterviewX_SRS_Complete.docx     # ร่างเอกสารเบื้องต้น (Pre-v1.0 Initial Draft)
└── 📄 InterviewX_SRS_Revised.docx      # ร่างเอกสารปรับปรุงก่อนเข้าสู่กระบวนการจัดทำ v1.0
```

---

## 3. สรุปรายละเอียดเอกสารในแต่ละเวอร์ชัน (Version Lineage & Descriptions)

### 3.1 กลุ่มเอกสาร `v1.0_baseline/` (เอกสารตั้งต้นเดิม - 8 ต.ค. 2026)
- **สาระสำคัญ:** เอกสารข้อกำหนดระบบรอบแรกที่รวบรวมจากผลสำรวจผู้ใช้ (n=102) ครอบคลุม 40 FR และ 24 NFR แต่ยังไม่ได้แยกสถาปัตยกรรมและขอบเขตฟังก์ชันระหว่าง **Responsive Web** และ **Native Mobile Application** ออกจากกันอย่างเป็นรูปธรรม
- **ข้อจำกัดเดิม:** FR15 และ NFR08 ยังระบุเป็น Responsive Web ทั่วไป และไม่มีการกำหนดกฎเกณฑ์ควบคุมสิทธิ์ข้ามแพลตฟอร์ม

### 3.2 กลุ่มเอกสาร `v1.1_en_draft/` (เอกสารร่างภาษาอังกฤษ - 13 พ.ย. 2026)
- **สาระสำคัญ:** เอกสารฉบับร่างภาษาอังกฤษที่พัฒนาขึ้นภายใต้ Phase 1 Requirement Alignment โดยแยกขอบเขต Responsive Web และ Native Mobile (iOS/Android), ปรับปรุง FR15 และ NFR08 พร้อมกำหนดเกณฑ์ Acceptance Criteria, เพิ่ม Platform Access Matrix, Subscription Matrix และ Decision Register (D-M01 ถึง D-M11)

### 3.3 กลุ่มเอกสาร `v1.1_th_draft/` (เอกสารร่างภาษาไทยก่อนอนุมัติ - 13 พ.ย. 2026)
- **สาระสำคัญ:** เอกสารฉบับร่างภาษาไทย (v1.1 DRAFT_TH) ที่จัดทำขึ้นสำหรับการตรวจสอบและทบทวนภายในทีม ก่อนได้รับการอนุมัติอย่างเป็นทางการในวันที่ 17 พ.ย. 2026

### 3.4 กลุ่มเอกสารฉบับก่อนหน้า (Pre-v1.0 Early Drafts)
- **`InterviewX_SRS_Complete.docx` และ `InterviewX_SRS_Revised.docx`:** เอกสารที่ร่างขึ้นในระยะเริ่มต้นสำรวจความต้องการของระบบ

---

## 4. แหล่งที่ตั้งของเอกสารหลักฐานปัจจุบัน (Active Primary Baseline: v1.1 Approved)

เอกสารหลักฐานที่เป็นทางการของโครงการทั้งหมดที่ผ่านการอนุมัติแล้ว จัดเก็บอย่างเป็นระบบที่โฟลเดอร์:  
👉 [03_SRS_Requirements/v1.1_approved/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/)
1. **เอกสาร SRS ฉบับสมบูรณ์ (Word):** [InterviewX_SRS_v1.1_FINAL_TH.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.docx)
2. **เอกสาร SRS ฉบับสมบูรณ์ (Markdown):** [InterviewX_SRS_v1.1_FINAL_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.md)
3. **เวิร์กบุ๊กข้อกำหนดและสิทธิ์ (Excel):** [InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx)
4. **เมทริกซ์การตรวจสอบย้อนกลับ (Excel):** [InterviewX_Phase1_Requirement_Traceability_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Requirement_Traceability_TH.xlsx)
5. **ทะเบียนการตัดสินใจสถาปัตยกรรม (Excel):** [InterviewX_Phase1_Decision_Register_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Decision_Register_TH.xlsx)
6. **บันทึกการเปลี่ยนแปลงฉบับสมบูรณ์ (Markdown):** [InterviewX_Phase1_Change_Log_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Change_Log_TH.md)
