# InterviewX — Phase 1: Requirement Alignment Change Log
**Document Version:** 1.1 DRAFT  
**Date:** 13 November 2026  
**Status:** Controlled Document • Pending Stakeholder Approval  
**Role:** Senior Business Analyst, System Analyst, Software Architect, Technical Documentation Specialist

---

## 1. Executive Summary

This Change Log documents the comprehensive review, revision, and consistency alignment completed under **Phase 1 — Requirement Alignment** for the InterviewX platform. 

The primary objective of Phase 1 is to establish a rigorous, implementation-ready specification that clearly distinguishes between two separate client application frontends:
1. **Responsive Web Application:** Serving Desktop, Tablet, and Mobile Browser users across all system roles (Guest, Registered User, Researcher, Payment/Finance Admin, System Admin).
2. **Native Mobile Application:** Separately installable native applications for Apple iOS and Google Android, designed exclusively for End Users (Guest, Registered User) across Free, Basic, and Pro subscription entitlement tiers.

Both platforms are architecturally decoupled from administrative back-offices and communicate exclusively with a unified **Shared Backend Architecture** via secure, authorized HTTPS REST APIs.

---

## 2. Documents Reviewed and Deliverables Produced

### 2.1 Primary Source Documents Analyzed
1. `InterviewX_SRS_Final_For_Approval_v1.0.docx` (and markdown baseline `.md`)
2. `InterviewX_FR_NFR_RBAC.xlsx` (and CSV sheets: FR, NFR, RBAC)
3. `ALL_DIAGRAMS.md` (19 architectural diagrams)
4. `InterviewX Requirement Survey Form (การตอบกลับ) - การตอบแบบฟอร์ม 1.csv` (n=102 respondents)

### 2.2 Phase 1 Updated Deliverables Generated
| Deliverable Artifact | File Path | Version | Status |
|---|---|---|---|
| **Updated SRS Document** | `03_SRS_Requirements/InterviewX_SRS_v1.1_DRAFT.docx` | v1.1 DRAFT | Proposed Revision — Pending Sign-off |
| **Updated SRS Markdown** | `03_SRS_Requirements/InterviewX_SRS_v1.1_DRAFT.md` | v1.1 DRAFT | Proposed Revision — Pending Sign-off |
| **Updated FR/NFR/RBAC Workbook** | `03_SRS_Requirements/InterviewX_FR_NFR_RBAC_v1.1_DRAFT.xlsx` | v1.1 DRAFT | Proposed Revision — Pending Sign-off |
| **Updated Architecture Diagrams** | `04_System_Architecture/InterviewX_Final_System_Diagrams_v1.0/ALL_DIAGRAMS_v1.1_DRAFT.md` | v1.1 DRAFT | Proposed Revision — Pending Sign-off |
| **Requirement Traceability Matrix** | `03_SRS_Requirements/InterviewX_Phase1_Requirement_Traceability.xlsx` | v1.1 DRAFT | Proposed Baseline — Pending Sign-off |
| **Decision Register (Standalone)** | `03_SRS_Requirements/InterviewX_Phase1_Decision_Register.xlsx` | v1.1 DRAFT | Pending Confirmation (11 Decisions) |
| **Phase 1 Change Log** | `InterviewX_Phase1_Change_Log.md` | v1.1 DRAFT | Final Deliverable |

---

## 3. Platform Scope and Architecture Separation

### 3.1 Web Application Scope
- **Client Technology:** Next.js with TypeScript and Tailwind CSS.
- **Form Factors:** Responsive layouts optimized for Desktop (≥1024px), Tablet (768px–1023px), and Mobile Browser (360px–767px).
- **Supported User Roles:**
  - `guest`: Public discovery, landing page, trial practice session.
  - `user`: Candidate interview practice, evaluation feedback, history, personal profile.
  - `researcher`: Governed aggregate research queries and differential privacy exports (R3).
  - `finance_admin`: Revenue reconciliation, package versioning, refund request processing (R3).
  - `system_admin`: AI prompt/rubric configuration, Question Bank curation, immutable audit log.
- **Administrative Boundary:** Administrative and research functionalities remain strictly accessible through the Web Application.

