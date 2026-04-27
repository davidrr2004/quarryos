from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class WorkerBase(BaseModel):
    name: str
    employee_id: str
    phone: Optional[str] = None


class WorkerCreate(WorkerBase):
    pass


class WorkerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None


class WorkerOut(WorkerBase):
    id: UUID
    is_active: bool
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True
