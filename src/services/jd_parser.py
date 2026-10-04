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
# "3 a 5 anos", "3-5 years", "entre 3 e 5 anos": the lower bound is the requirement.
YEARS_RANGE_RE = re.compile(
    r"(\d{1,2})\s*(?:a|à|-|–|to|e)\s*\d{1,2}\s*(?:years?|anos?)", re.IGNORECASE
)
# "a empresa tem 20 anos de mercado" is not an experience requirement.
YEARS_NOT_EXPERIENCE_RE = re.compile(
    r"\d{1,2}\s*anos?\s+(?:de\s+)?(?:mercado|hist[óo]ria|tradi[cç][aã]o|empresa|funda[cç][aã]o)"
    r"|\d{1,2}\s*years?\s+(?:in business|of history)",
    re.IGNORECASE,
)

# First match wins, so the most senior wording is checked first. Brazilian
# ladder: Júnior < Pleno < Sênior < Especialista; Coordenador / Tech Lead lead.
SENIORITY_WORDS = [
    ("principal", "Principal"), ("staff", "Principal"),
    ("especialista", "Lead"), ("specialist", "Lead"),
    ("tech lead", "Lead"), ("líder técnico", "Lead"), ("lider tecnico", "Lead"),
    ("coordenador", "Lead"), ("coordenadora", "Lead"), ("lead", "Lead"),
    ("sênior", "Senior"), ("senior", "Senior"), ("sr", "Senior"),
    ("pleno", "Mid"), ("mid-level", "Mid"),
    ("júnior", "Junior"), ("junior", "Junior"), ("jr", "Junior"),
]

# Lines / headings that introduce nice-to-have requirements.
NICE_MARKERS = re.compile(
    r"\b(desej[áa]ve(?:l|is)|diferencia(?:l|is)|ser[áa] um diferencial|[ée] um plus|plus|"
    r"nice[- ]to[- ]have|preferred|a plus|bonus points|good to have)\b",
    re.IGNORECASE,
)
# Headings that end a nice-to-have block.
SECTION_HEADING = re.compile(
    r"^\s*(requisitos|requirements|qualifica[cç][õo]es|responsabilidades|responsibilities|atividades|"
    r"benef[íi]cios|benefits|sobre (?:a|n[óo]s)|about|o que oferecemos|what we offer|local|"
    r"informa[cç][õo]es adicionais|etapas)\b.*:?\s*$",
    re.IGNORECASE,
)
URGENCY_WORDS = [
    "urgent", "urgente", "urgência", "urgencia", "asap", "immediate",
    "início imediato", "inicio imediato", "contratação imediata", "contratacao imediata",
]
PEOPLE_ANALYTICS_HINTS = [
    "people analytics", "viva glint", "employee experience", "employee listening",
    "organizational psychology", "people science", "engagement survey",
]


def parse_job_description(jd_text: str, title: str = "", company: str = "") -> JobDescription:
    """Build a structured JobDescription from free text using heuristics."""
    text_lower = jd_text.lower()

    required_text, nice_text = _split_nice_to_have(jd_text)
    nice_lower = nice_text.lower()
    skills = _find_skills(required_text.lower())
    nice_skills = [s for s in _find_skills(nice_lower) if s not in skills]

    years_required = _years_required(jd_text)

    seniority = "Senior"
    for word, level in SENIORITY_WORDS:
        if re.search(r"(?<![\w])" + re.escape(word) + r"(?![\w])\.?", text_lower):
            seniority = level
            break

    # A language only listed as desirable ("Inglês desejável") is not required.
    required_lower = required_text.lower()
    languages = sorted({label for word, label in LANGUAGE_WORDS.items() if word in required_lower})

    urgency = "High" if any(w in text_lower for w in URGENCY_WORDS) else "Medium"

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
        nice_to_have_skills=nice_skills,
        years_experience_required=years_required,
        seniority_level=seniority,
        required_languages=languages,
        hiring_urgency=urgency,
    )


def _find_skills(text_lower: str) -> list:
    return [
        s for s in SKILL_LEXICON
        if re.search(r"(?<![\w.#+])" + re.escape(s.lower()) + r"(?![\w+])", text_lower)
    ]


def _split_nice_to_have(jd_text: str) -> tuple:
    """Split the JD into (required, nice-to-have) text.

    A heading such as "Diferenciais:" / "Desejável:" / "Nice to have" opens a
    block that runs until the next known heading; a single line that says
    "desejável" or "é um diferencial" counts on its own.
    """
    required, nice = [], []
    in_nice_block = False
    for line in jd_text.splitlines():
        stripped = line.strip(" \t-•●*:")
        if not stripped:
            continue
        is_heading = len(stripped) <= 40 and (line.rstrip().endswith(":") or len(stripped.split()) <= 3)
        if is_heading and NICE_MARKERS.search(stripped):
            in_nice_block = True
            continue
        if SECTION_HEADING.match(stripped):
            in_nice_block = False
            required.append(line)
            continue
        if in_nice_block or NICE_MARKERS.search(stripped):
            nice.append(line)
        else:
            required.append(line)
    return "\n".join(required), "\n".join(nice)


def _years_required(jd_text: str) -> int:
    text = YEARS_NOT_EXPERIENCE_RE.sub(" ", jd_text)
    ranges = [int(lo) for lo in YEARS_RANGE_RE.findall(text) if 0 < int(lo) <= 30]
    text = YEARS_RANGE_RE.sub(" ", text)
    singles = [int(y) for y in YEARS_RE.findall(text) if 0 < int(y) <= 30]
    found = ranges + singles
    return max(found) if found else 5


def is_people_analytics_role(jd_text: str) -> bool:
    """Detect whether the JD is a people-analytics/HR role (activates Agent 06)."""
    text_lower = jd_text.lower()
    return any(hint in text_lower for hint in PEOPLE_ANALYTICS_HINTS)
