# เอกสารข้อกำหนดระบบที่ผ่านการอนุมัติแล้ว — เวอร์ชัน 1.1 (v1.1 Approved Baseline)
> **InterviewX — AI Job Interview Simulation System**  
> **สถานะการควบคุม:** เอกสารทางการผ่านการอนุมัติอย่างเป็นทางการ (Official Approved Baseline)  
> **วันที่อนุมัติ:** 17 พฤศจิกายน 2026  

---

## 📌 ภาพรวมชุดเอกสาร (Baseline Overview)

โฟลเดอร์นี้รวบรวม **เอกสารข้อกำหนดความต้องการระบบซอฟต์แวร์ (SRS) และเอกสารกำกับดูแลที่เกี่ยวข้องทั้งหมดในเวอร์ชัน 1.1 ที่ผ่านการทบทวนและลงนามอนุมัติอย่างเป็นทางการจากผู้มีส่วนได้ส่วนเสียและทีมงานพัฒนา** (Product Owner, Technical Lead, Mobile Lead, Legal/Privacy, QA) โดยเป็นข้อกำหนดหลักฐานที่ใช้เป็นเกณฑ์ตัดสินใจหลักในการพัฒนาระบบตั้งแต่ Sprint 2 เป็นต้นไป

---

## 🌟 รายการเอกสารผลลัพธ์ฉบับอนุมัติ (Approved Deliverables Catalog)

| เอกสารผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **เอกสารข้อกำหนดระบบ (SRS Word)** | [InterviewX_SRS_v1.1_FINAL_TH.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.docx) | ~80 KB | เอกสารทางการ 14 หมวด พร้อมใบปะหน้า สารบัญ จัดรูปแบบตามมาตรฐานฟอนต์ TH Sarabun New พร้อมสถานะอนุมัติ |
| **เอกสารข้อกำหนดระบบ (SRS Markdown)** | [InterviewX_SRS_v1.1_FINAL_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.md) | ~130 KB | เอกสารข้อกำหนดระบบฉบับเต็ม 14 หมวดในรูปแบบ Markdown ภาษาไทยเชิงวิชาการ พร้อมบันทึกการอนุมัติ |
| **เวิร์กบุ๊กข้อกำหนดและสิทธิ์ (Excel)** | [InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx) | ~82 KB | รวม 9 แผ่นงานภาษาไทย: FR, NFR, RBAC, Platform Access, Subscription, Mobile Scope, Data Sync, Decisions, Change Log |
| **เมทริกซ์การตรวจสอบย้อนกลับ (Excel)** | [InterviewX_Phase1_Requirement_Traceability_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Requirement_Traceability_TH.xlsx) | ~26 KB | ตารางเชื่อมโยงข้อกำหนด 64 รายการ (FR 40, NFR 24) เข้ากับผลสำรวจ, สิทธิ์ RBAC, แผนภาพระบบ และวิธีทดสอบ |
| **ทะเบียนการตัดสินใจสถาปัตยกรรม (Excel)** | [InterviewX_Phase1_Decision_Register_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Decision_Register_TH.xlsx) | ~11 KB | ทะเบียนการตัดสินใจสถาปัตยกรรมและการออกแบบระบบ D-M01 ถึง D-M11 ที่ได้รับการยืนยันแล้ว |
| **บันทึกการเปลี่ยนแปลงฉบับสมบูรณ์ (Markdown)** | [InterviewX_Phase1_Change_Log_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Change_Log_TH.md) | ~33 KB | บันทึกประวัติการแก้ไขและตารางเปรียบเทียบการปรับปรุงข้อกำหนดฉบับภาษาไทย |

---

## 📦 การเชื่อมโยงกับคลังเอกสารประวัติ (Historical Lineage)

- เอกสารฉบับร่างก่อนการอนุมัติ (Pre-approval Drafts): [archive/v1.1_th_draft/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.1_th_draft/)
- เอกสารร่างภาษาอังกฤษ (English Draft Baseline): [archive/v1.1_en_draft/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.1_en_draft/)
- เอกสารหลักฐานเวอร์ชันเดิม (Baseline v1.0): [archive/v1.0_baseline/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.0_baseline/)
- ดัชนีประวัติทั้งหมด: [archive/ARCHIVE_INDEX.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/ARCHIVE_INDEX.md)
