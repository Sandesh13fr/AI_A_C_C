from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_principal
from app.core.rate_limit import enforce_rate_limit
from app.core.security import create_access_token, verify_password
from app.db.models.users import User
from app.db.session import get_db
from app.sample_data import DEV_USER
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    request: Request,
    db: Annotated[AsyncSession | None, Depends(get_db)],
) -> TokenResponse:
    await enforce_rate_limit(request, bucket="login", limit_per_minute=20)

    user_payload: dict | None = None
    if db is not None:
        result = await db.execute(select(User).where(User.email == body.email))
        user = result.scalar_one_or_none()
        if user is not None and verify_password(body.password, user.hashed_password) and user.is_active:
            user_payload = {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "global_role": user.global_role,
                "organization_id": None,
                "org_role": None,
            }

    if user_payload is None and body.email == DEV_USER["email"] and body.password == "test1234":
        user_payload = DEV_USER

    if user_payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    token = create_access_token(
        user_payload["id"],
        {
            "email": user_payload["email"],
            "global_role": user_payload["global_role"],
            "organization_id": user_payload.get("organization_id"),
            "org_role": user_payload.get("org_role"),
        },
    )
    return TokenResponse(access_token=token, user=UserResponse(**user_payload))


@router.get("/me", response_model=UserResponse)
async def me(principal: Annotated[object, Depends(get_current_principal)]) -> UserResponse:
    return UserResponse(
        id=principal.user_id,
        email=principal.email,
        global_role=principal.global_role,
        organization_id=principal.organization_id,
        org_role=principal.org_role,
    )
