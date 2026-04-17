from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    ActionsResponse,
    FullAnalysisResponse,
    InsightsResponse,
    NudgeResponse,
    PersonalityResponse,
    SessionRequest,
)
from app.services.ai_service import generate_action_response, generate_insight_response, generate_personality_response
from app.store.session_store import session_store
from app.utils.analyzer import build_metrics, generate_nudge

router = APIRouter(tags=["analysis"])


def _session_or_404(session_id: str) -> dict:
    try:
        session = session_store.get(session_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Session not found or already cleared.") from exc
    if not session.get("transactions"):
        raise HTTPException(status_code=400, detail="Add financial data before generating analysis.")
    return session


@router.post("/generate-personality", response_model=PersonalityResponse)
def generate_personality(payload: SessionRequest):
    session = _session_or_404(payload.session_id)
    session_store.increment(payload.session_id, "analysis_calls")
    return generate_personality_response(session)


@router.post("/generate-insights", response_model=InsightsResponse)
def generate_insights(payload: SessionRequest):
    session = _session_or_404(payload.session_id)
    session_store.increment(payload.session_id, "insight_calls")
    return generate_insight_response(session)


@router.post("/generate-actions", response_model=ActionsResponse)
def generate_actions(payload: SessionRequest):
    session = _session_or_404(payload.session_id)
    return {"actions": generate_action_response(session)}


@router.post("/generate-full-analysis", response_model=FullAnalysisResponse)
def generate_full_analysis(payload: SessionRequest):
    session = _session_or_404(payload.session_id)
    session_store.increment(payload.session_id, "analysis_calls")
    session_store.increment(payload.session_id, "insight_calls")
    personality = generate_personality_response(session)
    insights = generate_insight_response(session)
    actions = generate_action_response(session)
    return {
        "tag": personality["tag"],
        "summary": personality["summary"],
        "swot": personality["swot"],
        "insights": insights["insights"],
        "actions": actions,
    }


@router.post("/nudge/test", response_model=NudgeResponse)
def test_nudge(payload: SessionRequest):
    session = _session_or_404(payload.session_id)
    return generate_nudge(session)


@router.post("/metrics")
def metrics(payload: SessionRequest):
    session = _session_or_404(payload.session_id)
    return build_metrics(session)
