"""HTML Report Generator."""

from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from src.models import EvaluationResult


class HTMLReportGenerator:
    """Generates HTML recruitment reports using Jinja2 templates."""

    def __init__(self, template_dir: str = "templates"):
        """
        Initialize HTML generator.

        Args:
            template_dir: Directory containing Jinja2 templates
        """
        self.env = Environment(
            loader=FileSystemLoader(template_dir),
            autoescape=True,
        )

    def generate(self, evaluation_result: EvaluationResult) -> str:
        """
        Generate HTML report.

        Args:
            evaluation_result: Complete evaluation result

        Returns:
            HTML string
        """
        template = self.env.get_template("report.html.jinja")

        # Prepare context
        context = {
            "candidate": evaluation_result.evaluation.candidate_id,
            "job_id": evaluation_result.evaluation.job_id,
            "final_score": evaluation_result.evaluation.final_score,
            "recommendation": evaluation_result.recommendation.status.value,
            "confidence": evaluation_result.recommendation.confidence_level,
            "profile_score": evaluation_result.evaluation.profile_score,
            "technical_score": evaluation_result.evaluation.technical_score,
            "culture_score": evaluation_result.evaluation.culture_score,
            "reference_score": evaluation_result.evaluation.reference_score,
            "strategic_bonus": evaluation_result.evaluation.strategic_bonus,
            "strengths": evaluation_result.recommendation.key_strengths,
            "gaps": evaluation_result.recommendation.addressable_gaps,
            "flags": evaluation_result.recommendation.critical_flags,
            "next_steps": evaluation_result.recommendation.next_steps,
            "onboarding": evaluation_result.recommendation.onboarding_plan,
        }

        return template.render(**context)

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
