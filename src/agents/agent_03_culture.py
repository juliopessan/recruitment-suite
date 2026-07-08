"""Agent 03: Culture Fit Analyzer."""

from src.models import Candidate, JobDescription, AgentScore, AgentType
from .base_agent import BaseAgent


class Agent03Culture(BaseAgent):
    """Culture Fit Analyzer."""

    def __init__(self):
        """Initialize Agent 03."""
        super().__init__()
        self.agent_type = AgentType.CULTURE
        self.name = "Culture Fit Analyzer"
        self.description = "Evaluates soft skills, collaboration, mentoring, team dynamics"

    def evaluate(self, candidate: Candidate, job: JobDescription) -> AgentScore:
        """Evaluate culture fit."""
        score = 80  # Placeholder
        analysis = f"Culture fit evaluation for {candidate.profile.name}"
        return self._create_score(score=score, analysis=analysis)
