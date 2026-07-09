# Recruitment Specialist Agent Suite - Python Edition

Automated multi-agent candidate evaluation system with 6 specialized agents for comprehensive hiring assessment.

## 🏗️ Architecture

```
recruitment-suite/
├── src/
│   ├── agents/              # 6 evaluation agents
│   │   ├── agent_01_profile.py           # Profile & Background
│   │   ├── agent_02_technical.py         # Technical Skills
│   │   ├── agent_03_culture.py           # Culture Fit
│   │   ├── agent_04_references.py        # References & Track Record
│   │   ├── agent_05_recommendation.py    # Final Recommendation
│   │   ├── agent_06_people_analytics.py  # People Analytics (optional)
│   │   └── orchestrator.py               # Coordinates all agents
│   │
│   ├── models/              # Pydantic data models
│   │   ├── candidate.py     # Candidate profiles
│   │   ├── job.py           # Job descriptions
│   │   ├── evaluation.py    # Scoring & evaluation
│   │   └── recommendation.py # Final recommendations
│   │
│   ├── generators/          # Report generation
│   │   ├── html_generator.py  # HTML reports (Jinja2)
│   │   └── pdf_generator.py   # PDF export (WeasyPrint)
│   │
│   ├── integrations/        # External APIs
│   │   ├── linkedin.py      # LinkedIn integration
│   │   └── database.py      # Candidate database
│   │
│   └── cli.py               # Command-line interface (Click)
│
├── templates/
│   └── report.html.jinja    # HTML report template
│
├── examples/                # Sample candidate & job files
│   ├── candidate-natalia.json
│   └── job-people-analytics.json
│
└── main.py                  # Entry point
```

## 🚀 Installation

```bash
# 1. Clone repo
git clone https://github.com/juliopessan/recruitment-suite.git
cd recruitment-suite

# 2. Install dependencies
pip install -r requirements.txt

# 3. Make CLI executable
chmod +x main.py
```

## 📋 Usage

### Single Candidate Evaluation

```bash
python main.py evaluate \
  --candidate-file examples/candidate-natalia.json \
  --job-file examples/job-people-analytics.json \
  --output-dir reports \
  --format html \
  --people-analytics
```

### Batch Evaluation

```bash
python main.py batch \
  --candidates-file candidates.csv \
  --job-file job-description.json \
  --output-dir reports \
  --format all
```

### Available Options

```bash
python main.py evaluate --help

Options:
  --candidate-file TEXT          JSON candidate profile [required]
  --job-file TEXT                JSON job description [required]
  --output-dir TEXT              Reports output directory (default: reports)
  --format [html|pdf|json|all]   Output format (default: html)
  --people-analytics             Enable Agent 06 (People Analytics)
  --playbook [quick-screen|full-evaluation|full-people-analytics]
```

## 📊 Scoring System

### Dimensions (Weighted)

| Dimension | Weight | Agent | Score |
|-----------|--------|-------|-------|
| Profile & Background | 20% | Agent 01 | 0-100 |
| Technical Skills | 35% | Agent 02 | 0-100 |
| Culture Fit | 25% | Agent 03 | 0-100 |
| References | 15% | Agent 04 | 0-100 |
| Strategic Bonus | 5% | Orchestrator | 0-5 |
| **Final Score** | **100%** | — | **0-100** |

### Decision Thresholds

- **75+:** 🟢 **GO** — Extend offer
- **60–74:** 🟡 **HOLD** — Manager discussion or additional data
- **30–59:** 🟡 **HOLD** — Significant gaps, only with mitigation
- **<30:** ❌ **NO-GO** — Pass, archive

## 🧠 The 6 Agents

### Agent 01: Profile Evaluator
**Evaluates:** Experience, education, career progression, domain expertise
- Years of experience match
- Relevant education/degrees
- Career trajectory alignment
- Geographic/mobility fit

### Agent 02: Technical Skills Evaluator
**Evaluates:** Technical depth, frameworks, certifications, hands-on capability
- Required skills coverage
- Depth of expertise
- Certifications/credentials
- Framework & tool proficiency

### Agent 03: Culture Fit Analyzer
**Evaluates:** Soft skills, collaboration, mentoring, team dynamics
- Communication & clarity
- Collaboration & teamwork
- Growth mindset & learning agility
- Company values alignment

### Agent 04: Reference Validator
**Evaluates:** Track record, reference quality, achievement credibility
- CV claim verification
- Reference quality & diversity
- Achievement credibility
- Timeline integrity

### Agent 05: Recommendation Engine
**Synthesizes:** All evaluations into final hiring decision
- Weighted score calculation
- Conflict detection
- Trade-off analysis
- Clear Go/No-Go/Hold recommendation

### Agent 06: People Analytics Specialist (Optional)
**Evaluates:** Viva Glint expertise, statistics, organizational psychology
- Viva Glint platform knowledge
- Statistical rigor
- People science foundations
- Executive storytelling

## 📄 Input Formats

### Candidate Profile (JSON)

