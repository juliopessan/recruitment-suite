"""Semantic judgments over a CV + LinkedIn record, powered by TypeSafe (Jev).

Code keeps owning the workflow (weights, thresholds, GO/HOLD/NO-GO). TypeSafe
supplies the one thing plain code cannot: reading free text and answering
narrow, typed questions with calibrated probabilities.

Design rules (see https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md):

* One narrow judgment per question. Independent questions over the same state
  travel together in a single request and run in parallel.
* Graded evidence uses Score with levels that describe concrete situations;
  yes/no conditions use Noul.
* Every judgment keeps its confidence, so ambiguous evidence is routed to a
  person instead of being silently rounded into a score.
* Everything degrades: without ``TYPESAFE_API_KEY``, or when the API fails,
  each ``judge_*`` function returns ``None`` and the calling agent falls back to
  its deterministic path. An evaluation never fails because of this module.

Privacy / fairness: the state sent to TypeSafe never contains the candidate's
e-mail, phone number or name (redacted from the free text), and every question
tells the model to ignore personal attributes and judge only described work,
skills, education and results.
"""

from __future__ import annotations

import hashlib
import json
import logging
import os
import re
from dataclasses import dataclass
from typing import Dict, List, Optional, Sequence

logger = logging.getLogger(__name__)

DEFAULT_MODEL = "jev-latest"
TIMEOUT_SECONDS = 20.0  # callers run inside a 60s serverless function
MAX_FIELD_CHARS = 10_000  # per source (CV, LinkedIn)
MAX_SKILLS = 20  # per list (required / nice-to-have)

# Confidence below this routes the judgment to a person (docs: <0.5 = low tier).
LOW_CONFIDENCE = 0.5
UNCERTAIN_PREFIX = "Verify manually (ambiguous evidence): "

_LINKEDIN_MARK = "\n\n[LinkedIn]\n"  # appended to cv_text by /analyze/run

GUARD = (
    " Judge only from described work, skills, education and results; "
    "ignore the person's name, age, gender, nationality, photo and any other "
    "personal attribute."
)

# --- Question vocabularies ----------------------------------------------------

SKILL_LEVELS = [
    "No evidence of the skill anywhere in the record",
    "Skill is only named, for example in a keyword list, with no role or project using it",
    "Skill is used in a described role or project",
    "Skill is used in depth: the person owned or led work with it, or delivered results attributable to it",
]

BEHAVIOR_LEVELS = [
    "No mention of this behavior",
    "Generic claim only, such as 'strong leader' or 'team player', with no situation described",
    "A concrete situation is described where the person showed this behavior",
    "A concrete situation is described with a measurable or named outcome",
]

CONTEXT_LEVELS = [
    "The described work has little in common with the team context",
    "Some overlap with the team context, in domain or ways of working",
    "Substantial overlap: similar domain and similar ways of working",
    "Direct match: the person has already done this kind of work in this kind of team",
]

GROWTH_LEVELS = [
    "Record is too thin to see progression, or scope clearly shrinks over time",
    "Lateral moves: similar scope across roles",
    "Steady growth: titles or responsibilities increase over time",
    "Clear acceleration: expanding scope, larger teams or budgets, or broader ownership across roles",
]

SCOPE_LEVELS = [
    "Described scope is clearly below the target seniority level",
    "Described scope approaches the target seniority level but is not there yet",
    "Described scope matches the target seniority level",
    "Described scope exceeds the target seniority level",
]

EDUCATION_LEVELS = [
    "No education or training information in the record",
    "Education or training is listed but unrelated to the role's field",
    "Education, certifications or training are in a field related to the role",
    "A directly relevant degree plus advanced or specialised training or certifications",
]

CONCRETENESS_LEVELS = [
    "Claims are vague: few named employers, dates or specifics",
    "Some named employers or dates, but most claims are general",
    "Most roles state employer, dates and responsibilities",
    "Employers, dates and quantified outcomes are stated in a way a recruiter could check",
]


@dataclass(frozen=True)
class Judgment:
    """One typed answer: a position on a scale plus how sure the model is."""

    value: float  # Score: weighted level (0..top). Noul: probability of yes.
    confidence: float  # 0..1; Noul uses |2p-1| (docs: confidence page)
    top: int  # highest level number for Score; 1 for Noul

    @property
    def unit(self) -> float:
        """Position on the scale, normalised to 0..1."""
        return max(0.0, min(1.0, self.value / self.top)) if self.top else 0.0

    @property
    def uncertain(self) -> bool:
        return self.confidence < LOW_CONFIDENCE


@dataclass(frozen=True)
class SkillJudgments:
    required: List[Judgment]
    nice: List[Judgment]


@dataclass(frozen=True)
class ProfileJudgments:
    growth: Judgment
    scope: Judgment
    education: Judgment
    languages: Dict[str, Judgment]  # required language -> Noul


