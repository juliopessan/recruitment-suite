"""Agent 05: Hiring Recommendation Engine."""

from typing import Optional
from src.models import (
    Candidate,
    JobDescription,
    AgentScore,
    Evaluation,
    Recommendation,
    RecommendationStatus,
    AgentType,
)
from .base_agent import BaseAgent


class Agent05Recommendation(BaseAgent):
    """Hiring Recommendation Engine - Orchestrates final decision."""

    def __init__(self):
        """Initialize Agent 05."""
        super().__init__()
        self.agent_type = AgentType.RECOMMENDATION
        self.name = "Hiring Recommendation Engine"
        self.description = "Synthesizes all evaluations and emits final hiring decision"

    def evaluate(
        self,
        candidate: Candidate,
        job: JobDescription,
        evaluation: Optional[Evaluation] = None,
    ) -> AgentScore:
        """
        Synthesize all scores and create recommendation.

        Args:
            candidate: Candidate profile
            job: Job description
            evaluation: Complete evaluation with all agent scores

        Returns:
            AgentScore with final recommendation
        """
        if not evaluation:
            # No previous evaluation - create placeholder
            score = 75
            analysis = "No evaluation data available"
            return self._create_score(score=score, analysis=analysis)

        # Final score was already computed by the orchestrator (with the correct
        # people-analytics weighting); recalculating here would overwrite it.
        final_score = evaluation.final_score

        # Determine recommendation
        recommendation = Recommendation.from_score(final_score, confidence=88)

        analysis = f"""
FINAL HIRING RECOMMENDATION

Candidate: {candidate.profile.name}
Position: {job.title} at {job.company}

Final Score: {final_score}/100
Recommendation: {recommendation.status.value}
Confidence: {recommendation.confidence_level}%

Score Breakdown:
- Profile: {evaluation.profile_score}/100 (20%)
- Technical: {evaluation.technical_score}/100 (35%)
- Culture: {evaluation.culture_score}/100 (25%)
- References: {evaluation.reference_score}/100 (15%)
- Strategic Bonus: +{evaluation.strategic_bonus}

Key Strengths:
{chr(10).join(f'• {s}' for s in recommendation.key_strengths)}

Addressable Gaps:
{chr(10).join(f'• {g}' for g in recommendation.addressable_gaps)}

Critical Flags:
{chr(10).join(f'• {f}' for f in recommendation.critical_flags) if recommendation.critical_flags else '• None detected'}

Next Steps:
{chr(10).join(f'• {step}' for step in recommendation.next_steps)}

Onboarding Plan:
{chr(10).join(f'• {step}' for step in (recommendation.onboarding_plan or [])) if recommendation.onboarding_plan else '• TBD'}
"""

        return self._create_score(
            score=final_score,
            analysis=analysis,
            red_flags=recommendation.critical_flags,
            recommendations=recommendation.next_steps,
        )
