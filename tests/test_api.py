"""Test suite for Recruitment Suite REST API."""

import pytest
import json
from fastapi.testclient import TestClient
from src.api import app
from src.database import init_db, SessionLocal, CandidateRecord, JobRecord, EvaluationRecord

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Initialize database before running tests."""
    init_db()
    yield
    # Cleanup after tests (optional)


@pytest.fixture
def cleanup_after_each():
    """Clean up database records after each test."""
    yield
    db = SessionLocal()
    db.query(EvaluationRecord).delete()
    db.query(CandidateRecord).delete()
    db.query(JobRecord).delete()
    db.commit()
    db.close()


class TestHealth:
    """Health check endpoint tests."""

    def test_health_check(self):
        """Test API health endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
        assert "version" in response.json()


class TestCandidates:
    """Candidate endpoint tests."""

    def test_create_candidate(self, cleanup_after_each):
        """Test creating a new candidate."""
        candidate_data = {
            "id": "test_cand_001",
            "profile": {
                "name": "Test Candidate",
                "email": "test@example.com",
                "phone": "+1234567890",
                "location": "Test City",
                "total_years_experience": 5,
                "languages": ["English"],
                "education": ["Bachelor's in CS"],
                "certifications": []
            }
        }

        response = client.post("/api/candidates", json=candidate_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Candidate"
        assert data["email"] == "test@example.com"
        assert data["total_years_experience"] == 5

    def test_create_duplicate_candidate(self, cleanup_after_each):
        """Test that duplicate emails are rejected."""
        candidate_data = {
            "id": "test_cand_001",
            "profile": {
                "name": "Test Candidate",
                "email": "dup@example.com",
                "total_years_experience": 5
            }
        }

        response1 = client.post("/api/candidates", json=candidate_data)
        assert response1.status_code == 200

        # Try to create with same email
        candidate_data["id"] = "test_cand_002"
        response2 = client.post("/api/candidates", json=candidate_data)
        assert response2.status_code == 409
        assert "already exists" in response2.json()["detail"]

    def test_get_candidate(self, cleanup_after_each):
        """Test retrieving a candidate."""
        # First create
        candidate_data = {
            "id": "test_cand_001",
            "profile": {
                "name": "Retrieve Test",
                "email": "retrieve@example.com",
                "total_years_experience": 5
            }
        }
        client.post("/api/candidates", json=candidate_data)

        # Then retrieve
        response = client.get("/api/candidates/test_cand_001")
        assert response.status_code == 200
        assert response.json()["name"] == "Retrieve Test"

    def test_get_nonexistent_candidate(self):
        """Test retrieving non-existent candidate."""
        response = client.get("/api/candidates/nonexistent")
        assert response.status_code == 404

    def test_list_candidates(self, cleanup_after_each):
        """Test listing candidates with pagination."""
        # Create multiple candidates
        for i in range(3):
            candidate_data = {
                "id": f"test_cand_{i:03d}",
                "profile": {
                    "name": f"Candidate {i}",
                    "email": f"candidate{i}@example.com",
                    "total_years_experience": 5
                }
            }
            client.post("/api/candidates", json=candidate_data)

        # List all
        response = client.get("/api/candidates")
        assert response.status_code == 200
        assert len(response.json()) == 3

        # Test pagination
        response = client.get("/api/candidates?skip=1&limit=2")
        assert response.status_code == 200
        assert len(response.json()) == 2

    def test_update_candidate(self, cleanup_after_each):
        """Test updating a candidate."""
        # Create
        candidate_data = {
            "id": "test_cand_001",
            "profile": {
                "name": "Original Name",
                "email": "update@example.com",
                "total_years_experience": 5
            }
        }
        client.post("/api/candidates", json=candidate_data)

        # Update
        updated_data = {
            "id": "test_cand_001",
            "profile": {
                "name": "Updated Name",
                "email": "updated@example.com",
                "total_years_experience": 10
            }
        }
        response = client.put("/api/candidates/test_cand_001", json=updated_data)
        assert response.status_code == 200
        assert response.json()["name"] == "Updated Name"
        assert response.json()["total_years_experience"] == 10

    def test_delete_candidate(self, cleanup_after_each):
        """Test deleting a candidate."""
        # Create
        candidate_data = {
            "id": "test_cand_001",
            "profile": {
                "name": "To Delete",
                "email": "delete@example.com",
                "total_years_experience": 5
            }
        }
        client.post("/api/candidates", json=candidate_data)

        # Delete
        response = client.delete("/api/candidates/test_cand_001")
        assert response.status_code == 200

        # Verify deleted
        response = client.get("/api/candidates/test_cand_001")
        assert response.status_code == 404


class TestJobs:
    """Job endpoint tests."""

    def test_create_job(self, cleanup_after_each):
        """Test creating a new job."""
        job_data = {
            "id": "test_job_001",
            "title": "Senior Engineer",
            "company": "TechCorp",
            "location": "San Francisco",
            "description": "Looking for a senior engineer",
            "responsibilities": ["Design systems", "Lead team"],
            "required_skills": ["Python", "Go"],
            "nice_to_have_skills": ["Rust"],
            "years_experience_required": 8,
            "seniority_level": "Senior",
            "required_languages": ["English"],
            "hiring_urgency": "High",
            "team_context": "Platform team"
        }

        response = client.post("/api/jobs", json=job_data)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Senior Engineer"
        assert data["company"] == "TechCorp"

    def test_get_job(self, cleanup_after_each):
        """Test retrieving a job."""
        job_data = {
            "id": "test_job_001",
            "title": "Test Job",
            "company": "TestCorp",
            "description": "A test job",
            "years_experience_required": 5,
            "seniority_level": "Mid"
        }
        client.post("/api/jobs", json=job_data)

        response = client.get("/api/jobs/test_job_001")
        assert response.status_code == 200
        assert response.json()["title"] == "Test Job"

    def test_list_jobs(self, cleanup_after_each):
        """Test listing jobs."""
        for i in range(2):
            job_data = {
                "id": f"test_job_{i:03d}",
                "title": f"Job {i}",
                "company": "TestCorp",
                "description": "Test job",
                "years_experience_required": 5
            }
            client.post("/api/jobs", json=job_data)

        response = client.get("/api/jobs")
        assert response.status_code == 200
        assert len(response.json()) >= 2

    def test_delete_job(self, cleanup_after_each):
        """Test deleting a job."""
        job_data = {
            "id": "test_job_001",
            "title": "Job to Delete",
            "company": "TestCorp",
            "description": "Test",
            "years_experience_required": 5
        }
        client.post("/api/jobs", json=job_data)

        response = client.delete("/api/jobs/test_job_001")
        assert response.status_code == 200

        response = client.get("/api/jobs/test_job_001")
        assert response.status_code == 404


class TestEvaluations:
    """Evaluation endpoint tests."""

    @pytest.fixture
    def setup_candidate_and_job(self, cleanup_after_each):
        """Set up candidate and job for evaluation tests."""
        candidate_data = {
            "id": "eval_test_cand_001",
            "profile": {
                "name": "Eval Test Candidate",
                "email": "eval@example.com",
                "total_years_experience": 5,
                "languages": ["English"],
                "education": ["Bachelor's"],
                "certifications": []
            }
        }
        client.post("/api/candidates", json=candidate_data)

        job_data = {
            "id": "eval_test_job_001",
            "title": "Eval Test Job",
            "company": "EvalTestCorp",
            "description": "Test evaluation job",
            "required_skills": ["Python", "SQL"],
            "years_experience_required": 5,
            "seniority_level": "Mid"
        }
        client.post("/api/jobs", json=job_data)

        return "eval_test_cand_001", "eval_test_job_001"

    def test_run_evaluation(self, setup_candidate_and_job):
        """Test running an evaluation."""
        cand_id, job_id = setup_candidate_and_job

        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen",
            "use_people_analytics": False
        }

        response = client.post("/api/evaluations/run", json=eval_data)
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["candidate_id"] == cand_id
        assert data["job_id"] == job_id
        assert 0 <= data["final_score"] <= 100

    def test_run_evaluation_missing_candidate(self):
        """Test evaluation with missing candidate."""
        eval_data = {
            "candidate_id": "nonexistent_cand",
            "job_id": "nonexistent_job",
            "playbook": "quick-screen"
        }

        response = client.post("/api/evaluations/run", json=eval_data)
        assert response.status_code == 404

    def test_run_evaluation_pt_br(self, setup_candidate_and_job):
        """Test running an evaluation with language=pt-BR translates recommendation text."""
        cand_id, job_id = setup_candidate_and_job

        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen",
            "language": "pt-BR",
        }

        response = client.post("/api/evaluations/run", json=eval_data)
        assert response.status_code == 200
        data = response.json()
        assert data["language"] == "pt-BR"

        detail = client.get(f"/api/evaluations/{data['id']}")
        assert detail.status_code == 200
        rationale = detail.json()["rationale"]
        assert "Nota final" in rationale

    def test_run_evaluation_defaults_to_en_us(self, setup_candidate_and_job):
        """Test that omitting language defaults to en-US."""
        cand_id, job_id = setup_candidate_and_job

        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen",
        }

        response = client.post("/api/evaluations/run", json=eval_data)
        assert response.status_code == 200
        assert response.json()["language"] == "en-US"

    def test_get_evaluation(self, setup_candidate_and_job):
        """Test retrieving evaluation details."""
        cand_id, job_id = setup_candidate_and_job

        # Run evaluation
        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen"
        }
        create_response = client.post("/api/evaluations/run", json=eval_data)
        eval_id = create_response.json()["id"]

        # Get evaluation
        response = client.get(f"/api/evaluations/{eval_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == eval_id
        assert "rationale" in data
        assert "strengths" in data

    def test_add_interview_notes_recalculates_scores(self, setup_candidate_and_job):
        """Test that posting interview notes re-runs the pipeline and snapshots the baseline score."""
        cand_id, job_id = setup_candidate_and_job

        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen",
        }
        create_response = client.post("/api/evaluations/run", json=eval_data)
        eval_id = create_response.json()["id"]
        original_score = create_response.json()["final_score"]

        response = client.post(
            f"/api/evaluations/{eval_id}/notes",
            json={"notes": "Candidate demonstrated excellent Python and SQL skills live during the technical interview."},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["interview_notes"] is not None
        assert "Python" in data["interview_notes"]
        assert data["pre_interview_score"] == original_score
        assert data["notes_updated_at"] is not None

    def test_add_interview_notes_keeps_original_baseline_on_second_call(self, setup_candidate_and_job):
        """Test that re-adding notes doesn't overwrite the first pre-interview baseline."""
        cand_id, job_id = setup_candidate_and_job

        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen",
        }
        create_response = client.post("/api/evaluations/run", json=eval_data)
        eval_id = create_response.json()["id"]

        first = client.post(f"/api/evaluations/{eval_id}/notes", json={"notes": "First round notes."})
        baseline = first.json()["pre_interview_score"]

        second = client.post(f"/api/evaluations/{eval_id}/notes", json={"notes": "Second round notes, updated."})
        assert second.json()["pre_interview_score"] == baseline
        assert "Second round" in second.json()["interview_notes"]

    def test_add_interview_notes_not_found(self):
        """Test adding notes to a nonexistent evaluation returns 404."""
        response = client.post(
            "/api/evaluations/nonexistent_eval/notes",
            json={"notes": "Some notes"},
        )
        assert response.status_code == 404

    def test_get_evaluation_html_report(self, setup_candidate_and_job):
        """Test retrieving the detailed HTML report for an evaluation."""
        cand_id, job_id = setup_candidate_and_job

        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen"
        }
        create_response = client.post("/api/evaluations/run", json=eval_data)
        eval_id = create_response.json()["id"]

        response = client.get(f"/api/evaluations/{eval_id}/report")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
        assert "Candidate Evaluation Report" in response.text

    def test_get_evaluation_html_report_shows_interview_notes(self, setup_candidate_and_job):
        """Test the HTML report includes the notes section and score-before-notes after recalculation."""
        cand_id, job_id = setup_candidate_and_job

        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen",
        }
        create_response = client.post("/api/evaluations/run", json=eval_data)
        eval_id = create_response.json()["id"]

        client.post(
            f"/api/evaluations/{eval_id}/notes",
            json={"notes": "Reference check confirmed strong leadership skills."},
        )

        response = client.get(f"/api/evaluations/{eval_id}/report")
        assert response.status_code == 200
        assert "Post-Interview Notes" in response.text
        assert "Reference check confirmed strong leadership skills." in response.text
        assert "Score before interview notes" in response.text

    def test_get_evaluation_html_report_pt_br(self, setup_candidate_and_job):
        """Test the HTML report renders in Portuguese when the evaluation was run with language=pt-BR."""
        cand_id, job_id = setup_candidate_and_job

        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen",
            "language": "pt-BR",
        }
        create_response = client.post("/api/evaluations/run", json=eval_data)
        eval_id = create_response.json()["id"]

        response = client.get(f"/api/evaluations/{eval_id}/report")
        assert response.status_code == 200
        assert "Relatório de Avaliação do Candidato" in response.text
        assert "<html lang=\"pt\">" in response.text
        # No raw i18n keys or unrendered Jinja should ever leak into the output
        assert "report.title" not in response.text
        assert "{{" not in response.text
        assert "Detalhamento das Notas" in response.text

    def test_get_evaluation_html_report_not_found(self):
        """Test HTML report for a nonexistent evaluation returns 404."""
        response = client.get("/api/evaluations/nonexistent_eval/report")
        assert response.status_code == 404

    def test_list_evaluations(self, setup_candidate_and_job):
        """Test listing evaluations."""
        cand_id, job_id = setup_candidate_and_job

        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen"
        }
        client.post("/api/evaluations/run", json=eval_data)

        response = client.get("/api/evaluations")
        assert response.status_code == 200
        assert len(response.json()) > 0

    def test_candidate_evaluation_history(self, setup_candidate_and_job):
        """Test getting candidate evaluation history."""
        cand_id, job_id = setup_candidate_and_job

        # Create 2 jobs and run evaluations
        job_data2 = {
            "id": "eval_test_job_002",
            "title": "Second Job",
            "company": "EvalTestCorp",
            "description": "Another test job",
            "years_experience_required": 5
        }
        client.post("/api/jobs", json=job_data2)

        for job in [job_id, "eval_test_job_002"]:
            eval_data = {
                "candidate_id": cand_id,
                "job_id": job,
                "playbook": "quick-screen"
            }
            client.post("/api/evaluations/run", json=eval_data)

        # Get history
        response = client.get(f"/api/evaluations/candidate/{cand_id}/history")
        assert response.status_code == 200
        assert len(response.json()) >= 2

    def test_job_evaluation_results(self, setup_candidate_and_job):
        """Test getting job evaluation results."""
        cand_id, job_id = setup_candidate_and_job

        eval_data = {
            "candidate_id": cand_id,
            "job_id": job_id,
            "playbook": "quick-screen"
        }
        client.post("/api/evaluations/run", json=eval_data)

        response = client.get(f"/api/evaluations/job/{job_id}/results")
        assert response.status_code == 200
        assert len(response.json()) > 0


