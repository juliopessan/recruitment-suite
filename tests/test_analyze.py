"""Tests for the agentic /api/analyze endpoint."""

import pytest
from fastapi.testclient import TestClient
from src.api import app
from src.database import init_db, SessionLocal, CandidateRecord, JobRecord, EvaluationRecord

client = TestClient(app)

SAMPLE_CV = b"""Maria Souza
maria.souza@example.com
Senior People Analytics Consultant

12 years of experience in People Analytics and employee listening.
Expertise: Viva Glint, Power BI, Python, Statistics, Survey Methodology.
Psychology degree (USP). Fluent in Portuguese and English.
Certifications: Viva Glint Practitioner, People Analytics (Wharton).
"""

SAMPLE_JD = """Senior People Analytics Consultant

We need a senior consultant with 10+ years of experience to lead employee
listening programs using Viva Glint. Must know Statistics, Power BI,
Survey Methodology and Organizational Psychology. English and Portuguese
required. Urgent hire for our employee experience practice.
"""


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    init_db()
    yield


@pytest.fixture
def cleanup_after_each():
    yield
    db = SessionLocal()
    db.query(EvaluationRecord).delete()
    db.query(CandidateRecord).delete()
    db.query(JobRecord).delete()
    db.commit()
    db.close()


class TestAnalyze:
    def test_analyze_with_txt_cv(self, cleanup_after_each):
        response = client.post(
            "/api/analyze/run",
            data={"job_description": SAMPLE_JD, "company": "Avanade"},
            files={"cv_file": ("maria-cv.txt", SAMPLE_CV, "text/plain")},
        )
        assert response.status_code == 200, response.text
        data = response.json()
        assert data["candidate_name"] == "Maria Souza"
        assert data["use_people_analytics"] is True  # JD mentions people analytics
        assert 0 <= data["final_score"] <= 100
        assert data["recommendation_status"] in ["GO", "HOLD", "NO_GO"]
        assert "Viva Glint" in data["detected_skills"]

        # Evaluation retrievable through the standard endpoint
        detail = client.get(f"/api/evaluations/{data['evaluation_id']}")
        assert detail.status_code == 200

    def test_analyze_requires_candidate_data(self, cleanup_after_each):
        response = client.post(
            "/api/analyze/run",
            data={"job_description": SAMPLE_JD},
        )
        assert response.status_code == 422

    def test_analyze_rejects_unknown_file_type(self, cleanup_after_each):
        response = client.post(
            "/api/analyze/run",
            data={"job_description": SAMPLE_JD},
            files={"cv_file": ("cv.xyz", b"binary", "application/octet-stream")},
        )
        assert response.status_code == 422

    def test_analyze_linkedin_without_exa_key(self, cleanup_after_each, monkeypatch):
        """Without EXA_API_KEY the pipeline degrades gracefully when a CV exists."""
        monkeypatch.delenv("EXA_API_KEY", raising=False)
        response = client.post(
            "/api/analyze/run",
            data={
                "job_description": SAMPLE_JD,
                "linkedin_url": "https://linkedin.com/in/maria-souza",
            },
            files={"cv_file": ("maria-cv.txt", SAMPLE_CV, "text/plain")},
        )
        assert response.status_code == 200
        notes = " ".join(response.json()["pipeline_notes"])
        assert "enrichment skipped" in notes

    def test_analyze_linkedin_only_without_exa_key_explains_why(self, cleanup_after_each, monkeypatch):
        """LinkedIn-only requests fail with an actionable message when Exa is unavailable."""
        monkeypatch.delenv("EXA_API_KEY", raising=False)
        response = client.post(
            "/api/analyze/run",
            data={
                "job_description": SAMPLE_JD,
                "linkedin_url": "https://linkedin.com/in/someone",
            },
        )
        assert response.status_code == 502
        assert "EXA_API_KEY" in response.json()["detail"]
