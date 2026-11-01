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
