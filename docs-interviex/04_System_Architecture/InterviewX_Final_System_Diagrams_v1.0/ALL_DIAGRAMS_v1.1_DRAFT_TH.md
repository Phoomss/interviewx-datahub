# แผนภาพสถาปัตยกรรมระบบ InterviewX ทั้งหมด (InterviewX System Architecture Diagrams)
**เวอร์ชัน: 1.1 DRAFT — ระยะที่ 1: การปรับประสานข้อกำหนดและขอบเขตแพลตฟอร์ม (Phase 1: Requirement & Platform Alignment)**  
**วันที่: 13 พฤศจิกายน 2026**  
**สถานะ: ข้อเสนอปรับปรุงสถาปัตยกรรมระบบ — รอการลงนามอนุมัติจากผู้มีส่วนได้ส่วนเสีย (Pending Stakeholder Sign-Off)**

> [!NOTE]
> **ประกาศการปรับประสานขอบเขตแพลตฟอร์มในระยะที่ 1 (Phase 1 Platform Scope Alignment Notice)**  
> เอกสารฉบับร่างนี้ได้แยกส่วนติดต่อผู้ใช้ (Frontend) ออกเป็น 2 แอปพลิเคชันอย่างชัดเจนตามข้อกำหนดของระบบ:
> 1. **เว็บแอปพลิเคชัน (Web Application):** แอปพลิเคชันเว็บแบบตอบสนอง (Responsive Web: เดสก์ท็อป แท็บเล็ต และเว็บเบราว์เซอร์บนมือถือ) รองรับกลุ่มผู้ใช้งานทั่วไป (End Users) และบทบาทงานบริหารระบบ/งานวิจัย (System Admin, Finance Admin, Researcher)
> 2. **แอปพลิเคชันบนอุปกรณ์เคลื่อนที่แบบเนทีฟ (Native Mobile Application):** แอปพลิเคชันแยกติดตั้งสำหรับ iOS และ Android ออกแบบเฉพาะสำหรับผู้ใช้งานทั่วไป (Guest, Registered User) เท่านั้น
> 
> ทั้งสองแอปพลิเคชันสื่อสารกับส่วนบริการหลังบ้านร่วมกัน (Shared Backend Architecture) ผ่าน REST API ที่ผ่านการตรวจสอบสิทธิ์ โดยระบบงานบริหารและงานวิจัยทั้งหมดจะถูกจำกัดให้เข้าถึงได้เฉพาะผ่าน Web Application เท่านั้นเพื่อความมั่นคงปลอดภัยขั้นสูงสุด

---

## D01 บริบทระบบโดยรวม (System Context)

แผนภาพบริบทระบบแสดงความสัมพันธ์ระหว่างผู้ใช้งานระบบทุกกลุ่ม ส่วนติดต่อผู้ใช้ทั้ง Web และ Native Mobile ส่วนบริการระบบร่วมกันของ InterviewX และผู้ให้บริการภายนอก

```mermaid
flowchart LR
  subgraph EndUsers["กลุ่มผู้ใช้งานทั่วไป (End Users - ผู้สมัครงาน)"]
    Guest([Guest / ผู้เยี่ยมชม])
    User([Registered User / ผู้ใช้ทั่วไป])
  end

  subgraph InternalRoles["กลุ่มบทบาทภายในและงานวิจัย (Internal Roles)"]
    Admin([System Admin / ผู้ดูแลระบบ])
    Researcher([Researcher / ผู้วิจัย R3])
    Finance([Finance Admin / ผู้ดูแลการเงิน R3])
  end

  subgraph ClientFrontends["ส่วนติดต่อผู้ใช้ (Client Application Frontends)"]
    Web["InterviewX Responsive Web App
(เดสก์ท็อป / แท็บเล็ต / เบราว์เซอร์มือถือ)"]
    Mobile["InterviewX Native Mobile App
(iOS & Android - ผู้ใช้ทั่วไปเท่านั้น)"]
  end

  Guest --> Web
  Guest --> Mobile
  User --> Web
  User --> Mobile

  Admin --> Web
  Researcher --> Web
  Finance --> Web

  Web --> Platform["ส่วนบริการหลังบ้านร่วมกันของ InterviewX
(NestJS Modular Monolith + AI Service)"]
  Mobile --> Platform

  Platform --> Email["ผู้ให้บริการส่งอีเมลระบบ (Transactional Email)"]
  Platform --> LLM["ผู้ให้บริการโมเดลภาษาขนาดใหญ่ภายนอก (Hosted LLM)"]
  Platform -. "R2 แปลงเสียงเป็นข้อความ" .-> STT["ผู้ให้บริการ Speech-to-Text (STT)"]
  Platform -. "R3 ระบบชำระเงิน" .-> Gateway["ผู้ให้บริการเกตเวย์ชำระเงิน (Payment Gateway)"]
  Platform --> Telemetry["ระบบเฝ้าระวังและแจ้งเตือน (Monitoring & Alerting)"]

  classDef optional stroke-dasharray:5 5
  class Researcher,Finance,STT,Gateway optional
```

---

## D02 สถาปัตยกรรมคอนเทนเนอร์ระดับ C4 (C4 Containers Architecture)

แสดงโครงสร้างคอนเทนเนอร์ระดับเทคโนโลยี การแบ่งเลเยอร์ระหว่างไคลเอนต์ที่ไม่น่าเชื่อถือ (Untrusted Clients), Edge Ingress, NestJS Core API, AI Service, ฐานข้อมูล PostgreSQL และพื้นที่จัดเก็บอ็อบเจกต์ (Object Storage)

```mermaid
flowchart TB
  subgraph Clients["ส่วนติดต่อผู้ใช้ (Untrusted Clients)"]
    Browser["Next.js Responsive Web App
(เดสก์ท็อป / แท็บเล็ต / เบราว์เซอร์มือถือ)"]
    Mobile["Native Mobile App
(iOS & Android - ผู้ใช้ทั่วไปเท่านั้น)"]
  end

  Edge["เครือข่ายส่งมอบข้อมูลและไฟร์วอลล์ (CDN / WAF / Reverse Proxy / TLS)"]
  Browser --> Edge
  Mobile --> Edge

  Edge --> API["NestJS Core API / BFF (ส่วนบริการหลังบ้านร่วมกัน)"]

  subgraph Core["NestJS Modular Monolith (โมดูลบริการหลัก)"]
    ID["การจัดการตัวตน + ตรวจสอบ RBAC + ควบคุมสิทธิ์แพ็กเกจ"]
    Content["คลังคำถาม + กลไกเกณฑ์การประเมิน (Rubric Engine)"]
    Interview["บริบทเซสชันการสัมภาษณ์ (Interview Session)"]
    Eval["แบบจำลองข้อมูลผลการประเมิน (Evaluation Read Model)"]
    Privacy["การคุ้มครองความเป็นส่วนตัว + ธรรมาภิบาลข้อมูล"]
    PlatformModule["แพลตฟอร์ม / กล่องข้อความออก (Outbox) / ป้องกันคำขอซ้ำ / บันทึกประวัติ"]
  end

  API --> ID & Content & Interview & Eval & Privacy & PlatformModule
  ID & Content & Interview & Eval & Privacy & PlatformModule --> PG[("ฐานข้อมูลหลัก PostgreSQL:
แยก Schema ตาม Bounded Context")]

  PlatformModule --> Redis[("คิวข้อความ Redis / BullMQ")]
  Redis --> Worker["คนงานประมวลผลการประเมิน (Evaluation Worker)"]
  Worker --> AI["FastAPI บริการประมวลผล AI (AI Inference Service)"]
  AI --> Provider["ผู้ให้บริการโมเดลภาษาภายนอก (Hosted LLM Provider)"]
  Worker --> PG

  API -. "R2 อัปโหลดไฟล์เสียง" .-> Store[("พื้นที่จัดเก็บไฟล์เสียงส่วนตัว
(MinIO / S3 Object Storage)")]
  API -. "R3 สิทธิ์การเงิน" .-> Billing["บริการระบบชำระเงินและบิลลิ่ง R3"]
  API -. "R3 สิทธิ์งานวิจัย" .-> Research["บริการชุดข้อมูลวิจัย R3
(เข้าใช้งานได้เฉพาะบน Web เท่านั้น)"]

  Billing --> BillingDB[("ฐานข้อมูลบิลลิ่ง PostgreSQL")]
  Research --> ResearchDB[("ฐานข้อมูลวิจัย PostgreSQL")]
  Billing --> Gateway["เกตเวย์ชำระเงิน"]

  classDef future stroke-dasharray:5 5
  class Store,Billing,BillingDB,Research,ResearchDB,Gateway future
```

---

## D03 ขอบเขตบริบทของระบบ (Bounded Contexts)

แสดงการแยกบริบทตามหลักการออกแบบโดเมน (Domain-Driven Design: DDD) ภายในสถาปัตยกรรม NestJS Modular Monolith ร่วมกับส่วนบริการ AI แบบสเตตเลส (Stateless)

