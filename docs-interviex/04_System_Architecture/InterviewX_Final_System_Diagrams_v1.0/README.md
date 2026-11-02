# InterviewX — Final System Diagram Set v1.0

**Design baseline:** 2026-10-08 | **Status:** Proposed final design, NOT approved or deployed.

## Authority and scope

Based on `InterviewX_SRS_Final_For_Approval_v1.0.docx`, `InterviewX_Architecture_Diagrams_v1.0.md`, and `InterviewX_Design_Package_v1.0.zip`. If the SRS is not signed, these are design proposals, not approved requirements. R1: responsive web, text interview, AI evaluation, identity, privacy and admin. R2: voice/STT, speech indicators, dashboard and enhancements. R3: billing and research in independent services/databases. The Kubernetes environment is synthetic-only demonstration, not production mirror with real users' data.

## Diagrams

| ID | Diagram | Purpose |
|---|---|---|
| D01 | System context | Actors and external dependencies |
| D02 | C4 containers and release scope | Core, AI, optional services |
| D03 | Bounded contexts and responsibility | Ownership and dependency rules |
| D04 | Core physical ERD | R1 and R2-ready tables |
| D05 | R3 physical ERD | Billing/Research independent stores |
| D06 | API and trust boundaries | External vs internal contracts |
| D07 | Text interview sequence | Atomic persistence, async evaluation |
| D08 | Evaluation state machine | Worker retries and no fabricated feedback |
| D09 | Identity and authorization | RBAC, ownership, consent and entitlements |
| D10 | Privacy lifecycle | Notice, consent, export/deletion, voice retention |
| D11 | R2 voice sequence | Permission, temp audio, STT and retention choice |
| D12 | R3 payment sequence | Webhook verification and async fulfillment |
| D13 | R3 research release | Consent/legal basis, suppression, auditing |
| D14 | Managed production | Operational network/service deployment |
| D15 | Kubernetes showcase | Synthetic-only sandbox cluster |
| D16 | CI/CD and GitOps | Signed immutable OCI digest promotion |
| D17 | Observability and recovery | OTel and restore drill |
| D18 | Monorepo dependency architecture | Package/interface boundaries |
| D19 | Release roadmap | Feature gates and independence |

Each `diagrams/Dxx_*.mmd` file is a standalone Mermaid source. `ALL_DIAGRAMS.md` collects all diagrams for review.

## Important invariants

1. **Single ownership:** Core data changes originate in the owning NestJS module; worker writes evaluation status/results through its sanctioned persistence adapter. AI FastAPI only receives scoped task payloads and never connects to Core Postgres.
2. **Exactly-once business effect:** submit answer, evaluation job, idempotency record and outbox event atomically; queue delivery is at-least-once, consumers dedupe.
3. **Strong boundaries:** R3 Billing and Research have independent Postgres credentials and databases; no cross-service FK or direct SQL access to Core tables. Read grants are purpose-scoped.
4. **Privacy:** research_contact != research_analysis != voice_retention; service_core processing requires declared lawful basis/notice, not bundled optional consent. Researcher never queries raw Core tables.
5. **Deployment parity:** managed production and showcase can share *built image digest* but never data, domains, credentials or operational secrets.
6. **Scope:** R1 cannot require active R2/R3 services. Voice, payments, research and native mobile require separately approved scope.

## Traceability

- R1 Identity: FR01/02, FR17, FR32/35 → D03/04/06/09/10
- R1 Interview+feedback: FR04/05/08/11/14/33/34/36 → D02/04/07/08
- R2 AI/voice: FR05-V/05.1/09/10/13/16 → D10/11
- R3 billing: FR19–31 → D05/12
- R3 research: FR18/18.1/32.1 → D05/13
- NFR01/04/05/09/17–24 → D06/09/10/13–17

**Outstanding decisions:** sign-off, retention time and lawful basis, R3 prices/gateway/refunds, research release policy, final internal service-auth mode, topology sizing, production thresholds and provider spend. Diagram labels show planned controls, not already validated controls.
