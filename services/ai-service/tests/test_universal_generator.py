import pytest
from src.schemas.synthetic_universal import UniversalGenerateBatchRequest
from src.services.universal_generator import UniversalSyntheticGenerator

def test_generate_all_seven_dataset_types():
    types = [
        "profile",
        "resume",
        "interview_question",
        "interview_answer",
        "rubric_evaluation",
        "feedback",
        "scenario",
    ]
    for dt in types:
        req = UniversalGenerateBatchRequest(
            dataset_type=dt,
            industry_key="tech",
            profession_key="ai_engineer",
            profession_name="AI Engineer",
            interview_category="job",
            seniority="Senior",
            batch_size=2,
        )
        items = UniversalSyntheticGenerator.generate_batch(req)
        assert len(items) == 2
        for item in items:
            assert "metadata" in item
            meta = item["metadata"]
            assert meta["is_synthetic"] is True
            assert meta["generation_version"] == "2.0.0"
            assert meta["industry"] == "tech"
            assert meta["profession"] == "AI Engineer"

def test_student_profile_has_optional_work_experience():
    req = UniversalGenerateBatchRequest(
        dataset_type="profile",
        industry_key="education",
        profession_key="research_assistant",
        profession_name="Research Assistant",
        interview_category="scholarship",
        seniority="Undergraduate Student",
        batch_size=1,
    )
    items = UniversalSyntheticGenerator.generate_batch(req)
    assert len(items) == 1
    profile = items[0]
    assert profile["work_experience"] is None
    assert len(profile["education"]) > 0
    assert profile["education"][0]["gpa"] >= 3.0

def test_experienced_profile_has_work_experience():
    req = UniversalGenerateBatchRequest(
        dataset_type="profile",
        industry_key="healthcare",
        profession_key="medical_doctor",
        profession_name="Medical Doctor",
        interview_category="job",
        seniority="Senior Specialist",
        batch_size=1,
    )
    items = UniversalSyntheticGenerator.generate_batch(req)
    assert len(items) == 1
    profile = items[0]
    assert profile["work_experience"] is not None
    assert len(profile["work_experience"]) > 0
    assert "clinical_license_number" in profile["profession_specific_fields"]

def test_interview_answer_quality_variations():
    for quality in ["Excellent", "Average", "Poor"]:
        req = UniversalGenerateBatchRequest(
            dataset_type="interview_answer",
            industry_key="finance",
            profession_key="auditor",
            profession_name="Auditor",
            interview_category="job",
            seniority="Senior",
            batch_size=1,
            custom_parameters={"answer_quality": quality},
        )
        items = UniversalSyntheticGenerator.generate_batch(req)
        assert len(items) == 1
        ans = items[0]
        assert ans["answer_quality"] == quality
        assert len(ans["answer_text"]) > 10

def test_academic_and_research_interview_questions():
    req = UniversalGenerateBatchRequest(
        dataset_type="interview_question",
        industry_key="education",
        profession_key="lecturer",
        profession_name="University Lecturer",
        interview_category="research",
        seniority="PhD Candidate",
        language="th",
        batch_size=1,
    )
    items = UniversalSyntheticGenerator.generate_batch(req)
    assert len(items) == 1
    q = items[0]
    assert q["question_th"] is not None
    assert len(q["competencies_evaluated"]) > 0
    assert len(q["red_flags"]) > 0


