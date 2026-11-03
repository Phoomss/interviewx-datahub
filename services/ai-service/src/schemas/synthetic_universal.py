from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class SyntheticMetadata(BaseModel):
    is_synthetic: bool = Field(default=True, description="Enforces synthetic tracking")
    data_source: str = Field(default="interviewx-universal-synthetic-engine")
    generation_version: str = Field(default="2.0.0")
    generated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    industry: str
    profession: str
    interview_category: str
    interview_subcategory: Optional[str] = None
    seniority_level: str
    language: str = "en"
    difficulty_level: Optional[str] = "Mid"


# Type 1: Professional Profile Dataset
class ProfessionalProfileData(BaseModel):
    full_name: str
    headline: str
    professional_summary: str
    career_objectives: Optional[str] = None
    nationality: Optional[str] = None
    age_range: Optional[str] = None
    context_intent_statement: Optional[str] = None
    contact_info: Dict[str, str]
    skills: List[str]
    experience_years: float = 0.0
    education: List[Dict[str, Any]]
    work_experience: Optional[List[Dict[str, Any]]] = (
        None  # Optional for students/scholarships
    )
    certifications: Optional[List[str]] = []
    languages: Optional[List[str]] = []
    awards: Optional[List[str]] = []
    publications_or_research: Optional[List[str]] = []
    volunteer_or_extracurricular: Optional[List[str]] = []
    profession_specific_fields: Dict[str, Any] = {}
    metadata: SyntheticMetadata


# Type 2: Resume / CV Dataset
class ResumeCVData(BaseModel):
    profile_summary: str
    personal_info: Dict[str, str]
    education_history: List[Dict[str, Any]]
    skills_breakdown: Dict[str, List[str]]
    work_history: Optional[List[Dict[str, Any]]] = None  # Optional
    projects_or_initiatives: List[Dict[str, Any]]
    certifications_and_licenses: List[str]
    publications_and_patents: Optional[List[str]] = []
    honors_awards: Optional[List[str]] = []
    profession_specific_highlights: Dict[str, Any] = {}
    metadata: SyntheticMetadata


# Type 3: Interview Question Dataset
class InterviewQuestionData(BaseModel):
    question: str
    question_th: Optional[str] = None
    category: str
    difficulty: str
    intent_and_objective: str
    competencies_evaluated: List[str]
    key_points_to_look_for: List[str]
    red_flags: List[str]
    sample_follow_ups: List[str]
    metadata: SyntheticMetadata


# Type 4: Interview Answer Dataset
class InterviewAnswerData(BaseModel):
    question: str
    candidate_level: str
    answer_quality: str  # Excellent, Good, Average, Poor, Incomplete, Irrelevant
    answer_text: str
    answer_text_th: Optional[str] = None
    structure_framework_used: Optional[str] = "STAR"
    key_strengths: List[str]
    weaknesses_or_gaps: List[str]
    interviewer_sentiment: str
    metadata: SyntheticMetadata


# Type 5: Rubric Evaluation Dataset
class RubricEvaluationData(BaseModel):
    question_context: str
    candidate_response_sample: str
    evaluation_dimensions: List[Dict[str, Any]]
    total_score: float
    max_possible_score: float
    percentage: float
    overall_verdict: str  # Strong Pass, Pass, Borderline, Fail
    hiring_or_admission_recommendation: str
    metadata: SyntheticMetadata


# Type 6: Feedback Dataset
class FeedbackData(BaseModel):
    candidate_name: str
    interview_context: str
    overall_summary: str
    strengths: List[str]
    areas_for_improvement: List[str]
    actionable_coaching_tips: List[str]
    recommended_learning_resources: List[str]
    readiness_score: float
    metadata: SyntheticMetadata


