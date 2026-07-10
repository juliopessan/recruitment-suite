"""
Interview-verification bonus: interview notes that explicitly reconfirm a
skill/signal are stronger evidence than the same claim sitting unverified in
a CV, so they earn extra credit on top of whatever the corpus-matching agents
already found — otherwise notes that only restate existing CV/LinkedIn
content move the score by zero, which reads as "the notes did nothing."
"""

from typing import List, Tuple


def _matches(term: str, corpus: str) -> bool:
    term = term.lower().strip()
    if not term:
        return False
    tokens = [t for t in term.replace("/", " ").split() if len(t) > 2]
    return term in corpus or (bool(tokens) and all(t in corpus for t in tokens))


def compute_interview_bonus(
    notes: str,
    terms: List[str],
    per_hit: int = 4,
    cap: int = 12,
) -> Tuple[int, List[str]]:
    """
    Score a 0..cap bonus for how many of `terms` the interview notes text
    explicitly reconfirms, independent of whether the CV already mentioned
    them. Returns (bonus_points, matched_terms) so callers can both apply the
    number and explain it in the report.
    """
    if not notes or not terms:
        return 0, []
    corpus = notes.lower()
    matched = [t for t in dict.fromkeys(terms) if _matches(t, corpus)]
    bonus = min(cap, per_hit * len(matched))
    return bonus, matched
