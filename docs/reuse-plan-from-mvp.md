# Reuse Plan From MVP

The reference MVP is available in `reference/` and is treated as read-only. It is useful as an implementation pattern library, not as the final product source of truth. The final source of truth for this app is `final_postgres_schema.sql` plus the decision-support-only product invariant.

## Reusable Backend Modules

- FastAPI app wiring from `reference/backend/app/main.py`: lifespan logging, CORS setup, request ID middleware, compact JSON error responses, and health probes.
- Settings pattern from `reference/backend/app/config.py`: `pydantic-settings`, production guardrails, CORS parsing, LLM/storage/Redis/database configuration.
- Database session pattern from `reference/backend/app/db/session.py`: async SQLAlchemy sessions with `expire_on_commit=False`, plus separate sync database URL support for worker jobs.
- Auth structure from `reference/backend/app/api/routes/auth.py` and `api/deps.py`: login, current-user dependency, JWT-like bearer authentication, role checks, and rate-limit hook points.
- Observability patterns from `reference/backend/app/observability/`: request IDs, structured logging, rate limiting, and safe production errors.
- Celery worker shape from `reference/backend/celery_worker.py` and ingestion tasks: one app-level worker entry point and independently retryable job functions.

## Reusable Frontend Modules

- Next.js App Router structure from `reference/frontend/src/app`, especially authenticated app shell separation and route-level pages.
- Typed API client pattern from `reference/frontend/src/lib/api.ts`: central fetch wrapper, typed responses, auth header handling, and error normalization.
- Search components from `reference/frontend/src/components/search`: query input, filters, result card, score breakdown, and match explanation display.
- Document components from `reference/frontend/src/components/document`: PDF viewer, metadata panel, document detail layout, and loading/empty/error states.
- Chat components from `reference/frontend/src/components/chat`: document-scoped chat panel, citation pills, and streaming response patterns.
- Design system direction: restrained, utilitarian investigation UI with dense information hierarchy and clear review/sign-off states.

## Reusable Database/Migration Patterns

- Alembic setup and migration discipline from `reference/backend/alembic`.
- PostgreSQL-native generated `tsvector` columns and GIN indexes for BM25-style full-text search.
- pgvector `VECTOR(1536)` storage and IVFFlat cosine indexes.
- Trigger-managed `updated_at` timestamps.
- Seed data and smoke-test patterns for dev user, jurisdictions, and controlled vocabularies.

## Reusable Ingestion Logic

- PDF text extraction with OCR fallback.
- Text cleaning, section splitting, classifier/categorizer structure, metadata enrichment, and retrieval summary generation.
- Embedding generation service shape.
- Celery task structure with stage-specific status updates and failure messages.
- Bulk ingest scripts as admin/source ingestion references.

## Reusable Retrieval/Search Logic

- Hybrid retrieval orchestration from `reference/backend/app/retrieval/hybrid.py`.
- Parallel BM25 and vector candidate search.
- Metadata filtering with composable SQL fragments.
- Min-max normalization and weighted score breakdowns.
- Top-result match explanation generation.
- Result cards that expose score components and cite source context.

## Reusable Chat/RAG Logic

- Document-scoped RAG only: no unscoped legal chat.
- Passage splitting and citation marker parsing.
- System prompt guardrails for observational language, citation requirements, and no legal determinations.
- Post-response validation for forbidden verdict language and unresolved citations.
- Streaming response shape, with a non-streaming placeholder available until LLM credentials are configured.

## Reusable Deployment/Config Patterns

- Docker Compose services for Postgres + pgvector, Redis, API, worker, and frontend.
- Railway-ready API and worker process separation.
- Vercel frontend environment split.
- Supabase storage adapter pattern, but not Supabase-only assumptions.
- Health checks for HTTP, database, Redis, and storage configuration.

## Must Not Be Copied Directly

- Old MVP schema and model layer. It lacks organizations, rulebooks, rule versions, analyzer runs, review workflow, sign-offs, exports, eval tables, audit events, and model invocation logs.
- Superadmin/user-only authorization as the final permissions model.
- Admin-ingest-only product assumption.
- Document-level-only embedding assumptions where chunk, rule, clause, or document scopes are now required.
- Supabase-only storage hardcoding.
- Chat route assumptions that cannot scope to analysis runs, rulebooks, or selected retrieval context later.
- Any copy that calls findings violations, legal determinations, enforcement recommendations, or legal advice.

## Adapt Instead Of Copy

- `reference/backend/app/models/*` becomes new models aligned to `final_postgres_schema.sql`.
- `reference/backend/app/retrieval/*` becomes schema-aware retrieval over `documents`, `document_metadata`, `chunks`, `embeddings`, `regulatory_rules`, `regulatory_rule_versions`, and `rule_chunks`.
- `reference/backend/app/chat/rag.py` becomes governance-aware chat utilities with citation validation and legal-conclusion detection.
- `reference/frontend/src/app/(app)/*` becomes the expanded route set: search, documents, uploads, analysis, review, contracts, gap audits, rulebooks, admin, reports, chat, and design.
- `reference/docker-compose.yml` becomes local/dev infra that can use Railway-compatible service boundaries and Postgres + pgvector.

## Final Integration Steps

1. Add an Alembic migration that applies `final_postgres_schema.sql`.
2. Add SQLAlchemy model classes for all required final tables, with complete models for the tables used by current API routes.
3. Restore a working FastAPI app with health, auth, documents, search, chat, uploads, rules, analysis, review, exports, evals, audit, watchlists, contracts, and gap-analysis route skeletons.
4. Restore hybrid retrieval with score breakdowns and schema-aware filters.
5. Restore document-scoped chat guardrails and citation validation.
6. Restore a typed frontend API client and route placeholders that render structured data rather than blank pages.
7. Add governance validators and tests covering forbidden finding types, missing citations, missing jurisdiction, sign-off gates, and chat legal-conclusion language.
8. Update README and operational docs for local development, schema, governance, and Railway deployment.
