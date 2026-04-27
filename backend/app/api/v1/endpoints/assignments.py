from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_dispatcher
from app.crud.crud_assignment import assignment_crud
from app.crud.crud_vehicle import vehicle_crud
from app.crud.crud_worker import worker_crud
from app.crud.crud_job_batch import job_batch_crud
from app.crud.crud_wage_rate import wage_rate_crud
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate, AssignmentOut
from app.schemas.response import ApiResponse
from app.models.user import User
from app.models.job_batch import BatchStatus

router = APIRouter()


@router.get("", response_model=ApiResponse)
def list_assignments(
    skip: int = 0,
    limit: int = 100,
    batch_id: Optional[UUID] = Query(None),
    worker_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assignments = assignment_crud.get_multi(
        db, skip=skip, limit=limit, batch_id=batch_id, worker_id=worker_id
    )
    return ApiResponse(data=[AssignmentOut.model_validate(a) for a in assignments])


@router.get("/{assignment_id}", response_model=ApiResponse)
def get_assignment(
    assignment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assignment = assignment_crud.get(db, assignment_id=assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return ApiResponse(data=AssignmentOut.model_validate(assignment))


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(
    assignment_in: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    batch = job_batch_crud.get(db, batch_id=assignment_in.batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    if batch.status != BatchStatus.open:
        raise HTTPException(status_code=400, detail="Batch is not open for assignments")

    worker = worker_crud.get(db, worker_id=assignment_in.worker_id)
    if not worker or not worker.is_active:
        raise HTTPException(status_code=404, detail="Worker not found or inactive")

    vehicle = vehicle_crud.get(db, vehicle_id=assignment_in.vehicle_id)
    if not vehicle or not vehicle.is_active:
        raise HTTPException(status_code=404, detail="Vehicle not found or inactive")

    active = assignment_crud.get_active_for_vehicle(db, vehicle_id=vehicle.id)
    if active:
        raise HTTPException(status_code=400, detail="Vehicle already has an active assignment")

    wage_rate = wage_rate_crud.get_current_rate(db, vehicle_type=vehicle.vehicle_type)
    if not wage_rate:
        raise HTTPException(status_code=400, detail="No wage rate configured for this vehicle type")

    assignment = assignment_crud.create(
        db, obj_in=assignment_in, wage_per_run=wage_rate.rate_per_run
    )
    return ApiResponse(data=AssignmentOut.model_validate(assignment))


@router.patch("/{assignment_id}", response_model=ApiResponse)
def update_assignment(
    assignment_id: UUID,
    assignment_in: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    assignment = assignment_crud.get(db, assignment_id=assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    assignment = assignment_crud.update(db, db_obj=assignment, obj_in=assignment_in)
    return ApiResponse(data=AssignmentOut.model_validate(assignment))
