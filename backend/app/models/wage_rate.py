from sqlalchemy import Column, String, Numeric, Enum, Date
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.models.base import Base
from app.models.vehicle import VehicleType

class WageRate(Base):
    __tablename__ = "wage_rates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    vehicle_type = Column(Enum(VehicleType), nullable=False)
    rate_per_run = Column(Numeric(10, 2), nullable=False)
    effective_from = Column(Date, nullable=False)
    notes = Column(String, nullable=True)
