from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.models.base import Base

class WorkerPayment(Base):
    __tablename__ = "worker_payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("workers.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    paid_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    notes = Column(String, nullable=True)
    paid_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
