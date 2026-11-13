# InterviewX — All Final System Diagrams
**Version: 1.1 DRAFT — Phase 1: Requirement & Platform Alignment**  
**Date: 13 November 2026**  
**Status: Proposed architecture revision; pending stakeholder sign-off.**

> [!NOTE]
> **Phase 1 Platform Scope Alignment Notice**  
> This draft revision explicitly separates the two client application frontends:
> 1. **Web Application**: Responsive Web (Desktop, Tablet, Mobile Browser) supporting End Users and Administrative/Research roles.
> 2. **Native Mobile Application**: Separately installable iOS and Android applications dedicated exclusively to End Users (Guest, Registered User).
> Both frontends communicate with the unified, shared backend via authenticated HTTPS REST APIs. All administrative and research capabilities remain strictly restricted to the Web Application.

---

## D01 SYSTEM CONTEXT

```mermaid
flowchart LR
  subgraph EndUsers["End Users (Candidates)"]
    Guest([Guest])
    User([Registered User])
  end

  subgraph InternalRoles["Internal & Research Roles"]
    Admin([System Admin])
    Researcher([Researcher R3])
    Finance([Finance Admin R3])
  end

  subgraph ClientFrontends["Client Application Frontends"]
    Web["InterviewX Responsive Web App\n(Desktop / Tablet / Mobile Browser)"]
    Mobile["InterviewX Native Mobile App\n(iOS & Android - End Users Only)"]
  end

  Guest --> Web
  Guest --> Mobile
  User --> Web
  User --> Mobile

  Admin --> Web
  Researcher --> Web
  Finance --> Web

  Web --> Platform["InterviewX Shared Backend Platform\n(NestJS Modular Monolith + AI Service)"]
  Mobile --> Platform

  Platform --> Email["Transactional email provider"]
  Platform --> LLM["Hosted LLM provider"]
  Platform -. "R2 STT" .-> STT["Speech-to-text provider"]
  Platform -. "R3 payments" .-> Gateway["Payment gateway"]
  Platform --> Telemetry["Monitoring and alerting"]

  classDef optional stroke-dasharray:5 5
  class Researcher,Finance,STT,Gateway optional
```

---

## D02 C4 CONTAINERS

```mermaid
flowchart TB
  subgraph Clients["Client Frontends (Untrusted)"]
    Browser["Next.js Responsive Web App\n(Desktop / Tablet / Mobile Browser)"]
    Mobile["Native Mobile App\n(iOS & Android - End Users Only)"]
  end

  Edge["CDN / WAF / Reverse Proxy / TLS"]
  Browser --> Edge
  Mobile --> Edge

  Edge --> API["NestJS Core API / BFF (Shared Backend)"]

  subgraph Core["NestJS Modular Monolith (Shared Core)"]
    ID["Identity + RBAC + Entitlement Gate"]
    Content["Content + Rubric Engine"]
    Interview["Interview Session Context"]
    Eval["Evaluation Read Model"]
    Privacy["Privacy + Data Governance"]
    PlatformModule["Platform / Outbox / Idempotency / Audit"]
  end

  API --> ID & Content & Interview & Eval & Privacy & PlatformModule
  ID & Content & Interview & Eval & Privacy & PlatformModule --> PG[("Core PostgreSQL:\nschema per bounded context")]

  PlatformModule --> Redis[("Redis / BullMQ")]
  Redis --> Worker["Evaluation Worker"]
  Worker --> AI["FastAPI AI Inference Service"]
  AI --> Provider["Hosted LLM Provider (External)"]
  Worker --> PG

  API -. "R2 Voice Uploads" .-> Store[("Private Audio Object Storage\n(MinIO / S3)")]
  API -. "R3 authenticated API" .-> Billing["Billing Service R3"]
  API -. "R3 authenticated API" .-> Research["Research Release Service R3\n(Web Only Access)"]

  Billing --> BillingDB[("Billing PostgreSQL")]
  Research --> ResearchDB[("Research PostgreSQL")]
  Billing --> Gateway["Payment Provider"]

  classDef future stroke-dasharray:5 5
  class Store,Billing,BillingDB,Research,ResearchDB,Gateway future
```

