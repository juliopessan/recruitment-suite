# Evaluation Workflow — Recruitment Suite

> **Complete workflow for candidate evaluation: Markdown input → Agent analysis → HTML output**

---

## 📋 Workflow Overview

```
1. INTAKE
   └─ Job Description + Candidate Profile

2. ANALYSIS (Playbook Selection)
   ├─ Quick Screen (Agents 01 → 02 → 05) [5–10 min]
   ├─ Full Evaluation (Agents 01 → 02 → 03 → 04 → 05) [30–45 min]
   ├─ Full + People Analytics (Agents 01 → 02 → 03 → 04 → 06 → 05) [40–50 min]
   └─ [Input candidate data in EVALUATION_TEMPLATE.md]

3. AGENT PIPELINE
   └─ Each agent scores candidate on their dimension

4. SYNTHESIS
   └─ Agent 05 (Orchestrator) synthesizes all scores → Final Recommendation

5. OUTPUT
   ├─ Markdown: `.examples/candidates/{candidate-name}-evaluation.md`
   └─ HTML: `.examples/candidates/{candidate-name}-evaluation.html`

6. ARCHIVE
   └─ Save both .md and .html in candidates/ folder for team reference
```

---

## 🎯 Quick Start: New Candidate Evaluation

### Step 1: Prepare Input Data

Gather:
- **Job Description** (use templates from `.github/templates/`)
- **Candidate Profile** (CV, LinkedIn, background)
- **Team/Manager Context** (team size, seniority mix, immediate needs)

### Step 2: Copy Template

```bash
cp .examples/EVALUATION_TEMPLATE.md ".examples/candidates/{FIRST-NAME}-{LAST-NAME}-evaluation.md"
```

Replace placeholders:
- `{CANDIDATE_NAME}` → Full name
- `{JOB_TITLE}` → Role from `.github/templates/`
- `{PLAYBOOK}` → Quick Screen | Full Evaluation | Full + People Analytics

### Step 3: Select Playbook & Invoke Agents

#### **Quick Screen (5–10 min)**
Use for high-volume, fast pass/fail:

```
Agent 01 (Profile Evaluator):
  Input: CV + Job Description
  Output: Profile Fit Score

Agent 02 (Tech Skills Evaluator):
  Input: CV + Required Stack
  Output: Tech Score

Agent 05 (Recommendation Engine):
  Input: Profile Score + Tech Score
  Output: QUICK RECOMMENDATION (Go/No-Go/Hold)
```

#### **Full Evaluation (30–45 min)**
Use for serious candidates, reference validation ready:

```
Agent 01 → Profile Fit Score
Agent 02 → Tech Skills Score
Agent 03 → Culture Fit Score
Agent 04 → Reference Validation Score
Agent 05 → FINAL RECOMMENDATION (Go/No-Go/Hold)
```

#### **Full + People Analytics (40–50 min)**
Use for HR/People roles:

```
Agent 01 → Profile Fit Score
Agent 02 → Tech Skills Score
Agent 03 → Culture Fit Score
Agent 04 → Reference Validation Score
Agent 06 → People Analytics Score (NEW)
Agent 05 → FINAL RECOMMENDATION (weighted)
```

### Step 4: Document Agent Outputs

Copy each agent's output into the corresponding section of your evaluation markdown file (see EVALUATION_TEMPLATE.md):

- **Agent 01 Output** → `## 1. Profile Evaluation`
- **Agent 02 Output** → `## 2. Technical Skills Evaluation`
- **Agent 03 Output** → `## 3. Culture Fit Analysis`
- **Agent 04 Output** → `## 4. Reference Validation`
- **Agent 06 Output** → `## 5. People Analytics (Optional)`
- **Agent 05 Output** → `## FINAL RECOMMENDATION`

### Step 5: Generate HTML Report

Use any Markdown → HTML tool:

**Option A: Online Tool (1 click)**
- Copy your `.md` into https://markdowntohtmlconverter.com
- Paste HTML template (see below) with Avanade Orange DNA styling
- Save as `.html`

**Option B: Command Line (Node.js)**
```bash
npm install -g markdown-to-html
markdown-to-html \
  --input ".examples/candidates/{name}-evaluation.md" \
  --output ".examples/candidates/{name}-evaluation.html" \
  --template ".examples/html-template.html"
```

**Option C: Pandoc**
```bash
pandoc \
  --from markdown \
  --to html \
  --output ".examples/candidates/{name}-evaluation.html" \
  ".examples/candidates/{name}-evaluation.md" \
  --css=".examples/styles.css"
```

### Step 6: Archive & Share