### 3.2 Native Mobile Application Scope
- **Client Technology:** Separately installable native applications for iOS and Android (Recommended: React Native / Expo per D-M02).
- **Target Audience:** End Users only (`guest` and `user`).
- **Subscription Tiers Supported:** Free, Basic, Pro (governed by backend entitlements).
- **Architectural Boundary:** Native Mobile is treated as a distinct client frontend, NOT Responsive Web or PWA. All internal administrative, finance, and researcher interfaces are completely out-of-scope for Native Mobile.

### 3.3 Shared Backend Architecture
- Both Web and Native Mobile applications connect to a unified backend cluster:
  - **NestJS Modular Monolith:** Core business logic, authentication, RBAC, session orchestration, entitlement validation, outbox event bus.
  - **FastAPI AI Service:** Stateless Python inference engine executing rubric scoring and speech analytics.
  - **PostgreSQL Database:** Single authoritative source of truth for structured relational data.
  - **Redis / BullMQ:** Asynchronous evaluation queue and job deduplication.
  - **Object Storage (MinIO / S3):** Encrypted temporary audio chunk storage.
- **Rule of Architecture:** Zero database duplication and zero business logic duplication between Web and Mobile. All client-to-backend communication traverses authorized HTTPS REST APIs with TLS 1.3.

---

## 4. Detailed Modifications by Document

### 4.1 Document A — Software Requirements Specification (SRS)
- **Metadata & Governance:** Updated document version to `1.1 DRAFT`, baseline date to `13 November 2026`, and updated governance notices.
- **Section 1 (Introduction & Governance):**
  - Updated product definition to explicitly govern both Responsive Web and Native Mobile applications.
  - Added definitions: HIG, IAP, APNs, FCM, Keystore, Keychain, Platform Scope.
- **Section 2 (Evidence & Stakeholders):**
  - Detailed cross-platform survey analysis: 84/102 (82.4%) respondents requested access via both Web and Mobile.
  - Clarified architectural roadmap: R1 baseline established on Responsive Web, while Phase 1 establishes the formal architecture and requirement specifications for the Native Mobile application.
- **Section 3 (Scope, Assumptions & Release Plan):**
  - Updated Table 3 (Scope Breakdown) with distinct platform scope columns for Web Application and Native Mobile Application across R1, R2, and R3.
  - Added 5 system assumptions regarding mobile token storage, mobile network latency, offline boundaries, and App Store compliance.
- **Section 4 (System Context & Use Cases):**
  - Updated Table 4 (Use Cases UC01–UC10) annotating platform availability (Web & Mobile vs. Web Only).
- **Section 5 (Functional Requirements):**
  - Retained all 40 requirements with original IDs.
  - Annotated each requirement with explicit `[ Platform: ... ]` classification tags.
  - **FR15 Revision:** Completely revised to `FR15 — Multi-Platform Access & Consistency (Responsive Web & Native Mobile)`. Formulated 7 testable, measurable criteria labeled as `Proposed Acceptance Criteria — Pending Approval`.
- **Section 6 (Non-Functional Requirements):**
  - **NFR08 Revision:** Revised to `Cross-Platform Accessibility & Consistency`, establishing explicit targets for Web (WCAG 2.2 AA), iOS (VoiceOver/Dynamic Type), Android (TalkBack), and 100% data consistency. Marked as `Proposed Targets — Pending Approval`.
  - Annotated NFR01 (Token storage in Keychain/Keystore), NFR04 (Mobile network P95 ≤ 2.5s, cold start ≤ 2.0s), NFR09 (Local mobile audio cache purge), and NFR19 (Server-side mobile authorization).
- **Section 7 (Role, Authorization & Entitlements):**
  - Added narrative distinguishing Role, Subscription Entitlement, and Platform Scope.
  - Added **Platform Access Matrix (Role × Platform)**.
  - Added **Subscription Entitlement Matrix (Tier × Platform)**.
  - Added **7 Core Architectural Authorization Rules**.
- **Section 8 (AI Layer & Evaluation):**
  - Added explicit notice that AI evaluation runs strictly server-side; zero on-device LLM on mobile in R1/R2.
