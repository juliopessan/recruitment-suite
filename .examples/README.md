# Examples & Workflow — Recruitment Suite

> Templates, examples, and workflow documentation for candidate evaluations. **Start here.**

---

## 📑 Files in This Directory

| File | Purpose | Use When |
|------|---------|----------|
| **[WORKFLOW.md](WORKFLOW.md)** | 🎯 Complete evaluation workflow | Starting a new candidate evaluation |
| **[EVALUATION_TEMPLATE.md](EVALUATION_TEMPLATE.md)** | 📋 Reusable template | Ready to create new evaluation |
| **[CANDIDATES_ROADMAP.md](CANDIDATES_ROADMAP.md)** | 📊 Tracking & history | Need to check past candidates or view archive |
| **sample-evaluation.md** | ✅ Completed example (Markdown) | Want to see what a Full Evaluation looks like |
| **sample-evaluation.html** | ✅ Rendered HTML report | Want to see final stakeholder report |
| **natalia-karam-evaluation.html** | 👤 Archive: Platform Engineer | Reference example (Senior Platform Engineer) |
| **maria-souza-people-science-evaluation.html** | 👤 Archive: People Analytics | Reference example (People Analytics role) |

---

## 🚀 Quick Start: New Candidate Evaluation

### Step 1: Choose Your Playbook

| Playbook | Time | Use Case |
|----------|------|----------|
| **Quick Screen** | 5–10 min | High volume, need fast pass/fail |
| **Full Evaluation** | 30–45 min | Serious candidates, references ready |
| **Full + People Analytics** | 40–50 min | HR/People roles requiring Viva Glint expertise |

### Step 2: Copy Template & Run Playbook

```bash
# Copy template for new candidate
cp EVALUATION_TEMPLATE.md "candidates/john-doe-evaluation.md"

# Open in editor and fill in:
# - Job Description (from .github/templates/)
# - Candidate Profile
# - Playbook selection
```

### Step 3: Invoke Agents (One by One)

**For Full Evaluation playbook:**

**Agent 01 — Profile Evaluator**
```
Input: CV + Job Description
Output: [Paste into "## 1. Profile Evaluation" section]
```

**Agent 02 — Technical Skills Evaluator**
```
Input: CV + Required Stack
Output: [Paste into "## 2. Technical Skills Evaluation" section]
```

**Agent 03 — Culture Fit Analyzer**
```
Input: CV + Team Context
Output: [Paste into "## 3. Culture Fit Analysis" section]
```

**Agent 04 — Reference Validator**
```
Input: References + CV Background
Output: [Paste into "## 4. Reference Validation" section]
```

**Agent 05 — Recommendation Engine (Orchestrator)**
```
Input: All scores + weights
Output: [Paste into "## FINAL RECOMMENDATION" section]
```

### Step 4: Generate HTML Report

**Using Online Tool (fastest):**
1. Copy your markdown content
2. Go to https://markdowntohtmlconverter.com
3. Paste markdown
4. Select HTML template with Avanade Orange DNA styling (see `html-template.html`)
5. Download as `.html`

**Using Command Line:**
```bash
# Install markdown tool
npm install -g markdown-to-html

# Convert
markdown-to-html \
  --input "candidates/john-doe-evaluation.md" \
  --output "candidates/john-doe-evaluation.html"
```

### Step 5: Archive & Share

```
.examples/candidates/
├── john-doe-evaluation.md       ← Keep for records
├── john-doe-evaluation.html     ← Share with stakeholders
```

Update [CANDIDATES_ROADMAP.md](CANDIDATES_ROADMAP.md) with candidate status.

---

## 📊 Scoring Scale

| Score | Interpretation | Recommendation |
|-------|-----------------|-----------------|
| **75–100** | Excellent fit | ✅ **Go** — Move to offer |
| **60–74** | Good fit, minor gaps | 🟡 **Hold** — Manager discussion |
| **30–59** | Partial fit, significant gaps | 🔴 Consider **No-Go** |
| **0–29** | Not qualified | ❌ **No-Go** — Pass |

**Final Score = (Profile 20% + Tech 35% + Culture 25% + References 15% + Strategic 5%)**

---

## 📁 Directory Structure

```
.examples/
├── README.md                              [← You are here]
├── WORKFLOW.md                            [Complete process]
├── EVALUATION_TEMPLATE.md                 [Copy this for new candidates]
├── CANDIDATES_ROADMAP.md                  [Tracking + history]
├── sample-evaluation.md                   [Example markdown]
├── sample-evaluation.html                 [Example rendered HTML]
├── natalia-karam-evaluation.html          [Archive example]
├── maria-souza-people-science-evaluation.html  [Archive example]
├── html-template.html                     [Avanade Orange DNA HTML template]
├── styles.css                             [Shared CSS styling]
└── candidates/
    ├── [all new candidate evaluations]
    ├── {name}-evaluation.md
    ├── {name}-evaluation.html
    └── ...
```

