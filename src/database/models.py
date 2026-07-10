"""SQLAlchemy database models."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class CandidateRecord(Base):
    """Candidate database record."""

    __tablename__ = "candidates"

    id = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    phone = Column(String(20), nullable=True)
    location = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)

    total_years_experience = Column(Integer, nullable=False)
    languages = Column(JSON, default=[])
    education = Column(JSON, default=[])
    certifications = Column(JSON, default=[])

    cv_text = Column(Text, nullable=True)
    linkedin_profile = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    evaluations = relationship("EvaluationRecord", back_populates="candidate")

    def __repr__(self):
        return f"<Candidate {self.name}>"


class JobRecord(Base):
    """Job description database record."""

    __tablename__ = "jobs"

    id = Column(String(50), primary_key=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)

    description = Column(Text, nullable=False)
    responsibilities = Column(JSON, default=[])

    required_skills = Column(JSON, default=[])
    nice_to_have_skills = Column(JSON, default=[])

    years_experience_required = Column(Integer, nullable=False)
    seniority_level = Column(String(50), default="Senior")
    required_languages = Column(JSON, default=[])

    hiring_urgency = Column(String(50), default="Medium")
    team_context = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    evaluations = relationship("EvaluationRecord", back_populates="job")

    def __repr__(self):
        return f"<Job {self.title} at {self.company}>"


class EvaluationRecord(Base):
    """Evaluation result database record."""

    __tablename__ = "evaluations"

    id = Column(String(50), primary_key=True)
    candidate_id = Column(String(50), ForeignKey("candidates.id"), nullable=False)
    job_id = Column(String(50), ForeignKey("jobs.id"), nullable=False)

    # Scores
    profile_score = Column(Float, nullable=False)
    technical_score = Column(Float, nullable=False)
    culture_score = Column(Float, nullable=False)
    reference_score = Column(Float, nullable=False)
    people_analytics_score = Column(Float, nullable=True)
    strategic_bonus = Column(Float, default=0)

    final_score = Column(Float, nullable=False)
    confidence = Column(Integer, default=0)

    # Recommendation
    recommendation_status = Column(String(50), nullable=False)  # GO, HOLD, NO_GO
    rationale = Column(Text, nullable=False)

    strengths = Column(JSON, default=[])
    gaps = Column(JSON, default=[])
    critical_flags = Column(JSON, default=[])
    next_steps = Column(JSON, default=[])
    onboarding_plan = Column(JSON, nullable=True)

    # Per-agent narrative analysis and dimension breakdown, keyed by category
    # (Profile/Technical/Culture/References/People Analytics). Powers the
    # "why this score" detail in the HTML report.
    agent_analysis = Column(JSON, nullable=True)

    # Metadata
    playbook = Column(String(50), default="full-evaluation")
    use_people_analytics = Column(Integer, default=0)  # Boolean as int
    language = Column(String(10), default="en-US")  # Locale of the generated text (en-US/pt-BR)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    candidate = relationship("CandidateRecord", back_populates="evaluations")
    job = relationship("JobRecord", back_populates="evaluations")

    def __repr__(self):
        return f"<Evaluation {self.id} - {self.recommendation_status}>"
