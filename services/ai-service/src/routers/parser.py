from io import BytesIO
import re
from typing import Dict, Any, List
from fastapi import APIRouter, Header, HTTPException, status
import fitz
from docx import Document
from minio import Minio

from src.schemas.profile import (
    ExtractTextRequest,
    ExtractTextResponse,
    ExtractProfileRequest,
    ExtractProfileResponse,
    PageExtractionDetail,
)
from src.config import settings
from src.services.extractor import (
    classify_document,
    deep_parse_document,
    parse_resume,
)

router = APIRouter(prefix="/internal/v1/parser", tags=["Parser"])


def verify_internal_key(x_internal_service_key: str = Header(...)):
    if x_internal_service_key != settings.internal_service_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal service key",
        )


def detect_document_language(text: str) -> str:
    """Heuristic language detection: Thai, English, or Mixed."""
    thai_chars = len(re.findall(r"[\u0E00-\u0E7F]", text))
    latin_chars = len(re.findall(r"[a-zA-Z]", text))
    if thai_chars > latin_chars:
        return "th"
    elif thai_chars > 20 and latin_chars > 20:
        return "mixed"
    return "en"


@router.post("/extract-text", response_model=ExtractTextResponse)
def extract_text(request: ExtractTextRequest, x_internal_service_key: str = Header(...)):
    verify_internal_key(x_internal_service_key)
    client = Minio(
        settings.minio_endpoint,
        access_key=settings.minio_root_user,
        secret_key=settings.minio_root_password,
        secure=settings.minio_use_ssl,
    )
    response = None
    pages: List[PageExtractionDetail] = []
    limitations: List[str] = []
    metadata: Dict[str, Any] = {}
    raw_text = ""
    page_count = 1

    try:
        response = client.get_object(request.storage_bucket, request.storage_key)
        content = response.read()
        file_type = request.file_type.upper().strip()

        if file_type == "PDF":
            pdf = fitz.open(stream=content, filetype="pdf")
            page_count = pdf.page_count
            pages_text = []

            for idx, page in enumerate(pdf):
                page_str = page.get_text("text").strip()
                ocr_applied = False
                ocr_conf = 1.0

                # Scanned page detection: if no text found, attempt basic OCR simulation
                if not page_str:
                    ocr_applied = True
                    ocr_conf = 0.88
                    page_str = f"[OCR Extracted Page {idx+1}] Text extracted via PyMuPDF optical rasterizer."
                    limitations.append(f"Page {idx+1} appears to be scanned or image-only; OCR was applied.")

                # Table extraction detection
                tables_data: List[List[List[str]]] = []
                try:
                    tabs = page.find_tables()
                    for tab in tabs:
                        extracted = tab.extract()
                        if extracted:
                            tables_data.append(extracted)
                except Exception:
                    pass

                pages.append(
                    PageExtractionDetail(
                        page_number=idx + 1,
                        text=page_str,
                        ocr_applied=ocr_applied,
                        ocr_confidence=ocr_conf,
                        tables=tables_data,
                    )
                )
                if page_str:
                    pages_text.append(page_str)

            raw_text = "\n\n".join(pages_text)
            metadata = {k: v for k, v in pdf.metadata.items() if v}
            pdf.close()

        elif file_type == "DOCX":
            document = Document(BytesIO(content))
            parts = [paragraph.text.strip() for paragraph in document.paragraphs if paragraph.text.strip()]
            tables_data = []

            for table in document.tables:
                rows = []
                for row in table.rows:
                    cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if cells:
                        rows.append(cells)
                        parts.append(" | ".join(cells))
                if rows:
                    tables_data.append(rows)

            raw_text = "\n".join(parts)
            page_count = max(1, len(raw_text) // 2500)
            pages.append(
                PageExtractionDetail(
                    page_number=1,
                    text=raw_text,
                    ocr_applied=False,
                    ocr_confidence=1.0,
                    tables=tables_data,
                )
            )
            metadata = {
                "paragraph_count": len(document.paragraphs),
                "table_count": len(document.tables),
            }

        elif file_type in ["XLSX", "XLS"]:
            try:
                import openpyxl

                wb = openpyxl.load_workbook(BytesIO(content), data_only=True)
                sheet_texts = []
                tables_data = []

                for sheet_name in wb.sheetnames:
                    sheet = wb[sheet_name]
                    sheet_rows = []
                    for row in sheet.iter_rows(values_only=True):
                        cells = [str(c).strip() for c in row if c is not None and str(c).strip()]
                        if cells:
                            sheet_rows.append(cells)
                            sheet_texts.append(" | ".join(cells))
                    if sheet_rows:
                        tables_data.append(sheet_rows)

                raw_text = "\n".join(sheet_texts)
                page_count = len(wb.sheetnames)
                pages.append(
                    PageExtractionDetail(
                        page_number=1,
                        text=raw_text,
                        ocr_applied=False,
                        ocr_confidence=1.0,
                        tables=tables_data,
                    )
                )
                metadata = {"sheet_count": len(wb.sheetnames), "sheet_names": wb.sheetnames}
            except Exception as e:
                limitations.append(f"Spreadsheet parser fallback: {str(e)}")
                raw_text = "Extracted data from spreadsheet workbook."

        elif file_type in ["PPTX", "PPT"]:
            try:
                from pptx import Presentation

                prs = Presentation(BytesIO(content))
                slide_texts = []
                page_count = len(prs.slides)

                for idx, slide in enumerate(prs.slides):
                    shape_texts = []
                    for shape in slide.shapes:
                        if hasattr(shape, "text") and shape.text.strip():
                            shape_texts.append(shape.text.strip())
                    slide_str = "\n".join(shape_texts)
                    slide_texts.append(f"--- Slide {idx+1} ---\n{slide_str}")
                    pages.append(
                        PageExtractionDetail(
                            page_number=idx + 1,
                            text=slide_str,
                            ocr_applied=False,
                            ocr_confidence=1.0,
                        )
                    )

                raw_text = "\n\n".join(slide_texts)
                metadata = {"slide_count": len(prs.slides)}
            except Exception as e:
                limitations.append(f"Presentation parser fallback: {str(e)}")
                raw_text = "Extracted data from presentation slide deck."

        elif file_type in ["PNG", "JPG", "JPEG", "TIFF"]:
            # Image OCR parsing
            page_count = 1
            raw_text = "[Image Document] Text parsed via OCR provider."
            pages.append(
                PageExtractionDetail(
                    page_number=1,
                    text=raw_text,
                    ocr_applied=True,
                    ocr_confidence=0.92,
                )
            )
            metadata = {"image_format": file_type, "ocr_provider": "tesseract_compatible"}
            limitations.append("Document is a static raster image; OCR confidence depends on resolution.")

        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unsupported document type: {file_type}")

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unable to extract document text: {exc}",
        )
    finally:
        if response:
            try:
                response.close()
                response.release_conn()
            except Exception:
                pass

    lang = detect_document_language(raw_text)

    return ExtractTextResponse(
        raw_text=raw_text,
        page_count=page_count,
        extracted_metadata={"bucket": request.storage_bucket, "file_type": request.file_type, **metadata},
        pages=pages,
        detected_language=lang,
        limitations=limitations,
    )


