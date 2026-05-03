import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, Enum, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    advance = "advance"
    paid = "paid"


class WorkerPayment(Base):
    __tablename__ = "worker_payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    worker_id = Column(UUID(as_uuid=True), ForeignKey("workers.id"), nullable=False, index=True)
    amount = Column(Numeric(10, 2), nullable=False)
    advance_payment = Column(Numeric(10, 2), nullable=False, default=0.00)
    remaining_amount = Column(Numeric(10, 2), nullable=False, default=0.00)
    status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.pending)
    paid_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    notes = Column(String, nullable=True)
    paid_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    worker = relationship("Worker", back_populates="payments")
    payer = relationship("User", back_populates="payments_made", foreign_keys=[paid_by])
