from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_dispatcher
from app.crud.crud_vehicle import vehicle_crud
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleOut
from app.schemas.response import ApiResponse
from app.models.user import User

router = APIRouter()


@router.get("", response_model=ApiResponse)
def list_vehicles(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    vehicles = vehicle_crud.get_multi(db, skip=skip, limit=limit, active_only=active_only)
    return ApiResponse(data=[VehicleOut.model_validate(v) for v in vehicles])


@router.get("/available", response_model=ApiResponse)
def list_available_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    vehicles = vehicle_crud.get_available(db)
    return ApiResponse(data=[VehicleOut.model_validate(v) for v in vehicles])


@router.get("/{vehicle_id}", response_model=ApiResponse)
def get_vehicle(
    vehicle_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    vehicle = vehicle_crud.get(db, vehicle_id=vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return ApiResponse(data=VehicleOut.model_validate(vehicle))


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    existing = vehicle_crud.get_by_plate(db, plate_number=vehicle_in.plate_number)
    if existing:
        raise HTTPException(status_code=400, detail="Plate number already exists")
    vehicle = vehicle_crud.create(db, obj_in=vehicle_in)
    return ApiResponse(data=VehicleOut.model_validate(vehicle))


@router.patch("/{vehicle_id}", response_model=ApiResponse)
def update_vehicle(
    vehicle_id: UUID,
    vehicle_in: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    vehicle = vehicle_crud.get(db, vehicle_id=vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle = vehicle_crud.update(db, db_obj=vehicle, obj_in=vehicle_in)
    return ApiResponse(data=VehicleOut.model_validate(vehicle))


@router.delete("/{vehicle_id}", response_model=ApiResponse)
def delete_vehicle(
    vehicle_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    vehicle = vehicle_crud.get(db, vehicle_id=vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle = vehicle_crud.soft_delete(db, db_obj=vehicle)
    return ApiResponse(data={"id": str(vehicle.id), "deleted": True})
