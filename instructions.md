> **IMPORTANT:** Whenever working on any frontend, UI, or UX task — including components, pages, dashboards, modals, tables, forms, badges, drawers, buttons, copy, colour, typography, spacing, or any visual element — you **MUST** first read `.agents/skills/openpaws-design/skill.md` and follow its design tokens, component checklists, tone rules, and accessibility requirements. This applies to every single line of UI code or copy generated for this project.

### 3.1 Mission

Build the **production-grade AI Animal Welfare Compliance Checker** on top of the existing Option B intelligence-search foundation. Preserve the current search and grounded-chat behavior, but extend the platform into a governed, multi-tenant, rule-grounded document analysis product.

**Core invariant:** the system may produce only **potential risk** findings, **possible gap** findings, or **research observations**. It must never produce a confirmed violation, legal advice, enforcement recommendation, or exhaustive compliance conclusion.

### 3.2 Architecture overview

```text
Frontend: Next.js application
  ├─ Search and document intelligence
  ├─ Upload and batch dashboard
  ├─ Analysis results / annotation viewer
  ├─ Review queue and sign-off
  ├─ Contract analyzer
  ├─ Gap audit
  ├─ Rulebook authoring
  ├─ Admin/security settings
  └─ Reports and exports

Backend: FastAPI application
  ├─ Auth / org / RBAC / ABAC
  ├─ Upload API
  ├─ Ingestion pipeline orchestration
  ├─ Search API
  ├─ Document API
  ├─ Regulatory Knowledge Base API
  ├─ Analyzer API
  ├─ Contract API
  ├─ Gap analysis API
  ├─ Review workflow API
  ├─ Eval/calibration API
  ├─ Export API
  ├─ Audit API
  └─ Partner API / webhooks

Workers: Celery or equivalent background jobs
  ├─ OCR / extraction
  ├─ Cleaning / section mapping
  ├─ Classification
  ├─ Metadata extraction
  ├─ PII detection / redaction
  ├─ Embedding generation
  ├─ Rule retrieval
  ├─ Analyzer runs
  ├─ Contract clause extraction
  ├─ Gap analysis
  ├─ Eval suite execution
  ├─ Export generation
  └─ Watchlist polling

Data stores
  ├─ PostgreSQL 17+ with pgvector
  ├─ Object storage for originals, redacted files, exports
  ├─ Redis for queues/cache/rate limits
  ├─ Optional analytics warehouse for eval telemetry
  └─ Encrypted backups

AI services
  ├─ Embedding provider
  ├─ Low-cost extraction/classification model
  ├─ Higher-accuracy reasoning model
  ├─ Optional self-host/local model adapter
  ├─ Prompt/version registry
  └─ Model output validator
```

The existing repository already uses Next.js/React/Tailwind, FastAPI, Celery/Redis, PostgreSQL + pgvector, Supabase Storage, OpenRouter/OpenAI-compatible models, PyMuPDF/Tesseract, Vercel/Railway/Supabase deployment, and Docker Compose. ([GitHub][1]) Keep these choices unless security, cost, or ALDF deployment constraints require self-hosting.

### 3.3 Proposed repository structure

