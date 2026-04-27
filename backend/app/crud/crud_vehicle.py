from typing import Optional
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.vehicle import Vehicle, VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


class CRUDVehicle:
    def get(self, db: Session, vehicle_id: UUID) -> Optional[Vehicle]:
        return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    def get_by_plate(self, db: Session, plate_number: str) -> Optional[Vehicle]:
        return db.query(Vehicle).filter(Vehicle.plate_number == plate_number).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100, active_only: bool = True) -> list[Vehicle]:
        query = db.query(Vehicle)
        if active_only:
            query = query.filter(Vehicle.is_active == True)
        return query.order_by(Vehicle.plate_number).offset(skip).limit(limit).all()

    def get_available(self, db: Session) -> list[Vehicle]:
        return (
            db.query(Vehicle)
            .filter(Vehicle.is_active == True, Vehicle.status == VehicleStatus.working)
            .order_by(Vehicle.plate_number)
            .all()
        )

    def create(self, db: Session, obj_in: VehicleCreate) -> Vehicle:
        db_obj = Vehicle(
            plate_number=obj_in.plate_number,
            vehicle_type=obj_in.vehicle_type,
            status=obj_in.status,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: Vehicle, obj_in: VehicleUpdate) -> Vehicle:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def soft_delete(self, db: Session, db_obj: Vehicle) -> Vehicle:
        db_obj.is_active = False
        db_obj.deleted_at = datetime.now(timezone.utc)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


vehicle_crud = CRUDVehicle()
