# Recruitment Suite - REST API Documentation

Complete REST API for the Recruitment Suite multi-agent evaluation system.

## Quick Start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure database

Create `.env` file (see `.env.example`):

```bash
cp .env.example .env
```

Default uses SQLite. For PostgreSQL, update `DATABASE_URL`:

```
DATABASE_URL=postgresql://user:password@localhost/recruitment_suite
```

### 3. Run API server

```bash
python api.py
```

The API will be available at `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Base URL

```
http://localhost:8000/api
```

## Authentication

Currently no authentication required. Add JWT/OAuth as needed.

## Response Format

All responses are JSON. Errors follow standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad request
- `404` - Not found
- `409` - Conflict (e.g., duplicate email)
- `500` - Server error

## Candidate Endpoints

### Create Candidate

```http
POST /candidates
Content-Type: application/json

{
  "id": "cand_001",
  "profile": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, USA",
    "total_years_experience": 10,
    "languages": ["English", "Spanish"],
    "education": ["Bachelor's in Computer Science"],
    "certifications": ["AWS Solutions Architect"]
  }
}
```

**Response:**

```json
{
  "id": "cand_001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "New York, USA",
  "total_years_experience": 10,
  "created_at": "2026-07-08T10:30:00Z",
  "updated_at": "2026-07-08T10:30:00Z"
}
```

### Get Candidate

```http
GET /candidates/{candidate_id}
```

### List Candidates

```http
GET /candidates?skip=0&limit=20
```

**Query Parameters:**
- `skip` - Number of records to skip (default: 0)
- `limit` - Maximum records to return (default: 100)

### Update Candidate

```http
PUT /candidates/{candidate_id}
Content-Type: application/json

{
  "id": "cand_001",
  "profile": { ... }
}
```

### Delete Candidate

```http
DELETE /candidates/{candidate_id}
```

## Job Endpoints

### Create Job

```http
POST /jobs
Content-Type: application/json

{
  "id": "job_001",
  "title": "Senior Python Engineer",
  "company": "Acme Corp",
  "location": "San Francisco, USA",
  "description": "Looking for an experienced Python engineer...",
  "responsibilities": [
    "Design and implement scalable systems",
    "Lead code reviews",
    "Mentor junior developers"
  ],
  "required_skills": ["Python", "FastAPI", "PostgreSQL"],
  "nice_to_have_skills": ["Kubernetes", "GraphQL"],
  "years_experience_required": 8,
  "seniority_level": "Senior",
  "required_languages": ["English"],
  "hiring_urgency": "High",
  "team_context": "Cross-functional team of 5 engineers..."
}
```

### Get Job

```http
GET /jobs/{job_id}
```

### List Jobs

```http
GET /jobs?skip=0&limit=20
```

### Update Job

```http
PUT /jobs/{job_id}
Content-Type: application/json
```

### Delete Job

```http
DELETE /jobs/{job_id}
```

## Evaluation Endpoints

### Run Evaluation

Execute the multi-agent evaluation pipeline for a candidate against a job.

```http
POST /evaluations/run
Content-Type: application/json

