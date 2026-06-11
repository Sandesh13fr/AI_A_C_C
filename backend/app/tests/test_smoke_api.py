from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.sample_data import DEV_DOCUMENT_ID, DEV_RULE_ID


client = TestClient(app)


_AUTH_TOKEN: str | None = None


def _get_token() -> str:
    global _AUTH_TOKEN
    if _AUTH_TOKEN is not None:
        return _AUTH_TOKEN
    response = client.post("/api/auth/login", json={"email": "test@example.com", "password": "test1234"})
    assert response.status_code == 200
    _AUTH_TOKEN = response.json()["access_token"]
    return _AUTH_TOKEN


def test_backend_imports_and_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_login_works_with_seeded_user() -> None:
    token = _get_token()
    assert token.count(".") == 2


def test_document_list_endpoint_works() -> None:
    response = client.get("/api/documents", headers={"Authorization": f"Bearer {_get_token()}"})
    assert response.status_code == 200
    payload = response.json()
    assert "total" in payload
    assert isinstance(payload["total"], int)
    assert isinstance(payload["items"], list)


def test_search_endpoint_returns_score_breakdown() -> None:
    response = client.post(
        "/api/search",
        headers={"Authorization": f"Bearer {_get_token()}"},
        json={"query": "housing", "jurisdiction": "US-FED", "top_k": 5},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "results" in payload
    assert isinstance(payload["results"], list)


def test_document_scoped_chat_returns_guardrails() -> None:
    response = client.post(
        f"/api/chat/document/{DEV_DOCUMENT_ID}",
        headers={"Authorization": f"Bearer {_get_token()}"},
        json={"content": "What does the document say?"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "no_legal_conclusions" in payload["guardrails"]
    assert payload["citations"]


def test_rules_list_endpoint_returns_valid_structure() -> None:
    token = _get_token()
    response = client.get("/api/rules", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    payload = response.json()
    assert "items" in payload
    assert "total" in payload
    for item in payload["items"]:
        assert "id" in item
        assert "rule_code" in item
        assert "title" in item
        assert "citation" in item
        assert "jurisdiction_code" in item
        assert item["verification_status"] == "needs_review"


def test_rules_search_and_filter_params_work() -> None:
    token = _get_token()
    response = client.get(
        "/api/rules?q=test&jurisdiction=US-FED",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    search_response = client.get(
        "/api/rules/search?q=veterinary",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert search_response.status_code == 200
    assert search_response.json()["items"]


def test_rule_detail_endpoint_returns_details() -> None:
    token = _get_token()
    # Get first rule from list to use its real ID
    list_resp = client.get("/api/rules", headers={"Authorization": f"Bearer {token}"})
    assert list_resp.status_code == 200
    rules = list_resp.json().get("items", [])
    assert len(rules) >= 1, "Expected at least one seed rule"
    rule_id = rules[0]["id"]

    response = client.get(f"/api/rules/{rule_id}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["id"] == rule_id
    assert "title" in payload
    assert "rule_code" in payload
    assert "citation" in payload
    assert "latest_version" in payload


def test_global_search_endpoint_works() -> None:
    response = client.get(
        "/api/search?q=veterinary&limit=5",
        headers={"Authorization": f"Bearer {_get_token()}"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "query" in payload
    assert "documents" in payload
    assert "rules" in payload
    assert payload["query"] == "veterinary"
    assert payload["rules"]


def test_document_related_rules_endpoint_returns_structure() -> None:
    response = client.get(
        f"/api/documents/{DEV_DOCUMENT_ID}/related-rules",
        headers={"Authorization": f"Bearer {_get_token()}"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "items" in payload
    assert "total" in payload
