# InterviewX — All Final System Diagrams
**Version: 1.1 FINAL — Phase 1: Requirement & Platform Alignment**  
**Date: 17 November 2026**  
**Status: Approved architecture baseline by project stakeholders.**

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
    Web["InterviewX Responsive Web App<br/>(Desktop / Tablet / Mobile Browser)"]
    Mobile["InterviewX Native Mobile App<br/>(iOS & Android - End Users Only)"]
  end

  Guest --> Web
  Guest --> Mobile
  User --> Web
  User --> Mobile

  Admin --> Web
  Researcher --> Web
  Finance --> Web

  Web --> Platform["InterviewX Shared Backend Platform<br/>(NestJS Modular Monolith + AI Service)"]
  Mobile --> Platform

  Platform --> Email["Transactional email provider"]
  Platform --> LLM["Hosted LLM provider"]
  Platform -.->|"R2 STT"| STT["Speech-to-text provider"]
  Platform -.->|"R3 payments"| Gateway["Payment gateway"]
  Platform --> Telemetry["Monitoring and alerting"]

  classDef optional stroke-dasharray:5 5
  class Researcher,Finance,STT,Gateway optional
```

---

## D02 C4 CONTAINERS

```mermaid
flowchart TB
  subgraph Clients["Client Frontends (Untrusted)"]
    Browser["Next.js Responsive Web App<br/>(Desktop / Tablet / Mobile Browser)"]
    Mobile["Native Mobile App<br/>(iOS & Android - End Users Only)"]
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
  ID & Content & Interview & Eval & Privacy & PlatformModule --> PG[("Core PostgreSQL:<br/>schema per bounded context")]

  PlatformModule --> Redis[("Redis / BullMQ")]
  Redis --> Worker["Evaluation Worker"]
  Worker --> AI["FastAPI AI Inference Service"]
  AI --> Provider["Hosted LLM Provider (External)"]
  Worker --> PG

  API -.->|"R2 Voice Uploads"| Store[("Private Audio Object Storage<br/>(MinIO / S3)")]
  API -.->|"R3 authenticated API"| Billing["Billing Service R3"]
  API -.->|"R3 authenticated API"| Research["Research Release Service R3<br/>(Web Only Access)"]

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

 ClientFrontends["Client Frontends<br/>(Responsive Web & Native Mobile)"] --> API["Public API Gateway / BFF"]
 API --> Access & Interview & Eval & Privacy & Content
 Interview --> Content
 Interview --> Access
 Eval --> Interview
 Privacy --> Access
 Interview --> Plat
 Eval --> Plat
 Plat --> Worker["Worker deployable"]
 Worker --> AI["AI FastAPI - no DB connection"]
 API -.->|"R3 contract"| Billing["Billing - own DB"]
 API -.->|"R3 contract (Web Only)"| Research["Research - own DB"]
 Billing -.->|"versioned events"| Plat
 Privacy -.->|"approved release channel R3"| Research
 note["Cross-context access via exported application contracts; no repository imports across owners. Role & Platform boundaries enforced at Gateway."]
 note -.->|"rule"| CORE
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
  Web["Responsive Web Client<br/>(Desktop / Tablet / Mobile Browser)"]
  Mobile["Native Mobile Client<br/>(iOS & Android - End Users Only)"]
 end

 subgraph PublicEdge["Public Edge & Ingress"]
  WAF["CDN / WAF / TLS Termination"]
  Gateway["API Gateway / NestJS Core REST /v1"]
  RBACGate{"Platform & RBAC Gate<br/>(Admin/Research blocked for Mobile)"}
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

 RBACGate -.->|"R3 Billing (Web & Mobile)"| Billing["Billing service"]
 RBACGate -.->|"R3 Research (WEB ONLY)"| Research["Research service"]

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
 A->>D: BEGIN - insert answer, eval_job(pending), outbox_event, idempotency_key
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
 retry_wait --> processing : retry ไม่เกิน max attempts
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
 Public -->|Yes| Allow["Allow Public Action<br/>(Landing, Onboarding, Catalog)"]
 Public -->|No| Deny["401 Unauthorized"]

 Auth -->|Yes| Active{"Account Active & Token Valid?"}
 Active -->|No| Deny

 Active -->|Yes| PlatCheck{"Platform Allowed for Endpoint?<br/>(Admin/Research on Web Only)"}
 PlatCheck -->|Violated| PlatformDeny["403 Forbidden<br/>(Administrative/Research blocked on Mobile)"]

 PlatCheck -->|Allowed| Role{"Has Required Role Permission?"}
 Role -->|No| Forbidden["403 Forbidden"]

 Role -->|Yes| Own{"Resource Ownership or Scoped Admin Grant?"}
 Own -->|No| Forbidden

 Own -->|Yes| Scope{"Purpose & Lawful Basis / Consent Satisfied?"}
 Scope -->|Missing| Forbidden

 Scope -->|Satisfied| Quota{"Entitlement / Quota Required?"}
 Quota -->|Exceeded| QuotaReject["402 / 429 Quota Exceeded<br/>(Server-side atomic check)"]

 Quota -->|Satisfied| DB["Apply Database Defense-in-Depth / RLS"]
 DB --> Final["Execute Action + Append Masked Audit Log"]

 note["Free / Basic / Pro = package tiers, not RBAC roles"] -.->|"rule"| Role
 note2["Platform does not grant role; backend strictly validates token"] -.->|"rule"| PlatCheck