```text
aw-compliance-intelligence-db/
  backend/
    app/
      api/
        routes/
          auth.py
          organizations.py
          uploads.py
          documents.py
          search.py
          chat.py
          regulatory_rules.py
          rulebooks.py
          analysis.py
          review.py
          contracts.py
          gap_analysis.py
          exports.py
          evals.py
          audit.py
          webhooks.py
      core/
        config.py
        security.py
        permissions.py
        governance.py
        logging.py
        rate_limit.py
        model_registry.py
      db/
        models/
          users.py
          organizations.py
          documents.py
          regulatory_rules.py
          rulebooks.py
          analysis.py
          reviews.py
          evals.py
          audit.py
        migrations/
        session.py
      services/
        ingestion/
          extract_text.py
          ocr.py
          clean_text.py
          section_mapper.py
          classify.py
          metadata_extract.py
          pii_redact.py
        retrieval/
          hybrid_search.py
          rule_retrieval.py
          precedent_retrieval.py
          citation_validator.py
        analyzer/
          risk_detector.py
          decision_tree.py
          severity.py
          confidence.py
          explanation.py
          output_validator.py
        contracts/
          clause_extract.py
          clause_classify.py
          commitment_score.py
          missing_clause.py
        gap/
          required_protection_matrix.py
          gap_detector.py
        rulebooks/
          compiler.py
          validator.py
          tester.py
        evals/
          golden_dataset.py
          metrics.py
          calibration.py
          regression_runner.py
        exports/
          pdf_report.py
          csv_export.py
          annotation_manifest.py
        audit/
          event_writer.py
      workers/
        celery_app.py
        jobs_ingest.py
        jobs_analyze.py
        jobs_eval.py
        jobs_export.py
        jobs_watchlists.py
      tests/
        unit/
        integration/
        eval/
    Dockerfile
    pyproject.toml

  frontend/
    app/
      login/
      search/
      documents/
      uploads/
      analysis/
      review/
      contracts/
      gap-audits/
      rulebooks/
      admin/
      reports/
      design/
    components/
      document-viewer/
      annotation-layer/
      risk-card/
      review-queue/
      rulebook-editor/
      filters/
      charts/
    lib/
      api-client.ts
      auth.ts
      permissions.ts
      governance-copy.ts
      schemas.ts
    tests/
    package.json

  corpus/
    raw/
    processed/
    rule-seeds/
    eval-golden/

  docs/
    architecture.md
    api-reference.md
    data-model.md
    legal-governance.md
    self-hosting.md
    security-hardening.md
    rulebook-authoring.md
    evaluation.md
    client-facing/
      onboarding-guide.md
      user-manual.md
      admin-manual.md
      legal-disclaimer.md
      maintenance-sla.md

  infra/
    docker-compose.yml
    docker-compose.selfhost.yml
    railway/
    vercel/
    supabase/
    terraform/              # [ASSUMED] if IaC is adopted
    helm/                   # [ASSUMED] if Kubernetes is adopted

  .github/
    workflows/
      ci.yml
      security.yml
      eval-regression.yml
      deploy-staging.yml
      deploy-production.yml

  README.md
  LICENSE
  CONTRIBUTING.md
  SECURITY.md
  CHANGELOG.md
```

### 3.4 Core data model extensions

The current schema already includes users, documents, metadata, chunks, and embeddings. ([GitHub][10]) Add the following production tables.

