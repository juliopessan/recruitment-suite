# Contributing to Recruitment Suite

Thank you for your interest in improving the Recruitment Specialist Agent Suite! This guide explains how to contribute.

## Quick Links

- **[README.md](README.md)** — Overview and quick start
- **[.github/instructions/recruitment-suite.instructions.md](.github/instructions/recruitment-suite.instructions.md)** — Hard constraints and conventions
- **[.github/memory/recruitment-memory.md](.github/memory/recruitment-memory.md)** — Living state (agent inventory, playbooks)
- **[.github/memory/recruitment-lessons-learned.md](.github/memory/recruitment-lessons-learned.md)** — Historical decisions and lessons

## How to Add a New Agent

### Step 1: Design
Decide on the agent's:
- **Persona** (15+ years in what field?)
- **Input** (what data does it consume?)
- **Output** (what scoring dimension does it evaluate?)
- **Integration** (which playbook(s) does it fit into?)

### Step 2: Create `.agent.md` File

Create `.github/agents/{NN}-{agent-name}.agent.md` following this structure:

```markdown
---
name: {agent-name}
user-invocable: true
description: "Use when: [clear trigger phrases]"
tools: [read, search]
argument-hint: "[required_inputs]"
---

# 👔 Persona
[5–7 lines about this agent's expertise and perspective]

# 📥 Input
[What data does this agent consume? What format?]

# 🔍 Análise
[Methodology: how does this agent score? What criteria? Red flags?]

# 📋 Output
[Tables first, then narrative, then recommendation]

# 🔵 Constraints
[Microsoft-only, 8k char limit, language rules, no code gen]
```

### Step 3: Update Memory & Instructions

1. **`.github/memory/recruitment-memory.md`** → Update section 4 (Agent Inventory)
2. **`.github/instructions/recruitment-suite.instructions.md`** → Update section 3 (Agent Inventory)
3. **`.github/memory/recruitment-lessons-learned.md`** → Add entry if new architectural decision
4. **`README.md`** → Update agent table if user-facing

### Step 4: Test

1. Create a sample candidate profile
2. Invoke your agent with Quick Screen or Full Evaluation playbook
3. Verify:
   - Output <8 000 characters
   - Scoring matrix is clear and scannable
   - No code generation
   - No forbidden tools mentioned (AWS, GCP, Workable, etc.)
   - EN-US for client text, PT-BR for [Internal] only

### Step 5: Document

1. Add to agent list in `package.json`
2. Update `README.md` agent table
3. Add example run to `.examples/` if applicable

## How to Modify an Existing Agent

1. Edit `.github/agents/{NN}-{agent-name}.agent.md`
2. Update `.github/memory/recruitment-memory.md` if scope changed
3. Add entry to `.github/memory/recruitment-lessons-learned.md` explaining the change
4. Test with sample candidate profile
5. Commit with clear message: `feat(agents): [agent-name] — [change]`

## Guidelines

✅ **Do:**
- Use **scoring matrices** (tables first)
- Flag **gaps** AND **strengths** (balanced perspective)
- **Escalate conflicts** (ex: Tech=90 but Culture=55) for manager review
- **Justify recommendations** in 1–2 sentences
- Follow **Avanade consulting tone** (direct, no filler)
- Include **examples** in output (e.g., "ex: 15+ years Azure")
- Respect **LGPD** (no PII retention)

❌ **Don't:**
- Generate code, scripts, or deployment templates
- Mention non-Microsoft tools (AWS, GCP, Workable, Lever, Greenhouse, etc.)
- Exceed **8 000 characters** per response
- Make subjective decisions without objective criteria
- Stereotype by background, gender, age, race, etc. → escalate bias concerns

## Playbook Updates

If your agent fits into a new playbook, update **`.github/memory/recruitment-memory.md`** section 5:

```markdown
| Playbook Name | Agents | Time | When |
|---|---|---|---|
| **New Playbook** | 01 → 03 → 05 | 15 min | [Use case] |
```

## Code Review Checklist

Before submitting, verify:

- [ ] Agent file follows frontmatter + section structure
- [ ] Output leads with scoring matrix (tables first)
- [ ] No code generation (scores, recommendations only)
- [ ] Output <8 000 characters
- [ ] EN-US for client text, PT-BR for [Internal] only
- [ ] Microsoft-only stack (no AWS/GCP mentions)
- [ ] Example run provided (sample candidate evaluation)
- [ ] Memory files updated (inventory, playbooks, lessons)
- [ ] README.md updated (if user-facing)
- [ ] No PII in documentation

## Questions?

- 📧 **Contact:** Avanade Talent Team
- 📚 **See:** [.github/instructions/recruitment-suite.instructions.md](.github/instructions/recruitment-suite.instructions.md)
- 🐛 **Report issues:** GitHub Issues

---

**Version:** 1.0  
**Last Updated:** 2026-07-08
