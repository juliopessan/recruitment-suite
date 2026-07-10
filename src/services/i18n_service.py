"""i18n configuration for candidate analysis output (EN-US / PT-BR)."""

from pathlib import Path
import i18n

SUPPORTED_LOCALES = ("en-US", "pt-BR")
DEFAULT_LOCALE = "en-US"

_LOCALES_DIR = str(Path(__file__).resolve().parents[2] / "locales")

i18n.load_path.append(_LOCALES_DIR)
i18n.set("filename_format", "{locale}.{format}")
i18n.set("file_format", "yml")
i18n.set("fallback", DEFAULT_LOCALE)
i18n.set("error_on_missing_translation", False)


def normalize_locale(language: str) -> str:
    """Map a requested language to a supported locale, defaulting safely."""
    if not language:
        return DEFAULT_LOCALE
    normalized = language.strip()
    for supported in SUPPORTED_LOCALES:
        if normalized.lower() == supported.lower():
            return supported
    # Accept bare language codes like "pt" or "en"
    prefix = normalized.split("-")[0].lower()
    for supported in SUPPORTED_LOCALES:
        if supported.split("-")[0].lower() == prefix:
            return supported
    return DEFAULT_LOCALE


def t(key: str, language: str = DEFAULT_LOCALE, **kwargs) -> str:
    """Translate `key` into the requested (normalized) locale."""
    return i18n.t(key, locale=normalize_locale(language), **kwargs)


def t_list(key: str, language: str = DEFAULT_LOCALE) -> list:
    """
    Translate a newline-joined translation value into a list of lines.
    python-i18n's formatter chokes on raw YAML list values, so multi-item
    translations (next steps, onboarding plan) are stored as a single
    "\n"-joined string and split back into a list here.
    """
    value = t(key, language)
    if not value or value == key:
        return []
    return value.split("\n")
