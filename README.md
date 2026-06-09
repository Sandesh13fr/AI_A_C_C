# AI Animal Welfare Compliance Checker

Regulatory-grounded compliance intelligence platform for animal welfare review workflows. The app surfaces evidence-backed potential risks, possible gaps, weak commitments, ambiguous language, and items needing human review. It must not present legal determinations, confirmed violations, enforcement recommendations, or legal advice.

## What Was Reused From The MVP

- FastAPI app structure, CORS, request IDs, JSON error shape, health probes, and settings pattern.
- Async SQLAlchemy session pattern and Alembic migration workflow.
- Hybrid search contract: metadata filters, full-text retrieval, weighted score breakdowns, and match explanations.
- Document detail and document-scoped chat patterns with citation validation and no legal conclusions.
- Ingestion worker shape for extraction, OCR fallback, cleaning, classification, chunking, embeddings, and status updates.
- Next.js App Router shell, typed API client, search/results layout, document pages, chat route, and review-oriented UI primitives.

See [docs/reuse-plan-from-mvp.md](docs/reuse-plan-from-mvp.md) for the reuse map.

## Current Implementation

- Backend: FastAPI skeleton with `/api/auth`, `/api/users`, `/api/organizations`, `/api/uploads`, `/api/documents`, `/api/search`, `/api/chat`, `/api/rules`, `/api/rulebooks`, `/api/analysis-runs`, `/api/findings`, `/api/review`, `/api/contracts`, `/api/gap-analysis`, `/api/exports`, `/api/evals`, `/api/audit`, `/api/watchlists`, and `/api/health`.
- Database: `final_postgres_schema.sql` is the source of truth. Alembic migration `0001_final_schema` applies that SQL.
- Frontend: Next.js shell with `/login`, `/search`, `/documents`, `/documents/[id]`, `/uploads`, `/analysis`, `/analysis/[id]`, `/review`, `/contracts`, `/gap-audits`, `/rulebooks`, `/admin`, `/reports`, `/chat`, and `/design`.
- Governance: backend validators block forbidden finding types, missing rule citations, missing analysis jurisdiction, external exports without sign-off, and chat legal-conclusion language.

## Local Development

```powershell
docker compose up -d postgres redis
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

```powershell
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:8000/api/health`

Seeded development login fallback: `test@example.com` / `test1234`.

## Worker

```powershell
cd backend
celery -A app.workers.celery_app.celery_app worker --loglevel=INFO
```

## Checks

```powershell
$env:PYTHONPATH='backend'; pytest -q backend\app\tests
cd frontend; npm.cmd run typecheck; npm.cmd run build
```

## Environment

Copy `.env.example`, `backend/.env.example`, and `frontend/.env.example` or `frontend/.env.local.example` as needed. Required production values include `SECRET_KEY`, `DATABASE_URL`, `REDIS_URL`, explicit `CORS_ORIGINS`, storage configuration, and OpenRouter/OpenAI-compatible keys if model-backed features are enabled. `SYNC_DATABASE_URL` is optional unless you want Alembic to use a separate connection string.

For Railway Postgres, paste the Railway connection string into `DATABASE_URL`. The backend will normalize it for async access and derive a sync URL for migrations when `SYNC_DATABASE_URL` is omitted.

## Product Guardrails

All analyzer, chat, export, and frontend copy must preserve decision-support framing. External-use exports require human sign-off. Findings are limited to: `potential_risk`, `possible_gap`, `weak_commitment`, `ambiguous_language`, and `needs_human_review`.
