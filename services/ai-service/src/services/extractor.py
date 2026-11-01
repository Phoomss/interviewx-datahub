import re
from typing import Tuple, List, Dict, Any, Optional
from src.schemas.profile import (
    ResumeProfileData,
    WorkExperience,
    Education,
    ExtractedPII,
)

# Known technology and skill keywords for accurate resume skill extraction
KNOWN_SKILLS = [
    # Languages
    "Python", "JavaScript", "TypeScript", "Java", "Go", "Golang", "C++", "C#", "Rust",
    "PHP", "Ruby", "Swift", "Kotlin", "Scala", "Dart", "R", "SQL", "HTML", "CSS", "Bash", "Shell",
    # Backend & Web frameworks
    "NestJS", "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot", "Laravel",
    "Ruby on Rails", "ASP.NET", "Next.js", "React", "Vue", "Angular", "Svelte", "Tailwind CSS",
    # Databases & Queues
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "SQLite",
    "Kafka", "RabbitMQ", "BullMQ", "ActiveMQ",
    # DevOps, Cloud & Tools
    "Docker", "Kubernetes", "AWS", "GCP", "Google Cloud", "Azure", "Terraform", "Ansible",
    "Git", "GitHub Actions", "GitLab CI", "CI/CD", "Linux", "Nginx", "Prometheus", "Grafana",
    # AI & ML
    "PyTorch", "TensorFlow", "Pandas", "Polars", "NumPy", "Scikit-Learn", "HuggingFace",
    "LangChain", "LlamaIndex", "MLflow", "DVC", "OpenAI",
    # Architecture & Practices
    "Microservices", "REST API", "RESTful", "GraphQL", "gRPC", "TDD", "Agile", "Scrum",
]

def extract_pii(text: str) -> ExtractedPII:
    """Extract PII such as full name, email, phone number, and location from raw resume text."""
    email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    email = email_match.group(0).strip() if email_match else None

    # Match Thai and international phone formats (+66..., 08x-xxx-xxxx, 02-xxx-xxxx, etc.)
    phone_match = re.search(
        r'(?:\+?66|0)[0-9]{1,2}[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}',
        text
    )
    phone = phone_match.group(0).strip() if phone_match else None

    # Detect location (Bangkok, Thailand, Nonthaburi, etc.)
    address_match = re.search(
        r'(?:Bangkok|Chiang Mai|Nonthaburi|Phuket|Pattaya|Thailand|กรุงเทพ(?:มหานคร)?|ไทย|[\w\s]+,\s*(?:Thailand|ไทย))',
        text,
        re.IGNORECASE
    )
    address = address_match.group(0).strip() if address_match else None

    # Detect Candidate Full Name:
    # Usually located in the first 3 lines of the resume before section headers and emails
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    full_name = None
    for line in lines[:4]:
        # Skip if contains email, phone, or section header
        if email and email in line:
            continue
        if phone and phone in line:
            continue
        if any(h in line.upper() for h in ["CURRICULUM VITAE", "RESUME", "CV", "PROFILE", "SUMMARY", "EXPERIENCE"]):
            continue
        if len(line) > 2 and len(line) < 60 and not re.search(r'[:|@\d]', line):
            full_name = line
            break

    return ExtractedPII(
        full_name=full_name,
        email=email,
        phone_number=phone,
        address=address,
    )

