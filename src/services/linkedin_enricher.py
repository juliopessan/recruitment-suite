"""LinkedIn profile enrichment via the Exa API (https://exa.ai)."""

import os
import requests

EXA_API_URL = "https://api.exa.ai/contents"


class EnrichmentError(Exception):
    """Raised when LinkedIn enrichment fails."""


def enrich_linkedin(linkedin_url: str, timeout: int = 30) -> dict:
    """Fetch and summarize a LinkedIn profile through Exa.

    Returns a dict with 'text' (page content) and 'highlights'.
    Requires the EXA_API_KEY environment variable; raises EnrichmentError
    when the key is missing or the request fails so callers can degrade
    gracefully.
    """
    api_key = os.environ.get("EXA_API_KEY")
    if not api_key:
        raise EnrichmentError("EXA_API_KEY is not configured")

    try:
        response = requests.post(
            EXA_API_URL,
            headers={"x-api-key": api_key, "Content-Type": "application/json"},
            json={
                "urls": [linkedin_url],
                "text": True,
                "summary": {
                    "query": (
                        "Professional profile: current role, employer, years of "
                        "experience, key skills, education, certifications, languages"
                    )
                },
            },
            timeout=timeout,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise EnrichmentError(f"Exa request failed: {exc}") from exc

    data = response.json()
    results = data.get("results") or []
    if not results:
        raise EnrichmentError("Exa returned no content for this URL")

    result = results[0]
    return {
        "url": linkedin_url,
        "title": result.get("title"),
        "text": (result.get("text") or "")[:20000],
        "summary": result.get("summary"),
        "source": "exa",
    }
