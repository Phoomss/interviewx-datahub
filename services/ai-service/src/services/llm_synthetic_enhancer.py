import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, Optional

from src.config import settings
from src.schemas.synthetic_universal import UniversalGenerateBatchRequest

logger = logging.getLogger("LlmSyntheticEnhancer")

class LlmSyntheticEnhancer:
    @classmethod
    def enhance_if_configured(
        cls, item: Dict[str, Any], req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        """
        Enhances generated synthetic records with deep LLM variations if Gemini or OpenAI
        API keys are present. Falls back cleanly to heuristic data on error or if unconfigured.
        """
        if not settings.gemini_api_key and not settings.openai_api_key:
            return item

        try:
            if settings.gemini_api_key:
                return cls._enhance_gemini(item, req)
            elif settings.openai_api_key:
                return cls._enhance_openai(item, req)
        except Exception as e:
            logger.warning(f"LLM synthetic enhancement failed ({e}); retaining taxonomy-generated record.")
            return item

        return item

    @classmethod
    def _enhance_gemini(
        cls, item: Dict[str, Any], req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        dt = req.dataset_type.lower()
        if dt not in ["interview_question", "interview_answer", "scenario", "feedback"]:
            return item

        prompt = cls._build_prompt(item, req)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.gemini_api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.7,
                "responseMimeType": "application/json",
            },
        }

        req_http = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        with urllib.request.urlopen(req_http, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            candidate = data.get("candidates", [{}])[0]
            text_resp = candidate.get("content", {}).get("parts", [{}])[0].get("text", "")
            patch = json.loads(text_resp)
            return cls._apply_patch(item, patch)

    @classmethod
    def _enhance_openai(
        cls, item: Dict[str, Any], req: UniversalGenerateBatchRequest
    ) -> Dict[str, Any]:
        dt = req.dataset_type.lower()
        if dt not in ["interview_question", "interview_answer", "scenario", "feedback"]:
            return item

        prompt = cls._build_prompt(item, req)
        url = "https://api.openai.com/v1/chat/completions"
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a synthetic dataset generation engine. Return valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "response_format": {"type": "json_object"},
        }

        req_http = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {settings.openai_api_key}"},
            method="POST",
        )

        with urllib.request.urlopen(req_http, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            patch = json.loads(content)
            return cls._apply_patch(item, patch)

    @classmethod
    def _build_prompt(cls, item: Dict[str, Any], req: UniversalGenerateBatchRequest) -> str:
        dt = req.dataset_type.lower()
        lang_note = "Respond in Thai." if req.language == "th" else "Respond in English."
        if dt == "interview_question":
            return (
                f"You are creating a rigorous interview question for profession '{req.profession_name}' in industry '{req.industry_key}'.\n"
                f"Seniority: {req.seniority}. Format: {req.interview_subcategory or req.interview_category}.\n"
                f"Base question: {item.get('question_text', '')}\n"
                f"{lang_note}\n"
                f"Return JSON with keys:\n"
                f"- 'question_text': sophisticated, realistic interview question\n"
                f"- 'evaluation_focus': key traits being assessed\n"
                f"- 'probing_questions': array of 3 realistic follow-up questions"
            )
        elif dt == "interview_answer":
            quality = req.custom_parameters.get("answer_quality", "Good") if req.custom_parameters else "Good"
            return (
                f"You are creating a realistic candidate answer for profession '{req.profession_name}'.\n"
                f"Question: {item.get('question_text', '')}\n"
                f"Candidate Quality Level: {quality} (Poor/Average/Good/Excellent).\n"
                f"{lang_note}\n"
                f"Return JSON with keys:\n"
                f"- 'candidate_answer': candidate speech in STAR format reflecting '{quality}' quality\n"
                f"- 'delivery_notes': observations on delivery and structure"
            )
        elif dt == "scenario":
            return (
                f"Create a high-stakes professional dilemma for '{req.profession_name}'.\n"
                f"Industry: {req.industry_key}. Seniority: {req.seniority}.\n"
                f"{lang_note}\n"
                f"Return JSON with keys:\n"
                f"- 'scenario_title': compelling title\n"
                f"- 'scenario_description': detailed realistic crisis/ethical scenario\n"
                f"- 'dilemma': core ethical or strategic tension"
            )
        return f"Return an empty JSON object {{}}."

    @classmethod
    def _apply_patch(cls, item: Dict[str, Any], patch: Dict[str, Any]) -> Dict[str, Any]:
        for k, v in patch.items():
            if v:
                item[k] = v
        if "metadata" in item and isinstance(item["metadata"], dict):
            item["metadata"]["generation_version"] = "2.5.0-llm-augmented"
        return item
