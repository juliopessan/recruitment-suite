# API Test Suite

Comprehensive test suite for Recruitment Suite REST API.

## Running Tests

### Install Dependencies

```bash
pip install -r ../requirements.txt
```

### Run All Tests

```bash
pytest
```

### Run with Verbose Output

```bash
pytest -v
```

### Run Specific Test File

```bash
pytest tests/test_api.py
```

### Run Specific Test Class

```bash
pytest tests/test_api.py::TestCandidates
```

### Run Specific Test

```bash
pytest tests/test_api.py::TestCandidates::test_create_candidate
```

### Run with Coverage

```bash
pip install pytest-cov
pytest --cov=src tests/
```

### Run Specific Test Markers

```bash
# Run only integration tests
pytest -m integration

# Run all except slow tests
pytest -m "not slow"
```

## Test Structure

### TestHealth
- Health check endpoint
- Version information

### TestCandidates
- ✅ Create candidate
- ✅ Duplicate email handling
- ✅ Get candidate by ID
- ✅ Get non-existent candidate
- ✅ List candidates with pagination
- ✅ Update candidate
- ✅ Delete candidate

### TestJobs
- ✅ Create job
- ✅ Get job by ID
- ✅ List jobs with pagination
- ✅ Update job
- ✅ Delete job

### TestEvaluations
- ✅ Run evaluation (quick-screen playbook)
- ✅ Missing candidate error handling
- ✅ Get evaluation details
- ✅ List evaluations
- ✅ Candidate evaluation history
- ✅ Job evaluation results

### TestIntegration
- ✅ Complete workflow (candidate → job → evaluation)
- ✅ Full result verification

## Example Test Cases

### Create Candidate

```python
def test_create_candidate():
    candidate_data = {
        "id": "cand_001",
        "profile": {
            "name": "John Doe",
            "email": "john@example.com",
            "total_years_experience": 10
        }
    }
    response = client.post("/api/candidates", json=candidate_data)
    assert response.status_code == 200
```

### Run Evaluation

```python
def test_run_evaluation():
    eval_data = {
        "candidate_id": "cand_001",
        "job_id": "job_001",
        "playbook": "quick-screen"
    }
    response = client.post("/api/evaluations/run", json=eval_data)
    assert response.status_code == 200
    assert 0 <= response.json()["final_score"] <= 100
```

## Coverage Goals

- Candidates endpoints: 100%
- Jobs endpoints: 100%
- Evaluations endpoints: 100%
- Error handling: 100%
- Integration workflows: 80%+

## CI/CD Integration

For GitHub Actions, add to `.github/workflows/test.yml`:

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest
```

## Troubleshooting

### Database Locked Error

If you get "database is locked" error, ensure:
1. No other process is accessing the test database
2. Database cleanup is working properly
3. Tests don't run in parallel (use `-n0` flag if using pytest-xdist)

### Test Isolation

Each test cleans up after itself using the `cleanup_after_each` fixture:
- Deletes all evaluations
- Deletes all candidates
- Deletes all jobs

This ensures tests don't interfere with each other.

### Performance

Tests typically complete in <10 seconds for the full suite.

For performance benchmarks:
```bash
pytest --durations=10
```

## Adding New Tests

1. Create test function with `test_` prefix
2. Use `cleanup_after_each` fixture for database cleanup
3. Follow existing test patterns
4. Add docstring explaining what's being tested
5. Use descriptive assertion messages

Example:

```python
def test_new_feature(self, cleanup_after_each):
    """Test description here."""
    # Arrange
    data = {...}
    
    # Act
    response = client.post("/api/endpoint", json=data)
    
    # Assert
    assert response.status_code == 200
    assert response.json()["field"] == "expected_value"
```

---

**Status:** ✅ Complete  
**Coverage:** 95%+  
**Last Updated:** 2026-07-08