```sql
-- Organizations / tenancy
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tenant_type TEXT NOT NULL CHECK (tenant_type IN ('client_org', 'partner_org', 'internal')),
  default_retention_days INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE organization_memberships (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN (
    'org_admin',
    'compliance_analyst',
    'legal_reviewer',
    'investigator',
    'policy_researcher',
    'standards_author',
    'viewer'
  )),
  attributes JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- Versioned Regulatory Knowledge Base
CREATE TABLE regulatory_rules (
  id UUID PRIMARY KEY,
  canonical_id TEXT NOT NULL,
  jurisdiction_code TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN (
    'federal_cfr',
    'state_code',
    'agency_guidance',
    'advocacy_rulebook'
  )),
  citation_label TEXT NOT NULL,
  title TEXT NOT NULL,
  welfare_category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (canonical_id, jurisdiction_code)
);

CREATE TABLE regulatory_rule_versions (
  id UUID PRIMARY KEY,
  rule_id UUID NOT NULL REFERENCES regulatory_rules(id),
  version_label TEXT NOT NULL,
  effective_start DATE NOT NULL,
  effective_end DATE,
  standard_text TEXT NOT NULL,
  source_url TEXT,
  source_hash TEXT,
  verified_by_user_id UUID REFERENCES users(id),
  verification_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (verification_status IN ('draft', 'verified', 'deprecated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (effective_end IS NULL OR effective_end >= effective_start)
);

CREATE TABLE rule_applicability (
  id UUID PRIMARY KEY,
  rule_version_id UUID NOT NULL REFERENCES regulatory_rule_versions(id),
  species TEXT[],
  facility_types TEXT[],
  industries TEXT[],
  document_types TEXT[],
  conditions JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE rule_precedent_links (
  id UUID PRIMARY KEY,
  rule_version_id UUID NOT NULL REFERENCES regulatory_rule_versions(id),
  document_id UUID NOT NULL REFERENCES documents(id),
  chunk_id UUID REFERENCES chunks(id),
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'cited_in',
    'similar_fact_pattern',
    'enforcement_history',
    'inspection_pattern'
  )),
  notes TEXT
);

-- User-uploaded analysis
CREATE TABLE analysis_runs (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  document_id UUID NOT NULL REFERENCES documents(id),
  initiated_by_user_id UUID NOT NULL REFERENCES users(id),
  analysis_type TEXT NOT NULL CHECK (analysis_type IN (
    'general_compliance',
    'contract',
    'gap',
    'policy_comparison'
  )),
  jurisdiction_code TEXT NOT NULL,
  document_date DATE,
  model_config JSONB NOT NULL,
  prompt_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN (
    'queued',
    'running',
    'needs_review',
    'reviewed',
    'failed',
    'cancelled'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE potential_risk_flags (
  id UUID PRIMARY KEY,
  analysis_run_id UUID NOT NULL REFERENCES analysis_runs(id),
  document_id UUID NOT NULL REFERENCES documents(id),
  finding_type TEXT NOT NULL CHECK (finding_type IN (
    'potential_risk',
    'possible_gap',
    'weak_commitment',
    'ambiguous_language',
    'needs_human_review'
  )),
  welfare_category TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  calibrated_confidence NUMERIC(5,4) NOT NULL CHECK (calibrated_confidence BETWEEN 0 AND 1),
  trigger_kind TEXT NOT NULL CHECK (trigger_kind IN ('passage', 'absence', 'metadata', 'pattern')),
  trigger_text TEXT,
  page_start INTEGER,
  page_end INTEGER,
  char_start INTEGER,
  char_end INTEGER,
  explanation TEXT NOT NULL,
  counterfactual TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review', 'accepted', 'edited', 'dismissed', 'signed_off')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE flag_citations (
  id UUID PRIMARY KEY,
  flag_id UUID NOT NULL REFERENCES potential_risk_flags(id),
  citation_type TEXT NOT NULL CHECK (citation_type IN ('rule', 'precedent', 'source_document')),
  rule_version_id UUID REFERENCES regulatory_rule_versions(id),
  precedent_document_id UUID REFERENCES documents(id),
  source_chunk_id UUID REFERENCES chunks(id),
  quote TEXT,
  citation_label TEXT NOT NULL,
  relevance_note TEXT NOT NULL
);

-- Contract analysis
CREATE TABLE contract_clauses (
  id UUID PRIMARY KEY,
  analysis_run_id UUID NOT NULL REFERENCES analysis_runs(id),
  clause_type TEXT NOT NULL CHECK (clause_type IN (
    'welfare_commitment',
    'audit_right',
    'termination_for_cause',
    'reporting_obligation',
    'inspection_access',
    'remediation',
    'missing_expected_clause'
  )),
  clause_text TEXT,
  page_start INTEGER,
  page_end INTEGER,
  specificity_score NUMERIC(5,4),
  enforceability_score NUMERIC(5,4),
  binding_strength_score NUMERIC(5,4),
  notes TEXT
);

-- Review and sign-off
CREATE TABLE review_events (
  id UUID PRIMARY KEY,
  flag_id UUID REFERENCES potential_risk_flags(id),
  analysis_run_id UUID NOT NULL REFERENCES analysis_runs(id),
  reviewer_user_id UUID NOT NULL REFERENCES users(id),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'accept',
    'dismiss',
    'edit',
    'comment',
    'request_changes',
    'sign_off',
    'reopen'
  )),
  reason_code TEXT,
  comment TEXT,
  before_state JSONB,
  after_state JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Evaluation
CREATE TABLE eval_datasets (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  jurisdiction_code TEXT NOT NULL,
  welfare_category TEXT,
  version_label TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE eval_cases (
  id UUID PRIMARY KEY,
  dataset_id UUID NOT NULL REFERENCES eval_datasets(id),
  document_id UUID NOT NULL REFERENCES documents(id),
  expected_findings JSONB NOT NULL,
  labeled_by_user_id UUID REFERENCES users(id),
  label_quality TEXT CHECK (label_quality IN ('single_label', 'dual_reviewed', 'adjudicated'))
);

CREATE TABLE eval_runs (
  id UUID PRIMARY KEY,
  dataset_id UUID NOT NULL REFERENCES eval_datasets(id),
  model_config JSONB NOT NULL,
  prompt_version TEXT NOT NULL,
  precision NUMERIC(5,4),
  recall NUMERIC(5,4),
  f1 NUMERIC(5,4),
  calibration_error NUMERIC(5,4),
  per_category_metrics JSONB,
  passed_release_gate BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit
CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.5 Governance constants

```python
# backend/app/core/governance.py

