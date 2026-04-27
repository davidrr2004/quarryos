from sqlalchemy import Column, String, Numeric, Enum, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from datetime import datetime, timezone
from app.models.base import Base


class ReturnStatus(str, enum.Enum):
    pending = "pending"
    returned = "returned"
    issue = "issue"
    reassigned = "reassigned"


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("job_batches.id"), nullable=False, index=True)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("workers.id"), nullable=False, index=True)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False, index=True)
    wage_per_run = Column(Numeric(10, 2), nullable=False)
    runs_completed = Column(Integer, default=0, nullable=False)
    total_earned = Column(Numeric(10, 2), default=0.00, nullable=False)
    pickup_destination = Column(String, nullable=True)
    dropping_destination = Column(String, nullable=True)
    return_status = Column(Enum(ReturnStatus), default=ReturnStatus.pending, nullable=False, index=True)
    issue_reason = Column(String, nullable=True)
    assigned_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    returned_at = Column(DateTime(timezone=True), nullable=True)

    batch = relationship("JobBatch", back_populates="assignments")
    worker = relationship("Worker", back_populates="assignments")
    vehicle = relationship("Vehicle", back_populates="assignments")
