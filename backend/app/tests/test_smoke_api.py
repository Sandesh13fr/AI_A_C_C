from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.sample_data import DEV_DOCUMENT_ID, DEV_RULE_ID


client = TestClient(app)


def _token() -> str:
    response = client.post("/api/auth/login", json={"email": "test@example.com", "password": "test1234"})
    assert response.status_code == 200
    return response.json()["access_token"]


def test_backend_imports_and_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_login_works_with_seeded_user() -> None:
    token = _token()
    assert token.count(".") == 2


def test_document_list_endpoint_works() -> None:
    response = client.get("/api/documents", headers={"Authorization": f"Bearer {_token()}"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] >= 1
    assert payload["items"][0]["id"] == DEV_DOCUMENT_ID


def test_search_endpoint_returns_score_breakdown() -> None:
    response = client.post(
        "/api/search",
        headers={"Authorization": f"Bearer {_token()}"},
        json={"query": "housing", "jurisdiction": "US-FED", "top_k": 5},
    )
    assert response.status_code == 200
    result = response.json()["results"][0]
    assert set(result["scores"]) == {"vector_score", "bm25_score", "metadata_boost", "final_score"}


def test_document_scoped_chat_returns_guardrails() -> None:
    response = client.post(
        f"/api/chat/document/{DEV_DOCUMENT_ID}",
        headers={"Authorization": f"Bearer {_token()}"},
        json={"content": "What does the document say?"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "no_legal_conclusions" in payload["guardrails"]
    assert payload["citations"]


def test_rules_list_endpoint_returns_valid_structure() -> None:
    token = _token()
    response = client.get("/api/rules", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    payload = response.json()
    assert "items" in payload
    assert "total" in payload
    for item in payload["items"]:
        assert "id" in item
        assert "title" in item
        assert "jurisdiction_code" in item
        assert "welfare_category" in item


def test_rules_search_and_filter_params_work() -> None:
    token = _token()
    response = client.get(
        "/api/rules?q=test&jurisdiction=US-FED",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200


def test_rule_detail_endpoint_returns_details() -> None:
    token = _token()
    response = client.get(f"/api/rules/{DEV_RULE_ID}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["id"] == DEV_RULE_ID
    assert "title" in payload
    assert "canonical_id" in payload
    assert "citation_label" in payload


def test_global_search_endpoint_works() -> None:
    response = client.get(
        "/api/search?q=veterinary&limit=5",
        headers={"Authorization": f"Bearer {_token()}"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "query" in payload
    assert "documents" in payload
    assert "rules" in payload
    assert payload["query"] == "veterinary"


def test_document_related_rules_endpoint_returns_structure() -> None:
    response = client.get(
        f"/api/documents/{DEV_DOCUMENT_ID}/related-rules",
        headers={"Authorization": f"Bearer {_token()}"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "items" in payload
    assert "total" in payload
