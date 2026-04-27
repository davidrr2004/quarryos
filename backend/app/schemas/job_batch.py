from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from app.models.job_batch import BatchStatus


class JobBatchBase(BaseModel):
    route_from: str
    route_to: str
    distance_km: Decimal
    est_hours: Optional[Decimal] = None


class JobBatchCreate(JobBatchBase):
    pass


class JobBatchUpdate(BaseModel):
    status: Optional[BatchStatus] = None
    route_from: Optional[str] = None
    route_to: Optional[str] = None


class JobBatchOut(JobBatchBase):
    id: UUID
    created_by: UUID
    status: BatchStatus
    created_at: datetime
    locked_at: Optional[datetime] = None

    class Config:
        from_attributes = True
