from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_principal
from app.core.permissions import Principal
from app.db.session import get_db
from app.schemas.rules import RuleDetailResponse, RuleListResponse
from app.services.knowledge_base import get_rule_detail, list_rules


router = APIRouter(prefix="/rules", tags=["rules"])


@router.get("", response_model=RuleListResponse)
async def list_rules_endpoint(
    principal: Annotated[Principal, Depends(get_current_principal)],
    db: Annotated[AsyncSession | None, Depends(get_db)],
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    q: str | None = None,
    jurisdiction: str | None = None,
    category: str | None = None,
    verification_status: str | None = None,
) -> RuleListResponse:
    return await list_rules(
        db=db,
        page=page,
        page_size=page_size,
        q=q,
        jurisdiction=jurisdiction,
        category=category,
        verification_status=verification_status,
    )


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
