from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from app.models.assignment import ReturnStatus
from app.models.vehicle import VehicleType, VehicleStatus


class WorkerRef(BaseModel):
    id: UUID
    name: str
    employee_id: str

    class Config:
        from_attributes = True


class VehicleRef(BaseModel):
    id: UUID
    plate_number: str
    vehicle_type: VehicleType
    status: VehicleStatus

    class Config:
        from_attributes = True


class BatchRef(BaseModel):
    id: UUID
    route_from: str
    route_to: str
    distance_km: Decimal

    class Config:
        from_attributes = True


class AssignmentCreate(BaseModel):
    worker_id: UUID
    vehicle_id: UUID
    # Either provide an existing batch_id OR provide route info to auto-create a batch
    batch_id: Optional[UUID] = None
    route_from: Optional[str] = None
    route_to: Optional[str] = None
    distance_km: Optional[Decimal] = None
    pickup_destination: Optional[str] = None
    dropping_destination: Optional[str] = None


class AssignmentUpdate(BaseModel):
    runs_completed: Optional[int] = None
    return_status: Optional[ReturnStatus] = None
    issue_reason: Optional[str] = None


class AssignmentOut(BaseModel):
    id: UUID
    batch_id: UUID
    worker_id: UUID
    vehicle_id: UUID
    wage_per_run: Decimal
    runs_completed: int
    total_earned: Decimal
    return_status: ReturnStatus
    issue_reason: Optional[str] = None
    pickup_destination: Optional[str] = None
    dropping_destination: Optional[str] = None
    assigned_at: datetime
    returned_at: Optional[datetime] = None

    # Nested objects — populated via selectinload
    worker: Optional[WorkerRef] = None
    vehicle: Optional[VehicleRef] = None
    batch: Optional[BatchRef] = None

    class Config:
        from_attributes = True
