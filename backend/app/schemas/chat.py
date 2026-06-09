from __future__ import annotations

from typing import Any

from pydantic import Field

from app.schemas.common import ApiModel


class ChatSessionCreate(ApiModel):
    organization_id: str | None = None
    document_id: str | None = None
    analysis_run_id: str | None = None
    rulebook_id: str | None = None
    scope: str = Field("document", pattern="^(document|corpus|rulebook|analysis)$")
    title: str | None = None


class ChatMessageCreate(ApiModel):
    content: str = Field(min_length=1, max_length=4000)


class Citation(ApiModel):
    citation_type: str
    citation_label: str
    source_id: str | None = None
    snippet: str | None = None


class ChatMessageResponse(ApiModel):
    id: str
    role: str
    content: str
    citations: list[Citation] = []


class ChatSessionResponse(ApiModel):
    id: str
    scope: str
    document_id: str | None = None
    title: str | None = None
    messages: list[ChatMessageResponse] = []


class ChatAnswerResponse(ApiModel):
    answer: str
    citations: list[dict[str, Any]] = []
    guardrails: list[str]