---

## D03 BOUNDED CONTEXTS

```mermaid
flowchart LR
 subgraph CORE["Core NestJS - single deployable (Shared Backend)"]
  Access["Identity / Access / RBAC"]
  Interview["Interview"]
  Content["Content"]
  Eval["Evaluation"]
  Privacy["Privacy"]
  Plat["Platform: idempotency / outbox / audit"]
 end

 ClientFrontends["Client Frontends\n(Responsive Web & Native Mobile)"] --> API["Public API Gateway / BFF"]
 API --> Access & Interview & Eval & Privacy & Content
 Interview --> Content
 Interview --> Access
 Eval --> Interview
 Privacy --> Access
 Interview --> Plat
 Eval --> Plat
 Plat --> Worker["Worker deployable"]
 Worker --> AI["AI FastAPI - no DB connection"]
 API -. "R3 contract" .-> Billing["Billing - own DB"]
 API -. "R3 contract (Web Only)" .-> Research["Research - own DB"]
 Billing -. "versioned events" .-> Plat
 Privacy -. "approved release channel R3" .-> Research
 note["Cross-context access via exported application contracts; no repository imports across owners. Role & Platform boundaries enforced at Gateway."]
 note -. rule .-> CORE
```

---

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

 USERS {
   uuid id PK
   citext email UK
   text display_name
   text current_status
   text skill_level
   timestamptz created_at
   timestamptz deleted_at
 }
 REFRESH_SESSIONS {
   uuid id PK
   uuid user_id FK
   text client_platform "web | ios | android"
   text user_agent
   text token_hash UK
   timestamptz expires_at
 }
 INTERVIEW_SESSIONS {
   uuid id PK
   uuid user_id FK
   text interview_type
   text mode "text | voice | mixed"
   text difficulty
   text client_platform "web | ios | android"
   uuid rubric_version_id FK
   uuid ai_config_version_id FK
   text status
   timestamptz started_at
   timestamptz completed_at
 }
 SESSION_QUESTIONS {
   uuid id PK
   uuid session_id FK
   uuid question_bank_id FK
   text question_text
   int sequence_no
 }
 ANSWERS {
   uuid id PK
   uuid question_id FK
   text answer_type "text | voice"
   text answer_text
   int attempt_number
   timestamptz answered_at
 }
 EVALUATION_JOBS {
   uuid id PK
   uuid answer_id FK
   text state "pending | processing | completed | retry_wait | needs_review | failed | canceled"
   int retry_count
 }
 FEEDBACK {
   uuid id PK
   uuid job_id FK
   uuid answer_id FK
   numeric score
   jsonb dimension_scores
   jsonb evidence
   text comments
   text status
   timestamptz created_at
 }
 CONSENT_EVENTS {
   uuid id PK
   uuid user_id FK
   text purpose_key
   text action "grant | revoke"
   text notice_version
   text legal_basis
   timestamptz occurred_at
 }
 IDEMPOTENCY_KEYS {
   text scope PK
   uuid actor_id PK
   text key PK
   timestamptz created_at
 }
