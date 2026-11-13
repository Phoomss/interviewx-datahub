import os
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
        tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="1E3A8A"/>'))
        tcPr.append(parse_xml(f'<w:vAlign {nsdecls("w")} w:val="center"/>'))
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.15
            if col_alignments and col_alignments[c_i] == 'center':
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif col_alignments and col_alignments[c_i] == 'right':
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                set_run_font(r, size_pt=13.5, bold=True, color_rgb=(255, 255, 255))
                
    for r_i, row in enumerate(table.rows[1:], start=1):
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        row_bg = "F8FAFC" if (r_i % 2 == 1) else "FFFFFF"
        
        for c_i, cell in enumerate(row.cells):
            cell.width = Mm(col_widths[c_i])
            tcPr = cell._tc.get_or_add_tcPr()
            tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{row_bg}"/>'))
            tcPr.append(parse_xml(f'<w:vAlign {nsdecls("w")} w:val="center"/>'))
            
            for p in cell.paragraphs:
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.line_spacing = 1.15
                if col_alignments and col_alignments[c_i] == 'center':
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                elif col_alignments and col_alignments[c_i] == 'right':
                    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                else:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                    
                for r in p.runs:
                    txt = r.text.strip()
                    bold = False
                    color = (30, 41, 59)
                    font_size = 13
                    font_name = "TH Sarabun New"
                    
                    if special_rules:
                        rule = special_rules.get((r_i, c_i)) or special_rules.get(c_i)
                        if rule:
                            bold = rule.get('bold', bold)
                            color = rule.get('color', color)
                            font_size = rule.get('size', font_size)
                            font_name = rule.get('font', font_name)
                    
                    if txt in ['Pending', 'Pending Confirmation', 'Pending Review']:
                        bold = True
                        color = (180, 83, 9)
                    elif txt in ['Allow', 'Approved', 'Approved Baseline', 'Yes']:
                        bold = True
                        color = (6, 95, 70)
                    elif txt in ['Deny', 'No']:
                        bold = True
                        color = (153, 27, 27)
                    elif txt in ['Must', 'Must (R1)', 'Must (R2)', 'Must (R3)']:
                        bold = True
                        color = (185, 28, 28)
                    elif txt in ['Should']:
                        bold = True
                        color = (180, 83, 9)
                    elif txt in ['Could']:
                        bold = False
                        color = (71, 85, 105)
                        
                    set_run_font(r, name=font_name, size_pt=font_size, bold=bold, color_rgb=color)

def create_table_from_data(doc, headers, rows, col_widths, col_alignments=None, special_rules=None):
    tbl = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    for c_i, h in enumerate(headers):
        tbl.rows[0].cells[c_i].paragraphs[0].text = h
    for r_i, row in enumerate(rows):
        for c_i, val in enumerate(row):
            tbl.rows[r_i + 1].cells[c_i].paragraphs[0].text = str(val or '')
    format_table(tbl, col_widths, col_alignments, special_rules)
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(4)
    return tbl

def copy_and_format_table(doc, src_table, col_widths, col_alignments=None, special_rules=None):
    dest_table = doc.add_table(rows=len(src_table.rows), cols=len(src_table.columns))
    for r_i, row in enumerate(src_table.rows):
        for c_i, cell in enumerate(row.cells):
            dest_table.rows[r_i].cells[c_i].paragraphs[0].text = cell.text.strip()
    format_table(dest_table, col_widths, col_alignments, special_rules)
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(4)
    return dest_table

def add_fr_item(doc, title, line_meta, line_req, line_ac):
    p_title = add_heading_3(doc, title)
    
    p_meta = doc.add_paragraph()
    p_meta.paragraph_format.space_before = Pt(0)
    p_meta.paragraph_format.space_after = Pt(3)
    p_meta.paragraph_format.keep_with_next = True
    
    rel_str = "R1"
    prio_str = "Must"
    ev_str = ""
    plat_str = "Shared Web & Mobile"
    
    parts = [pt.strip() for pt in line_meta.split('|')]
    for pt in parts:
        if pt.startswith('ระยะ:') or pt.startswith('Release:'):
            rel_str = pt.replace('ระยะ:', '').replace('Release:', '').strip()
        elif pt.startswith('Priority:'):
            prio_str = pt.replace('Priority:', '').strip()
        elif pt.startswith('Evidence:') or pt.startswith('ที่มา:'):
            ev_str = pt.replace('Evidence:', '').replace('ที่มา:', '').strip()
        elif pt.startswith('Platform:'):
            plat_str = pt.replace('Platform:', '').strip()
            
    rel_color = (29, 78, 216) if 'R1' in rel_str else ((124, 58, 237) if 'R2' in rel_str else (234, 88, 12))
    r_rel = p_meta.add_run(f" [ {rel_str} ] ")
    set_run_font(r_rel, size_pt=12, bold=True, color_rgb=rel_color)
    
    prio_color = (220, 38, 38) if 'Must' in prio_str else ((217, 119, 6) if 'Should' in prio_str else (71, 85, 105))
    r_prio = p_meta.add_run(f" [ Priority: {prio_str} ] ")
    set_run_font(r_prio, size_pt=12, bold=True, color_rgb=prio_color)
    
    plat_color = (6, 95, 70) if 'Shared' in plat_str else (180, 83, 9)
    r_plat = p_meta.add_run(f" [ Platform: {plat_str} ] ")
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
    
    ac_lbl = "เกณฑ์การยอมรับ (Proposed Acceptance Criteria — Pending Approval): " if "FR15" in title else "เกณฑ์การยอมรับ (Acceptance Criteria): "
    ac_text = line_ac.replace('Acceptance criteria:', '').replace('เกณฑ์การยอมรับ (Acceptance Criteria):', '').replace('เกณฑ์การยอมรับ (Proposed Acceptance Criteria — Pending Approval):', '').strip()
    r_ac_lbl = p_ac.add_run(ac_lbl)
    set_run_font(r_ac_lbl, size_pt=14, bold=True, color_rgb=(15, 23, 42))
    r_ac_val = p_ac.add_run(ac_text)
    set_run_font(r_ac_val, size_pt=14, color_rgb=(51, 65, 85))

# Build document
script_dir = os.path.dirname(os.path.abspath(__file__))
backup_docx_path = os.path.join(script_dir, 'InterviewX_SRS_Final_For_Approval_v1.0.backup.docx')
output_docx_path = os.path.join(script_dir, 'InterviewX_SRS_v1.1_DRAFT.docx')

src_doc = docx.Document(backup_docx_path)
doc = docx.Document()

# Configure Page Setup
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
c_l.width = Mm(100)
c_r.width = Mm(57)
p_hl = c_l.paragraphs[0]
p_hl.paragraph_format.space_before = Pt(0)
p_hl.paragraph_format.space_after = Pt(2)
r_hl = p_hl.add_run("InterviewX   |   Software Requirements Specification (SRS)")
set_run_font(r_hl, size_pt=10.5, color_rgb=(100, 116, 139))

p_hr = c_r.paragraphs[0]
p_hr.paragraph_format.space_before = Pt(0)
p_hr.paragraph_format.space_after = Pt(2)
p_hr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r_hr = p_hr.add_run("Draft Baseline v1.1")
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
c_fl.width = Mm(105)
c_fr.width = Mm(52)
p_fl = c_fl.paragraphs[0]
p_fl.paragraph_format.space_before = Pt(2)
p_fl.paragraph_format.space_after = Pt(0)
r_fl = p_fl.add_run("Controlled Document • Confidential / For Stakeholder Review (Phase 1)")
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
add_styled_p(doc, "SYSTEM REQUIREMENTS SPECIFICATION", space_before=10, space_after=2, font_size=12, color_rgb=(71, 85, 105), bold=True)
p_top_line = doc.add_paragraph()
p_top_line.paragraph_format.space_before = Pt(0)
p_top_line.paragraph_format.space_after = Pt(28)
r_tl = p_top_line.add_run("━" * 45)
set_run_font(r_tl, size_pt=10, color_rgb=(30, 58, 138))

add_styled_p(doc, "InterviewX", space_before=0, space_after=4, font_size=36, color_rgb=(15, 23, 42), bold=True)
add_styled_p(doc, "Software Requirements Specification (SRS)", space_before=0, space_after=14, font_size=20, color_rgb=(30, 58, 138), bold=True)

tbl_base = doc.add_table(1, 1)
tbl_base.alignment = WD_TABLE_ALIGNMENT.LEFT
tbl_base.autofit = False
cell_b = tbl_base.cell(0, 0)
cell_b.width = Mm(110)
shd_b = parse_xml(f'<w:shd {nsdecls("w")} w:fill="1E3A8A"/>')
cell_b._tc.get_or_add_tcPr().append(shd_b)
p_b = cell_b.paragraphs[0]
p_b.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_b.paragraph_format.space_before = Pt(4)
p_b.paragraph_format.space_after = Pt(4)
r_b = p_b.add_run("REVISED BASELINE — VERSION 1.1 DRAFT")
set_run_font(r_b, size_pt=14, bold=True, color_rgb=(255, 255, 255))

