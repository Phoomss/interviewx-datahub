# InterviewX Monorepo — Service Boundary & Module Ownership Alignment
## REPOSITORY_STRUCTURE (v1.1 Updated)

> **Document Status:** Active Engineering Baseline (v1.1 Updated)  
> **Effective Date:** 21 November 2026 | **Governance:** Tech Lead & Architecture Team  
> **Reference:** [InterviewX_Development_Team_Roles_and_Module_Ownership.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/01_Project_Management/InterviewX_Development_Team_Roles_and_Module_Ownership.md)

---

## 1. Monorepo Directory Architecture

```text
interviewx/
├── apps/
│   ├── web/                         # Next.js TS PWA; generated public API client
│   ├── mobile/                      # React Native / Expo Native Mobile (R2)
│   ├── api/                         # NestJS Core API / BFF (R1)
│   │   └── src/
│   │       ├── bootstrap/           # auth middleware, config, global error envelope
│   │       ├── modules/
│   │       │   ├── identity/        # controller/application/domain/infrastructure
│   │       │   ├── access/          # roles/permissions/guards
│   │       │   ├── interview/       # sessions/questions/answers
│   │       │   ├── evaluation/      # job read model and appeals
│   │       │   ├── privacy/         # consent, notices, data rights, voice retention R2
│   │       │   ├── content/         # question/rubric/AI config approval
│   │       │   └── platform/        # outbox, idempotency, audit, telemetry
│   │       └── main.ts
│   ├── evaluation-worker/          # NestJS BullMQ consumer + outbox publisher
│   ├── ai-service/                 # FastAPI, Python, isolated provider adapters
│   │   ├── app/api/
│   │   ├── app/domain/
│   │   ├── app/providers/
│   │   └── tests/
│   ├── billing-service/            # R3; own DB / webhook/inbox/entitlements
│   └── research-service/           # R3; approved aggregates only; own DB
├── packages/
│   ├── contracts/
│   │   ├── openapi/public-v1.openapi.yaml
│   │   ├── openapi/internal-evaluation.openapi.yaml
│   │   ├── events/                 # versioned event payload JSON Schemas
│   │   └── generated/              # API clients/DTOs auto-generated; never edit
│   ├── db-core/                    # Core Prisma schema split by domain + migrations
│   ├── db-billing/                 # R3 separate migrations and credentials
│   ├── db-research/                # R3 separate migrations and credentials
│   ├── observability/              # redacting logger, OTel conventions
│   ├── ui/                         # shared presentational React components & Design System
│   └── testing/                    # fixtures + contract tests
├── infra/
│   ├── docker/                     # local development docker-compose.yml
│   ├── terraform/
│   │   ├── modules/                # network, postgres, redis, secrets, registry
│   │   └── environments/
│   │       ├── staging/
│   │       ├── production/
│   │       └── showcase/
│   ├── kubernetes/
│   │   ├── base/                    # api, web, worker, ai workloads
│   │   └── overlays/showcase/       # synthetic-only, quota constrained
│   ├── argocd/                     # GitOps manifests; K8s only
│   └── managed/                    # managed runtime definitions
├── tests/
│   ├── architecture/               # Nx/ESLint dependency graph rules
│   ├── contract/                   # OpenAPI + pact-like consumer tests
│   ├── integration/                # Postgres/Redis Testcontainers
│   ├── e2e/                        # auth, practice, privacy, admin
│   ├── security/                   # IDOR, RBAC, consent, webhook replay
│   ├── ai-evaluation/              # Thai/English blinded gold set
│   └── deployment-parity/          # prod/showcase image digest check
├── docs/
│   ├── adr/                        # architectural decision records
│   ├── sad/                        # C4, deployment & trust boundaries
│   ├── traceability/               # FR -> route -> table -> test ID
│   └── runbooks/                   # restore, incident, deletion, DLQ
├── .github/workflows/
│   ├── verify.yml                  # lint/typecheck/test/schema drift
│   ├── build-images.yml            # sign, scan, push digest
│   ├── promote-managed.yml         # approval gate stage -> production
│   └── gitops-showcase.yml         # PR matching immutable digest
├── pnpm-workspace.yaml
├── turbo.json                       # or Nx; select one task graph
├── pyproject.toml
└── README.md
```

---

## 2. Dependency Direction and Invariants

`controller -> application/use-case -> domain` and `infrastructure -> domain ports`.  
Controllers cannot import another domain's Prisma adapter/repository; they call its exported application service. `packages/contracts` contains transport DTOs and versioned events, **not** domain entities or ORM models. Python AI service is HTTP-only and never imports/queries Core DB. Web must not contain provider API keys.

---

## 3. Boundaries, Paths, and Development Team Ownership Matrix

ตารางแสดงการผูกโยง Bounded Context, เส้นทางซอร์สโค้ด และสิทธิ์ความรับผิดชอบของสมาชิกทีมพัฒนา (Module Ownership):

