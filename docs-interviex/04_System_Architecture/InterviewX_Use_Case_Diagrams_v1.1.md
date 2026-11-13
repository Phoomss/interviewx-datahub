# แบบจำลองกรณีการใช้งานระบบ InterviewX (InterviewX System Use Case Model)
> **InterviewX — AI Job Interview Simulation System**  
> **เวอร์ชัน:** 1.1 DRAFT (Phase 1: Requirement & Platform Alignment Baseline)  
> **วันที่จัดทำ:** 13 พฤศจิกายน 2026  
> **สถานะเอกสาร:** ข้อกำหนดทางสถาปัตยกรรมระบบ (System Architecture Specification)

---

## 📌 บทนำและภาพรวม (Introduction & Overview)

เอกสารฉบับนี้กำหนดแบบจำลองกรณีการใช้งาน (Use Case Model) ของระบบ **InterviewX** โดยครอบคลุมผู้แสดงบทบาท (Actors) ทั้งหมด ทั้งผู้ใช้บุคคล (Human Actors) และระบบภายนอกที่ทำงานร่วมกัน (External Supporting Systems) พร้อมทั้งแสดงความสัมพันธ์ระหว่างกรณีการใช้งานตามมาตรฐาน UML (`<<include>>`, `<<extend>>`, และ Generalization)