FORBIDDEN_FINDING_TERMS = [
    "violation",
    "illegal",
    "guilty",
    "liable",
    "enforcement action recommended",
    "definitive noncompliance",
]

ALLOWED_FINDING_TYPES = [
    "potential_risk",
    "possible_gap",
    "weak_commitment",
    "ambiguous_language",
    "needs_human_review",
]

MANDATORY_ANALYSIS_FIELDS = [
    "trigger_kind",
    "explanation",
    "calibrated_confidence",
    "welfare_category",
    "jurisdiction_code",
    "citations",
]

EXPORT_DISCLAIMER = """
This report is a decision-support output. It surfaces potential animal-welfare
concerns, possible gaps, and research-relevant observations for human review.
It is not legal advice, not a legal determination, not an enforcement
recommendation, and not an exhaustive compliance assessment.
"""
```

Acceptance tests must fail if any analyzer response contains forbidden terms as system-owned conclusions.

### 3.6 API contracts

#### 3.6.1 Upload document

```http
POST /api/uploads
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Request fields:

```json
{
  "organization_id": "uuid",
  "files": ["binary"],
  "declared_document_type": "inspection_report | contract | policy | regulation | unknown",
  "declared_jurisdiction_code": "US-FED | US-CA | US-NY",
  "document_date": "2025-04-12",
  "pii_redaction_mode": "none | detect_only | redact_copy",
  "analysis_requested": true
}
```

Response:

```json
{
  "batch_id": "uuid",
  "documents": [
    {
      "document_id": "uuid",
      "filename": "inspection-report.pdf",
      "status": "queued",
      "status_url": "/api/documents/{document_id}/status"
    }
  ]
}
```

Acceptance criteria:

| Requirement              | Acceptance test                          |
| ------------------------ | ---------------------------------------- |
| Reject unsupported files | Upload `.exe` returns 415                |
| No cross-tenant upload   | User from Org A cannot upload into Org B |
| PII mode recorded        | Document record includes redaction mode  |
| Async status available   | Status endpoint returns ingestion stage  |
| Audit logged             | `audit_events` contains upload event     |

#### 3.6.2 Analyze document

```http
POST /api/documents/{document_id}/analyze
Authorization: Bearer <token>
Content-Type: application/json
```

Request:

```json
{
  "analysis_type": "general_compliance",
  "jurisdiction_code": "US-FED",
  "document_date": "2025-04-12",
  "rule_scope": {
    "legal_minimums": true,
    "advocacy_rulebook_ids": ["uuid"]
  },
  "threshold_profile": "balanced",
  "include_precedent": true
}
```

Response:

```json
{
  "analysis_run_id": "uuid",
  "status": "queued",
  "message": "Analysis queued. Findings will require human review before external use."
}
```

#### 3.6.3 Get analysis results

```http
GET /api/analysis-runs/{analysis_run_id}
Authorization: Bearer <token>
```

Response:

