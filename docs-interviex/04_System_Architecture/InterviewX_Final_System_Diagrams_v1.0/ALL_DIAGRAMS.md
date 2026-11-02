# InterviewX — All Final System Diagrams

**Status: Proposed final design; pending stakeholder sign-off.**

## D01 SYSTEM CONTEXT

```mermaid
flowchart LR
  Guest([Guest]) --> Web[InterviewX Responsive Web / PWA]
  User([Registered User]) --> Web
  Admin([System Admin]) --> Web
  Researcher([Researcher R3]) --> Web
  Finance([Finance Admin R3]) --> Web
  Web --> Platform[InterviewX Platform]
  Platform --> Email[Transactional email provider]
  Platform --> LLM[LLM provider]
  Platform -. "R2 STT" .-> STT[Speech-to-text provider]
  Platform -. "R3 payments" .-> Gateway[Payment gateway]
  Platform --> Telemetry[Monitoring and alerting]
  classDef optional stroke-dasharray:5 5
  class Researcher,Finance,STT,Gateway optional
```

## D02 C4 CONTAINERS

```mermaid
flowchart TB
  Browser[Next.js Web / PWA R1] --> Edge[CDN / WAF / TLS]
  Edge --> API[NestJS Core API / BFF R1]
  subgraph Core[NestJS Modular Monolith R1]
    ID[Identity + RBAC]
    Content[Content + Rubric]
    Interview[Interview]
    Eval[Evaluation Read Model]
    Privacy[Privacy + Governance]
    Platform[Platform / Outbox / Audit]
  end
  API --> ID & Content & Interview & Eval & Privacy & Platform
  ID & Content & Interview & Eval & Privacy & Platform --> PG[(Core PostgreSQL: schema per context)]
  Platform --> Redis[(Redis / BullMQ)]
  Redis --> Worker[Evaluation Worker R1]
  Worker --> AI[FastAPI Inference R1]
  AI --> Provider[Hosted LLM provider]
  Worker --> PG
  API -. R2 .-> Store[(Private Audio Object Storage)]
  API -. R3 authenticated API .-> Billing[Billing Service R3]
  API -. R3 authenticated API .-> Research[Research Release Service R3]
  Billing --> BillingDB[(Billing PostgreSQL)]
  Research --> ResearchDB[(Research PostgreSQL)]
  Billing --> Gateway[Payment provider]
  classDef future stroke-dasharray:5 5
  class Store,Billing,BillingDB,Research,ResearchDB,Gateway future
```

## D03 BOUNDED CONTEXTS

```mermaid
flowchart LR
 subgraph CORE[Core NestJS - single deployable]
  Access[Identity / Access]

  Interview[Interview]
  Content[Content]
  Eval[Evaluation]
  Privacy[Privacy]
  Plat[Platform: idempotency / outbox / audit]
 end
 Client[Public API / BFF] --> Access & Interview & Eval & Privacy & Content
 Interview --> Content
 Interview --> Access
 Eval --> Interview
 Privacy --> Access
 Interview --> Plat
 Eval --> Plat
 Plat --> Worker[Worker deployable]
 Worker --> AI[AI FastAPI - no DB connection]
 Client -. "R3 contract" .-> Billing[Billing - own DB]
 Client -. "R3 contract" .-> Research[Research - own DB]
 Billing -. versioned events .-> Plat
 Privacy -. approved release channel R3 .-> Research
 note["Cross-context access via exported application contracts; no repository imports across owners"]
 note -. rule .-> CORE
```

## D04 CORE ERD

