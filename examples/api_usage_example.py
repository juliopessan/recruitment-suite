"""Example: Using Recruitment Suite API with Python requests."""

import requests
import json

BASE_URL = "http://localhost:8000/api"


def create_candidate():
    """Create a new candidate."""
    candidate_data = {
        "id": "cand_api_001",
        "profile": {
            "name": "Alice Johnson",
            "email": "alice.johnson@example.com",
            "phone": "+1-555-0123",
            "location": "San Francisco, USA",
            "total_years_experience": 12,
            "languages": ["English", "French"],
            "education": ["Master's in Computer Science"],
            "certifications": ["AWS Solutions Architect", "Kubernetes Administrator"]
        }
    }

    response = requests.post(f"{BASE_URL}/candidates", json=candidate_data)
    print(f"Create Candidate: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()


def create_job():
    """Create a new job."""
    job_data = {
        "id": "job_api_001",
        "title": "Staff Software Engineer",
        "company": "TechCorp",
        "location": "San Francisco, USA",
        "description": "We are looking for an experienced staff engineer to lead our infrastructure team.",
        "responsibilities": [
            "Design and implement scalable systems",
            "Lead architecture decisions",
            "Mentor junior engineers",
            "Collaborate with product and design teams"
        ],
        "required_skills": ["Python", "Go", "Kubernetes", "PostgreSQL"],
        "nice_to_have_skills": ["Rust", "GraphQL", "TensorFlow"],
        "years_experience_required": 10,
        "seniority_level": "Staff",
        "required_languages": ["English"],
        "hiring_urgency": "High",
        "team_context": "10-person platform engineering team focused on reliability and performance"
    }

    response = requests.post(f"{BASE_URL}/jobs", json=job_data)
    print(f"\nCreate Job: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()


def run_evaluation(candidate_id, job_id):
    """Run evaluation for a candidate against a job."""
    eval_data = {
        "candidate_id": candidate_id,
        "job_id": job_id,
        "playbook": "full-evaluation",
        "use_people_analytics": False
    }

    response = requests.post(f"{BASE_URL}/evaluations/run", json=eval_data)
    print(f"\nRun Evaluation: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()


def get_evaluation(evaluation_id):
    """Get detailed evaluation results."""
    response = requests.get(f"{BASE_URL}/evaluations/{evaluation_id}")
    print(f"\nGet Evaluation Details: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()


def get_candidate_history(candidate_id):
    """Get all evaluations for a candidate."""
    response = requests.get(f"{BASE_URL}/evaluations/candidate/{candidate_id}/history")
    print(f"\nCandidate Evaluation History: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()


def get_job_results(job_id):
    """Get all evaluations for a job."""
    response = requests.get(f"{BASE_URL}/evaluations/job/{job_id}/results")
    print(f"\nJob Evaluation Results: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()


def list_candidates(skip=0, limit=10):
    """List all candidates with pagination."""
    response = requests.get(f"{BASE_URL}/candidates", params={"skip": skip, "limit": limit})
    print(f"\nList Candidates: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()


def main():
    """Run example workflow."""
    print("=" * 60)
    print("Recruitment Suite - API Usage Example")
    print("=" * 60)

    candidate = create_candidate()
    job = create_job()

    evaluation = run_evaluation(candidate["id"], job["id"])

    details = get_evaluation(evaluation["id"])

    history = get_candidate_history(candidate["id"])

    results = get_job_results(job["id"])

    all_candidates = list_candidates()

    print("\n" + "=" * 60)
    print("Example Complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
