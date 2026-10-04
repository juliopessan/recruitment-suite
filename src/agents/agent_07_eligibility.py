"""Agent 07: Eligibility — the hard constraints a job states.

Location, work model, time zone, work authorisation, start date, travel and
relocation are what actually knock candidates out, and none of them is a
matter of fit. So this agent does not score. It lists each constraint the job
description states and marks it:

* ``met``     — the candidate's own record states it (quoted as evidence);
* ``confirm`` — the record is silent or ambiguous: ask the candidate.

It never fails a candidate. A ``confirm`` becomes a next step, and the
decision stays with a person.

Fairness: constraints come only from the job text, and evidence only from
what the candidate wrote. Nothing is inferred from a name, photo, nationality,
age or the language a CV is written in. With TypeSafe configured each check is
a Noul over the record; otherwise a conservative keyword check runs, which
only ever marks ``met`` on an explicit statement.
"""

from __future__ import annotations

import re
from typing import Dict, List, Optional

from src.models import Candidate, JobDescription
from src.services import typesafe_judge

MET, CONFIRM = "met", "confirm"
MET_PROBABILITY = 0.8  # a Noul must be this sure before a check counts as met
MAX_CHECKS = 6
MAX_LABEL = 140

_SENTENCE_SPLIT = re.compile(r"(?<=[.!?;])\s+|\n+")

# kind -> patterns that mark a sentence of the JD as stating that constraint
JD_PATTERNS: Dict[str, List[str]] = {
    "work_model": [
        r"\b(on[- ]?site|in[- ]office|presencial|hybrid|h[íi]brido|fully remote|100% remot[eo]|remote[- ]first|remote\b|remoto)\b",
    ],
    "location": [
        r"\b(based in|located in|location\s*:|localiza[cç][aã]o\s*:|must live in|reside in|residir em|sediad[oa] em)\b",
    ],
    "timezone": [
        r"\b(time ?zones?|fuso hor[aá]rio|overlap with|(?:utc|gmt)\s*[+\-±]\s*\d+|\b(?:est|pst|cet|brt|bst)\b hours?)\b",
    ],
    "work_authorization": [
        r"\b(right to work|work(?:ing)? authori[sz]ation|work permit|eligible to work|authori[sz]ed to work|visa|autoriza[cç][aã]o de trabalho)\b",
    ],
    "start_date": [
        r"\b(start(?:ing)? (?:date|immediately|asap|within)|immediate start|available to start|notice period|in[íi]cio imediato|disponibilidade imediata)\b",
    ],
    "travel": [
        r"\b(travel(?:ling)? (?:up to|required|\d)|willing(?:ness)? to travel|disponibilidade para viage(?:m|ns))\b",
    ],
    "relocation": [
        r"\b(relocat\w+|mudan[cç]a de cidade)\b",
    ],
}

# A JD that *offers* something is not a constraint ("visa sponsorship provided").
_OFFERS = re.compile(
    r"\b(sponsorship (?:is )?(?:available|provided|offered)|we (?:sponsor|offer)|relocation (?:support|package|assistance)|patroc[íi]nio)\b",
    re.IGNORECASE,
)

# Explicit statements in a candidate's record that settle each kind.
RECORD_PATTERNS: Dict[str, str] = {
    "work_authorization": r"\b(right to work|authori[sz]ed to work|work permit|valid visa|settled status|permanent resident|green card|autoriza[cç][aã]o de trabalho)\b",
    "start_date": r"\b(available (?:immediately|from|to start)|notice period|immediate availability|disponibilidade imediata|aviso pr[ée]vio)\b",
    "travel": r"\b(willing to travel|available to travel|disponibilidade para viage(?:m|ns))\b",
    "relocation": r"\b(willing to relocate|open to relocation|dispon[íi]vel para mudan[cç]a)\b",
    "timezone": r"\b(time ?zone|fuso hor[aá]rio|(?:utc|gmt)\s*[+\-±]\s*\d+)\b",
}
_WORK_MODES = {
    "remote": r"\b(remote|remoto)\b",
    "hybrid": r"\b(hybrid|h[íi]brido)\b",
    "onsite": r"\b(on[- ]?site|in[- ]office|presencial)\b",
}


