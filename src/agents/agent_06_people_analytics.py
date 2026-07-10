"""Agent 06: People Analytics Specialist Evaluator."""

from src.models import Candidate, JobDescription, AgentScore, AgentType
from .base_agent import BaseAgent

# Domain-specific expertise signals for People Analytics roles.
# People Analytics / Employee Experience consultant roles are a genuine
# hybrid of HR and technical competencies (e.g. a Viva Glint / Employee
# Experience Consultant JD requires both quantitative/statistical rigor
# AND executive stakeholder storytelling AND change management) — these
# dimensions cover both sides so neither is underweighted.
PA_SIGNALS = {
    "Employee Listening Platforms": [
        "viva glint", "glint", "viva insights", "qualtrics", "culture amp", "peakon",
    ],
    "Analytics & Statistics": [
        "people analytics", "statistic", "quantitative", "inferential",
        "data analysis", "power bi", "python", "r ",
    ],
    "Organizational Psychology": ["psychology", "organizational", "behavioral", "engagement"],
    "Survey & Listening Programs": ["survey", "listening", "feedback", "pulse", "employee lifecycle"],
    "HR Domain Experience": [
        "hr ", "human resources", "people management", "talent",
        "leadership development", "hr metrics",
    ],
    "Executive Stakeholder Engagement": [
        "executive", "storytelling", "stakeholder", "chro", "c-level", "presentation",
    ],
    "Change Management & Transformation": [
        "change management", "transformation", "enablement", "adoption",
    ],
    "Microsoft Ecosystem": ["microsoft viva", "viva suite", "m365", "copilot", "teams"],
}


class Agent06PeopleAnalytics(BaseAgent):
    """People Analytics Specialist Evaluator (Optional)."""

    def __init__(self):
        """Initialize Agent 06."""
        super().__init__()
        self.agent_type = AgentType.PEOPLE_ANALYTICS
        self.name = "People Analytics Specialist"
        self.description = (
            "Evaluates People Analytics expertise (Viva Glint, statistics, org psychology)"
        )

    def evaluate(self, candidate: Candidate, job: JobDescription) -> AgentScore:
        """
        Evaluate people analytics expertise.

        Only invoked for HR/People roles that require People Science expertise.
        """
        corpus = " " + self._candidate_corpus(candidate) + " "
        strengths = []
        gaps = []
        dimension_scores = []
        weight = 1.0 / len(PA_SIGNALS)

        total = 0.0
        for dimension, signals in PA_SIGNALS.items():
            hits = [s.strip() for s in signals if s in corpus]
            if hits:
                dim_score = min(100.0, 70.0 + 15.0 * len(hits))
                strengths.append(f"{dimension}: {', '.join(hits)}")
            else:
                dim_score = 40.0
                gaps.append(f"No evidence of {dimension}")
            total += dim_score * weight
            dimension_scores.append(
                self._dimension_score(dimension, int(dim_score), weight,
                                      strengths=hits)
            )

        score = int(total)
        analysis = (
            f"People Analytics evaluation for {candidate.profile.name}: "
            f"{len(strengths)}/{len(PA_SIGNALS)} expertise dimensions evidenced. "
            f"{'; '.join(strengths) if strengths else 'No domain signals found.'}"
        )

        return self._create_score(
            score=score,
            analysis=analysis,
            dimension_scores=dimension_scores,
            red_flags=gaps,
            recommendations=[f"Assess in case study: {g[15:]}" for g in gaps],
        )
