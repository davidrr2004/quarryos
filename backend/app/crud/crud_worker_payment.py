from typing import Optional
from uuid import UUID
from decimal import Decimal
from sqlalchemy.orm import Session, selectinload
from app.models.worker_payment import WorkerPayment, PaymentStatus
from app.schemas.worker_payment import WorkerPaymentCreate, WorkerPaymentUpdate


class CRUDWorkerPayment:
    def get(self, db: Session, payment_id: UUID) -> Optional[WorkerPayment]:
        return (
            db.query(WorkerPayment)
            .options(selectinload(WorkerPayment.worker))
            .filter(WorkerPayment.id == payment_id)
            .first()
        )

    def get_multi(
        self, db: Session, skip: int = 0, limit: int = 100, worker_id: Optional[UUID] = None
    ) -> list[WorkerPayment]:
        query = db.query(WorkerPayment).options(selectinload(WorkerPayment.worker))
        if worker_id is not None:
            query = query.filter(WorkerPayment.worker_id == worker_id)
        return query.order_by(WorkerPayment.paid_at.desc()).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: WorkerPaymentCreate, paid_by: UUID) -> WorkerPayment:
        remaining = obj_in.amount - obj_in.advance_payment

        # Auto-compute status
        if obj_in.advance_payment > 0 and remaining > 0:
            status = PaymentStatus.advance
        elif remaining <= 0:
            status = PaymentStatus.paid
        else:
            status = PaymentStatus.pending

        db_obj = WorkerPayment(
            worker_id=obj_in.worker_id,
            amount=obj_in.amount,
            advance_payment=obj_in.advance_payment,
            remaining_amount=remaining,
            status=status,
            paid_by=paid_by,
            notes=obj_in.notes,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return self.get(db, payment_id=db_obj.id)

    def update(self, db: Session, db_obj: WorkerPayment, obj_in: WorkerPaymentUpdate) -> WorkerPayment:
        update_data = obj_in.model_dump(exclude_unset=True)

        if "advance_payment" in update_data:
            db_obj.advance_payment = update_data["advance_payment"]
            db_obj.remaining_amount = db_obj.amount - db_obj.advance_payment
            # Recompute status if not explicitly provided
            if "status" not in update_data:
                if db_obj.advance_payment > 0 and db_obj.remaining_amount > 0:
                    db_obj.status = PaymentStatus.advance
                elif db_obj.remaining_amount <= 0:
                    db_obj.status = PaymentStatus.paid

        if "status" in update_data:
            db_obj.status = update_data["status"]

        if "notes" in update_data:
            db_obj.notes = update_data["notes"]

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return self.get(db, payment_id=db_obj.id)


worker_payment_crud = CRUDWorkerPayment()
