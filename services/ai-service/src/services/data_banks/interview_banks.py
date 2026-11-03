"""High-Fidelity Interview Questions, Scenarios, Answers, and Rubrics Bank.

Provides multi-dimensional interview question banks, realistic candidate response variations,
rubrics, and scenario-based ethical dilemmas.
"""

import random
from typing import Any, Dict, List, Optional

# ==============================================================================
# 1. CATEGORIZED INTERVIEW QUESTIONS
# ==============================================================================

def get_dynamic_question(
    category: str,
    profession_name: str,
    industry_key: str,
    seniority: str,
    language: str = "en",
) -> Dict[str, Any]:
    """Generates rich, tailored interview questions with detailed evaluation rubrics."""
    cat = category.lower()
    p = profession_name
    ind = industry_key.title()
    sen = seniority

    if "academic" in cat or "scholarship" in cat:
        q_en = (
            f"What fundamental academic gap or emerging paradigm in {p} inspired your proposed research/study agenda, "
            f"and how will your findings tangibly elevate institutional capability in Southeast Asia?"
        )
        q_th = (
            f"อะไรคือช่องว่างทางวิชาการหรือกระบวนทัศน์ใหม่ในสาขา {p} ที่เป็นแรงผลักดันให้คุณเลือกศึกษาต่อ "
            f"และผลงานวิจัยของคุณจะช่วยยกระดับศักยภาพของประเทศหรือภูมิภาคเอเชียตะวันออกเฉียงใต้อย่างไร?"
        )
        intent = "Assesses scholarly depth, originality of intellectual inquiry, and long-term societal vision."
        competencies = [
            "Academic Motivation & Intellectual Curiosity",
            "Research Methodology & Critical Defense",
            "Societal Value Creation & Global Outlook",
            "Commitment to Scholarly Ethics",
        ]
        points = [
            "Specific articulation of contemporary literature and research gaps",
            "Viable methodology connecting theory to empirical validation",
            "Clear roadmap for post-study application and knowledge transfer",
            "Genuine intellectual humility and openness to academic criticism",
        ]
        red_flags = [
            "Purely prestige-oriented motives devoid of research substance",
            "Inability to explain foundational methodologies or authors",
            "Unrealistic or grandiose claims without empirical justification",
        ]
        follow_ups = [
            "Which academic paper or peer-reviewed finding most strongly challenged your initial assumptions in this area?",
            "If your core hypothesis produces negative empirical results in Year 2, how will you pivot your research without compromising rigor?",
        ]

    elif "research" in cat:
        q_en = (
            f"When investigating complex multi-variable models in {p}, how do you systematically diagnose and mitigate "
            f"sampling bias, confounding factors, and threats to external validity?"
        )
        q_th = (
            f"ในการศึกษาแบบจำลองที่มีตัวแปรซับซ้อนในงาน {p} คุณมีกระบวนการเชิงระบบอย่างไรในการตรวจหาและลดความเอนเอียง (Bias) "
            f"ตัวแปรกวน และข้อจำกัดด้านความถูกต้องเชิงประจักษ์ (Validity)?"
        )
        intent = "Evaluates scientific defense under scrutiny, methodological discipline, and statistical rigor."
        competencies = [
            "Advanced Quantitative/Qualitative Rigor",
            "Experimental Design & Controls",
            "Epistemological Defense",
            "Reproducibility & Open Science",
        ]
        points = [
            "Identification of specific statistical power analyses and control cohorts",
            "Defensible rationale for tool selection (e.g., ANOVA, regression, thematic coding)",
            "Honest recognition of boundary conditions and limitation transparency",
        ]
        red_flags = [
            "Assuming correlation implies causation without mechanism proof",
            "Defensive attitude when methodology is probed",
            "Over-fitting or p-hacking tendencies",
        ]
        follow_ups = [
            "Can you explain your preregistration or verification strategy to ensure experimental reproducibility?",
        ]

    elif "career_dev" in cat or "lead" in cat or "promot" in cat:
        q_en = (
            f"In transitioning to higher organizational leadership in {p}, how have you balanced immediate deliverable velocity "
            f"with systematic team capability building and long-term succession planning?"
        )
        q_th = (
            f"ในการก้าวขึ้นสู่บทบาทผู้นำระดับสูงในสายงาน {p} คุณสร้างสมดุลระหว่างความเร็วในการส่งมอบงาน "
            f"กับการพัฒนาศักยภาพทีมงานเชิงระบบและการวางแผนผู้สืบทอดตำแหน่ง (Succession Planning) อย่างไร?"
        )
        intent = "Examines strategic delegation, emotional intelligence, psychological safety, and transformative coaching."
        competencies = [
            "Strategic Leadership & Vision",
            "Coaching & People Development",
            "Psychological Safety & Culture",
            "Accountability & Succession Structuring",
        ]
        points = [
            "Evidence of individualized development plans (IDPs) and mentoring",
            "Fostering psychological safety while upholding uncompromising standards",
            "Measurable career advancement of subordinates under their mentorship",
        ]
        red_flags = [
            "Micromanagement and inability to delegate high-stakes decisions",
            "Taking sole credit for collaborative team triumphs",
            "Dismissive attitude toward employee burnout or organizational friction",
        ]
        follow_ups = [
            "Describe a time when a high-performing senior specialist exhibited disruptive team behavior. How did you resolve the situation?",
        ]

    elif "ethic" in cat or "crisis" in cat:
        q_en = (
            f"Describe an incident in your {p} practice where commercial urgency directly conflicted with professional ethics "
            f"or regulatory compliance. How did you handle executive friction while defending integrity?"
        )
        q_th = (
            f"ช่วยเล่าเหตุการณ์ในงาน {p} ที่แรงกดดันทางธุรกิจขัดแย้งโดยตรงกับหลักจริยธรรมวิชาชีพหรือกฎระเบียบข้อบังคับ "
            f"คุณจัดการกับความตึงเครียดกับผู้บริหารอย่างไรในขณะที่ยังยืนหยัดในความถูกต้อง?"
        )
        intent = "Tests ethical fortitude, moral courage, constructive dissent, and principled negotiation."
        competencies = [
            "Ethical Fortitude & Integrity",
            "Principled Negotiation",
            "Risk Quantification & Mitigation",
            "Institutional Governance",
        ]
        points = [
            "Uncompromising defense of core compliance/ethical standards",
            "Framing ethical compliance as long-term enterprise value protection",
            "Constructive generation of compliant compromise routes",
        ]
        red_flags = [
            "Capitulation to commercial pressure under duress",
            "Combative posturing without presenting viable compliant alternatives",
        ]
        follow_ups = [
            "What framework do you utilize when the regulatory standard is ambiguous or lagging behind technological innovation?",
        ]

    else:  # Standard Job & Technical Competency
        q_en = (
            f"As a {sen} {p}, walk us through a high-stakes initiative where unexpected technical constraints "
            f"or shifting stakeholder requirements threatened delivery. How did you diagnose the root cause and deliver measurable impact?"
        )
        q_th = (
            f"ในฐานะ {sen} ในสายงาน {p} ช่วยยกตัวอย่างโครงการสำคัญที่คุณเผชิญกับข้อจำกัดทางเทคนิคที่ไม่คาดคิด "
            f"หรือความต้องการที่เปลี่ยนไปอย่างกะทันหัน คุณวินิจฉัยสาเหตุที่แท้จริงและส่งมอบผลลัพธ์ที่วัดผลได้สำเร็จอย่างไร?"
        )
        intent = "Assesses end-to-end problem decomposition, cross-functional stakeholder negotiation, and disciplined execution."
        competencies = [
            "Root Cause Diagnostics & Problem Solving",
            "Stakeholder Negotiation & Alignment",
            "Technical/Domain Execution Under Pressure",
            "Measurable Business Value Creation",
        ]
        points = [
            "Structured narrative following STAR framework",
            "Clear segregation of personal agency vs team effort",
            "Concrete quantifiable impact metrics (cost, time, latency, satisfaction)",
        ]
        red_flags = [
            "Vague generalizations without personal contribution clarity",
            "Blaming external dependencies or junior staff for roadblocks",
            "Inability to cite concrete retrospective learnings",
        ]
        follow_ups = [
            "Looking back, what trade-off decision did you make that you would execute differently today?",
            "How did you quantitatively measure that the resolution was sustainable six months post-launch?",
        ]

    return {
        "question": q_th if language == "th" else q_en,
        "question_th": q_th,
        "category": category.replace("_", " ").title(),
        "difficulty": "Advanced" if ("senior" in sen.lower() or "lead" in sen.lower()) else "Mid",
        "intent_and_objective": intent,
        "competencies_evaluated": competencies,
        "key_points_to_look_for": points,
        "red_flags": red_flags,
        "sample_follow_ups": follow_ups,
    }


