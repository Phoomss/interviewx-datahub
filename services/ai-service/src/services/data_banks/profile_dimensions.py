"""Multi-Dimensional Persona Archetypes, Certifications, Awards, and Projects Bank.

Enhances synthetic profiles and resumes with rich professional textures,
avoiding repetitive clichés and reflecting real-world career trajectories.
"""

import random
from typing import Any, Dict, List, Optional

# ==============================================================================
# 1. PERSONA ARCHETYPES
# ==============================================================================

PERSONA_ARCHETYPES = [
    {
        "key": "fast_track_lead",
        "name": "Fast-Track High Performer & Team Lead",
        "summary_tone": (
            "Results-driven leader with exceptional trajectory in executing complex transformations, "
            "optimizing throughput, and mentoring high-velocity multidisciplinary teams."
        ),
        "impact_multiplier": 1.25,
        "leadership_focus": True,
    },
    {
        "key": "academic_scholar",
        "name": "Academic Researcher & Methodological Scholar",
        "summary_tone": (
            "Intellectually rigorous specialist with dual focus on theoretical depth and empirical evidence, "
            "proven publication record, and dedication to ethical rigor."
        ),
        "impact_multiplier": 1.0,
        "academic_focus": True,
    },
    {
        "key": "hands_on_specialist",
        "name": "Deep Domain Practitioner & Problem Solver",
        "summary_tone": (
            "Pragmatic, technically astute expert recognized for solving mission-critical operational bottlenecks, "
            "architectural robustness, and zero-defect execution."
        ),
        "impact_multiplier": 1.15,
        "technical_depth": True,
    },
    {
        "key": "career_switcher",
        "name": "Adaptive Cross-Disciplinary Career Transitioner",
        "summary_tone": (
            "Dynamic professional who successfully synthesized analytical foundations from adjacent disciplines "
            "into cutting-edge domain execution, bringing diverse problem-solving angles."
        ),
        "impact_multiplier": 1.05,
        "adaptability_focus": True,
    },
    {
        "key": "global_returning_scholar",
        "name": "Global Returnee & Regional Strategic Lead",
        "summary_tone": (
            "International graduate combining global best practices with nuanced Southeast Asian market execution, "
            "cross-border stakeholder alignment, and bilingual executive communication."
        ),
        "impact_multiplier": 1.20,
        "bilingual_focus": True,
    },
]


# ==============================================================================
# 2. INDUSTRY-SPECIFIC CERTIFICATIONS & LICENSES
# ==============================================================================

CERTIFICATIONS_BY_INDUSTRY: Dict[str, List[str]] = {
    "tech": [
        "AWS Certified Solutions Architect - Professional",
        "Certified Kubernetes Administrator (CKA - CNCF)",
        "Google Cloud Certified Professional Cloud Architect",
        "Terraform Associate 003 (HashiCorp Certified)",
        "Certified Information Systems Security Professional (CISSP)",
        "Offensive Security Certified Professional (OSCP)",
        "Certified ScrumMaster (CSM - Scrum Alliance)",
        "Databricks Certified Data Engineer Professional",
        "Microsoft Certified: Azure AI Engineer Associate",
        "DeepLearning.AI Generative AI for Developers Specialization",
    ],
    "healthcare": [
        "Medical License (แพทยสภา - The Medical Council of Thailand)",
        "Specialty Board Certification in Clinical Practice (วุฒิบัตรแสดงความรู้ความชำนาญ)",
        "Advanced Cardiovascular Life Support (ACLS - American Heart Association)",
        "Good Clinical Practice (GCP - ICH-GCP Certification for Clinical Research)",
        "Certified Professional in Healthcare Quality (CPHQ)",
        "Infection Prevention and Control Board Certification (CIC)",
        "Advanced Trauma Life Support (ATLS - American College of Surgeons)",
    ],
    "finance": [
        "Certified Public Accountant (CPA Thailand - สภาวิชาชีพบัญชี)",
        "Chartered Financial Analyst (CFA) Charterholder / Level III Passed",
        "Financial Risk Manager (FRM - Global Association of Risk Professionals)",
        "Certified Information Systems Auditor (CISA - ISACA)",
        "Securities & Derivatives Investment License (IC Complex P1/P2/P3 - SEC Thailand)",
        "Chartered Alternative Investment Analyst (CAIA)",
        "TFRS 9 and IFRS 16 Implementation Specialist Credential",
    ],
    "legal": [
        "Bar Association License (เนติบัณฑิตไทย - Thai Bar Association under Royal Patronage)",
        "Lawyer License (ใบอนุญาตให้เป็นทนายความ - Lawyers Council of Thailand)",
        "Notarial Services Attorney Qualification Certificate",
        "Certified Data Protection Officer (CDPO - PDPA Thailand Compliance)",
        "Fellow of the Chartered Institute of Arbitrators (FCIArb)",
        "WIPO Intellectual Property Master Certificate",
        "International Commercial Contracts & Anti-Trust Specialist Credential",
    ],
    "engineering": [
        "Licensed Professional Engineer (ใบอนุญาตประกอบวิชาชีพวิศวกรรมควบคุม - กว. สภาวิศวกร)",
        "Certified Industrial Automation Professional (CIAP)",
        "Project Management Professional (PMP - Project Management Institute)",
        "Six Sigma Black Belt Certification (IASSC Certified)",
        "Certified Energy Manager (CEM - Association of Energy Engineers)",
        "LEED Accredited Professional (LEED AP BD+C)",
        "SolidWorks Certified Professional (CSWP)",
    ],
    "business": [
        "Project Management Professional (PMP - PMI)",
        "Certified Supply Chain Professional (CSCP - APICS)",
        "Strategic Human Resources Business Partner (sHRBP - HCI)",
        "Lean Six Sigma Green Belt Certified",
        "Google Digital Marketing & Analytics Professional Certificate",
        "Certified Change Management Professional (CCMP - ACMP)",
        "Executive Leadership & Corporate Negotiation (Wharton Online / Harvard ExecEd)",
    ],
    "education": [
        "Teacher Professional License (ใบประกอบวิชาชีพครู - คุรุสภา)",
        "Higher Education Teaching Certificate (HEA Fellowship / UKPSF Fellow)",
        "Certified Instructional Designer (ATD Instructional Design Master)",
        "Google for Education Certified Innovator",
        "Certificate in Advanced Qualitative & Quantitative Research Methodologies",
    ],
    "creative": [
        "Nielsen Norman Group UX Master Certified (NN/g UXMC)",
        "Adobe Certified Expert (ACE - Premiere Pro & After Effects)",
        "Certified Accessibility Specialist (WCAG 2.1 & Section 508 - IAAP)",
        "Design Thinking Facilitator Certificate (IDEO U)",
        "Brand Strategy Masterclass Certificate (Marty Neumeier Level C)",
    ],
}


