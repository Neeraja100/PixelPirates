import json
import os

from openai import OpenAI
from pydantic import ValidationError

from app.utils.analyzer import build_metrics, generate_actions, generate_insights, generate_personality

_client = None

def get_openai_client():
    global _client
    if _client is not None:
        return _client
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        _client = OpenAI(api_key=api_key)
    return _client

def generate_personality_response(session: dict) -> dict:
    client = get_openai_client()
    if client:
        try:
            metrics = build_metrics(session)
            safe_payload = {
                "income": metrics["income"],
                "expenses": metrics["expenses"],
                "savings_rate": metrics["savings_rate"],
                "discretionary_ratio": metrics["discretionary_ratio"],
                "expense_ratio": metrics["expense_ratio"],
                "top_categories": [k for k, v in list(metrics["by_category"].items())[:3]]
            }
            prompt = (
                "You are an expert financial psychologist. Based on this anonymized aggregate data: " + json.dumps(safe_payload) + " "
                "Generate a financial personality profile. Output strictly as JSON formatting: "
                '{"tag": "string (A catchy title like The Comfort Spender or Balanced Optimizer)", '
                '"summary": "string (2-3 sentences max explaining their archetypal spending behavior)", '
                '"swot": {"strengths": ["string", "string"], "weaknesses": ["string"], "opportunities": ["string"], "threats": ["string"]}}'
            )
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "You output JSON exclusively."}, {"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            data = json.loads(completion.choices[0].message.content)
            data["score"] = metrics["score"]
            return data
        except Exception:
            pass
    return generate_personality(session)

def generate_insight_response(session: dict) -> dict:
    client = get_openai_client()
    if client:
        try:
            metrics = build_metrics(session)
            # NEVER SEND RAW DATA, purely aggregate scalars
            safe_payload = {
                "income": metrics["income"],
                "expenses": metrics["expenses"],
                "savings": metrics["savings"],
                "savings_rate": metrics["savings_rate"],
                "discretionary_ratio": metrics["discretionary_ratio"],
                "top_categories": [k for k, v in list(metrics["by_category"].items())[:3]],
                "weekend_spend": metrics["weekend_spend"],
                "weekday_spend": metrics["weekday_spend"]
            }
            
            prompt = (
                "You are a strict financial analyst. Based on this aggregated data: " + json.dumps(safe_payload) + " "
                "Generate exactly: "
                "1. 2 to 3 data-driven insights. "
                "2. 1 behavioral observation. "
                "3. 1 actionable suggestion. "
                "Output as a JSON object strictly formatting exactly this schema: "
                '{"insights": ["string", "string", "string"], "behavioral_observation": "string", "suggestion": "string"}'
            )

            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "You output JSON exclusively."}, {"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            data = json.loads(completion.choices[0].message.content)
            
            insights_val = data.get("insights", [])
            behavior_val = data.get("behavioral_observation", "")
            if behavior_val:
                insights_val.append("Behavioral Observation: " + behavior_val)
            sugg_val = data.get("suggestion", "")
            if sugg_val:
                insights_val.append("Suggestion: " + sugg_val)
                
            return {"insights": insights_val}
            
        except Exception:
            pass # Fall back safely to reliable deterministic module
            
    return generate_insights(session)

def generate_action_response(session: dict) -> list[str]:
    client = get_openai_client()
    if client:
        try:
            metrics = build_metrics(session)
            safe_payload = {
                "income": metrics["income"],
                "savings": metrics["savings"],
                "savings_rate": metrics["savings_rate"],
                "top_categories": {k: v for k, v in list(metrics["by_category"].items())[:3]},
                "discretionary": metrics["discretionary"]
            }
            prompt = (
                "You are a strict financial advisor. Based on this anonymized data: " + json.dumps(safe_payload) + " "
                "Generate exactly 3 extremely actionable financial steps the user should take immediately. "
                "Output strictly as a JSON object: "
                '{"actions": ["string", "string", "string"]}'
            )
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "You output JSON exclusively."}, {"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            data = json.loads(completion.choices[0].message.content)
            return data.get("actions", [])[:3]
        except Exception:
            pass
    return generate_actions(session)

def ai_provider_status() -> dict:
    return {
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "default_mode": "deterministic local analysis - fallback active",
    }
