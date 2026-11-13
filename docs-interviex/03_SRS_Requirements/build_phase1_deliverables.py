import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Color palette
NAVY_HEADER = "1E3A8A"
SLATE_HEADER = "0F172A"
BLUE_ACCENT = "2563EB"
LIGHT_BLUE = "EFF6FF"
ZEBRA_FILL = "F8FAFC"
WHITE = "FFFFFF"
BORDER_COLOR = "CBD5E1"
STATUS_PENDING_FILL = "FEF3C7"
STATUS_PENDING_FONT = "B45309"
STATUS_APPROVED_FILL = "DCFCE7"
STATUS_APPROVED_FONT = "15803D"
STATUS_PROPOSED_FILL = "E0E7FF"
STATUS_PROPOSED_FONT = "3730A3"
CALLOUT_FILL = "F1F5F9"

thin_border = Border(
    left=Side(style='thin', color=BORDER_COLOR),
    right=Side(style='thin', color=BORDER_COLOR),
    top=Side(style='thin', color=BORDER_COLOR),
    bottom=Side(style='thin', color=BORDER_COLOR)
)

header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
header_fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
sub_header_fill = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
zebra_fill = PatternFill(start_color=ZEBRA_FILL, end_color=ZEBRA_FILL, fill_type="solid")
white_fill = PatternFill(start_color=WHITE, end_color=WHITE, fill_type="solid")

def style_header_row(ws, row_idx, max_col, fill=header_fill, height=28):
    for col in range(1, max_col + 1):
        cell = ws.cell(row=row_idx, column=col)
        cell.font = header_font
        cell.fill = fill
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = thin_border
    ws.row_dimensions[row_idx].height = height

def format_data_cell(cell, is_zebra=False, font_size=10, bold=False, color="1E293B", align="left", valign="center", wrap=True):
    cell.font = Font(name="Segoe UI", size=font_size, bold=bold, color=color)
    cell.fill = zebra_fill if is_zebra else white_fill
    cell.alignment = Alignment(horizontal=align, vertical=valign, wrap_text=wrap)
    cell.border = thin_border

def style_status_cell(cell, status_text):
    text = str(status_text)
    if "Pending" in text or "Wait" in text:
        cell.fill = PatternFill(start_color=STATUS_PENDING_FILL, end_color=STATUS_PENDING_FILL, fill_type="solid")
        cell.font = Font(name="Segoe UI", size=10, bold=True, color=STATUS_PENDING_FONT)
    elif "Approved" in text or "Yes" in text or "ทำได้" in text:
        cell.fill = PatternFill(start_color=STATUS_APPROVED_FILL, end_color=STATUS_APPROVED_FILL, fill_type="solid")
        cell.font = Font(name="Segoe UI", size=10, bold=True, color=STATUS_APPROVED_FONT)
    elif "Proposed" in text or "Draft" in text or "Specified" in text:
        cell.fill = PatternFill(start_color=STATUS_PROPOSED_FILL, end_color=STATUS_PROPOSED_FILL, fill_type="solid")
        cell.font = Font(name="Segoe UI", size=10, bold=True, color=STATUS_PROPOSED_FONT)
    elif "No" in text or "ไม่ได้" in text or "Denied" in text:
        cell.fill = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
        cell.font = Font(name="Segoe UI", size=10, bold=True, color="B91C1C")
    else:
        cell.fill = white_fill
        cell.font = Font(name="Segoe UI", size=10, color="1E293B")
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = thin_border

def auto_fit_columns(ws, min_col=1, max_col=None, max_width=60, explicit_widths=None):
    if max_col is None:
        max_col = ws.max_column
    for col in range(min_col, max_col + 1):
        col_letter = get_column_letter(col)
        if explicit_widths and col in explicit_widths:
            ws.column_dimensions[col_letter].width = explicit_widths[col]
            continue
        max_len = 0
        for cell in ws[col_letter]:
            val_str = str(cell.value or '')
            if '\n' in val_str:
                lines = val_str.split('\n')
                max_len = max(max_len, max(len(l) for l in lines))
            else:
                max_len = max(max_len, len(val_str))
        ws.column_dimensions[col_letter].width = min(max(max_len + 4, 12), max_width)

# ==============================================================================
# 1. BUILD DECISION REGISTER EXCEL
# ==============================================================================
def build_decision_register_workbook(out_path):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Decision_Register"
    
    # Title Block
    ws.merge_cells("A1:I1")
    title_cell = ws["A1"]
    title_cell.value = "InterviewX — Phase 1 Requirement Alignment: Decision Register"
    title_cell.font = Font(name="Segoe UI", size=14, bold=True, color="FFFFFF")
    title_cell.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    title_cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[1].height = 36
    
    ws.merge_cells("A2:I2")
    sub_cell = ws["A2"]
    sub_cell.value = "Document Version: 1.1 DRAFT | Baseline Date: 13 November 2026 | Status: Pending Stakeholder Approval"
    sub_cell.font = Font(name="Segoe UI", size=10, italic=True, color="475569")
    sub_cell.fill = PatternFill(start_color=CALLOUT_FILL, end_color=CALLOUT_FILL, fill_type="solid")
    sub_cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[2].height = 22

    headers = [
        "Decision ID", "Category", "Decision Item", "Technical / Business Description",
        "Options Under Consideration", "Impact & Dependencies", "Recommended Option",
        "Decision Owner", "Status"
    ]
    
    ws.append([]) # row 3 blank
    ws.append(headers) # row 4
    style_header_row(ws, 4, len(headers), height=28)
    
    decisions = [
        ("D-M01", "Architecture / Release", "Native Mobile Release Timeline & Gate",
         "Define the formal delivery milestone for the Native Mobile Application (iOS/Android). Options include simultaneous MVP release (R1), staged release in R2 alongside voice/STT capabilities, or commercial release in R3.",
         "Opt A: Launch Mobile in R2 alongside Voice & Progress features (Recommended).\nOpt B: Simultaneous R1 release (high resource contention).\nOpt C: Defer to R3.",
         "Resource allocation, QA scope, mobile developer hiring, mobile CI/CD pipeline setup.",
         "Option A (Target R2 for mobile release, allowing R1 to solidify Core NestJS backend APIs on responsive web first).",
         "Product Owner / Tech Lead", "Pending Confirmation"),
        ("D-M02", "Mobile Technology", "Mobile Application Framework Selection",
         "Selection of cross-platform or native development stack for iOS and Android client applications.",
         "Opt A: React Native / Expo (Code/Skill reuse with Next.js/TypeScript frontend team).\nOpt B: Flutter / Dart (High performance UI, distinct stack).\nOpt C: Native Swift (iOS) & Kotlin (Android) (Maximum performance, dual maintenance cost).",
         "Developer skillset, code sharing (validation schemas, types from backend), native audio recording bridge complexity.",
         "Option A (React Native with TypeScript enables direct sharing of Zod schemas and TypeScript types with Web).",
         "Technical Lead / Mobile Architect", "Pending Confirmation"),
        ("D-M03", "OS Compatibility", "Minimum Supported OS Versions",
         "Establish minimum operating system support baseline for Apple iOS and Google Android platforms.",
         "Opt A: iOS 16.0+ and Android 13.0+ (API Level 33) (Modern audio APIs, secure hardware enclave, covers ~92% active devices).\nOpt B: iOS 15.0+ and Android 10.0+ (Broader legacy reach, higher testing and compatibility overhead).",
         "Device compatibility matrix, biometric API availability, security compliance.",
         "Option A (iOS 16+ / Android 13+).",
         "QA Lead / Mobile Architect", "Pending Confirmation"),
        ("D-M04", "Commercial / Billing", "Mobile Payment Architecture & Store Fee Strategy",
         "Determine whether mobile digital subscriptions (Basic/Pro) utilize Apple In-App Purchase (StoreKit 2) and Google Play Billing (subject to 15-30% store commission) or redirect to Web-based checkout.",
         "Opt A: Hybrid - View subscription status on mobile, redirect to Web Checkout for purchase (Subject to App Store Reader/Multiplatform rules compliance).\nOpt B: Full native In-App Purchase (IAP) integration on iOS and Android.",
         "Financial margins (15-30% platform fee), payment gateway integration, receipt validation service.",
         "Option A for initial release with legal/App Store guidelines review; evaluate Option B if Apple rejects external subscription links.",
         "Finance Admin / Product Owner / Legal", "Pending Confirmation"),
        ("D-M05", "User Engagement", "Push Notifications Scope & Infrastructure",
         "Assess requirement for remote push notifications (Apple APNs / Google FCM) for interview practice reminders, AI evaluation completion alerts, and subscription renewal notices.",
         "Opt A: Implement APNs/FCM service via unified notification worker in R2.\nOpt B: Rely strictly on in-app notifications and transactional emails in early releases.",
         "Device token registration endpoint, privacy notice update for device identifiers, notification backend service.",
         "Option A targeted for R2 release.",
         "Product Owner / Backend Lead", "Pending Confirmation"),
        ("D-M06", "Security & Auth", "Biometric Authentication Integration",
         "Determine whether Native Mobile should support biometric unlock (Apple Face ID / Touch ID and Android BiometricPrompt) for session resumption.",
         "Opt A: Enable biometric unlock to unlock stored refresh tokens in OS Keychain/Keystore.\nOpt B: Rely exclusively on standard JWT refresh token with timeout.",
         "Enhanced mobile usability, local security compliance, no impact on backend auth contracts.",
         "Option A as a non-breaking client-side enhancement once basic auth is verified.",
         "Security Lead / Mobile Lead", "Pending Confirmation"),
        ("D-M07", "Navigation & Linking", "Deep Linking & Universal Links",
         "Implementation of iOS Universal Links and Android App Links to route external links (e.g., email verification, interview sharing, password reset) directly into the native mobile application.",
         "Opt A: Configure Apple apple-app-site-association and Android assetlinks.json on domain.\nOpt B: Web-only routing with fallback prompts.",
         "Web domain configuration, mobile routing table, auth verification flow.",
         "Option A for seamless email auth and session linking.",
         "Frontend Lead / Mobile Lead", "Pending Confirmation"),
        ("D-M08", "Offline & Resilience", "Offline Mode & Local Storage Scope",
         "Establish boundaries for mobile offline functionality. Define whether users can conduct mock interviews offline or if connectivity is strictly required for AI inference.",
         "Opt A: Online-only for AI practice (transient local caching of draft text answers and audio retry chunks during network drops).\nOpt B: Full offline mock interviews with on-device LLM evaluation (high hardware requirements, battery drain, model size constraints).",
         "System architecture, storage usage, AI evaluation consistency (NFR02).",
         "Option A (Online-required for AI evaluation; client-side resilience allows answer recovery on network reconnect).",
         "Software Architect / AI Lead", "Pending Confirmation"),
        ("D-M09", "Product Roadmap", "Cross-Platform Feature Parity & Rollout Strategy",
         "Define feature parity requirements between Web and Native Mobile for End User capabilities.",
         "Opt A: 100% End User feature parity between Web and Mobile for all released end-user modules (FR01-FR16, FR33, FR35, FR36).\nOpt B: Mobile-first subset focused only on voice interview practice.",
         "QA testing matrix, synchronized release cycles.",
         "Option A for core end-user features; Admin/Researcher remain strictly Web-only.",
         "Product Owner / QA Lead", "Pending Confirmation"),
        ("D-M10", "Distribution & Policy", "Mobile App Store Distribution & Privacy Compliance",
         "Establish compliance strategy for Apple App Store Review Guidelines (Section 5.1 Privacy, Section 3.1 Payments) and Google Play Developer Policies (Microphone permission justification, Account deletion requirement).",
         "Opt A: Full compliance package: In-app account deletion workflow (FR35), granular mic consent (FR05.1), App Privacy labels.\nOpt B: Enterprise internal ad-hoc distribution (TestFlight / Firebase App Distribution only).",
         "Legal, privacy policy, public app store listing readiness.",
         "Option A (Mandatory for public release).",
         "Legal / Privacy Lead / Release Manager", "Pending Confirmation"),
        ("D-M11", "Audio & Media", "Real-time Audio Streaming Protocol for Mobile Voice",
         "Select transmission protocol for voice capture in R2 (Chunked HTTPS upload vs WebSocket audio streaming vs WebRTC).",
         "Opt A: Chunked HTTPS upload to signed S3/MinIO URLs (Simple, robust, reliable on poor cellular networks).\nOpt B: Bi-directional WebSocket / WebRTC streaming (Lower latency, higher complexity and network sensitivity).",
         "Backend audio ingestion service, cellular data consumption, STT pipeline latency.",
         "Option A for initial R2 implementation; evaluate Option B for streaming STT if latency budget requires it.",
         "Technical Lead / AI Lead", "Pending Confirmation")
    ]
    
    start_row = 5
    for i, row in enumerate(decisions):
        r_idx = start_row + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws.cell(row=r_idx, column=c_idx + 1)
            cell.value = val
            if c_idx == 0: # ID
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=NAVY_HEADER, align="center")
            elif c_idx == 1: # Category
                format_data_cell(cell, is_zebra, font_size=10, bold=True, align="center")
            elif c_idx == len(row) - 1: # Status
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=10, align="left")
        ws.row_dimensions[r_idx].height = 42
        
    explicit_widths = {1: 14, 2: 20, 3: 28, 4: 45, 5: 45, 6: 35, 7: 35, 8: 24, 9: 22}
    auto_fit_columns(ws, 1, len(headers), explicit_widths=explicit_widths)
    wb.save(out_path)
    print(f"Generated Decision Register: {out_path}")