```

---

## D10 PRIVACY LIFECYCLE

```mermaid
flowchart TB
 Notice["Versioned Processing Notice + Lawful Basis"] --> Core["service_core processing R1<br/>(Mandatory for service delivery)"]
 Notice --> Choices["Optional Per-Purpose Consent Event<br/>(Synced across Web and Mobile)"]
 Choices --> Analysis["research_analysis R3"]
 Choices --> Contact["research_contact R3"]
 Choices --> Voice["voice_retention R2"]
 Choices --> Marketing["marketing future"]

 Analysis --> Release["Eligible Data Release Approval Pipeline<br/>(Strictly Web / Admin Portal)"]
 Contact --> ContactService["Approved Contact API<br/>(Dedicated Purpose-Scoped Service)"]
 Voice --> AudioPolicy["Audio Lifecycle + Storage Expiry<br/>(ไม่เกิน 24h default; ไม่เกิน 90d opt-in; mobile cache purge)"]

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
   A->>S: Schedule hard purge of raw audio after processing (ไม่เกิน 24h hard cap)
 else Explicit opt-in granted
   A->>S: Apply approved retention lifecycle (ไม่เกิน 90d draft)
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
 Request["Researcher Request R3<br/>(STRICTLY VIA WEB PORTAL)"] --> Gate{"Purpose Approval + Role Scope + Valid Lawful Basis?"}
 Gate -->|No| Deny["403 Denied + Append Immutable Audit Log"]
 Gate -->|Yes| Pipeline["Privileged Data Release Pipeline<br/>(Isolated Privileged Service)"]

 Source[("Core Production Database<br/>(Strictly Restricted)")] --> Pipeline
 Pipeline --> Eligibility["Verify research_analysis Purpose Eligibility<br/>(Do NOT confuse with contact opt-in)"]
 Eligibility --> Aggregate["Group by Category/Difficulty + Count Distinct Users"]
 Aggregate --> Risk{"Cell Size ไม่ต่ำกว่า 10 Distinct Users<br/>& Differencing Suppression Checks?"}

 Risk -->|Failed| Suppress["Suppress Cell / Reject Automated Release"]
 Risk -->|Passed| Approve["Authorized Release Approval"]

 Suppress --> Review["Human Privacy Officer Review<br/>(Strictly Web Portal)"]
 Review --> Approve

 Approve --> Store[("Research DB Approved Aggregates<br/>(Isolated Schema)")]
 Store --> API["Research Scoped REST API<br/>(WEB ONLY)"]
 API --> Result["Deliver Aggregated Statistics Only<br/>(Never Raw Transcripts or Audio)"]

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
  WebUsers["Web Users<br/>(Desktop / Tablet / Mobile Browser)"]
  MobileUsers["Native Mobile Users<br/>(Apple iOS & Google Android)"]
 end

 WAF["CDN + Cloudflare / AWS WAF + TLS 1.3 Termination"]
 WebUsers --> WAF
 MobileUsers --> WAF

 WAF --> WEBHOST["Managed Next.js Web Hosting<br/>(Vercel / Cloud Run)"]
 WAF --> API["Managed NestJS Core API Gateway<br/>(Modular Monolith Cluster)"]

 subgraph PrivateProd["Private Production Network (VPC / Private Subnet)"]
  PG[("Managed Core PostgreSQL<br/>(Multi-AZ Primary + Read Replica)")]
  Redis[("Managed Redis Cluster<br/>(BullMQ Evaluator Queue)")]
  Worker["Managed Evaluation Workers"]
  AI["Private FastAPI Inference Service<br/>(No Direct Database Access)"]
  Buck[("Private Object Storage R2<br/>(Encrypted MinIO / AWS S3)")]
 end

 API --> PG & Redis
 API -.->|"R2 Voice Uploads"| Buck
 Redis --> Worker
 Worker --> PG & AI
 AI --> LLM["External Hosted LLM Provider<br/>(Anthropic / OpenAI / Vertex via API Key)"]

 API --> Otel["OpenTelemetry Collector<br/>(Tracing / Metrics / Logs)"]
 Worker --> Otel
 AI --> Otel

 Secrets["Production Secret Manager<br/>(KMS / Vault)"] -.->|"Injected credentials"| API & Worker & AI
 Backup["Automated Backup & Disaster Recovery Engine"] --> PG

 API -.->|"R3 Authenticated Call"| Billing["Billing Deployable + Isolated DB"]
 API -.->|"R3 Authenticated Call (WEB ONLY)"| Research["Research Deployable + Isolated DB"]

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

  HPA["HPA CPU & Queue Metric Autoscaler"] -.->|"Horizontal Scale"| API & Worker
  OTel["OpenTelemetry Collector DaemonSet"] --> Metrics["Grafana Dashboards + Jaeger Traces"]
  API --> OTel
  Worker --> OTel
  AI --> OTel
 end

 GitOps["Argo CD - Application Declarative Sync"] -.->|"Reconciles State"| Cluster
 IaC["Terraform - Cluster, Network & Node Pools"] -.->|"Provisions Infrastructure"| Cluster
 ProdSource[("Production Accounts, Real PII & Backups")] -.->|"X NEVER CONNECT (Zero Data Leakage)"| Cluster
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
 RealDB -.->|"STRICT PRIVACY BOUNDARY: Never Copied to Sandbox"| FakeDB
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
 Backups --> Restore["Quarterly Restore Verification Drill (RPO ไม่เกิน 24h, RTO ไม่เกิน 8h)"]

 TokenCost["LLM Token Usage & Budget Counter"] --> Metrics
 Note["SRS Targets: Non-AI P95 ไม่เกิน 2s (Web), ไม่เกิน 2.5s (Mobile); Feedback ไม่เกิน 15s; Availability ไม่ต่ำกว่า 99.5%; RPO ไม่เกิน 24h; RTO ไม่เกิน 8h"] -.->|"Monitored Target"| Metrics
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

 Rule["ARCHITECTURAL RULES:<br/>1. Mobile and Web share backend Contracts & validation schemas.<br/>2. No cross-context database imports.<br/>3. AI service has zero direct database connectivity.<br/>4. Admin and Research routes strictly unavailable to Mobile."] -.->|"Enforce via CI"| Tests
```

---

## D19 RELEASE ROADMAP

```mermaid
flowchart LR
 R1["R1 CORE MVP<br/>Responsive Web, Identity/Auth, Text Mock Interview,<br/>AI Rubric Scoring, History, Privacy Controls, Audit Log"] --> R2["R2 ENHANCED AI & MOBILE<br/>Voice/STT Practice, Observable Speech Indicators,<br/>English Feedback, Progress Dashboard, Native Mobile App (D-M01)"]
 
 R2 --> R3["R3 COMMERCIAL & RESEARCH<br/>Subscription Tiers, Quota Ledger, Payment Gateway,<br/>Refunds, Finance Admin, Governed Research Release (Web Only)"]

 R1 --> Production["Managed Production Environment"]
 R1 --> Showcase["Kubernetes Synthetic Showcase Sandbox"]

 R2 -.->|"Mobile & Voice Quality Approval Gate"| Production
 R3 -.->|"Legal, Tax & Research Approval Gate"| Production

 Note["R1 core backend APIs designed to be mobile-ready from launch.<br/>Native mobile application implementation aligned to R2 milestone (D-M01).<br/>Admin and Research portals remain permanently Web-only."] -.->|"Roadmap Rule"| R1
