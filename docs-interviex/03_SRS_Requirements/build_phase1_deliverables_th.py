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

header_font = Font(name="TH Sarabun New", size=13, bold=True, color="FFFFFF")
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

def format_data_cell(cell, is_zebra=False, font_size=12, bold=False, color="1E293B", align="left", valign="center", wrap=True):
    cell.font = Font(name="TH Sarabun New", size=font_size, bold=bold, color=color)
    cell.fill = zebra_fill if is_zebra else white_fill
    cell.alignment = Alignment(horizontal=align, vertical=valign, wrap_text=wrap)
    cell.border = thin_border

def style_status_cell(cell, status_text):
    text = str(status_text)
    if any(k in text for k in ["รอการยืนยัน", "รอดำเนินการ", "Pending"]):
        cell.fill = PatternFill(start_color=STATUS_PENDING_FILL, end_color=STATUS_PENDING_FILL, fill_type="solid")
        cell.font = Font(name="TH Sarabun New", size=12, bold=True, color=STATUS_PENDING_FONT)
    elif any(k in text for k in ["อนุมัติ", "ทำได้", "Approved", "Yes", "สอดคล้อง"]):
        cell.fill = PatternFill(start_color=STATUS_APPROVED_FILL, end_color=STATUS_APPROVED_FILL, fill_type="solid")
        cell.font = Font(name="TH Sarabun New", size=12, bold=True, color=STATUS_APPROVED_FONT)
    elif any(k in text for k in ["ข้อเสนอ", "เสนอปรับปรุง", "Proposed", "ร่าง"]):
        cell.fill = PatternFill(start_color=STATUS_PROPOSED_FILL, end_color=STATUS_PROPOSED_FILL, fill_type="solid")
        cell.font = Font(name="TH Sarabun New", size=12, bold=True, color=STATUS_PROPOSED_FONT)
    elif any(k in text for k in ["ไม่ได้", "ไม่อนุมัติ", "No", "Denied", "จำกัด"]):
        cell.fill = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
        cell.font = Font(name="TH Sarabun New", size=12, bold=True, color="B91C1C")
    else:
        cell.fill = white_fill
        cell.font = Font(name="TH Sarabun New", size=12, color="1E293B")
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
# 1. BUILD THAI DECISION REGISTER EXCEL
# ==============================================================================
def build_decision_register_th(out_path):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "ทะเบียนการตัดสินใจ (Decision)"
    
    ws.merge_cells("A1:I1")
    t1 = ws["A1"]
    t1.value = "InterviewX — ทะเบียนการตัดสินใจด้านสถาปัตยกรรมและแอปพลิเคชันมือถือ (Decision Register)"
    t1.font = Font(name="TH Sarabun New", size=16, bold=True, color="FFFFFF")
    t1.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t1.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[1].height = 36
    
    ws.merge_cells("A2:I2")
    t2 = ws["A2"]
    t2.value = "เวอร์ชันเอกสาร: 1.1 DRAFT | วันที่จัดทำ: 13 พฤศจิกายน 2026 | สถานะ: รอการพิจารณาอนุมัติอย่างเป็นทางการ (Pending Approval)"
    t2.font = Font(name="TH Sarabun New", size=12, italic=True, color="475569")
    t2.fill = PatternFill(start_color=CALLOUT_FILL, end_color=CALLOUT_FILL, fill_type="solid")
    t2.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[2].height = 22

    headers = [
        "รหัสการตัดสินใจ", "หมวดหมู่", "หัวข้อการตัดสินใจ", "คำอธิบายเชิงเทคนิคและธุรกิจ",
        "ทางเลือกที่อยู่ระหว่างพิจารณา", "ผลกระทบและความเชื่อมโยง", "ข้อเสนอแนะของทีมงาน",
        "ผู้รับผิดชอบ", "สถานะการตัดสินใจ"
    ]
    
    ws.append([])
    ws.append(headers)
    style_header_row(ws, 4, len(headers), height=28)
    
    decisions = [
        ("D-M01", "สถาปัตยกรรมและการปล่อยระบบ", "กรอบเวลาการเปิดตัวแอปพลิเคชันมือถือ (Native Mobile Release Timeline)",
         "กำหนดเป้าหมายระยะเวลาการส่งมอบ Native Mobile Application (iOS/Android): ปล่อยพร้อม Core MVP (R1), ปล่อยใน R2 ควบคู่กับระบบเสียง (Voice/STT), หรือชะลอไปในระยะ R3",
         "ทางเลือก A: เปิดตัวใน R2 ควบคู่กับระบบฝึกด้วยเสียงและ Dashboard (ข้อเสนอแนะ)\nทางเลือก B: เปิดตัวพร้อมกันใน R1 (มีความเสี่ยงด้านทรัพยากรสูง)\nทางเลือก C: ชะลอไปเปิดตัวใน R3",
         "การจัดสรรงบประมาณ, ทรัพยากรทีมพัฒนาโมบาย, แผนงานทดสอบ QA, การตั้งค่า Mobile CI/CD Pipeline",
         "ทางเลือก A (มุ่งเป้า R2 เพื่อให้ R1 มุ่งเน้นการสร้างความมั่นคงของ Core NestJS APIs บน Responsive Web ก่อน)",
         "Product Owner / Technical Lead", "รอการยืนยัน (Pending Confirmation)"),
        ("D-M02", "เทคโนโลยีโมบาย", "การเลือกเฟรมเวิร์กพัฒนาแอปพลิเคชันมือถือ (Mobile Framework Selection)",
         "คัดเลือกสแต็กเทคโนโลยีสำหรับการพัฒนาแอปพลิเคชันบน iOS และ Android ระหว่าง Cross-Platform หรือ Native แท้",
         "ทางเลือก A: React Native / Expo (ใช้ทักษะ TypeScript ร่วมกับทีม Next.js Web และแชร์ Zod Schema ได้โดยตรง)\nทางเลือก B: Flutter / Dart (ประสิทธิภาพ UI สูง แต่ต้องดูแลสแต็กภาษาแยกต่างหาก)\nทางเลือก C: Native Swift (iOS) และ Kotlin (Android) (ประสิทธิภาพสูงสุด แต่ต้นทุนการพัฒนาเป็น 2 เท่า)",
         "ทักษะของทีมงาน, การแชร์โค้ดตรวจสอบข้อมูล (Validation Schemas), ความซับซ้อนของ Bridge เชื่อมต่อระบบบันทึกเสียง",
         "ทางเลือก A (React Native / Expo ช่วยให้แชร์ DTOs และ Validation Schemas ร่วมกับ Web และ Backend ได้อย่างมีประสิทธิภาพ)",
         "Technical Lead / Mobile Architect", "รอการยืนยัน (Pending Confirmation)"),
        ("D-M03", "ความเข้ากันได้ของระบบ", "เวอร์ชันระบบปฏิบัติการขั้นต่ำที่รองรับ (Minimum Supported OS)",
         "กำหนดเกณฑ์เวอร์ชันขั้นต่ำของระบบปฏิบัติการ Apple iOS และ Google Android ที่ระบบรองรับ",
         "ทางเลือก A: iOS 16.0+ และ Android 13.0+ (API Level 33) (รองรับ Audio APIs สมัยใหม่, Hardware Enclave ปลอดภัยสูง, ครอบคลุมผู้ใช้อุปกรณ์ปัจจุบัน ~92%)\nทางเลือก B: iOS 15.0+ และ Android 10.0+ (ครอบคลุมอุปกรณ์เก่ามากขึ้น แต่มีภาระในการทดสอบและความเสี่ยงด้านความปลอดภัย)",
         "ความครอบคลุมของอุปกรณ์ผู้ใช้, การเรียกใช้ Biometric API, การรักษาความปลอดภัยของโทเคน",
         "ทางเลือก A (iOS 16+ / Android 13+ เพื่อมาตรฐานความปลอดภัยระดับฮาร์ดแวร์และ Audio Streaming ที่เสถียร)",
         "QA Lead / Mobile Architect", "รอการยืนยัน (Pending Confirmation)"),
        ("D-M04", "การเงินและการพาณิชย์", "สถาปัตยกรรมการชำระเงินบนมือถือ (Mobile Payment Architecture)",
         "กำหนดรูปแบบการชำระค่าสมาชิกแพ็กเกจ (Basic/Pro) บนแอปพลิเคชันมือถือ ระหว่าง Apple In-App Purchase / Google Play Billing (มีค่าธรรมเนียมสโตร์ 15–30%) กับการเปลี่ยนเส้นทางไปชำระบน Web Checkout",
         "ทางเลือก A: รูปแบบไฮบริด (Hybrid) - แสดงข้อมูลแพ็กเกจในแอป และเปลี่ยนเส้นทางไปชำระบน Web Checkout (ต้องตรวจสอบนโยบาย Reader/Multiplatform ของ Store)\nทางเลือก B: เชื่อมต่อ In-App Purchase (IAP) เต็มรูปแบบบน iOS (StoreKit 2) และ Android",
         "อัตรากำไรของระบบ (หักค่าธรรมเนียมสโตร์ 15–30%), ความซับซ้อนในการกระทบยอดธุรกรรม, ประสบการณ์ผู้ใช้",
         "ทางเลือก A ในระยะเริ่มต้นควบคู่กับการตรวจสอบข้อกฎหมายของ App Store; จัดเตรียมทางเลือก B หากแอปถูกจำกัดสิทธิ์",
         "Finance Admin / Product Owner / Legal", "รอการยืนยัน (Pending Confirmation)"),
        ("D-M05", "การมีส่วนร่วมของผู้ใช้", "ขอบเขตการแจ้งเตือนทางมือถือ (Push Notifications Scope)",
         "ประเมินความจำเป็นของระบบ Push Notification (Apple APNs / Google FCM) สำหรับแจ้งเตือนการฝึกซ้อม, แจ้งเมื่อผลประเมิน AI พร้อม, และแจ้งรอบบิลสมาชิก",
         "ทางเลือก A: ติดตั้งระบบ APNs/FCM ผ่าน Background Notification Worker ในระยะ R2\nทางเลือก B: ใช้การแจ้งเตือนผ่าน In-App Banner และอีเมล (Transactional Email) เท่านั้น",
         "การเพิ่มเอนด์พอยต์ลงทะเบียน Device Token, นโยบายความเป็นส่วนตัวของรหัสอุปกรณ์, ระบบคิวแจ้งเตือน",
         "ทางเลือก A กำหนดเปิดใช้งานในระยะ R2 เพื่อเพิ่มการกลับมาใช้งานต่อเนื่องของผู้เรียน",
         "Product Owner / Backend Lead", "รอการยืนยัน (Pending Confirmation)"),
        ("D-M06", "ความปลอดภัยและการยืนยันตัวตน", "การยืนยันตัวตนด้วยชีวมิติ (Biometric Authentication)",
         "พิจารณาการรองรับการปลดล็อกแอปด้วย Face ID / Touch ID (iOS) และ BiometricPrompt (Android) เพื่ออำนวยความสะดวกในการกลับเข้าสู่ระบบ",
         "ทางเลือก A: เปิดใช้งาน Biometric Unlock สำหรับปลดล็อก Refresh Token ที่เข้ารหัสอยู่ใน Keychain/Keystore ในเครื่อง\nทางเลือก B: ใช้การตรวจสอบสิทธิ์ผ่านรหัสผ่านและ JWT Refresh Token ตามรอบเวลาปกติ",
         "ความสะดวกรวดเร็วในการเข้าใช้งานของผู้ใช้, ความปลอดภัยระดับเครื่อง, ไม่มีผลกระทบต่อสัญญาระบบหลังบ้าน (API Contract)",
         "ทางเลือก A เป็นฟังก์ชันเสริมฝั่งไคลเอนต์ (Client-side enhancement) หลังระบบยืนยันตัวตนหลักเสถียรแล้ว",
         "Security Lead / Mobile Lead", "รอการยืนยัน (Pending Confirmation)"),
        ("D-M07", "การนำทางและลิงก์ภายนอก", "การเชื่อมโยงลิงก์ลึก (Deep Linking & Universal Links)",
         "การติดตั้ง Apple Universal Links และ Android App Links เพื่อนำทางผู้ใช้จากลิงก์ภายนอก (เช่น อีเมลยืนยันตัวตน, ลิงก์แชร์เซสชัน) เข้าสู่แอปพลิเคชันมือถือโดยตรง",
         "ทางเลือก A: ติดตั้งการตั้งค่าโดเมน apple-app-site-association และ assetlinks.json\nทางเลือก B: นำทางผ่านเว็บบราวเซอร์เป็นหลักพร้อมแสดงปุ่มเปิดแอป",
         "การกำหนดค่า DNS และโดเมนของเซิร์ฟเวอร์, ตารางเส้นทางภายในแอป (Routing Table), ขั้นตอนยืนยันอีเมล",
         "ทางเลือก A เพื่อประสบการณ์ผู้ใช้ที่ราบรื่นในการยืนยันอีเมลและการเข้าสู่บทเรียนโดยตรง",
         "Frontend Lead / Mobile Lead", "รอการยืนยัน (Pending Confirmation)"),
        ("D-M08", "การทำงานออฟไลน์", "ขอบเขตการทำงานแบบออฟไลน์ (Offline Mode & Local Storage)",
         "กำหนดขอบเขตการทำงานขณะไม่มีสัญญาณอินเทอร์เน็ต ระหว่างการบังคับเชื่อมต่อเครือข่ายสำหรับการฝึก AI หรือการอนุญาตให้ฝึกจำลองแบบออฟไลน์",
         "ทางเลือก A: กำหนดให้ต้องเชื่อมต่ออินเทอร์เน็ตสำหรับการประเมิน AI (Online-required); แอปทำหน้าที่เก็บแคชชั่วคราวสำหรับร่างคำตอบและส่งซ้ำอัตโนมัติเมื่อเน็ตกลับมา\nทางเลือก B: พัฒนาระบบประเมินผลออฟไลน์ด้วย On-device LLM (ต้องการฮาร์ดแวร์มือถือระดับสูงมาก, สิ้นเปลืองแบตเตอรี่, ควบคุมเวอร์ชันยาก)",
         "สถาปัตยกรรมระบบ, ความสอดคล้องของคุณภาพคะแนนประเมิน (NFR02), การจัดการพื้นที่จัดเก็บบนเครื่อง",
         "ทางเลือก A (บังคับออนไลน์เพื่อการประเมินผล AI ที่แม่นยำและเป็นมาตรฐาน; โดยมีระบบ Local Resilience ป้องกันข้อมูลสูญหาย)",
         "Software Architect / AI Lead", "รอการยืนยัน (Pending Confirmation)"),
        ("D-M09", "แผนงานผลิตภัณฑ์", "ความเท่าเทียมของฟังก์ชันระหว่างแพลตฟอร์ม (Cross-Platform Feature Parity)",
         "กำหนดขอบเขตความเท่าเทียมกันของฟังก์ชันการใช้งานระหว่าง Web Application และ Native Mobile Application สำหรับผู้ใช้ทั่วไป (End Users)",
         "ทางเลือก A: ความเท่าเทียมของฟังก์ชันสำหรับ End Users 100% (FR01-FR16, FR33, FR35, FR36); โดยระบบ Admin/Researcher จำกัดเฉพาะบน Web เท่านั้น\nทางเลือก B: โมบายแอปเน้นเฉพาะการฝึกด้วยเสียง (Voice Practice) และลดทอนฟังก์ชัน Dashboard/History",
         "การออกแบบชุดทดสอบ QA, วงรอบการปล่อยอัปเดตระบบที่สอดคล้องกัน",
         "ทางเลือก A เพื่อให้ผู้ใช้งานได้รับประสบการณ์การฝึกสัมภาษณ์ที่สมบูรณ์ไม่ว่าจะใช้งานผ่านคอมพิวเตอร์หรือโทรศัพท์มือถือ",
         "Product Owner / QA Lead", "รอการยืนยัน (Pending Confirmation)"),
        ("D-M10", "การเผยแพร่และข้อกำหนดสโตร์", "การปฏิบัติตามนโยบายของ App Store และ Google Play (App Store Compliance)",
         "จัดเตรียมนโยบายและฟังก์ชันของระบบให้เป็นไปตาม Apple App Store Review Guidelines และ Google Play Developer Policies อย่างเคร่งครัด",
         "ทางเลือก A: ปฏิบัติตามมาตรฐานสากลครบถ้วน: มีปุ่มขอลบข้อมูลบัญชีภายในแอป (FR35), ขอความยินยอมไมโครโฟนแบบเจาะจง (FR05.1), มีแถบโภชนาการความเป็นส่วนตัว (Privacy Nutrition Labels)\nทางเลือก B: เผยแพร่เฉพาะการใช้งานภายในองค์กร (Internal Ad-hoc / TestFlight / Firebase App Distribution)",
         "ความพร้อมในการเปิดตัวสู่สาธารณะบนสโตร์ทางการ, การปฏิบัติตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)",
         "ทางเลือก A (จำเป็นอย่างยิ่งสำหรับการเปิดให้บริการเชิงพาณิชย์แก่บุคคลทั่วไป)",
         "Legal / Privacy Lead / Release Manager", "รอการยืนยัน (Pending Confirmation)"),
        ("D-M11", "ระบบเสียงและมัลติมีเดีย", "โปรโตคอลส่งสัญญาณเสียงสำหรับการฝึกด้วยเสียงบนมือถือ (Mobile Audio Streaming Protocol)",
         "คัดเลือกโปรโตคอลการรับส่งข้อมูลเสียงในระยะ R2 ระหว่างการอัปโหลดไฟล์เสียงแบบแบ่งชิ้น (Chunked HTTPS Upload) กับการสตรีมเสียงสองทางแบบเรียลไทม์ (WebSocket / WebRTC)",
         "ทางเลือก A: Chunked HTTPS Upload ไปยัง Signed URLs บน MinIO/S3 (มีความเสถียรสูงบนเครือข่ายมือถือ 4G/5G, พัฒนาง่าย, จัดการข้อผิดพลาดได้ดี)\nทางเลือก B: WebSocket หรือ WebRTC Streaming สองทาง (มีความหน่วงต่ำมาก แต่ต้องการเซิร์ฟเวอร์เฉพาะทางและไวต่อสัญญาณเน็ตที่แกว่ง)",
         "โครงสร้างพื้นฐานระบบรับข้อมูลเสียง, ปริมาณการใช้งานดาต้ามือถือ, ความหน่วงของกระบวนการถอดความเสียง (STT)",
         "ทางเลือก A สำหรับการเปิดตัวในระยะ R2 และประเมินทางเลือก B สำหรับการสตรีมเสียงแบบเรียลไทม์ในระยะถัดไป",
         "Technical Lead / AI Lead", "รอการยืนยัน (Pending Confirmation)")
    ]
    
    start_row = 5
    for i, row in enumerate(decisions):
        r_idx = start_row + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=NAVY_HEADER, align="center")
            elif c_idx == 1:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, align="center")
            elif c_idx == len(row) - 1:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=12, align="left")
        ws.row_dimensions[r_idx].height = 46
        
    explicit_widths = {1: 15, 2: 24, 3: 32, 4: 48, 5: 48, 6: 38, 7: 38, 8: 26, 9: 25}
    auto_fit_columns(ws, 1, len(headers), explicit_widths=explicit_widths)
    wb.save(out_path)
    print(f"Generated Thai Decision Register: {out_path}")

