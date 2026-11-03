from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field

# =========================================================================
# Deep Structured Schemas for Real Document Intelligence (Section 6)
# =========================================================================


class PersonalProfile(BaseModel):
    full_name: Optional[str] = None
    preferred_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    nationality: Optional[str] = None
    location: Optional[str] = None
    languages: List[str] = Field(default_factory=list)
    professional_title: Optional[str] = None
    professional_summary: Optional[str] = None
    career_objective: Optional[str] = None
    industry: Optional[str] = None
    profession: Optional[str] = None
    career_level: Optional[str] = None
    areas_of_specialization: List[str] = Field(default_factory=list)
    professional_interests: List[str] = Field(default_factory=list)


class EducationDetail(BaseModel):
    institution: str
    faculty: Optional[str] = None
    department: Optional[str] = None
    degree: str
    major: Optional[str] = None
    minor: Optional[str] = None
    program: Optional[str] = None
    study_mode: Optional[str] = None  # Full-time, Part-time, Online
    start_date: Optional[str] = None
    graduation_date: Optional[str] = None
    graduation_year: Optional[int] = None
    gpa: Optional[float] = None
    academic_standing: Optional[str] = None  # e.g. First Class Honors
    relevant_coursework: List[str] = Field(default_factory=list)
    academic_projects: List[str] = Field(default_factory=list)
    research_activities: List[str] = Field(default_factory=list)
    awards: List[str] = Field(default_factory=list)
    scholarships: List[str] = Field(default_factory=list)
    thesis_title: Optional[str] = None
    academic_achievements: List[str] = Field(default_factory=list)


class WorkExperienceDetail(BaseModel):
    organization: str
    company_name: str = ""  # Backward-compatible alias
    department: Optional[str] = None
    job_title: str
    role_title: str = ""  # Backward-compatible alias
    employment_type: Optional[str] = None  # Full-time, Contract, Remote, Part-time
    location: Optional[str] = None
    start_date: str  # YYYY-MM
    end_date: str  # YYYY-MM or 'Present'
    current_employment_status: bool = False
    responsibilities: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    tools_and_technologies: List[str] = Field(default_factory=list)
    technologies_used: List[str] = Field(
        default_factory=list
    )  # Backward-compatible alias
    skills_applied: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    leadership_responsibilities: List[str] = Field(default_factory=list)
    team_collaboration: Optional[str] = None
    business_impact: Optional[str] = None
    measurable_results: List[str] = Field(default_factory=list)
    original_description: Optional[str] = None
    normalized_description: Optional[str] = None


class SkillItem(BaseModel):
    skill_name: str
    category: str = "Technical Skills"
    # Category must be one of:
    # Technical Skills, Domain Knowledge, Analytical Skills, Problem Solving,
    # Communication, Leadership, Research Skills, Creative Skills, Language Skills,
    # Interpersonal Skills, Professional Ethics, Management Skills, Digital Skills
    proficiency: Optional[str] = None  # Beginner, Intermediate, Advanced, Expert
    is_explicit: bool = True  # Stated in text vs AI-inferred
    related_experience: Optional[str] = None
    evidence: Optional[str] = None
    source_document: Optional[str] = None
    confidence: float = 0.90
    related_profession: Optional[str] = None


class ProjectDetail(BaseModel):
    project_title: str
    project_description: str
    background: Optional[str] = None
    problem_statement: Optional[str] = None
    objectives: List[str] = Field(default_factory=list)
    scope: Optional[str] = None
    candidate_role: str = "Contributor"
    responsibilities: List[str] = Field(default_factory=list)
    team_composition: Optional[str] = None
    is_team_project: bool = False
    personal_contributions: List[str] = Field(default_factory=list)
    duration: Optional[str] = None
    timeline: Optional[str] = None
    methodology: Optional[str] = None
    tools_and_technologies: List[str] = Field(default_factory=list)
    challenges: List[str] = Field(default_factory=list)
    solutions: List[str] = Field(default_factory=list)
    results: List[str] = Field(default_factory=list)
    impact: Optional[str] = None
    measurable_metrics: List[str] = Field(default_factory=list)
    lessons_learned: List[str] = Field(default_factory=list)
    evidence_references: List[str] = Field(default_factory=list)
    related_skills: List[str] = Field(default_factory=list)


