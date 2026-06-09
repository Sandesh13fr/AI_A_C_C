from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class ApiModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class MessageResponse(ApiModel):
    status: str = "ok"
    detail: str


class PlaceholderResponse(ApiModel):
    status: str = "placeholder"
    module: str
    items: list[dict[str, Any]] = []
    next_steps: list[str] = []


class HealthResponse(ApiModel):
    status: str
    service: str
    environment: str
    timestamp: datetime