{
  "candidate_id": "cand_001",
  "job_id": "job_001",
  "playbook": "full-evaluation",
  "use_people_analytics": false
}
```

**Parameters:**
- `candidate_id` - Existing candidate ID (required)
- `job_id` - Existing job ID (required)
- `playbook` - Evaluation scope:
  - `quick-screen` - Agents 01, 02, 05 (5-10 min)
  - `full-evaluation` - Agents 01, 02, 03, 04, 05 (30-45 min)
  - `full-people-analytics` - Agents 01, 02, 03, 04, 06, 05 (40-50 min)
- `use_people_analytics` - Enable People Analytics scoring (boolean)

**Response:**

```json
{
  "id": "eval_001",
  "candidate_id": "cand_001",
  "job_id": "job_001",
  "final_score": 78.5,
  "recommendation_status": "GO",
  "confidence": 85,
  "created_at": "2026-07-08T10:35:00Z",
  "updated_at": "2026-07-08T10:35:00Z"
}
```

### Get Evaluation Details

```http
GET /evaluations/{evaluation_id}
```

**Response includes:**
- `profile_score` - Profile & Background score (0-100)
- `technical_score` - Technical Skills score (0-100)
- `culture_score` - Culture Fit score (0-100)
- `reference_score` - References & Track Record score (0-100)
- `people_analytics_score` - People Analytics score (optional, 0-100)
- `strategic_bonus` - Strategic bonus (0-5)
- `final_score` - Weighted final score (0-100)
- `rationale` - Recommendation explanation
- `strengths` - Key strengths array
- `gaps` - Addressable gaps array
- `critical_flags` - Blockers array

### List Evaluations

```http
GET /evaluations?candidate_id=cand_001&job_id=job_001&skip=0&limit=20
```

**Query Parameters:**
- `candidate_id` - Filter by candidate (optional)
- `job_id` - Filter by job (optional)
- `skip` - Records to skip (default: 0)
- `limit` - Max records (default: 100)

### Candidate Evaluation History

```http
GET /evaluations/candidate/{candidate_id}/history
```

Returns all evaluations for a candidate, ordered by date (newest first).

### Job Evaluation Results

```http
GET /evaluations/job/{job_id}/results
```

Returns all evaluations for a job, ordered by final score (highest first).

## Scoring System

### Dimensions & Weights (Tech Role)

| Dimension | Weight | Score Range | Agent |
|-----------|--------|-------------|-------|
| Profile & Background | 20% | 0-100 | Agent 01 |
| Technical Skills | 35% | 0-100 | Agent 02 |
| Culture Fit | 25% | 0-100 | Agent 03 |
| References | 15% | 0-100 | Agent 04 |
| Strategic Bonus | 5% | 0-5 | Orchestrator |
| **Final Score** | **100%** | **0-100** | — |

### Dimensions & Weights (People Analytics Role)

When `use_people_analytics=true`:

| Dimension | Weight | Score Range | Agent |
|-----------|--------|-------------|-------|
| Profile & Background | 15% | 0-100 | Agent 01 |
| Technical Skills | 5% | 0-100 | Agent 02 |
| People Analytics | 35% | 0-100 | Agent 06 |
| Culture Fit | 25% | 0-100 | Agent 03 |
| References | 15% | 0-100 | Agent 04 |
| Strategic Bonus | 5% | 0-5 | Orchestrator |
| **Final Score** | **100%** | **0-100** | — |

### Recommendation Thresholds

- **75+** → `GO` - Extend offer
- **60-74** → `HOLD` - Manager discussion or additional data
- **30-59** → `HOLD` - Significant gaps, only with mitigation
- **<30** → `NO-GO` - Pass, archive

## Error Responses

### Candidate Not Found

```http
GET /candidates/invalid_id
```

```json
{
  "detail": "Candidate invalid_id not found"
}
```

### Duplicate Email

```http
POST /candidates
{
  "id": "cand_002",
  "profile": {
    "email": "john@example.com"
  }
}
```

```json
{
  "detail": "Candidate with email john@example.com already exists"
}
```

### Missing Job for Evaluation

```http
POST /evaluations/run
{
  "candidate_id": "cand_001",
  "job_id": "invalid_job"
}
```

```json
{
  "detail": "Job invalid_job not found"
}
```

## Example Workflow

### 1. Create a candidate

```bash
curl -X POST http://localhost:8000/api/candidates \
  -H "Content-Type: application/json" \
  -d @candidate.json
```

### 2. Create a job

```bash
curl -X POST http://localhost:8000/api/jobs \
  -H "Content-Type: application/json" \
  -d @job.json
```

### 3. Run evaluation

```bash
curl -X POST http://localhost:8000/api/evaluations/run \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": "cand_001",
    "job_id": "job_001",
    "playbook": "full-evaluation"
  }'
```

### 4. Get evaluation results

```bash
curl http://localhost:8000/api/evaluations/eval_001
```

### 5. View candidate history

```bash
curl http://localhost:8000/api/evaluations/candidate/cand_001/history
```

## Integration with CLI

The CLI (Python) and API (FastAPI) can work together:

**CLI generates evaluations:**

```bash
python main.py evaluate \
  --candidate-file candidate.json \
  --job-file job.json \
  --format html
```

**API stores and retrieves results:**

```bash
# Store in database
curl -X POST http://localhost:8000/api/evaluations/run \
  -H "Content-Type: application/json" \
  -d '{"candidate_id": "cand_001", "job_id": "job_001"}'

# Retrieve history
curl http://localhost:8000/api/evaluations/candidate/cand_001/history
```

## Database

### Default SQLite

```bash
# Located at: recruitment_suite.db
# No setup needed, auto-creates on first run
```

### PostgreSQL

```bash
# Create database
createdb recruitment_suite

# Update .env
DATABASE_URL=postgresql://user:password@localhost/recruitment_suite

# Run api.py (creates schema automatically)
python api.py
```

## Health Check

```http
GET /health
```

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

## Limits & Pagination

- **Default limit:** 100 records
- **Max limit:** 100 records (enforced)
- **Default skip:** 0 (first record)

Use `skip` and `limit` for pagination:

```bash
# Get records 20-40
GET /candidates?skip=20&limit=20

# Get records 40-60
GET /candidates?skip=40&limit=20
```

## CORS

API accepts requests from localhost by default. Update in `src/api/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Last Updated:** July 8, 2026
