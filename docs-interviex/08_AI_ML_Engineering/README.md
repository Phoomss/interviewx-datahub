# หมวดที่ 08: วิศวกรรมปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง (08_AI_ML_Engineering)
> **InterviewX — AI Job Interview Simulation System**
> **สถานะเอกสาร:** ควบคุมและเป็นมาตรฐานไปป์ไลน์ AI (AI Engine & Evaluation Pipeline Baseline)
> **ปรับปรุงล่าสุด:** 13 พฤศจิกายน 2026

---

## 📌 ภาพรวมหมวดวิศวกรรม AI/ML (Category Overview)

หมวดนี้จัดเก็บการออกแบบสถาปัตยกรรมบริการ AI (AI Service Architecture), การตั้งค่าและการเรียกใช้งาน Large Language Model (LLM Configuration), ไปป์ไลน์การประเมินผลคะแนนคำตอบ (Evaluation Pipeline), สัญญาการเชื่อมต่อระหว่างระบบแบ็กเอนด์กับบริการ AI (Internal OpenAPI 3.1 Contracts), และเกณฑ์การตรวจสอบความถูกต้องของข้อมูล (Pydantic Schema Validation)

---

## 📂 ไฟล์และสัญญาในหมวด (Contracts & Deliverables)

```text
08_AI_ML_Engineering/
│
├── 📂 contracts/                                  # สัญญาทางเทคนิคสำหรับบริการ AI
│   └── 📜 internal-evaluation.openapi.yaml        # สัญญา OpenAPI 3.1 สำหรับ Worker ↔ FastAPI AI Service
│
└── 📄 README.md                                   # คู่มือภาพรวมและสถาปัตยกรรม AI (ไฟล์นี้)
```

---

## 🧠 สถาปัตยกรรมและกฎเกณฑ์การประเมินผล AI (AI Architecture Invariants)

1. **สถาปัตยกรรมไร้สถานะ (Stateless AI Service):**
   - AI Service (FastAPI) ทำงานแบบ Stateless อย่างสมบูรณ์ ไม่มีการเชื่อมต่อฐานข้อมูลโดยตรง (No direct DB access)
   - ข้อมูลคำถาม คำตอบ เกณฑ์รูบริก และการตั้งค่า AI ถูกส่งผ่าน HTTP Request Body ในรูปแบบ JSON
2. **การตรวจสอบผลลัพธ์ด้วย Schema (Strict Pydantic Validation):**
   - ทุกคำตอบและผลการตัดเกรดจากโมเดล LLM ต้องผ่านการตรวจสอบความถูกต้องด้วย Pydantic Schema ก่อนส่งกลับ
   - หากผลลัพธ์ไม่ผ่านเกณฑ์ ระบบจะทำการ Retry หรือส่งสถานะข้อผิดพลาด ไม่มีการสร้างคะแนนหลอก (No fabricated scores)
3. **การประเมิน 4 มิติ (4-Dimensional Rubric Evaluation):**
   - ความถูกต้องเชิงเทคนิคและความเกี่ยวข้อง (Technical Accuracy & Relevance)
   - โครงสร้างคำตอบตามรูปแบบ STAR (Situation, Task, Action, Result)
   - ทักษะการสื่อสารและความชัดเจน (Communication Clarity)
   - ความมั่นใจและทัศนคติเชิงบวก (Confidence & Professionalism)