def test_thai_and_international_name_banks():
    from src.services.data_banks.name_banks import (
        generate_candidate_identity,
        THAI_MALE_NAMES,
        THAI_FEMALE_NAMES,
        THAI_SURNAMES,
        THAI_NICKNAMES,
        WESTERN_FIRST_NAMES_MALE,
        EAST_ASIAN_NAMES,
        SEA_NAMES,
    )

    # Verify bank size richness
    assert len(THAI_MALE_NAMES) >= 50
    assert len(THAI_FEMALE_NAMES) >= 50
    assert len(THAI_SURNAMES) >= 50
    assert len(THAI_NICKNAMES) >= 30
    assert len(WESTERN_FIRST_NAMES_MALE) >= 20
    assert len(EAST_ASIAN_NAMES) >= 30
    assert len(SEA_NAMES) >= 10

    # Test Thai Identity Generation
    thai_id = generate_candidate_identity(language="th", include_nickname=True)
    assert len(thai_id.full_name) > 0
    assert thai_id.gender in ["Male", "Female"]
    assert "Thai" in thai_id.cultural_background

    # Test International Identity Generation
    intl_id = generate_candidate_identity(language="en", origin_preference="international_only")
    assert len(intl_id.full_name) > 0
    assert "@" not in intl_id.clean_email_slug

    # Test Mixed Bilingual Identity
    mixed_id = generate_candidate_identity(language="mixed", include_nickname=True)
    assert mixed_id.full_name_th is not None


def test_multidimensional_profile_richness():
    industries = ["tech", "healthcare", "finance", "legal", "engineering"]
    for ind in industries:
        req = UniversalGenerateBatchRequest(
            dataset_type="profile",
            industry_key=ind,
            profession_key=f"{ind}_lead",
            profession_name=f"{ind.capitalize()} Lead",
            interview_category="job",
            seniority="Senior Specialist",
            batch_size=2,
            language="mixed",
        )
        items = UniversalSyntheticGenerator.generate_batch(req)
        assert len(items) == 2
        for profile in items:
            assert len(profile["skills"]) >= 3
            assert len(profile["education"]) > 0
            assert "country" in profile["education"][0]
            assert len(profile["languages"]) >= 2
            assert len(profile["certifications"]) > 0
            assert len(profile["awards"]) > 0
            assert profile["work_experience"] is not None
            assert len(profile["work_experience"]) > 0
            assert "responsibilities" in profile["work_experience"][0]
            # Verify cultural background and contact details
            assert "candidate_cultural_background" in profile["profession_specific_fields"]


def test_multidimensional_resume_projects_and_certifications():
    req = UniversalGenerateBatchRequest(
        dataset_type="resume",
        industry_key="tech",
        profession_key="ai_engineer",
        profession_name="Senior AI Architect",
        interview_category="job",
        seniority="Senior",
        batch_size=1,
    )
    items = UniversalSyntheticGenerator.generate_batch(req)
    assert len(items) == 1
    resume = items[0]
    assert "projects_or_initiatives" in resume
    assert len(resume["projects_or_initiatives"]) > 0
    proj = resume["projects_or_initiatives"][0]
    assert "impact_metric" in proj
    assert "technologies_or_tools" in proj
    assert len(resume["certifications_and_licenses"]) > 0
    assert "skills_breakdown" in resume


def test_industry_specific_scenarios():
    for ind in ["healthcare", "finance", "legal", "tech"]:
        req = UniversalGenerateBatchRequest(
            dataset_type="scenario",
            industry_key=ind,
            profession_key="lead",
            profession_name="Director",
            interview_category="competency",
            seniority="Director",
            batch_size=1,
        )
        items = UniversalSyntheticGenerator.generate_batch(req)
        assert len(items) == 1
        scen = items[0]
        assert len(scen["conflicting_constraints"]) >= 3
        assert len(scen["expected_candidate_actions"]) >= 3
        assert "Level 4 (Exemplary)" in scen["rubric_scoring_guide"]


def test_academic_cv_generation():
    req = UniversalGenerateBatchRequest(
        dataset_type="academic_cv",
        industry_key="education",
        profession_key="academic_researcher",
        profession_name="Senior Research Fellow",
        interview_category="research_position",
        seniority="PhD Candidate",
        batch_size=1,
    )
    items = UniversalSyntheticGenerator.generate_batch(req)
    assert len(items) == 1
    cv = items[0]
    assert "candidate_name" in cv
    assert len(cv["research_interests"]) >= 3
    assert len(cv["peer_reviewed_publications"]) >= 2
    assert len(cv["education_history"]) >= 2
    assert len(cv["grants_and_scholarships"]) >= 1


