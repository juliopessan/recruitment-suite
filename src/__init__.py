"""Recruitment Specialist Agent Suite - Python Edition."""

__version__ = "1.0.0"
__author__ = "Avanade"
__description__ = "Multi-agent suite for automated candidate evaluation"

from src.agents.orchestrator import RecruitmentOrchestrator
from src.models import Candidate, JobDescription, Evaluation, EvaluationResult

__all__ = [
    "RecruitmentOrchestrator",
    "Candidate",
    "JobDescription",
    "Evaluation",
    "EvaluationResult",
]
