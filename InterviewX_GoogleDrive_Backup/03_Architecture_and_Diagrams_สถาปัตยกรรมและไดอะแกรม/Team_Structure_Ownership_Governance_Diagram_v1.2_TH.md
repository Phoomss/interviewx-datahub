# แผนภาพโครงสร้างทีมพัฒนา ความเป็นเจ้าของระบบ และสายการกำกับดูแลทางเทคนิค (v1.2 Team-Revised)
## InterviewX — Development Team Structure, Technical Ownership & Governance Workflow Diagrams

> **สถานะเอกสาร:** แผนภาพประกอบฉบับปรับปรุงโครงสร้างทีม (Supplement to `ALL_DIAGRAMS_v1.1_FINAL_TH.md`)  
> **วันที่มีผลบังคับใช้:** 25 พฤศจิกายน 2026 | **เวอร์ชัน:** 1.2 (Team Structure & Ownership Aligned)  
> **หมายเหตุสำคัญ:** แผนภาพสถาปัตยกรรมระบบหลัก **D01–D27** ใน [ALL_DIAGRAMS_v1.1_FINAL_TH.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/ALL_DIAGRAMS_v1.1_FINAL_TH.md) ไม่มีข้อมูลโครงสร้างทีมพัฒนาหรือการแบ่งหน้าที่รายบุคคล จึงยังคงต้นฉบับเดิมไว้ครบถ้วน 100% และจัดทำแผนภาพ **D28** และ **D29** ในเอกสารนี้เพิ่มเติมเพื่อแสดง Team Ownership และ Review Workflow ที่ได้รับอนุมัติใหม่

---

## D28 โครงสร้างทีมพัฒนา บทบาทหน้าที่ และ Technical Ownership Matrix

แสดงการจัดแบ่งความรับผิดชอบหลัก (Primary Owner) และความรับผิดชอบเชิงสนับสนุน (Supporting) ของสมาชิกทั้ง 5 คน ครอบคลุม Client Layer, Core Backend Modular Monolith, AI Service และ QA/Documentation โดยคงขอบเขต Single Ownership ของ Core PostgreSQL และ AI Service

```mermaid
flowchart TB
    classDef lead fill:#ede9fe,stroke:#6d28d9,stroke-width:2px,color:#3b0764
    classDef fe fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0c4a6e
    classDef be fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef qa fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    classDef arch fill:#f1f5f9,stroke:#475569,stroke-width:1.5px,color:#1e293b

    TL["นายนรงศักดิ์ ภูมิประเสริฐ (674259009)<br/>Tech Lead<br/>System Architecture, Backend Technical Governance<br/>& AI Service Primary Owner"]

    FE["นายสมหมาย สุภาวงค์ (674259024)<br/>UX/UI Lead & Frontend Lead<br/>UX/UI Design, Design System<br/>& Frontend Primary Owner"]

    BE1["นายกิติกร เทศธรรม (674259003)<br/>Fullstack Developer<br/>Backend Primary (Auth, User, RBAC, API, Prisma)<br/>& Frontend Supporting Developer"]

    BE2["นายจิรเมธ วงษ์กัณหา (674259004)<br/>Fullstack Developer<br/>Backend Primary (Session, Question, Outbox, BullMQ, Worker)<br/>& Frontend Supporting Developer"]

    QA["นายณัฐพล กลิ่นจุ่น (674259006)<br/>BA / QA / Tester / Documentation<br/>Requirements, RTM, Test Cases, Testing,<br/>Defect Tracking & Documentation"]

    subgraph ScopeFE["Frontend & Design Layer"]
        FE_Own["UX/UI Design & Design System<br/>Frontend Architecture (Next.js / Mobile R2)<br/>Frontend Web & API Integration"]
    end

    subgraph ScopeBE["NestJS Core Backend Modular Monolith (Single DB Owner)"]
        BE1_Own["Auth & Identity Backend<br/>User Profile & Account Backend<br/>RBAC, DTOs, Prisma ORM, OpenAPI"]
        BE2_Own["Interview Session & Question Backend<br/>Answer Submission & Idempotency<br/>BullMQ, Transactional Outbox & Worker Integration"]
        CoreDB[("Core PostgreSQL<br/>(เข้าถึงผ่าน NestJS Core เท่านั้น)")]
    end

    subgraph ScopeAI["FastAPI AI Service & DevOps"]
        AI_Own["FastAPI AI Service & LLM Integration<br/>AI Evaluation & Rubric Engine<br/>Structured Output & Guardrails<br/>Docker, CI/CD, Deployment & DevOps"]
    end

    subgraph ScopeQA["Quality Assurance & Governance"]
        QA_Own["Requirement Analysis & RTM<br/>Functional / FE / API / Integration / System Test<br/>Defect Tracking & Acceptance Review"]
    end

    FE ==>|"Primary Owner"| FE_Own
    BE1 -.->|"Supporting (UI/Auth/User API)"| FE_Own
    BE2 -.->|"Supporting (Interview Room/History/Status)"| FE_Own
    TL -.->|"Architecture Consultation"| FE_Own

    TL ==>|"Continuous Backend Governance,<br/>Standards & Code Review"| ScopeBE
    BE1 ==>|"Primary Owner"| BE1_Own
    BE2 ==>|"Primary Owner"| BE2_Own
    BE1_Own --> CoreDB
    BE2_Own --> CoreDB

    BE2_Own -->|"HTTP Task Payload<br/>(ห้าม AI ต่อ Core DB ตรง)"| AI_Own
    TL ==>|"Primary Owner<br/>(พัฒนาและดูแลโดยตรง)"| AI_Own

    QA ==>|"Primary Owner"| QA_Own
    TL & FE & BE1 & BE2 -.->|"ร่วมตรวจสอบและแก้ไข Defect"| QA_Own

    class TL lead
    class FE,FE_Own fe
    class BE1,BE2,BE1_Own,BE2_Own be
    class QA,QA_Own qa
    class CoreDB,AI_Own arch
```

