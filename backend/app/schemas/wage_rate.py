from typing import Optional
from uuid import UUID
from datetime import date
from decimal import Decimal
from pydantic import BaseModel
from app.models.vehicle import VehicleType


class WageRateBase(BaseModel):
    vehicle_type: VehicleType
    rate_per_run: Decimal
    effective_from: date
    notes: Optional[str] = None


class WageRateCreate(WageRateBase):
    pass


class WageRateOut(WageRateBase):
    id: UUID

    class Config:
        from_attributes = True