```

---

## D20 MASTER SYSTEM USE CASE MODEL

Master System Use Case Diagram specifying the relationships between all 5 actor roles (Guest, Registered User, System Admin, Finance Admin, Research Engineer) and core use cases (UC01–UC10) with formal UML `«include»` and `«extend»` dependencies:

```mermaid
flowchart LR
  subgraph EndUsers["End Users"]
    Guest([👤 Guest])
    User([👤 Registered User])
  end

  subgraph Staff["Internal Staff Roles (Web Only)"]
    Admin([🛡️ System Admin])
    Finance([💳 Finance Admin R3])
    Researcher([🔬 Research Engineer R3])
  end

  subgraph SystemBoundary["InterviewX Platform System Boundary"]
    direction TB

    %% Base Use Cases
    UC01(["UC01: Explore & Trial Simulation [R1]"])
    UC02(["UC02: Register & Authenticate [R1]"])
    UC03(["UC03: Manage Profile & Career Goals [R1]"])
    UC04(["UC04: Practice Text Interview [R1]"])
    UC05(["UC05: Practice Voice Interview [R2]"])
    UC06(["UC06: Review AI Evaluation & Feedback [R1]"])
    UC07(["UC07: View History & Analytics Dashboard [R1/R2]"])
    UC08(["UC08: Manage PDPA Privacy Rights [R1]"])
    UC09(["UC09: Manage Subscriptions & Billing [R3]"])
    UC10(["UC10: Administer System & Question Bank [R1]"])

    %% Included Use Cases
    INC_Verify(["«include»<br/>Verify Email via Secure Link<br/>(FR01 Email Verification)"])
    INC_GenQ(["«include»<br/>Fetch Categorized Question<br/>(FR03 Question Generation)"])
    INC_CheckQuota(["«include»<br/>Check Entitlement Quota<br/>(FR13 Entitlement Check)"])
    INC_SubmitAnswer(["«include»<br/>Enqueue Answer for Evaluation<br/>(FR05 Idempotent Submit)"])
    INC_VoiceConsent(["«include»<br/>Consent to Voice Audio Retention<br/>(FR05.1 Voice Consent)"])
    INC_STT(["«include»<br/>Transcribe Speech to Text<br/>(FR05-V Speech to Text)"])
    INC_RubricScore(["«include»<br/>Compute AI Rubric Scores<br/>(FR07 Rubric Scoring)"])
    INC_STARAnalysis(["«include»<br/>Analyze STAR Structure<br/>(FR08 Relevance Analysis)"])
    INC_AuditLog(["«include»<br/>Record Security Audit Event<br/>(FR26 Immutable Audit)"])

    %% Extended Use Cases
    EXT_Autosave(["«extend»<br/>Autosave Answer Draft<br/>(FR05 Autosave Draft)"])
    EXT_Pressure(["«extend»<br/>Enable Timed Pressure Mode<br/>(FR33 Pressure Mode)"])
    EXT_Guidance(["«extend»<br/>View Improvement Tips<br/>(FR06 Improvement Tips)"])
    EXT_Appeal(["«extend»<br/>Submit Evaluation Appeal<br/>(FR17 Evaluation Appeal)"])
    EXT_ExportPDF(["«extend»<br/>Download PDF Report<br/>(FR20 Export PDF Report)"])
    EXT_Portability(["«extend»<br/>Request Data Export<br/>(FR21 Data Portability)"])
    EXT_Erasure(["«extend»<br/>Request Account Deletion<br/>(FR22 Right to Erasure)"])
    EXT_Refund(["«extend»<br/>Approve Refund Request<br/>(FR30 Refund Approval)"])
  end

  subgraph ExternalServices["External Supporting Services"]
    EmailGateway[[✉️ Email Provider]]
    LLMService[[🤖 Hosted LLM Provider]]
    STTService[[🎙️ Speech-to-Text Provider R2]]
    PaymentGW[[🏦 Payment Gateway Provider R3]]
  end

  %% Actor Invariants
  User -- Generalizes --> Guest

  %% Actor Connections
  Guest --> UC01
  Guest --> UC02

  User --> UC02
  User --> UC03
  User --> UC04
  User --> UC05
  User --> UC06
  User --> UC07
  User --> UC08
  User -.->|"Subscribe"| UC09

  Admin --> UC10
  Admin -.->|"Manage DSR"| UC08
  Finance --> UC09
  Researcher -.->|"Export Research Dataset"| UC08

  %% Includes
  UC02 -.->|"«include»"| INC_Verify
  UC04 -.->|"«include»"| INC_GenQ
  UC04 -.->|"«include»"| INC_CheckQuota
  UC04 -.->|"«include»"| INC_SubmitAnswer

  UC05 -.->|"«include»"| INC_VoiceConsent
  UC05 -.->|"«include»"| INC_STT
  UC05 -.->|"«include»"| INC_GenQ
  UC05 -.->|"«include»"| INC_SubmitAnswer

  UC06 -.->|"«include»"| INC_RubricScore
  UC06 -.->|"«include»"| INC_STARAnalysis

  UC08 -.->|"«include»"| INC_AuditLog
  UC10 -.->|"«include»"| INC_AuditLog

  %% Extends (Points FROM Extension TO Base)
  EXT_Autosave -.->|"«extend»<br/>(Typing / Network Jitter)"| UC04
  EXT_Pressure -.->|"«extend»<br/>(Select Pressure Mode)"| UC04
  EXT_Pressure -.->|"«extend»<br/>(Select Pressure Mode)"| UC05

  EXT_Guidance -.->|"«extend»<br/>(Request Exemplar)"| UC06
  EXT_Appeal -.->|"«extend»<br/>(Disputed Score)"| UC06
  EXT_ExportPDF -.->|"«extend»<br/>(Save Offline Report)"| UC06

  EXT_Portability -.->|"«extend»<br/>(Submit Export Request)"| UC08
  EXT_Erasure -.->|"«extend»<br/>(Confirm Account Deletion)"| UC08

  EXT_Refund -.->|"«extend»<br/>(Eligible Refund Claim)"| UC09

  %% External System Connections
  INC_Verify --> EmailGateway
  INC_GenQ --> LLMService
  INC_STT --> STTService
  INC_RubricScore --> LLMService
  INC_STARAnalysis --> LLMService
  UC09 --> PaymentGW
  EXT_Refund --> PaymentGW

  %% Styling
  classDef baseStyle fill:#dbeafe,stroke:#1d4ed8,stroke-width:2px
  classDef incStyle fill:#dcfce7,stroke:#15803d,stroke-width:2px
  classDef extStyle fill:#fef3c7,stroke:#b45309,stroke-width:2px,stroke-dasharray:4 4
  classDef actorStyle fill:#f1f5f9,stroke:#334155,stroke-width:2px
  classDef extSysStyle fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px

  class UC01,UC02,UC03,UC04,UC05,UC06,UC07,UC08,UC09,UC10 baseStyle
  class INC_Verify,INC_GenQ,INC_CheckQuota,INC_SubmitAnswer,INC_VoiceConsent,INC_STT,INC_RubricScore,INC_STARAnalysis,INC_AuditLog incStyle
  class EXT_Autosave,EXT_Pressure,EXT_Guidance,EXT_Appeal,EXT_ExportPDF,EXT_Portability,EXT_Erasure,EXT_Refund extStyle
  class Guest,User,Admin,Finance,Researcher actorStyle
  class EmailGateway,LLMService,STTService,PaymentGW extSysStyle
