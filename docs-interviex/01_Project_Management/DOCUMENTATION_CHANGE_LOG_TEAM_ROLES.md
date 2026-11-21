# บันทึกการเปลี่ยนแปลงเอกสารโครงสร้างทีมและผู้รับผิดชอบระบบย่อย
## InterviewX — Documentation Change Log (Team Roles & Module Ownership)

> **สถานะเอกสาร:** บันทึกประวัติการเปลี่ยนแปลงอย่างเป็นทางการ (Official Change Log)  
> **วันที่มีผลบังคับใช้:** 21 พฤศจิกายน 2026 | **เวอร์ชัน:** 1.0  
> **ระบบ:** InterviewX — AI Job Interview Simulation System  
> **ผู้จัดทำ:** Senior Business Analyst, Software Architect, Project Manager และ Technical Documentation Specialist

---

## 1. ภาพรวมการเปลี่ยนแปลง (Change Log Overview)

การปรับปรุงเอกสารในรอบนี้มีเป้าหมายเพื่อนำโครงสร้างทีมพัฒนาที่ได้รับการอนุมัติอย่างเป็นทางการ (Approved Development Team Structure) ประกอบด้วย สมาชิก 5 คน บทบาทหน้าที่เฉพาะทาง (Specialized Roles) การแบ่งระบบย่อย (Module Ownership) ผลงานที่ต้องส่งมอบ (Deliverables) และการตรวจสอบความรับผิดชอบ (Accountability) มาปรับใช้ในเอกสารโครงการทุกฉบับอย่างถูกต้องและสอดคล้องกัน 100%

---

## 2. ตารางบันทึกการเปลี่ยนแปลงรายเอกสาร (Detailed Change Log Table)

