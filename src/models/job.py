"""Job description models."""

from typing import List, Optional
from pydantic import BaseModel, Field


class JobDescription(BaseModel):
    """Job description and requirements."""

    id: str
    title: str
    company: str
    location: Optional[str] = None

    description: str
    responsibilities: List[str] = Field(default_factory=list)

    required_skills: List[str] = Field(default_factory=list)
    nice_to_have_skills: List[str] = Field(default_factory=list)

    years_experience_required: int
    seniority_level: str = "Senior"  # Junior, Mid, Senior, Lead, Principal

    required_languages: List[str] = Field(default_factory=list)

    hiring_urgency: str = "Medium"  # Low, Medium, High
    team_context: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "job_001",
                "title": "People Analytics / Employee Experience Consultant",
                "company": "Avanade",
                "location": "São Paulo, Brazil",
                "years_experience_required": 10,
                "seniority_level": "Senior",
                "required_skills": ["Viva Glint", "People Analytics", "Statistics"],
                "required_languages": ["English", "Portuguese"],
            }
        }

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return self.model_dump()

    @classmethod
    def from_dict(cls, data: dict) -> "JobDescription":
        """Create from dictionary."""
        return cls(**data)
