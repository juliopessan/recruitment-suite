"""OCR for CVs that are scans or photos (no text layer).

Text PDFs never reach this module: ``cv_parser`` only falls back to OCR when a
PDF yields almost no text, or when the upload is an image. Pages are rendered
with PyMuPDF and transcribed by a vision model through OpenRouter, so there is
no system dependency (tesseract) to ship to the serverless runtime.

Opt-in: it needs ``OPENROUTER_API_KEY`` and ``OPENROUTER_VISION_MODEL`` (any
OpenRouter model that accepts images). Page images leave the server for that
provider, so enable it only if your data-processing basis covers it.
"""

from __future__ import annotations

import base64
import os
from typing import List

from src.services import llm_client

MAX_PAGES = 6
RENDER_DPI = 150
PAGE_TIMEOUT = 40

SYSTEM = (
    "You transcribe CV pages. Output the text exactly as written, in reading order, "
    "keeping section headings (Education, Certifications, Languages, Experience) on their own "
    "lines and one item per line. Do not summarise, translate, correct or add anything."
)
PROMPT = "Transcribe this CV page."

IMAGE_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
}


class OCRUnavailable(Exception):
    """OCR is not configured or cannot run in this environment."""


def is_configured() -> bool:
    return llm_client.is_configured() and bool(os.environ.get("OPENROUTER_VISION_MODEL"))


def _data_url(content: bytes, mime: str) -> str:
    return f"data:{mime};base64,{base64.b64encode(content).decode()}"


def _transcribe(image_url: str) -> str:
    try:
        return llm_client.complete(
            PROMPT,
            system=SYSTEM,
            images=[image_url],
            timeout=PAGE_TIMEOUT,
            max_tokens=2500,
            model=os.environ["OPENROUTER_VISION_MODEL"],
        )
    except llm_client.LLMError as exc:
        raise OCRUnavailable(f"OCR request failed: {exc}") from exc


def _require() -> None:
    if not is_configured():
        raise OCRUnavailable(
            "This file has no readable text layer and OCR is not configured. "
            "Upload a text-based PDF/DOCX, or set OPENROUTER_API_KEY and "
            "OPENROUTER_VISION_MODEL on the server."
        )


def ocr_image(content: bytes, filename: str) -> str:
    _require()
    ext = os.path.splitext(filename.lower())[1]
    return _transcribe(_data_url(content, IMAGE_TYPES.get(ext, "image/png")))


def ocr_pdf(content: bytes) -> str:
    _require()
    try:
        import pymupdf
    except ImportError as exc:
        raise OCRUnavailable("OCR needs the 'pymupdf' package to render PDF pages") from exc

    pages: List[str] = []
    try:
        doc = pymupdf.open(stream=content, filetype="pdf")
        for index, page in enumerate(doc):
            if index >= MAX_PAGES:
                break
            png = page.get_pixmap(dpi=RENDER_DPI).tobytes("png")
            pages.append(_transcribe(_data_url(png, "image/png")))
    except OCRUnavailable:
        raise
    except Exception as exc:
        raise OCRUnavailable(f"Could not render the PDF for OCR: {exc}") from exc
    return "\n\n".join(p for p in pages if p.strip())
