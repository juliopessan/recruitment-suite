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
        """Score the verifiability of the candidate's track record.

        Real reference calls happen offline; here we score how much of the
        record is independently verifiable (public profiles, dated education,
        named employers/certifiers).
        """
        strengths = []
        gaps = []
        score = 50.0  # Base: unverified record

        profile = candidate.profile

        if profile.linkedin_url:
            score += 15.0
            strengths.append("LinkedIn profile provided")
        else:
            gaps.append("No LinkedIn profile for cross-checking")

        if profile.github_url:
            score += 5.0
            strengths.append("GitHub profile provided")

        if profile.education:
            score += 10.0
            # Dated entries (e.g. "2011-2017") are easier to verify
            if any(any(ch.isdigit() for ch in e) for e in profile.education):
                score += 5.0
                strengths.append("Education entries include verifiable dates/institutions")

        if profile.certifications:
            score += 10.0
            strengths.append(f"{len(profile.certifications)} certification(s) verifiable with issuers")

        if candidate.cv_text and len(candidate.cv_text) > 100:
            score += 5.0
        elif not candidate.cv_text:
            gaps.append("No CV text provided")

        score = min(100.0, score)

        analysis = (
            f"Reference validation for {profile.name}: verifiability score "
            f"{int(score)}/100 based on public profiles, dated education and "
            f"certifications. Formal reference calls still pending."
        )

        return self._create_score(
            score=int(score),
            analysis=analysis,
            dimension_scores=[
                self._dimension_score("Record Verifiability", int(score), 1.0,
                                      gaps=gaps, strengths=strengths),
            ],
            red_flags=gaps,
            recommendations=["Complete formal reference calls before offer"],
        )