# Type 7: Scenario-based Dataset
class ScenarioBasedData(BaseModel):
    scenario_title: str
    scenario_context: str
    problem_statement: str
    conflicting_constraints: List[str]
    ethical_or_professional_dilemma: str
    expected_candidate_actions: List[str]
    rubric_scoring_guide: Dict[str, str]
    sample_solutions: Dict[str, str]
    metadata: SyntheticMetadata


# Type 8: Academic CV Dataset
class AcademicCVData(BaseModel):
    candidate_name: str
    academic_title: str
    academic_profile: str
    research_interests: List[str]
    education_history: List[Dict[str, Any]]
    research_experience: List[Dict[str, Any]]
    peer_reviewed_publications: List[Dict[str, Any]]
    conference_presentations: List[Dict[str, Any]]
    teaching_and_mentoring: List[Dict[str, Any]]
    grants_and_scholarships: List[Dict[str, Any]]
    academic_honors_and_awards: List[str]
    professional_memberships: List[str]
    technical_and_research_skills: List[str]
    academic_references: Optional[List[Dict[str, str]]] = None
    metadata: SyntheticMetadata


# Type 9: Professional Portfolio Case Study Dataset
class PortfolioCaseStudyData(BaseModel):
    project_id: str
    project_title: str
    project_category: str
    overview: str
    background: str
    problem_statement: str
    objectives: List[str]
    candidate_role: str
    responsibilities: List[str]
    team_composition: str
    project_duration: str
    timeline_and_milestones: List[Dict[str, str]]
    tools_and_technologies: List[str]
    methodology: str
    implementation_details: List[str]
    challenges: List[str]
    solutions: List[str]
    results_and_impact: List[str]
    lessons_learned: List[str]
    supporting_evidence_references: List[str]
    related_skills: List[str]
    related_interview_questions: List[str]
    metadata: SyntheticMetadata


# Type 10: Supporting Document Dataset
class SupportingDocumentData(BaseModel):
    document_id: str
    document_type: str  # training_record, certificate, academic_transcript, research_abstract, recommendation_letter, technical_report, presentation_outline
    document_title: str
    issuer_organization: str
    candidate_name: str
    issue_date: str
    expiry_or_validity: Optional[str] = None
    credential_id_or_number: str
    verification_status: str = "SYNTHETIC_EXAMPLE_VERIFIED"
    structured_fields: Dict[str, Any]
    narrative_body: str
    is_synthetic_watermark: bool = True
    metadata: SyntheticMetadata


# Consistency Engine Schemas
class ConsistencyValidationRequest(BaseModel):
    candidate_profile: Optional[Dict[str, Any]] = None
    resume_or_cv: Optional[Dict[str, Any]] = None
    portfolio_projects: Optional[List[Dict[str, Any]]] = None
    interview_answers: Optional[List[Dict[str, Any]]] = None
    supporting_documents: Optional[List[Dict[str, Any]]] = None


class ConsistencyValidationResponse(BaseModel):
    is_consistent: bool
    consistency_score: float  # 0.0 - 1.0
    timeline_checks: Dict[str, Any]
    skill_alignment_checks: Dict[str, Any]
    role_responsibility_checks: Dict[str, Any]
    detected_discrepancies: List[str]
    recommendations: List[str]


# Request / Response Schemas
class UniversalGenerateBatchRequest(BaseModel):
    dataset_type: str = Field(
        ...,
        description="profile, resume, academic_cv, portfolio, supporting_doc, interview_question, interview_answer, rubric_evaluation, feedback, scenario",
    )
    industry_key: str
    profession_key: str
    profession_name: str
    interview_category: str
    interview_subcategory: Optional[str] = None
    seniority: str
    skills: Optional[List[str]] = []
    language: str = "en"  # "en", "th", "mixed"
    difficulty: str = "Mid"
    batch_size: int = Field(default=1, ge=1, le=50)
    custom_parameters: Optional[Dict[str, Any]] = None


class UniversalGenerateBatchResponse(BaseModel):
    dataset_type: str
    count: int
    items: List[Dict[str, Any]]
    generated_at: str