- **Section 9 (Privacy, Consent & Research Data):**
  - Added mobile local storage privacy rules and App Store compliance notes (in-app deletion).
- **Section 10 (Package, Payment & Refund Governance):**
  - Added mobile payment architecture analysis (In-App Purchase vs. Web Checkout redirect per D-M04).
- **Section 11 (Data Model & Data Dictionary):**
  - Added `client_platform` tracking in `REFRESH_SESSIONS` and `INTERVIEW_SESSIONS`, `channel` in `TRANSACTIONS`, and noted proposed `USER_DEVICES` schema.
- **Section 12 (Architecture, Interfaces, Operations):**
  - Added platform architecture diagram and **Cross-Platform Data Synchronization Matrix** (8 data categories).
- **Section 13 (Traceability & Verification):**
  - Updated test methodology to include Multi-Device E2E Matrix testing.
- **Section 14 (Risks, Decisions & Approval Conditions):**
  - Integrated **Mobile Decision Register (D-M01 to D-M11)**.
- **Change Log:**
  - Added entry for Version 1.1 DRAFT.

### 4.2 Document B — FR_NFR_RBAC Workbook (`InterviewX_FR_NFR_RBAC_v1.1_DRAFT.xlsx`)
- **Preserved Existing Sheets:** `FR`, `NFR`, `RBAC` (maintaining 100% of original rows, IDs, and numbering).
- **Sheet `FR` Updates:**
  - Updated Row 20 (FR15) to `Multi-Platform Access & Consistency (Responsive Web & Native Mobile)` with updated summary.
  - Added Column D (`Platform Scope`) across R1, R2, and R3 classifying every requirement into `Shared Web & Mobile`, `Web Only (Admin Only)`, `Shared (User) / Web (Admin)`, or `Shared (Backend Service)`.
- **Sheet `NFR` Updates:**
  - Updated Row 36 (NFR08) to `Cross-Platform Accessibility & Consistency` with detailed targets.
  - Added Column D (`Platform Target & Mobile Considerations`) detailing platform-specific quality targets for all 24 NFRs.
- **Sheet `RBAC` Updates:**
  - Updated Row 18 (FR15) reflecting that Guest and User have full platform access, whereas Researcher, Finance Admin, and System Admin are conditioned on `Web Only`.
  - Added extensive footnote clarifying the platform boundary.
- **New Worksheets Added:**
  1. `Platform_Access_Matrix`: Dedicated Role × Platform matrix.
  2. `Subscription_Matrix`: Dedicated Subscription Tier × Platform matrix + 7 Core Authorization Rules.
  3. `Mobile_Scope`: Complete classification of 17 In-Scope modules, 7 Out-of-Scope modules, and 6 Pending Decision modules.
  4. `Data_Synchronization`: Cross-platform data synchronization specification across 8 data categories.
  5. `Decision_Register`: Copy of Decisions D-M01 through D-M11.
  6. `Change_Log`: Audit trail of workbook revisions.

### 4.3 Document C — Architecture Diagrams (`ALL_DIAGRAMS_v1.1_DRAFT.md`)
- **Preserved Diagram IDs and Mermaid Syntax:** Retained all 19 diagrams (D01 through D19).
- **Updated Diagrams:**
  - **D01 (System Context):** Separated into End Users vs. Internal Roles; Web Application vs. Native Mobile Application connecting to Shared Backend Platform.
  - **D02 (C4 Containers):** Included both `Browser (Next.js Responsive Web)` and `Mobile (Native Mobile App)` connecting via Edge/WAF to `API (NestJS Core API)`.
  - **D06 (API Trust):** Shows Web and Mobile as untrusted clients connecting through WAF to Core API with Platform & RBAC Gate.
  - **D07 (Text Interview Sequence):** Client participant represented as `Client App (Web / Native Mobile)` utilizing unified `Idempotency-Key` submission.
  - **D11 (Voice Sequence R2):** Clarified audio capture via Web Audio API vs. Native Mobile Audio Bridge, with local cache purging.
  - **D14 (Managed Production):** Shows Internet Users accessing via Web Hosting and Mobile App Stores through WAF to Core API.
  - **D18 (Repo Boundaries):** Added `mobile (React Native / Native App - D-M02)` to `apps/` monorepo structure sharing backend contracts.
  - **D19 (Release Roadmap):** Aligned Native Mobile application to R2 milestone alongside Voice practice (D-M01).

