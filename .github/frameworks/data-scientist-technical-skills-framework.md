# Data Scientist Technical Skills Framework
## People Science | Employee Experience Consultant | Viva Glint

**Role Context:** Digital transformation in employee experience through data, behavior, and strategy. Responsible for designing listening strategies, translating insights into action, and influencing executive decision-making.

---

## 1. Core Technical Competencies (Weighted)

| Competency | Weight | Critical? | Min. Proficiency | Description |
|------------|--------|-----------|------------------|-------------|
| **Viva Glint Platform** | 25% | 🔴 YES | Intermediate | Configuration, survey design, export, reporting, dashboards |
| **Statistical Analysis** | 20% | 🔴 YES | Intermediate | Hypothesis testing, confidence intervals, correlation, regression |
| **Data Visualization** | 15% | 🟡 HIGH | Intermediate | Power BI, Excel, storytelling, executive dashboards |
| **People Analytics** | 15% | 🟡 HIGH | Intermediate | Employee lifecycle, engagement drivers, retention modeling |
| **SQL & Data Querying** | 15% | 🟡 HIGH | Beginner+ | Database querying, data extraction, basic joins |
| **Python / R** | 10% | 🟢 NICE | Beginner+ | Optional; automation, advanced stats, ML (if applicable) |

---

## 2. Viva Glint Platform Mastery (25% Weight)