| ลำดับ | ชื่อเอกสาร (Document Name) | ส่วน / หน้า (Section / Page) | ข้อมูลเดิม (Previous Information) | ข้อมูลที่ปรับปรุงใหม่ (Updated Information) | เหตุผลในการปรับปรุง (Reason for Change) |
|:---:|---|---|---|---|---|
| 1 | `InterviewX_Research_Proposal_v1.2.docx` -> `InterviewX_Research_Proposal_v1.3.docx` | หน้าปก (Cover Page: ย่อหน้าที่ 8, 24) | `นายนรงศ์ศักดิ์ ภูมิประเสริฐ` (สะกดผิด มีทัณฑฆาตบน ง) | แก้ไขเป็น `นายนรงศักดิ์ ภูมิประเสริฐ` (สะกดถูกต้อง ไม่มีทัณฑฆาต) ทั้งสองตำแหน่ง | แก้ไขข้อผิดพลาดทางอักขรวิธีให้ตรงตามชื่อ-นามสกุลจริงที่ได้รับอนุมัติของ Tech Lead |
| 2 | `InterviewX_Research_Proposal_v1.3.docx` | บทที่ 1 (หลังหัวข้อ 1.8 ภาพที่ 1.1) | ไม่มีหัวข้อโครงสร้างทีมพัฒนา หรือการแจกแจงหน้าที่รายบุคคล | เพิ่ม **หัวข้อ 1.9 โครงสร้างทีมพัฒนา บทบาท ความรับผิดชอบ และการกำหนดผู้รับผิดชอบระบบย่อย** พร้อมตารางที่ 1.1 และตารางที่ 1.2 | บรรจุโครงสร้างทีมงาน 5 คน, หน้าที่, Deliverables, Module Ownership และการแบ่งงานตาม Release เข้าสู่เล่มข้อเสนอโครงการ |
| 3 | `01_Project_Management/InterviewX_Development_Team_Roles_and_Module_Ownership.md` | เอกสารใหม่ทั้งฉบับ | ยังไม่มีเอกสารควบคุมโครงสร้างทีมพัฒนาและ Module Ownership โดยเฉพาะ | สร้างเอกสาร Master Baseline บรรจุรายละเอียดบทบาท 5 คน, สโคปงาน, Deliverables, Module Ownership 20 ระบบ, Sprint RACI Matrix และเกณฑ์ตรวจรับงาน | จัดตั้งเอกสารหลักฐานทางการระดับสูงสุด (Single Source of Truth) ด้านการบริหารจัดการทีมและทรัพยากรบุคคล |
| 4 | `InterviewX_Sprint2_Team_Alignment_Brief.md` -> `InterviewX_Sprint2_Team_Alignment_Brief_v1.1_Updated.md` | หมวดที่ 5 (Work Packages WP-BE, WP-AI, WP-FE, WP-MB, WP-QA) | ระบุเฉพาะชื่อทีมกว้างๆ (เช่น Backend Team, Frontend Team, QA Team) โดยไม่ระบุชื่อบุคคล | ระบุชื่อผู้รับผิดชอบหลักและผู้ร่วมสนับสนุนรายบุคคลอย่างชัดเจนในทุก Work Package เช่น WP-BE-01: กิติกร, WP-BE-02: จิรเมธ, WP-AI: นรงศักดิ์, WP-FE/MB: สมหมาย, WP-QA: ณัฐพล | เพิ่มความโปร่งใส ความรับผิดชอบต่อผลงาน (Accountability) ในการรัน Sprint 2 Grooming & Planning |
| 5 | `InterviewX_Sprint2_Team_Alignment_Brief_v1.1_Updated.md` | หมวดที่ 6 (Sprint Alignment Questions) | คำถามระบุเพียงชื่อตำแหน่ง (เช่น Backend Lead, Frontend Lead, QA Lead) | ระบุชื่อ-นามสกุล และบทบาทที่ได้รับอนุมัติกำกับในทุกหัวข้อคำถามของแต่ละบุคคล | กำหนดตัวบุคคลผู้มีหน้าที่เตรียมคำตอบและชี้แจงในที่ประชุม Sprint Planning อย่างเป็นทางการ |
| 6 | `07_Development_Documentation/REPOSITORY_STRUCTURE.md` -> `REPOSITORY_STRUCTURE_v1.1_Updated.md` | ตาราง Boundaries and Paths (บรรทัด 81–92) | คอลัมน์ Code Owner ระบุเฉพาะพาธโฟลเดอร์ (เช่น `apps/api/modules/identity`) | เพิ่มคอลัมน์ Primary Owner และ Supporting Members ระบุชื่อสมาชิกทีมพัฒนา 5 คนที่รับผิดชอบแต่ละพาธอย่างชัดเจน | เชื่อมโยงสถาปัตยกรรม Monorepo และ Bounded Context เข้ากับผู้รับผิดชอบโค้ดจริงในทีม (Code Ownership) |
| 7 | `07_Development_Documentation/INTERVIEWX_MASTER_KNOWLEDGE_PACK.md` -> `INTERVIEWX_MASTER_KNOWLEDGE_PACK_v1.1_Updated.md` | เพิ่มหมวดที่ 11 และปรับปรุงหมวดที่ 10 | มีเนื้อหาเฉพาะภาพรวมเทคนิค 10 หมวด ยังไม่มีข้อมูลทีมพัฒนาและ Module Ownership | เพิ่ม **หมวดที่ 11: โครงสร้างทีมพัฒนา บทบาทหน้าที่ และผู้รับผิดชอบระบบย่อย** และเพิ่มกฎใน System Prompt ข้อ 3 ให้ AI เคารพ Team Roles | ให้ AI Assistant (ChatGPT/Claude/Antigravity) สามารถตอบคำถามและแจกจ่ายโค้ดได้ตรงตามความรับผิดชอบของสมาชิก |
| 8 | `03_SRS_Requirements/SRS_MANUAL_UPDATE_NOTES.md` | เอกสารใหม่ทั้งฉบับ | ยังไม่มีบันทึกแนะนำการปรับปรุง SRS สำหรับผู้จัดทำ | จัดทำบันทึกคำแนะนำสำหรับผู้จัดทำเอกสาร SRS พร้อมข้อความสำเร็จรูป (Ready-to-Copy) สำหรับแก้ไขชื่อสะกดผิด และเพิ่มตารางทีมงาน/Module Ownership | คงความสมบูรณ์ของเอกสาร SRS v1.1 FINAL เดิม โดยไม่ละเมิดข้อห้ามการแก้ไขไฟล์ `InterviewX_SRS_v1.1_FINAL_TH_PROCESS.docx` |
| 9 | `01_Project_Management/CONSISTENCY_REVIEW_REPORT.md` | เอกสารใหม่ทั้งฉบับ | ยังไม่มีรายงานการตรวจสอบความสอดคล้องเชิงโครงสร้างทีม | จัดทำรายงานการตรวจสอบความถูกต้องของชื่อ ตำแหน่ง หน้าที่ โมดูล โรดแมป และรายการข้อขัดแย้ง | เป็นหลักฐานการสอบทานคุณภาพความถูกต้องและสมบูรณ์ของเอกสารก่อนการตรวจรับมอบงาน |

---

## 3. สรุปสถานะการควบคุมเอกสาร (Document Control Summary)

1. **การรักษาเอกสารเดิม:** ไม่มีเอกสารเดิมฉบับใดถูกเขียนทับหรือลบทำลาย เอกสารฉบับปรับปรุงทั้งหมดถูกสร้างขึ้นเป็นไฟล์คู่ขนานที่มีเลขเวอร์ชันกำกับชัดเจน (`_v1.1_Updated`, `_v1.3`) ตามกฎข้อ 9.10
2. **การปกป้องไฟล์ยกเว้น (Excluded File Invariant):** ไฟล์ `InterviewX_SRS_v1.1_FINAL_TH_PROCESS.docx` ไม่ได้รับการแก้ไข ดัดแปลง หรือเขียนทับใดๆ ทั้งสิ้น โดยได้จัดทำข้อเสนอในรูปแบบ `SRS_MANUAL_UPDATE_NOTES.md` เรียบร้อยแล้ว
3. **การคงสภาพข้อกำหนดระบบ:** ข้อกำหนดเชิงหน้าที่ (FR 40 ข้อ), ข้อกำหนดเชิงคุณภาพ (NFR 24 ข้อ), ตารางสิทธิ์ RBAC, และแผนภาพสถาปัตยกรรม (D01–D25) ยังคงคุณสมบัติตาม Approved Active Baseline v1.1 ครบถ้วน 100%