add_styled_p(doc, "", space_after=14)

add_callout(doc, 
    "วันที่จัดทำ: 13 พฤศจิกายน 2026 | เอกสารฉบับร่างสำหรับกระบวนการทบทวนและขออนุมัติอย่างเป็นทางการ (Phase 1 Requirement Alignment)\n"
    "สถานะการควบคุม: Revised content baseline; formal stakeholder signatures pending. จัดทำขึ้นเพื่อกำหนดขอบเขตและจัดแนวความสอดคล้องระหว่าง Web Application และ Native Mobile Application (iOS / Android) ร่วมกับ Shared Backend Architecture คำว่า Baseline ไม่หมายความว่ามีการลงนามรับรองแล้ว",
    title="[!] สถานะการควบคุมเอกสาร (Document Governance Notice)",
    border_color="D97706",
    bg_color="FEF3C7")

meta_headers = ["Specification", "Details"]
meta_rows = [
    ("Document ID", "IX-SRS-001"),
    ("Classification", "Controlled Document • Pending Stakeholder Sign-off"),
    ("Document Version", "1.1 DRAFT (Phase 1: Requirement Alignment)"),
    ("Scope Model", "R1 Core MVP | R2 Enhanced AI & Mobile | R3 Commercial & Research"),
    ("Tech Stack", "Next.js Responsive Web + Native Mobile (iOS/Android) + NestJS API + Hosted AI Adapter")
]
create_table_from_data(doc, meta_headers, meta_rows, [50, 107], ['left', 'left'], special_rules={0: {'bold': True, 'color': (30, 41, 59)}})

doc.add_page_break()

# 2. FRONT MATTER
add_heading_1(doc, "Document control")
ctrl_headers = ["รายการ", "รายละเอียด"]
ctrl_rows = [
    ("Document ID", "IX-SRS-001"),
    ("Version", "1.1 DRAFT"),
    ("Status", "Draft for Review — Phase 1 Requirement Alignment (Pending Stakeholder Sign-off)"),
    ("Sources", "InterviewX_SRS_Final_For_Approval_v1.0.docx; InterviewX_FR_NFR_RBAC.xlsx; Requirement Survey CSV (n=102); ALL_DIAGRAMS.md; Phase 1 Platform Separation Guidelines"),
    ("Change policy", "การเปลี่ยนข้อกำหนดหลัง baseline v1.0 ต้องบันทึก Change Request พร้อมผลกระทบ ขอบเขตแพลตฟอร์ม และผู้อนุมัติ"),
    ("Scope model", "R1 Core MVP (Web Baseline & Mobile-Ready API); R2 Enhanced AI & Native Mobile; R3 Commercial & Research")
]
create_table_from_data(doc, ctrl_headers, ctrl_rows, [45, 112], ['left', 'left'], special_rules={0: {'bold': True, 'color': (30, 41, 59)}})

add_heading_2(doc, "Approval record")
appr_headers = ["ตำแหน่ง", "ชื่อ/ลายเซ็น", "วันที่", "สถานะ"]
appr_rows = [
    ("Product owner / Sponsor", "________________", "________", "Pending Review"),
    ("Technical lead / Architect", "________________", "________", "Pending Review"),
    ("Mobile Lead / Architect", "________________", "________", "Pending Review"),
    ("Privacy / Legal reviewer", "________________", "________", "Pending Review"),
    ("QA / Acceptance owner", "________________", "________", "Pending Review")
]
create_table_from_data(doc, appr_headers, appr_rows, [50, 52, 25, 30], ['left', 'left', 'center', 'center'], special_rules={0: {'bold': True, 'color': (30, 41, 59)}})

add_heading_1(doc, "สารบัญเนื้อหา")
toc_items = [
    ("01", "1. Introduction & Governance"),
    ("02", "2. Evidence and Stakeholders"),
    ("03", "3. Scope, Assumptions and Release Plan"),
    ("04", "4. System Context and Use Cases"),
    ("05", "5. Functional Requirements (FR01–FR36)"),
    ("06", "6. Non-Functional Requirements (NFR01–NFR24)"),
    ("07", "7. Role, Authorization and Entitlements"),
    ("08", "8. AI Layer and Evaluation"),
    ("09", "9. Privacy, Consent and Research Data"),
    ("10", "10. Package, Payment and Refund Governance"),
    ("11", "11. Data Model and Data Dictionary"),
    ("12", "12. Architecture, Interfaces, Operations"),
    ("13", "13. Traceability and Verification"),
    ("14", "14. Risks, Decisions and Approval Conditions")
]
tbl_toc = doc.add_table(rows=len(toc_items), cols=2)
tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
tbl_toc.autofit = False
for r_i, (num, title) in enumerate(toc_items):
    row_bg = "F8FAFC" if (r_i % 2 == 1) else "FFFFFF"
    c_n = tbl_toc.rows[r_i].cells[0]
    c_n.width = Mm(22)
    c_n._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{row_bg}"/>'))
    p_n = c_n.paragraphs[0]
    p_n.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_n = p_n.add_run(f"หมวด {num}")
    set_run_font(r_n, size_pt=12.5, bold=True, color_rgb=(30, 58, 138))
    
    c_t = tbl_toc.rows[r_i].cells[1]
    c_t.width = Mm(135)
    c_t._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{row_bg}"/>'))
    p_t = c_t.paragraphs[0]
    r_t = p_t.add_run(title)
    set_run_font(r_t, size_pt=14, bold=True, color_rgb=(30, 41, 59))
doc.add_paragraph()

doc.add_page_break()

# 3. CHAPTER 1
add_heading_1(doc, "1. Introduction & Governance")
intro_text = (
    "InterviewX คือแพลตฟอร์มฝึกสัมภาษณ์ด้วย AI เพื่อจำลองคำถาม ประเมินคำตอบด้วย rubric ที่อธิบายได้ "
    "และช่วยให้ผู้ใช้ปรับปรุงการตอบแบบต่อเนื่อง รองรับภาษาไทย/อังกฤษ ระบบถูกออกแบบโดยแยกส่วนการแสดงผลออกเป็น 2 Client Frontends หลัก:\n"
    "1. Responsive Web Application: รองรับการใช้งานผ่านเว็บบราวเซอร์บน Desktop, Tablet และ Mobile Browser "
    "เพื่อให้บริการทั้งผู้ใช้ทั่วไป (Guest, Registered User) และผู้ปฏิบัติงานภายใน (Researcher, Finance Admin, System Admin)\n"
    "2. Native Mobile Application: แอปพลิเคชันแบบติดตั้งแยกต่างหากบนระบบปฏิบัติการ iOS และ Android "
    "ซึ่งออกแบบมาเฉพาะสำหรับกลุ่ม End Users (Guest, Registered User) โดยรองรับสิทธิ์การใช้งานตามแพ็กเกจ (Free, Basic, Pro)\n\n"
    "ทั้งสองแพลตฟอร์มทำงานเชื่อมโยงกับ Shared Backend Architecture เดียวกันผ่าน Authorized REST APIs เพื่อให้มั่นใจในความสอดคล้องของข้อมูล ความปลอดภัย และการบริหารจัดการแบบศูนย์กลาง"
)
add_styled_p(doc, intro_text, space_after=6)

add_callout(doc, 
    "เอกสารฉบับนี้เป็นข้อกำหนดเชิงบังคับสำหรับฟังก์ชันใน release ที่อนุมัติเท่านั้น; ข้อกำหนดใน R2/R3 และการเปิดตัว Native Mobile App ยังไม่เป็น commitment บังคับของ R1 ลำดับบังคับใช้: ข้อกำหนดฉบับนี้ (v1.1 DRAFT เมื่อผ่านการอนุมัติ) > Baseline v1.0 > test cases ที่อ้างอิง > เอกสารร่างเดิม ห้ามถือข้อความในเอกสารเดิมที่ขัดแย้งกันเป็นข้อกำหนดพร้อมกัน",
    title="[!] ลำดับการบังคับใช้ข้อกำหนด (Precedence & Authority)",
    border_color="1E3A8A", bg_color="EFF6FF")

