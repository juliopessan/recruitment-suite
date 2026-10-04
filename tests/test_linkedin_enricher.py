"""LinkedIn enrichment through Exa: canonical URL, live crawl, same-slug search fallback."""

import pytest

from src.services import linkedin_enricher as le
from src.services.linkedin_enricher import EnrichmentError, canonical_profile_url, enrich_linkedin

PROFILE = (
    "Gabriel Hideki Suguiyama · Data Engineer at Acme · São Paulo, Brasil. "
    "Experiência: 6 anos com Python, SQL e AWS. Formação: Engenharia de Computação. " * 3
)


@pytest.mark.parametrize(
    "url,expected",
    [
        ("https://www.linkedin.com/in/gabrielhidekisuguiyama/?isSelfProfile=false",
         "https://www.linkedin.com/in/gabrielhidekisuguiyama/"),
        ("linkedin.com/in/Maria-Souza-12ab34", "https://www.linkedin.com/in/maria-souza-12ab34/"),
        ("https://br.linkedin.com/in/joao%2Dsilva?trk=public_profile", "https://www.linkedin.com/in/joao-silva/"),
    ],
)
def test_canonical_profile_url(url, expected):
    assert canonical_profile_url(url)[0] == expected


class FakeExa:
    def __init__(self, contents=None, search=None):
        self.calls = []
        self.responses = {"/contents": contents or {"results": []}, "/search": search or {"results": []}}

    def __call__(self, path, api_key, payload, timeout):
        self.calls.append((path, payload))
        return self.responses[path]


@pytest.fixture
def exa(monkeypatch):
    monkeypatch.setenv("EXA_API_KEY", "k")

    def install(**kw):
        fake = FakeExa(**kw)
        monkeypatch.setattr(le, "_post", fake)
        return fake

    return install


def test_contents_uses_canonical_url_and_live_crawl(exa):
    fake = exa(contents={"results": [{"title": "Gabriel", "text": PROFILE}]})
    out = enrich_linkedin("https://www.linkedin.com/in/gabrielhidekisuguiyama/?isSelfProfile=false")
    path, payload = fake.calls[0]
    assert payload["urls"] == ["https://www.linkedin.com/in/gabrielhidekisuguiyama/"]
    assert payload["livecrawl"] == "fallback"
    assert out["via"] == "contents" and "Python" in out["text"]


def test_falls_back_to_search_and_keeps_only_the_same_profile(exa):
    fake = exa(
        contents={"results": []},
        search={"results": [
            {"url": "https://www.linkedin.com/in/gabriel-suguiyama-other/", "text": PROFILE},
            {"url": "https://br.linkedin.com/in/gabrielhidekisuguiyama", "text": PROFILE, "title": "Gabriel"},
        ]},
    )
    out = enrich_linkedin("https://www.linkedin.com/in/gabrielhidekisuguiyama/")
    assert [c[0] for c in fake.calls] == ["/contents", "/search"]
    assert fake.calls[1][1]["category"] == "linkedin profile"
    assert out["via"] == "search" and out["title"] == "Gabriel"


def test_never_returns_a_different_person(exa):
    exa(search={"results": [{"url": "https://www.linkedin.com/in/someone-else/", "text": PROFILE}]})
    with pytest.raises(EnrichmentError, match="could not read"):
        enrich_linkedin("https://www.linkedin.com/in/gabrielhidekisuguiyama/")


def test_login_wall_is_not_a_profile(exa):
    wall = "Sign in to view Gabriel's full profile. Join LinkedIn. " * 5
    exa(contents={"results": [{"text": wall}]})
    with pytest.raises(EnrichmentError):
        enrich_linkedin("https://www.linkedin.com/in/gabrielhidekisuguiyama/")


def test_missing_key(monkeypatch):
    monkeypatch.delenv("EXA_API_KEY", raising=False)
    with pytest.raises(EnrichmentError, match="EXA_API_KEY"):
        enrich_linkedin("https://www.linkedin.com/in/x/")
