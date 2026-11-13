# หมวดที่ 10: การติดตั้งและปฏิบัติการระบบ (10_Deployment_DevOps)
> **InterviewX — AI Job Interview Simulation System**
> **สถานะเอกสาร:** ควบคุมและเป็นมาตรฐานโครงสร้างพื้นฐาน (Infrastructure & DevOps Baseline)
> **ปรับปรุงล่าสุด:** 13 พฤศจิกายน 2026

---

## 📌 ภาพรวมหมวดปฏิบัติการและการส่งมอบระบบ (Category Overview)

หมวดนี้จัดเก็บเอกสารแนวทางปฏิบัติการทางวิศวกรรม DevOps, ไปป์ไลน์การรวมโค้ดและส่งมอบอัตโนมัติ (CI/CD Pipelines), สถาปัตยกรรมโครงสร้างพื้นฐานบนคลาวด์ (Cloud Infrastructure), คอนฟิกูเรชันคอนเทนเนอร์ (Docker / Docker Compose), การจัดการสภาพแวดล้อม (Environment Configuration), และการตรวจวัดและเฝ้าระวังระบบ (Observability & Monitoring)

---

## 🚢 สถาปัตยกรรมการส่งมอบและโครงสร้างพื้นฐาน (Infrastructure Architecture)

1. **สภาพแวดล้อมเพื่อการพัฒนา (Local Development):**
   - ใช้งานผ่าน `docker-compose.yml` รวมบริการ PostgreSQL, Redis (BullMQ), MinIO (S3 Artifacts), และบริการเสริม
2. **สภาพแวดล้อม Production (Managed Cloud Architecture):**
   - สถาปัตยกรรม Cloud Managed Services (อ้างอิงแผนภาพ D14):
     - **Managed PostgreSQL:** เก็บข้อมูลตารางหลักพร้อมการสำรองข้อมูลอัตโนมัติ (Automated Backups & Multi-AZ)
     - **Managed Redis Cluster:** รองรับคิวงานอะซิงโครนัสและการแคช
     - **S3 / Cloud Object Storage:** จัดเก็บไฟล์เสียง Resume และ Artifacts พร้อม Pre-signed URL
     - **Serverless / Managed Container Engine:** รัน NestJS API Core, BullMQ Workers, และ FastAPI AI Engine
3. **สถาปัตยกรรมไมโครเซอร์วิส Kubernetes (K8s Showcase):**
   - อ้างอิงแผนภาพ D15: แยกระดับ Ingress Controller, Pod Auto-scaling (HPA), Network Policies, และ Secret Management (HashiCorp Vault / Sealed Secrets)

---

## 🔄 ไปป์ไลน์ CI/CD (Continuous Integration & Continuous Delivery)

อ้างอิงแผนภาพสถาปัตยกรรม D16:
- **Code Quality Gate:** ตรวจสอบ Type Check (`tsc`), Lint (`eslint`, `ruff`), และ Formatting
- **Automated Testing:** Unit Tests (Jest, Pytest) รันแบบขนาน และบังคับ Coverage ≥ 80%
- **Container Build & Security Scanning:** สร้าง Container Image ขนาดเล็ก (Multi-stage Build) และสแกนช่องโหว่ความปลอดภัยด้วย Trivy
- **Deployment:** Zero-downtime Rolling Update หรือ Blue/Green Deployment

---

## 📊 การตรวจวัดและการกู้คืนระบบ (Observability & Self-Healing)

อ้างอิงแผนภาพสถาปัตยกรรม D17:
- **Metrics & Logging:** Prometheus Metric Exporters และระบบรวบรวม Log แบบรวมศูนย์
- **Distributed Tracing:** OpenTelemetry Trace Correlation Id ส่งต่อไปยัง AI Service
- **Health Checks & Circuit Breaking:** มี Liveness และ Readiness Probes ทุก Service เพื่อกู้คืนสถานะอัตโนมัติ (Self-healing)
