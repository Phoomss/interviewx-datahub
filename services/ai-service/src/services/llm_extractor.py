import json
import logging
import urllib.request
import urllib.error
from typing import Tuple, Optional, Dict, Any

from src.config import settings
from src.schemas.profile import (
    DeepProfileData,
    ExtractedPII,
    PersonalProfile,
    EducationDetail,
    WorkExperienceDetail,
    SkillItem,
    ProjectDetail,
    CertificationDetail,
    FieldProvenance,
)
from src.services.extractor import deep_parse_document

logger = logging.getLogger("LlmExtractor")

EXTRACTION_SYSTEM_PROMPT = """You are an expert HR Data Scientist and Resume Intelligence Engine for InterviewX DataHub.
Your task is to accurately extract comprehensive structured professional data from candidate document text.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "profile": {
    "full_name": "string or null",
    "email": "string or null",
    "phone_number": "string or null",
    "location": "string or null",
    "professional_title": "string",
    "professional_summary": "string",
    "industry": "string",
    "profession": "string",
    "career_level": "string"
  },
  "educations": [
    {
      "institution": "string",
      "degree": "string",
      "major": "string",
      "graduation_year": 2020,
      "gpa": 3.5
    }
  ],
  "experiences": [
    {
      "organization": "string",
      "job_title": "string",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM or Present",
      "current_employment_status": true,
      "responsibilities": ["string"],
      "tools_and_technologies": ["string"],
      "measurable_results": ["string"]
    }
  ],
  "skills": [
    {
      "skill_name": "string",
      "category": "Technical Skills | Domain Knowledge | Analytical Skills | Communication | Leadership | Digital Skills",
      "proficiency": "Intermediate",
      "is_explicit": true
    }
  ],
  "projects": [
    {
      "project_title": "string",
      "project_description": "string",
      "candidate_role": "string",
      "tools_and_technologies": ["string"]
    }
  ],
  "certifications": [
    {
      "certificate_name": "string",
      "issuing_organization": "string",
      "issue_date": "YYYY or null"
    }
  ],
  "classification": "Resume | CV | Academic CV | Portfolio | Certificate | Other",
  "confidence_score": 0.95
}
Do not wrap in markdown quotes if possible, return raw JSON. Never invent facts not present in text.
"""