class CertificationDetail(BaseModel):
    certificate_name: str
    issuing_organization: str
    credential_identifier: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    training_hours: Optional[float] = None
    skills_covered: List[str] = Field(default_factory=list)
    verification_url: Optional[str] = None
    is_verified: bool = (
        False  # Never mark verified merely because it appears in a document
    )
    source_reference: Optional[str] = None


class AcademicResearchDetail(BaseModel):
    research_title: str
    abstract: Optional[str] = None
    research_objectives: List[str] = Field(default_factory=list)
    research_questions: List[str] = Field(default_factory=list)
    literature_review_topics: List[str] = Field(default_factory=list)
    research_methodology: Optional[str] = None
    research_design: Optional[str] = None
    data_collection_methods: List[str] = Field(default_factory=list)
    analysis_methods: List[str] = Field(default_factory=list)
    findings: List[str] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
    publications: List[Dict[str, Any]] = Field(default_factory=list)
    authors: List[str] = Field(default_factory=list)
    publication_venue: Optional[str] = None
    doi: Optional[str] = None
    conference_presentations: List[str] = Field(default_factory=list)
    grants: List[str] = Field(default_factory=list)
    research_responsibilities: List[str] = Field(default_factory=list)


class FieldProvenance(BaseModel):
    field_path: str
    extracted_value: Any
    normalized_value: Optional[Any] = None
    source: Dict[str, Any] = Field(default_factory=dict)
    # source contains: document_id, page_number, section_name, paragraph_reference,
    #                  text_start_offset, text_end_offset, source_text
    extraction_method: str = "pdf_text_extraction"
    confidence_score: float = 0.95
    verification_status: str = (
        "pending_review"  # pending_review, human_verified, ai_inferred, rejected
    )
    is_ai_inferred: bool = False
    is_incomplete: bool = False


# =========================================================================
# Backward Compatible Structures
# =========================================================================


class WorkExperience(BaseModel):
    company_name: str
    role_title: str
    start_date: str  # YYYY-MM
    end_date: str  # YYYY-MM or 'Present'
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
    national_id: Optional[str] = None
    date_of_birth: Optional[str] = None
    passport_number: Optional[str] = None


class ResumeProfileData(BaseModel):
    professional_summary: str
    skills: List[str] = Field(default_factory=list)
    experiences: List[WorkExperience] = Field(default_factory=list)
    educations: List[Education] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    projects: List[Dict[str, Any]] = Field(default_factory=list)


# =========================================================================
# Deep Profile Request & Response Schemas
# =========================================================================


class DeepProfileData(BaseModel):
    profile: PersonalProfile
    educations: List[EducationDetail] = Field(default_factory=list)
    experiences: List[WorkExperienceDetail] = Field(default_factory=list)
    skills: List[SkillItem] = Field(default_factory=list)
    projects: List[ProjectDetail] = Field(default_factory=list)
    certifications: List[CertificationDetail] = Field(default_factory=list)
    academic_research: List[AcademicResearchDetail] = Field(default_factory=list)
    provenances: List[FieldProvenance] = Field(default_factory=list)
    extraction_limitations: List[str] = Field(default_factory=list)
    ocr_confidence_avg: float = 1.0
    detected_language: str = "en"
    classification: str = "Resume"
    classification_confidence: float = 0.95


class ExtractTextRequest(BaseModel):
    storage_bucket: str
    storage_key: str
    file_type: str  # PDF, DOCX, XLSX, PPTX, PNG, JPG


class PageExtractionDetail(BaseModel):
    page_number: int
    text: str
    ocr_applied: bool = False
    ocr_confidence: float = 1.0
    tables: List[List[List[str]]] = Field(default_factory=list)


class ExtractTextResponse(BaseModel):
    raw_text: str
    page_count: int
    extracted_metadata: Dict[str, Any] = Field(default_factory=dict)
    pages: List[PageExtractionDetail] = Field(default_factory=list)
    detected_language: str = "en"
    limitations: List[str] = Field(default_factory=list)


class ExtractProfileRequest(BaseModel):
    raw_text: str
    document_id: str
    document_type: Optional[str] = "Resume"
    enable_deep_extraction: Optional[bool] = True


class ExtractProfileResponse(BaseModel):
    structured_data: ResumeProfileData
    deep_structured_data: Optional[DeepProfileData] = None
    pii_extracted: ExtractedPII
    provenance: Dict[str, Any] = Field(default_factory=dict)
    provenances_list: List[FieldProvenance] = Field(default_factory=list)
    confidence_score: float
    extractor_version: str
    classification: str = "Resume"
    classification_confidence: float = 0.95


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
