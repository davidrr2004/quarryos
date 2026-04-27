from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from app.models.assignment import ReturnStatus


class AssignmentBase(BaseModel):
    batch_id: UUID
    worker_id: UUID
    vehicle_id: UUID
    pickup_destination: Optional[str] = None
    dropping_destination: Optional[str] = None


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentUpdate(BaseModel):
    runs_completed: Optional[int] = None
    return_status: Optional[ReturnStatus] = None
    issue_reason: Optional[str] = None


class AssignmentOut(AssignmentBase):
    id: UUID
    wage_per_run: Decimal
    runs_completed: int
    total_earned: Decimal
    return_status: ReturnStatus
    issue_reason: Optional[str] = None
    assigned_at: datetime
    returned_at: Optional[datetime] = None

    class Config:
        from_attributes = True