```

---

## D21 SUBSYSTEM USE CASES: PRACTICE & AI EVALUATION ENGINE

Subsystem Use Case Diagram detailing question selection, quota deduction, text/voice simulation flows, rubric evaluation, and contextual extensions:

```mermaid
flowchart LR
  subgraph Candidate["Candidate"]
    User([👤 Registered User])
  end

  subgraph PracticeBoundary["Practice & Evaluation Engine"]
    direction TB

    %% Base Use Cases
    UC_StartSession(["Start Interview Session"])
    UC_PracticeText(["(UC04) Practice Text Interview [FR05]"])
    UC_PracticeVoice(["(UC05) Practice Voice Interview [FR05-V]"])
    UC_ReviewEval(["(UC06) Review AI Evaluation Report [FR07]"])

    %% Includes for Sessions
    INC_FetchQ(["«include»<br/>Fetch Categorized Question<br/>(FR03 Category Question)"])
    INC_CheckQuota(["«include»<br/>Atomic Quota Deduction<br/>(FR13 Quota Ledger Check)"])
    INC_SubmitAnswer(["«include»<br/>Submit with Idempotency Key<br/>(FR05 Idempotent Submission)"])

    %% Includes for Voice
    INC_VoiceConsent(["«include»<br/>Request Voice Retention Consent<br/>(FR05.1 Voice Consent)"])
    INC_STT(["«include»<br/>Transcribe Audio to Text<br/>(FR05-V Speech to Text)"])

    %% Includes for Evaluation
    INC_RubricScore(["«include»<br/>Calculate Rubric Scores<br/>(FR07 Rubric Scoring Engine)"])
    INC_STARRelevance(["«include»<br/>Analyze STAR Relevance<br/>(FR08 Relevance Analysis)"])
    INC_StrengthsReport(["«include»<br/>Synthesize Strengths & Weaknesses<br/>(FR09 Strengths Report)"])

    %% Extends for Sessions
    EXT_DifficultyScaling(["«extend»<br/>Select Difficulty Level<br/>(FR16 Difficulty Scaling)"])
    EXT_PressureMode(["«extend»<br/>Enable Time Pressure Mode<br/>(FR33 Pressure Simulation)"])
    EXT_FollowupQ(["«extend»<br/>Generate Contextual Follow-up<br/>(FR14 Contextual Follow-up)"])
    EXT_Autosave(["«extend»<br/>Autosave Answer Draft<br/>(FR05 Client Draft Autosave)"])
    EXT_EditTranscript(["«extend»<br/>Review & Edit Transcript<br/>(Review & Edit Transcript)"])

    %% Extends for Evaluation
    EXT_GrammarAnalysis(["«extend»<br/>Analyze English Grammar<br/>(FR10 Professional Vocab)"])
    EXT_SpeechPace(["«extend»<br/>Analyze Speech Pace & Fillers<br/>(FR36 Speech Pace Analysis)"])
    EXT_ImprovementTips(["«extend»<br/>View Exemplar & Tips<br/>(FR06 Improvement Guidance)"])
    EXT_AppealScore(["«extend»<br/>Submit Score Appeal<br/>(FR17 Evaluation Score Appeal)"])
    EXT_ExportPDF(["«extend»<br/>Export Report to PDF<br/>(FR20 Feedback Report Export)"])
  end

  subgraph ExternalInference["External AI Services"]
    LLM[[🤖 Hosted LLM Provider]]
    STT[[🎙️ Speech-to-Text Provider]]
  end

  %% Actor associations
  User --> UC_StartSession
  User --> UC_PracticeText
  User --> UC_PracticeVoice
  User --> UC_ReviewEval

  %% Start Session Relationships
  UC_StartSession -.->|"«include»"| INC_FetchQ
  UC_StartSession -.->|"«include»"| INC_CheckQuota
  EXT_DifficultyScaling -.->|"«extend»<br/>(Specific Skill Level)"| UC_StartSession
  EXT_PressureMode -.->|"«extend»<br/>(High Pressure Drill)"| UC_StartSession
  EXT_FollowupQ -.->|"«extend»<br/>(Answer Opens Inquiry)"| INC_FetchQ

  %% Practice Text Relationships
  UC_PracticeText -.->|"«include»"| INC_SubmitAnswer
  EXT_Autosave -.->|"«extend»<br/>(Typing / Network Disruption)"| UC_PracticeText

  %% Practice Voice Relationships
  UC_PracticeVoice -.->|"«include»"| INC_VoiceConsent
  UC_PracticeVoice -.->|"«include»"| INC_STT
  UC_PracticeVoice -.->|"«include»"| INC_SubmitAnswer
  EXT_EditTranscript -.->|"«extend»<br/>(Transcription Correction)"| UC_PracticeVoice

  %% Review Evaluation Relationships
  UC_ReviewEval -.->|"«include»"| INC_RubricScore
  UC_ReviewEval -.->|"«include»"| INC_STARRelevance
  UC_ReviewEval -.->|"«include»"| INC_StrengthsReport

  EXT_GrammarAnalysis -.->|"«extend»<br/>(English Response)"| UC_ReviewEval
  EXT_SpeechPace -.->|"«extend»<br/>(R2 Voice Session Only)"| UC_ReviewEval
  EXT_ImprovementTips -.->|"«extend»<br/>(Guidance Requested)"| UC_ReviewEval
  EXT_AppealScore -.->|"«extend»<br/>(Disputed AI Score)"| UC_ReviewEval
  EXT_ExportPDF -.->|"«extend»<br/>(Export Requested)"| UC_ReviewEval

  %% External Connections
  INC_FetchQ --> LLM
  EXT_FollowupQ --> LLM
  INC_STT --> STT
  INC_RubricScore --> LLM
  INC_STARRelevance --> LLM
  EXT_GrammarAnalysis --> LLM
  EXT_ImprovementTips --> LLM

  classDef baseStyle fill:#dbeafe,stroke:#1d4ed8,stroke-width:2px
  classDef incStyle fill:#dcfce7,stroke:#15803d,stroke-width:2px
  classDef extStyle fill:#fef3c7,stroke:#b45309,stroke-width:2px,stroke-dasharray:4 4
  classDef actorStyle fill:#f1f5f9,stroke:#334155,stroke-width:2px
  classDef extSysStyle fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px

  class UC_StartSession,UC_PracticeText,UC_PracticeVoice,UC_ReviewEval baseStyle
  class INC_FetchQ,INC_CheckQuota,INC_SubmitAnswer,INC_VoiceConsent,INC_STT,INC_RubricScore,INC_STARRelevance,INC_StrengthsReport incStyle
  class EXT_DifficultyScaling,EXT_PressureMode,EXT_FollowupQ,EXT_Autosave,EXT_EditTranscript,EXT_GrammarAnalysis,EXT_SpeechPace,EXT_ImprovementTips,EXT_AppealScore,EXT_ExportPDF extStyle
  class User actorStyle
  class LLM,STT extSysStyle
