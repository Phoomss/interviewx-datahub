from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class WorkExperience(BaseModel):
    company_name: str
    role_title: str
    start_date: str # YYYY-MM
    end_date: str   # YYYY-MM or 'Present'
    responsibilities: List[str] = Field(default_factory=list)
    technologies_used: List[str] = Field(default_factory=list)

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    graduation_year: Optional[int] = None

class ExtractedPII(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

class ResumeProfileData(BaseModel):
    professional_summary: str
    skills: List[str] = Field(default_factory=list)
    experiences: List[WorkExperience] = Field(default_factory=list)
    educations: List[Education] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    projects: List[Dict[str, Any]] = Field(default_factory=list)

class ExtractTextRequest(BaseModel):
    storage_bucket: str
    storage_key: str
    file_type: str # PDF or DOCX

class ExtractTextResponse(BaseModel):
    raw_text: str
    page_count: int
    extracted_metadata: Dict[str, Any] = Field(default_factory=dict)

class ExtractProfileRequest(BaseModel):
    raw_text: str
    document_id: str

class ExtractProfileResponse(BaseModel):
    structured_data: ResumeProfileData
    pii_extracted: ExtractedPII
    provenance: Dict[str, Any] = Field(default_factory=dict)
    confidence_score: float
    extractor_version: str

class SyntheticGenerateBatchRequest(BaseModel):
    batch_size: int = Field(default=5, ge=1, le=100)
    role: str
    seniority: str
    tech_stack: List[str] = Field(default_factory=list)
    language: str = "en"

class SyntheticGenerateBatchResponse(BaseModel):
    success: bool
    generated_count: int
    profiles: List[ResumeProfileData]
