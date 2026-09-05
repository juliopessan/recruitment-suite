"""Build the 5-question interview pack for one evaluation.

A recruiter runs a real conversation, not an interrogation of weak spots: two
technical questions and two behavioral (STAR-format) questions, both grounded
in the actual job description and the actual candidate profile, closing on a
question that makes the candidate reconstruct their strongest claim as a
story. This is deliberately a genuine mixed chat, not a checklist of gaps —
so a strong candidate still gets asked to go deep on what they claim, not
just interrogated about what's missing.

Every question is derived deterministically from the evaluation, the job and
the candidate — the same three inputs always produce the same pack — and
translated through the existing i18n path.
"""

from typing import List, Optional

from src.models.candidate import Candidate
from src.models.evaluation import Evaluation
from src.models.job import JobDescription
from src.services.i18n_service import DEFAULT_LOCALE, t

PACK_SIZE = 5


def _question(dimension: str, focus: str, question: str, listen_for: str) -> dict:
    return {
        "dimension": dimension,
        "focus": focus,
        "question": question,
        "listen_for": listen_for,
    }


def _items(evaluation: Evaluation, agent_key: str, field: str) -> List[str]:
    """Bare item names (gap_items or strength_items) across ALL of one agent's
    dimensions. Only safe when an agent's dimensions don't need to be told
    apart (e.g. Agent 06, where every dimension is its own named signal) —
    Agent 02 mixes required and nice-to-have skills across dimensions, so
    required-skill questions must use `_dimension_items` instead.
    """
    score = (evaluation.agent_scores or {}).get(agent_key)
    if not score:
        return []

    out: List[str] = []
    for dimension in score.dimension_scores:
        for item in getattr(dimension, field, []) or []:
            if item and item not in out:
                out.append(item)
    return out


def _dimension_items(
    evaluation: Evaluation, agent_key: str, dimension_name: str, field: str
) -> List[str]:
    """Bare item names from one specifically-named dimension of one agent."""
    score = (evaluation.agent_scores or {}).get(agent_key)
    if not score:
        return []
    for dimension in score.dimension_scores:
        if dimension.dimension == dimension_name:
            return list(getattr(dimension, field, []) or [])
    return []


def _join(items: List[str], language: str) -> str:
    """Join names into a readable list: 'A, B and C'."""
    if len(items) == 1:
        return items[0]
    return f"{', '.join(items[:-1])} {t('interview.list_and', language)} {items[-1]}"


def _technical_slot_1(
    evaluation: Evaluation, use_people_analytics: bool, language: str
) -> dict:
    """Slot 1: the role's central technical axis, whichever way it cuts.

    A missing required skill (or the PA-signal equivalent for HR/People
    roles) is asked about directly. When nothing is missing, the strongest
    evidenced skill gets a deep-dive instead — a strong candidate still gets
    a real technical conversation, not a pass.
    """
    agent_key = "06-people-analytics" if use_people_analytics else "02-technical"
    dimension = t(
        "dimension.people_analytics" if use_people_analytics else "dimension.technical",
        language,
    )

    if use_people_analytics:
        gaps = _items(evaluation, agent_key, "gap_items")[:3]
        strengths_all = _items(evaluation, agent_key, "strength_items")
    else:
        # Scoped to "Required Skills Coverage" specifically — the generic
        # collector would also pull in "Nice-to-have Skills" gaps/strengths,
        # mislabeling a nice-to-have as this role's core missing skill.
        gaps = _dimension_items(evaluation, agent_key, "Required Skills Coverage", "gap_items")[:3]
        strengths_all = _dimension_items(evaluation, agent_key, "Required Skills Coverage", "strength_items")

    if gaps:
        focus = _join(gaps, language)
        key = "interview.q_tech_gap_one" if len(gaps) == 1 else "interview.q_tech_gap_many"
        kwarg = {"skill": focus} if len(gaps) == 1 else {"skills": focus}
        return _question(
            dimension=dimension,
            focus=focus,
            question=t(key, language, **kwarg),
            listen_for=t("interview.listen_tech_gap", language),
        )

    strengths = strengths_all
    if strengths:
        focus = strengths[0]
        return _question(
            dimension=dimension,
            focus=focus,
            question=t("interview.q_tech_strength", language, skill=focus),
            listen_for=t("interview.listen_tech_strength", language),
        )

    # No signal either way (e.g. the JD listed no required skills, or the
    # agent didn't run): a generic judgment question keeps the pack at
    # exactly PACK_SIZE regardless. Distinct from slot 2's fallback so the
    # two generic questions never collide when both trigger at once.
    return _question(
        dimension=dimension,
        focus=t("interview.focus_judgment", language),
        question=t("interview.q_tech_generic", language),
        listen_for=t("interview.listen_tech_generic", language),
    )