```

---

## D05 R3 ERD

```mermaid
erDiagram
 PACKAGES ||--o{ PACKAGE_ENTITLEMENTS : defines
 PACKAGES ||--o{ SUBSCRIPTIONS : offers
 SUBSCRIPTIONS ||--o{ TRANSACTIONS : billed
 TRANSACTIONS ||--o{ REFUND_REQUESTS : refund
 DATASETS ||--o{ AGGREGATE_ROWS : includes
 DATASETS ||--o{ ACCESS_LOG : records

 PACKAGES {
   uuid id PK
   text tier "Free | Basic | Pro"
   int version
   bigint price_minor
   text currency
   int duration_days
   boolean active
 }
 PACKAGE_ENTITLEMENTS {
   uuid package_id PK,FK
   text feature_key PK
   bigint quota_limit
   text unit
 }
 SUBSCRIPTIONS {
   uuid id PK
   uuid user_id "external Core ID"
   uuid package_id FK
   text status
   boolean auto_renew
   timestamptz starts_at
   timestamptz ends_at
 }
 USAGE_LEDGER {
   uuid id PK
   uuid user_id "external Core ID"
   text feature_key
   int amount
   text period_key
   text request_key UK
   timestamptz created_at
 }
 TRANSACTIONS {
   uuid id PK
   uuid subscription_id FK
   text gateway_ref
   bigint amount_minor
   text currency
   text status
   text channel "web_checkout | ios_iap | android_play"
   timestamptz paid_at
 }
 PAYMENT_EVENTS {
   uuid id PK
   text provider "omise | 2c2p | apple_iap | google_play"
   text external_event_id UK
   text status
   timestamptz received_at
 }
 REFUND_REQUESTS {
   uuid id PK
   uuid transaction_id FK
   uuid user_id
   text status "requested | approved | rejected | refunded"
   text policy_version
   timestamptz requested_at
   uuid decided_by FK
 }
 DATASETS {
   uuid id PK
   text purpose_key
   text schema_version
   text state
   uuid approved_by FK
 }
 AGGREGATE_ROWS {
   uuid id PK
   uuid dataset_id FK
   int distinct_users
   boolean suppressed
 }
 ACCESS_LOG {
   uuid id PK
   uuid dataset_id FK
   uuid researcher_id FK
   text decision
   int records_returned
   timestamptz accessed_at
 }
```

---

## D06 API TRUST

```mermaid
flowchart LR
 subgraph UntrustedClients["Untrusted Client Frontends"]
  Web["Responsive Web Client\n(Desktop / Tablet / Mobile Browser)"]
  Mobile["Native Mobile Client\n(iOS & Android - End Users Only)"]
 end

 subgraph PublicEdge["Public Edge & Ingress"]
  WAF["CDN / WAF / TLS Termination"]
  Gateway["API Gateway / NestJS Core REST /v1"]
  RBACGate{"Platform & RBAC Gate\n(Admin/Research blocked for Mobile)"}
 end

 subgraph PrivateNetwork["Private Network"]
  Redis[("Redis / BullMQ")]
  Worker["Eval Worker"]
  AI["FastAPI /internal/v1/evaluate"]
  PG[("Core PostgreSQL")]
 end

 Web --> WAF
 Mobile --> WAF
 WAF --> Gateway
 Gateway --> RBACGate

 RBACGate -->|Authorized Core Requests| PG
 RBACGate -->|Enqueue Jobs| Redis
 Redis --> Worker
 Worker --> PG
 Worker -->|authenticated + timeouts| AI
 AI -->|provider adapter| LLM["External Hosted LLM"]

 RBACGate -. "R3 Billing (Web & Mobile)" .-> Billing["Billing service"]
 RBACGate -. "R3 Research (WEB ONLY)" .-> Research["Research service"]

 classDef future stroke-dasharray:5 5
 class Billing,Research future
```

---

## D07 TEXT INTERVIEW SEQUENCE

```mermaid
sequenceDiagram
 autonumber
 actor U as User (Web or Mobile)
 participant C as Client App (Web / Native Mobile)
 participant A as NestJS Interview API (Shared Backend)
 participant D as Core PostgreSQL
 participant O as Outbox Dispatcher
 participant Q as Redis / BullMQ
 participant K as Evaluation Worker
 participant F as FastAPI AI Service
 participant L as External LLM Provider

 U->>C: Submit text answer
 C->>A: POST /v1/interviews/{id}/answers (Idempotency-Key: UUID)
 A->>A: Auth token + ownership + session state + entitlement check
 A->>D: BEGIN; insert answer, eval_job(pending), outbox_event, idempotency_key
 D-->>A: COMMIT
 A-->>C: 202 Accepted { jobId, status: "pending" }
 
 O->>D: Poll undispatched outbox events
 O->>Q: Enqueue evaluation event with stable event ID
 Q-->>O: ACK
 O->>D: Mark outbox event dispatched
 
 Q->>K: Deliver job to Evaluation Worker (at least once)
 K->>K: Inbox deduplication check
 K->>F: POST /internal/v1/evaluate (payload, rubric_version, model_version)
 F->>L: Invoke LLM provider via restricted adapter
 L-->>F: Raw candidate response
 F->>F: Validate structured JSON schema, rubric bounds, and evidence citations
 F-->>K: Return validated feedback / needs-review status
 K->>D: Atomic job state transition (completed) + persist feedback
 
 loop Async Status Polling (or WebSocket / Push)
   C->>A: GET /v1/evaluations/{jobId}
   A-->>C: Return state: pending | completed | failed | needs_review
 end
 C->>U: Render feedback score, strengths, improvements & rubric details
```

---

## D08 EVAL STATES

```mermaid
stateDiagram-v2
 [*] --> pending : answer committed
 pending --> processing : worker claims job
 processing --> completed : valid checked result
 processing --> retry_wait : transient error / timeout
 retry_wait --> processing : retry <= max attempts
 processing --> needs_review : invalid schema / weak evidence citation
 processing --> failed : permanent error / max retries exceeded
 pending --> canceled : user deletion workflow (DSR)
 retry_wait --> canceled : user deletion workflow (DSR)
 completed --> [*]
 needs_review --> [*]
 failed --> [*]
 canceled --> [*]

 note right of completed
  Only validated rubric score persisted
  Persist model, prompt, and rubric version IDs
 end note
 note right of needs_review
  Never fabricate numeric score
  Flag for human review / fallback
 end note
```

---

## D09 IDENTITY AUTHORIZATION

```mermaid
flowchart TD
 Request["Incoming Request (Web or Mobile)"] --> Auth{"Authenticated?"}
 Auth -->|No| Public{"Public Endpoint?"}
 Public -->|Yes| Allow["Allow Public Action\n(Landing, Onboarding, Catalog)"]
 Public -->|No| Deny["401 Unauthorized"]

 Auth -->|Yes| Active{"Account Active & Token Valid?"}
 Active -->|No| Deny

 Active -->|Yes| PlatCheck{"Platform Allowed for Endpoint?\n(Admin/Research on Web Only)"}
 PlatCheck -->|Violated| PlatformDeny["403 Forbidden\n(Administrative/Research blocked on Mobile)"]

 PlatCheck -->|Allowed| Role{"Has Required Role Permission?"}
 Role -->|No| Forbidden["403 Forbidden"]

 Role -->|Yes| Own{"Resource Ownership or Scoped Admin Grant?"}
 Own -->|No| Forbidden

 Own -->|Yes| Scope{"Purpose & Lawful Basis / Consent Satisfied?"}
 Scope -->|Missing| Forbidden

 Scope -->|Satisfied| Quota{"Entitlement / Quota Required?"}
 Quota -->|Exceeded| QuotaReject["402 / 429 Quota Exceeded\n(Server-side atomic check)"]

 Quota -->|Satisfied| DB["Apply Database Defense-in-Depth / RLS"]
 DB --> Final["Execute Action + Append Masked Audit Log"]

 note["Free / Basic / Pro = package tiers, not RBAC roles"] -. rule .-> Role
 note2["Platform does not grant role; backend strictly validates token"] -. rule .-> PlatCheck
```

---

## D10 PRIVACY LIFECYCLE

```mermaid
flowchart TB
 Notice["Versioned Processing Notice + Lawful Basis"] --> Core["service_core processing R1\n(Mandatory for service delivery)"]
 Notice --> Choices["Optional Per-Purpose Consent Event\n(Synced across Web and Mobile)"]
 Choices --> Analysis["research_analysis R3"]
 Choices --> Contact["research_contact R3"]
 Choices --> Voice["voice_retention R2"]
 Choices --> Marketing["marketing future"]

 Analysis --> Release["Eligible Data Release Approval Pipeline\n(Strictly Web / Admin Portal)"]
 Contact --> ContactService["Approved Contact API\n(Dedicated Purpose-Scoped Service)"]
 Voice --> AudioPolicy["Audio Lifecycle + Storage Expiry\n(<=24h default; <=90d opt-in; mobile cache purge)"]

 User["User (Web / Native Mobile)"] --> Request["Data-Rights Request R1 (FR35)"]
 Request --> Verify["Verify Identity / Scope / Legal Exceptions"]
 Verify --> Export["Export Eligible Personal Data (JSON/CSV)"]
 Verify --> Erase["Delete Active Records + Scheduled Backup Lifecycle"]

 Erase --> Audit["Masked Immutable Audit Event"]
 Request --> Audit
 Choices --> Audit

 classDef future stroke-dasharray:5 5
 class Analysis,Contact,Voice,Marketing,Release,ContactService,AudioPolicy future
```

---

## D11 VOICE SEQUENCE R2

```mermaid
sequenceDiagram
 autonumber
 actor U as User (Web or Mobile)
 participant C as Web / Native Mobile Client
 participant A as NestJS Core API (Shared Backend)
 participant S as Private Object Storage (MinIO / S3)
 participant ST as STT Provider / Adapter
 participant D as PostgreSQL

 U->>C: Select Voice Practice Mode (R2)
 C->>U: Request microphone permission + present voice-retention opt-in (FR05.1)
 U-->>C: Grant permission + opt-in/opt-out choice
 C->>A: POST /v1/interviews/{id}/voice-session (record retention choice)
 A->>D: Record consent event (occurred_at, purpose_key: voice_retention)
 A-->>C: Return short-lived signed upload URL (PUT)
 
 Note over C,S: Web: Web Audio API | Mobile: Native Audio Bridge (iOS/Android)
 C->>S: Direct encrypted upload of audio chunk (short-lived)
 C->>A: POST /v1/interviews/{id}/voice-complete { storageKey }
 
 A->>ST: Send scoped audio reference for speech-to-text
 ST-->>A: Return transcribed text
 A-->>C: Deliver editable transcript to user
 
 U->>C: Review, edit transcript if needed, and confirm submission
 C->>A: POST /v1/interviews/{id}/answers (with transcript + Idempotency-Key)
 
 alt User opted out of voice retention
   A->>S: Schedule hard purge of raw audio after processing (<=24h hard cap)
 else Explicit opt-in granted
   A->>S: Apply approved retention lifecycle (<=90d draft)
 end
 
 Note over C: Mobile: Purge local transient audio cache immediately upon upload
```

---

## D12 PAYMENT SEQUENCE R3

```mermaid
sequenceDiagram
 autonumber
 actor U as User
 participant C as Client App (Web / Native Mobile)
 participant API as API Gateway / BFF
 participant B as Billing Service R3
 participant G as Payment Gateway / Mobile Store
 participant DB as Billing PostgreSQL
 participant Core as Core Entitlement Integration

 U->>C: Select Subscription Plan (Basic / Pro)
 C->>API: Checkout request
 API->>B: Authenticated checkout request
 B->>DB: Snapshot published package price and version
 
 alt Web Checkout
   B->>G: Create hosted payment session
   G-->>B: Return hosted checkout redirect URL
   B-->>C: Deliver redirect URL
   C-->>U: Present hosted gateway payment page
 else Mobile Purchase (Subject to Decision D-M04)
   Note over C,G: Pending D-M04: In-App Purchase (StoreKit/Play) vs Web Checkout Redirect
 end
 
 G->>B: POST signed webhook event (confirmed charge)
 B->>B: Verify HMAC signature + idempotency (provider_event_id)
 B->>DB: Atomic transition: payment_event, transaction, update subscription
 
 alt Valid Confirmed Payment
   B->>Core: Emit versioned entitlement_granted event
   Core->>Core: Update USAGE_LEDGER atomically
   Core-->>B: Fulfillment ACK
 else Duplicate or Unverified Event
   B->>B: Reject / ignore duplicate fulfillment
 end
 
 C->>API: GET /v1/subscriptions/current
 API->>B: Fetch authoritative entitlement status
 B-->>C: Return active subscription tier and refreshed quotas
```

---

## D13 RESEARCH RELEASE R3

```mermaid
flowchart TD
 Request["Researcher Request R3\n(STRICTLY VIA WEB PORTAL)"] --> Gate{"Purpose Approval + Role Scope + Valid Lawful Basis?"}
 Gate -->|No| Deny["403 Denied + Append Immutable Audit Log"]
 Gate -->|Yes| Pipeline["Privileged Data Release Pipeline\n(Isolated Privileged Service)"]

 Source[("Core Production Database\n(Strictly Restricted)")] --> Pipeline
 Pipeline --> Eligibility["Verify research_analysis Purpose Eligibility\n(Do NOT confuse with contact opt-in)"]
 Eligibility --> Aggregate["Group by Category/Difficulty + Count Distinct Users"]
 Aggregate --> Risk{"Cell Size >= 10 Distinct Users\n& Differencing Suppression Checks?"}

 Risk -->|Failed| Suppress["Suppress Cell / Reject Automated Release"]
 Risk -->|Passed| Approve["Authorized Release Approval"]

 Suppress --> Review["Human Privacy Officer Review\n(Strictly Web Portal)"]
 Review --> Approve

 Approve --> Store[("Research DB Approved Aggregates\n(Isolated Schema)")]
 Store --> API["Research Scoped REST API\n(WEB ONLY)"]
 API --> Result["Deliver Aggregated Statistics Only\n(Never Raw Transcripts or Audio)"]

 API --> Log["Audit Log: Researcher ID, Query Hash, Cell Counts, Timestamp"]
 Deny --> Log

 classDef secure fill:#e2e8f0,stroke:#334155
 class Store secure
```

---

## D14 MANAGED PRODUCTION

```mermaid
flowchart TB
 subgraph InternetUsers["Public Internet Users"]
  WebUsers["Web Users\n(Desktop / Tablet / Mobile Browser)"]
  MobileUsers["Native Mobile Users\n(Apple iOS & Google Android)"]
 end

 WAF["CDN + Cloudflare / AWS WAF + TLS 1.3 Termination"]
 WebUsers --> WAF
 MobileUsers --> WAF

 WAF --> WEBHOST["Managed Next.js Web Hosting\n(Vercel / Cloud Run)"]
 WAF --> API["Managed NestJS Core API Gateway\n(Modular Monolith Cluster)"]

 subgraph PrivateProd["Private Production Network (VPC / Private Subnet)"]
  PG[("Managed Core PostgreSQL\n(Multi-AZ Primary + Read Replica)")]
  Redis[("Managed Redis Cluster\n(BullMQ Evaluator Queue)")]
  Worker["Managed Evaluation Workers"]
  AI["Private FastAPI Inference Service\n(No Direct Database Access)"]
  Buck[("Private Object Storage R2\n(Encrypted MinIO / AWS S3)")]
 end

 API --> PG & Redis
 API -. "R2 Voice Uploads" .-> Buck
 Redis --> Worker
 Worker --> PG & AI
 AI --> LLM["External Hosted LLM Provider\n(Anthropic / OpenAI / Vertex via API Key)"]

 API --> Otel["OpenTelemetry Collector\n(Tracing / Metrics / Logs)"]
 Worker --> Otel
 AI --> Otel

 Secrets["Production Secret Manager\n(KMS / Vault)"] -. "Injected credentials" .-> API & Worker & AI
 Backup["Automated Backup & Disaster Recovery Engine"] --> PG

 API -. "R3 Authenticated Call" .-> Billing["Billing Deployable + Isolated DB"]
 API -. "R3 Authenticated Call (WEB ONLY)" .-> Research["Research Deployable + Isolated DB"]

 classDef future stroke-dasharray:5 5
 class Buck,Billing,Research future
```

---

## D15 KUBERNETES SHOWCASE

```mermaid
flowchart TB
 Demo["Synthetic Demo Users / Test Load"] --> Ingress["Ingress Controller + TLS"]

 subgraph Cluster["Kubernetes SHOWCASE Sandbox (NO PRODUCTION DATA)"]
  Ingress --> Web["Web Deployment (Next.js)"]
  Ingress --> API["Core API Deployment (NestJS)"]
  API --> PG[("Synthetic PostgreSQL Database")]
  API --> Redis[("Sandbox Redis")]
  Redis --> Worker["Worker Deployment"]
  Worker --> PG
  Worker --> AI["FastAPI AI Deployment"]
  AI --> Stub["LLM Stub / Mock Provider"]

  HPA["HPA CPU & Queue Metric Autoscaler"] -. "Horizontal Scale" .-> API & Worker
  OTel["OpenTelemetry Collector DaemonSet"] --> Metrics["Grafana Dashboards + Jaeger Traces"]
  API --> OTel
  Worker --> OTel
  AI --> OTel
 end

 GitOps["Argo CD - Application Declarative Sync"] -. "Reconciles State" .-> Cluster
 IaC["Terraform - Cluster, Network & Node Pools"] -. "Provisions Infrastructure" .-> Cluster
 ProdSource[("Production Accounts, Real PII & Backups")] -. "X NEVER CONNECT (Zero Data Leakage)" .-> Cluster
```

---

## D16 CI CD

```mermaid
flowchart TB
 Commit["Git Commit (Main / Release Tag)"] --> CI["GitHub Actions: Lint, Typecheck, Unit Tests, Secret Scan"]
 CI --> Test["Integration Tests, DB Migrations, AI Rubric Benchmark, Container Scan"]
 Test --> Build["Build Immutable OCI Images + Generate SBOM + Cosign Sign"]
 Build --> Registry[("OCI Container Registry: Pinned Immutable Digest")]

 Registry --> Staging["Managed Staging Environment"]
 Staging --> Gate{"QA Automated Tests & Stakeholder Gate"}
 Gate -->|Approved| Prod["Managed Production (Deploys Identical Digest)"]
 Gate -->|Rejected| Stop["Pipeline Halt & Developer Notification"]

 Registry --> GitOpsPR["Showcase GitOps PR (Pinned to Digest)"]
 GitOpsPR --> Argo["Argo CD Sync"]
 Argo --> Demo["Kubernetes Synthetic Showcase"]

 Prod --> RealDB[("Real Personal Production Database")]
 Demo --> FakeDB[("Synthetic Data Only")]
 RealDB -. "STRICT PRIVACY BOUNDARY: Never Copied to Sandbox" .-> FakeDB
```

---

## D17 OBSERVABILITY RECOVERY

```mermaid
flowchart LR
 Client["Web & Native Mobile Clients"] --> Trace["HTTP Header: x-correlation-id"]
 Trace --> API["NestJS Core API"]
 API --> Worker["Evaluation Worker"]
 Worker --> AI["FastAPI AI Service"]

 API & Worker & AI --> OTel["OpenTelemetry Collector"]
 OTel --> Logs["Sanitized Logs (PII Masked)"]
 OTel --> Metrics["Metrics: Latency P95, Error Rates, Queue Depth, Token Cost"]
 OTel --> Traces["Distributed Traces (End-to-End Correlation)"]

 Metrics & Logs --> Alerts["Alerting Engine + Incident Pager"]
 Alerts --> Oncall["Engineering On-Call Team"]

 PG[("Managed Core PostgreSQL")] --> Backups["Encrypted Automated Daily Backups"]
 Backups --> Restore["Quarterly Restore Verification Drill (RPO <=24h, RTO <=8h)"]

 TokenCost["LLM Token Usage & Budget Counter"] --> Metrics
 Note["SRS Targets: Non-AI P95 <=2s (Web), <=2.5s (Mobile); Feedback <=15s; Availability >=99.5%; RPO <=24h; RTO <=8h"] -. "Monitored Target" .-> Metrics
```

---

## D18 REPO BOUNDARIES

```mermaid
flowchart TB
 subgraph Apps["apps/ (Applications)"]
  Web["web (Next.js Responsive Web)"]
  Mobile["mobile (React Native / Native App - D-M02)"]
  API["api (NestJS Modular Monolith Shared Backend)"]
  Worker["evaluation-worker (BullMQ Background Worker)"]
  AI["ai-service (FastAPI Inference Engine)"]
  Billing["billing-service (R3 Commercial Deployable)"]
  Research["research-service (R3 Governed Data Deployable)"]
 end

 subgraph Packages["packages/ (Shared Libraries & Contracts)"]
  Contracts["contracts (OpenAPI, Zod Schemas, Event Contracts, DTOs)"]
  CoreDB["db-core (Prisma Client & PostgreSQL Migrations)"]
  BillingDB["db-billing (Billing Prisma Schema R3)"]
  ResearchDB["db-research (Research Schema R3)"]
  Obs["observability (OpenTelemetry Logger & Metrics)"]
  UI["ui (Shared Design Tokens & Components)"]
 end

 Web --> Contracts & UI
 Mobile --> Contracts & UI
 API --> Contracts & CoreDB & Obs
 Worker --> Contracts & CoreDB & Obs
 AI --> Contracts
 Billing --> Contracts & BillingDB
 Research --> Contracts & ResearchDB

 Infra["infra/ (Terraform, Helm, Kubernetes, Argo CD)"] --> Apps
 Tests["tests/ (E2E, Security, IDOR, AI Evaluation Benchmarks)"] --> Contracts

 Rule["ARCHITECTURAL RULES:\n1. Mobile and Web share backend Contracts & validation schemas.\n2. No cross-context database imports.\n3. AI service has zero direct database connectivity.\n4. Admin and Research routes strictly unavailable to Mobile."] -. "Enforce via CI" .-> Tests
```

---

## D19 RELEASE ROADMAP

```mermaid
flowchart LR
 R1["R1 CORE MVP\nResponsive Web, Identity/Auth, Text Mock Interview,\nAI Rubric Scoring, History, Privacy Controls, Audit Log"] --> R2["R2 ENHANCED AI & MOBILE\nVoice/STT Practice, Observable Speech Indicators,\nEnglish Feedback, Progress Dashboard, Native Mobile App (D-M01)"]
 
 R2 --> R3["R3 COMMERCIAL & RESEARCH\nSubscription Tiers, Quota Ledger, Payment Gateway,\nRefunds, Finance Admin, Governed Research Release (Web Only)"]

 R1 --> Production["Managed Production Environment"]
 R1 --> Showcase["Kubernetes Synthetic Showcase Sandbox"]

 R2 -. "Mobile & Voice Quality Approval Gate" .-> Production
 R3 -. "Legal, Tax & Research Approval Gate" .-> Production

 Note["R1 core backend APIs designed to be mobile-ready from launch.\nNative mobile application implementation aligned to R2 milestone (D-M01).\nAdmin and Research portals remain permanently Web-only."] -. "Roadmap Rule" .-> R1
```
