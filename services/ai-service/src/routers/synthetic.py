import random
from datetime import datetime

from fastapi import APIRouter, Header, HTTPException, status

from src.config import settings
from src.schemas.profile import (
    Education,
    ResumeProfileData,
    SyntheticGenerateBatchRequest,
    SyntheticGenerateBatchResponse,
    WorkExperience,
)
from src.schemas.synthetic_universal import (
    UniversalGenerateBatchRequest,
    UniversalGenerateBatchResponse,
)
from src.services.universal_generator import UniversalSyntheticGenerator

router = APIRouter(prefix="/internal/v1/synthetic", tags=["Synthetic"])


def verify_internal_key(x_internal_service_key: str = Header(...)):
    if x_internal_service_key != settings.internal_service_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal service key",
        )


# Curated pools for high-diversity synthetic resume generation
INDUSTRIES = [
    {"name": "Siam FinTech Labs", "domain": "FinTech / Payment Systems"},
    {
        "name": "OmniRetail Global",
        "domain": "E-Commerce & High-throughput Marketplaces",
    },
    {"name": "BioHealth Digital", "domain": "HealthTech & Medical Informatics"},
    {"name": "Nexus Logistics Tech", "domain": "Supply Chain & Real-time Routing"},
    {
        "name": "CloudScale Enterprise SaaS",
        "domain": "Cloud Infrastructure & Multi-tenant Platforms",
    },
    {
        "name": "NextGen EdTech Media",
        "domain": "Interactive Learning & Content Delivery",
    },
    {
        "name": "CyberPulse Security Group",
        "domain": "Cybersecurity & Identity Management",
    },
    {"name": "UrbanFlow Mobility", "domain": "IoT & Smart City Telematics"},
]

UNIVERSITIES = [
    {
        "name": "Chulalongkorn University",
        "degree": "Bachelor of Engineering",
        "field": "Computer Engineering",
    },
    {
        "name": "King Mongkut's University of Technology Thonburi",
        "degree": "Bachelor of Science",
        "field": "Information Technology",
    },
    {
        "name": "Kasetsart University",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
    },
    {
        "name": "Mahidol University",
        "degree": "Bachelor of Engineering",
        "field": "Biomedical & Software Engineering",
    },
    {
        "name": "Thammasat University",
        "degree": "Bachelor of Engineering",
        "field": "Software Engineering",
    },
    {
        "name": "Chiang Mai University",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
    },
    {
        "name": "National University of Singapore",
        "degree": "Master of Computing",
        "field": "Artificial Intelligence & Distributed Systems",
    },
]

ACTION_VERBS = [
    (
        "Architected and deployed",
        "improving throughput by 45% and reducing infrastructure overhead",
    ),
    (
        "Spearheaded the migration of legacy monolithic services into",
        "achieving zero downtime and cutting deployment cycles from 2 weeks to daily",
    ),
    (
        "Engineered real-time streaming data pipelines with",
        "handling over 25M daily transactions with sub-100ms latency",
    ),
    (
        "Optimized relational database queries and caching layers with",
        "reducing p95 database response latency by 35%",
    ),
    (
        "Implemented automated CI/CD workflows and automated end-to-end testing with",
        "increasing overall code coverage from 55% to 88%",
    ),
    (
        "Designed and maintained secure, multi-tenant RESTful and GraphQL API endpoints using",
        "serving 150k active daily users",
    ),
]

CERTIFICATION_POOL = [
    "AWS Certified Solutions Architect - Associate",
    "Certified Kubernetes Administrator (CKA)",
    "Google Cloud Professional Data Engineer",
    "Terraform Associate Certification (HashiCorp)",
    "AWS Certified Developer - Associate",
    "Professional Scrum Master I (PSM I)",
]


