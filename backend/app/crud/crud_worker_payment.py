from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.worker_payment import WorkerPayment
from app.schemas.worker_payment import WorkerPaymentCreate


class CRUDWorkerPayment:
    def get(self, db: Session, payment_id: UUID) -> Optional[WorkerPayment]:
        return db.query(WorkerPayment).filter(WorkerPayment.id == payment_id).first()

    def get_multi(
        self, db: Session, skip: int = 0, limit: int = 100, worker_id: Optional[UUID] = None
    ) -> list[WorkerPayment]:
        query = db.query(WorkerPayment)
        if worker_id is not None:
            query = query.filter(WorkerPayment.worker_id == worker_id)
        return query.order_by(WorkerPayment.paid_at.desc()).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: WorkerPaymentCreate, paid_by: UUID) -> WorkerPayment:
        remaining = obj_in.amount - obj_in.advance_payment
        db_obj = WorkerPayment(
            worker_id=obj_in.worker_id,
            amount=obj_in.amount,
            advance_payment=obj_in.advance_payment,
            remaining_amount=remaining,
            paid_by=paid_by,
            notes=obj_in.notes,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


worker_payment_crud = CRUDWorkerPayment()
