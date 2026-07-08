# Sample Evaluation — Full Playbook Run

**Date:** 2026-07-08  
**Candidate:** Jordan Silva (Senior DevOps Engineer evaluation)  
**Vaga:** Sr. Platform Engineer, Avanade  
**Playbook:** Full Evaluation (Agents 01–05)

---

## Job Description

**Title:** Senior Platform Engineer  
**Level:** Sênior (8–12 years)  
**Location:** São Paulo, Brazil (hybrid)  
**Team:** Cloud Infrastructure  
**Key Requirements:**
- 10+ years infrastructure/DevOps
- 5+ years Kubernetes production
- Strong in IaC (Terraform, Bicep preferred)
- Azure stack (AKS, App Service, Functions)
- Mentoring capability (lead small team)

**Nice-to-Have:**
- M365 governance experience
- Consulting/customer-facing background
- CI/CD architecture depth

---

## Input Candidate Profile

**Name:** Jordan Silva  
**Years:** 12 years infrastructure  
**Current:** Sr. DevOps at FinTech startup (2 years)  
**Previous:** 5 years at AWS (hyperscaler), 3 years at consulting firm (cloud migration), 2 years junior ops

**Technical Highlights:**
- Kubernetes: 6 years (EKS mostly, 1 year AKS hands-on)
- Terraform: 5 years (production IaC, leading team)
- Azure: 1.5 years (mostly AKS deployment, limited platform services)
- Python: 4 years (ops scripts)
- Certifications: CKA (2023), AWS Solutions Architect (2021), no Azure cert

**Background:**
- Clear IC → Tech Lead progression
- Mentored 2 junior engineers
- Led infrastructure migration (50+ microservices)
- No M365 governance experience
- Consulting experience 3 years ago (may be rusty)

---

## Playbook Execution

### STEP 1: Agent 01 — Candidate Profile Evaluator

**Persona:** "I'm a recruiting specialist with 15+ years evaluating infrastructure talent backgrounds."

**Analysis:**
- **Years relevant:** 12y infrastructure ✅ (exceeds 10y requirement)
- **Domain expertise:** DevOps/Platform ops ✅; lacks consulting expertise ⚠️
- **Company progression:** Junior Ops (2y) → Consulting (3y) → AWS (5y) → Startup (2y) = clear growth ✅
- **Seniority trajectory:** IC → Tech Lead visible ✅
- **Gap:** Limited consulting/customer-facing time (3y ago, may be rusty)

**Output:**

```
## Profile Fit Score: 82/100

| Criterion | Score | Note |
|-----------|-------|------|
| Years Relevant | 95 | 12 years vs. 10+ required ✅ |
| Domain Expertise | 85 | Strong DevOps, limited consulting experience |
| Company Progression | 80 | Clear IC → Lead trajectory; recent startup focus |
| Seniority Trajectory | 90 | Progressed IC → Tech Lead, mentoring visible |
| Geographic Fit | 85 | São Paulo, hybrid preferred — match ✅ |
| **Overall** | **82** | Strong candidate, minor consulting gap |

## Gaps
- [ ] Consulting experience 3 years ago — may need refresher on customer/stakeholder dynamics
- [ ] Limited M365 governance (preferred, not required)

## Strengths
- [ ] 12 years infrastructure (exceeds requirement)
- [ ] Clear progression IC → Tech Lead
- [ ] Mentored 2 engineers (sênior capability)
- [ ] Led major infrastructure migration

## Recommendation for Agent 02
Confidence: 85% for technical deep-dive. Explore: Kubernetes hands-on depth + Azure learning curve; confirm consulting soft skills still present.
```

---

### STEP 2: Agent 02 — Technical Skills Evaluator

**Persona:** "I'm a Tech Lead with 12 years hiring engineers; I assess hands-on depth vs. keywords."

**Analysis:**
- **Kubernetes:** 6 years (mostly EKS) + 1 year AKS = mostly AWS-focused ⚠️
- **Terraform:** 5 years production IaC, leading team ✅ (strong)
- **Azure:** 1.5 years, mostly AKS (needs Bicep, platform services depth)
- **Python:** 4 years ops scripts ✅
- **Certifications:** CKA (strong), AWS cert (dated for Azure role), no Azure cert ⚠️

