# แผนภาพสถาปัตยกรรมระบบ InterviewX — เวอร์ชัน 1.1 (v1.1 Diagrams Baseline)
> **InterviewX — AI Job Interview Simulation System**  
> **สถานะการควบคุม:** เอกสารสถาปัตยกรรมทางการผ่านการอนุมัติ (Official Approved Baseline)  
> **วันที่อนุมัติ:** 17 พฤศจิกายน 2026  

---

## 📌 ภาพรวมชุดแผนภาพ (Diagrams Baseline Overview)

โฟลเดอร์นี้รวบรวม **แผนภาพสถาปัตยกรรมระบบ แผนผังลำดับการทำงาน (Sequence Diagrams) แบบจำลองข้อมูล (ERD) และแบบจำลองกรณีการใช้งาน (Use Cases) รวมทั้งสิ้น 27 แผนภาพ (D01 ถึง D27) ในเวอร์ชัน 1.1 ที่ผ่านการอนุมัติแล้ว** โดยครอบคลุมการแบ่งแยกขอบเขตระหว่าง Responsive Web Application และ Native Mobile Application (iOS/Android) ร่วมกับสถาปัตยกรรมบริการหลังบ้านร่วมกัน (Shared Backend Architecture)

---

## 🌟 รายการเอกสารแผนภาพหลัก (Primary Diagram Documents)

| เอกสารแผนภาพ | ลิงก์เปิดไฟล์ (Clickable Link) | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **แผนภาพสถาปัตยกรรมระบบ (ภาษาไทย v1.1 FINAL)** | [ALL_DIAGRAMS_v1.1_FINAL_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/ALL_DIAGRAMS_v1.1_FINAL_TH.md) | ~105 KB | รวมครบ 27 แผนภาพ (D01–D27) พร้อมคำอธิบายและป้ายกำกับภาษาไทยมาตรฐาน |
| **แผนภาพสถาปัตยกรรมระบบ (English v1.1 FINAL)** | [ALL_DIAGRAMS_v1.1_FINAL.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/ALL_DIAGRAMS_v1.1_FINAL.md) | ~58 KB | รวมครบ 27 แผนภาพฉบับภาษาอังกฤษสำหรับทีมพัฒนาสากล |
| **แบบจำลองกรณีการใช้งานระบบ (Use Case Model v1.1)** | [InterviewX_Use_Case_Diagrams_v1.1.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/InterviewX_Use_Case_Diagrams_v1.1.md) | ~48 KB | รวมแผนภาพ Use Case ระดับระบบ (D20) และระบบย่อย 3 ด้าน (D21–D23) พร้อมตาราง Traceability |
| **โฟลเดอร์ไฟล์ซอร์สโค้ด Mermaid (.mmd)** | [diagrams/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/diagrams/) | 27 ไฟล์ | ซอร์สโค้ด Mermaid รายไฟล์ D01 ถึง D27 สำหรับเรนเดอร์และแก้ไข |

---

## 🗺️ รายการแผนภาพสถาปัตยกรรมทั้งหมด 27 รูป (D01 ถึง D27)

1. **D01:** บริบทระบบระดับสูง (System Context)
2. **D02:** C4 Containers (Decoupled Web, Mobile, NestJS, FastAPI, Storage)
3. **D03:** การแบ่งขอบเขตบริบทตามหลัก DDD (Bounded Contexts)
4. **D04:** แบบจำลองข้อมูลหลัก (Core Physical ERD)
5. **D05:** แบบจำลองข้อมูลขั้นสูง (R3 Advanced ERD)
6. **D06:** โซนความน่าเชื่อถือและการรักษาความมั่นคงปลอดภัย API (API Trust Zones)
7. **D07:** ลำดับการจำลองสัมภาษณ์แบบข้อความ (Text Simulation Sequence)
8. **D08:** แผนภาพสถานะการประเมินผล AI (AI Evaluation State Machine)
9. **D09:** ลำดับการยืนยันตัวตนและการอนุญาตสิทธิ์ (Identity & RBAC Sequence)
10. **D10:** วงจรชีวิตการคุ้มครองข้อมูลส่วนบุคคล (Data Privacy Lifecycle)
11. **D11:** ลำดับการจำลองสัมภาษณ์แบบเสียงเรียลไทม์ (Voice Simulation Sequence)
12. **D12:** ลำดับการชำระเงินและสมัครสมาชิก (Payment & Subscription Sequence)
13. **D13:** สถาปัตยกรรมการเผยแพร่ชุดข้อมูลวิจัย (Research Dataset Release)
14. **D14:** สถาปัตยกรรมโครงสร้างพื้นฐานคลาวด์บน Production (Managed Cloud Architecture)
15. **D15:** สถาปัตยกรรม Kubernetes Showcase (Microservices Deployment)
16. **D16:** ไปป์ไลน์การรวมโค้ดและส่งมอบอัตโนมัติ (CI/CD Pipeline)
17. **D17:** สถาปัตยกรรมการตรวจวัดและการกู้คืนระบบ (Observability & Self-Healing)
18. **D18:** โครงสร้างการแบ่งแยกขอบเขตโค้ด Monorepo (Monorepo Package Boundaries)
19. **D19:** แผนงานการเปิดตัวระบบ (Release Roadmap Timeline)
20. **D20:** แผนภาพกรณีการใช้งานระบบโดยรวม (System Use Case Diagram)
21. **D21:** แผนภาพระบบย่อย: การฝึกสัมภาษณ์และการประเมินผล AI (Practice & AI Evaluation Engine)
22. **D22:** แผนภาพระบบย่อย: ยืนยันตัวตนและคุ้มครองข้อมูลส่วนบุคคล (Identity & PDPA Governance)
23. **D23:** แผนภาพระบบย่อย: การบริหารระบบ การเงิน และชุดข้อมูลวิจัย (Administration, Billing & Research)
24. **D24:** การจัดแนวทางสถาปัตยกรรมระหว่าง Web และ Mobile (Web & Mobile Architecture Alignment)
25. **D25:** ลำดับการทำงานและการสลับรูปแบบระหว่าง Web และ Mobile (Web vs Mobile Interaction Sequence)
26. **D26:** ผังการไหลของข้อมูลสำหรับระบบ AI (AI Data Pipeline Flow)
27. **D27:** กลไกสำรองกรณีการประเมินของ AI ล้มเหลว (AI Fallback & Circuit Breaker)

---

## 📦 การเชื่อมโยงกับคลังเอกสารประวัติ (Historical Archives)

- แผนภาพฉบับร่าง v1.1 ก่อนอนุมัติ: [archive/v1.1_drafts/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/archive/v1.1_drafts/)
- แผนภาพดั้งเดิมรอบตั้งต้น (v1.0): [archive/v1.0_baseline/](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/archive/v1.0_baseline/)
