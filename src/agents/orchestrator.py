"""Recruitment Orchestrator - Coordinates all agents."""

from typing import Optional, List
from src.models import (
    Candidate,
    JobDescription,
    Evaluation,
    EvaluationResult,
    AgentScore,
)
from .agent_01_profile import Agent01Profile
from .agent_02_technical import Agent02Technical
from .agent_03_culture import Agent03Culture
from .agent_04_references import Agent04References
from .agent_05_recommendation import Agent05Recommendation
from .agent_06_people_analytics import Agent06PeopleAnalytics


class RecruitmentOrchestrator:
    """Orchestrates multi-agent evaluation pipeline."""

    def __init__(self):
        """Initialize orchestrator with all agents."""
        self.agent_01 = Agent01Profile()
        self.agent_02 = Agent02Technical()
        self.agent_03 = Agent03Culture()
        self.agent_04 = Agent04References()
        self.agent_05 = Agent05Recommendation()
        self.agent_06 = Agent06PeopleAnalytics()

    def evaluate(
        self,
        candidate: Candidate,
        job: JobDescription,
        use_people_analytics: bool = False,
        playbook: str = "full-evaluation",
    ) -> EvaluationResult:
        """
        Run complete evaluation pipeline.

        Args:
            candidate: Candidate to evaluate
            job: Job description
            use_people_analytics: Include Agent 06 (people analytics)
            playbook: Type of evaluation ('quick-screen', 'full-evaluation', etc.)

        Returns:
            Complete evaluation result with recommendation
        """
        evaluation = Evaluation(
            candidate_id=candidate.id,
            job_id=job.id,
        )

        agent_scores = {}

        # Agent 01: Profile
        print(f"🔍 [Agent 01] Evaluating profile...")
        score_01 = self.agent_01.evaluate(candidate, job)
        agent_scores["01-profile"] = score_01
        evaluation.profile_score = score_01.score

        # Agent 02: Technical (replaced by Agent 06 for people-analytics roles)
        if not use_people_analytics:
            print(f"🔍 [Agent 02] Evaluating technical skills...")
            score_02 = self.agent_02.evaluate(candidate, job)
            agent_scores["02-technical"] = score_02
            evaluation.technical_score = score_02.score

        # Agent 03: Culture
        print(f"🔍 [Agent 03] Evaluating culture fit...")
        score_03 = self.agent_03.evaluate(candidate, job)
        agent_scores["03-culture"] = score_03
        evaluation.culture_score = score_03.score

        # Agent 04: References
        print(f"🔍 [Agent 04] Validating references...")
        score_04 = self.agent_04.evaluate(candidate, job)
        agent_scores["04-references"] = score_04
        evaluation.reference_score = score_04.score

        # Agent 06: People Analytics (optional)
        if use_people_analytics:
            print(f"🔍 [Agent 06] Evaluating people analytics expertise...")
            score_06 = self.agent_06.evaluate(candidate, job)
            agent_scores["06-people-analytics"] = score_06
            evaluation.people_analytics_score = score_06.score

        # Strategic bonus (business case, urgency, rarity)
        evaluation.strategic_bonus = self._calculate_strategic_bonus(job)

        # Calculate final score
        final_score = evaluation.calculate_final_score(
            use_people_analytics=use_people_analytics
        )

        # Agent 05: Recommendation
        print(f"🔍 [Agent 05] Synthesizing recommendation...")
        score_05 = self.agent_05.evaluate(candidate, job, evaluation)
        agent_scores["05-recommendation"] = score_05

        evaluation.agent_scores = agent_scores
        evaluation.confidence = self._calculate_confidence(evaluation, use_people_analytics)

        # Create recommendation
        recommendation = self._create_recommendation(
            evaluation,
            candidate,
            job,
            use_people_analytics,
        )

        return EvaluationResult(
            evaluation=evaluation,
            recommendation=recommendation,
        )

    def _calculate_strategic_bonus(self, job: JobDescription) -> int:
        """Calculate strategic bonus (0-5 points)."""
        bonus = 0

        # Hiring urgency
        if job.hiring_urgency == "High":
            bonus += 2
        elif job.hiring_urgency == "Medium":
            bonus += 1

        # Market rarity
        # (In production, could check market data, skill scarcity, etc.)
        bonus += 2  # Placeholder

        return min(5, bonus)

    def _calculate_confidence(
        self,
        evaluation: Evaluation,
        use_people_analytics: bool = False,
    ) -> int:
        """Calculate confidence level (0-100)."""
        # Start at 90%
        confidence = 90

        # Reduce if any score is very low
        min_score = min(
            evaluation.profile_score,
            self._effective_technical(evaluation, use_people_analytics),
            evaluation.culture_score,
            evaluation.reference_score,
        )

        if min_score < 50:
            confidence -= 20  # Large gap = lower confidence
        elif min_score < 60:
            confidence -= 10  # Minor gap

        # Reduce if references pending
        # (In production, check reference verification status)

        return max(0, min(100, confidence))

    def _effective_technical(
        self,
        evaluation: Evaluation,
        use_people_analytics: bool = False,
    ) -> int:
        """Technical dimension score: Agent 06 replaces Agent 02 for PA roles."""
        if use_people_analytics and evaluation.people_analytics_score is not None:
            return evaluation.people_analytics_score
        return evaluation.technical_score

    def _create_recommendation(
        self,
        evaluation: Evaluation,
        candidate: Candidate,
        job: JobDescription,
        use_people_analytics: bool = False,
    ) -> object:
        """Create final recommendation from evaluation."""
        from src.models import Recommendation, RecommendationStatus

        final_score = evaluation.final_score

        # Determine status
        if final_score >= 75:
            status = RecommendationStatus.GO
            action = "Proceed to offer stage"
        elif final_score >= 30:
            status = RecommendationStatus.HOLD
            action = "Manager discussion or additional data needed"
        else:
            status = RecommendationStatus.NO_GO
            action = "Pass, archive candidate"

        recommendation = Recommendation(
            final_score=final_score,
            status=status,
            rationale=f"Final score {final_score}/100: {action}",
            key_strengths=self._extract_strengths(evaluation, use_people_analytics),
            addressable_gaps=self._extract_gaps(evaluation, use_people_analytics),
            critical_flags=self._extract_flags(evaluation, use_people_analytics),
            next_steps=self._generate_next_steps(status, final_score),
            onboarding_plan=self._generate_onboarding(status),
            confidence_level=evaluation.confidence,
        )

        return recommendation

    def _extract_strengths(
        self,
        evaluation: Evaluation,
        use_people_analytics: bool = False,
    ) -> List[str]:
        """Extract key strengths from evaluation."""
        strengths = []
        scores = {
            "Profile": evaluation.profile_score,
            "Technical": self._effective_technical(evaluation, use_people_analytics),
            "Culture": evaluation.culture_score,
            "References": evaluation.reference_score,
        }

        for dimension, score in scores.items():
            if score >= 80:
                strengths.append(f"Strong {dimension} ({score}/100)")

        return strengths or ["Meets job requirements"]

    def _extract_gaps(
        self,
        evaluation: Evaluation,
        use_people_analytics: bool = False,
    ) -> List[str]:
        """Extract addressable gaps."""
        gaps = []
        scores = {
            "Profile": evaluation.profile_score,
            "Technical": self._effective_technical(evaluation, use_people_analytics),
            "Culture": evaluation.culture_score,
        }

        for dimension, score in scores.items():
            if 60 <= score < 75:
                gaps.append(f"{dimension} gap (learnable): {score}/100")

        return gaps

    def _extract_flags(
        self,
        evaluation: Evaluation,
        use_people_analytics: bool = False,
    ) -> List[str]:
        """Extract critical flags."""
        flags = []
        technical = self._effective_technical(evaluation, use_people_analytics)

        if evaluation.profile_score < 50:
            flags.append(f"Critical Profile gap: {evaluation.profile_score}/100")
        if technical < 50:
            flags.append(f"Critical Technical gap: {technical}/100")

        # Check culture-tech gap
        gap = abs(technical - evaluation.culture_score)
        if gap > 30:
            flags.append(f"Large Culture-Tech gap ({gap} points)")

        return flags

    def _generate_next_steps(
        self,
        status: object,
        final_score: int,
    ) -> List[str]:
        """Generate recommended next steps."""
        from src.models import RecommendationStatus

        steps = []

        if status == RecommendationStatus.GO:
            steps = [
                "✅ Extend offer",
                "✅ Complete reference verification",
                "✅ Background check",
                "✅ Schedule onboarding",
            ]
        elif status == RecommendationStatus.HOLD:
            steps = [
                "🟡 Schedule manager discussion",
                "🟡 Get additional data (skills assessment, etc.)",
                "🟡 Technical interview (if score 60-74)",
                "🟡 Revisit decision in 1 week",
            ]
        else:  # NO_GO
            steps = [
                "❌ Send respectful rejection",
                "❌ Archive candidate",
                "❌ Internal debrief (why we passed?)",
            ]

        return steps

    def _generate_onboarding(self, status: object) -> List[str]:
        """Generate onboarding plan if hired."""
        from src.models import RecommendationStatus

        if status != RecommendationStatus.GO:
            return []

        return [
            "Week 1-2: Orientation & company culture",
            "Week 2-4: Technical deep-dive & skill assessment",
            "Week 4-6: First project (paired with mentor)",
            "Week 6+: Full autonomy & ramp-up",
        ]