```json
{
  "id": "cand_001",
  "profile": {
    "name": "Candidate Name",
    "email": "candidate@example.com",
    "location": "City, Country",
    "total_years_experience": 12,
    "languages": ["English", "Portuguese"],
    "education": ["Degree 1", "Degree 2"],
    "certifications": ["Cert 1", "Cert 2"]
  }
}
```

### Job Description (JSON)

```json
{
  "id": "job_001",
  "title": "Position Title",
  "company": "Company Name",
  "years_experience_required": 10,
  "required_skills": ["Skill 1", "Skill 2"],
  "nice_to_have_skills": ["Bonus Skill"],
  "required_languages": ["English"]
}
```

## 📊 Output Formats

### HTML Report
Professional report with Avanade branding
- Hero section with final score
- Score breakdown tables
- Evaluation dimensions
- Recommendation box
- Print-friendly (PDF-ready)

### PDF Report
Exportable PDF via WeasyPrint
```bash
--format pdf
```

### JSON Report
Structured data for integrations
```bash
--format json
```

## 🔧 Configuration

Create `.env` file for settings:

```bash
# Database
DATABASE_URL=sqlite:///candidates.db

# LinkedIn (optional)
LINKEDIN_API_KEY=your_api_key

# Report templates
TEMPLATE_DIR=templates
OUTPUT_DIR=reports

# Scoring weights (can be customized per org)
PROFILE_WEIGHT=0.20
TECHNICAL_WEIGHT=0.35
CULTURE_WEIGHT=0.25
REFERENCE_WEIGHT=0.15
STRATEGIC_WEIGHT=0.05
```

## 📈 Playbooks

### Quick Screen (5-10 min)
Agents: 01, 02, 05
**Use for:** High-volume screening, fast pass/fail

```bash
python main.py evaluate \
  --candidate-file candidate.json \
  --job-file job.json \
  --playbook quick-screen
```

### Full Evaluation (30-45 min)
Agents: 01, 02, 03, 04, 05
**Use for:** Serious candidates with reference validation ready

```bash
python main.py evaluate \
  --candidate-file candidate.json \
  --job-file job.json \
  --playbook full-evaluation
```

### Full + People Analytics (40-50 min)
Agents: 01, 02, 03, 04, 06, 05
**Use for:** HR/People roles requiring Viva Glint, org psychology expertise

```bash
python main.py evaluate \
  --candidate-file candidate.json \
  --job-file job.json \
  --playbook full-people-analytics
```

## 🔄 Typical Workflow

```
1. Prepare candidate profile (JSON)
   ↓
2. Prepare job description (JSON)
   ↓
3. Run evaluation: python main.py evaluate ...
   ↓
4. Review HTML/PDF report
   ↓
5. Schedule reference calls (if score >= 75)
   ↓
6. Extend offer (if manager approves)
   ↓
7. Onboarding plan
```

## 💾 Database Integration (Future)

Planned features:
- [ ] Candidate database (SQLite/PostgreSQL)
- [ ] Evaluation history & trends
- [ ] API REST for integrations
- [ ] Web dashboard
- [ ] LinkedIn/GitHub API integrations

## 🧪 Testing

```bash
python -m pytest tests/
```

## 📝 Example Commands

```bash
# Evaluate Natália for People Analytics role
python main.py evaluate \
  --candidate-file examples/candidate-natalia.json \
  --job-file examples/job-people-analytics.json \
  --output-dir reports \
  --format all \
  --people-analytics

# Batch evaluate 100 candidates
python main.py batch \
  --candidates-file candidates.csv \
  --job-file job.json \
  --output-dir reports \
  --format html

# Just HTML (faster)
python main.py evaluate \
  --candidate-file candidate.json \
  --job-file job.json \
  --format html \
  --output-dir reports
```

## 📊 Report Breakdown

Each report includes:

- **Executive Summary:** Final score, recommendation, confidence
- **Score Breakdown:** All 5 dimensions with contributions
- **Evaluation Dimensions:** Deep-dive into each agent's assessment
- **Key Strengths:** Top 3-5 candidate strengths
- **Addressable Gaps:** Gaps that can be mitigated
- **Critical Flags:** Blockers that need escalation
- **Recommendation:** Clear Go/No-Go/Hold with rationale
- **Next Steps:** Actions based on recommendation
- **Onboarding Plan:** If hired, suggested ramp-up timeline

## 🚀 Next Features

- [ ] Web UI (FastAPI + React)
- [ ] API REST endpoints
- [ ] Database persistence
- [ ] LinkedIn/GitHub scrapers
- [ ] Custom scoring per organization
- [ ] Bias detection alerts
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Slack integrations
- [ ] ATS integrations (Lever, Greenhouse)

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Submit pull request
4. Follow Python style guide (Black, flake8)

## 📞 Support

For issues, feature requests, or questions:
- Create GitHub issue
- Contact: recruitment-suite@avanade.com

---

**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Last Updated:** July 8, 2026
