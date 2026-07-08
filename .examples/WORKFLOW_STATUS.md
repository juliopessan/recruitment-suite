# Recruitment Workflow — Verification & Status

**Date:** 2026-07-08  
**Status:** ✅ ORGANIZED & READY

---

## ✅ Workflow Organization Complete

### 1. Structure Created

```
.examples/
├── README.md ......................... Main guide (NEW)
├── WORKFLOW.md ....................... Complete process documentation (NEW)
├── EVALUATION_TEMPLATE.md ............ Reusable template (NEW)
├── CANDIDATES_ROADMAP.md ............ Tracking sheet (NEW)
├── sample-evaluation.md ............. Example (KEPT)
├── sample-evaluation.html ........... Rendered example (KEPT)
├── natalia-karam-evaluation.html .... Archive (KEPT)
├── maria-souza-people-science-evaluation.html  [KEPT]
└── candidates/ ....................... NEW FOLDER
    ├── README.md ..................... Archive index (NEW)
    ├── (future candidate evaluations here)
    └── ...
```

### 2. Workflow Logic Verified

✅ **Analysis Path:**
```
INTAKE
  ↓
SELECT PLAYBOOK
  ├─ Quick Screen (5–10 min): Agents 01 → 02 → 05
  ├─ Full Evaluation (30–45 min): Agents 01 → 02 → 03 → 04 → 05
  └─ Full + People Analytics (40–50 min): Agents 01 → 02 → 03 → 04 → 06 → 05
  ↓
INVOKE AGENTS (Sequential)
  ├─ Agent 01: Profile Evaluation → Paste output
  ├─ Agent 02: Technical Skills → Paste output
  ├─ Agent 03: Culture Fit [if Full/Full+Analytics] → Paste output
  ├─ Agent 04: Reference Validation [if Full/Full+Analytics] → Paste output
  ├─ Agent 06: People Analytics [if Full+Analytics only] → Paste output
  └─ Agent 05: Final Recommendation → Paste output
  ↓
SYNTHESIS
  └─ Agent 05 calculates: Final Score = (P×20% + T×35% + C×25% + R×15% + S×5%)
  ↓
OUTPUT
  ├─ Markdown: Save as `candidates/{name}-evaluation.md`
  └─ HTML: Convert & save as `candidates/{name}-evaluation.html`
  ↓
ARCHIVE & SHARE
  ├─ Update CANDIDATES_ROADMAP.md
  └─ Share HTML with hiring manager for decision
```

### 3. HTML Rendering Path Verified

✅ **Markdown → HTML Conversion:**

**Option A: Online (Fastest)**
1. Copy markdown content
2. Go to https://markdowntohtmlconverter.com
3. Paste content + Avanade template styling
4. Download HTML

**Option B: CLI**
```bash
npm install -g markdown-to-html
markdown-to-html \
  --input "candidates/{name}-evaluation.md" \
  --output "candidates/{name}-evaluation.html"
```

**Option C: Pandoc**
```bash
pandoc \
  --from markdown --to html \
  --output "candidates/{name}-evaluation.html" \
  "candidates/{name}-evaluation.md"
```

### 4. Scoring Scale Verified

✅ **Weights & Decision Logic:**

| Score | Decision | Action |
|-------|----------|--------|
| ≥75 | ✅ Go | Extend offer |
| 60–74 | 🟡 Hold | Manager discussion |
| 30–59 | 🔴 No-Go | Consider passing |
| <30 | ❌ No-Go | Archive |

**Calculation Formula:**
```
Final Score = 
  (Profile × 20%) +
  (Technical × 35%) +
  (Culture × 25%) +
  (References × 15%) +
  (Strategic × 5%)
```

---

## 📋 Files & Purposes

