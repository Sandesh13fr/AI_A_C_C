# Schema

`final_postgres_schema.sql` is the authoritative schema for the production database. It targets PostgreSQL with `pgcrypto`, `uuid-ossp`, and `pgvector`.

## Migration

The initial Alembic revision lives at `backend/alembic/versions/0001_final_schema.py` and applies `final_postgres_schema.sql` directly. Run:

```powershell
cd backend
alembic upgrade head
```

## Core Areas

- Organizations, users, memberships, API keys, and role-aware access.
- Source registry, source fetch runs, ingest batches, documents, pages, chunks, embeddings, and PII findings.
- Rulebooks, regulatory rules, versioned rule text, applicability, rule chunks, and precedent links.
- Search queries, saved searches, watchlists, and watchlist events.
- Analysis runs, potential-risk flags, citations, annotations, review assignments, review events, sign-offs, and exports.
- Contract clauses, required protections, gap findings, eval datasets/cases/runs, feedback labels, model invocations, audit events, and chat sessions/messages.

Generated `tsvector` columns and pgvector indexes are defined in SQL, not in application code.
