from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class WorkerPaymentBase(BaseModel):
    worker_id: UUID
    amount: Decimal
    advance_payment: Decimal = Decimal("0.00")
    notes: Optional[str] = None


class WorkerPaymentCreate(WorkerPaymentBase):
    pass


class WorkerPaymentOut(WorkerPaymentBase):
    id: UUID
    remaining_amount: Decimal
    paid_by: UUID
    paid_at: datetime

    class Config:
        from_attributes = True
