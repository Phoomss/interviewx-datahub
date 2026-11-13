# หมวดที่ 04: สถาปัตยกรรมระบบและการออกแบบเชิงเทคนิค (04_System_Architecture)
> **InterviewX — AI Job Interview Simulation System**
> **สถานะเอกสาร:** กำกับดูแลตามสถาปัตยกรรม v1.1 DRAFT_TH (Active Primary Baseline)
> **ปรับปรุงล่าสุด:** 13 พฤศจิกายน 2026

---

## 📌 ภาพรวมหมวดสถาปัตยกรรมระบบ (Category Overview)

หมวดนี้รวบรวมแบบจำลองสถาปัตยกรรมระบบ (System Architecture), แผนภาพสถาปัตยกรรม C4 Model, แผนผังลำดับการทำงาน (Sequence Diagrams), สัญญาการเชื่อมต่อระบบ (API Contracts / OpenAPI 3.0), และการแบ่งขอบเขตบริบท (Bounded Contexts) ของแพลตฟอร์ม InterviewX

---

## 🌟 แผนภาพสถาปัตยกรรมระบบทั้งหมด 19 รูป (Active Baseline — D01 ถึง D19)

แผนภาพทั้งหมดถูกออกแบบด้วย Mermaid และจัดทำทั้งฉบับภาษาไทยและภาษาอังกฤษ:

| แผนภาพผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **แผนภาพสถาปัตยกรรมระบบ (ภาษาไทย v1.1)** | [ALL_DIAGRAMS_v1.1_DRAFT_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/InterviewX_Final_System_Diagrams_v1.0/ALL_DIAGRAMS_v1.1_DRAFT_TH.md) | 59.3 KB | รวม 19 แผนภาพ (D01–D19) พร้อมคำอธิบาย ป้ายกำกับภาษาไทยมาตรฐาน |
| **แผนภาพสถาปัตยกรรมระบบ (English v1.1)** | [ALL_DIAGRAMS_v1.1_DRAFT.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/InterviewX_Final_System_Diagrams_v1.0/ALL_DIAGRAMS_v1.1_DRAFT.md) | 26.5 KB | รวม 19 แผนภาพฉบับภาษาอังกฤษสำหรับทีมพัฒนาสากล |
| **แผนภาพสถาปัตยกรรมดั้งเดิม (v1.0 Baseline)** | [ALL_DIAGRAMS.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/InterviewX_Final_System_Diagrams_v1.0/ALL_DIAGRAMS.md) | 18.2 KB | แผนภาพตั้งต้นก่อนการแยกแพลตฟอร์ม Phase 1 |

### รายการแผนภาพย่อย (Diagram Breakdown: D01–D19)
- **D01:** บริบทระบบระดับสูง (System Context)
- **D02:** C4 Containers (Decoupled Web, Mobile, NestJS, FastAPI, Storage)
- **D03:** การแบ่งขอบเขตบริบทตามหลัก DDD (Bounded Contexts)
- **D04:** แบบจำลองข้อมูลหลัก (Core Physical ERD)
- **D05:** แบบจำลองข้อมูลขั้นสูง (R3 Advanced ERD)
- **D06:** โซนความน่าเชื่อถือและการรักษาความมั่นคงปลอดภัย API (API Trust Zones)
- **D07:** ลำดับการจำลองสัมภาษณ์แบบข้อความ (Text Simulation Sequence)
- **D08:** แผนภาพสถานะการประเมินผล AI (AI Evaluation State Machine)
- **D09:** ลำดับการยืนยันตัวตนและการอนุญาตสิทธิ์ (Identity & RBAC Sequence)
- **D10:** วงจรชีวิตการคุ้มครองข้อมูลส่วนบุคคล (Data Privacy Lifecycle)
- **D11:** ลำดับการจำลองสัมภาษณ์แบบเสียงเรียลไทม์ (Voice Simulation Sequence)
- **D12:** ลำดับการชำระเงินและสมัครสมาชิก (Payment & Subscription Sequence)
- **D13:** สถาปัตยกรรมการเผยแพร่ชุดข้อมูลวิจัย (Research Dataset Release)
- **D14:** สถาปัตยกรรมโครงสร้างพื้นฐานคลาวด์บน Production (Managed Cloud Architecture)
- **D15:** สถาปัตยกรรม Kubernetes Showcase (Microservices Deployment)
- **D16:** ไปป์ไลน์การรวมโค้ดและส่งมอบอัตโนมัติ (CI/CD Pipeline)
- **D17:** สถาปัตยกรรมการตรวจวัดและการกู้คืนระบบ (Observability & Self-Healing)
- **D18:** โครงสร้างการแบ่งแยกขอบเขตโค้ด Monorepo (Monorepo Package Boundaries)
- **D19:** แผนงานการเปิดตัวระบบ (Release Roadmap Timeline)

---

## 📐 สัญญา API และการออกแบบระบบเชิงเทคนิค (Technical Design & Contracts)

จัดเก็บในโฟลเดอร์ [interviewx-design/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/interviewx-design/):
- `contracts/public-v1.openapi.yaml`: สัญญา OpenAPI 3.0 สำหรับ Public REST API (Client ↔ Backend)
- `contracts/internal-evaluation.openapi.yaml`: สัญญา OpenAPI 3.0 สำหรับ Internal AI Evaluation Service (NestJS ↔ FastAPI)
- `repo/REPOSITORY_STRUCTURE.md`: ข้อกำหนดโครงสร้างโฟลเดอร์และ Monorepo Package Boundary
- *ดูรายละเอียดสกีมาฐานข้อมูลและโมเดลข้อมูลกายภาพที่:* [05_Database_Data_Governance/](file:///D:/workspaces/interviewx-datahub/docs-interviex/05_Database_Data_Governance/)
