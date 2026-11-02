# InterviewX Architecture Diagrams v1.0

Status: Proposed architecture. Source requirements: InterviewX SRS Final for Approval v1.0 (08 October 2026; pending stakeholder sign-off). Mermaid diagrams are logical plans, not deployed systems.

## 1. C4-style Container View

```mermaid
flowchart TB
  User([User]) --> Web[Next.js Responsive Web / PWA]
  User --> Mobile[React Native + Expo — optional R2/R3]
  Web --> Edge[CDN / WAF / TLS]
  Mobile --> Edge
  Edge --> API[NestJS Core API / BFF]
  subgraph Core[NestJS Modular Monolith]
    Identity[Identity + RBAC]
    Interview[Interview Sessions]
    Feedback[Feedback Read Model]
    Privacy[Privacy + Admin]
  end
  API --> Identity
  API --> Interview
  API --> Feedback
  API --> Privacy
  Interview --> PG[(PostgreSQL — Core)]
  Interview --> Outbox[(Transactional Outbox)]
  Outbox --> Q[Redis / BullMQ]
  Q --> Worker[NestJS Eval Worker]
  Worker --> AI[FastAPI AI Service]
  AI --> LLM[LLM Provider]
  Worker --> PG
  API --> Store[(Private Object Storage — optional R2)]
  API -. R3 .-> Billing[NestJS Billing Service]
  Billing --> Pay[Payment Gateway]
  API -. R3 .-> Research[Research Release Service]
  Research --> Approved[(Approved Aggregates)]
```

## 2. Managed Production Deployment

```mermaid
flowchart TB
  Internet[Public Internet] --> CDN[CDN / WAF]
  CDN --> WEB[Managed Next.js Hosting]
  WEB --> API[Managed NestJS API]
  API --> PG[(Managed PostgreSQL — Private)]
  API --> REDIS[(Managed Redis — Private)]
  REDIS --> Worker[Managed Background Worker]
  Worker --> AI[Private FastAPI AI Container]
  AI --> Model[External LLM Provider]
  API --> Storage[(Private Object Storage)]
  API --> Telemetry[Managed Logs, Metrics, Traces]
  Worker --> Telemetry
  AI --> Telemetry
  Secrets[Production Secret Manager] -. scoped secrets .-> API
  Secrets -. scoped secrets .-> Worker
  Secrets -. scoped secrets .-> AI
```

## 3. Kubernetes Showcase Deployment

```mermaid
flowchart TB
  Demo[Demo Users / Synthetic Traffic] --> Ingress[Ingress Controller]
  Ingress --> WEB[Web Deployment]
  Ingress --> API[NestJS API Deployment]
  API --> Redis[(Sandbox Redis)]
  API --> PG[(Synthetic Sandbox PostgreSQL)]
  Redis --> Work[Worker Deployment]
  Work --> AI[FastAPI Deployment]
  AI --> LLM[LLM Sandbox / Stub Provider]
  HPA[HPA: CPU / Queue Metrics] -. scale .-> API
  HPA -. scale .-> Work
  Argo[Argo CD GitOps Controller] -. desired state .-> WEB
  Argo -. desired state .-> API
  Argo -. desired state .-> Work
  Argo -. desired state .-> AI
  OTEL[OTel Collector] --> Grafana[Grafana / Metrics / Traces]
  API --> OTEL
  Work --> OTEL
  AI --> OTEL
```

## 4. Shared Image Promotion and Independent State

```mermaid
flowchart LR
  Git[Git Commit SHA] --> CI[GitHub Actions: Test / Scan / Build]
  CI --> Registry[(OCI Registry: immutable digest)]
  Registry --> Stage[Managed Staging]
  Stage --> Gate{QA + approval}
  Gate -->|Approved| Prod[Managed Production]
  Registry --> GitOps[GitOps Manifest PR: same digest]
  GitOps --> Argo[Argo CD]
  Argo --> K8s[Kubernetes Showcase]
  Prod --> Real[(Production personal data)]
  K8s --> Fake[(Synthetic data only)]
```

## 5. Interview Evaluation Sequence

```mermaid
sequenceDiagram
  participant C as Client
  participant A as NestJS API
  participant D as PostgreSQL
  participant Q as BullMQ
  participant W as Worker
  participant F as FastAPI
  participant L as LLM
  C->>A: POST answer + Idempotency-Key
  A->>D: Transaction: answer + evaluation job + outbox
  A-->>C: 202 Accepted + job ID
  A->>Q: Dispatch outbox event (retry until accepted)
  Q->>W: evaluation requested
  W->>F: Evaluate using rubric and prompt versions
  F->>L: Provider request (timeout and budget)
  L-->>F: Model output
  F-->>W: Validated structured result / needs-review
  W->>D: Atomic deduplicated result transition
  C->>A: GET evaluation status
  A-->>C: Pending or completed feedback
```

## 6. Mandatory environment invariants

- Distinct accounts/projects, network boundaries, credentials, databases, buckets and domains.
- No production data, session tokens, raw audio, or production DB snapshots in Kubernetes showcase.
- Build once, promote the exact signed/scanned image digest; app configuration differs by environment.
- Terraform manages infrastructure; Argo CD manages Kubernetes applications; avoid two controllers for the same object.
- R1 has no R3 billing/research runtime dependencies.
