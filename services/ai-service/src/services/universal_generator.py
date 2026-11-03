import random
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from src.schemas.synthetic_universal import (
    FeedbackData,
    InterviewAnswerData,
    InterviewQuestionData,
    ProfessionalProfileData,
    ResumeCVData,
    RubricEvaluationData,
    ScenarioBasedData,
    SyntheticMetadata,
    UniversalGenerateBatchRequest,
)
from src.services.data_banks.institution_banks import (
    CITIES,
    CITIES_GLOBAL,
    CITIES_THAI,
    COMPANIES_BY_INDUSTRY,
    UNIVERSITIES,
    get_institution_education,
    get_random_company,
    get_random_location,
)
from src.services.data_banks.interview_banks import (
    get_dynamic_question,
    get_dynamic_scenario,
)
from src.services.data_banks.name_banks import (
    FIRST_NAMES_EN,
    FIRST_NAMES_TH,
    LAST_NAMES_EN,
    LAST_NAMES_TH,
    SyntheticCandidateIdentity,
    generate_candidate_identity,
)
from src.services.data_banks.profile_dimensions import (
    AWARDS_BY_INDUSTRY,
    CERTIFICATIONS_BY_INDUSTRY,
    PERSONA_ARCHETYPES,
    get_language_proficiencies,
    get_realistic_project,
)


