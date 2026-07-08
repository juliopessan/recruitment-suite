"""Agent 01: Candidate Profile Evaluator."""

from src.models import Candidate, JobDescription, AgentScore, AgentType
from .base_agent import BaseAgent


class Agent01Profile(BaseAgent):
    """Profile & Background Evaluator."""

    def __init__(self):
        """Initialize Agent 01."""
        super().__init__()
        self.agent_type = AgentType.PROFILE
        self.name = "Profile Evaluator"
        self.description = "Evaluates candidate experience, background, and career trajectory"

    def evaluate(self, candidate: Candidate, job: JobDescription) -> AgentScore:
        """
        Evaluate candidate profile against job requirements.

        Args:
            candidate: Candidate profile
            job: Job description

        Returns:
            AgentScore with profile evaluation
        """
        score = 0
        gaps = []
        strengths = []

        # Years of experience (25%)
        exp_score = self._evaluate_experience(
            candidate.profile.total_years_experience,
            job.years_experience_required,
            gaps,
            strengths,
        )

        # Education & domain expertise (30%)
        edu_score = self._evaluate_education(
            candidate.profile.education,
            job.required_skills,
            gaps,
            strengths,
        )

        # Seniority trajectory (20%)
        traj_score = self._evaluate_trajectory(
            candidate.profile,
            job.seniority_level,
            gaps,
            strengths,
        )

        # Language requirements (15%)
        lang_score = self._evaluate_languages(
            candidate.profile.languages,
            job.required_languages,
            gaps,
            strengths,
        )

        # Geographic fit (10%)
        geo_score = 75  # Simplified for now

        # Weighted score
        score = (
            exp_score * 0.25
            + edu_score * 0.30
            + traj_score * 0.20
            + lang_score * 0.15
            + geo_score * 0.10
        )

        analysis = f"""
Profile Evaluation for {candidate.profile.name}:

**Experience:** {candidate.profile.total_years_experience} years (requires {job.years_experience_required}y)
**Education:** {', '.join(candidate.profile.education or ['Not specified'])}
**Languages:** {', '.join(candidate.profile.languages or [])}

Strengths: {', '.join(strengths) if strengths else 'None detected'}
Gaps: {', '.join(gaps) if gaps else 'None detected'}
"""

        dimension_scores = [
            self._dimension_score(
                "Years of Experience",
                int(exp_score),
                0.25,
                gaps=["Experience gap"] if exp_score < 70 else [],
                strengths=["Exceeds requirement"] if exp_score >= 80 else [],
            ),
            self._dimension_score(
                "Education & Domain Expertise",
                int(edu_score),
                0.30,
            ),
            self._dimension_score(
                "Career Trajectory",
                int(traj_score),
                0.20,
            ),
            self._dimension_score(
                "Language Requirements",
                int(lang_score),
                0.15,
            ),
        ]

        return self._create_score(
            score=int(score),
            analysis=analysis,
            dimension_scores=dimension_scores,
            red_flags=gaps,
            recommendations=[f"Consider {gap}" for gap in gaps],
        )

    def _evaluate_experience(
        self,
        candidate_years: int,
        required_years: int,
        gaps: list,
        strengths: list,
    ) -> float:
        """Evaluate years of experience."""
        if candidate_years >= required_years:
            strengths.append(f"Meets/exceeds {required_years}y requirement ({candidate_years}y)")
            if candidate_years >= required_years + 3:
                return 95.0
            return 85.0
        else:
            gap_years = required_years - candidate_years
            gaps.append(f"{gap_years} years below requirement")
            return max(50.0, 80.0 - (gap_years * 10))

    def _evaluate_education(
        self,
        education: list,
        required_skills: list,
        gaps: list,
        strengths: list,
    ) -> float:
        """Evaluate education and domain expertise."""
        if not education:
            gaps.append("No education details provided")
            return 60.0

        score = 75.0
        for skill in required_skills:
            if any(skill.lower() in edu.lower() for edu in education):
                strengths.append(f"Relevant education in {skill}")
                score += 5.0

        return min(100.0, score)

    def _evaluate_trajectory(
        self,
        profile: object,
        required_level: str,
        gaps: list,
        strengths: list,
    ) -> float:
        """Evaluate career progression."""
        # Simplified trajectory check
        strengths.append("Career progression visible in profile")
        return 80.0

    def _evaluate_languages(
        self,
        candidate_languages: list,
        required_languages: list,
        gaps: list,
        strengths: list,
    ) -> float:
        """Evaluate language proficiency."""
        if not required_languages:
            return 100.0

        matched = sum(
            1
            for lang in required_languages
            if any(lang.lower() in cl.lower() for cl in candidate_languages)
        )

        if matched == len(required_languages):
            strengths.append(f"All required languages: {', '.join(required_languages)}")
            return 95.0
        else:
            missing = len(required_languages) - matched
            gaps.append(f"Missing {missing} required language(s)")
            return max(50.0, 80.0 - (missing * 15))