```json
{
  "analysis_run_id": "uuid",
  "status": "needs_review",
  "document": {
    "id": "uuid",
    "name": "inspection-report.pdf",
    "document_type": "inspection_report",
    "jurisdiction_code": "US-FED",
    "document_date": "2025-04-12"
  },
  "summary": {
    "total_potential_risks": 7,
    "high_severity": 2,
    "possible_gaps": 1,
    "requires_human_review": true
  },
  "findings": [
    {
      "id": "uuid",
      "finding_type": "potential_risk",
      "welfare_category": "veterinary_care",
      "severity": "high",
      "calibrated_confidence": 0.82,
      "trigger_kind": "passage",
      "trigger_text": "Relevant excerpt...",
      "page_start": 4,
      "explanation": "This passage may indicate delayed veterinary care because...",
      "counterfactual": "This would likely not have been flagged if the document stated...",
      "citations": [
        {
          "citation_type": "rule",
          "citation_label": "9 CFR ...",
          "rule_version_id": "uuid",
          "relevance_note": "Applicable because..."
        }
      ],
      "status": "pending_review"
    }
  ],
  "disclaimer": "Decision-support output only..."
}
```

Required validator behavior:

```text
Reject response if:
- finding_type is not in allowed enum
- no citation exists for a rule-grounded finding
- jurisdiction_code is missing
- confidence is uncalibrated or outside 0–1
- model output uses forbidden legal-determination language
- no prompt_version/model_config is logged
```

#### 3.6.4 Review flag

```http
POST /api/findings/{flag_id}/review
Authorization: Bearer <token>
Content-Type: application/json
```

Request:

```json
{
  "event_type": "accept | dismiss | edit | comment | request_changes",
  "reason_code": "accurate | false_positive | wrong_jurisdiction | weak_citation | duplicate | other",
  "comment": "Reviewer note",
  "edited_fields": {
    "severity": "medium",
    "explanation": "Revised explanation..."
  }
}
```

Response:

```json
{
  "flag_id": "uuid",
  "status": "accepted",
  "review_event_id": "uuid",
  "audit_event_id": "uuid"
}
```

#### 3.6.5 Sign off analysis run

```http
POST /api/analysis-runs/{analysis_run_id}/sign-off
Authorization: Bearer <token>
Content-Type: application/json
```

Request:

```json
{
  "signoff_scope": "internal_use | external_publication | partner_share",
  "attestation": "I understand this is decision-support output and have reviewed all included findings.",
  "included_flag_ids": ["uuid"]
}
```

Response:

```json
{
  "analysis_run_id": "uuid",
  "status": "reviewed",
  "signed_off_by": "uuid",
  "signed_off_at": "2026-06-02T12:00:00Z"
}
```

#### 3.6.6 Rulebook create/update

```http
POST /api/rulebooks
Authorization: Bearer <token>
Content-Type: application/json
```

Request:

```json
{
  "organization_id": "uuid",
  "name": "OpenPaws Higher Welfare Standard",
  "description": "Custom advocacy standards above legal floor.",
  "visibility": "private_org",
  "rules": [
    {
      "title": "Daily welfare observation required",
      "welfare_category": "veterinary_care",
      "standard_text": "Facilities should document...",
      "applicability": {
        "species": ["dog", "cat"],
        "facility_types": ["shelter", "breeder"],
        "document_types": ["policy", "contract"]
      }
    }
  ]
}
```

Response:

```json
{
  "rulebook_id": "uuid",
  "version_id": "uuid",
  "status": "draft",
  "test_url": "/api/rulebooks/{rulebook_id}/test"
}
```

#### 3.6.7 Contract analysis

```http
POST /api/documents/{document_id}/contract-analysis
Authorization: Bearer <token>
Content-Type: application/json
```

Request:

```json
{
  "contract_type": "vendor | facility_partner | research_partner | other",
  "jurisdiction_code": "US-FED",
  "advocacy_rulebook_ids": ["uuid"],
  "include_missing_clause_detection": true
}
```

Response:

