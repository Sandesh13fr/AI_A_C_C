from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_principal
from app.core.permissions import Principal
from app.db.session import get_db
from app.schemas.rules import RuleDetailResponse, RuleListResponse, RuleSearchResponse
from app.services.knowledge_base import get_rule_detail, list_rules, search_rules


router = APIRouter(prefix="/rules", tags=["rules"])


@router.get("", response_model=RuleListResponse)
async def list_rules_endpoint(
    principal: Annotated[Principal, Depends(get_current_principal)],
    db: Annotated[AsyncSession | None, Depends(get_db)],
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    limit: int | None = Query(None, ge=1, le=100),
    offset: int | None = Query(None, ge=0),
    q: str | None = None,
    jurisdiction: str | None = None,
    category: str | None = None,
    verification_status: str | None = None,
) -> RuleListResponse:
    resolved_page_size = limit or page_size
    resolved_page = page if offset is None else (offset // resolved_page_size) + 1
    return await list_rules(
        db=db,
        page=resolved_page,
        page_size=resolved_page_size,
        q=q,
        jurisdiction=jurisdiction,
        category=category,
        verification_status=verification_status,
    )


@router.get("/search", response_model=RuleSearchResponse)
async def search_rules_endpoint(
    principal: Annotated[Principal, Depends(get_current_principal)],
    db: Annotated[AsyncSession | None, Depends(get_db)],
    q: str = Query(..., min_length=1, max_length=500),
    limit: int = Query(20, ge=1, le=100),
) -> RuleSearchResponse:
    return await search_rules(db=db, query=q, limit=limit)


@router.get("/{rule_id}", response_model=RuleDetailResponse)
async def get_rule_endpoint(
    rule_id: str,
    principal: Annotated[Principal, Depends(get_current_principal)],
    db: Annotated[AsyncSession | None, Depends(get_db)],
) -> RuleDetailResponse:
    rule = await get_rule_detail(db, rule_id)
    if rule is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")
    return rule
