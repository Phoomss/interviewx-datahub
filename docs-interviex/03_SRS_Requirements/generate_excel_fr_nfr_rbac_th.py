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
    elif any(k in text for k in ["อนุมัติ", "ทำได้", "Approved", "Yes", "สอดคล้อง", "ใช้งานได้"]):
        cell.fill = PatternFill(start_color=STATUS_APPROVED_FILL, end_color=STATUS_APPROVED_FILL, fill_type="solid")
        cell.font = Font(name="TH Sarabun New", size=12, bold=True, color=STATUS_APPROVED_FONT)
    elif any(k in text for k in ["ข้อเสนอ", "เสนอปรับปรุง", "Proposed", "ร่าง", "ตามสิทธิ์"]):
        cell.fill = PatternFill(start_color=STATUS_PROPOSED_FILL, end_color=STATUS_PROPOSED_FILL, fill_type="solid")
        cell.font = Font(name="TH Sarabun New", size=12, bold=True, color=STATUS_PROPOSED_FONT)
    elif any(k in text for k in ["ไม่ได้", "ไม่อนุมัติ", "No", "Denied", "จำกัดเฉพาะ"]):
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

def build_aligned_fr_nfr_rbac_th(src_path, out_path):
    src_wb = openpyxl.load_workbook(src_path)
    wb = openpyxl.Workbook()
    wb.remove(wb.active) # Remove default sheet
    
    # -------------------------------------------------------------------------
    # 1. SHEET: FR - ข้อกำหนดเชิงหน้าที่
    # -------------------------------------------------------------------------
    ws_fr = wb.create_sheet(title="FR - ข้อกำหนดเชิงหน้าที่")
    src_fr = src_wb["FR"]
    for r in range(1, src_fr.max_row + 1):
        for c in range(1, src_fr.max_column + 1):
            val = src_fr.cell(row=r, column=c).value
            cell = ws_fr.cell(row=r, column=c, value=val)
            format_data_cell(cell, font_size=12)
            
    # Headers in Thai
    ws_fr.cell(row=12, column=1, value="รหัสข้อกำหนด (ID)")
    ws_fr.cell(row=12, column=2, value="ชื่อข้อกำหนด (Requirement Name)")
    ws_fr.cell(row=12, column=3, value="คำอธิบายข้อกำหนด (Description)")
    ws_fr.cell(row=12, column=4, value="ขอบเขตแพลตฟอร์ม (Platform Scope)")
    
    ws_fr.cell(row=36, column=1, value="รหัสข้อกำหนด (ID)")
    ws_fr.cell(row=36, column=2, value="ชื่อข้อกำหนด (Requirement Name)")
    ws_fr.cell(row=36, column=3, value="คำอธิบายข้อกำหนด (Description)")
    ws_fr.cell(row=36, column=4, value="ขอบเขตแพลตฟอร์ม (Platform Scope)")
    
    ws_fr.cell(row=54, column=1, value="รหัสข้อกำหนด (ID)")
    ws_fr.cell(row=54, column=2, value="ชื่อข้อกำหนด (Requirement Name)")
    ws_fr.cell(row=54, column=3, value="คำอธิบายข้อกำหนด (Description)")
    ws_fr.cell(row=54, column=4, value="ขอบเขตแพลตฟอร์ม (Platform Scope)")
    
    # Update FR15
    ws_fr.cell(row=20, column=2, value="การเข้าถึงข้ามแพลตฟอร์มและความสอดคล้องของระบบ (Multi-Platform Access & Consistency)")
    ws_fr.cell(row=20, column=3, value=(
        "รองรับการใช้งานผ่าน Responsive Web (คอมพิวเตอร์เดสก์ท็อป แท็บเล็ต และเว็บเบราว์เซอร์บนมือถือ) และแอปพลิเคชันบนอุปกรณ์เคลื่อนที่แบบเนทีฟ "
        "(Native Mobile Application: iOS / Android) สำหรับกลุ่มผู้ใช้งานทั่วไป (Guest, Registered User) โดยใช้ระบบบัญชีผู้ใช้และส่วนบริการหลังบ้าน "
        "(Backend API) ร่วมกัน พร้อมการเชื่อมโยงและประสานข้อมูลแบบเรียลไทม์ (Cross-Platform Data Synchronization) และจำกัดการเข้าถึงฟังก์ชันผู้ดูแลระบบและงานวิจัย "
        "(Admin / Researcher) เฉพาะบน Web Application เท่านั้น"
    ))
    
    fr_platform_map_th = {
        13: "ใช้งานร่วมกันทั้ง Web และ Mobile", 14: "ใช้งานร่วมกันทั้ง Web และ Mobile", 15: "ใช้งานร่วมกันทั้ง Web และ Mobile",
        16: "ใช้งานร่วมกันทั้ง Web และ Mobile", 17: "ใช้งานร่วมกันทั้ง Web และ Mobile", 18: "ใช้งานร่วมกันทั้ง Web และ Mobile",
        19: "ใช้งานร่วมกันทั้ง Web และ Mobile", 20: "ใช้งานร่วมกันทั้ง Web และ Mobile", 21: "ใช้งานร่วมกันทั้ง Web และ Mobile",
        22: "เฉพาะบนเว็บเท่านั้น (Admin Only)", 23: "ใช้งานร่วมกันทั้ง Web และ Mobile", 24: "เฉพาะบนเว็บเท่านั้น (Admin Console)",
        25: "ใช้งานร่วมกัน (ผู้ใช้ทั่วไป) / เฉพาะเว็บ (ผู้ดูแลระบบ)", 26: "ใช้งานร่วมกัน (ผู้ใช้ทั่วไป) / เฉพาะเว็บ (ผู้ดูแลระบบ)",
        37: "ใช้งานร่วมกันทั้ง Web และ Mobile", 38: "ใช้งานร่วมกันทั้ง Web และ Mobile", 39: "ใช้งานร่วมกันทั้ง Web และ Mobile",
        40: "ใช้งานร่วมกันทั้ง Web และ Mobile", 41: "ใช้งานร่วมกันทั้ง Web และ Mobile", 42: "ใช้งานร่วมกันทั้ง Web และ Mobile",
        43: "ใช้งานร่วมกันทั้ง Web และ Mobile", 44: "ใช้งานร่วมกันทั้ง Web และ Mobile", 45: "ใช้งานร่วมกันทั้ง Web และ Mobile",
        46: "ใช้งานร่วมกันทั้ง Web และ Mobile",
        55: "ใช้งานร่วมกันทั้ง Web และ Mobile", 56: "เฉพาะบนเว็บเท่านั้น (Admin / Researcher)", 57: "ใช้งานร่วมกันทั้ง Web และ Mobile",
        58: "ใช้งานร่วมกันทั้ง Web และ Mobile", 59: "ใช้งานร่วมกันทั้ง Web และ Mobile", 60: "ใช้งานร่วมกันทั้ง Web และ Mobile (รอตัดสินใจ D-M04)",
        61: "ส่วนบริการหลังบ้านร่วมกัน (Shared Backend)", 62: "ใช้งานร่วมกันทั้ง Web และ Mobile", 63: "ส่วนบริการหลังบ้านร่วมกัน (Shared Backend)",
        64: "ใช้งานร่วมกันทั้ง Web และ Mobile", 65: "ใช้งานร่วมกัน (ผู้ใช้ทั่วไป) / เฉพาะเว็บ (ผู้ดูแลระบบ)", 66: "ใช้งานร่วมกันทั้ง Web และ Mobile (รอตัดสินใจ D-M05)",
        67: "ใช้งานร่วมกันทั้ง Web และ Mobile", 68: "เฉพาะบนเว็บเท่านั้น (Admin Only)", 69: "เฉพาะบนเว็บเท่านั้น (Admin Only)",
        70: "เฉพาะบนเว็บเท่านั้น (Admin / Researcher)"
    }
    for r_idx, scope in fr_platform_map_th.items():
        cell = ws_fr.cell(row=r_idx, column=4, value=scope)
        format_data_cell(cell, is_zebra=False, font_size=12, bold=True, align="center")
        
    style_header_row(ws_fr, 1, 3, fill=header_fill, height=28)
    style_header_row(ws_fr, 12, 4, fill=sub_header_fill, height=28)
    style_header_row(ws_fr, 36, 4, fill=sub_header_fill, height=28)
    style_header_row(ws_fr, 54, 4, fill=sub_header_fill, height=28)
    auto_fit_columns(ws_fr, 1, 4, explicit_widths={1: 14, 2: 40, 3: 65, 4: 32})

    # -------------------------------------------------------------------------
    # 2. SHEET: NFR - ข้อกำหนดไม่ใช่เชิงหน้าที่
    # -------------------------------------------------------------------------
    ws_nfr = wb.create_sheet(title="NFR - ข้อกำหนดไม่ใช่เชิงหน้าที่")
    src_nfr = src_wb["NFR"]
    for r in range(1, src_nfr.max_row + 1):
        for c in range(1, src_nfr.max_column + 1):
            val = src_nfr.cell(row=r, column=c).value
            cell = ws_nfr.cell(row=r, column=c, value=val)
            format_data_cell(cell, font_size=12)
            
    header_title_nfr = "เป้าหมายแพลตฟอร์มและข้อพิจารณาบนอุปกรณ์เคลื่อนที่ (Platform Target & Mobile Considerations)"
    for h_row in [3, 14, 21, 33, 41]:
        ws_nfr.cell(row=h_row, column=1, value="รหัสข้อกำหนด (ID)")
        ws_nfr.cell(row=h_row, column=2, value="หัวข้อข้อกำหนด (Topic)")
        ws_nfr.cell(row=h_row, column=3, value="สรุปสาระสำคัญของข้อกำหนด (Summary)")
        ws_nfr.cell(row=h_row, column=4, value=header_title_nfr)
    
    # Update NFR08
    ws_nfr.cell(row=36, column=2, value="การเข้าถึงได้อย่างเท่าเทียมและความสอดคล้องข้ามแพลตฟอร์ม (Cross-Platform Accessibility & Consistency)")
    ws_nfr.cell(row=36, column=3, value=(
        "รองรับการเข้าถึงตามมาตรฐาน WCAG 2.2 ระดับ AA สำหรับ Web Application และรองรับเทคโนโลยีสิ่งอำนวยความสะดวกบนอุปกรณ์เคลื่อนที่ "
        "(iOS VoiceOver/Dynamic Type, Android TalkBack) พร้อมทั้งรับประกันความสอดคล้องและความถูกต้องของข้อมูลบัญชีผู้ใช้ ประวัติการสัมภาษณ์ "
        "และสิทธิประโยชน์ตามแพ็กเกจ (Subscription Entitlement) ข้ามแพลตฟอร์ม 100% (ข้อเสนอใหม่ — รอการอนุมัติ)"
    ))
    
    nfr_platform_notes_th = {
        4: "ใช้งานร่วมกัน: Web จัดเก็บใน HTTP-only cookies; Mobile จัดเก็บใน Secure Hardware (iOS Keychain / Android Keystore) (NFR01)",
        5: "ใช้งานร่วมกัน: ล้างแคชไฟล์เสียงบนเครื่องมือถือทันทีหลังอัปโหลดเสร็จ หรือจำกัดอายุไม่เกิน 24 ชั่วโมง (NFR09)",
        6: "เฉพาะบนเว็บเท่านั้น: ระบบสืบค้นและส่งออกชุดข้อมูลวิจัยแบบ Differential Privacy จำกัดเฉพาะบนเว็บเพื่อความปลอดภัย (NFR17)",
        7: "ใช้งานร่วมกัน: Private Object Storage บล็อกการดาวน์โหลดไฟล์เสียงดิบสำหรับผู้วิจัยบนทุกไคลเอนต์ (NFR18)",
        8: "ใช้งานร่วมกัน: บังคับใช้การตรวจสอบสิทธิ์ RBAC และป้องกัน IDOR ที่ฝั่ง Backend API 100% ไม่เชื่อถือไคลเอนต์ (NFR19)",
        9: "ใช้งานร่วมกัน: สกัดกั้นและตรวจสอบ Prompt Injection ที่ฝั่งเซิร์ฟเวอร์ก่อนส่งต่อไปยังโมเดล AI (NFR20)",
        15: "AI ร่วมกัน: การประเมินคะแนนด้วยเกณฑ์รูบริกดำเนินการที่เซิร์ฟเวอร์ ใช้มาตรฐานเดียวกันทั้ง Web และ Mobile (NFR02)",
        16: "AI ร่วมกัน: ตรึงเวอร์ชันของเกณฑ์รูบริก พรอมต์ และโมเดล AI บนเซิร์ฟเวอร์แบบ Immutable (NFR21)",
        22: "ใช้งานร่วมกัน: การตอบสนอง Non-AI P95 <= 2s บนเว็บ และ P95 <= 2.5s บนเครือข่ายมือถือ; ผลวิเคราะห์ AI P95 <= 15s (NFR04)",
        23: "ส่วนบริการหลังบ้านร่วมกัน: ความพร้อมใช้งานของระบบ (Availability) >= 99.5% ครอบคลุม Unified API Gateway (NFR05)",
        24: "ใช้งานร่วมกัน: การส่งต่อไปยังระบบชำระเงิน P95 <= 5s ทั้งบนเว็บและมือถือ (NFR13)",
        25: "ใช้งานร่วมกัน: ความพร้อมใช้งานของระบบชำระเงินและการสลับระบบสำรองบริหารจัดการจากศูนย์กลาง (NFR14)",
        26: "ใช้งานร่วมกัน: ทดสอบโหลดพร้อมกัน (Concurrency Load Test) 100 ผู้ใช้ ครอบคลุมทั้ง Web และ Mobile (NFR22)",
        27: "ส่วนบริการหลังบ้านร่วมกัน: การกู้คืนระบบจากภัยพิบัติ (RPO <= 24h, RTO <= 8h) ครอบคลุมข้อมูลผู้ใช้จากทุกแพลตฟอร์ม (NFR23)",
        28: "ใช้งานร่วมกัน: ระบบสืบค้น Correlation ID เชื่อมโยงคำขอจากทั้ง Web Browser และ Native Mobile เข้าสู่ศูนย์กลาง (NFR24)",
        34: "ใช้งานร่วมกัน: ค่าความพึงพอใจการใช้งาน (SUS) >= 70 บนส่วนติดต่อผู้ใช้ทั้ง Web และ Mobile (NFR03)",
        35: "ใช้งานร่วมกัน: รองรับภาษาไทยและภาษาอังกฤษอย่างสมบูรณ์แบบทั้งบน Web และ Mobile (NFR07)",
        36: "ใช้งานร่วมกัน: รองรับ WCAG 2.2 AA (เว็บ), HIG / TalkBack (มือถือ) พร้อมซิงก์ข้อมูลข้ามแพลตฟอร์ม 100% (NFR08)",
        42: "ใช้งานร่วมกัน: ติดตามและคำนวณต้นทุนการใช้งาน AI ต่อเซสชันแบบรวมศูนย์ทั้งจากเว็บและมือถือ (NFR06)",
        43: "ใช้งานร่วมกัน: ประมวลผลการชำระเงินผ่าน Hosted Gateway หรือ In-App Purchase โดยไม่บันทึก PAN/CVV บนอุปกรณ์เด็ดขาด (NFR10)",
        44: "ใช้งานร่วมกัน: ตรวจสอบ HMAC Webhook และป้องกัน Replay Attack บนเซิร์ฟเวอร์หลังบ้าน (NFR11)",
        45: "ใช้งานร่วมกัน: ใช้ Idempotency Key ป้องกันการส่งข้อมูลซ้ำซ้อนกรณีสัญญาณมือถือขาดหาย (NFR12)",
        46: "เฉพาะบนเว็บเท่านั้น: หน้าจอตรวจสอบประวัติการทำธุรกรรม (Audit Trail Viewer) สงวนไว้เฉพาะบน Web Application (NFR15)",
        47: "ใช้งานร่วมกัน: ระบบออกใบเสร็จรับเงินทางภาษีดำเนินการที่หลังบ้าน; แอปมือถือปฏิบัติตามกฎของ App Store (NFR16)"
    }
    for r_idx, note in nfr_platform_notes_th.items():
        cell = ws_nfr.cell(row=r_idx, column=4, value=note)
        format_data_cell(cell, is_zebra=False, font_size=11, align="left")
        
    style_header_row(ws_nfr, 3, 4, fill=sub_header_fill, height=28)
    style_header_row(ws_nfr, 14, 4, fill=sub_header_fill, height=28)
    style_header_row(ws_nfr, 21, 4, fill=sub_header_fill, height=28)
    style_header_row(ws_nfr, 33, 4, fill=sub_header_fill, height=28)
    style_header_row(ws_nfr, 41, 4, fill=sub_header_fill, height=28)
    auto_fit_columns(ws_nfr, 1, 4, explicit_widths={1: 14, 2: 34, 3: 56, 4: 56})

    # -------------------------------------------------------------------------
    # 3. SHEET: RBAC - การกำหนดสิทธิ์ผู้ใช้
    # -------------------------------------------------------------------------
    ws_rbac = wb.create_sheet(title="RBAC - การกำหนดสิทธิ์ผู้ใช้")
    src_rbac = src_wb["RBAC"]
    for r in range(1, src_rbac.max_row + 1):
        for c in range(1, src_rbac.max_column + 1):
            val = src_rbac.cell(row=r, column=c).value
            cell = ws_rbac.cell(row=r, column=c, value=val)
            format_data_cell(cell, font_size=12)
            
    ws_rbac.cell(row=1, column=1, value="ข้อกำหนดเชิงหน้าที่ (Functional Requirement)")
    ws_rbac.cell(row=1, column=2, value="Guest (ผู้เยี่ยมชม)")
    ws_rbac.cell(row=1, column=3, value="Registered User (ผู้ใช้ทั่วไป)")
    ws_rbac.cell(row=1, column=4, value="Researcher (ผู้วิจัย)")
    ws_rbac.cell(row=1, column=5, value="Payment / Finance Admin (ผู้ดูแลการเงิน)")
    ws_rbac.cell(row=1, column=6, value="System Admin (ผู้ดูแลระบบ)")
    ws_rbac.cell(row=1, column=8, value="คำอธิบายสิทธิ์และเงื่อนไข (Legend / Condition Details)")
    
    ws_rbac.cell(row=18, column=1, value="FR15 การเข้าถึงข้ามแพลตฟอร์ม (Multi-Platform Access)")
    ws_rbac.cell(row=18, column=2, value="ทำได้ (Web & Mobile)")
    ws_rbac.cell(row=18, column=3, value="ทำได้ (Web & Mobile)")
    ws_rbac.cell(row=18, column=4, value="มีเงื่อนไข (Web Only)")
    ws_rbac.cell(row=18, column=5, value="มีเงื่อนไข (Web Only)")
    ws_rbac.cell(row=18, column=6, value="มีเงื่อนไข (Web Only)")
    ws_rbac.cell(row=18, column=8, value="ข้อจำกัดแพลตฟอร์ม: Role ผู้ดูแลระบบและวิจัย (Researcher, Finance Admin, System Admin) เข้าใช้งานได้เฉพาะ Web Application เท่านั้น โดย Native Mobile Application จำกัดเฉพาะ End Users (Guest, Registered User)")
    
    style_header_row(ws_rbac, 1, 8, fill=header_fill, height=32)
    auto_fit_columns(ws_rbac, 1, 8, explicit_widths={1: 34, 2: 20, 3: 20, 4: 20, 5: 22, 6: 20, 7: 6, 8: 50})

    # -------------------------------------------------------------------------
    # 4. SHEET: ตารางการเข้าถึงแพลตฟอร์ม (Platform_Access_Matrix)
    # -------------------------------------------------------------------------
    ws_pam = wb.create_sheet(title="ตารางการเข้าถึงแพลตฟอร์ม")
    ws_pam.merge_cells("A1:E1")
    t_pam = ws_pam["A1"]
    t_pam.value = "InterviewX — ตารางการเข้าถึงแพลตฟอร์มตามบทบาทความปลอดภัย (Platform Access Matrix: Role × Platform)"
    t_pam.font = Font(name="TH Sarabun New", size=16, bold=True, color="FFFFFF")
    t_pam.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_pam.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_pam.row_dimensions[1].height = 36
    
    pam_headers = [
        "บทบาทความปลอดภัย (Security Role)", "เว็บแอปพลิเคชัน (Web Application)",
        "แอปพลิเคชันมือถือเนทีฟ (Native Mobile: iOS / Android)", "ขอบเขตการใช้งานและขอบเขตทางเทคนิค (Platform Scope & Operational Boundary)", "สถานะการอนุญาต (Authorization Status)"
    ]
    ws_pam.append([])
    ws_pam.append(pam_headers)
    style_header_row(ws_pam, 3, len(pam_headers), height=28)
    
    pam_rows = [
        ("Guest (ผู้เยี่ยมชม)", "ทำได้", "ทำได้",
         "เข้าถึงหน้าหลักสาธารณะ (Landing Page), หน้าจอแนะนำการใช้งาน (Onboarding), สำรวจหมวดหมู่สัมภาษณ์ และทดลองทำข้อสอบตัวอย่าง 1 ข้อ (Trial Session) หากเปิดใช้งาน; ไม่สามารถเข้าถึงประวัติส่วนตัว บันทึกโปรไฟล์ หรือซื้อแพ็กเกจได้จนกว่าจะลงทะเบียน",
         "อนุมัติตาม Baseline v1.0"),
        ("Registered User (ผู้ใช้ทั่วไป)", "ทำได้", "ทำได้",
         "เข้าถึงฟังก์ชันฝึกสัมภาษณ์เต็มรูปแบบ (ข้อความและเสียง), ประวัติการสัมภาษณ์ส่วนบุคคล, ผลประเมินและข้อเสนอแนะ AI, แดชบอร์ดสรุปผล, ตั้งค่าโปรไฟล์, จัดการความยินยอม PDPA และตรวจสอบสิทธิ์แพ็กเกจ ตรวจสอบสิทธิ์ผ่าน Unified JWT",
         "อนุมัติตาม Baseline v1.0"),
        ("Researcher (ผู้วิจัย)", "ทำได้", "ไม่ได้",
         "เข้าถึงชุดข้อมูลวิจัยรวมที่ได้รับอนุมัติ เครื่องมือสืบค้น และการส่งออกข้อมูลแบบคงความเป็นส่วนตัว (Differential Privacy); นอกขอบเขตของ Native Mobile โดยเด็ดขาด เพื่อป้องกันการรั่วไหลของข้อมูลวิจัยบนอุปกรณ์พกพา",
         "อนุมัติตาม Baseline v1.0"),
        ("Payment / Finance Admin (ผู้ดูแลการเงิน)", "ทำได้", "ไม่ได้",
         "เข้าถึงแดชบอร์ดการเงิน บัญชีแยกประเภทธุรกรรม การตรวจสอบคำขอคืนเงิน การอนุมัติและประมวลผลการคืนเงิน และจัดการแคตตาล็อกแพ็กเกจ; จำกัดเฉพาะบน Web Application เท่านั้นเพื่อความปลอดภัยขั้นสูงสุดในการบริหารการเงิน",
         "อนุมัติตาม Baseline v1.0"),
        ("System Admin (ผู้ดูแลระบบ)", "ทำได้", "ไม่ได้",
         "บริหารจัดการระบบส่วนกลาง คลังคำถามสัมภาษณ์ เวอร์ชันเกณฑ์รูบริกและพรอมต์ AI กำหนดค่าพารามิเตอร์โมเดล มอบหมายสิทธิ์ผู้ใช้ และตรวจสอบ Audit Logs ที่ไม่สามารถแก้ไขได้; จำกัดเฉพาะบน Web Application เท่านั้น",
         "อนุมัติตาม Baseline v1.0")
    ]
    for i, row in enumerate(pam_rows):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_pam.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=NAVY_HEADER, align="left")
            elif c_idx in (1, 2):
                style_status_cell(cell, val)
            elif c_idx == 4:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=12, align="left")
        ws_pam.row_dimensions[r_idx].height = 42
    auto_fit_columns(ws_pam, 1, 5, explicit_widths={1: 26, 2: 24, 3: 26, 4: 58, 5: 24})

    # -------------------------------------------------------------------------
    # 5. SHEET: ตารางสิทธิ์ตามแพ็กเกจ (Subscription_Matrix)
    # -------------------------------------------------------------------------
    ws_sub = wb.create_sheet(title="ตารางสิทธิ์ตามแพ็กเกจ")
    ws_sub.merge_cells("A1:E1")
    t_sub = ws_sub["A1"]
    t_sub.value = "InterviewX — ตารางสิทธิ์การใช้งานตามระดับแพ็กเกจสมาชิก (Subscription Entitlement Matrix: Tier × Platform)"
    t_sub.font = Font(name="TH Sarabun New", size=16, bold=True, color="FFFFFF")
    t_sub.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_sub.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_sub.row_dimensions[1].height = 36
    
    sub_headers = [
        "ระดับแพ็กเกจสมาชิก (Subscription Tier)", "การใช้งานบน Web Application", "การใช้งานบน Native Mobile",
        "สิทธิประโยชน์และโควตาการใช้งานที่เสนอ (Feature Entitlements & Proposed Quotas)", "กลไกการบังคับใช้สิทธิ์ (Enforcement Mechanism)"
    ]
    ws_sub.append([])
    ws_sub.append(sub_headers)
    style_header_row(ws_sub, 3, len(sub_headers), height=28)
    
    sub_rows = [
        ("แพ็กเกจฟรี (Free Tier)", "ใช้งานได้ตามสิทธิ์", "ใช้งานได้ตามสิทธิ์",
         "ข้อเสนอพื้นฐาน: ฝึกสัมภาษณ์แบบข้อความ 5 เซสชัน/เดือน (รอผลตัดสินใจ D05), 1 หมวดหมู่สัมภาษณ์หลัก, ประเมินด้วยรูบริกมาตรฐาน AI, ไม่รองรับเซสชันเสียง (0 เซสชัน), ประวัติย้อนหลังตามระยะเวลามาตรฐาน, ไม่ต้องผูกบัตรเครดิต",
         "ระบบบันทึกธุรกรรมแบบ Atomic ฝั่งหลังบ้าน (USAGE_LEDGER) ซิงก์ข้อมูลข้ามทุกอุปกรณ์"),
        ("แพ็กเกจเบสิก (Basic Tier)", "ใช้งานได้ตามสิทธิ์", "ใช้งานได้ตามสิทธิ์",
         "ข้อเสนอพื้นฐาน: สัมภาษณ์แบบข้อความ 30 เซสชัน/เดือน, สัมภาษณ์แบบเสียง 10 เซสชัน/เดือน (ข้อเสนอใหม่), ครอบคลุมทุกหมวดหมู่สัมภาษณ์, วิเคราะห์ไวยากรณ์ภาษาอังกฤษเบื้องต้น, แดชบอร์ดติดตามพัฒนาการ, การสนับสนุนมาตรฐาน",
         "ระบบตรวจสอบโควตาแบบ Atomic ฝั่ง Backend ตรวจสอบสิทธิ์ขณะเริ่มต้นสร้างเซสชันผ่าน API"),
        ("แพ็กเกจโปร (Pro Tier)", "ใช้งานได้ตามสิทธิ์", "ใช้งานได้ตามสิทธิ์",
         "ข้อเสนอพื้นฐาน: สัมภาษณ์แบบข้อความไม่จำกัด (ภายใต้นโยบาย Fair-Use Throttle), สัมภาษณ์แบบเสียงไม่จำกัด, วิเคราะห์ความเร็วและจังหวะการพูดขั้นสูง, จำลองการสัมภาษณ์แบบกดดันระดับสูง, คิวประมวลผล AI ลำดับความสำคัญพิเศษ",
         "ตรวจสอบโควตาแบบ Atomic ร่วมกับ Rate-Limiter นโยบาย Fair Use บนเซิร์ฟเวอร์ กฎเดียวกันทั้ง Web และ Mobile")
    ]
    for i, row in enumerate(sub_rows):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_sub.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=BLUE_ACCENT, align="center")
            elif c_idx in (1, 2):
                format_data_cell(cell, is_zebra, font_size=12, bold=True, align="center")
            else:
                format_data_cell(cell, is_zebra, font_size=12, align="left")
        ws_sub.row_dimensions[r_idx].height = 42

    ws_sub.cell(row=8, column=1, value="กฎเกณฑ์การควบคุมสิทธิ์ 7 ประการ (Core Authorization Rules):").font = Font(name="TH Sarabun New", size=13, bold=True, color=NAVY_HEADER)
    rules_th = [
        ("กฎข้อที่ 1: แพลตฟอร์มไม่ใช่สิ่งทดแทนบทบาท (Platform does not replace Role)", "แอปพลิเคชันส่วนหน้า (Web vs. Native Mobile) มีหน้าที่เพียงนำเสนอส่วนติดต่อผู้ใช้ ไม่ใช่ตัวกำหนดสิทธิ์ บทบาทความปลอดภัยของผู้ใช้ (Guest, User, Researcher, Admin) ถูกควบคุมโดย Authorization Token ของระบบหลังบ้านอย่างเป็นอิสระจากอุปกรณ์"),
        ("กฎข้อที่ 2: สิทธิ์แพ็กเกจไม่ใช่สิ่งทดแทนบทบาทความปลอดภัย (Subscription does not replace Role)", "ระดับแพ็กเกจ Free, Basic และ Pro เป็นเพียงการกำหนดค่าสิทธิประโยชน์ทางธุรกิจและโควตาการใช้งาน ไม่ใช่ Security Role ผู้ใช้ทุกคนมีบทบาทความปลอดภัยเดียวกันคือ 'Registered User' โดยแพ็กเกจมอบโควตา แต่ไม่ได้เพิ่มสิทธิ์การเข้าถึงระบบ"),
        ("กฎข้อที่ 3: ขอบเขตการเข้าถึงของผู้เยี่ยมชม (Guest access boundary)", "ผู้เยี่ยมชม (Guest) ที่ยังไม่ได้พิสูจน์ตัวตนจะไม่สามารถเข้าถึงทรัพยากรเฉพาะบุคคล ประวัติการใช้งาน หรือข้อมูลโปรไฟล์ได้จนกว่าจะลงทะเบียนและเข้าสู่ระบบสำเร็จ"),
        ("กฎข้อที่ 4: การบังคับใช้ความเป็นเจ้าของทรัพยากร (Resource ownership enforcement)", "ผู้ใช้ทั่วไปมีสิทธิ์เข้าถึงเฉพาะทรัพยากรที่ตนเองเป็นเจ้าของอย่างชัดเจนเท่านั้น (เซสชัน, คำตอบ, ฟีดแบ็ก, ข้อมูลส่วนตัว, ประวัติการชำระเงิน) คำขอข้ามบัญชี (IDOR) จะถูกปฏิเสธที่ฝั่งเซิร์ฟเวอร์ทันที (403/404)"),
        ("กฎข้อที่ 5: การตรวจสอบสิทธิ์ที่ระบบบริการหลังบ้าน (Backend-enforced entitlements)", "การเปิดใช้งานฟีเจอร์ โควตาเซสชัน และขีดจำกัดการใช้งาน ต้องได้รับการตรวจสอบแบบ Atomic บน Backend API ก่อนการสร้างทรัพยากรเสมอ สถานะบนเครื่องผู้ใช้ถือว่าไม่มีอำนาจตัดสินใจเด็ดขาด"),
        ("กฎข้อที่ 6: การตรวจสอบสิทธิ์ระดับ API อย่างครอบคลุม (Comprehensive API authorization)", "ทุก API Endpoint ต้องบังคับใช้การตรวจสอบตัวตน (Authentication), การตรวจสอบบทบาท (Role Verification), การตรวจสอบความเป็นเจ้าของ (Ownership Check) และการตรวจสอบความยินยอม (Consent Validation) ในทุกคำขอ"),
        ("กฎข้อที่ 7: การป้องกันเชิงลึก - ความปลอดภัยไม่ได้อยู่ที่ UI (Defense in Depth - No UI-only security)", "การซ่อนปุ่มหรือปิดการทำงานของ UI บน Web หรือ Mobile ไม่ถือเป็นการรักษาความปลอดภัย API Gateway และบริการหลังบ้านจะปฏิเสธคำขอที่ไม่ได้รับอนุญาตเสมอโดยไม่สนใจสถานะของหน้าจอ")
    ]
    for i, (r_title, r_desc) in enumerate(rules_th):
        r_idx = 9 + i
        ws_sub.cell(row=r_idx, column=1, value=r_title).font = Font(name="TH Sarabun New", size=12, bold=True, color="0F172A")
        ws_sub.merge_cells(start_row=r_idx, start_column=2, end_row=r_idx, end_column=5)
        cell_desc = ws_sub.cell(row=r_idx, column=2, value=r_desc)
        format_data_cell(cell_desc, is_zebra=(i%2==1), font_size=12, align="left")
        ws_sub.row_dimensions[r_idx].height = 28
    auto_fit_columns(ws_sub, 1, 5, explicit_widths={1: 28, 2: 24, 3: 24, 4: 52, 5: 38})

    # -------------------------------------------------------------------------
    # 6. SHEET: ขอบเขตแอปพลิเคชันมือถือ (Mobile_Scope)
    # -------------------------------------------------------------------------
    ws_ms = wb.create_sheet(title="ขอบเขตแอปพลิเคชันมือถือ")
    ws_ms.merge_cells("A1:E1")
    t_ms = ws_ms["A1"]
    t_ms.value = "InterviewX — ขอบเขตความรับผิดชอบของแอปพลิเคชันบนอุปกรณ์เคลื่อนที่แบบเนทีฟ (Native Mobile Functional Scope)"
    t_ms.font = Font(name="TH Sarabun New", size=16, bold=True, color="FFFFFF")
    t_ms.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_ms.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_ms.row_dimensions[1].height = 36
    
    ms_headers = ["หมวดหมู่ (Category)", "ชื่อโมดูล (Module Name)", "ข้อกำหนดที่เกี่ยวข้อง (Mapped FRs)", "รายละเอียดขอบเขตการทำงาน (Functional Scope Description)", "สถานะขอบเขต (Scope Classification)"]
    ws_ms.append([])
    ws_ms.append(ms_headers)
    style_header_row(ws_ms, 3, len(ms_headers), height=28)
    
    in_scope_modules_th = [
        ("อยู่ในขอบเขต (In-Scope)", "1. การตรวจสอบสิทธิ์ (Authentication)", "FR01", "การตรวจสอบสิทธิ์ด้วย JWT โทเค็น, ล็อกอิน/ล็อกเอาต์อย่างปลอดภัย, รีเซ็ตรหัสผ่าน, รีเฟรชโทเค็นผ่าน iOS Keychain / Android Keystore", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "2. การเข้าถึงสำหรับผู้เยี่ยมชม (Guest Access)", "FR01, FR04, FR05", "การเข้าชมระบบสำหรับผู้เยี่ยมชม, แนะนำคุณสมบัติระบบ และทดลองทำข้อสอบตัวอย่าง พร้อมระบบแนะนำให้สมัครสมาชิก", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "3. การลงทะเบียนและเข้าสู่ระบบ (Registration & Login)", "FR01", "สมัครสมาชิกด้วยอีเมล พร้อมขั้นตอนยืนยันผ่านลิงก์อีเมล, เข้าสู่ระบบด้วยรหัสผ่าน และกระบวนการกู้คืนรหัสผ่าน", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "4. การเริ่มต้นใช้งานระบบ (Onboarding)", "FR02", "หน้าจอต้อนรับและแนะนำระบบ, เลือกสถานะการทำงานปัจจุบัน, กำหนดเป้าหมายการฝึกซ้อม พร้อมตัวเลือกข้ามขั้นตอน", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "5. โปรไฟล์ผู้ใช้งาน (User Profile)", "FR02", "ดูและอัปเดตชื่อที่แสดง, ตำแหน่งงานเป้าหมาย และระดับทักษะความชำนาญ (เริ่มต้น/ปานกลาง/ก้าวหน้า)", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "6. การตั้งค่าการสัมภาษณ์ (Interview Setup)", "FR03, FR04, FR16", "กำหนดค่าเซสชันสัมภาษณ์: เลือกหมวดหมู่, รูปแบบการฝึก (ข้อความ/เสียง), ระดับความยาก และจำนวนคำถาม", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "7. ห้องจำลองการสัมภาษณ์ (Interview Room)", "FR04, FR06, FR33", "ส่วนติดต่อผู้ใช้ขณะทำสัมภาษณ์, แสดงโจทย์คำถาม, ตัวนับเวลาถอยหลัง และปุ่มออกจากโหมดกดดันตามความสมัครใจ", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "8. การสัมภาษณ์แบบข้อความ (Text-based Interview)", "FR05", "กล่องพิมพ์คำตอบแบบหลายบรรทัด, บันทึกฉบับร่างอัตโนมัติ, ส่งคำตอบพร้อม Idempotency Key และปุ่มลองใหม่เมื่อเน็ตหลุด", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "9. การสัมภาษณ์แบบเสียง (Voice-based Interview)", "FR05-V, FR05.1", "บันทึกเสียงผ่านไมโครโฟน, แสดงคลื่นเสียง (Waveform Visualizer), อัปโหลดไฟล์เสียงชั่วคราวผ่าน Signed URL, ตรวจสอบข้อความ STT", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "10. การประเมินผลโดย AI (AI Evaluation)", "FR07, FR08, FR19", "แสดงสถานะการประมวลผลการประเมินแบบอะซิงโครนัส พร้อมตัวแสดงความคืบหน้า (Progress Indicator)", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "11. ผลการประเมินและข้อเสนอแนะ (Evaluation Results & Feedback)", "FR09, FR10, FR17, FR20", "แสดงคะแนนแยกตามรูบริก, จุดแข็ง/จุดควรพัฒนา, คำแนะนำปรับปรุงคำตอบ และปุ่มยื่นอุทธรณ์ผลประเมิน", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "12. แดชบอร์ดสรุปผล (Dashboard)", "FR11", "สรุปสถิติคะแนนเฉลี่ย, จำนวนเซสชันที่ฝึกซ้อมสำเร็จ, กราฟแนวโน้มพัฒนาการ และคำแนะนำการฝึกซ้อมถัดไป", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "13. ประวัติการสัมภาษณ์ (Interview History)", "FR12", "รายการเซสชันที่เคยฝึกซ้อมแบบแบ่งหน้า, กรองตามหมวดหมู่และรูปแบบ, ดูฟีดแบ็กย้อนหลัง และตัวเลือกลบประวัติ", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "14. ข้อมูลแพ็กเกจสมาชิก (Subscription Information)", "FR13, FR27 (รอ D-M04)", "ดูสถานะแพ็กเกจปัจจุบัน, โควตาคงเหลือรายเดือน และลิงก์อัปเกรดแพ็กเกจ (ผ่าน Web Checkout หรือ In-App Purchase)", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "15. การจัดการความยินยอมและความเป็นส่วนตัว (Consent & Privacy)", "FR18, FR21, FR22", "หน้าต่างยอมรับเงื่อนไข PDPA, ตัวเลือกความยินยอมให้ใช้ข้อมูลเพื่องานวิจัย และแบบฟอร์มขอลบข้อมูลบัญชี", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "16. การจัดการบัญชีผู้ใช้ (Account Management)", "FR23", "เปลี่ยนรหัสผ่าน, อัปเดตอีเมล และปุ่มขอลบบัญชีผู้ใช้ถาวร (ตามข้อบังคับของ App Store / Play Store)", "อนุมัติให้อยู่ในขอบเขต"),
        ("อยู่ในขอบเขต (In-Scope)", "17. การเชื่อมโยงและประสานข้อมูลข้ามแพลตฟอร์ม (Cross-Platform Sync)", "FR15, NFR08", "การประสานข้อมูลโปรไฟล์, เซสชัน, ประวัติ, โควตา และความยินยอม ให้สอดคล้องกันระหว่าง Web และ Mobile แบบ 100%", "อนุมัติให้อยู่ในขอบเขต")
    ]
    
    out_scope_modules_th = [
        ("อยู่นอกขอบเขต (Out-of-Scope)", "คอนโซลผู้ดูแลระบบ (Admin Console)", "FR25, FR32, FR34", "การจัดการระบบส่วนกลางและการตรวจสอบความปลอดภัย จำกัดเฉพาะบน Web Application เท่านั้น", "อนุมัติให้อยู่นอกขอบเขต"),
        ("อยู่นอกขอบเขต (Out-of-Scope)", "พอร์ทัลผู้วิจัย (Researcher Portal)", "FR18.1, NFR17", "การสืบค้นและส่งออกชุดข้อมูลวิจัยแบบไม่ระบุตัวตน จำกัดเฉพาะบน Web Application เท่านั้น", "อนุมัติให้อยู่นอกขอบเขต"),
        ("อยู่นอกขอบเขต (Out-of-Scope)", "การบริหารจัดการผู้ใช้งาน (User Administration)", "FR32", "การจัดการสถานะบัญชีผู้ใช้, มอบหมายสิทธิ์ และระงับการใช้งาน จำกัดเฉพาะบน Web Application เท่านั้น", "อนุมัติให้อยู่นอกขอบเขต"),
        ("อยู่นอกขอบเขต (Out-of-Scope)", "การบริหารจัดการโมเดล AI (AI Model Administration)", "FR34", "แก้ไข Prompt Template, ปรับน้ำหนักรูบริก, ปรับพารามิเตอร์โมเดล และทดสอบเบঞ্চมาร์ก จำกัดเฉพาะบนเว็บเท่านั้น", "อนุมัติให้อยู่นอกขอบเขต"),
        ("อยู่นอกขอบเขต (Out-of-Scope)", "การบริหารการเงินและการชำระเงิน (Payment / Finance Admin)", "FR27, FR30", "อนุมัติการคืนเงินด้วยตนเอง, ตรวจสอบรายการเดินบัญชี และตั้งค่าเกตเวย์ จำกัดเฉพาะบน Web Application เท่านั้น", "อนุมัติให้อยู่นอกขอบเขต"),
        ("อยู่นอกขอบเขต (Out-of-Scope)", "รายงานรายได้และการเงิน (Revenue & Financial Reports)", "FR31", "แดชบอร์ดรายได้เชิงพาณิชย์, อัตราการยกเลิกแพ็กเกจ และส่งออกบัญชีแยกประเภท จำกัดเฉพาะบน Web Application เท่านั้น", "อนุมัติให้อยู่นอกขอบเขต"),
        ("อยู่นอกขอบเขต (Out-of-Scope)", "การจัดการชุดข้อมูลงานวิจัย (Research Data Management)", "FR18.1, NFR17", "รวบรวมคลังข้อมูลวิเคราะห์, บันทึกการเข้าถึงของผู้วิจัย และประเมินความเสี่ยง Re-identification จำกัดเฉพาะบนเว็บเท่านั้น", "อนุมัติให้อยู่นอกขอบเขต")
    ]
    
    pending_modules_th = [
        ("รอการตัดสินใจ (Pending)", "การแจ้งเตือนแบบพุช (Push Notifications)", "FR28 (รอตัดสินใจ D-M05)", "ระบบแจ้งเตือนผ่าน APNs / FCM สำหรับเตือนฝึกสัมภาษณ์, แจ้งผลประเมินพร้อมดู และแจ้งเตือนต่ออายุสมาชิก", "รอการตัดสินใจ (D-M05)"),
        ("รอการตัดสินใจ (Pending)", "การยืนยันตัวตนด้วยไบโอเมตริกซ์ (Biometric Authentication)", "FR01 (รอตัดสินใจ D-M06)", "การปลดล็อกแอปด้วย Face ID / Touch ID / สแกนลายนิ้วมือ เพื่อความสะดวกรวดเร็วบนอุปกรณ์เคลื่อนที่", "รอการตัดสินใจ (D-M06)"),
        ("รอการตัดสินใจ (Pending)", "การเชื่อมโยงเชิงลึก (Deep Linking & Universal Links)", "FR01 (รอตัดสินใจ D-M07)", "ตั้งค่า iOS Universal Links และ Android App Links เพื่อเปิดลิงก์ยืนยันอีเมลและลิงก์สัมภาษณ์ในแอปโดยตรง", "รอการตัดสินใจ (D-M07)"),
        ("รอการตัดสินใจ (Pending)", "การบันทึกเสียงเบื้องหลัง (Background Audio Recording)", "FR05-V (รอการออกแบบระบบเสียง)", "การบันทึกเสียงคำตอบขณะผู้ใช้สลับแอปไปหน้าอื่นหรือล็อกหน้าจอ", "รอการตัดสินใจทางเทคนิค"),
        ("รอการตัดสินใจ (Pending)", "โหมดออฟไลน์เต็มรูปแบบ (Full Offline Interview Mode)", "FR33 (รอตัดสินใจ D-M08)", "การจำลองการสัมภาษณ์ AI โดยไม่ต้องเชื่อมต่ออินเทอร์เน็ต ผ่านโมเดล AI บนอุปกรณ์", "รอการตัดสินใจ (D-M08)"),
        ("รอการตัดสินใจ (Pending)", "การประมวลผล AI บนอุปกรณ์ (On-Device AI Processing)", "NFR02 (รอตัดสินใจ D-M08)", "รันโมเดล LLM และให้คะแนนบนชิป NPU/GPU ของมือถือแทนการส่งไปยัง Cloud Server", "รอการตัดสินใจ (D-M08)")
    ]
    
    all_ms_th = in_scope_modules_th + out_scope_modules_th + pending_modules_th
    for i, row in enumerate(all_ms_th):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_ms.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=NAVY_HEADER, align="center")
            elif c_idx == 1:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, align="left")
            elif c_idx == 2:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=BLUE_ACCENT, align="center")
            elif c_idx == 4:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=12, align="left")
        ws_ms.row_dimensions[r_idx].height = 32
    auto_fit_columns(ws_ms, 1, 5, explicit_widths={1: 22, 2: 30, 3: 22, 4: 60, 5: 26})

    # -------------------------------------------------------------------------
    # 7. SHEET: การเชื่อมโยงและประสานข้อมูล (Data_Synchronization)
    # -------------------------------------------------------------------------
    ws_ds = wb.create_sheet(title="การเชื่อมโยงและประสานข้อมูล")
    ws_ds.merge_cells("A1:I1")
    t_ds = ws_ds["A1"]
    t_ds.value = "InterviewX — ข้อกำหนดการเชื่อมโยงและประสานข้อมูลข้ามแพลตฟอร์ม (Cross-Platform Data Synchronization Specification)"
    t_ds.font = Font(name="TH Sarabun New", size=16, bold=True, color="FFFFFF")
    t_ds.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_ds.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_ds.row_dimensions[1].height = 36
    
    ds_headers_th = [
        "หมวดหมู่ข้อมูล (Data Category)", "เจ้าของบริบทข้อมูล (Context Owner)", "แหล่งข้อมูลหลัก (Source of Truth)", "จุดเชื่อมต่อระบบ (Responsible API Endpoint)",
        "สิทธิ์อ่าน / เขียน (Read / Write Access)", "พฤติกรรมและความถี่ในการซิงก์ (Sync Behavior & Frequency)", "กลยุทธ์จัดการข้อขัดแย้ง (Conflict Handling Strategy)",
        "มาตรการความปลอดภัยและการเข้ารหัส (Security & Encryption)", "สถานะทางเทคนิค (Technical Status)"
    ]
    ws_ds.append([])
    ws_ds.append(ds_headers_th)
    style_header_row(ws_ds, 3, len(ds_headers_th), height=28)
    
    sync_data_th = [
        ("ข้อมูลบัญชีผู้ใช้และการพิสูจน์ตัวตน", "Identity Context", "PostgreSQL (USERS, AUTH_IDENTITIES)",
         "/api/v1/auth/me\n/api/v1/auth/session", "อ่าน (ผู้ใช้), เขียนผ่าน Auth Flows",
         "ดึงข้อมูลทันทีเมื่อเปิดหรือสลับกลับเข้าแอป; รีเฟรชโทเค็นตามรอบ (Access Token 15 นาที / Refresh Token 7 วัน)",
         "ใช้เวลาฝั่งเซิร์ฟเวอร์เป็นหลัก (Server Timestamp Wins); การแก้ไขชนกันจะถูกปฏิเสธด้วย 409 Conflict",
         "จัดเก็บโทเค็นใน iOS Keychain / Android Keystore; เข้ารหัส TLS 1.3 ห้ามบันทึกโทเค็นลง Log เด็ดขาด",
         "กำหนดคุณลักษณะแล้ว (Baseline R1)"),
        ("ข้อมูลโปรไฟล์ผู้ใช้งาน", "User Context", "PostgreSQL (USERS.current_status, skill_level)",
         "/api/v1/users/profile", "อ่าน / เขียนโดยเจ้าของบัญชีที่ผ่านการพิสูจน์ตัวตน",
         "ซิงก์เมื่อแอปขึ้นสู่เบื้องหน้า (Foreground) และเมื่อบันทึกข้อมูล; อัปเดต UI แบบ Optimistic พร้อมย้อนกลับหากเกิดข้อผิดพลาด",
         "การบันทึกครั้งหลังสุดเป็นฝ่ายชนะ (Last-write-wins) อิงตาม updated_at ของเซิร์ฟเวอร์",
         "ตรวจสอบสิทธิ์ความเป็นเจ้าของที่ฝั่งเซิร์ฟเวอร์; ตรวจสอบความถูกต้องของข้อมูลด้วย Zod และ Pydantic",
         "กำหนดคุณลักษณะแล้ว (Baseline R1)"),
        ("สิทธิประโยชน์และโควตาแพ็กเกจ", "Billing Context", "PostgreSQL (SUBSCRIPTIONS, USAGE_LEDGER)",
         "/api/v1/subscriptions/current\n/api/v1/entitlements/check", "อ่านอย่างเดียวสำหรับเครื่องลูกข่าย; เขียนผ่านเหตุการณ์ชำระเงินที่หลังบ้าน",
         "ดึงข้อมูลเมื่อเริ่มสร้างเซสชันสัมภาษณ์; ตรวจสอบสิทธิ์แบบ Atomic ที่เซิร์ฟเวอร์ก่อนอนุญาตให้เริ่มทำ",
         "สถานะที่เซิร์ฟเวอร์มีอำนาจเด็ดขาดเหนือแคชในเครื่องลูกข่าย; การหักโควตากระทำแบบ Atomic",
         "บังคับใช้กฎที่หลังบ้านป้องกันการแก้ไขข้อมูล; โควตาในเครื่องลูกข่ายมีไว้เพื่อแสดงผล UI เท่านั้น",
         "กำหนดคุณลักษณะแล้ว (Baseline R3)"),
        ("เซสชันการสัมภาษณ์ที่กำลังดำเนินอยู่", "Interview Context", "PostgreSQL (INTERVIEW_SESSIONS, SESSION_QUESTIONS)",
         "/api/v1/interviews\n/api/v1/interviews/{id}/answers", "อ่าน / เขียนโดยเจ้าของเซสชัน",
         "ส่งคำขอและรับผลเป็นรายข้อ; พักข้อมูลคำตอบไว้ในเครื่องชั่วคราวหากสัญญาณอินเทอร์เน็ตขาดหาย",
         "ใช้ Idempotency Key ใน Header ป้องกันการส่งคำตอบซ้ำซ้อนจากข้อผิดพลาดของเครือข่าย",
         "เซสชันล็อกกับ user_id ของผู้ใช้; ใช้ CSRF ป้องกันบน Web และ Bearer Token บน Mobile",
         "กำหนดคุณลักษณะแล้ว (Baseline R1)"),
        ("ประวัติการสัมภาษณ์ย้อนหลัง", "Interview Context", "PostgreSQL (INTERVIEW_SESSIONS, ANSWERS, FEEDBACK)",
         "/api/v1/interviews/history\n/api/v1/interviews/{id}", "อ่านอย่างเดียว; ลบโดยเจ้าของ (แบบ Soft Delete)",
         "ดึงข้อมูลแบบแบ่งหน้าตามคำขอ; บันทึกแคชในเครื่องเพื่อแสดงผลรวดเร็ว; ล้างแคชทันทีเมื่อมีการลบ",
         "บันทึกประวัติแบบต่อท้ายเท่านั้น (Append-only); ข้อมูลที่เซิร์ฟเวอร์เป็นแหล่งความจริงหลัก",
         "กรองข้อมูลตาม user_id อย่างเข้มงวด; เซสชันที่ถูกลบจะไม่ถูกส่งกลับและรอการทำลายตามรอบ PDPA",
         "กำหนดคุณลักษณะแล้ว (Baseline R1)"),
        ("ผลการประเมินและข้อเสนอแนะจาก AI", "Evaluation Context", "PostgreSQL (FEEDBACK, EVALUATION_JOBS)",
         "/api/v1/evaluations/{jobId}\n/api/v1/interviews/{id}/feedback", "อ่านอย่างเดียวโดยเจ้าของเซสชัน",
         "ตรวจสอบสถานะเป็นระยะ (Polling P95 <= 15s) หรือรับการแจ้งเตือน; แคชผลลัพธ์ในเครื่องเมื่อประมวลผลเสร็จสิ้น",
         "บันทึกผลการประเมินแบบ Immutable ตรึงกับเวอร์ชันรูบริกและโมเดล AI; ไม่อนุญาตให้แก้ไขผลลัพธ์",
         "ผลการประเมินเป็นกรรมสิทธิ์ของผู้ใช้คนนั้นเท่านั้น; การยื่นอุทธรณ์จะส่งเข้าคิวตรวจสอบของผู้ดูแลระบบ",
         "กำหนดคุณลักษณะแล้ว (Baseline R1)"),
        ("การตั้งค่าและการกำหนดค่าผู้ใช้งาน", "User Context / Client", "PostgreSQL (USER_PREFERENCES) + Local Storage",
         "/api/v1/users/preferences", "อ่าน / เขียนโดยผู้ใช้ที่ผ่านการพิสูจน์ตัวตน",
         "ซิงก์การตั้งค่าหลักข้ามอุปกรณ์; การตั้งค่าเฉพาะเครื่อง (เช่น เปิด/ปิด ไบโอเมตริกซ์) เก็บไว้เฉพาะในอุปกรณ์",
         "การตั้งค่าบนคลาวด์ใช้ Last-write-wins; การตั้งค่าเฉพาะเครื่องจะแยกขาดจากกัน",
         "ตรวจสอบโครงสร้างข้อมูลตาม Allowlist อย่างเข้มงวด; ห้ามจัดเก็บข้อมูลสำคัญใน Preference",
         "ข้อเสนอใหม่ — รอการอนุมัติ (TBD)"),
        ("บันทึกความยินยอมและความเป็นส่วนตัว", "Privacy Context", "PostgreSQL (CONSENT_EVENTS, PROCESSING_NOTICES)",
         "/api/v1/privacy/consents\n/api/v1/privacy/notices/current", "อ่านความยินยอมที่ใช้งานอยู่; เขียนแบบต่อท้ายเท่านั้น (Append-only)",
         "ซิงก์เมื่อเปิดแอป; หากมีประกาศนโยบายเวอร์ชันใหม่ ระบบจะแสดงหน้าต่างบล็อกการใช้งานเพื่อขอความยินยอมทันที",
         "บันทึกประวัติแบบ Append-only; ความยินยอมล่าสุดที่ถูกต้องของแต่ละวัตถุประสงค์จะเป็นตัวควบคุมบริการหลังบ้าน",
         "มี Audit Trail ที่ตรวจสอบได้; การเพิกถอนความยินยอมจะมีผลระงับการประมวลผลในทุกบริการหลังบ้านทันที",
         "กำหนดคุณลักษณะแล้ว (Baseline R1)")
    ]
    for i, row in enumerate(sync_data_th):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_ds.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=NAVY_HEADER, align="left")
            elif c_idx == 1:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=BLUE_ACCENT, align="center")
            elif c_idx == 8:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=11, align="left")
        ws_ds.row_dimensions[r_idx].height = 42
    auto_fit_columns(ws_ds, 1, 9, explicit_widths={1: 24, 2: 18, 3: 28, 4: 28, 5: 24, 6: 40, 7: 38, 8: 40, 9: 24})

    # -------------------------------------------------------------------------
    # 8. SHEET: ทะเบียนการตัดสินใจ (Decision_Register)
    # -------------------------------------------------------------------------
    ws_dec = wb.create_sheet(title="ทะเบียนการตัดสินใจ")
    ws_dec.merge_cells("A1:H1")
    t_dec = ws_dec["A1"]
    t_dec.value = "InterviewX — ทะเบียนการตัดสินใจด้านสถาปัตยกรรมและแอปพลิเคชันมือถือ (Decision Register: D-M01 ถึง D-M11)"
    t_dec.font = Font(name="TH Sarabun New", size=16, bold=True, color="FFFFFF")
    t_dec.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_dec.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_dec.row_dimensions[1].height = 36
    
    dec_headers_th = ["รหัส (ID)", "หมวดหมู่ (Category)", "ประเด็นการตัดสินใจ (Decision Item)", "รายละเอียดทางเทคนิคและธุรกิจ (Technical / Business Description)", "ทางเลือกที่อยู่ระหว่างพิจารณา (Options Under Consideration)", "ทางเลือกที่แนะนำ (Recommended Option)", "ผู้รับผิดชอบ (Owner)", "สถานะ (Status)"]
    ws_dec.append([])
    ws_dec.append(dec_headers_th)
    style_header_row(ws_dec, 3, len(dec_headers_th), height=28)
    
    short_decisions_th = [
        ("D-M01", "สถาปัตยกรรมและการส่งมอบ", "กำหนดการและ Milestone การเปิดตัว Native Mobile",
         "กำหนดรอบการส่งมอบแอปพลิเคชันมือถือ (iOS/Android) ว่าจะปล่อยพร้อม R1 หรือปล่อยใน R2 ควบคู่กับระบบสัมภาษณ์ด้วยเสียง",
         "ทางเลือก A: ตั้งเป้าปล่อยใน R2 ร่วมกับฟังก์ชันเสียง (แนะนำ)\nทางเลือก B: ปล่อยพร้อม R1\nทางเลือก C: ชะลอไป R3",
         "ทางเลือก A (พัฒนา Backend API และ Web ให้มั่นคงใน R1 ก่อนขยายสู่ Mobile ใน R2)", "Product Owner / Tech Lead", "รอการยืนยัน"),
        ("D-M02", "เทคโนโลยีการพัฒนา", "การเลือกเทคโนโลยีสำหรับ Native Mobile Application",
         "เลือกสแตกเทคโนโลยีระหว่าง React Native vs Flutter vs Native Swift/Kotlin สำหรับการพัฒนาบน iOS และ Android",
         "ทางเลือก A: React Native / Expo (ใช้ทักษะและโค้ดร่วมกับ Next.js/TS ได้สูงสุด)\nทางเลือก B: Flutter / Dart\nทางเลือก C: Native Swift & Kotlin",
         "ทางเลือก A (ลดความซ้ำซ้อน แชร์ DTOs, Schema Validation และ Type definitions ได้โดยตรง)", "Technical Lead / Mobile Architect", "รอการยืนยัน"),
        ("D-M03", "ความเข้ากันได้ของระบบปฏิบัติการ", "เวอร์ชันขั้นต่ำของระบบปฏิบัติการที่รองรับ",
         "กำหนดเวอร์ชันขั้นต่ำของ iOS และ Android เพื่อการันตีความปลอดภัยและฟีเจอร์การบันทึกเสียงสมัยใหม่",
         "ทางเลือก A: iOS 16.0+ และ Android 13.0+ (API 33) (แนะนำ)\nทางเลือก B: iOS 15.0+ และ Android 10.0+",
         "ทางเลือก A (ครอบคลุมผู้ใช้งานจริงกว่า 92% พร้อมความปลอดภัยระดับฮาร์ดแวร์ Secure Enclave)", "QA Lead / Mobile Architect", "รอการยืนยัน"),
        ("D-M04", "ระบบการเงินและการชำระเงิน", "สถาปัตยกรรมการชำระเงินและค่าธรรมเนียม Store",
         "กำหนดแนวทางการซื้อแพ็กเกจบนมือถือ ว่าจะใช้ Apple/Google In-App Purchase (หัก 15-30%) หรือส่งต่อผู้ใช้ไปชำระเงินบน Web Checkout",
         "ทางเลือก A: ดูแพ็กเกจบนมือถือ ส่งต่อไปจ่ายเงินบน Web Checkout\nทางเลือก B: ตัดเงินผ่าน In-App Purchase ของ Apple/Google",
         "ทางเลือก A ในระยะแรก ควบคู่กับการตรวจสอบกฎเกณฑ์ของ App Store และประเมินทางเลือก B หากจำเป็น", "Finance Admin / Product Owner / Legal", "รอการยืนยัน"),
        ("D-M05", "การมีส่วนร่วมของผู้ใช้", "ขอบเขตและโครงสร้างพื้นฐานระบบ Push Notifications",
         "ประเมินความจำเป็นของระบบพุชแจ้งเตือน (APNs / FCM) สำหรับเตือนการฝึกซ้อม แจ้งเตือนเมื่อผล AI ประเมินเสร็จ และแจ้งเตือนต่ออายุแพ็กเกจ",
         "ทางเลือก A: ติดตั้ง APNs/FCM Worker ใน R2\nทางเลือก B: ใช้การแจ้งเตือนในแอปและอีเมลเท่านั้น",
         "ทางเลือก A โดยวางแผนพัฒนาระบบร่วมในรอบ R2", "Product Owner / Backend Lead", "รอการยืนยัน"),
        ("D-M06", "ความปลอดภัยและการพิสูจน์ตัวตน", "การยืนยันตัวตนด้วยไบโอเมตริกซ์บนอุปกรณ์เคลื่อนที่",
         "พิจารณาการรองรับการปลดล็อกด้วยชีวมิติ (Face ID / Touch ID / BiometricPrompt) เพื่อเปิดใช้งานแอปอย่างรวดเร็ว",
         "ทางเลือก A: รองรับไบโอเมตริกซ์เพื่อปลดล็อก Refresh Token ใน Keychain/Keystore\nทางเลือก B: ใช้ JWT มาตรฐานโดยไม่มีไบโอเมตริกซ์",
         "ทางเลือก A เป็นส่วนเสริมใน R2 หลังระบบล็อกอินพื้นฐานทำงานได้อย่างสมบูรณ์", "Security Lead / Mobile Lead", "รอการยืนยัน"),
        ("D-M07", "การนำทางและจุดเชื่อมโยง", "การรองรับ Deep Linking และ Universal Links",
         "กำหนดการเชื่อมโยง iOS Universal Links และ Android App Links สำหรับการยืนยันอีเมลและการเข้าสู่ห้องสัมภาษณ์จากภายนอก",
         "ทางเลือก A: กำหนดค่า apple-app-site-association และ assetlinks.json เต็มรูปแบบ\nทางเลือก B: ใช้การเปิดเบราว์เซอร์ปกติ",
         "ทางเลือก A เพื่อประสบการณ์ผู้ใช้งานที่ราบรื่นไร้รอยต่อ", "Frontend Lead / Mobile Lead", "รอการยืนยัน"),
        ("D-M08", "การทำงานแบบออฟไลน์", "ขอบเขตการทำงานออฟไลน์และการประมวลผลบนเครื่อง",
         "กำหนดขอบเขตฟังก์ชันออฟไลน์และการรัน AI บนเครื่องลูกข่าย (Local Model vs Online Inference)",
         "ทางเลือก A: กำหนดให้ต้องต่ออินเทอร์เน็ตสำหรับการประเมิน AI พร้อมระบบแคชฉบับร่างคำตอบในเครื่องเพื่อความทนทาน\nทางเลือก B: รันโมเดล AI ในเครื่องแบบเต็มรูปแบบ",
         "ทางเลือก A (การประเมินผล AI ต้องใช้เกณฑ์ที่สอดคล้องจากคลาวด์ พร้อมระบบกันคำตอบหายเมื่อเน็ตหลุด)", "Software Architect / AI Lead", "รอการยืนยัน"),
        ("D-M09", "แผนงานผลิตภัณฑ์", "ความเท่าเทียมกันของฟังก์ชันระหว่าง Web และ Mobile",
         "กำหนดความสอดคล้องของฟังก์ชันสำหรับผู้ใช้งานทั่วไป (End Users) ระหว่าง Web และ Native Mobile",
         "ทางเลือก A: ฟังก์ชันสำหรับ End Users เท่าเทียมกัน 100% สำหรับโมดูลที่เปิดตัว\nทางเลือก B: ให้ Mobile มีเฉพาะฟังก์ชันเสียง",
         "ทางเลือก A สำหรับฟังก์ชันผู้ใช้ทั่วไป; ส่วนฟังก์ชันผู้ดูแลระบบและวิจัยสงวนไว้เฉพาะบน Web", "Product Owner / QA Lead", "รอการยืนยัน"),
        ("D-M10", "การจัดจำหน่ายและนโยบาย", "การปฏิบัติตามนโยบายความยินยอมและความเป็นส่วนตัวของ App Store",
         "การเตรียมความพร้อมตามข้อกำหนดของ Apple App Store Guidelines และ Google Play Developer Policies",
         "ทางเลือก A: จัดทำระบบลบบัญชีในแอป, ขออนุญาตไมโครโฟนตามมาตรฐาน และทำ Privacy Nutrition Labels ครบถ้วน\nทางเลือก B: แจกจ่ายแบบ Enterprise ภายใน",
         "ทางเลือก A (จำเป็นอย่างยิ่งสำหรับการเปิดให้ดาวน์โหลดสาธารณะเชิงพาณิชย์)", "Legal / Privacy Lead / Release Manager", "รอการยืนยัน"),
        ("D-M11", "การจัดการสื่อและระบบเสียง", "โพรโทคอลการส่งสัญญาณเสียงสำหรับระบบสัมภาษณ์ใน R2",
         "เลือกโพรโทคอลการรับส่งไฟล์เสียงสัมภาษณ์ในรอบ R2 ระหว่างการอัปโหลดไฟล์เป็นส่วนๆ กับการสตรีมมิงแบบสองทิศทาง",
         "ทางเลือก A: อัปโหลดไฟล์เสียงเป็นส่วนๆ (Chunked Upload) ผ่าน Signed URL ไปยัง S3/MinIO\nทางเลือก B: สตรีมมิงเสียงแบบสองทิศทางผ่าน WebSocket / WebRTC",
         "ทางเลือก A สำหรับการเริ่มต้นใน R2 เพื่อความเสถียรบนเครือข่ายมือถือ; ประเมินทางเลือก B หากต้องการความเร็ว Real-time สูงสุด", "Technical Lead / AI Lead", "รอการยืนยัน")
    ]
    for i, row in enumerate(short_decisions_th):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_dec.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=NAVY_HEADER, align="center")
            elif c_idx == 1:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, align="center")
            elif c_idx == 7:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=11, align="left")
        ws_dec.row_dimensions[r_idx].height = 42
    auto_fit_columns(ws_dec, 1, 8, explicit_widths={1: 14, 2: 24, 3: 30, 4: 46, 5: 42, 6: 36, 7: 24, 8: 20})

    # -------------------------------------------------------------------------
    # 9. SHEET: บันทึกการเปลี่ยนแปลง (Change_Log)
    # -------------------------------------------------------------------------
    ws_cl = wb.create_sheet(title="บันทึกการเปลี่ยนแปลง")
    ws_cl.merge_cells("A1:E1")
    t_cl = ws_cl["A1"]
    t_cl.value = "InterviewX — บันทึกประวัติการแก้ไขและปรับปรุงเอกสาร (Phase 1 Document Change Log)"
    t_cl.font = Font(name="TH Sarabun New", size=16, bold=True, color="FFFFFF")
    t_cl.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    t_cl.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_cl.row_dimensions[1].height = 36
    
    cl_headers_th = ["เวอร์ชัน (Version)", "วันที่ปรับปรุง (Revision Date)", "แผ่นงาน / ส่วนที่ได้รับผลกระทบ (Affected Section)", "ลักษณะการเปลี่ยนแปลง (Nature of Modification)", "สถานะการอนุมัติ (Approval Status)"]
    ws_cl.append([])
    ws_cl.append(cl_headers_th)
    style_header_row(ws_cl, 3, len(cl_headers_th), height=28)
    
    cl_rows_th = [
        ("1.0", "08 ต.ค. 2026", "เอกสารหลักฐานเดิม (ทุกแผ่นงาน)", "จัดทำเอกสารข้อกำหนดตั้งต้นจากการรวบรวมความต้องการและการทบทวนทางวิศวกรรม", "อนุมัติตาม Baseline v1.0"),
        ("1.1 DRAFT", "13 พ.ย. 2026", "แผ่นงาน: ข้อกำหนดเชิงหน้าที่ (FR15)", "ปรับปรุง FR15 เพื่อแยกความแตกต่างระหว่าง Responsive Web และ Native Mobile Application, บทบาทผู้ใช้ที่รองรับ, การตรวจสอบสิทธิ์ร่วมกัน และข้อจำกัดทางแพลตฟอร์ม", "ข้อเสนอปรับปรุง — รอการอนุมัติ"),
        ("1.1 DRAFT", "13 พ.ย. 2026", "แผ่นงาน: ข้อกำหนดเชิงหน้าที่ (คอลัมน์ขอบเขตแพลตฟอร์ม)", "เพิ่มคอลัมน์ D เพื่อจัดหมวดหมู่ข้อกำหนดเชิงหน้าที่ทั้ง 40 รายการตามขอบเขตแพลตฟอร์ม (ใช้งานร่วมกัน, เฉพาะบนเว็บ, เป็นต้น)", "ข้อเสนอปรับปรุง — รอการอนุมัติ"),
        ("1.1 DRAFT", "13 พ.ย. 2026", "แผ่นงาน: ข้อกำหนดที่ไม่ใช่เชิงหน้าที่ (NFR08)", "ปรับปรุง NFR08 เพื่อกำหนดเกณฑ์การเข้าถึงได้อย่างเท่าเทียมบน Responsive Web (WCAG 2.2 AA) และ Native Mobile (HIG / TalkBack) พร้อมการซิงก์ข้อมูล 100%", "ข้อเสนอปรับปรุง — รอการอนุมัติ"),
        ("1.1 DRAFT", "13 พ.ย. 2026", "แผ่นงาน: ข้อกำหนดที่ไม่ใช่เชิงหน้าที่ (NFR01, 04, 09, 19)", "เพิ่มบันทึกความปลอดภัยบนมือถือ (Keychain/Keystore), เวลาตอบสนองบนเครือข่ายมือถือ (P95 <= 2.5s), การล้างแคชเสียง และการตรวจสอบสิทธิ์หลังบ้าน", "ข้อเสนอปรับปรุง — รอการอนุมัติ"),
        ("1.1 DRAFT", "13 พ.ย. 2026", "แผ่นงาน: การกำหนดสิทธิ์ผู้ใช้งาน (แถว FR15)", "ปรับปรุงตารางสิทธิ์ FR15 และเพิ่มบันทึกกำกับยืนยันว่าบทบาทผู้ดูแลระบบและผู้วิจัยจำกัดเฉพาะบน Web Application เท่านั้น", "ข้อเสนอปรับปรุง — รอการอนุมัติ"),
        ("1.1 DRAFT", "13 พ.ย. 2026", "แผ่นงาน: ตารางการเข้าถึงแพลตฟอร์ม", "สร้างตารางเมทริกซ์ Role × Platform กำหนดขอบเขตการเข้าใช้งาน Web และ Native Mobile สำหรับทั้ง 5 บทบาทความปลอดภัย", "ข้อเสนอปรับปรุง — รอการอนุมัติ"),
        ("1.1 DRAFT", "13 พ.ย. 2026", "แผ่นงาน: ตารางสิทธิ์ตามแพ็กเกจ", "สร้างตารางระดับแพ็กเกจสมาชิก (Free, Basic, Pro) × แพลตฟอร์ม พร้อมกำหนดกฎเกณฑ์การควบคุมสิทธิ์ 7 ประการ", "ข้อเสนอปรับปรุง — รอการอนุมัติ"),
        ("1.1 DRAFT", "13 พ.ย. 2026", "แผ่นงาน: ขอบเขตแอปพลิเคชันมือถือ", "จำแนกขอบเขตโมดูลของ Native Mobile อย่างละเอียด: 17 โมดูลในขอบเขต, 7 โมดูลนอกขอบเขต และ 6 โมดูลที่รอการตัดสินใจ", "ข้อเสนอปรับปรุง — รอการอนุมัติ"),
        ("1.1 DRAFT", "13 พ.ย. 2026", "แผ่นงาน: การเชื่อมโยงและประสานข้อมูล", "จัดทำข้อกำหนดการเชื่อมโยงและประสานข้อมูลข้ามแพลตฟอร์มครอบคลุม 8 หมวดหมู่ข้อมูลหลัก พร้อมกลยุทธ์จัดการข้อขัดแย้งและความปลอดภัย", "ข้อเสนอปรับปรุง — รอการอนุมัติ"),
        ("1.1 DRAFT", "13 พ.ย. 2026", "แผ่นงาน: ทะเบียนการตัดสินใจ", "รวบรวมทะเบียนการตัดสินใจด้านสถาปัตยกรรมและเทคนิค 11 รายการ (D-M01 ถึง D-M11) ที่รอการลงนามอนุมัติจากผู้มีส่วนได้ส่วนเสีย", "รอการยืนยัน")
    ]
    for i, row in enumerate(cl_rows_th):
        r_idx = 4 + i
        is_zebra = (i % 2 == 1)
        for c_idx, val in enumerate(row):
            cell = ws_cl.cell(row=r_idx, column=c_idx + 1, value=val)
            if c_idx == 0:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, color=NAVY_HEADER, align="center")
            elif c_idx == 1:
                format_data_cell(cell, is_zebra, font_size=12, bold=True, align="center")
            elif c_idx == 4:
                style_status_cell(cell, val)
            else:
                format_data_cell(cell, is_zebra, font_size=12, align="left")
        ws_cl.row_dimensions[r_idx].height = 36
    auto_fit_columns(ws_cl, 1, 5, explicit_widths={1: 16, 2: 20, 3: 32, 4: 65, 5: 30})

    wb.save(out_path)
    print(f"Generated Thai Aligned FR/NFR/RBAC Workbook: {out_path}")

if __name__ == "__main__":
    src = r"D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_FR_NFR_RBAC.xlsx"
    out = r"D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements/InterviewX_FR_NFR_RBAC_v1.1_DRAFT_TH.xlsx"
    build_aligned_fr_nfr_rbac_th(src, out)
