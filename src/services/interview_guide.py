"""Turn an evaluation's gaps into the questions worth asking in the interview.

The product already tells a recruiter what is missing, and already recalculates
every score once interview notes come back. Between those two steps it used to
say nothing about *what to ask*. This closes that loop: each question names the
gap it exists to close, so the answer that comes back is evidence about a
specific dimension rather than a general impression.

Questions are derived deterministically from the evaluation — the same
candidate against the same job always produces the same guide — and are
translated through the normal i18n path.
"""

from typing import List, Optional

from src.models.evaluation import Evaluation
from src.models.job import JobDescription
from src.services.i18n_service import DEFAULT_LOCALE, t

# A dimension at or above this needs no probing; the record already carries it.
WEAK_SCORE = 70

# Interviews are finite. Rank by what a wrong answer would cost, then cut.
MAX_QUESTIONS = 6

# Missing skills share one probe rather than getting a question each: asking the
# same sentence three times with a different noun wastes the hour and reads like
# a template. Naming them together and letting the candidate pick where to start
# is both shorter and more revealing.
MAX_NAMED_ITEMS = 3


def _join(items: List[str], language: str) -> str:
    """Join names into a readable list: "A, B and C"."""
    if len(items) == 1:
        return items[0]
    return f"{', '.join(items[:-1])} {t('interview.list_and', language)} {items[-1]}"


def _question(dimension: str, focus: str, question: str, listen_for: str) -> dict:
    return {
        "dimension": dimension,
        "focus": focus,
        "question": question,
        "listen_for": listen_for,
    }


def _gap_items(evaluation: Evaluation, agent_key: str) -> List[str]:
    """Bare gap subjects (skill/signal names) recorded by one agent."""
    score = (evaluation.agent_scores or {}).get(agent_key)
    if not score:
        return []

    items: List[str] = []
    for dimension in score.dimension_scores:
        for item in getattr(dimension, "gap_items", []) or []:
            if item and item not in items:
                items.append(item)
    return items


def build_interview_guide(
    evaluation: Evaluation,
    job: Optional[JobDescription] = None,
    use_people_analytics: bool = False,
    language: str = DEFAULT_LOCALE,
) -> List[dict]:
    """Build the interview guide for one evaluation.

    Args:
        evaluation: The completed evaluation, with agent scores attached
        job: The job, used for the experience requirement in the profile probe
        use_people_analytics: Whether Agent 06 replaced Agent 02
        language: Locale for the generated question text

    Returns:
        Up to MAX_QUESTIONS dicts of {dimension, focus, question, listen_for},
        most consequential first. Empty only if nothing scored weakly and there
        is no record to corroborate.
    """
    guide: List[dict] = []

    # 1. Required skills with no evidence — the most expensive thing to get
    #    wrong, and the easiest to settle in conversation.
    if not use_people_analytics:
        skills = _gap_items(evaluation, "02-technical")[:MAX_NAMED_ITEMS]
        if skills:
            key = "interview.q_missing_skill" if len(skills) == 1 else "interview.q_missing_skills"
            guide.append(
                _question(
                    dimension=t("dimension.technical", language),
                    focus=_join(skills, language),
                    question=t(key, language, skills=_join(skills, language)),
                    listen_for=t("interview.listen_missing_skill", language),
                )
            )

    # 2. People Analytics signals with no evidence, for HR/People roles.
    if use_people_analytics:
        signals = _gap_items(evaluation, "06-people-analytics")[:MAX_NAMED_ITEMS]
        if signals:
            key = "interview.q_missing_signal" if len(signals) == 1 else "interview.q_missing_signals"
            guide.append(
                _question(
                    dimension=t("dimension.people_analytics", language),
                    focus=_join(signals, language),
                    question=t(key, language, signals=_join(signals, language)),
                    listen_for=t("interview.listen_missing_signal", language),
                )
            )

    # 3-5. Dimensions that scored weakly overall, in the order a hiring
    #      manager would care about them.
    if evaluation.profile_score < WEAK_SCORE:
        guide.append(
            _question(
                dimension=t("dimension.profile", language),
                focus=t("interview.focus_experience", language),
                question=t(
                    "interview.q_profile",
                    language,
                    score=int(evaluation.profile_score),
                    years=job.years_experience_required if job else 0,
                ),
                listen_for=t("interview.listen_profile", language),
            )
        )

    if evaluation.culture_score < WEAK_SCORE:
        guide.append(
            _question(
                dimension=t("dimension.culture_fit", language),
                focus=t("interview.focus_collaboration", language),
                question=t("interview.q_culture", language, score=int(evaluation.culture_score)),
                listen_for=t("interview.listen_culture", language),
            )
        )

    if evaluation.reference_score < WEAK_SCORE:
        guide.append(
            _question(
                dimension=t("dimension.references", language),
                focus=t("interview.focus_verifiability", language),
                question=t("interview.q_references", language, score=int(evaluation.reference_score)),
                listen_for=t("interview.listen_references", language),
            )
        )

    # 6. Always close on corroboration. A CV tailored to the job description
    #    scores well by construction, so the strongest claim on it is the one
    #    worth making somebody reconstruct out loud. Unlike the rest of the
    #    guide this is not tied to a weak dimension, so it carries no dimension
    #    tag — a "Corroboration / Corroboration" badge would read as a bug.
    guide.append(
        _question(
            dimension="",
            focus=t("interview.focus_corroboration", language),
            question=t("interview.q_corroboration", language),
            listen_for=t("interview.listen_corroboration", language),
        )
    )

    return guide[:MAX_QUESTIONS]
