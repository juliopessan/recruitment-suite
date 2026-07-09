"""PDF Report Generator."""

from pathlib import Path
from src.models import EvaluationResult
from .html_generator import HTMLReportGenerator


class PDFReportGenerator:
    """Generates PDF recruitment reports."""

    def __init__(self, template_dir: str = "templates"):
        """
        Initialize PDF generator.

        Args:
            template_dir: Directory containing Jinja2 templates
        """
        self.html_generator = HTMLReportGenerator(template_dir)

    def generate(self, evaluation_result: EvaluationResult) -> bytes:
        """
        Generate PDF report.

        Args:
            evaluation_result: Complete evaluation result

        Returns:
            PDF bytes
        """
        from weasyprint import HTML  # Imported lazily: needs system libs (cairo/pango)

        html_string = self.html_generator.generate(evaluation_result)

        # Convert HTML to PDF
        pdf_bytes = HTML(string=html_string).write_pdf()

        return pdf_bytes

    def save(self, evaluation_result: EvaluationResult, output_path: str) -> str:
        """
        Generate and save PDF report.

        Args:
            evaluation_result: Complete evaluation result
            output_path: Path to save PDF file

        Returns:
            Path to saved file
        """
        pdf_bytes = self.generate(evaluation_result)

        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_bytes(pdf_bytes)

        print(f"✅ PDF report saved to: {output_file}")
        return str(output_file)
