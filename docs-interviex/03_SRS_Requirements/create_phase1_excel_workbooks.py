import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Define color palette & styling
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

header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
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

def format_data_cell(cell, is_zebra=False, font_size=10, bold=False, color="1E293B", align="left", valign="center", wrap=True):
    cell.font = Font(name="Segoe UI", size=font_size, bold=bold, color=color)
    cell.fill = zebra_fill if is_zebra else white_fill
    cell.alignment = Alignment(horizontal=align, vertical=valign, wrap_text=wrap)
    cell.border = thin_border

def style_status_cell(cell, status_text):
    if "Pending" in status_text:
        cell.fill = PatternFill(start_color=STATUS_PENDING_FILL, end_color=STATUS_PENDING_FILL, fill_type="solid")
        cell.font = Font(name="Segoe UI", size=10, bold=True, color=STATUS_PENDING_FONT)
    elif "Approved" in status_text or "Yes" in status_text or "ทำได้" in status_text:
        cell.fill = PatternFill(start_color=STATUS_APPROVED_FILL, end_color=STATUS_APPROVED_FILL, fill_type="solid")
        cell.font = Font(name="Segoe UI", size=10, bold=True, color=STATUS_APPROVED_FONT)
    elif "Proposed" in status_text:
        cell.fill = PatternFill(start_color=STATUS_PROPOSED_FILL, end_color=STATUS_PROPOSED_FILL, fill_type="solid")
        cell.font = Font(name="Segoe UI", size=10, bold=True, color=STATUS_PROPOSED_FONT)
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

print("Helper functions ready")
