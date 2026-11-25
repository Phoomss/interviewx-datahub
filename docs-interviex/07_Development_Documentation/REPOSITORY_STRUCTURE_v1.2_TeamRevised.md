# InterviewX Monorepo — Service Boundary & Module Ownership Alignment (v1.2 Team-Revised)
## REPOSITORY_STRUCTURE (v1.2 Team-Revised)

> **Document Status:** Team-Revised Governance Baseline (v1.2)  
> **Effective Date:** 25 November 2026 | **Governance:** Tech Lead (`นายนรงศักดิ์ ภูมิประเสริฐ`)  
> **Original Baseline Preserved:** [REPOSITORY_STRUCTURE.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/07_Development_Documentation/REPOSITORY_STRUCTURE.md)  
> **Reference:** [InterviewX_Development_Team_Roles_and_Module_Ownership_v1.2_TeamRevised.md](file:///Users/mac/Desktop/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Development_Team_Roles_and_Module_Ownership_v1.2_TeamRevised.md)

---

## 1. Dependency Direction and Invariants (Unchanged)

- `controller -> application/use-case -> domain` and `infrastructure -> domain ports`.
- **Single Ownership of Core Database:** NestJS Core (`apps/api` and `apps/evaluation-worker`) alone accesses Core PostgreSQL. FastAPI AI Service (`apps/ai-service`) is HTTP-only and never connects directly to Core PostgreSQL.
- Preserve Transactional Outbox, Idempotency, and Session Resilience per SRS.

---

## 2. Boundaries, Paths, and Revised Technical Ownership Matrix

| Bounded Context / Layer | Repository Path | Primary Owner | Supporting | Release |
|---|---|---|---|:---:|
| **System Architecture & Backend Standards** | Monorepo root, `apps/api` standards | **Tech Lead (นายนรงศักดิ์)** | Fullstack Developers | R1–R3 |
| **Backend Code Review & Governance** | `apps/api/**`, `packages/db-core/**` | **Tech Lead (นายนรงศักดิ์)** | — | R1–R3 |
| **Identity, Auth & User Profile Backend** | `apps/api/modules/identity + access`, `privacy`, `content` | **นายกิติกร เทศธรรม** | Tech Lead | R1–R3 |
| **Database Core Prisma & Migrations** | `packages/db-core` | **นายกิติกร เทศธรรม** (ร่วมกับ จิรเมธ ในโมดูล Interview/Platform) | Tech Lead | R1–R3 |
| **Interview Session, Question & Answer Backend** | `apps/api/modules/interview`, `evaluation`, `platform` | **นายจิรเมธ วงษ์กัณหา** | Tech Lead | R1–R3 |
| **BullMQ Queue & Evaluation Worker Integration** | `apps/evaluation-worker` | **นายจิรเมธ วงษ์กัณหา** | Tech Lead | R1–R3 |
| **AI Service, LLM, Evaluation & Rubric Engine** | `apps/ai-service` | **Tech Lead (นายนรงศักดิ์)** | — | R1–R3 |
| **UX/UI Design & Design System** | `packages/ui`, Design Tokens | **นายสมหมาย สุภาวงค์** | — | R1–R3 |
| **Frontend Architecture** | `apps/web` architecture | **นายสมหมาย สุภาวงค์** | Tech Lead ให้คำปรึกษา | R1–R3 |
| **Frontend Web Development & API Integration** | `apps/web` (และ `apps/mobile` ตาม Roadmap R2) | **นายสมหมาย สุภาวงค์** | นายกิติกร / นายจิรเมธ | R1–R3 |
| **DevOps, Docker & CI/CD** | `infra/`, `.github/` | **Tech Lead (นายนรงศักดิ์)** | Fullstack Developers | R1–R3 |
| **QA, Testing & Documentation** | `tests/`, `docs/` | **นายณัฐพล กลิ่นจุ่น** | สมาชิกทุกคน | R1–R3 |

---

## 3. Code Review & PR Gate Policy (v1.2 Team-Revised)

1. **Backend (`apps/api`, `apps/evaluation-worker`, `packages/db-core`):**
   - พัฒนาหลักโดย **นายกิติกร** และ **นายจิรเมธ** ตาม Bounded Context ที่รับผิดชอบ
   - ต้องผ่านการตรวจสอบ Backend Code, Architecture, API Contract, Database Integration, Security และ Code Quality จาก **นายนรงศักดิ์ (Tech Lead)** ก่อน Merge หรือ Release
2. **AI Service (`apps/ai-service`) & Infrastructure (`infra/`, `.github/`):**
   - พัฒนาและเป็น Primary Owner โดย **นายนรงศักดิ์ (Tech Lead)** โดยตรง (Fullstack Developers ไม่รับผิดชอบการพัฒนา AI Evaluation Engine)
3. **Frontend & Design System (`apps/web`, `packages/ui`, `apps/mobile` R2):**
   - **นายสมหมาย (UX/UI Lead & Frontend Lead)** เป็น Frontend Primary Owner ดูแล Frontend Architecture, Design System และตรวจสอบ UI Consistency/Accessibility
   - **นายกิติกร** และ **นายจิรเมธ** สนับสนุน Frontend ใน Feature ที่ได้รับมอบหมายภายใต้แนวทางของ Frontend Lead และต้องผ่าน Review จาก **นายสมหมาย**
4. **QA & Acceptance Gate (`tests/`, `docs/`):**
   - **นายณัฐพล (BA / QA / Tester / Documentation)** รับผิดชอบ Test Scenarios, Test Cases, Functional/FE/API/Integration/System Testing, Defect Tracking และ Acceptance Criteria Review ร่วมกับผู้พัฒนา