โมเดลกรณีการใช้งานนี้เชื่อมโยงและสอดคล้อง 100% กับ:
1. **กรณีการใช้งานหลัก (Core Use Cases UC01–UC10):** ตามที่ระบุใน [InterviewX_SRS_v1.1_DRAFT_TH.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_SRS_v1.1_DRAFT_TH.md#L158-L175)
2. **ข้อกำหนดเชิงหน้าที่ (Functional Requirements FR01–FR36):** อ้างอิง [03_SRS_Requirements](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/)
3. **การแบ่งส่วนติดต่อผู้ใช้ (Platform Boundary):** แยกการเข้าถึงระหว่าง Responsive Web Application (เข้าถึงได้ทุกบทบาท) และ Native Mobile Application (จำกัดเฉพาะ End Users: Guest และ Registered User) ตามมติสถาปัตยกรรม D-M01

---

## 👥 บัญชีรายชื่อผู้แสดงบทบาท (Actor Catalog)

| สัญลักษณ์ | ผู้แสดงบทบาท (Actor) | ประเภท | บทบาทหน้าที่และสิทธิ์การเข้าถึง | แพลตฟอร์มที่รองรับ |
|:---:|---|:---:|---|---|
| 👤 | **Guest**<br>(ผู้เยี่ยมชม) | ผู้ใช้ภายนอก<br>(Primary Human) | ผู้ใช้งานทั่วไปที่ยังไม่ลงทะเบียน สามารถดูหน้าแรก สำรวจหมวดหมู่คำถาม และทดลองทำแบบสัมภาษณ์ตัวอย่างฟรีแบบจำกัด | Web & Mobile |
| 👤 | **Registered User**<br>(ผู้สมัครงาน / ผู้ใช้งาน) | ผู้ใช้ภายนอก<br>(Primary Human) | ผู้สมัครงานที่ลงทะเบียนบัญชีแล้ว สืบทอดสิทธิ์ของ Guest สามารถจัดการโปรไฟล์ ฝึกสัมภาษณ์แบบข้อเขียน/เสียง ดูผลการประเมิน AI ตรวจสอบประวัติ และจัดการสิทธิ์ PDPA | Web & Mobile |
| 🛡️ | **System Administrator**<br>(ผู้ดูแลระบบ) | บทบาทภายใน<br>(Primary Human) | จัดการระบบคลังคำถามและรูบริก, ปรับแต่งพารามิเตอร์โมเดล AI, จัดการบัญชีผู้ใช้และสิทธิ์ความปลอดภัย, ตรวจสอบ Audit Log และพิจารณาข้ออุทธรณ์ผลคะแนน | เฉพาะ Web เท่านั้น |
| 💳 | **Finance Administrator**<br>(ผู้ดูแลการเงิน R3) | บทบาทภายใน<br>(Primary Human) | ดูแลและตรวจสอบรายงานทางการเงิน ยอดขาย ค่าสมาชิก (MRR) และดำเนินการตรวจสอบและอนุมัติ/ปฏิเสธคำขอคืนเงิน | เฉพาะ Web เท่านั้น |
| 🔬 | **Research Data Engineer**<br>(ผู้วิจัยและวิศวกรข้อมูล R3) | บทบาทภายใน<br>(Primary Human) | สกัดและส่งออกชุดข้อมูลวิจัยแบบนิรนาม (Anonymized Aggregate Datasets) ภายใต้เกณฑ์ k-anonymity / Differential Privacy เพื่องานวิจัยและพัฒนา LLM | เฉพาะ Web เท่านั้น |
| 🤖 | **External LLM Provider**<br>(ผู้ให้บริการโมเดล AI) | ระบบภายนอก<br>(Secondary System) | ให้บริการ AI Inference สำหรับการสร้างคำถามสัมภาษณ์ (FR03/FR14), การตรวจให้คะแนนตามเกณฑ์รูบริก (FR07), การวิเคราะห์โครงสร้างคำตอบ (FR08) และสร้างข้อเสนอแนะ | API หลังบ้าน |
| 🎙️ | **Speech-to-Text Provider**<br>(บริการแปลงเสียงเป็นข้อความ R2) | ระบบภายนอก<br>(Secondary System) | บริการภายนอกสำหรับแปลงไฟล์เสียงคำตอบสัมภาษณ์ของผู้ใช้เป็นข้อความตัวอักษรเพื่อส่งเข้ากระบวนการประเมินผล AI | API หลังบ้าน |
| 🏦 | **Payment Gateway**<br>(ผู้ให้บริการชำระเงิน R3) | ระบบภายนอก<br>(Secondary System) | ให้บริการตัดบัตรเครดิต/พร้อมเพย์สำหรับแพ็กเกจสมาชิก และประมวลผลคำสั่งโอนเงินคืนตามคำขอ | API หลังบ้าน |
| ✉️ | **Transactional Email Service**<br>(บริการส่งอีเมลระบบ) | ระบบภายนอก<br>(Secondary System) | บริการส่งอีเมลยืนยันตัวตน ลิงก์รีเซ็ตรหัสผ่าน และอีเมลสรุปรายงานการฝึกสัมภาษณ์ | API หลังบ้าน |

---

## 🌐 1. แผนภาพกรณีการใช้งานระดับภาพรวมระบบ (System-Level Master Use Case Diagram)

แผนภาพนี้แสดงภาพรวมการมีปฏิสัมพันธ์ระหว่างผู้แสดงบทบาททั้ง 5 กลุ่ม กับกรณีการใช้งานหลักทั้ง 10 รายการ (UC01–UC10) และระบบภายนอก 4 ระบบ ภายใต้ขอบเขตระบบ **InterviewX Platform System Boundary**:

```mermaid
flowchart LR
  subgraph Candidates["กลุ่มผู้ใช้งานทั่วไป (End Users)"]
    Guest([👤 Guest / ผู้เยี่ยมชม])
    User([👤 Registered User / ผู้สมัครงาน])
  end

  subgraph Staff["กลุ่มผู้ดูแลระบบและทีมงานภายใน (Internal Roles)"]
    Admin([🛡️ System Admin / ผู้ดูแลระบบ])
    Finance([💳 Finance Admin / ผู้ดูแลการเงิน R3])
    Researcher([🔬 Research Engineer / ผู้วิจัย R3])
  end

  subgraph SystemBoundary["กรอบขอบเขตระบบ InterviewX (InterviewX Platform Boundary)"]
    UC01(["UC01: สำรวจระบบและทดลองทำสัมภาษณ์ตัวอย่าง
(Explore & Trial Simulation) [R1]"])
    UC02(["UC02: ลงทะเบียนและเข้าสู่ระบบด้วยอีเมล
(Register & Authenticate) [R1]"])
    UC03(["UC03: ตั้งค่าโปรไฟล์และกำหนดเป้าหมาย
(Manage Profile & Goals) [R1]"])
    UC04(["UC04: ดำเนินการฝึกสัมภาษณ์แบบข้อเขียน
(Practice Text Interview) [R1]"])
    UC05(["UC05: ดำเนินการฝึกสัมภาษณ์ด้วยเสียงพูด
(Practice Voice Interview) [R2]"])
    UC06(["UC06: ตรวจสอบผลการประเมินและข้อเสนอแนะ AI
(Review AI Evaluation & Feedback) [R1]"])
    UC07(["UC07: ตรวจสอบประวัติการฝึกซ้อมและแดชบอร์ด
(View History & Dashboard) [R1/R2]"])
    UC08(["UC08: จัดการความยินยอมและสิทธิ์คุ้มครองข้อมูล
(Manage PDPA Privacy Rights) [R1]"])
    UC09(["UC09: บริหารจัดการการเงินและรายการคืนเงิน
(Manage Billing & Refunds) [R3]"])
    UC10(["UC10: บริหารระบบ คลังคำถาม และโมเดล AI
(Administer System & Question Bank) [R1]"])
  end

  subgraph ExternalServices["ระบบสนับสนุนภายนอก (External Supporting Services)"]
    EmailGateway[[✉️ Email Service Provider]]
    LLMService[[🤖 External Hosted LLM]]
    STTService[[🎙️ Speech-to-Text Provider R2]]
    PaymentGW[[🏦 Payment Gateway Provider R3]]
  end

  User -- สืบทอดสิทธิ์ (Generalizes) --> Guest

  Guest --> UC01
  Guest --> UC02

  User --> UC02
  User --> UC03
  User --> UC04
  User --> UC05
  User --> UC06
  User --> UC07
  User --> UC08
  User -. "ซื้อสมาชิก" .-> UC09

  Admin --> UC10
  Admin -. "จัดการสิทธิ์ข้อมูล" .-> UC08
  Finance --> UC09
  Researcher -. "สกัดชุดข้อมูลวิจัย" .-> UC08

  UC02 --> EmailGateway
  UC04 --> LLMService
  UC05 --> STTService
  UC05 --> LLMService
  UC06 --> LLMService
  UC09 --> PaymentGW

  classDef actorStyle fill:#f0f4f8,stroke:#334155,stroke-width:2px;
  classDef externalStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px;
  classDef r1Style fill:#ecfdf5,stroke:#059669,stroke-width:2px;
  classDef r2Style fill:#eff6ff,stroke:#2563eb,stroke-width:2px;
  classDef r3Style fill:#fdf4ff,stroke:#9333ea,stroke-width:2px;

  class Guest,User,Admin,Finance,Researcher actorStyle;
  class EmailGateway,LLMService,STTService,PaymentGW externalStyle;
  class UC01,UC02,UC03,UC04,UC06,UC07,UC08,UC10 r1Style;
  class UC05 r2Style;
  class UC09 r3Style;
```

---

## 🎯 2. แผนภาพกรณีการใช้งานระบบฝึกสัมภาษณ์และการประเมินผล AI (Practice & AI Evaluation Subsystem)

แผนภาพนี้เจาะลึกกระบวนการหลักของการจำลองการสัมภาษณ์งาน (UC04, UC05) และการประเมินผลฟีดแบ็กจาก AI (UC06) โดยแสดงความสัมพันธ์ `<<include>>` (กระบวนการจำเป็น) และ `<<extend>>` (กระบวนการเสริมตามเงื่อนไข):

```mermaid
flowchart LR
  subgraph Candidate["ผู้สมัครงาน"]
    User([👤 Registered User])
  end

  subgraph SubsystemBoundary["ระบบฝึกสัมภาษณ์และการประเมินผล AI (Interview & AI Evaluation Engine)"]
    direction TB
    
    StartSession(["เริ่มสร้างเซสชันสัมภาษณ์
(Start Interview Session)"])
    SelectDifficulty(["เลือกระดับความยากง่าย
(Difficulty Scaling - FR16)"])
    SelectPressure(["เปิดโหมดสัมภาษณ์กดดัน
(Pressure Mode - FR33)"])

    TextPractice(["(UC04) ฝึกสัมภาษณ์แบบข้อเขียน
(Practice Text Interview) [FR05]"])
    VoicePractice(["(UC05) ฝึกสัมภาษณ์ด้วยเสียง
(Practice Voice Interview) [FR05-V]"])

    AutosaveDraft(["บันทึกร่างคำตอบอัตโนมัติ
(Autosave Draft - FR05)"])
    VoiceConsent(["ขอความยินยอมเก็บไฟล์เสียง
(Voice Retention Consent - FR05.1)"])
    TranscribeAudio(["แปลงเสียงเป็นข้อความ
(Transcribe Speech to Text)"])

    GenerateQuestion(["ดึงคำถามจากคลังมาตรฐาน
(Fetch Question - FR03)"])
    FollowupQuestion(["สร้างคำถามติดตามผลตามบริบท
(Contextual Follow-up - FR14)"])

    CheckQuota(["ตรวจสอบโควตาสมาชิก
(Subscription Entitlement - FR13)"])
    ViewProgress(["ดูสถานะการประมวลผล AI
(AI Job Processing Status - FR19)"])

    ReviewEval(["(UC06) ตรวจสอบผลประเมินและรูบริก
(Review AI Evaluation Report) [FR07]"])
    RubricScore(["คำนวณคะแนนตามเกณฑ์รูบริก
(Calculate Rubric Scores)"])
    RelevanceAnalysis(["วิเคราะห์ความตรงประเด็น STAR
(Answer Relevance Analysis - FR08)"])
    StrengthWeakness(["รายงานสรุปจุดแข็ง/จุดพัฒนา
(Strengths & Weaknesses - FR09)"])
    GrammarAnalysis(["วิเคราะห์ไวยากรณ์ภาษาอังกฤษ
(Grammar & Language - FR10)"])
    SpeechRhythm(["วิเคราะห์จังหวะและความเร็วพูด
(Speech Pace & Rhythm - FR36)"])
    ImprovementTips(["ดูคำแนะนำปรับปรุงคำตอบ
(Answer Guidance - FR06)"])
    AppealScore(["ส่งคำขออุทธรณ์ผลประเมิน
(Evaluation Appeal - FR17)"])
    ExportPDF(["ดาวน์โหลดรายงานสรุป PDF
(Export Feedback Report - FR20)"])
  end

  subgraph ExternalEngines["ระบบประมวลผลภายนอก"]
    LLM[[🤖 Hosted LLM Provider]]
    STT[[🎙️ Speech-to-Text Provider]]
  end

  User --> StartSession
  User --> TextPractice
  User --> VoicePractice
  User --> ReviewEval
  User --> ViewProgress

  StartSession -.->|"<<include>>"| GenerateQuestion
  StartSession -.->|"<<include>>"| CheckQuota
  SelectDifficulty -.->|"<<extend>>"| StartSession
  SelectPressure -.->|"<<extend>>"| StartSession
  FollowupQuestion -.->|"<<extend>>"| GenerateQuestion

  AutosaveDraft -.->|"<<extend>>"| TextPractice

  VoicePractice -.->|"<<include>>"| VoiceConsent
  VoicePractice -.->|"<<include>>"| TranscribeAudio
  TranscribeAudio --> STT

  ReviewEval -.->|"<<include>>"| RubricScore
  ReviewEval -.->|"<<include>>"| RelevanceAnalysis
  ReviewEval -.->|"<<include>>"| StrengthWeakness

  GrammarAnalysis -.->|"<<extend>>"| ReviewEval
  SpeechRhythm -.->|"<<extend>>"| ReviewEval
  ImprovementTips -.->|"<<extend>>"| ReviewEval
  AppealScore -.->|"<<extend>>"| ReviewEval
  ExportPDF -.->|"<<extend>>"| ReviewEval

  GenerateQuestion --> LLM
  FollowupQuestion --> LLM
  RubricScore --> LLM
  RelevanceAnalysis --> LLM
  GrammarAnalysis --> LLM
  ImprovementTips --> LLM
```

---

## 🔒 3. แผนภาพกรณีการใช้งานระบบยืนยันตัวตน บัญชี และคุ้มครองข้อมูลส่วนบุคคล (Auth & Privacy Subsystem)

แผนภาพนี้ครอบคลุมการควบคุมการเข้าถึง บัญชีผู้ใช้งาน และการปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) ตามข้อกำหนด FR01, FR02, FR18, FR21, FR22, FR23, และ FR35:

