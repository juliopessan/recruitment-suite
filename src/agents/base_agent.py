"""Base agent class for evaluation agents."""

import json
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Optional
from src.models import (
    Candidate,
    JobDescription,
    AgentScore,
    DimensionScore,
    AgentType,
)
from src.services import llm_client

# Semantic matches are cached per (skills, corpus) so that the five agents
# sharing a candidate resolve the same skill list with a single LLM call.
_SEMANTIC_CACHE: dict = {}


class BaseAgent(ABC):
    """Base class for all evaluation agents."""

    agent_type: AgentType
    name: str
    description: str

    def __init__(self):
        """Initialize agent."""
        self.agent_type = AgentType.PROFILE
        self.name = "Base Agent"
        self.description = "Base agent class"

    @abstractmethod
    def evaluate(
        self,
        candidate: Candidate,
        job: JobDescription,
    ) -> AgentScore:
        """
        Evaluate candidate against job requirements.

        Args:
            candidate: Candidate profile
            job: Job description

        Returns:
            AgentScore with evaluation results
        """
        pass

    def _create_score(
        self,
        score: int,
        analysis: str,
        dimension_scores: Optional[List[DimensionScore]] = None,
        red_flags: Optional[List[str]] = None,
        recommendations: Optional[List[str]] = None,
    ) -> AgentScore:
        """
        Helper method to create AgentScore.

        Args:
            score: Numerical score (0-100)
            analysis: Narrative analysis
            dimension_scores: List of dimension scores
            red_flags: List of red flags
            recommendations: List of recommendations

        Returns:
            AgentScore object
        """
        return AgentScore(
            agent=self.agent_type,
            score=score,
            timestamp=datetime.now(),
            dimension_scores=dimension_scores or [],
            analysis=analysis,
            red_flags=red_flags or [],
            recommendations=recommendations or [],
        )

    def _dimension_score(
        self,
        dimension: str,
        score: int,
        weight: float,
        gaps: Optional[List[str]] = None,
        strengths: Optional[List[str]] = None,
        gap_items: Optional[List[str]] = None,
        strength_items: Optional[List[str]] = None,
    ) -> DimensionScore:
        """
        Helper to create DimensionScore.

        Args:
            dimension: Dimension name
            score: Score for this dimension
            weight: Weight in overall evaluation
            gaps: List of gaps identified, as display strings
            strengths: List of strengths identified
            gap_items: The bare subjects behind `gaps` (skill or signal names),
                unformatted, for consumers that need to build on them
            strength_items: The bare subjects behind `strengths`, symmetrically

        Returns:
            DimensionScore object
        """
        contribution = score * weight
        return DimensionScore(
            dimension=dimension,
            score=score,
            weight=weight,
            contribution=contribution,
            gaps=gaps or [],
            strengths=strengths or [],
            gap_items=gap_items or [],
            strength_items=strength_items or [],
            agent=self.agent_type,
        )

    def _candidate_corpus(self, candidate: Candidate) -> str:
        """Aggregate all candidate text into a searchable lowercase corpus."""
        parts = [
            candidate.cv_text or "",
            " ".join(candidate.profile.education or []),
            " ".join(candidate.profile.certifications or []),
        ]
        if candidate.linkedin_profile:
            parts.append(str(candidate.linkedin_profile))
        return " ".join(parts).lower()

    def _match_skills(self, skills, corpus: str):
        """Split a skill list into (matched, missing) against the corpus.

        Literal matching runs first and is authoritative for anything it finds.
        Whatever it cannot find is then re-checked semantically by the LLM, so
        that "AWS" still matches "Amazon Web Services" and "K8s" matches
        "Kubernetes". Without a configured key this stays purely literal.
        """
        matched, missing = self._match_skills_literal(skills, corpus)

        if not missing or not llm_client.is_configured():
            return matched, missing

        try:
            semantic = self._match_skills_semantic(missing, corpus)
        except llm_client.LLMError:
            return matched, missing  # Degrade to the literal verdict.

        still_missing = [s for s in missing if s not in semantic]
        # Preserve the caller's original skill ordering.
        matched = [s for s in skills if s in matched or s in semantic]
        return matched, still_missing

    def _match_skills_literal(self, skills, corpus: str):
        """Substring/token matching — no network, always available."""
        matched, missing = [], []
        for skill in skills or []:
            tokens = [t for t in skill.lower().replace("/", " ").split() if len(t) > 2]
            if skill.lower() in corpus or (tokens and all(t in corpus for t in tokens)):
                matched.append(skill)
            else:
                missing.append(skill)
        return matched, missing

    def _match_skills_semantic(self, skills, corpus: str) -> set:
        """Ask the LLM which of `skills` the corpus actually evidences.

        Returns the subset it considers evidenced. Only skills from the input
        list are honoured, so a hallucinated name cannot inflate a score.
        """
        cache_key = (tuple(skills), hash(corpus))
        if cache_key in _SEMANTIC_CACHE:
            return _SEMANTIC_CACHE[cache_key]

        result = llm_client.complete_json(
            prompt=(
                "Candidate record:\n"
                f"---\n{corpus[:6000]}\n---\n\n"
                f"Skills to check: {json.dumps(list(skills))}\n\n"
                "Which of these skills does the record evidence, including via "
                "synonyms, abbreviations or well-known equivalents (AWS = Amazon "
                "Web Services, K8s = Kubernetes)? Do not infer a skill merely "
                "because it is adjacent to one that is present.\n"
                'Reply with JSON only: {"evidenced": ["skill", ...]}'
            ),
            system="You are a precise technical recruiter. You only answer with JSON.",
            max_tokens=400,
        )

        raw = result.get("evidenced") if isinstance(result, dict) else result
        if not isinstance(raw, list):
            raise llm_client.LLMError("Expected an 'evidenced' list")

        allowed = {s.lower(): s for s in skills}
        evidenced = {allowed[str(s).lower()] for s in raw if str(s).lower() in allowed}

        _SEMANTIC_CACHE[cache_key] = evidenced
        return evidenced
