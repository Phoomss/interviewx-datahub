from fastapi import APIRouter, Header, HTTPException, status
from src.schemas.profile import (
    SyntheticGenerateBatchRequest,
    SyntheticGenerateBatchResponse,
    ResumeProfileData,
    WorkExperience,
    Education,
)
from src.config import settings

router = APIRouter(prefix="/internal/v1/synthetic", tags=["Synthetic"])

def verify_internal_key(x_internal_service_key: str = Header(...)):
    if x_internal_service_key != settings.internal_service_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal service key"
        )

@router.post("/generate-batch", response_model=SyntheticGenerateBatchResponse)
def generate_batch(request: SyntheticGenerateBatchRequest, x_internal_service_key: str = Header(...)):
    verify_internal_key(x_internal_service_key)
    
    generated_profiles = []
    for i in range(request.batch_size):
        profile = ResumeProfileData(
            professional_summary=f"Synthetic {request.seniority} {request.role} with extensive domain expertise.",
            skills=request.tech_stack if request.tech_stack else ["Python", "FastAPI", "SQL"],
            experiences=[
                WorkExperience(
                    company_name=f"Tech Innovators Corp {i+1}",
                    role_title=f"{request.seniority} {request.role}",
                    start_date="2022-01",
                    end_date="Present",
                    responsibilities=[
                        "Engineered scalable data architectures and distributed services",
                        "Improved query performance and operational efficiency by 30%"
                    ],
                    technologies_used=request.tech_stack[:3] if request.tech_stack else ["Python", "FastAPI"]
                )
            ],
            educations=[
                Education(
                    institution="Leading University of Technology",
                    degree="Bachelor of Science in Computer Science",
                    field_of_study="Computer Science",
                    graduation_year=2021
                )
            ],
            certifications=[],
            projects=[]
        )
        generated_profiles.append(profile)

    return SyntheticGenerateBatchResponse(
        success=True,
        generated_count=len(generated_profiles),
        profiles=generated_profiles
    )
