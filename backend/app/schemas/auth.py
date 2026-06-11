from __future__ import annotations

from pydantic import BaseModel

from app.schemas.common import ApiModel


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(ApiModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(ApiModel):
    id: str
    email: str
    full_name: str | None = None
    global_role: str = "user"
    organization_id: str | None = None
    org_role: str | None = None


TokenResponse.model_rebuild()
