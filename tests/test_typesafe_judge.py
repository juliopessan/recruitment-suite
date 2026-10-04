"""Tests for the TypeSafe judgment layer and its fallbacks.

A fake client stands in for the API: it answers every question from a
caller-supplied function, so these tests pin down how answers become scores,
review items and fallbacks, not what Jev would say.
"""

from types import SimpleNamespace

import pytest

from src.agents.agent_01_profile import Agent01Profile
from src.agents.agent_02_technical import Agent02Technical
from src.agents.agent_03_culture import Agent03Culture
from src.agents.agent_04_references import Agent04References
from src.agents.orchestrator import RecruitmentOrchestrator
from src.models import Candidate, JobDescription
from src.services import typesafe_judge as tj


def _candidate(cv="Built data platforms on Amazon Web Services.", linkedin=None):
    return Candidate(
        id="c1",
        profile={
            "name": "Maria Souza",
            "email": "maria@example.com",
            "total_years_experience": 9,
            "languages": [],
            "education": [],
            "certifications": [],
        },
        cv_text=cv,
        linkedin_profile=linkedin,
    )


def _job(**kw):
    base = dict(
        id="j1",
        title="Data Engineer",
        company="Acme",
        description="Build data platforms on cloud infrastructure.",
        required_skills=["AWS", "Kubernetes"],
        nice_to_have_skills=["Terraform"],
        years_experience_required=8,
        seniority_level="Senior",
        required_languages=["English"],
    )
    base.update(kw)
    return JobDescription(**base)


class FakeClient:
    """Answers each question via `answer(qid_instructions, question) -> (value, confidence)`."""

    def __init__(self, answer, calls):
        self._answer, self._calls = answer, calls

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def system_one(self, state, questions):
        self._calls.append((state, questions))
        answers = {}
        for qid, q in questions.items():
            value, conf = self._answer(qid, q)
            if q.type == "noul":
                answers[qid] = SimpleNamespace(type="noul", noul=value)
            else:
                answers[qid] = SimpleNamespace(type="score", score=value, confidence=conf)
        return SimpleNamespace(answers=answers)


@pytest.fixture
def typesafe(monkeypatch):
    """Enable TypeSafe with a fake client. Returns (set_answer, calls)."""
    monkeypatch.setenv("TYPESAFE_API_KEY", "test-key")
    tj._CACHE.clear()
    calls: list = []
    holder = {"answer": lambda qid, q: (0.0, 1.0)}
    monkeypatch.setattr(
        tj, "_open_client", lambda: FakeClient(lambda *a: holder["answer"](*a), calls)
    )
    def set_answer(fn):
        # Same request + new simulated answers must not be served from the cache.
        tj._CACHE.clear()
        holder["answer"] = fn

    yield set_answer, calls
    tj._CACHE.clear()


class TestFallbacks:
    def test_unconfigured_never_builds_a_client(self, monkeypatch):
        def explode():
            raise AssertionError("no client without a key")

        monkeypatch.setattr(tj, "_open_client", explode)
        assert tj.judge_skills(_candidate(), _job(), ["AWS"], []) is None
        assert tj.judge_profile(_candidate(), _job()) is None

    def test_api_failure_returns_none_and_agent_uses_rules(self, typesafe, monkeypatch):
        class Boom:
            def __enter__(self):
                raise ConnectionError("down")

            def __exit__(self, *a):
                return False

        monkeypatch.setattr(tj, "_open_client", lambda: Boom())
        with_rules = Agent02Technical().evaluate(_candidate(), _job())

        monkeypatch.delenv("TYPESAFE_API_KEY")
        baseline = Agent02Technical().evaluate(_candidate(), _job())
        assert with_rules.score == baseline.score
        assert "TypeSafe" not in with_rules.analysis

    def test_missing_answer_falls_back(self, typesafe, monkeypatch):
        class Partial(FakeClient):
            def system_one(self, state, questions):
                return SimpleNamespace(answers={})

        monkeypatch.setattr(tj, "_open_client", lambda: Partial(None, []))
        assert tj.judge_profile(_candidate(), _job()) is None


class TestSkills:
    def test_depth_changes_the_score_and_lists(self, typesafe):
        set_answer, _ = typesafe
        # AWS used in depth; Kubernetes only named; Terraform absent.
        levels = {"req:0": 3.0, "req:1": 1.0, "nice:0": 0.0}
        set_answer(lambda qid, q: (levels[qid], 0.9))

        result = Agent02Technical().evaluate(_candidate(), _job())
        dims = {d.dimension: d for d in result.dimension_scores}

        req = dims["Required Skills Coverage"]
        assert req.strength_items == ["AWS"]
        assert req.gap_items == ["Kubernetes"]  # named-only is not evidence
        # credit: AWS 1.0 + Kubernetes 0.5 over 2 required skills = 75
        assert req.score == 75
        assert "TypeSafe" in result.analysis

    def test_one_request_carries_every_skill_question(self, typesafe):
        _, calls = typesafe
        Agent02Technical().evaluate(_candidate(), _job())
        assert len(calls) == 1
        assert set(calls[0][1]) == {"req:0", "req:1", "nice:0"}

    def test_ambiguous_skill_is_routed_to_a_person(self, typesafe):
        set_answer, _ = typesafe
        set_answer(lambda qid, q: (2.0, 0.2))

        result = Agent02Technical().evaluate(_candidate(), _job())
        flagged = [r for r in result.recommendations if r.startswith(tj.UNCERTAIN_PREFIX)]
        assert len(flagged) == 3
        assert "AWS" in flagged[0] and "0.20" in flagged[0]


