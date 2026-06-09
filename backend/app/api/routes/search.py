from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_principal
from app.core.permissions import Principal, can_access_organization
from app.db.session import get_db
from app.schemas.search import SearchRequest, SearchResponse
from app.services.retrieval.hybrid_search import hybrid_search


router = APIRouter(prefix="/search", tags=["search"])


@router.post("", response_model=SearchResponse)
async def search_documents(
    body: SearchRequest,
    principal: Annotated[Principal, Depends(get_current_principal)],
    db: Annotated[AsyncSession | None, Depends(get_db)],
) -> SearchResponse:
    if not (body.query and body.query.strip()) and not any(
        [body.doc_type, body.jurisdiction, body.species, body.welfare_category, body.industry, body.facility_type, body.source]
    ):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide a query or at least one filter")
    if not can_access_organization(principal, body.organization_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Organization access denied")
    return await hybrid_search(db, body)
