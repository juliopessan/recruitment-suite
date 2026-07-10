"""Evaluation endpoints for running and managing evaluations."""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from src.database import EvaluationRecord, CandidateRecord, JobRecord, get_db
from src.models import Candidate, JobDescription, Evaluation, EvaluationResult, DimensionScore
from src.agents.orchestrator import RecruitmentOrchestrator
from src.agents.agent_03_culture import SOFT_SKILL_SIGNALS
from src.agents.agent_06_people_analytics import PA_SIGNALS
from src.generators import HTMLReportGenerator, build_agent_analysis
from src.services.i18n_service import DEFAULT_LOCALE, normalize_locale
from src.services.interview_boost import compute_interview_bonus
from pydantic import BaseModel, Field

router = APIRouter()


class EvaluationRequest(BaseModel):
    candidate_id: str
    job_id: str
    playbook: str = "full-evaluation"
    use_people_analytics: bool = False
    language: str = DEFAULT_LOCALE  # "en-US" or "pt-BR"


class EvaluationResponse(BaseModel):
    id: str
    candidate_id: str
    job_id: str
    final_score: float
    recommendation_status: str
    confidence: int
    language: str
    created_at: datetime | None
    updated_at: datetime | None

    class Config:
        from_attributes = True


class EvaluationDetailResponse(EvaluationResponse):
    profile_score: float
    technical_score: float
    culture_score: float
    reference_score: float
    people_analytics_score: Optional[float]
    strategic_bonus: float
    rationale: str
    strengths: List[str]
    gaps: List[str]
    critical_flags: List[str]
    interview_notes: Optional[str] = None
    pre_interview_score: Optional[float] = None
    pre_interview_status: Optional[str] = None
    notes_updated_at: Optional[datetime] = None


class InterviewNotesRequest(BaseModel):
    notes: str = Field(..., min_length=3)


@router.post("/run", response_model=EvaluationResponse)
def run_evaluation(
    request: EvaluationRequest,
    db: Session = Depends(get_db)
):
    """Run evaluation for a candidate against a job."""
    candidate_record = db.query(CandidateRecord).filter(
        CandidateRecord.id == request.candidate_id
    ).first()

    if not candidate_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate {request.candidate_id} not found"
        )

    job_record = db.query(JobRecord).filter(
        JobRecord.id == request.job_id
    ).first()

    if not job_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {request.job_id} not found"
        )

    candidate = Candidate(
        id=candidate_record.id,
        profile={
            "name": candidate_record.name,
            "email": candidate_record.email,
            "phone": candidate_record.phone,
            "location": candidate_record.location,
            "total_years_experience": candidate_record.total_years_experience,
            "languages": candidate_record.languages or [],
            "education": candidate_record.education or [],
            "certifications": candidate_record.certifications or []
        },
        cv_text=candidate_record.cv_text,
        linkedin_profile=candidate_record.linkedin_profile,
    )

    job = JobDescription(
        id=job_record.id,
        title=job_record.title,
        company=job_record.company,
        location=job_record.location,
        description=job_record.description,
        responsibilities=job_record.responsibilities or [],
        required_skills=job_record.required_skills or [],
        nice_to_have_skills=job_record.nice_to_have_skills or [],
        years_experience_required=job_record.years_experience_required,
        seniority_level=job_record.seniority_level,
        required_languages=job_record.required_languages or [],
        hiring_urgency=job_record.hiring_urgency,
        team_context=job_record.team_context
    )

    language = normalize_locale(request.language)
    orchestrator = RecruitmentOrchestrator()
    result: EvaluationResult = orchestrator.evaluate(
        candidate=candidate,
        job=job,
        playbook=request.playbook,
        use_people_analytics=request.use_people_analytics,
        language=language,
    )

    db_evaluation = EvaluationRecord(
        id=result.evaluation.id,
        candidate_id=request.candidate_id,
        job_id=request.job_id,
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
        agent_analysis=build_agent_analysis(result.evaluation),
        playbook=request.playbook,
        use_people_analytics=1 if request.use_people_analytics else 0,
        language=language,
    )

    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)

    return db_evaluation


@router.get("/{evaluation_id}", response_model=EvaluationDetailResponse)
def get_evaluation(evaluation_id: str, db: Session = Depends(get_db)):
    """Get evaluation details by ID."""
    evaluation = db.query(EvaluationRecord).filter(
        EvaluationRecord.id == evaluation_id
    ).first()

    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evaluation {evaluation_id} not found"
        )

    return evaluation