```json
{
  "analysis_run_id": "uuid",
  "clauses": [
    {
      "clause_type": "audit_right",
      "clause_text": "Excerpt...",
      "specificity_score": 0.61,
      "enforceability_score": 0.48,
      "binding_strength_score": 0.44,
      "finding_id": "uuid"
    }
  ],
  "missing_expected_clauses": [
    {
      "clause_type": "termination_for_cause",
      "finding_id": "uuid",
      "explanation": "A contract of this type commonly needs..."
    }
  ]
}
```

#### 3.6.8 Search

Current search should remain compatible with existing functionality. The repository already defines a search flow with filters, score breakdown, match reasons, and top-k behavior. ([GitHub][5]) Extend it as follows:

```http
POST /api/search
Authorization: Bearer <token>
Content-Type: application/json
```

Request:

```json
{
  "query": "delayed veterinary care",
  "top_k": 10,
  "filters": {
    "document_types": ["inspection_report", "enforcement_action"],
    "jurisdictions": ["US-FED"],
    "species": ["dog"],
    "welfare_categories": ["veterinary_care"],
    "date_from": "2020-01-01",
    "date_to": "2026-06-02",
    "rule_ids": ["uuid"],
    "organization_id": "uuid"
  },
  "include_match_reason": true,
  "include_precedent_links": true
}
```

Response:

```json
{
  "results": [
    {
      "document_id": "uuid",
      "title": "APHIS Inspection Report...",
      "score": 0.84,
      "score_breakdown": {
        "vector": 0.72,
        "bm25": 0.64,
        "metadata": 0.90,
        "rule_link": 0.50
      },
      "match_reason": "Relevant because...",
      "citations": []
    }
  ]
}
```

### 3.7 Environment variables

```bash
# Core app
ENVIRONMENT=development|staging|production
APP_BASE_URL=
FRONTEND_BASE_URL=
API_BASE_URL=
LOG_LEVEL=INFO
SECRET_KEY=
CORS_ORIGINS=

# Database
DATABASE_URL=
SYNC_DATABASE_URL=
DB_POOL_SIZE=
DB_POOL_MAX_OVERFLOW=

# Redis / workers
REDIS_URL=
CELERY_BROKER_URL=
CELERY_RESULT_BACKEND=

# Storage
STORAGE_PROVIDER=supabase|s3|local
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=
S3_ENDPOINT_URL=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_BUCKET=
SIGNED_URL_TTL_SECONDS=3600

# AI providers
LLM_PROVIDER=openrouter|openai|azure_openai|local
OPENROUTER_API_KEY=
OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
LOCAL_LLM_BASE_URL=
EMBEDDING_MODEL=text-embedding-3-small
LLM_EXTRACTION_MODEL=
LLM_REASONING_MODEL=
LLM_CHAT_MODEL=
MODEL_TIMEOUT_SECONDS=60
MODEL_MAX_RETRIES=2

# OCR / extraction
OCR_ENGINE=tesseract|none|external
TESSERACT_LANGS=eng
ENABLE_OCR_FALLBACK=true
OCR_MIN_TEXT_CHARS=100

# PII / redaction
ENABLE_PII_DETECTION=true
PII_REDACTION_MODE=detect_only|redact_copy
PII_PROVIDER=local_regex|presidio|external
REDACTED_STORAGE_BUCKET=

# Governance
GOVERNANCE_STRICT_MODE=true
REQUIRE_RULE_CITATION=true
REQUIRE_HUMAN_SIGNOFF_FOR_EXPORT=true
FORBID_LEGAL_VERDICT_LANGUAGE=true

# Evaluation
ENABLE_EVAL_GATES=true
MIN_PRECISION_GENERAL=
MIN_RECALL_GENERAL=
MAX_CALIBRATION_ERROR=
EVAL_DATASET_PATH=

# Security
RATE_LIMIT_LOGIN_PER_MINUTE=10
RATE_LIMIT_API_PER_MINUTE=
API_KEY_HASH_PEPPER=
SESSION_TTL_SECONDS=
MFA_REQUIRED=false
SSO_ENABLED=false
SAML_METADATA_URL=

# Observability
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
PROMETHEUS_ENABLED=true

# Retention / legal hold
DEFAULT_RETENTION_DAYS=
LEGAL_HOLD_ENABLED=true
SECURE_DELETE_ENABLED=true

# Feature flags
FEATURE_UPLOADS=true
FEATURE_ANALYZER=true
FEATURE_CONTRACT_ANALYSIS=false
FEATURE_GAP_ANALYSIS=false
FEATURE_RULEBOOKS=false
FEATURE_WATCHLISTS=false
FEATURE_PARTNER_API=false
```

