"""Data models for Recruitment Suite."""

from .candidate import Candidate, CandidateProfile
from .job import JobDescription
from .evaluation import (
    AgentScore,
    AgentType,
    DimensionScore,
    Evaluation,
    EvaluationResult,
)
from .recommendation import Recommendation, RecommendationStatus

__all__ = [
    "Candidate",
    "CandidateProfile",
    "JobDescription",
    "AgentScore",
    "AgentType",
    "DimensionScore",
    "Evaluation",
    "EvaluationResult",
    "Recommendation",
    "RecommendationStatus",
]
