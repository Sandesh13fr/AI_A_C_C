from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import get_settings
from app.db.session import get_async_engine, get_db


async def _override_get_db() -> AsyncGenerator[AsyncSession | None, None]:
    settings = get_settings()
    engine = create_async_engine(settings.database_url, poolclass=NullPool)
    maker = async_sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    async with maker() as session:
        yield session
    await engine.dispose()


def _setup_dependency_overrides():
    from app.main import app
    app.dependency_overrides[get_db] = _override_get_db


_setup_dependency_overrides()
