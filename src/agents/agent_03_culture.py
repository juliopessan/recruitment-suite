"""Agent 03: Culture Fit Analyzer."""

from src.models import Candidate, JobDescription, AgentScore, AgentType
from .base_agent import BaseAgent

# Signals of collaboration, leadership and adaptability we look for in the record
SOFT_SKILL_SIGNALS = [
    "leadership", "mentor", "coach", "collaborat", "team", "stakeholder",
    "communication", "culture", "engagement", "change management",
    "transformation", "advisor", "facilitat", "cross-functional",
]


class Agent03Culture(BaseAgent):
    """Culture Fit Analyzer."""

    def __init__(self):
        """Initialize Agent 03."""
        super().__init__()
        self.agent_type = AgentType.CULTURE
        self.name = "Culture Fit Analyzer"
        self.description = "Evaluates soft skills, collaboration, mentoring, team dynamics"

    def evaluate(self, candidate: Candidate, job: JobDescription) -> AgentScore:
        """Evaluate culture fit from soft-skill signals and team-context alignment."""
        corpus = self._candidate_corpus(candidate)
        strengths = []
        gaps = []

        # Soft-skill signals in the candidate record (60%)
        found = [s for s in SOFT_SKILL_SIGNALS if s in corpus]
        signal_score = min(100.0, 55.0 + 8.0 * len(found))
        if found:
            strengths.append(f"Soft-skill signals: {', '.join(found[:6])}")
        else:
            gaps.append("No soft-skill signals detected in candidate record")
            signal_score = 55.0

        # Alignment with the job's team context (25%)
        context_score = 70.0
        if job.team_context:
            context_tokens = [
                t for t in job.team_context.lower().replace(",", " ").split()
                if len(t) > 4
            ]
            hits = [t for t in context_tokens if t in corpus]
            context_score = min(100.0, 60.0 + 10.0 * len(hits))
            if hits:
                strengths.append(f"Team-context alignment: {', '.join(sorted(set(hits))[:5])}")

        # Language/communication readiness (15%) — multilingual is a proxy for
        # cross-cultural collaboration in global teams
        n_langs = len(candidate.profile.languages or [])
        lang_score = min(100.0, 60.0 + 15.0 * n_langs)
        if n_langs >= 2:
            strengths.append(f"Multilingual ({n_langs} languages)")

        score = signal_score * 0.60 + context_score * 0.25 + lang_score * 0.15

        analysis = (
            f"Culture fit for {candidate.profile.name}: "
            f"{len(found)} soft-skill signal(s) detected; "
            f"{n_langs} language(s). "
            f"{'Strengths: ' + '; '.join(strengths) if strengths else 'Limited evidence available.'}"
        )

        dimension_scores = [
            self._dimension_score("Soft-skill Signals", int(signal_score), 0.60),
            self._dimension_score("Team-context Alignment", int(context_score), 0.25),
            self._dimension_score("Communication Readiness", int(lang_score), 0.15),
        ]

        return self._create_score(
            score=int(score),
            analysis=analysis,
            dimension_scores=dimension_scores,
            red_flags=gaps,
            recommendations=(
                ["Validate soft skills in behavioral interview"] if gaps else []
            ),
        )
