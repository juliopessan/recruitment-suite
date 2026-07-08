# Recruitment Suite — Lessons Learned

> Append-only log of insights, mistakes, and corrections. Newest entries on top.

## Template

```
### YYYY-MM-DD — <short title>
- **Context:** what happened
- **Lesson:** what we learned
- **Action:** what changed
- **Tag:** [scope|stack|ux|process|quality|privacy]
```

---

## 2026-07-08 — Agent 06: People Analytics Specialist added

- **Context:** JD for "People Science | Employee Experience Consultant" with Viva Glint requirement arrived; existing 5 agents didn't assess people-specific domain knowledge (org psychology, survey methodology, transformation at scale).
- **Lesson:** Role-specific evaluators improve signal-to-noise. A generic "Technical Skills" agent conflates software engineering with people analytics — both require depth, but the knowledge domains are orthogonal. Separate domain specialists scale better.
- **Action:** Created Agent 06 with 5 dimensions (Viva Glint Depth 25%, Stats Rigor 20%, People Psychology 20%, Executive Storytelling 20%, Transformation Leadership 15%). Updated playbooks to include "Full + People Analytics" for HR/People roles.
- **Tag:** [process|quality]

## 2026-07-08 — Suite v1.0 launched

- **Context:** Created 6-agent suite (Orchestrator + 5 evaluators) for sênior tech hiring.
- **Lesson:** Multi-agent scoring systems need **weighted synthesis** (not simple averaging). One weak dimension shouldn't kill an otherwise strong candidate. Implemented 20/35/25/15/5 weights to reflect that tech depth is critical (35%) but culture + experience matter equally.
- **Action:** Orchestrator uses weighted final score; conflict detection (>30pt gaps) flags for manager review.
- **Tag:** [process|quality]

## 2026-07-08 — 100% Microsoft stack enforced

- **Context:** Initial planning mentioned Workable ATS API, Lever, Greenhouse for candidate data.
- **Lesson:** Avanade Microsoft Cloud practice = zero tolerance for non-Microsoft tooling. Switched to "manual input" for now, plan Dataverse integration v2.
- **Action:** Hard-coded forbidden-tools list in instructions. All agent constraints include "Microsoft only" block.
- **Tag:** [stack|security]

## 2026-07-08 — Output format: tables first, narrative second

- **Context:** Agent outputs were coming back with prose first, scores hidden in paragraphs.
- **Lesson:** **Hiring decisions are time-sensitive.** Evaluator needs to scan score matrix in <10 seconds. Put matrices first, narrative second.
- **Action:** All agent outputs now lead with scoring table (scannable), then gaps/strengths, then recommendation.
- **Tag:** [ux|process]

## 2026-07-08 — LGPD compliance from day 1

- **Context:** Risk: Candidate PII retained across sessions, violating Brazil's LGPD.
- **Lesson:** Privacy must be built-in, not added later. Session-scoped data only; no logging of personal identifiers (email, phone, SSN, DOB).
- **Action:** Added LGPD constraint block to all agents. Recommend Dataverse auto-deletion policy v2.
- **Tag:** [privacy|security]

## How to Add a Lesson

1. Add entry at top (newest first)
2. Follow template: date · title · context · lesson · action · tag
3. If lesson changes a rule → update `.github/instructions/recruitment-suite.instructions.md`
4. Mirror to `/memories/repo/recruitment-lessons-learned.md` (Copilot memory)
