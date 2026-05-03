from typing import Optional
from uuid import UUID
from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy.orm import Session, selectinload
from app.models.assignment import Assignment, ReturnStatus
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate


class CRUDAssignment:
    def get(self, db: Session, assignment_id: UUID) -> Optional[Assignment]:
        return (
            db.query(Assignment)
            .options(
                selectinload(Assignment.worker),
                selectinload(Assignment.vehicle),
                selectinload(Assignment.batch),
            )
            .filter(Assignment.id == assignment_id)
            .first()
        )

    def get_multi(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        batch_id: Optional[UUID] = None,
        worker_id: Optional[UUID] = None,
        return_status: Optional[ReturnStatus] = None,
    ) -> list[Assignment]:
        query = db.query(Assignment).options(
            selectinload(Assignment.worker),
            selectinload(Assignment.vehicle),
            selectinload(Assignment.batch),
        )
        if batch_id is not None:
            query = query.filter(Assignment.batch_id == batch_id)
        if worker_id is not None:
            query = query.filter(Assignment.worker_id == worker_id)
        if return_status is not None:
            query = query.filter(Assignment.return_status == return_status)
        return query.order_by(Assignment.assigned_at.desc()).offset(skip).limit(limit).all()

    def get_active_for_vehicle(self, db: Session, vehicle_id: UUID) -> Optional[Assignment]:
        return (
            db.query(Assignment)
            .filter(
                Assignment.vehicle_id == vehicle_id,
                Assignment.return_status == ReturnStatus.pending,
            )
            .first()
        )

    def get_pending_worker_ids(self, db: Session) -> set[UUID]:
        """Returns a set of worker_ids that currently have a pending assignment."""
        rows = (
            db.query(Assignment.worker_id)
            .filter(Assignment.return_status == ReturnStatus.pending)
            .all()
        )
        return {row[0] for row in rows}

    def create(self, db: Session, obj_in: AssignmentCreate, wage_per_run: Decimal, batch_id: UUID) -> Assignment:
        db_obj = Assignment(
            batch_id=batch_id,
            worker_id=obj_in.worker_id,
            vehicle_id=obj_in.vehicle_id,
            wage_per_run=wage_per_run,
            pickup_destination=obj_in.pickup_destination,
            dropping_destination=obj_in.dropping_destination,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        # Reload with relationships
        return self.get(db, assignment_id=db_obj.id)

    def update(self, db: Session, db_obj: Assignment, obj_in: AssignmentUpdate) -> Assignment:
        update_data = obj_in.model_dump(exclude_unset=True)
        if "runs_completed" in update_data:
            db_obj.runs_completed = update_data["runs_completed"]
            db_obj.total_earned = Decimal(str(db_obj.runs_completed)) * db_obj.wage_per_run
        if "return_status" in update_data:
            db_obj.return_status = update_data["return_status"]
            if update_data["return_status"] == ReturnStatus.returned:
                db_obj.returned_at = datetime.now(timezone.utc)
        if "issue_reason" in update_data:
            db_obj.issue_reason = update_data["issue_reason"]
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return self.get(db, assignment_id=db_obj.id)


assignment_crud = CRUDAssignment()
