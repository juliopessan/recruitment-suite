"""Base agent class for evaluation agents."""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Optional
from src.models import (
    Candidate,
    JobDescription,
    AgentScore,
    DimensionScore,
    AgentType,
)


class BaseAgent(ABC):
    """Base class for all evaluation agents."""

    agent_type: AgentType
    name: str
    description: str

    def __init__(self):
        """Initialize agent."""
        self.agent_type = AgentType.PROFILE
        self.name = "Base Agent"
        self.description = "Base agent class"

    @abstractmethod
    def evaluate(
        self,
        candidate: Candidate,
        job: JobDescription,
    ) -> AgentScore:
        """
        Evaluate candidate against job requirements.

        Args:
            candidate: Candidate profile
            job: Job description

        Returns:
            AgentScore with evaluation results
        """
        pass

    def _create_score(
        self,
        score: int,
        analysis: str,
        dimension_scores: Optional[List[DimensionScore]] = None,
        red_flags: Optional[List[str]] = None,
        recommendations: Optional[List[str]] = None,
    ) -> AgentScore:
        """
        Helper method to create AgentScore.

        Args:
            score: Numerical score (0-100)
            analysis: Narrative analysis
            dimension_scores: List of dimension scores
            red_flags: List of red flags
            recommendations: List of recommendations

        Returns:
            AgentScore object
        """
        return AgentScore(
            agent=self.agent_type,
            score=score,
            timestamp=datetime.now(),
            dimension_scores=dimension_scores or [],
            analysis=analysis,
            red_flags=red_flags or [],
            recommendations=recommendations or [],
        )

    def _dimension_score(
        self,
        dimension: str,
        score: int,
        weight: float,
        gaps: Optional[List[str]] = None,
        strengths: Optional[List[str]] = None,
    ) -> DimensionScore:
        """
        Helper to create DimensionScore.

        Args:
            dimension: Dimension name
            score: Score for this dimension
            weight: Weight in overall evaluation
            gaps: List of gaps identified
            strengths: List of strengths identified

        Returns:
            DimensionScore object
        """
        contribution = score * weight
        return DimensionScore(
            dimension=dimension,
            score=score,
            weight=weight,
            contribution=contribution,
            gaps=gaps or [],
            strengths=strengths or [],
            agent=self.agent_type,
        )
