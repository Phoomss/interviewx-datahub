import os
import shutil
import docx
from docx.shared import Pt, RGBColor, Mm, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_run_font(run, name="TH Sarabun New", size_pt=15.5, bold=False, italic=False, color_rgb=(30, 41, 59)):
    run.font.name = name
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    if color_rgb:
        run.font.color.rgb = RGBColor(*color_rgb)
    rPr = run._r.get_or_add_rPr()
    rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="{name}" w:hAnsi="{name}" w:cs="{name}"/>')
    rPr.append(rFonts)

def add_styled_p(doc, text="", space_before=0, space_after=4, line_spacing=1.2, keep_with_next=False, font_size=15.5, color_rgb=(30, 41, 59), bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.LEFT):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    p.paragraph_format.keep_with_next = keep_with_next
    p.alignment = align
    if text:
        r = p.add_run(text)
        set_run_font(r, size_pt=font_size, bold=bold, italic=italic, color_rgb=color_rgb)
    return p

def add_heading_1(doc, text, page_break_before=False):
    if page_break_before:
        doc.add_page_break()
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    set_run_font(r, size_pt=18.5, bold=True, color_rgb=(15, 23, 42))
    
    p_line = doc.add_paragraph()
    p_line.paragraph_format.space_before = Pt(0)
    p_line.paragraph_format.space_after = Pt(8)
    p_line.paragraph_format.keep_with_next = True
    r_l = p_line.add_run("━" * 45)
    set_run_font(r_l, size_pt=8, color_rgb=(30, 58, 138))
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    set_run_font(r, size_pt=16.5, bold=True, color_rgb=(30, 58, 138))
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(11)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    set_run_font(r, size_pt=15.5, bold=True, color_rgb=(15, 23, 42))
    return p

def add_callout(doc, text, title=None, border_color="2563EB", bg_color="EFF6FF", title_color=None):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Mm(157)
    
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    ''')
    tcPr.append(tcBorders)
    
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg_color}"/>')
    tcPr.append(shd)
    
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="140" w:type="dxa"/>
            <w:bottom w:w="140" w:type="dxa"/>
            <w:left w:w="200" w:type="dxa"/>
            <w:right w:w="180" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)
    
    trPr = tbl.rows[0]._tr.get_or_add_trPr()
    trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    
    if title:
        r_title = p.add_run(title + "\n")
        tc = title_color if title_color else (int(border_color[0:2], 16), int(border_color[2:4], 16), int(border_color[4:6], 16))
        set_run_font(r_title, size_pt=14.5, bold=True, color_rgb=tc)
    
    r_body = p.add_run(text)
    set_run_font(r_body, size_pt=14, color_rgb=(30, 41, 59))
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(4)
    return tbl

def add_code_block(doc, code_lines, title=None):
    if title:
        p_t = doc.add_paragraph()
        p_t.paragraph_format.space_before = Pt(6)
        p_t.paragraph_format.space_after = Pt(2)
        p_t.paragraph_format.keep_with_next = True
        r_t = p_t.add_run(title)
        set_run_font(r_t, size_pt=12.5, bold=True, color_rgb=(71, 85, 105))
        
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Mm(157)
    
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:left w:val="single" w:sz="18" w:space="0" w:color="0284C7"/>
            <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
            <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        </w:tcBorders>
    ''')
    tcPr.append(tcBorders)
    
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F8FAFC"/>')
    tcPr.append(shd)
    
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="120" w:type="dxa"/>
            <w:bottom w:w="120" w:type="dxa"/>
            <w:left w:w="180" w:type="dxa"/>
            <w:right w:w="180" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.1
    
    code_text = "\n".join(code_lines) if isinstance(code_lines, list) else code_lines
    r = p.add_run(code_text)
    set_run_font(r, name="Consolas", size_pt=10.5, color_rgb=(15, 23, 42))
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(5)