```mermaid
flowchart LR
  subgraph Actors["ผู้แสดงบทบาท"]
    Guest([👤 Guest / ผู้เยี่ยมชม])
    User([👤 Registered User / ผู้ใช้ทั่วไป])
    Admin([🛡️ System Admin / เจ้าหน้าที่คุ้มครองข้อมูล])
  end

  subgraph PrivacyBoundary["ระบบการตรวจสอบสิทธิ์และธรรมาภิบาลข้อมูล (Identity & Privacy Governance)"]
    direction TB

    SignUp(["ลงทะเบียนด้วยอีเมลและรหัสผ่าน
(Sign Up with Email - FR01)"])
    VerifyEmail(["ยืนยันอีเมลผ่านลิงก์ปลอดภัย
(Verify Email Address)"])
    Login(["เข้าสู่ระบบและรับ JWT Token
(Authenticate & Issue Tokens - FR01)"])
    LogoutAll(["ยกเลิกเซสชันทุกอุปกรณ์
(Logout from All Devices - FR23)"])
    ChangePassword(["เปลี่ยนรหัสผ่านประจำตัว
(Change Password - FR23)"])

    ManageProfile(["(UC03) ตั้งค่าโปรไฟล์และเป้าหมาย
(Manage Profile & Goals - FR02)"])

    ConsentMgmt(["(UC08) จัดการความยินยอม PDPA
(Manage Consent Preferences - FR18)"])
    RevokeConsent(["เพิกถอนความยินยอมรายวัตถุประสงค์
(Revoke Specific Consent)"])
    ExportData(["ขอรับสำเนาข้อมูลส่วนบุคคล
(Data Portability Request - FR21)"])
    DeleteAccount(["ขอลบบัญชีและทำลายข้อมูล
(Right to Erasure / Deletion - FR22)"])

    ReviewDSR(["พิจารณาคำร้องขอใช้สิทธิ์เจ้าของข้อมูล
(Process DSR Workflow - FR35)"])
    AuditLog(["บันทึกหลักฐานความยินยอม
(Immutable Audit Logging - FR26)"])
  end

  subgraph MailService["ระบบภายนอก"]
    EmailGateway[[✉️ Transactional Email]]
  end

  Guest --> SignUp
  Guest --> Login
  SignUp -.->|"<<include>>"| VerifyEmail
  VerifyEmail --> EmailGateway

  User --> Login
  User --> ChangePassword
  User --> LogoutAll
  User --> ManageProfile
  User --> ConsentMgmt
  User --> ExportData
  User --> DeleteAccount

  ConsentMgmt -.->|"<<extend>>"| RevokeConsent
  ConsentMgmt -.->|"<<include>>"| AuditLog
  RevokeConsent -.->|"<<include>>"| AuditLog
  DeleteAccount -.->|"<<include>>"| ReviewDSR
  ExportData -.->|"<<include>>"| ReviewDSR

  Admin --> ReviewDSR
```

