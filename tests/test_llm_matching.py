"""Tests for LLM-backed semantic skill matching and its fallbacks."""

import pytest
from src.agents.base_agent import BaseAgent, _SEMANTIC_CACHE
from src.models import AgentScore
from src.services import llm_client


class _Agent(BaseAgent):
    """Concrete stand-in: BaseAgent.evaluate is abstract."""

    def evaluate(self, candidate, job) -> AgentScore:  # pragma: no cover
        raise NotImplementedError


@pytest.fixture(autouse=True)
def clear_cache():
    _SEMANTIC_CACHE.clear()
    yield
    _SEMANTIC_CACHE.clear()


@pytest.fixture
def agent():
    return _Agent()


CORPUS = "senior engineer, 8 years on amazon web services and kubernetes clusters"


class TestWithoutKey:
    def test_falls_back_to_literal_matching(self, agent, monkeypatch):
        monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)

        matched, missing = agent._match_skills(["Kubernetes", "AWS"], CORPUS)

        assert matched == ["Kubernetes"]
        assert missing == ["AWS"]  # literal matching cannot bridge the synonym

    def test_never_calls_the_api(self, agent, monkeypatch):
        monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)

        def explode(*args, **kwargs):
            raise AssertionError("LLM must not be called without a key")

        monkeypatch.setattr(llm_client, "complete_json", explode)
        agent._match_skills(["AWS"], CORPUS)


class TestWithKey:
    @pytest.fixture(autouse=True)
    def set_key(self, monkeypatch):
        monkeypatch.setenv("OPENROUTER_API_KEY", "test-key")

    def test_bridges_synonyms(self, agent, monkeypatch):
        monkeypatch.setattr(
            llm_client, "complete_json", lambda *a, **k: {"evidenced": ["AWS"]}
        )

        matched, missing = agent._match_skills(["Kubernetes", "AWS"], CORPUS)

        assert matched == ["Kubernetes", "AWS"]  # original ordering preserved
        assert missing == []

    def test_ignores_skills_the_model_invents(self, agent, monkeypatch):
        """A hallucinated skill must not be able to inflate the score."""
        monkeypatch.setattr(
            llm_client,
            "complete_json",
            lambda *a, **k: {"evidenced": ["AWS", "Terraform", "Go"]},
        )

        matched, missing = agent._match_skills(["Kubernetes", "AWS"], CORPUS)

        assert matched == ["Kubernetes", "AWS"]
        assert "Terraform" not in matched and "Go" not in matched

    def test_degrades_when_the_api_fails(self, agent, monkeypatch):
        def fail(*args, **kwargs):
            raise llm_client.LLMError("upstream 502")

        monkeypatch.setattr(llm_client, "complete_json", fail)

        matched, missing = agent._match_skills(["Kubernetes", "AWS"], CORPUS)

        assert matched == ["Kubernetes"]
        assert missing == ["AWS"]

    def test_malformed_reply_degrades(self, agent, monkeypatch):
        monkeypatch.setattr(
            llm_client, "complete_json", lambda *a, **k: {"wrong_key": "nope"}
        )

        matched, missing = agent._match_skills(["Kubernetes", "AWS"], CORPUS)

        assert matched == ["Kubernetes"]
        assert missing == ["AWS"]

    def test_result_is_cached_across_agents(self, agent, monkeypatch):
        calls = []

        def counted(*args, **kwargs):
            calls.append(1)
            return {"evidenced": ["AWS"]}

        monkeypatch.setattr(llm_client, "complete_json", counted)

        agent._match_skills(["AWS"], CORPUS)
        _Agent()._match_skills(["AWS"], CORPUS)

        assert len(calls) == 1


class TestCompleteJson:
    def test_extracts_json_from_a_fenced_block(self, monkeypatch):
        monkeypatch.setenv("OPENROUTER_API_KEY", "test-key")
        monkeypatch.setattr(
            llm_client,
            "complete",
            lambda *a, **k: 'Here you go:\n```json\n{"evidenced": ["AWS"]}\n```',
        )

        assert llm_client.complete_json("x") == {"evidenced": ["AWS"]}

    def test_extracts_json_surrounded_by_prose(self, monkeypatch):
        monkeypatch.setenv("OPENROUTER_API_KEY", "test-key")
        monkeypatch.setattr(
            llm_client, "complete", lambda *a, **k: 'Sure! {"evidenced": []} Hope that helps.'
        )

        assert llm_client.complete_json("x") == {"evidenced": []}

    def test_raises_when_there_is_no_json(self, monkeypatch):
        monkeypatch.setenv("OPENROUTER_API_KEY", "test-key")
        monkeypatch.setattr(llm_client, "complete", lambda *a, **k: "I cannot help.")

        with pytest.raises(llm_client.LLMError):
            llm_client.complete_json("x")
