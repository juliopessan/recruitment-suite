"""Education / certifications / languages extraction and the OCR fallback."""

import pytest

from src.services import cv_parser, ocr
from src.services.cv_parser import CVParseError, extract_cv_text
from src.services.cv_sections import extract_profile_sections

CV = """JULIO PESSAN
AI Solutions Architect

EDUCATION
Stanford University
Engineering Leadership Programme | 2025
●​ Executive program focused on stakeholder management and
strategic execution under uncertainty.
MBA – Business Strategy
Bachelor’s Degree – Supply Chain Management

CERTIFICATIONS
● Microsoft 365 Copilot Expert – Microsoft (2025)
● Agentic AI – Accenture (2026)

TECHNICAL TOOLKIT
Languages: Python, SQL
"""


def test_reads_education_and_certifications_from_sections():
    got = extract_profile_sections(CV)
    assert got["education"] == [
        "Stanford University",
        "Engineering Leadership Programme | 2025",
        "MBA – Business Strategy",
        "Bachelor’s Degree – Supply Chain Management",
    ]
    assert got["certifications"] == [
        "Microsoft 365 Copilot Expert – Microsoft (2025)",
        "Agentic AI – Accenture (2026)",
    ]


def test_programming_languages_are_not_spoken_languages():
    assert extract_profile_sections(CV)["languages"] == []


@pytest.mark.parametrize(
    "text,expected",
    [
        ("Idiomas\nInglês – fluente\nEspanhol: básico", ["English", "Spanish"]),
        ("Fluent in Portuguese and English.", ["Portuguese", "English"]),
        ("fluente em inglês, espanhol e francês", ["English", "Spanish", "French"]),
    ],
)
def test_spoken_languages(text, expected):
    assert extract_profile_sections(text)["languages"] == expected


def test_degree_fallback_without_a_heading():
    got = extract_profile_sections("Maria\nBacharel em Administração – USP\nGerente de contas")
    assert got["education"] == ["Bacharel em Administração – USP"]


def test_empty_text():
    assert extract_profile_sections("") == {"education": [], "certifications": [], "languages": []}


# --- OCR ------------------------------------------------------------------


def _blank_pdf() -> bytes:
    pymupdf = pytest.importorskip("pymupdf")
    doc = pymupdf.open()
    doc.new_page()
    return doc.tobytes()


def test_image_only_pdf_without_ocr_explains_how_to_enable_it(monkeypatch):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    monkeypatch.delenv("OPENROUTER_VISION_MODEL", raising=False)
    with pytest.raises(CVParseError, match="OCR is not configured"):
        extract_cv_text("scan.pdf", _blank_pdf())


def test_image_only_pdf_is_read_through_ocr(monkeypatch):
    monkeypatch.setenv("OPENROUTER_API_KEY", "k")
    monkeypatch.setenv("OPENROUTER_VISION_MODEL", "vision/model")
    seen = {}

    def fake_complete(prompt, **kw):
        seen.update(kw)
        return "EDUCATION\nMBA – Strategy"

    monkeypatch.setattr(ocr.llm_client, "complete", fake_complete)
    text = extract_cv_text("scan.pdf", _blank_pdf())
    assert "MBA" in text
    assert seen["model"] == "vision/model"
    assert seen["images"][0].startswith("data:image/png;base64,")


def test_image_upload_uses_ocr(monkeypatch):
    monkeypatch.setenv("OPENROUTER_API_KEY", "k")
    monkeypatch.setenv("OPENROUTER_VISION_MODEL", "vision/model")
    monkeypatch.setattr(ocr.llm_client, "complete", lambda *a, **kw: "Maria Souza\nEDUCATION\nBSc")
    assert "Maria" in extract_cv_text("cv.jpg", b"\xff\xd8\xff")


def test_text_pdf_never_calls_ocr(monkeypatch):
    monkeypatch.setattr(ocr, "ocr_pdf", lambda c: pytest.fail("OCR must not run for text PDFs"))
    pymupdf = pytest.importorskip("pymupdf")
    doc = pymupdf.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Maria Souza " * 40)
    assert "Maria" in extract_cv_text("cv.pdf", doc.tobytes())


def test_pdf_keeps_section_structure(monkeypatch):
    """Regression: one-word-per-line extraction turned 'Stanford University' into
    separate education items and left the name undetected."""
    monkeypatch.setattr(ocr, "ocr_pdf", lambda c: pytest.fail("OCR must not run for text PDFs"))
    pymupdf = pytest.importorskip("pymupdf")
    doc = pymupdf.open()
    page = doc.new_page()
    lines = ["JULIO PESSAN", "AI Solutions Architect with ten years of enterprise delivery " * 2,
             "EDUCATION", "Stanford University", "MBA - Business Strategy",
             "CERTIFICATIONS", "Agentic AI - Accenture (2026)"]
    y = 72
    for line in lines:
        page.insert_text((72, y), line, fontsize=9)
        y += 16
    text = extract_cv_text("cv.pdf", doc.tobytes())
    got = extract_profile_sections(text)
    assert got["education"] == ["Stanford University", "MBA - Business Strategy"]
    assert got["certifications"] == ["Agentic AI - Accenture (2026)"]
    assert cv_parser.guess_candidate_fields(text)["name"] == "JULIO PESSAN"


def _linkedin_export_pdf() -> bytes:
    """Mimics LinkedIn's 'Save to PDF': sidebar first, name in the largest font."""
    pymupdf = pytest.importorskip("pymupdf")
    doc = pymupdf.open()
    page = doc.new_page()
    y = 50
    for line in ["Contact", "www.linkedin.com/in/gabrielhidekisuguiyama", "Top Skills", "Python",
                 "Apache Spark", "Languages", "English (Full Professional)", "Portuguese (Native or Bilingual)",
                 "Certifications", "AWS Certified Data Engineer"]:
        page.insert_text((40, y), line, fontsize=9)
        y += 14
    page.insert_text((220, 60), "Gabriel Hideki Suguiyama", fontsize=24)
    y = 90
    for line in ["Data Engineer at Acme", "São Paulo, Brazil", "Summary",
                 "Engenheiro de dados com 6 anos de experiência em pipelines na AWS.",
                 "Experience", "Acme", "Data Engineer", "2021 - Present (4 years)",
                 "Education", "Universidade de São Paulo",
                 "Bacharelado, Engenharia de Computação · (2014 - 2019)"]:
        page.insert_text((220, y), line, fontsize=10)
        y += 16
    return doc.tobytes()


def test_linkedin_pdf_export_is_read_like_a_cv(monkeypatch):
    monkeypatch.setattr(ocr, "ocr_pdf", lambda c: pytest.fail("OCR must not run for text PDFs"))
    text = extract_cv_text("Profile.pdf", _linkedin_export_pdf())
    assert cv_parser.guess_candidate_fields(text)["name"] == "Gabriel Hideki Suguiyama"
    got = extract_profile_sections(text)
    assert got["certifications"] == ["AWS Certified Data Engineer"]  # name/headline not swallowed
    assert got["languages"] == ["English", "Portuguese"]
    assert got["education"][0] == "Universidade de São Paulo"
