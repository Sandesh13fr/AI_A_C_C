from __future__ import annotations

from typing import Any, Callable

from app.core.config import get_settings


try:
    from celery import Celery
except Exception:  # pragma: no cover
    class Celery:  # type: ignore[no-redef]
        def __init__(self, *args: Any, **kwargs: Any) -> None:
            self.conf: dict[str, Any] = {}
            self.tasks: dict[str, Callable[..., Any]] = {}

        def task(self, name: str | None = None, **_: Any) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
            def decorator(fn: Callable[..., Any]) -> Callable[..., Any]:
                self.tasks[name or fn.__name__] = fn
                return fn

            return decorator


settings = get_settings()
celery_app = Celery("aw_compliance", broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.update(task_serializer="json", result_serializer="json", accept_content=["json"])