class UniversalSyntheticGenerator:
    """Universal Synthetic Data Generator 2.5 for high-fidelity multi-dimensional profiles,

    resumes, questions, answers, rubrics, feedback reports, and crisis scenarios.
    """

    @staticmethod
    def _is_no_experience(seniority: str) -> bool:
        lowered = seniority.lower()
        return any(
            term in lowered
            for term in [
                "student",
                "no experience",
                "high school",
                "undergraduate",
                "trainee",
                "entry",
                "fresh grad",
            ]
        )

    @staticmethod
    def _get_name(language: str = "en") -> str:
        """Backward-compatible helper returning a realistic candidate name."""
        identity = generate_candidate_identity(language=language, include_nickname=True)
        return identity.full_name

    @staticmethod
    def _build_metadata(req: UniversalGenerateBatchRequest) -> SyntheticMetadata:
        # Use timezone-aware UTC datetime format
        now_utc = datetime.now(timezone.utc).isoformat()
        return SyntheticMetadata(
            is_synthetic=True,
            data_source="interviewx-universal-synthetic-engine",
            generation_version="2.0.0",
            generated_at=now_utc,
            industry=req.industry_key,
            profession=req.profession_name or req.profession_key,
            interview_category=req.interview_category,
            interview_subcategory=req.interview_subcategory,
            seniority_level=req.seniority,
            language=req.language,
            difficulty_level=req.difficulty,
        )

    # ==========================================================================
    # Type 1: Professional Profile Dataset (Multi-Dimensional)
    # ==========================================================================
    @classmethod
    def generate_profile(cls, req: UniversalGenerateBatchRequest) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        identity = generate_candidate_identity(
            language=req.language,
            include_nickname=True,
        )
        no_exp = cls._is_no_experience(req.seniority)
        clean_slug = identity.clean_email_slug or "candidate"

        skills = (
            req.skills
            if req.skills and len(req.skills) > 0
            else [
                f"{req.profession_name} Domain Practice",
                "Strategic Analysis & Execution",
                "Cross-Functional Collaboration",
                "Problem Solving & Root Cause Analysis",
                "Continuous Improvement",
            ]
        )

        ind_key = req.industry_key.lower()

        # Dynamic profession-specific attributes
        prof_fields: Dict[str, Any] = {
            "candidate_cultural_background": identity.cultural_background,
            "candidate_gender": identity.gender,
        }
        if identity.nickname:
            prof_fields["workplace_nickname"] = identity.nickname
        if identity.nickname_th:
            prof_fields["workplace_nickname_th"] = identity.nickname_th

        if "health" in ind_key:
            prof_fields.update(
                {
                    "clinical_license_number": f"MD-TH-{random.randint(10000, 99999)}",
                    "specialty_board": f"{req.profession_name} Board Certified (แพทยสภา)",
                    "hospital_affiliation": "King Chulalongkorn Memorial Hospital / Tertiary Medical Network",
                    "patient_safety_credential": "ICH-GCP & BLS/ACLS Certified",
                }
            )
        elif "legal" in ind_key:
            prof_fields.update(
                {
                    "bar_association_license": f"BAR-TH-{random.randint(1000, 9999)}",
                    "jurisdiction": "Kingdom of Thailand / International Commercial Arbitration",
                    "practice_areas": [
                        "Regulatory Compliance & PDPA",
                        "Cross-Border Dispute Resolution",
                        "Commercial Contracts & M&A",
                    ],
                }
            )
        elif "educ" in ind_key or "research" in req.interview_category:
            prof_fields.update(
                {
                    "orcid_id": f"0000-0002-{random.randint(1000, 9999)}-{random.randint(1000, 9999)}",
                    "research_interests": [
                        f"Contemporary Advances in {req.profession_name}",
                        "Evidence-Based Methodology & Epistemology",
                    ],
                    "google_scholar_citations": random.randint(35, 680),
                    "h_index": random.randint(3, 14),
                }
            )
        elif "tech" in ind_key:
            prof_fields.update(
                {
                    "github_profile": f"https://github.com/{clean_slug}",
                    "primary_stack": skills[:5],
                    "cloud_certifications": [
                        "AWS Certified Solutions Architect",
                        "CKA Kubernetes Administrator",
                    ],
                    "system_design_focus": "High-Throughput Distributed Microservices",
                }
            )
        elif "fin" in ind_key:
            prof_fields.update(
                {
                    "sec_license_number": f"IC-TH-{random.randint(100000, 999999)}",
                    "cpa_cfa_status": "CPA Thailand / CFA Charterholder Candidate",
                    "financial_modelling_suite": [
                        "DCF Valuation",
                        "TFRS 9 / IFRS 16",
                        "Power BI",
                    ],
                }
            )
        elif "design" in ind_key or "creative" in ind_key:
            prof_fields.update(
                {
                    "portfolio_url": f"https://behance.net/{clean_slug}",
                    "design_systems": [
                        "Figma Tokens",
                        "Design Systems at Scale",
                        "WCAG 2.1 AAA Accessibility",
                    ],
                }
            )
        else:
            prof_fields.update(
                {
                    "professional_affiliations": [
                        f"Federation of {req.profession_name} Professionals"
                    ],
                    "core_competency_focus": f"Advanced {req.profession_name} Operations & Strategy",
                }
            )

        # Education
        edu_data = get_institution_education(
            industry_key=req.industry_key,
            seniority=req.seniority,
            language=req.language,
        )
        education = [
            {
                "institution": (
                    edu_data["institution"]
                    if req.language != "th"
                    else (edu_data.get("institution_th") or edu_data["institution"])
                ),
                "degree": edu_data["degree"],
                "field": f"{req.profession_name} Specialized Discipline",
                "graduation_year": edu_data["graduation_year"],
                "gpa": edu_data["gpa"],
                "honors": edu_data.get("honors"),
                "country": edu_data["country"],
            }
        ]

        # Work Experience
        work_experience = None
        exp_years = 0.0
        if not no_exp:
            exp_years = round(random.uniform(2.5, 9.5), 1)
            comp1 = get_random_company(req.industry_key)
            comp2 = get_random_company(req.industry_key)

            work_experience = [
                {
                    "company_or_organization": comp1["name"],
                    "organization_type": comp1["type"],
                    "role_title": f"{req.seniority} {req.profession_name}",
                    "start_date": "2023-03",
                    "end_date": "Present",
                    "location": comp1["hq"],
                    "responsibilities": [
                        f"Spearheaded core {req.profession_name} initiatives, delivering high-impact deliverables across cross-functional teams.",
                        f"Architected process improvements leveraging {skills[0] if skills else 'analytical frameworks'}, reducing cycle time by {random.randint(22, 45)}%.",
                        f"Mentored junior associates and established rigorous quality assurance benchmarks aligned with industry governance.",
                    ],
                },
                {
                    "company_or_organization": comp2["name"],
                    "organization_type": comp2["type"],
                    "role_title": f"Associate {req.profession_name}",
                    "start_date": "2020-07",
                    "end_date": "2023-02",
                    "location": comp2["hq"],
                    "responsibilities": [
                        f"Executed day-to-day domain responsibilities in {req.profession_name} adhering to strict operational standards.",
                        f"Analyzed key performance indicators and co-authored executive strategic presentations for senior stakeholders.",
                    ],
                },
            ]

        # Pick Certifications & Awards
        matched_ind = "tech"
        for k in CERTIFICATIONS_BY_INDUSTRY.keys():
            if k in ind_key:
                matched_ind = k
                break

        certs_pool = CERTIFICATIONS_BY_INDUSTRY.get(
            matched_ind, CERTIFICATIONS_BY_INDUSTRY["tech"]
        )
        awards_pool = AWARDS_BY_INDUSTRY.get(
            matched_ind, AWARDS_BY_INDUSTRY["tech"]
        )

        chosen_certs = random.sample(certs_pool, min(2, len(certs_pool)))
        chosen_awards = random.sample(awards_pool, min(2, len(awards_pool)))
        languages = get_language_proficiencies(
            language_mode=req.language, origin=identity.cultural_background
        )

        # Persona summary
        if no_exp:
            summary = (
                f"High-achieving, proactive candidate preparing for {req.interview_category.replace('_', ' ')} in {req.profession_name}. "
                f"Distinguished by solid academic grounding from {education[0]['institution']} (GPA {education[0]['gpa']}), "
                f"practical mastery of {', '.join(skills[:3])}, and a dedicated commitment to ethical excellence."
            )
        else:
            summary = (
                f"Accomplished {req.seniority} {req.profession_name} with {exp_years} years of demonstrated experience in {req.industry_key}. "
                f"Track record in leveraging {', '.join(skills[:3])} to deliver scalable outcomes, organizational efficiency, "
                f"and strategic capability elevation."
            )

        profile = ProfessionalProfileData(
            full_name=identity.full_name,
            headline=f"{req.seniority} {req.profession_name} | {req.interview_category.replace('_', ' ').title()}",
            professional_summary=summary,
            contact_info={
                "email": f"{clean_slug}@example.com",
                "phone": (
                    f"+66 {random.randint(80, 89)} {random.randint(100, 999)} {random.randint(1000, 9999)}"
                    if "Thai" in identity.cultural_background
                    else f"+1 {random.randint(200, 900)} {random.randint(100, 999)} {random.randint(1000, 9999)}"
                ),
                "location": get_random_location(
                    prefer_thailand=("Thai" in identity.cultural_background)
                ),
                "linkedin": f"https://linkedin.com/in/{clean_slug}",
            },
            skills=skills,
            experience_years=exp_years,
            education=education,
            work_experience=work_experience,
            certifications=chosen_certs,
            languages=languages,
            awards=chosen_awards,
            publications_or_research=(
                [
                    f"Advances and Future Horizons in {req.profession_name} Systems (2024)",
                    f"Empirical Evaluation of Quality Benchmarks in {req.industry_key.title()} (2023)",
                ]
                if (
                    not no_exp
                    or "academic" in req.interview_category
                    or "research" in req.interview_category
                )
                else []
            ),
            volunteer_or_extracurricular=[
                "Professional Mentorship Program - Emerging Leaders Initiative",
                "Annual Industry Forum & Sustainability Workshop Volunteer",
            ],
            profession_specific_fields=prof_fields,
            metadata=meta,
        )
        return profile.model_dump()

    # ==========================================================================
    # Type 2: Resume / CV Dataset (Multi-Dimensional)
    # ==========================================================================
    @classmethod
    def generate_resume(cls, req: UniversalGenerateBatchRequest) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        identity = generate_candidate_identity(
            language=req.language,
            include_nickname=True,
        )
        no_exp = cls._is_no_experience(req.seniority)
        clean_slug = identity.clean_email_slug or "candidate"

        skills = (
            req.skills
            if req.skills and len(req.skills) > 0
            else [
                f"Advanced {req.profession_name} Techniques",
                "Strategic Analytical Thinking",
                "Cross-Functional Project Management",
                "Data-Driven Decision Making",
                "Performance Optimization",
            ]
        )

        ind_key = req.industry_key.lower()
        matched_ind = "tech"
        for k in CERTIFICATIONS_BY_INDUSTRY.keys():
            if k in ind_key:
                matched_ind = k
                break

        edu_data = get_institution_education(
            industry_key=req.industry_key,
            seniority=req.seniority,
            language=req.language,
        )
        education_history = [
            {
                "institution": (
                    edu_data["institution"]
                    if req.language != "th"
                    else (edu_data.get("institution_th") or edu_data["institution"])
                ),
                "degree": edu_data["degree"],
                "honors": edu_data.get("honors") or "Honor Graduate (GPA 3.82)",
                "period": (
                    "2020 - 2024"
                    if no_exp
                    else f"{edu_data['graduation_year'] - 4} - {edu_data['graduation_year']}"
                ),
                "relevant_coursework": [
                    f"Advanced {req.profession_name} Systems",
                    "Applied Quantitative Analysis",
                    "Professional Ethics & Corporate Governance",
                    "Strategic Innovation & Capstone Practicum",
                ],
            }
        ]

        work_history = None
        if not no_exp:
            comp1 = get_random_company(req.industry_key)
            comp2 = get_random_company(req.industry_key)
            work_history = [
                {
                    "organization": comp1["name"],
                    "position": f"{req.seniority} {req.profession_name}",
                    "period": "2022 - Present",
                    "location": comp1["hq"],
                    "bullet_points": [
                        f"Orchestrated cross-functional operational deliverables across {req.industry_key} workflows, managing multi-tier dependencies.",
                        f"Reduced deliverable turnaround time by {random.randint(25, 45)}% through disciplined application of {skills[0]}.",
                        f"Supervised team members and authored strategic roadmap documentation for executive stakeholders.",
                        f"Enforced compliance, security, and quality gates, eliminating defect leakage to production.",
                    ],
                },
                {
                    "organization": comp2["name"],
                    "position": f"Associate {req.profession_name}",
                    "period": "2019 - 2022",
                    "location": comp2["hq"],
                    "bullet_points": [
                        f"Supported core operational delivery in {req.profession_name}, optimizing database and reporting procedures.",
                        f"Collaborated with cross-departmental partners to ensure adherence to SLA benchmarks.",
                    ],
                },
            ]

        # Multi-dimensional Project Showcase
        project = get_realistic_project(
            profession_name=req.profession_name,
            industry_key=req.industry_key,
            skills=skills,
        )

        skills_breakdown = {
            "Core Profession Competencies": skills[:4],
            "Tools & Methodologies": [
                "Agile / Scrum Methodologies",
                "Advanced Data Analytics & SQL",
                "Enterprise Resource Platforms",
                "Collaborative Governance Systems",
            ],
            "Soft & Executive Leadership": [
                "Principled Stakeholder Negotiation",
                "Conflict Resolution Under Pressure",
                "High-Clarity Executive Presentations",
                "Psychological Safety & Coaching",
            ],
            "Languages & Fluency": get_language_proficiencies(
                language_mode=req.language, origin=identity.cultural_background
            ),
        }

        certs_pool = CERTIFICATIONS_BY_INDUSTRY.get(
            matched_ind, CERTIFICATIONS_BY_INDUSTRY["tech"]
        )
        awards_pool = AWARDS_BY_INDUSTRY.get(
            matched_ind, AWARDS_BY_INDUSTRY["tech"]
        )

        resume = ResumeCVData(
            profile_summary=(
                f"Results-oriented {req.profession_name} candidate with deep commitment to excellence in {req.interview_category.replace('_', ' ')}. "
                f"Equipped with comprehensive academic foundation from {education_history[0]['institution']}, "
                f"proven proficiency across {', '.join(skills[:3])}, and exceptional problem-solving capacity."
            ),
            personal_info={
                "candidate_name": identity.full_name,
                "email": f"{clean_slug}@example.com",
                "city": get_random_location(
                    prefer_thailand=("Thai" in identity.cultural_background)
                ),
                "cultural_background": identity.cultural_background,
            },
            education_history=education_history,
            skills_breakdown=skills_breakdown,
            work_history=work_history,
            projects_or_initiatives=[project],
            certifications_and_licenses=random.sample(
                certs_pool, min(2, len(certs_pool))
            ),
            publications_and_patents=(
                [
                    f"Methodological Blueprint: High-Performance Innovations in {req.profession_name} (2024)"
                ]
                if (
                    "academic" in req.interview_category
                    or "research" in req.interview_category
                    or not no_exp
                )
                else []
            ),
            honors_awards=random.sample(awards_pool, min(2, len(awards_pool))),
            profession_specific_highlights={
                "target_focus": req.profession_name,
                "domain_industry": req.industry_key,
                "interview_stream": req.interview_category,
                "identity_origin": identity.cultural_background,
            },
            metadata=meta,
        )
        return resume.model_dump()

    # ==========================================================================
    # Type 3: Interview Question Dataset (Multi-Dimensional)
    # ==========================================================================
    @classmethod
    def generate_interview_question(
        cls, req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        q_data = get_dynamic_question(
            category=req.interview_category,
            profession_name=req.profession_name,
            industry_key=req.industry_key,
            seniority=req.seniority,
            language=req.language,
        )

        q_obj = InterviewQuestionData(
            question=q_data["question"],
            question_th=q_data["question_th"],
            category=q_data["category"],
            difficulty=q_data["difficulty"],
            intent_and_objective=q_data["intent_and_objective"],
            competencies_evaluated=q_data["competencies_evaluated"],
            key_points_to_look_for=q_data["key_points_to_look_for"],
            red_flags=q_data["red_flags"],
            sample_follow_ups=q_data["sample_follow_ups"],
            metadata=meta,
        )
        return q_obj.model_dump()

    # ==========================================================================
    # Type 4: Interview Answer Dataset (Multi-Dimensional)
    # ==========================================================================
    @classmethod
    def generate_interview_answer(
        cls, req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        qualities = [
            "Excellent",
            "Good",
            "Average",
            "Poor",
            "Incomplete",
            "Irrelevant",
        ]
        chosen_quality = (
            req.custom_parameters.get("answer_quality")
            if req.custom_parameters and "answer_quality" in req.custom_parameters
            else random.choice(qualities)
        )

        p = req.profession_name
        ind = req.industry_key
        question_text = f"How do you approach critical challenges, ambiguous constraints, and strategic decision-making in your role as a {p}?"

        answers_map = {
            "Excellent": {
                "text": (
                    f"In my recent high-impact project as a {p} in {ind}, our team was hit by a sudden 40% change in operational constraints "
                    f"two weeks prior to milestone sign-off. Applying the STAR framework: Situation: We were facing an immediate delivery roadblock "
                    f"with critical stakeholder commitments at risk. Task: I took full ownership of scoping the non-negotiables, identifying architectural "
                    f"risks, and resetting delivery priorities. Action: I convened a rapid stakeholder alignment workshop, implemented data-backed triage "
                    f"models, and redistributed specialized tasks according to team strengths while upholding strict safety/compliance standards. "
                    f"Result: We delivered the core release 3 days ahead of revised schedule with zero defect leakage, trimmed cloud/operational cost by 22%, "
                    f"and raised client trust ratings by 30%."
                ),
                "text_th": (
                    f"ในโครงการล่าสุดของผมในตำแหน่ง {p} ในสายงาน {ind} เราเผชิญกับข้อจำกัดและการปรับเปลี่ยนความต้องการอย่างกะทันหันถึง 40% "
                    f"ก่อนกำหนดส่งมอบ 2 สัปดาห์ โดยใช้โมเดล STAR: สถานการณ์คือทีมเสี่ยงต่อการส่งมอบไม่ทันและมีผลกระทบต่อคำมั่นสัญญากับลูกค้า "
                    f"ภารกิจคือผมรับหน้าที่เป็นเจ้าภาพในการวิเคราะห์ขอบเขต จัดลำดับความสำคัญ และประเมินความเสี่ยงเชิงระบบ การปฏิบัติคือผมจัดประชุมเชิงปฏิบัติการ "
                    f"ร่วมกับผู้มีส่วนได้ส่วนเสีย ใช้การวิเคราะห์ข้อมูลเชิงประจักษ์ และจัดสรรงานตามความเชี่ยวชาญพร้อมทั้งควบคุมมาตรฐานคุณภาพอย่างเข้มงวด "
                    f"ผลลัพธ์คือเราส่งมอบงานเสร็จก่อนกำหนด 3 วันโดยไม่มีข้อผิดพลาด ลดต้นทุนการดำเนินงานลงได้ 22% และเพิ่มความพึงพอใจของลูกค้าขึ้น 30%"
                ),
                "strengths": [
                    "Flawless STAR structural discipline",
                    "Quantifiable business metrics (40%, 22%, 30%)",
                    "Empathetic stakeholder alignment",
                    "Proactive accountability under pressure",
                ],
                "weaknesses": [
                    "Exemplary answer; candidate could briefly mention retrospective lessons learned"
                ],
                "sentiment": "Strongly Impressed - Top Tier Candidate (Immediate Pass)",
            },
            "Good": {
                "text": (
                    f"When faced with ambiguous challenges in {p} workflows, I always consult our established standard operating procedures "
                    f"and gather quantitative data before committing to action. For example, during a system transition last quarter in {ind}, "
                    f"I analyzed historical operational data, presented 3 viable options to my department head, and coordinated cross-functional "
                    f"teams to roll out the chosen route smoothly with minimal disruption."
                ),
                "text_th": (
                    f"เวลาที่ผมต้องตัดสินใจเรื่องที่มีความคลุมเครือในงาน {p} ผมจะยึดหลักเกณฑ์มาตรฐานและรวบรวมข้อมูลเชิงปริมาณก่อนเสมอ เช่น "
                    f"เมื่อไตรมาสก่อนระหว่างการปรับเปลี่ยนระบบในสายงาน {ind} ผมวิเคราะห์ข้อมูลย้อนหลัง นำเสนอทางเลือกที่เป็นไปได้ 3 แนวทางให้หัวหน้า "
                    f"และประสานงานกับทีมงานจนสามารถนำแนวทางที่เลือกไปปฏิบัติได้สำเร็จโดยแทบไม่มีผลกระทบต่อการทำงานประจำวัน"
                ),
                "strengths": [
                    "Structured logical decomposition",
                    "Data-driven mindset",
                    "Reliable cross-functional teamwork",
                ],
                "weaknesses": [
                    "Could incorporate more concrete quantifiable impact metrics and personal leadership initiative"
                ],
                "sentiment": "Positive - Meets All Core Professional Expectations",
            },
            "Average": {
                "text": (
                    f"Normally when a challenge arises in {p}, I just do my best to solve it by putting in extra hours and discussing with colleagues. "
                    f"In {ind}, most issues can be sorted out if everyone communicates better and stays patient."
                ),
                "text_th": (
                    f"โดยปกติเวลาเจอปัญหาในงาน {p} ผมก็จะพยายามทำให้ดีที่สุดโดยอยู่ทำงานล่วงเวลาและปรึกษาเพื่อนร่วมงานครับ "
                    f"ในงานด้าน {ind} ปัญหาส่วนใหญ่จะแก้ไขได้ถ้าทุกคนสื่อสารกันดีๆ และมีความอดทนครับ"
                ),
                "strengths": [
                    "Willingness to work hard",
                    "Pleasant collaborative disposition",
                ],
                "weaknesses": [
                    "Lacks structured methodology (STAR)",
                    "No concrete empirical examples or metrics",
                    "Passive phrasing and generic cliches",
                ],
                "sentiment": "Borderline - Requires Deep Follow-up Probing",
            },
            "Poor": {
                "text": (
                    f"Honestly, challenges only occur in {p} because executive management doesn't provide clear roadmaps or sufficient budget. "
                    f"When deadlines are missed in {ind}, there really isn't much anyone on the ground can do except wait for leadership to fix it."
                ),
                "text_th": (
                    f"เอาจริงๆ ปัญหาในงาน {p} เกิดขึ้นเพราะฝ่ายบริหารไม่ให้ทิศทางที่ชัดเจนและงบประมาณไม่พอครับ "
                    f"พอส่งงานไม่ทันในสายงาน {ind} คนทำงานหน้างานก็ทำอะไรไม่ได้นอกจากรอให้ผู้บริหารข้างบนลงมาแก้ไขเองครับ"
                ),
                "strengths": ["None identified"],
                "weaknesses": [
                    "Deflects personal accountability entirely",
                    "Blames organizational leadership",
                    "Defeatist and cynical disposition",
                    "Substantial cultural and professional mismatch",
                ],
                "sentiment": "Negative - Serious Professional Red Flag (Reject)",
            },
            "Incomplete": {
                "text": (
                    f"At my previous position, we faced a major operational crisis where our {p} deliverables were halted because an external vendor "
                    f"experienced an unexpected service failure. I immediately logged into the monitoring telemetry dashboard and notified my supervisor..."
                ),
                "text_th": (
                    f"ที่ทำงานเดิม เราเคยเจอกรณีฉุกเฉินที่การทำงานด้าน {p} ต้องหยุดชะงักเพราะระบบผู้ให้บริการภายนอกขัดข้อง "
                    f"ผมก็รีบเข้าไประบบเพื่อตรวจดูแดชบอร์ดและแจ้งหัวหน้างานทันที..."
                ),
                "strengths": ["Appropriate situational setup"],
                "weaknesses": [
                    "Incomplete answer; candidate trailed off without stating actions taken or measurable results",
                    "Failed to demonstrate STAR resolution",
                ],
                "sentiment": "Inconclusive - Candidate failed to conclude narrative",
            },
            "Irrelevant": {
                "text": (
                    f"That reminds me of when I was studying in high school and won a chess tournament. Playing chess really teaches you "
                    f"how to think multiple moves ahead and stay calm under pressure."
                ),
                "text_th": (
                    f"เรื่องนี้ทำให้นึกถึงตอนเรียนมัธยมแล้วชนะการแข่งขันหมากรุกครับ การเล่นหมากรุกสอนให้คิดล่วงหน้าหลายๆ ก้าว "
                    f"และมีความใจเย็นเมื่อเผชิญแรงกดดันครับ"
                ),
                "strengths": ["Demonstrates hobby enthusiasm"],
                "weaknesses": [
                    "Completely unrelated to the professional prompt",
                    "Failed to address {p} or {ind} situational realities",
                ],
                "sentiment": "Rejection - Inability to comprehend or respond to core question",
            },
        }

        chosen_data = answers_map.get(chosen_quality, answers_map["Good"])

        ans = InterviewAnswerData(
            question=question_text,
            candidate_level=req.seniority,
            answer_quality=chosen_quality,
            answer_text=(
                chosen_data["text"]
                if req.language != "th"
                else chosen_data["text_th"]
            ),
            answer_text_th=chosen_data["text_th"],
            structure_framework_used=(
                "STAR"
                if chosen_quality in ["Excellent", "Good"]
                else "Unstructured"
            ),
            key_strengths=chosen_data["strengths"],
            weaknesses_or_gaps=chosen_data["weaknesses"],
            interviewer_sentiment=chosen_data["sentiment"],
            metadata=meta,
        )
        return ans.model_dump()

    # ==========================================================================
    # Type 5: Rubric Evaluation Dataset (Multi-Dimensional)
    # ==========================================================================
    @classmethod
    def generate_rubric_evaluation(
        cls, req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        p = req.profession_name
        ind = req.industry_key

        dimensions = [
            {
                "dimension": "Domain Expertise & Technical Competence",
                "max_score": 25.0,
                "awarded_score": round(random.uniform(19.0, 24.8), 1),
                "rationale": f"Exhibited thorough grounding in contemporary {p} protocols, frameworks, and real-world {ind} standards.",
                "evidence_quote": f"Seamlessly integrated accurate domain terminology and demonstrated root cause problem decomposition for {p}.",
            },
            {
                "dimension": "Problem Solving & Analytical Rigor",
                "max_score": 25.0,
                "awarded_score": round(random.uniform(18.0, 24.2), 1),
                "rationale": "Applied systematic root cause analysis rather than superficial symptom treatment; leveraged quantifiable metrics.",
                "evidence_quote": "Structured problem breakdown with empirical risk quantification and clear trade-off analysis.",
            },
            {
                "dimension": "Communication Clarity & Structural Discipline",
                "max_score": 25.0,
                "awarded_score": round(random.uniform(19.5, 25.0), 1),
                "rationale": "High structural discipline adhering to the STAR model; articulated complex nuances succinctly.",
                "evidence_quote": "Opened with concise executive summary followed by chronological evidence and concrete outcomes.",
            },
            {
                "dimension": "Values, Professional Ethics & Collaboration",
                "max_score": 25.0,
                "awarded_score": round(random.uniform(19.0, 24.5), 1),
                "rationale": "Strong ethical fortitude, commitment to institutional integrity, and constructive empathy across cross-functional teams.",
                "evidence_quote": "Acknowledged collective team contributions and upheld regulatory compliance boundaries without hesitation.",
            },
        ]

        total = sum(d["awarded_score"] for d in dimensions)
        max_possible = 100.0
        pct = round((total / max_possible) * 100.0, 1)

        if pct >= 86.0:
            verdict = "Strong Pass"
            recommendation = f"Highly Recommended for immediate admission / hiring in {req.seniority} {p} role."
        elif pct >= 72.0:
            verdict = "Pass"
            recommendation = f"Recommended; fully meets standard threshold for {req.seniority} {p} in {ind}."
        elif pct >= 58.0:
            verdict = "Borderline"
            recommendation = (
                "Conditional pass pending secondary evaluation or targeted technical assessment."
            )
        else:
            verdict = "Fail"
            recommendation = "Not recommended at this time; substantial capability or cultural gaps observed."

        rubric = RubricEvaluationData(
            question_context=f"Comprehensive evaluation for {req.seniority} {p} in {req.interview_category.replace('_', ' ')} context.",
            candidate_response_sample="Candidate demonstrated comprehensive situational response with clear STAR milestones and quantifiable metrics.",
            evaluation_dimensions=dimensions,
            total_score=total,
            max_possible_score=max_possible,
            percentage=pct,
            overall_verdict=verdict,
            hiring_or_admission_recommendation=recommendation,
            metadata=meta,
        )
        return rubric.model_dump()

    # ==========================================================================
    # Type 6: Feedback & Coaching Dataset (Multi-Dimensional)
    # ==========================================================================
    @classmethod
    def generate_feedback(
        cls, req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        identity = generate_candidate_identity(
            language=req.language,
            include_nickname=True,
        )
        p = req.profession_name
        ind = req.industry_key
        readiness = round(random.uniform(76.0, 96.0), 1)

        feedback = FeedbackData(
            candidate_name=identity.full_name,
            interview_context=f"{req.interview_category.replace('_', ' ').title()} - {req.seniority} {p} ({ind.title()})",
            overall_summary=(
                f"{identity.full_name} showcased commendable confidence, thorough grounding in {p} practices, "
                f"and an inspiring growth mindset. The candidate expressed complex ideas cogently, defended technical trade-offs with poise, "
                f"and maintained composure under simulated pressure."
            ),
            strengths=[
                f"Exceptional structural clarity when explaining complex {p} procedures.",
                "Strong executive presence, active listening, and empathetic stakeholder alignment.",
                "Demonstrated emotional resilience, proactive problem-solving, and adherence to professional ethics.",
            ],
            areas_for_improvement=[
                "Incorporate more precise metric-driven outcomes in behavioral examples (e.g., exact financial impact, p99 latency deltas, customer NPS shifts).",
                "Elaborate more deeply on risk mitigation contingency plans before committing to a single technical solution.",
            ],
            actionable_coaching_tips=[
                "Practice using the CAR (Challenge-Action-Result) framework to keep responses focused and under 2.5 minutes.",
                f"Review the latest regulatory and industry standards in {ind} to cite during technical deep-dive interviews.",
                "Prepare 2-3 thoughtful reverse-interview questions directed at the panel's long-term strategic vision.",
            ],
            recommended_learning_resources=[
                f"Advanced Masterclass: Operational Excellence in {p} Practice",
                "Harvard Business Review: Navigating High-Stakes Stakeholder Negotiation",
                f"InterviewX Preparation Suite: {p} Edition & Case Studies",
            ],
            readiness_score=readiness,
            metadata=meta,
        )
        return feedback.model_dump()

    # ==========================================================================
    # Type 7: Scenario-based Dilemma Dataset (Multi-Dimensional)
    # ==========================================================================
    @classmethod
    def generate_scenario(
        cls, req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        scenario_data = get_dynamic_scenario(
            profession_name=req.profession_name,
            industry_key=req.industry_key,
            seniority=req.seniority,
        )

        scenario = ScenarioBasedData(
            scenario_title=scenario_data["scenario_title"],
            scenario_context=scenario_data["scenario_context"],
            problem_statement=scenario_data["problem_statement"],
            conflicting_constraints=scenario_data["conflicting_constraints"],
            ethical_or_professional_dilemma=scenario_data[
                "ethical_or_professional_dilemma"
            ],
            expected_candidate_actions=scenario_data[
                "expected_candidate_actions"
            ],
            rubric_scoring_guide=scenario_data["rubric_scoring_guide"],
            sample_solutions=scenario_data["sample_solutions"],
            metadata=meta,
        )
        return scenario.model_dump()

    # Dispatcher
    @classmethod
    def generate_batch(
        cls, req: UniversalGenerateBatchRequest
    ) -> List[Dict[str, Any]]:
        generators = {
            "profile": cls.generate_profile,
            "resume": cls.generate_resume,
            "interview_question": cls.generate_interview_question,
            "interview_answer": cls.generate_interview_answer,
            "rubric_evaluation": cls.generate_rubric_evaluation,
            "feedback": cls.generate_feedback,
            "scenario": cls.generate_scenario,
        }

        gen_func = generators.get(req.dataset_type.lower())
        if not gen_func:
            raise ValueError(
                f"Unsupported dataset_type '{req.dataset_type}'. Supported: {list(generators.keys())}"
            )

        items = []
        for _ in range(req.batch_size):
            item = gen_func(req)
            items.append(item)
        return items
