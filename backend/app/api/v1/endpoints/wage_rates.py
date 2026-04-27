from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_admin
from app.crud.crud_wage_rate import wage_rate_crud
from app.schemas.wage_rate import WageRateCreate, WageRateOut
from app.schemas.response import ApiResponse
from app.models.user import User
from app.models.vehicle import VehicleType

router = APIRouter()


@router.get("", response_model=ApiResponse)
def list_wage_rates(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rates = wage_rate_crud.get_multi(db, skip=skip, limit=limit)
    return ApiResponse(data=[WageRateOut.model_validate(r) for r in rates])


@router.get("/current/{vehicle_type}", response_model=ApiResponse)
def get_current_rate(
    vehicle_type: VehicleType,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rate = wage_rate_crud.get_current_rate(db, vehicle_type=vehicle_type)
    if not rate:
        raise HTTPException(status_code=404, detail="No wage rate found for this vehicle type")
    return ApiResponse(data=WageRateOut.model_validate(rate))


@router.post("", response_model=ApiResponse, status_code=201)
def create_wage_rate(
    rate_in: WageRateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    rate = wage_rate_crud.create(db, obj_in=rate_in)
    return ApiResponse(data=WageRateOut.model_validate(rate))
