from sqlalchemy import Column, String, Numeric, Enum, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from datetime import datetime, timezone
from app.models.base import Base


class BatchStatus(str, enum.Enum):
    open = "open"
    locked = "locked"
    completed = "completed"


class JobBatch(Base):
    __tablename__ = "job_batches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    route_from = Column(String, nullable=False)
    route_to = Column(String, nullable=False)
    distance_km = Column(Numeric(10, 2), nullable=False)
    est_hours = Column(Numeric(10, 2), nullable=True)
    status = Column(Enum(BatchStatus), default=BatchStatus.open, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    locked_at = Column(DateTime(timezone=True), nullable=True)

    creator = relationship("User", back_populates="created_batches", foreign_keys=[created_by])
    assignments = relationship("Assignment", back_populates="batch")