def _technical_slot_2(
    evaluation: Evaluation, job: Optional[JobDescription], use_people_analytics: bool, language: str
) -> Optional[dict]:
    """Slot 2: grounded in the JD's own words wherever possible."""
    dimension = t(
        "dimension.people_analytics" if use_people_analytics else "dimension.technical",
        language,
    )

    if job and job.responsibilities:
        responsibility = job.responsibilities[0]
        return _question(
            dimension=dimension,
            focus=responsibility,
            question=t("interview.q_scenario", language, responsibility=responsibility),
            listen_for=t("interview.listen_scenario", language),
        )

    if not use_people_analytics:
        # Required-skill gaps were already spent in slot 1, so this reaches
        # specifically into the "Nice-to-have Skills" dimension rather than
        # reusing the generic gap_items() collector across the whole agent.
        score = (evaluation.agent_scores or {}).get("02-technical")
        nice_dim = next(
            (d for d in (score.dimension_scores if score else []) if d.dimension == "Nice-to-have Skills"),
            None,
        )
        if nice_dim and nice_dim.gap_items:
            skill = nice_dim.gap_items[0]
            return _question(
                dimension=dimension,
                focus=skill,
                question=t("interview.q_nice_to_have", language, skill=skill),
                listen_for=t("interview.listen_nice_to_have", language),
            )
        if nice_dim and nice_dim.strength_items:
            skill = nice_dim.strength_items[0]
            return _question(
                dimension=dimension,
                focus=skill,
                question=t("interview.q_nice_to_have", language, skill=skill),
                listen_for=t("interview.listen_nice_to_have", language),
            )

    if job:
        return _question(
            dimension=dimension,
            focus=job.title,
            question=t(
                "interview.q_seniority_scenario",
                language,
                seniority=job.seniority_level,
                title=job.title,
            ),
            listen_for=t("interview.listen_seniority_scenario", language),
        )

    return None


def _behavioral_slot_3(job: Optional[JobDescription], language: str) -> dict:
    """Slot 3: a STAR question grounded in the JD's team context, or general."""
    dimension = t("interview.kind_behavioral", language)

    if job and job.team_context:
        return _question(
            dimension=dimension,
            focus=t("interview.focus_team_fit", language),
            question=t(
                "interview.q_behavioral_team_context",
                language,
                team_context=job.team_context,
            ),
            listen_for=t("interview.listen_behavioral_general", language),
        )

    return _question(
        dimension=dimension,
        focus=t("interview.focus_influence", language),
        question=t("interview.q_behavioral_general", language),
        listen_for=t("interview.listen_behavioral_general", language),
    )


