"""Structured fields (education, certifications, spoken languages) from CV text.

``/analyze/run`` used to leave ``education``, ``certifications`` and
``languages`` empty, so reports said "Education: Not specified" and "0
certification(s)" for CVs that listed them. The parser here reads the CV's own
section headings (English and Portuguese) and falls back to degree patterns
and "Fluent in ..." phrases when a heading is missing.

It is deliberately conservative: a spoken language must be a real human
language name, so a toolkit line like "Languages: Python, SQL" never counts.
"""

from __future__ import annotations

import re
from typing import Dict, List

# PDF extraction sprinkles zero-width characters and bullet glyphs into lines.
_ZERO_WIDTH = re.compile("[​‌‍⁠﻿]")
_BULLET = re.compile(r"^\s*(?:[-*•●▪◦·‣–—]|\d+[.)])\s*")

_HEADINGS = {
    "education": (
        "education", "academic background", "academic education", "education & training",
        "formação", "formacao", "formação acadêmica", "formacao academica", "educação", "educacao",
    ),
    "certifications": (
        "certifications", "certification", "certificates", "licenses & certifications",
        "licenses and certifications", "courses & certifications", "training & certifications",
        "certificações", "certificacoes", "certificados", "cursos e certificações",
    ),
    "languages": ("languages", "language skills", "idiomas", "línguas", "linguas"),
}

# Any heading that ends the section being read.
_OTHER_HEADINGS = {
    "summary", "professional summary", "profile", "about", "experience", "professional experience",
    "work experience", "employment", "skills", "technical skills", "core capabilities",
    "technical toolkit", "projects", "selected enterprise impact", "professional focus",
    "publications", "awards", "interests", "references", "contact", "top skills", "honors-awards", "honors & awards", "patents", "volunteer experience", "recommendations", "contato", "principais competências", "competências principais", "resumo", "experiência", "experiencia",
    "experiência profissional", "habilidades", "competências", "competencias", "projetos",
}

HUMAN_LANGUAGES = {
    "english": "English", "inglês": "English", "ingles": "English",
    "portuguese": "Portuguese", "português": "Portuguese", "portugues": "Portuguese",
    "spanish": "Spanish", "espanhol": "Spanish", "español": "Spanish",
    "french": "French", "francês": "French", "frances": "French",
    "german": "German", "alemão": "German", "alemao": "German",
    "italian": "Italian", "italiano": "Italian",
    "mandarin": "Mandarin", "chinese": "Chinese", "japanese": "Japanese", "korean": "Korean",
    "arabic": "Arabic", "russian": "Russian", "dutch": "Dutch", "hindi": "Hindi",
}
_LANG_ALT = "|".join(sorted(map(re.escape, HUMAN_LANGUAGES), key=len, reverse=True))
_LEVEL = r"(?:native|fluent|bilingual|advanced|intermediate|basic|proficient|professional|fluente|nativo|avançado|avancado|intermediário|intermediario|básico|basico|c[12]|b[12]|a[12])"

_DEGREE = re.compile(
    r"\b(bachelor|b\.?sc\.?|b\.?a\.?|master|m\.?sc\.?|mba|ph\.?d|doctorate|diploma|"
    r"associate degree|graduação|graduacao|bacharel\w*|licenciatura|pós[- ]?graduação|"
    r"pos[- ]?graduacao|mestrado|doutorado|especialização|especializacao|tecnólogo|tecnologo)\b",
    re.IGNORECASE,
)

MAX_ITEMS = 10
MAX_ITEM_CHARS = 140


def _clean(line: str) -> str:
    line = _ZERO_WIDTH.sub("", line).replace("\xa0", " ")
    return re.sub(r"\s+", " ", line).strip()


def _heading_key(line: str) -> str | None:
    """Return the section key if ``line`` is a heading (optionally with a colon)."""
    bare = _BULLET.sub("", line).rstrip(":").strip().lower()
    if not bare or len(bare) > 40:
        return None
    for key, names in _HEADINGS.items():
        if bare in names:
            return key
    return "other" if bare in _OTHER_HEADINGS else None


