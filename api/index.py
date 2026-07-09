"""Vercel serverless entrypoint: exposes the FastAPI app as an ASGI function.

All /api/* and /health requests are rewritten here (see vercel.json).
"""

from src.api import app  # noqa: F401  (Vercel looks for the ASGI `app` symbol)