def _behavioral_slot_4(evaluation: Evaluation, language: str) -> dict:
    """Slot 4: a STAR question about a named behavioral theme, gap or strength."""
    dimension = t("interview.kind_behavioral", language)

    theme_gaps = _items(evaluation, "03-culture", "gap_items")
    if theme_gaps:
        theme = theme_gaps[0]
        return _question(
            dimension=dimension,
            focus=theme,
            question=t("interview.q_behavioral_theme_gap", language, theme=theme),
            listen_for=t("interview.listen_behavioral_theme_gap", language),
        )

    theme_strengths = _items(evaluation, "03-culture", "strength_items")
    if theme_strengths:
        theme = theme_strengths[0]
        return _question(
            dimension=dimension,
            focus=theme,
            question=t("interview.q_behavioral_theme_strength", language, theme=theme),
            listen_for=t("interview.listen_behavioral_theme_strength", language),
        )

    # No culture-agent data at all (e.g. an incomplete evaluation): a general
    # ownership question keeps the pack at exactly PACK_SIZE regardless.
    return _question(
        dimension=dimension,
        focus=t("interview.focus_ownership", language),
        question=t("interview.q_behavioral_ownership", language),
        listen_for=t("interview.listen_behavioral_ownership", language),
    )


def _closing_slot_5(
    evaluation: Evaluation, use_people_analytics: bool, language: str
) -> dict:
    """Slot 5: always present. Reconstruct the strongest claim, as a story."""
    dimension = t("interview.kind_behavioral", language)
    agent_key = "06-people-analytics" if use_people_analytics else "02-technical"

    if use_people_analytics:
        strengths = _items(evaluation, agent_key, "strength_items")
    else:
        # Prefer a required-skill claim over a nice-to-have one — it's the
        # stronger thing to make them defend.
        strengths = _dimension_items(
            evaluation, agent_key, "Required Skills Coverage", "strength_items"
        ) or _dimension_items(
            evaluation, agent_key, "Nice-to-have Skills", "strength_items"
        )

    if strengths:
        claim = strengths[0]
        return _question(
            dimension=dimension,
            focus=claim,
            question=t("interview.q_closing_claim", language, claim=claim),
            listen_for=t("interview.listen_closing", language),
        )

    return _question(
        dimension=dimension,
        focus=t("interview.focus_achievement", language),
        question=t("interview.q_closing_generic", language),
        listen_for=t("interview.listen_closing", language),
    )


def build_interview_guide(
    evaluation: Evaluation,
    candidate: Optional[Candidate] = None,
    job: Optional[JobDescription] = None,
    use_people_analytics: bool = False,
    language: str = DEFAULT_LOCALE,
) -> List[dict]:
    """Build the 5-question interview pack for one evaluation.

    Args:
        evaluation: The completed evaluation, with agent scores attached
        candidate: The candidate (currently unused directly — reserved for
            profile-specific tailoring; the agents' recorded gaps/strengths
            already carry the candidate-vs-job comparison)
        job: The job, used to ground questions in its own words
        use_people_analytics: Whether Agent 06 replaced Agent 02
        language: Locale for the generated question text

    Returns:
        Exactly PACK_SIZE dicts of {dimension, focus, question, listen_for}:
        two technical, two behavioral (STAR), one closing story question.
    """
    del candidate  # reserved; see docstring

    slots = [
        _technical_slot_1(evaluation, use_people_analytics, language),
        _technical_slot_2(evaluation, job, use_people_analytics, language),
        _behavioral_slot_3(job, language),
        _behavioral_slot_4(evaluation, language),
        _closing_slot_5(evaluation, use_people_analytics, language),
    ]
    pack = [q for q in slots if q]

    # Every slot above has a job-independent fallback except slot 2, which
    # can return nothing if called without a job at all. The orchestrator
    # always supplies one, but build_interview_guide is a public function —
    # pad defensively so callers always get exactly PACK_SIZE.
    while len(pack) < PACK_SIZE:
        pack.append(
            _question(
                dimension=t("interview.kind_behavioral", language),
                focus=t("interview.focus_achievement", language),
                question=t("interview.q_closing_generic", language),
                listen_for=t("interview.listen_closing", language),
            )
        )
    return pack[:PACK_SIZE]
