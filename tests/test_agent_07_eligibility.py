"""Agent 07: hard constraints from the job — met or confirm, never scored."""

from src.agents.agent_07_eligibility import Agent07Eligibility, CONFIRM, MET, extract_constraints
from src.agents.orchestrator import RecruitmentOrchestrator
from src.generators.html_generator import HTMLReportGenerator
from src.models import Candidate, JobDescription
from src.services import typesafe_judge as tj

JD = """Senior Data Engineer
Hybrid role based in London, three days a week in the office.
Candidates must have the right to work in the UK; visa sponsorship is not available.
Overlap with UTC+0 business hours. Travel up to 20% to client sites.
Start within 30 days. Must know Python and AWS. 8+ years."""


def _job(description=JD):
    return JobDescription(
        id="j1", title="Data Engineer", company="Acme", description=description,
        required_skills=["Python", "AWS"], years_experience_required=8,
    )


def _candidate(cv):
    return Candidate(
        id="c1",
        profile={"name": "Ana Lima", "email": "a@x.com", "total_years_experience": 9},
        cv_text=cv,
    )


def test_extracts_constraints_per_sentence_in_jd_order():
    kinds = [c["kinds"] for c in extract_constraints(JD)]
    assert kinds == [
        ["work_model", "location"],  # "Hybrid role based in London" is one check
        ["work_authorization"],
        ["timezone"],
        ["travel"],
        ["start_date"],
    ]


def test_offers_are_not_constraints():
    jd = "Remote-first team. Visa sponsorship provided. Relocation package available."
    assert [c["kinds"] for c in extract_constraints(jd)] == [["work_model"]]


def test_jd_without_constraints_yields_no_checks():
    assert Agent07Eligibility().check(_candidate("Python dev"), _job("Must know Python. 5 years.")) == []


def test_explicit_statements_are_met_and_silence_is_confirm():
    cv = ("Ana Lima, Data Engineer based in London. Hybrid working for 4 years. "
          "Full right to work in the UK. Notice period: 4 weeks.")
    checks = {c["kind"]: c for c in Agent07Eligibility().check(_candidate(cv), _job())}
    where = checks["work_model+location"]
    assert where["status"] == MET and "London" in where["evidence"]
    assert checks["work_authorization"]["status"] == MET
    assert checks["start_date"]["status"] == MET
    # Never stated -> ask, never fail.
    assert checks["travel"]["status"] == CONFIRM
    assert checks["timezone"]["status"] == CONFIRM
    assert all(c["status"] in (MET, CONFIRM) for c in checks.values())


def test_nothing_is_inferred_from_name_or_language():
    # A Portuguese CV from someone with a Brazilian name says nothing about the UK.
    cv = "Ana Lima. Engenheira de dados, 9 anos com Python e AWS."
    checks = Agent07Eligibility().check(_candidate(cv), _job())
    assert {c["status"] for c in checks} == {CONFIRM}


def test_typesafe_path_uses_probability_threshold(monkeypatch):
    seen = {}

    def fake(candidate, requirements):
        seen["n"] = len(requirements)
        return [tj.Judgment(value=0.93, confidence=0.9, top=None)] + [
            tj.Judgment(value=0.4, confidence=0.6, top=None) for _ in requirements[1:]
        ]

    monkeypatch.setattr(tj, "judge_eligibility", fake)
    checks = Agent07Eligibility().check(_candidate("anything"), _job())
    assert seen["n"] == len(checks) == 5
    assert checks[0]["status"] == MET and checks[0]["probability"] == 0.93
    assert all(c["status"] == CONFIRM for c in checks[1:])


def test_confirm_items_become_next_steps_and_report_section():
    cv = "Ana Lima, Data Engineer. Right to work in the UK. Python, AWS, 9 years."
    result = RecruitmentOrchestrator().evaluate(_candidate(cv), _job())
    rec = result.recommendation
    confirms = [c for c in rec.eligibility_checks if c["status"] == CONFIRM]
    assert confirms
    for c in confirms:
        assert f"Confirm with the candidate: {c['requirement']}" in rec.next_steps
    assert not any("right to work" in s for s in rec.next_steps)  # met -> no step

    html = HTMLReportGenerator().generate(result, candidate_name="Ana Lima", job_title="Data Engineer")
    assert "Eligibility" in html and "Confirm" in html and "Stated" in html


def test_profile_agent_no_longer_uses_a_fixed_geographic_score():
    from src.agents.agent_01_profile import Agent01Profile
    score = Agent01Profile().evaluate(_candidate("Python AWS 9 years"), _job())
    assert abs(sum(d.weight for d in score.dimension_scores) - 1.0) < 1e-9


def test_a_sentence_counts_as_met_only_when_every_part_is_stated():
    # Lives in London, but says nothing about hybrid work.
    cv = "Ana Lima, Data Engineer based in London."
    checks = {c["kind"]: c for c in Agent07Eligibility().check(_candidate(cv), _job())}
    assert checks["work_model+location"]["status"] == CONFIRM