def format_table(table, col_widths, col_alignments=None, special_rules=None):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    tblPr = table._tbl.tblPr
    tblBorders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="8" w:space="0" w:color="1E3A8A"/>
            <w:bottom w:val="single" w:sz="8" w:space="0" w:color="94A3B8"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
            <w:insideV w:val="none"/>
        </w:tblBorders>
    ''')
    tblPr.append(tblBorders)
    
    tblCellMar = parse_xml(f'''
        <w:tblCellMar {nsdecls("w")}>
            <w:top w:w="130" w:type="dxa"/>
            <w:bottom w:w="130" w:type="dxa"/>
            <w:left w:w="150" w:type="dxa"/>
            <w:right w:w="150" w:type="dxa"/>
        </w:tblCellMar>
    ''')
    tblPr.append(tblCellMar)
    
    header_tr = table.rows[0]._tr.get_or_add_trPr()
    header_tr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
    header_tr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    
    for c_i, cell in enumerate(table.rows[0].cells):
        cell.width = Mm(col_widths[c_i])
        tcPr = cell._tc.get_or_add_tcPr()
        tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="0F172A"/>'))
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                set_run_font(r, size_pt=12.5, bold=True, color_rgb=(255, 255, 255))
                
    for r_i, row in enumerate(table.rows[1:], start=1):
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        is_zebra = (r_i % 2 == 0)
        row_bg = "F8FAFC" if is_zebra else "FFFFFF"
        
        for c_i, cell in enumerate(row.cells):
            cell.width = Mm(col_widths[c_i])
            tcPr = cell._tc.get_or_add_tcPr()
            tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{row_bg}"/>'))
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            
            align = WD_ALIGN_PARAGRAPH.LEFT
            if col_alignments and c_i < len(col_alignments):
                if col_alignments[c_i] == 'center':
                    align = WD_ALIGN_PARAGRAPH.CENTER
                elif col_alignments[c_i] == 'right':
                    align = WD_ALIGN_PARAGRAPH.RIGHT
                    
            for p in cell.paragraphs:
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.line_spacing = 1.15
                p.alignment = align
                for r in p.runs:
                    f_name = "TH Sarabun New"
                    f_size = 13.5
                    f_bold = False
                    f_color = (30, 41, 59)
                    
                    if special_rules and c_i in special_rules:
                        rule = special_rules[c_i]
                        if 'font' in rule: f_name = rule['font']
                        if 'size' in rule: f_size = rule['size']
                        if 'bold' in rule: f_bold = rule['bold']
                        if 'color' in rule: f_color = rule['color']
                    set_run_font(r, name=f_name, size_pt=f_size, bold=f_bold, color_rgb=f_color)

def create_table_from_data(doc, headers, rows, col_widths, col_alignments=None, special_rules=None):
    tbl = doc.add_table(rows=len(rows)+1, cols=len(headers))
    for c_i, h in enumerate(headers):
        tbl.cell(0, c_i).text = h
    for r_i, r_data in enumerate(rows):
        for c_i, val in enumerate(r_data):
            tbl.cell(r_i+1, c_i).text = str(val or "")
    format_table(tbl, col_widths, col_alignments, special_rules)
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(6)
    return tbl

def copy_and_format_table(doc, src_table, col_widths, col_alignments=None, special_rules=None):
    rows_data = []
    headers = [cell.text.strip() for cell in src_table.rows[0].cells]
    for row in src_table.rows[1:]:
        rows_data.append([cell.text.strip() for cell in row.cells])
    dest_table = create_table_from_data(doc, headers, rows_data, col_widths, col_alignments, special_rules)
    return dest_table

def add_fr_item_th(doc, title, line_meta, line_req, line_ac):
    p_title = add_heading_3(doc, title)
    
    p_meta = doc.add_paragraph()
    p_meta.paragraph_format.space_before = Pt(0)
    p_meta.paragraph_format.space_after = Pt(3)
    p_meta.paragraph_format.keep_with_next = True
    
    rel_str = "R1"
    prio_str = "Must"
    ev_str = ""
    plat_str = "ใช้งานร่วมกันทั้ง Web และ Mobile"
    
    parts = [pt.strip() for pt in line_meta.split('|')]
    for pt in parts:
        if pt.startswith('ระยะ:') or pt.startswith('Release:'):
            rel_str = pt.replace('ระยะ:', '').replace('Release:', '').strip()
        elif pt.startswith('Priority:') or pt.startswith('ความสำคัญ:'):
            prio_str = pt.replace('Priority:', '').replace('ความสำคัญ:', '').strip()
        elif pt.startswith('Evidence:') or pt.startswith('ที่มา:'):
            ev_str = pt.replace('Evidence:', '').replace('ที่มา:', '').strip()
        elif pt.startswith('Platform:') or pt.startswith('แพลตฟอร์ม:'):
            plat_str = pt.replace('Platform:', '').replace('แพลตฟอร์ม:', '').strip()
            
    rel_color = (29, 78, 216) if 'R1' in rel_str else ((124, 58, 237) if 'R2' in rel_str else (234, 88, 12))
    r_rel = p_meta.add_run(f" [ {rel_str} ] ")
    set_run_font(r_rel, size_pt=12, bold=True, color_rgb=rel_color)
    
    prio_color = (220, 38, 38) if 'Must' in prio_str else ((217, 119, 6) if 'Should' in prio_str else (71, 85, 105))
    r_prio = p_meta.add_run(f" [ ความสำคัญ: {prio_str} ] ")
    set_run_font(r_prio, size_pt=12, bold=True, color_rgb=prio_color)
    
    plat_color = (6, 95, 70) if 'ใช้งานร่วมกัน' in plat_str or 'Shared' in plat_str else (180, 83, 9)
    r_plat = p_meta.add_run(f" [ แพลตฟอร์ม: {plat_str} ] ")
    set_run_font(r_plat, size_pt=12, bold=True, color_rgb=plat_color)
    
    if ev_str:
        r_ev = p_meta.add_run(f" • ที่มา: {ev_str}")
        set_run_font(r_ev, size_pt=12.5, italic=True, color_rgb=(100, 116, 139))
        
    p_req = doc.add_paragraph()
    p_req.paragraph_format.space_before = Pt(2)
    p_req.paragraph_format.space_after = Pt(2)
    p_req.paragraph_format.line_spacing = 1.15
    p_req.paragraph_format.left_indent = Inches(0.2)
    p_req.paragraph_format.keep_with_next = True
    
    req_text = line_req.replace('Requirement:', '').replace('ข้อกำหนด (Requirement):', '').strip()
    r_req_lbl = p_req.add_run("ข้อกำหนด (Requirement): ")
    set_run_font(r_req_lbl, size_pt=14.5, bold=True, color_rgb=(15, 23, 42))
    r_req_val = p_req.add_run(req_text)
    set_run_font(r_req_val, size_pt=14.5, color_rgb=(30, 41, 59))
    
    p_ac = doc.add_paragraph()
    p_ac.paragraph_format.space_before = Pt(2)
    p_ac.paragraph_format.space_after = Pt(10)
    p_ac.paragraph_format.line_spacing = 1.15
    p_ac.paragraph_format.left_indent = Inches(0.2)
    
    ac_lbl = "เกณฑ์การยอมรับที่เสนอ — รอการอนุมัติ (Proposed Acceptance Criteria — Pending Approval): " if "FR15" in title else "เกณฑ์การยอมรับ (Acceptance Criteria): "
    ac_text = line_ac.replace('Acceptance criteria:', '').replace('เกณฑ์การยอมรับ (Acceptance Criteria):', '').replace('เกณฑ์การยอมรับที่เสนอ — รอการอนุมัติ (Proposed Acceptance Criteria — Pending Approval):', '').strip()
    r_ac_lbl = p_ac.add_run(ac_lbl)
    set_run_font(r_ac_lbl, size_pt=14, bold=True, color_rgb=(15, 23, 42))
    r_ac_val = p_ac.add_run(ac_text)
    set_run_font(r_ac_val, size_pt=14, color_rgb=(51, 65, 85))

def build_thai_srs_docx():
    script_dir = r"D:/workspaces/interviewx-datahub/docs-interviex/03_SRS_Requirements"
    backup_docx_path = os.path.join(script_dir, 'InterviewX_SRS_Final_For_Approval_v1.0.backup.docx')
    output_docx_path = os.path.join(script_dir, 'InterviewX_SRS_v1.1_DRAFT_TH.docx')
    root_docx_path = r"D:/workspaces/interviewx-datahub/docs-interviex/InterviewX_SRS_v1.1_DRAFT_TH.docx"

    src_doc = docx.Document(backup_docx_path)
    doc = docx.Document()

    # Configure Page Setup (ISO A4)
    sec = doc.sections[0]
    sec.page_width = Mm(210)
    sec.page_height = Mm(297)
    sec.left_margin = Mm(28)
    sec.right_margin = Mm(25)
    sec.top_margin = Mm(25)
    sec.bottom_margin = Mm(25)
    sec.different_first_page_header_footer = True

    # Header
    header = sec.header
    tbl_hdr = header.add_table(1, 2, Inches(6.18))
    tbl_hdr.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_hdr.autofit = False
    c_l, c_r = tbl_hdr.rows[0].cells
    c_l.width = Mm(110)
    c_r.width = Mm(47)
    p_hl = c_l.paragraphs[0]
    p_hl.paragraph_format.space_before = Pt(0)
    p_hl.paragraph_format.space_after = Pt(2)
    r_hl = p_hl.add_run("InterviewX   |   เอกสารข้อกำหนดระบบซอฟต์แวร์ (SRS) ฉบับภาษาไทยมาตรฐาน")
    set_run_font(r_hl, size_pt=10.5, color_rgb=(100, 116, 139))

    p_hr = c_r.paragraphs[0]
    p_hr.paragraph_format.space_before = Pt(0)
    p_hr.paragraph_format.space_after = Pt(2)
    p_hr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_hr = p_hr.add_run("ร่างมาตรฐาน v1.1 DRAFT")
    set_run_font(r_hr, size_pt=10.5, color_rgb=(100, 116, 139))

    hdrBorders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
            <w:insideH w:val="none"/>
            <w:insideV w:val="none"/>
        </w:tblBorders>
    ''')
    tbl_hdr._tbl.tblPr.append(hdrBorders)

    # Footer
    footer = sec.footer
    tbl_ftr = footer.add_table(1, 2, Inches(6.18))
    tbl_ftr.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_ftr.autofit = False
    c_fl, c_fr = tbl_ftr.rows[0].cells
    c_fl.width = Mm(115)
    c_fr.width = Mm(42)
    p_fl = c_fl.paragraphs[0]
    p_fl.paragraph_format.space_before = Pt(2)
    p_fl.paragraph_format.space_after = Pt(0)
    r_fl = p_fl.add_run("เอกสารควบคุม • ชั้นความลับสำหรับการทบทวน (ระยะที่ 1: การปรับประสานข้อกำหนด)")
    set_run_font(r_fl, size_pt=10, color_rgb=(100, 116, 139))

    p_fr = c_fr.paragraphs[0]
    p_fr.paragraph_format.space_before = Pt(2)
    p_fr.paragraph_format.space_after = Pt(0)
    p_fr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_fr1 = p_fr.add_run("หน้าที่ ")
    set_run_font(r_fr1, size_pt=10, color_rgb=(100, 116, 139))
    p_fr._p.append(parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w')))
    r_fr2 = p_fr.add_run(" จาก ")
    set_run_font(r_fr2, size_pt=10, color_rgb=(100, 116, 139))
    p_fr._p.append(parse_xml(r'<w:fldSimple %s w:instr="NUMPAGES"/>' % nsdecls('w')))

    ftrBorders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
            <w:bottom w:val="none"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
            <w:insideH w:val="none"/>
            <w:insideV w:val="none"/>
        </w:tblBorders>
    ''')
    tbl_ftr._tbl.tblPr.append(ftrBorders)

    # 1. COVER PAGE
    add_styled_p(doc, "ข้อกำหนดความต้องการระบบซอฟต์แวร์ (SYSTEM REQUIREMENTS SPECIFICATION)", space_before=10, space_after=2, font_size=12, color_rgb=(71, 85, 105), bold=True)
    p_top_line = doc.add_paragraph()
    p_top_line.paragraph_format.space_before = Pt(0)
    p_top_line.paragraph_format.space_after = Pt(28)
    r_tl = p_top_line.add_run("━" * 45)
    set_run_font(r_tl, size_pt=10, color_rgb=(30, 58, 138))

    add_styled_p(doc, "InterviewX", space_before=0, space_after=4, font_size=36, color_rgb=(15, 23, 42), bold=True)
    add_styled_p(doc, "เอกสารข้อกำหนดระบบซอฟต์แวร์ (SRS) ฉบับภาษาไทยมาตรฐาน", space_before=0, space_after=14, font_size=20, color_rgb=(30, 58, 138), bold=True)

    tbl_base = doc.add_table(1, 1)
    tbl_base.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl_base.autofit = False
    cell_b = tbl_base.cell(0, 0)
    cell_b.width = Mm(135)
    shd_b = parse_xml(f'<w:shd {nsdecls("w")} w:fill="1E3A8A"/>')
    cell_b._tc.get_or_add_tcPr().append(shd_b)
    p_b = cell_b.paragraphs[0]
    p_b.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_b.paragraph_format.space_before = Pt(4)
    p_b.paragraph_format.space_after = Pt(4)
    r_b = p_b.add_run("ฉบับปรับปรุงมาตรฐาน — เวอร์ชัน 1.1 DRAFT")
    set_run_font(r_b, size_pt=14, bold=True, color_rgb=(255, 255, 255))

    add_styled_p(doc, "", space_after=14)

    add_callout(doc, 
        "วันที่จัดทำ: 13 พฤศจิกายน 2026 | เอกสารฉบับร่างสำหรับกระบวนการทบทวนและขออนุมัติอย่างเป็นทางการ (Phase 1 Requirement Alignment)\n"
        "สถานะการควบคุม: Revised content baseline; formal stakeholder signatures pending. จัดทำขึ้นเพื่อกำหนดขอบเขตและจัดแนวความสอดคล้องระหว่าง Web Application และ Native Mobile Application (iOS / Android) ร่วมกับ Shared Backend Architecture คำว่า Baseline ไม่หมายความว่ามีการลงนามรับรองแล้วจนกว่าจะผ่านการตรวจรับขั้นสุดท้าย",
        title="[!] ประกาศการกำกับดูแลเอกสาร (Document Governance Notice)",
        border_color="D97706",
        bg_color="FEF3C7")

    meta_headers = ["รายการข้อมูล (Specification)", "รายละเอียด (Details)"]
    meta_rows = [
        ("รหัสเอกสาร (Document ID)", "IX-SRS-001"),
        ("ชั้นความลับ (Classification)", "เอกสารควบคุม • รอการลงนามอนุมัติจากผู้มีส่วนได้ส่วนเสีย (Controlled Document • Pending Sign-off)"),
        ("เวอร์ชันเอกสาร (Document Version)", "1.1 DRAFT (Phase 1: Requirement Alignment)"),
        ("แบบจำลองการส่งมอบ (Scope Model)", "R1 ระบบแกนหลัก (Core MVP) | R2 ระบบ AI ขั้นสูงและแอปมือถือ | R3 ระบบเชิงพาณิชย์และงานวิจัย"),
        ("สแตกเทคโนโลยีหลัก (Tech Stack)", "Next.js Responsive Web + Native Mobile (iOS/Android) + NestJS Modular API + FastAPI AI Service")
    ]
    create_table_from_data(doc, meta_headers, meta_rows, [55, 102], ['left', 'left'], special_rules={0: {'bold': True, 'color': (30, 41, 59)}})

    doc.add_page_break()

    # 2. FRONT MATTER
    add_heading_1(doc, "การควบคุมเอกสารและการอนุมัติ (Document Control & Approval)")
    ctrl_headers = ["หัวข้อการควบคุม", "รายละเอียด"]
    ctrl_rows = [
        ("รหัสเอกสาร (Document ID)", "IX-SRS-001"),
        ("เวอร์ชัน (Version)", "1.1 DRAFT"),
        ("สถานะ (Status)", "ฉบับร่างเพื่อการทบทวน — ระยะที่ 1: การปรับประสานข้อกำหนดระบบ (รอการลงนามอนุมัติ)"),
        ("เอกสารอ้างอิงต้นทาง (Sources)", "InterviewX_SRS_Final_For_Approval_v1.0.docx; InterviewX_FR_NFR_RBAC.xlsx; แบบสำรวจความต้องการ (n=102); ALL_DIAGRAMS.md; แนวทางการแยกแพลตฟอร์มในระยะที่ 1"),
        ("นโยบายการเปลี่ยนแปลง (Change Policy)", "การเปลี่ยนแปลงข้อกำหนดหลังจาก baseline v1.0 จะต้องบันทึกเป็น Change Request พร้อมผลกระทบ ขอบเขตแพลตฟอร์ม และผู้อนุมัติเสมอ"),
        ("กรอบการส่งมอบ (Scope Model)", "R1 Core MVP (Web Baseline & Mobile-Ready API); R2 Enhanced AI & Native Mobile; R3 Commercial & Research")
    ]
    create_table_from_data(doc, ctrl_headers, ctrl_rows, [45, 112], ['left', 'left'], special_rules={0: {'bold': True, 'color': (30, 41, 59)}})

    add_heading_2(doc, "บันทึกการลงนามอนุมัติ (Approval Record)")
    appr_headers = ["ตำแหน่งและบทบาทความรับผิดชอบ", "ชื่อ-นามสกุล / ลายมือชื่อ", "วันที่", "สถานะการพิจารณา"]
    appr_rows = [
        ("เจ้าของผลิตภัณฑ์ / ผู้สนับสนุนโครงการ (Product Owner / Sponsor)", "________________", "________", "รอการพิจารณา (Pending Review)"),
        ("หัวหน้าฝ่ายเทคนิค / สถาปนิกซอฟต์แวร์ (Technical Lead / Architect)", "________________", "________", "รอการพิจารณา (Pending Review)"),
        ("หัวหน้าทีมพัฒนาแอปมือถือ (Mobile Lead / Architect)", "________________", "________", "รอการพิจารณา (Pending Review)"),
        ("ผู้เชี่ยวชาญด้านกฎหมายและความเป็นส่วนตัว (Privacy / Legal Reviewer)", "________________", "________", "รอการพิจารณา (Pending Review)"),
        ("หัวหน้าฝ่ายประกันคุณภาพระบบ (QA / Acceptance Owner)", "________________", "________", "รอการพิจารณา (Pending Review)")
    ]
    create_table_from_data(doc, appr_headers, appr_rows, [55, 47, 25, 30], ['left', 'left', 'center', 'center'], special_rules={0: {'bold': True, 'color': (30, 41, 59)}})

    add_heading_1(doc, "สารบัญเนื้อหา (Table of Contents)")
    toc_items = [
        ("01", "1. บทนำและการกำกับดูแลเอกสาร (Introduction & Governance)"),
        ("02", "2. ข้อมูลหลักฐานและการวิเคราะห์ผู้มีส่วนได้ส่วนเสีย (Evidence & Stakeholder Analysis)"),
        ("03", "3. ขอบเขตระบบ ข้อสมมติ และแผนการส่งมอบ (System Scope, Assumptions & Delivery Plan)"),
        ("04", "4. บริบทระบบ กรณีการใช้งาน และการไหลของงาน (System Context, Use Cases & Workflows)"),
        ("05", "5. ข้อกำหนดเชิงหน้าที่ (Functional Requirements: FR01–FR36)"),
        ("06", "6. ข้อกำหนดที่ไม่ใช่เชิงหน้าที่ (Non-Functional Requirements: NFR01–NFR24)"),
        ("07", "7. การกำหนดสิทธิ์ผู้ใช้งานและการควบคุมการเข้าถึง (Role, Authorization & Entitlements: RBAC)"),
        ("08", "8. เลเยอร์ปัญญาประดิษฐ์และการประเมินผล (AI Layer, Inference & Evaluation Engine)"),
        ("09", "9. การคุ้มครองข้อมูลส่วนบุคคล ความเป็นส่วนตัว และข้อมูลวิจัย (Privacy, Consent & Research Data Governance)"),
        ("10", "10. การบริหารแพ็กเกจสมาชิก ระบบชำระเงิน และการคืนเงิน (Package, Payment & Refund Governance)"),
        ("11", "11. แบบจำลองข้อมูลและพจนานุกรมข้อมูล (Data Model & Data Dictionary)"),
        ("12", "12. สถาปัตยกรรมระบบ ส่วนต่อประสาน และการดำเนินงาน (Architecture, Interfaces & Operations)"),
        ("13", "13. การเชื่อมโยงข้อกำหนดและการตรวจสอบความถูกต้อง (Traceability & Verification)"),
        ("14", "14. ความเสี่ยง การตัดสินใจ และเงื่อนไขการอนุมัติ (Risks, Decisions & Approval Conditions)")
    ]
    tbl_toc = doc.add_table(rows=len(toc_items), cols=2)
    tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_toc.autofit = False
    for r_i, (num, title) in enumerate(toc_items):
        row_bg = "F8FAFC" if (r_i % 2 == 1) else "FFFFFF"
        c_n = tbl_toc.rows[r_i].cells[0]
        c_n.width = Mm(24)
        c_n._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{row_bg}"/>'))
        p_n = c_n.paragraphs[0]
        p_n.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_n = p_n.add_run(f"หมวด {num}")
        set_run_font(r_n, size_pt=12.5, bold=True, color_rgb=(30, 58, 138))
        
        c_t = tbl_toc.rows[r_i].cells[1]
        c_t.width = Mm(133)
        c_t._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{row_bg}"/>'))
        p_t = c_t.paragraphs[0]
        r_t = p_t.add_run(title)
        set_run_font(r_t, size_pt=14, bold=True, color_rgb=(30, 41, 59))
    doc.add_paragraph()

    doc.add_page_break()

    # 3. CHAPTER 1
    add_heading_1(doc, "1. บทนำและการกำกับดูแลเอกสาร (Introduction & Governance)")
    intro_text = (
        "InterviewX คือแพลตฟอร์มจำลองการสัมภาษณ์งานด้วยระบบปัญญาประดิษฐ์ (AI Mock Interview Platform) ที่ออกแบบขึ้นเพื่อสร้างโจทย์คำถามสัมภาษณ์ "
        "ประเมินคำตอบด้วยเกณฑ์รูบริก (Rubric) ที่อธิบายเหตุผลได้ และช่วยให้ผู้ใช้งานสามารถปรับปรุงทักษะการตอบสัมภาษณ์ได้อย่างเป็นรูปธรรมและต่อเนื่อง\n\n"
        "ในเวอร์ชัน 1.1 DRAFT นี้ ขอบเขตของแพลตฟอร์มได้รับการปรับปรุงโครงสร้างอย่างเป็นทางการเพื่อรองรับ 2 ส่วนติดต่อผู้ใช้ (Frontend Clients) "
        "ที่ทำงานร่วมกับสถาปัตยกรรมบริการหลังบ้านร่วมกัน (Shared Backend Architecture):\n"
        "1. เว็บแอปพลิเคชันแบบตอบสนอง (Responsive Web Application): พัฒนาด้วย Next.js รองรับการทำงานบนเดสก์ท็อป แท็บเล็ต และเว็บเบราว์เซอร์บนมือถือ ครอบคลุมผู้ใช้ทุกบทบาท\n"
        "2. แอปพลิเคชันบนอุปกรณ์เคลื่อนที่แบบเนทีฟ (Native Mobile Application): พัฒนาแยกติดตั้งสำหรับ iOS และ Android ออกแบบเฉพาะสำหรับกลุ่มผู้ใช้งานทั่วไป (End Users: Guest และ Registered User)\n\n"
        "ทั้งสองแพลตฟอร์มเชื่อมต่อไปยังระบบบริการหลังบ้านชุดเดียวกัน ผ่านจุดเชื่อมต่อบริการ (REST API) ที่มีความปลอดภัยสูง โดยไม่มีการสร้างฐานข้อมูลซ้ำซ้อนหรือเขียนตรรกะซ้ำซ้อน และสงวนฟังก์ชันผู้ดูแลระบบไว้เฉพาะบน Web Application เท่านั้น"
    )
    add_styled_p(doc, intro_text, space_after=6)

    add_callout(doc, 
        "เอกสารฉบับนี้เป็นข้อกำหนดเชิงบังคับสำหรับฟังก์ชันในรอบการส่งมอบที่ได้รับอนุมัติแล้วเท่านั้น; ข้อกำหนดในรอบ R2 และ R3 รวมถึงการเปิดตัว Native Mobile Application ยังไม่ถือเป็นพันธสัญญาบังคับของรอบ R1 ลำดับการบังคับใช้: ข้อกำหนดฉบับนี้ (v1.1 DRAFT เมื่อผ่านการอนุมัติ) > ข้อกำหนดหลักฐานเดิม (Baseline v1.0) > กรณีทดสอบอ้างอิง > เอกสารร่างเดิม ห้ามถือข้อความในเอกสารเดิมที่ขัดแย้งกันเป็นข้อกำหนดพร้อมกัน",
        title="[!] ลำดับการบังคับใช้ข้อกำหนด (Precedence & Authority)",
        border_color="1E3A8A", bg_color="EFF6FF")

    add_styled_p(doc, "คำศัพท์และคำย่อสำคัญ (Definitions & Acronyms):", font_size=15, bold=True, color_rgb=(15, 23, 42), space_before=4, space_after=2)
    defs_text = (
        "คำศัพท์สำคัญ: FR = ข้อกำหนดเชิงหน้าที่ (Functional Requirements); NFR = ข้อกำหนดที่ไม่ใช่เชิงหน้าที่ (Non-Functional Requirements); "
        "RBAC = การควบคุมการเข้าถึงตามบทบาท (Role-Based Access Control); Entitlement = สิทธิประโยชน์และโควตาตามแพ็กเกจสมาชิก (Free, Basic, Pro); "
        "Platform Scope = ขอบเขตการทำงานบน Web vs. Native Mobile; RLS = ความปลอดภัยระดับแถวข้อมูล (Row-Level Security); STT = การแปลงเสียงเป็นข้อความ (Speech-to-Text); "
        "HIG = แนวทางการออกแบบของ Apple (Human Interface Guidelines); IAP = การชำระเงินในแอป (In-App Purchase); APNs/FCM = ระบบพุชแจ้งเตือนทางมือถือ; "
        "Keystore/Keychain = กลไกจัดเก็บกุญแจความลับระดับฮาร์ดแวร์; P95 = เปอร์เซ็นไทล์ที่ 95 ของเวลาตอบสนอง; UAT = การทดสอบการยอมรับของผู้ใช้; R1/R2/R3 = รอบการส่งมอบ 1/2/3"
    )
    add_styled_p(doc, defs_text, space_after=8)

    # 4. CHAPTER 2
    add_heading_1(doc, "2. ข้อมูลหลักฐานและการวิเคราะห์ผู้มีส่วนได้ส่วนเสีย (Evidence & Stakeholder Analysis)")
    add_styled_p(doc, "ฐานข้อมูลการสำรวจ: รวบรวมจากกลุ่มตัวอย่างผู้หางานจริงจำนวน 102 คน (n=102) ผ่าน 22 ตัวแปรคำถาม เพื่อใช้เป็นหลักฐานเชิงประจักษ์ (Descriptive Evidence) สนับสนุนการออกแบบระบบ:", space_after=6)

    survey_headers = ["ฟีเจอร์ที่ต้องการจาก Survey", "จำนวนผู้เลือก (n=102)", "คิดเป็นร้อยละ (%)"]
    survey_rows = [
        ("จำลองคำถามเฉพาะประเภทตำแหน่งงาน", 94, "92.2%"),
        ("วิเคราะห์ทักษะการสื่อสารและความมั่นใจ", 67, "65.7%"),
        ("รายงานคะแนนและผลฟีดแบ็กอย่างละเอียด", 58, "56.9%"),
        ("ตรวจสอบไวยากรณ์และความถูกต้องของภาษาอังกฤษ", 57, "55.9%"),
        ("วิเคราะห์เนื้อหาความตรงประเด็นของคำตอบ", 55, "53.9%"),
        ("ฝึกจำลองการสัมภาษณ์ด้วยเสียงพูด", 38, "37.3%"),
        ("ปรับระดับความยากของคำถามสัมภาษณ์", 35, "34.3%"),
        ("แดชบอร์ดติดตามพัฒนาการและแนวโน้มคะแนน", 30, "29.4%")
    ]
    create_table_from_data(doc, survey_headers, survey_rows, [85, 36, 36], ['left', 'center', 'center'],
        special_rules={
            0: {'bold': True, 'color': (15, 23, 42)},
            2: {'bold': True, 'color': (30, 58, 138)}
        })

    add_callout(doc,
        "ผู้ตอบแบบสำรวจจำนวน 84 จาก 102 คน (82.4%) ระบุความต้องการใช้งานระบบอย่างต่อเนื่องทั้งบนคอมพิวเตอร์ (Web) และบนโทรศัพท์มือถือ (Mobile)\n"
        "แนวทางการส่งมอบ: ในรอบ R1 ระบบเปิดตัวบน Responsive Web Application เพื่อความรวดเร็วและครอบคลุมทุกอุปกรณ์ พร้อมทั้งออกแบบ REST API บริการหลังบ้านให้พร้อมรองรับ Native Mobile Application (iOS / Android) ซึ่งมีแผนเปิดตัวในรอบ R2 ควบคู่กับระบบสัมภาษณ์ด้วยเสียง (ตามการตัดสินใจ D-M01)",
        title="[i] ข้อมูลหลักฐานสนับสนุนการพัฒนาข้ามแพลตฟอร์ม (Cross-Platform Evidence)",
        border_color="0284C7", bg_color="F0F9FF")

    add_styled_p(doc, 
        "กลุ่มผู้มีส่วนได้ส่วนเสีย (Stakeholders):\n"
        "1. ผู้ฝึกสัมภาษณ์งาน (Candidates / End Users): ใช้งานผ่าน Responsive Web และ Native Mobile เพื่อฝึกสัมภาษณ์และพัฒนาตนเอง\n"
        "2. พันธมิตรวิชาการและการศึกษา (Academic / Researcher Partners): เข้าถึงชุดข้อมูลวิจัยแบบนิรนามจำกัดเฉพาะบน Web Application เท่านั้น\n"
        "3. ผู้ดูแลระบบและวิศวกร (System Administrators & Ops): บริหารจัดการระบบ คลังคำถาม และ Audit Logs ผ่าน Web Application เท่านั้น\n"
        "4. ผู้ดูแลการเงินและบัญชี (Payment & Finance Administrators): จัดการแพ็กเกจสมาชิกและตรวจสอบรายการเงินคืนผ่าน Web Application เท่านั้น",
        space_after=8)

    doc.add_page_break()

    # 5. CHAPTER 3
    add_heading_1(doc, "3. ขอบเขตระบบ ข้อสมมติ และแผนการส่งมอบ (System Scope, Assumptions & Delivery Plan)")
    add_styled_p(doc, "ตารางการจัดสรรขอบเขตการทำงานจำแนกตามแพลตฟอร์มและรอบการส่งมอบ (Release Plan):", space_after=6)

    scope_headers = ["หมวดหมู่ฟังก์ชันงาน", "รอบ R1: Core MVP", "รอบ R2: Enhanced AI & Mobile", "รอบ R3: Commercial & Research"]
    scope_rows = [
        ("เว็บแอปพลิเคชัน (Web App)", "หน้าหลัก, สมัครสมาชิก, สัมภาษณ์ข้อเขียน, ผลประเมิน AI, ประวัติ, คอนโซล Admin", "สัมภาษณ์ด้วยเสียง (Web Audio), วิเคราะห์เสียงพูด, แดชบอร์ดสรุปผล", "พอร์ทัลผู้ดูแลการเงิน, พอร์ทัลวิจัย, ระบบชำระเงิน Web Checkout"),
        ("แอปมือถือเนทีฟ (Native Mobile)", "เตรียม API หลังบ้านให้พร้อมรองรับ (Mobile-Ready Backend API)", "เปิดตัวแอปบน iOS และ Android: สัมภาษณ์ (ข้อความ/เสียง), รับผลประเมิน, ซิงก์ 100%", "ดูข้อมูลแพ็กเกจสมาชิก, ตรวจสอบโควตา (ระบบชำระเงินขึ้นกับ D-M04)"),
        ("สถาปัตยกรรมบริการหลังบ้าน", "NestJS Core API, FastAPI AI Inference, PostgreSQL, Redis/BullMQ, OpenTelemetry", "เพิ่ม MinIO/S3 สำหรับไฟล์เสียง, โมดูล STT, รองรับโทเค็นความปลอดภัยบนมือถือ", "ระบบบิลลิ่งและบัญชีโควตา (USAGE_LEDGER), ไปป์ไลน์ส่งมอบข้อมูลวิจัย")
    ]
    create_table_from_data(doc, scope_headers, scope_rows, [35, 40, 42, 40], ['left', 'left', 'left', 'left'],
        special_rules={0: {'bold': True, 'color': (30, 58, 138)}})

    add_callout(doc,
        "1. การเก็บโทเค็นบนมือถือ: บังคับใช้ iOS Keychain และ Android Keystore เท่านั้น ห้ามจัดเก็บในหน่วยความจำทั่วไป\n"
        "2. ความทนทานต่อเครือข่ายมือถือ: การส่งคำตอบสัมภาษณ์ต้องมี Idempotency Key ทุกครั้ง ป้องกันการบันทึกซ้ำกรณีสัญญาณหลุด\n"
        "3. การประมวลผล AI: รันบนคลาวด์เซิร์ฟเวอร์เท่านั้น (Server-Side Inference) ห้ามรัน On-device LLM บนมือถือใน R1/R2\n"
        "4. การล้างแคชไฟล์เสียง: แคชเสียงบนเครื่องมือถือต้องถูกลบทิ้งทันทีเมื่ออัปโหลดสำเร็จ หรือจำกัดอายุไม่เกิน 24 ชม.\n"
        "5. การปฏิบัติตามกฎระเบียบของ Store: ต้องมีปุ่มขอลบบัญชีในแอปมือถือ และจัดทำ Privacy Nutrition Labels ครบถ้วน",
        title="[*] ข้อสมมติสำคัญด้านเทคนิคและแอปพลิเคชันมือถือ (System Assumptions)",
        border_color="059669", bg_color="ECFDF5")

    # 6. CHAPTER 4
    add_heading_1(doc, "4. บริบทระบบ กรณีการใช้งาน และการไหลของงาน (System Context, Use Cases & Workflows)")
    add_styled_p(doc, "สรุปกรณีการใช้งานหลัก (Core Use Cases Summary):", space_after=6)

    uc_headers = ["รหัสกรณีการใช้งาน", "ชื่อกรณีการใช้งาน", "บทบาทผู้ใช้หลัก", "แพลตฟอร์มที่รองรับ", "รอบการส่งมอบ"]
    uc_rows = [
        ("UC01", "สำรวจและทดลองใช้งานระบบเบื้องต้น", "Guest", "Web Application & Native Mobile", "R1"),
        ("UC02", "ลงทะเบียนและเข้าสู่ระบบด้วยอีเมล", "Guest / Registered User", "Web Application & Native Mobile", "R1"),
        ("UC03", "ตั้งค่าโปรไฟล์และกำหนดเป้าหมายการฝึกซ้อม", "Registered User", "Web Application & Native Mobile", "R1"),
        ("UC04", "ดำเนินการฝึกสัมภาษณ์แบบข้อเขียน", "Registered User", "Web Application & Native Mobile", "R1"),
        ("UC05", "ดำเนินการฝึกสัมภาษณ์ด้วยเสียงพูด", "Registered User", "Web Application & Native Mobile", "R2"),
        ("UC06", "ตรวจสอบผลการประเมินและข้อเสนอแนะ AI", "Registered User", "Web Application & Native Mobile", "R1"),
        ("UC07", "ตรวจสอบประวัติการฝึกซ้อมและแดชบอร์ด", "Registered User", "Web Application & Native Mobile", "R1 (Dashboard R2)"),
        ("UC08", "จัดการความยินยอมและสิทธิ์คุ้มครองข้อมูล", "Registered User", "Web Application & Native Mobile", "R1"),
        ("UC09", "บริหารจัดการการเงินและรายการคืนเงิน", "Finance Admin", "เฉพาะบน Web Application เท่านั้น", "R3"),
        ("UC10", "บริหารจัดการระบบและคลังคำถามส่วนกลาง", "System Admin", "เฉพาะบน Web Application เท่านั้น", "R1")
    ]
    create_table_from_data(doc, uc_headers, uc_rows, [22, 50, 35, 35, 15], ['center', 'left', 'left', 'left', 'center'],
        special_rules={
            0: {'bold': True, 'color': (30, 58, 138)},
            4: {'bold': True, 'color': (15, 23, 42)}
        })

    doc.add_page_break()

    # 7. CHAPTER 5: FUNCTIONAL REQUIREMENTS
    add_heading_1(doc, "5. ข้อกำหนดเชิงหน้าที่ (Functional Requirements: FR01–FR36)")
    add_styled_p(doc, "ข้อกำหนดเชิงหน้าที่ทั้งหมด 40 รายการ คงรหัสเดิมและระบุขอบเขตแพลตฟอร์มอย่างชัดเจน โดยมีรายละเอียดดังนี้:", space_after=8)

    fr_map_th = {
        'FR01': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR02': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR03': 'ใช้งานร่วมกันทั้ง Web และ Mobile',
        'FR04': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR05': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR05-V': 'ใช้งานร่วมกันทั้ง Web และ Mobile',
        'FR05.1': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR06': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR07': 'ใช้งานร่วมกันทั้ง Web และ Mobile',
        'FR08': 'เฉพาะบนเว็บเท่านั้น (Admin Only)', 'FR09': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR10': 'เฉพาะบนเว็บเท่านั้น (Admin Console)',
        'FR11': 'ใช้งานร่วมกัน (ผู้ใช้) / เฉพาะเว็บ (ผู้ดูแลระบบ)', 'FR12': 'ใช้งานร่วมกัน (ผู้ใช้) / เฉพาะเว็บ (ผู้ดูแลระบบ)',
        'FR13': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR14': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR15': 'ใช้งานร่วมกันทั้ง Web และ Mobile',
        'FR16': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR17': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR18': 'ใช้งานร่วมกันทั้ง Web และ Mobile',
        'FR18.1': 'เฉพาะบนเว็บเท่านั้น (Admin / Researcher)', 'FR19': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR20': 'ใช้งานร่วมกันทั้ง Web และ Mobile',
        'FR21': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR22': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR23': 'ใช้งานร่วมกันทั้ง Web และ Mobile',
        'FR24': 'เฉพาะบนเว็บเท่านั้น (Admin Console)', 'FR25': 'เฉพาะบนเว็บ (Admin) / ในแอป (User)', 'FR26': 'เฉพาะบนเว็บ (Admin Viewer) / บันทึกทุกคำขอ',
        'FR27': 'ใช้งานร่วมกันทั้ง Web และ Mobile (รอตัดสินใจ D-M04)', 'FR28': 'ใช้งานร่วมกันทั้ง Web และ Mobile (รอตัดสินใจ D-M05)',
        'FR29': 'ส่วนบริการหลังบ้านร่วมกัน (Shared Backend)', 'FR30': 'เฉพาะบนเว็บเท่านั้น (Admin Only)', 'FR31': 'เฉพาะบนเว็บเท่านั้น (Admin Only)',
        'FR32': 'เฉพาะบนเว็บเท่านั้น (Admin Only)', 'FR33': 'ใช้งานร่วมกันทั้ง Web และ Mobile', 'FR34': 'เฉพาะบนเว็บเท่านั้น (Admin Only)',
        'FR35': 'ใช้งานร่วมกัน (ผู้ใช้) / เฉพาะเว็บ (เจ้าหน้าที่)', 'FR36': 'ใช้งานร่วมกันทั้ง Web และ Mobile'
    }

    # Extract FR items from backup docx paragraphs
    i = 64
    while i < 185:
        p_text = src_doc.paragraphs[i].text.strip()
        if p_text.startswith("FR") and (" — " in p_text or " - " in p_text):
            title = p_text
            line_meta = src_doc.paragraphs[i+1].text.strip()
            line_req = src_doc.paragraphs[i+2].text.strip()
            line_ac = src_doc.paragraphs[i+3].text.strip()
            
            # Match FR ID for platform tag
            fr_id = title.split(" ")[0].strip()
            plat_tag = fr_map_th.get(fr_id, "ใช้งานร่วมกันทั้ง Web และ Mobile")
            line_meta = f"{line_meta} | แพลตฟอร์ม: {plat_tag}"
            
            if "FR15" in title:
                title = "FR15 — การเข้าถึงข้ามแพลตฟอร์มและความสอดคล้องของระบบ (Multi-Platform Access & Consistency)"
                line_meta = "ระยะ: R1 (Web) / R2 (Mobile) | ความสำคัญ: Must | ที่มา: Survey 84 both; Phase 1 Platform Alignment | แพลตฟอร์ม: ใช้งานร่วมกันทั้ง Web และ Mobile"
                line_req = (
                    "ระบบต้องให้บริการผ่าน 2 ส่วนหน้าหลักที่ทำงานร่วมกับระบบบริการหลังบ้านศูนย์กลาง (Shared Backend Architecture): "
                    "1. Responsive Web Application: รองรับการทำงานบน Desktop, Tablet และ Mobile Browser สำหรับทุกกลุ่มบทบาทผู้ใช้งาน (Guest, Registered User, Researcher, Finance Admin, System Admin) "
                    "2. Native Mobile Application: แอปพลิเคชันแยกติดตั้งบนระบบปฏิบัติการ iOS และ Android ออกแบบเฉพาะสำหรับ End Users (Guest, Registered User) รองรับสิทธิ์การใช้งานตามระดับแพ็กเกจ (Free, Basic, Pro) "
                    "ทั้งสองแพลตฟอร์มต้องใช้ระบบยืนยันตัวตนเดียวกัน ข้อมูลบัญชี ประวัติการฝึกสัมภาษณ์ และสิทธิ์แพ็กเกจต้องซิงก์ตรงกันอย่างสมบูรณ์แบบ 100% "
                    "และมีระบบควบคุมสิทธิ์จำกัดหน้าจอผู้ดูแลระบบ (Admin) และนักวิจัย (Researcher) ให้เข้าถึงได้เฉพาะบน Web Application เท่านั้น"
                )
                line_ac = (
                    "1. AC-FR15-01 (Web Layout): Responsive Web Application แสดงผลถูกต้องและใช้งานได้สมบูรณ์บน Viewport ตั้งแต่ 360px จนถึง 4K Desktop มุ่งสู่มาตรฐาน WCAG 2.2 AA\n"
                    "2. AC-FR15-02 (Mobile OS Support): Native Mobile Application ติดตั้งและทำงานได้สมบูรณ์บน iOS 16.0+ และ Android 13.0+ (API 33)\n"
                    "3. AC-FR15-03 (Unified Auth): ผู้ใช้เข้าสู่ระบบด้วยข้อมูลประจำตัวเดียวกันทั้งบน Web และ Mobile และเมื่อเปลี่ยนรหัสผ่านบนเครื่องหนึ่ง เซสชันบนเครื่องอื่นต้องถูกบังคับให้ยืนยันตัวตนใหม่ตามรอบ\n"
                    "4. AC-FR15-04 (100% Data Sync): เซสชันสัมภาษณ์และคะแนนฟีดแบ็กซิงก์ตรงกัน 100% ระหว่าง Web และ Mobile (ความคลาดเคลื่อน 0%)\n"
                    "5. AC-FR15-05 (Admin Web-Only): ผู้ใช้บทบาท Researcher, Finance Admin หรือ System Admin เข้าสู่ระบบบน Native Mobile จะถูกปฏิเสธและแจ้งเตือนให้เข้าใช้บนเว็บเท่านั้น\n"
                    "6. AC-FR15-06 (Atomic Quota): การหักโควตาเซสชันกระทำแบบ Atomic บน USAGE_LEDGER ที่เซิร์ฟเวอร์หลังบ้าน ป้องกัน Race Condition\n"
                    "7. AC-FR15-07 (Network Resilience): เมื่อสัญญาณมือถือหลุดขณะตอบสัมภาษณ์ ระบบจะแคชคำตอบไว้ในเครื่อง และส่งคำตอบพร้อม Idempotency-Key เมื่อสัญญาณกลับมา โดยเซิร์ฟเวอร์ประมวลผลเพียงครั้งเดียว"
                )
            
            add_fr_item_th(doc, title, line_meta, line_req, line_ac)
            i += 4
        else:
            i += 1

    doc.add_page_break()

    # 8. CHAPTER 6: NON-FUNCTIONAL REQUIREMENTS
    add_heading_1(doc, "6. ข้อกำหนดที่ไม่ใช่เชิงหน้าที่ (Non-Functional Requirements: NFR01–NFR24)")
    add_styled_p(doc, "ตารางข้อกำหนดที่ไม่ใช่เชิงหน้าที่ทั้ง 24 รายการ พร้อมการวิเคราะห์เป้าหมายแพลตฟอร์มและข้อพิจารณาบนอุปกรณ์เคลื่อนที่:", space_after=6)

    nfr_headers = ["รหัส (ID)", "หัวข้อ (Topic)", "สรุปสาระสำคัญของข้อกำหนด (Summary)", "เป้าหมายแพลตฟอร์มและข้อพิจารณาบนมือถือ", "วิธีการตรวจสอบ"]
    nfr_rows = [
        ("NFR01", "Security & Encryption", "เข้ารหัสข้อมูลขณะส่งผ่านด้วย TLS 1.3 และข้อมูลจัดเก็บด้วย AES-256; รหัสผ่านเข้ารหัสด้วย Argon2id หรือ bcrypt",
         "Shared: Web เก็บ Token ใน HTTP-only cookies; Mobile เก็บ Token ใน iOS Keychain / Android Keystore", "Security Review, Pen-Test"),
        ("NFR02", "AI Explainability", "การให้คะแนนอิงตาม Rubric ที่อธิบายได้; ผลลัพธ์การประเมินมี Evidence ชี้จุดอ้างอิงจากคำตอบ",
         "Shared AI: เกณฑ์รูบริกและโมเดล AI ทำงานบนเซิร์ฟเวอร์มาตรฐานเดียวกันทั้ง Web และ Mobile", "Golden Dataset Benchmark"),
        ("NFR03", "Usability", "ผู้ใช้ใหม่สามารถเริ่มสัมภาษณ์ครั้งแรกได้ภายใน 3 นาที; ค่า SUS >= 70",
         "Shared: ออกแบบ UI/UX ให้ใช้งานง่ายทั้งบน Desktop Mouse/Keyboard และ Mobile Touchscreen", "Usability Testing (SUS Questionnaire)"),
        ("NFR04", "Performance", "การตอบสนองทั่วไป P95 <= 2s (Web) และ <= 2.5s (Mobile); ผลประเมิน AI P95 <= 15s; เวลาเปิดแอปมือถือ <= 2s",
         "Shared: เวลาตอบสนองแยกตามประเภทเครือข่าย; มีระบบแจ้งสถานะการประมวลผลบนมือถือ", "Load Testing (k6 / Artillery)"),
        ("NFR05", "Availability", "ระบบมีความพร้อมใช้งานไม่ต่ำกว่า 99.5% ในช่วงเวลาทำการ",
         "Shared Backend: ความพร้อมใช้งานของ Unified API Gateway ครอบคลุมคำขอจากทุกไคลเอนต์", "Uptime Monitoring SLA"),
        ("NFR06", "Cost & Budget", "คำนวณและควบคุมต้นทุน AI ต่อเซสชัน; มีขีดจำกัดงบประมาณรายวัน",
         "Shared: ระบบติดตาม Token รวมศูนย์ทั้งจาก Web และ Mobile", "Cost Dashboard Review"),
        ("NFR07", "Localization", "รองรับภาษาไทยและภาษาอังกฤษอย่างสมบูรณ์แบบ ทั้ง UI, คำถาม และการวิเคราะห์",
         "Shared: ตรวจสอบความถูกต้องของคำแปลและ Layout ทั้งบน Web และ Mobile", "Localization Sign-off"),
        ("NFR08", "Accessibility & Consistency", "รองรับ WCAG 2.2 AA (เว็บ), VoiceOver / TalkBack (มือถือ) และรับประกันความสอดคล้องของข้อมูลข้ามแพลตฟอร์ม 100%",
         "Shared: Web รองรับ WCAG 2.2 AA; Mobile รองรับ Dynamic Type / Screen Readers; ซิงก์ข้อมูล 100%", "A11y Audit & Sync Verification"),
        ("NFR09", "Audio Privacy", "ไฟล์เสียงดิบถูกทำลายใน <= 24 ชม. สำหรับผู้ใช้ทั่วไป (ยินยอม <= 90 วัน); ผู้ใช้ขอลบข้อมูลได้ตลอดเวลา",
         "Shared: แคชไฟล์เสียงบนเครื่องมือถือต้องถูกลบทิ้งทันทีหลังอัปโหลดเสร็จสิ้น", "Storage Lifecycle Verification"),
        ("NFR10", "Payment Security", "ชำระเงินผ่าน Hosted Payment Gateway / Native IAP; ห้ามจัดเก็บ PAN/CVV บนเซิร์ฟเวอร์หรืออุปกรณ์เด็ดขาด",
         "Shared: ไคลเอนต์ไม่มีการเข้าถึงข้อมูลบัตรเครดิต; เป็นไปตาม PCI-DSS SAQ-A", "Payment Integration Audit"),
        ("NFR11", "Webhook Security", "ตรวจสอบลายเซ็น HMAC และป้องกัน Replay Attack สำหรับ Payment Webhook",
         "Shared Backend: ตรวจสอบ Timestamp และ Provider Event ID บนเซิร์ฟเวอร์หลังบ้าน", "HMAC Verification Tests"),
        ("NFR12", "Idempotency", "ใช้ Idempotency Key ในทุกคำขอที่สร้างหรือแก้ไขทรัพยากร ป้องกันการทำรายการซ้ำซ้อน",
         "Shared: ไคลเอนต์มือถือส่ง Idempotency-Key ทุกครั้งเพื่อป้องกันปัญหาเครือข่ายหลุด", "Network Drop Simulation"),
        ("NFR13", "Checkout Latency", "การส่งต่อไปยังระบบชำระเงิน P95 <= 5s ทั้งบนเว็บและมือถือ",
         "Shared: การเชื่อมต่อ API เกตเวย์ชำระเงินทำงานรวดเร็ว", "Latency Monitoring"),
        ("NFR14", "Payment Resilience", "ระบบสลับการทำงานสำรองกรณีเกตเวย์ชำระเงินหลักขัดข้อง",
         "Shared Backend: บริหารจัดการการสลับระบบชำระเงินจากศูนย์กลาง", "Failover Simulation Drill"),
        ("NFR15", "Financial Audit", "บันทึกประวัติการทำธุรกรรมทางการเงินแบบ Immutable ตรวจสอบย้อนหลังได้ 100%",
         "Web Only: หน้าจอตรวจสอบประวัติธุรกรรมจำกัดเฉพาะ Finance Admin บนเว็บเท่านั้น", "Audit Trail Verification"),
        ("NFR16", "Tax Compliance", "ออกใบเสร็จรับเงินทางภาษีถูกต้องตามกฎหมาย และแอปมือถือปฏิบัติตามกฎ App Store",
         "Shared: ระบบหลังบ้านออกใบเสร็จภาษี; แอปมือถือปฏิบัติตามกฎเกณฑ์ Store", "Legal & Tax Compliance Audit"),
        ("NFR17", "Research Privacy", "ข้อมูลวิจัยต้องผ่านการสกัดแบบคงความเป็นส่วนตัว (Cell Size >= 10 คน)",
         "Web Only: เครื่องมือสืบค้นและส่งออกข้อมูลวิจัยจำกัดเฉพาะบนเว็บเท่านั้น", "Differential Privacy Code Audit"),
        ("NFR18", "Raw Audio Isolation", "Private Object Storage บล็อกการดาวน์โหลดไฟล์เสียงดิบสำหรับผู้วิจัยและผู้ดูแลทั่วไป 100%",
         "Shared Backend: สิทธิ์ระดับ Bucket บล็อกการเข้าถึงไฟล์เสียงโดยตรง", "IAM Policy Review"),
        ("NFR19", "Authorization & IDOR", "บังคับใช้ RBAC และตรวจสอบความเป็นเจ้าของข้อมูลที่เซิร์ฟเวอร์หลังบ้าน 100% ไม่เชื่อถือไคลเอนต์",
         "Shared Backend: ตรวจสอบสิทธิ์ทุก Endpoint ป้องกัน IDOR เด็ดขาด", "Automated IDOR & Auth Test Suite"),
        ("NFR20", "Prompt Injection Defense", "ตรวจสอบและสกัดกั้น Prompt Injection ที่ฝั่งเซิร์ฟเวอร์ก่อนส่งไปยังโมเดล AI",
         "Shared AI: คัดกรองและตรวจสอบ JSON Schema ก่อนส่งกลับไปยังไคลเอนต์", "Red-Team Test Prompts"),
        ("NFR21", "Model Governance", "บันทึกเวอร์ชัน Model, Prompt และ Rubric กำกับไว้ในทุกผลการประเมินแบบไม่สามารถแก้ไขได้",
         "Shared AI: Version Registry ส่วนกลางเพื่อให้สามารถตรวจสอบย้อนหลังได้ 100%", "CI Benchmark Report"),
        ("NFR22", "Scalability", "รองรับผู้ใช้งานพร้อมกัน 100 Concurrent Active Users โดยมี Failure Rate <= 1%",
         "Shared Infra: รองรับภาระงานรวมจากทั้ง Web และ Native Mobile Applications", "Concurrency Load Test"),
        ("NFR23", "Disaster Recovery", "RPO <= 24 ชม. และ RTO <= 8 ชม. พร้อมการซักซ้อมกู้คืนระบบประจำไตรมาส",
         "Shared Database: สำรองข้อมูลหลักอย่างสม่ำเสมอ ครอบคลุมข้อมูลผู้ใช้ทุกแพลตฟอร์ม", "Quarterly Restore Drill"),
        ("NFR24", "Observability", "ส่งผ่าน Correlation ID ติดตามคำขอตั้งแต่ไคลเอนต์เข้าสู่ระบบศูนย์กลาง",
         "Shared: รวบรวม Logs, Metrics, Traces และ Mobile Crash Reports สู่ศูนย์กลาง", "Observability Walkthrough")
    ]
    create_table_from_data(doc, nfr_headers, nfr_rows, [16, 32, 45, 36, 28], ['center', 'left', 'left', 'left', 'left'],
        special_rules={
            0: {'bold': True, 'color': (30, 58, 138)},
            1: {'bold': True, 'color': (30, 41, 59)}
        })

    add_callout(doc,
        "ค่ากำหนดเชิงตัวเลขในหัวข้อนี้ (เช่น Web WCAG 2.2 AA, Mobile Screen Readers, ความสอดคล้องของข้อมูล 100%, และ Latency บนเครือข่ายมือถือ) "
        "เป็นเป้าหมายที่เสนอสำหรับการทดสอบ (Proposed Targets — Pending Approval) ไม่ใช่ค่าที่อนุมานจากแบบสอบถาม; ก่อนขึ้นระบบ Production Launch ต้องมีผลทดสอบบันทึกประกอบอย่างเป็นทางการ",
        title="[i] คำชี้แจงเป้าหมายการทดสอบ NFR (Acceptance Targets Notice)",
        border_color="2563EB", bg_color="EFF6FF")

    doc.add_page_break()

    # 9. CHAPTER 7: RBAC
    add_heading_1(doc, "7. การกำหนดสิทธิ์ผู้ใช้งานและการควบคุมการเข้าถึง (Role, Authorization & Entitlements: RBAC)")
    add_styled_p(doc, 
        "สถาปัตยกรรมความปลอดภัยของ InterviewX ได้แบ่งแยกแนวคิด 3 มิติออกจากกันอย่างชัดเจน:\n"
        "1. บทบาทความปลอดภัย (Security Role): ตัวกำหนดสิทธิ์การเข้าถึงทรัพยากร (Guest, Registered User, Researcher, Finance Admin, System Admin)\n"
        "2. สิทธิประโยชน์ตามแพ็กเกจ (Subscription Entitlement): ตัวกำหนดโควตาและฟีเจอร์ทางธุรกิจ (Free, Basic, Pro) ซึ่งไม่ใช่ Security Role โดยผู้ใช้ทุกคนมีบทบาทความปลอดภัยเดียวกันคือ Registered User\n"
        "3. ขอบเขตแพลตฟอร์ม (Platform Scope): สภาพแวดล้อมส่วนติดต่อผู้ใช้ที่ได้รับอนุญาตให้เข้าถึงฟังก์ชันนั้นๆ (Web Application หรือ Native Mobile Application)",
        space_after=6)

    add_heading_2(doc, "7.1 ตารางการเข้าถึงแพลตฟอร์มตามบทบาทความปลอดภัย (Platform Access Matrix: Role × Platform)")
    pam_headers = ["บทบาทความปลอดภัย (Security Role)", "Web Application", "Native Mobile (iOS/Android)", "ขอบเขตการใช้งานและขอบเขตทางเทคนิค", "สถานะการอนุญาต"]
    pam_rows = [
        ("Guest (ผู้เยี่ยมชม)", "ทำได้", "ทำได้", "หน้าหลัก, แนะนำระบบ, สำรวจหมวดหมู่สัมภาษณ์ และทดลองทำข้อสอบ 1 ข้อ (Trial Session) หากเปิดใช้งาน", "อนุมัติตาม Baseline v1.0"),
        ("Registered User (ผู้ใช้ทั่วไป)", "ทำได้", "ทำได้", "ฝึกสัมภาษณ์เต็มรูปแบบ (ข้อความและเสียง), ประวัติ, ผลประเมิน AI, แดชบอร์ด, จัดการโปรไฟล์และความยินยอม PDPA", "อนุมัติตาม Baseline v1.0"),
        ("Researcher (ผู้วิจัย)", "ทำได้", "ไม่ได้ (เด็ดขาด)", "เข้าถึงชุดข้อมูลวิจัยรวมที่ได้รับอนุมัติ; นอกขอบเขตของ Native Mobile โดยเด็ดขาดเพื่อป้องกันข้อมูลวิจัยรั่วไหล", "อนุมัติตาม Baseline v1.0"),
        ("Payment / Finance Admin", "ทำได้", "ไม่ได้ (เด็ดขาด)", "เข้าถึงแดชบอร์ดการเงิน บัญชีแยกประเภท ตรวจสอบและอนุมัติการคืนเงิน; จำกัดเฉพาะบน Web Application เท่านั้น", "อนุมัติตาม Baseline v1.0"),
        ("System Admin (ผู้ดูแลระบบ)", "ทำได้", "ไม่ได้ (เด็ดขาด)", "บริหารระบบ คลังคำถาม เวอร์ชันเกณฑ์รูบริกและโมเดล AI มอบหมายสิทธิ์ผู้ใช้ และ Audit Logs; จำกัดเฉพาะบนเว็บเท่านั้น", "อนุมัติตาม Baseline v1.0")
    ]
    create_table_from_data(doc, pam_headers, pam_rows, [28, 22, 26, 56, 25], ['left', 'center', 'center', 'left', 'center'],
        special_rules={
            0: {'bold': True, 'color': (30, 58, 138)},
            1: {'bold': True, 'color': (16, 185, 129)},
            2: {'bold': True, 'color': (220, 38, 38)}
        })

    add_heading_2(doc, "7.2 ตารางสิทธิ์การใช้งานตามระดับแพ็กเกจสมาชิก (Subscription Entitlement Matrix: Tier × Platform)")
    sub_headers = ["ระดับแพ็กเกจสมาชิก", "การใช้งานบน Web", "การใช้งานบน Mobile", "สิทธิประโยชน์และโควตาการใช้งานที่เสนอ (Feature Entitlements)", "กลไกการบังคับใช้สิทธิ์ (Enforcement)"]
    sub_rows = [
        ("Free Tier", "ใช้งานได้ตามสิทธิ์", "ใช้งานได้ตามสิทธิ์", "สัมภาษณ์ข้อความ 5 เซสชัน/เดือน (รอ D05), 1 หมวดหมู่หลัก, รูบริกมาตรฐาน AI, ไม่รองรับเสียง (0 เซสชัน), ประวัติมาตรฐาน, ไม่ต้องผูกบัตร", "บันทึกแบบ Atomic ที่หลังบ้าน (USAGE_LEDGER) ซิงก์ข้ามทุกอุปกรณ์"),
        ("Basic Tier", "ใช้งานได้ตามสิทธิ์", "ใช้งานได้ตามสิทธิ์", "สัมภาษณ์ข้อความ 30 เซสชัน/เดือน, สัมภาษณ์เสียง 10 เซสชัน/เดือน, ครอบคลุมทุกหมวดหมู่, วิเคราะห์ไวยากรณ์เบื้องต้น, แดชบอร์ดพัฒนาการ", "ตรวจสอบโควตาแบบ Atomic ที่เซิร์ฟเวอร์หลังบ้านขณะสร้างเซสชันผ่าน API"),
        ("Pro Tier", "ใช้งานได้ตามสิทธิ์", "ใช้งานได้ตามสิทธิ์", "สัมภาษณ์ข้อความไม่จำกัด (ใต้นโยบาย Fair Use), สัมภาษณ์เสียงไม่จำกัด, วิเคราะห์จังหวะการพูดขั้นสูง, โหมดกดดัน, คิวประมวลผล AI พิเศษ", "ตรวจสอบโควตา Atomic ร่วมกับ Rate-Limiter นโยบาย Fair Use บนเซิร์ฟเวอร์")
    ]
    create_table_from_data(doc, sub_headers, sub_rows, [22, 24, 24, 52, 35], ['center', 'center', 'center', 'left', 'left'],
        special_rules={
            0: {'bold': True, 'color': (37, 99, 235)},
            1: {'bold': True, 'color': (16, 185, 129)},
            2: {'bold': True, 'color': (16, 185, 129)}
        })

    add_heading_2(doc, "7.3 กฎเกณฑ์การควบคุมสิทธิ์ 7 ประการ (Core Architectural Authorization Rules)")
    rules_th = [
        ("กฎข้อที่ 1: แพลตฟอร์มไม่ใช่สิ่งทดแทนบทบาท (Platform does not replace Role)", "ส่วนติดต่อผู้ใช้ (Web vs. Native Mobile) มีหน้าที่เพียงนำเสนอหน้าจอ ไม่ใช่ตัวกำหนดสิทธิ์ บทบาทความปลอดภัยถูกควบคุมโดย Token ของระบบหลังบ้านอย่างเป็นอิสระจากอุปกรณ์"),
        ("กฎข้อที่ 2: สิทธิ์แพ็กเกจไม่ใช่สิ่งทดแทนบทบาทความปลอดภัย (Subscription does not replace Role)", "แพ็กเกจ Free, Basic และ Pro เป็นการกำหนดโควตาทางธุรกิจ ไม่ใช่ Security Role ผู้ใช้ทุกคนมีบทบาทความปลอดภัยเดียวกันคือ Registered User"),
        ("กฎข้อที่ 3: ขอบเขตการเข้าถึงของผู้เยี่ยมชม (Guest access boundary)", "ผู้เยี่ยมชมที่ไม่ผ่านการพิสูจน์ตัวตนจะไม่สามารถเข้าถึงทรัพยากรส่วนบุคคล ประวัติ หรือข้อมูลโปรไฟล์ได้จนกว่าจะลงทะเบียนสำเร็จ"),
        ("กฎข้อที่ 4: การบังคับใช้ความเป็นเจ้าของทรัพยากร (Resource ownership enforcement)", "ผู้ใช้เข้าถึงได้เฉพาะทรัพยากรที่ตนเองเป็นเจ้าของเท่านั้น คำขอข้ามบัญชี (IDOR) จะถูกปฏิเสธที่ฝั่งเซิร์ฟเวอร์ทันที (403/404)"),
        ("กฎข้อที่ 5: การตรวจสอบสิทธิ์ที่ระบบบริการหลังบ้าน (Backend-enforced entitlements)", "โควตาและสิทธิ์ต้องได้รับการตรวจสอบแบบ Atomic บน Backend API เสมอ สถานะบนเครื่องผู้ใช้ไม่มีอำนาจตัดสินใจเด็ดขาด"),
        ("กฎข้อที่ 6: การตรวจสอบสิทธิ์ระดับ API อย่างครอบคลุม (Comprehensive API authorization)", "ทุก API Endpoint ต้องบังคับใช้การตรวจสอบตัวตน บทบาท ความเป็นเจ้าของ และความยินยอมในทุกคำขอ"),
        ("กฎข้อที่ 7: การป้องกันเชิงลึก - ความปลอดภัยไม่ได้อยู่ที่ UI (Defense in Depth - No UI-only security)", "การซ่อนปุ่มบนหน้าจอไม่ถือเป็นการรักษาความปลอดภัย API Gateway และบริการหลังบ้านจะปฏิเสธคำขอที่ไม่ได้รับอนุญาตเสมอ")
    ]
    for r_title, r_desc in rules_th:
        p_ar = doc.add_paragraph()
        p_ar.paragraph_format.space_before = Pt(2)
        p_ar.paragraph_format.space_after = Pt(4)
        p_ar.paragraph_format.left_indent = Inches(0.2)
        r_ar_dot = p_ar.add_run("■ ")
        set_run_font(r_ar_dot, size_pt=11, bold=True, color_rgb=(30, 58, 138))
        r_ar_t = p_ar.add_run(f"{r_title}: ")
        set_run_font(r_ar_t, size_pt=14, bold=True, color_rgb=(15, 23, 42))
        r_ar_d = p_ar.add_run(r_desc)
        set_run_font(r_ar_d, size_pt=14, color_rgb=(30, 41, 59))

    doc.add_page_break()

    # 10. CHAPTER 8: AI LAYER
    add_heading_1(doc, "8. เลเยอร์ปัญญาประดิษฐ์และการประเมินผล (AI Layer, Inference & Evaluation Engine)")
    ai_bullets = [
        ("ไปป์ไลน์การประมวลผล (AI Scorer Pipeline):", src_doc.paragraphs[201].text.replace("Pipeline: ", "")),
        ("การทำงานร่วมกับ RAG / Embedding:", src_doc.paragraphs[202].text),
        ("เกณฑ์การประเมินคะแนน (Rubric Engine):", src_doc.paragraphs[203].text.replace("Rubric default: ", "")),
        ("ชุดข้อมูลทดสอบและเบนช์มาร์ก (Dataset):", src_doc.paragraphs[204].text.replace("Dataset: ", "")),
        ("การตรวจสอบความถูกต้องด้วย Pydantic (Validation):", src_doc.paragraphs[205].text.replace("Validation: ", "")),
        ("การจัดการกรณีระบบขัดข้อง (Failure Modes):", src_doc.paragraphs[206].text.replace("Failure mode: ", "")),
        ("ข้อจำกัดและข้อควรระวัง (AI Constraints):", src_doc.paragraphs[207].text),
        ("สถาปัตยกรรม AI ฝั่งเซิร์ฟเวอร์ (Server-Side AI Notice):", "การประมวลผลโมเดล AI ทั้งหมดทำงานบนระบบคลาวด์/เซิร์ฟเวอร์ส่วนกลางผ่าน FastAPI Inference Engine ไม่มีการรันโมเดลประเมินผลบนเครื่องมือถือ (ตามการตัดสินใจ D-M08) เพื่อรักษาความแม่นยำและการควบคุมเวอร์ชันอย่างสมบูรณ์")
    ]
    for label, text in ai_bullets:
        p_b = doc.add_paragraph()
        p_b.paragraph_format.space_before = Pt(2)
        p_b.paragraph_format.space_after = Pt(4)
        p_b.paragraph_format.left_indent = Inches(0.25)
        r_dot = p_b.add_run("• ")
        set_run_font(r_dot, size_pt=14, bold=True, color_rgb=(30, 58, 138))
        r_lbl = p_b.add_run(f"{label} ")
        set_run_font(r_lbl, size_pt=14.5, bold=True, color_rgb=(15, 23, 42))
        r_txt = p_b.add_run(text)
        set_run_font(r_txt, size_pt=14.5, color_rgb=(30, 41, 59))

    doc.add_page_break()

    # 11. CHAPTER 9: PRIVACY
    add_heading_1(doc, "9. การคุ้มครองข้อมูลส่วนบุคคล ความเป็นส่วนตัว และข้อมูลวิจัย (Privacy, Consent & Research Data Governance)")
    add_styled_p(doc, src_doc.paragraphs[209].text, space_after=6)

    copy_and_format_table(doc, src_doc.tables[7], [38, 57, 62], ['left', 'left', 'left'],
        special_rules={0: {'bold': True, 'font': 'Consolas', 'size': 11.5, 'color': (15, 23, 42)}})

    add_callout(doc, src_doc.paragraphs[210].text, title="[!] นโยบายความปลอดภัยข้อมูลการวิจัย (Research Data Security & RLS Policy)", border_color="7C3AED", bg_color="F5F3FF")

    privacy_lifecycle_text = (
        "วงจรชีวิตไฟล์เสียงและการจัดเก็บบนอุปกรณ์เคลื่อนที่ (Audio Lifecycle & Mobile Local Storage): การประมวลผลไฟล์เสียงชั่วคราวแบบเข้ารหัส; "
        "ลบทิ้งภายใน 24 ชม. สำหรับผู้ใช้ทั่วไป; ยินยอมเก็บรักษาได้ไม่เกิน 90 วัน; การขอลบข้อมูลดำเนินการอย่างรวดเร็ว (SLA ไม่เกิน 30 วันตามกฎหมาย)\n"
        "บนอุปกรณ์เคลื่อนที่ ข้อมูลแคชไฟล์เสียงหรือร่างคำตอบต้องถูกเก็บใน Private Application Sandbox และถูกลบทันทีหลังการอัปโหลดเสร็จสิ้น หรือเมื่อผู้ใช้ออกจากระบบ"
    )
    add_styled_p(doc, privacy_lifecycle_text, space_before=4, space_after=8)

    # 12. CHAPTER 10: BILLING
    add_heading_1(doc, "10. การบริหารแพ็กเกจสมาชิก ระบบชำระเงิน และการคืนเงิน (Package, Payment & Refund Governance)")

    add_callout(doc, src_doc.paragraphs[213].text, title="[!] ข้อจำกัดและข้อควรระวังด้านแพ็กเกจ (R3 Scope Warning)", border_color="D97706", bg_color="FFFBEB")

    copy_and_format_table(doc, src_doc.tables[8], [38, 57, 62], ['left', 'left', 'left'],
        special_rules={
            0: {'bold': True, 'color': (30, 58, 138)},
            1: {'color': (100, 116, 139)},
            2: {'bold': True, 'color': (15, 23, 42)}
        })

    payment_text = (
        "วงจรสถานะการชำระเงิน (Payment State Machine): initiated → pending → confirmed/failed; refund_requested → approved/rejected → processing → refunded/failed. "
        "ประมวลผล Webhook แบบ Idempotent, ตรวจสอบความถูกต้องและกระทบยอดเป็นระยะ ทุกการมอบสิทธิ์มาจากการชำระเงินที่ยืนยันแล้วเท่านั้น\n\n"
        "สถาปัตยกรรมการชำระเงินบนมือถือ (การตัดสินใจ D-M04): การจำหน่ายแพ็กเกจบน Native Mobile App อยู่ระหว่างรอข้อสรุประหว่าง "
        "Option A (Hybrid Web Checkout: แสดงข้อมูลในแอปและเปลี่ยนเส้นทางไปชำระบน Web) หรือ Option B (Native In-App Purchase ผ่าน StoreKit/Play Billing) ซึ่งต้องพิจารณาค่าธรรมเนียม Store 15-30%"
    )
    add_styled_p(doc, payment_text, space_before=4, space_after=8)

    doc.add_page_break()

    # 13. CHAPTER 11: DATA MODEL
    add_heading_1(doc, "11. แบบจำลองข้อมูลและพจนานุกรมข้อมูล (Data Model & Data Dictionary)")
    add_styled_p(doc, 
        "ตารางหลัก 29 ตารางในฐานข้อมูล Core PostgreSQL และ Billing/Research Schemas ยังคงโครงสร้างเดิมอย่างสมบูรณ์ โดยมีการเพิ่มเติมฟิลด์สำหรับการรองรับหลายแพลตฟอร์ม: "
        "REFRESH_SESSIONS (เพิ่ม client_platform, user_agent), INTERVIEW_SESSIONS (เพิ่ม client_platform), TRANSACTIONS (เพิ่ม channel), และเตรียมพร้อมโครงสร้างตาราง USER_DEVICES สำหรับเก็บ Push Notification Tokens ในระยะ R2", 
        space_after=6)

    copy_and_format_table(doc, src_doc.tables[9], [36, 66, 55], ['left', 'left', 'left'],
        special_rules={
            0: {'bold': True, 'font': 'Consolas', 'size': 11.5, 'color': (30, 58, 138)},
            1: {'font': 'Consolas', 'size': 10.5, 'color': (51, 65, 85)},
            2: {'size': 12.5, 'color': (30, 41, 59)}
        })

    add_heading_2(doc, "11.1 ตัวอย่างแบบสอบถามสำหรับข้อมูลวิจัยรวม (Corrected Research Aggregation Query)")
    add_styled_p(doc, src_doc.paragraphs[218].text, space_after=4)

    sql_lines = [src_doc.paragraphs[i].text for i in range(219, 230)]
    add_code_block(doc, sql_lines, title="Listing 11.1: ตัวอย่าง Conceptual Read-only Query สำหรับ Research Aggregation")

    add_callout(doc, src_doc.paragraphs[230].text, title="[!] ข้อควรระวังด้านความเป็นส่วนตัว (Privacy & Aggregation Notice)", border_color="DC2626", bg_color="FEF2F2")

    doc.add_page_break()

    # 14. CHAPTER 12: ARCHITECTURE & OPERATIONS
    add_heading_1(doc, "12. สถาปัตยกรรมระบบ ส่วนต่อประสาน และการดำเนินงาน (Architecture, Interfaces & Operations)")

    copy_and_format_table(doc, src_doc.tables[10], [28, 65, 64], ['left', 'left', 'left'],
        special_rules={0: {'bold': True, 'color': (30, 58, 138)}})

    add_heading_2(doc, "12.1 ตารางข้อกำหนดการเชื่อมโยงและประสานข้อมูลข้ามแพลตฟอร์ม (Cross-Platform Data Synchronization Matrix)")
    sync_headers = ["หมวดหมู่ข้อมูล", "บริบทข้อมูล", "แหล่งข้อมูลหลัก", "จุดเชื่อมต่อ API", "สิทธิ์อ่าน/เขียน", "พฤติกรรมและความถี่ในการซิงก์", "การจัดการข้อขัดแย้ง", "มาตรการความปลอดภัย"]
    sync_rows = [
        ("ข้อมูลบัญชีผู้ใช้", "Identity", "USERS, AUTH_IDENTITIES", "/api/v1/auth/me", "Read (User), Write (Auth)", "ซิงก์เมื่อเปิดแอป; ตรวจสอบ Token ทุก 15 นาที", "เซิร์ฟเวอร์ถือเป็นที่สิ้นสุด; 409 Conflict หากชนกัน", "Tokens ใน Keychain / Keystore; TLS 1.3"),
        ("โปรไฟล์ผู้ใช้งาน", "User", "USERS (status, skill)", "/api/v1/users/profile", "Read / Write โดยเจ้าของ", "ซิงก์เมื่อเปิดแอปและเมื่อแก้ไข; Optimistic UI", "Last-write-wins อิง server updated_at", "ตรวจ Ownership; Validate Schema เข้มงวด"),
        ("สิทธิ์แพ็กเกจ", "Billing", "SUBSCRIPTIONS, USAGE_LEDGER", "/api/v1/entitlements/check", "Read-only สำหรับไคลเอนต์", "ดึงก่อนเริ่มฝึก; ตัดโควตา Atomic ที่เซิร์ฟเวอร์", "เซิร์ฟเวอร์สูงสุดเสมอ; ห้ามแคชสิทธิ์ตัดสินใจ", "ตัดโควตาที่เซิร์ฟเวอร์ ป้องกันการปลอมสิทธิ์"),
        ("เซสชันสัมภาษณ์", "Interview", "INTERVIEW_SESSIONS", "/api/v1/interviews/{id}/answers", "Read / Write โดยเจ้าของ", "Request/Response รายข้อ; แคชชั่วคราวเมื่อเน็ตหลุด", "ใช้ Idempotency-Key (UUIDv4) ป้องกันคำตอบซ้ำ", "ผูกกับ User ID; CSRF บน Web, Bearer บน Mobile"),
        ("ประวัติสัมภาษณ์", "Interview", "SESSIONS, ANSWERS, FEEDBACK", "/api/v1/interviews/history", "Read-only; Delete โดยเจ้าของ", "ดึงแบบ Pagination; ซิงก์เมื่อฝึกเสร็จหรือลบ", "Append-only log; ข้อมูลลบจะถูกซ่อนทันที", "กรองตาม User ID; ข้อมูล Soft Delete ถูกคัดออก"),
        ("ผลการประเมิน AI", "Evaluation", "FEEDBACK, EVAL_JOBS", "/api/v1/evaluations/{jobId}", "Read-only โดยเจ้าของ", "Async Polling (P95 <= 15s) หรือ Push Notification", "Immutable ติด Rubric/Model Version ห้ามแก้", "แสดงผลเฉพาะเจ้าของ; ยื่นอุทธรณ์เข้าคิว Admin"),
        ("การตั้งค่าผู้ใช้", "User / Client", "USER_PREFERENCES + Storage", "/api/v1/users/preferences", "Read / Write โดยเจ้าของ", "ค่าสากลซิงก์ขึ้นคลาวด์; ค่าเฉพาะเครื่องเก็บในเครื่อง", "คลาวด์ใช้ Last-write-wins; เครื่องใช้ Local Storage", "ตรวจ Schema อย่างเข้มงวด; ห้ามเก็บข้อมูลลับ"),
        ("บันทึกยินยอม PDPA", "Privacy", "CONSENT_EVENTS, NOTICES", "/api/v1/privacy/consents", "Read / Append-only", "ซิงก์เมื่อเปิดแอป; แสดงหน้าต่างขอยินยอมทันทีหากมีประกาศใหม่", "Append-only; ความยินยอมล่าสุดมีผลบังคับใช้", "Audit Trail ถาวร; ถอนยินยอมมีผลระงับบริการทันที")
    ]
    create_table_from_data(doc, sync_headers, sync_rows, [22, 16, 25, 24, 20, 26, 26, 24], ['left', 'center', 'left', 'left', 'center', 'left', 'left', 'left'],
        special_rules={
            0: {'bold': True, 'color': (30, 58, 138)},
            1: {'color': (100, 116, 139)}
        })

    doc.add_page_break()

    # 15. CHAPTER 13: TRACEABILITY
    add_heading_1(doc, "13. การเชื่อมโยงข้อกำหนดและการตรวจสอบความถูกต้อง (Traceability & Verification)")
    add_styled_p(doc, 
        "เมทริกซ์การตรวจสอบย้อนกลับ (Traceability Matrix) เชื่อมโยงความต้องการจากแบบสำรวจ (Survey), เอกสารหลักฐานเดิม (Baseline v1.0), และกฎหมาย PDPA "
        "เข้าสู่ข้อกำหนดเชิงหน้าที่ (FR01–FR36), ข้อกำหนดที่ไม่ใช่เชิงหน้าที่ (NFR01–NFR24), บทบาทความปลอดภัย (RBAC Roles), ตารางฐานข้อมูล, แผนภาพสถาปัตยกรรม (D01–D19), "
        "และเป้าหมายการทดสอบความถูกต้องอย่างสมบูรณ์แบบ 100% (ครอบคลุม 64 รายการ)", 
        space_after=6)

    copy_and_format_table(doc, src_doc.tables[11], [18, 38, 25, 36, 40], ['center', 'left', 'center', 'left', 'left'],
        special_rules={
            0: {'bold': True, 'color': (30, 58, 138)},
            2: {'bold': True, 'color': (15, 23, 42)}
        })

    doc.add_page_break()

    # 16. CHAPTER 14: RISKS & DECISIONS
    add_heading_1(doc, "14. ความเสี่ยง การตัดสินใจ และเงื่อนไขการอนุมัติ (Risks, Decisions & Approval Conditions)")

    add_heading_2(doc, "14.1 ทะเบียนการตัดสินใจด้านสถาปัตยกรรมและแอปพลิเคชันมือถือ (Decision Register: D-M01 ถึง D-M11)")
    dec_headers = ["รหัส", "หมวดหมู่", "ประเด็นการตัดสินใจ", "ทางเลือกที่แนะนำของทีมงาน", "ผู้รับผิดชอบ", "สถานะ"]
    dec_rows = [
        ("D-M01", "กำหนดการส่งมอบ", "รอบการเปิดตัว Native Mobile App", "ทางเลือก A (แนะนำ): ตั้งเป้าส่งมอบในรอบ R2 ควบคู่กับระบบสัมภาษณ์ด้วยเสียง", "Product Owner / Tech Lead", "รอการยืนยัน"),
        ("D-M02", "เทคโนโลยีพัฒนา", "การเลือกเทคโนโลยีสำหรับ Native Mobile", "ทางเลือก A (แนะนำ): ใช้ React Native / Expo เพื่อแชร์ DTOs และ Schemas ร่วมกับ Web", "Tech Lead / Mobile Architect", "รอการยืนยัน"),
        ("D-M03", "ความเข้ากันได้ OS", "เวอร์ชันขั้นต่ำของระบบปฏิบัติการที่รองรับ", "ทางเลือก A (แนะนำ): iOS 16.0+ และ Android 13.0+ (API 33) เพื่อความปลอดภัยระดับฮาร์ดแวร์", "QA Lead / Mobile Architect", "รอการยืนยัน"),
        ("D-M04", "ระบบการเงิน", "สถาปัตยกรรมการชำระเงินและค่าธรรมเนียม Store", "ทางเลือก A: แสดงแพ็กเกจบนแอป และส่งต่อผู้ใช้ไปจ่ายเงินผ่าน Web Checkout ในระยะแรก", "Finance Admin / PO / Legal", "รอการยืนยัน"),
        ("D-M05", "การมีส่วนร่วม", "ขอบเขตและโครงสร้างระบบ Push Notifications", "ทางเลือก A: ติดตั้งระบบแจ้งเตือนผ่าน APNs / FCM ในรอบ R2 สำหรับเตือนฝึกซ้อมและแจ้งผล AI", "Product Owner / Backend Lead", "รอการยืนยัน"),
        ("D-M06", "ความปลอดภัย", "การยืนยันตัวตนด้วยไบโอเมตริกซ์บนมือถือ", "ทางเลือก A: รองรับ Face ID / Touch ID เพื่อปลดล็อก Refresh Token ใน Keychain/Keystore ใน R2", "Security Lead / Mobile Lead", "รอการยืนยัน"),
        ("D-M07", "การนำทาง", "การรองรับ Deep Linking & Universal Links", "ทางเลือก A: กำหนดค่า Universal Links / App Links สำหรับยืนยันอีเมลและเข้าสู่ห้องสอบ", "Frontend Lead / Mobile Lead", "รอการยืนยัน"),
        ("D-M08", "การทำงานออฟไลน์", "ขอบเขตการทำงานออฟไลน์และการรัน AI บนเครื่อง", "ทางเลือก A: บังคับต่ออินเทอร์เน็ตเพื่อประเมินผล AI โดยมีระบบแคชคำตอบในเครื่องกันเน็ตหลุด", "Software Architect / AI Lead", "รอการยืนยัน"),
        ("D-M09", "แผนงานผลิตภัณฑ์", "ความเท่าเทียมกันของฟังก์ชันระหว่าง Web และ Mobile", "ทางเลือก A: ฟังก์ชันสำหรับ End Users เท่าเทียมกัน 100%; ฟังก์ชัน Admin/Research สงวนบน Web", "Product Owner / QA Lead", "รอการยืนยัน"),
        ("D-M10", "การปฏิบัติตามกฎ", "การปฏิบัติตามนโยบายความเป็นส่วนตัวของ App Store", "ทางเลือก A: จัดทำระบบลบบัญชีในแอป, ขอสิทธิ์ไมโครโฟน และทำ Privacy Nutrition Labels ครบถ้วน", "Legal / Privacy / Release Lead", "รอการยืนยัน"),
        ("D-M11", "ระบบเสียง", "โพรโทคอลการรับส่งไฟล์เสียงสัมภาษณ์ใน R2", "ทางเลือก A: ใช้วิธีอัปโหลดไฟล์เสียงเป็นส่วนๆ (Chunked Upload) ผ่าน Signed URL ไปยัง S3/MinIO", "Technical Lead / AI Lead", "รอการยืนยัน")
    ]
    create_table_from_data(doc, dec_headers, dec_rows, [14, 25, 45, 38, 20, 15], ['center', 'left', 'left', 'left', 'left', 'center'],
        special_rules={
            0: {'bold': True, 'color': (220, 38, 38)},
            1: {'bold': True, 'color': (30, 41, 59)}
        })

    add_heading_2(doc, "14.2 สรุปประเด็นการตัดสินใจเดิมที่ยังรอข้อยุติ (Outstanding Decisions: D01 ถึง D07)")
    copy_and_format_table(doc, src_doc.tables[12], [16, 81, 30, 30], ['center', 'left', 'left', 'left'],
        special_rules={
            0: {'bold': True, 'color': (220, 38, 38)},
            2: {'bold': True, 'color': (30, 41, 59)}
        })

    add_heading_1(doc, "บันทึกการเปลี่ยนแปลงเอกสาร (Change Log)")
    cl_headers = ["เวอร์ชัน", "วันที่", "สรุปสาระสำคัญของการเปลี่ยนแปลง", "ผู้จัดทำ / ผู้ทบทวน"]
    cl_rows = [
        ("0.x", "—", "จัดทำร่างข้อกำหนด 11 หมวดแรกจากการสำรวจความต้องการ", "ทีมวิเคราะห์ธุรกิจ"),
        ("0.9", "08 ต.ค. 2026", "ปรับปรุงเอกสารเพิ่มเติมตามผลการทบทวนของสถาปนิกและผลสำรวจ", "ทีมสถาปัตยกรรมระบบ"),
        ("1.0", "08 ต.ค. 2026", "รวบรวมเป็น Baseline v1.0 ปรับแก้ FR/NFR/RBAC/แบบจำลองข้อมูล และการตรวจสอบย้อนกลับ", "หัวหน้าทีมเอกสารทางเทคนิค"),
        ("1.1 DRAFT", "13 พ.ย. 2026", 
         "ระยะที่ 1: การปรับประสานข้อกำหนดและขอบเขตแพลตฟอร์ม (ภาษาไทยมาตรฐาน):\n"
         "- แยกขอบเขตแพลตฟอร์มชัดเจนระหว่าง Responsive Web และ Native Mobile Application (iOS/Android)\n"
         "- ปรับปรุงข้อกำหนด FR15 Multi-Platform Access และกำหนดเกณฑ์การยอมรับ 7 ข้อ (Proposed)\n"
         "- ปรับปรุงข้อกำหนด NFR08 Cross-Platform Accessibility & Consistency (Web WCAG 2.2 AA, Mobile Screen Readers, 100% Sync)\n"
         "- จัดทำตาราง Platform Access Matrix (Role × Platform) และ Subscription Matrix (Tier × Platform)\n"
         "- บรรจุ Core Authorization Rules 7 ประการ และตาราง Data Synchronization 8 หมวดหมู่\n"
         "- บันทึกทะเบียนการตัดสินใจ Mobile Decision Register (D-M01 ถึง D-M11) ครอบคลุมทุกมิติ",
         "ทีมงานอาวุโส BA, SA, สถาปนิกซอฟต์แวร์ และฝ่ายเอกสารเทคนิค")
    ]
    create_table_from_data(doc, cl_headers, cl_rows, [18, 24, 75, 40], ['center', 'center', 'left', 'left'],
        special_rules={0: {'bold': True, 'color': (30, 58, 138)}})

    # End of Document Banner
    add_styled_p(doc, "", space_after=14)
    tbl_end = doc.add_table(1, 1)
    tbl_end.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_end.autofit = False
    c_end = tbl_end.cell(0, 0)
    c_end.width = Mm(157)
    c_end._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="F1F5F9"/>'))
    c_end._tc.get_or_add_tcPr().append(parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
            <w:bottom w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    '''))
    p_end = c_end.paragraphs[0]
    p_end.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_end.paragraph_format.space_before = Pt(6)
    p_end.paragraph_format.space_after = Pt(6)
    r_end = p_end.add_run("— สิ้นสุดเอกสารควบคุม (END OF CONTROLLED DOCUMENT) —\nรหัสเอกสาร: IX-SRS-001 | เวอร์ชัน: 1.1 DRAFT Baseline | วันที่: 13 พฤศจิกายน 2026")
    set_run_font(r_end, size_pt=12.5, bold=True, color_rgb=(71, 85, 105))

    doc.save(output_docx_path)
    print(f"Successfully generated Thai SRS docx: {output_docx_path}!")
    
    shutil.copyfile(output_docx_path, root_docx_path)
    print(f"Copied Thai SRS docx to root: {root_docx_path}!")

if __name__ == "__main__":
    build_thai_srs_docx()
