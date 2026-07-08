"""Candidate profile models."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class CandidateProfile(BaseModel):
    """Candidate educational and professional background."""

    name: str
    email: str
    phone: Optional[str] = None
    location: str
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

    education: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)

    total_years_experience: int
    languages: List[str] = Field(default_factory=list)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Natália Karam",
                "email": "natalia@example.com",
                "location": "Porto Alegre, Brazil",
                "linkedin_url": "https://linkedin.com/in/nataliakaram",
                "total_years_experience": 12,
                "languages": ["Portuguese", "English", "Spanish"],
            }
        }


class Candidate(BaseModel):
    """Complete candidate record."""

    id: str = Field(default_factory=lambda: f"cand_{datetime.now().timestamp()}")
    profile: CandidateProfile
    cv_text: Optional[str] = None
    linkedin_profile: Optional[dict] = None

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return self.model_dump()

    @classmethod
    def from_dict(cls, data: dict) -> "Candidate":
        """Create from dictionary."""
        return cls(**data)
