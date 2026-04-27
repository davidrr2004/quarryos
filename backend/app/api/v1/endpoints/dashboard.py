from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db, get_current_user
from app.schemas.response import ApiResponse
from app.models.user import User
from app.models.worker import Worker
from app.models.vehicle import Vehicle, VehicleStatus
from app.models.assignment import Assignment, ReturnStatus
from app.models.vehicle_cost import VehicleCost
from app.models.worker_payment import WorkerPayment

router = APIRouter()


@router.get("/stats", response_model=ApiResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_workers = db.query(func.count(Worker.id)).filter(Worker.is_active == True).scalar()
    total_vehicles = db.query(func.count(Vehicle.id)).filter(Vehicle.is_active == True).scalar()
    working_vehicles = (
        db.query(func.count(Vehicle.id))
        .filter(Vehicle.is_active == True, Vehicle.status == VehicleStatus.working)
        .scalar()
    )
    pending_assignments = (
        db.query(func.count(Assignment.id))
        .filter(Assignment.return_status == ReturnStatus.pending)
        .scalar()
    )
    total_revenue = db.query(func.coalesce(func.sum(Assignment.total_earned), 0)).scalar()
    total_expenses = db.query(func.coalesce(func.sum(VehicleCost.amount), 0)).scalar()
    total_payments = db.query(func.coalesce(func.sum(WorkerPayment.amount), 0)).scalar()

    return ApiResponse(data={
        "total_workers": total_workers,
        "total_vehicles": total_vehicles,
        "working_vehicles": working_vehicles,
        "pending_assignments": pending_assignments,
        "total_revenue": float(total_revenue),
        "total_expenses": float(total_expenses),
        "total_payments": float(total_payments),
        "profit": float(total_revenue) - float(total_expenses) - float(total_payments),
    })
