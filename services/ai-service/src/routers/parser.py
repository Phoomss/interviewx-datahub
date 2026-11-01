from io import BytesIO
import re
from fastapi import APIRouter, Header, HTTPException, status
import fitz
from docx import Document
from minio import Minio
from src.schemas.profile import (
    ExtractTextRequest,
    ExtractTextResponse,
    ExtractProfileRequest,
    ExtractProfileResponse,
)
from src.config import settings
from src.services.extractor import parse_resume

router = APIRouter(prefix="/internal/v1/parser", tags=["Parser"])

def verify_internal_key(x_internal_service_key: str = Header(...)):
    if x_internal_service_key != settings.internal_service_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal service key"
        )

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
    try:
        response = client.get_object(request.storage_bucket, request.storage_key)
        content = response.read()

        if request.file_type.upper() == "PDF":
            pdf = fitz.open(stream=content, filetype="pdf")
            pages_text = []
            for page in pdf:
                text = page.get_text("text")
                if text.strip():
                    pages_text.append(text.strip())
            raw_text = "\n\n".join(pages_text)
            page_count = pdf.page_count
            metadata = {k: v for k, v in pdf.metadata.items() if v}
            pdf.close()
        elif request.file_type.upper() == "DOCX":
            document = Document(BytesIO(content))
            parts = [paragraph.text.strip() for paragraph in document.paragraphs if paragraph.text.strip()]
            for table in document.tables:
                for row in table.rows:
                    cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if cells:
                        parts.append(" | ".join(cells))
            raw_text = "\n".join(parts)
            page_count = 1
            metadata = {"paragraph_count": len(document.paragraphs), "table_count": len(document.tables)}
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported document type")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Unable to extract document text: {exc}")
    finally:
        if response:
            try:
                response.close()
                response.release_conn()
            except Exception:
                pass

    return ExtractTextResponse(
        raw_text=raw_text,
        page_count=page_count,
        extracted_metadata={"bucket": request.storage_bucket, "file_type": request.file_type, **metadata}
    )

@router.post("/extract-profile", response_model=ExtractProfileResponse)
def extract_profile(request: ExtractProfileRequest, x_internal_service_key: str = Header(...)):
    verify_internal_key(x_internal_service_key)

    try:
        profile_data, pii_data, confidence = parse_resume(request.raw_text)

        return ExtractProfileResponse(
            structured_data=profile_data,
            pii_extracted=pii_data,
            provenance={"document_id": request.document_id, "text_chars": len(request.raw_text)},
            confidence_score=confidence,
            extractor_version="interviewx-extractor-v1.0"
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile structuring failed: {exc}"
        )
