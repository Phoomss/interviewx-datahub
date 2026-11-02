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
    set_run_font(r, size_pt=18.5, bold=True, color_rgb=(15, 23, 42)) # Slate 900
    
    # Bottom accent line under Heading 1
    p_line = doc.add_paragraph()
    p_line.paragraph_format.space_before = Pt(0)
    p_line.paragraph_format.space_after = Pt(8)
    p_line.paragraph_format.keep_with_next = True
    r_l = p_line.add_run("━" * 45)
    set_run_font(r_l, size_pt=8, color_rgb=(30, 58, 138)) # Navy blue line
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    set_run_font(r, size_pt=16.5, bold=True, color_rgb=(30, 58, 138)) # Navy Blue
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
        p_t.paragraph_format.space_before = Pt(8)
        p_t.paragraph_format.space_after = Pt(3)
        p_t.paragraph_format.keep_with_next = True
        r_t = p_t.add_run(title)
        set_run_font(r_t, size_pt=13.5, bold=True, color_rgb=(71, 85, 105))
        
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Mm(157)
    
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            <w:left w:val="single" w:sz="20" w:space="0" w:color="2563EB"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        </w:tcBorders>
    ''')
    tcPr.append(tcBorders)
    
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F8FAFC"/>')
    tcPr.append(shd)
    
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="140" w:type="dxa"/>
            <w:bottom w:w="140" w:type="dxa"/>
            <w:left w:w="180" w:type="dxa"/>
            <w:right w:w="160" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)
    
    trPr = tbl.rows[0]._tr.get_or_add_trPr()
    trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    
    code_text = "\n".join(code_lines)
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
                    
                    if txt == 'Pending':
                        bold = True
                        color = (180, 83, 9)
                    elif txt == 'Allow':
                        bold = True
                        color = (6, 95, 70)
                    elif txt == 'Deny':
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

def add_fr_item(doc, title, line_meta, line_req, line_ac):
    p_title = add_heading_3(doc, title)
    
    p_meta = doc.add_paragraph()
    p_meta.paragraph_format.space_before = Pt(0)
    p_meta.paragraph_format.space_after = Pt(3)
    p_meta.paragraph_format.keep_with_next = True
    
    rel_str = "R1"
    prio_str = "Must"
    ev_str = ""
    
    parts = [pt.strip() for pt in line_meta.split('|')]
    for pt in parts:
        if pt.startswith('ระยะ:'):
            rel_str = pt.replace('ระยะ:', '').strip()
        elif pt.startswith('Priority:'):
            prio_str = pt.replace('Priority:', '').strip()
        elif pt.startswith('Evidence:'):
            ev_str = pt.replace('Evidence:', '').strip()
            
    rel_color = (29, 78, 216) if 'R1' in rel_str else ((124, 58, 237) if 'R2' in rel_str else (234, 88, 12))
    r_rel = p_meta.add_run(f" [ {rel_str} ] ")
    set_run_font(r_rel, size_pt=12, bold=True, color_rgb=rel_color)
    
    prio_color = (220, 38, 38) if 'Must' in prio_str else ((217, 119, 6) if 'Should' in prio_str else (71, 85, 105))
    r_prio = p_meta.add_run(f" [ Priority: {prio_str} ] ")
    set_run_font(r_prio, size_pt=12, bold=True, color_rgb=prio_color)
    
    if ev_str:
        r_ev = p_meta.add_run(f" • ที่มา: {ev_str}")
        set_run_font(r_ev, size_pt=12.5, italic=True, color_rgb=(100, 116, 139))
        
    p_req = doc.add_paragraph()
    p_req.paragraph_format.space_before = Pt(2)
    p_req.paragraph_format.space_after = Pt(2)
    p_req.paragraph_format.line_spacing = 1.15
    p_req.paragraph_format.left_indent = Inches(0.2)
    p_req.paragraph_format.keep_with_next = True
    
    req_text = line_req.replace('Requirement:', '').strip() if line_req.startswith('Requirement:') else line_req
    r_req_lbl = p_req.add_run("ข้อกำหนด (Requirement): ")
    set_run_font(r_req_lbl, size_pt=14.5, bold=True, color_rgb=(15, 23, 42))
    r_req_val = p_req.add_run(req_text)
    set_run_font(r_req_val, size_pt=14.5, color_rgb=(30, 41, 59))
    
    p_ac = doc.add_paragraph()
    p_ac.paragraph_format.space_before = Pt(2)
    p_ac.paragraph_format.space_after = Pt(10)
    p_ac.paragraph_format.line_spacing = 1.15
    p_ac.paragraph_format.left_indent = Inches(0.2)
    
    ac_text = line_ac.replace('Acceptance criteria:', '').strip() if line_ac.startswith('Acceptance criteria:') else line_ac
    r_ac_lbl = p_ac.add_run("เกณฑ์การยอมรับ (Acceptance Criteria): ")
    set_run_font(r_ac_lbl, size_pt=14, bold=True, color_rgb=(15, 23, 42))
    r_ac_val = p_ac.add_run(ac_text)
    set_run_font(r_ac_val, size_pt=14, color_rgb=(51, 65, 85))

def copy_and_format_table(doc, src_table, col_widths, col_alignments=None, special_rules=None):
    dest_table = doc.add_table(rows=len(src_table.rows), cols=len(src_table.columns))
    for r_i, s_row in enumerate(src_table.rows):
        for c_i, s_cell in enumerate(s_row.cells):
            dest_table.rows[r_i].cells[c_i].paragraphs[0].text = s_cell.text.strip()
    format_table(dest_table, col_widths, col_alignments, special_rules)
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(4)
    return dest_table

# Determine base directory
script_dir = os.path.dirname(os.path.abspath(__file__))
backup_docx_path = os.path.join(script_dir, 'InterviewX_SRS_Final_For_Approval_v1.0.backup.docx')
output_docx_path = os.path.join(script_dir, 'InterviewX_SRS_Final_For_Approval_v1.0.docx')

# Load original document
src_doc = docx.Document(backup_docx_path)
doc = docx.Document()

# Configure Page Setup (ISO A4, Left 28mm, Right 25mm, Top 25mm, Bottom 25mm)
sec = doc.sections[0]
sec.page_width = Mm(210)
sec.page_height = Mm(297)
sec.left_margin = Mm(28)
sec.right_margin = Mm(25)
sec.top_margin = Mm(25)
sec.bottom_margin = Mm(25)
sec.different_first_page_header_footer = True

# Setup Running Header
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
r_hr = p_hr.add_run("Baseline v1.0")
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

# Setup Running Footer
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
r_fl = p_fl.add_run("Controlled Document • Confidential / For Stakeholder Approval")
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

# ==========================================================
# 1. COVER PAGE
# ==========================================================
add_styled_p(doc, "SYSTEM REQUIREMENTS SPECIFICATION", space_before=10, space_after=2, font_size=12, color_rgb=(71, 85, 105), bold=True)
p_top_line = doc.add_paragraph()
p_top_line.paragraph_format.space_before = Pt(0)
p_top_line.paragraph_format.space_after = Pt(28)
r_tl = p_top_line.add_run("━" * 45)
set_run_font(r_tl, size_pt=10, color_rgb=(30, 58, 138))

# Title
add_styled_p(doc, "InterviewX", space_before=0, space_after=4, font_size=36, color_rgb=(15, 23, 42), bold=True)
add_styled_p(doc, "Software Requirements Specification (SRS)", space_before=0, space_after=14, font_size=20, color_rgb=(30, 58, 138), bold=True)

# Baseline Tag Box
tbl_base = doc.add_table(1, 1)
tbl_base.alignment = WD_TABLE_ALIGNMENT.LEFT
tbl_base.autofit = False
cell_b = tbl_base.cell(0, 0)
cell_b.width = Mm(90)
shd_b = parse_xml(f'<w:shd {nsdecls("w")} w:fill="1E3A8A"/>')
cell_b._tc.get_or_add_tcPr().append(shd_b)
p_b = cell_b.paragraphs[0]
p_b.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_b.paragraph_format.space_before = Pt(4)
p_b.paragraph_format.space_after = Pt(4)
r_b = p_b.add_run("FINAL BASELINE — VERSION 1.0")
set_run_font(r_b, size_pt=14.5, bold=True, color_rgb=(255, 255, 255))

add_styled_p(doc, "", space_after=14)

# Governance Status Callout
add_callout(doc, 
    "วันที่จัดทำ: 8 ตุลาคม 2026 | เอกสารสำหรับอนุมัติอย่างเป็นทางการ\n"
    "สถานะการควบคุม: Final content baseline; formal stakeholder signatures pending. คำว่า Final ไม่หมายความว่ามีการลงนามรับรองแล้ว",
    title="[!] สถานะการควบคุมเอกสาร (Document Governance Notice)",
    border_color="D97706",
    bg_color="FEF3C7")

# Metadata Summary Box
tbl_meta = doc.add_table(4, 2)
tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
tbl_meta.autofit = False
format_table(tbl_meta, [50, 107], ['left', 'left'], special_rules={0: {'bold': True, 'color': (30, 41, 59)}})
meta_items = [
    ("Document ID", "IX-SRS-001"),
    ("Classification", "Controlled Document • Pending Stakeholder Sign-off"),
    ("Scope Model", "R1 Core MVP | R2 Enhanced AI | R3 Commercial & Research"),
    ("Tech Stack", "Next.js Responsive Web + NestJS API + Hosted AI Adapter")
]
for r_i, (k, v) in enumerate(meta_items):
    tbl_meta.rows[r_i].cells[0].paragraphs[0].text = k
    tbl_meta.rows[r_i].cells[1].paragraphs[0].text = v
    for cell in tbl_meta.rows[r_i].cells:
        for p in cell.paragraphs:
            for r in p.runs:
                set_run_font(r, size_pt=12.5, bold=(cell == tbl_meta.rows[r_i].cells[0]), color_rgb=(30, 41, 59))

# PAGE BREAK TO FRONT MATTER
doc.add_page_break()

# ==========================================================
# 2. FRONT MATTER: Document Control, Sign-off & Contents
# ==========================================================
add_heading_1(doc, "Document control")
copy_and_format_table(doc, src_doc.tables[0], [45, 112], ['left', 'left'], special_rules={0: {'bold': True, 'color': (30, 41, 59)}})

add_heading_2(doc, "Approval record")
copy_and_format_table(doc, src_doc.tables[1], [50, 52, 25, 30], ['left', 'left', 'center', 'center'], special_rules={0: {'bold': True, 'color': (30, 41, 59)}})

add_heading_1(doc, "สารบัญเนื้อหา")

# Table of contents card
toc_items = [
    ("01", "1. Introduction & Governance"),
    ("02", "2. Evidence and Stakeholders"),
    ("03", "3. Scope, Assumptions and Release Plan"),
    ("04", "4. System Context and Use Cases"),
    ("05", "5. Functional Requirements (FR01–FR32.1 + additions)"),
    ("06", "6. Non-Functional Requirements"),
    ("07", "7. Access Control / RBAC / Entitlements"),
    ("08", "8. AI Design and Evaluation"),
    ("09", "9. Privacy, Consent and Research Data"),
    ("10", "10. Subscription, Payment and Refund"),
    ("11", "11. Data Model and Data Dictionary"),
    ("12", "12. Architecture and Interfaces"),
    ("13", "13. Traceability and Test Strategy"),
    ("14", "14. Risks, Decisions and Approval Conditions")
]

tbl_toc = doc.add_table(rows=len(toc_items), cols=2)
tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
tbl_toc.autofit = False

tblPr = tbl_toc._tbl.tblPr
tblBorders = parse_xml(f'''
    <w:tblBorders {nsdecls("w")}>
        <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
        <w:left w:val="none"/>
        <w:right w:val="none"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="F1F5F9"/>
        <w:insideV w:val="none"/>
    </w:tblBorders>
