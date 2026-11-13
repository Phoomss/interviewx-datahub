# หมวดที่ 05: การออกแบบฐานข้อมูลและธรรมาภิบาลข้อมูล (05_Database_Data_Governance)
> **InterviewX — AI Job Interview Simulation System**
> **สถานะเอกสาร:** ควบคุมเชิงสถาปัตยกรรมข้อมูล (Data Architecture & Governance Baseline)
> **ปรับปรุงล่าสุด:** 13 พฤศจิกายน 2026

---

## 📌 ภาพรวมหมวดฐานข้อมูลและธรรมาภิบาลข้อมูล (Category Overview)

หมวดนี้จัดเก็บการออกแบบฐานข้อมูลกายภาพ (Physical Database Design), สคริปต์สกีมา SQL (PostgreSQL Schemas), แบบจำลองความสัมพันธ์ของข้อมูล (Entity-Relationship Diagrams: ERD), พจนานุกรมข้อมูล (Data Dictionary), นโยบายการคุ้มครองข้อมูลส่วนบุคคล (PDPA/GDPR Compliance), และการกำกับดูแลวงจรชีวิตข้อมูล (Data Retention & Governance)

---

## 📂 โครงสร้างและไฟล์ประจำหมวด (Directory Structure & Files)

```text
05_Database_Data_Governance/
│
├── 📂 database/                                   # สคริปต์สร้างสกีมาฐานข้อมูล PostgreSQL
│   ├── 📜 001_core.sql                            # สกีมาหลัก R1 (identity, interview, evaluation, content, platform) และ voice R2
│   └── 📜 002_r3_services.sql                     # สกีมาแยกอิสระ R3 (billing, research datasets)
│
├── 📂 docs/                                       # เอกสารการออกแบบข้อมูลกายภาพ
│   └── 📑 physical-erd.md                         # รายละเอียดฟิลด์, คีย์หลัก, ดัชนี, Foreign Keys, และ Mermaid ERD
│
└── 📄 README.md                                   # คู่มือภาพรวมและสารบัญหมวด (ไฟล์นี้)
```

---

## 🔒 กฎเหล็กด้านธรรมาภิบาลและการคุ้มครองข้อมูลส่วนบุคคล (Data Governance Invariants)

1. **การแยกข้อมูลระบุตัวตน (PII Decoupling):**
   - ข้อมูลส่วนบุคคล (ชื่อ นามสกุล อีเมล) ถูกจัดเก็บแยกในสกีมา `identity`
   - รหัสเซสชันการสัมภาษณ์ใช้ UUIDv4 และไม่มีการอ้างอิง PII โดยตรงในผลประเมินคะแนน
2. **การเข้ารหัสและสิทธิ์การเข้าถึง (Encryption & Access Control):**
   - ข้อมูลเสียง (Voice Audio Artifacts) จัดเก็บใน MinIO พร้อมการเข้ารหัส Server-side Encryption
   - สิทธิ์การเข้าถึงบังคับใช้ผ่าน Pre-signed URL ที่มีอายุจำกัด (TTL ≤ 15 นาที)
3. **การจัดการคำร้องขอลบข้อมูลตามกฎหมาย (Right to Erasure / RTBF):**
   - รองรับกระบวนการลบข้อมูล (Soft-delete และ Hard-delete Cascade) ผ่านตาราง `privacy.data_rights_requests`
   - สกีมา `research` ใช้เทคนิค Data Anonymization และ k-Anonymity ป้องกันการระบุตัวตนย้อนกลับ