# ==============================================================================
# 2. SCENARIO-BASED DILEMMAS (BY INDUSTRY)
# ==============================================================================

def get_dynamic_scenario(
    profession_name: str,
    industry_key: str,
    seniority: str,
) -> Dict[str, Any]:
    """Generates an authentic high-stakes scenario dilemma tailored to industry realities."""
    p = profession_name
    ind = industry_key.lower()

    if "health" in ind:
        title = f"Diagnostic Discrepancy & Emergency Protocol Conflict in {p}"
        context = (
            f"You are the {seniority} {p} at a major tertiary medical center. During an acute weekend shift, "
            f"an automated clinical diagnostic system flags an ambiguous anomaly in a critical post-operative patient. "
            f"The on-call surgical department head dismisses the warning as false alarm and orders routine discharge to free ICU beds, "
            f"while nursing telemetry indicates borderline clinical deterioration."
        )
        problem = (
            f"How do you resolve the acute tension between respecting senior departmental hierarchy and your immediate fiduciary duty "
            f"to patient safety? What immediate diagnostic checks and escalation protocols do you enact?"
        )
        constraints = [
            "Urgent ICU bed shortage during a mass-casualty incoming alert",
            "Direct opposition from a powerful senior departmental chair",
            "Ambiguity in initial automated diagnostic algorithms",
            "Extreme legal, clinical, and ethical liability for premature discharge",
        ]
        dilemma = (
            "Complying with the department head avoids immediate hierarchical friction but risks catastrophic patient mortality. "
            "Halting discharge triggers severe administrative conflict and delays incoming emergency triage patients."
        )
    elif "fin" in ind:
        title = f"Statutory Materiality Breach and Quarterly Reporting Pressure in {p}"
        context = (
            f"You are the {seniority} {p} reviewing year-end financial disclosures for an enterprise audit. "
            f"Forty-eight hours before public SEC filing, your team identifies an unhedged derivative liability and premature revenue "
            f"recognition totaling 140M THB. The Chief Financial Officer insists that the variance falls within acceptable materiality thresholds "
            f"and warns that a restatement will trigger a 20% stock collapse and jeopardize an impending capital injection."
        )
        problem = (
            f"How do you evaluate materiality under statutory IFRS/TFRS standards in the face of aggressive executive coercion? "
            f"What concrete steps do you take to communicate with the Audit Committee and ensure governance compliance?"
        )
        constraints = [
            "Strict 48-hour regulatory filing deadline with SEC and stock exchange",
            "Intense pressure from C-suite threatening audit mandate termination",
            "Complex cross-border structured financial instruments",
            "Severe fiduciary and criminal liability for signing misleading statements",
        ]
        dilemma = (
            "Signing off preserves company valuation and executive goodwill but constitutes statutory fraud. "
            "Refusing sign-off triggers acute market panic, executive retribution, and immediate independent audit committee escalation."
        )
    elif "legal" in ind:
        title = f"Privileged Discovery and Confidentiality Conflict in Commercial Arbitration"
        context = (
            f"You are the {seniority} {p} representing a primary client in a 350M THB cross-border commercial arbitration. "
            f"During pre-hearing evidentiary exchange, your junior team accidentally receives an unredacted confidential strategy memo "
            f"belonging to opposing counsel due to an email vendor misconfiguration. "
            f"Your managing partner orders you to study the document to anticipate opposing arguments."
        )
        problem = (
            f"How do you handle inadvertently disclosed privileged material under professional ethics codes and IBA rules? "
            f"What actions do you take to preserve client advocacy without committing sanctionable ethical violations?"
        )
        constraints = [
            "High client expectations with 350M THB at stake",
            "Conflicting directives from the firm's senior managing partner",
            "Strict bar ethics rules on inadvertent receipt of privileged materials",
            "Risk of disqualification of counsel or severe tribunal sanctions",
        ]
        dilemma = (
            "Reviewing the document gives decisive tactical advantage but breaches legal ethics and risks tribunal disqualification. "
            "Notifying opposing counsel immediately upholds ethical duty but angers client leadership and senior partners."
        )
    else:  # Tech & General Industry
        title = f"Zero-Day Vulnerability Disclosure vs. Tier-1 Production Launch in {p}"
        context = (
            f"You are the {seniority} {p} at a leading enterprise platform. 24 hours prior to a nationally publicized product launch "
            f"backed by a 50M THB marketing campaign, your security automated scanner uncovers a critical privilege escalation flaw "
            f"that could permit unauthorized tenant data exfiltration under specific concurrent payloads. "
            f"Commercial executive sponsors insist on launching with a temporary hotfix, arguing that discovery probability is near zero."
        )
        problem = (
            f"How do you balance massive commercial commitments against catastrophic customer data exposure risks? "
            f"What empirical risk assessments, mitigations, or staged deployment contingencies do you propose?"
        )
        constraints = [
            "National launch timeline with live executive press commitments",
            "Commercial leaders urging waiver of standard security gates",
            "Direct risk to personal identifiable information (PII) under PDPA legislation",
            "High team fatigue following intensive delivery sprints",
        ]
        dilemma = (
            "Yielding to commercial pressure avoids executive rage but exposes millions of user records to catastrophic breach. "
            "Halting the launch triggers acute public relations humiliation and marketing expenditure loss."
        )

    return {
        "scenario_title": title,
        "scenario_context": context,
        "problem_statement": problem,
        "conflicting_constraints": constraints,
        "ethical_or_professional_dilemma": dilemma,
        "expected_candidate_actions": [
            "Halt unvalidated exposure while rapidly assembling a cross-functional incident triage squad.",
            "Quantify risk likelihood and blast radius using empirical data, not emotional rhetoric.",
            "Propose structured, risk-mitigated contingency routes (e.g., phased rollout, feature toggling, emergency audit).",
            "Communicate transparently with executive stakeholders with unwavering professional integrity.",
        ],
        "rubric_scoring_guide": {
            "Level 1 (Unacceptable)": "Capitulates immediately under pressure or responds with emotional blame without proposing constructive solutions.",
            "Level 2 (Basic)": "Identifies the core dilemma but relies entirely on rigid rules without proposing practical risk mitigation alternatives.",
            "Level 3 (Competent)": "Maintains principled ethical stance, presents empirical risk assessment, and designs actionable compromised paths.",
            "Level 4 (Exemplary)": "Exhibits inspirational executive leadership: calms agitated stakeholders, presents 3 prioritized risk-weighted options, upholds absolute integrity, and introduces preventative governance safeguards.",
        },
        "sample_solutions": {
            "Best Practice Approach": (
                "Convene immediate emergency review; present data-backed risk quantification; offer a phased, secure deployment "
                "or controlled containment; uphold professional code of conduct with collaborative diplomacy."
            ),
            "Common Pitfalls to Avoid": (
                "Signing off under verbal pressure; leaking panic to unauthorized external parties; blaming subordinates; stonewalling without empathy."
            ),
        },
    }