```mermaid
erDiagram
 USERS ||--o{ AUTH_IDENTITIES : owns
 USERS ||--o{ REFRESH_SESSIONS : refreshes
 USERS ||--o{ USER_ROLES : granted
 ROLES ||--o{ USER_ROLES : assigns
 ROLES ||--o{ ROLE_PERMISSIONS : includes
 PERMISSIONS ||--o{ ROLE_PERMISSIONS : defines
 USERS ||--o{ INTERVIEW_SESSIONS : starts
 RUBRIC_VERSIONS ||--o{ INTERVIEW_SESSIONS : pins
 AI_CONFIG_VERSIONS ||--o{ INTERVIEW_SESSIONS : pins
 INTERVIEW_SESSIONS ||--o{ SESSION_QUESTIONS : contains
 QUESTION_BANK o|--o{ SESSION_QUESTIONS : sources
 SESSION_QUESTIONS ||--o{ ANSWERS : receives
 ANSWERS ||--o| EVALUATION_JOBS : triggers
 EVALUATION_JOBS ||--o| FEEDBACK : produces
 ANSWERS ||--o| FEEDBACK : scored
 RUBRIC_VERSIONS ||--o{ FEEDBACK : rubric
 AI_CONFIG_VERSIONS ||--o{ FEEDBACK : model
 FEEDBACK ||--o{ APPEALS : disputed
 USERS ||--o{ CONSENT_EVENTS : grants
 USERS ||--o{ PROCESSING_NOTICES : notified
 USERS ||--o{ DATA_RIGHTS_REQUESTS : requests
 USERS ||--o{ CONTACT_DETAILS : contact
 ANSWERS ||--o{ AUDIO_OBJECTS : audio_R2
 ANSWERS ||--o| SPEECH_METRICS : speech_R2
 USERS ||--o{ IDEMPOTENCY_KEYS : dedupes
 USERS { uuid id PK
   citext email UK
   timestamptz deleted_at }
 INTERVIEW_SESSIONS { uuid id PK
   uuid user_id FK
   uuid rubric_version_id FK
   uuid ai_config_version_id FK }
 SESSION_QUESTIONS { uuid id PK
   uuid session_id FK
   int sequence_no }
 ANSWERS { uuid id PK
   uuid question_id FK
   int attempt_number }
 EVALUATION_JOBS { uuid id PK
   uuid answer_id FK
   text state }
 FEEDBACK { uuid id PK
   uuid job_id FK
   uuid answer_id FK
   numeric score }
 CONSENT_EVENTS { uuid id PK
   uuid user_id FK
   text purpose_key
   text action }
 IDEMPOTENCY_KEYS { text scope PK
   uuid actor_id PK
   text key PK }
```

## D05 R3 ERD

```mermaid
erDiagram
 PACKAGES ||--o{ PACKAGE_ENTITLEMENTS : defines
 PACKAGES ||--o{ SUBSCRIPTIONS : offers
 SUBSCRIPTIONS ||--o{ TRANSACTIONS : billed
 TRANSACTIONS ||--o{ REFUND_REQUESTS : refund
 DATASETS ||--o{ AGGREGATE_ROWS : includes
 DATASETS ||--o{ ACCESS_LOG : records
 PACKAGES { uuid id PK
   text tier
   int version
   bigint price_minor }
 PACKAGE_ENTITLEMENTS { uuid package_id PK,FK
   text feature_key PK
   bigint quota_limit }
 SUBSCRIPTIONS { uuid id PK
   uuid user_id "external Core ID"
   uuid package_id FK }
 USAGE_LEDGER { uuid id PK
   uuid user_id "external Core ID"
   text request_key UK }
 TRANSACTIONS { uuid id PK
   uuid subscription_id FK
   bigint amount_minor }
 PAYMENT_EVENTS { uuid id PK
   text provider
   text external_event_id UK }
 REFUND_REQUESTS { uuid id PK
   uuid transaction_id FK
   uuid user_id }
 DATASETS { uuid id PK
   text purpose_key
   text state }
 AGGREGATE_ROWS { uuid id PK
   uuid dataset_id FK
   int distinct_users
   boolean suppressed }
 ACCESS_LOG { uuid id PK
   uuid dataset_id FK
   text decision }
```

## D06 API TRUST

```mermaid
flowchart LR
 subgraph Untrusted[Public / Untrusted]
  Web[Next.js browser client]
  Mobile[Mobile future optional]
 end
 subgraph Edge[Public edge]
  WAF[CDN / WAF / TLS]
  API[Core NestJS REST /v1]
 end
 subgraph Internal[Private network]
  Redis[Redis / BullMQ]
  Worker[Eval Worker]
  AI[FastAPI /internal/v1/evaluate]
  PG[(Core Postgres)]
 end
 Web --> WAF
 Mobile -. R2/R3 .-> WAF
 WAF --> API
 API --> PG
 API --> Redis
 Redis --> Worker
 Worker --> PG
 Worker -->|authenticated + timeouts| AI
 AI -->|provider adapter| LLM[External LLM]
 API -. R3 only /v1/billing .-> Billing[Billing service]
 API -. R3 only /v1/research .-> Research[Research service]
 classDef future stroke-dasharray:5 5
 class Mobile,Billing,Research future
```

## D07 TEXT INTERVIEW SEQUENCE

