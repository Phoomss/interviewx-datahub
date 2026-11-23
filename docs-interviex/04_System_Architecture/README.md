# หมวดที่ 04: สถาปัตยกรรมระบบและการออกแบบเชิงเทคนิค (04_System_Architecture)
> **InterviewX — AI Job Interview Simulation System**  
> **สถานะเอกสาร:** กำกับดูแลตามสถาปัตยกรรม v1.1 FINAL (Active Primary Baseline)  
> **ปรับปรุงล่าสุด:** 17 พฤศจิกายน 2026  

---

## 📌 ภาพรวมหมวดสถาปัตยกรรมระบบ (Category Overview)

หมวดนี้รวบรวมแบบจำลองสถาปัตยกรรมระบบ (System Architecture), แผนภาพสถาปัตยกรรม C4 Model, แผนผังลำดับการทำงาน (Sequence Diagrams), สัญญาการเชื่อมต่อระบบ (API Contracts / OpenAPI 3.0), แบบจำลองกรณีการใช้งาน (Use Cases) และการแบ่งขอบเขตบริบท (Bounded Contexts) ของแพลตฟอร์ม InterviewX

---

## 🌟 แผนภาพสถาปัตยกรรมระบบฉบับทางการที่ผ่านการอนุมัติ (Active Primary Baseline — v1.1 FINAL)

แผนภาพทั้งหมดถูกออกแบบด้วย Mermaid และจัดทำทั้งฉบับภาษาไทยและภาษาอังกฤษ รวมทั้งสิ้น 27 แผนภาพ (D01 ถึง D27) จัดเก็บอย่างเป็นระบบที่:  
👉 **โฟลเดอร์หลัก:** [v1.1_diagrams/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/)

| แผนภาพผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **แผนภาพสถาปัตยกรรมระบบ (ภาษาไทย v1.1 FINAL)** | [ALL_DIAGRAMS_v1.1_FINAL_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/ALL_DIAGRAMS_v1.1_FINAL_TH.md) | ~105 KB | รวมครบทั้ง 27 แผนภาพ (D01–D27) พร้อมคำอธิบายและป้ายกำกับภาษาไทยมาตรฐาน |
| **แผนภาพสถาปัตยกรรมระบบ (English v1.1 FINAL)** | [ALL_DIAGRAMS_v1.1_FINAL.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/ALL_DIAGRAMS_v1.1_FINAL.md) | ~58 KB | รวมครบทั้ง 27 แผนภาพฉบับภาษาอังกฤษสำหรับทีมพัฒนาสากล |
| **แบบจำลองกรณีการใช้งานระบบ (Use Case Model v1.1)** | [InterviewX_Use_Case_Diagrams_v1.1.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/InterviewX_Use_Case_Diagrams_v1.1.md) | ~48 KB | รวมแผนภาพกรณีการใช้งานทั้งระดับระบบ (D20) และระบบย่อย 3 ด้าน (D21–D23) พร้อมตาราง Traceability |
| **ซอร์สโค้ด Mermaid (.mmd รายไฟล์)** | [diagrams/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/diagrams/) | 27 ไฟล์ | ซอร์สโค้ด Mermaid สำหรับเรนเดอร์แผนภาพ D01–D27 |
| **ไฟล์สำหรับ draw.io (.drawio)** | [drawio/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/drawio/) | ไฟล์ XML | ไฟล์ Blueprint แก้ไขได้บน draw.io / diagrams.net (D26, D27) |
| **ภาพความละเอียดสูง (SVG / PNG)** | [images/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/images/) | SVG & PNG | ภาพ Blueprint คุณภาพสูงแบบเวกเตอร์และเรนเดอร์ PNG สำหรับนำไปใช้งาน (D26, D27) |

### รายการแผนภาพย่อย (Diagram Breakdown: D01–D27)
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
- **D20:** แผนภาพกรณีการใช้งานระบบโดยรวม (System Use Case Diagram)
- **D21:** แผนภาพระบบย่อย: การฝึกสัมภาษณ์และการประเมินผล AI (Practice & AI Evaluation Engine)
- **D22:** แผนภาพระบบย่อย: ยืนยันตัวตนและคุ้มครองข้อมูลส่วนบุคคล (Identity & PDPA Governance)
- **D23:** แผนภาพระบบย่อย: การบริหารระบบ การเงิน และชุดข้อมูลวิจัย (Administration, Billing & Research)
- **D24:** การจัดแนวทางสถาปัตยกรรมระหว่าง Web และ Mobile (Web & Mobile Architecture Alignment)
- **D25:** ลำดับการทำงานและการสลับรูปแบบระหว่าง Web และ Mobile (Web vs Mobile Interaction Sequence)
- **D26:** ผังการไหลของข้อมูลสำหรับระบบ AI (AI Data Pipeline Flow)
- **D27:** กลไกสำรองกรณีการประเมินของ AI ล้มเหลว (AI Fallback & Circuit Breaker)

---

## 🛠️ ข้อกำหนดการออกแบบเชิงวิศวกรรม (Detailed Engineering Designs)

- [interviewx-design/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/interviewx-design/): เอกสารการออกแบบเชิงลึก รายละเอียดสเปก OpenAPI, สคริปต์สกีมาฐานข้อมูล, และแบบร่าง Monorepo

---

## 📦 คลังแผนภาพประวัติ (Historical Archives)

- แผนภาพฉบับร่าง v1.1 ก่อนอนุมัติ: [archive/v1.1_drafts/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/archive/v1.1_drafts/)
- แผนภาพดั้งเดิมรอบตั้งต้น (v1.0): [archive/v1.0_baseline/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/archive/v1.0_baseline/)
- รายละเอียดคลังประวัติ: [archive/ARCHIVE_INDEX.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/archive/ARCHIVE_INDEX.md)
