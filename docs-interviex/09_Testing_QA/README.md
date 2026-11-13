# หมวดที่ 09: แผนและการประกันคุณภาพซอฟต์แวร์ (09_Testing_QA)
> **InterviewX — AI Job Interview Simulation System**
> **สถานะเอกสาร:** ควบคุมและเป็นมาตรฐานการทดสอบระบบ (Quality Assurance Baseline)
> **ปรับปรุงล่าสุด:** 13 พฤศจิกายน 2026

---

## 📌 ภาพรวมหมวดการทดสอบและการประกันคุณภาพ (Category Overview)

หมวดนี้จัดเก็บแผนการทดสอบระบบ (Test Plans), ชุดกรณีทดสอบ (Test Cases), แนวทางการทดสอบการทำงานร่วมกันระหว่างบริการ (Integration & Contract Testing), การทดสอบประสิทธิภาพและความทนทาน (Load & Performance Testing), และการทดสอบความมั่นคงปลอดภัย (Security Testing & Vulnerability Assessment)

---

## 🧪 ระดับและกลยุทธ์การทดสอบระบบ (Testing Pyramid & Strategy)

```text
               / \
              /   \      E2E Tests (Playwright / Maestro)
             /     \     - Critical User Journeys (Candidate Practice)
            /-------\
           /         \   Integration & Contract Tests (Supertest, Pact)
          /           \  - NestJS ↔ FastAPI, Outbox, BullMQ, Idempotency
         /-------------\
        /               \ Unit Tests (Jest / Pytest)
       /                 \ - Core Business Rules, Rubric Validation (Coverage ≥ 80%)
      ---------------------
```

---

## 📋 การตรวจสอบย้อนกลับสู่การทดสอบ (Requirement-to-Test Traceability)

ข้อกำหนดทั้ง 64 รายการ (40 FR, 24 NFR) มีการผูกวิธีทดสอบและเกณฑ์การยอมรับอย่างเป็นรูปธรรม:
👉 ตรวจสอบเมทริกซ์การทดสอบฉบับเต็มได้ที่: [03_SRS_Requirements/InterviewX_Phase1_Requirement_Traceability_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_Phase1_Requirement_Traceability_TH.xlsx)

| ขอบเขตการทดสอบ | วิธีการทดสอบ (Method) | เครื่องมือหลัก | เกณฑ์ความสำเร็จ (Pass Criteria) |
|---|---|---|---|
| **Core API & RBAC** | Unit & Integration Test | Jest, Supertest | บล็อกการเข้าถึงข้ามบัญชี (IDOR 100% Blocked), Unit Coverage ≥ 80% |
| **ความทนทานต่อคำขอซ้ำ** | Idempotency Retry Test | Postman / Automated Mock | ส่ง `Idempotency-Key` เดียวกันซ้ำ ระบบต้องไม่สร้าง Transaction ซ้ำซ้อน |
| **บริการประเมิน AI** | Schema & Model Contract Test | Pytest, Pydantic | ผลประเมินตรงตาม Schema 100%, จำลอง Provider ล่มต้อง Retry ตาม Backoff |
| **การแสดงผลเว็บ** | Responsive Layout Test | Playwright | ผ่านเกณฑ์ Viewport 360px, 768px, 1024px+ โดยไม่มี Overflow หรือ Element ทับซ้อน |
| **การแสดงผลโมบายล์** | Native Mobile UI Test | Maestro / Emulator | ผ่านเกณฑ์ Safe Area Inset และรองรับ Dynamic Font Scaling |

---

## ✅ เกณฑ์ความพร้อมในการรับมอบงาน (Definition of Done: DoD)

1. ทุกฟังก์ชันมี Unit Tests และผ่านเกณฑ์ Coverage ไม่น้อยกว่า 80%
2. ทุก Private Endpoint ผ่านการตรวจสอบ Server-side Ownership Guard
3. ผ่านการทดสอบ Stress/Load Test ตามที่ระบุใน NFR (เวลาตอบสนอง p95 ≤ 800ms สำหรับ Web, Text Evaluation latency p95 ≤ 5s)