@router.post("/{evaluation_id}/notes", response_model=EvaluationDetailResponse)
def add_interview_notes(
    evaluation_id: str,
    request: InterviewNotesRequest,
    db: Session = Depends(get_db),
):
    """
    Add post-interview notes and recalculate the evaluation's scores.

    The notes are appended to the candidate's CV text as interview evidence
    and the full multi-agent pipeline re-runs against it, so anything the
    interview surfaced (skills demonstrated, culture-fit signals, reference
    concerns, etc.) can move the scores. The very first pre-notes score is
    kept (pre_interview_score/status) so the report can show the before/after
    delta; re-adding notes again re-evaluates but does not overwrite that
    original baseline.
    """
    evaluation = db.query(EvaluationRecord).filter(
        EvaluationRecord.id == evaluation_id
    ).first()
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evaluation {evaluation_id} not found"
        )

    candidate_record = db.query(CandidateRecord).filter(
        CandidateRecord.id == evaluation.candidate_id
    ).first()
    if not candidate_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate {evaluation.candidate_id} not found"
        )

    job_record = db.query(JobRecord).filter(JobRecord.id == evaluation.job_id).first()
    if not job_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {evaluation.job_id} not found"
        )

    combined_cv_text = (
        f"{candidate_record.cv_text or ''}\n\n[Post-Interview Notes]\n{request.notes}"
    ).strip()

    candidate = Candidate(
        id=candidate_record.id,
        profile={
            "name": candidate_record.name,
            "email": candidate_record.email,
            "phone": candidate_record.phone,
            "location": candidate_record.location,
            "total_years_experience": candidate_record.total_years_experience,
            "languages": candidate_record.languages or [],
            "education": candidate_record.education or [],
            "certifications": candidate_record.certifications or [],
        },
        cv_text=combined_cv_text,
        linkedin_profile=candidate_record.linkedin_profile,
    )

    job = JobDescription(
        id=job_record.id,
        title=job_record.title,
        company=job_record.company,
        location=job_record.location,
        description=job_record.description,
        responsibilities=job_record.responsibilities or [],
        required_skills=job_record.required_skills or [],
        nice_to_have_skills=job_record.nice_to_have_skills or [],
        years_experience_required=job_record.years_experience_required,
        seniority_level=job_record.seniority_level,
        required_languages=job_record.required_languages or [],
        hiring_urgency=job_record.hiring_urgency,
        team_context=job_record.team_context,
    )

    language = normalize_locale(evaluation.language)
    use_pa = bool(evaluation.use_people_analytics)

    # Snapshot the pre-notes baseline exactly once, before anything is overwritten.
    if evaluation.pre_interview_score is None:
        evaluation.pre_interview_score = evaluation.final_score
        evaluation.pre_interview_status = evaluation.recommendation_status

    orchestrator = RecruitmentOrchestrator()
    result: EvaluationResult = orchestrator.evaluate(
        candidate=candidate,
        job=job,
        playbook=evaluation.playbook,
        use_people_analytics=use_pa,
        language=language,
    )

    # Interview-verified evidence is stronger than an unverified CV claim: if
    # the notes explicitly reconfirm a required skill, soft-skill signal, or
    # People Analytics signal the corpus-matching agents already knew about,
    # credit it again here — otherwise notes that only restate existing CV
    # content move nothing, which reads as "the notes did nothing."
    technical_bonus, technical_hits = (
        (0, []) if use_pa
        else compute_interview_bonus(request.notes, (job.required_skills or []) + (job.nice_to_have_skills or []))
    )
    pa_terms = [s for signals in PA_SIGNALS.values() for s in signals]
    pa_bonus, pa_hits = (
        compute_interview_bonus(request.notes, pa_terms) if use_pa else (0, [])
    )
    culture_bonus, culture_hits = compute_interview_bonus(request.notes, SOFT_SKILL_SIGNALS)

    boosted_technical = min(100, result.evaluation.technical_score + technical_bonus)
    boosted_culture = min(100, result.evaluation.culture_score + culture_bonus)
    boosted_pa = (
        min(100, result.evaluation.people_analytics_score + pa_bonus)
        if result.evaluation.people_analytics_score is not None else None
    )

    def _record_bonus(agent_key: str, new_score: int, bonus: int, hits: list):
        """Append an explicit dimension entry so the report explains the bump."""
        agent_score = result.evaluation.agent_scores.get(agent_key)
        if agent_score is None or bonus <= 0:
            return
        agent_score.score = new_score
        agent_score.dimension_scores.append(DimensionScore(
            dimension="Interview Verification Bonus",
            score=min(100, 70 + bonus * 2),
            weight=0.0,
            strengths=[f"Reconfirmed in interview: {h}" for h in hits],
            agent=agent_score.agent,
        ))

    if not use_pa:
        _record_bonus("02-technical", boosted_technical, technical_bonus, technical_hits)
    _record_bonus("03-culture", boosted_culture, culture_bonus, culture_hits)
    if use_pa:
        _record_bonus("06-people-analytics", boosted_pa, pa_bonus, pa_hits)

    # Interview notes are additional evidence, never a reason to know less than
    # before: each dimension can only go up, never down, from the pre-notes score.
    clamped = Evaluation(
        candidate_id=evaluation.candidate_id,
        job_id=evaluation.job_id,
        profile_score=max(evaluation.profile_score, result.evaluation.profile_score),
        technical_score=max(evaluation.technical_score, boosted_technical),
        culture_score=max(evaluation.culture_score, boosted_culture),
        reference_score=max(evaluation.reference_score, result.evaluation.reference_score),
        people_analytics_score=(
            max(evaluation.people_analytics_score, boosted_pa)
            if evaluation.people_analytics_score is not None and boosted_pa is not None
            else boosted_pa
        ),
        strategic_bonus=max(evaluation.strategic_bonus, result.evaluation.strategic_bonus),
    )
    clamped.calculate_final_score(use_people_analytics=use_pa)
    clamped.confidence = result.evaluation.confidence
    clamped.agent_scores = result.evaluation.agent_scores

    recommendation = orchestrator._create_recommendation(clamped, candidate, job, use_pa, language)

    evaluation.profile_score = clamped.profile_score
    evaluation.technical_score = clamped.technical_score
    evaluation.culture_score = clamped.culture_score
    evaluation.reference_score = clamped.reference_score
    evaluation.people_analytics_score = clamped.people_analytics_score
    evaluation.strategic_bonus = clamped.strategic_bonus
    evaluation.final_score = clamped.final_score
    evaluation.confidence = recommendation.confidence_level
    evaluation.recommendation_status = recommendation.status.value
    evaluation.rationale = recommendation.rationale
    evaluation.strengths = recommendation.key_strengths or []
    evaluation.gaps = recommendation.addressable_gaps or []
    evaluation.critical_flags = recommendation.critical_flags or []
    evaluation.next_steps = recommendation.next_steps or []
    evaluation.onboarding_plan = recommendation.onboarding_plan or []
    evaluation.agent_analysis = build_agent_analysis(clamped)
    evaluation.interview_notes = request.notes
    evaluation.notes_updated_at = datetime.utcnow()

    db.commit()
    db.refresh(evaluation)

    return evaluation


