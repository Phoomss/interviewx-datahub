# แบบจำลองกรณีการใช้งานระบบ InterviewX (InterviewX System Use Case Model)
> **InterviewX — AI Job Interview Simulation System**  
> **เวอร์ชัน:** 1.1 DRAFT (Phase 1: Requirement & Platform Alignment Baseline)  
> **วันที่จัดทำ:** 13 พฤศจิกายน 2026  
> **สถานะเอกสาร:** ข้อกำหนดทางสถาปัตยกรรมระบบ (System Architecture Specification)

---

## 📌 1. บทนำและหลักการวิศวกรรมความสัมพันธ์ UML (UML Relationship Specification)

เอกสารฉบับนี้กำหนดแบบจำลองกรณีการใช้งาน (Use Case Model) ของแพลตฟอร์ม **InterviewX** ตามมาตรฐาน UML 2.5 อย่างเคร่งครัด โดยมุ่งเน้นการจำแนกความสัมพันธ์ระหว่างกรณีการใช้งานแบบ **`<<include>>`** และ **`<<extend>>`** ให้ชัดเจน ถูกต้องตามหลักวิศวกรรมซอฟต์แวร์:

```mermaid
flowchart LR
  subgraph NotationRule["กฎทิศทางลูกศรตามมาตรฐาน UML (Arrow Direction Standards)"]
    direction TB
    subgraph IncludeConcept["1. ความสัมพันธ์แบบ «include» (จำเป็นต้องทำ - Mandatory)"]
      Base1(["กรณีการใช้งานหลัก (Base UC)"]) -.->|"«include»"| Inc1(["กรณีการใช้งานย่อยที่ถูกรวม (Included UC)"])
      note1["• ลูกศรพุ่งจาก Base UC ไปยัง Included UC เสมอ<br/>• ทำงานทุกครั้งที่ Base UC ถูกเรียก ขาดไม่ได้"]
    end
    subgraph ExtendConcept["2. ความสัมพันธ์แบบ «extend» (ส่วนขยายตามเงื่อนไข - Optional)"]
      Ext1(["กรณีการใช้งานส่วนขยาย (Extending UC)"]) -.->|"«extend»<br/>(ระบุเงื่อนไข/Extension Point)"| Base2(["กรณีการใช้งานหลัก (Base UC)"])
      note2["• ลูกศรพุ่งจาก Extending UC ย้อนกลับมายัง Base UC เสมอ<br/>• ทำงานเฉพาะเมื่อเงื่อนไข (Extension Condition) เป็นจริงเท่านั้น"]
    end
  end

  classDef baseStyle fill:#dbeafe,stroke:#1d4ed8,stroke-width:2px
  classDef incStyle fill:#dcfce7,stroke:#15803d,stroke-width:2px
  classDef extStyle fill:#fef3c7,stroke:#b45309,stroke-width:2px,stroke-dasharray:4 4

  class Base1,Base2 baseStyle
  class Inc1 incStyle
  class Ext1 extStyle
```

### คำอธิบายสัญลักษณ์และสีในแผนภาพ (Color Legend)
- 🔵 **กล่องสีฟ้าทึบ (Base Use Case):** กรณีการใช้งานหลักที่เป็นเป้าหมายของผู้แสดงบทบาท (Actor)
- 🟢 **กล่องสีเขียว (Included Use Case - «include»):** ขั้นตอนย่อยที่ถูกดึงมารวมและ**ต้องทำเสมอ**เพื่อความสมบูรณ์ของกรณีการใช้งานหลัก
- 🟡 **กล่องสีส้ม/ขอบประ (Extending Use Case - «extend»):** พฤติกรรมเสริมที่จะทำงานก็ต่อเมื่อมี**เงื่อนไขเฉพาะ (Extension Condition)** เกิดขึ้น
- ⚪ **รูปคน (Human Actor):** ผู้ใช้งานที่เป็นมนุษย์
- 🟣 **กล่องสีม่วง (External System Actor):** ระบบภายนอกที่เชื่อมต่อผ่าน API

---

## 👥 2. บัญชีรายชื่อผู้แสดงบทบาท (Actor Catalog)

