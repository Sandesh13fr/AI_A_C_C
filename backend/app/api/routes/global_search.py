from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_principal
from app.core.permissions import Principal
from app.db.session import get_db
from app.schemas.rules import SearchGroupedResponse
from app.services.knowledge_base import search_grouped


router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=SearchGroupedResponse)
async def global_search(
    principal: Annotated[Principal, Depends(get_current_principal)],
    db: Annotated[AsyncSession | None, Depends(get_db)],
    q: str = Query(..., min_length=1, max_length=500),
    limit: int = Query(20, ge=1, le=100),
) -> SearchGroupedResponse:
    return await search_grouped(db=db, query=q, limit=limit)