| Bounded Context | Core Schema / DB | Public API Prefix | Repository Path | ผู้รับผิดชอบหลัก (Primary Owner) | ผู้ร่วมสนับสนุน (Supporting Members) | Release |
|---|---|---|---|---|---|:---:|
| **Identity & Access** | `identity` | `/v1/auth`, `/v1/me` | `apps/api/modules/identity + access` | **นายกิติกร เทศธรรม** | นายนรงศักดิ์ ภูมิประเสริฐ | R1 |
| **Interview Session** | `interview` | `/v1/interviews` | `apps/api/modules/interview` | **นายจิรเมธ วงษ์กัณหา** | นายกิติกร เทศธรรม | R1 |
| **Evaluation Read Model** | `evaluation` | `/v1/evaluations`, `/v1/feedback` | `apps/api/modules/evaluation` | **นายจิรเมธ วงษ์กัณหา** | นายนรงศักดิ์ ภูมิประเสริฐ | R1 |
| **Background Worker** | `evaluation` | BullMQ Consumer | `apps/evaluation-worker` | **นายจิรเมธ วงษ์กัณหา** | นายนรงศักดิ์ ภูมิประเสริฐ | R1 |
| **Content & Question Bank** | `content` | `/v1/admin/content` | `apps/api/modules/content` | **นายกิติกร เทศธรรม** | นายณัฐพล กลิ่นจุ่น | R1 |
| **Privacy & PDPA** | `privacy` | `/v1/privacy` | `apps/api/modules/privacy` | **นายกิติกร เทศธรรม** | นายนรงศักดิ์, นายณัฐพล | R1 |
| **Platform Services** | `platform` | internal only | `apps/api/modules/platform` | **นายจิรเมธ วงษ์กัณหา** | นายกิติกร เทศธรรม | R1 |
| **AI Evaluation Engine** | No direct DB | `/internal/v1/evaluate` | `apps/ai-service` | **นายนรงศักดิ์ ภูมิประเสริฐ** | นายจิรเมธ วงษ์กัณหา | R1–R3 |
| **Responsive Web Client** | Web Local Storage | Web UI | `apps/web` | **นายสมหมาย สุภาวงค์** | นายกิติกร, นายจิรเมธ | R1–R3 |
| **Native Mobile Client** | Keychain/Keystore | Mobile UI | `apps/mobile` | **นายสมหมาย สุภาวงค์** | นายกิติกร, นายจิรเมธ | R2 |
| **Contracts & DTOs** | Schema Specs | OpenAPI / Events | `packages/contracts` | **นายนรงศักดิ์ ภูมิประเสริฐ** | นายกิติกร, นายสมหมาย | R1–R3 |
| **Design System & UI** | Figma / Tokens | React Components | `packages/ui` | **นายสมหมาย สุภาวงค์** | นายณัฐพล กลิ่นจุ่น | R1–R3 |
| **Database Core Prisma** | Postgres DDL | Migrations | `packages/db-core` | **นายกิติกร เทศธรรม** | นายจิรเมธ, นายนรงศักดิ์ | R1–R3 |
| **DevOps & Infrastructure**| K8s / Docker / CI | Cloud / Pipelines | `infra/`, `.github/` | **นายนรงศักดิ์ ภูมิประเสริฐ** | นายกิติกร, นายจิรเมธ | R1–R3 |
| **Testing & Quality Assurance**| Test Suites | QA Automation | `tests/` | **นายณัฐพล กลิ่นจุ่น** | สมาชิกทุกคน | R1–R3 |
| **Billing Service (R3)** | independent DB | `/v1/billing` | `apps/billing-service` | **นายกิติกร เทศธรรม** | นายนรงศักดิ์ ภูมิประเสริฐ | R3 |
| **Research Service (R3)**| independent DB | `/v1/research` | `apps/research-service` | **นายนรงศักดิ์ ภูมิประเสริฐ** | นายณัฐพล กลิ่นจุ่น | R3 |

---

## 4. Release Isolation and Deployment Gates

1. **R1 Core Release:** CI must build and deploy with zero billing/research dependencies. All R1 features run on Responsive Web with NestJS Core API, FastAPI AI Engine, PostgreSQL Core, and Redis/BullMQ.
2. **R2 AI & Mobile Release:** Features disabled without explicit architectural approval gate. Native mobile (`apps/mobile`) and voice processing pipelines are verified on staging before deployment.
3. **R3 Commercial & Research Release:** Services participate only via authenticated API/event interfaces. `billing-service` and `research-service` have dedicated databases, credentials, and independent lifecycle.
4. **Code Quality & PR Gate:**
   - Any pull request touching `apps/api` must be approved by **นายกิติกร** or **นายจิรเมธ** and **นายนรงศักดิ์ (Tech Lead)**.
   - Any pull request touching `apps/web` or `apps/mobile` must be approved by **นายสมหมาย (UX/UI Lead)**.
   - Any pull request touching `apps/ai-service` or `infra/` must be approved by **นายนรงศักดิ์ (Tech Lead)**.
   - All pull requests require green status from automated test suites curated by **นายณัฐพล (QA Lead)**.