def _sentences(text: str) -> List[str]:
    return [s.strip(" -•●​\t") for s in _SENTENCE_SPLIT.split(text or "") if s.strip()]


def extract_constraints(jd_text: str) -> List[Dict[str, object]]:
    """Hard constraints stated in a job description, in JD order.

    One entry per sentence, carrying every kind that sentence states, so
    "Hybrid role based in London" is one check (work model + location)
    rather than the same line twice.
    """
    found: List[Dict[str, object]] = []
    seen = set()
    for sentence in _sentences(jd_text):
        if _OFFERS.search(sentence):
            continue
        kinds = [
            kind for kind, patterns in JD_PATTERNS.items()
            if kind not in seen and any(re.search(p, sentence, re.IGNORECASE) for p in patterns)
        ]
        if not kinds:
            continue
        seen.update(kinds)
        label = sentence if len(sentence) <= MAX_LABEL else sentence[: MAX_LABEL - 1] + "…"
        found.append({"kinds": kinds, "requirement": label})
        if len(found) >= MAX_CHECKS:
            break
    return found


def _quote(record: str, match: re.Match) -> str:
    start = max(0, match.start() - 50)
    end = min(len(record), match.end() + 60)
    return " ".join(record[start:end].split())


def _rule_check(kind: str, requirement: str, record: str) -> Optional[str]:
    """Evidence string when the record explicitly settles the constraint."""
    if kind == "work_model":
        for mode, pattern in _WORK_MODES.items():
            if re.search(pattern, requirement, re.IGNORECASE):
                m = re.search(pattern, record, re.IGNORECASE)
                return _quote(record, m) if m else None
        return None
    if kind == "location":
        # Place names the JD gives after the trigger phrase, e.g. "based in London".
        tail = re.split(JD_PATTERNS["location"][0], requirement, maxsplit=1, flags=re.IGNORECASE)[-1]
        places = [p for p in re.findall(r"[A-ZÀ-Ý][\wÀ-ÿ'-]+(?:\s+[A-ZÀ-Ý][\wÀ-ÿ'-]+)*", tail) if len(p) > 2]
        for place in places:
            m = re.search(r"\b" + re.escape(place) + r"\b", record)
            if m:
                return _quote(record, m)
        return None
    pattern = RECORD_PATTERNS.get(kind)
    if pattern:
        m = re.search(pattern, record, re.IGNORECASE)
        return _quote(record, m) if m else None
    return None


class Agent07Eligibility:
    """Checks the job's hard constraints against what the candidate states."""

    name = "Eligibility"
    description = "Hard constraints from the job (location, work model, time zone, work authorisation, start date, travel): met, or confirm with the candidate"

    def check(self, candidate: Candidate, job: JobDescription) -> List[Dict[str, object]]:
        constraints = extract_constraints(job.description or "")
        if not constraints:
            return []

        record = candidate.cv_text or ""
        if candidate.linkedin_profile:
            record += "\n" + (candidate.linkedin_profile.get("text") or "")

        judged = typesafe_judge.judge_eligibility(candidate, [c["requirement"] for c in constraints])

        checks: List[Dict[str, object]] = []
        for i, c in enumerate(constraints):
            check: Dict[str, object] = {
                "kind": "+".join(c["kinds"]),
                "requirement": c["requirement"],
                "status": CONFIRM,
                "evidence": None,
                "probability": None,
            }
            if judged is not None:
                j = judged[i]
                check["probability"] = round(j.value, 2)
                if j.value >= MET_PROBABILITY:
                    check["status"] = MET
                    check["evidence"] = "Stated in the candidate's record (judged by TypeSafe)"
            else:
                # Every part of the sentence must be stated before it counts as met.
                evidence = [_rule_check(k, c["requirement"], record) for k in c["kinds"]]
                if all(evidence):
                    check["status"] = MET
                    check["evidence"] = " · ".join(dict.fromkeys(evidence))
            checks.append(check)
        return checks