class LlmExtractorService:
    @classmethod
    def extract(cls, raw_text: str, document_id: str = "DOC-001") -> Tuple[DeepProfileData, ExtractedPII, float]:
        """
        Orchestrates Deep Structured Extraction.
        If GEMINI_API_KEY or OPENAI_API_KEY is configured, invokes LLM with schema validation.
        Otherwise, falls back to the deterministic heuristic extractor.
        """
        if settings.gemini_api_key:
            try:
                return cls._extract_via_gemini(raw_text, document_id)
            except Exception as e:
                logger.warn(f"Gemini LLM extraction failed: {e}. Falling back to heuristic extractor.")

        if settings.openai_api_key:
            try:
                return cls._extract_via_openai(raw_text, document_id)
            except Exception as e:
                logger.warn(f"OpenAI LLM extraction failed: {e}. Falling back to heuristic extractor.")

        # Default: Deterministic heuristic extractor with provenance
        deep_data, pii, conf = deep_parse_document(raw_text, document_id)
        deep_data.extraction_limitations.append(
            "Extracted via heuristic rule-based engine. Configure GEMINI_API_KEY or OPENAI_API_KEY for deep LLM semantic parsing."
        )
        return deep_data, pii, conf

    @classmethod
    def _extract_via_gemini(cls, raw_text: str, document_id: str) -> Tuple[DeepProfileData, ExtractedPII, float]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.gemini_api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"{EXTRACTION_SYSTEM_PROMPT}\n\nDocument Text:\n{raw_text[:12000]}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json",
            },
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            candidate = data.get("candidates", [{}])[0]
            text_response = candidate.get("content", {}).get("parts", [{}])[0].get("text", "")
            parsed_json = json.loads(text_response)
            return cls._map_llm_json_to_deep_data(parsed_json, raw_text, document_id)

    @classmethod
    def _extract_via_openai(cls, raw_text: str, document_id: str) -> Tuple[DeepProfileData, ExtractedPII, float]:
        url = "https://api.openai.com/v1/chat/completions"
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
                {"role": "user", "content": f"Document Text:\n{raw_text[:12000]}"},
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"},
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {settings.openai_api_key}",
            },
            method="POST",
        )

        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = data["choices"][0]["message"]["content"]
            parsed_json = json.loads(content)
            return cls._map_llm_json_to_deep_data(parsed_json, raw_text, document_id)

    @classmethod
    def _map_llm_json_to_deep_data(
        cls, parsed: Dict[str, Any], raw_text: str, document_id: str
    ) -> Tuple[DeepProfileData, ExtractedPII, float]:
        prof_dict = parsed.get("profile", {})
        pii = ExtractedPII(
            full_name=prof_dict.get("full_name"),
            email=prof_dict.get("email"),
            phone_number=prof_dict.get("phone_number"),
            address=prof_dict.get("location"),
        )

        personal_profile = PersonalProfile(
            full_name=prof_dict.get("full_name"),
            email=prof_dict.get("email"),
            phone_number=prof_dict.get("phone_number"),
            location=prof_dict.get("location"),
            professional_title=prof_dict.get("professional_title", "Professional"),
            professional_summary=prof_dict.get("professional_summary", ""),
            industry=prof_dict.get("industry", "Technology"),
            profession=prof_dict.get("profession", "Specialist"),
            career_level=prof_dict.get("career_level", "Mid-Level"),
        )

        educations = [
            EducationDetail(
                institution=e.get("institution", "University"),
                degree=e.get("degree", "Degree"),
                major=e.get("major", ""),
                graduation_year=e.get("graduation_year", 2020),
                gpa=e.get("gpa"),
            )
            for e in parsed.get("educations", [])
        ]

        experiences = [
            WorkExperienceDetail(
                organization=exp.get("organization", "Company"),
                company_name=exp.get("organization", "Company"),
                job_title=exp.get("job_title", "Role"),
                role_title=exp.get("job_title", "Role"),
                start_date=exp.get("start_date", "2020"),
                end_date=exp.get("end_date", "Present"),
                responsibilities=exp.get("responsibilities", []),
                tools_and_technologies=exp.get("tools_and_technologies", []),
                measurable_results=exp.get("measurable_results", []),
            )
            for exp in parsed.get("experiences", [])
        ]

        skills = [
            SkillItem(
                skill_name=s.get("skill_name", ""),
                category=s.get("category", "Technical Skills"),
                proficiency=s.get("proficiency", "Intermediate"),
                is_explicit=s.get("is_explicit", True),
                confidence=0.96,
            )
            for s in parsed.get("skills", [])
            if s.get("skill_name")
        ]

        projects = [
            ProjectDetail(
                project_title=p.get("project_title", "Project"),
                project_description=p.get("project_description", ""),
                candidate_role=p.get("candidate_role", "Lead"),
                tools_and_technologies=p.get("tools_and_technologies", []),
            )
            for p in parsed.get("projects", [])
        ]

        certs = [
            CertificationDetail(
                certificate_name=c.get("certificate_name", "Certificate"),
                issuing_organization=c.get("issuing_organization", "Issuer"),
                issue_date=c.get("issue_date"),
                is_verified=False,
            )
            for c in parsed.get("certifications", [])
        ]

        deep_data = DeepProfileData(
            profile=personal_profile,
            educations=educations,
            experiences=experiences,
            skills=skills,
            projects=projects,
            certifications=certs,
            ocr_confidence_avg=0.96,
            detected_language="en",
            classification=parsed.get("classification", "Resume"),
            classification_confidence=parsed.get("confidence_score", 0.95),
            extraction_limitations=[],
        )

        return deep_data, pii, float(parsed.get("confidence_score", 0.95))
