# Recruitment Suite — Memory (Living State)

> Living memory for the Recruitment Specialist Agent Suite. Update whenever agent inventory, playbooks, or conventions evolve. **Mirror of `/memories/repo/recruitment-memory.md` (Copilot memory).**

## 1. Mission

Multi-agent suite (GitHub Copilot agents) that evaluates candidate profiles for sênior tech hiring roles at Avanade. Analyzes CV, technical depth, cultural fit, references, and synthesizes final hiring recommendation.

**Brand:** Orange DNA | Avanade Global Talent

## 2. Hard Constraints

- **Stack: 100% Microsoft.** Allowed: GitHub Copilot agents, Dataverse (future), Azure DevOps (future).
- **Forbidden:** AWS, GCP, Workable API, Lever, Greenhouse (use manual input).
- **Output limit:** 8 000 characters per agent.
- **Languages:** EN-US (client-facing); PT-BR for [Internal].
- **Tone:** Avanade consulting — direct, structured, no filler.
- **No code generation** — scoring matrices, recommendations only.

## 3. Repository Layout

```
recruitment-suite/
├── .github/
│   ├── agents/
│   │   ├── 00-recruitment-orchestrator.agent.md
│   │   ├── 01-candidate-profile-evaluator.agent.md
│   │   ├── 02-technical-skills-evaluator.agent.md
│   │   ├── 03-culture-fit-analyzer.agent.md
│   │   ├── 04-reference-validator.agent.md
│   │   ├── 05-hiring-recommendation-engine.agent.md
│   │   └── 06-people-analytics-specialist.agent.md (NEW)
│   ├── instructions/
│   │   └── recruitment-suite.instructions.md
│   └── memory/
│       └── recruitment-memory.md (this file)
├── .examples/
│   └── sample-evaluation.md
├── README.md
└── package.json
```

## 4. Agent Inventory (6 agents)

| # | Agent | Role | Key Responsibility |
|---|-------|------|-------------------|
| 00 | Orchestrator | Router + synthesizer | Coordinate evaluation pipeline, emit final recommendation |
| 01 | Profile Evaluator | Background analysis | Years of experience, domain expertise, career trajectory |
| 02 | Tech Skills Evaluator | Technical assessment | Framework depth, certifications, hands-on capability |
| 03 | Culture Fit Analyzer | Soft skills | Collaboration, mentoring, Avanade values alignment |
| 04 | Reference Validator | Track record check | Verify CV claims, phone-vet references, credibility |
| 05 | Recommendation Engine | Final decision | Synthesize scores → Go/No-Go/Hold + rationale |
| 06 | People Analytics Specialist | **Domain-specific assessment** | **(NEW)** Viva Glint depth, people science, org psychology, transformation |

## 5. Recommended Playbooks

| Playbook | Agents | Time | When |
|----------|--------|------|------|
| **Quick Screen** | 01 → 02 → 05 | 5–10 min | High volume, fast pass/fail |
| **Full Evaluation** | 01 → 02 → 03 → 04 → 05 | 30–45 min | Serious candidates, sênior hires |
| **Full + People Analytics** | 01 → 02 → 03 → 04 → 06 → 05 | 40–50 min | HR/People roles (Viva Glint expertise) |
| **Final Decision Support** | Orchestrator (01–06) → synthesis | 10 min | Arbitrate conflicting opinions |

## 6. Agent Authoring Conventions

1. **Frontmatter:** `name`, `user-invocable: true`, `description`, `tools`, `argument-hint`
2. **Sections:** Persona (👔) → Input (📥) → Analysis (🔍) → Output (📋) → Constraints (🔵)
3. **Output:** **Tables first** → then narrative (gaps, strengths) → then recommendation
4. **Scoring:** 0–100 scale; 75+ = Go, 60–74 = Hold, <60 = No-Go
5. **No code generation** — planning, matrices, recommendations only

## 7. Scoring Methodology

**Orchestrator Final Score:**
```
Final Score = (Profile 20% + Tech 35% + Culture 25% + References 15% + Strategic 5%)
```

**Decision Logic:**
- ≥75: Go
- 60–74: Hold
- <60: No-Go

**Red Flag Escalation:** If any score <50 or culture-tech gap >30 pts, escalate to manager.

## 8. Smart-Routing Rules

- Final Score <50 → recommend No-Go
- Culture-Tech gap >30 → flag for behavioral interview
- Reference pending → conditional Go only
- Multiple gaps (Profile + Tech <60) → No-Go unless strategic exception

## 9. Active Reference Documents

- (Coming) `attached/sample-job-description.md` — Sr. DevOps Engineer example
- (Coming) `attached/sample-evaluation.md` — Full playbook run
- (Coming) `attached/playbook-runs/` — Historical executions

## 10. Open Backlog

- [ ] Candidate database (Dataverse) integration
- [ ] LGPD retention & archival policy
- [ ] Salary benchmarking agent (v2)
- [ ] Entra ID background check integration
- [ ] Metrics dashboard (cycle time, quality, diversity)
- [ ] Feedback loop for continuous agent tuning

## 11. How to Update This File

1. When adding/removing agent → update section 4 (Agent Inventory)
2. When changing playbooks → update section 5
3. When changing scoring → update section 7
4. When discovering lessons → add to `recruitment-lessons-learned.md`
5. **Keep it brief** — this is a quick reference, not detailed docs