---

## 📊 4. แผนภาพกรณีการใช้งานระบบบริหาร คลังคำถาม การเงิน และข้อมูลวิจัย (Administration & Governance Subsystem)

แผนภาพนี้แสดงฟังก์ชันการทำงานสำหรับบทบาทภายใน (Admin, Finance, Researcher) ซึ่งทำงานผ่าน **Web Application เท่านั้น** ครอบคลุมคลังคำถาม (FR24), การจัดการผู้ใช้ (FR25/FR32), การเงินและคืนเงิน (FR30/FR31), การตั้งค่า AI (FR34) และการวิจัยข้อมูล (FR18.1):

```mermaid
flowchart LR
  subgraph InternalUsers["บทบาททีมงานภายใน (Web Only)"]
    Admin([🛡️ System Admin])
    Finance([💳 Finance Admin R3])
    Researcher([🔬 Research Engineer R3])
  end

  subgraph AdminBoundary["พอร์ทัลการบริหารจัดการระบบและกำกับดูแล (Backoffice & Governance Portal)"]
    direction TB

    ManageQuestions(["(UC10) จัดการคลังคำถามและหมวดหมู่
(Question Bank Console - FR24)"])
    ManageRubrics(["จัดการเกณฑ์รูบริกและเวอร์ชัน
(Rubric Versioning Console - FR24)"])
    ConfigAI(["ตั้งค่าโมเดลและทดสอบ Prompt
(AI Model & Prompt Config - FR34)"])

    ManageUsers(["จัดการรายชื่อผู้ใช้และบทบาท
(User & Role RBAC Console - FR25)"])
    SuspendUser(["ระงับการใช้งานและปลดล็อกบัญชี
(Suspend & Unlock Accounts - FR32)"])
    ReviewAudit(["ตรวจสอบประวัติความปลอดภัย
(Security Audit Viewer - FR26)"])

    HandleAppeals(["พิจารณาข้ออุทธรณ์ผลคะแนน
(Resolve Score Appeals - FR17)"])

    ViewFinances(["(UC09) ดูแดชบอร์ดรายได้และการเงิน
(Financial & MRR Dashboard - FR31)"])
    ProcessRefund(["พิจารณาอนุมัติ/ปฏิเสธการคืนเงิน
(Process Refund Requests - FR30)"])

    ExportResearch(["(UC08.1) ส่งออกชุดข้อมูลวิจัยนิรนาม
(Export Anonymized Research Dataset - FR18.1)"])
  end

  subgraph ExtPayment["ระบบภายนอก"]
    PaymentGW[[🏦 Payment Gateway]]
  end

  Admin --> ManageQuestions
  Admin --> ManageRubrics
  Admin --> ConfigAI
  Admin --> ManageUsers
  Admin --> SuspendUser
  Admin --> ReviewAudit
  Admin --> HandleAppeals

  Finance --> ViewFinances
  Finance --> ProcessRefund
  ProcessRefund --> PaymentGW

  Researcher --> ExportResearch
```

