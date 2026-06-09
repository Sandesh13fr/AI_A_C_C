# Railway Deployment

## Services

Use separate Railway services for:

- `api`: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- `worker`: `celery -A app.workers.celery_app.celery_app worker --loglevel=INFO`
- `redis`: Railway Redis or compatible managed Redis
- `postgres`: Railway Postgres with pgvector enabled, or an external Postgres service with pgvector

## Required Environment

- `ENVIRONMENT=production`
- `SECRET_KEY`
- `DATABASE_URL`
- `SYNC_DATABASE_URL`
- `REDIS_URL`
- `CORS_ORIGINS`
- storage provider variables
- `OPENROUTER_API_KEY` or compatible provider key when model-backed features are enabled

## Release Steps

1. Provision Postgres with pgvector.
2. Deploy the API service.
3. Run `alembic upgrade head` against the production database.
4. Deploy the worker service.
5. Set frontend `NEXT_PUBLIC_API_BASE_URL` to the Railway API `/api` URL.
6. Verify `/api/health` and `/api/health/db`.

Production boot refuses insecure defaults for `SECRET_KEY`, wildcard CORS, and missing model keys.
