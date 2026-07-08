# Phase 2 Quick Start Guide

Get the Recruitment Suite API up and running in 5 minutes.

## Prerequisites

- Python 3.9+
- pip or poetry

## Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Create Configuration

```bash
cp .env.example .env
```

For default SQLite, no changes needed. Database auto-creates on first run.

## Running the API Server

### Start Server

```bash
python api.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Access Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

## First Steps

### 1. Create a Candidate (via curl or Swagger UI)

**Using curl:**

```bash
curl -X POST http://localhost:8000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "id": "cand_001",
    "profile": {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "total_years_experience": 10,
      "languages": ["English"],
      "education": ["Master'\''s in CS"],
      "certifications": []
    }
  }'
```

**Using Swagger UI:**
1. Go to http://localhost:8000/docs
2. Click "POST /api/candidates" → "Try it out"
3. Fill in the JSON body
4. Click "Execute"

### 2. Create a Job

```bash
curl -X POST http://localhost:8000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "id": "job_001",
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
  }'
```

### 3. Run Evaluation

```bash
curl -X POST http://localhost:8000/api/evaluations/run \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": "cand_001",
    "job_id": "job_001",
    "playbook": "quick-screen",
    "use_people_analytics": false
  }'
```

Response:
```json
{
  "id": "eval_xyz123",
  "candidate_id": "cand_001",
  "job_id": "job_001",
  "final_score": 78.5,
  "recommendation_status": "GO",
  "confidence": 87,
  "created_at": "2026-07-08T10:35:00Z"
}
```

### 4. Get Evaluation Details

```bash
curl http://localhost:8000/api/evaluations/eval_xyz123
```

## Available Playbooks

| Playbook | Agents | Time | Use For |
|----------|--------|------|---------|
| `quick-screen` | 01, 02, 05 | 5-10 min | Fast pass/fail screening |
| `full-evaluation` | 01, 02, 03, 04, 05 | 30-45 min | Comprehensive assessment |
| `full-people-analytics` | 01, 02, 03, 04, 06, 05 | 40-50 min | HR/People specialist roles |

## Common Tasks

### List All Candidates

```bash
curl http://localhost:8000/api/candidates
```

### Get Candidate by ID

```bash
curl http://localhost:8000/api/candidates/cand_001
```

### List Jobs

```bash
curl http://localhost:8000/api/jobs
```

### Get Evaluation History for Candidate

```bash
curl http://localhost:8000/api/evaluations/candidate/cand_001/history
```

### Get All Evaluations for a Job

```bash
curl http://localhost:8000/api/evaluations/job/job_001/results
```

### Update Candidate

```bash
curl -X PUT http://localhost:8000/api/candidates/cand_001 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "cand_001",
    "profile": {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "total_years_experience": 11
    }
  }'
```

### Delete Candidate

```bash
curl -X DELETE http://localhost:8000/api/candidates/cand_001
```

## Testing

### Run Test Suite

```bash
pytest tests/ -v
```

### Run Specific Tests

```bash
# Test candidates only
pytest tests/test_api.py::TestCandidates -v

# Test evaluations only
pytest tests/test_api.py::TestEvaluations -v
```

### Run Python Example Script

```bash
python examples/api_usage_example.py
```

## Database

### Check SQLite Database

```bash
sqlite3 recruitment_suite.db
.tables
.schema candidates
SELECT COUNT(*) FROM candidates;
```

### Switch to PostgreSQL

1. Create database:
```bash
createdb recruitment_suite
```

2. Update `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost/recruitment_suite
```

3. Restart API server (schema creates automatically)

## Troubleshooting

### Port Already in Use

If port 8000 is taken, modify `api.py`:

```python
uvicorn.run(..., port=8001)
```

Or use environment variable:
```bash
API_PORT=8001 python api.py
```

### Database Locked

Close any other connections to `recruitment_suite.db`:

```bash
# List processes
lsof | grep recruitment_suite.db

# Close them
# Or delete the database (will recreate)
rm recruitment_suite.db
```

### Import Errors

Ensure you're in the correct directory and dependencies are installed:

```bash
cd /path/to/recruitment-suite
pip install -r requirements.txt
python api.py
```

## Integration with CLI

You can use both CLI and API together:

**CLI (evaluate a single candidate):**
```bash
python main.py evaluate \
  --candidate-file candidate.json \
  --job-file job.json \
  --format html
```

**API (store and retrieve results):**
```bash
# Store evaluation results in database via API
curl -X POST http://localhost:8000/api/evaluations/run \
  -d '{"candidate_id": "cand_001", "job_id": "job_001"}'

# Query results
curl http://localhost:8000/api/evaluations/candidate/cand_001/history
```

## Next Steps

1. **Read Full API Documentation:** [API.md](API.md)
2. **Understand Architecture:** [PHASE2.md](PHASE2.md)
3. **Run Test Suite:** `pytest tests/ -v`
4. **Explore Swagger UI:** http://localhost:8000/docs
5. **Check Out Example Script:** [examples/api_usage_example.py](examples/api_usage_example.py)

## Example: Complete Workflow

```bash
#!/bin/bash

# 1. Create candidate
curl -X POST http://localhost:8000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "id": "example_cand",
    "profile": {
      "name": "Example User",
      "email": "example@test.com",
      "total_years_experience": 5
    }
  }'

# 2. Create job
curl -X POST http://localhost:8000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "id": "example_job",
    "title": "Engineer",
    "company": "Example Corp",
    "description": "Test job",
    "years_experience_required": 5
  }'

# 3. Run evaluation
EVAL_ID=$(curl -s -X POST http://localhost:8000/api/evaluations/run \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": "example_cand",
    "job_id": "example_job",
    "playbook": "quick-screen"
  }' | jq -r '.id')

# 4. Get results
curl http://localhost:8000/api/evaluations/$EVAL_ID

# 5. Get history
curl http://localhost:8000/api/evaluations/candidate/example_cand/history
```

Save as `workflow.sh` and run:
```bash
bash workflow.sh
```

## Support

- **Full Documentation:** [API.md](API.md), [PHASE2.md](PHASE2.md)
- **Examples:** [examples/api_usage_example.py](examples/api_usage_example.py)
- **Tests:** [tests/test_api.py](tests/test_api.py)
- **Configuration:** [.env.example](.env.example)

---

**Phase 2 Status:** ✅ Complete  
**API Ready:** Yes  
**Tests Passing:** Yes  
**Last Updated:** 2026-07-08
