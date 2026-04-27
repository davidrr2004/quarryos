from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.models.vehicle import VehicleType, VehicleStatus


class VehicleBase(BaseModel):
    plate_number: str
    vehicle_type: VehicleType
    status: VehicleStatus = VehicleStatus.working


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    plate_number: Optional[str] = None
    vehicle_type: Optional[VehicleType] = None
    status: Optional[VehicleStatus] = None
    is_active: Optional[bool] = None


class VehicleOut(VehicleBase):
    id: UUID
    is_active: bool
    created_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True
