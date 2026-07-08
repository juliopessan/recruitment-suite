# Candidates Roadmap — Tracking & Archive

> Living record of all candidate evaluations. Updated after each hiring decision.

**Last Updated:** 2026-07-08  
**Total Candidates Evaluated:** 5  

---

## 📊 Current Candidates (Active)

*Candidates awaiting decision or in offer stage*

| # | Candidate | Role | Score | Status | Playbook | Decision Date | Notes |
|---|-----------|------|-------|--------|----------|---------------|-------|
| 1 | [Name] | [Position] | __/100 | 🔵 In Review | Quick Screen | — | [Notes] |
| 2 | [Name] | [Position] | __/100 | 🟡 On Hold | Full Eval | — | [Waiting for refs] |

---

## ✅ Hired (Completed)

*Candidates who received offers and joined*

| # | Candidate | Role | Score | Hired | Start Date | Manager | Notes |
|---|-----------|------|-------|-------|------------|---------|-------|
| — | — | — | — | — | — | — | *None yet* |

---

## 📂 Archive — Past Evaluations

*All candidate evaluations for historical reference. Click file to view full report.*

### 2026 Q3

| Candidate | Role | Playbook | Score | Decision | File | Date |
|-----------|------|----------|-------|----------|------|------|
| **Natália Karam** | Senior Platform Engineer | Full Evaluation | 82/100 | ✅ Go | [evaluation.md](candidates/natalia-karam-evaluation.md) · [HTML](candidates/natalia-karam-evaluation.html) | 2026-05-15 |
| **Maria Souza** | Senior People Analytics Specialist | Full + People Analytics | 88/100 | ✅ Go | [evaluation.md](candidates/maria-souza-people-science-evaluation.md) · [HTML](candidates/maria-souza-people-science-evaluation.html) | 2026-05-20 |
| **Jordan Silva** | Sr. Platform Engineer | Full Evaluation | 79/100 | 🟡 Hold | [evaluation.md](candidates/sample-evaluation.md) · [HTML](candidates/sample-evaluation.html) | 2026-07-08 |

---

## 🎯 Statistics

| Metric | Value |
|--------|-------|
| **Total Evaluated** | 3 |
| **Go (Offers Extended)** | 2 |
| **On Hold** | 1 |
| **No-Go** | 0 |
| **Average Score** | 83/100 |
| **Avg Time per Evaluation** | 35 min |

---

## 📋 How to Add a New Candidate

1. **Create evaluation file:**
   ```
   cp EVALUATION_TEMPLATE.md "candidates/{FIRST-NAME}-{LAST-NAME}-evaluation.md"
   ```

2. **Run playbook:**
   - Agent 01 (Profile) → paste output
   - Agent 02 (Technical) → paste output
   - Agent 03 (Culture) → paste output [if Full/Full+Analytics]
   - Agent 04 (References) → paste output [if Full/Full+Analytics]
   - Agent 05 (Recommendation) → paste final output

3. **Generate HTML:**
   - Use any Markdown → HTML tool (see WORKFLOW.md)
   - Save as `candidates/{name}-evaluation.html`

4. **Update this file:**
   - Add candidate to "Active" or "Archive" section
   - Link to both `.md` and `.html` files
   - Set status: 🔵 In Review | 🟡 On Hold | ✅ Go | ❌ No-Go

---

## 🔄 Decision Timeline Template

```
Evaluation Created:   [Date]
Playbook Used:        [Quick Screen | Full | Full+Analytics]
Agent Scores Ready:   [Date]
Final Score:          __/100
Manager Discussion:   [Date]
Decision Made:        [Date]
Offer Extended:       [Date] or [Not Extended]
Candidate Response:   [Date] or [Pending]
Hired / Archived:     [Date]
```

---

## ✨ Best Practices

✅ **Do:**
- Save both `.md` and `.html` versions
- Update this file immediately after decision
- Link to job description template used
- Keep reference contacts confidential (use "Ref 1", "Ref 2" in archived files)
- Document any escalation flags for future reference

❌ **Don't:**
- Delay updating this roadmap
- Share unfinished evaluations
- Keep PII (phone, email) in archived files beyond retention period
- Mix candidate files from different roles in one folder

---

## 📞 Support

- **Question about a past candidate?** → Search this file or check the HTML report
- **Need to re-run evaluation?** → Copy template, invoke agents, generate new HTML
- **Want to compare two candidates?** → Create side-by-side comparison using scores table

---

**Maintained By:** Recruitment Team  
**Next Review:** [Set frequency, e.g., "Weekly"]  
**Archive Policy:** Keep evaluations for 1 year after decision for reference/compliance
