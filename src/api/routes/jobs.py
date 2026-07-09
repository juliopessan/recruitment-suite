"""Job CRUD endpoints."""

from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import JobRecord, get_db
from src.models import JobDescription
from pydantic import BaseModel

router = APIRouter()


class JobCreate(BaseModel):
    id: str
    title: str
    company: str
    location: str | None = None
    description: str
    responsibilities: List[str] = []
    required_skills: List[str] = []
    nice_to_have_skills: List[str] = []
    years_experience_required: int
    seniority_level: str = "Senior"
    required_languages: List[str] = []
    hiring_urgency: str = "Medium"
    team_context: str | None = None


class JobResponse(BaseModel):
    id: str
    title: str
    company: str
    location: str | None
    years_experience_required: int
    seniority_level: str
    created_at: datetime | None
    updated_at: datetime | None

    class Config:
        from_attributes = True


@router.post("", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    """Create a new job."""
    existing = db.query(JobRecord).filter(JobRecord.id == job.id).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Job {job.id} already exists"
        )

    db_job = JobRecord(
        id=job.id,
        title=job.title,
        company=job.company,
        location=job.location,
        description=job.description,
        responsibilities=job.responsibilities,
        required_skills=job.required_skills,
        nice_to_have_skills=job.nice_to_have_skills,
        years_experience_required=job.years_experience_required,
        seniority_level=job.seniority_level,
        required_languages=job.required_languages,
        hiring_urgency=job.hiring_urgency,
        team_context=job.team_context
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    return db_job


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str, db: Session = Depends(get_db)):
    """Get a job by ID."""
    job = db.query(JobRecord).filter(JobRecord.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )

    return job


@router.get("", response_model=List[JobResponse])
def list_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all jobs with pagination."""
    jobs = db.query(JobRecord).offset(skip).limit(limit).all()
    return jobs


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: str,
    job: JobCreate,
    db: Session = Depends(get_db)
):
    """Update an existing job."""
    db_job = db.query(JobRecord).filter(JobRecord.id == job_id).first()

    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )

    db_job.title = job.title
    db_job.company = job.company
    db_job.location = job.location
    db_job.description = job.description
    db_job.responsibilities = job.responsibilities
    db_job.required_skills = job.required_skills
    db_job.nice_to_have_skills = job.nice_to_have_skills
    db_job.years_experience_required = job.years_experience_required
    db_job.seniority_level = job.seniority_level
    db_job.required_languages = job.required_languages
    db_job.hiring_urgency = job.hiring_urgency
    db_job.team_context = job.team_context

    db.commit()
    db.refresh(db_job)

    return db_job


@router.delete("/{job_id}")
def delete_job(job_id: str, db: Session = Depends(get_db)):
    """Delete a job."""
    db_job = db.query(JobRecord).filter(JobRecord.id == job_id).first()

    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )

    db.delete(db_job)
    db.commit()

    return {"detail": f"Job {job_id} deleted"}
