from __future__ import annotations

import os
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import get_settings
from app.db.session import get_db


def _use_live_database() -> bool:
    return os.getenv("USE_LIVE_DATABASE_TESTS", "").strip().lower() in {"1", "true", "yes"}


async def _override_get_db() -> AsyncGenerator[AsyncSession | None, None]:
    if not _use_live_database():
        yield None
        return

    settings = get_settings()
    database_url = os.getenv("TEST_DATABASE_URL", settings.database_url)
    engine = create_async_engine(database_url, poolclass=NullPool)
    maker = async_sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    async with maker() as session:
        yield session
    await engine.dispose()


def _setup_dependency_overrides() -> None:
    from app.main import app

    app.dependency_overrides[get_db] = _override_get_db


_setup_dependency_overrides()