---

## 📋 5. ตารางแจกแจงกรณีการใช้งานและตรวจสอบย้อนกลับ (Use Case Specification & Traceability Matrix)

| รหัส UC | ชื่อกรณีการใช้งาน | ผู้แสดงบทบาทหลัก | ความสัมพันธ์ (Relationship) | ความต้องการเชิงหน้าที่ (FR) | รองรับบนแพลตฟอร์ม | รอบส่งมอบ |
|:---:|---|---|---|---|:---:|:---:|
| **UC01** | สำรวจระบบและทดลองทำสัมภาษณ์ตัวอย่าง | Guest | Extends Browse, Includes Trial Simulation | FR01, FR03, FR04, FR05 | Web & Mobile | R1 |
| **UC02** | ลงทะเบียนและเข้าสู่ระบบด้วยอีเมล | Guest, Registered User | Includes Verify Email Address | FR01, FR23 | Web & Mobile | R1 |
| **UC03** | ตั้งค่าโปรไฟล์และกำหนดเป้าหมาย | Registered User | Direct Association | FR02 | Web & Mobile | R1 |
| **UC04** | ดำเนินการฝึกสัมภาษณ์แบบข้อเขียน | Registered User | Includes FR03, FR13; Extends FR05 (Autosave), FR16, FR33 | FR03, FR04, FR05, FR16, FR19, FR33 | Web & Mobile | R1 |
| **UC05** | ดำเนินการฝึกสัมภาษณ์ด้วยเสียงพูด | Registered User | Includes FR05.1 (Voice Consent), STT Transcription | FR05-V, FR05.1, FR36 | Web & Mobile | R2 |
| **UC06** | ตรวจสอบผลการประเมินและข้อเสนอแนะ AI | Registered User | Includes FR07, FR08, FR09; Extends FR06, FR10, FR17, FR20 | FR06, FR07, FR08, FR09, FR10, FR17, FR20 | Web & Mobile | R1 |
| **UC07** | ตรวจสอบประวัติการฝึกซ้อมและแดชบอร์ด | Registered User | Direct Association | FR11, FR12 | Web & Mobile | R1 (Dashboard R2) |
| **UC08** | จัดการความยินยอมและสิทธิ์คุ้มครองข้อมูล | Registered User, Admin | Includes Audit Logging; Extends FR21 (Portability), FR22 (Erasure) | FR18, FR21, FR22, FR35 | Web & Mobile (User) / Web (Admin) | R1 |
| **UC08.1**| สกัดและส่งออกชุดข้อมูลวิจัยนิรนาม | Research Engineer | Includes Differential Privacy Filter | FR18.1 | เฉพาะ Web เท่านั้น | R3 |
| **UC09** | บริหารจัดการการเงินและรายการคืนเงิน | Finance Admin, User | Includes Payment Gateway; Extends FR30 (Refund) | FR13, FR27, FR30, FR31 | เฉพาะ Web เท่านั้น (Admin) / Web & Mobile (User Checkout) | R3 |
| **UC10** | บริหารระบบ คลังคำถาม และโมเดล AI | System Admin | Includes Immutable Versioning, Audit Log | FR24, FR25, FR26, FR32, FR34 | เฉพาะ Web เท่านั้น | R1 |

