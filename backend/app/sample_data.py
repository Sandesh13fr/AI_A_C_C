from __future__ import annotations

from datetime import datetime, timezone


DEV_ORG_ID = "00000000-0000-4000-8000-000000000001"
DEV_USER_ID = "00000000-0000-4000-8000-000000000002"
DEV_DOCUMENT_ID = "00000000-0000-4000-8000-000000000003"
DEV_ANALYSIS_ID = "00000000-0000-4000-8000-000000000004"
DEV_RULE_ID = "00000000-0000-4000-8000-000000000005"


DEV_USER = {
    "id": DEV_USER_ID,
    "email": "test@example.com",
    "full_name": "Test Reviewer",
    "global_role": "superadmin",
    "organization_id": DEV_ORG_ID,
    "org_role": "org_admin",
}


SAMPLE_DOCUMENT = {
    "id": DEV_DOCUMENT_ID,
    "organization_id": DEV_ORG_ID,
    "title": "Sample APHIS Inspection Review",
    "filename": "sample-aphis-inspection.pdf",
    "original_name": "sample-aphis-inspection.pdf",
    "file_path": "sample/sample-aphis-inspection.pdf",
    "redacted_file_path": None,
    "file_size": 245760,
    "mime_type": "application/pdf",
    "doc_type": "inspection_report",
    "source_label": "USDA APHIS",
    "status": "complete",
    "ingestion_stage": "ready",
    "retrieval_summary": (
        "A sample USDA APHIS inspection document used for local smoke tests. "
        "It demonstrates retrieval summaries, metadata filters, score breakdowns, "
        "and citation-safe review language."
    ),
    "raw_text": (
        "The report notes animal housing observations and requests follow-up documentation. "
        "This sample text is not a legal conclusion and is only used for development smoke tests."
    ),
    "created_at": datetime.now(timezone.utc),
    "updated_at": datetime.now(timezone.utc),
    "metadata": {
        "issuer": "USDA APHIS",
        "jurisdiction_code": "US-FED",
        "facility_name": "Sample Facility",
        "facility_id": "SAMPLE-001",
        "species": ["dog"],
        "inspection_date": None,
        "document_date": None,
        "inspector_name": "Sample Inspector",
        "reference_number": "SAMPLE-REF",
        "welfare_categories": ["housing_environment"],
        "facility_types": ["breeder"],
        "industries": ["companion_animals"],
        "extra": {},
    },
}


SAMPLE_RULE = {
    "id": DEV_RULE_ID,
    "rule_code": "VC-SEED-001",
    "canonical_id": "VC-SEED-001",
    "citation": "9 CFR placeholder - needs verification",
    "citation_label": "9 CFR placeholder - needs verification",
    "title": "Adequate veterinary care",
    "jurisdiction_code": "US-FED",
    "agency_name": "USDA APHIS Animal Care",
    "source_code": "manual_seed",
    "source_type": "manual_seed",
    "welfare_category": "veterinary_care",
    "verification_status": "needs_review",
    "summary": (
        "Seeded reviewer-aid rule covering adequate veterinary care. "
        "Citation text is a placeholder and must be verified."
    ),
    "status": "needs_review",
}