# ==============================================================================
# 2. BUILD REQUIREMENT TRACEABILITY MATRIX EXCEL
# ==============================================================================
def build_traceability_workbook(out_path):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Requirement_Traceability"
    
    # Title Block
    ws.merge_cells("A1:L1")
    title_cell = ws["A1"]
    title_cell.value = "InterviewX — Phase 1: Requirement Traceability Matrix (RTM)"
    title_cell.font = Font(name="Segoe UI", size=14, bold=True, color="FFFFFF")
    title_cell.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    title_cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[1].height = 36
    
    ws.merge_cells("A2:L2")
    sub_cell = ws["A2"]
    sub_cell.value = "Traceability Baseline: SRS v1.1 DRAFT | FR/NFR/RBAC Workbook | ALL_DIAGRAMS v1.1 DRAFT | Date: 13 November 2026"
    sub_cell.font = Font(name="Segoe UI", size=10, italic=True, color="475569")
    sub_cell.fill = PatternFill(start_color=CALLOUT_FILL, end_color=CALLOUT_FILL, fill_type="solid")
    sub_cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[2].height = 22

    headers = [
        "Req ID", "Requirement Name", "Type", "Release", "SRS Section",
        "Platform Applicability", "Related Role(s)", "Related NFR / Component",
        "Verification / Test Method", "Impl Status", "Approval Status", "Phase 1 Alignment Remarks"
    ]
    
    ws.append([]) # row 3 blank
    ws.append(headers) # row 4
    style_header_row(ws, 4, len(headers), height=28)
    
    # All 40 FRs and 24 NFRs
    trace_data = [
        # Functional Requirements
        ("FR01", "Registration, Login and Session Security", "FR", "R1", "5. FR01", "Shared Web & Mobile",
         "Guest, Registered User, All Roles", "NFR01, NFR19 / Identity Context", "Automated Auth Suite, Session Expiry Test", "Specified", "Baseline Approved (v1.0)",
         "Unified auth API for Web & Mobile; tokens in HTTP-only cookies (Web) and Keychain/Keystore (Mobile)."),
        ("FR02", "User Status and Profile", "FR", "R1", "5. FR02", "Shared Web & Mobile",
         "Registered User", "NFR03 / Profile Service", "Profile CRUD API & UI Test", "Specified", "Baseline Approved (v1.0)",
         "Full profile synchronization across Web and Mobile via unified User Context API."),
        ("FR03", "Skill Configuration", "FR", "R2", "5. FR03", "Shared Web & Mobile",
         "Registered User", "NFR03 / Interview Context", "Skill Selection & Session Pinning Test", "Specified", "Baseline Approved (v1.0)",
         "Skill level selection available identically in Web and Mobile interview setup wizard."),
        ("FR04", "Interview Category/Question Delivery", "FR", "R1", "5. FR04", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR02, NFR21 / Question Bank", "Question Relevance & Categorization Test", "Specified", "Baseline Approved (v1.0)",
         "Synchronized question delivery via backend REST API; consistent categories across clients."),
        ("FR05", "Text Answer Submission", "FR", "R1", "5. FR05", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR04, NFR12 / Interview Context", "Answer Ingestion & Idempotency Test", "Specified", "Baseline Approved (v1.0)",
         "Mobile and Web submit answers via POST /answers with Idempotency-Key header."),
        ("FR05-V", "Voice Answer and STT", "FR", "R2", "5. FR05-V", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR04, NFR09, NFR18 / Audio Storage + STT", "Audio Capture, Upload & Transcript Test", "Specified", "Baseline Approved (v1.0)",
         "Web Audio API (Web) and Native OS Microphone Bridge (Mobile); signed URL upload to MinIO."),
        ("FR05.1", "Voice-Retention Choice", "FR", "R2", "5. FR05.1", "Shared Web & Mobile",
         "Registered User", "NFR09, NFR18 / Privacy Context", "Opt-in Toggle & Lifecycle Deletion Test", "Specified", "Baseline Approved (v1.0)",
         "Granular opt-in prompt displayed prior to voice practice on both Web and Mobile."),
        ("FR06", "Pressure Practice Mode", "FR", "R2", "5. FR06", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR03 / Interview Context", "Timer & Pressure UI State Test", "Specified", "Baseline Approved (v1.0)",
         "Synchronous timer state and voluntary exit behavior identical across platforms."),
        ("FR07", "Question Diversity", "FR", "R2", "5. FR07", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR02 / Question Selector", "Session Question Deduplication Test", "Specified", "Baseline Approved (v1.0)",
         "Backend maintains question history across both platforms to prevent duplication."),
        ("FR08", "Rubric-Based AI Scoring", "FR", "R1", "5. FR08", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR02, NFR20, NFR21 / AI Eval Worker", "Rubric Scoring Engine Benchmark", "Specified", "Baseline Approved (v1.0)",
         "Server-side AI evaluation; structured results rendered identically on Web and Mobile."),
        ("FR09", "English Language Feedback", "FR", "R2", "5. FR09", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR02, NFR07 / AI Eval Worker", "Grammar & Vocabulary Parser Test", "Specified", "Baseline Approved (v1.0)",
         "Bilingual feedback delivered to Web and Mobile clients via standard feedback schema."),
        ("FR10", "Observable Speech Indicators", "FR", "R2", "5. FR10", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR02 / Speech Analysis Service", "WPM, Pause & Filler Word Metric Test", "Specified", "Baseline Approved (v1.0)",
         "Audio metrics computed on backend worker; charts and disclaimers displayed on both clients."),
        ("FR11", "Actionable Feedback", "FR", "R1", "5. FR11", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR02, NFR03 / AI Eval Worker", "Feedback Quality & Evidence Review", "Specified", "Baseline Approved (v1.0)",
         "Structured evidence cards displayed in responsive web and native mobile UI."),
        ("FR12", "Example Responses", "FR", "R2", "5. FR12", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR03 / Content Context", "Sample Response Presentation Test", "Specified", "Baseline Approved (v1.0)",
         "Demonstration answers displayed consistently as non-prescriptive examples."),
        ("FR13", "Progress Dashboard", "FR", "R2", "5. FR13", "Shared Web & Mobile",
         "Registered User", "NFR03 / Analytics Read Model", "Historical Trend Charting Test", "Specified", "Baseline Approved (v1.0)",
         "Performance progression visualizer rendered via web charts and native mobile chart components."),
        ("FR14", "Interview History", "FR", "R1", "5. FR14", "Shared Web & Mobile",
         "Registered User", "NFR19 / Interview Context", "History Pagination, Export & Deletion Test", "Specified", "Baseline Approved (v1.0)",
         "Complete cross-platform access to past sessions; deletion on one client syncs immediately."),
        ("FR15", "Multi-Platform Access & Consistency (Web & Mobile)", "FR", "R1", "5. FR15", "Shared Web & Mobile",
         "Guest, Registered User (Mobile/Web); All Roles (Web)", "NFR08 / API Gateway & Client Frontends", "Multi-Device E2E Matrix Test", "Specified", "Proposed Revision — Pending Approval",
         "REVISED: Explicitly governs Responsive Web & Native Mobile frontends, role scoping, shared backend, and cross-platform sync."),
        ("FR16", "Practice Mode Selection", "FR", "R2", "5. FR16", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR03 / Interview Wizard", "Mode Switching & Validation Test", "Specified", "Baseline Approved (v1.0)",
         "Text, Voice, and Mixed mode selection supported on both Web and Native Mobile clients."),
        ("FR17", "Privacy Notice and Lawful Basis", "FR", "R1", "5. FR17", "Shared Web & Mobile",
         "Guest, Registered User, All Roles", "NFR01, NFR09, NFR17 / Privacy Context", "Notice Display & Versioned Consent Test", "Specified", "Baseline Approved (v1.0)",
         "Mandatory privacy notice displayed on app onboarding and web registration."),
        ("FR18", "Contact Opt-in", "FR", "R3", "5. FR18", "Shared Web & Mobile",
         "Registered User", "NFR01, NFR17 / Consent Service", "Contact Consent Logging & Withdrawal Test", "Specified", "Baseline Approved (v1.0)",
         "Distinct opt-in checkbox manageable in Web and Mobile account settings."),
        ("FR18.1", "Research Access Authorization", "FR", "R3", "5. FR18.1", "Web Only (Admin/Researcher)",
         "Researcher", "NFR17, NFR19 / Research Release Service", "Differential Privacy & Aggregation Test", "Specified", "Baseline Approved (v1.0)",
         "STRICTLY WEB ONLY: Research queries and aggregate exports inaccessible from Mobile."),
        ("FR19", "Package Catalog", "FR", "R3", "5. FR19", "Shared Web & Mobile",
         "Guest, Registered User", "NFR06, NFR10 / Billing Context", "Catalog Display & Price Currency Test", "Specified", "Baseline Approved (v1.0)",
         "Catalog viewable on Web and Mobile; purchase flow subject to D-M04 (IAP vs Web Checkout)."),
        ("FR20", "Quota and Entitlement Enforcement", "FR", "R3", "5. FR20", "Shared Web & Mobile",
         "Registered User", "NFR10, NFR12 / Entitlement Service", "Atomic Server Quota Enforcement Test", "Specified", "Baseline Approved (v1.0)",
         "Server-side atomic quota check before session creation regardless of originating client."),
        ("FR21", "Package Comparison", "FR", "R3", "5. FR21", "Shared Web & Mobile",
         "Guest, Registered User", "NFR03 / Billing Context", "Tier Feature Comparison UI Test", "Specified", "Baseline Approved (v1.0)",
         "Comparison table viewable across Web and Native Mobile frontends."),
        ("FR22", "Payment Methods", "FR", "R3", "5. FR22", "Shared Web & Mobile (Subject to D-M04)",
         "Registered User", "NFR10, NFR11 / Payment Adapter", "Gateway Redirection & Sandbox Test", "Specified", "Baseline Approved (v1.0)",
         "Web uses hosted gateway checkout; Mobile uses Web redirect or native IAP pending D-M04."),
        ("FR23", "Payment Gateway Validation", "FR", "R3", "5. FR23", "Shared (Backend Service)",
         "Registered User (via system)", "NFR11, NFR12 / Billing Webhook", "Signed Webhook & Idempotency Test", "Specified", "Baseline Approved (v1.0)",
         "Backend-only webhook verification; updates entitlement universally for Web and Mobile."),
        ("FR24", "Receipt Issuance", "FR", "R3", "5. FR24", "Shared Web & Mobile",
         "Registered User", "NFR15, NFR16 / Billing Context", "Receipt Generation & Download Test", "Specified", "Baseline Approved (v1.0)",
         "Receipts and payment confirmations downloadable/viewable on both platforms."),
        ("FR25", "Provisioning", "FR", "R3", "5. FR25", "Shared (Backend Service)",
         "Registered User (via system)", "NFR12 / Billing Outbox", "Event-Driven Entitlement Grant Test", "Specified", "Baseline Approved (v1.0)",
         "Backend service unlocks package features synchronously across all logged-in devices."),
        ("FR26", "Renewal", "FR", "R3", "5. FR26", "Shared Web & Mobile",
         "Registered User", "NFR11, NFR14 / Billing Service", "Subscription Renewal Cycle Test", "Specified", "Baseline Approved (v1.0)",
         "Renewal status displayed in user profile across Web and Native Mobile."),
        ("FR27", "Cancellation/Refund Requests", "FR", "R3", "5. FR27", "Shared (User) / Web (Admin)",
         "Registered User (Request), Finance Admin (Approve)", "NFR15 / Billing & Finance", "Refund Request Workflow & Approval Test", "Specified", "Baseline Approved (v1.0)",
         "End-users can request cancellation/refund via Mobile/Web; Admin approval is Web-only."),
        ("FR28", "Renewal Notifications", "FR", "R3", "5. FR28", "Shared Web & Mobile (Subject to D-M05)",
         "Registered User", "NFR05 / Notification Worker", "Email & Push Notification Test", "Specified", "Baseline Approved (v1.0)",
         "Transactional email baseline; push notification integration pending decision D-M05."),
        ("FR29", "Transaction History", "FR", "R3", "5. FR29", "Shared Web & Mobile",
         "Registered User", "NFR15 / Billing Context", "Transaction Ledger Audit & Display Test", "Specified", "Baseline Approved (v1.0)",
         "Users view their own transaction history identically across Web and Native Mobile."),
        ("FR30", "Admin Package Versioning", "FR", "R3", "5. FR30", "Web Only (Admin Only)",
         "Finance Admin, System Admin", "NFR15, NFR19 / Admin Console", "Package Draft, Approve & Publish Test", "Specified", "Baseline Approved (v1.0)",
         "STRICTLY WEB ONLY: Administrative package configuration unavailable on Mobile."),
        ("FR31", "Business Metrics", "FR", "R3", "5. FR31", "Web Only (Admin Only)",
         "Finance Admin, System Admin", "NFR06, NFR15 / Reporting Context", "Revenue & Churn Reconciliation Test", "Specified", "Baseline Approved (v1.0)",
         "STRICTLY WEB ONLY: Executive and financial dashboards restricted to Web Application."),
        ("FR32", "Immutable Admin Audit", "FR", "R1", "5. FR32", "Web Only (Admin Only)",
         "System Admin", "NFR01, NFR15 / Platform Audit", "Tamper-Evident Audit Logging Test", "Specified", "Baseline Approved (v1.0)",
         "STRICTLY WEB ONLY: System audit viewer restricted to authenticated System Admin on Web."),
        ("FR32.1", "Research Access Audit", "FR", "R3", "5. FR32.1", "Web Only (Admin/Researcher)",
         "Researcher (own), System Admin", "NFR15, NFR17 / Research Audit", "Access Query & Export Log Test", "Specified", "Baseline Approved (v1.0)",
         "STRICTLY WEB ONLY: Research query auditing viewable exclusively through Web portal."),
        ("FR33", "Session Resilience", "FR", "R1", "5. FR33", "Shared Web & Mobile",
         "Guest (trial), Registered User", "NFR05, NFR23 / Client Resilience", "Network Disruption & Recovery Test", "Specified", "Baseline Approved (v1.0)",
         "Mobile client buffers active responses during cellular drops and resumes cleanly."),
        ("FR34", "AI Configuration and Human Review", "FR", "R1", "5. FR34", "Web Only (Admin Console)",
         "System Admin", "NFR20, NFR21 / AI Governance", "Rubric & Prompt Version Rollout Test", "Specified", "Baseline Approved (v1.0)",
         "STRICTLY WEB ONLY: Model parameter and prompt versioning restricted to Web portal."),
        ("FR35", "Data Rights Request", "FR", "R1", "5. FR35", "Shared (User) / Web (Admin)",
         "Registered User (Request), System Admin (Process)", "NFR01, NFR09 / Privacy Context", "DSR Workflow, Export & Purge Test", "Specified", "Baseline Approved (v1.0)",
         "Users submit export/deletion requests via Mobile/Web; admin fulfillment is Web-only."),
        ("FR36", "AI Failure and Appeal", "FR", "R1", "5. FR36", "Shared (User) / Web (Admin)",
         "Registered User (Appeal), System Admin (Review)", "NFR02, NFR20 / Evaluation Appeals", "Appeal Ingestion & Review Queue Test", "Specified", "Baseline Approved (v1.0)",
         "Users dispute problematic scores via Mobile/Web; review and resolution queue is Web-only."),
         
        # Non-Functional Requirements
        ("NFR01", "Security & Data Protection", "NFR", "R1", "6. NFR01", "Shared Web & Mobile",
         "All Roles", "Identity, API Gateway, Secrets", "TLS 1.3, AES-256 Scan, Keychain Audit", "Specified", "Baseline Approved (v1.0)",
         "Web uses HTTP-only Secure SameSite cookies; Mobile uses OS Keychain / Keystore."),
        ("NFR02", "AI Accuracy & Evaluation Quality", "NFR", "R1", "6. NFR02", "Shared (Backend AI)",
         "Guest, Registered User", "FastAPI Inference, Eval Worker", "Correlation >=0.70, MAE <=15/100 Benchmark", "Specified", "Baseline Approved (v1.0)",
         "Model evaluation executed entirely server-side; identical criteria apply regardless of client."),
        ("NFR03", "Usability & Task Completion", "NFR", "R1", "6. NFR03", "Shared Web & Mobile",
         "Guest, Registered User", "Web UI & Mobile Native UI", "SUS >=70, Task Completion >=90%", "Specified", "Baseline Approved (v1.0)",
         "Native mobile controls optimized for touch; web optimized for desktop and responsive viewports."),
        ("NFR04", "Performance & Latency", "NFR", "R1", "6. NFR04", "Shared Web & Mobile",
         "Guest, Registered User", "NestJS API, BullMQ, Redis", "Non-AI P95 <=2s (Web), <=2.5s (Cellular); Feedback <=15s", "Specified", "Baseline Approved (v1.0)",
         "Mobile targets P95 <=2.5s over 4G/5G mobile cellular networks; feedback target <=15s."),
        ("NFR05", "System Availability", "NFR", "R1", "6. NFR05", "Shared (Backend Infrastructure)",
         "All Roles", "Managed Production Infrastructure", "Monthly Availability >=99.5%", "Specified", "Baseline Approved (v1.0)",
         "Shared backend infrastructure serves both Web and Mobile API traffic under SLA."),
        ("NFR06", "Unit Economics & Cost Governance", "NFR", "R1", "6. NFR06", "Shared (System Operation)",
         "Finance Admin, System Admin", "Observability, AI Token Accounting", "Cost per Completed Session Dashboard", "Specified", "Baseline Approved (v1.0)",
         "Session costs monitored uniformly across mobile and web originating requests."),
        ("NFR07", "Localization (Thai / English)", "NFR", "R1", "6. NFR07", "Shared Web & Mobile",
         "Guest, Registered User", "i18n Localization Engine", "Bilingual Content & Layout Test", "Specified", "Baseline Approved (v1.0)",
         "Full Thai and English support across Web and Native Mobile applications."),
        ("NFR08", "Cross-Platform Accessibility & Consistency", "NFR", "R1", "6. NFR08", "Shared Web & Mobile",
         "Guest, Registered User", "Web Frontend, iOS/Android Apps", "WCAG 2.2 AA, VoiceOver/TalkBack, 100% Data Sync", "Specified", "Proposed Revision — Pending Approval",
         "REVISED: Distinguishes Web (WCAG 2.2 AA), iOS (VoiceOver/HIG), Android (TalkBack), and 100% data sync."),
        ("NFR09", "Data Retention & Audio Lifecycle", "NFR", "R1", "6. NFR09", "Shared Web & Mobile",
         "Registered User", "MinIO Storage, Privacy Worker", "Raw Audio <=24h Hard Cap, Opt-in <=90d", "Specified", "Baseline Approved (v1.0)",
         "Temporary mobile device audio cache cleared immediately upon upload completion."),
        ("NFR10", "Payment Scope & PCI-DSS Minimization", "NFR", "R3", "6. NFR10", "Shared Web & Mobile",
         "Registered User", "Billing Context, Payment Gateway", "Zero PAN/CVV Storage Audit", "Specified", "Baseline Approved (v1.0)",
         "Zero cardholder data handled by frontend clients; tokenized hosted checkout or native IAP."),
        ("NFR11", "Transaction Security & Verification", "NFR", "R3", "6. NFR11", "Shared (Backend Service)",
         "Registered User, Finance Admin", "Billing Gateway Adapter", "HMAC Webhook Signature & Replay Test", "Specified", "Baseline Approved (v1.0)",
         "Secure cryptographic validation of payment events; independent of client origin."),
        ("NFR12", "Idempotency & Duplicate Prevention", "NFR", "R3", "6. NFR12", "Shared Web & Mobile",
         "Registered User", "NestJS Platform Context", "Idempotency-Key Deduplication Test", "Specified", "Baseline Approved (v1.0)",
         "Mobile and web submissions enforce atomic single fulfillment using client-generated UUIDs."),
        ("NFR13", "Payment Processing Visibility", "NFR", "R3", "6. NFR13", "Shared Web & Mobile",
         "Registered User", "Billing UI & Polling Service", "Redirect P95 <=5s, Pending State Display", "Specified", "Baseline Approved (v1.0)",
         "Real-time payment status polling displayed on both Web and Native Mobile."),
        ("NFR14", "Payment Service Availability", "NFR", "R3", "6. NFR14", "Shared (Backend Service)",
         "Registered User, Finance Admin", "Billing Infrastructure", "Recoverable Pending State & Failover Drill", "Specified", "Baseline Approved (v1.0)",
         "Failover and pending state recovery shared across all user channels."),
        ("NFR15", "Auditability & Business Reconciliation", "NFR", "R3", "6. NFR15", "Web Only (Admin View)",
         "Finance Admin, System Admin", "Audit Context, Daily Reconciliation", "100% State Transition Audit Log", "Specified", "Baseline Approved (v1.0)",
         "Audit logging captures actor client platform (Web vs Mobile); admin review is Web-only."),
        ("NFR16", "Tax & Commercial Regulatory Compliance", "NFR", "R3", "6. NFR16", "Shared (Backend Service)",
         "Finance Admin, System Admin", "Billing Tax Engine", "Tax Document Generation & Legal Review", "Specified", "Baseline Approved (v1.0)",
         "Backend tax invoicing and receipts; mobile complies with applicable App Store tax rules."),
        ("NFR17", "Research Privacy & Anonymization", "NFR", "R3", "6. NFR17", "Web Only (Research Service)",
         "Researcher, System Admin", "Research Data Pipeline", "Cell Size >=10, Differencing Suppression Test", "Specified", "Baseline Approved (v1.0)",
         "STRICTLY WEB ONLY: Research queries and anonymized dataset exports restricted to Web."),
        ("NFR18", "Voice Isolation & Role Boundary", "NFR", "R2", "6. NFR18", "Shared (Backend Storage)",
         "Registered User, System Admin", "Private Object Storage", "Zero Raw Audio Access for Researchers", "Specified", "Baseline Approved (v1.0)",
         "Direct raw audio downloads completely blocked for researchers across all platforms."),
        ("NFR19", "Authorization & IDOR Protection", "NFR", "R1", "6. NFR19", "Shared Web & Mobile",
         "All Roles", "NestJS Guards, Prisma RLS", "Automated Negative IDOR Test Suite", "Specified", "Baseline Approved (v1.0)",
         "Strict server-side validation on every API endpoint; mobile UI permissions never trusted."),
        ("NFR20", "LLM Safety & Prompt Injection Defense", "NFR", "R1", "6. NFR20", "Shared (Backend AI)",
         "Guest, Registered User", "FastAPI AI Service", "Prompt Injection Red-Team Benchmark", "Specified", "Baseline Approved (v1.0)",
         "Input sanitization and untrusted output validation executed prior to client delivery."),
        ("NFR21", "Model Governance & Version Pinning", "NFR", "R1", "6. NFR21", "Shared (Backend AI)",
         "System Admin", "AI Version Registry", "CI Benchmark & Version Reproducibility Test", "Specified", "Baseline Approved (v1.0)",
         "Evaluations pinned to immutable rubric/prompt/model versions stored in backend."),
        ("NFR22", "Scalability & Concurrency", "NFR", "R1", "6. NFR22", "Shared (Backend Infrastructure)",
         "All Roles", "Core Infrastructure, Redis, Workers", "100 Concurrent Active Users Load Test", "Specified", "Baseline Approved (v1.0)",
         "Load tests account for concurrent traffic from both Web browsers and Mobile clients."),
        ("NFR23", "Disaster Recovery & Data Resilience", "NFR", "R1", "6. NFR23", "Shared (Backend Database)",
         "System Admin", "PostgreSQL Backups, Runbooks", "RPO <=24h, RTO <=8h Restore Drill", "Specified", "Baseline Approved (v1.0)",
         "Backups protect all core session and user data; restore drill covers total platform recovery."),
        ("NFR24", "Monitoring & Observability", "NFR", "R1", "6. NFR24", "Shared (System Operation)",
         "System Admin", "OpenTelemetry, Logging, Metrics", "Trace Correlation ID & Alerting Drill", "Specified", "Baseline Approved (v1.0)",
         "Mobile crash analytics and API correlation IDs integrated into central observability stack.")
    ]
    
    start_row = 5
    for i, row in enumerate(trace_data):
        r_idx = start_row + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws.cell(row=r_idx, column=c_idx + 1)
            cell.value = val
            if c_idx == 0: # Req ID
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=NAVY_HEADER, align="center")
            elif c_idx == 2: # Type
                format_data_cell(cell, is_zebra, font_size=10, bold=True, align="center")
            elif c_idx == 3: # Release
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=BLUE_ACCENT, align="center")
            elif c_idx == 5: # Platform Applicability
                format_data_cell(cell, is_zebra, font_size=10, bold=True, align="center")
            elif c_idx == 10: # Approval Status
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=10, align="left")
        ws.row_dimensions[r_idx].height = 36
        
    explicit_widths = {1: 12, 2: 32, 3: 10, 4: 10, 5: 14, 6: 25, 7: 25, 8: 30, 9: 30, 10: 16, 11: 28, 12: 45}
    auto_fit_columns(ws, 1, len(headers), explicit_widths=explicit_widths)
    wb.save(out_path)
    print(f"Generated Requirement Traceability: {out_path}")