```
.examples/candidates/
├── {name}-evaluation.md       [Source: Markdown with agent outputs]
├── {name}-evaluation.html     [Rendered: Styled report for stakeholders]
└── README.md                  [Index of all candidate evaluations]
```

Share `.html` with hiring manager/team for decision review.

---

## 📊 Scoring Scale & Decision Matrix

| Score | Interpretation | Recommendation | Next Step |
|-------|-----------------|-----------------|-----------|
| **75–100** | Excellent fit, exceeds requirements | ✅ **Go** | Move to offer |
| **60–74** | Good fit, minor gaps, addressable | 🟡 **Hold** | Manager discussion or get more data |
| **30–59** | Partial fit, significant gaps | 🔴 Consider **No-Go** | Schedule follow-up interview or pass |
| **0–29** | Not qualified, critical gaps | ❌ **No-Go** | Archive |

**Final Score Weights (Agent 05 Synthesis):**
- Profile Fit: **20%**
- Technical Skills: **35%**
- Culture Fit: **25%**
- Reference Validation: **15%**
- People Analytics / Strategic: **5%**

---

## 📁 File Structure

```
.examples/
├── README.md                              [This file: Workflow overview]
├── EVALUATION_TEMPLATE.md                 [Copy this for new candidates]
├── CANDIDATES_ROADMAP.md                  [Tracking sheet: all candidates + status]
├── html-template.html                     [Avanade Orange DNA HTML template]
├── styles.css                             [Shared CSS for HTML reports]
├── candidates/
│   ├── sample-evaluation.md               [Sample: Full Screen example]
│   ├── sample-evaluation.html             [Rendered HTML with styling]
│   ├── maria-souza-evaluation.md          [Archive: People Analytics expert]
│   ├── maria-souza-evaluation.html
│   ├── natalia-karam-evaluation.md        [Archive: Platform Engineer]
│   ├── natalia-karam-evaluation.html
│   └── {new-candidates}/                  [Add all new evaluations here]
└── agents-reference/                      [Optional: Copy of agent prompts for context]
    ├── 01-profile-evaluator.md
    ├── 02-tech-skills-evaluator.md
    ├── ...
    └── 05-recommendation-engine.md
```

---

## ✅ Checklist: New Candidate Evaluation

- [ ] Gather Job Description (from `.github/templates/`)
- [ ] Gather Candidate Profile (CV / LinkedIn / background)
- [ ] Choose Playbook (Quick Screen / Full / Full+Analytics)
- [ ] Copy `EVALUATION_TEMPLATE.md` → `candidates/{name}-evaluation.md`
- [ ] Invoke Agent 01 (Profile) — paste output
- [ ] Invoke Agent 02 (Technical) — paste output
- [ ] Invoke Agent 03 (Culture) — paste output [if Full or Full+Analytics]
- [ ] Invoke Agent 04 (References) — paste output [if Full or Full+Analytics]
- [ ] Invoke Agent 06 (People Analytics) — paste output [if Full+Analytics only]
- [ ] Invoke Agent 05 (Recommendation) — paste final output
- [ ] Convert Markdown → HTML using one of the tools above
- [ ] Save both `.md` and `.html` in `candidates/` folder
- [ ] Update `CANDIDATES_ROADMAP.md` with new candidate + status
- [ ] Share `.html` with hiring manager/stakeholders

---

## 🔄 Decision Logic

**After Final Score is Calculated:**

| Final Score | Decision | Action |
|------------|----------|--------|
| ≥ 75 | ✅ **Go** | Extend offer OR proceed to offer stage |
| 60–74 | 🟡 **Hold** | Schedule manager discussion OR request additional references |
| 30–59 | 🔴 **Consider No-Go** | 2nd opinion from hiring manager before final pass |
| < 30 | ❌ **No-Go** | Thank you email, archive evaluation |

**Escalation Flags:**
- High conflict (ex: Tech=90 but Culture=35) → Manager discussion required
- Missing references → Request and re-score
- Reference validation delayed → Hold pending validation

---

## 📞 Support & Questions

- **Agent Output Too Long?** → Summarize, use bullet points, trim examples
- **Candidate Missing Data?** → Mark as [PENDING] and request from recruiter
- **HTML Not Rendering?** → Check UTF-8 encoding, use HTML5 doctype
- **Want Custom Styling?** → Edit `styles.css` to match your brand

---

**Last Updated:** 2026-07-08  
**Next Steps:**
1. Create first candidate evaluation using EVALUATION_TEMPLATE.md
2. Run Full Evaluation playbook (Agents 01–05)
3. Generate HTML report
4. Share with hiring manager for decision