add_styled_p(doc, "คำศัพท์และตัวย่อสำคัญ (Definitions & Acronyms):", font_size=15, bold=True, color_rgb=(15, 23, 42), space_before=4, space_after=2)
defs_text = (
    "คำศัพท์: FR = Functional Requirement; NFR = Non-Functional Requirement; RBAC = Role-Based Access Control; "
    "Entitlement = สิทธิ์และโควตาตามแพ็กเกจสมาชิก; Platform Scope = ขอบเขตการทำงานบน Web vs. Native Mobile; "
    "RLS = Row-Level Security; STT = Speech-to-Text; HIG = Apple Human Interface Guidelines; IAP = In-App Purchase; "
    "APNs = Apple Push Notification service; FCM = Firebase Cloud Messaging; Keystore/Keychain = กลไกจัดเก็บกุญแจและโทเคนความปลอดภัยระดับฮาร์ดแวร์; "
    "P95 = 95th percentile; UAT = User Acceptance Test; R1/R2/R3 = Release 1/2/3"
)
add_styled_p(doc, defs_text, space_after=8)

# 4. CHAPTER 2
add_heading_1(doc, "2. Evidence and Stakeholders")
add_styled_p(doc, "ฐานข้อมูลการสำรวจ: CSV ต้นฉบับมี 102 แถวตอบแบบสอบถามและ 22 คอลัมน์ คำถามหลายตัวเลือกแยกนับ respondent ที่เลือกแต่ละข้อ ตัวเลขเป็น descriptive evidence ไม่ใช่ผลพิสูจน์ความต้องการของประชากรทั้งหมด", space_after=6)

survey_headers = ["ฟีเจอร์จาก Survey", "จำนวน (n=102)", "ร้อยละ"]
survey_rows = [
    ("จำลองคำถามเฉพาะประเภท", "94", "92.2%"),
    ("วิเคราะห์การสื่อสาร/ความมั่นใจ", "67", "65.7%"),
    ("คะแนนและ Feedback", "58", "56.9%"),
    ("Grammar/ภาษาอังกฤษ", "57", "55.9%"),
    ("วิเคราะห์คำตอบ", "55", "53.9%"),
    ("ฝึกด้วยเสียง", "38", "37.3%"),
    ("ปรับระดับความยาก", "35", "34.3%"),
    ("Dashboard", "30", "29.4%")
]
create_table_from_data(doc, survey_headers, survey_rows, [85, 36, 36], ['left', 'center', 'center'], special_rules={2: {'bold': True, 'color': (30, 58, 138)}})

evidence_text = (
    "ผลสำรวจด้านแพลตฟอร์ม (Cross-Platform Evidence): ผู้ตอบแบบสำรวจ 84/102 คน (82.4%) ระบุความต้องการใช้งานทั้งบนคอมพิวเตอร์ (Web) และบนโทรศัพท์มือถือ (Mobile) "
    "ผลวิเคราะห์สถาปัตยกรรม: ใน R1 ระบบเปิดตัวด้วย Responsive Web เพื่อให้ครอบคลุมการใช้งานบน Desktop, Tablet และ Mobile Browser อย่างรวดเร็ว "
    "พร้อมทั้งออกแบบ Shared Backend REST APIs ให้พร้อมรองรับ Native Mobile Application (iOS / Android) ซึ่งวางแผนเปิดตัวในระยะถัดไป (R2 ตามข้อเสนอ หรือตามการตัดสินใจ D-M01)\n\n"
    "Stakeholders: ผู้ฝึกสัมภาษณ์ (Candidates / End Users บน Web & Mobile), ผู้วิจัย (Researchers เฉพาะบน Web ใน R3), "
    "ผู้ดูแลระบบการเงิน (Finance Admin เฉพาะบน Web ใน R3), ผู้ดูแลระบบ (System Admin เฉพาะบน Web), Product Owner, Technical/Mobile/AI Lead, QA และ Data Privacy Officer"
)
add_styled_p(doc, evidence_text, space_after=8)

# 5. CHAPTER 3
add_heading_1(doc, "3. Scope, Assumptions and Release Plan")

scope_headers = ["Release", "ขอบเขตที่ตกลง (Scope Baseline)", "ขอบเขตแพลตฟอร์ม (Platform Boundaries)", "สิ่งที่ไม่รวม (Out-of-Scope)"]
scope_rows = [
    ("R1 / Core MVP", 
     "Email/Password login, onboarding, 1+ interview category, text practice, AI rubric scoring & feedback, history, responsive UI, privacy controls, basic admin configuration. Shared backend REST APIs mobile-ready.",
     "Web Application: Desktop, Tablet, Mobile Browser ครอบคลุม End User และ Admin",
     "Payment, voice analytics, native mobile apps, researcher export, B2B multi-tenancy"),
    ("R2 / Enhanced AI & Mobile",
     "Voice/STT practice with granular consent, communication measurements (pace, pauses, fillers), English grammar analysis, adaptive difficulty, progress dashboard, sample responses. Native Mobile App (iOS / Android) for End Users (Pending D-M01).",
     "Web Application: ฟังก์ชันทั้งหมด\nNative Mobile App: ฟังก์ชันเฉพาะ End Users (Text & Voice Practice, History, Dashboard)",
     "Commercial payment gateway (เว้นแต่ R3 ได้รับอนุมัติ), Admin บน Mobile, Researcher บน Mobile"),
    ("R3 / Commercial & Research",
     "Subscription tiers (Free, Basic, Pro), atomic entitlement ledger, payment gateway / Mobile IAP (D-M04), invoices/receipts, renewal & refund workflows, Finance tools, governed research data releases.",
     "Web Application: ทุกบทบาท\nNative Mobile App: End Users (แสดงข้อมูลแพ็กเกจ, โควตา, ประวัติธุรกรรม)",
     "B2B organization enterprise management, การเข้าถึงเครื่องมือ Admin/Researcher ผ่าน Mobile")
]
create_table_from_data(doc, scope_headers, scope_rows, [28, 55, 42, 32], ['left', 'left', 'left', 'left'], special_rules={0: {'bold': True, 'color': (30, 58, 138)}})

add_callout(doc,
    "1. ทั้ง Web Application และ Native Mobile Application ใช้ Shared Backend Architecture เดียวกันผ่าน HTTPS REST APIs โดยไม่มีการแยก Database หรือทำ Business Logic ซ้ำซ้อน\n"
    "2. Native Mobile Application จำกัดเฉพาะ End Users (Guest, Registered User) เท่านั้น; ฟังก์ชัน Admin และ Researcher ทั้งหมดเปิดให้ใช้งานผ่าน Web Application เท่านั้น\n"
    "3. โมบายแอปพลิเคชันจัดเก็บ Authentication Token ใน Secure Hardware Storage (iOS Keychain / Android Keystore) เท่านั้น\n"
    "4. การฝึกสัมภาษณ์ด้วย AI ต้องการการเชื่อมต่ออินเทอร์เน็ต (Online-required); โมบายแอปจะรองรับการเก็บ Transient Cache สำหรับร่างคำตอบเพื่อป้องกันข้อมูลสูญหายเมื่อเครือข่ายขัดข้อง แต่ไม่มี On-device AI Processing ใน R1/R2 (Pending D-M08)\n"
    "5. สามารถใช้ LLM แบบ hosted ผ่าน backend adapter โดยไม่ต้องฝึกโมเดลใหม่เองใน R1; ไม่บันทึก raw audio ใน R1; การใช้ข้อมูล survey ต้องเคารพ consent",
    title="[i] สมมติฐานหลักของระบบ (System Assumptions)",
    border_color="0284C7", bg_color="F0F9FF")

# 6. CHAPTER 4
add_heading_1(doc, "4. System Context and Use Cases")

uc_headers = ["UC", "Actor", "Trigger / Result", "Platform Scope", "Release"]
uc_rows = [
    ("UC01", "Guest", "สมัครสมาชิก / ยืนยันอีเมล / Login สำเร็จหรือแจ้งข้อผิดพลาด", "Web & Native Mobile", "R1"),
    ("UC02", "User", "กำหนดบริบท ประเภท และระดับความยากของการฝึกสัมภาษณ์", "Web & Native Mobile", "R1"),
    ("UC03", "User", "เริ่มฝึก / ส่งคำตอบข้อความ / จบหรือยกเลิกเซสชัน", "Web & Native Mobile", "R1"),
    ("UC04", "User", "รับคะแนน Feedback คำแนะนำ และเหตุผลที่อ้างอิงคำตอบตนเอง", "Web & Native Mobile", "R1"),
    ("UC05", "User", "ดูประวัติ / ส่งออกข้อมูลตนเอง / ขอลบข้อมูล (DSR)", "Web & Native Mobile", "R1"),
    ("UC06", "Admin", "จัดการ Question Bank, Rubric, Prompt Version และดู Audit Log", "Web Only", "R1"),
    ("UC07", "User", "ฝึกสัมภาษณ์ด้วยเสียง (Voice/STT) และดูตัวชี้วัดการพูด", "Web & Native Mobile", "R2"),
    ("UC08", "User", "ดู Dashboard แสดงพัฒนาการคะแนนและประวัติการฝึก", "Web & Native Mobile", "R2"),
    ("UC09", "User/Gateway", "ซื้อแพ็กเกจ / ต่ออายุ / ขอยกเลิกหรือขอคืนเงิน", "Web & Native Mobile (D-M04)", "R3"),
    ("UC10", "Researcher", "ขอเข้าถึงและส่งออกชุดข้อมูลวิจัยสรุปภาพรวมที่ได้รับอนุมัติ", "Web Only", "R3")
]
create_table_from_data(doc, uc_headers, uc_rows, [16, 22, 65, 36, 18], ['center', 'left', 'left', 'center', 'center'],
    special_rules={
        0: {'bold': True, 'color': (30, 58, 138)},
        1: {'bold': True, 'color': (30, 41, 59)},
        3: {'bold': True, 'color': (6, 95, 70)},
        4: {'bold': True, 'color': (29, 78, 216)}
    })

