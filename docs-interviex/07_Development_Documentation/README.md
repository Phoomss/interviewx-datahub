# หมวดที่ 07: เอกสารประกอบการพัฒนาซอฟต์แวร์ (07_Development_Documentation)
> **InterviewX — AI Job Interview Simulation System**
> **สถานะเอกสาร:** ควบคุมและเป็นมาตรฐานสำหรับการพัฒนา (Engineering Standards Baseline)
> **ปรับปรุงล่าสุด:** 13 พฤศจิกายน 2026

---

## 📌 ภาพรวมหมวดเอกสารประกอบการพัฒนา (Category Overview)

หมวดนี้จัดเก็บแนวทางการพัฒนาและมาตรฐานวิศวกรรมซอฟต์แวร์ (Engineering Guidelines & Coding Standards), โครงสร้างและขอบเขตแพ็กเกจของ Monorepo (Monorepo Repository Structure), บันทึกทางเทคนิคและการตั้งค่าสภาพแวดล้อม (Environment Configuration), และชุดความรู้รวมฉบับสมบูรณ์สำหรับนักพัฒนาและ AI Assistant (Master Knowledge Pack)

---

## 📂 ไฟล์เอกสารหลักในหมวด (Deliverables & Reference Guides)

| เอกสารผลลัพธ์ | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|:---:|---|
| **[INTERVIEWX_MASTER_KNOWLEDGE_PACK.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/07_Development_Documentation/INTERVIEWX_MASTER_KNOWLEDGE_PACK.md)** | 24.7 KB | ชุดข้อมูลสรุปบริบทระบบครบวงจร (Single Source of Truth) ครอบคลุมภาพรวม, Release Scope R1–R3, สรุปผลสำรวจ, RBAC Matrix, สถาปัตยกรรมระบบ, โครงสร้างข้อมูล, และเกณฑ์ประเมิน STAR |
| **[REPOSITORY_STRUCTURE.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/07_Development_Documentation/REPOSITORY_STRUCTURE.md)** | 11.2 KB | ผังโครงสร้างโฟลเดอร์ Monorepo, กฎความเป็นเจ้าของโมดูล (Module Ownership), ทิศทางการพึ่งพา (Dependency Direction), และการแบ่งแยกระหว่าง Shared Contracts กับ Core Services |

---

## 🛠️ กฎเกณฑ์และมาตรฐานการพัฒนา (Development Invariants)

1. **ลำดับการพึ่งพาโมดูล (Strict Dependency Direction):**
   - ห้ามไม่ให้ Core Service เรียกใช้งาน R3 Addon Services โดยตรง
   - Shared Schema / Types ต้องประกาศใน `packages/contracts` และห้าม Import โค้ด Backend ข้ามไปยัง Frontend
2. **การจัดการข้อผิดพลาด (HTTP Error Standard):**
   - ทุก API ตอบกลับด้วยรูปแบบมาตรฐาน RFC 7807 (Problem Details for HTTP APIs)
   - ประกอบด้วย `statusCode`, `error`, `message`, `correlationId`, และ `timestamp`
3. **การทำงานแบบ Asynchronous:**
   - ภารกิจการประเมินผล AI ที่ใช้เวลานานต้องส่งผ่าน BullMQ Queue และติดตามสถานะผ่าน Job ID
