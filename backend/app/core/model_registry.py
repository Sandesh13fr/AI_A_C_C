from __future__ import annotations

DEFAULT_MODEL_CONFIG = {
    "embedding": "text-embedding-3-small",
    "chat": "openai/gpt-4o",
    "analysis": "openai/gpt-4o-mini",
}


def get_default_model(purpose: str) -> str:
    return DEFAULT_MODEL_CONFIG.get(purpose, DEFAULT_MODEL_CONFIG["analysis"])