@router.get("", response_model=List[EvaluationResponse])
def list_evaluations(
    candidate_id: Optional[str] = None,
    job_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List evaluations with optional filtering."""
    query = db.query(EvaluationRecord)

    if candidate_id:
        query = query.filter(EvaluationRecord.candidate_id == candidate_id)

    if job_id:
        query = query.filter(EvaluationRecord.job_id == job_id)

    evaluations = query.offset(skip).limit(limit).all()
    return evaluations


@router.get("/{evaluation_id}/report", response_class=HTMLResponse)
def get_evaluation_report(evaluation_id: str, db: Session = Depends(get_db)):
    """Render a detailed HTML report for an evaluation."""
    evaluation = db.query(EvaluationRecord).filter(
        EvaluationRecord.id == evaluation_id
    ).first()

    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evaluation {evaluation_id} not found"
        )

    candidate = db.query(CandidateRecord).filter(
        CandidateRecord.id == evaluation.candidate_id
    ).first()
    job = db.query(JobRecord).filter(JobRecord.id == evaluation.job_id).first()

    generator = HTMLReportGenerator()
    html = generator.generate_from_context({
        "candidate_name": candidate.name if candidate else evaluation.candidate_id,
        "job_title": job.title if job else evaluation.job_id,
        "job_company": job.company if job else None,
        "generated_at": evaluation.created_at.strftime("%Y-%m-%d %H:%M UTC") if evaluation.created_at else "",
        "final_score": evaluation.final_score,
        "recommendation": evaluation.recommendation_status,
        "confidence": evaluation.confidence,
        "rationale": evaluation.rationale,
        "profile_score": evaluation.profile_score,
        "technical_score": evaluation.technical_score,
        "culture_score": evaluation.culture_score,
        "reference_score": evaluation.reference_score,
        "people_analytics_score": evaluation.people_analytics_score,
        "strategic_bonus": evaluation.strategic_bonus,
        "strengths": evaluation.strengths or [],
        "gaps": evaluation.gaps or [],
        "flags": evaluation.critical_flags or [],
        "next_steps": evaluation.next_steps or [],
        "onboarding": evaluation.onboarding_plan or [],
        "agent_analysis": evaluation.agent_analysis or {},
        "language": normalize_locale(evaluation.language),
        "interview_notes": evaluation.interview_notes,
        "pre_interview_score": evaluation.pre_interview_score,
        "pre_interview_status": evaluation.pre_interview_status,
        "notes_updated_at": evaluation.notes_updated_at.strftime("%Y-%m-%d %H:%M UTC") if evaluation.notes_updated_at else None,
    })

    return HTMLResponse(content=html)


@router.get("/candidate/{candidate_id}/history", response_model=List[EvaluationResponse])
def get_candidate_evaluation_history(
    candidate_id: str,
    db: Session = Depends(get_db)
):
    """Get all evaluations for a specific candidate."""
    candidate = db.query(CandidateRecord).filter(
        CandidateRecord.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate {candidate_id} not found"
        )

    evaluations = db.query(EvaluationRecord).filter(
        EvaluationRecord.candidate_id == candidate_id
    ).order_by(EvaluationRecord.created_at.desc()).all()

    return evaluations


@router.get("/job/{job_id}/results", response_model=List[EvaluationResponse])
def get_job_evaluation_results(
    job_id: str,
    db: Session = Depends(get_db)
):
    """Get all evaluations for a specific job."""
    job = db.query(JobRecord).filter(JobRecord.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )

    evaluations = db.query(EvaluationRecord).filter(
        EvaluationRecord.job_id == job_id
    ).order_by(EvaluationRecord.final_score.desc()).all()

    return evaluations
