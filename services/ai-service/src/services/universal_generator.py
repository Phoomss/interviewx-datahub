import random
import uuid
from datetime import datetime
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

# Realistic Thai and International name banks for high-fidelity synthetic profiles
FIRST_NAMES_EN = [
    "Alex",
    "Jordan",
    "Taylor",
    "Morgan",
    "Sam",
    "Chris",
    "Pat",
    "Robin",
    "Kittipong",
    "Nattaporn",
    "Siriporn",
    "Thanawat",
    "Chayanin",
    "Pimchanok",
    "Warut",
    "Supachai",
    "Apinya",
    "Vorapat",
]
LAST_NAMES_EN = [
    "Smith",
    "Tanaka",
    "Vongpradit",
    "Srisuk",
    "Rattanakorn",
    "Chen",
    "Suwanarat",
    "Kaewmanee",
    "Charoensuk",
    "Williams",
    "Patel",
    "Santipap",
    "Kittisuk",
    "Bunyasit",
]

FIRST_NAMES_TH = [
    "กิตติพงษ์",
    "ณัฐพร",
    "ศิริพร",
    "ธนวัฒน์",
    "ชยานันต์",
    "พิมพ์ชนก",
    "วรุตม์",
    "ศุภชัย",
    "อภิญญา",
    "วรภัทร",
    "ปิยพงษ์",
    "กัญญารัตน์",
]
LAST_NAMES_TH = [
    "วงษ์ประดิษฐ์",
    "ศรีสุข",
    "รัตนากร",
    "สุวรรณรัตน์",
    "แก้วมณี",
    "เจริญสุข",
    "สันติภาพ",
    "กิตติสุข",
    "บุณยสิทธิ์",
    "พัฒนาวิทย์",
]

UNIVERSITIES = [
    {
        "name": "Chulalongkorn University",
        "degree": "Bachelor of Science",
        "degree_th": "จุฬาลงกรณ์มหาวิทยาลัย",
    },
    {
        "name": "Mahidol University",
        "degree": "Bachelor of Science / Medicine",
        "degree_th": "มหาวิทยาลัยมหิดล",
    },
    {
        "name": "Thammasat University",
        "degree": "Bachelor of Arts / Law / Commerce",
        "degree_th": "มหาวิทยาลัยธรรมศาสตร์",
    },
    {
        "name": "Kasetsart University",
        "degree": "Bachelor of Engineering / Agriculture",
        "degree_th": "มหาวิทยาลัยเกษตรศาสตร์",
    },
    {
        "name": "King Mongkut's University of Technology Thonburi",
        "degree": "Bachelor of Engineering",
        "degree_th": "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี",
    },
    {
        "name": "Chiang Mai University",
        "degree": "Bachelor of Science",
        "degree_th": "มหาวิทยาลัยเชียงใหม่",
    },
    {
        "name": "University of Oxford",
        "degree": "Master of Science",
        "degree_th": "มหาวิทยาลัยออกซฟอร์ด",
    },
    {
        "name": "Harvard University",
        "degree": "Master of Public Policy / Science",
        "degree_th": "มหาวิทยาลัยฮาร์วาร์ด",
    },
    {
        "name": "National University of Singapore",
        "degree": "Master of Computing / Management",
        "degree_th": "มหาวิทยาลัยแห่งชาติสิงคโปร์",
    },
]

CITIES = [
    "Bangkok, Thailand",
    "Chiang Mai, Thailand",
    "Singapore",
    "Tokyo, Japan",
    "London, UK",
    "New York, USA",
    "Sydney, Australia",
]