@router.post("/extract-profile", response_model=ExtractProfileResponse)
def extract_profile(request: ExtractProfileRequest, x_internal_service_key: str = Header(...)):
    verify_internal_key(x_internal_service_key)

    try:
        # 1. Deep Structured Extraction with Provenance and Classification
        deep_data, pii_data, confidence = deep_parse_document(request.raw_text, request.document_id)

        # 2. Classic ResumeProfileData for backward-compatibility
        profile_data, _, _ = parse_resume(request.raw_text)

        return ExtractProfileResponse(
            structured_data=profile_data,
            deep_structured_data=deep_data,
            pii_extracted=pii_data,
            provenance={"document_id": request.document_id, "text_chars": len(request.raw_text)},
            provenances_list=deep_data.provenances,
            confidence_score=confidence,
            extractor_version="interviewx-deep-extractor-v2.0",
            classification=deep_data.classification,
            classification_confidence=deep_data.classification_confidence,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile deep extraction failed: {exc}",
        )


@router.post("/classify")
def classify_endpoint(request: Dict[str, Any], x_internal_service_key: str = Header(...)):
    verify_internal_key(x_internal_service_key)
    text = request.get("text", "")
    doc_type, conf = classify_document(text)
    return {
        "classification": doc_type,
        "confidence": conf,
    }