def _split_sections(text: str) -> Dict[str, List[str]]:
    sections: Dict[str, List[str]] = {"education": [], "certifications": [], "languages": []}
    current = None
    first_line = next((_clean(l) for l in text.splitlines() if _clean(l)), "")
    seen_first = False
    for raw in text.splitlines():
        line = _clean(raw)
        if not line:
            continue
        # The name line (moved to the top for PDFs) closes any open section when it
        # reappears, e.g. after the LinkedIn export's sidebar.
        if line == first_line:
            if seen_first:
                current = None
                continue
            seen_first = True
        key = _heading_key(line)
        if key:
            current = key if key in sections else None
            continue
        # "Languages: English, Portuguese" on one line
        inline = re.match(r"^(languages?|idiomas)\s*:\s*(.+)$", line, re.IGNORECASE)
        if inline:
            sections["languages"].append(inline.group(2))
            continue
        # All-caps lines are headings we do not know: they end the current section.
        if current and line.isupper() and len(line.split()) <= 5:
            current = None
            continue
        if current:
            sections[current].append(line)
    return sections


def _items(lines: List[str], *, skip_descriptions: bool) -> List[str]:
    out: List[str] = []
    skipping = False  # inside a bullet description that wrapped onto more lines
    for line in lines:
        is_bullet = bool(_BULLET.match(line))
        item = _BULLET.sub("", line).strip()
        if not item:
            continue
        # A lowercase start means the previous line wrapped.
        if not is_bullet and item[0].islower():
            if out and not skipping:
                out[-1] = (out[-1] + " " + item)[:MAX_ITEM_CHARS]
            continue
        # Education bullets under an entry describe it rather than name a degree.
        skipping = skip_descriptions and is_bullet and not _DEGREE.search(item)
        if skipping:
            continue
        item = item[:MAX_ITEM_CHARS]
        if item not in out:
            out.append(item)
        if len(out) >= MAX_ITEMS:
            break
    return out


def _spoken_languages(lines: List[str], text: str) -> List[str]:
    found: List[str] = []

    def add(name: str) -> None:
        canonical = HUMAN_LANGUAGES.get(name.lower())
        if canonical and canonical not in found:
            found.append(canonical)

    for line in lines:
        for m in re.finditer(rf"\b({_LANG_ALT})\b", line, re.IGNORECASE):
            add(m.group(1))

    patterns = (
        rf"\b({_LANG_ALT})\b\s*[(:\-–]\s*{_LEVEL}",
        rf"\b{_LEVEL}\b\s*(?:in|em|:)?\s*({_LANG_ALT})\b",
    )
    for pattern in patterns:
        for m in re.finditer(pattern, text, re.IGNORECASE):
            add(m.group(1))
    # "Fluent in Portuguese and English", "fluente em inglês, espanhol e francês"
    listed = rf"(?:fluent|fluente|proficient|native|nativo|bilingual)\s+(?:in|em)\s+((?:{_LANG_ALT})(?:\s*(?:,|and|e|&)\s*(?:{_LANG_ALT}))*)"
    for m in re.finditer(listed, text, re.IGNORECASE):
        for name in re.findall(rf"\b({_LANG_ALT})\b", m.group(1), re.IGNORECASE):
            add(name)
    return found


def _degrees_outside_section(text: str) -> List[str]:
    out: List[str] = []
    for raw in text.splitlines():
        line = _BULLET.sub("", _clean(raw))
        if line and len(line) <= MAX_ITEM_CHARS and _DEGREE.search(line) and line not in out:
            out.append(line)
        if len(out) >= MAX_ITEMS:
            break
    return out


def extract_profile_sections(text: str) -> Dict[str, List[str]]:
    """Return ``{"education": [...], "certifications": [...], "languages": [...]}``."""
    text = text or ""
    sections = _split_sections(text)

    education = _items(sections["education"], skip_descriptions=True)
    if not education:
        education = _degrees_outside_section(text)

    return {
        "education": education,
        "certifications": _items(sections["certifications"], skip_descriptions=False),
        "languages": _spoken_languages(sections["languages"], text),
    }