```mermaid
flowchart LR
 subgraph CORE["Core NestJS - ระบบบริการหลักตัวเดียว (Shared Backend)"]
  Access["การจัดการตัวตน / สิทธิ์การเข้าถึง / RBAC"]
  Interview["การจำลองสัมภาษณ์"]
  Content["เนื้อหาและคำถาม"]
  Eval["การประเมินผล"]
  Privacy["ความเป็นส่วนตัวและ PDPA"]
  Plat["แพลตฟอร์ม: ป้องกันคำขอซ้ำ / Outbox / ตรวจสอบระบบ"]
 end

 ClientFrontends["ส่วนติดต่อผู้ใช้
(Responsive Web & Native Mobile)"] --> API["Public API Gateway / BFF"]
 API --> Access & Interview & Eval & Privacy & Content
 Interview --> Content
 Interview --> Access
 Eval --> Interview
 Privacy --> Access
 Interview --> Plat
 Eval --> Plat
 Plat --> Worker["ชุดประมวลผลงานพื้นหลัง (Worker)"]
 Worker --> AI["FastAPI บริการ AI - ไม่เชื่อมต่อฐานข้อมูลโดยตรง"]
 API -. "สัญญา R3" .-> Billing["ระบบบิลลิ่ง - ฐานข้อมูลแยกอิสระ"]
 API -. "สัญญา R3 (เฉพาะ Web)" .-> Research["ระบบงานวิจัย - ฐานข้อมูลแยกอิสระ"]
 Billing -. "ส่งเหตุการณ์ข้อมูล" .-> Plat
 Privacy -. "ช่องทางส่งมอบข้อมูลที่อนุมัติ R3" .-> Research
 note["การเข้าถึงข้ามบริบทกระทำผ่าน Contract ที่ส่งออกเท่านั้น ห้ามนำเข้า Repository ข้ามเจ้าของ บังคับใช้ขอบเขต Role และ Platform ที่ระดับ Gateway"]
 note -. ข้อกำหนด .-> CORE
```

---

## D04 แผนภาพความสัมพันธ์ของข้อมูลหลัก (Core Entity Relationship Diagram: ERD)

