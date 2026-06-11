from __future__ import annotations

import importlib.util
from collections.abc import AsyncGenerator
from functools import lru_cache
from typing import Any

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings


def _driver_available(database_url: str) -> bool:
    if "+asyncpg" in database_url:
        return importlib.util.find_spec("asyncpg") is not None
    if database_url.startswith("sqlite+aiosqlite"):
        return importlib.util.find_spec("aiosqlite") is not None
    return True


def _railway_postgres_host(database_url: str) -> str:
    parsed_url = make_url(database_url)
    return (parsed_url.host or "").lower()


def _is_railway_postgres_internal_url(database_url: str) -> bool:
    host = _railway_postgres_host(database_url)
    return host.endswith(".railway.internal")


def _is_railway_postgres_public_url(database_url: str) -> bool:
    host = _railway_postgres_host(database_url)
    return host.endswith(".railway.app") or host.endswith(".rlwy.net")


def _async_connect_args(database_url: str) -> dict[str, Any]:
    if _is_railway_postgres_public_url(database_url):
        return {"ssl": "require"}
    return {}


def _sync_connect_args(database_url: str) -> dict[str, Any]:
    if _is_railway_postgres_public_url(database_url):
        return {"sslmode": "require"}
    return {}


@lru_cache
def get_async_engine() -> AsyncEngine | None:
    settings = get_settings()
    if not _driver_available(settings.database_url):
        return None
    return create_async_engine(
        settings.database_url,
        connect_args=_async_connect_args(settings.database_url),
        pool_pre_ping=False,
        pool_recycle=300,
    )


@lru_cache
def get_sync_engine() -> Engine | None:
    settings = get_settings()
    if settings.sync_database_url.startswith("postgresql") and importlib.util.find_spec("psycopg2") is None:
        return None
    return create_engine(
        settings.sync_database_url,
        connect_args=_sync_connect_args(settings.sync_database_url),
        pool_pre_ping=False,
        pool_recycle=300,
    )


@lru_cache
def get_sessionmaker() -> async_sessionmaker[AsyncSession] | None:
    engine = get_async_engine()
    if engine is None:
        return None
    return async_sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def database_configured() -> bool:
    return get_async_engine() is not None


async def get_db() -> AsyncGenerator[AsyncSession | None, None]:
    maker = get_sessionmaker()
    if maker is None:
        yield None
        return
    async with maker() as session:
        yield session
