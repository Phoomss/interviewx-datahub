# หมวดที่ 08: วิศวกรรมปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง (08_AI_ML_Engineering)
> **InterviewX — AI Job Interview Simulation System**  
> **สถานะเอกสาร:** ควบคุมและเป็นมาตรฐานไปป์ไลน์ AI (AI Engine & Evaluation Pipeline Baseline)  
> **ปรับปรุงล่าสุด:** 23 พฤศจิกายน 2026 (เชื่อมโยงผังไปป์ไลน์ AI และกลไก Fallback & Circuit Breaker)

---

## 📌 ภาพรวมหมวดวิศวกรรม AI/ML (Category Overview)

หมวดนี้จัดเก็บการออกแบบสถาปัตยกรรมบริการ AI (AI Service Architecture), การตั้งค่าและการเรียกใช้งาน Large Language Model (LLM Configuration), ไปป์ไลน์การประเมินผลคะแนนคำตอบ (Evaluation Pipeline), สัญญาการเชื่อมต่อระหว่างระบบแบ็กเอนด์กับบริการ AI (Internal OpenAPI 3.1 Contracts), และเกณฑ์การตรวจสอบความถูกต้องของข้อมูล (Pydantic Schema Validation)

---

## 🚀 เอกสารและสัญญาหลักในหมวด (Contracts & Architecture Blueprints)

| เอกสารผลลัพธ์ | ลิงก์เปิดไฟล์ (Clickable Link) | รูปแบบ | คำอธิบายสาระสำคัญ |
|---|---|:---:|---|
| **สัญญาทางเทคนิคบริการ AI** | [internal-evaluation.openapi.yaml](file:///D:/workspaces/interviewx-datahub/docs-interviex/08_AI_ML_Engineering/contracts/internal-evaluation.openapi.yaml) | OpenAPI 3.1 | สัญญาระหว่าง BullMQ Worker และ FastAPI AI Service สำหรับการประเมินผลข้อความและไฟล์เสียง |
| **ผังการไหลของข้อมูลสำหรับระบบ AI (D26)** | [Mermaid Code](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/diagrams/D26_ai_data_pipeline.mmd) · [Draw.io Blueprint](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/drawio/D26_ai_data_pipeline.drawio) · [SVG](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/images/D26_ai_data_pipeline.svg) · [PNG](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/images/D26_ai_data_pipeline.png) | สถาปัตยกรรม | การไหลของข้อมูล AI ตั้งแต่ Ingestion, Whisper STT, Prompt Assembly, Pydantic Schema Validation จนถึง MLflow / DVC Tracking |
| **กลไกสำรองและตัดวงจร AI (D27)** | [Mermaid Code](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/diagrams/D27_ai_fallback_circuit_breaker.mmd) · [Draw.io Blueprint](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/drawio/D27_ai_fallback_circuit_breaker.drawio) · [SVG](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/images/D27_ai_fallback_circuit_breaker.svg) · [PNG](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/images/D27_ai_fallback_circuit_breaker.png) | สถาปัตยกรรม | วงจรการทำงาน Circuit Breaker (Closed, Open, Half-Open), การสลับ Fallback Providers 3 ระดับ และการจัดการคิวสำรอง DLQ |

---

## 📂 โครงสร้างหมวดวิศวกรรม AI/ML (Directory Structure)

`	ext
08_AI_ML_Engineering/
│
├── 📂 contracts/                                  # สัญญาทางเทคนิคสำหรับบริการ AI
│   └── 📜 internal-evaluation.openapi.yaml        # สัญญา OpenAPI 3.1 สำหรับ Worker ↔ FastAPI AI Service
│
└── 📄 README.md                                   # คู่มือภาพรวมและสถาปัตยกรรม AI (ไฟล์นี้)
`

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
4. **ความทนทานต่อความล้มเหลว (Fault Tolerance & Circuit Breaker):**
   - เมื่ออัตราความผิดพลาดของโมเดลหลักเกิน 50% วงจรจะตัดสู่สถานะ OPEN และสลับไปใช้โมเดลสำรอง Tier 2 หรือโมเดลขนาดกะทัดรัด On-premise Tier 3 โดยอัตโนมัติ
