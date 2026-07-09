"""Database session management and initialization."""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .models import Base

# On serverless platforms (Vercel/Lambda) the project dir is read-only;
# fall back to /tmp there. Set DATABASE_URL (e.g. Postgres) for persistence.
_default_sqlite = (
    "sqlite:////tmp/recruitment_suite.db"
    if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME")
    else "sqlite:///./recruitment_suite.db"
)
DATABASE_URL = os.getenv("DATABASE_URL", _default_sqlite)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=os.getenv("SQL_ECHO", "False").lower() == "true"
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Dependency injection for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database schema."""
    Base.metadata.create_all(bind=engine)
