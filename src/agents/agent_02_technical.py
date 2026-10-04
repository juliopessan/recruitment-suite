"""Agent 02: Technical Skills Evaluator."""

from src.models import Candidate, JobDescription, AgentScore, AgentType
from src.services import typesafe_judge
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
        """Evaluate technical skills by matching job skills against the candidate's record."""
        corpus = self._candidate_corpus(candidate)
        gaps = []
        strengths = []
        review = []  # ambiguous judgments routed to a person

        # Graded evidence from TypeSafe when available; None -> literal/LLM matching.
        judged = typesafe_judge.judge_skills(
            candidate, job, job.required_skills, job.nice_to_have_skills
        )

        # Required skills coverage (70%)
        if judged is not None:
            matched_req, missing_req, req_ratio = self._split_by_evidence(
                job.required_skills, judged.required, review
            )
            req_score = 100.0 * req_ratio if job.required_skills else 75.0
        else:
            matched_req, missing_req = self._match_skills(job.required_skills, corpus)
            if job.required_skills:
                req_score = 100.0 * len(matched_req) / len(job.required_skills)
            else:
                req_score = 75.0  # No requirements listed; neutral score
        for skill in matched_req:
            strengths.append(f"Required skill evidenced: {skill}")
        for skill in missing_req:
            gaps.append(f"No evidence of required skill: {skill}")

        # Nice-to-have coverage (15%)
        if judged is not None:
            matched_nice, missing_nice, nice_ratio = self._split_by_evidence(
                job.nice_to_have_skills, judged.nice, review
            )
            nice_score = 100.0 * nice_ratio if job.nice_to_have_skills else 50.0
        else:
            matched_nice, missing_nice = self._match_skills(job.nice_to_have_skills, corpus)
            if job.nice_to_have_skills:
                nice_score = 100.0 * len(matched_nice) / len(job.nice_to_have_skills)
            else:
                nice_score = 50.0
        for skill in matched_nice:
            strengths.append(f"Nice-to-have skill: {skill}")

        # Certifications & continuous learning (15%)
        certs = candidate.profile.certifications or []
        cert_score = min(100.0, 50.0 + 15.0 * len(certs))
        if certs:
            strengths.append(f"{len(certs)} certification(s) on record")
        else:
            gaps.append("No certifications listed")

        score = req_score * 0.70 + nice_score * 0.15 + cert_score * 0.15

        analysis = (
            f"Technical evaluation for {candidate.profile.name}: "
            f"{len(matched_req)}/{len(job.required_skills)} required skills evidenced"
            f" ({', '.join(matched_req) if matched_req else 'none'}); "
            f"{len(matched_nice)}/{len(job.nice_to_have_skills)} nice-to-have skills; "
            f"{len(certs)} certification(s)."
            f"{' Evidence depth judged by TypeSafe.' if judged is not None else ''}"
        )

        dimension_scores = [
            self._dimension_score(
                "Required Skills Coverage", int(req_score), 0.70,
                gaps=[f"Missing: {s}" for s in missing_req],
                strengths=[f"Has: {s}" for s in matched_req],
                gap_items=list(missing_req),
                strength_items=list(matched_req),
            ),
            self._dimension_score(
                "Nice-to-have Skills", int(nice_score), 0.15,
                gap_items=list(missing_nice),
                strength_items=list(matched_nice),
            ),
            self._dimension_score("Certifications", int(cert_score), 0.15),
        ]

        return self._create_score(
            score=int(score),
            analysis=analysis,
            dimension_scores=dimension_scores,
            red_flags=[g for g in gaps if "required" in g],
            recommendations=[f"Probe in interview: {s}" for s in missing_req] + review,
        )

    @staticmethod
    def _split_by_evidence(skills, judgments, review):
        """Turn graded skill judgments into (matched, missing, coverage ratio).

        A skill counts as evidenced from "used in a described role" upward
        (level >= 1.5 of 3). Credit is graded: only being named earns about a
        third, a described use earns full credit. Ambiguous judgments are
        appended to `review` for a person to verify.
        """
        matched, missing, credit = [], [], 0.0
        for skill, j in zip(skills, judgments):
            credit += min(1.0, j.value / 2.0)
            (matched if j.value >= 1.5 else missing).append(skill)
            if j.uncertain:
                review.append(typesafe_judge.uncertain_note(skill, j))
        ratio = credit / len(skills) if skills else 0.0
        return matched, missing, ratio
