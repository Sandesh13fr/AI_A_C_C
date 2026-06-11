from __future__ import annotations

from sqlalchemy import text
from alembic import op


revision = "0003_align_knowledge_base_prompt_contract"
down_revision = "0002_seed_veterinary_care_rules"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()

    conn.exec_driver_sql("ALTER TABLE regulatory_rules ADD COLUMN IF NOT EXISTS rule_code TEXT;")
    conn.exec_driver_sql("ALTER TABLE regulatory_rules ADD COLUMN IF NOT EXISTS agency_name TEXT;")
    conn.exec_driver_sql("ALTER TABLE regulatory_rules ADD COLUMN IF NOT EXISTS source_code TEXT;")
    conn.exec_driver_sql("ALTER TABLE regulatory_rules ADD COLUMN IF NOT EXISTS citation TEXT;")
    conn.exec_driver_sql("ALTER TABLE regulatory_rules ADD COLUMN IF NOT EXISTS summary TEXT;")
    conn.exec_driver_sql("ALTER TABLE regulatory_rules ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'draft';")
    conn.exec_driver_sql("ALTER TABLE regulatory_rules ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;")

    conn.exec_driver_sql(
        """
        UPDATE regulatory_rules r
        SET
            rule_code = COALESCE(r.rule_code, r.canonical_id),
            source_code = COALESCE(r.source_code, r.source_type),
            citation = COALESCE(r.citation, r.citation_label),
            verification_status = COALESCE(
                r.verification_status,
                (
                    SELECT rv.verification_status
                    FROM regulatory_rule_versions rv
                    WHERE rv.rule_id = r.id
                    ORDER BY rv.created_at DESC
                    LIMIT 1
                ),
                'draft'
            ),
            summary = COALESCE(
                r.summary,
                (
                    SELECT rv.plain_language_summary
                    FROM regulatory_rule_versions rv
                    WHERE rv.rule_id = r.id
                    ORDER BY rv.created_at DESC
                    LIMIT 1
                )
            )
        """
    )
    conn.exec_driver_sql(
        """
        UPDATE regulatory_rules
        SET agency_name = 'USDA APHIS Animal Care'
        WHERE agency_name IS NULL
          AND jurisdiction_code = 'US-FED'
          AND welfare_category = 'veterinary_care'
        """
    )
    conn.exec_driver_sql(
        "CREATE UNIQUE INDEX IF NOT EXISTS uq_regulatory_rules_rule_code ON regulatory_rules(rule_code) WHERE rule_code IS NOT NULL;"
    )
    conn.exec_driver_sql("CREATE INDEX IF NOT EXISTS idx_regulatory_rules_rule_code ON regulatory_rules(rule_code);")
    conn.exec_driver_sql("CREATE INDEX IF NOT EXISTS idx_regulatory_rules_jurisdiction_code ON regulatory_rules(jurisdiction_code);")
    conn.exec_driver_sql("CREATE INDEX IF NOT EXISTS idx_regulatory_rules_welfare_category ON regulatory_rules(welfare_category);")
    conn.exec_driver_sql("CREATE INDEX IF NOT EXISTS idx_regulatory_rules_verification_status ON regulatory_rules(verification_status);")
    conn.exec_driver_sql(
        "CREATE INDEX IF NOT EXISTS idx_regulatory_rules_title_trgm ON regulatory_rules USING GIN (title gin_trgm_ops);"
    )

    conn.exec_driver_sql("ALTER TABLE regulatory_rule_versions ADD COLUMN IF NOT EXISTS effective_start_date DATE;")
    conn.exec_driver_sql("ALTER TABLE regulatory_rule_versions ADD COLUMN IF NOT EXISTS effective_end_date DATE;")
    conn.exec_driver_sql("ALTER TABLE regulatory_rule_versions ADD COLUMN IF NOT EXISTS rule_text TEXT;")
    conn.exec_driver_sql("ALTER TABLE regulatory_rule_versions ADD COLUMN IF NOT EXISTS interpretation_notes TEXT;")
    conn.exec_driver_sql("ALTER TABLE regulatory_rule_versions ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;")
    conn.exec_driver_sql(
        """
        UPDATE regulatory_rule_versions
        SET
            effective_start_date = COALESCE(effective_start_date, effective_start),
            effective_end_date = COALESCE(effective_end_date, effective_end),
            rule_text = COALESCE(rule_text, standard_text),
            interpretation_notes = COALESCE(interpretation_notes, plain_language_summary),
            metadata = COALESCE(metadata, '{}'::jsonb)
        """
    )
    conn.exec_driver_sql(
        "CREATE INDEX IF NOT EXISTS idx_regulatory_rule_versions_rule_text_fts ON regulatory_rule_versions USING GIN (to_tsvector('english', COALESCE(rule_text, standard_text, '')));"
    )

    conn.exec_driver_sql("ALTER TABLE rule_applicability ADD COLUMN IF NOT EXISTS rule_id UUID;")
    conn.exec_driver_sql("ALTER TABLE rule_applicability ADD COLUMN IF NOT EXISTS facility_type TEXT;")
    conn.exec_driver_sql("ALTER TABLE rule_applicability ADD COLUMN IF NOT EXISTS activity_type TEXT;")
    conn.exec_driver_sql("ALTER TABLE rule_applicability ADD COLUMN IF NOT EXISTS jurisdiction_code TEXT;")
    conn.exec_driver_sql("ALTER TABLE rule_applicability ADD COLUMN IF NOT EXISTS applicability_notes TEXT;")
    conn.exec_driver_sql(
        """
        UPDATE rule_applicability a
        SET
            rule_id = COALESCE(a.rule_id, rv.rule_id),
            facility_type = COALESCE(a.facility_type, a.facility_types[1]),
            jurisdiction_code = COALESCE(a.jurisdiction_code, r.jurisdiction_code)
        FROM regulatory_rule_versions rv
        JOIN regulatory_rules r ON r.id = rv.rule_id
        WHERE a.rule_version_id = rv.id
        """
    )
    conn.exec_driver_sql("CREATE INDEX IF NOT EXISTS idx_rule_applicability_rule_id ON rule_applicability(rule_id);")

    conn.exec_driver_sql("ALTER TABLE rule_chunks ADD COLUMN IF NOT EXISTS rule_id UUID;")
    conn.exec_driver_sql("ALTER TABLE rule_chunks ADD COLUMN IF NOT EXISTS chunk_text TEXT;")
    conn.exec_driver_sql("ALTER TABLE rule_chunks ADD COLUMN IF NOT EXISTS token_estimate INTEGER;")
    conn.exec_driver_sql(
        """
        UPDATE rule_chunks rc
        SET
            rule_id = COALESCE(rc.rule_id, rv.rule_id),
            chunk_text = COALESCE(rc.chunk_text, rc.text)
        FROM regulatory_rule_versions rv
        WHERE rc.rule_version_id = rv.id
        """
    )
    conn.exec_driver_sql("CREATE INDEX IF NOT EXISTS idx_rule_chunks_rule_id ON rule_chunks(rule_id);")
    conn.exec_driver_sql(
        "CREATE INDEX IF NOT EXISTS idx_rule_chunks_chunk_text_fts ON rule_chunks USING GIN (to_tsvector('english', COALESCE(chunk_text, text, '')));"
    )

    conn.exec_driver_sql("ALTER TABLE rule_precedent_links ADD COLUMN IF NOT EXISTS rule_id UUID;")
    conn.exec_driver_sql("ALTER TABLE rule_precedent_links ADD COLUMN IF NOT EXISTS document_chunk_id UUID;")
    conn.exec_driver_sql("ALTER TABLE rule_precedent_links ADD COLUMN IF NOT EXISTS note TEXT;")
    conn.exec_driver_sql(
        """
        UPDATE rule_precedent_links pl
        SET
            rule_id = COALESCE(pl.rule_id, rv.rule_id),
            document_chunk_id = COALESCE(pl.document_chunk_id, pl.chunk_id),
            note = COALESCE(pl.note, pl.notes)
        FROM regulatory_rule_versions rv
        WHERE pl.rule_version_id = rv.id
        """
    )
    conn.exec_driver_sql("ALTER TABLE rule_precedent_links ALTER COLUMN relationship_type SET DEFAULT 'related_source';")
    conn.exec_driver_sql("ALTER TABLE rule_precedent_links DROP CONSTRAINT IF EXISTS rule_precedent_links_relationship_type_check;")
    conn.exec_driver_sql(
        """
        ALTER TABLE rule_precedent_links
        ADD CONSTRAINT rule_precedent_links_relationship_type_check
        CHECK (relationship_type IN (
            'cited_in',
            'similar_fact_pattern',
            'enforcement_history',
            'inspection_pattern',
            'prior_review',
            'related_source'
        ));
        """
    )
    conn.exec_driver_sql("CREATE INDEX IF NOT EXISTS idx_rule_precedent_links_rule_id ON rule_precedent_links(rule_id);")
    conn.exec_driver_sql("CREATE INDEX IF NOT EXISTS idx_rule_precedent_links_document_id ON rule_precedent_links(document_id);")
    conn.exec_driver_sql("CREATE INDEX IF NOT EXISTS idx_rule_precedent_links_document_chunk_id ON rule_precedent_links(document_chunk_id);")

    conn.execute(
        text(
            """
            INSERT INTO rule_precedent_links (rule_version_id, rule_id, document_id, chunk_id, document_chunk_id, relationship_type, note, confidence)
            SELECT
                rv.id,
                r.id,
                matched.document_id,
                matched.chunk_id,
                matched.chunk_id,
                'related_source',
                'Seeded keyword match between veterinary-care rule text and an ingested document chunk.',
                0.75
            FROM regulatory_rules r
            JOIN regulatory_rule_versions rv ON rv.rule_id = r.id
            JOIN LATERAL (
                SELECT c.document_id, c.id AS chunk_id
                FROM chunks c
                WHERE
                    c.raw_text ILIKE '%veterinary%' OR
                    c.raw_text ILIKE '%veterinarian%' OR
                    c.raw_text ILIKE '%medical care%' OR
                    c.raw_text ILIKE '%adequate veterinary care%' OR
                    c.raw_text ILIKE '%treatment%' OR
                    c.raw_text ILIKE '%health%' OR
                    c.raw_text ILIKE '%program of veterinary care%'
                ORDER BY c.created_at DESC
                LIMIT 1
            ) matched ON true
            WHERE r.welfare_category = 'veterinary_care'
              AND COALESCE(r.source_code, r.source_type) IN ('manual_seed', 'ecfr', 'federal_cfr')
              AND NOT EXISTS (
                  SELECT 1
                  FROM rule_precedent_links existing
                  WHERE existing.rule_id = r.id
                    AND existing.document_id = matched.document_id
                    AND COALESCE(existing.document_chunk_id, existing.chunk_id) = matched.chunk_id
              )
            """
        )
    )