class TestIntegration:
    """Integration tests for complete workflows."""

    def test_complete_workflow(self, cleanup_after_each):
        """Test complete workflow: create candidate, create job, run evaluation."""
        # 1. Create candidate
        candidate_data = {
            "id": "workflow_cand_001",
            "profile": {
                "name": "Workflow Test",
                "email": "workflow@example.com",
                "total_years_experience": 8,
                "languages": ["English", "Spanish"],
                "education": ["Master's in CS"],
                "certifications": ["AWS Solution Architect"]
            }
        }
        cand_response = client.post("/api/candidates", json=candidate_data)
        assert cand_response.status_code == 200

        # 2. Create job
        job_data = {
            "id": "workflow_job_001",
            "title": "Senior Python Engineer",
            "company": "WorkflowCorp",
            "location": "Remote",
            "description": "Build scalable systems",
            "responsibilities": ["Design", "Code review"],
            "required_skills": ["Python", "FastAPI", "PostgreSQL"],
            "nice_to_have_skills": ["Kubernetes"],
            "years_experience_required": 7,
            "seniority_level": "Senior",
            "required_languages": ["English"],
            "hiring_urgency": "High",
            "team_context": "5-person team"
        }
        job_response = client.post("/api/jobs", json=job_data)
        assert job_response.status_code == 200

        # 3. Run evaluation
        eval_data = {
            "candidate_id": "workflow_cand_001",
            "job_id": "workflow_job_001",
            "playbook": "full-evaluation",
            "use_people_analytics": False
        }
        eval_response = client.post("/api/evaluations/run", json=eval_data)
        assert eval_response.status_code == 200
        eval_result = eval_response.json()

        # 4. Verify results
        assert eval_result["final_score"] > 0
        assert eval_result["recommendation_status"] in ["GO", "HOLD", "NO_GO"]

        # 5. Retrieve detailed results
        detail_response = client.get(f"/api/evaluations/{eval_result['id']}")
        assert detail_response.status_code == 200
        details = detail_response.json()
        assert "rationale" in details
        assert "strengths" in details
        assert "gaps" in details


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