**Output:**

```
## Technical Score: 78/100

| Skill | Years | Level | Cert? | Gap? | Notes |
|-------|-------|-------|-------|------|-------|
| Kubernetes | 6 | Hands-on IC/Lead | ✅ CKA | 20% | Mostly EKS; limited AKS depth |
| Terraform | 5 | Hands-on Lead | ❌ | 0% | Strong, production-grade; leads team ✅ |
| Azure | 1.5 | Hands-on IC | ❌ | 40% | Mostly AKS; weak on Bicep, App Service |
| Python | 4 | Hands-on | ❌ | 0% | Ops scripting, solid ✅ |
| IaC Diversity | — | — | — | 30% | Terraform strong; Bicep learning |
| **Overall** | — | — | — | — | **78** |

## Technical Gaps
- [ ] Bicep (Terraform strong, but Bicep required for Azure IaC) → **CRITICAL** for this role
- [ ] Azure platform services (App Service, Functions, etc.) — mostly AKS focus
- [ ] No Azure cert (AWS cert 2021; outdated for Azure role)
- [ ] 1.5 years Azure experience < 5y nice-to-have; ramp-up needed

## Technical Strengths
- [ ] 6 years Kubernetes hands-on, CKA certified ✅
- [ ] 5 years Terraform, leading infrastructure initiatives ✅
- [ ] Clear progression: hands-on IC → infrastructure architect/lead
- [ ] Team mentoring capability visible

## Technical Interview Recommendations

**Focus Areas:**
1. **Bicep Depth** — Design problem: "Design multi-region AKS deployment with Bicep"
2. **Azure Platform** — "Walk us through App Service + Functions architecture"
3. **Kubernetes Architecture** — "Design HA Kubernetes cluster for multi-tenant SaaS"
4. **Team Leadership** — "How did you mentor your 2 engineers through Kubernetes transition?"

**Red Flags to Explore:**
- [ ] Claimed "Kubernetes production"; confirm: How many clusters? Failure recovery? Multi-region?
- [ ] 1.5y Azure seems short; confirm hands-on depth (not just deployment experience)

**Hiring Decision:** Recommend technical interview. Kubernetes + Terraform are strong; Azure/Bicep ramp-up is clear but addressable with good mentoring.
```

---

### STEP 3: Agent 03 — Culture Fit Analyzer

**Persona:** "I'm a People Manager, 18+ years. I assess soft skills, team dynamics, and cultural fit."

**Analysis:**
- **Communication:** CV is clear, articulate ✅
- **Collaboration:** Mentored 2 engineers, led team → strong ✅
- **Growth mindset:** Career pivots (consulting → AWS → startup) show learning ✅
- **Avanade DNA:** Consulting background (3 years ago) + startup ops; may need consulting culture refresh ⚠️
- **Humility:** CV tone is humble, no arrogance signals ✅

**Output:**

```
## Culture Fit Score: 81/100

| Dimension | Score | Evidence | Risk |
|-----------|-------|----------|------|
| Communication | 88 | Clear CV, articulate writing ✅ | Low |
| Collaboration | 85 | Led teams, mentored 2 engineers ✅ | Low |
| Growth Mindset | 90 | Career pivots show learning (consulting→AWS→startup) | Low |
| Avanade DNA | 70 | Consulting 3y ago; may need culture refresh ⚠️ | Medium |
| Humility | 80 | Humble tone, no ego signals ✅ | Low |
| **Overall** | **81** | Strong cultural fit, minor consulting refresh needed | **Medium** |

## Culture Risk Flags
- [ ] Consulting background 3 years ago — may need refresher on customer/stakeholder dynamics
- [ ] Recent startup focus (fast-paced, autonomous) vs. consulting (structured, client-driven) → explore transition

## Culture Strengths
- [ ] Mentored 2 engineers → sênior leadership capability ✅
- [ ] Consulting background (even if dated) → client-facing capability potential ✅
- [ ] Clear growth trajectory + continuous learning ✅
- [ ] Collaborative communication style ✅

## Team Fit Assessment
**Confidence:** 85% for team culture alignment

**Team Fit:** Jordan shows strong mentoring + collaboration signals. Startup IC independence may make consulting collaboration a slight transition, but growth mindset + humility suggest coachability. Recommend pairing with culture mentor on client/stakeholder dynamics.

**Onboarding Recommendations:**
- [ ] Assign mentor: Someone with consulting + cloud background to help transition
- [ ] Include in team projects (cross-functional) to build Avanade collaboration bonds
- [ ] Schedule culture briefing: Orange DNA values + consulting mindset expectations
```

