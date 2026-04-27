from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_dispatcher
from app.crud.crud_vehicle_cost import vehicle_cost_crud
from app.crud.crud_vehicle import vehicle_crud
from app.schemas.vehicle_cost import VehicleCostCreate, VehicleCostOut
from app.schemas.response import ApiResponse
from app.models.user import User

router = APIRouter()


@router.get("", response_model=ApiResponse)
def list_costs(
    skip: int = 0,
    limit: int = 100,
    vehicle_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    costs = vehicle_cost_crud.get_multi(db, skip=skip, limit=limit, vehicle_id=vehicle_id)
    return ApiResponse(data=[VehicleCostOut.model_validate(c) for c in costs])


@router.post("", response_model=ApiResponse, status_code=201)
def create_cost(
    cost_in: VehicleCostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    vehicle = vehicle_crud.get(db, vehicle_id=cost_in.vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    cost = vehicle_cost_crud.create(db, obj_in=cost_in, logged_by=current_user.id)
    return ApiResponse(data=VehicleCostOut.model_validate(cost))
