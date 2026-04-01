from sqlalchemy import Column, String, Numeric, Enum, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from datetime import datetime
from app.models.base import Base

class CostType(str, enum.Enum):
    fuel = "fuel"
    maintenance = "maintenance"
    other = "other"

class VehicleCost(Base):
    __tablename__ = "vehicle_costs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    cost_type = Column(Enum(CostType), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    note = Column(String, nullable=True)
    logged_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    logged_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
