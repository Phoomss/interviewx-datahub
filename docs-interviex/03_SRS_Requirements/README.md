# หมวดที่ 03: ข้อกำหนดความต้องการระบบ (03_SRS_Requirements)
> **InterviewX — AI Job Interview Simulation System**
> **สถานะเอกสาร:** ควบคุมและพร้อมใช้งานสำหรับการพัฒนา (Active Baseline v1.1 DRAFT_TH)
> **ปรับปรุงล่าสุด:** 13 พฤศจิกายน 2026

---

## 📌 ภาพรวมของหมวดเอกสาร (Category Overview)

หมวดนี้จัดเก็บเอกสารข้อกำหนดความต้องการระบบซอฟต์แวร์ (Software Requirements Specification: SRS), เวิร์กบุ๊กการวิเคราะห์ข้อกำหนดเชิงฟังก์ชันและไม่ใช่เชิงฟังก์ชัน (FR / NFR), ตารางสิทธิ์การใช้งาน (RBAC Matrix), เมทริกซ์การตรวจสอบย้อนกลับ (Traceability Matrix), ทะเบียนการตัดสินใจสถาปัตยกรรม (Architecture Decision Register) และบันทึกประวัติการเปลี่ยนแปลง (Change Log)

---

## 🌟 เอกสารหลักฐานเวอร์ชันหลักของโครงการ (Active Primary Baseline — v1.1 DRAFT_TH)

เอกสารชุดนี้เป็น **เอกสารหลักฐานทางการ (Official Active Baseline)** ประจำโครงการในภาษาไทยมาตรฐาน:

| เอกสารผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **เอกสารข้อกำหนดระบบ (SRS Word)** | [InterviewX_SRS_v1.1_DRAFT_TH.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_v1.1_DRAFT_TH.docx) | 80.7 KB | เอกสารทางการ 14 หมวด พร้อมใบปะหน้า สารบัญ จัดรูปแบบตามมาตรฐานฟอนต์ TH Sarabun New |
| **เอกสารข้อกำหนดระบบ (SRS Markdown)** | [InterviewX_SRS_v1.1_DRAFT_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_v1.1_DRAFT_TH.md) | 129 KB | เอกสารข้อกำหนดระบบฉบับเต็ม 14 หมวดในรูปแบบ Markdown ภาษาไทยเชิงวิชาการ |
| **เวิร์กบุ๊กข้อกำหนดและสิทธิ์ (Excel)** | [InterviewX_FR_NFR_RBAC_v1.1_DRAFT_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_FR_NFR_RBAC_v1.1_DRAFT_TH.xlsx) | 50.6 KB | รวม 9 แผ่นงานภาษาไทย: FR, NFR, RBAC, Platform Access, Subscription, Mobile Scope, Data Sync, Decisions, Change Log |
| **เมทริกซ์การตรวจสอบย้อนกลับ** | [InterviewX_Phase1_Requirement_Traceability_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_Phase1_Requirement_Traceability_TH.xlsx) | 17.8 KB | ตารางเชื่อมโยงข้อกำหนด 64 รายการ (FR 40, NFR 24) เข้ากับผลสำรวจ, สิทธิ์ RBAC, แผนภาพระบบ และวิธีทดสอบ |
| **ทะเบียนการตัดสินใจสถาปัตยกรรม** | [InterviewX_Phase1_Decision_Register_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_Phase1_Decision_Register_TH.xlsx) | 11.0 KB | ทะเบียนการตัดสินใจสถาปัตยกรรมและการออกแบบระบบ D-M01 ถึง D-M11 ในภาษาไทย |
| **บันทึกการเปลี่ยนแปลงฉบับสมบูรณ์** | [InterviewX_Phase1_Change_Log_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_Phase1_Change_Log_TH.md) | 32.6 KB | บันทึกประวัติการแก้ไขและตารางเปรียบเทียบการปรับปรุงข้อกำหนดฉบับภาษาไทย |

---

## 📦 คลังเอกสารประวัติและเวอร์ชันเดิม (Historical Archives)

เอกสารประวัติเวอร์ชันก่อนหน้าได้รับการจัดเก็บรักษาอย่างเป็นระบบ ไม่มีการลบหรือเขียนทับ:
👉 ดูรายละเอียดคลังเอกสารประวัติทั้งหมดที่ [archive/ARCHIVE_INDEX.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/ARCHIVE_INDEX.md)

1. **[archive/v1.0_baseline/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.0_baseline/):**
   - เอกสารข้อกำหนดระบบ v1.0 ก่อนการแยกแพลตฟอร์ม Responsive Web และ Native Mobile
   - เวิร์กบุ๊ก `InterviewX_FR_NFR_RBAC.xlsx` ดั้งเดิม และไฟล์ CSV ประกอบ
   - แผนภาพสถาปัตยกรรมดั้งเดิม `ALL_DIAGRAMS.md`
2. **[archive/v1.1_en_draft/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.1_en_draft/):**
   - เอกสารฉบับร่างภาษาอังกฤษ (English Draft Baseline) ที่พัฒนาขึ้นในช่วงต้นของ Phase 1
   - เวิร์กบุ๊กภาษาอังกฤษ `InterviewX_FR_NFR_RBAC_v1.1_DRAFT.xlsx` และ Traceability Matrix
3. **แบบร่างเบื้องต้น (Pre-v1.0 Early Drafts):**
   - `archive/InterviewX_SRS_Complete.docx`
   - `archive/InterviewX_SRS_Revised.docx`

---

## ⚙️ สคริปต์และแม่แบบการสร้างเอกสาร (Generation Tooling & Templates)

- `build_phase1_deliverables_th.py`: สคริปต์สร้างชุดเอกสารส่งมอบภาษาไทย v1.1 แบบรวม
- `build_srs_th_markdown.py`: สคริปต์สร้างเอกสาร SRS Markdown ภาษาไทย 14 หมวด
- `generate_final_srs_v1_1_docx_th.py`: สคริปต์คอมไพล์เอกสาร SRS Word (.docx) ภาษาไทยพร้อมสารบัญและสไตล์
- `generate_excel_fr_nfr_rbac_th.py`: สคริปต์สร้างเวิร์กบุ๊ก Excel ภาษาไทย 9 แผ่นงาน
- `generate_change_log_th.py`: สคริปต์สร้างบันทึกประวัติการเปลี่ยนแปลงภาษาไทย
- `template_srs/template_srs.text`: โครงสร้างแม่แบบมาตรฐาน 14 หมวดสำหรับเอกสาร SRS