# ==============================================================================
# 3. INDUSTRY-SPECIFIC AWARDS & HONORS
# ==============================================================================

AWARDS_BY_INDUSTRY: Dict[str, List[str]] = {
    "tech": [
        "National Software Innovation Award (Top 3 Finalist)",
        "Regional Hackathon Grand Prize Winner (ASEAN FinTech Sprint)",
        "Outstanding Cloud Architecture Contribution Award",
        "Open Source Community Star Contributor",
        "Dean's List for Academic and Engineering Excellence",
    ],
    "healthcare": [
        "Distinguished Clinical Resident Award (Metropolitan Hospital)",
        "Excellence in Medical Research & Clinical Audit (National Medical Forum)",
        "Compassionate Caregiver & Patient Safety Honor",
        "First Prize: National Clinical Case Study Competition",
    ],
    "finance": [
        "Outstanding Equity Research Report of the Year (Securities Analysts Assoc.)",
        "Corporate Deal of the Year - Strategic Debt Restructuring Recognition",
        "CFA Institute Research Challenge Regional Winner",
        "Top Performer in Statutory Audit Quality & Governance Review",
    ],
    "legal": [
        "Best Oralist - Southeast Asia Moot Court Competition",
        "Pro Bono Legal Excellence Commendation (Lawyers Council of Thailand)",
        "Distinguished Thesis in Comparative International Arbitration Law",
        "Dean's Award for Excellence in Public Law and Jurisprudence",
    ],
    "engineering": [
        "National Engineering Innovation Award (Council of Engineers)",
        "Plant Safety & Zero Incident Leadership Excellence Award",
        "Energy Efficiency & Green Factory Optimization Trophy",
        "Outstanding Capstone Design in Sustainable Infrastructure",
    ],
    "business": [
        "ASEAN Business Case Competition Gold Medal",
        "President's Award for Strategic Commercial Turnaround",
        "Young Executive Leadership Award (Thailand Management Association)",
        "Brand Campaign of the Year - Digital Transformation Category",
    ],
    "education": [
        "Exemplary Educator Award (National Higher Education Commission)",
        "Best Educational Technology Research Paper (ICER Conference)",
        "Outstanding Faculty Advisor of the Year",
    ],
    "creative": [
        "Bangkok Art Directors Club (B.A.D. Awards) Silver Trophy",
        "Red Dot Award: Brands & Communication Design Winner",
        "Best User Interface Experience - Digital Design Awards Thailand",
    ],
}


# ==============================================================================
# 4. INDUSTRY-SPECIFIC PROJECTS & CASE STUDIES
# ==============================================================================

