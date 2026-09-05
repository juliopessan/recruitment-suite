"""Tests for the gap-derived interview guide."""

import pytest

from src.agents.orchestrator import RecruitmentOrchestrator
from src.models.candidate import Candidate, CandidateProfile
from src.models.job import JobDescription
from src.services.interview_guide import MAX_QUESTIONS, build_interview_guide


def _candidate(cv_text: str, years: int = 6, certifications=None) -> Candidate:
    return Candidate(
        profile=CandidateProfile(
            name="Marina Duarte",
            email="marina@example.com",
            total_years_experience=years,
            education=["BSc Computer Science"],
            certifications=certifications or [],
            languages=["English"],
        ),
        cv_text=cv_text,
    )


def _job(required=None, years: int = 8) -> JobDescription:
    return JobDescription(
        id="job_test",
        title="Senior Data Engineer",
        company="Avanade",
        description="Senior data engineering role.",
        required_skills=required if required is not None else ["Python", "Spark", "Azure"],
        nice_to_have_skills=["dbt"],
        years_experience_required=years,
    )


def _guide(candidate, job, language="en-US"):
    result = RecruitmentOrchestrator().evaluate(candidate, job, language=language)
    return result.recommendation.interview_guide


class TestInterviewGuide:
    def test_names_the_missing_required_skills(self):
        guide = _guide(_candidate("Data engineer. Pipelines in Python and SQL."), _job())

        technical = [q for q in guide if "Spark" in q["question"] or "Azure" in q["question"]]
        assert technical, "a skill the record does not evidence should be probed"
        assert "Spark" in technical[0]["question"]
        assert "Azure" in technical[0]["question"]
        # Python is in the CV, so it is not a gap and must not be asked about.
        assert "Python" not in technical[0]["question"]

    def test_missing_skills_share_one_question(self):
        """Three near-identical questions waste the interview and read as a template."""
        guide = _guide(
            _candidate("Analyst. Reporting only."),
            _job(required=["Spark", "Azure", "Kubernetes"]),
        )
        skill_questions = [q for q in guide if "Spark" in q["question"]]
        assert len(skill_questions) == 1

    def test_always_closes_on_corroboration(self):
        """A CV tailored to the job scores well by construction; make them rebuild it."""
        strong = _candidate(
            "Senior engineer. Python, Spark, Azure. Led and mentored three teams. "
            "Presented to executives. MSc. AWS certified.",
            years=12,
            certifications=["AWS Solutions Architect"],
        )
        guide = _guide(strong, _job())
        assert guide, "even a strong candidate gets the corroboration probe"
        assert any("reconstruct" in q["question"].lower() for q in guide)

    def test_every_question_is_complete_and_attributed(self):
        guide = _guide(_candidate("Analyst. Reporting."), _job())
        for q in guide:
            assert set(q) == {"dimension", "focus", "question", "listen_for"}
            # The closing corroboration probe is deliberately dimension-less
            # (it is not tied to one weak score); everything else must be.
            required = {"focus", "question", "listen_for"}
            assert all(str(q[k]).strip() for k in required), q
            assert q["dimension"] or q is guide[-1], q
            # Unresolved i18n interpolation would leave the placeholder behind.
            assert "%{" not in q["question"], q["question"]

    def test_corroboration_question_carries_no_dimension_tag(self):
        """A 'Corroboration / Corroboration' badge would read as a bug."""
        guide = _guide(_candidate("Analyst. Reporting."), _job())
        closing = guide[-1]
        assert "reconstruct" in closing["question"].lower()
        assert closing["dimension"] == ""

    def test_respects_the_question_cap(self):
        guide = _guide(
            _candidate("Nothing relevant here."),
            _job(required=["A", "B", "C", "D", "E", "F", "G", "H"]),
        )
        assert 0 < len(guide) <= MAX_QUESTIONS

    def test_is_deterministic(self):
        candidate, job = _candidate("Analyst. Reporting."), _job()
        assert _guide(candidate, job) == _guide(candidate, job)

    def test_translates_to_pt_br(self):
        candidate, job = _candidate("Analyst. Reporting."), _job()
        en = _guide(candidate, job, language="en-US")
        pt = _guide(candidate, job, language="pt-BR")

        assert len(en) == len(pt)
        assert en[0]["question"] != pt[0]["question"]
        assert "Não há evidência" in pt[0]["question"]
        for q in pt:
            assert "%{" not in q["question"], q["question"]

    def test_handles_an_evaluation_with_no_agent_scores(self):
        """The guide is built from agent output, but must not require it."""
        from src.models.evaluation import Evaluation

        bare = Evaluation(candidate_id="c", job_id="j")
        bare.profile_score = 90
        bare.culture_score = 90
        bare.reference_score = 90

        guide = build_interview_guide(bare, _job(), language="en-US")
        assert len(guide) == 1  # corroboration only


class TestPeopleAnalyticsGuide:
    def test_probes_missing_people_analytics_signals(self):
        candidate = _candidate("HR generalist. Recruiting and onboarding admin.")
        job = _job(required=["Viva Glint"])
        result = RecruitmentOrchestrator().evaluate(
            candidate, job, use_people_analytics=True, language="en-US"
        )
        guide = result.recommendation.interview_guide

        assert guide
        # Agent 02 is not run for these roles, so no technical skill probe.
        assert not any(q["dimension"] == "Technical" for q in guide)
        assert any("no signal" in q["question"].lower() for q in guide)