@dataclass(frozen=True)
class Verifiability:
    concreteness: Judgment
    inconsistency: Optional[Judgment]  # None unless both CV and LinkedIn exist


# --- Client plumbing -----------------------------------------------------------

_CACHE: Dict[str, Dict[str, Judgment]] = {}


def is_configured() -> bool:
    """Whether a TypeSafe key is available (callers skip the work otherwise)."""
    return bool(os.environ.get("TYPESAFE_API_KEY"))


def _open_client():
    """Build a client. Isolated so tests can substitute a fake."""
    from typesafe_sdk import RetryPolicy, TypeSafeClient

    return TypeSafeClient(
        model=os.environ.get("TYPESAFE_MODEL", DEFAULT_MODEL),
        timeout=TIMEOUT_SECONDS,
        retry=RetryPolicy(max_retries=1),
    )


def _to_sdk_question(spec: dict):
    from typesafe_sdk import Noul, Score

    if spec["type"] == "noul":
        return Noul(instructions=spec["instructions"])
    return Score(instructions=spec["instructions"], criteria=spec["criteria"])


def _score(instructions: str, levels: Sequence[str]) -> dict:
    return {"type": "score", "instructions": instructions + GUARD, "criteria": list(levels)}


def _noul(instructions: str) -> dict:
    return {"type": "noul", "instructions": instructions + GUARD}


def ask(state: dict, specs: Dict[str, dict]) -> Optional[Dict[str, Judgment]]:
    """Run one request. Returns None (never raises) when TypeSafe is unusable."""
    if not is_configured() or not specs:
        return None

    cache_key = hashlib.sha256(
        json.dumps([state, specs], sort_keys=True, default=str).encode()
    ).hexdigest()
    if cache_key in _CACHE:
        return _CACHE[cache_key]

    try:
        questions = {qid: _to_sdk_question(spec) for qid, spec in specs.items()}
        with _open_client() as client:
            response = client.system_one(state=state, questions=questions)

        out: Dict[str, Judgment] = {}
        for qid, spec in specs.items():
            answer = response.answers[qid]
            if spec["type"] == "noul":
                p = float(answer.noul)
                out[qid] = Judgment(value=p, confidence=abs(2 * p - 1), top=1)
            else:
                out[qid] = Judgment(
                    value=float(answer.score),
                    confidence=float(answer.confidence),
                    top=len(spec["criteria"]) - 1,
                )
    except Exception as exc:  # noqa: BLE001 - any failure must fall back, not break the run
        logger.warning("TypeSafe judgment skipped (%s: %s)", type(exc).__name__, exc)
        return None

    _CACHE[cache_key] = out
    return out


# --- State ---------------------------------------------------------------------

_EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")
_PHONE_RE = re.compile(r"(?<!\w)\+?\d[\d\s().-]{7,}\d(?!\w)")


def _redact(text: str, name: str = "") -> str:
    text = _EMAIL_RE.sub("[email]", text)
    text = _PHONE_RE.sub("[phone]", text)
    if name and name != "Unknown Candidate" and len(name) > 2:
        text = re.sub(re.escape(name), "[candidate]", text, flags=re.IGNORECASE)
    return text


def _sources(candidate) -> tuple[str, str]:
    """Split the record into (cv, linkedin) so judgments can compare them."""
    cv = (candidate.cv_text or "").split(_LINKEDIN_MARK)[0]
    li = ""
    profile = candidate.linkedin_profile or {}
    if profile:
        li = " ".join(
            str(profile.get(k) or "") for k in ("title", "summary", "text")
        ).strip()
    name = candidate.profile.name
    return _redact(cv, name)[:MAX_FIELD_CHARS], _redact(li, name)[:MAX_FIELD_CHARS]


def _state(candidate, job, *, with_job: bool = True) -> dict:
    cv, li = _sources(candidate)
    record = {}
    if cv:
        record["cv"] = cv
    if li:
        record["linkedin"] = li
    state: dict = {"candidate": record}
    if with_job:
        state["job"] = {
            "title": job.title,
            "seniority_level": job.seniority_level,
            "years_experience_required": job.years_experience_required,
            "team_context": job.team_context or "",
        }
    return state


# --- Judgment groups -------------------------------------------------------------


def judge_skills(
    candidate, job, required: Sequence[str], nice: Sequence[str]
) -> Optional[SkillJudgments]:
    """Depth of hands-on evidence for each required / nice-to-have skill."""
    req, opt = list(required)[:MAX_SKILLS], list(nice)[:MAX_SKILLS]
    if not req and not opt:
        return None

    specs: Dict[str, dict] = {}
    for prefix, skills in (("req", req), ("nice", opt)):
        for i, skill in enumerate(skills):
            specs[f"{prefix}:{i}"] = _score(
                f"How strongly does `candidate` evidence hands-on experience with {skill}? "
                "Count synonyms, abbreviations and well-known equivalents as the same skill "
                "(AWS = Amazon Web Services, K8s = Kubernetes), but not merely adjacent skills.",
                SKILL_LEVELS,
            )

    answers = ask(_state(candidate, job, with_job=False), specs)
    if answers is None:
        return None
    return SkillJudgments(
        required=[answers[f"req:{i}"] for i in range(len(req))],
        nice=[answers[f"nice:{i}"] for i in range(len(opt))],
    )


