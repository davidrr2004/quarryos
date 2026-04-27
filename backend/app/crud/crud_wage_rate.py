from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.wage_rate import WageRate
from app.models.vehicle import VehicleType
from app.schemas.wage_rate import WageRateCreate


class CRUDWageRate:
    def get(self, db: Session, rate_id: UUID) -> Optional[WageRate]:
        return db.query(WageRate).filter(WageRate.id == rate_id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> list[WageRate]:
        return (
            db.query(WageRate)
            .order_by(WageRate.effective_from.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_current_rate(self, db: Session, vehicle_type: VehicleType) -> Optional[WageRate]:
        return (
            db.query(WageRate)
            .filter(WageRate.vehicle_type == vehicle_type)
            .order_by(WageRate.effective_from.desc())
            .first()
        )

    def create(self, db: Session, obj_in: WageRateCreate) -> WageRate:
        db_obj = WageRate(
            vehicle_type=obj_in.vehicle_type,
            rate_per_run=obj_in.rate_per_run,
            effective_from=obj_in.effective_from,
            notes=obj_in.notes,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


wage_rate_crud = CRUDWageRate()