doc.add_page_break()

# 7. CHAPTER 5
add_heading_1(doc, "5. Functional Requirements")
add_styled_p(doc, 
    "ข้อกำหนดเชิงฟังก์ชัน (FR01–FR36) ครอบคลุมฟังก์ชันการทำงานหลักของระบบ InterviewX ทั้งบน Web Application และ Native Mobile Application แบ่งตามระยะการปล่อยระบบ (Release R1, R2, R3) พร้อมเกณฑ์การยอมรับ (Acceptance Criteria) และการจำแนกขอบเขตแพลตฟอร์มอย่างชัดเจน",
    space_after=8, color_rgb=(71, 85, 105), italic=True)

p_idx = 35
while p_idx < 195:
    p = src_doc.paragraphs[p_idx]
    if p.style.name == 'Heading 3' and p.text.startswith('FR'):
        title = p.text.strip()
        line_meta = src_doc.paragraphs[p_idx + 1].text.strip()
        line_req = src_doc.paragraphs[p_idx + 2].text.strip()
        line_ac = src_doc.paragraphs[p_idx + 3].text.strip()
        
        plat_tag = "Shared Web & Mobile"
        if any(admin_fr in title for admin_fr in ["FR18.1", "FR30", "FR31", "FR32", "FR32.1"]):
            plat_tag = "Web Only (Admin/Researcher)"
        elif "FR34" in title:
            plat_tag = "Web Only (Admin Console)"
        elif any(dual_fr in title for dual_fr in ["FR27", "FR35", "FR36"]):
            plat_tag = "Shared (User) / Web (Admin)"
        elif any(back_fr in title for back_fr in ["FR23", "FR25"]):
            plat_tag = "Shared (Backend Service)"
            
        line_meta = f"{line_meta} | Platform: {plat_tag}"
        
        if "FR15" in title:
            title = "FR15 — Multi-Platform Access & Consistency (Responsive Web & Native Mobile)"
            line_meta = "ระยะ: R1 (Web) / R2 (Mobile) | Priority: Must | ที่มา: Survey 84 both; Phase 1 Platform Alignment | Platform: Shared Web & Mobile"
            line_req = (
                "ระบบต้องให้บริการผ่าน 2 ส่วนหน้าหลักที่ทำงานร่วมกับระบบแบ็กเอนด์ศูนย์กลาง (Shared Backend): "
                "1. Responsive Web Application: รองรับการทำงานบน Desktop, Tablet และ Mobile Browser โดยสนับสนุนทุกกลุ่มผู้ใช้ตามบทบาท (Guest, Registered User, Researcher, Finance Admin, System Admin) "
                "2. Native Mobile Application: แอปพลิเคชันติดตั้งแยกต่างหากบนระบบปฏิบัติการ iOS และ Android ออกแบบเฉพาะสำหรับ End Users (Guest, Registered User) โดยรองรับสิทธิ์การใช้งานตามระดับแพ็กเกจ (Free, Basic, Pro) "
                "ทั้งสองแพลตฟอร์มต้องใช้ระบบยืนยันตัวตน (Authentication) เดียวกัน ข้อมูลบัญชี ประวัติการฝึกสัมภาษณ์ และสิทธิ์การใช้งาน (Entitlements) ต้องซิงค์ตรงกันอย่างสมบูรณ์ และมีระบบควบคุมการเข้าถึงที่จำกัดสิทธิ์หน้าจอผู้ดูแลระบบ (Admin) และระบบวิจัย (Researcher) ให้เข้าถึงได้เฉพาะบน Web Application เท่านั้น"
            )
            line_ac = (
                "1. Responsive Web Application แสดงผลถูกต้องและใช้งานได้สมบูรณ์บน Viewport ตั้งแต่ 360px (Mobile) จนถึง 4K Desktop บนบราวเซอร์หลัก (Chrome, Safari, Edge, Firefox) โดยมุ่งสู่มาตรฐาน WCAG 2.2 AA\n"
                "2. Native Mobile Application สามารถติดตั้งและทำงานได้สมบูรณ์บนระบบปฏิบัติการ iOS (เวอร์ชัน 16.0 ขึ้นไป) และ Android (เวอร์ชัน 13.0 ขึ้นไป) ตามข้อเสนอการตัดสินใจ D-M03\n"
                "3. ระบบจำกัดสิทธิ์แพลตฟอร์มอย่างเข้มงวด: Guest และ Registered User เข้าใช้งานได้ทั้ง Web และ Mobile; ในขณะที่ Researcher, Finance Admin และ System Admin สามารถเข้าถึงระบบงานบริหารจัดการและวิจัยได้เฉพาะบน Web Application เท่านั้น หากบัญชี Admin เข้าสู่ระบบบน Mobile จะเข้าถึงได้เฉพาะฟังก์ชันผู้ใช้ทั่วไปและไม่มีสิทธิ์เข้าถึงหน้า Admin Console\n"
                "4. ผู้ใช้สามารถใช้บัญชีเดียว (Single Identity) ล็อกอินเข้าใช้งานสลับระหว่าง Web และ Mobile ได้อย่างไร้รอยต่อ โดย Session Token ถูกจัดเก็บอย่างปลอดภัยตามมาตรฐานของแต่ละแพลตฟอร์ม (HTTP-only Cookies บน Web; iOS Keychain / Android Keystore บน Mobile)\n"
                "5. สิทธิ์การใช้งานแพ็กเกจ (Free, Basic, Pro) และโควตาคงเหลือได้รับการตรวจสอบและบังคับใช้ที่ฝั่งเซิร์ฟเวอร์ (Server-side atomic check) เหมือนกันไม่ว่าจะมาจาก Web หรือ Mobile\n"
                "6. ข้อมูลประวัติการสัมภาษณ์ คำตอบ และผลการประเมินที่ทำบนแพลตฟอร์มหนึ่ง จะต้องปรากฏบนอีกแพลตฟอร์มหนึ่งทันทีเมื่อดึงข้อมูลใหม่ (ความล่าช้าในการซิงค์ P95 ≤ 2 วินาทีภายใต้สภาวะเครือข่ายปกติ)\n"
                "7. โมบายแอปพลิเคชันต้องรองรับการรับมือเหตุการณ์เครือข่ายขัดข้อง (Network Resilience) โดยสามารถเก็บข้อมูลชั่วคราวและแจ้งเตือนผู้ใช้ให้ส่งซ้ำได้โดยไม่มีข้อมูลสูญหาย"
            )
            
        add_fr_item(doc, title, line_meta, line_req, line_ac)
        p_idx += 4
    else:
        p_idx += 1

doc.add_page_break()

# 8. CHAPTER 6
add_heading_1(doc, "6. Non-Functional Requirements")