แสดงแบบจำลองข้อมูลเชิงสัมพันธ์สำหรับรอบส่งมอบ R1 และ R2 ครอบคลุมระบบบัญชีผู้ใช้ เซสชันสัมภาษณ์ คลังคำถาม เกณฑ์การประเมิน และบันทึกความยินยอม PDPA

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
 USERS ||--o{ CONSENT_EVENTS : registers
 PROCESSING_NOTICES ||--o{ CONSENT_EVENTS : references
 USERS ||--o{ DATA_RIGHTS_REQUESTS : submits
 OUTBOX_EVENTS ||--o{ EVALUATION_JOBS : dispatches
 AUDIT_EVENTS }o--|| USERS : actor
```

---

## D05 แผนภาพข้อมูลสำหรับระบบเชิงพาณิชย์และงานวิจัย (R3 Commercial & Research ERD)

แสดงแบบจำลองข้อมูลสำหรับรอบส่งมอบ R3 ซึ่งแยกฐานข้อมูลอย่างเป็นอิสระ เพื่อบริหารจัดการแพ็กเกจสมาชิก ธุรกรรมทางการเงิน บัญชีแยกประเภทโควตา และข้อมูลงานวิจัยแบบคงความเป็นส่วนตัว

```mermaid
erDiagram
 USERS ||--o{ SUBSCRIPTIONS : subscribes
 SUBSCRIPTION_PLANS ||--o{ SUBSCRIPTIONS : defines
 SUBSCRIPTIONS ||--o{ PAYMENT_TRANSACTIONS : charges
 PAYMENT_TRANSACTIONS ||--o{ REFUND_REQUESTS : requests
 USERS ||--o{ USAGE_LEDGER : tracks
 RESEARCH_DATASETS ||--o{ DATASET_RELEASES : produces
 DATASET_RELEASES ||--o{ RESEARCHER_ACCESS_LOGS : logs
 RESEARCH_PROJECTS ||--o{ DATASET_RELEASES : authorizes
```

---

## D06 ขอบเขตความไว้วางใจระดับ API (API Trust Boundaries)

แสดงการแบ่งโซนความปลอดภัยระหว่างไคลเอนต์ภายนอกที่ไม่น่าเชื่อถือ (Web และ Mobile), เครือข่ายสาธารณะ Edge/WAF, จุดคัดกรองสิทธิ์ RBAC และเครือข่ายส่วนตัวภายในระบบ

```mermaid
flowchart LR
 subgraph UntrustedClients["ส่วนติดต่อผู้ใช้ที่ไม่น่าเชื่อถือ (Untrusted Clients)"]
  Web["Responsive Web Client
(เดสก์ท็อป / แท็บเล็ต / เบราว์เซอร์มือถือ)"]
  Mobile["Native Mobile Client
(iOS & Android - ผู้ใช้ทั่วไปเท่านั้น)"]
 end

 subgraph PublicEdge["เครือข่ายขอบและทางเข้าสาธารณะ (Public Edge & Ingress)"]
  WAF["เครือข่าย CDN / WAF / ตรวจสอบใบรับรอง TLS"]
  Gateway["API Gateway / NestJS Core REST /v1"]
  RBACGate{"จุดคัดกรองแพลตฟอร์มและ RBAC
(บล็อก Admin/Research สำหรับ Mobile)"}
 end

 subgraph PrivateNetwork["เครือข่ายส่วนตัวภายใน (Private Network)"]
  Redis[("คิว Redis / BullMQ")]
  Worker["คนงานประเมินผล (Eval Worker)"]
  AI["FastAPI /internal/v1/evaluate"]
  PG[("ฐานข้อมูลหลัก PostgreSQL")]
 end

 Web --> WAF
 Mobile --> WAF
 WAF --> Gateway
 Gateway --> RBACGate

 RBACGate -->|คำขอหลักที่ได้รับอนุญาต| PG
 RBACGate -->|นำงานเข้าคิวประเมิน| Redis
 Redis --> Worker
 Worker --> PG
 Worker -->|ตรวจสอบสิทธิ์พร้อม Timeout| AI
 AI -->|อะแดปเตอร์เฉพาะ| LLM["โมเดลภาษาภายนอก (Hosted LLM)"]

 RBACGate -. "R3 ระบบบิลลิ่ง (Web & Mobile)" .-> Billing["บริการบิลลิ่ง"]
 RBACGate -. "R3 ระบบวิจัย (เฉพาะบน Web)" .-> Research["บริการข้อมูลวิจัย"]

 classDef future stroke-dasharray:5 5
 class Billing,Research future
```

---

## D07 ลำดับขั้นตอนการสัมภาษณ์แบบข้อความ (Text-based Interview Sequence)

แสดงขั้นตอนการส่งคำตอบสัมภาษณ์ การจัดเก็บข้อมูลแบบ Atomic การส่งต่องานผ่าน Outbox Pattern การประเมินผลโดยโมเดล AI และการดึงผลการประเมิน

```mermaid
sequenceDiagram
 autonumber
 actor U as ผู้ใช้งาน (Web หรือ Mobile)
 participant C as แอปพลิเคชันลูกข่าย (Web / Native Mobile)
 participant A as NestJS Interview API (บริการหลังบ้านร่วมกัน)
 participant D as ฐานข้อมูล PostgreSQL
 participant O as ตัวส่งข้อความออก (Outbox Dispatcher)
 participant Q as คิวงาน Redis / BullMQ
 participant K as คนงานประมวลผล (Evaluation Worker)
 participant F as บริการ AI (FastAPI)
 participant L as ผู้ให้บริการโมเดล AI ภายนอก

 U->>C: ส่งคำตอบข้อเขียนสัมภาษณ์
 C->>A: POST /v1/interviews/{id}/answers (พร้อม Idempotency-Key)
 A->>A: ตรวจสอบโทเค็น + สิทธิ์ความเป็นเจ้าของ + สถานะเซสชัน + โควตา
 A->>D: BEGIN - บันทึกคำตอบ, สร้าง eval_job(pending), บันทึก outbox_event, บันทึก key
 D-->>A: COMMIT สำเร็จ
 A-->>C: 202 Accepted { jobId, status: "pending" }
 
 O->>D: ตรวจหาเหตุการณ์ Outbox ที่ยังไม่ได้ส่ง
 O->>Q: นำเหตุการณ์เข้าคิวประเมินพร้อมระบุ Event ID ที่แน่นอน
 Q-->>O: ส่งสัญญาณตอบรับ (ACK)
 O->>D: ปรับปรุงสถานะ Outbox เป็นส่งแล้ว (dispatched)
 
 Q->>K: ส่งงานไปยัง Evaluation Worker (รับประกันการส่งอย่างน้อย 1 ครั้ง)
 K->>K: ตรวจสอบป้องกันการประมวลผลซ้ำ (Inbox Deduplication)
 K->>F: POST /internal/v1/evaluate (payload, rubric_version, model_version)
 F->>L: เรียกใช้งานโมเดล AI ผ่านอะแดปเตอร์จำกัดสิทธิ์
 L-->>F: ส่งผลการตอบกลับดิบของโมเดล
 F->>F: ตรวจสอบความถูกต้องของ JSON Schema, ขอบเขตคะแนน และหลักฐานอ้างอิง
 F-->>K: ส่งกลับผลการประเมินที่ผ่านการตรวจสอบแล้ว / สถานะรอทบทวน
 K->>D: ปรับปรุงสถานะงานแบบ Atomic (completed) + บันทึกผลฟีดแบ็ก
 
 loop สอบถามสถานะเป็นระยะ (Polling หรือแจ้งเตือนทาง WebSocket / Push)
   C->>A: GET /v1/evaluations/{jobId}
   A-->>C: ส่งกลับสถานะ: pending | completed | failed | needs_review
 end
 C->>U: แสดงผลคะแนนประเมิน จุดแข็ง จุดที่ควรพัฒนา และเกณฑ์รูบริก
```

---

## D08 วงจรสถานะการประเมินผลของ AI (AI Evaluation States & Transitions)

แสดงการเปลี่ยนสถานะของงานประเมินผล AI จากเริ่มต้นจนเสร็จสมบูรณ์ พร้อมกลไกจัดการข้อผิดพลาด การตรวจสอบความถูกต้อง และการยกเลิกตามสิทธิ์ PDPA

```mermaid
stateDiagram-v2
 [*] --> pending : บันทึกคำตอบเรียบร้อย
 pending --> processing : เวิร์กเกอร์ดึงงานไปประมวลผล
 processing --> completed : ได้ผลการประเมินที่ผ่านการตรวจสอบ
 processing --> retry_wait : เกิดข้อผิดพลาดชั่วคราว / เกิด Timeout
 retry_wait --> processing : ลองใหม่ (ไม่เกินจำนวนครั้งสูงสุด)
 processing --> needs_review : โครงสร้าง JSON ไม่ถูกต้อง / หลักฐานไม่เพียงพอ
 processing --> failed : ข้อผิดพลาดถาวร / เกินจำนวนครั้งที่ให้ลองใหม่
 pending --> canceled : ผู้ใช้ใช้สิทธิ์ขอลบข้อมูลบัญชี (DSR)
 retry_wait --> canceled : ผู้ใช้ใช้สิทธิ์ขอลบข้อมูลบัญชี (DSR)
 completed --> [*]
 needs_review --> [*]
 failed --> [*]
 canceled --> [*]

 note right of completed
  บันทึกเฉพาะคะแนนรูบริกที่ผ่านการตรวจสอบแล้วเท่านั้น
  บันทึกรหัสเวอร์ชันโมเดล พรอมต์ และเกณฑ์รูบริกอย่างถาวร
 end note
 note right of needs_review
  ห้ามสร้างตัวเลขคะแนนขึ้นมาเองโดยเด็ดขาด
  ทำเครื่องหมายส่งต่อให้มนุษย์ตรวจสอบ / ใช้กลไกสำรอง
 end note
```

---

## D09 การตรวจสอบตัวตนและการอนุญาตสิทธิ์ (Identity & Authorization Flow)

แสดงขั้นตอนการตรวจสอบสิทธิ์อย่างละเอียดในทุกมิติ: การพิสูจน์ตัวตน, สถานะบัญชี, การจำกัดแพลตฟอร์ม, บทบาทความปลอดภัย (RBAC), ความเป็นเจ้าของข้อมูล, ความยินยอม PDPA และการตรวจสอบโควตา

```mermaid
flowchart TD
 Request["คำขอส่งเข้ามาในระบบ (Web หรือ Native Mobile)"] --> Auth{"ผ่านการพิสูจน์ตัวตนหรือไม่?"}
 Auth -->|ไม่| Public{"เป็น Endpoint สาธารณะหรือไม่?"}
 Public -->|ใช่| Allow["อนุญาตให้ดำเนินการสาธารณะ
(หน้าหลัก, แนะนำระบบ, รายการแพ็กเกจ)"]
 Public -->|ไม่ใช่| Deny["401 ไม่ได้รับอนุญาต (Unauthorized)"]

 Auth -->|ใช่| Active{"บัญชีเปิดใช้งานและโทเค็นยังไม่หมดอายุ?"}
 Active -->|ไม่ใช่| Deny

 Active -->|ใช่| PlatCheck{"แพลตฟอร์มได้รับอนุญาตสำหรับ Endpoint นี้หรือไม่?
(Admin/Research ใช้งานได้เฉพาะบน Web)"}
 PlatCheck -->|ละเมิดสิทธิ์| PlatformDeny["403 ห้ามเข้าถึง
(ฟังก์ชันผู้ดูแลระบบและวิจัยถูกบล็อกบน Mobile)"]

 PlatCheck -->|อนุญาต| Role{"มีสิทธิ์ตามบทบาทความปลอดภัยที่ต้องการหรือไม่?"}
 Role -->|ไม่ใช่| Forbidden["403 ห้ามเข้าถึง (Forbidden)"]

 Role -->|ใช่| Own{"เป็นเจ้าของทรัพยากรหรือมีสิทธิ์ผู้ดูแลระบบตามขอบเขต?"}
 Own -->|ไม่ใช่| Forbidden

 Own -->|ใช่| Scope{"ตรงตามวัตถุประสงค์และฐานทางกฎหมาย / มีความยินยอม?"}
 Scope -->|ไม่มี| Forbidden

 Scope -->|ผ่าน| Quota{"จำเป็นต้องตรวจสอบสิทธิ์แพ็กเกจ / โควตาหรือไม่?"}
 Quota -->|โควตาเต็ม| QuotaReject["402 / 429 โควตาการใช้งานเกินกำหนด
(ตรวจสอบแบบ Atomic ที่ฝั่งเซิร์ฟเวอร์)"]

 Quota -->|ผ่าน| DB["บังคับใช้การป้องกันเชิงลึกที่ระดับฐานข้อมูล (RLS)"]
 DB --> Final["ดำเนินการตามคำขอ + บันทึก Audit Log แบบปกปิดข้อมูลสำคัญ"]

 note["แพ็กเกจ Free / Basic / Pro คือระดับโควตา ไม่ใช่บทบาทความปลอดภัย RBAC"] -. กฎ .-> Role
 note2["แพลตฟอร์มไม่ได้เป็นตัวให้สิทธิ์ ระบบหลังบ้านจะตรวจสอบโทเค็นอย่างเข้มงวด"] -. กฎ .-> PlatCheck
```

---

## D10 วงจรชีวิตข้อมูลและความเป็นส่วนตัว (Privacy Lifecycle & Consent Management)

แสดงการจัดการความยินยอมตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA), การจัดเก็บไฟล์เสียง, และกระบวนการรองรับสิทธิ์ของเจ้าของข้อมูล (Data Subject Rights: DSR)

```mermaid
flowchart TB
 Notice["ประกาศการประมวลผลข้อมูลระบุเวอร์ชัน + ฐานทางกฎหมาย"] --> Core["การประมวลผล service_core ในรอบ R1
(จำเป็นสำหรับการส่งมอบบริการ)"]
 Notice --> Choices["เหตุการณ์ให้ความยินยอมแยกตามวัตถุประสงค์
(ซิงก์ข้อมูลระหว่าง Web และ Mobile)"]
 Choices --> Analysis["การวิเคราะห์ข้อมูลเพื่องานวิจัย (research_analysis) R3"]
 Choices --> Contact["การติดต่อเพื่องานวิจัย (research_contact) R3"]
 Choices --> Voice["การเก็บรักษาไฟล์เสียง (voice_retention) R2"]
 Choices --> Marketing["การตลาดในอนาคต (marketing)"]

 Analysis --> Release["กระบวนการอนุมัติส่งมอบข้อมูลวิจัยที่ผ่านเกณฑ์
(พอร์ทัลผู้ดูแลระบบเฉพาะบน Web)"]
 Contact --> ContactService["API ติดต่อผู้วิจัยที่ได้รับอนุมัติ
(บริการเฉพาะขอบเขตวัตถุประสงค์)"]
 Voice --> AudioPolicy["วงจรชีวิตไฟล์เสียง + กำหนดอายุการจัดเก็บ
(ปกติ <=24 ชม.; ยินยอม <=90 วัน; ล้างแคชในมือถือทันที)"]

 User["ผู้ใช้งาน (Web / Native Mobile)"] --> Request["คำขอใช้สิทธิ์ตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล R1 (FR35)"]
 Request --> Verify["ตรวจสอบยืนยันตัวตน / ขอบเขต / ข้อยกเว้นทางกฎหมาย"]
 Verify --> Export["ส่งออกข้อมูลส่วนบุคคลที่เข้าเกณฑ์ (JSON/CSV)"]
 Verify --> Erase["ลบข้อมูลในระบบที่ใช้งาน + ทำลายตามรอบสำรองข้อมูล"]

 Erase --> Audit["บันทึกประวัติการตรวจสอบที่ไม่สามารถแก้ไขได้"]
 Request --> Audit
 Choices --> Audit

 classDef future stroke-dasharray:5 5
 class Analysis,Contact,Voice,Marketing,Release,ContactService,AudioPolicy future
```

---

## D11 ลำดับขั้นตอนการสัมภาษณ์ด้วยเสียงในรอบ R2 (Voice Interview Sequence R2)

แสดงขั้นตอนการฝึกสัมภาษณ์ด้วยเสียง การขอสิทธิ์ไมโครโฟน การอัปโหลดไฟล์เสียงผ่าน Signed URL การแปลงเสียงเป็นข้อความ (STT) และการล้างแคชเสียงบนมือถือ

```mermaid
sequenceDiagram
 autonumber
 actor U as ผู้ใช้งาน (Web หรือ Mobile)
 participant C as แอปพลิเคชันไคลเอนต์ (Web / Native Mobile)
 participant A as NestJS Core API (บริการหลังบ้านร่วมกัน)
 participant S as พื้นที่จัดเก็บไฟล์เสียงส่วนตัว (MinIO / S3)
 participant ST as ผู้ให้บริการแปลงเสียงเป็นข้อความ (STT)
 participant D as ฐานข้อมูล PostgreSQL

 U->>C: เลือกโหมดฝึกสัมภาษณ์ด้วยเสียง (รอบ R2)
 C->>U: ขออนุญาตเข้าถึงไมโครโฟน + แสดงข้อความขอความยินยอมเก็บไฟล์เสียง (FR05.1)
 U-->>C: ยินยอมให้สิทธิ์ไมโครโฟน + เลือกให้หรือปฏิเสธการเก็บไฟล์เสียง
 C->>A: POST /v1/interviews/{id}/voice-session (ส่งบันทึกความยินยอม)
 A->>D: บันทึกเหตุการณ์ความยินยอม (occurred_at, purpose_key: voice_retention)
 A-->>C: ส่งกลับ Signed Upload URL ที่มีอายุจำกัด (PUT)
 
 Note over C,S: บน Web ใช้ Web Audio API | บน Mobile ใช้ Native Audio Bridge (iOS/Android)
 C->>S: อัปโหลดข้อมูลเสียงที่เข้ารหัสโดยตรงไปยังพื้นที่จัดเก็บ
 C->>A: POST /v1/interviews/{id}/voice-complete { storageKey }
 
 A->>ST: ส่งการอ้างอิงไฟล์เสียงไปยังบริการแปลงเสียงเป็นข้อความ
 ST-->>A: ส่งกลับข้อความถอดเสียง (Transcribed Text)
 A-->>C: ส่งมอบข้อความถอดเสียงเพื่อให้ผู้ใช้ตรวจสอบและแก้ไข
 
 U->>C: ตรวจสอบ แก้ไขข้อความหากจำเป็น และกดยืนยันส่งคำตอบ
 C->>A: POST /v1/interviews/{id}/answers (พร้อมข้อความคำตอบ + Idempotency-Key)
 
 alt ผู้ใช้ไม่ยินยอมให้เก็บไฟล์เสียงดิบ
   A->>S: กำหนดเวลาลบทำลายไฟล์เสียงทันทีหลังประมวลผลเสร็จ (ไม่เกิน 24 ชม.)
 else ผู้ใช้ให้ความยินยอมอย่างชัดแจ้ง
   A->>S: กำหนดวงจรชีวิตการจัดเก็บตามที่ได้รับอนุมัติ (ไม่เกิน 90 วัน)
 end
 
 Note over C: บน Mobile: ลบไฟล์เสียงแคชชั่วคราวในเครื่องทิ้งทันทีที่อัปโหลดเสร็จสิ้น
```

---

## D12 ลำดับขั้นตอนการชำระเงินและการควบคุมสิทธิ์ในรอบ R3 (Payment & Entitlement Sequence R3)

แสดงการเลือกซื้อแพ็กเกจสมาชิก การชำระเงินผ่านระบบ Web Checkout หรือ Mobile Store (ตามการตัดสินใจ D-M04) การตรวจสอบ Webhook และการอัปเดตโควตาแบบ Atomic

```mermaid
sequenceDiagram
 autonumber
 actor U as ผู้ใช้งาน
 participant C as แอปพลิเคชันไคลเอนต์ (Web / Native Mobile)
 participant API as API Gateway / BFF
 participant B as บริการบิลลิ่งและการเงิน R3
 participant G as เกตเวย์ชำระเงิน / สโตร์มือถือ
 participant DB as ฐานข้อมูลระบบบิลลิ่ง PostgreSQL
 participant Core as ระบบบริหารสิทธิ์และโควตาหลัก

 U->>C: เลือกระดับแพ็กเกจสมาชิก (Basic / Pro)
 C->>API: ส่งคำขอสั่งซื้อ (Checkout Request)
 API->>B: ส่งต่อคำขอสั่งซื้อที่ผ่านการตรวจสอบสิทธิ์แล้ว
 B->>DB: บันทึกราคาและเวอร์ชันของแพ็กเกจขณะทำรายการ
 
 alt ชำระเงินผ่านเว็บ (Web Checkout)
   B->>G: สร้างเซสชันการชำระเงินผ่าน Hosted Gateway
   G-->>B: ส่งกลับ URL เปลี่ยนหน้าสำหรับการชำระเงิน
   B-->>C: ส่งต่อ URL ให้แก่เบราว์เซอร์
   C-->>U: แสดงหน้าชำระเงินที่มีความปลอดภัยสูง
 else ชำระเงินผ่านแอปมือถือ (ขึ้นอยู่กับการตัดสินใจ D-M04)
   Note over C,G: รอการตัดสินใจ D-M04: ระบบ In-App Purchase (StoreKit/Play) หรือส่งต่อไปจ่ายเงินบนเว็บ
 end
 
 G->>B: POST ส่งเหตุการณ์ Webhook ที่มีลายเซ็นรับรอง (ยืนยันยอดเงินสำเร็จ)
 B->>B: ตรวจสอบลายเซ็น HMAC + ตรวจสอบป้องกันคำขอซ้ำ (provider_event_id)
 B->>DB: ปรับปรุงสถานะแบบ Atomic: บันทึกประวัติการชำระ, ธุรกรรม, อัปเดตสถานะแพ็กเกจ
 
 alt การชำระเงินถูกต้องและสมบูรณ์
   B->>Core: ส่งเหตุการณ์การมอบสิทธิ์ (entitlement_granted) ระบุเวอร์ชัน
   Core->>Core: ปรับปรุงบัญชีแยกประเภทโควตา (USAGE_LEDGER) แบบ Atomic
   Core-->>B: ส่งสัญญาณตอบรับการส่งมอบสิทธิ์สำเร็จ (ACK)
 else เกิดเหตุการณ์ซ้ำซ้อนหรือไม่ถูกต้อง
   B->>B: ปฏิเสธรายการหรือไม่ดำเนินการซ้ำ
 end
 
 C->>API: GET /v1/subscriptions/current
 API->>B: ดึงสถานะสิทธิ์แพ็กเกจที่มีอำนาจตัดสินใจเด็ดขาด
 B-->>C: ส่งกลับระดับแพ็กเกจที่ใช้งานได้พร้อมยอดโควตาใหม่
```

---

## D13 กระบวนการส่งมอบข้อมูลเพื่องานวิจัยในรอบ R3 (Research Data Release Pipeline R3)

แสดงไปป์ไลน์การสกัดและส่งออกข้อมูลงานวิจัยแบบรวมกลุ่ม ซึ่งจำกัดการเข้าถึงเฉพาะผ่าน Web Application เท่านั้น พร้อมการควบคุมความเป็นส่วนตัวแบบ Differential Privacy (Cell Size >= 10)

```mermaid
flowchart TD
 Request["คำขอของนักวิจัยรอบ R3
(เข้าใช้งานได้เฉพาะบน Web Portal เท่านั้น)"] --> Gate{"วัตถุประสงค์ได้รับอนุมัติ + บทบาทถูกต้อง + มีฐานทางกฎหมาย?"}
 Gate -->|ไม่ใช่| Deny["403 ปฏิเสธการเข้าถึง + บันทึก Audit Log ถาวร"]
 Gate -->|ใช่| Pipeline["ไปป์ไลน์ส่งมอบข้อมูลที่ได้รับสิทธิ์พิเศษ
(บริการที่แยกขาดอย่างปลอดภัย)"]

 Source[("ฐานข้อมูลระบบหลัก Production
(จำกัดการเข้าถึงอย่างเข้มงวด)")] --> Pipeline
 Pipeline --> Eligibility["ตรวจสอบความยินยอมวัตถุประสงค์ research_analysis
(ห้ามสับสนกับความยินยอมให้ติดต่อกลับ)"]
 Eligibility --> Aggregate["จัดกลุ่มตามหมวดหมู่/ระดับความยาก + นับจำนวนผู้ใช้ที่ไม่ซ้ำกัน"]
 Aggregate --> Risk{"จำนวนผู้ใช้ในกลุ่ม (Cell Size) >= 10 คน
และผ่านการตรวจสอบการตัดข้อมูลย่อย (Differencing)?"}

 Risk -->|ไม่ผ่าน| Suppress["ตัดข้อมูลกลุ่มย่อยทิ้ง / ปฏิเสธการส่งออกอัตโนมัติ"]
 Risk -->|ผ่าน| Approve["อนุมัติการส่งมอบข้อมูลวิจัย"]

 Suppress --> Review["เจ้าหน้าที่คุ้มครองความเป็นส่วนตัวตรวจสอบด้วยตนเอง
(เฉพาะบน Web Portal)"]
 Review --> Approve

 Approve --> Store[("ฐานข้อมูลวิจัยชุดข้อมูลรวมที่อนุมัติแล้ว
(Schema แยกอิสระ)")]
 Store --> API["REST API สำหรับสืบค้นข้อมูลวิจัย
(เฉพาะบน Web เท่านั้น)"]
 API --> Result["ส่งมอบเฉพาะข้อมูลสถิติรวมเท่านั้น
(ห้ามส่งออกข้อความคำตอบดิบหรือไฟล์เสียงเด็ดขาด)"]

 API --> Log["บันทึก Audit Log: รหัสนักวิจัย, Hash คำสืบค้น, จำนวนตัวอย่าง, เวลา"]
 Deny --> Log

 classDef secure fill:#e2e8f0,stroke:#334155
 class Store secure
```

---

## D14 สถาปัตยกรรมระบบสำหรับสภาพแวดล้อมจริง (Managed Production Architecture)

แสดงโครงสร้างพื้นฐานบนคลาวด์สำหรับระบบจริง รองรับทั้งผู้ใช้ Web และ Native Mobile ผ่านไฟร์วอลล์ WAF, คลัสเตอร์ NestJS, เวิร์กเกอร์เบื้องหลัง, บริการ AI และการสำรองข้อมูลอัตโนมัติ

```mermaid
flowchart TB
 subgraph InternetUsers["ผู้ใช้งานผ่านเครือข่ายอินเทอร์เน็ตสาธารณะ"]
  WebUsers["ผู้ใช้งานบนเว็บ
(เดสก์ท็อป / แท็บเล็ต / เบราว์เซอร์มือถือ)"]
  MobileUsers["ผู้ใช้งานแอปมือถือเนทีฟ
(Apple iOS & Google Android)"]
 end

 WAF["เครือข่าย CDN + Cloudflare / AWS WAF + ถอดรหัส TLS 1.3"]
 WebUsers --> WAF
 MobileUsers --> WAF

 WAF --> WEBHOST["ระบบโฮสติ้งเว็บ Next.js
(Vercel / Cloud Run)"]
 WAF --> API["เกตเวย์ NestJS Core API
(คลัสเตอร์ Modular Monolith)"]

 subgraph PrivateProd["เครือข่ายส่วนตัว Production (VPC / Private Subnet)"]
  PG[("ฐานข้อมูลหลัก PostgreSQL
(Multi-AZ เครื่องหลัก + Read Replica)")]
  Redis[("คลัสเตอร์ Redis สำหรับคิวงาน
(BullMQ Evaluator Queue)")]
  Worker["เวิร์กเกอร์ประมวลผลการประเมิน"]
  AI["FastAPI บริการประมวลผล AI ภายใน
(ไม่มีการเชื่อมต่อฐานข้อมูลโดยตรง)"]
  Buck[("พื้นที่จัดเก็บไฟล์เสียงส่วนตัว R2
(MinIO / AWS S3 เข้ารหัส)")]
 end

 API --> PG & Redis
 API -. "R2 อัปโหลดไฟล์เสียง" .-> Buck
 Redis --> Worker
 Worker --> PG & AI
 AI --> LLM["ผู้ให้บริการโมเดล AI ภายนอก
(Anthropic / OpenAI / Vertex ผ่าน API Key)"]

 API --> Otel["ตัวเก็บข้อมูล OpenTelemetry Collector
(Tracing / Metrics / Logs)"]
 Worker --> Otel
 AI --> Otel

 Secrets["ระบบจัดเก็บรหัสผ่านความปลอดภัยสูง
(KMS / Vault)"] -. "ส่งมอบข้อมูลความลับ" .-> API & Worker & AI
 Backup["ระบบสำรองข้อมูลและกู้คืนจากภัยพิบัติอัตโนมัติ"] --> PG

 API -. "R3 คำขอที่ตรวจสอบสิทธิ์แล้ว" .-> Billing["บริการระบบบิลลิ่ง + ฐานข้อมูลแยก"]
 API -. "R3 คำขอเฉพาะบน Web" .-> Research["บริการระบบวิจัย + ฐานข้อมูลแยก"]

 classDef future stroke-dasharray:5 5
 class Buck,Billing,Research future
```

---

## D15 สภาพแวดล้อมจำลองบน Kubernetes (Kubernetes Showcase Sandbox)

แสดงสถาปัตยกรรมสำหรับสภาพแวดล้อมทดสอบและสาธิต ซึ่งทำงานบนคลัสเตอร์ Kubernetes และใช้ข้อมูลจำลอง (Synthetic Data) 100% โดยตัดขาดจากข้อมูล Production โดยสิ้นเชิง

```mermaid
flowchart TB
 Demo["ผู้ใช้สาธิตข้อมูลจำลอง / ปริมาณโหลดทดสอบ"] --> Ingress["Ingress Controller + จัดการ TLS"]

 subgraph Cluster["คลัสเตอร์ Kubernetes SHOWCASE (ไม่มีข้อมูลจริง Production เด็ดขาด)"]
  Ingress --> Web["พ็อด Web (Next.js)"]
  Ingress --> API["พ็อด Core API (NestJS)"]
  API --> PG[("ฐานข้อมูล PostgreSQL ข้อมูลจำลอง")]
  API --> Redis[("Redis สภาพแวดล้อมทดสอบ")]
  Redis --> Worker["พ็อด Worker ประมวลผล"]
  Worker --> PG
  Worker --> AI["พ็อด FastAPI บริการ AI"]
  AI --> Stub["ระบบจำลองโมเดล AI (Mock LLM Provider)"]

  HPA["ตัวปรับขยายพ็อดอัตโนมัติ (HPA Autoscaler)"] -. "ปรับขยายแนวนอน" .-> API & Worker
  OTel["OpenTelemetry DaemonSet ประจำโหนด"] --> Metrics["แดชบอร์ด Grafana + ร่องรอยการทำงาน Jaeger"]
  API --> OTel
  Worker --> OTel
  AI --> OTel
 end

 GitOps["Argo CD - ตรวจสอบความสอดคล้องของแอป"] -. "ปรับสถานะระบบให้ตรงกับโค้ด" .-> Cluster
 IaC["Terraform - จัดการคลัสเตอร์และเครือข่าย"] -. "สร้างโครงสร้างพื้นฐาน" .-> Cluster
 ProdSource[("ข้อมูลจริง Production, ข้อมูลส่วนบุคคล และข้อมูลสำรอง")] -. "X ตัดขาดการเชื่อมต่ออย่างสิ้นเชิง (ป้องกันข้อมูลรั่วไหล 100%)" .-> Cluster
```

---

## D16 ไปป์ไลน์การรวมโค้ดและส่งมอบระบบอย่างต่อเนื่อง (CI/CD Pipeline)

แสดงวงจรการทดสอบ การสแกนความปลอดภัย การสร้าง Image แบบ Immutable และการ Deploy ไปยังระบบ Staging, Production และ Showcase Sandbox

```mermaid
flowchart TB
 Commit["บันทึกโค้ดขึ้น Git (Main Branch / แท็ก Release)"] --> CI["GitHub Actions: ตรวจ Lint, เช็กไทป์, Unit Tests, สแกน Secret"]
 CI --> Test["Integration Tests, ทดสอบรัน Migration ฐานข้อมูล, เบนช์มาร์กรูบริก AI, สแกนช่องโหว่คอนเทนเนอร์"]
 Test --> Build["สร้าง OCI Container Image แบบ Immutable + สร้าง SBOM + เซ็นรับรองด้วย Cosign"]
 Build --> Registry[("คลังเก็บคอนเทนเนอร์: ตรึง Digest แบบแก้ไขไม่ได้")]

 Registry --> Staging["สภาพแวดล้อมทดสอบเสมือนจริง (Managed Staging)"]
 Staging --> Gate{"การทดสอบอัตโนมัติ QA & การลงนามอนุมัติของผู้มีส่วนได้ส่วนเสีย"}
 Gate -->|อนุมัติ| Prod["สภาพแวดล้อม Production (ติดตั้ง Image ตัวเดียวกัน 100%)"]
 Gate -->|ไม่อนุมัติ| Stop["ระงับไปป์ไลน์ทันที & ส่งแจ้งเตือนไปยังทีมนักพัฒนา"]

 Registry --> GitOpsPR["สร้าง Pull Request บน GitOps Showcase (ตรึงตาม Digest)"]
 GitOpsPR --> Argo["Argo CD ปรับปรุงสถานะ"]
 Argo --> Demo["สภาพแวดล้อมจำลอง Kubernetes Showcase"]

 Prod --> RealDB[("ฐานข้อมูล Production ที่มีข้อมูลส่วนบุคคลจริง")]
 Demo --> FakeDB[("ฐานข้อมูลที่มีเฉพาะข้อมูลจำลอง Synthetic Data เท่านั้น")]
 RealDB -. "มาตรการความปลอดภัยขั้นสูงสุด: ห้ามคัดลอกข้อมูลจริงมายัง Sandbox เด็ดขาด" .-> FakeDB
```

---

## D17 การสังเกตการณ์ระบบและการกู้คืนจากภัยพิบัติ (Observability & Disaster Recovery)

แสดงการติดตามระบบด้วย OpenTelemetry, การส่งต่อ Correlation ID จากทั้ง Web และ Mobile, แดชบอร์ดตรวจสอบประสิทธิภาพ (SLA) และแผนการกู้คืนข้อมูล

```mermaid
flowchart LR
 Client["ผู้ใช้งาน Web & Native Mobile"] --> Trace["HTTP Header: x-correlation-id"]
 Trace --> API["NestJS Core API"]
 API --> Worker["Evaluation Worker"]
 Worker --> AI["FastAPI บริการ AI"]

 API & Worker & AI --> OTel["ตัวรวบรวม OpenTelemetry Collector"]
 OTel --> Logs["บันทึกระบบที่ผ่านการปกปิดข้อมูลส่วนบุคคล (PII Masked)"]
 OTel --> Metrics["สถิติระบบ: เวลาตอบสนอง P95, อัตราข้อผิดพลาด, ความยาวคิวงาน, ต้นทุนโทเค็น AI"]
 OTel --> Traces["ร่องรอยการทำงานข้ามบริการ (Distributed Tracing)"]

 Metrics & Logs --> Alerts["ระบบแจ้งเตือนอัตโนมัติ (Alerting Engine)"]
 Alerts --> Oncall["วิศวกรผู้ดูแลระบบเวรประจำวัน (On-Call Team)"]

 PG[("ฐานข้อมูลหลัก PostgreSQL")] --> Backups["การสำรองข้อมูลอัตโนมัติประจำวันพร้อมการเข้ารหัส"]
 Backups --> Restore["การซักซ้อมกู้คืนระบบประจำไตรมาส (RPO <=24 ชม., RTO <=8 ชม.)"]

 TokenCost["ตัวนับปริมาณการใช้โทเค็น AI และงบประมาณ"] --> Metrics
 Note["เป้าหมายตามเอกสาร SRS: เวลาตอบสนอง Non-AI P95 <=2s (Web), <=2.5s (Mobile); ผลประเมิน AI <=15s; ความพร้อมใช้งาน >=99.5%; RPO <=24h; RTO <=8h"] -. "เป้าหมายการเฝ้าระวัง" .-> Metrics
```

---

## D18 ขอบเขตโครงสร้างโปรเจกต์และโมโนรีโป (Repository Boundaries & Monorepo Structure)

แสดงการจัดระเบียบโครงสร้างซอร์สโค้ดในรูปแบบ Monorepo การแชร์แพ็กเกจ DTOs และ Validation Schemas ระหว่าง Web และ Native Mobile และการป้องกันการละเมิดขอบเขตสถาปัตยกรรม

```mermaid
flowchart TB
 subgraph Apps["โฟลเดอร์ apps/ (ส่วนของแอปพลิเคชัน)"]
  Web["web (แอปพลิเคชันเว็บ Next.js แบบตอบสนอง)"]
  Mobile["mobile (แอปพลิเคชันมือถือเนทีฟ React Native - ตาม D-M02)"]
  API["api (บริการหลังบ้านหลัก NestJS Modular Monolith)"]
  Worker["evaluation-worker (คนงานประมวลผลพื้นหลัง BullMQ)"]
  AI["ai-service (บริการประมวลผล AI ด้วย FastAPI)"]
  Billing["billing-service (บริการบิลลิ่งและการเงินรอบ R3)"]
  Research["research-service (บริการจัดการชุดข้อมูลวิจัยรอบ R3)"]
 end

 subgraph Packages["โฟลเดอร์ packages/ (ไลบรารีและสัญญาระบบที่ใช้ร่วมกัน)"]
  Contracts["contracts (สัญญา OpenAPI, Zod Schemas, Event Contracts, DTOs)"]
  CoreDB["db-core (โมเดล Prisma Client และไฟล์ Migration ของ PostgreSQL หลัก)"]
  BillingDB["db-billing (Prisma Schema สำหรับระบบบิลลิ่ง R3)"]
  ResearchDB["db-research (Schema สำหรับระบบงานวิจัย R3)"]
  Obs["observability (เครื่องมือบันทึก Log และ Metrics ของ OpenTelemetry)"]
  UI["ui (ดีไซน์โทเคนและคอมโพเนนต์ส่วนติดต่อผู้ใช้ที่ใช้ร่วมกัน)"]
 end

 Web --> Contracts & UI
 Mobile --> Contracts & UI
 API --> Contracts & CoreDB & Obs
 Worker --> Contracts & CoreDB & Obs
 AI --> Contracts
 Billing --> Contracts & BillingDB
 Research --> Contracts & ResearchDB

 Infra["โฟลเดอร์ infra/ (ไฟล์คอนฟิก Terraform, Helm, Kubernetes, Argo CD)"] --> Apps
 Tests["โฟลเดอร์ tests/ (การทดสอบระบบ E2E, ความปลอดภัย, IDOR, เบนช์มาร์ก AI)"] --> Contracts

 Rule["กฎเกณฑ์ทางสถาปัตยกรรม (Architectural Rules):
1. Mobile และ Web ใช้ Contracts และ Schema Validation ร่วมกัน
2. ห้ามนำเข้าฐานข้อมูลข้าม Bounded Context เด็ดขาด
3. บริการ AI ต้องไม่มีการเชื่อมต่อกับฐานข้อมูลโดยตรง
4. เส้นทาง API ของ Admin และ Research ถูกบล็อกไม่ให้ Mobile เข้าถึงได้เด็ดขาด"] -. "บังคับใช้ผ่านระบบ CI" .-> Tests
```

---

## D19 แผนงานและขั้นตอนการส่งมอบระบบ (Release Roadmap & Delivery Milestones)

แสดงแผนงานการส่งมอบระบบตั้งแต่รอบ R1 (Core MVP), R2 (ระบบเสียงและแอปมือถือ) จนถึงรอบ R3 (ระบบเชิงพาณิชย์และงานวิจัย) พร้อมเกณฑ์การตัดสินใจอนุมัติผ่านแต่ละรอบ

```mermaid
flowchart LR
 R1["R1: ระบบแกนหลัก (CORE MVP)
Responsive Web, การตรวจสอบตัวตน, ฝึกสัมภาษณ์แบบข้อเขียน,
ประเมินผลด้วยรูบริก AI, ประวัติการฝึก, การควบคุมความเป็นส่วนตัว, บันทึก Audit Log"] --> R2["R2: ระบบ AI ขั้นสูงและแอปมือถือ (ENHANCED AI & MOBILE)
ฝึกสัมภาษณ์ด้วยเสียง (Voice/STT), ตัวชี้วัดทักษะการพูด,
วิเคราะห์ภาษาอังกฤษ, แดชบอร์ดสรุปผล, แอปพลิเคชันมือถือเนทีฟ (ตาม D-M01)"]
 
 R2 --> R3["R3: ระบบเชิงพาณิชย์และงานวิจัย (COMMERCIAL & RESEARCH)
แพ็กเกจสมาชิก, บัญชีแยกประเภทโควตา, เกตเวย์ชำระเงิน,
ระบบคืนเงิน, จัดการการเงิน, ส่งมอบข้อมูลวิจัยตามการกำกับดูแล (เฉพาะบน Web)"]

 R1 --> Production["สภาพแวดล้อมระบบจริง (Managed Production)"]
 R1 --> Showcase["สภาพแวดล้อมสาธิตบน Kubernetes (Showcase Sandbox)"]

 R2 -. "เกณฑ์การอนุมัติคุณภาพแอปมือถือและระบบเสียง" .-> Production
 R3 -. "เกณฑ์การอนุมัติด้านกฎหมาย ภาษี และธรรมาภิบาลข้อมูลวิจัย" .-> Production

 Note["API บริการหลังบ้านใน R1 ถูกออกแบบให้พร้อมรองรับ Mobile ตั้งแต่เริ่มต้น
การเปิดตัว Native Mobile Application ถูกจัดสรรไว้ในรอบ R2 (ตามการตัดสินใจ D-M01)
พอร์ทัลผู้ดูแลระบบและผู้วิจัยสงวนไว้เฉพาะบน Web Application เท่านั้นตลอดไป"] -. "กฎแผนงาน" .-> R1
```

---

## D20 แผนภาพกรณีการใช้งานระบบโดยรวม (System Use Case Diagram)

แผนภาพกรณีการใช้งานระดับภาพรวมระบบแสดงความสัมพันธ์ระหว่างผู้แสดงบทบาท (Actors) ทั้ง 5 กลุ่ม กับกรณีการใช้งานหลัก (UC01 ถึง UC10) พร้อมระบุความสัมพันธ์ **`«include»`** (ขั้นตอนที่ต้องทำเสมอ) และ **`«extend»`** (ส่วนขยายตามเงื่อนไข) ไว้อย่างชัดเจน:

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
    PaymentGW[[🏦 Payment Gateway Provider R3]]
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
  User -. "สมัครสมาชิก" .-> UC09

  Admin --> UC10
  Admin -. "จัดการสิทธิ์ข้อมูล DSR" .-> UC08
  Finance --> UC09
  Researcher -. "สกัดชุดข้อมูลวิจัยนิรนาม" .-> UC08

  %% Includes
  UC02 -. "«include»" .-> INC_Verify
  UC04 -. "«include»" .-> INC_GenQ
  UC04 -. "«include»" .-> INC_CheckQuota
  UC04 -. "«include»" .-> INC_SubmitAnswer

  UC05 -. "«include»" .-> INC_VoiceConsent
  UC05 -. "«include»" .-> INC_STT
  UC05 -. "«include»" .-> INC_GenQ
  UC05 -. "«include»" .-> INC_SubmitAnswer

  UC06 -. "«include»" .-> INC_RubricScore
  UC06 -. "«include»" .-> INC_STARAnalysis

  UC08 -. "«include»" .-> INC_AuditLog
  UC10 -. "«include»" .-> INC_AuditLog

  %% Extends (Points FROM Extension TO Base)
  EXT_Autosave -. "«extend»\n[พิมพ์ยังไม่เสร็จ/เน็ตหลุด]" .-> UC04
  EXT_Pressure -. "«extend»\n[เลือกโหมดท้าทาย]" .-> UC04
  EXT_Pressure -. "«extend»\n[เลือกโหมดท้าทาย]" .-> UC05

  EXT_Guidance -. "«extend»\n[ต้องการตัวอย่างคำตอบที่ดี]" .-> UC06
  EXT_Appeal -. "«extend»\n[พบผลคะแนนคลาดเคลื่อน]" .-> UC06
  EXT_ExportPDF -. "«extend»\n[ต้องการเก็บไฟล์ไว้อ่าน]" .-> UC06

  EXT_Portability -. "«extend»\n[ยื่นคำขอรับไฟล์]" .-> UC08
  EXT_Erasure -. "«extend»\n[ยื่นคำขอยกเลิกบัญชี]" .-> UC08

  EXT_Refund -. "«extend»\n[มีคำขอคืนเงินในเงื่อนไข]" .-> UC09

  %% External System Connections
  INC_Verify --> EmailGateway
  INC_GenQ --> LLMService
  INC_STT --> STTService
  INC_RubricScore --> LLMService
  INC_STARAnalysis --> LLMService
  UC09 --> PaymentGW
  EXT_Refund --> PaymentGW

  %% Styling
  classDef baseStyle fill:#dbeafe,stroke:#1d4ed8,stroke-width:2px;
  classDef incStyle fill:#dcfce7,stroke:#15803d,stroke-width:2px;
  classDef extStyle fill:#fef3c7,stroke:#b45309,stroke-width:2px,stroke-dasharray:4 4;
  classDef actorStyle fill:#f1f5f9,stroke:#334155,stroke-width:2px;
  classDef extSysStyle fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px;

  class UC01,UC02,UC03,UC04,UC05,UC06,UC07,UC08,UC09,UC10 baseStyle;
  class INC_Verify,INC_GenQ,INC_CheckQuota,INC_SubmitAnswer,INC_VoiceConsent,INC_STT,INC_RubricScore,INC_STARAnalysis,INC_AuditLog incStyle;
  class EXT_Autosave,EXT_Pressure,EXT_Guidance,EXT_Appeal,EXT_ExportPDF,EXT_Portability,EXT_Erasure,EXT_Refund extStyle;
  class Guest,User,Admin,Finance,Researcher actorStyle;
  class EmailGateway,LLMService,STTService,PaymentGW extSysStyle;
```

> 📖 ดูรายละเอียดโมเดลกรณีการใช้งานฉบับสมบูรณ์ พร้อมแผนภาพเจาะลึกรายระบบย่อย (Subsystems D21–D23) และตาราง Traceability ได้ที่:  
> 👉 [InterviewX_Use_Case_Diagrams_v1.1.md](file:///D:/workspaces/interviewx-datahub/docs-interviex/04_System_Architecture/InterviewX_Use_Case_Diagrams_v1.1.md)

---

## D24 การจัดแนวทางสถาปัตยกรรมระหว่าง Web และ Mobile (Web & Mobile Architecture Alignment)

แสดงการจัดวางโครงสร้างและขอบเขตความรับผิดชอบระหว่าง Responsive Web (Next.js) และ Native Mobile (React Native / Expo) ภายใต้สถาปัตยกรรม Monorepo ที่ใช้สัญญากลาง (Shared Contracts) และบริการหลังบ้านแบบรวมศูนย์ (Unified Backend) โดยไม่มีตรรกะทางธุรกิจหรือฐานข้อมูลซ้ำซ้อน

```mermaid
flowchart TD
    %% Styling & Classes
    classDef clientWeb fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef clientMobile fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#b45309;
    classDef sharedContracts fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#5b21b6;
    classDef securityGate fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#991b1b;
    classDef backendCore fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#047857;
    classDef dataStore fill:#f1f5f9,stroke:#475569,stroke-width:2px,color:#1e293b;
    classDef external fill:#f3f4f6,stroke:#9ca3af,stroke-width:1px,color:#374151;

    %% 1. Client Layer
    subgraph ClientLayer["1. ส่วนติดต่อผู้ใช้ (Frontend Clients Layer)"]
        subgraph WebApp["Responsive Web Application (apps/web)"]
            W_Tech["Next.js 14+ (TypeScript / Tailwind / shadcn/ui)"]
            W_Roles["รองรับ 5 บทบาท:<br/>- Guest<br/>- Registered User<br/>- Researcher<br/>- Payment / Finance Admin<br/>- System Admin"]
            W_Auth["Auth: HTTP-Only, Secure, SameSite Cookie<br/>+ CSRF Protection"]
            W_View["Viewport: Desktop, Tablet, Mobile Browser (360px+)"]
        end

        subgraph MobileApp["Native Mobile Application (apps/mobile)"]
            M_Tech["React Native / Expo (iOS 16+ / Android 13+)"]
            M_Roles["รองรับเฉพาะ 2 บทบาท End-User:<br/>- Guest<br/>- Registered User<br/>(Admin & Research สงวนบน Web 100%)"]
            M_Auth["Auth: Bearer JWT<br/>(iOS Keychain / Android Keystore)"]
            M_Storage["Offline Draft Autosave (ทุก 5 วินาที)<br/>Network Flakiness Resilient"]
        end
    end

    %% 2. Shared Monorepo Contracts Layer
    subgraph MonorepoLayer["2. ส่วนแบ่งปันมาตรฐานสัญญาข้อมูล (Shared Monorepo Packages)"]
        Contracts["packages/contracts<br/>- OpenAPI Specification<br/>- Zod Validation Schemas<br/>- Shared TypeScript DTOs<br/>- Domain Event Definitions"]
        UI_Shared["packages/ui<br/>- Shared Design Tokens & Theme"]
    end

    Contracts -.->|Type-Safe API Contracts| WebApp
    Contracts -.->|Type-Safe API Contracts| MobileApp
    UI_Shared -.->|Design Tokens| WebApp
    UI_Shared -.->|Design Tokens| MobileApp

    %% 3. Edge Gateway & Security Layer
    subgraph GatewayLayer["3. เกตเวย์และความปลอดภัย (Edge & API Gateway Boundary)"]
        CDN_WAF["Cloudflare WAF / CDN / TLS 1.3 Termination"]
        
        subgraph IngressGateway["NestJS Ingress & Policy Enforcement"]
            AuthGuard["Unified Auth Guard<br/>- Extract Cookie (Web)<br/>- Extract Bearer JWT (Mobile)"]
            ClientGuard{"ตรวจสอบสิทธิ์ตามประเภทไคลเอนต์<br/>(Client-Type & RBAC Guard)"}
            IdempotencyMW["Idempotency Middleware<br/>(ตรวจจับ Idempotency-Key Header: UUIDv4)"]
            RateLimiter["Rate Limiting & Anti-Abuse<br/>(Throttler by Client IP / User ID)"]
        end
    end

    WebApp -->|HTTPS / REST API| CDN_WAF
    MobileApp -->|HTTPS / REST API| CDN_WAF
    CDN_WAF --> AuthGuard
    AuthGuard --> IdempotencyMW
    IdempotencyMW --> RateLimiter
    RateLimiter --> ClientGuard

    ClientGuard -->|คำขอจาก Mobile ขอสิทธิ์ Admin/Researcher| RejectAdmin["403 Forbidden<br/>(Strictly Block Administrative Actions on Mobile)"]
    ClientGuard -->|คำขอถูกต้องตามสิทธิ์| BackendRouting["Route ไปยังโมดูลที่เกี่ยวข้อง"]

    %% 4. Backend Modular Monolith
    subgraph BackendCore["4. บริการหลังบ้านร่วมกัน (Unified Backend - Zero Duplication)"]
        subgraph NestJS["NestJS Modular Monolith (apps/api)"]
            Mod_Identity["Identity & Auth Module<br/>(Token Rotation, Ownership Guard)"]
            Mod_Interview["Interview & Session Module<br/>(Question Gen, Answer Ingestion)"]
            Mod_Eval["Evaluation Module<br/>(Transactional Outbox Publisher)"]
            Mod_Privacy["Privacy & Consent Module<br/>(PDPA Audit Logs, Consent Check)"]
        end

        subgraph AsyncQueue["ระบบประมวลผลงานพื้นหลัง (Async Processing)"]
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
    subgraph DataLayer["5. ชั้นการจัดเก็บข้อมูล (Single Source of Truth)"]
        Postgres[("Core PostgreSQL<br/>- USERS & REFRESH_TOKENS<br/>- SESSIONS & QUESTIONS<br/>- ANSWERS & EVALUATION_JOBS<br/>- OUTBOX_EVENTS<br/>- IDEMPOTENCY_KEYS")]
        ObjectStore[("MinIO / S3<br/>- Audio Cache (R2 Voice)<br/>- Export Artifacts")]
    end

    NestJS --> Postgres
    EvalWorker --> Postgres

    %% 6. External Services
    subgraph ExternalServices["6. บริการภายนอก (External Services)"]
        ExtLLM["External LLM Provider<br/>(OpenAI / Claude / Gemini)"]
        WebCheckout["Web Payment Gateway (R3)<br/>(Mobile Redirects to Web Checkout)"]
    end

    FastAPI --> ExtLLM
    WebApp -.-> WebCheckout
    MobileApp -.->|D-M04: In-App Browser Redirect| WebCheckout

    %% Apply Classes
    class WebApp,W_Tech,W_Roles,W_Auth,W_View clientWeb;
    class MobileApp,M_Tech,M_Roles,M_Auth,M_Storage clientMobile;
    class MonorepoLayer,Contracts,UI_Shared sharedContracts;
    class GatewayLayer,CDN_WAF,IngressGateway,AuthGuard,ClientGuard,IdempotencyMW,RateLimiter,RejectAdmin securityGate;
    class BackendCore,NestJS,Mod_Identity,Mod_Interview,Mod_Eval,Mod_Privacy,AsyncQueue,OutboxPoll,BullQueue,EvalWorker,AIService,FastAPI,PydanticVal backendCore;
    class DataLayer,Postgres,ObjectStore dataStore;
    class ExternalServices,ExtLLM,WebCheckout external;
```

---

## D25 ลำดับการทำงานและการสลับรูปแบบระหว่าง Web และ Mobile (Web vs Mobile Interaction Sequence)

แสดงเปรียบเทียบการยืนยันตัวตน (Cookie vs Bearer Token), การสกัดกั้นสิทธิ์ Admin บน Mobile, และกลไก Idempotency ร่วมกับ Autosave เพื่อรองรับความไม่เสถียรของสัญญาณมือถือ (Network Flakiness)

```mermaid
sequenceDiagram
    autonumber
    actor UserWeb as ผู้ใช้งาน Web
    actor UserMobile as ผู้ใช้งาน Mobile
    participant ClientWeb as Web Client (Next.js)
    participant ClientMobile as Mobile App (React Native)
    participant API as NestJS Gateway / Backend
    participant DB as Core PostgreSQL
    participant Queue as Redis / BullMQ
    participant AI as Evaluation Worker & FastAPI

    %% 1. Authentication Strategy Comparison
    rect rgb(240, 248, 255)
    note over UserWeb, API: 1. รูปแบบการยืนยันตัวตน (Authentication Strategy)
    UserWeb->>ClientWeb: เข้าสู่ระบบ (Email / Password)
    ClientWeb->>API: POST /api/v1/auth/login
    API-->>ClientWeb: Set-Cookie: access_token (HTTP-Only, Secure, SameSite)
    
    UserMobile->>ClientMobile: เข้าสู่ระบบ (Email / Password)
    ClientMobile->>API: POST /api/v1/auth/login (Client-Type: mobile)
    API-->>ClientMobile: 200 OK { accessToken: "JWT...", refreshToken: "..." }
    ClientMobile->>ClientMobile: จัดเก็บโทเค็นลงใน iOS Keychain / Android Keystore
    end

    %% 2. Strict Client RBAC Enforcement
    rect rgb(255, 240, 240)
    note over UserMobile, API: 2. การควบคุมสิทธิ์ตามประเภทไคลเอนต์ (Strict Client RBAC)
    UserMobile->>ClientMobile: พยายามเข้าถึงเมนู Admin / Financial Portal
    ClientMobile->>API: GET /api/v1/admin/dashboard (Authorization: Bearer <JWT>)
    API->>API: Client-Type Check: ตรวจพบคำขอจาก Mobile Client
    API-->>ClientMobile: 403 Forbidden (Admin functions are restricted to Web only)
    end

    %% 3. Answer Submission & Idempotency
    rect rgb(240, 255, 240)
    note over UserMobile, AI: 3. การส่งคำตอบสัมภาษณ์และป้องกันคำขอซ้ำ (Idempotency & Flakiness Resilience)
    UserMobile->>ClientMobile: พิมพ์คำตอบสัมภาษณ์
    loop Local Draft Autosave (ทุก 5 วินาที)
        ClientMobile->>ClientMobile: บันทึกข้อความลง Local Storage สำรองไว้
    end
    UserMobile->>ClientMobile: กดปุ่ม "ส่งคำตอบ"
    ClientMobile->>ClientMobile: สร้าง UUIDv4 สำหรับ Idempotency-Key
    ClientMobile->>API: POST /api/v1/interviews/{id}/answers<br/>Header: Idempotency-Key: 550e8400-e29b...<br/>Header: Authorization: Bearer <JWT>
    
    API->>API: ถอดรหัส JWT จาก Bearer Header + ตรวจสอบสิทธิ์ความเป็นเจ้าของ Session
    API->>DB: ตรวจสอบ Idempotency-Key ซ้ำหรือไม่?
    alt เป็นคำขอใหม่ (Key ยังไม่เคยมีในระบบ)
        API->>DB: BEGIN - บันทึกคำตอบ + สร้าง Job (pending) + บันทึก Outbox Event + บันทึก Key
        DB-->>API: COMMIT
        API-->>ClientMobile: 202 Accepted { jobId: "job_123", status: "pending" }
        API->>Queue: Dispatcher ส่ง Job เข้าคิว Redis / BullMQ
        Queue->>AI: ดำเนินการประเมินผล AI ด้วย Rubric
        AI->>DB: บันทึกผลคะแนนและฟีดแบ็ก (completed)
    else สัญญาณเน็ตมือถือหลุด ไคลเอนต์ Retry ส่งซ้ำด้วย Key เดิม
        API->>DB: พบคีย์เดิมในระบบ (ตรวจสอบสถานะงาน)
        DB-->>API: คืนค่าสถานะงานปัจจุบัน (pending หรือ completed)
        API-->>ClientMobile: 202 Accepted { jobId: "job_123", status: "pending" } (ไม่สร้างงานซ้ำ)
    end
    
    loop Polling ผลการประเมิน (หรือ Push Notification)
        ClientMobile->>API: GET /api/v1/evaluations/job_123
        API-->>ClientMobile: 200 OK { status: "completed", score: 85, feedback: {...} }
    end
    ClientMobile->>UserMobile: แสดงผลการประเมิน, จุดแข็ง, จุดที่ควรพัฒนา
    end
```