```

---

## D22 SUBSYSTEM USE CASES: IDENTITY & PDPA PRIVACY GOVERNANCE

Subsystem Use Case Diagram covering registration, authentication, consent lifecycle, audit event logging, data portability, and the right to erasure workflow:

```mermaid
flowchart LR
  subgraph Actors["Actors"]
    Guest([👤 Guest])
    User([👤 Registered User])
    Admin([🛡️ System Admin / DPO])
  end

  subgraph PrivacyBoundary["Identity & Privacy Governance"]
    direction TB

    %% Base Use Cases
    UC_Register(["Sign Up with Email (FR01)"])
    UC_Login(["(UC02) Authenticate & Issue Tokens"])
    UC_ManageProfile(["(UC03) Manage Profile & Goals (FR02)"])
    UC_ConsentDashboard(["(UC08) Manage Consent Preferences (FR18)"])
    UC_DSRWorkflow(["(FR35) Data Subject Rights SLA Workflow"])

    %% Includes
    INC_VerifyEmail(["«include»<br/>Send Secure Verification Link"])
    INC_IssueTokens(["«include»<br/>Generate Access & Refresh Tokens"])
    INC_AuditRecord(["«include»<br/>Record Immutable Consent Event Log"])

    %% Extends
    EXT_ResetPassword(["«extend»<br/>Password Reset Request"])
    EXT_ChangePassword(["«extend»<br/>Change Account Password (FR23)"])
    EXT_LogoutAll(["«extend»<br/>Logout from All Devices (FR23)"])
    EXT_RevokeConsent(["«extend»<br/>Revoke Purpose Consent (FR18)"])
    EXT_DataPortability(["«extend»<br/>Data Portability Request (FR21)"])
    EXT_AccountErasure(["«extend»<br/>Right to Erasure / Deletion (FR22)"])
  end

  subgraph MailService["External Services"]
    EmailGateway[[✉️ Transactional Email]]
  end

  %% Associations
  Guest --> UC_Register
  Guest --> UC_Login
  User --> UC_Login
  User --> UC_ManageProfile
  User --> UC_ConsentDashboard
  Admin --> UC_DSRWorkflow

  %% Includes
  UC_Register -.->|"«include»"| INC_VerifyEmail
  UC_Login -.->|"«include»"| INC_IssueTokens
  UC_ConsentDashboard -.->|"«include»"| INC_AuditRecord

  %% Extends
  EXT_ResetPassword -.->|"«extend»<br/>(Forgot Password)"| UC_Login
  EXT_ChangePassword -.->|"«extend»<br/>(Update Credentials)"| UC_Login
  EXT_LogoutAll -.->|"«extend»<br/>(Security Compromise)"| UC_Login

  EXT_RevokeConsent -.->|"«extend»<br/>(Withdraw Consent)"| UC_ConsentDashboard
  EXT_DataPortability -.->|"«extend»<br/>(Export JSON/CSV)"| UC_ConsentDashboard
  EXT_AccountErasure -.->|"«extend»<br/>(Confirm Account Deletion)"| UC_ConsentDashboard

  %% DSR Inclusion
  EXT_DataPortability -.->|"«include»"| UC_DSRWorkflow
  EXT_AccountErasure -.->|"«include»"| UC_DSRWorkflow

  INC_VerifyEmail --> EmailGateway
  EXT_ResetPassword --> EmailGateway

  classDef baseStyle fill:#dbeafe,stroke:#1d4ed8,stroke-width:2px
  classDef incStyle fill:#dcfce7,stroke:#15803d,stroke-width:2px
  classDef extStyle fill:#fef3c7,stroke:#b45309,stroke-width:2px,stroke-dasharray:4 4
  classDef actorStyle fill:#f1f5f9,stroke:#334155,stroke-width:2px
  classDef extSysStyle fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px

  class UC_Register,UC_Login,UC_ManageProfile,UC_ConsentDashboard,UC_DSRWorkflow baseStyle
  class INC_VerifyEmail,INC_IssueTokens,INC_AuditRecord incStyle
  class EXT_ResetPassword,EXT_ChangePassword,EXT_LogoutAll,EXT_RevokeConsent,EXT_DataPortability,EXT_AccountErasure extStyle
  class Guest,User,Admin actorStyle
  class EmailGateway extSysStyle
