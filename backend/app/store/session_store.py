from copy import deepcopy
from datetime import datetime, timezone
from uuid import uuid4

from app.models.schemas import Transaction, UserProfile


class SessionStore:
    """In-memory session store. Financial data is deleted when the process/session ends."""

    def __init__(self, max_transactions=1000, ttl_seconds=3600):
        self._sessions: dict[str, dict] = {}
        self.max_transactions = max_transactions
        self.ttl_seconds = ttl_seconds

    def cleanup_stale_sessions(self):
        """Lazy eviction of sessions older than TTL."""
        now = datetime.now(timezone.utc)
        stale = [
            sid for sid, data in self._sessions.items()
            if (now - datetime.fromisoformat(data["created_at"])).total_seconds() > self.ttl_seconds
        ]
        for sid in stale:
            del self._sessions[sid]

    def create(self, profile: UserProfile, auto_clear_on_refresh: bool = True) -> str:
        session_id = str(uuid4())
        self._sessions[session_id] = {
            "profile": profile.model_dump(),
            "transactions": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "analysis_calls": 0,
            "insight_calls": 0,
            "auto_clear_on_refresh": auto_clear_on_refresh,
        }
        return session_id

    def exists(self, session_id: str) -> bool:
        self.cleanup_stale_sessions()
        return session_id in self._sessions

    def get(self, session_id: str) -> dict:
        self.cleanup_stale_sessions()
        if session_id not in self._sessions:
            raise KeyError("Session not found or already cleared.")
        return self._sessions[session_id]

    def get_safe(self, session_id: str) -> dict | None:
        session = self._sessions.get(session_id)
        return deepcopy(session) if session else None

    def add_transactions(self, session_id: str, transactions: list[Transaction]) -> list[dict]:
        session = self.get(session_id)
        if len(session["transactions"]) + len(transactions) > self.max_transactions:
            raise ValueError(f"Cannot exceed maximum of {self.max_transactions} transactions per session.")
        normalized = []
        for transaction in transactions:
            item = transaction.model_dump()
            item["id"] = item["id"] or str(uuid4())
            item["amount"] = abs(float(item["amount"]))
            normalized.append(item)
        session["transactions"].extend(normalized)
        return deepcopy(session["transactions"])

    def replace_transactions(self, session_id: str, transactions: list[Transaction]) -> list[dict]:
        session = self.get(session_id)
        session["transactions"] = []
        return self.add_transactions(session_id, transactions)

    def increment(self, session_id: str, key: str) -> int:
        session = self.get(session_id)
        session[key] = int(session.get(key, 0)) + 1
        return session[key]

    def delete(self, session_id: str) -> bool:
        return self._sessions.pop(session_id, None) is not None


session_store = SessionStore()
