# 04. ข้อกำหนดและการเชื่อมต่อ API (API Contracts & Specifications)

เอกสารนี้ระบุข้อกำหนดของ API (API Contracts), โครงสร้าง Request/Response, การจัดการข้อผิดพลาด (Error Handling), และการสื่อสารระหว่างบริการของ **InterviewX DataHub** อ้างอิงสถาปัตยกรรมจาก [`02-ARCHITECTURE.md`](file:///Users/mac/Desktop/interviewx-datahub/context/02-ARCHITECTURE.md)

---

## 1. หลักการออกแบบ API (API Design Principles)

1. **สถาปัตยกรรมแบบ RESTful**: ใช้ HTTP Verbs (GET, POST, PUT, PATCH, DELETE) อย่างถูกต้องตามมาตรฐาน
2. **การตรวจสอบความถูกต้องของข้อมูล (Strict Schema Validation)**:
   - ฝั่ง Next.js ใช้ **Zod** ในการ Validate Form Input
   - ฝั่ง NestJS ใช้ **DTOs (Data Transfer Objects)** ร่วมกับ `class-validator` และ `class-transformer`
   - ฝั่ง FastAPI ใช้ **Pydantic v2 Models** สำหรับ Internal Endpoints
3. **โครงสร้าง Response มาตรฐาน (Standard Response Envelope)**:
   ```json
   {
     "success": true,
     "data": {},
     "meta": {
       "page": 1,
       "limit": 20,
       "total": 100
     }
   }
   ```
4. **โครงสร้างข้อผิดพลาดมาตรฐาน (Standard Error Response)**:
   ```json
   {
     "success": false,
     "error": {
       "code": "VALIDATION_FAILED",
       "message": "ข้อมูลนำเข้าไม่ถูกต้องตามรูปแบบที่กำหนด",
       "details": [
         {
           "field": "file_size",
           "message": "ขนาดไฟล์ต้องไม่เกิน 25MB"
         }
       ]
     },
     "timestamp": "2026-11-01T10:00:00.000Z"
   }
   ```

---

## 2. API ระหว่าง Next.js และ NestJS (Public / Client API)

ทุก Endpoint ขึ้นต้นด้วย `/api/v1` และต้องการ Header: `Authorization: Bearer <JWT_TOKEN>` (ยกเว้น Auth API)

### 2.1 การยืนยันตัวตน (Authentication)
- `POST /api/v1/auth/login`: ตรวจสอบอีเมล/รหัสผ่าน และคืนค่า Access Token (JWT)
- `GET /api/v1/auth/me`: ข้อมูลโปรไฟล์ของผู้ใช้งานปัจจุบันและสิทธิ์ (Roles)

### 2.2 การจัดการเอกสารเรซูเม (Document Management)
- `POST /api/v1/documents/upload`:
  - **Content-Type**: `multipart/form-data`
  - **Body**: `file` (Binary), `source_type` (`SYNTHETIC` | `REAL_AUTHORIZED`), `consent_id` (จำเป็นหากเป็น REAL_AUTHORIZED)
  - **Response 202 Accepted**: คืนค่า `document_id` และสถานะ `UPLOADED` พร้อมเข้าคิวเพื่อรอ Parse
- `GET /api/v1/documents`:
  - **Query Parameters**: `page`, `limit`, `status`, `is_synthetic`, `search` (ค้นหาชื่อไฟล์/ตำแหน่งงาน)
  - **Response 200 OK**: รายการเอกสารตามเงื่อนไข
- `GET /api/v1/documents/:id`:
  - **Response 200 OK**: รายละเอียดเอกสาร, ข้อมูล `ParsedProfile`, ประวัติการ Review, และ `presigned_view_url` สำหรับเปิดดูไฟล์ PDF ในเบราว์เซอร์
- `DELETE /api/v1/documents/:id`:
  - **Response 200 OK**: ดำเนินการลบเอกสาร (Soft Delete หรือ Hard Delete ตามประเภทข้อมูล)

### 2.3 การตรวจสอบและรับรองข้อมูล (Annotation & QA)
- `POST /api/v1/documents/:id/review`:
  - **Body**:
    ```json
    {
      "status": "APPROVED",
      "corrections": {
        "skills": ["Python", "FastAPI", "Docker"],
        "experiences": []
      },
      "review_notes": "แก้ไขรายการสกิลที่สกัดตกหล่น"
    }
    ```
  - **Response 200 OK**: อัปเดตสถานะของเรซูเมเป็น `APPROVED` หรือ `REJECTED` พร้อมบันทึกประวัติ

### 2.4 การสร้างข้อมูลสังเคราะห์ (Synthetic Data Jobs)
- `POST /api/v1/synthetic/jobs`:
  - **Body**:
    ```json
    {
      "job_name": "Senior Backend Engineers Batch 1",
      "target_count": 50,
      "config": {
        "role": "Backend Engineer",
        "seniority": "Senior",
        "tech_stack": ["NestJS", "PostgreSQL", "Redis"],
        "language": "en"
      }
    }
    ```
  - **Response 202 Accepted**: สร้าง `job_id` และส่งเข้าคิว Background Job
- `GET /api/v1/synthetic/jobs`: ดูรายการประวัติการสร้าง
- `GET /api/v1/synthetic/jobs/:id`: ดูสถานะความคืบหน้าของงาน (Progress, Generated Count, Errors)

### 2.5 การส่งออกชุดข้อมูลสำหรับ LLM (Dataset Export)
- `POST /api/v1/datasets/export`:
  - **Body**:
    ```json
    {
      "export_name": "interviewx-resume-qa-v1",
      "format": "ALPACA",
      "filter": {
        "status": "APPROVED",
        "is_synthetic": true,
        "roles": ["Backend Engineer", "Data Engineer"]
      }
    }
    ```
  - **Response 202 Accepted**: คืนค่า `export_id`
- `GET /api/v1/datasets/exports/:id/download`: รับ Presigned Download URL สำหรับดาวน์โหลดไฟล์ `.jsonl`

---

## 3. สัญญาระหว่างบริการ NestJS และ FastAPI (Internal Service API)

การเรียกใช้งานเป็นแบบ Internal Network เท่านั้น โดยมี Header: `X-Internal-Service-Key: <SECRET_KEY>`

### 3.1 การสกัดข้อความจากเอกสาร (Raw Text Parsing)
- `POST /internal/v1/parser/extract-text`:
  - **Request Body**:
    ```json
    {
      "storage_bucket": "raw-documents",
      "storage_key": "2026/11/abc-123.pdf",
      "file_type": "PDF"
    }
    ```
  - **Response 200 OK**:
    ```json
    {
      "raw_text": "John Doe\nSoftware Engineer...",
      "page_count": 2,
      "extracted_metadata": {
        "author": "John Doe",
        "created_date": "2026-01-10"
      }
    }
    ```

### 3.2 การแปลงข้อความเป็นโครงสร้างข้อมูลเรซูเม (Profile Structuring)
- `POST /internal/v1/parser/extract-profile`:
  - **Request Body**:
    ```json
    {
      "raw_text": "...",
      "document_id": "uuid-here"
    }
    ```
  - **Response 200 OK**:
    ```json
    {
      "structured_data": {
        "summary": "...",
        "skills": ["NestJS", "FastAPI"],
        "experiences": [],
        "educations": []
      },
      "pii_extracted": {
        "full_name": "John Doe",
        "email": "john@example.com",
        "phone": "+66812345678"
      },
      "provenance": {
        "skills": [{"term": "NestJS", "char_offset": [120, 126]}]
      },
      "confidence_score": 0.94,
      "extractor_version": "gemini-flash-extractor-v1.0"
    }
    ```

### 3.3 การสร้างข้อมูลสังเคราะห์แบบกลุ่ม (Batch Synthetic Generation)
- `POST /internal/v1/synthetic/generate-batch`:
  - **Request Body**:
    ```json
    {
      "batch_size": 10,
      "role": "Data Scientist",
      "seniority": "Mid-level",
      "tech_stack": ["Python", "PyTorch", "SQL"],
      "language": "en"
    }
    ```
  - **Response 200 OK**: คืนค่า List ของ `structured_data` ที่ผ่านการตรวจสอบตาม Pydantic Schema แล้ว

---

## 4. รหัสสถานะ HTTP (Standard HTTP Status Codes)

- `200 OK`: คำขอสำเร็จ
- `201 Created`: สร้าง Resource สำเร็จ
- `202 Accepted`: รับคำขอเข้าคิวเพื่อประมวลผลเบื้องหลังเรียบร้อยแล้ว
- `400 Bad Request`: รูปแบบข้อมูลไม่ถูกต้อง หรือ Validation ล้มเหลว
- `401 Unauthorized`: ไม่ได้ส่ง Token หรือ Token หมดอายุ
- `403 Forbidden`: สิทธิ์การใช้งานไม่เพียงพอ (เช่น Annotator พยายาม Trigger Dataset Export)
- `404 Not Found`: ไม่พบ Resource ที่ต้องการ
- `422 Unprocessable Entity`: ข้อมูลถูกต้องตาม Schema แต่ไม่ผ่านเงื่อนไขทางธุรกิจ
- `500 Internal Server Error`: ข้อผิดพลาดภายในระบบ

---

## 5. ข้อสมมติฐานหลัก (Explicit Assumptions)

1. **Internal API Authentication**: สันนิษฐานว่าการสื่อสารระหว่าง NestJS และ FastAPI อยู่บนเครือข่ายปิด จึงใช้ Shared Secret Key ผ่าน HTTP Header ก่อนในระยะเริ่มต้น
2. **DTO Consistency**: โครงสร้างฟิลด์ของ Profile ต้องตรงกันระหว่าง Pydantic Model ใน FastAPI และ Zod/TypeScript Type ใน NestJS/Next.js

---

## 6. ประเด็นที่ยังค้างการตัดสินใจ (Unresolved Decisions)

1. **การดาวน์โหลดไฟล์ขนาดใหญ่ (Streaming vs Presigned URL)**: การดาวน์โหลด Dataset Export ขนาดใหญ่ ควรให้ดาวน์โหลดผ่าน NestJS Proxy Stream หรือให้ดาวน์โหลดตรงจาก MinIO ผ่าน Presigned URL
   - *ข้อเสนอแนะ*: ใช้ MinIO Presigned URL เพื่อไม่ให้ Memory ของ NestJS แบกรับภาระ
2. **gRPC Protocol**: ในอนาคตหากความถี่ในการเรียกงานระหว่าง NestJS และ FastAPI มีปริมาณมหาศาล ควรพิจารณาเปลี่ยนจาก Internal REST HTTP/1.1 เป็น gRPC หรือไม่
