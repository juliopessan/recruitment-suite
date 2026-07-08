"""Recommendation models."""

from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class RecommendationStatus(str, Enum):
    """Hiring recommendation status."""

    GO = "GO"
    HOLD = "HOLD"
    NO_GO = "NO_GO"


class Recommendation(BaseModel):
    """Final hiring recommendation."""

    final_score: int = Field(ge=0, le=100)
    status: RecommendationStatus

    rationale: str
    key_strengths: List[str] = Field(default_factory=list)
    addressable_gaps: List[str] = Field(default_factory=list)
    critical_flags: List[str] = Field(default_factory=list)

    next_steps: List[str] = Field(default_factory=list)
    onboarding_plan: Optional[List[str]] = None

    confidence_level: int = Field(default=0, ge=0, le=100)

    created_at: datetime = Field(default_factory=datetime.now)

    @classmethod
    def from_score(cls, final_score: int, confidence: int = 85) -> "Recommendation":
        """Create recommendation based on score."""
        if final_score >= 75:
            status = RecommendationStatus.GO
        elif final_score >= 30:
            status = RecommendationStatus.HOLD
        else:
            status = RecommendationStatus.NO_GO

        return cls(
            final_score=final_score,
            status=status,
            rationale=f"Score: {final_score}/100",
            confidence_level=confidence,
        )

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return self.model_dump()
