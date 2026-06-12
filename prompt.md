You are working on the AI Animal Welfare Compliance Checker repo.

Root path:
C:\Users\sande\OneDrive\Documents\Projects_v13\AI_A_C_C

Branch:
main

Current priority:
Make this live data path work end-to-end:

Search → Document → Related Rules

Required demo flow:

1. Login.
2. Search for "veterinary".
3. See real DB-backed document results.
4. Click a document result.
5. Open /documents/[id]?q=veterinary.
6. Show real document details/chunks from backend.
7. Show Related Rules from the real regulatory rule tables.
8. Click a related rule.
9. Open /knowledge-base/[ruleId] with live rule detail.
10. No mock data anywhere.

Do not build the full analyzer yet.
Do not start contract analysis, gap audit, PDF export, eval harness, or full risk report flow.
This task is only to make the current Knowledge Base + Search + Document + Related Rules vertical slice live, stable, and demoable.

Important project context:

* Frontend is Next.js App Router, React 19, TypeScript strict, Tailwind.
* Backend is FastAPI with Railway Postgres + Redis.
* Railway CLI and Railway MCP are installed and available.
* Current backend public URL is:
  https://backend-api-production-4e8d.up.railway.app
* Live backend has already had CORS fixes and /api/health/db was verified.
* Regulatory Knowledge Base tables exist:
  regulatory_rules
  regulatory_rule_versions
  rule_applicability
  rule_chunks
  rule_precedent_links
* Seeded veterinary-care rules exist.
* Known endpoints include:
  GET /api/rules
  GET /api/rules/{id}
  GET /api/rules/search
  GET /api/search?q=
  GET /api/documents
  GET /api/documents/{id}
  GET /api/documents/{id}/related-rules
* Frontend mock data was removed. Keep it removed.
* Static UI constants may stay in frontend/lib/ui-config.ts, but no fake records should be rendered as real data.

Hard rules:

1. Before any substantive edit, append a timestamped entry to agent-logs.md explaining:

   * what you are about to change
   * why
   * expected validation
2. Do not overwrite the redesign work.
3. Do not reintroduce frontend/lib/mock-data.ts.
4. Do not add fake fallback records on the frontend.
5. Backend may return honest empty states only when there is genuinely no DB match.
6. Related rules must be citation-backed and traceable to DB records.
7. Do not use an LLM to decide related rules in this task.
8. Use deterministic DB retrieval first.
9. If pgvector embeddings exist, use them optionally as an additive scoring path, but the feature must work without embeddings.
10. Keep all UI language decision-support-first. Do not label anything as a confirmed violation or legal conclusion.
11. Do not print or commit secrets.
12. Use Railway MCP/CLI for verification and deployment where useful.

Start by inspecting:

