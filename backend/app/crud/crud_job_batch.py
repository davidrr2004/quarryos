from typing import Optional
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.job_batch import JobBatch, BatchStatus
from app.schemas.job_batch import JobBatchCreate, JobBatchUpdate


class CRUDJobBatch:
    def get(self, db: Session, batch_id: UUID) -> Optional[JobBatch]:
        return db.query(JobBatch).filter(JobBatch.id == batch_id).first()

    def get_multi(
        self, db: Session, skip: int = 0, limit: int = 100, status: Optional[BatchStatus] = None
    ) -> list[JobBatch]:
        query = db.query(JobBatch)
        if status is not None:
            query = query.filter(JobBatch.status == status)
        return query.order_by(JobBatch.created_at.desc()).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: JobBatchCreate, created_by: UUID) -> JobBatch:
        db_obj = JobBatch(
            created_by=created_by,
            route_from=obj_in.route_from,
            route_to=obj_in.route_to,
            distance_km=obj_in.distance_km,
            est_hours=obj_in.est_hours,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: JobBatch, obj_in: JobBatchUpdate) -> JobBatch:
        update_data = obj_in.model_dump(exclude_unset=True)
        if "status" in update_data and update_data["status"] == BatchStatus.locked:
            db_obj.locked_at = datetime.now(timezone.utc)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


job_batch_crud = CRUDJobBatch()