---

## ✅ Complete Workflow Checklist

- [ ] **Gather inputs:** Job description (from `.github/templates/`) + Candidate CV
- [ ] **Choose playbook:** Quick Screen | Full | Full+Analytics
- [ ] **Copy template:** `cp EVALUATION_TEMPLATE.md "candidates/{name}-evaluation.md"`
- [ ] **Agent 01:** Profile Evaluator → paste output
- [ ] **Agent 02:** Technical Skills → paste output
- [ ] **Agent 03:** Culture Fit → paste output [if Full/Full+Analytics]
- [ ] **Agent 04:** Reference Validator → paste output [if Full/Full+Analytics]
- [ ] **Agent 05:** Recommendation Engine → paste final output
- [ ] **Generate HTML:** Use online tool or command line
- [ ] **Save both files:** `.md` + `.html` in `candidates/` folder
- [ ] **Update CANDIDATES_ROADMAP.md:** Add candidate + score + status + links
- [ ] **Share HTML:** Send to hiring manager/stakeholders for decision

---

## 🎯 Example Workflow (Real Scenario)

### Scenario: Hiring Senior Platform Engineer

**Day 1: Intake**
```
Job Description: .github/templates/01-senior-platform-engineer.md
Candidate: "Natália Karam" (CV received)
Playbook: Full Evaluation
```

**Day 1–2: Agent Analysis (30–45 min)**
```
→ Agent 01: Profile = 85/100 (8y infrastructure, Kubernetes expert)
→ Agent 02: Technical = 88/100 (Strong on K8s, Azure, IaC)
→ Agent 03: Culture = 80/100 (Good collaboration, mentors juniors)
→ Agent 04: References = 90/100 (Verified achievements, strong feedback)
→ Agent 05: Final = 86/100 → ✅ GO RECOMMENDATION
```

**Day 2: HTML Report Generation**
```
→ Convert markdown → HTML
→ Share with hiring manager
→ Manager reviews → Agrees with recommendation
```

**Day 3: Decision & Offer**
```
→ Update CANDIDATES_ROADMAP.md: Status = ✅ Go
→ Extend offer
→ Archive evaluation (both .md + .html)
```

---

## 📞 Common Questions

**Q: How long does evaluation take?**  
A: Quick Screen = 5–10 min. Full = 30–45 min. Full + Analytics = 40–50 min.

**Q: Can I skip references?**  
A: Yes, use Quick Screen playbook (Agents 01 → 02 → 05 only).

**Q: What if candidate has High Technical but Low Culture Fit?**  
A: Flag as "conflict" in evaluation. Escalate to manager for discussion.

**Q: Can I re-score a candidate?**  
A: Yes, create new evaluation with updated information. Archive old version.

**Q: How do I convert Markdown to HTML?**  
A: Use online converter, Pandoc, or markdown-to-html CLI tool (see WORKFLOW.md).

**Q: Where do I save new evaluations?**  
A: `candidates/` folder as `{name}-evaluation.md` + `{name}-evaluation.html`

---

## 🔗 Related Resources

- **Job Description Templates:** [`.github/templates/`](../templates/)
- **Agent Specifications:** [`.github/agents/`](../.github/agents/)
- **Recruitment Instructions:** [`.github/instructions/recruitment-suite.instructions.md`](../.github/instructions/recruitment-suite.instructions.md)
- **Recruitment Memory:** [`.github/memory/recruitment-memory.md`](../.github/memory/recruitment-memory.md)

---

## 📝 Contributing

When you complete a candidate evaluation:

1. **Add to CANDIDATES_ROADMAP.md** → Document candidate, score, status, and links
2. **Save both .md and .html** → Archive in `candidates/` folder
3. **Share HTML with stakeholders** → Use for decision review
4. **Update status** → Move from "Active" → "Hired" or "Archive" based on decision

---

**Last Updated:** 2026-07-08  
**Next Steps:**
1. Read [WORKFLOW.md](WORKFLOW.md) for complete process
2. Copy [EVALUATION_TEMPLATE.md](EVALUATION_TEMPLATE.md) for first candidate
3. Run playbook → Generate HTML → Update roadmap
4. Share with hiring manager for decision

**Questions?** Check WORKFLOW.md or contact recruitment team.