```

---

## D23 SUBSYSTEM USE CASES: BACKOFFICE, FINANCE & RESEARCH

Subsystem Use Case Diagram for internal staff portals (Web Only) covering question bank and rubric management, AI prompt configuration, financial reconciliation, and governed differential privacy dataset export:

```mermaid
flowchart LR
  subgraph StaffUsers["Internal Staff (Web Only)"]
    Admin([🛡️ System Admin])
    Finance([💳 Finance Admin R3])
    Researcher([🔬 Research Engineer R3])
  end

  subgraph BackofficeBoundary["Backoffice & Governance Portal"]
    direction TB

    %% Base Use Cases
    UC_ManageQuestions(["(UC10) Question Bank & Rubric Console (FR24)"])
    UC_ManageUsers(["User & Role RBAC Console (FR25)"])
    UC_AuditViewer(["Security Audit Viewer (FR26)"])
    UC_FinancialDashboard(["(UC09) Financial & MRR Dashboard (FR31)"])
    UC_ResearchExport(["(UC08.1) Research Dataset Release (FR18.1)"])

    %% Includes
    INC_ImmutableVersion(["«include»<br/>Immutable Rubric Version Pinning"])
    INC_AuditTrail(["«include»<br/>Record Audit Trail Event"])
    INC_DiffPrivacy(["«include»<br/>Differential Privacy Noise & Suppression"])
    INC_PaymentAPI(["«include»<br/>Execute Payment Gateway API Call"])

    %% Extends
    EXT_ConfigPrompt(["«extend»<br/>AI Model & Prompt Config (FR34)"])
    EXT_SuspendAccount(["«extend»<br/>Suspend & Unlock User (FR32)"])
    EXT_ResolveAppeal(["«extend»<br/>Resolve Score Appeal (FR17)"])
    EXT_ProcessRefund(["«extend»<br/>Process Refund Request (FR30)"])
  end

  subgraph ExternalGW["External Gateways"]
    PaymentGateway[[🏦 Payment Gateway Provider]]
  end

  %% Associations
  Admin --> UC_ManageQuestions
  Admin --> UC_ManageUsers
  Admin --> UC_AuditViewer
  Finance --> UC_FinancialDashboard
  Researcher --> UC_ResearchExport

  %% Includes
  UC_ManageQuestions -.->|"«include»"| INC_ImmutableVersion
  UC_ManageQuestions -.->|"«include»"| INC_AuditTrail
  UC_ManageUsers -.->|"«include»"| INC_AuditTrail
  UC_ResearchExport -.->|"«include»"| INC_DiffPrivacy
  EXT_ProcessRefund -.->|"«include»"| INC_PaymentAPI
  INC_PaymentAPI --> PaymentGateway

  %% Extends
  EXT_ConfigPrompt -.->|"«extend»<br/>(Tune or Upgrade AI Model)"| UC_ManageQuestions
  EXT_SuspendAccount -.->|"«extend»<br/>(Fraud / Policy Violation)"| UC_ManageUsers
  EXT_ResolveAppeal -.->|"«extend»<br/>(Pending Score Appeal)"| UC_ManageQuestions
  EXT_ProcessRefund -.->|"«extend»<br/>(Eligible Refund Claim)"| UC_FinancialDashboard

  classDef baseStyle fill:#dbeafe,stroke:#1d4ed8,stroke-width:2px
  classDef incStyle fill:#dcfce7,stroke:#15803d,stroke-width:2px
  classDef extStyle fill:#fef3c7,stroke:#b45309,stroke-width:2px,stroke-dasharray:4 4
  classDef actorStyle fill:#f1f5f9,stroke:#334155,stroke-width:2px
  classDef extSysStyle fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px

  class UC_ManageQuestions,UC_ManageUsers,UC_AuditViewer,UC_FinancialDashboard,UC_ResearchExport baseStyle
  class INC_ImmutableVersion,INC_AuditTrail,INC_DiffPrivacy,INC_PaymentAPI incStyle
  class EXT_ConfigPrompt,EXT_SuspendAccount,EXT_ResolveAppeal,EXT_ProcessRefund extStyle
  class Admin,Finance,Researcher actorStyle
  class PaymentGateway extSysStyle
