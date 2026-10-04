"""Shared test setup: never let a developer's real keys reach the network."""

import pytest


@pytest.fixture(autouse=True)
def _no_live_typesafe(monkeypatch):
    """Existing tests assert the rule-based scoring; keep TypeSafe off unless a test opts in."""
    monkeypatch.delenv("TYPESAFE_API_KEY", raising=False)
