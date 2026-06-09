from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.permissions import Principal
from app.core.security import decode_access_token
from app.db.models.users import User
from app.db.session import get_db
from app.sample_data import DEV_USER


bearer_scheme = HTTPBearer(auto_error=False)


def _principal_from_dev_user() -> Principal:
    return Principal(
        user_id=DEV_USER["id"],
        email=DEV_USER["email"],
        global_role=DEV_USER["global_role"],
        organization_id=DEV_USER["organization_id"],
        org_role=DEV_USER["org_role"],
    )


async def get_current_principal(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[AsyncSession | None, Depends(get_db)],
) -> Principal:
    settings = get_settings()

    if credentials is None:
        if settings.allow_dev_auth and not settings.is_production:
            return _principal_from_dev_user()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    try:
        payload = decode_access_token(credentials.credentials)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid bearer token")

    if db is not None:
        result = await db.execute(select(User).where(User.id == payload["sub"]))
        user = result.scalar_one_or_none()
        if user is not None and user.is_active:
            return Principal(
                user_id=str(user.id),
                email=user.email,
                global_role=user.global_role,
                organization_id=payload.get("organization_id"),
                org_role=payload.get("org_role"),
            )

    return Principal(
        user_id=str(payload["sub"]),
        email=str(payload.get("email") or DEV_USER["email"]),
        global_role=str(payload.get("global_role") or "user"),
        organization_id=payload.get("organization_id"),
        org_role=payload.get("org_role"),
    )


async def require_superadmin(
    principal: Annotated[Principal, Depends(get_current_principal)],
) -> Principal:
    if not principal.is_superadmin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Superadmin access required")
    return principal
