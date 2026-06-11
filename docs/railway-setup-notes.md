# Railway Setup Notes

## Detected project structure
- Backend: `backend/`
- Frontend: `frontend/`
- Infra: `infra/`
- Final schema: `final_postgres_schema.sql`
- Existing env examples: `.env.example`, `backend/.env.example`
- Railway config files detected: none

## Detected backend and worker commands
- Backend start command: `/bin/sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"`
- Worker start command: `/bin/sh -c "celery -A app.workers.celery_app worker --loglevel=INFO"`
- Celery app path: `backend/app/workers/celery_app.py`
- Backend Dockerfile also uses the same FastAPI entrypoint

## Railway CLI status
- CLI version detected: `railway 5.6.2`
- CLI auth status: not logged in from this machine
- Exact login command required: `railway login`
- Browserless login option: `railway login --browserless`

## Known Railway services from account access
- Project: `Welfare_Compliance_Checker_RDP`
- PostgreSQL service: `Postgres`
- pgvector service: `pgvector`
- backend-api: created
- worker: created
- Redis: created

## Railway service wiring
- `backend-api` -> references `Postgres.DATABASE_URL` and `Redis.REDIS_URL`
- `worker` -> references `Postgres.DATABASE_URL` and `Redis.REDIS_URL`
- `backend-api` start command -> `/bin/sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"`
- `worker` start command -> `/bin/sh -c "celery -A app.workers.celery_app worker --loglevel=INFO"`
- `backend-api` Dockerfile -> `backend/Dockerfile`
- `worker` Dockerfile -> `backend/Dockerfile`

## Env vars configured locally
- `.env.example`: normalized to placeholder values and expanded for backend/storage/AI settings
- `backend/.env.example`: created with placeholder values for backend runtime
- Railway backend vars present: production flags, retrieval weights, LLM provider/model settings, `PORT`, DB/Redis references
- Railway worker vars present: production flags, OCR settings, retrieval weights, LLM provider/model settings, DB/Redis references

## Missing credentials
- OpenRouter API key
- Object storage provider credentials
- Frontend base URL for production CORS
- Railway CLI login on this machine

## Deployment status
- backend-api deployed: yes
- worker deployed: yes
- backend logs checked: yes
- worker logs checked: yes
- backend status: SUCCESS
- worker status: SUCCESS
- notes: backend build needed a Dockerfile fix, and the start command needed shell wrapping for `$PORT`
