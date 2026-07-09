"""Evaluation endpoints for running and managing evaluations."""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from src.database import EvaluationRecord, CandidateRecord, JobRecord, get_db
from src.models import Candidate, JobDescription, Evaluation, EvaluationResult
from src.agents.orchestrator import RecruitmentOrchestrator
from src.generators import HTMLReportGenerator, build_agent_analysis
from pydantic import BaseModel

router = APIRouter()


class EvaluationRequest(BaseModel):
    candidate_id: str
    job_id: str
    playbook: str = "full-evaluation"
    use_people_analytics: bool = False


class EvaluationResponse(BaseModel):
    id: str
    candidate_id: str
    job_id: str
    final_score: float
    recommendation_status: str
    confidence: int
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

    orchestrator = RecruitmentOrchestrator()
    result: EvaluationResult = orchestrator.evaluate(
        candidate=candidate,
        job=job,
        playbook=request.playbook,
        use_people_analytics=request.use_people_analytics
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
        use_people_analytics=1 if request.use_people_analytics else 0
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
