"""FastAPI application for Recruitment Suite."""

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
    return {"status": "ok", "version": "1.0.0"}
