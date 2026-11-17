# หมวดที่ 11: แผนธุรกิจและการเงิน (11_Business_Finance)
> **InterviewX — AI Job Interview Simulation System**
> **สถานะเอกสาร:** ควบคุมและเป็นมาตรฐานโมเดลธุรกิจ (Business Model & Monetization Baseline)
> **ปรับปรุงล่าสุด:** 13 พฤศจิกายน 2026

---

## 📌 ภาพรวมหมวดธุรกิจและการเงิน (Category Overview)

หมวดนี้จัดเก็บการออกแบบโมเดลธุรกิจ (Business Model Canvas), แผนและระดับการสมัครสมาชิก (Subscription Plans & Quota Limits), สถาปัตยกรรมการชำระเงิน (Payment Gateway Integration), ข้อกำหนดการตรวจสอบความถูกต้องทางการเงิน (Financial Reconciliation & Audit Trail), และกลยุทธ์การตั้งราคา (Pricing Strategy)

---

## 💎 ระดับแพ็กเกจและการจัดสรรสิทธิ์ (Subscription Tiers & Entitlements)

อ้างอิงแผ่นงาน `Subscription Matrix` ใน [03_SRS_Requirements/v1.1_approved/InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx](file:///D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/v1.1_approved/InterviewX_FR_NFR_RBAC_v1.1_FINAL_TH.xlsx):

| แพ็กเกจ (Tier) | กลุ่มเป้าหมาย | โควตาคำถาม / เดือน | สิทธิ์การเข้าถึงฟีเจอร์เด่น | ช่องทางชำระเงินที่รองรับ |
|---|---|:---:|---|---|
| **Free Tier** | ผู้ทดลองใช้งาน / นักศึกษา | 3 คำถาม / วัน | จำลองแบบข้อความ, ประเมินคะแนนพื้นฐาน | ฟรี ไม่มีค่าใช้จ่าย |
| **Basic Tier** | ผู้เตรียมสมัครงานทั่วไป | 30 คำถาม / เดือน | จำลองแบบข้อความ, AI Feedback เชิงลึก, STAR Sample Answers | บัตรเครดิต, PromptPay |
| **Pro Tier** | ผู้เตรียมสัมภาษณ์เข้มข้น | ไม่จำกัด | จำลองแบบเสียง (Speech / Voice), โหมดจับเวลาเสมือนจริง, แดชบอร์ดพัฒนาการ | บัตรเครดิต, PromptPay, In-App Purchase (iOS/Android) |
| **Enterprise / Institutional** | มหาวิทยาลัย / สถาบันศึกษา | โควตากลุ่ม | บริหารจัดการคลังคำถามของสถาบัน, รายงานภาพรวมสถิตินักศึกษา | ใบแจ้งหนี้และโอนเงินผ่านธนาคาร (B2B Billing) |

---

## 💳 สถาปัตยกรรมการชำระเงิน (Payment & Billing Architecture)

อ้างอิงแผนภาพสถาปัตยกรรม D12 และสกีมาฐานข้อมูล `billing` ใน `05_Database_Data_Governance/database/002_r3_services.sql`:
1. **การประมวลผลคำสั่งชำระเงิน (Payment Gateway Integration):**
   - รองรับ Stripe / ผู้ให้บริการ Payment Gateway ที่ได้มาตรฐาน PCI-DSS
   - ระบบ InterviewX ไม่จัดเก็บข้อมูลบัตรเครดิตหรือข้อมูลทางการเงินที่มีความอ่อนไหวไว้ในฐานข้อมูลตนเอง (Zero Cardholder Data Storage)
2. **ความปลอดภัยของ Webhook (Idempotent Webhook Processing):**
   - การรับสัญญาณ Webhook แจ้งเตือนการชำระเงินสำเร็จจะถูกบันทึกด้วย `event_id` และผ่านการตรวจสอบ Signature ทุกครั้ง
   - มีกลไกป้องกันการอัปเกรดสิทธิ์ซ้ำซ้อน (Atomic Idempotent Provisioning)
3. **การจัดการสิทธิ์บนโมบายล์ (Native Mobile In-App Purchase):**
   - บน iOS และ Android มีการรองรับ StoreKit / Google Play Billing สำหรับการซื้อแพ็กเกจผ่านแอป