def test_portfolio_case_study_generation():
    req = UniversalGenerateBatchRequest(
        dataset_type="portfolio",
        industry_key="tech",
        profession_key="ai_engineer",
        profession_name="Principal AI Architect",
        interview_category="job",
        seniority="Lead / Principal",
        batch_size=1,
    )
    items = UniversalSyntheticGenerator.generate_batch(req)
    assert len(items) == 1
    port = items[0]
    assert "project_id" in port
    assert "problem_statement" in port
    assert len(port["timeline_and_milestones"]) >= 3
    assert len(port["results_and_impact"]) >= 2
    assert len(port["related_interview_questions"]) >= 2


def test_supporting_document_generation():
    req = UniversalGenerateBatchRequest(
        dataset_type="supporting_doc",
        industry_key="finance",
        profession_key="auditor",
        profession_name="Senior Statutory Auditor",
        interview_category="professional_certification",
        seniority="Senior",
        batch_size=1,
    )
    items = UniversalSyntheticGenerator.generate_batch(req)
    assert len(items) == 1
    doc = items[0]
    assert doc["is_synthetic_watermark"] is True
    assert doc["verification_status"] == "SYNTHETIC_EXAMPLE_VERIFIED"
    assert "credential_id_or_number" in doc


def test_consistency_validation_engine():
    from src.services.consistency_engine import ConsistencyValidationEngine
    from src.schemas.synthetic_universal import ConsistencyValidationRequest

    # Valid Profile & Resume
    req_profile = UniversalGenerateBatchRequest(
        dataset_type="profile",
        industry_key="tech",
        profession_key="software_engineer",
        profession_name="Software Engineer",
        interview_category="job",
        seniority="Senior",
        batch_size=1,
    )
    profile = UniversalSyntheticGenerator.generate_batch(req_profile)[0]

    req_port = UniversalGenerateBatchRequest(
        dataset_type="portfolio",
        industry_key="tech",
        profession_key="software_engineer",
        profession_name="Software Engineer",
        interview_category="job",
        seniority="Senior",
        batch_size=1,
    )
    port = UniversalSyntheticGenerator.generate_batch(req_port)[0]

    val_req = ConsistencyValidationRequest(
        candidate_profile=profile,
        portfolio_projects=[port],
    )
    res = ConsistencyValidationEngine.validate(val_req)
    assert res.is_consistent is True
    assert res.consistency_score >= 0.75
    assert len(res.recommendations) > 0


def test_contextual_profile_attributes():
    # 1. Scholarship Context Profile
    req_scholar = UniversalGenerateBatchRequest(
        dataset_type="profile",
        industry_key="science_research",
        profession_key="academic_researcher",
        profession_name="Academic Researcher",
        interview_category="scholarship",
        seniority="Graduate Student",
        batch_size=1,
    )
    scholar_profile = UniversalSyntheticGenerator.generate_batch(req_scholar)[0]
    assert scholar_profile["nationality"] is not None
    assert scholar_profile["age_range"] in ["20-23", "24-30", "22-26"]
    assert "scholarship" in scholar_profile["career_objectives"].lower() or "fellowship" in scholar_profile["career_objectives"].lower()
    assert scholar_profile["context_intent_statement"] is not None

    # 2. Defense Context Profile
    req_defense = UniversalGenerateBatchRequest(
        dataset_type="profile",
        industry_key="education",
        profession_key="academic_researcher",
        profession_name="Academic Researcher",
        interview_category="thesis_defense",
        seniority="PhD Candidate",
        batch_size=1,
    )
    defense_profile = UniversalSyntheticGenerator.generate_batch(req_defense)[0]
    assert "defense" in defense_profile["context_intent_statement"].lower()
    assert "defend" in defense_profile["career_objectives"].lower()