```mermaid
sequenceDiagram
 autonumber
 actor U as User
 participant W as Web
 participant A as NestJS Interview API
 participant D as Core PostgreSQL
 participant O as Outbox dispatcher
 participant Q as Redis/BullMQ
 participant K as Evaluation Worker
 participant F as FastAPI AI
 participant L as LLM Provider
 U->>W: Submit text answer
 W->>A: POST /v1/interviews/{id}/answers
Idempotency-Key
 A->>A: Auth + ownership + state + content checks
 A->>D: BEGIN; insert answer, job, outbox, idempotency
 D-->>A: COMMIT
 A-->>W: 202 Accepted: jobId
 O->>D: Read undispatched outbox
 O->>Q: Enqueue stable event ID
 Q-->>O: Accepted
 O->>D: Mark dispatched
 Q->>K: Deliver at least once
 K->>K: Inbox/job-state deduplication
 K->>F: POST /internal/v1/evaluate with versions
 F->>L: Restricted provider call
 L-->>F: Untrusted candidate
 F->>F: Validate rubric, schema and evidence
 F-->>K: Validated feedback / needs-review
 K->>D: Atomic job transition + feedback result
 W->>A: GET /v1/evaluations/{jobId}
 A-->>W: pending / completed / failed / needs-review
```

## D08 EVAL STATES

```mermaid
stateDiagram-v2
 [*] --> pending : answer committed
 pending --> processing : worker claims
 processing --> completed : valid checked result
 processing --> retry_wait : transient error
 retry_wait --> processing : retry <= max attempts
 processing --> needs_review : invalid / weak evidence
 processing --> failed : permanent error / max attempts
 pending --> canceled : user deletion workflow
 retry_wait --> canceled : user deletion workflow
 completed --> [*]
 needs_review --> [*]
 failed --> [*]
 canceled --> [*]
 note right of completed
  Only validated rubric score
  Persist model / prompt / rubric version
 end note
 note right of needs_review
  Never fabricate numeric score
 end note
```

## D09 IDENTITY AUTHORIZATION

```mermaid
flowchart TD
 Request[Incoming request] --> Auth{Authenticated?}
 Auth -->|No| Public{Public endpoint?}
 Public -->|Yes| Allow[Allow public action]
 Public -->|No| Deny[401 / deny]
 Auth -->|Yes| Active{Account active and token valid?}
 Active -->|No| Deny
 Active -->|Yes| Role{Has permission?}
 Role -->|No| Forbidden[403 / deny]
 Role -->|Yes| Own{Ownership or scoped admin grant?}
 Own -->|No| Forbidden
 Own -->|Yes| Scope{Purpose and lawful basis / consent required?}
 Scope -->|Missing| Forbidden
 Scope -->|Satisfied or not applicable| Quota{Entitlement / quota required?}
 Quota -->|Exceeded| QuotaReject[Reject server side]
 Quota -->|Satisfied or not applicable| DB[Apply DB/storage defense-in-depth policy]
 DB --> Final[Execute + audit critical change]
 note["Free / Basic / Pro = package tiers, not RBAC roles"] -. rule .-> Role
```

## D10 PRIVACY LIFECYCLE

```mermaid
flowchart TB
 Notice[Versioned processing notice + lawful basis] --> Core[service_core processing R1]
 Notice --> Choices[Optional per-purpose consent event]
 Choices --> Analysis[research_analysis R3]
 Choices --> Contact[research_contact R3]
 Choices --> Voice[voice_retention R2]
 Choices --> Marketing[marketing future]
 Analysis --> Release[Eligible data release approval pipeline]
 Contact --> ContactService[Approved contact API]
 Voice --> AudioPolicy[Audio lifecycle + storage expiry]
 User[User] --> Request[Data-rights request R1]
 Request --> Verify[Verify identity / scope / exceptions]
 Verify --> Export[Export eligible personal data]
 Verify --> Erase[Delete active records + scheduled backup expiry]
 Erase --> Audit[Masked immutable audit event]
 Request --> Audit
 Choices --> Audit
 classDef future stroke-dasharray:5 5
 class Analysis,Contact,Voice,Marketing,Release,ContactService,AudioPolicy future
```

## D11 VOICE SEQUENCE R2

