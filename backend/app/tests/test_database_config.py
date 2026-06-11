from __future__ import annotations

from app.core.config import Settings
from app.db.session import _async_connect_args, _sync_connect_args


def test_railway_postgres_urls_are_normalized() -> None:
    settings = Settings(
        database_url="postgres://postgres:secret@containers-us-west-1.railway.app:5432/railway",
        sync_database_url="",
    )

    assert settings.database_url == "postgresql+asyncpg://postgres:secret@containers-us-west-1.railway.app:5432/railway"
    assert settings.sync_database_url == "postgresql://postgres:secret@containers-us-west-1.railway.app:5432/railway?sslmode=require"


def test_railway_postgres_connect_args_enable_ssl() -> None:
    database_url = "postgresql+asyncpg://postgres:secret@containers-us-west-1.railway.app:5432/railway"

    assert _async_connect_args(database_url) == {"ssl": "require"}
    assert _sync_connect_args(database_url) == {"sslmode": "require"}
