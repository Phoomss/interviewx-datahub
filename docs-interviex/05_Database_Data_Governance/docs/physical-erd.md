# InterviewX Physical ERD — proposed v1.0

Source of truth: SRS Final for Approval v1.0 (pending sign-off) and Architecture Diagrams v1.0. Physical design is a proposed extension. UUID PK, timestamptz UTC, schema ownership and check constraints are implemented in `database/001_core.sql`. R3 tables are in `database/002_r3_services.sql` and MUST be deployed into two separate databases.

## R1 Core entity relationships

```mermaid
erDiagram
  USERS ||--o{ AUTH_IDENTITIES : has
  USERS ||--o{ REFRESH_SESSIONS : has
  USERS ||--o{ USER_ROLES : assigned
  ROLES ||--o{ USER_ROLES : includes
  ROLES ||--o{ ROLE_PERMISSIONS : grants
  PERMISSIONS ||--o{ ROLE_PERMISSIONS : included
  USERS ||--o{ INTERVIEW_SESSIONS : starts
  RUBRIC_VERSIONS ||--o{ INTERVIEW_SESSIONS : pins
  AI_CONFIG_VERSIONS ||--o{ INTERVIEW_SESSIONS : pins
  INTERVIEW_SESSIONS ||--o{ SESSION_QUESTIONS : contains
  QUESTION_BANK o|--o{ SESSION_QUESTIONS : sources
  SESSION_QUESTIONS ||--o{ ANSWERS : receives
  ANSWERS ||--o| EVALUATION_JOBS : queues
  EVALUATION_JOBS ||--o| FEEDBACK : produces
  ANSWERS ||--o| FEEDBACK : assessed
  RUBRIC_VERSIONS ||--o{ FEEDBACK : versioned
  AI_CONFIG_VERSIONS ||--o{ FEEDBACK : versioned
  FEEDBACK ||--o{ APPEALS : appealed
  USERS ||--o{ CONSENT_EVENTS : records
  USERS ||--o{ PROCESSING_NOTICES : acknowledges
  USERS ||--o{ DATA_RIGHTS_REQUESTS : submits
  USERS ||--o{ CONTACT_DETAILS : owns
  ANSWERS ||--o{ AUDIO_OBJECTS : attaches_R2
  ANSWERS ||--o| SPEECH_METRICS : extracts_R2
  USERS ||--o{ IDEMPOTENCY_KEYS : requests

  USERS { uuid id PK; citext email UK; text account_status; timestamptz deleted_at }
  AUTH_IDENTITIES { uuid id PK; uuid user_id FK; text provider; text provider_subject }
  REFRESH_SESSIONS { uuid id PK; uuid user_id FK; text token_hash UK }
  ROLES { uuid id PK; text code UK }
  USER_ROLES { uuid user_id PK,FK; uuid role_id PK,FK }
  PERMISSIONS { uuid id PK; text code UK }
  ROLE_PERMISSIONS { uuid role_id PK,FK; uuid permission_id PK,FK }
  RUBRIC_VERSIONS { uuid id PK; text rubric_key; text version; jsonb criteria }
  AI_CONFIG_VERSIONS { uuid id PK; text config_key; text version; text prompt_hash }
  QUESTION_BANK { uuid id PK; text stable_key; int version; text question_text }
  INTERVIEW_SESSIONS { uuid id PK; uuid user_id FK; uuid rubric_version_id FK; uuid ai_config_version_id FK }
  SESSION_QUESTIONS { uuid id PK; uuid session_id FK; uuid question_bank_id FK; int sequence_no }
  ANSWERS { uuid id PK; uuid question_id FK; int attempt_number; text answer_text }
  EVALUATION_JOBS { uuid id PK; uuid answer_id FK,UK; text state }
  FEEDBACK { uuid id PK; uuid job_id FK,UK; uuid answer_id FK,UK; numeric score }
  APPEALS { uuid id PK; uuid feedback_id FK; uuid user_id FK }
  CONSENT_EVENTS { uuid id PK; uuid user_id FK; text purpose_key; text action }
  PROCESSING_NOTICES { uuid id PK; uuid user_id FK; text purpose_key }
  DATA_RIGHTS_REQUESTS { uuid id PK; uuid user_id FK; text request_type }
  CONTACT_DETAILS { uuid id PK; uuid user_id FK; bytea encrypted_value }
  AUDIO_OBJECTS { uuid id PK; uuid answer_id FK; text storage_key }
  SPEECH_METRICS { uuid answer_id PK,FK; numeric pace_wpm }
  IDEMPOTENCY_KEYS { text scope PK; uuid actor_id PK,FK; text key PK }
```

