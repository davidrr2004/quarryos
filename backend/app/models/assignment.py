from sqlalchemy import Column, String, Numeric, Enum, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from datetime import datetime
from app.models.base import Base

class ReturnStatus(str, enum.Enum):
    pending = "pending"
    returned = "returned"
    issue = "issue"
    reassigned = "reassigned"

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    batch_id = Column(UUID(as_uuid=True), ForeignKey("job_batches.id"), nullable=False)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("workers.id"), nullable=False)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    wage_per_run = Column(Numeric(10, 2), nullable=False)
    runs_completed = Column(Integer, default=0, nullable=False)
    total_earned = Column(Numeric(10, 2), default=0.00, nullable=False)
    return_status = Column(Enum(ReturnStatus), default=ReturnStatus.pending, nullable=False)
    issue_reason = Column(String, nullable=True)
    assigned_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    returned_at = Column(DateTime(timezone=True), nullable=True)
