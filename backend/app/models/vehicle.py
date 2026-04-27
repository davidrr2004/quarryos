from sqlalchemy import Column, String, Boolean, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from datetime import datetime, timezone
from app.models.base import Base


class VehicleType(str, enum.Enum):
    truck = "truck"
    pickup = "pickup"
    minivan = "minivan"


class VehicleStatus(str, enum.Enum):
    working = "working"
    maintenance = "maintenance"
    not_working = "not_working"


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    plate_number = Column(String, unique=True, index=True, nullable=False)
    vehicle_type = Column(Enum(VehicleType), nullable=False)
    status = Column(Enum(VehicleStatus), default=VehicleStatus.working, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    assignments = relationship("Assignment", back_populates="vehicle")
    costs = relationship("VehicleCost", back_populates="vehicle")