nfr_headers = ["ID", "หัวข้อและข้อกำหนด", "เกณฑ์เป้าหมายการยอมรับ (Acceptance Targets)", "การจัดแนวแพลตฟอร์ม (Platform Alignment)", "วิธีการทดสอบ"]
nfr_rows = [
    ("NFR01", "Security & Data Protection", "TLS 1.2+ (แนะนำ TLS 1.3), AES-256 at rest, Managed Secrets, Strong Password Hashing",
     "Web: HTTP-only SameSite Cookies\nMobile: iOS Keychain / Android Keystore", "Config Scan, Mobile Binary Analysis"),
    ("NFR02", "AI Evaluation Quality", "Goal Correlation ≥0.70 และ MAE ≤15/100 เมื่อเทียบกับผู้เชี่ยวชาญมนุษย์ 2 คน แยกไทย/อังกฤษ",
     "Shared AI: รันการประเมินบนเซิร์ฟเวอร์กลาง ผลลัพธ์และเกณฑ์เดียวกันไม่ว่าจะส่งจาก Web หรือ Mobile", "Benchmark Sample + Blinded Scoring"),
    ("NFR03", "Usability", "SUS ≥70 และผู้ใช้ ≥90% ทำงานหลักสำเร็จในการทดสอบแบบ Moderated",
     "Web: บราวเซอร์ Desktop/Mobile\nMobile: iOS HIG & Android Material Design", "Usability Study per Platform"),
    ("NFR04", "Performance", "Web Non-AI P95 ≤2s; Mobile Cellular P95 ≤2.5s; Text Feedback P95 ≤15s; Mobile Cold Start ≤2.0s",
     "Shared: ติดตาม Latency แยกตามช่องทางเครือข่าย", "Load Test by Endpoint & Network Throttling"),
    ("NFR05", "Availability", "≥99.5% ตลอดรอบเดือนปฏิทินสำหรับ Production API Endpoint",
     "Shared Backend: ให้บริการทั้ง Web และ Mobile ภายใต้ SLA เดียวกัน", "Synthetic Health Monitoring"),
    ("NFR06", "Unit Economics", "ติดตามต้นทุน Token ต่อเซสชันที่เสร็จสมบูรณ์ พร้อมระบบแจ้งเตือนงบประมาณ",
     "Shared: นับรวมต้นทุนจากทุกแพลตฟอร์มเข้าสู่ Dashboard เดียวกัน", "Usage/Cost Dashboard"),
    ("NFR07", "Localization", "รองรับส่วนติดต่อผู้ใช้และเนื้อหาทั้งภาษาไทยและอังกฤษอย่างสมบูรณ์",
     "Shared: ใช้ชุดคำแปล (i18n) และการจัดรูปแบบสอดคล้องกันทั้ง Web และ Mobile", "Bilingual Test Cases per Locale"),
    ("NFR08", "Cross-Platform Accessibility & Consistency", 
     "Web: WCAG 2.2 AA สำหรับ Core Workflows\nMobile: iOS VoiceOver/Dynamic Type, Android TalkBack\nConsistency: ข้อมูลบัญชี ประวัติ และสิทธิ์ตรงกัน 100% (Proposed Targets — Pending Approval)",
     "Cross-Platform Requirement: ตัวเลขเป็นข้อเสนอที่รอการอนุมัติ ห้ามทดแทนค่าเดิมโดยไม่แจ้ง", "axe + Screen Readers + Data Sync Test"),
    ("NFR09", "Retention & Local Storage", "เสียงดิบไม่ Opt-in ลบใน 24h (Hard Cap); Opt-in ≤90d; ลบบัญชี ≤30d",
     "Mobile: แคชไฟล์เสียงชั่วคราวในเครื่องต้องถูกลบทันทีหลังอัปโหลดเสร็จสิ้น", "Storage Expiry Audit + Local Sandbox Scan"),
    ("NFR10", "Payment Scope", "Hosted/Tokenized Gateway; ห้ามจัดเก็บหรือส่งผ่านข้อมูลบัตร (PAN/CVV)",
     "Web: Hosted Checkout\nMobile: Hosted Checkout หรือ StoreKit/Play (D-M04)", "PCI Scope & Data-Flow Review"),
    ("NFR11", "Transaction Security", "ตรวจสอบ HMAC Webhook Signatures และมีกลไกป้องกัน Replay Attack",
     "Shared Backend: ตรวจสอบที่ฝั่งเซิร์ฟเวอร์เท่านั้น", "Webhook Signature Tampering Test"),
    ("NFR12", "Idempotency", "เหตุการณ์ชำระเงินหรือส่งคำตอบซ้ำ ต้องก่อให้เกิดผลลัพธ์ Exactly-Once",
     "Shared: ใช้ Idempotency-Key (UUIDv4) จากไคลเอนต์ทั้ง Web และ Mobile", "Duplicate Event Load Test"),
    ("NFR13", "Payment Visibility", "Redirect P95 ≤5s; แสดงสถานะรอตรวจสอบ (Pending) ชัดเจน",
     "Shared: แสดงสถานะรอการยืนยันทั้งบน Web และ Mobile", "Async Payment Observability"),
    ("NFR14", "Payment Availability", "เฝ้าระวัง Provider และจัดเตรียมสถานะที่กู้คืนได้เมื่อระบบภายนอกขัดข้อง",
     "Shared Backend: มีระบบตรวจสอบยอดและกระทบยอดอัตโนมัติ", "Provider Failover Tabletop"),
    ("NFR15", "Auditability", "บันทึกประวัติ State Transition สำคัญ 100% พร้อมกระทบยอดธุรกรรมรายวัน",
     "Web Only: หน้าจอตรวจสอบและรายงานผลกระทบยอดจำกัดเฉพาะ Web Application", "Daily Reconciliation Report Audit"),
    ("NFR16", "Tax Compliance", "ออกเอกสารรับชำระเงินที่ถูกต้องตามกฎหมายของนิติบุคคลผู้ให้บริการ",
     "Shared Backend: ออกใบเสร็จจากระบบกลาง; Mobile ปฏิบัติตามกฎ Store", "Legal & Document Tests"),
    ("NFR17", "Research Privacy", "กลุ่มตัวอย่าง Distinct Users ≥ 10 คน และตรวจจับ Differencing Attacks",
     "Web Only: เครื่องมือสืบค้นและส่งออกข้อมูลวิจัยจำกัดเฉพาะ Web Application", "Re-identification Risk Review"),
    ("NFR18", "Voice Isolation", "ผู้วิจัยมีสิทธิ์เข้าถึงไฟล์เสียงดิบเป็น 0%; ผู้ดูแลระบบเข้าถึงได้เฉพาะกรณีพิเศษที่มี Audit",
     "Shared Backend: ควบคุมที่ระดับ API Gateway และ Object Storage ACL", "Automated Negative Permission Tests"),
    ("NFR19", "Authorization & IDOR", "บล็อกการเข้าถึงข้ามบัญชี (IDOR) 100% บนทุก Protected Endpoint; Default Deny",
     "Shared Backend: ตรวจสอบสิทธิ์ที่เซิร์ฟเวอร์ทุกครั้ง ไคลเอนต์โมบายไม่เก็บตรรกะสิทธิ์", "Automated Negative IDOR Test Suite"),
    ("NFR20", "LLM Safety", "ชุดทดสอบป้องกัน Prompt Injection; ข้อมูลส่งออกจากโมเดลถือเป็น Untrusted Input",
     "Shared AI: คัดกรองและตรวจสอบ JSON Schema ก่อนส่งกลับไคลเอนต์", "Red-Team Test Prompts"),
    ("NFR21", "Model Governance", "บันทึกเวอร์ชัน Model, Prompt และ Rubric กำกับไว้ในทุกผลการประเมิน",
     "Shared AI: Version Registry ศูนย์กลางเพื่อตรวจสอบย้อนหลังได้ 100%", "CI Benchmark Report"),
    ("NFR22", "Scalability", "รองรับ 100 Concurrent Active Users ในระยะ R1 โดย Non-AI API Failure ≤ 1%",
     "Shared Infra: รองรับภาระงานรวมจากทั้ง Web และ Native Mobile Applications", "Concurrency Load Test"),
    ("NFR23", "Disaster Recovery", "RPO ≤ 24 ชั่วโมง และ RTO ≤ 8 ชั่วโมง พร้อมจัดซ้อมกู้คืนระบบรายไตรมาส",
     "Shared Database: สำรองข้อมูลหลักอย่างสม่ำเสมอ ครอบคลุมผู้ใช้ทุกแพลตฟอร์ม", "Quarterly Restore Drill"),
    ("NFR24", "Monitoring", "มี Correlation ID ติดตามคำขอตั้งแต่ไคลเอนต์, Dashboard แจ้งเตือนข้อผิดพลาดและต้นทุน",
     "Shared: รวบรวม Logs, Metrics, Traces และ Mobile Crash Reports สู่ระบบกลาง", "Observability Walkthrough")
]
create_table_from_data(doc, nfr_headers, nfr_rows, [16, 32, 45, 36, 28], ['center', 'left', 'left', 'left', 'left'],
    special_rules={
        0: {'bold': True, 'color': (30, 58, 138)},
        1: {'bold': True, 'color': (30, 41, 59)}
    })

add_callout(doc,
    "ค่ากำหนดเชิงตัวเลขในหัวข้อนี้ (เช่น Web WCAG 2.2 AA, Mobile Screen Readers, ความสอดคล้องของข้อมูล 100%, และ Latency บนเครือข่ายมือถือ) "
    "เป็น acceptance targets ที่เสนอสำหรับการทดสอบ (Proposed Targets — Pending Approval) ไม่ใช่ค่าที่อนุมานจากแบบสอบถามหรือผลทดสอบที่ผ่านแล้ว; "
    "ก่อน production launch ต้องมีผลทดสอบบันทึกประกอบ",
    title="[i] คำชี้แจงเป้าหมายการทดสอบ NFR (Acceptance Targets Notice)",
    border_color="2563EB", bg_color="EFF6FF")

doc.add_page_break()