```mermaid
sequenceDiagram
 actor U as User
 participant W as Web
 participant A as NestJS Core
 participant S as Private object storage
 participant ST as STT adapter/provider
 participant D as PostgreSQL
 U->>W: Select voice mode (R2)
 W->>U: Microphone permission + separate retention choice
 U-->>W: Permission + opt in/out
 W->>A: Request signed upload session
 A->>D: Record purpose/version/time for retention choice
 A-->>W: Scoped temporary signed upload
 W->>S: Upload encrypted audio (short-lived)
 W->>A: Signal upload completed
 A->>ST: Transcribe with scoped object access
 ST-->>A: Transcript
 A-->>W: Editable transcript
 U->>W: Correct and submit transcript
 W->>A: POST text answer + idempotency key
 alt No retention opt-in
  A->>S: Schedule delete after processing (<=24h draft ceiling)
 else Explicit opt-in
  A->>S: Apply approved retention policy (<=90d draft)
 end
 Note over A,S: Release gate needs legal and privacy approval
```

## D12 PAYMENT SEQUENCE R3

```mermaid
sequenceDiagram
 actor U as User
 participant API as API / BFF
 participant B as Billing Service R3
 participant G as Payment Gateway
 participant DB as Billing PostgreSQL
 participant C as Core Entitlement Integration
 U->>API: Checkout selection
 API->>B: Authenticated checkout request
 B->>DB: Snapshot published package price
 B->>G: Create hosted payment session
 G-->>B: Hosted checkout reference
 B-->>U: Gateway hosted redirect
 G->>B: Signed webhook event
 B->>B: Verify authenticity + provider event ID
 B->>DB: Atomic inbox + state transition + outbox
 alt Confirmed, new valid payment
  B->>C: Versioned entitlement-granted event
  C-->>B: Deduplicated fulfillment ACK
 else Duplicate or pending
  B->>B: No duplicate fulfillment
 end
 U->>API: GET payment status
 API->>B: Fetch authorized status
 B-->>U: pending / confirmed / failed
 Note over B,DB: Refund needs request -> approval -> execution; rules not approved
```

## D13 RESEARCH RELEASE R3

```mermaid
flowchart TD
 Request[Researcher request R3] --> Gate{Purpose approval + role scope + valid basis?}
 Gate -->|No| Deny[Denied + audited]
 Gate -->|Yes| Pipeline[Privileged release pipeline]
 Source[(Core production data restricted)] --> Pipeline
 Pipeline --> Eligibility[Check research_analysis eligibility; no contact flag substitution]
 Eligibility --> Aggregate[Group + count distinct users]
 Aggregate --> Risk{Cell size >=10 and complementary / differencing checks?}
 Risk -->|No| Suppress[Suppress / revise release]
 Risk -->|Yes| Approve[Authorized release approval]
 Suppress --> Review[Human privacy review]
 Review --> Approve
 Approve --> Store[(Research DB approved aggregates)]
 Store --> API[Research scoped API]
 API --> Result[Aggregate only; never raw answers/audio]
 API --> Log[Audit allow/deny, purpose, dataset, query, row count]
 Deny --> Log
 classDef secure fill:#e2e8f0,stroke:#334155
 class Store secure
```

## D14 MANAGED PRODUCTION

```mermaid
flowchart TB
 Internet[Users] --> WAF[CDN + WAF + TLS]
 WAF --> WEB[Managed Next.js hosting]
 WEB --> API[Managed NestJS Core API]
 subgraph Private[Private production network]
  PG[(Managed Core PostgreSQL)]
  Redis[(Managed Redis)]
  Worker[Managed evaluation worker]
  AI[Private FastAPI inference]
  Buck[(Private object storage R2)]
 end
 API --> PG & Redis
 API -. R2 .-> Buck
 Redis --> Worker
 Worker --> PG & AI
 AI --> Provider[LLM provider]
 API --> Otel[Logs / metrics / traces]
 Worker --> Otel
 AI --> Otel
 Secrets[Production secret manager] -. restricted credentials .-> API & Worker & AI
 Backup[Backup + restore policy] --> PG
 API -. R3 authenticated call .-> Billing[Billing deployable + separate DB]
 API -. R3 authenticated call .-> Research[Research deployable + separate DB]
 classDef future stroke-dasharray:5 5
 class Buck,Billing,Research future
```

## D15 KUBERNETES SHOWCASE

