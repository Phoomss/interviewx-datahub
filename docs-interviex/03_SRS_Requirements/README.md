# หมวดที่ 03: ข้อกำหนดความต้องการระบบ (03_SRS_Requirements)
> **InterviewX — AI Job Interview Simulation System**  
> **สถานะเอกสาร:** ควบคุมและพร้อมใช้งานสำหรับการพัฒนา (Active Official Baseline v1.1 Approved)  
> **ปรับปรุงล่าสุด:** 23 พฤศจิกายน 2026 (จัดหมวดหมู่เอกสารชัดเจน แยกเล่มวิชาการและชุดเทคนิคมาตรฐาน)

---

## 📌 ภาพรวมของหมวดเอกสาร (Category Overview)

หมวดนี้จัดเก็บเอกสารข้อกำหนดความต้องการระบบซอฟต์แวร์ (Software Requirements Specification: SRS) ทั้งในรูปแบบรายงานวิชาการและชุดเอกสารข้อกำหนดเชิงเทคนิค, เวิร์กบุ๊กการวิเคราะห์ข้อกำหนดเชิงฟังก์ชันและไม่ใช่เชิงฟังก์ชัน (FR / NFR), ตารางสิทธิ์การใช้งาน (RBAC Matrix), เมทริกซ์การตรวจสอบย้อนกลับ (Traceability Matrix), ทะเบียนการตัดสินใจสถาปัตยกรรม (Architecture Decision Register) และบันทึกประวัติการเปลี่ยนแปลง (Change Log)

---

## 🎓 1. เอกสารรายงานข้อกำหนดระบบฉบับวิชาการ (Academic & Project Submission Report)

เอกสารรายงานข้อกำหนดความต้องการของระบบ (SRS) จัดทำตามแบบแผนของสาขาวิชาวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยราชภัฏนครปฐม โดยปรับปรุงเนื้อหาให้สมบูรณ์ ถูกต้องตามสถาปัตยกรรมจริงของ InterviewX 100% (ลบเนื้อหาหลงเหลือของระบบลูกจ้าง กฟผ. ในส่วนที่ 4.2 ออกทั้งหมด และเติมเต็มขอบเขตระบบ, Use Cases, สแตกเทคโนโลยี Next.js/NestJS/FastAPI, NFR01–NFR24, แผนภาพ D01–D27 และผูกโยง Module Ownership):

| เอกสารผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | รูปแบบ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **รายงาน SRS ฉบับสมบูรณ์ (Markdown)** | [InterviewX_SRS_Report_Revised_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_Report_Revised_TH.md) | Markdown (~3.7 MB) | รายงาน SRS ฉบับสมบูรณ์ 4 บทใหญ่ พร้อม Use Case Specifications, Data Dictionary, สถาปัตยกรรมระบบ, NFR ครบ 24 ข้อ, แผนภาพ D01–D27 |
| **รายงาน SRS ฉบับสมบูรณ์ (Word docx)** | [InterviewX_SRS_Report_v1.1_TH.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_Report_v1.1_TH.docx) | Word .docx (~3.6 MB) | ไฟล์ Word พร้อมส่งที่มีรูปไดอะแกรมครบถ้วน ปรับปรุงเนื้อหาข้อ 1.3, 2.2, 4.1 และ 4.2 ให้ถูกต้องสมบูรณ์ |
| **คำแนะนำการปรับปรุง SRS ด้วยตนเอง** | [SRS_MANUAL_UPDATE_NOTES.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/SRS_MANUAL_UPDATE_NOTES.md) | Markdown | ข้อความสำเร็จรูปสำหรับผู้จัดทำเอกสารนำไปแก้ไขชื่อสมาชิกและเพิ่มตาราง Module Ownership ในเล่ม Word |

---

## 🌟 2. เอกสารหลักฐานเวอร์ชันหลักของโครงการที่ผ่านการอนุมัติ (Active Primary Baseline — v1.1 Approved)

เอกสารชุดนี้เป็น **เอกสารหลักฐานทางการ (Official Active Baseline)** ประจำโครงการในภาษาไทยมาตรฐาน ได้รับการอนุมัติอย่างเป็นทางการจากผู้มีส่วนได้ส่วนเสียและทีมพัฒนา:  
👉 **โฟลเดอร์หลัก:** [v1.1_approved/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/)

| เอกสารผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **เอกสารข้อกำหนดระบบ (SRS Word)** | [InterviewX_SRS_v1.1_FINAL_TH.docx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.docx) | ~80 KB | เอกสารทางการ 14 หมวด พร้อมใบปะหน้า สารบัญ จัดรูปแบบตามมาตรฐานฟอนต์ TH Sarabun New พร้อมสถานะอนุมัติ |
| **เอกสารข้อกำหนดระบบ (SRS Markdown)** | [InterviewX_SRS_v1.1_FINAL_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.md) | ~130 KB | เอกสารข้อกำหนดระบบฉบับเต็ม 14 หมวดในรูปแบบ Markdown ภาษาไทยเชิงวิชาการ พร้อมบันทึกการอนุมัติ |
| **เอกสารข้อกำหนดระบบ (SRS PDF)** | [InterviewX_SRS_v1.1_FINAL_TH.pdf](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_SRS_v1.1_FINAL_TH.pdf) | ~2.1 MB | เอกสารข้อกำหนดทางการรูปแบบ PDF พร้อมลงนามและประทับสถานะอนุมัติ |
| **เวิร์กบุ๊กข้อกำหนดและสิทธิ์ (Excel)** | [InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx) | ~82 KB | รวม 9 แผ่นงานภาษาไทย: FR, NFR, RBAC, Platform Access, Subscription, Mobile Scope, Data Sync, Decisions, Change Log |
| **เมทริกซ์การตรวจสอบย้อนกลับ (Excel)** | [InterviewX_Phase1_Requirement_Traceability_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Requirement_Traceability_TH.xlsx) | ~26 KB | ตารางเชื่อมโยงข้อกำหนด 64 รายการ (FR 40, NFR 24) เข้ากับผลสำรวจ, สิทธิ์ RBAC, แผนภาพระบบ และวิธีทดสอบ |
| **ทะเบียนการตัดสินใจสถาปัตยกรรม (Excel)** | [InterviewX_Phase1_Decision_Register_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Decision_Register_TH.xlsx) | ~11 KB | ทะเบียนการตัดสินใจสถาปัตยกรรมและการออกแบบระบบ D-M01 ถึง D-M11 ที่ได้รับการยืนยันและอนุมัติ |
| **รายงานการตรวจสอบ FR, NFR และ RBAC (DOC-05)** | [DOC-05_FR_NFR_RBAC_REVIEW_REPORT.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/03_SRS_Requirements/DOC-05_FR_NFR_RBAC_REVIEW_REPORT.md) | ~25 KB | **⭐ [DOC-05 Approved]** รายงานการตรวจสอบความสมบูรณ์ของ FR 40 ข้อ, NFR 24 ข้อ, ตารางสิทธิ์ RBAC 5 บทบาท, และกฎสถาปัตยกรรม 7 ประการ |
| **บันทึกการเปลี่ยนแปลงฉบับสมบูรณ์ (Markdown)** | [InterviewX_Phase1_Change_Log_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_Phase1_Change_Log_TH.md) | ~33 KB | บันทึกประวัติการแก้ไขและตารางเปรียบเทียบการปรับปรุงข้อกำหนดฉบับภาษาไทย |

---

## ⚙️ 3. แม่แบบโครงสร้างเอกสาร (Templates)

- **โฟลเดอร์แม่แบบ:** [template_srs/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/template_srs/)
  - 	emplate_srs.text: โครงสร้างแม่แบบมาตรฐาน 14 หมวดสำหรับเอกสาร SRS
  - เอกสารแสดงความต้องการของระบบ.docx: ไฟล์ต้นแบบฟอร์แมตเอกสารราชการ/สถาบัน

---

## 📦 4. คลังเอกสารประวัติและเวอร์ชันเดิม (Historical Archives)

เอกสารประวัติเวอร์ชันก่อนหน้าได้รับการจัดเก็บรักษาอย่างเป็นระบบ ไม่มีการลบหรือเขียนทับ:  
👉 ดูรายละเอียดคลังเอกสารประวัติทั้งหมดที่ [archive/ARCHIVE_INDEX.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/ARCHIVE_INDEX.md)

1. **[archive/v1.1_th_draft/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.1_th_draft/):** เอกสารร่างภาษาไทย (v1.1 DRAFT_TH) ก่อนเข้าสู่กระบวนการตรวจรับและอนุมัติขั้นสุดท้าย
2. **[archive/v1.1_en_draft/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.1_en_draft/):** เอกสารฉบับร่างภาษาอังกฤษ (English Draft Baseline)
3. **[archive/v1.0_baseline/](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/archive/v1.0_baseline/):** เอกสารข้อกำหนดระบบ v1.0 ก่อนการแยกแพลตฟอร์ม
4. **แบบร่างเบื้องต้น (Pre-v1.0 Early Drafts):** rchive/InterviewX_SRS_Complete.docx, rchive/InterviewX_SRS_Revised.docx