### 2.1 Survey Design & Configuration
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Survey Creation** | Can follow templates | Design custom surveys, logic flow, skip patterns | Expert in branching logic, multi-language support |
| **Scale Design** | Familiar with 5-point | Design psychometric scales, balanced anchors | Custom scales, validation studies |
| **Question Types** | Single-choice, rating | Matrix, ranking, open-text, NPS | Adaptive questions, conditional logic |
| **Frequency & Cadence** | Annual pulse only | Pulse (quarterly), continuous listening | Integrated listening strategy with pulse + real-time |
| **Assessment** | 📋 Quiz: Design a 20-question pulse survey with engagement drivers (engagement, culture, leadership) | 📋 Quiz: Design multi-wave listening strategy (annual + quarterly pulse + real-time feedback). Include skip logic based on role/department | 📋 Workshop: Validate survey with pilot group; analyze psychometric properties (Cronbach's alpha, factor structure) |

**Target Score for Role:** 65+ (Intermediate - High) | Score 80+ earns "platform expert" badge

---

### 2.2 Data Export & Integration
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Export Types** | Summary reports | Respondent-level, response patterns, time series | API integration, real-time exports, custom formats |
| **Data Cleaning** | Copy-paste cleanup | Consistent workflows, handling missing data | Automated data validation pipeline |
| **Export Frequency** | Manual export | Scheduled exports, version control | Automated export to data lake / Power BI |
| **Segmentation** | By department | By role, tenure, location, engagement level | Automated segmentation, cohort analysis |
| **Assessment** | 📋 Task: Export survey response data, identify missing patterns, prepare for analysis | 📋 Task: Set up automated weekly export with data quality checks; create segmentation logic | 📋 Workshop: Build API integration to pull Viva Glint data into Azure Data Lake; schedule nightly sync |

**Target Score for Role:** 60+ (Intermediate) | Critical for autonomous analytics work

---

### 2.3 Viva Glint Reporting & Dashboards
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Standard Reports** | Use built-in templates | Customize KPI reports, drill-downs | Advanced filtering, benchmarking |
| **Dashboard Creation** | Read dashboards | Build Viva Glint dashboards, refresh | Integrate with Power BI, real-time updates |
| **Benchmarking** | Understand scores | Internal year-over-year, peer groups | External benchmarks (industry, competitor) |
| **Trend Analysis** | Single-period view | Multi-period trends, anomaly detection | Forecasting, predictive dashboards |
| **Assessment** | 📋 Task: Create a monthly dashboard showing engagement by department | 📋 Task: Build benchmark dashboard (internal YoY + external peer); add predictive trend | 📋 Workshop: Design executive dashboard with drill-down; integrate external HR data (attrition, salary) |

**Target Score for Role:** 55+ (Upper Beginner - Lower Intermediate) | Power BI compensates if lower

---

## 3. Statistical Analysis & Quantitative Rigor (20% Weight)

### 3.1 Hypothesis Testing & Inference
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **T-Tests, ANOVA** | Understand purpose | Can execute, interpret p-values, effect sizes | Design studies, power analysis, assumptions testing |
| **Correlation & Regression** | Scatter plots, R² | Linear regression, multicollinearity checks | Logistic regression, interaction effects, model diagnostics |
| **Confidence Intervals** | Know they exist | Calculate and interpret 95% CIs | Bayesian credible intervals, effect size CIs |
| **P-Values & Significance** | Memorize <0.05 rule | Interpret in context, avoid misuse | Multiple comparisons, adjust alpha |
| **Assessment** | 📋 Quiz: Given survey data, test if engagement differs by department (t-test); report p-value and conclusion | 📋 Quiz: Model engagement as function of culture + leadership + growth; interpret coefficients and R² | 📋 Workshop: Design A/B test for new listening initiative; power analysis, sample size calculation |

**Target Score for Role:** 65+ (Intermediate) | **RED FLAG if <55** (insufficient rigor)

---

### 3.2 Sample Size, Representativeness, Bias
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Response Rates** | Know survey response rate | Interpret representativeness, adjust for bias | Weighting strategies, imputation methods |
| **Sampling Bias** | Name the concept | Identify sources in employee surveys | Demographic profiling, non-response adjustment |
| **Significance Tests with Low N** | "Need large N" | Adjust interpretation for small groups | Bayesian approaches, exact tests |
| **Demographic Weighting** | Understand idea | Apply weights for gender/tenure/level | Multi-dimensional weighting, calibration |
| **Assessment** | 📋 Quiz: Engagement survey has 40% response rate, skewed toward managers. Interpret scores; what's the bias risk? | 📋 Quiz: Design weighting strategy to adjust for non-response bias in pulse survey | 📋 Workshop: Implement population-level inference with weighted sample; calculate confidence intervals |

**Target Score for Role:** 60+ (Lower Intermediate) | Critical for avoiding false conclusions

---

### 3.3 Drivers & Root Cause Analysis
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Segmentation** | Run by department | Persona development, segment profiling | Machine learning clustering, psychographic segments |
| **Correlation & Causality** | Confused about difference | Know correlation ≠ causation, discuss confounds | Causal inference methods (propensity scoring, IV) |
| **Driver Prioritization** | Highest correlation wins | Correlation + magnitude + business impact | Relative importance analysis, dominance analysis |
| **Open-Text Analysis** | Manual reading | Keyword search, thematic coding | NLP, sentiment analysis, topic modeling |
| **Assessment** | 📋 Task: Identify which factors most strongly predict engagement (culture, leadership, growth, compensation) | 📋 Task: Segment employees into personas; profile each; recommend targeted interventions per persona | 📋 Workshop: Model engagement drivers; quantify business impact of each; prioritize top 3 recommendations |

**Target Score for Role:** 65+ (Intermediate) | Enables strategic recommendations

---

## 4. Data Visualization & Storytelling (15% Weight)

### 4.1 Executive Dashboard & Report Design
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Chart Selection** | Bar/pie charts | Right chart for audience; avoid distortion | Visual hierarchy, accessibility (color-blind safe) |
| **Dashboard Layout** | All info on one page | Logical flow, scannable, mobile-ready | Interactive drill-down, real-time KPIs |
| **Storytelling** | "Here are the numbers" | Narrative arc: insight → action → impact | Compelling narratives that drive behavior change |
| **Color & Design** | Default tool colors | Avanade brand colors, professional design | Gestalt principles, accessibility standards |
| **Assessment** | 📋 Task: Create a 1-page summary of engagement scores by department | 📋 Task: Design 3-slide executive brief with engagement trends, drivers, and top 3 actions | 📋 Workshop: Build interactive Power BI dashboard; test with C-level stakeholder for clarity |

**Target Score for Role:** 60+ (Lower Intermediate - Intermediate) | Power BI tools help if lower

---

### 4.2 Power BI Proficiency
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Data Source Connection** | Excel import | SQL Server, multiple sources, refresh | Direct Query, incremental load, transformation |
| **Data Modeling** | Flat tables | Star schema, relationships, calculated columns | DAX formulas, aggregation tables, performance tuning |
| **Visualizations** | Standard visuals | Custom visuals, tooltips, drill-through | R/Python visuals, advanced interactivity |
| **Publishing & Sharing** | Local .pbix file | Power BI Service, app workspace, sharing | Row-level security, performance monitoring |
| **Assessment** | 📋 Task: Connect to survey data; create simple pie chart of engagement by level | 📋 Task: Build multi-page dashboard with filters, drill-through; publish to Power BI Service | 📋 Workshop: Optimize DAX performance for 10M+ rows; implement RLS for department managers |

**Target Score for Role:** 50+ (Upper Beginner - Lower Intermediate) | Team support available; can upskill on-the-job

---

## 5. People Analytics Acumen (15% Weight)

### 5.1 Employee Lifecycle & Engagement Drivers
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Engagement Framework** | Know term exists | Understand C.A.R.E. model, drivers of engagement | Industry frameworks (Gallup Q12, IES Employee Outlook) |
| **Employee Lifecycle** | Hire-to-fire | Onboarding, growth, retention, exit | Predictive lifecycle modeling, intervention points |
| **Manager Impact** | Managers matter | Quantify manager's role (~70% of engagement) | Manager effectiveness assessment, coaching strategies |
| **Culture & Belonging** | Nice to have | Measurable culture dimensions, DEI metrics | Psychological safety, inclusion index, belonging strategy |
| **Assessment** | 📋 Quiz: List 5 engagement drivers for tech employees; explain why each matters | 📋 Quiz: Map engagement drivers to employee lifecycle; recommend interventions at each stage | 📋 Workshop: Design listening strategy aligned to org values; measure progress against business outcomes (retention, productivity) |

**Target Score for Role:** 65+ (Intermediate) | Shows business acumen beyond analytics

---

### 5.2 HR Metrics & Business Impact
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Retention & Attrition** | Calculate turnover % | Voluntary/involuntary split, cost of attrition | Predictive churn modeling, retention ROI |
| **Productivity & Performance** | Subjective ratings | Engagement-to-performance correlation | Engagement ROI (revenue per engaged employee) |
| **Diversity & Inclusion** | Report headcount | Representation by level/function, pay gaps | Belonging index, inclusive decision-making metrics |
| **L&D Impact** | Training hours | Training-to-promotion correlation, skill mapping | Learning path effectiveness, time-to-competency |
| **Assessment** | 📋 Task: Calculate engagement correlation with retention; estimate attrition cost savings from 5-point engagement lift | 📋 Task: Model engagement impact on productivity; build business case for listening initiative | 📋 Workshop: Design end-to-end org effectiveness scorecard (engagement → retention → productivity → revenue) |

**Target Score for Role:** 60+ (Lower Intermediate) | Enables credible business conversations

---

## 6. SQL & Data Engineering Fundamentals (15% Weight)

### 6.1 SQL Querying & Data Extraction
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **SELECT, WHERE, ORDER** | Can copy a query | Writes queries from scratch; understands execution | Query optimization, index strategies |
| **Joins (INNER, LEFT)** | Concept understood | Can join 2-3 tables correctly; avoids duplicates | Complex joins, self-joins, performance tuning |
| **Aggregations (GROUP BY)** | Familiar | GROUP BY + HAVING, window functions | Recursive CTEs, hierarchical queries |
| **Data Cleaning** | Manual cleanup | WHERE clauses, NULL handling, type casting | Performance at scale, bulk updates |
| **Assessment** | 📋 Task: Write query to extract survey responses by department, filter for responses > 3 | 📋 Task: Query to join survey responses with HR data (tenure, level, department); show engagement by level | 📋 Workshop: Query optimization; extract weekly engagement trends to data lake; set up scheduled jobs |

**Target Score for Role:** 50+ (Upper Beginner - Lower Intermediate) | **RED FLAG if 0** (cannot extract data independently)

---

### 6.2 Database & Data Pipeline Basics
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Data Sources** | Single database | Multiple sources, APIs, cloud storage | Master data management, data governance |
| **ETL/ELT Concepts** | Heard of them | Can design simple pipeline, understand steps | End-to-end pipeline design, error handling, monitoring |
| **Data Quality** | Basic checks | Validation rules, reconciliation, logging | Anomaly detection, automated quality scoring |
| **Data Governance** | Not familiar | Data dictionary, access control, lineage | Metadata management, audit trails, compliance |
| **Assessment** | 📋 Task: Describe steps to extract Viva Glint data, clean, load into Power BI | 📋 Task: Design daily ETL pipeline: Viva Glint → SQL → Power BI; include quality checks | 📋 Workshop: Implement Azure Data Factory pipeline; automate data quality monitoring; implement governance controls |

**Target Score for Role:** 45+ (Upper Beginner) | IT/Analytics Engineering support available for advanced work

---

## 7. Python / R (Optional, 10% Weight)

### 7.1 Automation & Advanced Analytics
**Proficiency Levels:** Beginner (0) → Intermediate (50) → Advanced (100)

| Skill | Beginner | Intermediate | Advanced |
|-------|----------|--------------|----------|
| **Pandas / R Tidyverse** | Not familiar | Can load, filter, summarize data in Python/R | Complex transformations, piping, best practices |
| **Visualization Libraries** | Excel only | Matplotlib/ggplot2, create publication-quality plots | Interactive dashboards (Plotly, Shiny) |
| **Statistical Libraries** | Spreadsheet formulas | SciPy/statsmodels, hypothesis tests, regression | Scikit-learn, advanced modeling |
| **Automation Scripts** | Manual work | Automate data prep, weekly reports, emails | Scheduled jobs, error handling, logging |
| **Assessment** | 📋 Task: Write Python script to import CSV, calculate engagement by department, export summary | 📋 Task: Write Python function to automate weekly engagement report; include trend analysis | 📋 Workshop: Build end-to-end ML pipeline: predict churn from engagement data; deploy as API |

**Target Score for Role:** 30+ (Beginner or Not Required) | Nice-to-have; can upskill on-the-job if <50

---

## 8. Assessment Rubric Summary

### Scoring Methodology

**Overall Technical Score = Sum of Weighted Competencies**

```
Total = (Viva Glint × 0.25) + (Stats × 0.20) + (Viz × 0.15) 
        + (People Analytics × 0.15) + (SQL × 0.15) + (Python × 0.10)
```

### Score Interpretation

| Score | Level | GO/NO-GO | Recommendation |
|-------|-------|----------|-----------------|
| **80-100** | ✅ **EXPERT** | 🟢 **GO** | Ready for autonomous work; can train others |
| **70-79** | ✅ **PROFICIENT** | 🟢 **GO** | Ready for role; minimal onboarding needed |
| **60-69** | 🟡 **COMPETENT** | 🟡 **CONDITIONAL GO** | Role-fit with structured onboarding (4 weeks) |
| **50-59** | 🟡 **DEVELOPING** | 🟡 **HOLD** | Requires significant upskilling; mentoring critical |
| **<50** | 🔴 **NOVICE** | 🔴 **NO-GO** | Not ready; consider 6-month bootcamp or different role |

---

## 9. Red Flags & Dealbreakers

### 🔴 **Critical Gaps** (Auto-Reject if <40 in any)

| Competency | Min. Score | Rationale |
|------------|-----------|-----------|
| **Viva Glint** | 40/100 | Cannot configure/use primary platform; dependency risk |
| **Statistical Analysis** | 40/100 | Risk of false conclusions, credibility loss |
| **SQL** | 0/100 | **Dealbreaker** — Cannot extract data autonomously |
| **People Analytics** | 35/100 | Missing domain knowledge; cannot drive strategy |

### 🟡 **High-Priority Onboarding** (If 40-60 in any)

- Viva Glint certification course (Microsoft Learn, 3 weeks)
- Statistics refresher (hypothesis testing, regression, 2 weeks)
- Power BI bootcamp (if <40, 4 weeks)
- People analytics fundamentals workshop (2 weeks)
- SQL essentials for HR analytics (2 weeks)

---

## 10. Interview Assessment Guide

### Technical Skills Interview (90 minutes)

#### Section A: Viva Glint Platform (30 min)
1. **Scenario:** "You're designing a pulse survey for a tech company. Walk me through your survey design: questions, scale, skip logic, frequency."
2. **Practical:** Show screenshot of Viva Glint dashboard. "What insights can you extract? What's missing? How would you improve?"
3. **Data Export:** "Describe steps to export respondent-level data, clean it, and prepare for analysis."

**Scoring:** 0-20 points | Target: 12+ (Intermediate)

---

#### Section B: Statistical Rigor (30 min)
1. **Hypothesis Test:** "We see engagement scores differ: Finance 72, Engineering 68. Is this meaningful? Walk me through the analysis."
2. **Regression:** "Model engagement as function of culture (1-5), leadership (1-5), growth (1-5). Interpret results."
3. **Bias:** "Our pulse survey has 35% response rate, skewed toward managers. What's the impact? How would you address it?"

**Scoring:** 0-20 points | Target: 12+ (Intermediate)

---

#### Section C: People Analytics Acumen (20 min)
1. **Business Impact:** "Engagement score is 68/100. Why should the CEO care? What's the connection to business outcomes?"
2. **Drivers:** "List engagement drivers for tech employees. Explain why each matters. How would you measure impact?"
3. **Strategy:** "Design a listening strategy for a 1,000-person tech company. What cadence? What questions? How do you act on insights?"

**Scoring:** 0-10 points | Target: 7+ (Strong Intermediate)

---

#### Section D: SQL & Data Skills (Optional; 20 min if time)
1. **Query:** "Write a query to extract engagement responses by department; show count, average score, response rate."
2. **Pipeline:** "Describe end-to-end process: Viva Glint → SQL → Power BI. What steps? Where are risks?"

**Scoring:** 0-10 points (bonus) | Target: 6+ (Intermediate)

---

### Total Interview Score: 0-60 points

| Score | Interpretation |
|-------|-----------------|
| 50-60 | ✅ Strong technical fit; hire |
| 40-49 | 🟡 Borderline; depends on culture fit + soft skills |
| <40 | 🔴 Technical gaps too significant |

---

## 11. Onboarding & Ramp-Up Timeline

### Phase 1: Foundational (Weeks 1-2)
- ✅ Viva Glint platform deep-dive (surveys, exports, dashboards)
- ✅ Statistics refresher (hypothesis tests, regression, confidence intervals)
- ✅ People Analytics fundamentals (engagement frameworks, employee lifecycle)

### Phase 2: Hands-On (Weeks 3-4)
- ✅ Create first pulse survey; export data; analyze with mentoring
- ✅ Build engagement dashboard in Power BI with mentor review
- ✅ Attend stakeholder presentations; observe insights handoffs

### Phase 3: Autonomous Work (Weeks 5-8)
- ✅ Lead small listening project (survey design → insights → recommendations)
- ✅ Present findings to internal stakeholders
- ✅ Iterate based on feedback

### Phase 4: Strategic Contribution (Weeks 9-12)
- ✅ Lead small client engagement (analyst role, not lead)
- ✅ Mentor new hire on survey methodology
- ✅ Contribute to org listening strategy

---

## 12. Success Metrics (Post-Hire)

### 30-Day Milestones
- [ ] Viva Glint platform certified (Microsoft Learn badge)
- [ ] First pulse survey designed & deployed
- [ ] Power BI dashboard live for internal use
- [ ] Mentoring relationship established

### 90-Day Goals
- [ ] Led 3 listening projects (survey → insights → action)
- [ ] Presented findings to leadership (C-level, VP)
- [ ] Identified 5 actionable recommendations acted upon
- [ ] Peer feedback: "Adds analytical rigor to discussions"

### 6-Month Evaluation
- [ ] Independently scoping listening initiatives
- [ ] Advising leadership on listening strategy
- [ ] Contributing to org listening roadmap
- [ ] Training new analysts on survey design

---

## Reference: Competency-to-Interview Mapping

| Competency | Interview Question(s) | Weight | Min. Pass |
|------------|----------------------|--------|----------|
| Viva Glint | Q1, Q2, Q3 | 25% | 12/20 |
| Stats | Q4, Q5, Q6 | 20% | 12/20 |
| People Analytics | Q7, Q8, Q9 | 15% | 7/10 |
| Viz / Power BI | (Dashboard Q2) | 15% | Covered in Q2 |
| SQL | Q10 (optional) | 15% | 6/10 |
| Python / R | N/A | 10% | Not tested |

**Total Technical Interview Score Target: 40+/60 (67%)**

---

## Appendix: Sample Assessment Prompts

### Viva Glint Assessment Task
**Scenario:** You have 30 minutes to design a quarterly pulse survey for a 500-person organization (mix of office/remote, levels 1-5). Constraints: 15 questions max, must measure engagement, culture, leadership, growth, and collect demographics.

**Deliverable:** 
- Survey question list with scale (5-point? NPS? etc.)
- Skip logic diagram (who sees which questions?)
- Analysis plan (how will you segment responses?)

**Scoring Rubric:**
- Survey design (5 pts): Question clarity, scale appropriateness, no leading questions
- Skip logic (5 pts): Logical branching, avoids repetition
- Segmentation plan (5 pts): Covers level, function, location
- Actionability (5 pts): Questions lead to recommendations

---

### Statistics Assessment Task
**Scenario:** You analyzed engagement data for 4 departments. Results:
- Sales: 72 (n=80, SD=12)
- Engineering: 68 (n=45, SD=15)
- Marketing: 70 (n=55, SD=11)
- HR: 75 (n=30, SD=10)

**Question 1:** Is the difference between Sales (72) and Engineering (68) statistically significant? Show your work.

**Question 2:** Engineering has lower engagement. What could explain this? List 3 confounders and how you'd investigate.

**Question 3:** You're recommending a $100K intervention targeting low-engagement departments. Build a business case (engagement → retention → cost savings).

**Scoring Rubric:**
- Q1 (5 pts): Correct test selection, p-value calculation, conclusion with caveats
- Q2 (5 pts): Identifies real confounders; proposes testable hypotheses
- Q3 (5 pts): Credible ROI calculation; acknowledges assumptions

---

### People Analytics Assessment Task
**Scenario:** You've completed first listening initiative: engagement = 68/100, down from 72 last year. Culture = 64, Leadership = 71, Growth = 65, Inclusion = 62.

**Deliverable: 1-page exec summary**
- Key findings (what dropped? why?)
- Top 3 recommendations (prioritized by impact)
- Success metrics (how do we measure progress?)

**Scoring Rubric:**
- Findings clarity (3 pts): Identifies root causes, not just symptoms
- Recommendations (4 pts): Specific, actionable, prioritized by impact
- Metrics (3 pts): Ties recommendations to business outcomes

---

**End of Framework**

---

**Document Metadata:**
- **Version:** 1.0
- **Last Updated:** 2026-07-08
- **Owner:** Recruitment Suite / Avanade People Science Practice
- **Audience:** Hiring managers, technical interviewers, candidates
- **Related:** recruitment-suite agents 02, 06 (Technical Skills Evaluator, People Analytics Specialist)
