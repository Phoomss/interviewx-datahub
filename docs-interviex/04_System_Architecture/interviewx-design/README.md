# InterviewX — Physical ERD + OpenAPI + Repository Design (draft v1.0)

**Status:** engineering proposal mapped to `InterviewX_SRS_Final_For_Approval_v1.0` (pending stakeholder sign-off) and `InterviewX_Architecture_Diagrams_v1.0`.

Files:
- `database/001_core.sql`: R1 physical PostgreSQL schema, with R2-ready voice tables
- `database/002_r3_services.sql`: Billing and Research independent database schemas; deploy them in separate DBs
- `docs/physical-erd.md`: Mermaid ERDs, physical data boundaries, invariants
- `contracts/public-v1.openapi.yaml`: client REST contract (release-tagged)
- `contracts/internal-evaluation.openapi.yaml`: worker→AI FastAPI contract
- `repo/REPOSITORY_STRUCTURE.md`: monorepo tree, ownership, dependency direction

These are **design starter artifacts, not a complete production-ready implementation**. Add production-grade migration tooling, granular roles and RLS policies, session transaction implementation, data lifecycle workers, exact API gateway/webhook contract, event JSON schemas, exception telemetry, PII encryption KMS, and contract/e2e tests before deployment. The public OpenAPI represents the external gateway contract; R3 billing/research are separate deployables, not shared Prisma modules.

## Key decisions needing approval

1. R1 auth token transport and refresh rotation / email verification flow.
2. R1 single interview category set and session completion transition rules.
3. Voice retention limits, lawful basis mapping and encryption key lifecycle (R2).
4. Billing provider, pricing, quotas, refund policy, provider webhook contract (R3).
5. Research purpose, approval workflow, suppression methodology (R3).
6. Final UI/API versioning and HTTP error standard, traffic and load budget.

## Traceability samples

| FR | Endpoint | Tables | Tests to write |
|---|---|---|---|
| FR01 | POST /auth/register, /auth/login | identity.users, auth_identities, refresh_sessions | auth/revocation/rate-limit |
| FR04 | POST /interviews | interview.sessions, session_questions, content.question_bank | category accuracy and ownership |
| FR05/FR33 | POST /interviews/{id}/answers | interview.answers, evaluation.jobs, platform.idempotency_keys, outbox_events | retry once, no duplicates |
| FR08/FR11/FR36 | GET /evaluations/{jobId}, POST /feedback/{id}/appeals | evaluation.feedback, appeals, jobs | scoring schema/failure/appeal |
| FR14 | GET/DELETE /interviews/{id} | interview.sessions + cascade workflow | history/IDOR/deletion |
| FR17/FR35 | /privacy/consents, /privacy/data-requests | privacy.consent_events, data_rights_requests | revoke/export/access |
| FR34/FR32 | /admin/content/... | content.* , platform.audit_log | role publish + audit |
| FR20/FR23/FR27 | /billing/... | billing.* | atomic quota, webhook replay, refund separation |
| FR18.1/FR32.1 | /research/datasets | research.datasets, access_log | no raw SELECT, suppression, denied log |
