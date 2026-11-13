# หมวดที่ 06: การออกแบบประสบการณ์และส่วนติดต่อผู้ใช้งาน (06_UI_UX_Design)
> **InterviewX — AI Job Interview Simulation System**
> **สถานะเอกสาร:** ควบคุมและเป็นเกณฑ์ออกแบบส่วนติดต่อผู้ใช้ (UI/UX Design Baseline)
> **ปรับปรุงล่าสุด:** 13 พฤศจิกายน 2026

---

## 📌 ภาพรวมหมวดการออกแบบ UI/UX (Category Overview)

หมวดนี้จัดเก็บแนวทางการออกแบบประสบการณ์ผู้ใช้ (UX Design Guidelines), ข้อกำหนดระบบการออกแบบ (Design Systems), ภาพร่างต้นแบบและม็อกอัปหน้าจอ (Wireframes & UI Mockups), ผังการไหลของผู้ใช้งาน (User Flows), และข้อกำหนดการแสดงผลแบบตอบสนอง (Responsive Design Specifications)

---

## 🎨 ไฟล์และต้นแบบในหมวด (Assets & Deliverables)

| ไฟล์ผลลัพธ์ | ขนาดไฟล์ | คำอธิบายสาระสำคัญ |
|---|:---:|---|
| **[InterviewX AI Interview Coach Dashboard.png](file:///D:/workspaces/interviewx-datahub/docs-interviex/06_UI_UX_Design/InterviewX%20AI%20Interview%20Coach%20Dashboard.png)** | 1.64 MB | ภาพม็อกอัปแดชบอร์ดหลักของ AI Interview Coach แสดงคะแนน 4 มิติ, สถิติการฝึกซ้อม, และประวัติการประเมินผล |

---

## 📱 ข้อกำหนดการแสดงผลข้ามแพลตฟอร์ม (Cross-platform Design Invariants)

1. **Responsive Web Application (Next.js):**
   - รองรับ 3 Breakpoints หลัก: Mobile Browser (360px–767px), Tablet (768px–1023px), และ Desktop (≥1024px)
   - ปฏิบัติตามมาตรฐาน Accessibility (WCAG 2.1 AA) เช่น Contrast Ratio ไม่ต่ำกว่า 4.5:1
2. **Native Mobile Application (iOS & Android):**
   - ออกแบบโดยเน้น Mobile-First Ergonomics และการใช้งานมือเดียว (Thumb-zone Friendly)
   - จัดสรร Safe Area Insets สำหรับรอยบาก (Notch) และแถบโฮมบาร์ (Home Indicator)
