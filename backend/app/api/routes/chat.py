from __future__ import annotations

from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_principal
from app.core.governance import GovernanceError, validate_chat_response
from app.sample_data import SAMPLE_DOCUMENT
from app.schemas.chat import ChatAnswerResponse, ChatMessageCreate, ChatSessionCreate, ChatSessionResponse


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/sessions", response_model=ChatSessionResponse, status_code=201)
async def create_chat_session(
    _: Annotated[object, Depends(get_current_principal)],
    body: ChatSessionCreate,
) -> ChatSessionResponse:
    if body.scope == "document" and not body.document_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="document_id is required for document-scoped chat")
    if body.scope == "corpus":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unscoped corpus legal chat is not enabled")
    return ChatSessionResponse(id=str(uuid4()), scope=body.scope, document_id=body.document_id, title=body.title)


@router.post("/document/{document_id}", response_model=ChatAnswerResponse)
async def ask_document(
    document_id: str,
    _: Annotated[object, Depends(get_current_principal)],
    body: ChatMessageCreate,
) -> ChatAnswerResponse:
    if document_id != SAMPLE_DOCUMENT["id"]:
        answer = "The available local context is insufficient to answer that document-scoped question."
        return ChatAnswerResponse(answer=answer, citations=[], guardrails=["insufficient_evidence", "document_scope_only"])

    citation = {
        "citation_type": "source_document",
        "citation_label": "Development sample",
        "source_id": SAMPLE_DOCUMENT["id"],
        "snippet": SAMPLE_DOCUMENT["raw_text"][:180],
    }
    answer = (
        "The sample document notes housing-related observations and a request for follow-up documentation [CIT-1]. "
        "This is surfaced only as review context, not as a legal conclusion."
    )
    try:
        validate_chat_response(answer, [citation])
    except GovernanceError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    return ChatAnswerResponse(answer=answer, citations=[citation], guardrails=["no_legal_conclusions", "citation_required"])