`platform.outbox_events`, `platform.inbox_events`, and `platform.audit_log` deliberately use loose aggregate IDs: the event bus never defines a physical cross-domain FK; validation belongs to the writer. Their ER relationships are event-based, not referential.

## R3 Billing ERD (independent billing database)

```mermaid
erDiagram
  PACKAGES ||--o{ PACKAGE_ENTITLEMENTS : defines
  PACKAGES ||--o{ SUBSCRIPTIONS : provisions
  SUBSCRIPTIONS ||--o{ TRANSACTIONS : billed_by
  TRANSACTIONS ||--o{ REFUND_REQUESTS : may_refund
  PACKAGES { uuid id PK; text tier; int version; bigint price_minor }
  PACKAGE_ENTITLEMENTS { uuid package_id PK,FK; text feature_key PK; bigint quota_limit }
  SUBSCRIPTIONS { uuid id PK; uuid user_id; uuid package_id FK }
  TRANSACTIONS { uuid id PK; uuid subscription_id FK; bigint amount_minor }
  REFUND_REQUESTS { uuid id PK; uuid transaction_id FK; uuid user_id }
  USAGE_LEDGER { uuid id PK; uuid user_id; text request_key UK }
  PAYMENT_EVENTS { uuid id PK; text provider; text external_event_id }
```

`billing.user_id` is an identity reference validated via service contract and synchronization, **not** an FK into Core. `USAGE_LEDGER` is a separate append-only accounting stream. Atomic quota enforcement requires a serializable transaction or per-user/period counter lock and a unique request key; do not implement `SELECT SUM` then blind `INSERT` under Read Committed.

## R3 Research ERD (independent research database)

```mermaid
erDiagram
  DATASETS ||--o{ AGGREGATE_ROWS : contains
  DATASETS ||--o{ ACCESS_LOG : audits
  DATASETS { uuid id PK; text purpose_key; text state }
  AGGREGATE_ROWS { uuid id PK; uuid dataset_id FK; int distinct_users; bool suppressed }
  ACCESS_LOG { uuid id PK; uuid dataset_id FK; uuid researcher_id; text decision }
```

Research receives **only approved aggregates**, never raw Core data or audio. Exports are generated through a privileged purpose-scoped release pipeline. Counts >=10 are necessary but insufficient: complementary suppression, differencing checks and privacy review remain mandatory. Researcher's account never gets SELECT on Core raw tables.

## Lifecycle & enforced invariant checklist

- `answer + evaluation.jobs + outbox_events + idempotency_keys` must commit in **one database transaction**; outbox publisher retries; worker deduplicates by job and inbox event.
- No synchronous LLM request inside database transaction. Validate model output server-side against pinned rubric/config IDs.
- R1 has no voice or payment runtime dependencies. R2 adds temporary encrypted audio, signed upload, separate voice-retention consent, and purge worker.
- Account deletion uses verifiable application workflows and bounded retention; avoid unconditional cascading destruction of audit/payment legal records.
- Consent events are append-only; permissions to change data and retention should be separate from user access. `service_core` uses a documented lawful basis/notice, not forced consent.
- Published rubric/config/question versions are immutable by policy; implement DB trigger/restricted privileges in hardening migrations.
- Store payment values in integer minor currency units, never floating point.
- Indexes shown in SQL are starting points: validate with EXPLAIN (ANALYZE, BUFFERS) against representative synthetic data.
- Enable least-privilege role grants, RLS defense-in-depth on appropriate sensitive tables, and `FORCE ROW LEVEL SECURITY` as necessary; NEVER imply RLS alone authorizes research release.
