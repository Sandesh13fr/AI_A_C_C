from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.sample_data import DEV_DOCUMENT_ID


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
