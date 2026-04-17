from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import analysis, data, sessions

app = FastAPI(
    title="Financial Mirror API",
    description="Session-only AI financial checkup backend for the hackathon MVP.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(data.router)
app.include_router(analysis.router)


@app.get("/")
def health_check():
    return {
        "name": "Financial Mirror API",
        "status": "ok",
        "privacy": "session-only; no permanent financial data storage",
    }