| File | Purpose | Status |
|------|---------|--------|
| **README.md** | Main entry point, quick start | ✅ Created |
| **WORKFLOW.md** | Complete process + step-by-step | ✅ Created |
| **EVALUATION_TEMPLATE.md** | Copy for new candidates | ✅ Created |
| **CANDIDATES_ROADMAP.md** | Tracking + archive | ✅ Created |
| **candidates/README.md** | Archive index | ✅ Created |
| **candidates/** | New candidates go here | ✅ Folder created |

---

## ✅ Workflow Checklist

### Phase 1: Organization ✅
- [x] Created `.examples/README.md` (main guide)
- [x] Created `.examples/WORKFLOW.md` (complete documentation)
- [x] Created `.examples/EVALUATION_TEMPLATE.md` (reusable template)
- [x] Created `.examples/CANDIDATES_ROADMAP.md` (tracking sheet)
- [x] Created `.examples/candidates/` folder
- [x] Created `.examples/candidates/README.md` (index)

### Phase 2: Workflow Logic ✅
- [x] Documented 3 playbooks (Quick Screen, Full, Full+Analytics)
- [x] Defined agent pipeline (01 → 02 → 03 → 04 → 05/06)
- [x] Specified scoring weights (Profile 20%, Tech 35%, Culture 25%, Refs 15%, Strategic 5%)
- [x] Defined decision thresholds (Go ≥75, Hold 60–74, No-Go <60)
- [x] Documented conflict escalation rules

### Phase 3: HTML Output ✅
- [x] Documented 3 methods to convert Markdown → HTML
- [x] Specified output location (`candidates/{name}-evaluation.html`)
- [x] Referenced existing examples (Natalia, Maria) for styling reference
- [x] Noted Avanade Orange DNA theme (colors #FF5800, #890078)

### Phase 4: Archive & Tracking ✅
- [x] Created `CANDIDATES_ROADMAP.md` for tracking all candidates
- [x] Created `candidates/README.md` as archive index
- [x] Kept existing evaluations for reference
- [x] Documented folder structure for new candidates

---

## 🎯 Ready for First Use

### New Candidate Workflow (Start Here)

**Step 1: Intake**
```
cp EVALUATION_TEMPLATE.md "candidates/{first-name}-{last-name}-evaluation.md"
```

**Step 2: Fill Template**
- Add job description (from `.github/templates/`)
- Add candidate profile
- Select playbook (Quick Screen / Full / Full+Analytics)

**Step 3: Invoke Agents**
- Agent 01 → Paste into Template
- Agent 02 → Paste into Template
- Agent 03 → Paste into Template [if Full/Full+Analytics]
- Agent 04 → Paste into Template [if Full/Full+Analytics]
- Agent 05 → Paste into Template

**Step 4: Generate HTML**
- Use online converter or CLI
- Save as `candidates/{name}-evaluation.html`

**Step 5: Archive & Share**
- Update `CANDIDATES_ROADMAP.md`
- Share HTML with hiring manager

---

## 📊 Current Archive Status

| Candidate | Role | Score | Status |
|-----------|------|-------|--------|
| Jordan Silva | Sr. Platform Engineer | 77/100 | Example (sample-evaluation) |
| Natália Karam | Sr. Platform Engineer | 82/100 | Archive (HTML rendered) |
| Maria Souza | Sr. People Analytics | 88/100 | Archive (HTML rendered) |

**Total:** 3 candidates | 3 Go decisions (100%)

---

## 🔍 Key Features Verified

✅ **Analysis Logic**
- 3 playbooks with clear progression
- Sequential agent invocation (no parallel processing)
- Conflict detection (high difference between scores)
- Clear decision thresholds

✅ **HTML Rendering**
- Multiple conversion methods documented
- Avanade branding (Orange DNA colors)
- Examples provided (Natalia, Maria)
- Output location specified

✅ **Tracking & Archive**
- Central roadmap (CANDIDATES_ROADMAP.md)
- Folder structure (candidates/)
- Index file (candidates/README.md)
- Historical records kept

✅ **Reusability**
- Template for every new candidate
- Consistent format across all evaluations
- Clear step-by-step instructions
- No manual work duplication

---

## 📞 Next Steps

1. **First New Candidate:**
   - Copy `EVALUATION_TEMPLATE.md`
   - Run Full Evaluation playbook
   - Generate HTML
   - Update `CANDIDATES_ROADMAP.md`

2. **Team Communication:**
   - Share `.examples/README.md` with hiring team
   - Reference `WORKFLOW.md` for process questions
   - Use `CANDIDATES_ROADMAP.md` for status tracking

3. **Continuous Improvement:**
   - Add lessons learned to `.github/memory/recruitment-lessons-learned.md`
   - Update `CANDIDATES_ROADMAP.md` after each decision
   - Archive evaluations in `candidates/` folder

---

## ✨ Summary

| Item | Status | Details |
|------|--------|---------|
| **Workflow Organization** | ✅ Complete | 4 new docs + candidates folder |
| **Analysis Logic** | ✅ Verified | 3 playbooks, 6 agents, clear scoring |
| **HTML Rendering** | ✅ Verified | 3 methods documented, examples provided |
| **Tracking System** | ✅ Complete | Roadmap + archive index |
| **Template** | ✅ Ready | Reusable for all new candidates |
| **Documentation** | ✅ Complete | README, WORKFLOW, template, roadmap |

**WORKFLOW STATUS: 🟢 READY FOR PRODUCTION**

All new candidates should now be saved in `.examples/candidates/` following this workflow.

---

**Date Completed:** 2026-07-08  
**Verified By:** Workflow Organization Task  
**Next Review:** After first new candidate evaluation