---

## 💡 สรุปการเชื่อมโยงทางสถาปัตยกรรม (Architectural Invariants)

1. **การจำกัดขอบเขตแพลตฟอร์ม (Platform Scoping Guard):**  
   กรณีการใช้งาน UC01–UC08 ถูกออกแบบให้รองรับทั้ง Web Application และ Native Mobile Application เพื่อประสบการณ์ที่ดีที่สุดของผู้สมัครงาน ในขณะที่กรณีการใช้งานของทีมงานภายใน (UC09 การเงิน, UC10 ดูแลระบบ และ UC08.1 สกัดข้อมูลวิจัย) ถูกจำกัดให้อยู่บน Web Application เท่านั้นเพื่อความปลอดภัยสูงสุดตามหลัก Defense in Depth
2. **การคงทนของข้อมูลและเครือข่ายมือถือ (Network Resilience & Idempotency):**  
   กรณีการใช้งาน UC04 และ UC05 บังคับใช้ส่วนหัว `Idempotency-Key` ร่วมกับการบันทึกฉบับร่างในเครื่อง (Draft Autosave) เพื่อป้องกันข้อมูลคำตอบสูญหายเมื่อสัญญาณมือถือหลุด
3. **การคุ้มครองข้อมูลส่วนบุคคลโดยการออกแบบ (Privacy by Design - PDPA):**  
   กรณีการใช้งาน UC05.1 (Voice Retention Consent) บังคับให้ระบบต้องได้รับความยินยอมแยกต่างหาก และต้องลบไฟล์เสียงภายใน 24 ชั่วโมงหากผู้ใช้ไม่อนุญาตให้เก็บ