# 9. CHAPTER 7
add_heading_1(doc, "7. Role, Authorization and Entitlements")
rbac_intro = (
    "การควบคุมสิทธิ์ใน InterviewX แบ่งแยกออกเป็น 3 แกนหลักอย่างชัดเจน:\n"
    "1. Security Role: กำหนดว่าผู้ใช้มีบทบาทใดและได้รับสิทธิ์เข้าถึงฟังก์ชันระดับระบบใด (guest, user, researcher, finance_admin, system_admin)\n"
    "2. Subscription Entitlement: กำหนดโควตาการใช้งานและฟีเจอร์ที่ Registered User ได้รับตามระดับแพ็กเกจ (Free, Basic, Pro) ซึ่งไม่ใช่ Security Role\n"
    "3. Platform Scope: กำหนดว่าผู้ใช้สามารถเข้าใช้งานผ่านหน้าจอแสดงผลใดได้บ้าง (Web Application vs. Native Mobile Application)"
)
add_styled_p(doc, rbac_intro, space_after=6)

add_heading_2(doc, "7.1 Resource / Action Permission Matrix")
copy_and_format_table(doc, src_doc.tables[6], [42, 20, 25, 23, 23, 24], ['left', 'center', 'center', 'center', 'center', 'center'],
    special_rules={0: {'bold': True, 'color': (30, 41, 59)}})

add_heading_2(doc, "7.2 Platform Access Matrix (Role × Platform)")
pam_headers = ["Security Role", "Web Application", "Native Mobile Application", "ขอบเขตการทำงานและข้อจำกัดของแพลตฟอร์ม", "สถานะการอนุมัติ"]
pam_rows = [
    ("Guest (Unauthenticated)", "Yes", "Yes", "เข้าถึงหน้าแรก แนะนำฟีเจอร์ สมัครสมาชิก เข้าสู่ระบบ และทดลองฝึกเซสชันสั้น ไม่สามารถดูประวัติส่วนตัวได้", "Approved Baseline"),
    ("Registered User (User)", "Yes", "Yes", "เข้าถึงการฝึกสัมภาษณ์เต็มรูปแบบ (Text/Voice), ประวัติการฝึก, Dashboard, Profile, Consent และดูแพ็กเกจ", "Approved Baseline"),
    ("Researcher", "Yes", "No", "เข้าถึงระบบงานวิจัย การสืบค้นชุดข้อมูลภาพรวม และการส่งออกข้อมูลวิจัยที่อนุมัติ ไม่อนุญาตให้เข้าถึงผ่าน Mobile", "Approved Baseline"),
    ("Payment / Finance Admin", "Yes", "No", "เข้าถึงรายงานการเงิน รายการธุรกรรม การพิจารณาคืนเงิน และการกำหนดเวอร์ชันราคา ไม่อนุญาตให้เข้าถึงผ่าน Mobile", "Approved Baseline"),
    ("System Admin", "Yes", "No", "เข้าถึงระบบจัดการ Question Bank, Rubric, Prompt, ผู้ใช้งาน และ Audit Log ทั้งหมด ไม่อนุญาตให้เข้าถึงผ่าน Mobile", "Approved Baseline")
]
create_table_from_data(doc, pam_headers, pam_rows, [28, 22, 24, 58, 25], ['left', 'center', 'center', 'left', 'center'],
    special_rules={0: {'bold': True, 'color': (30, 58, 138)}})

add_heading_2(doc, "7.3 Subscription Entitlement Matrix (Tier × Platform)")
sub_headers = ["Subscription Tier", "Web Application", "Native Mobile Application", "ฟีเจอร์และโควตาการใช้งานที่เสนอ (Pending D05)", "กลไกการบังคับใช้สิทธิ์"]
sub_rows = [
    ("Free Tier", "ตามสิทธิ์", "ตามสิทธิ์", "ข้อเสนอ: 5 เซสชันข้อความ/เดือน, 1 หมวดสัมภาษณ์หลัก, 0 เซสชันเสียง, ประวัติมาตรฐาน", "Atomic Server-side Quota Ledger"),
    ("Basic Tier", "ตามสิทธิ์", "ตามสิทธิ์", "ข้อเสนอ: 30 เซสชันข้อความ/เดือน, 10 เซสชันเสียง/เดือน, ทุกหมวดสัมภาษณ์, วิเคราะห์ Grammar", "Atomic Server-side Quota Ledger"),
    ("Pro Tier", "ตามสิทธิ์", "ตามสิทธิ์", "ข้อเสนอ: เซสชันข้อความและเสียงไม่จำกัด (ภายใต้ FUP), วิเคราะห์การพูดขั้นสูง, สิทธิ์คิว AI ลำดับแรก", "Atomic Server-side Quota Ledger + FUP")
]
create_table_from_data(doc, sub_headers, sub_rows, [28, 24, 25, 48, 32], ['left', 'center', 'center', 'left', 'left'],
    special_rules={0: {'bold': True, 'color': (29, 78, 216)}})

add_heading_2(doc, "7.4 Core Authorization Rules (กฎเหล็กด้านการควบคุมสิทธิ์ 7 ประการ)")
auth_rules = [
    ("Rule 1: Platform does not replace Role", "ชนิดของแพลตฟอร์ม (Web หรือ Mobile) เป็นเพียงหน้าจอแสดงผล ไม่ใช่ตัวกำหนดสิทธิ์ สิทธิ์ที่แท้จริงถูกควบคุมโดย Token และ Role ในระบบแบ็กเอนด์"),
    ("Rule 2: Subscription does not replace Role", "แพ็กเกจ Free, Basic, Pro เป็นเพียงระดับ Entitlement ของ Registered User ไม่ใช่ Role ผู้ใช้ทั้งสามระดับถือ Security Role เดียวกันคือ 'user'"),
    ("Rule 3: Guest Boundary", "ผู้ใช้ที่เป็น Guest ไม่สามารถเข้าถึงข้อมูลเฉพาะของบัญชี ประวัติการฝึก หรือข้อมูลส่วนบุคคลได้จนกว่าจะผ่านการยืนยันตัวตน"),
    ("Rule 4: Resource Ownership", "Registered User เข้าถึงได้เฉพาะข้อมูลที่ตนเองเป็นเจ้าของเท่านั้น ระบบต้องป้องกัน IDOR บนทุก API Endpoint"),
    ("Rule 5: Server-Side Entitlement Validation", "การตรวจสอบโควตาและสิทธิ์ของแพ็กเกจต้องทำที่เซิร์ฟเวอร์แบบ Atomic ทุกครั้งก่อนเริ่มเซสชัน ห้ามเชื่อถือข้อมูลสิทธิ์ที่ไคลเอนต์ส่งมา"),
    ("Rule 6: Unified API Authorization", "ทุก API Endpoint ต้องบังคับใช้การตรวจสอบตัวตน (Authentication), บทบาท (Role), สิทธิ์ในข้อมูล (Ownership) และความยินยอม (Consent) อย่างครบถ้วน"),
    ("Rule 7: Defense in Depth (No UI-only security)", "การซ่อนปุ่มหรือเมนูบนหน้าจอ Web หรือ Mobile ไม่ถือเป็นการรักษาความปลอดภัย แบ็กเอนด์ต้องปฏิเสธคำขอที่ไม่ได้รับอนุญาตเสมอ")
]
for r_title, r_desc in auth_rules:
    p_ar = doc.add_paragraph()
    p_ar.paragraph_format.space_before = Pt(2)
    p_ar.paragraph_format.space_after = Pt(3)
    p_ar.paragraph_format.left_indent = Inches(0.2)
    r_ar_t = p_ar.add_run(f"• {r_title}: ")
    set_run_font(r_ar_t, size_pt=14, bold=True, color_rgb=(15, 23, 42))
    r_ar_d = p_ar.add_run(r_desc)
    set_run_font(r_ar_d, size_pt=14, color_rgb=(30, 41, 59))

