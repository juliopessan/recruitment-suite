"""Agentic analysis endpoint: CV upload + LinkedIn (Exa) + free-text JD -> evaluation."""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from src.database import CandidateRecord, JobRecord, EvaluationRecord, get_db
from src.models import Candidate
from src.agents.orchestrator import RecruitmentOrchestrator
from src.services.cv_parser import CVParseError, extract_cv_text, guess_candidate_fields
from src.services.linkedin_enricher import EnrichmentError, enrich_linkedin
from src.services.jd_parser import is_people_analytics_role, parse_job_description

router = APIRouter()

MAX_CV_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/run")
async def run_analysis(
    job_description: str = Form(..., min_length=30),
    job_title: str = Form(""),
    company: str = Form(""),
    candidate_name: str = Form(""),
    candidate_email: str = Form(""),
    linkedin_url: str = Form(""),
    cv_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """Run the full agentic pipeline from raw inputs.

    Extracts CV text, enriches the LinkedIn profile through Exa, parses the
    free-text job description, persists candidate/job, and runs the
    multi-agent evaluation. Returns the stored evaluation plus pipeline notes.
    """
    notes: list[str] = []

    # 1. CV text
    cv_text = ""
    if cv_file is not None:
        content = await cv_file.read()
        if len(content) > MAX_CV_BYTES:
            raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "CV file exceeds 10 MB")
        try:
            cv_text = extract_cv_text(cv_file.filename or "", content)
            notes.append(f"CV parsed: {cv_file.filename} ({len(cv_text)} chars)")
        except CVParseError as exc:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, str(exc))

    # 2. LinkedIn enrichment via Exa (best-effort)
    linkedin_profile = None
    if linkedin_url:
        try:
            linkedin_profile = enrich_linkedin(linkedin_url)
            notes.append("LinkedIn enriched via Exa")
        except EnrichmentError as exc:
            notes.append(f"LinkedIn enrichment skipped: {exc}")

    if not cv_text and not linkedin_profile:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Provide a CV file and/or a LinkedIn URL so the agents have candidate data",
        )

    # 3. Candidate fields (form wins, then CV heuristics, then LinkedIn text)
    guessed = guess_candidate_fields(cv_text) if cv_text else {}
    if not guessed and linkedin_profile:
        guessed = guess_candidate_fields(linkedin_profile.get("text", ""))

    name = candidate_name or guessed.get("name") or "Unknown Candidate"
    email = candidate_email or guessed.get("email") or f"unknown+{uuid.uuid4().hex[:8]}@candidate.local"
    years = guessed.get("total_years_experience", 0)

    combined_cv_text = cv_text
    if linkedin_profile:
        extra = linkedin_profile.get("summary") or linkedin_profile.get("text") or ""
        combined_cv_text = (combined_cv_text + "\n\n[LinkedIn]\n" + extra).strip()

    candidate = Candidate(
        id=f"cand_{uuid.uuid4().hex[:12]}",
        profile={
            "name": name,
            "email": email,
            "linkedin_url": linkedin_url or None,
            "total_years_experience": years,
            "languages": [],
            "education": [],
            "certifications": [],
        },
        cv_text=combined_cv_text or None,
        linkedin_profile=linkedin_profile,
    )

    # 4. Job description parsing
    job = parse_job_description(job_description, title=job_title, company=company)
    use_pa = is_people_analytics_role(job_description)
    notes.append(
        f"JD parsed: {len(job.required_skills)} skills, {job.years_experience_required}y, "
        f"{job.seniority_level}{', people-analytics mode' if use_pa else ''}"
    )

    # 5. Persist candidate and job (upsert candidate by email)
    existing = db.query(CandidateRecord).filter(CandidateRecord.email == email).first()
    if existing:
        existing.name = name
        existing.linkedin_url = linkedin_url or existing.linkedin_url
        existing.total_years_experience = years or existing.total_years_experience
        existing.cv_text = combined_cv_text or existing.cv_text
        existing.linkedin_profile = linkedin_profile or existing.linkedin_profile
        candidate.id = existing.id
        notes.append(f"Existing candidate updated ({email})")
    else:
        db.add(CandidateRecord(
            id=candidate.id,
            name=name,
            email=email,
            linkedin_url=linkedin_url or None,
            total_years_experience=years,
            languages=[],
            education=[],
            certifications=[],
            cv_text=combined_cv_text or None,
            linkedin_profile=linkedin_profile,
        ))
    db.add(JobRecord(
        id=job.id,
        title=job.title,
        company=job.company,
        description=job.description,
        required_skills=job.required_skills,
        nice_to_have_skills=job.nice_to_have_skills,
        years_experience_required=job.years_experience_required,
        seniority_level=job.seniority_level,
        required_languages=job.required_languages,
        hiring_urgency=job.hiring_urgency,
    ))
    db.commit()

    # 6. Run the multi-agent evaluation
    orchestrator = RecruitmentOrchestrator()
    result = orchestrator.evaluate(candidate=candidate, job=job, use_people_analytics=use_pa)

    db_evaluation = EvaluationRecord(
        id=result.evaluation.id,
        candidate_id=candidate.id,
        job_id=job.id,
        profile_score=result.evaluation.profile_score,
        technical_score=result.evaluation.technical_score,
        culture_score=result.evaluation.culture_score,
        reference_score=result.evaluation.reference_score,
        people_analytics_score=result.evaluation.people_analytics_score,
        strategic_bonus=result.evaluation.strategic_bonus,
        final_score=result.evaluation.final_score,
        confidence=result.recommendation.confidence_level,
        recommendation_status=result.recommendation.status.value,
        rationale=result.recommendation.rationale,
        strengths=result.recommendation.key_strengths or [],
        gaps=result.recommendation.addressable_gaps or [],
        critical_flags=result.recommendation.critical_flags or [],
        next_steps=result.recommendation.next_steps or [],
        onboarding_plan=result.recommendation.onboarding_plan or [],
        playbook="agentic-analysis",
        use_people_analytics=1 if use_pa else 0,
    )
    db.add(db_evaluation)
    db.commit()

    return {
        "evaluation_id": result.evaluation.id,
        "candidate_id": candidate.id,
        "candidate_name": name,
        "job_id": job.id,
        "job_title": job.title,
        "final_score": result.evaluation.final_score,
        "recommendation_status": result.recommendation.status.value,
        "confidence": result.recommendation.confidence_level,
        "use_people_analytics": use_pa,
        "detected_skills": job.required_skills,
        "pipeline_notes": notes,
    }
