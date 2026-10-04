"""Job description parser, with Brazilian job ads first."""

from src.services.jd_parser import parse_job_description

JD_BR = """Engenheiro(a) de Dados Pleno
Somos uma empresa com 20 anos de mercado.

Requisitos:
- 3 a 5 anos de experiência com engenharia de dados
- Python, SQL e AWS
- Inglês avançado

Diferenciais:
- Databricks e Spark
- Espanhol

Benefícios:
- PLR / Bônus
- Vale-refeição
"""


def test_brazilian_ad_seniority_years_and_skills():
    job = parse_job_description(JD_BR)
    assert job.title == "Engenheiro(a) de Dados Pleno"
    assert job.seniority_level == "Mid"
    assert job.years_experience_required == 3  # lower bound; "20 anos de mercado" ignored
    assert job.required_skills == ["SQL", "Python", "AWS"]
    assert job.nice_to_have_skills == ["Databricks", "Spark"]
    assert job.required_languages == ["English"]  # Espanhol is only a diferencial


def test_inline_desejavel_is_nice_to_have():
    job = parse_job_description(
        "Analista de BI Sênior\nExperiência com Power BI e SQL.\nConhecimento em Python é desejável.\nInglês desejável."
    )
    assert job.seniority_level == "Senior"
    assert job.required_skills == ["Power BI", "SQL"]
    assert job.nice_to_have_skills == ["Python"]
    assert job.required_languages == []


def test_brazilian_ladder():
    assert parse_job_description("Desenvolvedor Especialista Java\n8 anos de experiência").seniority_level == "Lead"
    assert parse_job_description("Coordenador de Dados\nGestão de time").seniority_level == "Lead"
    assert parse_job_description("Analista de Dados Jr.\nSQL").seniority_level == "Junior"
    assert parse_job_description("Engenheiro de Software Sr.\nJava").seniority_level == "Senior"


def test_urgency_in_portuguese():
    assert parse_job_description("Analista Pleno\nInício imediato. SQL.").hiring_urgency == "High"
    assert parse_job_description("Analista Pleno\nSQL.").hiring_urgency == "Medium"


def test_english_ad_still_works():
    job = parse_job_description(
        "Senior Data Engineer\n5+ years. Must know Python and AWS.\nNice to have: Kafka.\nEnglish required."
    )
    assert job.seniority_level == "Senior"
    assert job.years_experience_required == 5
    assert job.required_skills == ["Python", "AWS"]
    assert job.nice_to_have_skills == ["Kafka"]
    assert job.required_languages == ["English"]


def test_bonus_in_benefits_does_not_open_a_nice_to_have_block():
    jd = "Analista Pleno\nBenefícios:\n- PLR / Bônus\nRequisitos técnicos\nSQL e Python"
    job = parse_job_description(jd)
    assert job.required_skills == ["SQL", "Python"]
    assert job.nice_to_have_skills == []
