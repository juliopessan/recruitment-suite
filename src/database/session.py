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
    """Initialize database schema.

    `create_all` only creates missing tables — it never adds a column to a
    table that already exists. On serverless that goes unnoticed because the
    ephemeral SQLite file is rebuilt on every cold start, but a developer's
    local .db survives, so every new model column would break its next SELECT
    with "no such column". `_add_missing_sqlite_columns` closes that gap.
    """
    Base.metadata.create_all(bind=engine)
    if engine.dialect.name == "sqlite":
        _add_missing_sqlite_columns()


def _add_missing_sqlite_columns():
    """Add columns present on the models but missing from the SQLite file.

    Deliberately narrow: it only ever ADDs nullable columns, never drops,
    renames or retypes anything, so it cannot lose data. Anything beyond that
    (and any non-SQLite engine) needs a real migration tool.
    """
    from sqlalchemy import inspect, text

    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    with engine.begin() as conn:
        for table in Base.metadata.sorted_tables:
            if table.name not in existing_tables:
                continue  # create_all just made it, so it is already current
            present = {col["name"] for col in inspector.get_columns(table.name)}
            for column in table.columns:
                if column.name in present or column.primary_key:
                    continue
                ddl = column.type.compile(engine.dialect)
                conn.execute(
                    text(f'ALTER TABLE "{table.name}" ADD COLUMN "{column.name}" {ddl}')
                )