---

## D29 กระบวนการทำงานร่วมกัน การตรวจสอบโค้ด และการตรวจรับงาน (Team Workflow & Technical Governance)

แสดงลำดับการทำงานร่วมกันระหว่างบทบาทในรอบการพัฒนา (Sprint Workflow) ตั้งแต่การวิเคราะห์ข้อกำหนด การออกแบบ UX/UI การพัฒนา Backend/Frontend/AI Service การทบทวนโค้ดโดย Tech Lead และ Frontend Lead จนถึงการทดสอบและตรวจรับมอบงานโดย BA/QA

```mermaid
flowchart LR
    classDef stepQA fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
    classDef stepFE fill:#e0f2fe,stroke:#0284c7,stroke-width:1.5px,color:#0c4a6e
    classDef stepBE fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
    classDef stepTL fill:#ede9fe,stroke:#6d28d9,stroke-width:2px,color:#3b0764

    Req["1. Requirement Grooming & RTM<br/>Primary: ณัฐพล (BA/QA)<br/>Review: Tech Lead & ทีม"] --> ArchGate["2. Architecture & API Contract<br/>Primary: นรงศักดิ์ (Tech Lead)<br/>Consult: กิติกร, จิรเมธ, สมหมาย"]

    ArchGate --> TrackFE["3A. UX/UI, Design System & Frontend Web<br/>Primary: สมหมาย (Frontend Lead)<br/>Supporting: กิติกร / จิรเมธ (ตาม Sprint Backlog)"]
    ArchGate --> TrackBE["3B. NestJS Core Backend & Worker<br/>Primary: กิติกร (Auth/User) & จิรเมธ (Interview/Queue)<br/>Standards: NestJS Modular Monolith + Prisma"]
    ArchGate --> TrackAI["3C. FastAPI AI Service & Rubric Engine<br/>Primary: นรงศักดิ์ (Tech Lead)<br/>(Fullstack ไม่พัฒนา AI Engine)"]

    TrackFE --> FEReview{"4A. Frontend Review<br/>& UI Consistency Check<br/>โดย สมหมาย (Frontend Lead)"}
    TrackBE --> BEReview{"4B. Continuous Backend Code,<br/>API, DB & Security Review<br/>โดย นรงศักดิ์ (Tech Lead)"}
    TrackAI --> IntGate["5. System Integration<br/>NestJS <-> Worker <-> FastAPI<br/>ควบคุมโดย Tech Lead + จิรเมธ"]

    FEReview -->|"Approved"| QATest
    BEReview -->|"Approved before Merge/Release"| IntGate
    IntGate --> QATest["6. Functional, FE, API, Integration<br/>& System Testing + Defect Tracking<br/>Primary: ณัฐพล (BA/QA) ร่วมกับผู้พัฒนา"]

    QATest -->|"Pass Acceptance Criteria"| Release["7. Release & Deployment<br/>Docker / CI/CD โดย Tech Lead"]

    class Req,QATest stepQA
    class TrackFE,FEReview stepFE
    class TrackBE stepBE
    class ArchGate,TrackAI,BEReview,IntGate,Release stepTL
```

---

## สรุปความสอดคล้องกับแผนภาพสถาปัตยกรรมหลัก (D01–D27)

1. แผนภาพสถาปัตยกรรมระบบ D01–D27 ใน [ALL_DIAGRAMS_v1.1_FINAL_TH.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/04_System_Architecture/v1.1_diagrams/ALL_DIAGRAMS_v1.1_FINAL_TH.md) ยังคงถูกต้องและไม่มีการแก้ไข Technology Stack หรือ Architecture Invariants ใดๆ
2. แผนภาพ D28 และ D29 ยืนยันขอบเขตเชิงสถาปัตยกรรมตามเดิม: **NestJS Core** เป็น Single Owner ของ Core PostgreSQL และ **FastAPI AI Service** ไม่เชื่อมต่อ Core PostgreSQL โดยตรง
