# Recruitment Specialist Agent Suite

> Multi-agent suite for hiring sênior tech talent at Avanade. Evaluates candidates across 6 dimensions: Profile, Technical Skills, Culture Fit, References, People Analytics (optional), and synthesizes a final hiring recommendation.

**Brand:** Orange DNA | Recruiting Excellence  
**Stack:** 100% Microsoft (GitHub Copilot agents, future Dataverse integration)  
**Agents:** 7 (1 orchestrator + 6 specialists)

---

## Quick Start

### 1. Choose Your Playbook

| Playbook | Agents | Time | Use When |
|----------|--------|------|----------|
| **Quick Screen** | 01 → 02 → 05 | 5–10 min | High volume, need fast pass/fail |
| **Full Evaluation** | 01 → 02 → 03 → 04 → 05 | 30–45 min | Serious candidates, reference validation ready |
| **Full + People Analytics** | 01 → 02 → 03 → 04 → 06 → 05 | 40–50 min | HR/People roles requiring Viva Glint, org psychology expertise |
| **Final Decision** | Orchestrator (01–06) | 10 min | Manager needs to break tie between conflicting scores |

### 2. Prepare Input

Gather:
- **Job Description** (title, key requirements, level, team context)
- **Candidate Profile** (CV, background, or structured profile)
- **References** (contact info, if ready for reference check)

### 3. Invoke Agents

**Quick Screen:**
```
👉 Agent 01: "Evaluate candidate profile: [CV], JD: [Job Description]"
👉 Agent 02: "Assess technical skills: [CV], JD required stack: [Tech Stack]"
👉 Agent 05: "Synthesize scores and recommend: [Scores from 01 & 02]"
```

**Full Evaluation:**
```
👉 Agent 01: Profile evaluation
👉 Agent 02: Technical skills evaluation
👉 Agent 03: Culture fit analysis
👉 Agent 04: Reference validation
👉 Agent 05: Final hiring recommendation
```

### 4. Decision

- **🟢 Go:** Move to offer
- **🟡 Hold:** Need more data or manager discussion
- **🔴 No-Go:** Pass, archive

---

## Agent Roles

| Agent | Focus | Input | Output |
|-------|-------|-------|--------|
| **00-Orchestrator** | Coordinate evaluation pipeline, route candidates, synthesize final recommendation | JD + candidate + context | Executive summary + recommendation (Go/No-Go/Hold) |
| **01-Profile Evaluator** | CV analysis, background fit, years of experience, domain expertise, career trajectory | CV + JD | Profile Fit Score (0–100) + experience gaps + strengths |
| **02-Tech Skills Evaluator** | Technical depth, frameworks, languages, certifications, hands-on capability | CV + JD tech stack | Tech Score (0–100) + skill gaps + interview focus areas |
| **03-Culture Fit Analyzer** | Soft skills, collaboration, mentoring, Avanade values alignment, team dynamics | CV + team context | Culture Fit Score (0–100) + risk flags + team fit assessment |
| **04-Reference Validator** | Track record verification, reference quality, achievement credibility, timeline integrity | CV + references list | Reference Confidence Score (0–100) + verification status |
| **05-Recommendation Engine** | Synthesize all scores, detect conflicts, emit final decision | All agent scores + context | **Final Score (0–100)** + **Recommendation (Go/No-Go/Hold)** + rationale |
| **06-People Analytics Specialist** | **(NEW)** Viva Glint expertise, people science knowledge, org psychology, transformation capability | CV + HR/People-focused JD | People Analytics Score (0–100) + domain-specific gaps + readiness assessment |

---

## Scoring Scale (Authoritative)

| Range | Interpretation | Recommendation |
|-------|-----------------|-----------------|
| **75–100** | Excellent fit, exceeds requirements | ✅ **Go** — Move to offer |
| **60–74** | Good fit, minor gaps addressable | 🟡 **Hold** — Manager discussion + data |
| **30–59** | Partial fit, significant gaps | 🟡 **Hold** — Only Go if compelling mitigation |
| **0–29** | Critical gaps, not qualified | ❌ **No-Go** — Pass, archive |

**Final Score (Weighted by Orchestrator):**

For **default tech roles:**
```
Final = Profile 20% + Tech 35% + Culture 25% + References 15% + Strategic 5%
```