* git status
* AGENTS.md
* agent-logs.md
* frontend/lib/api-client.ts
* frontend/app/search/page.tsx
* frontend/app/documents/[id]/*
* frontend/components related to document detail / related rules
* backend/app/api/routes/documents.py
* backend/app/api/routes/search.py or global_search.py
* backend/app/api/routes/regulatory_rules.py
* backend/app/services/knowledge_base.py
* backend/app/schemas/rules.py
* backend/app/tests covering rules/search/documents

Step 1: protect current work

* Check git status.
* If there are uncommitted redesign changes, do not overwrite them.
* Prefer creating a branch:
  git checkout -b search-document-related-rules-live-slice
* If the user has not committed the redesign, leave commit decisions to the user unless a commit is clearly safe.

Step 2: verify live backend before coding
Use curl, Railway CLI, and/or Railway MCP to verify the live services.

Run checks like:
curl https://backend-api-production-4e8d.up.railway.app/api/health/db
curl "https://backend-api-production-4e8d.up.railway.app/api/rules"
curl "https://backend-api-production-4e8d.up.railway.app/api/search?q=veterinary"
curl "https://backend-api-production-4e8d.up.railway.app/api/documents"

Find one real document_id from /api/search or /api/documents.
Then check:
curl "https://backend-api-production-4e8d.up.railway.app/api/documents/<DOCUMENT_ID>"
curl "https://backend-api-production-4e8d.up.railway.app/api/documents/<DOCUMENT_ID>/related-rules?q=veterinary"

Record results in agent-logs.md.
If auth is required, authenticate with the existing dev/test login flow and pass the bearer token.
If live endpoints fail, inspect Railway service logs before changing code.

Step 3: backend related-rules implementation
Make GET /api/documents/{id}/related-rules reliable using real DB data.

The endpoint should accept:

* document id path param
* optional q query param
* optional limit query param, default around 5 or 10

The service should retrieve:

* document record
* document chunks for that document
* document metadata where available: jurisdiction, date, species, category, document_type
* regulatory_rules
* regulatory_rule_versions
* rule_applicability
* rule_chunks
* rule_precedent_links where available

Scoring order:

1. Direct rule_precedent_links for this document or its chunks: highest score.
2. Rule/category match against document metadata or chunk tags.
3. Jurisdiction/date applicability match if metadata exists.
4. Keyword overlap between query/document chunks and rule text/rule_chunks.
5. Optional vector similarity if embeddings are already present and usable.
6. Last-resort broad category fallback only if it is honest and labelled as broad/low-confidence.

Important:

* The endpoint should not return empty if there are obvious textual/category matches in chunks and rule text.
* The endpoint should not invent rules.
* Every returned item must map to an existing rule/version.
* If applicability is unknown, return applicability_status like "needs_review" or "unknown", not "applies".
* If match is broad, say it is broad.

Expected response shape should include enough for the frontend:
{
"items": [
{
"rule_id": "...",
"rule_version_id": "...",
"title": "...",
"citation_label": "...",
"welfare_category": "...",
"jurisdiction_code": "...",
"verification_status": "...",
"score": 0.0,
"relationship_type": "direct_precedent | category_match | text_overlap | semantic_match | broad_match",
"reason": "...",
"matched_document_excerpt": "...",
"matched_rule_excerpt": "...",
"applicability_status": "applies | likely_applies | needs_review | unknown",
"href": "/knowledge-base/<rule_id>"
}
],
"total": 0
}

If the current frontend expects a different shape, either preserve backward compatibility or update frontend/lib/api-client.ts in one clean contract.

Step 4: backend tests
Add/repair smoke tests for the exact vertical slice.

Required backend test:

* Create or use fixture document with chunks containing "veterinary".
* Ensure at least one veterinary-care rule/rule version/rule chunk exists.
* GET /api/search?q=veterinary returns at least one document or grouped document result.
* GET /api/documents/{id} returns document detail.
* GET /api/documents/{id}/related-rules?q=veterinary returns at least one related rule.
* Each related rule includes rule_id, title, citation_label, score/reason, and link target or enough info to build it.

If DB-heavy TestClient async issues exist, use the existing offline-safe test pattern already in the repo instead of breaking the suite.

Step 5: frontend wiring
Make the actual user flow work.

Inspect and update:

* frontend/lib/api-client.ts
* frontend/app/search/page.tsx
* frontend/app/documents/[id]/page.tsx
* frontend/app/documents/[id]/document-detail-client.tsx or equivalent
* any RelatedRules component if it exists

Requirements:

* /search must call the live backend.
* Document search results must link to /documents/[id]?q=<query>.
* /documents/[id] must read searchParams.q.
* Document detail must call getDocument(id).
* Document detail must call getDocumentRelatedRules(id, { q }).
* Overview tab should render Related Rules from the live endpoint.
* Related Rules card must show:

  * rule title
  * citation label
  * welfare category
  * match reason
  * matched document excerpt if available
  * matched rule excerpt if available
  * applicability/verification badge if available
  * link to /knowledge-base/[ruleId]
* Empty related-rules state should be honest:
  "No related rules found from the current knowledge base for this document."
* Error state should be inline, not a crash.
* Loading should use existing skeleton pattern.
* Do not render hard-coded fake rules.

Step 6: live data only
Run a repo-wide check:

* No frontend imports from @/lib/mock-data.
* No arrays like sampleFindings, knowledgeBaseRows, recentDocuments, reviewQueue, watchlists are reintroduced.
* frontend/lib/ui-config.ts may contain labels/icons/status maps only.
* Server page typed EMPTY_* fallbacks may remain only as shape-safe fallbacks, not as fake visible data.

Step 7: Railway verification and deployment
Use Railway MCP and/or Railway CLI.

Before deploy:

* Confirm Railway project/service context.
* Confirm backend-api and worker services exist.
* Confirm variables are present without printing secret values.
* Confirm DATABASE_URL/REDIS_URL references are wired.

Run local validation first:
Backend:
cd backend
pytest app/tests -q
python -m compileall app

Frontend:
cd frontend
npm.cmd run typecheck
npm.cmd run build

If backend changed:

* Run Alembic migration only if a schema migration was actually added.
* Use Railway deployment from source, not cached redeploy, if source changes must be picked up.
* Verify /api/health/db after deploy.
* Verify /api/search?q=veterinary.
* Verify /api/documents/{id}/related-rules?q=veterinary with a real document id.

If frontend changed:

* Build locally first.
* Deploy through the current frontend deployment workflow.
* Verify the browser flow manually.

Step 8: final verification
Append final agent-logs.md entry with:

* files changed
* backend validation output
* frontend validation output
* live Railway endpoints checked
* any remaining gaps
* exact demo path tested

Acceptance criteria:

1. Search "veterinary" returns real backend results.
2. Clicking a document result opens the live document detail route.
3. Document detail fetches real backend document data.
4. Related Rules panel fetches from /api/documents/{id}/related-rules.
5. At least one real related rule appears for a veterinary-related document if matching DB data exists.
6. Related rule cards link to live /knowledge-base/[ruleId].
7. No mock-data file or fake visible records are reintroduced.
8. Backend tests pass.
9. Frontend typecheck passes.
10. Frontend build passes.
11. Railway live backend verifies after deploy.
12. agent-logs.md has start and final entries.

Definition of done:
The app can be demoed as:
Login → Search "veterinary" → open a real document → see related rules from DB → open rule detail.
