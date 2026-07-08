# Getting Started — Recruitment Suite Onboarding Checklist

Welcome to the Recruitment Specialist Agent Suite! Use this checklist to get up and running.

## ✅ Phase 1: Understanding (10 min)

- [ ] **Read:** [README.md](README.md) — Overview of the 7 agents
- [ ] **Understand:** 4 playbooks — Quick Screen vs. Full Evaluation vs. Full + People Analytics vs. Final Decision
- [ ] **Review:** Scoring scale (0–100) and decision thresholds (75+=Go, 60–74=Hold, 30–59=Hold w/ mitigation, <30=No-Go)
- [ ] **Note:** Hard constraints (Microsoft-only, 8k char limit, LGPD compliance)

## ✅ Phase 2: Learning by Example (15 min)

- [ ] **Study:** [.examples/sample-evaluation.md](.examples/sample-evaluation.md) — Full playbook run with "Jordan Silva" candidate
- [ ] **Note:** How each agent scores, where gaps are flagged, how final recommendation is made
- [ ] **Observe:** Output format (table first, narrative second, clear recommendation)

## ✅ Phase 3: First Evaluation (30–45 min)

### Setup
- [ ] Have candidate **CV/profile** ready
- [ ] Have **job description** ready
- [ ] Decide: Quick Screen (5–10 min) or Full Evaluation (30–45 min)?

### Quick Screen (if high volume)
1. [ ] Invoke **Agent 01** — Profile Evaluator
   - Paste: Job description + Candidate CV
   - Check: Profile fit score + gaps
2. [ ] Invoke **Agent 02** — Technical Skills Evaluator
   - Paste: Tech stack required + Candidate background
   - Check: Technical score + skill gaps
3. [ ] Invoke **Agent 05** — Recommendation Engine
   - Paste: Scores from 01 & 02 + job context
   - Decision: Go/No-Go/Hold → **Done in ~10 min**

### Full Evaluation (if serious candidate)
1. [ ] **Agent 01** — Profile Evaluator (Score, gaps, strengths)
2. [ ] **Agent 02** — Technical Skills Evaluator (Tech score, interview focus)
3. [ ] **Agent 03** — Culture Fit Analyzer (Culture score, risk flags)
4. [ ] **Agent 04** — Reference Validator (Confidence score, pending verifications)
5. [ ] **Agent 06** — People Analytics Specialist (OPTIONAL: only for HR/People roles with Viva Glint requirement)
6. [ ] **Agent 05** — Recommendation Engine (Final score, Go/No-Go/Hold + rationale)
7. [ ] **Review:** Summary table with all scores + recommendation

## ✅ Phase 4: Interpretation (5 min)

- [ ] **Read** the recommendation engine output
- [ ] **Understand:**
  - 🟢 **Go** = Extend offer (or proceed to next interview round)
  - 🟡 **Hold** = Need more data or manager discussion
  - 🔴 **No-Go** = Pass, archive candidate
- [ ] **Note:** If conflict detected (Tech ≠ Culture), recommendation flags it for manager
- [ ] **Action:** Follow next steps (offer/hold/pass)

## ✅ Phase 5: Troubleshooting

### Agent output seems incomplete
- Check: Input was specific enough? (Full JD + full CV, not just job title + name)
- Check: Agent has scoring dimension explained? (Profile = experience fit, not tech fit)

### Scores seem contradictory (e.g., Tech=90, Culture=50)
- This is **intentional** and flagged by orchestrator
- **Action:** Discuss with hiring manager — tech vs. cultural alignment trade-off

### Can't find reference contact info
- **Agent 04** flags pending reference checks
- Recommendation will be "Conditional Go" if other scores are strong
- **Action:** Get reference info, then offer conditioned on verification

### Output is too long / exceeds 8k characters
- **This is a bug.** Contact Avanade Talent Team or open GitHub Issue
- Agents should summarize, not include full paragraphs

## ✅ Key Concepts

| Concept | Meaning |
|---------|---------|
| **Quick Screen** | Fast pass/fail for high volume (5–10 min, agents 01 + 02 + 05) |
| **Full Evaluation** | Thorough assessment for serious candidates (30–45 min, all agents) |
| **Profile Score** | Experience fit (years, domain expertise, career trajectory) |
| **Tech Score** | Technical skill depth (frameworks, languages, hands-on capability) |
| **Culture Score** | Soft skills + team fit (collaboration, mentoring, Avanade DNA) |
| **Reference Score** | Track record credibility (CV verification, reference quality) |
| **People Analytics Score** | (Optional) Viva Glint expertise, org psychology, transformation capability |
| **Final Score** | **Tech roles:** Profile 20% + Tech 35% + Culture 25% + Ref 15% + Strategic 5%. **HR roles:** Profile 15% + People Analytics 35% + Culture 25% + Ref 15% + Tech 5% + Strategic 5% |
| **Go** | Score ≥75 → Extend offer |
| **Hold** | Score 30–74 → Discuss, get data, or plan mitigation |
| **No-Go** | Score <30 → Pass |

## ✅ Tips & Tricks

💡 **Tip 1:** Start with **Quick Screen** if you have many candidates. Only run **Full Evaluation** for serious finalists.

💡 **Tip 2:** If tech score is low but culture is high, ask: "Can we mentor this person in [technical gap]?" If yes → **Hold** for manager discussion.

💡 **Tip 3:** Red flag scores <50 in any dimension. Escalate to hiring manager before making final call.

💡 **Tip 4:** If references pending, recommendation will be "Conditional Go." Always complete reference + background check before offer.

💡 **Tip 5:** Copy the sample evaluation into your evaluation tracker for consistency + audit trail.

## ✅ Next Steps

- [ ] **Try** a Quick Screen with your first candidate
- [ ] **Share** feedback with Avanade Talent Team
- [ ] **Report** bugs or suggest improvements via GitHub Issues
- [ ] **Read** [CONTRIBUTING.md](CONTRIBUTING.md) if you want to add new agents

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Overview, agent roles, playbooks |
| [.github/instructions/recruitment-suite.instructions.md](.github/instructions/recruitment-suite.instructions.md) | Hard constraints, conventions, rules |
| [.github/memory/recruitment-memory.md](.github/memory/recruitment-memory.md) | Living state (agent inventory, playbooks) |
| [.examples/sample-evaluation.md](.examples/sample-evaluation.md) | Full example (Jordan Silva) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to add new agents |

---

**Questions?** Contact Avanade Talent Team or open a GitHub Issue.

**Version:** 1.0  
**Status:** Production Ready ✅
