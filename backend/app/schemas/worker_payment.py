from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from app.models.worker_payment import PaymentStatus


class WorkerRef(BaseModel):
    id: UUID
    name: str
    employee_id: str

    class Config:
        from_attributes = True


class WorkerPaymentBase(BaseModel):
    worker_id: UUID
    amount: Decimal
    advance_payment: Decimal = Decimal("0.00")
    notes: Optional[str] = None


class WorkerPaymentCreate(WorkerPaymentBase):
    pass


class WorkerPaymentUpdate(BaseModel):
    status: Optional[PaymentStatus] = None
    advance_payment: Optional[Decimal] = None
    notes: Optional[str] = None


class WorkerPaymentOut(WorkerPaymentBase):
    id: UUID
    status: PaymentStatus
    remaining_amount: Decimal
    paid_by: UUID
    paid_at: datetime
    worker: Optional[WorkerRef] = None

    class Config:
        from_attributes = True
