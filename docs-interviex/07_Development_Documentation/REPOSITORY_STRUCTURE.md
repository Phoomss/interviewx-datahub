# InterviewX Monorepo — service-boundary-aligned

```text
interviewx/
├── apps/
│   ├── web/                         # Next.js TS PWA; generated public API client
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
│   ├── ui/                         # shared presentational React components
│   └── testing/                    # fixtures + contract tests
├── infra/
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

## Dependency direction

`controller -> application/use-case -> domain` and `infrastructure -> domain ports`. Controllers cannot import another domain's Prisma adapter/repository; they call its exported application service. `packages/contracts` contains transport DTOs and versioned events, **not** domain entities or ORM models. Python AI service is HTTP-only and never imports/queries Core DB. Web must not contain provider API keys.

## Boundaries and paths

| Bounded context | Core schema/database | Public API prefix | Code owner | Release |
|---|---|---|---|---|
| identity/access | identity | /v1/auth, /v1/me | apps/api/modules/identity + access | R1 |
| interview | interview | /v1/interviews | apps/api/modules/interview | R1 |
| evaluation | evaluation | /v1/evaluations, /v1/feedback | apps/api/modules/evaluation + worker | R1 |
| content | content | /v1/admin/content | apps/api/modules/content | R1 |
| privacy | privacy | /v1/privacy | apps/api/modules/privacy | R1 |
| platform | platform | internal only | apps/api/modules/platform | R1 |
| inference | no database | /internal/v1/evaluate | apps/ai-service | R1 |
| billing | independent DB | /v1/billing | apps/billing-service | R3 |
| research | independent DB | /v1/research | apps/research-service | R3 |

## Release isolation / deployment

R1 CI must build and deploy with no billing/research dependencies. R2 features disabled without explicit approval and deployment gate. R3 services participate only via authenticated API/event interfaces. Managed prod and Kubernetes showcase use the exact signed OCI digest of each service but different service accounts, secret managers, project/network and synthetic-only databases. Terraform owns infrastructure; Argo CD owns K8s application manifests only.
