# หมวดที่ 03: ข้อกำหนดความต้องการระบบ (03_SRS_Requirements)
> **InterviewX — AI Job Interview Simulation System**  
> **สถานะเอกสาร:** ควบคุมและพร้อมใช้งานสำหรับการพัฒนา (Active Official Baseline v1.1 Approved)  
> **ปรับปรุงล่าสุด:** 17 พฤศจิกายน 2026  

---

## 📌 ภาพรวมของหมวดเอกสาร (Category Overview)

หมวดนี้จัดเก็บเอกสารข้อกำหนดความต้องการระบบซอฟต์แวร์ (Software Requirements Specification: SRS), เวิร์กบุ๊กการวิเคราะห์ข้อกำหนดเชิงฟังก์ชันและไม่ใช่เชิงฟังก์ชัน (FR / NFR), ตารางสิทธิ์การใช้งาน (RBAC Matrix), เมทริกซ์การตรวจสอบย้อนกลับ (Traceability Matrix), ทะเบียนการตัดสินใจสถาปัตยกรรม (Architecture Decision Register) และบันทึกประวัติการเปลี่ยนแปลง (Change Log)

---

## 🌟 เอกสารหลักฐานเวอร์ชันหลักของโครงการที่ผ่านการอนุมัติ (Active Primary Baseline — v1.1 Approved)

เอกสารชุดนี้เป็น **เอกสารหลักฐานทางการ (Official Active Baseline)** ประจำโครงการในภาษาไทยมาตรฐาน ได้รับการอนุมัติอย่างเป็นทางการจากผู้มีส่วนได้ส่วนเสียและทีมพัฒนา:  
👉 **โฟลเดอร์หลัก:** [v1.1_approved/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/)

| เอกสารผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **เอกสารข้อกำหนดระบบ (SRS Word)** | [InterviewX_SRS_v1.1_FINAL_TH.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.docx) | ~80 KB | เอกสารทางการ 14 หมวด พร้อมใบปะหน้า สารบัญ จัดรูปแบบตามมาตรฐานฟอนต์ TH Sarabun New พร้อมสถานะอนุมัติ |
| **เอกสารข้อกำหนดระบบ (SRS Markdown)** | [InterviewX_SRS_v1.1_FINAL_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.md) | ~130 KB | เอกสารข้อกำหนดระบบฉบับเต็ม 14 หมวดในรูปแบบ Markdown ภาษาไทยเชิงวิชาการ พร้อมบันทึกการอนุมัติ |
| **เวิร์กบุ๊กข้อกำหนดและสิทธิ์ (Excel)** | [InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx) | ~82 KB | รวม 9 แผ่นงานภาษาไทย: FR, NFR, RBAC, Platform Access, Subscription, Mobile Scope, Data Sync, Decisions, Change Log |
| **เมทริกซ์การตรวจสอบย้อนกลับ (Excel)** | [InterviewX_Phase1_Requirement_Traceability_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Requirement_Traceability_TH.xlsx) | ~26 KB | ตารางเชื่อมโยงข้อกำหนด 64 รายการ (FR 40, NFR 24) เข้ากับผลสำรวจ, สิทธิ์ RBAC, แผนภาพระบบ และวิธีทดสอบ |
| **ทะเบียนการตัดสินใจสถาปัตยกรรม (Excel)** | [InterviewX_Phase1_Decision_Register_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Decision_Register_TH.xlsx) | ~11 KB | ทะเบียนการตัดสินใจสถาปัตยกรรมและการออกแบบระบบ D-M01 ถึง D-M11 ที่ได้รับการยืนยันและอนุมัติ |
| **บันทึกการเปลี่ยนแปลงฉบับสมบูรณ์ (Markdown)** | [InterviewX_Phase1_Change_Log_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Change_Log_TH.md) | ~33 KB | บันทึกประวัติการแก้ไขและตารางเปรียบเทียบการปรับปรุงข้อกำหนดฉบับภาษาไทย |

---

## 📦 คลังเอกสารประวัติและเวอร์ชันเดิม (Historical Archives)

เอกสารประวัติเวอร์ชันก่อนหน้าได้รับการจัดเก็บรักษาอย่างเป็นระบบ ไม่มีการลบหรือเขียนทับ:  
👉 ดูรายละเอียดคลังเอกสารประวัติทั้งหมดที่ [archive/ARCHIVE_INDEX.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/ARCHIVE_INDEX.md)

1. **[archive/v1.1_th_draft/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.1_th_draft/):**
   - เอกสารร่างภาษาไทย (v1.1 DRAFT_TH) ก่อนเข้าสู่กระบวนการตรวจรับและอนุมัติขั้นสุดท้าย
2. **[archive/v1.1_en_draft/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.1_en_draft/):**
   - เอกสารฉบับร่างภาษาอังกฤษ (English Draft Baseline) ที่พัฒนาขึ้นในช่วงต้นของ Phase 1
3. **[archive/v1.0_baseline/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.0_baseline/):**
   - เอกสารข้อกำหนดระบบ v1.0 ก่อนการแยกแพลตฟอร์ม Responsive Web และ Native Mobile
   - เวิร์กบุ๊ก `InterviewX_FR_NFR_RBAC.xlsx` ดั้งเดิม และไฟล์ CSV ประกอบ
4. **แบบร่างเบื้องต้น (Pre-v1.0 Early Drafts):**
   - `archive/InterviewX_SRS_Complete.docx`
   - `archive/InterviewX_SRS_Revised.docx`

---

## ⚙️ แม่แบบโครงสร้างเอกสาร (Templates)

- `template_srs/template_srs.text`: โครงสร้างแม่แบบมาตรฐาน 14 หมวดสำหรับเอกสาร SRS (เอกสาร deliverables ทั้งหมดในหมวดนี้จัดทำและคอมไพล์เป็นผลลัพธ์พร้อมใช้งานเรียบร้อยแล้วใน [v1.1_approved/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/))
