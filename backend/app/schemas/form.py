import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class FormCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    department: str | None = None
    created_by: str | None = None
    schema_data: dict = Field(default_factory=dict, alias="schema")
    tags: list[str] | None = None


class FormUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    department: str | None = None
    schema_data: dict | None = Field(None, alias="schema")
    tags: list[str] | None = None


class FormResponse(BaseModel):
    id: uuid.UUID
    title: str
    department: str | None
    version: int
    created_by: str | None
    schema_data: dict = Field(..., alias="schema")
    tags: list[str] | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True, "populate_by_name": True}