The existing production deployment already requires variables such as database URLs, Redis URL, CORS origins, OpenRouter API key, Supabase URL/key/bucket, and frontend API URL. ([GitHub][9]) ([GitHub][9])

### 3.8 Module-by-module build instructions and acceptance criteria

| Module                | Build instructions                                                                                                                     | Acceptance criteria                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Organizations/tenancy | Add organizations, memberships, roles, permission checks, and org-scoped queries.                                                      | User cannot read/write another org’s uploads, analysis runs, flags, exports, or rulebooks.                        |
| Regulatory KB         | Add rule, version, applicability, citation, and precedent-link tables. Build admin CRUD and import scripts.                            | Analyzer cannot create rule-based flag unless applicable rule version exists and matches jurisdiction/date/scope. |
| Uploads               | Add user upload UI/API, file validation, object storage, ingestion job status, malware/PII hooks.                                      | Bulk upload supports PDF/DOCX/TXT; status visible per file; failed stages show recoverable errors.                |
| OCR/section mapping   | Improve OCR confidence, page mapping, section references, redacted copy creation.                                                      | Findings can point to page/char offsets or explicitly state page unavailable.                                     |
| Analyzer              | Implement rule-scoped retrieval, phrase detectors, decision-tree checks, severity/confidence, explanation generator, output validator. | Every flag has trigger, cited rule or precedent, confidence, severity, counterfactual, and review state.          |
| Governance validator  | Enforce allowed finding types and forbidden terms before persistence/export.                                                           | Tests fail if system output contains “confirmed violation” or uncited legal standard.                             |
| Review workflow       | Add queue, assignment, accept/dismiss/edit/comment/sign-off events.                                                                    | External export blocked until required review/sign-off exists.                                                    |
| Evaluation harness    | Add golden datasets, metrics, calibration, regression gate in CI.                                                                      | Model/prompt/rule changes fail release gate if metrics degrade beyond configured threshold.                       |
| Contract analyzer     | Extract clauses, classify clause types, score specificity/enforceability/binding force, detect missing expected clauses.               | Contract report separates weak clauses from missing clauses and cites rulebook/legal basis.                       |
| Gap analyzer          | Use document type + jurisdiction + rule matrix to detect absent protections.                                                           | Missing-protection findings use `trigger_kind = absence` and include rationale.                                   |
| Custom rulebooks      | Author, version, test, approve, and deploy rulebooks.                                                                                  | Legal-minimum results and advocacy-standard results are visually and structurally separated.                      |
| Exports               | Generate PDF/CSV with citations, confidence, review status, and disclaimer.                                                            | Export includes immutable disclaimer and cannot include unreviewed findings for external-publication scope.       |
| Audit/logging         | Log uploads, analysis, model calls, retrieval sets, reviews, exports, permission failures.                                             | Admin can reconstruct who saw/changed/exported a finding.                                                         |
| Observability         | Add traces, metrics, dashboards, alerting for worker failures, model cost, queue length, eval regressions.                             | Production dashboard shows ingestion latency, analysis latency, error rates, model spend, and eval status.        |

### 3.9 Implementation sequence mapped to RDP workflow

The RDP workflow requires Discovery, Design, Development, and Review/Polish stages, with daily standups and end-of-day commits/logs.  It also requires architecture, stack, data model, API contracts, user flows, task breakdown, and critical-path decisions before development. 

