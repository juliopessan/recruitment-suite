"""HTML Report Generator."""

import re
from datetime import datetime, timezone
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup, escape
from src.models import EvaluationResult, Evaluation

_BOLD_RE = re.compile(r"\*\*(.+?)\*\*")


def render_analysis_html(text: str) -> Markup:
    """
    Turn an agent's plain-text narrative (which may contain lightweight
    **bold** markdown) into clean, escaped HTML: bold spans, paragraphs on
    blank lines, line breaks within a paragraph. Escapes first so nothing in
    the source text (candidate name, skills, etc.) can inject markup.
    """
    if not text:
        return Markup("")
    escaped = str(escape(text.strip()))
    escaped = _BOLD_RE.sub(r"<strong>\1</strong>", escaped)

    paragraphs = re.split(r"\n\s*\n", escaped)
    html = "".join(
        f"<p>{para.strip().replace(chr(10), '<br>')}</p>"
        for para in paragraphs
        if para.strip()
    )
    return Markup(html)

# Maps internal agent_scores keys to the display labels used in the report.
_AGENT_LABELS = {
    "01-profile": "Profile",
    "02-technical": "Technical",
    "03-culture": "Culture Fit",
    "04-references": "References",
    "06-people-analytics": "People Analytics",
}


def build_agent_analysis(evaluation: Evaluation) -> dict:
    """
    Extract each agent's narrative analysis and dimension breakdown, keyed by
    display label, so it can be persisted alongside the evaluation and shown
    in the report as the "why this score" detail. Without this, the rich
    per-dimension reasoning computed by each agent is discarded once the
    aggregate scores are saved.
    """
    analysis: dict = {}
    for key, label in _AGENT_LABELS.items():
        agent_score = evaluation.agent_scores.get(key)
        if not agent_score:
            continue
        analysis[label] = {
            "analysis": agent_score.analysis.strip(),
            "dimensions": [
                {
                    "dimension": d.dimension,
                    "score": d.score,
                    "weight": d.weight,
                    "gaps": d.gaps,
                    "strengths": d.strengths,
                }
                for d in agent_score.dimension_scores
            ],
            "red_flags": agent_score.red_flags,
        }
    return analysis


class HTMLReportGenerator:
    """Generates HTML recruitment reports using Jinja2 templates."""

    def __init__(self, template_dir: str = None):
        """
        Initialize HTML generator.

        Args:
            template_dir: Directory containing Jinja2 templates.
                Defaults to the repo's templates/ directory, independent of cwd.
        """
        if template_dir is None:
            template_dir = str(Path(__file__).resolve().parents[2] / "templates")
        self.env = Environment(
            loader=FileSystemLoader(template_dir),
            autoescape=True,
        )
        self.env.filters["analysis_html"] = render_analysis_html

    def generate(
        self,
        evaluation_result: EvaluationResult,
        candidate_name: str = None,
        job_title: str = None,
        job_company: str = None,
    ) -> str:
        """
        Generate HTML report.

        Args:
            evaluation_result: Complete evaluation result
            candidate_name: Display name for the candidate (falls back to candidate_id)
            job_title: Display title for the job (falls back to job_id)
            job_company: Optional company name shown next to the job title

        Returns:
            HTML string
        """
        template = self.env.get_template("report.html.jinja")

        # Prepare context
        context = {
            "candidate_name": candidate_name or evaluation_result.evaluation.candidate_id,
            "job_title": job_title or evaluation_result.evaluation.job_id,
            "job_company": job_company,
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
            "final_score": evaluation_result.evaluation.final_score,
            "recommendation": evaluation_result.recommendation.status.value,
            "confidence": evaluation_result.recommendation.confidence_level,
            "profile_score": evaluation_result.evaluation.profile_score,
            "technical_score": evaluation_result.evaluation.technical_score,
            "culture_score": evaluation_result.evaluation.culture_score,
            "reference_score": evaluation_result.evaluation.reference_score,
            "people_analytics_score": evaluation_result.evaluation.people_analytics_score,
            "strategic_bonus": evaluation_result.evaluation.strategic_bonus,
            "strengths": evaluation_result.recommendation.key_strengths,
            "gaps": evaluation_result.recommendation.addressable_gaps,
            "flags": evaluation_result.recommendation.critical_flags,
            "next_steps": evaluation_result.recommendation.next_steps,
            "onboarding": evaluation_result.recommendation.onboarding_plan,
            "agent_analysis": build_agent_analysis(evaluation_result.evaluation),
        }

        return template.render(**context)

    def generate_from_context(self, context: dict) -> str:
        """
        Generate HTML report from a raw context dict (e.g. built from a DB record),
        bypassing the EvaluationResult domain object. Missing optional keys default
        to sensible empty values so the template never errors on partial data.

        Args:
            context: Fields matching the report.html.jinja template variables

        Returns:
            HTML string
        """
        template = self.env.get_template("report.html.jinja")
        defaults = {
            "job_company": None,
            "people_analytics_score": None,
            "strengths": [],
            "gaps": [],
            "flags": [],
            "next_steps": [],
            "onboarding": [],
            "agent_analysis": {},
        }
        return template.render(**{**defaults, **context})

    def save(self, evaluation_result: EvaluationResult, output_path: str) -> str:
        """
        Generate and save HTML report.

        Args:
            evaluation_result: Complete evaluation result
            output_path: Path to save HTML file

        Returns:
            Path to saved file
        """
        html = self.generate(evaluation_result)

        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text(html)

        print(f"✅ HTML report saved to: {output_file}")
        return str(output_file)
