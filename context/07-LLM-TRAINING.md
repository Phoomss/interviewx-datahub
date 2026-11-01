# 07. การจัดเตรียมและส่งออกชุดข้อมูลสำหรับฝึกสอน LLM (LLM Training Data Preparation & Export)

เอกสารนี้ระบุข้อกำหนด กระบวนการแปลงรูปแบบ (Data Formatting), การแบ่งชุดข้อมูล (Dataset Splitting), และการติดตามเวอร์ชัน (Versioning & Lineage) สำหรับการฝึกสอนและประเมินผลโมเดลภาษาขนาดใหญ่ (LLM) ในระบบ **InterviewX** อ้างอิงสถาปัตยกรรมจาก [`02-ARCHITECTURE.md`](file:///Users/mac/Desktop/interviewx-datahub/context/02-ARCHITECTURE.md) และความปลอดภัยจาก [`08-SECURITY-PRIVACY.md`](file:///Users/mac/Desktop/interviewx-datahub/context/08-SECURITY-PRIVACY.md)

---

## 1. กรณีการใช้งาน LLM ในระบบ InterviewX (LLM Use Cases)

ชุดข้อมูลที่ส่งออกจาก DataHub จะถูกนำไปใช้ใน 4 ภารกิจหลักของระบบ InterviewX:
1. **การสร้างคำถามสัมภาษณ์งานแบบเฉพาะบุคคล (Interview Question Generation)**: สร้างคำถามเชิงลึกตามทักษะและประสบการณ์จริงในเรซูเม
2. **การจับคู่ผู้สมัครกับตำแหน่งงาน (Resume-to-Job Matching & Skill Gap Analysis)**: วิเคราะห์ความเหมาะสมและระบุทักษะที่ยังขาด
3. **การสรุปและสังเคราะห์ประวัติการทำงาน (Profile Summarization)**: สรุปจุดเด่น ผลงานสำคัญ และภาพรวมของผู้สมัคร
4. **การจำลองบทบาทผู้สมัครเพื่อฝึกซ้อมสัมภาษณ์ (Candidate Persona Simulation)**: สร้าง AI Persona ให้มีบุคลิก ประสบการณ์ และความรู้ตรงตามเรซูเม

---

## 2. รูปแบบชุดข้อมูลที่รองรับ (Export Formats)

ระบบรองรับการส่งออกข้อมูลเป็นไฟล์ `.jsonl` (JSON Lines) ในรูปแบบมาตรฐานอุตสาหกรรม:

### 2.1 รูปแบบ Alpaca Instruction Format
เหมาะสำหรับการทำ Instruction Fine-tuning แบบคำสั่งตรงไปตรงมา:
```json
{
  "instruction": "วิเคราะห์ทักษะและสรุปประสบการณ์การทำงานของผู้สมัครนี้",
  "input": "Summary: Senior Backend Developer...\nSkills: [NestJS, PostgreSQL, Redis]...",
  "output": "ผู้สมัครมีความเชี่ยวชาญระดับ Senior ด้าน Backend Development ด้วย Node.js และ NestJS..."
}
```

### 2.2 รูปแบบ OpenAI ChatML / ShareGPT Format
เหมาะสำหรับโมเดลรูปแบบสนทนาหลายรอบ (Multi-turn Conversation):
```json
{
  "messages": [
    {
      "role": "system",
      "content": "คุณคือ AI ผู้ช่วยสัมภาษณ์งานที่มีความเชี่ยวชาญด้านเทคนิคระดับสูง"
    },
    {
      "role": "user",
      "content": "นี่คือประวัติการทำงานของผู้สมัคร:\n[Candidate Profile JSON]\nช่วยตั้งคำถามสัมภาษณ์เชิงเทคนิคเกี่ยวกับ NestJS และการออกแบบ Microservices จำนวน 3 ข้อ"
    },
    {
      "role": "assistant",
      "content": "คำถามสัมภาษณ์สำหรับผู้สมัครรายนี้ได้แก่:\n1. จากประสบการณ์การใช้ NestJS..."
    }
  ]
}
```

### 2.3 รูปแบบ RAG / Knowledge Chunking Format
จัดเตรียมท่อนข้อมูล (Chunks) พร้อม Metadata สำหรับนำไปคำนวณ Embedding และจัดเก็บลง Vector Database

---

## 3. ด่านตรวจความปลอดภัยและคุณภาพก่อน Export (Pre-Export Quality & Safety Gate)

ก่อนที่ข้อมูลจะถูกรวบรวมเป็นไฟล์ Dataset ระบบ NestJS จะบังคับใช้กฎ 4 ข้ออย่างเคร่งครัด:

```mermaid
flowchart LR
    CandidateData["ข้อมูล Profile ที่เลือก"] --> Gate1{"1. สถานะ = APPROVED?"}
    Gate1 -- ไม่ผ่าน --> Drop1["ตัดทิ้งจาก Export"]
    Gate1 -- ผ่าน --> Gate2{"2. กรอง PII ทั้งหมดออก?\n(Zero PII Leakage)"}
    Gate2 -- ไม่ผ่าน --> Drop2["บล็อกการ Export ทันที"]
    Gate2 -- ผ่าน --> Gate3{"3. ตรวจสอบความสมบูรณ์\n(Completeness & Sanity)"}
    Gate3 -- ไม่ผ่าน --> Drop3["ตัดทิ้งจาก Export"]
    Gate3 -- ผ่าน --> Formatter["4. แปลงเป็น JSONL\n(Alpaca / ShareGPT)"]
    Formatter --> ExportArtifact["สร้าง Dataset Artifact\nบันทึกลง MinIO + MLflow"]
```

1. **Rule 1 (Approval Check)**: เฉพาะเรซูเมที่มีสถานะ `APPROVED` เท่านั้นจึงจะมีสิทธิ์ถูกคัดเลือก
2. **Rule 2 (PII Stripping)**: ข้อมูลส่วนบุคคล (ชื่อ, เบอร์โทร, อีเมล, ที่อยู่, เลขประจำตัว) จะถูกคัดกรองทิ้งอย่างเด็ดขาด แม้ว่าจะเป็นข้อมูลที่ได้รับความยินยอมก็ตาม
3. **Rule 3 (Data Balance & Stratification)**: มีระบบรายงานสัดส่วนตำแหน่งงานและระดับประสบการณ์ของชุดข้อมูลที่กำลังจะ Export เพื่อให้วิศวกรเห็นการกระจายตัวของข้อมูล
4. **Rule 4 (No Metric Fabrication)**: บันทึกเฉพาะจำนวนเรเบียนจริง และค่า Hash จริง ห้ามสร้างตัวเลขสถิติหลอก

---

## 4. กลยุทธ์การแบ่งชุดข้อมูล (Dataset Splitting Strategy)

- **สัดส่วนการแบ่ง**: กำหนดสัดส่วนมาตรฐาน เช่น Train (80%), Validation (10%), Test (10%)
- **การป้องกันข้อมูลรั่วไหล (Data Contamination & Leakage Prevention)**:
  - ใช้ **Group/Stratified Split** อิงตาม Persona Archetype และวันที่นำเข้า เพื่อให้มั่นใจว่าข้อมูลที่มีโครงสร้างหรือ Template เดียวกันจะไม่กระจายตัวอยู่ทั้งใน Train และ Test Set
  - ใช้ Random Seed ที่ระบุได้แบบ Deterministic เพื่อให้การ Export ซ้ำได้ผลลัพธ์เหมือนเดิมทุกครั้ง

---

## 5. การจัดการเวอร์ชันและการเชื่อมโยงย้อนกลับ (Versioning & Lineage: MLflow & DVC)

1. **การจัดเก็บ Artifact**: ไฟล์ Dataset สำเร็จรูปจะถูกบีบอัดเป็น `.jsonl.gz` และจัดเก็บใน MinIO Bucket `dataset-exports/{export_id}/dataset.jsonl.gz`
2. **Data Hash**: คำนวณค่า **SHA-256** ของไฟล์ Export ทั้งหมด และบันทึกลงในคอลัมน์ `dvc_hash` ของตาราง `DatasetExport`
3. **MLflow Tracking Integration**:
   - บันทึก Parameters: Filter criteria, Format, Split ratios, Model target
   - บันทึก Metrics: Total records, Vocabulary size, Distribution per role
   - บันทึก Artifact URI เพื่อให้กระบวนการ Model Training สามารถดึง Dataset ไปใช้ต่อได้อย่างอัตโนมัติ

---

## 6. ข้อสมมติฐานหลัก (Explicit Assumptions)

1. **การฝึกสอนอยู่นอกขอบเขตของ DataHub**: InterviewX DataHub มีหน้าที่เตรียม, ตรวจสอบ, และส่งออก Dataset เท่านั้น ตัวกระบวนการรัน Training Job จริงของ LLM จะดำเนินการใน Pipeline ภายนอก (เช่น Kubeflow, Unsloth, หรือ Cloud GPU Cluster)
2. **พื้นที่จัดเก็บไฟล์ Export**: MinIO มีพื้นที่เพียงพอสำหรับเก็บไฟล์ Dataset Archive ในระยะยาว

---

## 7. ประเด็นที่ยังค้างการตัดสินใจ (Unresolved Decisions)

1. **DVC Remote Integration**: จะเชื่อมต่อ DVC เข้ากับ MinIO S3 API โดยตรงผ่านคำสั่ง DVC CLI ใน CI/CD หรือจะใช้ API ของ MLflow Tracking เป็นศูนย์กลางเพียงอย่างเดียวใน Phase 1
   - *ข้อเสนอแนะ*: ใช้ MinIO + MLflow API เป็นหลักก่อนในระยะแรก และเพิ่ม DVC Git Integration ใน Phase 3 ตามแผนงาน
2. **Dynamic Prompt Template for Export**: ควรมีระบบจัดการ Template ข้อความสำหรับ Instruction / Input / Output ผ่าน UI หรือควรกำหนดเป็น Configuration Code
