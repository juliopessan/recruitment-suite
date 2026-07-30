"""LLM completions via the OpenRouter API (https://openrouter.ai).

Server-side only: the key must never reach the browser bundle, so it is read
from the environment and never surfaced through the API layer.
"""

import json
import os
import re
import time
import requests

DEFAULT_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_MODEL = "google/gemma-4-31b-it:free"


class LLMError(Exception):
    """Raised when an LLM completion cannot be produced."""


def is_configured() -> bool:
    """Whether an OpenRouter key is available.

    Callers use this to decide between the LLM path and the deterministic
    fallback without paying for a failed request first.
    """
    return bool(os.environ.get("OPENROUTER_API_KEY"))


def complete(prompt: str, system: str = "", timeout: int = 30, max_tokens: int = 800) -> str:
    """Send a single-turn prompt to OpenRouter and return the reply text.

    Raises LLMError when the key is missing or the request fails, so callers
    can degrade gracefully instead of failing the whole evaluation.
    """
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise LLMError("OPENROUTER_API_KEY is not configured")

    base_url = os.environ.get("OPENROUTER_BASE_URL", DEFAULT_BASE_URL).rstrip("/")
    model = os.environ.get("OPENROUTER_MODEL", DEFAULT_MODEL)

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": 0,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    # ":free" model variants draw on a shared upstream pool and return 429 when
    # it is saturated, so one short retry is worth it before giving up. The
    # budget stays small on purpose: callers run inside a 60s serverless
    # function and have a deterministic fallback to drop back to.
    last_exc = None
    for attempt in range(2):
        try:
            response = requests.post(
                f"{base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=timeout,
            )
            response.raise_for_status()
            break
        except requests.RequestException as exc:
            last_exc = exc
            status = getattr(getattr(exc, "response", None), "status_code", None)
            if status == 429 and attempt == 0:
                time.sleep(1)
                continue
            raise LLMError(f"OpenRouter request failed: {exc}") from exc
    else:  # pragma: no cover - loop always breaks or raises
        raise LLMError(f"OpenRouter request failed: {last_exc}")

    try:
        data = response.json()
    except ValueError as exc:
        raise LLMError("OpenRouter returned a non-JSON response") from exc

    # OpenRouter surfaces upstream provider failures as a 200 with an error body.
    if data.get("error"):
        raise LLMError(f"OpenRouter error: {data['error']}")

    choices = data.get("choices") or []
    if not choices:
        raise LLMError("OpenRouter returned no choices")

    content = (choices[0].get("message") or {}).get("content")
    if not content:
        raise LLMError("OpenRouter returned an empty completion")

    return content.strip()


def complete_json(prompt: str, system: str = "", timeout: int = 30, max_tokens: int = 800):
    """Like complete(), but parse the reply as JSON.

    Small instruct models tend to wrap JSON in prose or a ``` fence, so the
    first balanced JSON value in the reply is extracted rather than requiring
    the whole response to parse.
    """
    raw = complete(prompt, system=system, timeout=timeout, max_tokens=max_tokens)

    fenced = re.search(r"```(?:json)?\s*(.+?)\s*```", raw, re.DOTALL)
    if fenced:
        raw = fenced.group(1).strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    for opener, closer in (("{", "}"), ("[", "]")):
        start = raw.find(opener)
        if start == -1:
            continue
        depth = 0
        for i in range(start, len(raw)):
            if raw[i] == opener:
                depth += 1
            elif raw[i] == closer:
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(raw[start : i + 1])
                    except json.JSONDecodeError:
                        break

    raise LLMError(f"Could not parse JSON from completion: {raw[:200]}")
