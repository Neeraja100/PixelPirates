from typing import Literal

from pydantic import BaseModel, Field


TransactionType = Literal["income", "expense"]


class UserProfile(BaseModel):
    name: str = Field(min_length=1)
    phone: str = Field(min_length=5)
    monthly_income: float = Field(ge=0)
    financial_goal: str = Field(min_length=1)


class SessionStartRequest(BaseModel):
    profile: UserProfile
    auto_clear_on_refresh: bool = True


class SessionStartResponse(BaseModel):
    session_id: str
    message: str


class Transaction(BaseModel):
    id: str | None = None
    date: str
    description: str
    amount: float
    type: TransactionType = "expense"
    category: str = "Uncategorized"


class TransactionBatchRequest(BaseModel):
    session_id: str
    transactions: list[Transaction]


class TextInputRequest(BaseModel):
    session_id: str
    text: str


class SessionRequest(BaseModel):
    session_id: str


class PersonalityResponse(BaseModel):
    tag: str
    summary: str
    swot: dict[str, list[str]]
    score: int


class InsightsResponse(BaseModel):
    insights: list[str]
    refined: bool


class ActionsResponse(BaseModel):
    actions: list[str]


class FullAnalysisResponse(BaseModel):
    tag: str
    summary: str
    swot: dict[str, list[str]]
    insights: list[str]
    actions: list[str]


class NudgeResponse(BaseModel):
    type: str
    message: str
    whatsapp_ready: str
