"""Candidate CRUD endpoints."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import SessionLocal, CandidateRecord, get_db
from src.models import Candidate, CandidateProfile
from pydantic import BaseModel

router = APIRouter()


class CandidateCreate(BaseModel):
    id: str
    profile: CandidateProfile


class CandidateResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str | None
    location: str | None
    total_years_experience: int
    created_at: str | None
    updated_at: str | None

    class Config:
        from_attributes = True


@router.post("", response_model=CandidateResponse)
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    """Create a new candidate."""
    existing = db.query(CandidateRecord).filter(
        CandidateRecord.email == candidate.profile.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Candidate with email {candidate.profile.email} already exists"
        )

    db_candidate = CandidateRecord(
        id=candidate.id,
        name=candidate.profile.name,
        email=candidate.profile.email,
        phone=candidate.profile.phone,
        location=candidate.profile.location,
        total_years_experience=candidate.profile.total_years_experience,
        languages=candidate.profile.languages,
        education=candidate.profile.education,
        certifications=candidate.profile.certifications
    )

    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)

    return db_candidate


@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: str, db: Session = Depends(get_db)):
    """Get a candidate by ID."""
    candidate = db.query(CandidateRecord).filter(
        CandidateRecord.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate {candidate_id} not found"
        )

    return candidate


@router.get("", response_model=List[CandidateResponse])
def list_candidates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all candidates with pagination."""
    candidates = db.query(CandidateRecord).offset(skip).limit(limit).all()
    return candidates


@router.put("/{candidate_id}", response_model=CandidateResponse)
def update_candidate(
    candidate_id: str,
    candidate: CandidateCreate,
    db: Session = Depends(get_db)
):
    """Update an existing candidate."""
    db_candidate = db.query(CandidateRecord).filter(
        CandidateRecord.id == candidate_id
    ).first()

    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate {candidate_id} not found"
        )

    db_candidate.name = candidate.profile.name
    db_candidate.email = candidate.profile.email
    db_candidate.phone = candidate.profile.phone
    db_candidate.location = candidate.profile.location
    db_candidate.total_years_experience = candidate.profile.total_years_experience
    db_candidate.languages = candidate.profile.languages
    db_candidate.education = candidate.profile.education
    db_candidate.certifications = candidate.profile.certifications

    db.commit()
    db.refresh(db_candidate)

    return db_candidate


@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: str, db: Session = Depends(get_db)):
    """Delete a candidate."""
    db_candidate = db.query(CandidateRecord).filter(
        CandidateRecord.id == candidate_id
    ).first()

    if not db_candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate {candidate_id} not found"
        )

    db.delete(db_candidate)
    db.commit()

    return {"detail": f"Candidate {candidate_id} deleted"}
