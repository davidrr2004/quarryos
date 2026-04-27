from sqlalchemy import Column, String, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from datetime import datetime, timezone
from app.models.base import Base


class UserRole(str, enum.Enum):
    owner = "admin"
    dispatcher = "dispatcher"
    viewer = "viewer"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.viewer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    created_batches = relationship("JobBatch", back_populates="creator", foreign_keys="JobBatch.created_by")
    payments_made = relationship("WorkerPayment", back_populates="payer", foreign_keys="WorkerPayment.paid_by")
    costs_logged = relationship("VehicleCost", back_populates="logger", foreign_keys="VehicleCost.logged_by")
