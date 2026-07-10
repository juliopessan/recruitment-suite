"""FastAPI application for Recruitment Suite."""

import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import init_db
from .routes import candidates, jobs, evaluations, analyze

app = FastAPI(
    title="Recruitment Suite API",
    description="Multi-agent candidate evaluation system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(candidates.router, prefix="/api/candidates", tags=["candidates"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(evaluations.router, prefix="/api/evaluations", tags=["evaluations"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["analyze"])


@app.get("/health")
def health_check():
    exa_key = os.environ.get("EXA_API_KEY")
    return {
        "status": "ok",
        "version": "1.0.0",
        # Presence/shape only — never expose the actual key value.
        "exa_api_key_configured": bool(exa_key),
        "exa_api_key_length": len(exa_key) if exa_key else 0,
    }