```

---

---

## D24 WEB & MOBILE ARCHITECTURE ALIGNMENT

Illustrates the architectural alignment, responsibility boundaries, shared monorepo contracts, and unified backend between Responsive Web (Next.js) and Native Mobile (React Native / Expo).

```mermaid
flowchart TD
    %% Styling & Classes
    classDef clientWeb fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1
    classDef clientMobile fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#b45309
    classDef sharedContracts fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#5b21b6
    classDef securityGate fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#991b1b
    classDef backendCore fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#047857
    classDef dataStore fill:#f1f5f9,stroke:#475569,stroke-width:2px,color:#1e293b
    classDef external fill:#f3f4f6,stroke:#9ca3af,stroke-width:1px,color:#374151

    %% 1. Client Layer
    subgraph ClientLayer["1. Frontend Clients Layer"]
        subgraph WebApp["Responsive Web Application (apps/web)"]
            W_Tech["Next.js 14+ (TypeScript / Tailwind / shadcn/ui)"]
            W_Roles["Supports All 5 Roles:<br/>- Guest<br/>- Registered User<br/>- Researcher<br/>- Payment / Finance Admin<br/>- System Admin"]
            W_Auth["Auth: HTTP-Only, Secure, SameSite Cookie<br/>+ CSRF Protection"]
            W_View["Viewport: Desktop, Tablet, Mobile Browser (360px+)"]
        end

        subgraph MobileApp["Native Mobile Application (apps/mobile)"]
            M_Tech["React Native / Expo (iOS 16+ / Android 13+)"]
            M_Roles["Supports 2 End-User Roles Only:<br/>- Guest<br/>- Registered User<br/>(Admin & Research 100% Restricted to Web)"]
            M_Auth["Auth: Bearer JWT<br/>(iOS Keychain / Android Keystore)"]
            M_Storage["Offline Draft Autosave (Every 5s)<br/>Network Flakiness Resilient"]
        end
    end

    %% 2. Shared Monorepo Contracts Layer
    subgraph MonorepoLayer["2. Shared Contracts & Interfaces Layer"]
        Contracts["packages/contracts<br/>- OpenAPI Specification<br/>- Zod Validation Schemas<br/>- Shared TypeScript DTOs<br/>- Domain Event Definitions"]
        UI_Shared["packages/ui<br/>- Shared Design Tokens & Theme"]
    end

    Contracts -.->|Type-Safe API Contracts| WebApp
    Contracts -.->|Type-Safe API Contracts| MobileApp
    UI_Shared -.->|Design Tokens| WebApp
    UI_Shared -.->|Design Tokens| MobileApp

    %% 3. Edge Gateway & Security Layer
    subgraph GatewayLayer["3. Edge & API Gateway Boundary"]
        CDN_WAF["Cloudflare WAF / CDN / TLS 1.3 Termination"]
        
        subgraph IngressGateway["NestJS Ingress & Policy Enforcement"]
            AuthGuard["Unified Auth Guard<br/>- Extract Cookie (Web)<br/>- Extract Bearer JWT (Mobile)"]
            ClientGuard{"Client-Type & RBAC Guard"}
            IdempotencyMW["Idempotency Middleware<br/>(Requires Idempotency-Key: UUIDv4)"]
            RateLimiter["Rate Limiting & Anti-Abuse<br/>(Throttler by Client IP / User ID)"]
        end
    end

    WebApp -->|HTTPS / REST API| CDN_WAF
    MobileApp -->|HTTPS / REST API| CDN_WAF
    CDN_WAF --> AuthGuard
    AuthGuard --> IdempotencyMW
    IdempotencyMW --> RateLimiter
    RateLimiter --> ClientGuard

    ClientGuard -->|Mobile requesting Admin/Researcher routes| RejectAdmin["403 Forbidden<br/>(Strictly Block Administrative Actions on Mobile)"]
    ClientGuard -->|Valid Authorized Request| BackendRouting["Route to Target Module"]

    %% 4. Backend Modular Monolith
    subgraph BackendCore["4. Unified Backend Core (Zero Duplication)"]
        subgraph NestJS["NestJS Modular Monolith (apps/api)"]
            Mod_Identity["Identity & Auth Module<br/>(Token Rotation, Ownership Guard)"]
            Mod_Interview["Interview & Session Module<br/>(Question Gen, Answer Ingestion)"]
            Mod_Eval["Evaluation Module<br/>(Transactional Outbox Publisher)"]
            Mod_Privacy["Privacy & Consent Module<br/>(PDPA Audit Logs, Consent Check)"]
        end

        subgraph AsyncQueue["Asynchronous Processing System"]
            OutboxPoll["Transactional Outbox Dispatcher"]
            BullQueue[("Redis / BullMQ<br/>(Evaluation Job Queue)")]
            EvalWorker["Evaluation Worker<br/>(Inbox Deduplication)"]
        end

        subgraph AIService["AI Evaluation Engine (apps/ai-service)"]
            FastAPI["FastAPI AI Service<br/>(Stateless Scoring Engine)"]
            PydanticVal["Pydantic Output Validation<br/>(Rubric Bounds & Citation Check)"]
        end
    end

    BackendRouting --> NestJS
    Mod_Eval --> OutboxPoll
    OutboxPoll --> BullQueue
    BullQueue --> EvalWorker
    EvalWorker --> FastAPI
    FastAPI --> PydanticVal

    %% 5. Data Layer
    subgraph DataLayer["5. Persistent Data Layer (Single Source of Truth)"]
        Postgres[("Core PostgreSQL<br/>- USERS & REFRESH_TOKENS<br/>- SESSIONS & QUESTIONS<br/>- ANSWERS & EVALUATION_JOBS<br/>- OUTBOX_EVENTS<br/>- IDEMPOTENCY_KEYS")]
        ObjectStore[("MinIO / S3<br/>- Audio Cache (R2 Voice)<br/>- Export Artifacts")]
    end

    NestJS --> Postgres
    EvalWorker --> Postgres

    %% 6. External Services
    subgraph ExternalServices["6. External Integrations"]
        ExtLLM["External LLM Provider<br/>(OpenAI / Claude / Gemini)"]
        WebCheckout["Web Payment Gateway (R3)<br/>(Mobile Redirects to Web Checkout)"]
    end

    FastAPI --> ExtLLM
    WebApp -.-> WebCheckout
    MobileApp -.->|D-M04: In-App Browser Redirect| WebCheckout

    %% Apply Classes
    class W_Tech,W_Roles,W_Auth,W_View clientWeb
    class M_Tech,M_Roles,M_Auth,M_Storage clientMobile
    class Contracts,UI_Shared sharedContracts
    class CDN_WAF,AuthGuard,ClientGuard,IdempotencyMW,RateLimiter,RejectAdmin securityGate
    class Mod_Identity,Mod_Interview,Mod_Eval,Mod_Privacy,OutboxPoll,BullQueue,EvalWorker,FastAPI,PydanticVal backendCore
    class Postgres,ObjectStore dataStore
    class ExtLLM,WebCheckout external