@router.post("/generate-batch", response_model=SyntheticGenerateBatchResponse)
def generate_batch(
    request: SyntheticGenerateBatchRequest, x_internal_service_key: str = Header(...)
):
    verify_internal_key(x_internal_service_key)

    seniority_levels = {
        "Junior": {"exp_count": 1, "grad_year": 2023, "years": "1-2"},
        "Mid-level": {"exp_count": 2, "grad_year": 2020, "years": "3-5"},
        "Senior": {"exp_count": 3, "grad_year": 2017, "years": "6-8"},
        "Lead/Architect": {"exp_count": 3, "grad_year": 2014, "years": "8+"},
    }

    config = seniority_levels.get(
        request.seniority, {"exp_count": 2, "grad_year": 2019, "years": "4-6"}
    )
    base_tech = (
        request.tech_stack
        if request.tech_stack
        else ["TypeScript", "NestJS", "PostgreSQL", "Redis", "Docker"]
    )

    generated_profiles = []
    for i in range(request.batch_size):
        # Pick 4-8 skills with controlled randomness
        shuffled_tech = list(base_tech)
        random.shuffle(shuffled_tech)
        candidate_skills = list(
            dict.fromkeys(
                shuffled_tech[: random.randint(4, min(8, len(shuffled_tech)))]
            )
        )
        if len(candidate_skills) < 3:
            candidate_skills = base_tech[:4]

        # Generate realistic chronological experiences
        experiences = []
        companies_sample = random.sample(
            INDUSTRIES, min(config["exp_count"], len(INDUSTRIES))
        )

        current_year = 2026
        for idx, comp in enumerate(companies_sample):
            if idx == 0:
                start_year = current_year - random.randint(2, 3)
                start_date = f"{start_year}-0{random.randint(1, 9)}"
                end_date = "Present"
                title = f"{request.seniority} {request.role}"
            elif idx == 1:
                start_year = current_year - random.randint(4, 5)
                end_year = current_year - random.randint(2, 3)
                start_date = f"{start_year}-0{random.randint(1, 9)}"
                end_date = f"{end_year}-12"
                title = f"Software Engineer"
            else:
                start_year = current_year - random.randint(6, 8)
                end_year = current_year - random.randint(4, 5)
                start_date = f"{start_year}-06"
                end_date = f"{end_year}-05"
                title = f"Associate Engineer"

            bullets = []
            verb_sample = random.sample(ACTION_VERBS, 2)
            for prefix, suffix in verb_sample:
                tech_used = ", ".join(
                    random.sample(candidate_skills, min(2, len(candidate_skills)))
                )
                bullets.append(f"{prefix} {tech_used}, {suffix}.")

            experiences.append(
                WorkExperience(
                    company_name=comp["name"],
                    role_title=title,
                    start_date=start_date,
                    end_date=end_date,
                    responsibilities=bullets,
                    technologies_used=random.sample(
                        candidate_skills, min(3, len(candidate_skills))
                    ),
                )
            )

        # Select Education
        edu_choice = random.choice(UNIVERSITIES)
        education = Education(
            institution=edu_choice["name"],
            degree=edu_choice["degree"],
            field_of_study=edu_choice["field"],
            graduation_year=config["grad_year"],
        )

        # Select Certification
        certs = (
            random.sample(CERTIFICATION_POOL, 1)
            if request.seniority in ["Senior", "Lead/Architect"]
            else []
        )

        summary = (
            f"Results-oriented {request.seniority} {request.role} with {config['years']} years of hands-on experience "
            f"designing and operating resilient web systems and distributed services. Proven proficiency in {', '.join(candidate_skills[:3])}."
        )

        profile = ResumeProfileData(
            professional_summary=summary,
            skills=candidate_skills,
            experiences=experiences,
            educations=[education],
            certifications=certs,
            projects=[],
        )
        generated_profiles.append(profile)

    return SyntheticGenerateBatchResponse(
        success=True,
        generated_count=len(generated_profiles),
        profiles=generated_profiles,
    )


@router.post("/generate-universal-batch", response_model=UniversalGenerateBatchResponse)
def generate_universal_batch(
    request: UniversalGenerateBatchRequest, x_internal_service_key: str = Header(...)
):
    verify_internal_key(x_internal_service_key)
    try:
        items = UniversalSyntheticGenerator.generate_batch(request)
        return UniversalGenerateBatchResponse(
            dataset_type=request.dataset_type,
            count=len(items),
            items=items,
            generated_at=datetime.utcnow().isoformat(),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Synthetic generation error: {str(e)}",
        )
