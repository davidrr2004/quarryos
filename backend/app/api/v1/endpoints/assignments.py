from uuid import UUID
from decimal import Decimal
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
from app.schemas.job_batch import JobBatchCreate
from app.schemas.response import ApiResponse
from app.models.user import User
from app.models.job_batch import BatchStatus
from app.models.assignment import ReturnStatus

router = APIRouter()


@router.get("", response_model=ApiResponse)
def list_assignments(
    skip: int = 0,
    limit: int = 100,
    batch_id: Optional[UUID] = Query(None),
    worker_id: Optional[UUID] = Query(None),
    return_status: Optional[ReturnStatus] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assignments = assignment_crud.get_multi(
        db, skip=skip, limit=limit,
        batch_id=batch_id, worker_id=worker_id,
        return_status=return_status,
    )
    return ApiResponse(data=[AssignmentOut.model_validate(a) for a in assignments])


@router.get("/pending-worker-ids", response_model=ApiResponse)
def get_pending_worker_ids(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns a list of worker UUIDs that currently have a pending assignment."""
    ids = assignment_crud.get_pending_worker_ids(db)
    return ApiResponse(data=[str(i) for i in ids])


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
    # Resolve batch_id — use provided or auto-create
    if assignment_in.batch_id:
        batch = job_batch_crud.get(db, batch_id=assignment_in.batch_id)
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        if batch.status != BatchStatus.open:
            raise HTTPException(status_code=400, detail="Batch is not open for assignments")
        batch_id = batch.id
    else:
        # Auto-create a batch from route fields
        if not assignment_in.route_from or not assignment_in.route_to or not assignment_in.distance_km:
            raise HTTPException(
                status_code=400,
                detail="Either batch_id or route_from, route_to, and distance_km must be provided",
            )
        batch_in = JobBatchCreate(
            route_from=assignment_in.route_from,
            route_to=assignment_in.route_to,
            distance_km=assignment_in.distance_km,
        )
        batch = job_batch_crud.create(db, obj_in=batch_in, created_by=current_user.id)
        batch_id = batch.id

    # Validate worker
    worker = worker_crud.get(db, worker_id=assignment_in.worker_id)
    if not worker or not worker.is_active:
        raise HTTPException(status_code=404, detail="Worker not found or inactive")

    # Validate vehicle
    vehicle = vehicle_crud.get(db, vehicle_id=assignment_in.vehicle_id)
    if not vehicle or not vehicle.is_active:
        raise HTTPException(status_code=404, detail="Vehicle not found or inactive")

    # Check vehicle is not already in an active assignment
    active = assignment_crud.get_active_for_vehicle(db, vehicle_id=vehicle.id)
    if active:
        raise HTTPException(status_code=400, detail="Vehicle already has an active assignment")

    # Get wage rate for this vehicle type
    wage_rate = wage_rate_crud.get_current_rate(db, vehicle_type=vehicle.vehicle_type)
    if not wage_rate:
        raise HTTPException(status_code=400, detail="No wage rate configured for this vehicle type")

    assignment = assignment_crud.create(
        db,
        obj_in=assignment_in,
        wage_per_run=wage_rate.rate_per_run,
        batch_id=batch_id,
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


@router.delete("/{assignment_id}", response_model=ApiResponse)
def delete_assignment(
    assignment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    """Soft-delete an assignment by marking it as reassigned."""
    assignment = assignment_crud.get(db, assignment_id=assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    if assignment.return_status != ReturnStatus.pending:
        raise HTTPException(status_code=400, detail="Only pending assignments can be deleted")
    update_in = AssignmentUpdate(return_status=ReturnStatus.reassigned)
    assignment = assignment_crud.update(db, db_obj=assignment, obj_in=update_in)
    return ApiResponse(data={"id": str(assignment.id), "deleted": True})