def downgrade() -> None:
    conn = op.get_bind()

    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_rule_precedent_links_document_chunk_id;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_rule_precedent_links_document_id;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_rule_precedent_links_rule_id;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_rule_chunks_chunk_text_fts;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_rule_chunks_rule_id;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_rule_applicability_rule_id;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_regulatory_rule_versions_rule_text_fts;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_regulatory_rules_title_trgm;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_regulatory_rules_verification_status;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_regulatory_rules_welfare_category;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_regulatory_rules_jurisdiction_code;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS idx_regulatory_rules_rule_code;")
    conn.exec_driver_sql("DROP INDEX IF EXISTS uq_regulatory_rules_rule_code;")

    conn.exec_driver_sql("ALTER TABLE rule_precedent_links DROP CONSTRAINT IF EXISTS rule_precedent_links_relationship_type_check;")
    conn.exec_driver_sql(
        """
        ALTER TABLE rule_precedent_links
        ADD CONSTRAINT rule_precedent_links_relationship_type_check
        CHECK (relationship_type IN (
            'cited_in',
            'similar_fact_pattern',
            'enforcement_history',
            'inspection_pattern',
            'prior_review'
        ));
        """
    )

    for statement in [
        "ALTER TABLE rule_precedent_links DROP COLUMN IF EXISTS note;",
        "ALTER TABLE rule_precedent_links DROP COLUMN IF EXISTS document_chunk_id;",
        "ALTER TABLE rule_precedent_links DROP COLUMN IF EXISTS rule_id;",
        "ALTER TABLE rule_chunks DROP COLUMN IF EXISTS token_estimate;",
        "ALTER TABLE rule_chunks DROP COLUMN IF EXISTS chunk_text;",
        "ALTER TABLE rule_chunks DROP COLUMN IF EXISTS rule_id;",
        "ALTER TABLE rule_applicability DROP COLUMN IF EXISTS applicability_notes;",
        "ALTER TABLE rule_applicability DROP COLUMN IF EXISTS jurisdiction_code;",
        "ALTER TABLE rule_applicability DROP COLUMN IF EXISTS activity_type;",
        "ALTER TABLE rule_applicability DROP COLUMN IF EXISTS facility_type;",
        "ALTER TABLE rule_applicability DROP COLUMN IF EXISTS rule_id;",
        "ALTER TABLE regulatory_rule_versions DROP COLUMN IF EXISTS metadata;",
        "ALTER TABLE regulatory_rule_versions DROP COLUMN IF EXISTS interpretation_notes;",
        "ALTER TABLE regulatory_rule_versions DROP COLUMN IF EXISTS rule_text;",
        "ALTER TABLE regulatory_rule_versions DROP COLUMN IF EXISTS effective_end_date;",
        "ALTER TABLE regulatory_rule_versions DROP COLUMN IF EXISTS effective_start_date;",
        "ALTER TABLE regulatory_rules DROP COLUMN IF EXISTS is_active;",
        "ALTER TABLE regulatory_rules DROP COLUMN IF EXISTS verification_status;",
        "ALTER TABLE regulatory_rules DROP COLUMN IF EXISTS summary;",
        "ALTER TABLE regulatory_rules DROP COLUMN IF EXISTS citation;",
        "ALTER TABLE regulatory_rules DROP COLUMN IF EXISTS source_code;",
        "ALTER TABLE regulatory_rules DROP COLUMN IF EXISTS agency_name;",
        "ALTER TABLE regulatory_rules DROP COLUMN IF EXISTS rule_code;",
    ]:
        conn.exec_driver_sql(statement)