---

## 5. Inconsistencies and Conflicts Resolved

| # | Conflict Identified in Source Documents | Analysis & Root Cause | Explicit Resolution Proposed in Phase 1 | Approval Status |
|---|---|---|---|---|
| **C01** | Survey indicated 84/102 wanted Web & Mobile, but SRS v1.0 Section 3 listed Native App under 'Out-of-Scope' for R1. | R1 MVP focused on rapid Web launch, leaving Mobile undefined or postponed as an informal 'extension'. | Formally establish Native Mobile Application as an approved first-class client frontend sharing the backend. Plan implementation milestone in R2 (D-M01) while building R1 backend APIs to be mobile-ready from Day 1. | Proposed Resolution — Pending Approval |
| **C02** | Confusion between Security Roles and Subscription Entitlements (Free, Basic, Pro). | Previous documents occasionally conflated subscription tiers with RBAC roles. | Explicitly enforce Architectural Rule 2: Free, Basic, and Pro are billing entitlements and usage quotas, NOT roles. All subscribers hold security role `user`. | Approved Architectural Principle |
| **C03** | Potential security bypass if Admin/Researcher accounts logged in via mobile devices. | Mobile client scope was undefined, creating risk of partial or insecure admin feature exposure on mobile. | Enforce Architectural Rule 1 & Platform Access Matrix: Researcher, Finance Admin, and System Admin routes are completely blocked on Native Mobile. If an admin logs into mobile, they receive only standard candidate end-user capabilities. | Approved Architectural Boundary |
| **C04** | Undefined offline mock interview behavior and data loss risk on mobile cellular drops. | Mobile network connections are inherently transient compared to wired/desktop web. | Establish clear boundary in D-M08 & FR33: AI mock interview practice is Online-Required. Mobile app implements transient client-side draft caching and exponential backoff retry with `Idempotency-Key`. | Proposed Resolution — Pending Approval |
| **C05** | Ambiguity regarding mobile digital subscription purchases and App Store commissions (15–30%). | SRS v1.0 only mentioned Web payment gateways (Omise/2C2P), ignoring Apple/Google Store policies. | Register formal decision D-M04: Evaluate initial hybrid Web Checkout redirect vs. native StoreKit/Play Billing, balancing gross margin impact against App Store Review Guidelines. | Pending Confirmation (D-M04) |

---

## 6. Mobile Decision Register Summary