# ==============================================================================
# 2. BUILD THAI REQUIREMENT TRACEABILITY EXCEL
# ==============================================================================
def build_traceability_th(out_path):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "ตารางเชื่อมโยงข้อกำหนด (RTM)"
    
    ws.merge_cells("A1:L1")
    t1 = ws["A1"]
    t1.value = "InterviewX — ตารางเชื่อมโยงข้อกำหนดระบบ (Requirement Traceability Matrix: RTM)"
    t1.font = Font(name="TH Sarabun New", size=16, bold=True, color="FFFFFF")
    t1.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t1.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[1].height = 36
    
    ws.merge_cells("A2:L2")
    t2 = ws["A2"]
    t2.value = "เกณฑ์อ้างอิง: ข้อกำหนดระบบ SRS v1.1 DRAFT | ตารางข้อกำหนด FR/NFR/RBAC | แผนภาพระบบ ALL_DIAGRAMS v1.1 | วันที่: 13 พฤศจิกายน 2026"
    t2.font = Font(name="TH Sarabun New", size=12, italic=True, color="475569")
    t2.fill = PatternFill(start_color=CALLOUT_FILL, end_color=CALLOUT_FILL, fill_type="solid")
    t2.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[2].height = 22

    headers = [
        "รหัสข้อกำหนด", "ชื่อข้อกำหนด", "ประเภท", "ระยะปล่อยระบบ", "หมวดใน SRS",
        "ขอบเขตแพลตฟอร์ม", "บทบาทผู้ใช้ที่เกี่ยวข้อง", "ข้อกำหนดคุณภาพ / องค์ประกอบสถาปัตยกรรม",
        "วิธีการทดสอบและทวนสอบ", "สถานะการพัฒนา", "สถานะการอนุมัติ", "หมายเหตุการจัดแนวข้อกำหนด (Phase 1)"
    ]
    
    ws.append([])
    ws.append(headers)
    style_header_row(ws, 4, len(headers), height=28)
    
    trace_data = [
        # Functional Requirements
        ("FR01", "การลงทะเบียน เข้าสู่ระบบ และความปลอดภัยของเซสชัน", "FR", "R1", "หมวด 5 (FR01)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest, Registered User, ทุกบทบาท", "NFR01, NFR19 / Identity Context", "ชุดทดสอบการยืนยันตัวตนอัตโนมัติ, การหมดอายุโทเคน", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ระบบ Authentication API ศูนย์กลางสำหรับ Web & Mobile; เก็บโทเคนใน HTTP-only cookies (Web) และ Keychain/Keystore (Mobile)"),
        ("FR02", "โปรไฟล์และสถานะของผู้ใช้งาน", "FR", "R1", "หมวด 5 (FR02)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NFR03 / User Context", "การทดสอบ CRUD API และ UI การจัดการโปรไฟล์", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ซิงค์ข้อมูลสถานะปัจจุบันและเป้าหมายการฝึกสัมภาษณ์ตรงกัน 100% ระหว่าง Web และ Mobile"),
        ("FR03", "การกำหนดค่าระดับความเชี่ยวชาญ", "FR", "R2", "หมวด 5 (FR03)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NFR03 / Interview Context", "การทดสอบเลือกทักษะและการบันทึกค่ากำกับเซสชัน", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "เมนูเลือกระดับ Beginner, Intermediate, Advanced ใช้งานได้เหมือนกันบน Web และ Mobile"),
        ("FR04", "การส่งมอบคำถามและหมวดหมู่การสัมภาษณ์", "FR", "R1", "หมวด 5 (FR04)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR02, NFR21 / Question Bank Context", "การทดสอบความถูกต้องของหมวดหมู่และคลังคำถาม", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ดึงคำถามจาก Question Bank บนเซิร์ฟเวอร์กลางผ่าน REST API; โครงสร้างข้อมูลตรงกันทุกแพลตฟอร์ม"),
        ("FR05", "การส่งคำตอบในรูปแบบข้อความ", "FR", "R1", "หมวด 5 (FR05)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR04, NFR12 / Interview Context", "การทดสอบส่งคำตอบและการตรวจสอบ Idempotency", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ส่งคำตอบผ่าน POST /answers พร้อมระบุ Idempotency-Key header เพื่อป้องกันคำตอบซ้ำ"),
        ("FR05-V", "การส่งคำตอบด้วยเสียงและการแปลงเป็นข้อความ (STT)", "FR", "R2", "หมวด 5 (FR05-V)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR04, NFR09, NFR18 / Private Storage + STT", "การทดสอบบันทึกเสียง อัปโหลด และตรวจแก้คำถอดความ", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "Web Audio API (เว็บบราวเซอร์) และ Native Microphone Bridge (iOS/Android); อัปโหลดไฟล์เสียงผ่าน Signed URL"),
        ("FR05.1", "การเลือกเก็บรักษาไฟล์เสียง (Voice-Retention)", "FR", "R2", "หมวด 5 (FR05.1)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NFR09, NFR18 / Privacy Context", "การทดสอบกลไก Opt-in และการลบตามวงจรชีวิต", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แสดงกล่องข้อความขอความยินยอมแยกต่างหากก่อนเริ่มฝึกด้วยเสียงทั้งบน Web และ Mobile"),
        ("FR06", "โหมดจำลองการสัมภาษณ์แบบกดดัน", "FR", "R2", "หมวด 5 (FR06)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR03 / Interview Context", "การทดสอบตัวจับเวลาและปุ่มขอยกเลิกออกจากโหมด", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ระบบนับเวลาถอยหลังและปุ่มออกจากโหมดทำงานสอดคล้องกันทุกแพลตฟอร์ม"),
        ("FR07", "ความหลากหลายของคำถามและการป้องกันคำถามซ้ำ", "FR", "R2", "หมวด 5 (FR07)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR02 / Question Selector Engine", "การทดสอบอัลกอริทึมคัดเลือกคำถามไม่ซ้ำซ้อน", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ระบบตรวจสอบประวัติการฝึกรวมของบัญชีผู้ใช้เพื่อลดการส่งคำถามเดิมซ้ำ"),
        ("FR08", "การประเมินคะแนนด้วยเกณฑ์รูบริกของ AI", "FR", "R1", "หมวด 5 (FR08)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR02, NFR20, NFR21 / AI Eval Worker", "การทดสอบเกณฑ์ Benchmark ร่วมกับผู้เชี่ยวชาญมนุษย์", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ประมวลผลบนเซิร์ฟเวอร์ส่วนกลางผ่าน FastAPI; ผลลัพธ์แสดงผลในรูปแบบการ์ดเหมือนกันบน Web และ Mobile"),
        ("FR09", "การวิเคราะห์และข้อเสนอแนะภาษาอังกฤษ", "FR", "R2", "หมวด 5 (FR09)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR02, NFR07 / AI Eval Worker", "การทดสอบชุดคำตอบไวยากรณ์ภาษาอังกฤษสองภาษา", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แยกคะแนนไวยากรณ์และคำศัพท์ออกจากคะแนนเนื้อหา; แสดงผลคำแนะนำสอดคล้องกัน"),
        ("FR10", "ตัวชี้วัดพฤติกรรมการพูดที่สังเกตได้", "FR", "R2", "หมวด 5 (FR10)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR02 / Speech Analytics Service", "การทดสอบความเร็วคำพูด (WPM), จุดหยุดพัก, คำฟุ่มเฟือย", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "วิเคราะห์บนระบบหลังบ้าน; แสดงผลกราฟและข้อความปฏิเสธความรับผิดชอบ (Disclaimer) ชัดเจน"),
        ("FR11", "ข้อเสนอแนะเชิงปฏิบัติที่นำไปปรับปรุงได้", "FR", "R1", "หมวด 5 (FR11)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR02, NFR03 / AI Eval Worker", "การตรวจสอบคุณภาพข้อเสนอแนะและหลักฐานอ้างอิง", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ระบุจุดเด่น จุดปรับปรุง พร้อมอ้างอิงคำตอบจริงของผู้ใช้; จัดการแสดงผลสวยงามทุกขนาดหน้าจอ"),
        ("FR12", "ตัวอย่างคำตอบแนวทางสำหรับการเรียนรู้", "FR", "R2", "หมวด 5 (FR12)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR03 / Content Context", "การทดสอบแสดงตัวอย่างคำตอบที่สัมพันธ์กับคำถาม", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แสดงป้ายกำกับว่าเป็นตัวอย่างแนวทาง; ใช้งานได้ทั้งบน Web และ Mobile"),
        ("FR13", "แดชบอร์ดแสดงพัฒนาการและความก้าวหน้า", "FR", "R2", "หมวด 5 (FR13)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NFR03 / Analytics Read Model", "การทดสอบกราฟเปรียบเทียบแนวโน้มคะแนนประวัติ", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ดึงข้อมูลสถิติจากเซิร์ฟเวอร์กลาง; แสดงผลผ่าน Web Charts และ Mobile Native Charts"),
        ("FR14", "ประวัติการฝึกสัมภาษณ์และการจัดการข้อมูลตนเอง", "FR", "R1", "หมวด 5 (FR14)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NFR19 / Interview Context", "การทดสอบแบ่งหน้าประวัติ, การส่งออกข้อมูล, การขอลบ", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "เรียกดูและลบประวัติของตนเองได้ข้ามอุปกรณ์; การลบข้อมูลบนเครื่องใดจะอัปเดตตรงกันทันที"),
        ("FR15", "การเข้าถึงระบบหลายแพลตฟอร์มและความสอดคล้องของข้อมูล", "FR", "R1/R2", "หมวด 5 (FR15)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest, Registered User (Web & Mobile); ทุกบทบาท (Web)", "NFR08 / API Gateway & Client Frontends", "การทดสอบ E2E Multi-Device Matrix ครอบคลุมทุกแพลตฟอร์ม", "ปรับปรุงใหม่", "เสนอปรับปรุง — รอการอนุมัติ",
         "ปรับปรุงข้อกำหนดเพื่อแยก Responsive Web และ Native Mobile อย่างชัดเจน พร้อมเกณฑ์ยอมรับ 7 ข้อ"),
        ("FR16", "การเลือกรูปแบบการฝึกซ้อมสัมภาษณ์", "FR", "R2", "หมวด 5 (FR16)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR03 / Interview Wizard", "การทดสอบสลับโหมดข้อความ เสียง และโหมดผสม", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "รองรับการเลือก Text, Voice หรือ Mixed Mode สอดคล้องกันทั้ง Web และ Mobile"),
        ("FR17", "ประกาศความเป็นส่วนตัวและการจัดการความยินยอม", "FR", "R1", "หมวด 5 (FR17)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest, Registered User, ทุกบทบาท", "NFR01, NFR09, NFR17 / Privacy Context", "การทดสอบแสดงประกาศและประวัติ Consent Version", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แสดง Privacy Notice แบบแยกวัตถุประสงค์ในการลงทะเบียนและเปิดแอปครั้งแรก"),
        ("FR18", "การขอความยินยอมเพื่อการติดต่อกลับ (Contact Opt-in)", "FR", "R3", "หมวด 5 (FR18)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NFR01, NFR17 / Consent Service", "การทดสอบบันทึกความยินยอมและการเพิกถอนสิทธิ์", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "กล่องติ๊กเลือกยินยอมแยกอิสระในหน้าตั้งค่าบัญชี; จัดการได้ทั้งบน Web และ Mobile"),
        ("FR18.1", "การควบคุมการอนุญาตเปิดเผยข้อมูลเพื่อการวิจัย", "FR", "R3", "หมวด 5 (FR18.1)", "เฉพาะบนเว็บเท่านั้น (Web Only)",
         "Researcher", "NFR17, NFR19 / Research Release Service", "การทดสอบกลไก RLS และการประมวลผลข้อมูลรวม", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "จำกัดการเข้าถึงเฉพาะ Web Application เท่านั้น; ไม่อนุญาตให้เปิดเผยข้อมูลวิจัยผ่านแอปมือถือ"),
        ("FR19", "แคตตาล็อกรายการแพ็กเกจสมาชิก", "FR", "R3", "หมวด 5 (FR19)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest, Registered User", "NFR06, NFR10 / Billing Context", "การทดสอบแสดงรายการราคาและรายละเอียดสิทธิ์", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แสดงรายการราคาที่ Active ตรงกัน; การชำระเงินบนมือถือขึ้นอยู่กับผลการตัดสินใจ D-M04"),
        ("FR20", "การตรวจสอบสิทธิ์และบังคับใช้โควตาแพ็กเกจ", "FR", "R3", "หมวด 5 (FR20)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NFR10, NFR12 / Entitlement Service", "การทดสอบตัดโควตาแบบ Atomic ที่ฝั่งเซิร์ฟเวอร์", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ตรวจสอบโควตาคงเหลือแบบ Atomic ที่เซิร์ฟเวอร์ก่อนเริ่มเซสชัน ป้องกันการใช้งานเกินสิทธิ์"),
        ("FR21", "ตารางเปรียบเทียบสิทธิประโยชน์ของแพ็กเกจ", "FR", "R3", "หมวด 5 (FR21)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest, Registered User", "NFR03 / Billing Context", "การทดสอบการแสดงผลตารางเปรียบเทียบ Free/Basic/Pro", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ตารางเปรียบเทียบฟีเจอร์และโควตาแสดงผลอย่างเหมาะสมทั้งบน Web และ Mobile"),
        ("FR22", "ช่องทางการชำระเงินตามที่กำหนด", "FR", "R3", "หมวด 5 (FR22)", "ใช้งานร่วมกัน (ตามเงื่อนไข D-M04)",
         "Registered User", "NFR10, NFR11 / Payment Adapter", "การทดสอบเปลี่ยนเส้นทางชำระเงินใน Sandbox", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "Web ใช้ Hosted Payment Gateway; Mobile ใช้ Web Checkout หรือ In-App Purchase ตาม D-M04"),
        ("FR23", "การตรวจสอบความถูกต้องของ Payment Gateway", "FR", "R3", "หมวด 5 (FR23)", "ระบบบริการหลังบ้าน (Backend)",
         "Registered User (ผ่านระบบ)", "NFR11, NFR12 / Billing Webhook", "การทดสอบตรวจสอบ HMAC Signature และป้องกัน Replay", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "เซิร์ฟเวอร์ตรวจสอบ Webhook ของ Gateway อย่างเข้มงวดและปลดล็อกสิทธิ์ให้ผู้ใช้ทุกอุปกรณ์"),
        ("FR24", "การออกหลักฐานและใบเสร็จรับเงิน", "FR", "R3", "หมวด 5 (FR24)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NFR15, NFR16 / Billing Context", "การทดสอบสร้างและดาวน์โหลดใบเสร็จรับเงิน PDF", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ออกหลักฐานการชำระเงินอัตโนมัติ; ผู้ใช้สามารถเรียกดูและดาวน์โหลดได้ทั้งบน Web และ Mobile"),
        ("FR25", "การปลดล็อกสิทธิ์ใช้งานแพ็กเกจ (Provisioning)", "FR", "R3", "หมวด 5 (FR25)", "ระบบบริการหลังบ้าน (Backend)",
         "Registered User (ผ่านระบบ)", "NFR12 / Billing Outbox Context", "การทดสอบอัปเดตสิทธิ์ตามเหตุการณ์ชำระเงิน", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ปลดล็อกโควตาและฟีเจอร์ในบัญชีผู้ใช้ทันที ซิงค์สถานะใหม่ข้ามทุกอุปกรณ์ที่ล็อกอินอยู่"),
        ("FR26", "การต่ออายุสมาชิกแพ็กเกจ", "FR", "R3", "หมวด 5 (FR26)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NFR11, NFR14 / Billing Service", "การทดสอบวงรอบการต่ออายุแบบอัตโนมัติและแบบกำหนดเอง", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แสดงวันหมดอายุและสถานะการต่ออายุชัดเจนบนหน้าจอโปรไฟล์ทั้งบน Web และ Mobile"),
        ("FR27", "การขอยกเลิกและขอคืนเงิน", "FR", "R3", "หมวด 5 (FR27)", "ผู้ใช้ส่งคำขอ (Web/Mobile) / Admin อนุมัติ (Web)",
         "Registered User (ส่งคำขอ), Finance Admin (อนุมัติ)", "NFR15 / Billing & Finance Context", "การทดสอบกระบวนการยื่นคำขอ อนุมัติ และคืนเงิน", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ผู้ใช้ยื่นคำขอได้จากทั้งสองแพลตฟอร์ม; หน้าจอพิจารณาอนุมัติจำกัดเฉพาะ Web Admin เท่านั้น"),
        ("FR28", "การแจ้งเตือนก่อนถึงกำหนดต่ออายุ", "FR", "R3", "หมวด 5 (FR28)", "ใช้งานร่วมกัน (ตามเงื่อนไข D-M05)",
         "Registered User", "NFR05 / Notification Worker", "การทดสอบส่งแจ้งเตือนทางอีเมลและ Push Notification", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แจ้งเตือนล่วงหน้าทางอีเมลเป็นมาตรฐาน; แจ้งเตือนผ่าน Push Notification บนมือถือตาม D-M05"),
        ("FR29", "ประวัติการทำธุรกรรมและการชำระเงิน", "FR", "R3", "หมวด 5 (FR29)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NFR15 / Billing Context", "การทดสอบเรียกดูประวัติการชำระเงินเฉพาะของตนเอง", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แสดงประวัติธุรกรรม เลขอ้างอิง และสถานะอย่างโปร่งใส ป้องกันการเข้าถึงข้ามบัญชี"),
        ("FR30", "การกำหนดเวอร์ชันแพ็กเกจของผู้ดูแลระบบ", "FR", "R3", "หมวด 5 (FR30)", "เฉพาะบนเว็บเท่านั้น (Web Only)",
         "Finance Admin, System Admin", "NFR15, NFR19 / Admin Console", "การทดสอบขั้นตอนร่าง อนุมัติ และเผยแพร่แพ็กเกจ", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "เครื่องมือตั้งราคาและแก้ไขโควตาแพ็กเกจจำกัดเฉพาะ Web Application เพื่อความปลอดภัยสูงสุด"),
        ("FR31", "รายงานตัวชี้วัดและสถิติทางธุรกิจ", "FR", "R3", "หมวด 5 (FR31)", "เฉพาะบนเว็บเท่านั้น (Web Only)",
         "Finance Admin, System Admin", "NFR06, NFR15 / Reporting Context", "การทดสอบกระทบยอดรายได้ อัตราต่ออายุ และ Churn", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แดชบอร์ดสถิติรายได้และข้อมูลการเงินจำกัดให้เข้าถึงได้เฉพาะบน Web Application"),
        ("FR32", "บันทึกประวัติการดำเนินงานของผู้ดูแลระบบ (Audit)", "FR", "R1", "หมวด 5 (FR32)", "เฉพาะบนเว็บเท่านั้น (Web Only)",
         "System Admin", "NFR01, NFR15 / Platform Audit", "การทดสอบบันทึก Audit Log แบบเปลี่ยนแปลงไม่ได้", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "หน้าจอตรวจสอบประวัติ Audit Log จำกัดเฉพาะ System Admin บน Web Application เท่านั้น"),
        ("FR32.1", "บันทึกประวัติการเข้าถึงข้อมูลของนักวิจัย", "FR", "R3", "หมวด 5 (FR32.1)", "เฉพาะบนเว็บเท่านั้น (Web Only)",
         "Researcher (ดูของตนเอง), System Admin", "NFR15, NFR17 / Research Audit", "การทดสอบบันทึกประวัติ Query และการส่งออกข้อมูล", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "บันทึกประวัติการสืบค้นข้อมูลวิจัยและจำนวน Record จัดเก็บถาวรและเรียกดูได้บน Web เท่านั้น"),
        ("FR33", "ความทนทานต่อการขัดข้องของเซสชัน (Resilience)", "FR", "R1", "หมวด 5 (FR33)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest (ทดลอง), Registered User", "NFR05, NFR23 / Client Resilience", "การทดสอบจำลองสัญญาณมือถือขาดหายและการกู้คืน", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แอปมือถือเก็บแคชร่างคำตอบในเครื่องและเปิดให้กดส่งซ้ำได้เมื่อสัญญาณกลับมาโดยข้อมูลไม่หาย"),
        ("FR34", "การตั้งค่า AI และการทบทวนโดยมนุษย์", "FR", "R1", "หมวด 5 (FR34)", "เฉพาะบนเว็บเท่านั้น (Web Only)",
         "System Admin", "NFR20, NFR21 / AI Governance", "การทดสอบปรับเวอร์ชัน Prompt, Rubric และการ Rollback", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "เครื่องมือตั้งค่าพารามิเตอร์โมเดล AI และ Rubric Version จำกัดเฉพาะบน Web Application"),
        ("FR35", "การยื่นคำขอใช้สิทธิตามกฎหมายคุ้มครองข้อมูล (DSR)", "FR", "R1", "หมวด 5 (FR35)", "ผู้ใช้ส่งคำขอ (Web/Mobile) / Admin ดำเนินการ (Web)",
         "Registered User (ส่งคำขอ), System Admin (ดำเนินการ)", "NFR01, NFR09 / Privacy Context", "การทดสอบกระบวนการขอลบข้อมูลและส่งออกข้อมูล", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ผู้ใช้ยื่นขอลบข้อมูลบัญชีได้จากภายในแอป (ตามกฎ App Store); เจ้าหน้าที่จัดการผ่าน Web"),
        ("FR36", "การจัดการข้อผิดพลาด AI และการยื่นอุทธรณ์ผล", "FR", "R1", "หมวด 5 (FR36)", "ผู้ใช้ยื่นอุทธรณ์ (Web/Mobile) / Admin ทบทวน (Web)",
         "Registered User (ยื่นอุทธรณ์), System Admin (ทบทวน)", "NFR02, NFR20 / Evaluation Appeals", "การทดสอบแจ้งข้อผิดพลาดและการส่งคำร้องอุทธรณ์", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ระบบแจ้งเตือนข้อผิดพลาดโปร่งใสไม่เมคคะแนน; ผู้ใช้กดส่งคำร้องอุทธรณ์ผลคะแนนได้จากทุกอุปกรณ์"),
         
        # Non-Functional Requirements
        ("NFR01", "ความปลอดภัยและการปกป้องข้อมูล", "NFR", "R1", "หมวด 6 (NFR01)", "ใช้งานร่วมกัน (Web & Mobile)",
         "ทุกบทบาท", "Identity, API Gateway, Secrets", "TLS 1.3, การสแกน AES-256, การตรวจสอบ Keychain", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "Web ใช้ HTTP-only Secure SameSite Cookies; Mobile ใช้ iOS Keychain / Android Keystore"),
        ("NFR02", "คุณภาพและความแม่นยำของการประเมินผล AI", "NFR", "R1", "หมวด 6 (NFR02)", "ระบบบริการหลังบ้าน (AI Backend)",
         "Guest, Registered User", "FastAPI Inference, Eval Worker", "เป้าหมาย Correlation >=0.70, MAE <=15/100", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ประมวลผลบนเซิร์ฟเวอร์กลาง ผลลัพธ์และเกณฑ์วัดเดียวกันไม่ว่าจะส่งคำตอบมาจาก Web หรือ Mobile"),
        ("NFR03", "ความง่ายในการใช้งานและความสำเร็จของภารกิจ", "NFR", "R1", "หมวด 6 (NFR03)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest, Registered User", "Web UI & Native Mobile UI", "SUS >=70, อัตราความสำเร็จของภารกิจ >=90%", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "โมบายแอปออกแบบตามหลัก Human Interface Guidelines (iOS) และ Material Design (Android)"),
        ("NFR04", "ประสิทธิภาพและเวลาตอบสนองของระบบ", "NFR", "R1", "หมวด 6 (NFR04)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest, Registered User", "NestJS API, BullMQ, Redis", "Web Non-AI P95 <=2s; Mobile Cellular <=2.5s; Feedback <=15s", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "กำหนดเป้าหมายเวลาตอบสนอง API บนสัญญาณมือถือ P95 <=2.5s และ Cold Start แอป <=2.0s"),
        ("NFR05", "ความพร้อมใช้งานของระบบ (Availability)", "NFR", "R1", "หมวด 6 (NFR05)", "โครงสร้างพื้นฐานระบบ (Infra)",
         "ทุกบทบาท", "Managed Production Infrastructure", "ความพร้อมใช้งานรายเดือน >=99.5%", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "โครงสร้างพื้นฐานเซิร์ฟเวอร์กลางรองรับทราฟฟิกรวมจากทั้ง Web และ Mobile ภายใต้ SLA เดียวกัน"),
        ("NFR06", "การควบคุมต้นทุนต่อหน่วยและการเงิน", "NFR", "R1", "หมวด 6 (NFR06)", "การดำเนินงานระบบ (Operations)",
         "Finance Admin, System Admin", "Observability, Token Accounting", "แดชบอร์ดวิเคราะห์ต้นทุน Token ต่อเซสชันการฝึก", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ติดตามและรวมต้นทุน API Token จากการใช้งานทุกแพลตฟอร์มเข้าสู่ระบบตรวจสอบเดียวกัน"),
        ("NFR07", "การรองรับภาษาท้องถิ่น (ไทย/อังกฤษ)", "NFR", "R1", "หมวด 6 (NFR07)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest, Registered User", "i18n Localization Engine", "ชุดทดสอบการแสดงผลสองภาษาและฟอนต์มาตรฐาน", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "รองรับภาษาไทยและอังกฤษอย่างสมบูรณ์ทั้งบน Web Application และ Native Mobile Application"),
        ("NFR08", "ความสามารถในการเข้าถึงและความสอดคล้องข้ามแพลตฟอร์ม", "NFR", "R1", "หมวด 6 (NFR08)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Guest, Registered User", "Web Frontend, iOS/Android Apps", "Web WCAG 2.2 AA, Mobile Screen Readers, ข้อมูลตรงกัน 100%", "ปรับปรุงใหม่", "เสนอปรับปรุง — รอการอนุมัติ",
         "ปรับปรุงข้อกำหนดแยก Web (WCAG), Mobile (VoiceOver/TalkBack) และการซิงค์ข้อมูลตรงกัน 100%"),
        ("NFR09", "การเก็บรักษาข้อมูลและวงจรชีวิตไฟล์เสียง", "NFR", "R1", "หมวด 6 (NFR09)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "MinIO Storage, Privacy Worker", "เสียงดิบไม่ยินยอมลบใน 24h; ยินยอมเก็บ <=90d; ลบบัญชี <=30d", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แคชไฟล์เสียงชั่วคราวบนเครื่องโทรศัพท์มือถือต้องถูกลบทันทีที่การอัปโหลดเสร็จสมบูรณ์"),
        ("NFR10", "ขอบเขตความปลอดภัยการชำระเงิน (PCI-DSS)", "NFR", "R3", "หมวด 6 (NFR10)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "Billing Context, Payment Gateway", "การตรวจสอบการไม่จัดเก็บข้อมูลบัตร (PAN/CVV) 100%", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ใช้ Hosted Gateway หรือ In-App Purchase; ห้ามไคลเอนต์จัดเก็บหรือส่งผ่านข้อมูลบัตรเด็ดขาด"),
        ("NFR11", "ความปลอดภัยในการทำธุรกรรมทางการเงิน", "NFR", "R3", "หมวด 6 (NFR11)", "ระบบบริการหลังบ้าน (Backend)",
         "Registered User, Finance Admin", "Billing Gateway Adapter", "การทดสอบ HMAC Signature Webhook และ Replay Defense", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ตรวจสอบความถูกต้องของธุรกรรมที่ฝั่งเซิร์ฟเวอร์เท่านั้น ไม่เชื่อถือสถานะจากไคลเอนต์"),
        ("NFR12", "การป้องกันคำขอซ้ำซ้อน (Idempotency)", "NFR", "R3", "หมวด 6 (NFR12)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "NestJS Platform Context", "การทดสอบส่งคำขอซ้ำด้วย Idempotency-Key", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ใช้ Idempotency-Key (UUIDv4) จากไคลเอนต์เพื่อรับประกันการประมวลผลธุรกรรมเพียงครั้งเดียว"),
        ("NFR13", "การแสดงสถานะและความโปร่งใสในการชำระเงิน", "NFR", "R3", "หมวด 6 (NFR13)", "ใช้งานร่วมกัน (Web & Mobile)",
         "Registered User", "Billing UI & Polling Service", "เวลา Redirect P95 <=5s; แสดงสถานะรอตรวจสอบชัดเจน", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "แสดงผลสถานะรอการยืนยันและการเปลี่ยนเส้นทางราบรื่นทั้งบน Web และ Mobile"),
        ("NFR14", "ความพร้อมใช้งานของระบบรับชำระเงิน", "NFR", "R3", "หมวด 6 (NFR14)", "ระบบบริการหลังบ้าน (Backend)",
         "Registered User, Finance Admin", "Billing Infrastructure", "การซักซ้อมรับมือเหตุการณ์ Gateway ภายนอกขัดข้อง", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "มีระบบบันทึกสถานะรอกู้คืนและระบบกระทบยอดธุรกรรมอัตโนมัติที่ศูนย์กลาง"),
        ("NFR15", "ความสามารถในการตรวจสอบย้อนหลังและการกระทบยอด", "NFR", "R3", "หมวด 6 (NFR15)", "เฉพาะบนเว็บเท่านั้น (Web Only)",
         "Finance Admin, System Admin", "Audit Context, Daily Reconciliation", "บันทึกประวัติ State Transition สำคัญ 100%", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "บันทึกแพลตฟอร์มต้นทางของคำขอ; หน้าจอรายงานผลกระทบยอดจำกัดเฉพาะบน Web Application"),
        ("NFR16", "การปฏิบัติตามกฎหมายและระเบียบภาษี", "NFR", "R3", "หมวด 6 (NFR16)", "ระบบบริการหลังบ้าน (Backend)",
         "Finance Admin, System Admin", "Billing Tax Engine", "การตรวจสอบความถูกต้องของเอกสารภาษีตามกฎหมาย", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ออกใบเสร็จรับเงินตามข้อกำหนดนิติบุคคล; โมบายแอปปฏิบัติตามกฎระเบียบของ App Store"),
        ("NFR17", "ความเป็นส่วนตัวและการรักษาความลับข้อมูลวิจัย", "NFR", "R3", "หมวด 6 (NFR17)", "เฉพาะบนเว็บเท่านั้น (Web Only)",
         "Researcher, System Admin", "Research Data Pipeline", "ขนาดกลุ่มตัวอย่าง Cell Size >=10; ตรวจสอบ Differencing", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "เครื่องมือสืบค้นและส่งออกข้อมูลวิจัยจำกัดเฉพาะบน Web Application เท่านั้น"),
        ("NFR18", "การแยกชั้นและควบคุมการเข้าถึงไฟล์เสียงดิบ", "NFR", "R2", "หมวด 6 (NFR18)", "ระบบบริการหลังบ้าน (Backend)",
         "Registered User, System Admin", "Private Object Storage", "ผู้วิจัยมีสิทธิ์เข้าถึงไฟล์เสียงดิบเป็น 0%", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "บล็อกการดาวน์โหลดไฟล์เสียงดิบสำหรับผู้วิจัยบนทุกแพลตฟอร์มอย่างเด็ดขาด"),
        ("NFR19", "การอนุญาตสิทธิ์และการป้องกัน IDOR", "NFR", "R1", "หมวด 6 (NFR19)", "ใช้งานร่วมกัน (Web & Mobile)",
         "ทุกบทบาท", "NestJS Guards, Prisma RLS", "ชุดทดสอบ Negative IDOR Suite อัตโนมัติ 100%", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ตรวจสอบสิทธิ์ที่เซิร์ฟเวอร์ทุกครั้ง ไคลเอนต์โมบายไม่เก็บตรรกะสิทธิ์ไว้ตัดสินใจเอง"),
        ("NFR20", "ความปลอดภัยของ LLM และการป้องกัน Prompt Injection", "NFR", "R1", "หมวด 6 (NFR20)", "ระบบบริการหลังบ้าน (AI Backend)",
         "Guest, Registered User", "FastAPI AI Service", "ชุดทดสอบ Red-Team Injection Prompts", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ตรวจสอบและกรองข้อความก่อนส่งเข้า LLM; ตรวจสอบ Schema ของผลลัพธ์ก่อนส่งกลับไปยังเครื่องผู้ใช้"),
        ("NFR21", "การกำกับดูแลเวอร์ชันโมเดล (Model Governance)", "NFR", "R1", "หมวด 6 (NFR21)", "ระบบบริการหลังบ้าน (AI Backend)",
         "System Admin", "AI Version Registry", "ชุดทดสอบ Benchmark ตรวจสอบย้อนหลังได้ 100%", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ผลการประเมินทุกรายการถูกผูกติดกับเวอร์ชันของ Model, Prompt และ Rubric ไว้อย่างถาวร"),
        ("NFR22", "ความสามารถในการขยายระบบและรองรับโหลดพร้อมกัน", "NFR", "R1", "หมวด 6 (NFR22)", "โครงสร้างพื้นฐานระบบ (Infra)",
         "ทุกบทบาท", "Core Infrastructure, Redis, Workers", "การทดสอบโหลด 100 Concurrent Active Users (Failure <=1%)", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "ทดสอบประสิทธิภาพรองรับผู้ใช้งานพร้อมกันทั้งที่มาจาก Web Browser และ Mobile Application"),
        ("NFR23", "การกู้คืนระบบจากภัยพิบัติและความยืดหยุ่นของข้อมูล", "NFR", "R1", "หมวด 6 (NFR23)", "ระบบบริการหลังบ้าน (Database)",
         "System Admin", "PostgreSQL Backups, Runbooks", "การซักซ้อมกู้คืนฐานข้อมูลรายไตรมาส (RPO <=24h, RTO <=8h)", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "สำรองข้อมูลสม่ำเสมอ ครอบคลุมข้อมูลของผู้ใช้ทุกแพลตฟอร์มอย่างครบถ้วน"),
        ("NFR24", "การตรวจสอบและสังเกตการณ์ระบบ (Observability)", "NFR", "R1", "หมวด 6 (NFR24)", "การดำเนินงานระบบ (Operations)",
         "System Admin", "OpenTelemetry, Logging, Metrics", "การตรวจสอบรหัสเชื่อมโยงคำขอ (Correlation ID) จากต้นทาง", "กำหนดคุณลักษณะแล้ว", "อนุมัติตาม Baseline v1.0",
         "รวบรวม Crash Logs จากโมบายแอปและ Correlation ID จาก API สู่ระบบแดชบอร์ดศูนย์กลาง")
    ]
    
    start_row = 5
    for i, row in enumerate(trace_data):
        r_idx = start_row + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=NAVY_HEADER, align="center")
            elif c_idx == 2:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, align="center")
            elif c_idx == 3:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=BLUE_ACCENT, align="center")
            elif c_idx == 5:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, align="center")
            elif c_idx == 10:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=12, align="left")
        ws.row_dimensions[r_idx].height = 38
        
    explicit_widths = {1: 14, 2: 36, 3: 12, 4: 15, 5: 16, 6: 28, 7: 28, 8: 34, 9: 34, 10: 18, 11: 28, 12: 48}
    auto_fit_columns(ws, 1, len(headers), explicit_widths=explicit_widths)
    wb.save(out_path)
    print(f"Generated Thai Requirement Traceability: {out_path}")

# Execute generators
out_dir = r"D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements"
build_decision_register_th(os.path.join(out_dir, "InterviewX_Phase1_Decision_Register_TH.xlsx"))
build_traceability_th(os.path.join(out_dir, "InterviewX_Phase1_Requirement_Traceability_TH.xlsx"))