For **People Analytics/HR specialist roles:**
```
Final = Profile 15% + People Analytics 35% + Culture 25% + References 15% + Tech 5% + Strategic 5%
```

---

## 📝 Job Description Templates

Pre-built, reusable templates for recurring AI & Data roles. All templates follow Avanade standard format with benefits, responsibilities, and qualifications.

**Available Templates:** [`.github/templates/`](.github/templates/)

| # | Title | Stack | Seniority |
|---|-------|-------|-----------|
| 01 | Senior Platform Engineer | Azure / Kubernetes | Sênior (8–12y) |
| 02 | Engenheiro(a) de Dados Sênior | GCP / BigQuery | Sênior (5–7y) |
| 03 | Data Architect Sênior | Microsoft Fabric / Databricks | Sênior (8+y) |
| 04 | Cientista de Dados Sênior | Azure Databricks / MLOps | Sênior (6+y) |
| 05 | Consultor(a) de Transformação Digital | Microsoft Ecosystem | Sênior (7+y) |
| 06 | Lead Engenheiro(a) de Dados | Azure / Data Mesh | Lead (7+y) |
| 07 | Solution Architect | Azure Data Platform | Sênior (8+y) |
| 08 | Analista de Visualização de Dados Sênior | Power BI / Azure | Sênior (5+y) |
| 09 | GenAI Engineer | Azure OpenAI / Semantic Kernel | Sênior (6+y) |

**How to Use:**
1. Browse [`.github/templates/README.md`](.github/templates/README.md) for index
2. Copy relevant template into evaluation markdown
3. Customize title/location as needed
4. Reference for traceability

---

## 🎯 Complete Evaluation Workflow

End-to-end candidate evaluation workflow: **Markdown input → Agent analysis → HTML report output**

**Documentation:** [`.examples/`](.examples/)

| Guide | Purpose | Start Here |
|-------|---------|------------|
| [README.md](.examples/README.md) | Main entry point | ⭐ Começar aqui |
| [WORKFLOW.md](.examples/WORKFLOW.md) | Complete step-by-step process | Complete process |
| [EVALUATION_TEMPLATE.md](.examples/EVALUATION_TEMPLATE.md) | Copy for new candidates | New evaluation |
| [CANDIDATES_ROADMAP.md](.examples/CANDIDATES_ROADMAP.md) | Tracking + archive | View history |
| [WORKFLOW_STATUS.md](.examples/WORKFLOW_STATUS.md) | Verification & status | Implementation details |

**Quick Start:** 
1. Read [`.examples/README.md`](.examples/README.md)
2. Copy [`.examples/EVALUATION_TEMPLATE.md`](.examples/EVALUATION_TEMPLATE.md)
3. Run playbook (Quick Screen / Full / Full+Analytics)
4. Generate HTML report
5. Update [`.examples/CANDIDATES_ROADMAP.md`](.examples/CANDIDATES_ROADMAP.md)

**Examples:**
- [sample-evaluation.md](.examples/sample-evaluation.md) — Full Evaluation example
- [sample-evaluation.html](.examples/sample-evaluation.html) — Rendered HTML
- [`candidates/`](.examples/candidates/) — Archive folder for all new evaluations

---

✅ **Do:**
- Use **scoring matrices** (tables first, then narrative)
- Flag **gaps clearly** (vs. strengths for balance)
- **Escalate conflicts** (ex: Tech=90 but Culture=55) for manager discussion
- **Justify recommendations** in 1–2 sentences
- **Respect LGPD** — no PII retention beyond session

❌ **Don't:**
- Generate code, scripts, or deployment templates
- Use non-Microsoft stack (AWS, GCP, Workable API, etc.)
- Exceed 8 000 characters per agent response
- Make subjective decisions without objective criteria
- Stereotype by background, gender, age, etc.

---

## Example: Senior DevOps Engineer Evaluation

### Input
**Job:** Sr. DevOps Engineer at Avanade  
**Candidate:** Alex Chen, 10 years DevOps (5y AWS, 3y Azure, recent Kubernetes focus)

### Playbook: Full Evaluation

**Agent 01 (Profile):**
> "Alex has 10y in DevOps, 5y AWS hyperscaler, 3y Azure at consulting firm. Clear progression IC → Tech Lead. Fit: 78. Gap: Limited M365 governance, but core DevOps strong."

