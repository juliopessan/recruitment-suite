"""Command-line interface for Recruitment Suite."""

import json
from pathlib import Path
import click
from src.models import Candidate, CandidateProfile, JobDescription
from src.agents.orchestrator import RecruitmentOrchestrator
from src.generators import HTMLReportGenerator, PDFReportGenerator


@click.group()
def cli():
    """Recruitment Specialist Agent Suite - Evaluate candidates at scale."""
    pass


@cli.command()
@click.option(
    "--candidate-file",
    type=click.Path(exists=True),
    required=True,
    help="JSON or YAML file with candidate profile",
)
@click.option(
    "--job-file",
    type=click.Path(exists=True),
    required=True,
    help="JSON or YAML file with job description",
)
@click.option(
    "--output-dir",
    type=click.Path(),
    default="reports",
    help="Output directory for reports",
)
@click.option(
    "--format",
    type=click.Choice(["html", "pdf", "json", "all"]),
    default="html",
    help="Report format",
)
@click.option(
    "--people-analytics",
    is_flag=True,
    help="Use Agent 06 (People Analytics) for HR roles",
)
@click.option(
    "--playbook",
    type=click.Choice(["quick-screen", "full-evaluation", "full-people-analytics"]),
    default="full-evaluation",
    help="Evaluation playbook",
)
def evaluate(
    candidate_file,
    job_file,
    output_dir,
    format,
    people_analytics,
    playbook,
):
    """Evaluate a single candidate."""
    click.echo("🚀 Recruitment Suite - Candidate Evaluation")
    click.echo("=" * 60)

    try:
        # Load candidate
        click.echo(f"📋 Loading candidate from {candidate_file}...")
        candidate_data = json.loads(Path(candidate_file).read_text())
        profile = CandidateProfile(**candidate_data["profile"])
        candidate = Candidate(
            id=candidate_data.get("id"),
            profile=profile,
            cv_text=candidate_data.get("cv_text"),
        )
        click.echo(f"✅ Candidate loaded: {candidate.profile.name}")

        # Load job
        click.echo(f"📋 Loading job from {job_file}...")
        job_data = json.loads(Path(job_file).read_text())
        job = JobDescription(**job_data)
        click.echo(f"✅ Job loaded: {job.title} at {job.company}")

        # Run evaluation
        click.echo("\n🔍 Running evaluation pipeline...")
        click.echo("-" * 60)

        orchestrator = RecruitmentOrchestrator()
        result = orchestrator.evaluate(
            candidate=candidate,
            job=job,
            use_people_analytics=people_analytics or playbook == "full-people-analytics",
            playbook=playbook,
        )

        click.echo("-" * 60)
        click.echo(
            f"\n📊 Evaluation Complete!\n"
            f"   Final Score: {result.evaluation.final_score}/100\n"
            f"   Recommendation: {result.recommendation.status.value}\n"
            f"   Confidence: {result.recommendation.confidence_level}%"
        )

        # Generate reports
        click.echo(f"\n📄 Generating reports...")
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        candidate_name = candidate.profile.name.lower().replace(" ", "-")
        base_name = f"{candidate_name}-evaluation"

        if format in ["html", "all"]:
            html_gen = HTMLReportGenerator()
            html_path = output_path / f"{base_name}.html"
            html_gen.save(result, str(html_path))

        if format in ["pdf", "all"]:
            try:
                pdf_gen = PDFReportGenerator()
                pdf_path = output_path / f"{base_name}.pdf"
                pdf_gen.save(result, str(pdf_path))
            except ImportError:
                click.echo("⚠️  PDF skipped: weasyprint not installed (pip install weasyprint)")

        if format in ["json", "all"]:
            json_path = output_path / f"{base_name}.json"
            json_path.write_text(json.dumps(result.to_dict(), indent=2, default=str))
            click.echo(f"✅ JSON report saved to: {json_path}")

        click.echo(f"\n✅ All reports saved to: {output_path}")

    except Exception as e:
        click.echo(f"❌ Error: {e}", err=True)
        raise SystemExit(1)


@cli.command()
@click.option(
    "--candidates-file",
    type=click.Path(exists=True),
    required=True,
    help="CSV file with candidate profiles",
)
@click.option(
    "--job-file",
    type=click.Path(exists=True),
    required=True,
    help="JSON/YAML file with job description",
)
@click.option(
    "--output-dir",
    type=click.Path(),
    default="reports",
    help="Output directory for reports",
)
@click.option(
    "--format",
    type=click.Choice(["html", "pdf", "json", "all"]),
    default="html",
    help="Report format",
)
def batch(candidates_file, job_file, output_dir, format):
    """Evaluate multiple candidates in batch."""
    import pandas as pd

    click.echo("🚀 Recruitment Suite - Batch Evaluation")
    click.echo("=" * 60)

    try:
        # Load candidates CSV
        click.echo(f"📋 Loading candidates from {candidates_file}...")
        candidates_df = pd.read_csv(candidates_file)
        click.echo(f"✅ Loaded {len(candidates_df)} candidates")

        # Load job
        click.echo(f"📋 Loading job from {job_file}...")
        job_data = json.loads(Path(job_file).read_text())
        job = JobDescription(**job_data)
        click.echo(f"✅ Job loaded: {job.title}")

        # Run evaluations
        click.echo(f"\n🔍 Running {len(candidates_df)} evaluations...")
        orchestrator = RecruitmentOrchestrator()
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        results = []
        for idx, row in candidates_df.iterrows():
            click.echo(f"   [{idx+1}/{len(candidates_df)}] {row['name']}...")
            try:
                profile = CandidateProfile(
                    name=row["name"],
                    email=row.get("email", ""),
                    location=row.get("location", ""),
                    total_years_experience=int(row.get("years_experience", 0)),
                    languages=row.get("languages", "").split(","),
                    education=row.get("education", "").split(","),
                )
                candidate = Candidate(profile=profile)

                result = orchestrator.evaluate(candidate, job)
                results.append(
                    {
                        "name": row["name"],
                        "score": result.evaluation.final_score,
                        "recommendation": result.recommendation.status.value,
                    }
                )

                # Save individual report
                candidate_name = row["name"].lower().replace(" ", "-")
                if format in ["html", "all"]:
                    html_gen = HTMLReportGenerator()
                    html_path = output_path / f"{candidate_name}-evaluation.html"
                    html_gen.save(result, str(html_path))

            except Exception as e:
                click.echo(f"   ❌ Error processing {row['name']}: {e}")

        # Save summary
        summary_path = output_path / "summary.json"
        summary_path.write_text(json.dumps(results, indent=2))

        click.echo(f"\n✅ Batch complete! {len(results)} reports generated")
        click.echo(f"   Reports saved to: {output_path}")

    except Exception as e:
        click.echo(f"❌ Error: {e}", err=True)
        raise SystemExit(1)


@cli.command()
def version():
    """Show version."""
    click.echo("Recruitment Specialist Agent Suite v1.0.0")


if __name__ == "__main__":
    cli()