def judge_expertise(
    candidate, job, areas: Sequence[str]
) -> Optional[Dict[str, Judgment]]:
    """Depth of evidence per named expertise area (People Analytics buckets)."""
    specs = {
        area: _score(
            f"How strongly does `candidate` evidence practical experience in {area}? "
            "Count related tools, methods and synonyms, but not merely adjacent topics.",
            SKILL_LEVELS,
        )
        for area in areas
    }
    return ask(_state(candidate, job, with_job=False), specs)


def judge_behaviors(
    candidate, job, themes: Sequence[str]
) -> Optional[tuple[Dict[str, Judgment], Optional[Judgment]]]:
    """Evidence of each behavioral theme, plus fit to the job's team context."""
    specs = {
        f"theme:{t}": _score(
            f"How well does `candidate` demonstrate {t}? A listed buzzword is not "
            "demonstration; a described situation is.",
            BEHAVIOR_LEVELS,
        )
        for t in themes
    }
    if job.team_context:
        specs["context"] = _score(
            "How closely does the work described in `candidate` match the team "
            "context in `job.team_context`?",
            CONTEXT_LEVELS,
        )
    answers = ask(_state(candidate, job), specs)
    if answers is None:
        return None
    return ({t: answers[f"theme:{t}"] for t in themes}, answers.get("context"))


def judge_profile(candidate, job) -> Optional[ProfileJudgments]:
    """Career growth, seniority scope, education relevance and required languages."""
    specs: Dict[str, dict] = {
        "growth": _score(
            "How does the scope of the roles in `candidate` progress over time?",
            GROWTH_LEVELS,
        ),
        "scope": _score(
            "How does the scope the person has actually operated at compare with the "
            "seniority level in `job.seniority_level`?",
            SCOPE_LEVELS,
        ),
        "education": _score(
            "How relevant are the education, certifications and training in `candidate` "
            "to the role in `job.title`?",
            EDUCATION_LEVELS,
        ),
    }
    languages = list(job.required_languages or [])
    for i, lang in enumerate(languages):
        specs[f"lang:{i}"] = _noul(
            f"Does `candidate` state professional working proficiency in {lang}, or show "
            f"work or study carried out in {lang}?"
        )

    answers = ask(_state(candidate, job), specs)
    if answers is None:
        return None
    return ProfileJudgments(
        growth=answers["growth"],
        scope=answers["scope"],
        education=answers["education"],
        languages={lang: answers[f"lang:{i}"] for i, lang in enumerate(languages)},
    )


def judge_verifiability(candidate, job) -> Optional[Verifiability]:
    """How checkable the record is, and whether CV and LinkedIn disagree."""
    cv, li = _sources(candidate)
    if not cv and not li:
        return None

    specs: Dict[str, dict] = {
        "concreteness": _score(
            "How concrete and checkable are the claims in `candidate`?",
            CONCRETENESS_LEVELS,
        )
    }
    if cv and li:
        specs["inconsistency"] = _noul(
            "Do `candidate.cv` and `candidate.linkedin` contradict each other on "
            "employers, job titles or dates of employment?"
        )

    answers = ask(_state(candidate, job, with_job=False), specs)
    if answers is None:
        return None
    return Verifiability(
        concreteness=answers["concreteness"], inconsistency=answers.get("inconsistency")
    )


def judge_eligibility(candidate, requirements: Sequence[str]) -> Optional[List[Judgment]]:
    """One Noul per hard constraint: does the record *state* the candidate meets it?

    Only explicit statements count. Location, right to work or availability
    must never be inferred from a name, nationality or the CV's language.
    """
    cv, li = _sources(candidate)
    if not requirements or (not cv and not li):
        return None
    specs = {
        f"req_{i}": _noul(
            "Does `candidate` explicitly state something showing they meet this job "
            f"requirement: \"{req}\"? Answer yes only for a direct statement in the record "
            "(a stated current location, work arrangement, availability, travel or "
            "relocation preference, or right to work). Silence or a guess counts as no."
        )
        for i, req in enumerate(requirements)
    }
    answers = ask(_state(candidate, None, with_job=False), specs)
    if answers is None:
        return None
    return [answers[f"req_{i}"] for i in range(len(requirements))]


def uncertain_note(subject: str, judgment: Judgment) -> str:
    """Standard review-routing line for an ambiguous judgment."""
    return f"{UNCERTAIN_PREFIX}{subject} (confidence {judgment.confidence:.2f})"
