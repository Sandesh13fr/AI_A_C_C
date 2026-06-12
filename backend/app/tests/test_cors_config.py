from __future__ import annotations

import os

from app.core.config import Settings


def _build_settings(**overrides: object) -> Settings:
    base: dict[str, object] = {
        "database_url": "postgresql+asyncpg://postgres:postgres@localhost:5432/aw_compliance",
        "sync_database_url": "",
        "cors_origins": "http://localhost:3000",
        "secret_key": "test-secret",
        "openrouter_api_key": "sk-test",
    }
    base.update(overrides)
    return Settings(**base)


def test_cors_origins_list_includes_explicit_value() -> None:
    settings = _build_settings(cors_origins="http://localhost:3000,https://app.example.com")

    origins = settings.cors_origins_list

    assert "http://localhost:3000" in origins
    assert "https://app.example.com" in origins


def test_cors_origins_list_includes_railway_public_domain(monkeypatch: object) -> None:
    monkeypatch.setattr(os, "environ", {**os.environ, "RAILWAY_PUBLIC_DOMAIN": "backend-api-production-4e8d.up.railway.app"})

    settings = _build_settings()

    origins = settings.cors_origins_list

    assert "https://backend-api-production-4e8d.up.railway.app" in origins


def test_cors_origins_list_includes_frontend_base_url(monkeypatch: object) -> None:
    monkeypatch.setattr(
        os,
        "environ",
        {**os.environ, "FRONTEND_BASE_URL": "https://openpaws.example.com/"},
    )

    settings = _build_settings()

    origins = settings.cors_origins_list

    assert "https://openpaws.example.com" in origins


def test_cors_origins_list_dedupes_and_sorts() -> None:
    settings = _build_settings(cors_origins="https://b.example.com,https://a.example.com,https://a.example.com")

    origins = settings.cors_origins_list

    assert origins == sorted(set(origins))
    assert origins.count("https://a.example.com") == 1


def test_cors_origins_list_skips_blank_entries() -> None:
    settings = _build_settings(cors_origins="http://localhost:3000,, ,https://app.example.com,")

    origins = settings.cors_origins_list

    assert "" not in origins
    assert "http://localhost:3000" in origins
    assert "https://app.example.com" in origins