**Agent 02 (Tech):**
> "Strong in Kubernetes (4y hands-on), Terraform (3y), Python (5y). Missing: Bicep (Azure IaC preferred), less hands-on in CI/CD architecture. Tech Score: 82. Interview: Bicep depth, CI/CD design."

**Agent 03 (Culture):**
> "Strong collaboration signals (led 3 teams, mentoring history). Growth mindset evident (AWS→Azure transition). Culture: 85. Risk: All background at hyperscaler/startup; gauge consulting-culture fit."

**Agent 04 (References):**
> "Former manager available, references strong on delivery. CV claims verified. Confidence: 90."

**Agent 05 (Orchestrator):**
> **Final Score: 84** 
> **Recommendation: 🟢 Go**
> 
> Rationale: Excellent technical fit (82), strong culture signal (85), clean references (90). Minor gap in Bicep addressable via onboarding. Profile slightly below bar (78) due to consulting experience, but technical + culture strength outweigh.
>
> **Next Steps:**
> 1. Schedule technical interview (focus: Bicep, CI/CD design)
> 2. Manager round (culture fit discussion)
> 3. Extend offer pending reference verification

---

## Example: People Science Consultant — Full + People Analytics Evaluation

### Input
**Job:** People Science Consultant | Employee Experience (Viva Glint focus)  
**Candidate:** Maria Souza, 12y People Analytics (MA Org Psychology, 3y Viva Glint certified)

### Playbook: Full + People Analytics (40–50 min)

**Agent 01 (Profile):** 85/100  
> 12y progression IC → Senior Analyst; MA Org Psychology; Viva certification 3y. Clear domain depth. Gap: No C-suite exposure yet.

**Agent 02 (Tech):** 80/100  
> Viva Glint certified, strong SQL + Power BI, light on Python/R. Analytics capability strong but quantitative chops could deepen.

**Agent 03 (Culture):** 84/100  
> Mentored 2 junior analysts, collaborative leadership style. Startup → Consulting transition signals adaptability and growth mindset.

**Agent 04 (References):** 90/100  
> All CV claims verified by CHRO reference. Testimonials emphasize data storytelling and org-wide influence.

**Agent 06 (People Analytics Specialist - NEW):** 82/100  
> Org Psychology MA exceptional (20/20), Viva Glint depth solid (24/25), stats rigor good (18/20), storytelling strong (19/20), transformation leadership emerging (15/15). Ready for scaling people initiatives.

**Agent 05 (Recommendation Engine):** **82/100 Final**  
> **🟢 Go — Extend Offer with Mentor Support**
> 
> Maria is an **excellent fit** for this People Science role. Viva Glint expertise + org psychology education + track record of influence make her ideal. Minor stat-rigor gap addressable via onboarding.
>
> **Confidence:** 92%  
> **Next Steps:**
> 1. Extend offer with 3-month mentoring plan (C-suite storytelling ramp-up)
> 2. Onboarding focus: Advanced analytics (Python/R optional, not mandatory)
> 3. Assign internal mentor (CHRO or VP People)

---



- **[.github/instructions/recruitment-suite.instructions.md](.github/instructions/recruitment-suite.instructions.md)** — Hard constraints, conventions, rules
- **[.github/memory/recruitment-memory.md](.github/memory/recruitment-memory.md)** — Living state, agent inventory, playbooks
- **[.examples/sample-evaluation.md](.examples/sample-evaluation.md)** — Full playbook example
- **[.examples/maria-souza-people-science-evaluation.html](.examples/maria-souza-people-science-evaluation.html)** — Full + People Analytics example (82/100, Avanade brand)
- **[package.json](package.json)** — Metadata

---

## Roadmap (v2+)

- [ ] Candidate database integration (Microsoft Dataverse)
- [ ] LGPD retention & archival policy
- [ ] Salary benchmarking agent
- [ ] Entra ID background check integration
- [ ] Metrics dashboard (hiring cycle, quality of hire, diversity)
- [ ] Feedback loop: track hired candidates → performance → agent tuning

---

## Support

For questions, issues, or to suggest improvements:
- 📧 Contact: [Talent Team]
- 🐛 Report bugs or request features via GitHub Issues
- 📚 See [.github/instructions/recruitment-suite.instructions.md](.github/instructions/recruitment-suite.instructions.md) for authoring guidelines

---

**Version:** 1.0  
**Last Updated:** 2026-07-08  
**Status:** Production Ready ✅