''')
tblPr.append(tblBorders)

for r_i, (num, title) in enumerate(toc_items):
    trPr = tbl_toc.rows[r_i]._tr.get_or_add_trPr()
    trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    row_bg = "F8FAFC" if (r_i % 2 == 1) else "FFFFFF"
    
    cell_num = tbl_toc.rows[r_i].cells[0]
    cell_num.width = Mm(22)
    cell_num._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{row_bg}"/>'))
    p_num = cell_num.paragraphs[0]
    p_num.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_num.paragraph_format.space_before = Pt(2)
    p_num.paragraph_format.space_after = Pt(2)
    r_n = p_num.add_run(f"หมวด {num}")
    set_run_font(r_n, size_pt=12.5, bold=True, color_rgb=(30, 58, 138))
    
    cell_title = tbl_toc.rows[r_i].cells[1]
    cell_title.width = Mm(135)
    cell_title._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{row_bg}"/>'))
    p_t = cell_title.paragraphs[0]
    p_t.paragraph_format.space_before = Pt(2)
    p_t.paragraph_format.space_after = Pt(2)
    r_t = p_t.add_run(title)
    set_run_font(r_t, size_pt=14, bold=True, color_rgb=(30, 41, 59))

p_sp = doc.add_paragraph()
p_sp.paragraph_format.space_before = Pt(0)
p_sp.paragraph_format.space_after = Pt(4)

# PAGE BREAK TO CHAPTER 1
doc.add_page_break()

# ==========================================================
# 3. CHAPTER 1: 1. Introduction & Governance
# ==========================================================
add_heading_1(doc, "1. Introduction & Governance")
add_styled_p(doc, src_doc.paragraphs[23].text, space_after=6)

# Precedence Governance Callout
add_callout(doc, src_doc.paragraphs[24].text, title="[!] ลำดับการบังคับใช้ข้อกำหนด (Precedence & Authority)", border_color="1E3A8A", bg_color="EFF6FF")

# Terminology & Acronyms
add_styled_p(doc, "คำศัพท์และตัวย่อสำคัญ (Definitions & Acronyms):", font_size=15, bold=True, color_rgb=(15, 23, 42), space_before=4, space_after=2)
add_styled_p(doc, src_doc.paragraphs[25].text, space_after=8)

# ==========================================================
# 4. CHAPTER 2: 2. Evidence and Stakeholders
# ==========================================================
add_heading_1(doc, "2. Evidence and Stakeholders")
add_styled_p(doc, src_doc.paragraphs[27].text, space_after=6)

# Table 2: Survey Evidence
copy_and_format_table(doc, src_doc.tables[2], [85, 36, 36], ['left', 'center', 'center'], special_rules={2: {'bold': True, 'color': (30, 58, 138)}})

add_styled_p(doc, src_doc.paragraphs[28].text, space_after=6)
add_styled_p(doc, src_doc.paragraphs[29].text, space_after=6)
add_styled_p(doc, src_doc.paragraphs[30].text, space_after=8)

# ==========================================================
# 5. CHAPTER 3: 3. Scope, Assumptions and Release Plan
# ==========================================================
add_heading_1(doc, "3. Scope, Assumptions and Release Plan")

# Table 3: Scope Breakdown
copy_and_format_table(doc, src_doc.tables[3], [35, 75, 47], ['left', 'left', 'left'], special_rules={0: {'bold': True, 'color': (30, 58, 138)}})

add_callout(doc, src_doc.paragraphs[32].text, title="[i] สมมติฐานหลักของระบบ (System Assumptions)", border_color="0284C7", bg_color="F0F9FF")

# ==========================================================
# 6. CHAPTER 4: 4. System Context and Use Cases
# ==========================================================
add_heading_1(doc, "4. System Context and Use Cases")

# Table 4: Use Cases
copy_and_format_table(doc, src_doc.tables[4], [18, 25, 92, 22], ['center', 'left', 'left', 'center'], 
    special_rules={
        0: {'bold': True, 'color': (30, 58, 138)},
        1: {'bold': True, 'color': (30, 41, 59)},
        3: {'bold': True, 'color': (29, 78, 216)}
    })

# PAGE BREAK TO FUNCTIONAL REQUIREMENTS
doc.add_page_break()

# ==========================================================
# 7. CHAPTER 5: 5. Functional Requirements
# ==========================================================
add_heading_1(doc, "5. Functional Requirements")
add_styled_p(doc, 
    "ข้อกำหนดเชิงฟังก์ชัน (FR01–FR36) ครอบคลุมฟังก์ชันการทำงานหลักของระบบ InterviewX แบ่งตามระยะการปล่อยระบบ (Release R1, R2, R3) พร้อมเกณฑ์การยอมรับ (Acceptance Criteria) และหลักฐานอ้างอิงอย่างชัดเจน",
    space_after=8, color_rgb=(71, 85, 105), italic=True)

# Parse and output all 40 FR items
# From element_map: FR01 starts at P35 (element 40) through P194 (element 199)
p_idx = 35
while p_idx < 195:
    p = src_doc.paragraphs[p_idx]
    if p.style.name == 'Heading 3' and p.text.startswith('FR'):
        title = p.text.strip()
        line_meta = src_doc.paragraphs[p_idx + 1].text.strip()
        line_req = src_doc.paragraphs[p_idx + 2].text.strip()
        line_ac = src_doc.paragraphs[p_idx + 3].text.strip()
        add_fr_item(doc, title, line_meta, line_req, line_ac)
        p_idx += 4
    else:
        p_idx += 1

# PAGE BREAK TO NON-FUNCTIONAL REQUIREMENTS
doc.add_page_break()

# ==========================================================
# 8. CHAPTER 6: 6. Non-Functional Requirements
# ==========================================================
add_heading_1(doc, "6. Non-Functional Requirements")

# Table 5: NFR Table
copy_and_format_table(doc, src_doc.tables[5], [18, 38, 68, 33], ['center', 'left', 'left', 'left'],
    special_rules={
        0: {'bold': True, 'color': (30, 58, 138)},
        1: {'bold': True, 'color': (30, 41, 59)}
    })

# Callout for Paragraph 282 (P196)
add_callout(doc, src_doc.paragraphs[196].text, title="[i] คำชี้แจงเป้าหมายการทดสอบ NFR (Acceptance Targets Notice)", border_color="2563EB", bg_color="EFF6FF")

# PAGE BREAK TO ROLES & RBAC
doc.add_page_break()

# ==========================================================
# 9. CHAPTER 7: 7. Role, Authorization and Entitlements
# ==========================================================
add_heading_1(doc, "7. Role, Authorization and Entitlements")
add_styled_p(doc, src_doc.paragraphs[198].text, space_after=6)

# Table 6: RBAC Matrix
copy_and_format_table(doc, src_doc.tables[6], [42, 20, 25, 23, 23, 24], ['left', 'center', 'center', 'center', 'center', 'center'],
    special_rules={
        0: {'bold': True, 'color': (30, 41, 59)}
    })

add_styled_p(doc, src_doc.paragraphs[199].text, space_before=6, space_after=8)

# ==========================================================
# 10. CHAPTER 8: 8. AI Layer and Evaluation
# ==========================================================
add_heading_1(doc, "8. AI Layer and Evaluation")

# Paragraphs 201 to 207 (7 bullets)
ai_bullets = [
    ("Pipeline (กระบวนการ AI Scorer):", src_doc.paragraphs[201].text.replace("Pipeline: ", "")),
    ("RAG / Embedding ทางเลือก:", src_doc.paragraphs[202].text),
    ("Rubric เกณฑ์การให้คะแนน:", src_doc.paragraphs[203].text.replace("Rubric default: ", "")),
    ("Dataset ชุดข้อมูลทดสอบ:", src_doc.paragraphs[204].text.replace("Dataset: ", "")),
    ("Validation การตรวจสอบความถูกต้อง:", src_doc.paragraphs[205].text.replace("Validation: ", "")),
    ("Failure Mode การจัดการกรณีระบบขัดข้อง:", src_doc.paragraphs[206].text.replace("Failure mode: ", "")),
    ("ข้อจำกัดและข้อควรระวัง (AI Constraints):", src_doc.paragraphs[207].text)
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

# PAGE BREAK TO PRIVACY
doc.add_page_break()

# ==========================================================
# 11. CHAPTER 9: 9. Privacy, Consent and Research Data
# ==========================================================
add_heading_1(doc, "9. Privacy, Consent and Research Data")
add_styled_p(doc, src_doc.paragraphs[209].text, space_after=6)

# Table 7: Purpose Keys
copy_and_format_table(doc, src_doc.tables[7], [38, 57, 62], ['left', 'left', 'left'],
    special_rules={
        0: {'bold': True, 'font': 'Consolas', 'size': 11.5, 'color': (15, 23, 42)}
    })

# Callout for Paragraph 210 (RLS & Research security)
add_callout(doc, src_doc.paragraphs[210].text, title="[!] นโยบายความปลอดภัยข้อมูลการวิจัย (Research Data Security & RLS Policy)", border_color="7C3AED", bg_color="F5F3FF")

# Paragraph 211 (Audio lifecycle)
add_styled_p(doc, src_doc.paragraphs[211].text, space_before=4, space_after=8)

# ==========================================================
# 12. CHAPTER 10: 10. Package, Payment and Refund Governance
# ==========================================================
add_heading_1(doc, "10. Package, Payment and Refund Governance")

# Callout for Paragraph 213 (Payment Governance Warning)
add_callout(doc, src_doc.paragraphs[213].text, title="[!] ข้อจำกัดและข้อควรระวังด้านแพ็กเกจ (R3 Scope Warning)", border_color="D97706", bg_color="FFFBEB")

# Table 8: Business Decisions
copy_and_format_table(doc, src_doc.tables[8], [38, 57, 62], ['left', 'left', 'left'],
    special_rules={
        0: {'bold': True, 'color': (30, 58, 138)},
        1: {'color': (100, 116, 139)},
        2: {'bold': True, 'color': (15, 23, 42)}
    })

add_styled_p(doc, src_doc.paragraphs[214].text, space_before=4, space_after=8)

# PAGE BREAK TO DATA MODEL
doc.add_page_break()

# ==========================================================
# 13. CHAPTER 11: 11. Data Model and Data Dictionary
# ==========================================================
add_heading_1(doc, "11. Data Model and Data Dictionary")
add_styled_p(doc, src_doc.paragraphs[216].text, space_after=6)

# Table 9: Data Dictionary Table (29 rows x 3 cols)
copy_and_format_table(doc, src_doc.tables[9], [36, 66, 55], ['left', 'left', 'left'],
    special_rules={
        0: {'bold': True, 'font': 'Consolas', 'size': 11.5, 'color': (30, 58, 138)},
        1: {'font': 'Consolas', 'size': 10.5, 'color': (51, 65, 85)},
        2: {'size': 12.5, 'color': (30, 41, 59)}
    })

add_heading_2(doc, "11.1 Corrected research aggregation relationship")
add_styled_p(doc, src_doc.paragraphs[218].text, space_after=4)

# SQL Query Code Box (Paragraphs 219 to 229)
sql_lines = [src_doc.paragraphs[i].text for i in range(219, 230)]
add_code_block(doc, sql_lines, title="Listing 11.1: ตัวอย่าง Conceptual Read-only Query สำหรับ Research Aggregation")

# Callout for Paragraph 230
add_callout(doc, src_doc.paragraphs[230].text, title="[!] ข้อควรระวังด้านความเป็นส่วนตัว (Privacy & Aggregation Notice)", border_color="DC2626", bg_color="FEF2F2")

# PAGE BREAK TO ARCHITECTURE
doc.add_page_break()

# ==========================================================
# 14. CHAPTER 12: 12. Architecture, Interfaces, Operations
# ==========================================================
add_heading_1(doc, "12. Architecture, Interfaces, Operations")

# Table 10: Architecture Layers
copy_and_format_table(doc, src_doc.tables[10], [28, 65, 64], ['left', 'left', 'left'],
    special_rules={
        0: {'bold': True, 'color': (30, 58, 138)}
    })

add_styled_p(doc, src_doc.paragraphs[232].text, space_before=4, space_after=8)

# ==========================================================
# 15. CHAPTER 13: 13. Traceability and Verification
# ==========================================================
add_heading_1(doc, "13. Traceability and Verification")

# Table 11: Traceability
copy_and_format_table(doc, src_doc.tables[11], [52, 40, 65], ['left', 'left', 'left'],
    special_rules={
        0: {'color': (30, 41, 59)},
        1: {'bold': True, 'color': (30, 58, 138)}
    })

add_styled_p(doc, src_doc.paragraphs[234].text, space_before=4, space_after=8)

# PAGE BREAK TO RISKS & CHANGE LOG
doc.add_page_break()

# ==========================================================
# 16. CHAPTER 14: 14. Risks, Decisions and Approval Conditions
# ==========================================================
add_heading_1(doc, "14. Risks, Decisions and Approval Conditions")

# Table 12: Risks & Open Decisions
copy_and_format_table(doc, src_doc.tables[12], [16, 81, 30, 30], ['center', 'left', 'left', 'left'],
    special_rules={
        0: {'bold': True, 'color': (220, 38, 38)},
        2: {'bold': True, 'color': (30, 41, 59)}
    })

add_heading_1(doc, "Change log")

# Table 13: Change Log Table
copy_and_format_table(doc, src_doc.tables[13], [22, 32, 103], ['center', 'center', 'left'],
    special_rules={
        0: {'bold': True, 'color': (30, 58, 138)}
    })

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
r_end = p_end.add_run("— END OF CONTROLLED DOCUMENT (สิ้นสุดเอกสารควบคุม) —\nDocument ID: IX-SRS-001 | Version: 1.0 Baseline | Date: 08 October 2026")
set_run_font(r_end, size_pt=12.5, bold=True, color_rgb=(71, 85, 105))

# Save the beautifully formatted document
doc.save(output_docx_path)
print(f"Successfully generated {output_docx_path}!")
