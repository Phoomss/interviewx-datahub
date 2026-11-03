import pytest
from src.services.extractor import (
    classify_document,
    deep_parse_document,
    extract_skills_classified,
    deep_extract_experiences,
    deep_extract_educations,
    extract_projects,
    extract_certifications_detailed,
    extract_academic_research,
)

SAMPLE_RESEARCH_CV = """DR. ARUNACHALAM VISWANATHAN
Bangkok, Thailand | arun.v@chula.ac.th | +66891112233
National ID: 1-1002-33445-56-7

PROFESSIONAL SUMMARY
Senior Research Scientist and Associate Professor with 10+ years of experience leading machine learning and distributed system research projects.

TECHNICAL SKILLS
Languages & Tools: Python, PyTorch, TensorFlow, PostgreSQL, Docker, Git, Linux
Domains: Machine Learning, Artificial Intelligence, Statistical Modeling, PDPA compliance
Management: Agile, Scrum, Research Leadership, Team Mentoring

PROFESSIONAL EXPERIENCE
Siam AI Research Institute | Bangkok, Thailand
Principal AI Scientist (2020-03 - Present)
- Spearheaded LLM evaluation frameworks processing 100k benchmarks with 40% reduction in inference latency.
- Mentored 8 doctoral students and authored 4 technical patent applications.
- Collaborated with cross-functional healthcare teams on patient privacy preserving architectures.

EDUCATION
Chulalongkorn University (2012 - 2016)
Ph.D. in Computer Science (GPA: 3.95, First Class Honors)
Thesis: High-Throughput Privacy-Preserving Neural Computation in Cloud Environments

KEY PROJECTS
OpenMed-Thai LLM: Architectural lead for clinical Thai question-answering system.
- Designed distributed multi-GPU training pipeline across 32 nodes.
- Personal contribution: Architected attention mechanism and wrote core tokenizer.
- Delivered 92% benchmark accuracy.

CERTIFICATIONS
AWS Certified Machine Learning - Specialty (2022)

PUBLICATIONS & RESEARCH
- Scalable Differential Privacy in Federated LLM Fine-Tuning. Journal of AI Research, 2023. DOI: 10.1016/j.jair.2023.04.012
"""

def test_classify_document_types():
    # Test Academic CV
    doc_type, conf = classify_document(SAMPLE_RESEARCH_CV)
    assert doc_type in ["Academic CV", "Research Paper", "CV", "Resume"]
    assert conf >= 0.80

    # Test Transcript
    transcript_text = "OFFICIAL ACADEMIC TRANSCRIPT. Cumulative GPA: 3.85. Credits Earned: 142. Registrar signature."
    trans_type, trans_conf = classify_document(transcript_text)
    assert trans_type == "Transcript"
    assert trans_conf >= 0.80

    # Test Certificate
    cert_text = "CERTIFICATE OF COMPLETION. This hereby certifies that candidate has completed Advanced NestJS."
    cert_type, _ = classify_document(cert_text)
    assert cert_type == "Certificate"

    # Test Recommendation Letter
    rec_text = "To Whom It May Concern: It is my great pleasure to write this letter of recommendation for candidate."
    rec_type, _ = classify_document(rec_text)
    assert rec_type == "Recommendation Letter"

def test_deep_parse_document_structure():
    deep_data, pii, conf = deep_parse_document(SAMPLE_RESEARCH_CV, "DOC-RES-001")

    assert conf >= 0.85
    assert pii.full_name == "DR. ARUNACHALAM VISWANATHAN"
    assert pii.email == "arun.v@chula.ac.th"
    assert pii.national_id == "1-1002-33445-56-7"

    # Education verification
    assert len(deep_data.educations) >= 1
    edu = deep_data.educations[0]
    assert "Chulalongkorn" in edu.institution
    assert edu.gpa == 3.95

    # Experience verification
    assert len(deep_data.experiences) >= 1
    exp = deep_data.experiences[0]
    assert "Siam AI Research Institute" in exp.organization
    assert exp.current_employment_status is True

    # Skills categorization (13 categories)
    assert len(deep_data.skills) >= 3
    categories = {s.category for s in deep_data.skills}
    assert "Technical Skills" in categories or "Digital Skills" in categories

    # Project personal contributions
    assert len(deep_data.projects) >= 1
    proj = deep_data.projects[0]
    assert "OpenMed-Thai" in proj.project_title

    # Provenance verification
    assert len(deep_data.provenances) >= 4
    for prov in deep_data.provenances:
        assert prov.source["document_id"] == "DOC-RES-001"
        assert prov.source["page_number"] >= 1
        assert prov.confidence_score > 0.0

    # Certification must not be auto-verified
    assert len(deep_data.certifications) >= 1
    assert deep_data.certifications[0].is_verified is False

    # Research extraction
    assert len(deep_data.academic_research) >= 1
    assert deep_data.academic_research[0].doi is not None