def get_realistic_project(profession_name: str, industry_key: str, skills: List[str]) -> Dict[str, Any]:
    """Generates a rich, quantifiable project showcase with measurable impact."""
    ind = industry_key.lower()
    p = profession_name

    used_skills = skills[:3] if skills else ["Analytical Modeling", "Strategic Execution", "Project Leadership"]
    skills_str = ", ".join(used_skills)

    if "tech" in ind:
        return {
            "title": f"Next-Generation Resilient Architecture for {p} Workflows",
            "role": f"Technical Lead / Principal Architect",
            "description": (
                f"Led end-to-end design and deployment of distributed microservices utilizing {skills_str}. "
                f"De-coupled legacy monoliths into high-throughput event-driven streams, implemented observability dashboards, "
                f"and enforced automated canary deployment gates."
            ),
            "technologies_or_tools": used_skills + ["Docker", "Kubernetes", "Prometheus"],
            "impact_metric": (
                f"Reduced p99 system latency by {random.randint(35, 60)}%, eliminated downtime during peak promotional events, "
                f"and trimmed cloud compute expenditure by {random.randint(20, 38)}% annually."
            ),
        }
    elif "health" in ind:
        return {
            "title": f"Quality Improvement & Patient Outcome Protocol in {p}",
            "role": "Lead Clinical Researcher / Department Co-chair",
            "description": (
                f"Designed and institutionalized a comprehensive clinical audit and triage intervention protocol. "
                f"Coordinated cross-disciplinary rounds between specialist physicians, nursing managers, and medical informatics teams "
                f"utilizing {skills_str}."
            ),
            "technologies_or_tools": used_skills + ["Hospital Information System (HIS)", "Statistical SPSS", "Clinical Guidelines"],
            "impact_metric": (
                f"Shortened median door-to-treatment time by {random.randint(25, 45)} minutes and improved patient satisfaction index from 78% to 94.5%."
            ),
        }
    elif "fin" in ind:
        return {
            "title": f"Capital Optimization & Multi-Entity Financial Governance",
            "role": "Senior Financial Strategist / Lead Auditor",
            "description": (
                f"Spearheaded comprehensive audit automation and capital adequacy stress-testing frameworks. "
                f"Integrated predictive cash flow forecasts and regulatory compliance checkpoints applying {skills_str}."
            ),
            "technologies_or_tools": used_skills + ["SAP ERP", "Power BI", "SQL Financial Models"],
            "impact_metric": (
                f"Identified {random.randint(15, 45)}M THB in operational tax efficiencies and accelerated month-end financial closing cycle from 10 to 4 business days."
            ),
        }
    elif "legal" in ind:
        return {
            "title": f"Cross-Border Commercial Negotiation & Regulatory Compliance Audit",
            "role": "Senior Legal Counsel / Arbitration Specialist",
            "description": (
                f"Drafted master services agreements and risk mitigation frameworks for major commercial stakeholders. "
                f"Managed multi-jurisdictional compliance reviews ensuring full adherence to PDPA and international commercial arbitration rules."
            ),
            "technologies_or_tools": used_skills + ["Legal Research Repositories", "Clause Libraries", "Compliance Matrices"],
            "impact_metric": (
                f"Successfully protected enterprise against potential liabilities exceeding {random.randint(50, 200)}M THB with 100% regulatory sign-off."
            ),
        }
    else:
        return {
            "title": f"Enterprise Operational Transformation in {p}",
            "role": "Project Owner / Cross-Functional Lead",
            "description": (
                f"Formulated and executed strategic operational initiatives in {ind}. "
                f"Conducted rigorous stakeholder alignment, root cause diagnostics, and process standardization using {skills_str}."
            ),
            "technologies_or_tools": used_skills + ["Jira", "Process Flow Automation", "Executive Dashboards"],
            "impact_metric": (
                f"Boosted operational throughput by {random.randint(22, 45)}% while elevating customer Net Promoter Score (NPS) by 28 points."
            ),
        }


# ==============================================================================
# 5. LANGUAGE FLUENCY PROFILES
# ==============================================================================

def get_language_proficiencies(language_mode: str = "en", origin: str = "Thai") -> List[str]:
    """Generates realistic CEFR/fluency language profiles."""
    if language_mode == "th":
        return [
            "Thai (Native - ภาษาไทยเจ้าของภาษา)",
            "English (Professional Working Proficiency - CEFR B2/C1 / TOEIC 850+)",
        ]
    elif language_mode == "mixed":
        langs = [
            "Thai (Native / Bilingual Fluency)",
            "English (Full Professional Proficiency - CEFR C1/C2 / IELTS 8.0)",
        ]
        if random.random() < 0.35:
            langs.append(random.choice([
                "Mandarin Chinese (Conversational - HSK Level 4)",
                "Japanese (Working Proficiency - JLPT N2/N3)",
                "French (Basic Professional - CEFR B1)",
            ]))
        return langs
    else:
        # English / International mode
        if "Western" in origin:
            return [
                "English (Native)",
                "Spanish (Working Proficiency)",
                "French (Conversational)",
            ]
        elif "East Asian" in origin:
            if "Japanese" in origin:
                return ["Japanese (Native)", "English (Full Professional - TOEIC 900+)", "Thai (Elementary)"]
            elif "Korean" in origin:
                return ["Korean (Native)", "English (Professional Working)", "Mandarin (Basic)"]
            else:
                return ["Mandarin Chinese (Native)", "English (Fluent / IELTS 7.5+)", "Cantonese (Native/Fluent)"]
        elif "Southeast Asian" in origin:
            return ["English (Native / Bilingual)", "Malay / Tagalog / Vietnamese (Native)", "Mandarin Chinese (Working)"]
        else:
            # Romanized Thai Professional
            return [
                "English (Fluent Professional / IELTS 7.5+)",
                "Thai (Native)",
                "Mandarin Chinese (Business Elementary)",
            ]