def extract_skills(text: str) -> List[str]:
    """Identify skills from candidate resume text using keyword dictionary and section analysis."""
    found_skills = set()
    text_lower = f" {text.lower()} "

    for skill in KNOWN_SKILLS:
        # Match with word boundaries
        pattern = r'(?<![a-zA-Z0-9])' + re.escape(skill.lower()) + r'(?![a-zA-Z0-9])'
        if re.search(pattern, text_lower):
            found_skills.add(skill)

    # Check SKILLS section specifically for additional comma/bullet separated items
    skills_section_match = re.search(
        r'(?:SKILLS|TECHNICAL SKILLS|TECH STACK|COMPETENCIES)\s*[:\n](.+?)(?=\n[A-Z\s]{4,}|\Z)',
        text,
        re.IGNORECASE | re.DOTALL
    )
    if skills_section_match:
        section_text = skills_section_match.group(1)
        # Split by comma, pipe, slash, or newline
        items = re.split(r'[,|/\n•\*\-]', section_text)
        for item in items:
            cleaned = item.strip()
            # Clean prefixes like "Languages & Frameworks:"
            if ":" in cleaned:
                cleaned = cleaned.split(":", 1)[1].strip()
            if 2 <= len(cleaned) <= 30 and not re.search(r'\d{4}', cleaned):
                # If it's a known skill or reasonably formatted title
                found_skills.add(cleaned)

    # Filter out common false positives
    filtered = [
        s for s in found_skills
        if s.lower() not in {"and", "with", "present", "summary", "experience", "education", "project", "university"}
    ]
    return sorted(filtered, key=lambda s: s.lower())

def extract_summary(text: str) -> str:
    """Extract professional summary or objective from resume text."""
    summary_match = re.search(
        r'(?:PROFESSIONAL SUMMARY|SUMMARY|PROFILE|ABOUT ME|CAREER OBJECTIVE|OBJECTIVE)\s*[:\n](.+?)(?=\n[A-Z\s]{4,}|\Z)',
        text,
        re.IGNORECASE | re.DOTALL
    )
    if summary_match:
        content = summary_match.group(1).strip()
        # Return cleaned first 1-2 paragraphs
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        if paragraphs:
            return " ".join(paragraphs[0].split())

    # Fallback: Find first paragraph with reasonable length
    for para in text.split("\n\n"):
        p = " ".join(para.split())
        if len(p) > 60 and not any(k in p.upper() for k in ["EDUCATION", "EXPERIENCE", "PROJECTS", "CERTIFICATIONS"]):
            return p

    return "Candidate profile parsed from uploaded document. Review and verify details."

def extract_experiences(text: str) -> List[WorkExperience]:
    """Extract professional work experience blocks from resume."""
    exp_section = re.search(
        r'(?:PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY)\s*[:\n](.+?)(?=\n(?:EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS)|\Z)',
        text,
        re.IGNORECASE | re.DOTALL
    )

    if not exp_section:
        return []

    exp_text = exp_section.group(1)
    experiences: List[WorkExperience] = []

    # Date pattern matching YYYY-MM or Month YYYY to Present / Date
    date_pattern = re.compile(
        r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[A-Za-z]+)?\s*(?:20\d\d|19\d\d)(?:[-/]\d{2})?)\s*(?:-|–|—|to)\s*([A-Za-z]+(?:\s*\d{4})?|Present|Current|Now|\d{4}(?:[-/]\d{2})?)',
        re.IGNORECASE
    )

    # Split into chunks around company/role or dates
    lines = [l.strip() for l in exp_text.split("\n") if l.strip()]
    current_company = ""
    current_role = ""
    current_start = ""
    current_end = ""
    current_bullets: List[str] = []

    for line in lines:
        date_match = date_pattern.search(line)
        if date_match:
            # If we already had an experience accumulating, save it
            if current_company or current_role:
                experiences.append(WorkExperience(
                    company_name=current_company or "Technology Company",
                    role_title=current_role or "Software Engineer",
                    start_date=current_start or "2021-01",
                    end_date=current_end or "Present",
                    responsibilities=current_bullets if current_bullets else [line],
                    technologies_used=[s for s in KNOWN_SKILLS if s.lower() in " ".join(current_bullets).lower()]
                ))
                current_bullets = []

            current_start = date_match.group(1).strip()
            current_end = date_match.group(2).strip()

            # The line might contain Role or Company
            line_without_date = date_pattern.sub('', line).strip(" -|()–—")
            if line_without_date:
                if "|" in line_without_date:
                    parts = line_without_date.split("|")
                    current_company = parts[0].strip()
                    current_role = parts[1].strip()
                else:
                    current_role = line_without_date
        elif line.startswith(("-", "•", "*", "–", ">")):
            bullet = line.lstrip("-•*–> ").strip()
            if bullet:
                current_bullets.append(bullet)
        elif "|" in line and not current_company:
            parts = line.split("|")
            current_company = parts[0].strip()
            current_role = parts[1].strip()
        elif not current_role and len(line) < 60:
            current_role = line

    # Flush last experience
    if current_company or current_role or current_bullets:
        experiences.append(WorkExperience(
            company_name=current_company or "Enterprise Solutions",
            role_title=current_role or "Software Engineer",
            start_date=current_start or "2021-01",
            end_date=current_end or "Present",
            responsibilities=current_bullets if current_bullets else ["Developed robust software solutions."],
            technologies_used=[s for s in KNOWN_SKILLS if s.lower() in " ".join(current_bullets).lower()]
        ))

    return experiences