---

### STEP 4: Agent 04 — Reference Validator

**Persona:** "I'm an investigator with 14+ years validating track records. I verify claims."

**Analysis:**
- **CV Claims:** 12y experience, clear progression, specific projects listed
- **References:** (Assuming recruiter obtained:) Manager at startup (strong), peer at AWS (good), no consulting reference yet
- **Timeline:** Clean (no unexplained gaps)
- **Achievements:** Migration (50+ microservices) — seems realistic, need to verify scope
- **Job Hopping:** No (2–5 year stays, logical transitions)

**Output:**

```
## Reference Confidence Score: 88/100

| Dimension | Score | Status | Notes |
|-----------|-------|--------|-------|
| CV Claim Verification | 92 | ✅ Verified | Dates align, role progression clear |
| Reference Quality | 85 | ✅ Strong | Manager + peer from recent roles; consulting reference pending |
| Achievement Credibility | 88 | ✅ Credible | "50+ microservices migration" confirmed by manager ✅ |
| Timeline Integrity | 90 | ✅ Clean | No gaps, logical 2–5 year stays |
| Background Check | — | ⏳ Pending | Standard check in progress |
| **Reference Confidence** | **88** | — | — |

## Validation Status
- [x] CV dates verified (manager at startup confirmed)
- [x] Achievement credibility (50+ microservices migration confirmed)
- [x] Mentoring claims (2 junior engineers reported by manager)
- [ ] Consulting reference pending (3 years ago, may be hard to reach)
- [ ] Background check pending (standard, no concerns expected)

## Strengths
- [x] All CV claims verified ✅
- [x] Manager + peer references strong (both spoke highly)
- [x] Achievements credible (migration details confirmed)
- [x] Timeline clean (no gaps, logical progression)

## Next Steps
1. [ ] Obtain consulting reference (manager from 3 years ago) — confirm customer/leadership skills
2. [ ] Complete background check (standard, ETA: 3 days)
3. [ ] If refs + check clear → Conditional Go ✅
```

---

### STEP 5: Agent 05 — Hiring Recommendation Engine

**Persona:** "I'm a Hiring Executive with 20+ years. I synthesize inputs, detect conflicts, emit clear decision."

**Analysis:**

**Score Breakdown:**
- Profile: 82/100 (strong background, minor consulting gap)
- Tech: 78/100 (strong K8s + Terraform, weak on Azure/Bicep)
- Culture: 81/100 (great collaboration, minor consulting refresh)
- References: 88/100 (claims verified, pending final reference + background check)
- Strategic: +5 (team needs K8s expertise, mentoring capability)

**Weighted Final Score:**
```
Final = (82 × 0.20) + (78 × 0.35) + (81 × 0.25) + (88 × 0.15) + (5 × 0.05)
      = 16.4 + 27.3 + 20.25 + 13.2 + 0.25
      = 77.4 → **77/100**
```

**Conflict Check:**
- Tech (78) vs. Culture (81): Diff = 3 pts → No conflict ✅
- Culture (81) vs. References (88): Aligned ✅
- Profile (82) vs. Tech (78): Minor gap (Azure experience) but addressable ✅

**Output:**

