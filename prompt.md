You are a senior full-stack engineer working on the “AI Animal Welfare Compliance Checker” platform.

We already have a working n8n ingestion pipeline that populates PostgreSQL with regulatory source data. The current database already contains:

* `raw_source_records`
* `regulatory_documents`
* `document_chunks`
* `document_topics`
* `welfare_topics`

The n8n side is responsible only for scheduled ingestion, normalization, chunking, and tagging. Do not build user-facing search through n8n. User-facing search must be handled by the backend API directly querying PostgreSQL / pgvector.

Your task is to complete the Day 7 vertical slice:

“Knowledge Base skeleton + first vertical slice”

Build the backend, database, frontend, and tests needed for a minimal Regulatory Knowledge Base experience.

Core goals:

1. Create or verify the Regulatory Knowledge Base schema.
2. Seed a small test rule set for one category, preferably veterinary care.
3. Add backend routes to list, search, and fetch rule details.
4. Add frontend Knowledge Base UI.
5. Add basic hybrid search over documents/chunks and prepare rule-aware search hooks.
6. Add smoke tests for health, DB, search, documents, and rules.

Important product constraints:

* The system is a decision-support tool, not a final legal authority.
* Do not present AI outputs or seeded rules as confirmed legal violations.
* All rule outputs should include jurisdiction, citation, source URL where available, applicability, version, and verification status.
* Seed rules may be marked `draft` or `needs_review`.
* Search results should be citation-aware and should expose document/rule provenance.

Existing working data layer:

* `regulatory_documents` contains normalized source documents.
* `document_chunks` contains searchable text chunks.
* `document_topics` contains keyword-derived welfare topics.
* `welfare_topics` contains topic metadata.

Do not remove or break these tables.

Required new tables:

Create a migration for the following tables if they do not already exist.

Table: `regulatory_rules`

Suggested fields:

* `id uuid primary key default gen_random_uuid()`
* `rule_code text unique not null`
* `title text not null`
* `jurisdiction_code text not null`
* `agency_name text`
* `source_code text`
* `citation text`
* `welfare_category text`
* `summary text`
* `verification_status text not null default 'draft'`
* `is_active boolean not null default true`
* `created_at timestamptz not null default now()`
* `updated_at timestamptz not null default now()`

Table: `regulatory_rule_versions`

Suggested fields:

* `id uuid primary key default gen_random_uuid()`
* `rule_id uuid not null references regulatory_rules(id) on delete cascade`
* `version_label text`
* `effective_start_date date`
* `effective_end_date date`
* `source_document_id uuid references regulatory_documents(id)`
* `source_url text`
* `rule_text text not null`
* `interpretation_notes text`
* `metadata jsonb not null default '{}'::jsonb`
* `created_at timestamptz not null default now()`

Table: `rule_applicability`

Suggested fields:

* `id uuid primary key default gen_random_uuid()`
* `rule_id uuid not null references regulatory_rules(id) on delete cascade`
* `species text`
* `facility_type text`
* `activity_type text`
* `jurisdiction_code text`
* `applicability_notes text`
* `created_at timestamptz not null default now()`

Table: `rule_chunks`

Suggested fields:

* `id uuid primary key default gen_random_uuid()`
* `rule_version_id uuid not null references regulatory_rule_versions(id) on delete cascade`
* `rule_id uuid not null references regulatory_rules(id) on delete cascade`
* `chunk_index integer not null`
* `chunk_text text not null`
* `token_estimate integer`
* `metadata jsonb not null default '{}'::jsonb`
* `created_at timestamptz not null default now()`
* unique constraint on `(rule_version_id, chunk_index)`

Table: `rule_precedent_links`

Suggested fields:

* `id uuid primary key default gen_random_uuid()`
* `rule_id uuid not null references regulatory_rules(id) on delete cascade`
* `document_id uuid references regulatory_documents(id) on delete set null`
* `document_chunk_id uuid references document_chunks(id) on delete set null`
* `relationship_type text not null default 'related_source'`
* `note text`
* `confidence numeric(5,4) not null default 0.75`
* `created_at timestamptz not null default now()`

Add useful indexes:

* `regulatory_rules(rule_code)`
* `regulatory_rules(jurisdiction_code)`
* `regulatory_rules(welfare_category)`
* `regulatory_rules(verification_status)`
* full-text or trigram index on `regulatory_rules.title`
* full-text index on `regulatory_rule_versions.rule_text`
* `rule_chunks(rule_id)`
* full-text index on `rule_chunks.chunk_text`

Seed data:

Seed 3–5 draft test rules for the veterinary care category.

Use safe placeholder-style records. Do not claim they are legally verified. Example categories:

* adequate veterinary care
* program of veterinary care
* daily observation / health monitoring
* treatment of illness or injury
* access to veterinary records or responsible personnel

Use:

