import pytest
from src.services.consistency_engine import ConsistencyValidationEngine
from src.schemas.synthetic_universal import ConsistencyValidationRequest


def test_consistency_engine_valid_profile():
    request = ConsistencyValidationRequest(
        candidate_profile={
            "full_name": "Somchai Jaidee",
            "skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
            "experience_years": 4.5,
            "education": [
                {
                    "institution": "Chulalongkorn University",
                    "degree": "B.Eng. Computer Engineering",
                    "graduation_year": 2020
                }
            ],
            "work_experience": [
                {
                    "title": "Software Engineer",
                    "company": "Tech Corp",
                    "start_date": "2020-07",
                    "end_date": "2024-01"
                }
            ],
            "metadata": {
                "seniority_level": "Senior Professional"
            }
        },
        resume_or_cv={
            "full_name": "Somchai Jaidee",
            "skills_breakdown": {
                "technical": ["Python", "FastAPI"]
            }
        },
        portfolio_projects=[
            {
                "project_title": "Distributed Task Engine",
                "tools_and_technologies": ["Python", "Docker"]
            }
        ]
    )

    report = ConsistencyValidationEngine.validate(request)
    assert report.is_consistent is True
    assert report.consistency_score >= 0.75
    assert len(report.detected_discrepancies) == 0


def test_consistency_engine_timeline_conflict():
    request = ConsistencyValidationRequest(
        candidate_profile={
            "full_name": "Dr. Sarah Mitchell",
            "skills": ["Cardiology", "Echocardiogram"],
            "work_experience": [
                {
                    "title": "Chief Resident",
                    "company": "Bangkok General Hospital",
                    "start_date": "2024-01",
                    "end_date": "2021-01"  # Invalid start after end
                }
            ]
        }
    )

    report = ConsistencyValidationEngine.validate(request)
    assert report.is_consistent is False
    assert report.timeline_checks["work_dates_coherent"] is False
    assert any("start_date occurs chronologically after end_date" in d for d in report.detected_discrepancies)


def test_consistency_engine_missing_skills():
    request = ConsistencyValidationRequest(
        candidate_profile={
            "full_name": "John Doe",
            "skills": []
        }
    )

    report = ConsistencyValidationEngine.validate(request)
    assert report.skill_alignment_checks["skills_present"] is False
    assert any("technical or professional skills" in d for d in report.detected_discrepancies)
