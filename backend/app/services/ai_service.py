import os

from app.utils.analyzer import generate_actions, generate_insights, generate_personality


def generate_personality_response(session: dict) -> dict:
    return generate_personality(session)


def generate_insight_response(session: dict) -> dict:
    return generate_insights(session)


def generate_action_response(session: dict) -> list[str]:
    return generate_actions(session)


def ai_provider_status() -> dict:
    return {
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
        "default_mode": "deterministic local analysis",
    }
