from __future__ import annotations

from alembic import op
from sqlalchemy import text


revision = "0002_seed_veterinary_care_rules"
down_revision = "0001_final_schema"
branch_labels = None
depends_on = None


SEED_RULES = [
    {
        "canonical_id": "VC-SEED-001",
        "citation_label": "9 CFR 2.40 (placeholder – needs verification)",
        "title": "Adequate Veterinary Care — Attending Veterinarian and Daily Observation",
        "jurisdiction_code": "US-FED",
        "source_type": "federal_cfr",
        "welfare_category": "veterinary_care",
        "version_label": "v1",
        "effective_start": "2024-01-01",
        "standard_text": (
            "Each research facility shall have an attending veterinarian who shall provide adequate "
            "veterinary care to all animals used in research, teaching, or testing. Daily observation "
            "of all animals by the attending veterinarian or by someone trained to recognize signs of "
            "illness or injury is required. A program of adequate veterinary care must be documented "
            "and available for inspection.\n\n"
            "This seed record is marked needs_review. The exact citation (potentially 9 CFR 2.40) "
            "must be verified against the official eCFR before use in any decision-support context."
        ),
        "plain_language_summary": (
            "Requires a designated attending veterinarian and a documented program of veterinary care "
            "that includes daily observation for signs of illness or injury. Seed rule — not legally verified."
        ),
        "species": ["dog", "cat", "nonhuman_primate", "guinea_pig", "hamster", "rabbit"],
        "facility_types": ["research_facility", "breeder"],
        "industries": ["research"],
        "document_types": ["inspection_report", "regulation"],
        "chunks": [
            {
                "chunk_index": 0,
                "text": "Each research facility shall have an attending veterinarian who shall provide adequate "
                       "veterinary care to all animals used in research, teaching, or testing.",
            },
            {
                "chunk_index": 1,
                "text": "Daily observation of all animals by the attending veterinarian or by someone trained "
                       "to recognize signs of illness or injury is required.",
            },
            {
                "chunk_index": 2,
                "text": "A program of adequate veterinary care must be documented and available for inspection.",
            },
        ],
    },
    {
        "canonical_id": "VC-SEED-002",
        "citation_label": "9 CFR 2.33 (placeholder – needs verification)",
        "title": "Program of Veterinary Care — Written Plan Requirements",
        "jurisdiction_code": "US-FED",
        "source_type": "federal_cfr",
        "welfare_category": "veterinary_care",
        "version_label": "v1",
        "effective_start": "2024-01-01",
        "standard_text": (
            "Dealers, exhibitors, and research facilities must develop, document, and follow an appropriate "
            "program of veterinary care. The program must include preventive care, treatment of diseases "
            "and injuries, daily observation, and adequate veterinary oversight.\n\n"
            "This seed record is marked needs_review. The exact citation (potentially 9 CFR 2.33) "
            "must be verified against the official eCFR before use in any decision-support context."
        ),
        "plain_language_summary": (
            "Requires a written program of veterinary care covering prevention, treatment, daily observation, "
            "and oversight. Seed rule — not legally verified."
        ),
        "species": ["dog", "cat", "nonhuman_primate", "guinea_pig", "hamster", "rabbit"],
        "facility_types": ["research_facility", "dealer", "exhibitor", "breeder"],
        "industries": ["research", "companion_animals"],
        "document_types": ["inspection_report", "regulation"],
        "chunks": [
            {
                "chunk_index": 0,
                "text": "Dealers, exhibitors, and research facilities must develop, document, and follow an "
                       "appropriate program of veterinary care.",
            },
            {
                "chunk_index": 1,
                "text": "The program must include preventive care, treatment of diseases and injuries, "
                       "daily observation, and adequate veterinary oversight.",
            },
        ],
    },
    {
        "canonical_id": "VC-SEED-003",
        "citation_label": "9 CFR 2.38 (placeholder – needs verification)",
        "title": "Daily Observation / Health Monitoring of Animals",
        "jurisdiction_code": "US-FED",
        "source_type": "federal_cfr",
        "welfare_category": "veterinary_care",
        "version_label": "v1",
        "effective_start": "2024-01-01",
        "standard_text": (
            "Facilities must observe all animals daily to assess their health and well-being. A mechanism "
            "for direct and frequent communication between the facility and the attending veterinarian "
            "must be established so that timely and accurate information on animal health is conveyed.\n\n"
            "This seed record is marked needs_review. The exact citation (potentially 9 CFR 2.38) "
            "must be verified against the official eCFR before use in any decision-support context."
        ),
        "plain_language_summary": (
            "Mandates daily health observation of all animals and a direct communication pathway "
            "to the attending veterinarian for timely health reporting. Seed rule — not legally verified."
        ),
        "species": ["dog", "cat", "nonhuman_primate", "guinea_pig", "hamster", "rabbit", "farm_animal"],
        "facility_types": ["research_facility", "dealer", "exhibitor", "breeder"],
        "industries": ["research", "companion_animals"],
        "document_types": ["inspection_report", "regulation"],
        "chunks": [
            {
                "chunk_index": 0,
                "text": "Facilities must observe all animals daily to assess their health and well-being.",
            },
            {
                "chunk_index": 1,
                "text": "A mechanism for direct and frequent communication between the facility and the "
                       "attending veterinarian must be established.",
            },
        ],
    },
    {
        "canonical_id": "VC-SEED-004",
        "citation_label": "9 CFR 2.40(b) (placeholder – needs verification)",
        "title": "Treatment of Illness or Injury — Timely Care Requirement",
        "jurisdiction_code": "US-FED",
        "source_type": "federal_cfr",
        "welfare_category": "veterinary_care",
        "version_label": "v1",
        "effective_start": "2024-01-01",
        "standard_text": (
            "When an animal is observed to be ill, injured, or in distress, the facility must provide "
            "timely and appropriate veterinary care. If the attending veterinarian is not available, "
            "a designated alternate or emergency veterinary provider must be identified in advance.\n\n"
            "This seed record is marked needs_review. The exact citation (potentially 9 CFR 2.40(b)) "
            "must be verified against the official eCFR before use in any decision-support context."
        ),
        "plain_language_summary": (
            "Requires timely veterinary treatment when illness, injury, or distress is observed, "
            "including pre-arranged emergency coverage. Seed rule — not legally verified."
        ),
        "species": ["dog", "cat", "nonhuman_primate", "guinea_pig", "hamster", "rabbit"],
        "facility_types": ["research_facility", "dealer", "exhibitor", "breeder"],
        "industries": ["research", "companion_animals"],
        "document_types": ["inspection_report", "regulation"],
        "chunks": [
            {
                "chunk_index": 0,
                "text": "When an animal is observed to be ill, injured, or in distress, the facility must "
                       "provide timely and appropriate veterinary care.",
            },
            {
                "chunk_index": 1,
                "text": "If the attending veterinarian is not available, a designated alternate or emergency "
                       "veterinary provider must be identified in advance.",
            },
        ],
    },
    {
        "canonical_id": "VC-SEED-005",
        "citation_label": "9 CFR 2.35 (placeholder – needs verification)",
        "title": "Access to Veterinary Records and Responsible Personnel",
        "jurisdiction_code": "US-FED",
        "source_type": "federal_cfr",
        "welfare_category": "veterinary_care",
        "version_label": "v1",
        "effective_start": "2024-01-01",
        "standard_text": (
            "Facilities must maintain complete and accurate records of animal health, including "
            "veterinary treatments, observations, and outcomes. Responsible personnel must have "
            "access to these records and be trained to recognize and report health concerns.\n\n"
            "This seed record is marked needs_review. The exact citation (potentially 9 CFR 2.35) "
            "must be verified against the official eCFR before use in any decision-support context."
        ),
        "plain_language_summary": (
            "Requires maintenance of veterinary records and ensures personnel have access and training "
            "to recognise and report health concerns. Seed rule — not legally verified."
        ),
        "species": ["dog", "cat", "nonhuman_primate", "guinea_pig", "hamster", "rabbit"],
        "facility_types": ["research_facility", "dealer", "exhibitor", "breeder"],
        "industries": ["research", "companion_animals"],
        "document_types": ["inspection_report", "regulation"],
        "chunks": [
            {
                "chunk_index": 0,
                "text": "Facilities must maintain complete and accurate records of animal health, including "
                       "veterinary treatments, observations, and outcomes.",
            },
            {
                "chunk_index": 1,
                "text": "Responsible personnel must have access to these records and be trained to recognize "
                       "and report health concerns.",
            },
        ],
    },
]


