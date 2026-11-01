import pytest
from src.services.extractor import (
    extract_pii,
    extract_skills,
    extract_summary,
    extract_experiences,
    extract_educations,
    parse_resume,
)

SAMPLE_RESUME = """NARONGSAK PUMPASERT
Senior Full Stack Engineer
Bangkok, Thailand | narongsak.p@example.com | +66812345678

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Engineer with over 6 years of experience building scalable web applications and high-throughput microservices using TypeScript, NestJS, React, and Python. Specialized in distributed databases and cloud platforms.

TECHNICAL SKILLS
Languages & Frameworks: TypeScript, Python, NestJS, React, Next.js, Node.js, Go
Databases & Caching: PostgreSQL, Redis, MongoDB, Elasticsearch
Cloud & DevOps: Docker, Kubernetes, AWS, Git, CI/CD, Terraform
Methodologies: Agile, Scrum, Microservices, RESTful APIs

PROFESSIONAL EXPERIENCE
Siam Cloud Solutions | Bangkok, Thailand
Lead Backend Engineer (2022-04 - Present)
- Architected enterprise microservices handling over 2M requests daily using NestJS and PostgreSQL.
- Implemented real-time event streaming and caching layer with Redis and BullMQ, cutting response times by 35%.
- Mentored team of 5 software engineers on clean architecture and unit testing.

Digital Horizon Tech | Bangkok, Thailand
Software Engineer (2019-01 - 2022-03)
- Developed responsive web interfaces using React, Next.js, and Tailwind CSS.
- Built automated CI/CD deployment pipelines on AWS using Docker and GitHub Actions.
- Designed relational schemas and database migrations in PostgreSQL.

EDUCATION
Chulalongkorn University (2015 - 2019)
Bachelor of Engineering in Computer Engineering

CERTIFICATIONS
AWS Certified Solutions Architect (2023)
"""

def test_extract_pii():
    pii = extract_pii(SAMPLE_RESUME)
    assert pii.full_name == "NARONGSAK PUMPASERT"
    assert pii.email == "narongsak.p@example.com"
    assert pii.phone_number == "+66812345678"
    assert "Bangkok" in pii.address or "Thailand" in pii.address

def test_extract_skills():
    skills = extract_skills(SAMPLE_RESUME)
    assert "TypeScript" in skills
    assert "NestJS" in skills
    assert "PostgreSQL" in skills
    assert "Docker" in skills
    assert "Redis" in skills

def test_extract_summary():
    summary = extract_summary(SAMPLE_RESUME)
    assert "Senior Full Stack Engineer" in summary
    assert "6 years" in summary

def test_extract_experiences():
    experiences = extract_experiences(SAMPLE_RESUME)
    assert len(experiences) >= 2
    assert any("Siam Cloud Solutions" in e.company_name for e in experiences)
    assert any("Lead Backend Engineer" in e.role_title for e in experiences)

def test_extract_educations():
    educations = extract_educations(SAMPLE_RESUME)
    assert len(educations) >= 1
    assert "Chulalongkorn" in educations[0].institution
    assert "Bachelor of Engineering" in educations[0].degree
    assert educations[0].graduation_year == 2015 or educations[0].graduation_year == 2019

def test_parse_resume_full():
    profile, pii, confidence = parse_resume(SAMPLE_RESUME)
    assert confidence >= 0.90
    assert len(profile.skills) >= 5
    assert len(profile.experiences) >= 2
    assert pii.email == "narongsak.p@example.com"