```
## Final Hiring Recommendation

| Candidate | Vaga | Final Score | Recomendação | Confiança |
|-----------|------|-------------|--------------|-----------|
| Jordan Silva | Sr. Platform Engineer | **77/100** | **🟢 GO** | 90% |

---

## Score Breakdown (Weighted)

| Dimensão | Raw | Weight | Contribuição | Avaliador |
|----------|-----|--------|--------------|-----------|
| Perfil & Background | 82 | 20% | +16.4 | Agent 1 |
| Habilidades Técnicas | 78 | 35% | +27.3 | Agent 2 |
| Fit Cultural | 81 | 25% | +20.25 | Agent 3 |
| Referências & Track | 88 | 15% | +13.2 | Agent 4 |
| Strategic Bonus | +5 | 5% | +0.25 | Orchestrator |
| **FINAL SCORE** | — | **100%** | **77.4 → 77** | — |

---

## Recommendation: 🟢 GO

### Rationale
Jordan is a strong candidate with solid cultural fit (81), excellent track record (references 88), and strong foundational skills (K8s + Terraform). Technical score (78) reflects Azure/Bicep gap — real, but addressable through onboarding + mentoring. Profile (82) exceeds requirement for years + progression. Final score 77 > 75 threshold + no critical red flags = recommend hire.

---

## Critical Decision Factors

### Strengths
- [x] 12 years infrastructure experience (exceeds requirement)
- [x] Strong Kubernetes (6y hands-on, CKA certified)
- [x] Team leadership + mentoring capability
- [x] Excellent references (manager speaks highly)
- [x] Clean track record (timeline verified, no red flags)

### Trade-Off: Azure/Bicep Learning Curve
**Challenge:** 1.5y Azure, no Bicep hands-on. JD requires "Bicep preferred."  
**Mitigation:** Pair with Azure/Bicep mentor for 4-week ramp-up. Python + Terraform background → quick learning curve.  
**Risk Level:** LOW (addressable with support)

---

## Next Steps

### 1. Conditional Go ✅
- [x] Final reference check (consulting manager) — ETA: 2 days
- [x] Background check clear (standard, pending) — ETA: 3 days

### 2. Once Cleared
1. [ ] **Extend Offer:** Target start date [X date], salary $[Y–Z]
2. [ ] **Onboarding Plan:**
   - Assign mentor: [Azure/Bicep expert], 4-week ramp-up
   - Include in team projects (pair programming on AKS designs)
   - Schedule culture briefing: Orange DNA + consulting mindset
3. [ ] **Communication:**
   - Notify hiring manager: "Go with conditions, clear in 5 days"
   - Alert team: "New Sr. Platform Engineer joining; Kubernetes lead incoming"

### 3. Risk Mitigation
- [ ] Assign mentor **before** start (avoid first-week friction)
- [ ] Plan Bicep training (online course + pair programming)
- [ ] Schedule culture/team integration (first week priority)

---

## Confidence Level

**Confidence: 90%** — Based on verified track record (88/100 references), strong culture signals (81/100), and addressable technical gaps (78/100 with mentoring). References pending (consulting manager + background check), but no concerns expected.

---

**DECISION:** ✅ **Extend Conditional Offer** (pending final reference + background check clearance)  
**EXPECTED TIMELINE:** Offer by [X date], start date [Y date]
```

---

## Summary

| Stage | Agent | Score | Status |
|-------|-------|-------|--------|
| 1️⃣ Profile | Agent 01 | 82 | ✅ Complete |
| 2️⃣ Technical | Agent 02 | 78 | ✅ Complete |
| 3️⃣ Culture | Agent 03 | 81 | ✅ Complete |
| 4️⃣ References | Agent 04 | 88 | 🟡 Pending (final ref + background) |
| 5️⃣ Recommendation | Agent 05 | **77** | ✅ **GO (Conditional)** |

**Overall Recommendation:** 🟢 **GO** with mentoring support for Azure/Bicep ramp-up. Expect strong hire once references + background clear.

---

**Playbook:** Full Evaluation  
**Total Time:** ~45 minutes  
**Decision:** Conditional Go (pending final verification)  
**Next Action:** Follow up on pending reference + background check; extend offer upon clearance
