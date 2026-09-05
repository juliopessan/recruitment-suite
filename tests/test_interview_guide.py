"""Tests for the 5-question technical + behavioral interview pack."""

from src.agents.orchestrator import RecruitmentOrchestrator
from src.models.candidate import Candidate, CandidateProfile
from src.models.evaluation import Evaluation
from src.models.job import JobDescription
from src.services.interview_guide import PACK_SIZE, build_interview_guide


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


def _job(required=None, years: int = 8, team_context=None, responsibilities=None) -> JobDescription:
    return JobDescription(
        id="job_test",
        title="Senior Data Engineer",
        company="Avanade",
        description="Senior data engineering role.",
        required_skills=required if required is not None else ["Python", "Spark", "Azure"],
        nice_to_have_skills=["dbt"],
        years_experience_required=years,
        team_context=team_context,
        responsibilities=responsibilities or [],
    )


def _pack(candidate, job, language="en-US", use_people_analytics=False):
    result = RecruitmentOrchestrator().evaluate(
        candidate, job, use_people_analytics=use_people_analytics, language=language
    )
    return result.recommendation.interview_guide


class TestPackShape:
    def test_pack_has_exactly_five_questions(self):
        pack = _pack(_candidate("Data engineer. Pipelines in Python and SQL."), _job())
        assert len(pack) == PACK_SIZE

    def test_every_question_is_complete(self):
        pack = _pack(_candidate("Analyst. Reporting only."), _job())
        for q in pack:
            assert set(q) == {"dimension", "focus", "question", "listen_for"}
            assert all(str(v).strip() for v in q.values()), q
            assert "%{" not in q["question"], q["question"]  # unresolved i18n interpolation

    def test_mixes_technical_and_behavioral(self):
        pack = _pack(_candidate("Analyst. Reporting only."), _job())
        kinds = {q["dimension"] for q in pack}
        # At least one technical-axis label (Technical or People Analytics)
        # and the Behavioral label must both appear in a 5-question pack.
        assert "Behavioral" in kinds
        assert kinds - {"Behavioral"}, "expected at least one non-behavioral (technical) question"

    def test_is_deterministic(self):
        candidate, job = _candidate("Analyst. Reporting only."), _job()
        assert _pack(candidate, job) == _pack(candidate, job)

    def test_direct_call_without_job_still_returns_full_pack(self):
        """Defensive: build_interview_guide is public and may be called bare."""
        bare = Evaluation(candidate_id="c", job_id="j")
        bare.profile_score = 70
        bare.culture_score = 70
        bare.reference_score = 70
        pack = build_interview_guide(bare, candidate=None, job=None, language="en-US")
        assert len(pack) == PACK_SIZE


class TestTechnicalSlots:
    def test_first_slot_names_a_missing_required_skill(self):
        pack = _pack(_candidate("Data engineer. Pipelines in Python and SQL."), _job())
        assert "Spark" in pack[0]["question"]
        assert "Azure" in pack[0]["question"]
        assert "Python" not in pack[0]["question"]  # not a gap — already evidenced

    def test_missing_skills_share_one_question_not_one_each(self):
        pack = _pack(
            _candidate("Analyst. Reporting only."),
            _job(required=["Spark", "Azure", "Kubernetes"]),
        )
        skill_questions = [q for q in pack if "Spark" in q["question"]]
        assert len(skill_questions) == 1

    def test_strong_candidate_gets_a_depth_question_not_a_pass(self):
        """A real chat still probes a strength — it isn't only gap-hunting."""
        strong = _candidate(
            "Senior engineer. Python, Spark, Azure. Led and mentored three teams.",
            years=12,
            certifications=["AWS Solutions Architect"],
        )
        pack = _pack(strong, _job())
        tech_q = pack[0]
        assert any(name in tech_q["question"] for name in ("Python", "Spark", "Azure"))
        assert "no evidence" not in tech_q["question"].lower()

    def test_second_slot_grounds_in_the_jds_own_responsibility(self):
        pack = _pack(
            _candidate("Data engineer."),
            _job(responsibilities=["Own the ingestion pipeline SLAs"]),
        )
        assert any("ingestion pipeline SLAs" in q["question"] for q in pack)


class TestBehavioralSlots:
    def test_third_slot_uses_the_jds_team_context(self):
        pack = _pack(
            _candidate("Data engineer."),
            _job(team_context="A cross-functional squad shipping weekly"),
        )
        assert any(
            "cross-functional squad shipping weekly" in q["question"] for q in pack
        )

    def test_behavioral_questions_ask_for_a_story(self):
        pack = _pack(_candidate("Analyst. Reporting only."), _job())
        behavioral = [q for q in pack if q["dimension"] == "Behavioral"]
        assert behavioral
        for q in behavioral:
            assert "story" in q["question"].lower() or "situation" in q["question"].lower()

    def test_fourth_slot_names_a_missing_behavioral_theme(self):
        pack = _pack(_candidate("Analyst. Reporting only, no team mentions."), _job())
        theme_questions = [q for q in pack if q["focus"] in {
            "Leadership", "Mentoring & coaching", "Cross-functional collaboration",
            "Stakeholder communication", "Change & transformation",
        }]
        assert theme_questions

    def test_closing_slot_asks_to_reconstruct_a_claim(self):
        pack = _pack(_candidate("Data engineer. Python, Spark, Azure."), _job())
        closing = pack[-1]
        assert "reconstruct" in closing["question"].lower() or "achievement" in closing["question"].lower()


class TestTranslation:
    def test_translates_to_pt_br(self):
        candidate, job = _candidate("Analyst. Reporting only."), _job()
        en = _pack(candidate, job, language="en-US")
        pt = _pack(candidate, job, language="pt-BR")

        assert len(en) == len(pt) == PACK_SIZE
        assert en[0]["question"] != pt[0]["question"]
        for q in pt:
            assert "%{" not in q["question"], q["question"]


class TestPeopleAnalyticsPack:
    def test_uses_people_analytics_axis_instead_of_technical(self):
        candidate = _candidate("HR generalist. Recruiting and onboarding admin.")
        job = _job(required=["Viva Glint"])
        pack = _pack(candidate, job, use_people_analytics=True)

        assert not any(q["dimension"] == "Technical" for q in pack)
        assert any(q["dimension"] == "People Analytics" for q in pack)