def extract_educations(text: str) -> List[Education]:
    """Extract education records from resume text."""
    edu_section = re.search(
        r'(?:EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS)\s*[:\n](.+?)(?=\n(?:EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS)|\Z)',
        text,
        re.IGNORECASE | re.DOTALL
    )

    if not edu_section:
        return []

    edu_text = edu_section.group(1)
    lines = [l.strip() for l in edu_text.split("\n") if l.strip()]
    educations: List[Education] = []

    current_institution = ""
    current_degree = ""
    current_field = ""
    current_year: Optional[int] = None

    for line in lines:
        year_match = re.search(r'\b(20\d\d|19\d\d)\b', line)
        if year_match:
            current_year = int(year_match.group(1))

        if any(u in line.lower() for u in ["university", "college", "institute", "school", "มหาวิทยาลัย", "สถาบัน"]):
            current_institution = line.split("(")[0].strip()
        elif any(d in line.lower() for d in ["bachelor", "master", "ph.d", "b.eng", "b.sc", "b.a", "degree", "ปริญญา"]):
            current_degree = line
            if " in " in line.lower():
                parts = re.split(r'\bin\b', line, flags=re.IGNORECASE)
                current_degree = parts[0].strip()
                current_field = parts[1].strip()
            elif "of" in line.lower():
                parts = re.split(r'\bof\b', line, flags=re.IGNORECASE)
                current_field = parts[-1].strip()

    if current_institution or current_degree:
        educations.append(Education(
            institution=current_institution or "University",
            degree=current_degree or "Bachelor of Science",
            field_of_study=current_field or "Computer Engineering",
            graduation_year=current_year or 2020
        ))

    return educations

def extract_certifications(text: str) -> List[str]:
    """Extract certifications and credentials."""
    cert_section = re.search(
        r'(?:CERTIFICATIONS|CERTIFICATES|LICENSES)\s*[:\n](.+?)(?=\n(?:EDUCATION|EXPERIENCE|SKILLS|PROJECTS)|\Z)',
        text,
        re.IGNORECASE | re.DOTALL
    )
    if not cert_section:
        return []

    certs = []
    for line in cert_section.group(1).split("\n"):
        c = line.strip().lstrip("-•*– ").strip()
        if c and len(c) > 3 and len(c) < 100:
            certs.append(c)
    return certs

def parse_resume(raw_text: str) -> Tuple[ResumeProfileData, ExtractedPII, float]:
    """Orchestrate parsing of full resume text into structured ResumeProfileData and ExtractedPII."""
    pii = extract_pii(raw_text)
    summary = extract_summary(raw_text)
    skills = extract_skills(raw_text)
    experiences = extract_experiences(raw_text)
    educations = extract_educations(raw_text)
    certifications = extract_certifications(raw_text)

    profile_data = ResumeProfileData(
        professional_summary=summary,
        skills=skills,
        experiences=experiences,
        educations=educations,
        certifications=certifications,
        projects=[]
    )

    # Calculate confidence score based on richness of extraction
    score = 0.85
    if len(skills) >= 3:
        score += 0.05
    if len(experiences) >= 1:
        score += 0.04
    if len(educations) >= 1:
        score += 0.03
    if summary and len(summary) > 50:
        score += 0.02

    confidence_score = min(0.99, round(score, 2))
    return profile_data, pii, confidence_score