* `jurisdiction_code = 'US-FED'`
* `welfare_category = 'veterinary_care'`
* `verification_status = 'needs_review'`
* `source_code = 'ecfr'` or `source_code = 'manual_seed'`
* `citation` values may be placeholder-like but should be clearly marked as needing verification if exact citation text is not confirmed.

Create matching records in:

* `regulatory_rules`
* `regulatory_rule_versions`
* `rule_applicability`
* `rule_chunks`

Also create some `rule_precedent_links` by linking seeded rules to relevant `document_chunks` where possible. Use simple keyword matching against chunks containing veterinary-care terms.

Backend requirements:

Add a Knowledge Base service/repository layer.

Implement these endpoints:

1. `GET /api/rules`

Query params:

* `q`
* `jurisdiction`
* `category`
* `verification_status`
* `limit`
* `offset`

Response should include:

* rule id
* rule_code
* title
* citation
* jurisdiction_code
* welfare_category
* verification_status
* summary
* latest version preview
* counts for chunks / precedent links where easy

2. `GET /api/rules/:id`

Return:

* rule details
* latest version
* applicability rows
* rule chunks
* precedent links
* related source document info if linked

3. `GET /api/rules/search?q=...`

Use simple text search for now:

* search `regulatory_rules.title`
* search `regulatory_rules.summary`
* search `regulatory_rule_versions.rule_text`
* search `rule_chunks.chunk_text`

Return ranked results with snippets if possible.

4. `GET /api/documents`

Return documents from `regulatory_documents`.

Support params:

* `q`
* `source_code`
* `document_type`
* `topic`
* `limit`
* `offset`

5. `GET /api/documents/:id`

Return document details plus:

* chunks
* topics
* related rule links if any

6. `GET /api/search?q=...`

Implement basic hybrid search.

For now, combine:

* document title / abstract matches
* document chunk text matches
* topic matches
* rule title / rule text matches

Return grouped results:

```json
{
  "query": "...",
  "documents": [],
  "chunks": [],
  "rules": []
}
```

Do not require embeddings yet. Prepare the code structure so vector search can be added later.

Frontend requirements:

Add a “Knowledge Base” section or tab.

Minimum UI:

1. Knowledge Base list page

Show:

* search box
* category filter
* jurisdiction filter
* verification status filter
* rule cards/table

Each rule card should show:

* title
* citation
* jurisdiction
* welfare category
* verification status badge
* short summary

2. Rule detail view

Show:

* rule title
* citation
* jurisdiction
* agency/source
* verification status
* latest rule text
* applicability
* rule chunks
* related source document chunks / precedent links

3. Document detail integration

If there is an existing document detail page, add a “Related Rules” section using `rule_precedent_links`.

4. Search page integration

Global search should show:

* document results
* chunk results
* rule results

Testing requirements:

Add smoke tests for:

* health endpoint
* DB connection
* documents list endpoint
* document detail endpoint if test data exists
* rules list endpoint
* rule detail endpoint if seed data exists
* search endpoint

Tests do not need to be exhaustive. They should prove the vertical slice is wired.

Railway/deployment requirements:

Ensure backend reads DB connection from environment variables.

Do not hardcode production database credentials.

Confirm these environment variables are documented or used depending on the current project setup:

* `DATABASE_URL`
* `REDIS_URL`
* backend port variable if needed
* any frontend API base URL variable

Worker guidance:

Do not build complex worker tasks for this Day 7 slice unless the project already has a worker scaffold.

For now:

* Search should run synchronously in backend API.
* Workers are for later long-running tasks such as embeddings, uploaded document processing, OCR, extraction, and analyzer jobs.

Acceptance criteria:

The vertical slice is complete when:

1. Migrations run successfully.
2. Seed rules exist in the database.
3. `/api/rules` returns seeded rules.
4. `/api/rules/:id` returns rule details, version, applicability, chunks, and related document links.
5. `/api/search?q=veterinary` returns at least one document/chunk/rule result.
6. Frontend has a visible Knowledge Base section.
7. Rule detail page or panel shows citation, jurisdiction, verification status, and rule text.
8. Smoke tests pass.
9. Railway deployment starts successfully and can hit health/search/rules endpoints.

Implementation style:

* Keep changes incremental.
* Prefer service/repository functions over raw SQL scattered inside route handlers.
* Add clear types/interfaces.
* Use pagination.
* Avoid overengineering ranking.
* Mark seeded rule data as `needs_review`.
* Keep the system citation/provenance-first.

Do this in order:

1. IDE: Execute the prompt above.
2. IDE: create migrations + seed script.
3. IDE: implement backend routes.
4. IDE: implement frontend Knowledge Base tab.
5. IDE: add smoke tests.
6. Railway: deploy and run migrations.
7. n8n: enable daily orchestrator after backend DB shape is stable.