class TestCulture:
    def test_buzzword_scores_below_demonstrated_outcome(self, typesafe):
        set_answer, _ = typesafe
        job = _job(team_context=None)

        set_answer(lambda qid, q: (1.0, 0.9))  # generic claims everywhere
        generic = Agent03Culture().evaluate(_candidate(), job).score

        set_answer(lambda qid, q: (3.0, 0.9))  # concrete outcomes everywhere
        demonstrated = Agent03Culture().evaluate(_candidate(), job).score

        assert demonstrated > generic

    def test_themes_feed_the_interview_guide_items(self, typesafe):
        set_answer, _ = typesafe
        set_answer(lambda qid, q: (3.0, 0.9) if qid == "theme:Leadership" else (0.0, 0.9))

        result = Agent03Culture().evaluate(_candidate(), _job())
        dim = result.dimension_scores[0]
        assert dim.strength_items == ["Leadership"]
        assert "Mentoring & coaching" in dim.gap_items


class TestProfile:
    def test_languages_come_from_the_record_not_the_empty_profile(self, typesafe):
        set_answer, _ = typesafe
        set_answer(lambda qid, q: (0.97, 0.94) if qid == "lang:0" else (2.0, 0.9))

        result = Agent01Profile().evaluate(_candidate(), _job())
        lang = next(d for d in result.dimension_scores if d.dimension == "Language Requirements")
        assert lang.score == 95  # profile.languages is [] yet English is evidenced

    def test_missing_language_is_penalised(self, typesafe):
        set_answer, _ = typesafe
        set_answer(lambda qid, q: (0.03, 0.94) if qid == "lang:0" else (2.0, 0.9))

        result = Agent01Profile().evaluate(_candidate(), _job())
        lang = next(d for d in result.dimension_scores if d.dimension == "Language Requirements")
        assert lang.score == 65


class TestReferences:
    def test_confident_contradiction_is_flagged_as_verify_not_verdict(self, typesafe):
        set_answer, _ = typesafe
        set_answer(lambda qid, q: (0.95, 0.9) if qid == "inconsistency" else (2.0, 0.9))
        candidate = _candidate(linkedin={"title": "Maria S - Engineer", "text": "Acme 2015-2020"})

        result = Agent04References().evaluate(candidate, _job())
        assert any("may disagree" in g for g in result.red_flags)
        assert any(r.startswith(tj.UNCERTAIN_PREFIX) for r in result.recommendations)

    def test_no_comparison_question_without_both_sources(self, typesafe):
        _, calls = typesafe
        Agent04References().evaluate(_candidate(linkedin=None), _job())
        assert set(calls[0][1]) == {"concreteness"}


class TestOrchestrator:
    def test_ambiguity_lowers_confidence_and_adds_next_steps(self, typesafe):
        set_answer, _ = typesafe
        job = _job()

        set_answer(lambda qid, q: (2.0, 0.95) if q.type == "score" else (0.9, 0.8))
        sure = RecruitmentOrchestrator().evaluate(_candidate(), job)

        tj._CACHE.clear()
        set_answer(lambda qid, q: (2.0, 0.1) if q.type == "score" else (0.9, 0.8))
        unsure = RecruitmentOrchestrator().evaluate(_candidate(), job)

        assert unsure.evaluation.confidence < sure.evaluation.confidence
        assert any(
            s.startswith(tj.UNCERTAIN_PREFIX) for s in unsure.recommendation.next_steps
        )
        assert not any(
            s.startswith(tj.UNCERTAIN_PREFIX) for s in sure.recommendation.next_steps
        )

    def test_confidence_penalty_is_capped(self, typesafe):
        set_answer, _ = typesafe
        set_answer(lambda qid, q: (2.0, 0.0) if q.type == "score" else (0.5, 0.0))
        result = RecruitmentOrchestrator().evaluate(_candidate(), _job())
        assert result.evaluation.confidence >= 90 - 20 - 20


class TestState:
    def test_pii_is_redacted_before_leaving_the_server(self, typesafe):
        _, calls = typesafe
        cv = "Maria Souza\nmaria@example.com | +55 11 91234-5678\nBuilt platforms on AWS."
        tj.judge_skills(_candidate(cv=cv), _job(), ["AWS"], [])

        sent = str(calls[0][0])
        assert "maria@example.com" not in sent
        assert "91234" not in sent
        assert "Maria Souza" not in sent
        assert "AWS" in sent

    def test_linkedin_is_not_duplicated_into_the_cv_field(self, typesafe):
        cv = "Built platforms.\n\n[LinkedIn]\nHeadline text from LinkedIn"
        candidate = _candidate(cv=cv, linkedin={"title": "Maria - Eng", "text": "Headline text from LinkedIn"})
        state = tj._state(candidate, _job())
        assert "Headline" not in state["candidate"]["cv"]
        assert "Headline" in state["candidate"]["linkedin"]

    def test_every_question_tells_the_model_to_ignore_personal_attributes(self, typesafe):
        _, calls = typesafe
        Agent01Profile().evaluate(_candidate(), _job())
        for q in calls[0][1].values():
            assert "ignore the person's name, age, gender" in q.instructions

    def test_sdk_accepts_the_questions_we_build(self):
        """Guards against SDK signature drift without touching the network."""
        for spec in (tj._score("q", tj.SKILL_LEVELS), tj._noul("q")):
            assert tj._to_sdk_question(spec).type == spec["type"]

    def test_identical_requests_hit_the_cache(self, typesafe):
        _, calls = typesafe
        tj.judge_profile(_candidate(), _job())
        tj.judge_profile(_candidate(), _job())
        assert len(calls) == 1
