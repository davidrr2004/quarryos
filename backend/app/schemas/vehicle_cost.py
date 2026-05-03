from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from app.models.vehicle_cost import CostType


class VehicleRef(BaseModel):
    id: UUID
    plate_number: str

    class Config:
        from_attributes = True


class VehicleCostBase(BaseModel):
    vehicle_id: UUID
    cost_type: CostType
    amount: Decimal
    note: Optional[str] = None


class VehicleCostCreate(VehicleCostBase):
    pass


class VehicleCostOut(VehicleCostBase):
    id: UUID
    logged_by: UUID
    logged_at: datetime
    vehicle: Optional[VehicleRef] = None

    class Config:
        from_attributes = True
