"""Agent 02: Technical Skills Evaluator."""

from src.models import Candidate, JobDescription, AgentScore, AgentType
from .base_agent import BaseAgent


class Agent02Technical(BaseAgent):
    """Technical Skills Evaluator."""

    def __init__(self):
        """Initialize Agent 02."""
        super().__init__()
        self.agent_type = AgentType.TECHNICAL
        self.name = "Technical Skills Evaluator"
        self.description = "Evaluates technical depth, frameworks, certifications, hands-on capability"

    def evaluate(self, candidate: Candidate, job: JobDescription) -> AgentScore:
        """Evaluate technical skills."""
        score = 75  # Placeholder
        analysis = f"Technical evaluation for {candidate.profile.name}"
        return self._create_score(score=score, analysis=analysis)