```mermaid
flowchart TB
 Demo[Synthetic demo users / load] --> Ingress[Ingress + TLS]
 subgraph Cluster[Kubernetes SHOWCASE sandbox - NO production data]
  Ingress --> Web[Web Deployment]
  Ingress --> API[Core API Deployment]
  API --> PG[(Synthetic PostgreSQL)]
  API --> Redis[(Sandbox Redis)]
  Redis --> Worker[Worker Deployment]
  Worker --> PG
  Worker --> AI[FastAPI Deployment]
  AI --> Stub[LLM stub / sandbox provider]
  HPA[HPA CPU / queue metric when installed] -. scale .-> API & Worker
  OTel[OpenTelemetry Collector] --> Metrics[Grafana + metrics/traces]
  API --> OTel
  Worker --> OTel
  AI --> OTel
 end
 GitOps[Argo CD - app resources] -. reconciles .-> Cluster
 IaC[Terraform - cluster/network/infra] -. provisions .-> Cluster
 Source[(Production accounts / secrets / backups)] -. X NEVER CONNECT .-> Cluster
```

## D16 CI CD

```mermaid
flowchart TB
 Commit[Git SHA] --> CI[GitHub Actions: lint / unit / contract / security]
 CI --> Test[Integration / migrations / AI eval / image scanning]
 Test --> Build[Build images once + SBOM + sign]
 Build --> Registry[(OCI registry: immutable digest)]
 Registry --> Staging[Managed staging]
 Staging --> Gate{QA / approval gate}
 Gate -->|Approved| Prod[Managed production uses same digest]
 Gate -->|Rejected| Stop[Fix + new commit]
 Registry --> GitOpsPR[Showcase GitOps PR pinned to same digest]
 GitOpsPR --> Argo[Argo CD sync]
 Argo --> Demo[Kubernetes synthetic showcase]
 Prod --> Real[(Real personal production data)]
 Demo --> Fake[(Synthetic data only)]
 Real -. never copied .-> Fake
```

## D17 OBSERVABILITY RECOVERY

```mermaid
flowchart LR
 Web[Web] --> Trace[Correlation ID]
 API[NestJS API] --> OTel[OpenTelemetry]
 Worker[Evaluation worker] --> OTel
 AI[FastAPI] --> OTel
 Trace --> OTel
 OTel --> Logs[Sanitized logs]
 OTel --> Metrics[Latency / errors / queue depth / cost]
 OTel --> Traces[Distributed traces]
 Metrics --> Alerts[Alerts + incident runbooks]
 Logs --> Alerts
 PG[(Managed PG)] --> Backups[Encrypted backups]
 Backups --> Restore[Quarterly restore drill - proposed]
 Alerts --> Oncall[Team response]
 Cost[LLM token usage + budgets] --> Metrics
 Note["SRS proposed: non-AI P95 <=2s; text feedback P95 <=15s; RPO <=24h; RTO <=8h; availability >=99.5% - NOT measured"] -. target .-> Metrics
```

## D18 REPO BOUNDARIES

```mermaid
flowchart TB
 subgraph Apps[apps]
  Web[web Next.js]
  API[api NestJS modular monolith]
  Worker[evaluation-worker]
  AI[ai-service FastAPI]
  Billing[billing-service R3]
  Research[research-service R3]
 end
 subgraph Packages[packages]
  Contracts[contracts OpenAPI / events / generated]
  CoreDB[db-core Prisma + migrations]
  BillingDB[db-billing R3]
  ResearchDB[db-research R3]
  Obs[observability]
  UI[ui]
 end
 Web --> Contracts & UI
 API --> Contracts & CoreDB & Obs
 Worker --> Contracts & CoreDB & Obs
 AI --> Contracts
 Billing --> Contracts & BillingDB
 Research --> Contracts & ResearchDB
 Infra[infra Terraform / managed / k8s / Argo] --> Apps
 Tests[tests architecture / contract / integration / security / AI eval] --> Contracts
 Rule["NO: cross-owner Prisma imports or AI direct DB access"] -. enforce .-> Tests
```

## D19 RELEASE ROADMAP

```mermaid
flowchart LR
 R1["R1 CORE
Web/PWA, identity, interview text, AI rubric, feedback, history, privacy, audit"] --> R2["R2 ENHANCED
Voice/STT, speech metrics, grammar, progress, adaptive features"]
 R2 --> R3["R3 COMMERCIAL + RESEARCH
Plans/quotas, gateway/refunds, governed research releases"]
 R1 --> Production[Managed Production]
 R1 --> Showcase[Kubernetes synthetic showcase]
 R2 -. approval gate .-> Production
 R3 -. approval gate .-> Production
 Note["R1 does not depend on R2/R3 runtime. Native mobile remains optional extension."] -. rule .-> R1
```