| สัญลักษณ์ | ผู้แสดงบทบาท (Actor) | ประเภท | บทบาทหน้าที่และสิทธิ์การเข้าถึง | แพลตฟอร์มที่รองรับ |
|:---:|---|:---:|---|---|
| 👤 | **Guest**<br>(ผู้เยี่ยมชม) | ผู้ใช้ภายนอก<br>(Primary Human) | ผู้ใช้งานทั่วไปที่ยังไม่ลงทะเบียน สำรวจระบบ หมวดหมู่คำถาม และทดลองสัมภาษณ์ตัวอย่างฟรีแบบจำกัด | Web & Mobile |
| 👤 | **Registered User**<br>(ผู้สมัครงาน / ผู้ใช้งาน) | ผู้ใช้ภายนอก<br>(Primary Human) | ผู้สมัครงานที่ลงทะเบียนบัญชีแล้ว (*สืบทอดสิทธิ์ของ Guest*) จัดการโปรไฟล์ ฝึกสัมภาษณ์แบบข้อเขียน/เสียง ดูผลคะแนนรูบริก AI และจัดการสิทธิ์ PDPA | Web & Mobile |
| 🛡️ | **System Administrator**<br>(ผู้ดูแลระบบ) | บทบาทภายใน<br>(Primary Human) | จัดการระบบคลังคำถามและรูบริก, ปรับแต่งพารามิเตอร์โมเดล AI, จัดการบัญชีผู้ใช้, ตรวจสอบ Audit Log และพิจารณาข้ออุทธรณ์ผลคะแนน | เฉพาะ Web เท่านั้น |
| 💳 | **Finance Administrator**<br>(ผู้ดูแลการเงิน R3) | บทบาทภายใน<br>(Primary Human) | ดูแลและตรวจสอบรายงานทางการเงิน ยอดขาย ค่าสมาชิก (MRR) และดำเนินการตรวจสอบและอนุมัติ/ปฏิเสธคำขอคืนเงิน | เฉพาะ Web เท่านั้น |
| 🔬 | **Research Data Engineer**<br>(ผู้วิจัยและวิศวกรข้อมูล R3) | บทบาทภายใน<br>(Primary Human) | สกัดและส่งออกชุดข้อมูลวิจัยนิรนาม (Anonymized Aggregate Datasets) ภายใต้เกณฑ์ k-anonymity / Differential Privacy | เฉพาะ Web เท่านั้น |
| 🤖 | **External LLM Provider**<br>(ผู้ให้บริการโมเดล AI) | ระบบภายนอก<br>(Secondary System) | ให้บริการ AI Inference สำหรับการสุ่ม/สร้างคำถาม, คำนวณคะแนนรูบริก, วิเคราะห์โครงสร้างคำตอบ และสร้างข้อเสนอแนะ | API หลังบ้าน |
| 🎙️ | **Speech-to-Text Provider**<br>(บริการแปลงเสียงเป็นข้อความ R2) | ระบบภายนอก<br>(Secondary System) | บริการถอดเสียงคำตอบสัมภาษณ์ของผู้ใช้เป็นข้อความเพื่อส่งเข้ากระบวนการประเมินผล AI | API หลังบ้าน |
| 🏦 | **Payment Gateway**<br>(ผู้ให้บริการชำระเงิน R3) | ระบบภายนอก<br>(Secondary System) | ให้บริการตัดบัตรเครดิต/พร้อมเพย์สำหรับแพ็กเกจสมาชิก และประมวลผลคำสั่งโอนเงินคืน | API หลังบ้าน |
| ✉️ | **Transactional Email Service**<br>(บริการส่งอีเมลระบบ) | ระบบภายนอก<br>(Secondary System) | บริการส่งอีเมลยืนยันตัวตน ลิงก์รีเซ็ตรหัสผ่าน และอีเมลแจ้งเตือน | API หลังบ้าน |

---

## 🌐 3. แผนภาพกรณีการใช้งานระดับภาพรวมระบบ (D20: Master System Use Case Diagram)

แผนภาพนี้แสดงภาพรวมของระบบทั้งหมด โดยระบุความสัมพันธ์ **`«include»`** และ **`«extend»`** หลักไว้อย่างชัดเจนพร้อมเงื่อนไข:

```mermaid
flowchart LR
  subgraph EndUsers["กลุ่มผู้สมัครงาน (End Users)"]
    Guest([👤 Guest / ผู้เยี่ยมชม])
    User([👤 Registered User / ผู้สมัครงาน])
  end

  subgraph Staff["กลุ่มผู้ดูแลระบบและทีมงานภายใน (Internal Roles - Web Only)"]
    Admin([🛡️ System Admin / ผู้ดูแลระบบ])
    Finance([💳 Finance Admin / ผู้ดูแลการเงิน R3])
    Researcher([🔬 Research Engineer / ผู้วิจัย R3])
  end

  subgraph SystemBoundary["กรอบขอบเขตระบบ InterviewX (InterviewX Platform System Boundary)"]
    direction TB

    %% Base Use Cases
    UC01(["UC01: สำรวจและทดลองสัมภาษณ์ตัวอย่าง
(Explore & Trial Simulation) [R1]"])
    UC02(["UC02: ลงทะเบียนและเข้าสู่ระบบด้วยอีเมล
(Register & Authenticate) [R1]"])
    UC03(["UC03: ตั้งค่าโปรไฟล์และกำหนดเป้าหมาย
(Manage Profile & Career Goals) [R1]"])
    UC04(["UC04: ฝึกสัมภาษณ์งานแบบข้อเขียน
(Practice Text Interview) [R1]"])
    UC05(["UC05: ฝึกสัมภาษณ์งานด้วยเสียงพูด
(Practice Voice Interview) [R2]"])
    UC06(["UC06: ตรวจสอบผลการประเมินและรูบริก AI
(Review AI Evaluation & Feedback) [R1]"])
    UC07(["UC07: ตรวจสอบประวัติการฝึกซ้อมและแดชบอร์ด
(View History & Analytics Dashboard) [R1/R2]"])
    UC08(["UC08: จัดการความยินยอมและสิทธิ์ข้อมูลส่วนบุคคล
(Manage PDPA Privacy Rights) [R1]"])
    UC09(["UC09: บริหารจัดการการเงินและคืนเงิน
(Manage Subscriptions & Billing) [R3]"])
    UC10(["UC10: บริหารระบบ คลังคำถาม และโมเดล AI
(Administer System & Question Bank) [R1]"])

    %% Included Use Cases
    INC_Verify(["«include»
ยืนยันอีเมลด้วยลิงก์ปลอดภัย
(FR01 Email Verification)"])
    INC_GenQ(["«include»
ดึงคำถามสัมภาษณ์จากคลัง
(FR03 Question Generation)"])
    INC_CheckQuota(["«include»
ตรวจสอบโควตาสมาชิก
(FR13 Entitlement Check)"])
    INC_SubmitAnswer(["«include»
ส่งคำตอบเข้าคิวประเมินผล
(FR05 Idempotent Submit)"])
    INC_VoiceConsent(["«include»
ยินยอมเก็บรักษาไฟล์เสียง
(FR05.1 Voice Consent)"])
    INC_STT(["«include»
ถอดเสียงเป็นข้อความ
(FR05-V Speech to Text)"])
    INC_RubricScore(["«include»
คำนวณคะแนนตามเกณฑ์รูบริก
(FR07 AI Rubric Scoring)"])
    INC_STARAnalysis(["«include»
วิเคราะห์โครงสร้าง STAR
(FR08 Relevance Analysis)"])
    INC_AuditLog(["«include»
บันทึกประวัติความปลอดภัย
(FR26 Immutable Audit)"])

    %% Extended Use Cases
    EXT_Autosave(["«extend»
บันทึกฉบับร่างอัตโนมัติ
(FR05 Autosave Draft)"])
    EXT_Pressure(["«extend»
เปิดโหมดกดดันจับเวลา
(FR33 Pressure Mode)"])
    EXT_Guidance(["«extend»
ดูคำแนะนำปรับปรุงคำตอบ
(FR06 Improvement Tips)"])
    EXT_Appeal(["«extend»
ยื่นอุทธรณ์ผลคะแนน
(FR17 Evaluation Appeal)"])
    EXT_ExportPDF(["«extend»
ดาวน์โหลดรายงานสรุป PDF
(FR20 Export PDF Report)"])
    EXT_Portability(["«extend»
ขอรับสำเนาข้อมูล
(FR21 Data Portability)"])
    EXT_Erasure(["«extend»
ขอลบบัญชีและทำลายข้อมูล
(FR22 Right to Erasure)"])
    EXT_Refund(["«extend»
พิจารณาอนุมัติคืนเงิน
(FR30 Refund Approval)"])
  end

  subgraph ExternalServices["ระบบสนับสนุนภายนอก (External Supporting Services)"]
    EmailGateway[[✉️ Email Provider]]
    LLMService[[🤖 Hosted LLM Provider]]
    STTService[[🎙️ Speech-to-Text Provider R2]]
    PaymentGW[[🏦 Payment Gateway R3]]
  end

  %% Actor Invariants
  User -- สืบทอดสิทธิ์ (Generalizes) --> Guest

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
  User -.->|"สมัครสมาชิก"| UC09

  Admin --> UC10
  Admin -.->|"จัดการสิทธิ์ข้อมูล DSR"| UC08
  Finance --> UC09
  Researcher -.->|"สกัดชุดข้อมูลวิจัยนิรนาม"| UC08

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
  EXT_Autosave -.->|"«extend»<br/>(พิมพ์ยังไม่เสร็จ/เน็ตหลุด)"| UC04
  EXT_Pressure -.->|"«extend»<br/>(เลือกโหมดท้าทาย)"| UC04
  EXT_Pressure -.->|"«extend»<br/>(เลือกโหมดท้าทาย)"| UC05

  EXT_Guidance -.->|"«extend»<br/>(ต้องการตัวอย่างคำตอบที่ดี)"| UC06
  EXT_Appeal -.->|"«extend»<br/>(พบผลคะแนนคลาดเคลื่อน)"| UC06
  EXT_ExportPDF -.->|"«extend»<br/>(ต้องการเก็บไฟล์ไว้อ่าน)"| UC06

  EXT_Portability -.->|"«extend»<br/>(ยื่นคำขอรับไฟล์)"| UC08
  EXT_Erasure -.->|"«extend»<br/>(ยื่นคำขอยกเลิกบัญชี)"| UC08

  EXT_Refund -.->|"«extend»<br/>(มีคำขอคืนเงินในเงื่อนไข)"| UC09

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

## 🎯 4. แผนภาพระบบย่อย: การฝึกสัมภาษณ์และการประเมินผล AI (D21: Practice & AI Evaluation Engine)

แผนภาพนี้เจาะลึกกระบวนการสัมภาษณ์แบบละเอียด โดยแสดงทุกจุดขยาย (`«extend»`) พร้อมเงื่อนไข และทุกขั้นตอนที่ต้องทำ (`«include»`):

```mermaid
flowchart LR
  subgraph Candidate["ผู้สมัครงาน"]
    User([👤 Registered User])
  end

  subgraph PracticeBoundary["ระบบฝึกสัมภาษณ์และการประเมินผล AI (Practice & Evaluation Engine)"]
    direction TB

    %% Base Use Cases
    UC_StartSession(["เริ่มเซสชันการสัมภาษณ์
(Start Interview Session)"])
    UC_PracticeText(["(UC04) ฝึกสัมภาษณ์แบบข้อเขียน
(Practice Text Interview) [FR05]"])
    UC_PracticeVoice(["(UC05) ฝึกสัมภาษณ์ด้วยเสียงพูด
(Practice Voice Interview) [FR05-V]"])
    UC_ReviewEval(["(UC06) ตรวจสอบผลการประเมิน AI
(Review AI Evaluation Report) [FR07]"])

    %% Includes for Sessions
    INC_FetchQ(["«include»
ดึงคำถามตรงตามหมวดหมู่
(FR03 Category Question)"])
    INC_CheckQuota(["«include»
ตัดโควตาเซสชัน Atomic
(FR13 Quota Ledger Check)"])
    INC_SubmitAnswer(["«include»
ส่งคำตอบพร้อม Idempotency Key
(FR05 Idempotent Submission)"])

    %% Includes for Voice
    INC_VoiceConsent(["«include»
ขอความยินยอมเก็บไฟล์เสียง
(FR05.1 Voice Retention Consent)"])
    INC_STT(["«include»
แปลงเสียงพูดเป็นข้อความ
(FR05-V Speech to Text)"])

    %% Includes for Evaluation
    INC_RubricScore(["«include»
คำนวณคะแนนตามเกณฑ์รูบริก AI
(FR07 Rubric Scoring Engine)"])
    INC_STARRelevance(["«include»
วิเคราะห์ความตรงประเด็น STAR
(FR08 Answer Relevance Analysis)"])
    INC_StrengthsReport(["«include»
สรุปจุดเด่นและจุดควรพัฒนา
(FR09 Strengths & Weaknesses)"])

    %% Extends for Sessions
    EXT_DifficultyScaling(["«extend»
เลือกระดับความยากง่าย
(FR16 Difficulty Scaling)"])
    EXT_PressureMode(["«extend»
เปิดโหมดกดดันจับเวลาสั้น
(FR33 Pressure Simulation)"])
    EXT_FollowupQ(["«extend»
สร้างคำถามติดตามผลตามคำตอบ
(FR14 Contextual Follow-up)"])
    EXT_Autosave(["«extend»
บันทึกฉบับร่างคำตอบในเครื่อง
(FR05 Client Draft Autosave)"])
    EXT_EditTranscript(["«extend»
ตรวจทานและแก้ไขข้อความถอดเสียง
(Review & Edit Transcript)"])

    %% Extends for Evaluation
    EXT_GrammarAnalysis(["«extend»
วิเคราะห์ไวยากรณ์ภาษาอังกฤษ
(FR10 Grammar & Professional Vocab)"])
    EXT_SpeechPace(["«extend»
วิเคราะห์จังหวะและความเร็วพูด
(FR36 Speech Pace & Filler Words)"])
    EXT_ImprovementTips(["«extend»
ดูคำแนะนำและตัวอย่างคำตอบที่ดี
(FR06 Answer Improvement Guidance)"])
    EXT_AppealScore(["«extend»
ยื่นคำขออุทธรณ์ผลการประเมิน
(FR17 Evaluation Score Appeal)"])
    EXT_ExportPDF(["«extend»
ส่งออกรายงานผลเป็นไฟล์ PDF
(FR20 Feedback Report Export)"])
  end

  subgraph ExternalInference["ระบบปัญญาประดิษฐ์ภายนอก"]
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
  EXT_DifficultyScaling -.->|"«extend»<br/>(เมื่อผู้ใช้ระบุระดับทักษะ)"| UC_StartSession
  EXT_PressureMode -.->|"«extend»<br/>(เมื่อผู้ใช้ต้องการฝึกกดดัน)"| UC_StartSession
  EXT_FollowupQ -.->|"«extend»<br/>(เมื่อคำตอบก่อนหน้าเปิดประเด็น)"| INC_FetchQ

  %% Practice Text Relationships
  UC_PracticeText -.->|"«include»"| INC_SubmitAnswer
  EXT_Autosave -.->|"«extend»<br/>(ขณะพิมพ์ / สัญญาณเน็ตสะดุด)"| UC_PracticeText

  %% Practice Voice Relationships
  UC_PracticeVoice -.->|"«include»"| INC_VoiceConsent
  UC_PracticeVoice -.->|"«include»"| INC_STT
  UC_PracticeVoice -.->|"«include»"| INC_SubmitAnswer
  EXT_EditTranscript -.->|"«extend»<br/>(เมื่อพบข้อความถอดเสียงผิด)"| UC_PracticeVoice

  %% Review Evaluation Relationships
  UC_ReviewEval -.->|"«include»"| INC_RubricScore
  UC_ReviewEval -.->|"«include»"| INC_STARRelevance
  UC_ReviewEval -.->|"«include»"| INC_StrengthsReport

  EXT_GrammarAnalysis -.->|"«extend»<br/>(เมื่อตอบสัมภาษณ์ภาษาอังกฤษ)"| UC_ReviewEval
  EXT_SpeechPace -.->|"«extend»<br/>(เฉพาะเซสชันสัมภาษณ์ด้วยเสียง R2)"| UC_ReviewEval
  EXT_ImprovementTips -.->|"«extend»<br/>(เมื่อผู้ใช้ต้องการแนวทางปรับปรุง)"| UC_ReviewEval
  EXT_AppealScore -.->|"«extend»<br/>(เมื่อพบผลคะแนนไม่สอดคล้อง)"| UC_ReviewEval
  EXT_ExportPDF -.->|"«extend»<br/>(เมื่อต้องการดาวน์โหลดเก็บไว้)"| UC_ReviewEval

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

## 🔒 5. แผนภาพระบบย่อย: ยืนยันตัวตนและคุ้มครองข้อมูลส่วนบุคคล (D22: Identity & PDPA Governance)

แผนภาพแสดงขั้นตอนการเข้าถึงระบบและการบังคับใช้สิทธิ์ของเจ้าของข้อมูล (Data Subject Rights: DSR) ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล:

```mermaid
flowchart LR
  subgraph Actors["ผู้แสดงบทบาท"]
    Guest([👤 Guest])
    User([👤 Registered User])
    Admin([🛡️ System Admin / เจ้าหน้าที่ DPO])
  end

  subgraph PrivacyBoundary["ระบบการตรวจสอบสิทธิ์และธรรมาภิบาลข้อมูล (Identity & Privacy Governance)"]
    direction TB

    %% Base Use Cases
    UC_Register(["ลงทะเบียนบัญชีผู้ใช้ใหม่
(Sign Up with Email - FR01)"])
    UC_Login(["(UC02) เข้าสู่ระบบด้วยอีเมล
(Authenticate & Issue Tokens)"])
    UC_ManageProfile(["(UC03) ตั้งค่าโปรไฟล์และเป้าหมาย
(Manage Profile & Goals - FR02)"])
    UC_ConsentDashboard(["(UC08) จัดการความยินยอม PDPA
(Manage Consent Preferences - FR18)"])
    UC_DSRWorkflow(["(FR35) ดำเนินการตามคำร้องขอสิทธิ์
(Data Subject Rights SLA Workflow)"])

    %% Includes
    INC_VerifyEmail(["«include»
ส่งลิงก์ยืนยันตัวตนทางอีเมล
(Send Secure Verification Link)"])
    INC_IssueTokens(["«include»
สร้าง Access & Refresh Tokens
(JWT Token Generation)"])
    INC_AuditRecord(["«include»
บันทึกหลักฐาน Timestamp ไม่แก้ไขได้
(Immutable Consent Event Log)"])

    %% Extends
    EXT_ResetPassword(["«extend»
ขอรีเซ็ตรหัสผ่านผ่านอีเมล
(Password Reset Request)"])
    EXT_ChangePassword(["«extend»
เปลี่ยนรหัสผ่านประจำตัว
(Change Password - FR23)"])
    EXT_LogoutAll(["«extend»
ยกเลิกเซสชันทุกอุปกรณ์
(Logout from All Devices - FR23)"])
    EXT_RevokeConsent(["«extend»
เพิกถอนความยินยอมรายวัตถุประสงค์
(Revoke Specific Consent - FR18)"])
    EXT_DataPortability(["«extend»
ขอรับสำเนาข้อมูลส่วนบุคคล
(Data Portability Request - FR21)"])
    EXT_AccountErasure(["«extend»
ขอลบบัญชีและทำลายข้อมูลส่วนบุคคล
(Right to Erasure / Deletion - FR22)"])
  end

  subgraph MailService["ระบบภายนอก"]
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
  EXT_ResetPassword -.->|"«extend»<br/>(เมื่อผู้ใช้ลืมรหัสผ่าน)"| UC_Login
  EXT_ChangePassword -.->|"«extend»<br/>(เมื่อต้องการเปลี่ยนรหัสผ่าน)"| UC_Login
  EXT_LogoutAll -.->|"«extend»<br/>(เมื่อพบอุปกรณ์ต้องสงสัย)"| UC_Login

  EXT_RevokeConsent -.->|"«extend»<br/>(เมื่อต้องการระงับการใช้ข้อมูล)"| UC_ConsentDashboard
  EXT_DataPortability -.->|"«extend»<br/>(เมื่อยื่นคำขอรับไฟล์ JSON/CSV)"| UC_ConsentDashboard
  EXT_AccountErasure -.->|"«extend»<br/>(เมื่อยืนยันขอลบบัญชีถาวร)"| UC_ConsentDashboard

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

## 📊 6. แผนภาพระบบย่อย: การบริหารระบบ การเงิน และชุดข้อมูลวิจัย (D23: Administration, Billing & Research)

แผนภาพสำหรับบทบาททีมงานภายใน ซึ่งสงวนไว้เฉพาะบน **Web Application เท่านั้น**:

```mermaid
flowchart LR
  subgraph StaffUsers["ทีมงานภายใน (Web Only)"]
    Admin([🛡️ System Admin])
    Finance([💳 Finance Admin R3])
    Researcher([🔬 Research Engineer R3])
  end

  subgraph BackofficeBoundary["พอร์ทัลการบริหารจัดการระบบและกำกับดูแล (Backoffice & Governance Portal)"]
    direction TB

    %% Base Use Cases
    UC_ManageQuestions(["(UC10) บริหารคลังคำถามและรูบริก
(Question Bank & Rubric Console - FR24)"])
    UC_ManageUsers(["บริหารจัดการผู้ใช้และสิทธิ์
(User & Role RBAC Console - FR25)"])
    UC_AuditViewer(["ตรวจสอบประวัติความปลอดภัย
(Security Audit Viewer - FR26)"])
    UC_FinancialDashboard(["(UC09) ดูแดชบอร์ดรายได้และการเงิน
(Financial & MRR Dashboard - FR31)"])
    UC_ResearchExport(["(UC08.1) ส่งออกชุดข้อมูลวิจัย
(Research Dataset Release - FR18.1)"])

    %% Includes
    INC_ImmutableVersion(["«include»
บันทึกเวอร์ชันแบบ Immutable
(Rubric Version Pinning)"])
    INC_AuditTrail(["«include»
บันทึกหลักฐาน Audit Trail
(Audit Log Event Record)"])
    INC_DiffPrivacy(["«include»
ตัด PII และใส่สัญญาณรบกวน DP
(Differential Privacy & Cell ไม่ต่ำกว่า 10)"])
    INC_PaymentAPI(["«include»
ส่งคำสั่งผ่าน API ธนาคาร/เกตเวย์
(Execute Payment API Call)"])

    %% Extends
    EXT_ConfigPrompt(["«extend»
ทดสอบและปรับแต่ง Prompt โมเดล
(AI Model & Prompt Config - FR34)"])
    EXT_SuspendAccount(["«extend»
ระงับและปลดล็อกบัญชีผู้ใช้
(Suspend & Unlock User - FR32)"])
    EXT_ResolveAppeal(["«extend»
พิจารณาและตัดสินข้ออุทธรณ์คะแนน
(Resolve Score Appeal - FR17)"])
    EXT_ProcessRefund(["«extend»
พิจารณาและอนุมัติการคืนเงิน
(Process Refund Request - FR30)"])
  end

  subgraph ExternalGW["ระบบภายนอก"]
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
  EXT_ConfigPrompt -.->|"«extend»<br/>(เมื่อปรับปรุงหรือเปลี่ยนเวอร์ชันโมเดล)"| UC_ManageQuestions
  EXT_SuspendAccount -.->|"«extend»<br/>(เมื่อพบบัญชีทุจริตหรือละเมิดกฎ)"| UC_ManageUsers
  EXT_ResolveAppeal -.->|"«extend»<br/>(เมื่อมีคำขออุทธรณ์คะแนนในคิว)"| UC_ManageQuestions
  EXT_ProcessRefund -.->|"«extend»<br/>(เมื่อมีคำขอคืนเงินตามเงื่อนไข)"| UC_FinancialDashboard

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

## 📋 7. ตารางสรุปความสัมพันธ์ «include» ทั้งระบบ (Complete Include Matrix)

ความสัมพันธ์แบบ **«include»** หมายถึงกรณีการใช้งานหลัก (Base UC) จำเป็นต้องเรียกใช้กรณีการใช้งานย่อยเสมอ ขาดไม่ได้:

| ลำดับ | กรณีการใช้งานหลัก (Base UC) | ทิศทางลูกศร | กรณีการใช้งานย่อยที่ถูกรวม (Included UC) | เหตุผลความจำเป็นและข้อกำหนดที่เกี่ยวข้อง | อ้างอิง FR |
|:---:|---|:---:|---|---|:---:|
| 1 | **UC02: ลงทะเบียนบัญชีใหม่** | `-.->` | **ยืนยันตัวตนทางอีเมล (Verify Email)** | ป้องกันบัญชีปลอมและอีเมลผิดพลาดก่อนเปิดใช้งาน | FR01 |
| 2 | **UC02: เข้าสู่ระบบ** | `-.->` | **ออก Token ตรวจสอบสิทธิ์ (Issue JWT)** | สร้าง Access Token (15m) และ Refresh Token (7d) | FR01 |
| 3 | **UC04 / UC05: สร้างเซสชันสัมภาษณ์** | `-.->` | **ดึงคำถามจากคลัง (Fetch Question)** | นำเข้าคำถามที่ตรงหมวดหมู่และทักษะจากคลังกลาง | FR03 |
| 4 | **UC04 / UC05: เริ่มต้นการฝึกซ้อม** | `-.->` | **ตรวจสอบโควตาสมาชิก (Check Quota)** | หักโควตาเซสชันจาก USAGE_LEDGER แบบ Atomic ป้องกันใช้เกิน | FR13 |
| 5 | **UC04 / UC05: ส่งคำตอบสัมภาษณ์** | `-.->` | **ส่งคำตอบเข้าคิว (Submit Idempotent)** | ป้องกันส่งคำตอบซ้ำด้วย Idempotency-Key และส่งเข้า Redis | FR05 |
| 6 | **UC05: ฝึกสัมภาษณ์ด้วยเสียง** | `-.->` | **ขอความยินยอมไฟล์เสียง (Voice Consent)** | กฎหมาย PDPA มาตรา 19 บังคับขอความยินยอมก่อนบันทึก | FR05.1 |
| 7 | **UC05: ฝึกสัมภาษณ์ด้วยเสียง** | `-.->` | **แปลงเสียงเป็นข้อความ (Speech to Text)** | ต้องถอดเสียงเป็นข้อความก่อนส่งเข้าประเมินผล AI | FR05-V |
| 8 | **UC06: ตรวจสอบผลการประเมิน** | `-.->` | **คำนวณคะแนนตามเกณฑ์รูบริก AI** | แกนหลักของการประเมิน P95 <= 15s ตามรูบริกที่ตรึงไว้ | FR07 |
| 9 | **UC06: ตรวจสอบผลการประเมิน** | `-.->` | **วิเคราะห์ความตรงประเด็น STAR** | วิเคราะห์โครงสร้าง สถานการณ์ และผลลัพธ์ของคำตอบ | FR08 |
| 10 | **UC06: ตรวจสอบผลการประเมิน** | `-.->` | **สรุปรายงานจุดแข็งและจุดควรพัฒนา** | แสดงผลอย่างน้อย 1 รายการพร้อมข้อความอ้างอิง | FR09 |
| 11 | **UC08: จัดการความยินยอม PDPA** | `-.->` | **บันทึกประวัติความปลอดภัย (Audit Log)** | บันทึกหลักฐาน Consent Event แบบระบุเวลาไม่สามารถแก้ไขได้ | FR18, FR26 |
| 12 | **UC10: จัดการคลังคำถามและรูบริก** | `-.->` | **ตรึงเวอร์ชันคำถามและเกณฑ์รูบริก** | ห้ามแก้ไขทับรูบริกเดิมที่เคยใช้ประเมินผลไปแล้ว | FR24 |
| 13 | **UC08.1: ส่งออกชุดข้อมูลวิจัย** | `-.->` | **สกัดนิรนาม Differential Privacy** | จำกัดขนาดกลุ่มตัวอย่าง Cell >= 10 คน และตัด PII 100% | FR18.1 |
| 14 | **อนุมัติการคืนเงิน (Process Refund)** | `-.->` | **ส่งคำสั่งคืนเงินผ่าน Payment Gateway** | เรียก API ธนาคารเพื่อโอนเงินคืนสู่บัญชีผู้ใช้ | FR30 |

---

## 📋 8. ตารางสรุปความสัมพันธ์ «extend» และเงื่อนไขการทำงาน (Complete Extend Matrix)

ความสัมพันธ์แบบ **«extend»** หมายถึงกรณีการใช้งานเสริมจะทำงานก็ต่อเมื่อเกิดเงื่อนไข (Extension Condition) ที่ระบุไว้:

| ลำดับ | กรณีการใช้งานเสริม (Extending UC) | ทิศทางลูกศร | กรณีการใช้งานหลัก (Base UC) | จุดต่อขยายและเงื่อนไขการทำงาน (Extension Point & Condition) | อ้างอิง FR |
|:---:|---|:---:|---|---|:---:|
| 1 | **ขอรีเซ็ตรหัสผ่าน (Reset Password)** | `-.->` | **UC02: เข้าสู่ระบบ** | **[เมื่อผู้ใช้ลืมรหัสผ่าน]:** กดลิงก์ขอรีเซ็ตรหัสผ่านเพื่อรับอีเมลยืนยัน | FR01 |
| 2 | **ยกเลิกเซสชันทุกเครื่อง (Logout All)** | `-.->` | **UC02: เข้าสู่ระบบ** | **[เมื่อพบอุปกรณ์ต้องสงสัย]:** สั่งลบ Refresh Token ทุกเครื่องพร้อมกัน | FR23 |
| 3 | **บันทึกฉบับร่างอัตโนมัติ (Autosave)** | `-.->` | **UC04: ฝึกสัมภาษณ์ข้อเขียน** | **[ขณะพิมพ์ / สัญญาณเน็ตสะดุด]:** บันทึกคำตอบในเครื่องป้องกันสูญหาย | FR05 |
| 4 | **เลือกระดับความยากง่าย (Difficulty)** | `-.->` | **UC04 / UC05: สัมภาษณ์งาน** | **[เมื่อผู้ใช้ระบุระดับทักษะ]:** ปรับคำถามให้ซับซ้อนตามระดับทักษะ | FR16 |
| 5 | **เปิดโหมดกดดันจับเวลา (Pressure Mode)**| `-.->` | **UC04 / UC05: สัมภาษณ์งาน** | **[เมื่อผู้ใช้เปิดสวิตช์โหมดท้าทาย]:** ลดเวลาตอบคำถามและจำลองความกดดัน | FR33 |
| 6 | **สร้างคำถามติดตามผล (Follow-up Q)** | `-.->` | **UC04 / UC05: สัมภาษณ์งาน** | **[เมื่อคำตอบก่อนหน้าเปิดประเด็นใหม่]:** AI สร้างคำถามเจาะลึกเฉพาะเรื่อง | FR14 |
| 7 | **แก้ไขข้อความถอดเสียง (Edit Transcript)**| `-.->` | **UC05: ฝึกสัมภาษณ์เสียง** | **[เมื่อระบบ STT ถอดคำศัพท์ผิด]:** ผู้ใช้แก้ไขข้อความก่อนกดยืนยันส่ง AI | FR05-V |
| 8 | **ดูคำแนะนำปรับปรุง (Answer Guidance)**| `-.->` | **UC06: ดูผลการประเมิน** | **[เมื่อผู้ใช้ต้องการแนวทางตอบที่ดี]:** แสดงตัวอย่างประโยคและคำศัพท์ที่ดีขึ้น | FR06 |
| 9 | **วิเคราะห์ภาษาอังกฤษ (Grammar Check)** | `-.->` | **UC06: ดูผลการประเมิน** | **[เมื่อตอบสัมภาษณ์เป็นภาษาอังกฤษ]:** ตรวจไวยากรณ์และความเป็นมืออาชีพ | FR10 |
| 10 | **วิเคราะห์จังหวะพูด (Speech Rhythm)** | `-.->` | **UC06: ดูผลการประเมิน** | **[เฉพาะเซสชันสัมภาษณ์ด้วยเสียง]:** วัดความเร็ว WPM และคำฟุ่มเฟือย | FR36 |
| 11 | **ยื่นคำขออุทธรณ์คะแนน (Appeal Score)** | `-.->` | **UC06: ดูผลการประเมิน** | **[เมื่อผลคะแนนไม่ตรงประเด็น]:** ส่งคำขอให้แอดมินคนจริงตรวจสอบซ้ำ | FR17 |
| 12 | **ดาวน์โหลดรายงาน PDF (Export PDF)** | `-.->` | **UC06: ดูผลการประเมิน** | **[เมื่อต้องการเก็บรายงานออฟไลน์]:** สร้างเอกสารสรุปผลคะแนนแบบเป็นทางการ | FR20 |
| 13 | **เพิกถอนความยินยอม (Revoke Consent)** | `-.->` | **UC08: จัดการสิทธิ์ PDPA** | **[เมื่อต้องการหยุดการประมวลผล]:** ถอนความยินยอมเฉพาะด้านแบบ Real-time | FR18 |
| 14 | **ขอรับสำเนาข้อมูล (Data Portability)** | `-.->` | **UC08: จัดการสิทธิ์ PDPA** | **[เมื่อยื่นคำขอรับสำเนาไฟล์]:** ระบบจัดเตรียมไฟล์ JSON/CSV ภายใน 72 ชม. | FR21 |
| 15 | **ขอลบบัญชีและทำลายข้อมูล (Erasure)** | `-.->` | **UC08: จัดการสิทธิ์ PDPA** | **[เมื่อยืนยันขอลบบัญชีถาวร]:** ทำลายข้อมูลตามรอบ Soft Delete -> Hard Purge | FR22 |
| 16 | **พิจารณาอนุมัติคืนเงิน (Process Refund)**| `-.->` | **UC09: จัดการการเงิน** | **[เมื่อมีคำขอคืนเงินในเงื่อนไข]:** ตรวจสอบและอนุมัติคืนเงินตามเงื่อนไข | FR30 |
| 17 | **ปรับแต่งโมเดล AI (Prompt Config)** | `-.->` | **UC10: บริหารระบบคลังคำถาม** | **[เมื่อต้องการทดสอบ Prompt ใหม่]:** ปรับแต่งค่า Temperature และ Prompt | FR34 |
| 18 | **ระงับการใช้งานบัญชี (Suspend User)** | `-.->` | **UC10: บริหารระบบผู้ใช้** | **[เมื่อพบบัญชีผิดปกติ/ละเมิดกฎ]:** ระงับการเข้าสู่ระบบและยกเลิกเซสชัน | FR25, FR32 |

---

## 💡 สรุปหลักการความถูกต้องทางสถาปัตยกรรม (Architectural Invariants)

1. **ทิศทางของลูกศรถูกต้องตามมาตรฐานสากล 100%:**
   - **`«include»`:** ชี้จาก **Base UC ไปยัง Included UC** เสมอ เพราะเคสหลักเป็นฝ่ายต้องการและดึงเคสย่อยมาทำงาน
   - **`«extend»`:** ชี้จาก **Extending UC ย้อนกลับมายัง Base UC** เสมอ เพราะเคสเสริมเป็นฝ่ายเชื่อมต่อเข้าหาจุดขยาย (Extension Point) ของเคสหลัก
2. **การแยกแพลตฟอร์มอย่างเด็ดขาด (Platform Scoping Guard):**
   - ส่วนที่เกี่ยวกับ Candidate / End User (UC01–UC08) รองรับทั้ง Web และ Native Mobile
   - ส่วน Backoffice บริหารระบบ คลังคำถาม การเงิน และงานวิจัย (UC09, UC10, UC08.1) **จำกัดไว้เฉพาะ Web Application เท่านั้น** เพื่อความปลอดภัยระดับองค์กร
3. **การปกป้องข้อมูลส่วนบุคคลโดยการออกแบบ (Privacy by Design):**
   - การบันทึกเสียง (UC05) บังคับรวม `«include»` ขอความยินยอม (FR05.1) เสมอ
   - สิทธิ์ตาม PDPA (เพิกถอนความยินยอม, ขอข้อมูล, ขอลบบัญชี) เชื่อมโยงเข้ากับกระบวนการ DSR Workflow โดยอัตโนมัติ
