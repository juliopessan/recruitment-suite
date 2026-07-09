"""Heuristic parser: free-text job description -> JobDescription model."""

import re
import uuid
from src.models import JobDescription

# Curated lexicon of skills recognized in free-text job descriptions
SKILL_LEXICON = [
    # Data / analytics
    "People Analytics", "Viva Glint", "Viva Insights", "Power BI", "Tableau",
    "Statistics", "Statistical Analysis", "Quantitative Analysis", "Survey Methodology",
    "Organizational Psychology", "Change Management", "Executive Communication",
    "Data Science", "Machine Learning", "Data Engineering", "ETL", "SQL",
    # Languages / frameworks
    "Python", "R", "Java", "JavaScript", "TypeScript", "C#", ".NET", "Go", "Rust",
    "React", "Angular", "Vue", "Node.js", "FastAPI", "Django", "Spring",
    # Cloud / infra
    "Azure", "AWS", "GCP", "Kubernetes", "Docker", "Terraform", "Databricks",
    "Snowflake", "Spark", "Kafka", "PostgreSQL", "MongoDB", "Redis",
    # Practice
    "Agile", "Scrum", "DevOps", "CI/CD", "Microservices", "REST", "GraphQL",
    "HR Transformation", "M365", "Microsoft 365", "SAP", "Salesforce",
]

LANGUAGE_WORDS = {
    "english": "English", "inglês": "English", "ingles": "English",
    "portuguese": "Portuguese", "português": "Portuguese", "portugues": "Portuguese",
    "spanish": "Spanish", "espanhol": "Spanish",
    "french": "French", "francês": "French",
    "german": "German", "alemão": "German",
}

YEARS_RE = re.compile(r"(\d{1,2})\s*\+?\s*(?:years?|anos?)", re.IGNORECASE)
SENIORITY_WORDS = [
    ("principal", "Principal"), ("staff", "Principal"), ("lead", "Lead"),
    ("sênior", "Senior"), ("senior", "Senior"), ("pleno", "Mid"),
    ("mid-level", "Mid"), ("júnior", "Junior"), ("junior", "Junior"),
]
PEOPLE_ANALYTICS_HINTS = [
    "people analytics", "viva glint", "employee experience", "employee listening",
    "organizational psychology", "people science", "engagement survey",
]


def parse_job_description(jd_text: str, title: str = "", company: str = "") -> JobDescription:
    """Build a structured JobDescription from free text using heuristics."""
    text_lower = jd_text.lower()

    skills = [
        s for s in SKILL_LEXICON
        if re.search(r"(?<![\w.#+])" + re.escape(s.lower()) + r"(?![\w+])", text_lower)
    ]

    years_matches = [int(y) for y in YEARS_RE.findall(jd_text) if 0 < int(y) <= 30]
    years_required = max(years_matches) if years_matches else 5

    seniority = "Senior"
    for word, level in SENIORITY_WORDS:
        if re.search(r"\b" + re.escape(word) + r"\b", text_lower):
            seniority = level
            break

    languages = sorted({label for word, label in LANGUAGE_WORDS.items() if word in text_lower})

    urgency = "High" if any(w in text_lower for w in ["urgent", "urgente", "asap", "immediate"]) else "Medium"

    if not title:
        # First non-empty line is usually the title
        for line in jd_text.splitlines():
            if line.strip():
                title = line.strip()[:120]
                break
        title = title or "Untitled Position"

    return JobDescription(
        id=f"job_{uuid.uuid4().hex[:12]}",
        title=title,
        company=company or "Not specified",
        description=jd_text[:5000],
        required_skills=skills,
        years_experience_required=years_required,
        seniority_level=seniority,
        required_languages=languages,
        hiring_urgency=urgency,
    )


def is_people_analytics_role(jd_text: str) -> bool:
    """Detect whether the JD is a people-analytics/HR role (activates Agent 06)."""
    text_lower = jd_text.lower()
    return any(hint in text_lower for hint in PEOPLE_ANALYTICS_HINTS)