def upgrade() -> None:
    conn = op.get_bind()

    # Widen the CHECK constraint to allow 'needs_review' for seed rules
    conn.execute(
        text(
            "ALTER TABLE regulatory_rule_versions "
            "DROP CONSTRAINT IF EXISTS regulatory_rule_versions_verification_status_check"
        )
    )
    conn.execute(
        text(
            "ALTER TABLE regulatory_rule_versions "
            "ADD CONSTRAINT regulatory_rule_versions_verification_status_check "
            "CHECK (verification_status IN ('draft', 'verified', 'deprecated', 'needs_review'))"
        )
    )

    for rule in SEED_RULES:
        rule_id = conn.execute(
            text("""
                INSERT INTO regulatory_rules (canonical_id, jurisdiction_code, source_type, citation_label, title, welfare_category)
                VALUES (:canonical_id, :jurisdiction_code, :source_type, :citation_label, :title, :welfare_category)
                ON CONFLICT (canonical_id, jurisdiction_code, source_type) DO NOTHING
                RETURNING id
            """),
            {
                "canonical_id": rule["canonical_id"],
                "jurisdiction_code": rule["jurisdiction_code"],
                "source_type": rule["source_type"],
                "citation_label": rule["citation_label"],
                "title": rule["title"],
                "welfare_category": rule["welfare_category"],
            },
        ).scalar_one_or_none()

        if rule_id is None:
            continue

        version_id = conn.execute(
            text("""
                INSERT INTO regulatory_rule_versions
                    (rule_id, version_label, effective_start, standard_text, plain_language_summary, verification_status, source_url)
                VALUES (:rule_id, :version_label, :effective_start, :standard_text, :plain_language_summary, 'needs_review', :source_url)
                RETURNING id
            """),
            {
                "rule_id": rule_id,
                "version_label": rule["version_label"],
                "effective_start": rule["effective_start"],
                "standard_text": rule["standard_text"],
                "plain_language_summary": rule["plain_language_summary"],
                "source_url": "https://www.ecfr.gov/current/title-9",
            },
        ).scalar_one()

        conn.execute(
            text("""
                INSERT INTO rule_applicability (rule_version_id, species, facility_types, industries, document_types)
                VALUES (:rule_version_id, :species, :facility_types, :industries, :document_types)
            """),
            {
                "rule_version_id": version_id,
                "species": rule["species"],
                "facility_types": rule["facility_types"],
                "industries": rule["industries"],
                "document_types": rule["document_types"],
            },
        )

        for chunk in rule["chunks"]:
            conn.execute(
                text("""
                    INSERT INTO rule_chunks (rule_version_id, chunk_index, text)
                    VALUES (:rule_version_id, :chunk_index, :text)
                """),
                {
                    "rule_version_id": version_id,
                    "chunk_index": chunk["chunk_index"],
                    "text": chunk["text"],
                },
            )


def downgrade() -> None:
    conn = op.get_bind()
    for rule in SEED_RULES:
        conn.execute(
            text("DELETE FROM regulatory_rules WHERE canonical_id = :canonical_id"),
            {"canonical_id": rule["canonical_id"]},
        )

    conn.execute(
        text(
            "ALTER TABLE regulatory_rule_versions "
            "DROP CONSTRAINT IF EXISTS regulatory_rule_versions_verification_status_check"
        )
    )
    conn.execute(
        text(
            "ALTER TABLE regulatory_rule_versions "
            "ADD CONSTRAINT regulatory_rule_versions_verification_status_check "
            "CHECK (verification_status IN ('draft', 'verified', 'deprecated'))"
        )
    )
