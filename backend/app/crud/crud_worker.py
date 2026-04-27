from typing import Optional
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.worker import Worker
from app.schemas.worker import WorkerCreate, WorkerUpdate


class CRUDWorker:
    def get(self, db: Session, worker_id: UUID) -> Optional[Worker]:
        return db.query(Worker).filter(Worker.id == worker_id).first()

    def get_by_employee_id(self, db: Session, employee_id: str) -> Optional[Worker]:
        return db.query(Worker).filter(Worker.employee_id == employee_id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100, active_only: bool = True) -> list[Worker]:
        query = db.query(Worker)
        if active_only:
            query = query.filter(Worker.is_active == True)
        return query.order_by(Worker.name).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: WorkerCreate) -> Worker:
        db_obj = Worker(
            name=obj_in.name,
            employee_id=obj_in.employee_id,
            phone=obj_in.phone,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: Worker, obj_in: WorkerUpdate) -> Worker:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def soft_delete(self, db: Session, db_obj: Worker) -> Worker:
        db_obj.is_active = False
        db_obj.deleted_at = datetime.now(timezone.utc)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


worker_crud = CRUDWorker()