| ID | Decision Item | Description & Trade-offs | Recommended Option | Owner | Status |
|---|---|---|---|---|---|
| **D-M01** | Native Mobile Release Timeline | Staged release in R2 vs. simultaneous R1 release vs. R3. | Target R2 release alongside Voice & Progress features. Solidifies Core API first. | Product Owner / Tech Lead | Pending Confirmation |
| **D-M02** | Mobile Framework Selection | React Native / Expo vs. Flutter vs. Native Swift/Kotlin. | React Native / Expo to reuse TypeScript skillset and backend Zod schemas. | Tech Lead / Mobile Architect | Pending Confirmation |
| **D-M03** | Minimum Supported OS Versions | iOS 16.0+ & Android 13.0+ vs. legacy OS support. | iOS 16+ & Android 13+ (API 33) for hardware security and modern audio APIs. | QA Lead / Mobile Architect | Pending Confirmation |
| **D-M04** | Mobile Payment Architecture | In-App Purchase (StoreKit/Play) vs. Web Checkout redirect. | Hybrid Web Checkout initial release with App Store compliance review; prepare IAP. | Finance Admin / Legal | Pending Confirmation |
| **D-M05** | Push Notifications Scope | Remote push notifications (APNs / FCM) infrastructure. | Implement APNs/FCM worker in R2 for practice reminders and feedback alerts. | Product Owner / Backend Lead | Pending Confirmation |
| **D-M06** | Biometric Authentication | Biometric unlock (Face ID / Touch ID / Fingerprint). | Client-side enhancement to unlock stored refresh token in OS Keychain. | Security Lead / Mobile Lead | Pending Confirmation |
| **D-M07** | Deep Linking & Universal Links | iOS Universal Links & Android App Links. | Configure `apple-app-site-association` and `assetlinks.json` for auth and sessions. | Frontend Lead / Mobile Lead | Pending Confirmation |
| **D-M08** | Offline Mode Scope | Online-required AI practice vs. full offline local models. | Online-required for AI evaluation; client resilience caches draft answers during drops. | Software Architect / AI Lead | Pending Confirmation |
| **D-M09** | Feature Parity Strategy | End-user feature parity between Web and Mobile. | 100% feature parity for released end-user modules; Admin/Research strictly Web-only. | Product Owner / QA Lead | Pending Confirmation |
| **D-M10** | App Store Policy Compliance | Compliance with Apple/Google guidelines (In-app deletion). | Full compliance package: in-app deletion (FR35), mic consent, privacy labels. | Privacy Officer / Legal | Pending Confirmation |
| **D-M11** | Mobile Audio Streaming Protocol | Chunked HTTPS upload vs. WebSocket / WebRTC streaming. | Chunked HTTPS upload to signed URLs for robust cellular performance in R2. | Tech Lead / AI Lead | Pending Confirmation |

---

## 7. Requirement Traceability Validation

A complete cross-document verification was conducted across the updated artifacts:
1. **FR ID Integrity:** Every FR ID (FR01 through FR36, including FR05-V, FR05.1, FR18.1, FR32.1) in the revised SRS matches the `FR` worksheet in `InterviewX_FR_NFR_RBAC_v1.1_DRAFT.xlsx` and the `Requirement Traceability` matrix. Zero requirements were deleted or renumbered.
2. **NFR ID Integrity:** Every NFR ID (NFR01 through NFR24) in the revised SRS matches the `NFR` worksheet and Traceability matrix.
3. **Role Naming Consistency:** Security role names (`guest`, `user`, `researcher`, `finance_admin`, `system_admin`) are identical across SRS Section 7, the RBAC worksheet, the Platform Access Matrix, and Architecture diagrams D01, D06, and D09.
4. **Subscription Tier Consistency:** `Free`, `Basic`, and `Pro` are consistently classified as subscription entitlement tiers across all documents.
5. **Platform Boundaries:** Admin and Researcher portals are consistently documented as Web-only in the SRS, RBAC sheet, Platform Access Matrix, Mobile Scope sheet, and diagrams D01, D02, D06, and D13.
6. **Traceability Matrix:** Generated and verified at `InterviewX_Phase1_Requirement_Traceability.xlsx` containing 64 verified rows (40 FRs + 24 NFRs).

---

## 8. Remaining Gaps and Phase 2 Handoff

The following technical and business items remain open for resolution in subsequent phases:
1. **Formal Stakeholder Sign-Off:** Formal signatures on `InterviewX_SRS_v1.1_DRAFT.docx` and the Decision Register from Product Owner, Technical Lead, Privacy Officer, and Sponsor.
2. **OpenAPI Client SDK Generation (Phase 2):** Compilation of OpenAPI 3.1 specification contracts into TypeScript client SDKs for Next.js and the mobile application.
3. **App Store Legal Assessment (D-M04):** Formal legal review of Apple App Store Review Guidelines Section 3.1.3 (Reader Apps / Multiplatform Services) to finalize whether Web Checkout links are permissible for InterviewX in Thailand and global markets.
4. **Mobile UX Wireframes:** Delivery of high-fidelity Figma mockups for Native Mobile screens based on the 17 In-Scope modules defined in `Mobile_Scope`.
5. **Cellular Field Testing:** Establishment of latency and audio packet loss benchmarks under simulated 3G/4G/5G throttling to validate NFR04 and NFR12.

---

> **End of Phase 1 Change Log**  
> InterviewX System Documentation Baseline v1.1 DRAFT | Prepared for Stakeholder Review