# 10. CHAPTER 8
add_heading_1(doc, "8. AI Layer and Evaluation")
ai_bullets = [
    ("Pipeline (กระบวนการ AI Scorer):", src_doc.paragraphs[201].text.replace("Pipeline: ", "")),
    ("RAG / Embedding ทางเลือก:", src_doc.paragraphs[202].text),
    ("Rubric เกณฑ์การให้คะแนน:", src_doc.paragraphs[203].text.replace("Rubric default: ", "")),
    ("Dataset ชุดข้อมูลทดสอบ:", src_doc.paragraphs[204].text.replace("Dataset: ", "")),
    ("Validation การตรวจสอบความถูกต้อง:", src_doc.paragraphs[205].text.replace("Validation: ", "")),
    ("Failure Mode การจัดการกรณีระบบขัดข้อง:", src_doc.paragraphs[206].text.replace("Failure mode: ", "")),
    ("ข้อจำกัดและข้อควรระวัง (AI Constraints):", src_doc.paragraphs[207].text),
    ("Server-Side AI Architecture Notice:", "การประมวลผลโมเดล AI ทั้งหมดทำงานบนระบบคลาวด์/เซิร์ฟเวอร์ส่วนกลางผ่าน FastAPI Inference Engine ไม่มีการรันโมเดลประเมินผลบนเครื่องมือถือ (Pending D-M08) เพื่อรักษาความแม่นยำและการควบคุมเวอร์ชันอย่างสมบูรณ์")
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

# 11. CHAPTER 9
add_heading_1(doc, "9. Privacy, Consent and Research Data")
add_styled_p(doc, src_doc.paragraphs[209].text, space_after=6)

copy_and_format_table(doc, src_doc.tables[7], [38, 57, 62], ['left', 'left', 'left'],
    special_rules={0: {'bold': True, 'font': 'Consolas', 'size': 11.5, 'color': (15, 23, 42)}})

add_callout(doc, src_doc.paragraphs[210].text, title="[!] นโยบายความปลอดภัยข้อมูลการวิจัย (Research Data Security & RLS Policy)", border_color="7C3AED", bg_color="F5F3FF")

privacy_lifecycle_text = (
    "Audio lifecycle & Mobile Local Storage: temporary encrypted processing; no longer than necessary (draft default ceiling 24h) for non-opted-in raw audio; "
    "optional retention ≤90d; deletion requests processed promptly (draft SLA ≤30d except legal holds). "
    "บนอุปกรณ์มือถือ ข้อมูลแคชไฟล์เสียงหรือร่างคำตอบต้องถูกเก็บใน Private Application Sandbox และถูกลบทันทีหลังการอัปโหลดหรือเมื่อผู้ใช้ออกจากระบบ "
    "โมบายแอปพลิเคชันต้องปฏิบัติตามนโยบายความคุ้มครองข้อมูลของ Apple และ Google รวมถึงมีขั้นตอนขอลบบัญชีภายในแอป (In-app Account Deletion ตาม FR35)"
)
add_styled_p(doc, privacy_lifecycle_text, space_before=4, space_after=8)

# 12. CHAPTER 10
add_heading_1(doc, "10. Package, Payment and Refund Governance")

add_callout(doc, src_doc.paragraphs[213].text, title="[!] ข้อจำกัดและข้อควรระวังด้านแพ็กเกจ (R3 Scope Warning)", border_color="D97706", bg_color="FFFBEB")

copy_and_format_table(doc, src_doc.tables[8], [38, 57, 62], ['left', 'left', 'left'],
    special_rules={
        0: {'bold': True, 'color': (30, 58, 138)},
        1: {'color': (100, 116, 139)},
        2: {'bold': True, 'color': (15, 23, 42)}
    })

payment_text = (
    "Payment state machine: initiated → pending → confirmed/failed; refund_requested → approved/rejected → processing → refunded/failed. "
    "Process gateway events idempotently, verify authenticity and reconcile periodically. All entitlement grants from confirmed payments only.\n\n"
    "Mobile Payment Architecture (Decision D-M04): การจำหน่ายแพ็กเกจบน Native Mobile App อยู่ระหว่างรอการตัดสินใจเลือกระหว่าง "
    "Option A (Hybrid Web Checkout: แสดงข้อมูลในแอปและเปลี่ยนเส้นทางไปชำระบน Web) หรือ Option B (Native In-App Purchase ผ่าน StoreKit/Play Billing) ซึ่งต้องพิจารณาค่าธรรมเนียม Store 15-30%"
)
add_styled_p(doc, payment_text, space_before=4, space_after=8)

doc.add_page_break()

# 13. CHAPTER 11
add_heading_1(doc, "11. Data Model and Data Dictionary")
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

add_heading_2(doc, "11.1 Corrected research aggregation relationship")
add_styled_p(doc, src_doc.paragraphs[218].text, space_after=4)

sql_lines = [src_doc.paragraphs[i].text for i in range(219, 230)]
add_code_block(doc, sql_lines, title="Listing 11.1: ตัวอย่าง Conceptual Read-only Query สำหรับ Research Aggregation")

add_callout(doc, src_doc.paragraphs[230].text, title="[!] ข้อควรระวังด้านความเป็นส่วนตัว (Privacy & Aggregation Notice)", border_color="DC2626", bg_color="FEF2F2")

doc.add_page_break()

# 14. CHAPTER 12
add_heading_1(doc, "12. Architecture, Interfaces, Operations")

copy_and_format_table(doc, src_doc.tables[10], [28, 65, 64], ['left', 'left', 'left'],
    special_rules={0: {'bold': True, 'color': (30, 58, 138)}})

add_heading_2(doc, "12.1 Cross-Platform Data Synchronization Matrix")
sync_headers = ["หมวดหมู่ข้อมูล", "Context Owner", "แหล่งความจริง", "Responsible API", "สิทธิ์การเข้าถึง", "Sync Behavior", "Conflict Handling", "ความปลอดภัย"]
sync_rows = [
    ("Account Information", "Identity", "USERS, AUTH_IDENTITIES", "/api/v1/auth/me", "Read (User), Write (Auth)", "ซิงค์เมื่อเปิดแอป; ตรวจสอบ Token ทุก 15 นาที", "เซิร์ฟเวอร์ถือเป็นที่สิ้นสุด; 409 Conflict หากชนกัน", "Tokens ใน Keychain / Keystore; TLS 1.3"),
    ("User Profile", "User", "USERS (status, skill)", "/api/v1/users/profile", "Read / Write โดยเจ้าของ", "ซิงค์เมื่อเปิดแอปและเมื่อแก้ไข; Optimistic UI", "Last-write-wins อิง server updated_at", "ตรวจ Ownership; Validate Schema เข้มงวด"),
    ("Subscription Entitlement", "Billing", "SUBSCRIPTIONS, USAGE_LEDGER", "/api/v1/entitlements/check", "Read-only สำหรับไคลเอนต์", "ดึงก่อนเริ่มฝึก; ตัดโควตา Atomic ที่เซิร์ฟเวอร์", "เซิร์ฟเวอร์สูงสุดเสมอ; ห้ามแคชสิทธิ์ตัดสินใจ", "ตัดโควตาที่เซิร์ฟเวอร์ ป้องกันการปลอมสิทธิ์"),
    ("Interview Session", "Interview", "INTERVIEW_SESSIONS", "/api/v1/interviews/{id}/answers", "Read / Write โดยเจ้าของ", "Request/Response รายข้อ; แคชชั่วคราวเมื่อเน็ตหลุด", "ใช้ Idempotency-Key (UUIDv4) ป้องกันคำตอบซ้ำ", "ผูกกับ User ID; CSRF บน Web, Bearer บน Mobile"),
    ("Interview History", "Interview", "SESSIONS, ANSWERS, FEEDBACK", "/api/v1/interviews/history", "Read-only; Delete โดยเจ้าของ", "ดึงแบบ Pagination; ซิงค์เมื่อฝึกเสร็จหรือลบ", "Append-only log; ข้อมูลลบจะถูกซ่อนทันที", "กรองตาม User ID; ข้อมูล Soft Delete ถูกคัดออก"),
    ("AI Evaluation Results", "Evaluation", "FEEDBACK, EVAL_JOBS", "/api/v1/evaluations/{jobId}", "Read-only โดยเจ้าของ", "Async Polling (P95 ≤15s) หรือ Push Notification", "Immutable ติด Rubric/Model Version ห้ามแก้", "แสดงผลเฉพาะเจ้าของ; ยื่นอุทธรณ์เข้าคิว Admin"),
    ("User Preferences", "User / Client", "USER_PREFERENCES + Storage", "/api/v1/users/preferences", "Read / Write โดยเจ้าของ", "ค่าสากลซิงค์ผ่านคลาวด์; ค่าเครื่องเก็บเฉพาะในเครื่อง", "ค่าสากลอิงเซิร์ฟเวอร์; ค่าเฉพาะเครื่องคงเดิม", "Validate Preferences Schema ไม่เก็บข้อมูลอ่อนไหว"),
    ("Consent Records", "Privacy", "CONSENT_EVENTS, NOTICES", "/api/v1/privacy/consents", "Read Active; Write Append-only", "ซิงค์เมื่อเปิดแอป; Notice ใหม่บังคับกดยอมรับ", "Event Stream; รายการล่าสุดต่อ Purpose มีผล", "Audit Trail ถาวร; ถอนแล้วระงับประมวลผลทันที")
]
create_table_from_data(doc, sync_headers, sync_rows, [22, 16, 25, 25, 20, 26, 26, 25], ['left', 'center', 'left', 'left', 'left', 'left', 'left', 'left'],
    special_rules={0: {'bold': True, 'color': (30, 58, 138)}})

# 15. CHAPTER 13
add_heading_1(doc, "13. Traceability and Verification")

copy_and_format_table(doc, src_doc.tables[11], [52, 40, 65], ['left', 'left', 'left'],
    special_rules={
        0: {'color': (30, 41, 59)},
        1: {'bold': True, 'color': (30, 58, 138)}
    })

trace_text = (
    "Acceptance Process: Unit tests → Integration tests → E2E Multi-Device Tests → Authorization Negative Tests → AI Evaluation Benchmark → Security/Privacy Review → UAT.\n"
    "การทดสอบครอบคลุมทั้ง Responsive Web Application บนเบราว์เซอร์มาตรฐาน และ Native Mobile Application บนอุปกรณ์จริง (iOS & Android) "
    "โดยมุ่งเน้นการตรวจสอบความสอดคล้องของข้อมูลบัญชี ประวัติการฝึก และสิทธิ์การใช้งาน (Entitlement Consistency) 100%"
)
add_styled_p(doc, trace_text, space_before=4, space_after=8)

doc.add_page_break()

# 16. CHAPTER 14
add_heading_1(doc, "14. Risks, Decisions and Approval Conditions")

add_heading_2(doc, "14.1 Mobile Decision Register (ทะเบียนการตัดสินใจด้านสถาปัตยกรรมโมบาย)")
dec_headers = ["ID", "หัวข้อการตัดสินใจ", "คำอธิบายเชิงเทคนิคและทางเลือก", "ข้อเสนอแนะ (Recommendation)", "ผู้รับผิดชอบ", "สถานะ"]
dec_rows = [
    ("D-M01", "Mobile Release Timeline", "กำหนดช่วงเวลาปล่อย Native Mobile App: ปล่อยพร้อม R1, ใน R2 พร้อมระบบเสียง หรือใน R3", "Option A (แนะนำ): ปล่อยใน R2 ควบคู่กับ Voice & Progress เพื่อให้ R1 มุ่งเน้น Core API บน Web", "Product Owner / Tech Lead", "Pending Confirmation"),
    ("D-M02", "Mobile Framework", "เลือกเฟรมเวิร์กพัฒนาโมบาย: React Native / Expo, Flutter, หรือ Native Swift/Kotlin", "Option A (แนะนำ): React Native / Expo เพื่อใช้ทักษะ TypeScript และแชร์ Validation Schemas กับ Web", "Tech Lead / Mobile Architect", "Pending Confirmation"),
    ("D-M03", "Minimum Supported OS", "กำหนดเวอร์ชันระบบปฏิบัติการขั้นต่ำสำหรับ iOS และ Android", "Option A (แนะนำ): iOS 16.0+ และ Android 13.0+ (API 33) เพื่อความปลอดภัยและการรองรับ Audio APIs สมัยใหม่", "QA Lead / Mobile Architect", "Pending Confirmation"),
    ("D-M04", "Mobile Payment Strategy", "สถาปัตยกรรมการชำระเงินบนมือถือ: In-App Purchase (IAP) หรือ Web Checkout Redirect", "Option A (แนะนำ): เริ่มต้นด้วย Web Checkout Redirect ภายใต้กฎ Store; จัดเตรียม IAP หากจำเป็น", "Finance Admin / Legal", "Pending Confirmation"),
    ("D-M05", "Push Notification Scope", "ขอบเขตการใช้งาน Push Notifications (APNs / FCM) แจ้งเตือนฝึกและผลประเมิน", "Option A (แนะนำ): กำหนดเป็นฟังก์ชันเสริมในระยะ R2 โดยมีระบบจัดการ Token และ Opt-in ชัดเจน", "Product Owner / Backend Lead", "Pending Confirmation"),
    ("D-M06", "Biometric Authentication", "การรองรับการปลดล็อกแอปด้วย Face ID / Touch ID / Fingerprint", "Option A (แนะนำ): พัฒนาเป็นฟีเจอร์เสริมในเครื่องเพื่อปลดล็อก Token ที่เก็บใน Keychain", "Security Lead / Mobile Lead", "Pending Confirmation"),
    ("D-M07", "Deep Linking & Universal Links", "การรองรับ Universal Links สำหรับเปิดลิงก์ยืนยันอีเมลและแชร์เซสชันเข้าแอป", "Option A (แนะนำ): กำหนดค่า apple-app-site-association และ assetlinks.json เพื่อประสบการณ์ผู้ใช้", "Frontend Lead / Mobile Lead", "Pending Confirmation"),
    ("D-M08", "Offline Mode Scope", "ขอบเขตการทำงานออฟไลน์: บังคับออนไลน์สำหรับ AI หรืออนุญาตให้ฝึกออฟไลน์", "Option A (แนะนำ): บังคับต่อเน็ตสำหรับการประเมิน AI; แอปทำหน้าที่แคชคำตอบระหว่างเน็ตหลุดเท่านั้น", "Software Architect / AI Lead", "Pending Confirmation"),
    ("D-M09", "Feature Parity Strategy", "กลยุทธ์ความเท่าเทียมของฟีเจอร์ระหว่าง Web และ Mobile สำหรับ End Users", "Option A (แนะนำ): ให้เท่าเทียมกัน 100% สำหรับฟีเจอร์ End User; ส่วนงาน Admin/Research จำกัดบน Web", "Product Owner / QA Lead", "Pending Confirmation"),
    ("D-M10", "App Store Compliance", "ความพร้อมต่อกฎระเบียบของ Apple และ Google (In-app Deletion, Mic Permission)", "Option A (แนะนำ): ปฏิบัติตาม Guideline 100% รวมถึงระบบขอลบบัญชีภายในแอป (FR35)", "Privacy Officer / Legal", "Pending Confirmation"),
    ("D-M11", "Mobile Audio Protocol", "โปรโตคอลส่งสัญญาณเสียงบนมือถือใน R2: Chunked HTTPS Upload vs. WebSocket", "Option A (แนะนำ): เริ่มต้นด้วย Chunked HTTPS Upload ไปยัง Signed URLs เพื่อความทนทานบนสัญญาณมือถือ", "Tech Lead / AI Lead", "Pending Confirmation")
]
create_table_from_data(doc, dec_headers, dec_rows, [14, 25, 45, 38, 20, 15], ['center', 'left', 'left', 'left', 'left', 'center'],
    special_rules={
        0: {'bold': True, 'color': (220, 38, 38)},
        1: {'bold': True, 'color': (30, 41, 59)}
    })

add_heading_2(doc, "14.2 System Risks and Open Decisions")
copy_and_format_table(doc, src_doc.tables[12], [16, 81, 30, 30], ['center', 'left', 'left', 'left'],
    special_rules={
        0: {'bold': True, 'color': (220, 38, 38)},
        2: {'bold': True, 'color': (30, 41, 59)}
    })

add_heading_1(doc, "Change log")
cl_headers = ["Version", "Date", "Summary of Changes", "Author / Reviewer"]
cl_rows = [
    ("0.x", "—", "Initial 11-chapter draft from requirements gathering", "Business Analysis Team"),
    ("0.9", "08 Oct 2026", "Review addendum and survey validation adjustments", "System Architecture Team"),
    ("1.0", "08 Oct 2026", "Consolidated baseline; direct correction of FR/NFR/RBAC/consent/data model; release separation; traceability; sign-off pending", "Technical Documentation Lead"),
    ("1.1 DRAFT", "13 Nov 2026", 
     "Phase 1 Requirement Alignment:\n"
     "- แยกขอบเขตแพลตฟอร์มชัดเจนระหว่าง Responsive Web และ Native Mobile Application (iOS/Android)\n"
     "- ปรับปรุงข้อกำหนด FR15 Multi-Platform Access และเกณฑ์การยอมรับ 7 ข้อ (Proposed)\n"
     "- ปรับปรุงข้อกำหนด NFR08 Cross-Platform Accessibility & Consistency (Web WCAG 2.2 AA, Mobile VoiceOver/TalkBack, 100% Data Sync)\n"
     "- กำหนด Platform Access Matrix (Role × Platform) และ Subscription Matrix (Tier × Platform)\n"
     "- บรรจุ Core Authorization Rules 7 ประการ และตาราง Cross-Platform Data Synchronization 8 หมวด\n"
     "- บันทึก Mobile Decision Register (D-M01 ถึง D-M11) ครอบคลุมประเด็นเทคนิคและธุรกิจ",
     "Senior BA, SA, Architect & Tech Spec Team")
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
r_end = p_end.add_run("— END OF CONTROLLED DOCUMENT (สิ้นสุดเอกสารควบคุม) —\nDocument ID: IX-SRS-001 | Version: 1.1 DRAFT Baseline | Date: 13 November 2026")
set_run_font(r_end, size_pt=12.5, bold=True, color_rgb=(71, 85, 105))

doc.save(output_docx_path)
print(f"Successfully generated {output_docx_path}!")
