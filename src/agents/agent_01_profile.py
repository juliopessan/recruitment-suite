"""Agent 01: Candidate Profile Evaluator."""

from src.models import Candidate, JobDescription, AgentScore, AgentType
from src.services import typesafe_judge
from .base_agent import BaseAgent

# Relative weights 25 / 30 / 20 / 15, normalised to sum to 1.
W_EXPERIENCE = 0.25 / 0.90
W_EDUCATION = 0.30 / 0.90
W_TRAJECTORY = 0.20 / 0.90
W_LANGUAGES = 0.15 / 0.90


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
        review = []  # ambiguous judgments routed to a person

        # Graded judgments from TypeSafe when available; None -> rule-based paths.
        judged = typesafe_judge.judge_profile(candidate, job)

        # Years of experience
        exp_score = self._evaluate_experience(
            candidate.profile.total_years_experience,
            job.years_experience_required,
            gaps,
            strengths,
        )

        # Education & domain expertise
        if judged is not None:
            edu_score = self._judged_education(judged.education, gaps, strengths, review)
        else:
            edu_score = self._evaluate_education(
                candidate.profile.education,
                job.required_skills,
                gaps,
                strengths,
            )

        # Seniority trajectory
        if judged is not None:
            traj_score = self._judged_trajectory(
                judged, job.seniority_level, gaps, strengths, review
            )
        else:
            traj_score = self._evaluate_trajectory(
                candidate.profile,
                job.seniority_level,
                gaps,
                strengths,
            )

        # Language requirements
        if judged is not None and job.required_languages:
            lang_score = self._judged_languages(judged.languages, gaps, strengths, review)
        else:
            lang_score = self._evaluate_languages(
                candidate.profile.languages,
                job.required_languages,
                gaps,
                strengths,
            )

        # Location / work model used to be a fixed 75 here. Hard constraints
        # now belong to Agent 07 (eligibility), which confirms rather than
        # scores, so the four measured dimensions carry the whole weight.
        score = (
            exp_score * W_EXPERIENCE
            + edu_score * W_EDUCATION
            + traj_score * W_TRAJECTORY
            + lang_score * W_LANGUAGES
        )

        analysis = f"""
Profile Evaluation for {candidate.profile.name}:

**Experience:** {candidate.profile.total_years_experience} years (requires {job.years_experience_required}y)
**Education:** {', '.join(candidate.profile.education or ['Not specified'])}
**Languages:** {', '.join(candidate.profile.languages or ['Not specified'])}

Strengths: {', '.join(strengths) if strengths else 'None detected'}
Gaps: {', '.join(gaps) if gaps else 'None detected'}
{'Education, trajectory and languages judged by TypeSafe.' if judged is not None else ''}
"""

        dimension_scores = [
            self._dimension_score(
                "Years of Experience",
                int(exp_score),
                W_EXPERIENCE,
                gaps=["Experience gap"] if exp_score < 70 else [],
                strengths=["Exceeds requirement"] if exp_score >= 80 else [],
            ),
            self._dimension_score(
                "Education & Domain Expertise",
                int(edu_score),
                W_EDUCATION,
            ),
            self._dimension_score(
                "Career Trajectory",
                int(traj_score),
                W_TRAJECTORY,
            ),
            self._dimension_score(
                "Language Requirements",
                int(lang_score),
                W_LANGUAGES,
            ),
        ]

        return self._create_score(
            score=int(score),
            analysis=analysis,
            dimension_scores=dimension_scores,
            red_flags=gaps,
            recommendations=[f"Consider {gap}" for gap in gaps] + review,
        )

    # --- TypeSafe-judged variants (same 0-100 scale as the rule-based ones) ---

    @staticmethod
    def _judged_education(edu, gaps: list, strengths: list, review: list) -> float:
        """Education relevance: 60 = nothing relevant on record, 100 = directly relevant."""
        if edu.value < 0.5:
            gaps.append("No education details found")
        elif edu.value >= 1.5:
            strengths.append("Education or training relevant to the role")
        if edu.uncertain:
            review.append(typesafe_judge.uncertain_note("education relevance", edu))
        return 60.0 + 40.0 * edu.unit

    @staticmethod
    def _judged_trajectory(
        judged, required_level: str, gaps: list, strengths: list, review: list
    ) -> float:
        """Career growth and scope vs. the target level, blended 50/50 into 50-100."""
        growth, scope = judged.growth, judged.scope
        if growth.value >= 1.5:
            strengths.append("Career progression visible in profile")
        else:
            gaps.append("No clear career progression in profile")
        if scope.value >= 1.5:
            strengths.append(f"Scope matches {required_level} level")
        elif scope.value < 1.0:
            gaps.append(f"Scope below {required_level} level")
        for label, j in (("career progression", growth), (f"{required_level} scope", scope)):
            if j.uncertain:
                review.append(typesafe_judge.uncertain_note(label, j))
        blend = 0.5 * growth.unit + 0.5 * min(1.0, scope.value / 2.0)
        return 50.0 + 50.0 * blend

    @staticmethod
    def _judged_languages(languages: dict, gaps: list, strengths: list, review: list) -> float:
        """Required languages as probabilities, then the same scoring as the rule-based path."""
        missing = [lang for lang, j in languages.items() if j.value < 0.5]
        for lang, j in languages.items():
            if j.uncertain:
                review.append(typesafe_judge.uncertain_note(f"{lang} proficiency", j))
        if not missing:
            strengths.append(f"All required languages: {', '.join(languages)}")
            return 95.0
        gaps.append(f"Missing {len(missing)} required language(s)")
        return max(50.0, 80.0 - len(missing) * 15)

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
