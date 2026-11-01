from fastapi import APIRouter, Header, HTTPException, status
from src.schemas.profile import (
    ExtractTextRequest,
    ExtractTextResponse,
    ExtractProfileRequest,
    ExtractProfileResponse,
    ResumeProfileData,
    ExtractedPII,
)
from src.config import settings

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
    # Baseline handler - to be connected to MinIO and PyMuPDF in pipeline implementation
    return ExtractTextResponse(
        raw_text=f"Sample extracted text from {request.storage_key}",
        page_count=1,
        extracted_metadata={"bucket": request.storage_bucket, "file_type": request.file_type}
    )

@router.post("/extract-profile", response_model=ExtractProfileResponse)
def extract_profile(request: ExtractProfileRequest, x_internal_service_key: str = Header(...)):
    verify_internal_key(x_internal_service_key)
    # Baseline structured response adhering strictly to Pydantic schema
    sample_profile = ResumeProfileData(
        professional_summary="Sample parsed candidate summary",
        skills=["Python", "FastAPI", "TypeScript", "Docker"],
        experiences=[],
        educations=[],
        certifications=[],
        projects=[]
    )
    return ExtractProfileResponse(
        structured_data=sample_profile,
        pii_extracted=ExtractedPII(),
        provenance={},
        confidence_score=0.95,
        extractor_version="v0.1.0-baseline"
    )
