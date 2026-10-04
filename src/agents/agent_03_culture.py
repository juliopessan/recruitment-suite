"""Agent 03: Culture Fit Analyzer."""

from src.models import Candidate, JobDescription, AgentScore, AgentType
from src.services import typesafe_judge
from .base_agent import BaseAgent

# Signals of collaboration, leadership and adaptability we look for in the record
SOFT_SKILL_SIGNALS = [
    "leadership", "mentor", "coach", "collaborat", "team", "stakeholder",
    "communication", "culture", "engagement", "change management",
    "transformation", "advisor", "facilitat", "cross-functional",
]

# The same signals regrouped into a handful of *nameable* behavioral themes.
# Raw tokens like "mentor" or "coach" aren't a question topic on their own,
# but "Mentoring & coaching" is — this is what lets the interview guide ask
# about a specific, missing (or evidenced) behavior instead of a token.
BEHAVIORAL_THEMES = {
    "Leadership": ["leadership"],
    "Mentoring & coaching": ["mentor", "coach"],
    "Cross-functional collaboration": ["collaborat", "cross-functional", "team"],
    "Stakeholder communication": ["stakeholder", "communication"],
    "Change & transformation": ["change management", "transformation"],
}


class Agent03Culture(BaseAgent):
    """Culture Fit Analyzer."""

    def __init__(self):
        """Initialize Agent 03."""
        super().__init__()
        self.agent_type = AgentType.CULTURE
        self.name = "Culture Fit Analyzer"
        self.description = "Evaluates soft skills, collaboration, mentoring, team dynamics"

    def evaluate(self, candidate: Candidate, job: JobDescription) -> AgentScore:
        """Evaluate culture fit from soft-skill signals and team-context alignment."""
        corpus = self._candidate_corpus(candidate)
        strengths = []
        gaps = []
        review = []  # ambiguous judgments routed to a person

        # Graded behavioral evidence from TypeSafe when available.
        judged = typesafe_judge.judge_behaviors(candidate, job, list(BEHAVIORAL_THEMES))
        found = []

        if judged is not None:
            theme_judgments, context_judgment = judged

            # Behavioral evidence (60%): a described situation counts, a buzzword
            # barely does. 55 = no evidence, 100 = every theme shown with outcomes.
            mean_unit = sum(j.unit for j in theme_judgments.values()) / len(theme_judgments)
            signal_score = 55.0 + 45.0 * mean_unit
            theme_strengths = [t for t, j in theme_judgments.items() if j.value >= 1.5]
            theme_gaps = [t for t in BEHAVIORAL_THEMES if t not in theme_strengths]
            if theme_strengths:
                strengths.append(f"Behavioral evidence: {', '.join(theme_strengths)}")
            else:
                gaps.append("No concrete behavioral evidence in candidate record")
            review += [
                typesafe_judge.uncertain_note(t, j)
                for t, j in theme_judgments.items() if j.uncertain
            ]
            found = theme_strengths
        else:
            # Soft-skill signals in the candidate record (60%)
            found = [s for s in SOFT_SKILL_SIGNALS if s in corpus]
            signal_score = min(100.0, 55.0 + 8.0 * len(found))
            if found:
                strengths.append(f"Soft-skill signals: {', '.join(found[:6])}")
            else:
                gaps.append("No soft-skill signals detected in candidate record")
                signal_score = 55.0

            # The same evidence, regrouped into nameable themes for the interview
            # guide (see BEHAVIORAL_THEMES) — kept separate from `found` above so
            # the existing score formula is untouched.
            theme_strengths = [
                theme for theme, tokens in BEHAVIORAL_THEMES.items()
                if any(tok in corpus for tok in tokens)
            ]
            theme_gaps = [t for t in BEHAVIORAL_THEMES if t not in theme_strengths]

        # Alignment with the job's team context (25%)
        context_score = 70.0
        if job.team_context:
            if judged is not None and context_judgment is not None:
                context_score = 60.0 + 40.0 * context_judgment.unit
                if context_judgment.value >= 1.5:
                    strengths.append("Team-context alignment: described work matches the team's domain")
                if context_judgment.uncertain:
                    review.append(
                        typesafe_judge.uncertain_note("team-context alignment", context_judgment)
                    )
            else:
                context_tokens = [
                    t for t in job.team_context.lower().replace(",", " ").split()
                    if len(t) > 4
                ]
                hits = [t for t in context_tokens if t in corpus]
                context_score = min(100.0, 60.0 + 10.0 * len(hits))
                if hits:
                    strengths.append(f"Team-context alignment: {', '.join(sorted(set(hits))[:5])}")

        # Language/communication readiness (15%) — multilingual is a proxy for
        # cross-cultural collaboration in global teams
        n_langs = len(candidate.profile.languages or [])
        lang_score = min(100.0, 60.0 + 15.0 * n_langs)
        if n_langs >= 2:
            strengths.append(f"Multilingual ({n_langs} languages)")

        score = signal_score * 0.60 + context_score * 0.25 + lang_score * 0.15

        analysis = (
            f"Culture fit for {candidate.profile.name}: "
            f"{len(found)} soft-skill signal(s) detected; "
            f"{n_langs} language(s). "
            f"{'Strengths: ' + '; '.join(strengths) if strengths else 'Limited evidence available.'}"
            f"{' Behavioral evidence judged by TypeSafe.' if judged is not None else ''}"
        )

        dimension_scores = [
            self._dimension_score(
                "Soft-skill Signals", int(signal_score), 0.60,
                gap_items=theme_gaps,
                strength_items=theme_strengths,
            ),
            self._dimension_score("Team-context Alignment", int(context_score), 0.25),
            self._dimension_score("Communication Readiness", int(lang_score), 0.15),
        ]

        return self._create_score(
            score=int(score),
            analysis=analysis,
            dimension_scores=dimension_scores,
            red_flags=gaps,
            recommendations=(
                ["Validate soft skills in behavioral interview"] if gaps else []
            ) + review,
        )
