from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.vehicle_cost import VehicleCost
from app.schemas.vehicle_cost import VehicleCostCreate


class CRUDVehicleCost:
    def get(self, db: Session, cost_id: UUID) -> Optional[VehicleCost]:
        return db.query(VehicleCost).filter(VehicleCost.id == cost_id).first()

    def get_multi(
        self, db: Session, skip: int = 0, limit: int = 100, vehicle_id: Optional[UUID] = None
    ) -> list[VehicleCost]:
        query = db.query(VehicleCost)
        if vehicle_id is not None:
            query = query.filter(VehicleCost.vehicle_id == vehicle_id)
        return query.order_by(VehicleCost.logged_at.desc()).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: VehicleCostCreate, logged_by: UUID) -> VehicleCost:
        db_obj = VehicleCost(
            vehicle_id=obj_in.vehicle_id,
            cost_type=obj_in.cost_type,
            amount=obj_in.amount,
            note=obj_in.note,
            logged_by=logged_by,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


vehicle_cost_crud = CRUDVehicleCost()