# ==============================================================================
# 3. BUILD INTERVIEWX_FR_NFR_RBAC_v1.1_DRAFT EXCEL
# ==============================================================================
def build_aligned_fr_nfr_rbac_workbook(src_path, out_path):
    src_wb = openpyxl.load_workbook(src_path)
    wb = openpyxl.Workbook()
    wb.remove(wb.active) # Remove default sheet
    
    # 1. SHEET: FR
    ws_fr = wb.create_sheet(title="FR")
    src_fr = src_wb["FR"]
    for r in range(1, src_fr.max_row + 1):
        for c in range(1, src_fr.max_column + 1):
            val = src_fr.cell(row=r, column=c).value
            ws_fr.cell(row=r, column=c, value=val)
            
    ws_fr.cell(row=12, column=4, value="Platform Scope")
    ws_fr.cell(row=36, column=4, value="Platform Scope")
    ws_fr.cell(row=54, column=4, value="Platform Scope")
    
    ws_fr.cell(row=20, column=2, value="Multi-Platform Access & Consistency (Responsive Web & Native Mobile)")
    ws_fr.cell(row=20, column=3, value=(
        "รองรับการใช้งานผ่าน Responsive Web (Desktop, Tablet, Mobile Browser) และ Native Mobile Application "
        "(iOS / Android) สำหรับ End Users (Guest, Registered User) โดยใช้บัญชีและ Backend API ร่วมกัน "
        "พร้อมการซิงค์ข้อมูลแบบข้ามแพลตฟอร์ม และจำกัดฟังก์ชัน Admin/Researcher เฉพาะบน Web"
    ))
    
    fr_platform_map = {
        13: "Shared Web & Mobile", 14: "Shared Web & Mobile", 15: "Shared Web & Mobile",
        16: "Shared Web & Mobile", 17: "Shared Web & Mobile", 18: "Shared Web & Mobile",
        19: "Shared Web & Mobile", 20: "Shared Web & Mobile", 21: "Shared Web & Mobile",
        22: "Web Only (Admin Only)", 23: "Shared Web & Mobile", 24: "Web Only (Admin Console)",
        25: "Shared (User) / Web (Admin)", 26: "Shared (User) / Web (Admin)",
        37: "Shared Web & Mobile", 38: "Shared Web & Mobile", 39: "Shared Web & Mobile",
        40: "Shared Web & Mobile", 41: "Shared Web & Mobile", 42: "Shared Web & Mobile",
        43: "Shared Web & Mobile", 44: "Shared Web & Mobile", 45: "Shared Web & Mobile",
        46: "Shared Web & Mobile",
        55: "Shared Web & Mobile", 56: "Web Only (Admin/Researcher)", 57: "Shared Web & Mobile",
        58: "Shared Web & Mobile", 59: "Shared Web & Mobile", 60: "Shared Web & Mobile (D-M04)",
        61: "Shared (Backend Service)", 62: "Shared Web & Mobile", 63: "Shared (Backend Service)",
        64: "Shared Web & Mobile", 65: "Shared (User) / Web (Admin)", 66: "Shared Web & Mobile (D-M05)",
        67: "Shared Web & Mobile", 68: "Web Only (Admin Only)", 69: "Web Only (Admin Only)",
        70: "Web Only (Admin/Researcher)"
    }
    for r_idx, scope in fr_platform_map.items():
        cell = ws_fr.cell(row=r_idx, column=4, value=scope)
        format_data_cell(cell, is_zebra=False, font_size=10, bold=True, align="center")
        
    style_header_row(ws_fr, 1, 3, fill=header_fill, height=24)
    style_header_row(ws_fr, 12, 4, fill=sub_header_fill, height=24)
    style_header_row(ws_fr, 36, 4, fill=sub_header_fill, height=24)
    style_header_row(ws_fr, 54, 4, fill=sub_header_fill, height=24)
    auto_fit_columns(ws_fr, 1, 4, explicit_widths={1: 12, 2: 38, 3: 58, 4: 26})

    # 2. SHEET: NFR
    ws_nfr = wb.create_sheet(title="NFR")
    src_nfr = src_wb["NFR"]
    for r in range(1, src_nfr.max_row + 1):
        for c in range(1, src_nfr.max_column + 1):
            val = src_nfr.cell(row=r, column=c).value
            ws_nfr.cell(row=r, column=c, value=val)
            
    ws_nfr.cell(row=3, column=4, value="Platform Target & Mobile Considerations")
    ws_nfr.cell(row=14, column=4, value="Platform Target & Mobile Considerations")
    ws_nfr.cell(row=21, column=4, value="Platform Target & Mobile Considerations")
    ws_nfr.cell(row=33, column=4, value="Platform Target & Mobile Considerations")
    ws_nfr.cell(row=41, column=4, value="Platform Target & Mobile Considerations")
    
    ws_nfr.cell(row=36, column=2, value="Cross-Platform Accessibility & Consistency")
    ws_nfr.cell(row=36, column=3, value=(
        "รองรับการเข้าถึงทั้ง Responsive Web (WCAG 2.2 AA) และ Native Mobile (iOS VoiceOver/Dynamic Type, "
        "Android TalkBack) พร้อมรักษาความสอดคล้องของข้อมูลบัญชี ประวัติสัมภาษณ์ และสิทธิ์การใช้งาน (Entitlement) "
        "ระหว่างแพลตฟอร์มแบบ 100% (Proposed Target — Pending Approval)"
    ))
    
    nfr_platform_notes = {
        4: "Shared: Web uses HTTP-only cookies; Mobile uses OS Keychain / Keystore (NFR01)",
        5: "Shared: Mobile device audio cache cleared immediately after upload <=24h cap (NFR09)",
        6: "Web Only: Research queries and aggregate exports restricted to Web portal (NFR17)",
        7: "Shared: Private storage blocks raw audio download for research roles across all clients (NFR18)",
        8: "Shared: Server-side RBAC & IDOR checks enforced on all endpoints; client never trusted (NFR19)",
        9: "Shared: Prompt injection defense executed server-side prior to client delivery (NFR20)",
        15: "Shared AI: Rubric scoring executed server-side; identical benchmarks for Web & Mobile (NFR02)",
        16: "Shared AI: Immutable rubric/prompt/model versions pinned on backend (NFR21)",
        22: "Shared: Web non-AI P95 <=2s; Mobile cellular P95 <=2.5s; Feedback <=15s (NFR04)",
        23: "Shared Backend: Availability >=99.5% applies to unified API gateway (NFR05)",
        24: "Shared: Transaction processing redirect P95 <=5s across Web and Mobile (NFR13)",
        25: "Shared: Payment service availability and failover handled centrally (NFR14)",
        26: "Shared: Concurrency load test covers simultaneous Web and Mobile sessions (NFR22)",
        27: "Shared: Disaster recovery (RPO <=24h, RTO <=8h) restores core platform data (NFR23)",
        28: "Shared: Correlation IDs trace requests from Web and Native Mobile clients (NFR24)",
        34: "Shared: SUS >=70 on both Web and Native Mobile touch interfaces (NFR03)",
        35: "Shared: Full Thai and English localization across Web and Mobile apps (NFR07)",
        36: "Shared: WCAG 2.2 AA (Web), HIG / TalkBack (Mobile), 100% data sync (NFR08 Revised)",
        42: "Shared: Session cost monitoring aggregates both web and mobile usage (NFR06)",
        43: "Shared: Hosted gateway / native IAP; zero client PAN/CVV storage (NFR10)",
        44: "Shared: HMAC webhook verification and replay defense on backend (NFR11)",
        45: "Shared: Idempotency keys prevent duplicate submission from mobile cellular drops (NFR12)",
        46: "Web Only: Administrative audit trail viewer restricted to Web Application (NFR15)",
        47: "Shared: Tax document generation on backend; mobile complies with app store tax rules (NFR16)"
    }
    for r_idx, note in nfr_platform_notes.items():
        cell = ws_nfr.cell(row=r_idx, column=4, value=note)
        format_data_cell(cell, is_zebra=False, font_size=9, align="left")
        
    style_header_row(ws_nfr, 3, 4, fill=sub_header_fill, height=24)
    style_header_row(ws_nfr, 14, 4, fill=sub_header_fill, height=24)
    style_header_row(ws_nfr, 21, 4, fill=sub_header_fill, height=24)
    style_header_row(ws_nfr, 33, 4, fill=sub_header_fill, height=24)
    style_header_row(ws_nfr, 41, 4, fill=sub_header_fill, height=24)
    auto_fit_columns(ws_nfr, 1, 4, explicit_widths={1: 12, 2: 30, 3: 50, 4: 48})

    # 3. SHEET: RBAC
    ws_rbac = wb.create_sheet(title="RBAC")
    src_rbac = src_wb["RBAC"]
    for r in range(1, src_rbac.max_row + 1):
        for c in range(1, src_rbac.max_column + 1):
            val = src_rbac.cell(row=r, column=c).value
            ws_rbac.cell(row=r, column=c, value=val)
            
    ws_rbac.cell(row=18, column=1, value="FR15 Multi-Platform Access")
    ws_rbac.cell(row=18, column=2, value="ทำได้ (Web & Mobile)")
    ws_rbac.cell(row=18, column=3, value="ทำได้ (Web & Mobile)")
    ws_rbac.cell(row=18, column=4, value="มีเงื่อนไข (Web Only)")
    ws_rbac.cell(row=18, column=5, value="มีเงื่อนไข (Web Only)")
    ws_rbac.cell(row=18, column=6, value="มีเงื่อนไข (Web Only)")
    ws_rbac.cell(row=18, column=8, value="ข้อจำกัดแพลตฟอร์ม: Role ผู้ดูแลระบบและวิจัย (Researcher, Finance Admin, System Admin) เข้าใช้งานได้เฉพาะ Web Application เท่านั้น โดย Native Mobile Application จำกัดเฉพาะ End Users (Guest, Registered User)")
    
    style_header_row(ws_rbac, 1, 8, fill=header_fill, height=28)
    auto_fit_columns(ws_rbac, 1, 8, explicit_widths={1: 32, 2: 18, 3: 18, 4: 18, 5: 18, 6: 18, 7: 6, 8: 45})

    # 4. SHEET: Platform_Access_Matrix
    ws_pam = wb.create_sheet(title="Platform_Access_Matrix")
    ws_pam.merge_cells("A1:E1")
    t_pam = ws_pam["A1"]
    t_pam.value = "InterviewX — Platform Access Matrix (Role × Platform)"
    t_pam.font = Font(name="Segoe UI", size=13, bold=True, color="FFFFFF")
    t_pam.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_pam.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_pam.row_dimensions[1].height = 32
    
    pam_headers = [
        "Security Role", "Web Application (Desktop/Tablet/Mobile Browser)",
        "Native Mobile Application (iOS / Android)", "Platform Scope & Operational Boundary", "Authorization Status"
    ]
    ws_pam.append([])
    ws_pam.append(pam_headers)
    style_header_row(ws_pam, 3, len(pam_headers), height=26)
    
    pam_rows = [
        ("Guest (Unauthenticated)", "Yes", "Yes",
         "Public landing page, onboarding wizard, interview feature discovery, trial interview session (if enabled). No access to personal history, account profile, or subscription purchase without authentication.",
         "Approved Baseline"),
        ("Registered User (User)", "Yes", "Yes",
         "Full interview practice (text & voice), personal interview history, AI evaluation results, performance dashboard, profile settings, consent management, subscription viewing. Authenticated via unified JWT.",
         "Approved Baseline"),
        ("Researcher", "Yes", "No",
         "Access to approved aggregate research datasets, query interfaces, and differential privacy export tools. STRICTLY OUT-OF-SCOPE for Native Mobile Application to prevent research data exposure on mobile devices.",
         "Approved Baseline"),
        ("Payment / Finance Admin", "Yes", "No",
         "Financial dashboard, transaction ledger reconciliation, refund request review, approval and processing, package catalog versioning. STRICTLY RESTRICTED to Web Application for administrative security.",
         "Approved Baseline"),
        ("System Admin", "Yes", "No",
         "System-wide administration: question bank curation, rubric & prompt version management, AI configuration, user role assignment, immutable system audit logs. STRICTLY RESTRICTED to Web Application.",
         "Approved Baseline")
    ]
    for i, row in enumerate(pam_rows):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_pam.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=NAVY_HEADER, align="left")
            elif c_idx in (1, 2):
                style_status_cell(cell, val)
            elif c_idx == 4:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=10, align="left")
        ws_pam.row_dimensions[r_idx].height = 42
    auto_fit_columns(ws_pam, 1, 5, explicit_widths={1: 25, 2: 24, 3: 24, 4: 55, 5: 22})

    # 5. SHEET: Subscription_Matrix
    ws_sub = wb.create_sheet(title="Subscription_Matrix")
    ws_sub.merge_cells("A1:E1")
    t_sub = ws_sub["A1"]
    t_sub.value = "InterviewX — Subscription Entitlement Matrix (Tier × Platform)"
    t_sub.font = Font(name="Segoe UI", size=13, bold=True, color="FFFFFF")
    t_sub.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_sub.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_sub.row_dimensions[1].height = 32
    
    sub_headers = [
        "Subscription Tier", "Web Application Availability", "Native Mobile Availability",
        "Feature Entitlements & Proposed Quotas", "Enforcement Mechanism"
    ]
    ws_sub.append([])
    ws_sub.append(sub_headers)
    style_header_row(ws_sub, 3, len(sub_headers), height=26)
    
    sub_rows = [
        ("Free Tier", "According to Entitlement", "According to Entitlement",
         "Baseline candidate: 5 text sessions/month (proposal, pending D05). 1 core interview category. Core rubric AI scoring. 0 voice sessions. Standard history retention. No credit card required.",
         "Server-side atomic ledger (USAGE_LEDGER). Synchronized across all client devices."),
        ("Basic Tier", "According to Entitlement", "According to Entitlement",
         "Baseline candidate: 30 text sessions/month, 10 voice practice sessions/month (proposal). All interview categories. English grammar analysis. Progress dashboard. Standard support.",
         "Server-side atomic ledger (USAGE_LEDGER). Evaluated at session initialization API."),
        ("Pro Tier", "According to Entitlement", "According to Entitlement",
         "Baseline candidate: Unlimited text sessions (with fair-use throttle), unlimited voice practice (proposal). Advanced speech metrics. Custom difficulty simulation. Priority AI queue.",
         "Server-side atomic ledger + Fair Use Policy rate-limiter. Identical rules on Web & Mobile.")
    ]
    for i, row in enumerate(sub_rows):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_sub.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=BLUE_ACCENT, align="center")
            elif c_idx in (1, 2):
                format_data_cell(cell, is_zebra, font_size=10, bold=True, align="center")
            else:
                format_data_cell(cell, is_zebra, font_size=10, align="left")
        ws_sub.row_dimensions[r_idx].height = 42

    ws_sub.cell(row=8, column=1, value="Core Architectural Authorization Rules (RBAC, Entitlements & Platform Enforcement):")
    ws_sub.cell(row=8, column=1).font = Font(name="Segoe UI", size=11, bold=True, color=NAVY_HEADER)
    
    rules = [
        ("Rule 1: Platform does not replace Role", "The client application frontend (Web vs. Native Mobile) defines interface presentation, NOT permissions. A user's security role (Guest, User, Researcher, Admin) is governed by backend authorization tokens independently of the access device."),
        ("Rule 2: Subscription does not replace Role", "Free, Basic, and Pro tiers are billing and feature entitlement configurations, NOT security roles. All tier subscribers hold the identical security role 'Registered User' (user). Subscription grants quota, not access privilege."),
        ("Rule 3: Guest access boundary", "Unauthenticated Guest users cannot access account-specific resources, personal history, or profile data without completing registration and authentication."),
        ("Rule 4: Resource ownership enforcement", "Registered Users can only access resources they explicitly own (interview sessions, answers, feedback, profile, payment records). Cross-account access attempts (IDOR) are rejected server-side (403/404)."),
        ("Rule 5: Backend-enforced entitlements", "Feature availability, session quotas, and usage limits are verified atomically on backend API services before resource creation. Client-side state is strictly non-authoritative."),
        ("Rule 6: Comprehensive API authorization", "All APIs enforce authentication, role verification, ownership checks, and consent validation on every request. No service trusts client-side authorization flags."),
        ("Rule 7: Defense in Depth (No UI-only security)", "Hiding UI elements or disabling buttons on Web or Mobile does NOT constitute security enforcement. The API Gateway and Domain Services reject unauthorized requests regardless of UI state.")
    ]
    for i, (r_title, r_desc) in enumerate(rules):
        r_idx = 9 + i
        ws_sub.cell(row=r_idx, column=1, value=r_title).font = Font(name="Segoe UI", size=10, bold=True, color="0F172A")
        ws_sub.merge_cells(start_row=r_idx, start_column=2, end_row=r_idx, end_column=5)
        cell_desc = ws_sub.cell(row=r_idx, column=2, value=r_desc)
        format_data_cell(cell_desc, is_zebra=(i%2==1), font_size=9, align="left")
        ws_sub.row_dimensions[r_idx].height = 24
    auto_fit_columns(ws_sub, 1, 5, explicit_widths={1: 25, 2: 24, 3: 24, 4: 50, 5: 35})

    # 6. SHEET: Mobile_Scope
    ws_ms = wb.create_sheet(title="Mobile_Scope")
    ws_ms.merge_cells("A1:E1")
    t_ms = ws_ms["A1"]
    t_ms.value = "InterviewX — Native Mobile Application Functional Scope"
    t_ms.font = Font(name="Segoe UI", size=13, bold=True, color="FFFFFF")
    t_ms.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_ms.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_ms.row_dimensions[1].height = 32
    
    ms_headers = ["Category", "Module Name", "Mapped FR(s)", "Functional Scope Description", "Scope Classification"]
    ws_ms.append([])
    ws_ms.append(ms_headers)
    style_header_row(ws_ms, 3, len(ms_headers), height=26)
    
    in_scope_modules = [
        ("In-Scope", "1. Authentication", "FR01", "JWT token authentication, secure login/logout, password reset, token refresh via OS Keychain/Keystore.", "Approved In-Scope"),
        ("In-Scope", "2. Guest Access", "FR01, FR04, FR05", "Unauthenticated guest browsing, feature introduction, and trial practice session with prompt to register.", "Approved In-Scope"),
        ("In-Scope", "3. User Registration & Login", "FR01", "Email signup with email verification link handling, credential login, password recovery flow.", "Approved In-Scope"),
        ("In-Scope", "4. Onboarding", "FR02", "Welcome walkthrough, current career status selection, practice goal setup, skippable onboarding wizard.", "Approved In-Scope"),
        ("In-Scope", "5. User Profile", "FR02", "View and update personal display name, target job role, skill experience level (Beginner/Intermediate/Advanced).", "Approved In-Scope"),
        ("In-Scope", "6. Interview Setup", "FR03, FR04, FR16", "Configure interview session: category selection, practice mode (Text/Voice), difficulty level, question count.", "Approved In-Scope"),
        ("In-Scope", "7. Interview Room", "FR04, FR06, FR33", "Active mock interview interface, question prompt display, timer control, voluntary pressure mode exit.", "Approved In-Scope"),
        ("In-Scope", "8. Text-based Interview", "FR05", "Multi-line text answer editor, draft autosave, submission with idempotency key, retry on network error.", "Approved In-Scope"),
        ("In-Scope", "9. Voice-based Interview", "FR05-V, FR05.1", "Microphone audio capture, native audio level visualizer, temporary upload to signed URL, STT transcript review.", "Approved In-Scope"),
        ("In-Scope", "10. AI Evaluation", "FR08, FR10, FR36", "Asynchronous evaluation job status polling, progress spinner, retry handling for transient AI timeouts.", "Approved In-Scope"),
        ("In-Scope", "11. Evaluation Results & Feedback", "FR08, FR09, FR11, FR12", "Overall score display, dimension score breakdown, actionable strengths/improvements, sample answers, appeal button.", "Approved In-Scope"),
        ("In-Scope", "12. Dashboard", "FR13", "Visual progression charts, score history by rubric dimension, category mastery level, practice activity summary.", "Approved In-Scope"),
        ("In-Scope", "13. Interview History", "FR14", "Paginated list of completed sessions, review previous questions/transcripts/feedback, delete past session records.", "Approved In-Scope"),
        ("In-Scope", "14. Subscription Information", "FR19, FR20, FR21", "View active plan tier, remaining monthly quotas, renewal date, package comparison (purchase flow per D-M04).", "Approved In-Scope"),
        ("In-Scope", "15. Consent & Privacy", "FR05.1, FR17, FR18, FR35", "Granular consent management, voice retention opt-in toggle, privacy policy reader, Data Subject Request submission.", "Approved In-Scope"),
        ("In-Scope", "16. Account Management", "FR01, FR35", "Password change, linked credentials view, notification preferences, in-app account deletion workflow.", "Approved In-Scope"),
        ("In-Scope", "17. Cross-Platform Data Sync", "FR15", "Automatic synchronization of sessions, history, profile, and quotas with backend database via REST APIs.", "Approved In-Scope")
    ]
    
    out_scope_modules = [
        ("Out-of-Scope", "Admin Console", "FR30, FR32", "Administrative dashboard, configuration editor, system health monitoring. STRICTLY WEB ONLY.", "Approved Out-of-Scope"),
        ("Out-of-Scope", "Researcher Portal", "FR18.1, FR32.1", "Research dataset query interface, differential privacy export, approved data releases. STRICTLY WEB ONLY.", "Approved Out-of-Scope"),
        ("Out-of-Scope", "User Administration", "FR32", "User account status management, role assignment, account suspension/locking. STRICTLY WEB ONLY.", "Approved Out-of-Scope"),
        ("Out-of-Scope", "AI Model Administration", "FR34", "Prompt template editing, rubric weight adjustments, model parameter tuning, benchmark review. STRICTLY WEB ONLY.", "Approved Out-of-Scope"),
        ("Out-of-Scope", "Payment / Finance Admin", "FR27, FR30", "Manual refund approval, transaction reconciliation, payment gateway parameter setup. STRICTLY WEB ONLY.", "Approved Out-of-Scope"),
        ("Out-of-Scope", "Revenue & Financial Reports", "FR31", "Commercial revenue analytics, churn metrics, financial ledger exports. STRICTLY WEB ONLY.", "Approved Out-of-Scope"),
        ("Out-of-Scope", "Research Data Management", "FR18.1, NFR17", "Anonymized corpus compilation, research access logging, re-identification risk review. STRICTLY WEB ONLY.", "Approved Out-of-Scope")
    ]
    
    pending_modules = [
        ("Pending Decision", "Push Notifications", "FR28 (Pending D-M05)", "Remote push alerts for interview reminders, feedback ready, renewal notice via APNs / FCM.", "Pending Decision (D-M05)"),
        ("Pending Decision", "Biometric Authentication", "FR01 (Pending D-M06)", "Face ID / Touch ID / Fingerprint unlock for rapid session resumption on mobile.", "Pending Decision (D-M06)"),
        ("Pending Decision", "Deep Linking & Universal Links", "FR01 (Pending D-M07)", "iOS Universal Links and Android App Links to open verified email and interview links in app.", "Pending Decision (D-M07)"),
        ("Pending Decision", "Background Audio Recording", "FR05-V (Pending Audio Design)", "Recording mock interview responses while app is minimized or screen locked.", "Pending Decision"),
        ("Pending Decision", "Full Offline Interview Mode", "FR33 (Pending D-M08)", "Conducting full AI mock interviews without internet connectivity using on-device models.", "Pending Decision (D-M08)"),
        ("Pending Decision", "On-Device AI Processing", "NFR02 (Pending D-M08)", "Local execution of LLM scoring on mobile NPU/GPU rather than cloud inference server.", "Pending Decision (D-M08)")
    ]
    
    all_ms = in_scope_modules + out_scope_modules + pending_modules
    for i, row in enumerate(all_ms):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_ms.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=NAVY_HEADER, align="center")
            elif c_idx == 1:
                format_data_cell(cell, is_zebra, font_size=10, bold=True, align="left")
            elif c_idx == 2:
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=BLUE_ACCENT, align="center")
            elif c_idx == 4:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=10, align="left")
        ws_ms.row_dimensions[r_idx].height = 30
    auto_fit_columns(ws_ms, 1, 5, explicit_widths={1: 18, 2: 26, 3: 18, 4: 55, 5: 25})

    # 7. SHEET: Data_Synchronization
    ws_ds = wb.create_sheet(title="Data_Synchronization")
    ws_ds.merge_cells("A1:I1")
    t_ds = ws_ds["A1"]
    t_ds.value = "InterviewX — Cross-Platform Data Synchronization Specification"
    t_ds.font = Font(name="Segoe UI", size=13, bold=True, color="FFFFFF")
    t_ds.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_ds.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_ds.row_dimensions[1].height = 32
    
    ds_headers = [
        "Data Category", "Data Owner (Context)", "Source of Truth", "Responsible API Endpoint",
        "Read / Write Access", "Sync Behavior & Frequency", "Conflict Handling Strategy",
        "Security & Encryption Controls", "Technical Status"
    ]
    ws_ds.append([])
    ws_ds.append(ds_headers)
    style_header_row(ws_ds, 3, len(ds_headers), height=26)
    
    sync_data = [
        ("Account Information", "Identity Context", "PostgreSQL (USERS, AUTH_IDENTITIES)",
         "/api/v1/auth/me\n/api/v1/auth/session", "Read (User), Write via auth flows",
         "Instant fetch on app startup/resume; periodic token refresh (15m access / 7d refresh token).",
         "Server timestamp wins; concurrent profile edits rejected with 409 Conflict.",
         "Tokens in iOS Keychain / Android Keystore; TLS 1.3 encryption; no tokens in application logs.",
         "Specified (R1 Baseline)"),
        ("User Profile", "User Context", "PostgreSQL (USERS.current_status, skill_level)",
         "/api/v1/users/profile", "Read / Write by authenticated owner",
         "Synced on app foreground and profile update; optimistic UI update with error rollback.",
         "Last-write-wins based on server updated_at timestamp.",
         "Server-side user ownership check; strict input validation schemas (Zod/Pydantic).",
         "Specified (R1 Baseline)"),
        ("Subscription Entitlement", "Billing Context", "PostgreSQL (SUBSCRIPTIONS, USAGE_LEDGER)",
         "/api/v1/subscriptions/current\n/api/v1/entitlements/check", "Read-only for clients; Write via backend payment events",
         "Fetched on interview initialization; atomic server-side check before session creation.",
         "Server authoritative state always overrides client cache; quota deduction is atomic.",
         "Tamper-proof server enforcement; client-side cached quotas used strictly for UI rendering.",
         "Specified (R3 Baseline)"),
        ("Interview Session", "Interview Context", "PostgreSQL (INTERVIEW_SESSIONS, SESSION_QUESTIONS)",
         "/api/v1/interviews\n/api/v1/interviews/{id}/answers", "Read / Write by session owner",
         "Per-question request/response; active session state buffered locally during cellular drop.",
         "Idempotency keys (Idempotency-Key header) prevent duplicate answer submission.",
         "Session locked to authenticated user_id; CSRF on Web, Bearer token on Mobile.",
         "Specified (R1 Baseline)"),
        ("Interview History", "Interview Context", "PostgreSQL (INTERVIEW_SESSIONS, ANSWERS, FEEDBACK)",
         "/api/v1/interviews/history\n/api/v1/interviews/{id}", "Read-only; Delete by owner (soft delete)",
         "Paginated retrieval on demand; cached locally for quick display; invalidated on delete.",
         "Append-only historical log; server state authoritative.",
         "Filtered strictly by user_id; deleted sessions excluded from queries and marked for purge.",
         "Specified (R1 Baseline)"),
        ("AI Evaluation Results", "Evaluation Context", "PostgreSQL (FEEDBACK, EVALUATION_JOBS)",
         "/api/v1/evaluations/{jobId}\n/api/v1/interviews/{id}/feedback", "Read-only by session owner",
         "Asynchronous polling (P95 <= 15s) or push alert; cached persistently on client once complete.",
         "Immutable evaluation records pinned to rubric and model versions; no client editing permitted.",
         "Results owned exclusively by user; appeal submission routes to admin review queue.",
         "Specified (R1 Baseline)"),
        ("User Preferences", "User Context / Client", "PostgreSQL (USER_PREFERENCES) + Local Device Storage",
         "/api/v1/users/preferences", "Read / Write by authenticated user",
         "Global preferences synced on change; device-specific settings (biometric toggle) kept local.",
         "Server timestamp wins for cloud preferences; device settings remain isolated locally.",
         "Preferences validated against strict allowlist schema; no sensitive data in preferences.",
         "Proposed — Pending Approval (TBD)"),
        ("Consent Records", "Privacy Context", "PostgreSQL (CONSENT_EVENTS, PROCESSING_NOTICES)",
         "/api/v1/privacy/consents\n/api/v1/privacy/notices/current", "Read active consents; Write append-only event",
         "Synced on launch; updated notice version triggers mandatory blocking modal across clients.",
         "Append-only event log; latest valid consent event per purpose governs backend processing.",
         "Immutable audit trail; withdrawal immediately blocks processing across backend services.",
         "Specified (R1 Baseline)")
    ]
    for i, row in enumerate(sync_data):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_ds.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=NAVY_HEADER, align="left")
            elif c_idx == 1:
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=BLUE_ACCENT, align="center")
            elif c_idx == 8:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=9, align="left")
        ws_ds.row_dimensions[r_idx].height = 40
    auto_fit_columns(ws_ds, 1, 9, explicit_widths={1: 22, 2: 18, 3: 28, 4: 28, 5: 22, 6: 38, 7: 35, 8: 38, 9: 22})

    # 8. SHEET: Decision_Register
    ws_dec = wb.create_sheet(title="Decision_Register")
    ws_dec.merge_cells("A1:H1")
    t_dec = ws_dec["A1"]
    t_dec.value = "InterviewX — Phase 1: Native Mobile & Platform Decision Register"
    t_dec.font = Font(name="Segoe UI", size=13, bold=True, color="FFFFFF")
    t_dec.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_dec.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_dec.row_dimensions[1].height = 32
    
    dec_headers = ["ID", "Category", "Decision Item", "Technical / Business Description", "Options Under Consideration", "Recommended Option", "Owner", "Status"]
    ws_dec.append([])
    ws_dec.append(dec_headers)
    style_header_row(ws_dec, 3, len(dec_headers), height=26)
    
    short_decisions = [
        ("D-M01", "Architecture / Release", "Native Mobile Release Timeline & Gate",
         "Define the formal delivery milestone for Native Mobile (iOS/Android). Options: simultaneous R1, staged R2 alongside voice, or R3.",
         "Opt A: Target R2 alongside Voice & Progress features (Recommended).\nOpt B: Simultaneous R1 release.\nOpt C: Defer to R3.",
         "Option A (Target R2 release; solidifies Core NestJS backend APIs on responsive web first).", "Product Owner / Tech Lead", "Pending Confirmation"),
        ("D-M02", "Mobile Technology", "Mobile Application Framework Selection",
         "Select development stack for iOS and Android: React Native vs. Flutter vs. Native Swift/Kotlin.",
         "Opt A: React Native / Expo (Code/skill reuse with Next.js/TS team).\nOpt B: Flutter / Dart.\nOpt C: Native Swift & Kotlin.",
         "Option A (React Native enables sharing validation schemas & types with backend).", "Technical Lead / Mobile Architect", "Pending Confirmation"),
        ("D-M03", "OS Compatibility", "Minimum Supported OS Versions",
         "Establish minimum OS support baseline for iOS and Android.",
         "Opt A: iOS 16.0+ and Android 13.0+ (API 33) (Modern audio APIs, secure hardware enclave).\nOpt B: iOS 15.0+ and Android 10.0+.",
         "Option A (iOS 16+ / Android 13+ covers ~92% active devices with high security).", "QA Lead / Mobile Architect", "Pending Confirmation"),
        ("D-M04", "Commercial / Billing", "Mobile Payment Architecture & Store Fee Strategy",
         "Determine whether mobile subscriptions utilize Apple/Google In-App Purchase (15-30% fee) or redirect to Web-based checkout.",
         "Opt A: View subscription on mobile, redirect to Web Checkout for purchase.\nOpt B: Native In-App Purchase (StoreKit / Google Play Billing).",
         "Option A for initial release with App Store guideline review; evaluate Option B if required.", "Finance Admin / Product Owner / Legal", "Pending Confirmation"),
        ("D-M05", "User Engagement", "Push Notifications Scope & Infrastructure",
         "Assess requirement for remote push notifications (APNs / FCM) for practice reminders, AI feedback alerts, and renewal notices.",
         "Opt A: Implement APNs/FCM service via unified notification worker in R2.\nOpt B: In-app notifications and transactional emails only.",
         "Option A targeted for R2 release.", "Product Owner / Backend Lead", "Pending Confirmation"),
        ("D-M06", "Security & Auth", "Biometric Authentication Integration",
         "Determine whether Native Mobile should support biometric unlock (Face ID / Touch ID / BiometricPrompt).",
         "Opt A: Biometric unlock for stored refresh tokens in OS Keychain/Keystore.\nOpt B: Standard JWT refresh token with timeout.",
         "Option A as non-breaking client enhancement once basic auth is verified.", "Security Lead / Mobile Lead", "Pending Confirmation"),
        ("D-M07", "Navigation & Linking", "Deep Linking & Universal Links",
         "Implementation of iOS Universal Links and Android App Links for auth verification and session resumption.",
         "Opt A: Configure apple-app-site-association and assetlinks.json.\nOpt B: Web-only routing with fallback prompts.",
         "Option A for seamless email auth and session linking.", "Frontend Lead / Mobile Lead", "Pending Confirmation"),
        ("D-M08", "Offline & Resilience", "Offline Mode & Local Storage Scope",
         "Establish boundaries for mobile offline functionality. Online-only AI inference vs offline local mock interviews.",
         "Opt A: Online-only for AI practice; transient local caching of draft answers and retry chunks.\nOpt B: Full offline mock interviews with on-device LLM.",
         "Option A (Online-required for AI evaluation; client resilience ensures answer recovery).", "Software Architect / AI Lead", "Pending Confirmation"),
        ("D-M09", "Product Roadmap", "Cross-Platform Feature Parity & Rollout Strategy",
         "Define feature parity between Web and Native Mobile for End User capabilities.",
         "Opt A: 100% End User feature parity between Web and Mobile for released modules.\nOpt B: Mobile-first subset focused only on voice.",
         "Option A for core end-user features; Admin/Researcher remain strictly Web-only.", "Product Owner / QA Lead", "Pending Confirmation"),
        ("D-M10", "Distribution & Policy", "Mobile App Store Distribution & Privacy Compliance",
         "Compliance strategy for Apple App Store Guidelines and Google Play Developer Policies.",
         "Opt A: Full compliance package: in-app account deletion, mic consent, privacy nutrition labels.\nOpt B: Enterprise internal ad-hoc distribution.",
         "Option A (Mandatory for public commercial release).", "Legal / Privacy Lead / Release Manager", "Pending Confirmation"),
        ("D-M11", "Audio & Media", "Real-time Audio Streaming Protocol for Mobile Voice",
         "Select audio transmission protocol for mobile voice practice in R2.",
         "Opt A: Chunked HTTPS upload to signed S3/MinIO URLs (Robust over cellular).\nOpt B: Bi-directional WebSocket / WebRTC streaming.",
         "Option A for initial R2 implementation; evaluate Option B if latency budget demands it.", "Technical Lead / AI Lead", "Pending Confirmation")
    ]
    for i, row in enumerate(short_decisions):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_dec.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=NAVY_HEADER, align="center")
            elif c_idx == 1:
                format_data_cell(cell, is_zebra, font_size=10, bold=True, align="center")
            elif c_idx == 7:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=9, align="left")
        ws_dec.row_dimensions[r_idx].height = 38
    auto_fit_columns(ws_dec, 1, 8, explicit_widths={1: 12, 2: 18, 3: 26, 4: 42, 5: 38, 6: 32, 7: 22, 8: 20})

    # 9. SHEET: Change_Log
    ws_cl = wb.create_sheet(title="Change_Log")
    ws_cl.merge_cells("A1:E1")
    t_cl = ws_cl["A1"]
    t_cl.value = "InterviewX — Phase 1 Document Change Log (Workbook Modifications)"
    t_cl.font = Font(name="Segoe UI", size=13, bold=True, color="FFFFFF")
    t_cl.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_cl.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_cl.row_dimensions[1].height = 32
    
    cl_headers = ["Version", "Revision Date", "Affected Worksheet / Section", "Nature of Modification", "Approval Status"]
    ws_cl.append([])
    ws_cl.append(cl_headers)
    style_header_row(ws_cl, 3, len(cl_headers), height=26)
    
    cl_rows = [
        ("1.0", "08 Oct 2026", "Consolidated Baseline (All Sheets)", "Initial consolidated baseline from requirement survey and engineering reviews.", "Baseline Approved (v1.0)"),
        ("1.1 DRAFT", "13 Nov 2026", "Sheet: FR (FR15)", "Revised FR15 to distinguish Responsive Web and Native Mobile applications, supported user roles, shared authentication, and platform restrictions.", "Proposed Revision — Pending Approval"),
        ("1.1 DRAFT", "13 Nov 2026", "Sheet: FR (Platform Scope Column)", "Added Column D classifying all 40 Functional Requirements into platform scopes (Shared, Web Only, etc.).", "Proposed Revision — Pending Approval"),
        ("1.1 DRAFT", "13 Nov 2026", "Sheet: NFR (NFR08)", "Revised NFR08 to establish explicit accessibility and consistency targets for Responsive Web (WCAG 2.2 AA) and Native Mobile (HIG/TalkBack).", "Proposed Revision — Pending Approval"),
        ("1.1 DRAFT", "13 Nov 2026", "Sheet: NFR (NFR01, 04, 09, 19)", "Annotated mobile security (Keychain/Keystore), cellular network latency (P95 <= 2.5s), audio cache purging, and backend authorization.", "Proposed Revision — Pending Approval"),
        ("1.1 DRAFT", "13 Nov 2026", "Sheet: RBAC (FR15 Row)", "Updated FR15 RBAC entries and added governance notes clarifying that Admin and Researcher roles are strictly restricted to Web Application.", "Proposed Revision — Pending Approval"),
        ("1.1 DRAFT", "13 Nov 2026", "Sheet: Platform_Access_Matrix", "Created dedicated Role x Platform matrix defining Web and Native Mobile access boundaries for all 5 security roles.", "Proposed Addition — Pending Approval"),
        ("1.1 DRAFT", "13 Nov 2026", "Sheet: Subscription_Matrix", "Created dedicated Subscription Tier x Platform matrix defining Free, Basic, and Pro entitlements and 7 Core Authorization Rules.", "Proposed Addition — Pending Approval"),
        ("1.1 DRAFT", "13 Nov 2026", "Sheet: Mobile_Scope", "Created dedicated breakdown of 17 Mobile In-Scope modules, 7 Out-of-Scope modules, and 6 Pending Decision modules.", "Proposed Addition — Pending Approval"),
        ("1.1 DRAFT", "13 Nov 2026", "Sheet: Data_Synchronization", "Created cross-platform data synchronization specification across 8 core data categories with conflict handling and security controls.", "Proposed Addition — Pending Approval"),
        ("1.1 DRAFT", "13 Nov 2026", "Sheet: Decision_Register", "Integrated full register of 11 architectural and operational mobile decisions (D-M01 through D-M11) pending formal stakeholder sign-off.", "Pending Confirmation")
    ]
    for i, row in enumerate(cl_rows):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_cl.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=10, bold=True, color=NAVY_HEADER, align="center")
            elif c_idx == 1:
                format_data_cell(cell, is_zebra, font_size=10, align="center")
            elif c_idx == 4:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=9, align="left")
        ws_cl.row_dimensions[r_idx].height = 28
    auto_fit_columns(ws_cl, 1, 5, explicit_widths={1: 14, 2: 16, 3: 32, 4: 55, 5: 30})

    wb.save(out_path)
    print(f"Generated Aligned FR/NFR/RBAC Workbook: {out_path}")

# Execute builds
out_dir = r"D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements"
src_file = os.path.join(out_dir, "InterviewX_FR_NFR_RBAC.xlsx")
dst_file = os.path.join(out_dir, "InterviewX_FR_NFR_RBAC_v1.1_DRAFT.xlsx")

build_decision_register_workbook(os.path.join(out_dir, "InterviewX_Phase1_Decision_Register.xlsx"))
build_traceability_workbook(os.path.join(out_dir, "InterviewX_Phase1_Requirement_Traceability.xlsx"))
build_aligned_fr_nfr_rbac_workbook(src_file, dst_file)
print("All 3 Excel files generated successfully!")