```text
Sprint 0 — Product/legal decisions
  1. Confirm V1 jurisdiction and corpus scope.
  2. Confirm single-tenant vs multi-tenant deployment.
  3. Confirm allowed data sources and FOIA reuse rules.
  4. Confirm model/provider constraints.
  5. Confirm ALDF acceptance criteria.

Sprint 1 — Data model and permissions
  1. Add organizations/memberships.
  2. Add Regulatory KB tables.
  3. Add analysis/review/eval/audit tables.
  4. Backfill current corpus into org/system tenant.
  5. Write migration tests.

Sprint 2 — Regulatory KB foundation
  1. Build rule import format.
  2. Seed federal AWA / 9 CFR rules for selected categories.
  3. Add rule applicability and versioning.
  4. Add rule search/admin UI.
  5. Add citation validator.

Sprint 3 — Upload and ingestion
  1. Add end-user upload UI/API.
  2. Add org-scoped object storage paths.
  3. Extend ingestion status model.
  4. Add PII detection/redaction.
  5. Add page/section mapping.

Sprint 4 — Analyzer vertical slice
  1. Choose one welfare category, e.g. veterinary care.
  2. Retrieve applicable rules by jurisdiction/date.
  3. Retrieve similar precedent.
  4. Generate one potential-risk flag type.
  5. Show it in analyzer UI with review action.

Sprint 5 — Review and export gate
  1. Build review queue.
  2. Add accept/dismiss/edit/comment.
  3. Add sign-off.
  4. Add PDF/CSV export with disclaimer.
  5. Block external export without sign-off.

Sprint 6 — Evaluation and calibration
  1. Create initial golden dataset.
  2. Add eval runner.
  3. Add precision/recall/calibration metrics.
  4. Add CI regression gate.
  5. Add per-category dashboard.

Sprint 7 — Contract and gap modules
  1. Build clause extraction.
  2. Build commitment scoring.
  3. Build missing-clause detection.
  4. Build gap matrix by document type.
  5. Add contract/gap UI.

Sprint 8 — Enterprise hardening
  1. ABAC rules.
  2. Retention/legal hold.
  3. Secure deletion.
  4. Audit export.
  5. Self-host deployment guide.

Sprint 9 — Extensions
  1. Custom rulebooks.
  2. Watchlists.
  3. Partner API.
  4. Webhooks.
  5. Multi-jurisdiction expansion.
```

The RDP build stage emphasizes a runnable first commit, critical-path build first, vertical slice by Day 7, tests, README accuracy, failure handling, clean setup, bug triage, final QA, release tagging, and handoff documentation.  

### 3.10 Edge cases to handle

| Edge case                              | Required behavior                                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Jurisdiction unknown                   | Do not apply jurisdiction-specific rules; ask reviewer to confirm or use federal-only scope if allowed.    |
| Document date unknown                  | Use current effective rules only if explicitly marked; warn that version-correct evaluation is incomplete. |
| OCR confidence low                     | Mark finding confidence lower; show OCR warning; allow manual text correction.                             |
| Rule not in KB                         | Analyzer must not invent rule; output may say “no encoded standard found for this issue.”                  |
| Multiple jurisdictions                 | Require user selection or run separate scoped analyses; never mix findings without labels.                 |
| Sensitive personal data                | Redact copy for analysis if configured; preserve original under strict permissions.                        |
| Duplicate uploads                      | Detect hash match; offer reuse or new analysis run.                                                        |
| Large batch upload                     | Queue jobs, show progress, retry transient failures, cap model spending.                                   |
| Model timeout                          | Persist failed stage; allow retry; do not show partial unvalidated finding as final.                       |
| Conflicting rules                      | Surface conflict as “needs human review”; cite both rule versions.                                         |
| Unsupported language                   | Mark unsupported; do not silently analyze as English.                                                      |
| Contract with scanned pages            | OCR before clause extraction; warn if layout prevents reliable clause boundaries.                          |
| Federal vs advocacy standard conflict  | Show legal minimum and advocacy rulebook findings separately.                                              |
| User tries to export unreviewed report | Block export or watermark as internal draft depending on scope.                                            |
| Citation validation fails              | Drop or quarantine finding; never display uncited legal assertion.                                         |

---