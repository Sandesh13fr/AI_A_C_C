from __future__ import annotations

from functools import lru_cache

from pydantic import model_validator
from sqlalchemy.engine import make_url

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except Exception:  # pragma: no cover - fallback for lean local environments
    from pydantic import BaseModel as BaseSettings

    class SettingsConfigDict(dict):
        pass


def _railway_postgres_host(database_url: str) -> str:
    parsed_url = make_url(database_url)
    return (parsed_url.host or "").lower()


def _is_railway_postgres_internal_url(database_url: str) -> bool:
    host = _railway_postgres_host(database_url)
    return host.endswith(".railway.internal")


def _is_railway_postgres_public_url(database_url: str) -> bool:
    host = _railway_postgres_host(database_url)
    return host.endswith(".railway.app") or host.endswith(".rlwy.net")


def _is_railway_postgres_url(database_url: str) -> bool:
    return _is_railway_postgres_public_url(database_url) or _is_railway_postgres_internal_url(database_url)


def _normalize_async_database_url(database_url: str) -> str:
    parsed_url = make_url(database_url)
    if parsed_url.drivername in {"postgres", "postgresql", "postgresql+psycopg2", "postgresql+psycopg"}:
        parsed_url = parsed_url.set(drivername="postgresql+asyncpg")
    if _is_railway_postgres_url(str(parsed_url)):
        parsed_url = parsed_url.set(query={key: value for key, value in parsed_url.query.items() if key not in {"ssl", "sslmode"}})
    return parsed_url.render_as_string(hide_password=False)


def _normalize_sync_database_url(database_url: str) -> str:
    parsed_url = make_url(database_url)
    if parsed_url.drivername in {"postgres", "postgresql+asyncpg", "postgresql+psycopg2", "postgresql+psycopg"}:
        parsed_url = parsed_url.set(drivername="postgresql")
    if _is_railway_postgres_internal_url(str(parsed_url)):
        parsed_url = parsed_url.set(query={key: value for key, value in parsed_url.query.items() if key not in {"ssl", "sslmode"}})
    elif _is_railway_postgres_public_url(str(parsed_url)) and "ssl" not in parsed_url.query and "sslmode" not in parsed_url.query:
        parsed_url = parsed_url.set(query={**parsed_url.query, "sslmode": "require"})
    return parsed_url.render_as_string(hide_password=False)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    app_name: str = "AI Animal Welfare Compliance Checker"
    environment: str = "development"
    log_level: str = "INFO"
    secret_key: str = "dev-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    cors_origins: str = "http://localhost:3000"
    allow_dev_auth: bool = True

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/aw_compliance"
    sync_database_url: str = ""
    redis_url: str = "redis://localhost:6379/0"

    storage_provider: str = "local"
    storage_bucket: str = "documents"
    storage_base_path: str = "corpus/raw"
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_bucket: str = "documents"

    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    llm_mini_model: str = "openai/gpt-4o-mini"
    llm_chat_model: str = "openai/gpt-4o"
    embedding_model: str = "text-embedding-3-small"

    retrieval_vector_weight: float = 0.6
    retrieval_bm25_weight: float = 0.3
    retrieval_metadata_weight: float = 0.1

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @model_validator(mode="after")
    def normalize_database_urls(self) -> Settings:
        self.database_url = _normalize_async_database_url(self.database_url)
        self.sync_database_url = _normalize_sync_database_url(self.sync_database_url or self.database_url)
        return self

    def validate_for_production(self) -> None:
        if not self.is_production:
            return

        problems: list[str] = []
        if self.secret_key in {"", "dev-change-me", "changeme", "secret"}:
            problems.append("SECRET_KEY must be set to a strong random value")
        if not self.cors_origins_list or "*" in self.cors_origins_list:
            problems.append("CORS_ORIGINS must contain explicit frontend origins")
        if not self.openrouter_api_key:
            problems.append("OPENROUTER_API_KEY must be set")
        if problems:
            raise RuntimeError("Refusing to boot in production: " + "; ".join(problems))


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.validate_for_production()
    return settings