class UniversalSyntheticGenerator:
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
            ]
        )

    @staticmethod
    def _get_name(language: str = "en"):
        if language == "th":
            fn = random.choice(FIRST_NAMES_TH)
            ln = random.choice(LAST_NAMES_TH)
            return f"{fn} {ln}"
        else:
            fn = random.choice(FIRST_NAMES_EN)
            ln = random.choice(LAST_NAMES_EN)
            return f"{fn} {ln}"

    @staticmethod
    def _build_metadata(req: UniversalGenerateBatchRequest) -> SyntheticMetadata:
        return SyntheticMetadata(
            is_synthetic=True,
            data_source="interviewx-universal-synthetic-engine",
            generation_version="2.0.0",
            generated_at=datetime.utcnow().isoformat(),
            industry=req.industry_key,
            profession=req.profession_name or req.profession_key,
            interview_category=req.interview_category,
            interview_subcategory=req.interview_subcategory,
            seniority_level=req.seniority,
            language=req.language,
            difficulty_level=req.difficulty,
        )

    # ==========================================
    # Type 1: Professional Profile Dataset
    # ==========================================
    @classmethod
    def generate_profile(cls, req: UniversalGenerateBatchRequest) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        full_name = cls._get_name(req.language)
        no_exp = cls._is_no_experience(req.seniority)
        clean_name = full_name.lower().replace(" ", ".")

        skills = (
            req.skills
            if req.skills and len(req.skills) > 0
            else [
                f"{req.profession_name} Domain Practice",
                "Strategic Analysis",
                "Effective Communication",
                "Problem Solving",
            ]
        )

        # Dynamic profession-specific attributes
        prof_fields = {}
        ind_key = req.industry_key.lower()
        if "health" in ind_key:
            prof_fields = {
                "clinical_license_number": f"MD-TH-{random.randint(10000, 99999)}",
                "specialty_board": f"{req.profession_name} Board Certified",
                "hospital_affiliation": "Metropolitan University Hospital",
            }
        elif "legal" in ind_key:
            prof_fields = {
                "bar_association_license": f"BAR-TH-{random.randint(1000, 9999)}",
                "jurisdiction": "Kingdom of Thailand / International Commercial Arbitration",
                "practice_areas": [
                    "Regulatory Compliance",
                    "Dispute Resolution",
                    "Contract Law",
                ],
            }
        elif "educ" in ind_key or "research" in req.interview_category:
            prof_fields = {
                "orcid_id": f"0000-0002-{random.randint(1000, 9999)}-{random.randint(1000, 9999)}",
                "research_interests": [
                    f"Advances in {req.profession_name}",
                    "Evidence-Based Methodology",
                ],
                "google_scholar_citations": random.randint(15, 450),
            }
        elif "tech" in ind_key:
            prof_fields = {
                "github_profile": f"https://github.com/{clean_name}",
                "primary_stack": skills[:4],
                "cloud_certifications": ["AWS Solutions Architect", "GCP Professional"],
            }
        elif "design" in ind_key:
            prof_fields = {
                "portfolio_url": f"https://behance.net/{clean_name}",
                "design_systems": [
                    "Figma",
                    "Design Tokens",
                    "Accessibility (WCAG 2.1)",
                ],
            }
        else:
            prof_fields = {
                "professional_affiliations": [
                    f"Association of {req.profession_name} Professionals"
                ],
                "core_competency_focus": f"Advanced {req.profession_name} Operations",
            }

        uni = random.choice(UNIVERSITIES)
        education = [
            {
                "institution": uni["name"],
                "degree": uni["degree"],
                "field": f"{req.profession_name} Related Studies",
                "graduation_year": 2024 if no_exp else (2020 - random.randint(1, 8)),
                "gpa": round(random.uniform(3.40, 3.98), 2),
            }
        ]

        work_experience = None
        exp_years = 0.0
        if not no_exp:
            exp_years = round(random.uniform(2.5, 9.0), 1)
            work_experience = [
                {
                    "company_or_organization": f"Global {req.profession_name} Group",
                    "role_title": f"{req.seniority} {req.profession_name}",
                    "start_date": "2023-01",
                    "end_date": "Present",
                    "location": random.choice(CITIES),
                    "responsibilities": [
                        f"Led multidisciplinary initiatives in {req.profession_name} operations.",
                        f"Spearheaded process improvements boosting output quality by {random.randint(15, 35)}%.",
                        f"Mentored junior associates and collaborated across cross-functional teams.",
                    ],
                },
                {
                    "company_or_organization": f"Premier {req.industry_key.capitalize()} Solutions",
                    "role_title": f"Associate {req.profession_name}",
                    "start_date": "2020-06",
                    "end_date": "2022-12",
                    "location": "Bangkok, Thailand",
                    "responsibilities": [
                        f"Executed core tasks in {req.profession_name} with strict adherence to industry standards.",
                        f"Analyzed key performance indicators and authored comprehensive reports for leadership.",
                    ],
                },
            ]

        profile = ProfessionalProfileData(
            full_name=full_name,
            headline=f"Dedicated {req.seniority} {req.profession_name} | {req.interview_category.replace('_', ' ').title()}",
            professional_summary=(
                f"Aspiring and ambitious candidate preparing for {req.interview_category.replace('_', ' ')} in {req.profession_name}. "
                f"Possesses strong academic grounding in {skills[0] if skills else 'analytical disciplines'}, proactive initiative, "
                f"and dedicated focus on high-impact excellence."
                if no_exp
                else f"Accomplished {req.seniority} {req.profession_name} with {exp_years} years of demonstrated experience in {req.industry_key}. "
                f"Proven track record in leveraging {', '.join(skills[:3])} to deliver measurable outcomes, strategic leadership, "
                f"and continuous professional advancement."
            ),
            contact_info={
                "email": f"{clean_name}@example.com",
                "phone": f"+66 {random.randint(80, 89)} {random.randint(100, 999)} {random.randint(1000, 9999)}",
                "location": random.choice(CITIES),
                "linkedin": f"https://linkedin.com/in/{clean_name}",
            },
            skills=skills,
            experience_years=exp_years,
            education=education,
            work_experience=work_experience,
            certifications=[
                f"Certified Professional in {req.profession_name}",
                "Strategic Leadership Certificate",
            ],
            languages=["English (Professional Working)", "Thai (Native)"],
            awards=[
                f"Outstanding Achievement in {req.profession_name}",
                "Dean's Honor List",
            ],
            publications_or_research=[
                f"Contemporary Perspectives in {req.profession_name} (2024)"
            ]
            if not no_exp or "academic" in req.interview_category
            else [],
            volunteer_or_extracurricular=[
                "Community Mentorship Program",
                "Annual Industry Forum Volunteer",
            ],
            profession_specific_fields=prof_fields,
            metadata=meta,
        )
        return profile.model_dump()

    # ==========================================
    # Type 2: Resume / CV Dataset
    # ==========================================
    @classmethod
    def generate_resume(cls, req: UniversalGenerateBatchRequest) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        full_name = cls._get_name(req.language)
        no_exp = cls._is_no_experience(req.seniority)
        skills = (
            req.skills
            if req.skills and len(req.skills) > 0
            else [
                "Analytical Thinking",
                "Strategic Planning",
                "Project Management",
                "Technical Execution",
            ]
        )

        uni = random.choice(UNIVERSITIES)
        education_history = [
            {
                "institution": uni["name"],
                "degree": f"Bachelor of {req.profession_name} Studies",
                "honors": "First Class Honors (GPA 3.85)",
                "period": "2020 - 2024" if no_exp else "2016 - 2020",
                "relevant_coursework": [
                    f"Advanced {req.profession_name}",
                    "Quantitative Methods",
                    "Professional Ethics",
                ],
            }
        ]

        work_history = (
            None
            if no_exp
            else [
                {
                    "organization": f"Apex {req.industry_key.capitalize()} Corp",
                    "position": f"{req.seniority} {req.profession_name}",
                    "period": "2021 - Present",
                    "bullet_points": [
                        f"Orchestrated cross-functional operational deliverables across {req.industry_key} workflows.",
                        f"Reduced delivery turnaround time by 30% through disciplined application of {skills[0]}.",
                        f"Supervised team members and authored strategic roadmap documentation for executive stakeholders.",
                    ],
                }
            ]
        )

        projects = [
            {
                "title": f"Capstone Initiative in {req.profession_name}",
                "role": "Lead Researcher / Project Owner",
                "description": f"Engineered and evaluated a comprehensive model solving key efficiency bottlenecks in {req.industry_key}.",
                "technologies_or_tools": skills[:3],
                "impact_metric": "Recognized with Highest Distinction; cited in departmental showcase.",
            }
        ]

        skills_breakdown = {
            "Core Profession Skills": skills[:4],
            "Tools & Methodologies": [
                "Project Management",
                "Data Analytics",
                "Office Suite",
                "Collaborative Platforms",
            ],
            "Soft & Interpersonal Skills": [
                "Conflict Resolution",
                "Public Speaking",
                "Adaptability",
                "Critical Thinking",
            ],
            "Languages": ["English (Fluent)", "Thai (Native)"],
        }

        resume = ResumeCVData(
            profile_summary=(
                f"Results-oriented {req.profession_name} candidate with deep commitment to excellence in {req.interview_category.replace('_', ' ')}. "
                f"Equipped with comprehensive academic foundation and exceptional problem-solving capacity."
            ),
            personal_info={
                "candidate_name": full_name,
                "email": f"{full_name.lower().replace(' ', '.')}@example.com",
                "city": random.choice(CITIES),
            },
            education_history=education_history,
            skills_breakdown=skills_breakdown,
            work_history=work_history,
            projects_or_initiatives=projects,
            certifications_and_licenses=[
                f"Accredited {req.profession_name} Practitioner (Level 2)"
            ],
            publications_and_patents=[
                f"Case Study: Modern Innovations in {req.profession_name} (2024)"
            ]
            if "academic" in req.interview_category
            or "research" in req.interview_category
            else [],
            honors_awards=[
                "Excellence in Academic Research",
                "National Competition Finalist",
            ],
            profession_specific_highlights={
                "target_focus": req.profession_name,
                "domain_industry": req.industry_key,
                "interview_stream": req.interview_category,
            },
            metadata=meta,
        )
        return resume.model_dump()

    # ==========================================
    # Type 3: Interview Question Dataset
    # ==========================================
    @classmethod
    def generate_interview_question(
        cls, req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        p_name = req.profession_name
        cat = req.interview_category.lower()

        # Dynamic question curation based on interview category
        if "academic" in cat or "scholarship" in cat:
            q_en = f"What core academic motivation drives your interest in this {p_name} program, and how will your proposed study contribute to your home country or field?"
            q_th = f"อะไรคือแรงบันดาลใจทางวิชาการสำคัญในการสมัครเข้าศึกษาในสาขา {p_name} และคุณมีแผนนำความรู้ไปสร้างประโยชน์ต่อสังคมหรือประเทศชาติอย่างไร?"
            intent = "Evaluates candidate's academic vision, intellectual maturity, and commitment to long-term impact."
            competencies = [
                "Academic Motivation",
                "Long-term Vision",
                "Intellectual Rigor",
                "Cultural Alignment",
            ]
            points = [
                "Clear articulation of research/study objectives",
                "Realistic plan for societal or academic contribution",
                "Demonstrated familiarity with institution faculty and curriculum",
            ]
            red_flags = [
                "Superficial or purely prestige-seeking motives",
                "Lack of knowledge about curriculum requirements",
                "Vague plans post-graduation",
            ]
            follow_ups = [
                "Can you elaborate on a specific professor or course that shaped your decision?",
                "How would you handle significant academic setbacks or isolation abroad?",
            ]
        elif "research" in cat:
            q_en = f"How do you address potential methodological limitations or confounding variables in your investigation into {p_name} systems?"
            q_th = f"คุณมีแนวทางในการจัดการกับข้อจำกัดทางระเบียบวิธีวิจัยและตัวแปรกวนในการศึกษาด้าน {p_name} อย่างไร?"
            intent = "Tests scientific rigor, critical defense capability, and understanding of experimental validity."
            competencies = [
                "Research Methodology",
                "Critical Thinking",
                "Scientific Defense",
                "Statistical Validity",
            ]
            points = [
                "Thorough identification of biases",
                "Appropriate statistical control methods",
                "Defensible rationale for chosen tools",
            ]
            red_flags = [
                "Denial that limitations exist",
                "Over-promising unverified hypotheses",
                "Inability to explain data collection protocols",
            ]
            follow_ups = [
                "If your primary hypothesis is invalidated by initial empirical data, what is your contingency framework?"
            ]
        elif "career_dev" in cat:
            q_en = f"As a candidate for higher leadership in {p_name}, how have you systematically developed capability in your subordinates while maintaining high team performance?"
            q_th = f"ในฐานะผู้สมัครรับการพิจารณาเลื่อนขั้นเป็นผู้นำด้าน {p_name} คุณมีแนวทางเชิงระบบอย่างไรในการพัฒนาศักยภาพผู้ใต้บังคับบัญชาควบคู่กับการรักษาผลงานทีม?"
            intent = "Assesses people leadership, coaching acumen, emotional intelligence, and delegation skills."
            competencies = [
                "People Development",
                "Coaching & Mentoring",
                "Delegation",
                "Strategic Leadership",
            ]
            points = [
                "Evidence of personalized coaching",
                "Balancing accountability with psychological safety",
                "Measurable advancement of team members",
            ]
            red_flags = [
                "Micromanagement tendencies",
                "Taking credit exclusively for team outputs",
                "Absence of structured succession planning",
            ]
            follow_ups = [
                "Describe a situation where a direct report consistently underperformed despite repeated coaching. What action did you take?"
            ]
        else:  # Job & General
            q_en = f"Describe a situation in your role as a {p_name} where you encountered conflicting stakeholder priorities. How did you negotiate consensus and deliver results?"
            q_th = f"ช่วยเล่าสถานการณ์ในบทบาท {p_name} ที่คุณพบกับความต้องการที่ขัดแย้งกันของผู้มีส่วนได้ส่วนเสีย คุณเจรจาเพื่อหาข้อสรุปและส่งมอบงานให้สำเร็จได้อย่างไร?"
            intent = "Evaluates conflict resolution, negotiation under pressure, stakeholder alignment, and practical delivery."
            competencies = [
                "Stakeholder Management",
                "Negotiation",
                "Prioritization",
                "Communication",
            ]
            points = [
                "Clear framing of conflicting interests",
                "Evidence-based negotiation strategy",
                "Positive long-term relationship preservation",
            ]
            red_flags = [
                "Conceding without strategic justification",
                "Blaming stakeholders for difficult deadlines",
                "Unwillingness to compromise",
            ]
            follow_ups = [
                "What metrics or criteria did you use to justify prioritizing one stakeholder over another?"
            ]

        q_obj = InterviewQuestionData(
            question=q_en if req.language != "th" else q_th,
            question_th=q_th,
            category=req.interview_category.replace("_", " ").title(),
            difficulty=req.difficulty,
            intent_and_objective=intent,
            competencies_evaluated=competencies,
            key_points_to_look_for=points,
            red_flags=red_flags,
            sample_follow_ups=follow_ups,
            metadata=meta,
        )
        return q_obj.model_dump()

    # ==========================================
    # Type 4: Interview Answer Dataset
    # ==========================================
    @classmethod
    def generate_interview_answer(
        cls, req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        qualities = ["Excellent", "Good", "Average", "Poor", "Incomplete", "Irrelevant"]
        chosen_quality = (
            req.custom_parameters.get("answer_quality")
            if req.custom_parameters and "answer_quality" in req.custom_parameters
            else random.choice(qualities)
        )

        p = req.profession_name
        question_text = f"How do you approach critical challenges and strategic decision-making in your role as a {p}?"

        answers_map = {
            "Excellent": {
                "text": f"In my recent project as a {p}, we faced a sudden 40% change in operational requirements two weeks before delivery. Using the STAR framework: Situation: Our team was at risk of a critical deadline breach. Task: I took ownership of reassessing the scope and re-aligning our core deliverables. Action: I facilitated a rapid stakeholder workshop, mapped out non-negotiable requirements, and redistributed workload based on team strengths. Result: We delivered the core release on schedule with zero defect leakage and improved client trust scores by 25%.",
                "text_th": f"ในโครงการล่าสุดของผมในตำแหน่ง {p} เราเผชิญกับการปรับเปลี่ยนความต้องการอย่างกะทันหันก่อนกำหนดส่งมอบ 2 สัปดาห์ โดยใช้โมเดล STAR: สถานการณ์คือทีมเสี่ยงต่อการส่งมอบไม่ทัน ภารกิจคือผมรับหน้าที่จัดลำดับความสำคัญใหม่ การปฏิบัติคือผมจัดประชุมเชิงปฏิบัติการร่วมกับผู้มีส่วนได้ส่วนเสีย และจัดสรรงานตามความเชี่ยวชาญ ผลลัพธ์คือเราส่งมอบได้ตรงเวลาโดยไม่มีข้อผิดพลาด และเพิ่มความพึงพอใจของลูกค้าขึ้น 25%",
                "strengths": [
                    "Clear STAR structure",
                    "Quantifiable metrics (40%, 25%)",
                    "Proactive accountability",
                    "Stakeholder empathy",
                ],
                "weaknesses": ["None notable; highly structured and persuasive"],
                "sentiment": "Strongly Impressed - Top Tier Candidate",
            },
            "Good": {
                "text": f"When faced with difficult decisions in {p} workflows, I always consult our standard operating guidelines and gather quantitative evidence first. For example, during a system transition last quarter, I analyzed the historical trend data, presented options to my supervisor, and coordinated with the team to implement the chosen route smoothly.",
                "text_th": f"เวลาที่ผมต้องตัดสินใจเรื่องยากในการทำงานด้าน {p} ผมจะยึดหลักเกณฑ์มาตรฐานและรวบรวมข้อมูลเชิงปริมาณก่อนเสมอ เช่น เมื่อไตรมาสก่อนระหว่างการปรับเปลี่ยนระบบ ผมวิเคราะห์ข้อมูลย้อนหลัง นำเสนอทางเลือกให้หัวหน้า และร่วมมือกับทีมจนดำเนินงานได้ราบรื่น",
                "strengths": [
                    "Logical thinking",
                    "Data-driven approach",
                    "Team collaboration",
                ],
                "weaknesses": [
                    "Could have included more specific measurable impact metrics"
                ],
                "sentiment": "Positive - Meets All Expectations",
            },
            "Average": {
                "text": f"Normally when a challenge arises in {p}, I just do my best to solve it by working overtime and discussing with colleagues. Most problems can be handled if people communicate better.",
                "text_th": f"โดยปกติเวลาเจอปัญหาในงาน {p} ผมก็จะพยายามทำให้ดีที่สุดโดยอยู่ทำงานล่วงเวลาและปรึกษาเพื่อนร่วมงาน ปัญหาส่วนใหญ่จะแก้ไขได้ถ้าทุกคนสื่อสารกันดีๆ ครับ",
                "strengths": ["Willingness to work hard", "Friendly attitude"],
                "weaknesses": [
                    "Lacks structured methodology",
                    "No concrete examples",
                    "Passive phrasing",
                ],
                "sentiment": "Borderline - Requires Probing",
            },
            "Poor": {
                "text": f"Honestly, problems only happen in {p} because management doesn't give clear instructions or enough resources. When that happens, there isn't much anyone can do except wait for them to fix it.",
                "text_th": f"เอาจริงๆ ปัญหาในงาน {p} เกิดขึ้นเพราะฝ่ายบริหารไม่ให้คำสั่งที่ชัดเจนหรือทรัพยากรไม่พอ พอเป็นแบบนั้นใครก็ทำอะไรไม่ได้นอกจากรอให้ข้างบนแก้ไขครับ",
                "strengths": ["None"],
                "weaknesses": [
                    "Deflects accountability",
                    "Blames leadership",
                    "Cynical disposition",
                    "Lack of initiative",
                ],
                "sentiment": "Negative - Serious Cultural & Professional Mismatch",
            },
            "Incomplete": {
                "text": f"At my previous position, we had a major emergency where our {p} operations were halted because of an unexpected third-party outage. I immediately logged into the dashboard to check the logs and called the external vendor...",
                "text_th": f"ที่ทำงานเดิม เราเคยเจอกรณีฉุกเฉินที่การทำงานด้าน {p} ต้องหยุดชะงักเพราะระบบผู้ให้บริการภายนอกขัดข้อง ผมก็รีบเข้าไประบบเพื่อตรวจดูบันทึกและโทรหาเวนเดอร์ทันที...",
                "strengths": ["Good start explaining context"],
                "weaknesses": [
                    "Truncated answer",
                    "Failed to explain the actions taken and results achieved",
                    "Did not complete STAR structure",
                ],
                "sentiment": "Inconclusive - Candidate trailed off without concluding",
            },
            "Irrelevant": {
                "text": f"That reminds me of when I was studying in high school and won a chess tournament. Playing chess really teaches you how to think several steps ahead and stay patient.",
                "text_th": f"เรื่องนี้ทำให้นึกถึงตอนเรียนมัธยมแล้วชนะการแข่งขันหมากรุกครับ การเล่นหมากรุกสอนให้คิดล่วงหน้าและมีความอดทนสูงมาก",
                "strengths": ["Shows hobby enthusiasm"],
                "weaknesses": [
                    "Completely off-topic",
                    "Failed to address the profession or situational context",
                ],
                "sentiment": "Rejection - Inability to comprehend or answer core prompt",
            },
        }

        chosen_data = answers_map.get(chosen_quality, answers_map["Good"])

        ans = InterviewAnswerData(
            question=question_text,
            candidate_level=req.seniority,
            answer_quality=chosen_quality,
            answer_text=chosen_data["text"]
            if req.language != "th"
            else chosen_data["text_th"],
            answer_text_th=chosen_data["text_th"],
            structure_framework_used="STAR"
            if chosen_quality in ["Excellent", "Good"]
            else "Unstructured",
            key_strengths=chosen_data["strengths"],
            weaknesses_or_gaps=chosen_data["weaknesses"],
            interviewer_sentiment=chosen_data["sentiment"],
            metadata=meta,
        )
        return ans.model_dump()

    # ==========================================
    # Type 5: Rubric Evaluation Dataset
    # ==========================================
    @classmethod
    def generate_rubric_evaluation(
        cls, req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        p = req.profession_name

        dimensions = [
            {
                "dimension": "Domain Expertise & Technical Competence",
                "max_score": 25.0,
                "awarded_score": round(random.uniform(18.0, 24.5), 1),
                "rationale": f"Demonstrated sound understanding of core {p} principles and real-world execution standards.",
                "evidence_quote": f"Cited practical protocols and accurate industry terminology for {p}.",
            },
            {
                "dimension": "Problem Solving & Analytical Rigor",
                "max_score": 25.0,
                "awarded_score": round(random.uniform(17.0, 23.5), 1),
                "rationale": "Applied systematic root cause analysis rather than superficial symptom treatment.",
                "evidence_quote": "Structured problem breakdown using quantifiable indicators.",
            },
            {
                "dimension": "Communication & Structural Clarity",
                "max_score": 25.0,
                "awarded_score": round(random.uniform(19.0, 25.0), 1),
                "rationale": "High clarity, concise articulation, disciplined adherence to STAR methodology.",
                "evidence_quote": "Delivered narrative with executive summary followed by chronological evidence.",
            },
            {
                "dimension": "Values, Ethics & Collaboration",
                "max_score": 25.0,
                "awarded_score": round(random.uniform(18.5, 24.0), 1),
                "rationale": "Strong moral compass, psychological safety advocacy, and constructive teamwork attitude.",
                "evidence_quote": "Acknowledged team contributions and highlighted ethical boundary compliance.",
            },
        ]

        total = sum(d["awarded_score"] for d in dimensions)
        max_possible = 100.0
        pct = round((total / max_possible) * 100.0, 1)

        if pct >= 85.0:
            verdict = "Strong Pass"
            recommendation = f"Highly Recommended for admission / hiring in {p} role."
        elif pct >= 70.0:
            verdict = "Pass"
            recommendation = f"Recommended; meets standard threshold for {p}."
        elif pct >= 55.0:
            verdict = "Borderline"
            recommendation = "Conditional pass pending secondary evaluation or targeted technical assessment."
        else:
            verdict = "Fail"
            recommendation = (
                "Not recommended at this time; substantial capability gaps observed."
            )

        rubric = RubricEvaluationData(
            question_context=f"Comprehensive evaluation for {req.seniority} {p} in {req.interview_category.replace('_', ' ')} context.",
            candidate_response_sample="Candidate demonstrated comprehensive situational response with clear STAR milestones.",
            evaluation_dimensions=dimensions,
            total_score=total,
            max_possible_score=max_possible,
            percentage=pct,
            overall_verdict=verdict,
            hiring_or_admission_recommendation=recommendation,
            metadata=meta,
        )
        return rubric.model_dump()

    # ==========================================
    # Type 6: Feedback Dataset
    # ==========================================
    @classmethod
    def generate_feedback(cls, req: UniversalGenerateBatchRequest) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        name = cls._get_name(req.language)
        p = req.profession_name
        readiness = round(random.uniform(72.0, 95.0), 1)

        feedback = FeedbackData(
            candidate_name=name,
            interview_context=f"{req.interview_category.replace('_', ' ').title()} - {req.seniority} {p}",
            overall_summary=(
                f"{name} showcased commendable confidence, thorough grounding in {p} practices, "
                f"and an inspiring growth mindset. The candidate expressed ideas cogently and maintained composure under simulated pressure."
            ),
            strengths=[
                f"Exceptional clarity when explaining complex {p} procedures.",
                "Strong executive presence and active listening skills.",
                "Demonstrated emotional resilience and proactive problem-solving mindset.",
            ],
            areas_for_improvement=[
                "Incorporate more precise metric-driven outcomes in behavioral examples (e.g., percentages, financial savings, time to resolution).",
                "Elaborate more deeply on risk mitigation contingency plans before committing to action.",
            ],
            actionable_coaching_tips=[
                "Practice using the CAR (Challenge-Action-Result) formula to keep answers under 2.5 minutes.",
                "Review the latest regulatory and industry standards in your domain to cite during technical interviews.",
                "Prepare 2-3 thoughtful reverse-interview questions directed at the panel's long-term strategic vision.",
            ],
            recommended_learning_resources=[
                f"Advanced Masterclass: Excellence in {p} Practice",
                "Harvard Business Review: Navigating High-Stakes Negotiation",
                f"InterviewX Preparation Suite: {p} Edition",
            ],
            readiness_score=readiness,
            metadata=meta,
        )
        return feedback.model_dump()

    # ==========================================
    # Type 7: Scenario-based Dataset
    # ==========================================
    @classmethod
    def generate_scenario(cls, req: UniversalGenerateBatchRequest) -> Dict[str, Any]:
        meta = cls._build_metadata(req)
        p = req.profession_name
        ind = req.industry_key

        scenario = ScenarioBasedData(
            scenario_title=f"Crisis Management and Ethical Balance in {p} Operations",
            scenario_context=(
                f"You are the {req.seniority} {p} at a leading {ind} enterprise. A critical defect in an upcoming product release "
                f"or operational deliverable has been identified by your team 48 hours before public launch. "
                f"Marketing has already committed to clients, and commercial leadership urges you to sign off immediately."
            ),
            problem_statement=(
                f"How do you balance commercial pressure with safety, compliance, and professional standards in {p}? "
                f"What concrete steps do you take to communicate risks, protect institutional integrity, and resolve the defect?"
            ),
            conflicting_constraints=[
                "Severe time pressure (48 hours until commercial deadline)",
                "Commercial stakeholders threatening revenue penalties",
                "Strict regulatory compliance and ethical duty to end-users",
                "Team burnout and elevated emotional stress",
            ],
            ethical_or_professional_dilemma=(
                f"Signing off avoids short-term commercial conflict but violates core professional ethics in {p} and risks catastrophic liability. "
                f"Refusing sign-off triggers acute executive tension and immediate launch postponement."
            ),
            expected_candidate_actions=[
                "Halt premature deployment while initiating an urgent technical root-cause triage.",
                "Quantify risk likelihood and impact with empirical data to present to executive leadership.",
                "Offer viable contingency paths (e.g. staged rollout, hotfix release, feature flag toggle).",
                "Maintain professional composure, ethical fortitude, and clear transparent documentation.",
            ],
            rubric_scoring_guide={
                "Level 1 (Unacceptable)": "Capitulates to commercial pressure without investigating risk, or reacts confrontational without proposing solutions.",
                "Level 2 (Basic)": "Identifies the ethical dilemma but lacks tactical ideas for resolving the technical roadblock.",
                "Level 3 (Competent)": "Refuses improper sign-off, presents clear empirical risk analysis, and proposes structured postponement or phased release.",
                "Level 4 (Exemplary)": "Exhibits inspirational executive leadership: calms stakeholders, convenes cross-functional SWAT team, deploys rapid workaround, and establishes preventative QA safeguards for future releases.",
            },
            sample_solutions={
                "Best Practice Approach": "Convene immediate emergency review with facts and figures; present three prioritized risk-mitigated options; uphold professional integrity while actively collaborating on rapid resolution.",
                "Common Pitfalls to Avoid": "Signing off under duress; leaking panic to clients; blaming subordinates or external vendors; stonewalling without communicative empathy.",
            },
            metadata=meta,
        )
        return scenario.model_dump()

    # Dispatcher
    @classmethod
    def generate_batch(cls, req: UniversalGenerateBatchRequest) -> List[Dict[str, Any]]:
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
