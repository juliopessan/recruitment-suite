"""Agent 04: Reference Validator."""

from src.models import Candidate, JobDescription, AgentScore, AgentType
from .base_agent import BaseAgent


class Agent04References(BaseAgent):
    """Reference Validator."""

    def __init__(self):
        """Initialize Agent 04."""
        super().__init__()
        self.agent_type = AgentType.REFERENCES
        self.name = "Reference Validator"
        self.description = "Validates track record, reference quality, achievement credibility"

    def evaluate(self, candidate: Candidate, job: JobDescription) -> AgentScore:
        """Evaluate references."""
        score = 82  # Placeholder
        analysis = f"Reference validation for {candidate.profile.name}"
        return self._create_score(score=score, analysis=analysis)
