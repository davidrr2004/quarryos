from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_dispatcher
from app.crud.crud_worker import worker_crud
from app.schemas.worker import WorkerCreate, WorkerUpdate, WorkerOut
from app.schemas.response import ApiResponse
from app.models.user import User

router = APIRouter()


@router.get("", response_model=ApiResponse)
def list_workers(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workers = worker_crud.get_multi(db, skip=skip, limit=limit, active_only=active_only)
    return ApiResponse(data=[WorkerOut.model_validate(w) for w in workers])


@router.get("/{worker_id}", response_model=ApiResponse)
def get_worker(
    worker_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    worker = worker_crud.get(db, worker_id=worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return ApiResponse(data=WorkerOut.model_validate(worker))


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def create_worker(
    worker_in: WorkerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    existing = worker_crud.get_by_employee_id(db, employee_id=worker_in.employee_id)
    if existing:
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    worker = worker_crud.create(db, obj_in=worker_in)
    return ApiResponse(data=WorkerOut.model_validate(worker))


@router.patch("/{worker_id}", response_model=ApiResponse)
def update_worker(
    worker_id: UUID,
    worker_in: WorkerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    worker = worker_crud.get(db, worker_id=worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    worker = worker_crud.update(db, db_obj=worker, obj_in=worker_in)
    return ApiResponse(data=WorkerOut.model_validate(worker))


@router.delete("/{worker_id}", response_model=ApiResponse)
def delete_worker(
    worker_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    worker = worker_crud.get(db, worker_id=worker_id)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    worker = worker_crud.soft_delete(db, db_obj=worker)
    return ApiResponse(data={"id": str(worker.id), "deleted": True})
