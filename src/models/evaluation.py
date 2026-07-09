"""Evaluation and scoring models."""

from datetime import datetime
from typing import Optional, List, Dict
from enum import Enum
from pydantic import BaseModel, Field


class AgentType(str, Enum):
    """Available agents."""

    PROFILE = "01-profile"
    TECHNICAL = "02-technical"
    CULTURE = "03-culture"
    REFERENCES = "04-references"
    RECOMMENDATION = "05-recommendation"
    PEOPLE_ANALYTICS = "06-people-analytics"


class DimensionScore(BaseModel):
    """Score for a single evaluation dimension."""

    dimension: str  # e.g., "Profile & Background"
    score: int = Field(ge=0, le=100)
    weight: float = Field(ge=0, le=1)  # Weight in final score (0-1)
    contribution: float = Field(default=0)  # score * weight

    gaps: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)

    agent: AgentType


class AgentScore(BaseModel):
    """Score from a single agent."""

    agent: AgentType
    score: int = Field(ge=0, le=100)
    timestamp: datetime = Field(default_factory=datetime.now)

    dimension_scores: List[DimensionScore] = Field(default_factory=list)
    analysis: str  # Narrative analysis
    red_flags: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return self.model_dump()


class Evaluation(BaseModel):
    """Complete evaluation across all agents."""

    id: str = Field(default_factory=lambda: f"eval_{datetime.now().timestamp()}")
    candidate_id: str
    job_id: str

    agent_scores: Dict[str, AgentScore] = Field(default_factory=dict)

    # Weighted scoring
    profile_score: int = 0
    technical_score: int = 0
    culture_score: int = 0
    reference_score: int = 0
    people_analytics_score: Optional[int] = None
    strategic_bonus: int = 0

    final_score: int = Field(default=0, ge=0, le=100)
    confidence: int = Field(default=0, ge=0, le=100)

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    def calculate_final_score(
        self,
        use_people_analytics: bool = False,
    ) -> int:
        """Calculate weighted final score."""
        if use_people_analytics and self.people_analytics_score is not None:
            # HR/People roles formula (weights sum to 0.95; strategic bonus adds up to 5 pts)
            weighted = (
                self.profile_score * 0.15
                + self.people_analytics_score * 0.40
                + self.culture_score * 0.25
                + self.reference_score * 0.15
            )
        else:
            # Tech roles formula (default)
            weighted = (
                self.profile_score * 0.20
                + self.technical_score * 0.35
                + self.culture_score * 0.25
                + self.reference_score * 0.15
            )
        self.final_score = min(100, round(weighted + self.strategic_bonus))
        return self.final_score


class EvaluationResult(BaseModel):
    """Complete evaluation result with recommendation."""

    evaluation: Evaluation
    recommendation: "Recommendation"

    report_html: Optional[str] = None
    report_json: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.now)

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return self.model_dump()


# Forward reference
from .recommendation import Recommendation
