from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api.routes import (
    analysis,
    audit,
    auth,
    chat,
    contracts,
    documents,
    evals,
    exports,
    findings,
    gap_analysis,
    global_search,
    organizations,
    regulatory_rules,
    review,
    rulebooks,
    search,
    uploads,
    users,
    watchlists,
    webhooks,
)
from app.core.config import get_settings
from app.core.logging import configure_logging, get_request_id
from app.core.middleware import RequestIDMiddleware
from app.db.session import get_async_engine


settings = get_settings()
configure_logging(settings.log_level, json_logs=settings.is_production)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info("startup environment=%s", settings.environment)
    yield
    logger.info("shutdown")


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
)

app.add_middleware(RequestIDMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)


def _error(status_code: int, code: str, message: str) -> JSONResponse:
    payload = {"error": {"code": code, "message": message}}
    request_id = get_request_id()
    if request_id:
        payload["error"]["request_id"] = request_id
    return JSONResponse(status_code=status_code, content=payload)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return _error(exc.status_code, f"http_{exc.status_code}", str(exc.detail))


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    logger.warning("validation error: %s", exc.errors())
    return _error(422, "validation_error", "Request body or parameters are invalid.")


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    logger.exception("unhandled exception")
    detail = "Internal server error." if settings.is_production else f"{type(exc).__name__}: {exc}"
    return _error(500, "internal_error", detail)


for router in [
    auth.router,
    users.router,
    organizations.router,
    uploads.router,
    documents.router,
    search.router,
    global_search.router,
    chat.router,
    regulatory_rules.router,
    rulebooks.router,
    analysis.router,
    findings.router,
    review.router,
    contracts.router,
    gap_analysis.router,
    exports.router,
    evals.router,
    audit.router,
    watchlists.router,
    webhooks.router,
]:
    app.include_router(router, prefix="/api")


@app.get("/health")
@app.get("/api/health")
async def health() -> dict:
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.environment,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/health/db")
@app.get("/api/health/db")
async def health_db():
    engine = get_async_engine()
    if engine is None:
        return JSONResponse(
            status_code=503,
            content={"status": "unavailable", "detail": "Async database driver is not installed or configured."},
        )
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as exc:
        return JSONResponse(status_code=503, content={"status": "error", "detail": str(exc)})
