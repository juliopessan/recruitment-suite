"""LinkedIn profile enrichment via the Exa API (https://exa.ai).

LinkedIn pages are hard to fetch, so this tries, in order:

1. ``/contents`` on the *canonical* profile URL (query string, locale
   subdomain and tracking stripped: ``?isSelfProfile=false`` alone is enough
   to miss Exa's index), live-crawling when nothing is cached;
2. ``/search`` restricted to LinkedIn profiles, using the name in the URL
   slug, accepting a result **only if its slug is the same profile**. Getting
   no profile is better than evaluating the wrong person.

A login wall ("Sign in to view…") is treated as no content.
"""

from __future__ import annotations

import os
import re
from typing import Optional
from urllib.parse import unquote, urlparse

import requests

EXA_BASE_URL = "https://api.exa.ai"
EXA_API_URL = f"{EXA_BASE_URL}/contents"  # kept for callers/tests that patch it
MIN_PROFILE_CHARS = 200

SUMMARY_QUERY = (
    "Professional profile: current role, employer, years of experience, key skills, "
    "education, certifications, languages"
)
_LOGIN_WALL = re.compile(
    r"(sign in to (?:view|see)|join linkedin|entre para ver|cadastre-se agora|authwall)", re.IGNORECASE
)
_SLUG_RE = re.compile(r"/in/([^/?#]+)", re.IGNORECASE)


class EnrichmentError(Exception):
    """Raised when LinkedIn enrichment fails."""


def canonical_profile_url(url: str) -> tuple[str, Optional[str]]:
    """Return (canonical URL, slug). Non-profile URLs come back unchanged."""
    raw = (url or "").strip()
    if raw and not re.match(r"^https?://", raw, re.IGNORECASE):
        raw = "https://" + raw
    parsed = urlparse(raw)
    match = _SLUG_RE.search(parsed.path)
    if "linkedin.com" not in parsed.netloc.lower() or not match:
        return raw, None
    slug = unquote(match.group(1)).strip().lower()
    return f"https://www.linkedin.com/in/{slug}/", slug


def _slug_of(url: str) -> Optional[str]:
    return canonical_profile_url(url)[1]


def _name_from_slug(slug: str) -> str:
    # "gabrielhidekisuguiyama" stays one token; "maria-souza-12ab34" -> "maria souza"
    words = [w for w in re.split(r"[-_]+", slug) if w and not re.search(r"\d", w)]
    return " ".join(words) or slug


def _usable(result: dict) -> bool:
    text = (result.get("text") or "").strip()
    if len(text) < MIN_PROFILE_CHARS:
        return False
    return not (_LOGIN_WALL.search(text[:600]) and len(text) < 1500)


def _post(path: str, api_key: str, payload: dict, timeout: int) -> dict:
    try:
        response = requests.post(
            f"{EXA_BASE_URL}{path}",
            headers={"x-api-key": api_key, "Content-Type": "application/json"},
            json=payload,
            timeout=timeout,
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as exc:
        raise EnrichmentError(f"Exa request failed: {exc}") from exc
    except ValueError as exc:
        raise EnrichmentError("Exa returned a non-JSON response") from exc


def _shape(result: dict, url: str, via: str) -> dict:
    return {
        "url": url,
        "title": result.get("title"),
        "text": (result.get("text") or "")[:20000],
        "summary": result.get("summary"),
        "source": "exa",
        "via": via,
    }


def enrich_linkedin(linkedin_url: str, timeout: int = 30) -> dict:
    """Fetch a LinkedIn profile through Exa.

    Returns a dict with 'text', 'title' and 'summary'. Requires EXA_API_KEY;
    raises EnrichmentError when nothing usable comes back, so callers can
    degrade gracefully.
    """
    api_key = os.environ.get("EXA_API_KEY")
    if not api_key:
        raise EnrichmentError("EXA_API_KEY is not configured")

    url, slug = canonical_profile_url(linkedin_url)

    # 1. Contents of the canonical URL, live-crawled if Exa has no cached copy.
    data = _post(
        "/contents",
        api_key,
        {
            "urls": [url],
            "text": True,
            "summary": {"query": SUMMARY_QUERY},
            "livecrawl": "fallback",
            "livecrawlTimeout": 12000,
        },
        timeout,
    )
    for result in data.get("results") or []:
        if _usable(result):
            return _shape(result, url, "contents")

    # 2. Search LinkedIn profiles by the name in the slug; keep only the same slug.
    if slug:
        data = _post(
            "/search",
            api_key,
            {
                "query": f"{_name_from_slug(slug)} LinkedIn profile",
                "category": "linkedin profile",
                "includeDomains": ["linkedin.com"],
                "numResults": 5,
                "contents": {"text": True, "summary": {"query": SUMMARY_QUERY}},
            },
            timeout,
        )
        for result in data.get("results") or []:
            if _slug_of(result.get("url") or "") == slug and _usable(result):
                return _shape(result, url, "search")

    raise EnrichmentError(
        "Exa could not read this LinkedIn profile (private, or not indexed yet)"
    )