```

---

## D25 WEB VS MOBILE INTERACTION SEQUENCE

Compares authentication protocols, strict client RBAC enforcement, and network flakiness resilience using idempotency keys and client-side autosave.

```mermaid
sequenceDiagram
    autonumber
    actor UserWeb as Web User
    actor UserMobile as Mobile User
    participant ClientWeb as Web Client (Next.js)
    participant ClientMobile as Mobile App (React Native)
    participant API as NestJS Gateway / Backend
    participant DB as Core PostgreSQL
    participant Queue as Redis / BullMQ
    participant AI as Evaluation Worker & FastAPI

    %% 1. Authentication Strategy Comparison
    rect rgb(240, 248, 255)
    note over UserWeb, API: 1. Authentication Strategy
    UserWeb->>ClientWeb: Login (Email / Password)
    ClientWeb->>API: POST /api/v1/auth/login
    API-->>ClientWeb: Set-Cookie: access_token (HTTP-Only, Secure, SameSite)
    
    UserMobile->>ClientMobile: Login (Email / Password)
    ClientMobile->>API: POST /api/v1/auth/login (Client-Type: mobile)
    API-->>ClientMobile: 200 OK { accessToken: "JWT...", refreshToken: "..." }
    ClientMobile->>ClientMobile: Store tokens securely in iOS Keychain / Android Keystore
    end

    %% 2. Strict Client RBAC Enforcement
    rect rgb(255, 240, 240)
    note over UserMobile, API: 2. Strict Client RBAC Enforcement
    UserMobile->>ClientMobile: Attempt to access Admin / Finance route
    ClientMobile->>API: GET /api/v1/admin/dashboard (Authorization: Bearer [JWT])
    API->>API: Client-Type Check: Detected request from Mobile Client
    API-->>ClientMobile: 403 Forbidden (Admin functions are restricted to Web only)
    end

    %% 3. Answer Submission & Idempotency
    rect rgb(240, 255, 240)
    note over UserMobile, AI: 3. Answer Submission & Network Flakiness Resilience
    UserMobile->>ClientMobile: Type interview answer
    loop Local Draft Autosave (Every 5s)
        ClientMobile->>ClientMobile: Persist draft to local device storage
    end
    UserMobile->>ClientMobile: Tap "Submit Answer"
    ClientMobile->>ClientMobile: Generate UUIDv4 for Idempotency-Key
    ClientMobile->>API: POST /api/v1/interviews/{id}/answers<br/>Header: Idempotency-Key: 550e8400-e29b...<br/>Header: Authorization: Bearer [JWT]
    
    API->>API: Verify Bearer JWT + Session Ownership Check
    API->>DB: Check if Idempotency-Key already exists
    alt New Request (Key not seen before)
        API->>DB: BEGIN - Insert answer + create Job (pending) + insert Outbox Event + save Key
        DB-->>API: COMMIT
        API-->>ClientMobile: 202 Accepted { jobId: "job_123", status: "pending" }
        API->>Queue: Dispatcher enqueues Job to Redis / BullMQ
        Queue->>AI: Evaluate candidate response against Rubric
        AI->>DB: Persist score & feedback (status: completed)
    else Network Dropout & Retry with same Idempotency-Key
        API->>DB: Key found in database (Fetch existing job state)
        DB-->>API: Return existing job state (pending or completed)
        API-->>ClientMobile: 202 Accepted { jobId: "job_123", status: "pending" } (No duplicated job)
    end
    
    loop Async Status Polling (or Push Notification)
        ClientMobile->>API: GET /api/v1/evaluations/job_123
        API-->>ClientMobile: 200 OK { status: "completed", score: 85, feedback: {...} }
    end
    ClientMobile->>UserMobile: Render feedback score, strengths, and improvements
    end
```

---

## D26 AI DATA PIPELINE FLOW

Illustrates the end-to-end data lifecycle for AI evaluation, from ingesting candidate responses, sanitizing prompt injections and PII, pinning rubric and prompt configuration versions, dispatching LLM inference calls, to rigorous schema validation via Pydantic.

```mermaid
flowchart LR
 subgraph Ingestion["1. Answer Ingestion"]
  RawAnswer["Interview Answer<br/>(Text / STT Transcript)"]
 end

 subgraph ContextPrep["2. Context & Version Pinning"]
  Rubric["Pinned Rubric Definition<br/>(Rubric Version)"]
  AIConfig["Pinned AI System Prompts<br/>(AI Config Version)"]
  Sanitizer["Security Sanitizer<br/>(Prompt Injection & PII Filter)"]
 end

 subgraph Inference["3. AI Inference Dispatch"]
  LLMClient["LLM Adapter Client<br/>(10s Timeout + 2 Retries)"]
  RawOutput["Raw LLM JSON Response"]
 end

 subgraph Validation["4. Strict Output Validation"]
  Validator{"Schema & Criteria Check"}
  ValCriteria["Pydantic Validation Criteria:<br/>- 4 Rubric Dimensions Present<br/>- Score Range 0-100<br/>- Evidence Excerpts Present"]
  Valid["Valid & Conforming<br/>(Status: completed)"]
  Invalid["Schema Violation / Anomaly<br/>(Status: needs_review)"]
 end

 RawAnswer --> Sanitizer
 Sanitizer --> LLMClient
 Rubric --> LLMClient
 AIConfig --> LLMClient
 LLMClient --> RawOutput
 RawOutput --> Validator
 Validator -.->|Evaluated Against| ValCriteria
 Validator -->|Pass| Valid
 Validator -->|Fail| Invalid
```

---

## D27 AI FALLBACK & CIRCUIT BREAKER

Illustrates High Availability (HA) and fault-tolerance architecture for AI evaluation jobs, including BullMQ/Redis worker job consumption, exponential backoff retries, circuit breaking after 5 consecutive failures, secondary backup LLM failover, and `needs_review` on-call alerting fallback.

```mermaid
flowchart TD
 Start["Evaluation Job dequeued from Redis Queue"] --> CallAI["Invoke Primary LLM Provider"]
 CallAI --> CheckSuccess{"Response received within 10s?"}

 CheckSuccess -->|Success| Validate["Validate Output via Pydantic Schema"]
 Validate --> CheckValid{"Is score payload valid?"}
 CheckValid -->|Valid| Complete["Persist Result: status completed"]

 CheckSuccess -->|Failure / Timeout| Trip{"5 or more consecutive failures?"}
 Trip -->|Trip Circuit Open| FallbackLLM["Failover to Secondary Backup LLM"]
 Trip -->|Circuit Closed| Retry["Exponential Backoff Retry (Max 3 attempts)"]
 Retry --> CallAI

 FallbackLLM --> CheckFallback{"Backup LLM call succeeded?"}
 CheckFallback -->|Success| Validate
 CheckFallback -->|Failure| MarkReview["Mark Job Status: needs_review<br/>(Queued for Human Expert Review)"]
 CheckValid -->|Invalid Payload| MarkReview

 MarkReview --> Alert["Trigger Immediate Admin On-Call Alert"]
```
